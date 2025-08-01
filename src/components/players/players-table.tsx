"use client";

import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { playersData } from "@/lib/mock-data";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Button } from "../ui/button";
import { 
  ArrowUpRight, 
  Euro, 
  Clock, 
  TrendingUp, 
  TrendingDown, 
  AlertTriangle,
  Star,
  Activity,
  Calendar
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { FilterConfig } from "@/lib/types";
import { Progress } from "@/components/ui/progress";

const statusColors = {
    'Активен': 'bg-success/20 text-success-foreground',
    'Спящий': 'bg-warning/20 text-warning-foreground',
    'Отток': 'bg-destructive/20 text-destructive-foreground',
};

const riskColors = {
    'Низкий': 'text-success',
    'Средний': 'text-warning',
    'Высокий': 'text-destructive',
};

interface PlayersTableProps {
    filters?: FilterConfig;
}

export function PlayersTable({ filters }: PlayersTableProps) {
    // Здесь можно добавить логику фильтрации данных на основе filters
    // Пока используем все данные
    const filteredPlayers = playersData;
    
    // Функция для определения цвета прогресс-бара риска
    const getRiskProgressColor = (risk: string) => {
        switch (risk) {
            case 'Низкий': return 'bg-green-500';
            case 'Средний': return 'bg-yellow-500';
            case 'Высокий': return 'bg-red-500';
            default: return 'bg-gray-500';
        }
    };
    
    // Функция для получения значения риска в процентах
    const getRiskValue = (risk: string) => {
        switch (risk) {
            case 'Низкий': return 20;
            case 'Средний': return 60;
            case 'Высокий': return 90;
            default: return 0;
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-xl font-semibold">Найдено игроков: {filteredPlayers.length}</h2>
                    <p className="text-sm text-muted-foreground">Кликните на карточку для просмотра профиля</p>
                </div>
                <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm">
                        <Activity className="mr-2 h-4 w-4" />
                        Экспорт
                    </Button>
                </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {filteredPlayers.map((player) => {
                    const riskValue = getRiskValue(player.churnRisk);
                    const isVip = player.ltv > 5000; // Простая логика VIP для демо
                    
                    return (
                        <Link 
                            key={player.id} 
                            href={`/players/${player.id}`}
                            className="block group"
                        >
                            <Card className="cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-xl border-2 hover:border-primary/50 h-full">
                                <CardContent className="p-6">
                                    {/* Заголовок карточки */}
                                    <div className="flex items-start justify-between mb-4">
                                        <div className="flex items-center gap-3">
                                            <Avatar className="h-12 w-12 ring-2 ring-offset-2 ring-offset-background ring-border group-hover:ring-primary transition-all">
                                                <AvatarImage 
                                                    src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${player.name}`} 
                                                    alt={player.name} 
                                                />
                                                <AvatarFallback>{player.name.charAt(0)}</AvatarFallback>
                                            </Avatar>
                                            <div className="flex-1 min-w-0">
                                                <p className="font-semibold truncate">{player.name}</p>
                                                <p className="text-xs text-muted-foreground">ID: usr_{player.id.padStart(8, '0')}</p>
                                            </div>
                                        </div>
                                        {isVip && (
                                            <Badge variant="default" className="bg-gradient-to-r from-yellow-500 to-yellow-600">
                                                <Star className="mr-1 h-3 w-3" />
                                                VIP
                                            </Badge>
                                        )}
                                    </div>

                                    {/* Основные метрики */}
                                    <div className="space-y-4">
                                        {/* LTV */}
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                                <Euro className="h-4 w-4" />
                                                <span>LTV</span>
                                            </div>
                                            <span className="font-bold text-lg">€{player.ltv.toLocaleString()}</span>
                                        </div>

                                        {/* Последняя активность */}
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                                <Clock className="h-4 w-4" />
                                                <span>Активность</span>
                                            </div>
                                            <span className="text-sm">{player.lastSeen}</span>
                                        </div>

                                        {/* Риск оттока с прогресс-баром */}
                                        <div className="space-y-2">
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                                    <AlertTriangle className="h-4 w-4" />
                                                    <span>Риск оттока</span>
                                                </div>
                                                <span className={cn("text-sm font-medium", riskColors[player.churnRisk])}>
                                                    {player.churnRisk}
                                                </span>
                                            </div>
                                            <Progress 
                                                value={riskValue} 
                                                className="h-2"
                                                indicatorClassName={getRiskProgressColor(player.churnRisk)}
                                            />
                                        </div>

                                        {/* Статус */}
                                        <div className="flex items-center justify-between pt-2 border-t">
                                            <span className="text-sm text-muted-foreground">Статус</span>
                                            <Badge 
                                                variant="outline" 
                                                className={cn("transition-all group-hover:scale-110", statusColors[player.status])}
                                            >
                                                {player.status}
                                            </Badge>
                                        </div>
                                    </div>

                                    {/* Индикатор перехода */}
                                    <div className="mt-4 pt-4 border-t flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                        <span className="text-sm text-primary flex items-center gap-1">
                                            Открыть профиль
                                            <ArrowUpRight className="h-4 w-4" />
                                        </span>
                                    </div>
                                </CardContent>
                            </Card>
                        </Link>
                    );
                })}
            </div>

            {/* Пагинация (заготовка) */}
            <div className="flex items-center justify-center pt-4">
                <p className="text-sm text-muted-foreground">Показаны все {filteredPlayers.length} игроков</p>
            </div>
        </div>
    );
}
