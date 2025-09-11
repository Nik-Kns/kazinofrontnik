"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Gift, 
  MessageSquare, 
  TrendingUp,
  TrendingDown,
  User,
  Calendar,
  Gamepad2,
  DollarSign,
  AlertCircle
} from "lucide-react";

interface PlayerOverviewProps {
  player: any; // TODO: Заменить на правильный тип из PlayerFullProfile
}

export function PlayerOverview({ player }: PlayerOverviewProps) {
  return (
    <div className="space-y-6">
      {/* Ключевые KPI */}
      <Card>
        <CardHeader>
          <CardTitle>Ключевые показатели</CardTitle>
          <CardDescription>Основные метрики игрока</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">LTV</span>
                <TrendingUp className="h-4 w-4 text-green-500" />
              </div>
              <div className="text-2xl font-bold">€{player.behavior.ltv.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">
                Прогноз: €{player.behavior.predictedCLV.toLocaleString()}
              </p>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Баланс</span>
                <DollarSign className="h-4 w-4 text-blue-500" />
              </div>
              <div className="text-2xl font-bold">€{player.financial.currentBalance.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">
                NGR: €{player.behavior.ngr.toLocaleString()}
              </p>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Риск оттока</span>
                <AlertCircle className={`h-4 w-4 ${player.behavior.churnRisk < 30 ? 'text-green-500' : player.behavior.churnRisk < 60 ? 'text-yellow-500' : 'text-red-500'}`} />
              </div>
              <div className={`text-2xl font-bold ${player.behavior.churnRisk < 30 ? 'text-green-600' : player.behavior.churnRisk < 60 ? 'text-yellow-600' : 'text-red-600'}`}>
                {player.behavior.churnRisk}%
              </div>
              <Progress value={player.behavior.churnRisk} className="h-1" />
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">NGR</span>
                <TrendingDown className="h-4 w-4 text-purple-500" />
              </div>
              <div className="text-2xl font-bold">€{player.behavior.ngr.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">
                ROI: {player.behavior.acquisitionROI}%
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* AI Инсайт */}
      <Card className="border-primary/20 bg-gradient-to-r from-primary/5 to-purple-500/5">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <div className="p-2 bg-primary/10 rounded-lg">
              <TrendingUp className="h-5 w-5 text-primary" />
            </div>
            AI Рекомендация
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-semibold">Вероятность депозита в ближайшие 7 дней</p>
                <p className="text-sm text-muted-foreground mt-1">
                  {player.ai.recommendedReactivationOffer}
                </p>
              </div>
              <div className="text-3xl font-bold text-green-600">
                {player.ai.reDepositProbability}%
              </div>
            </div>
            <div className="flex gap-2">
              {player.ai.recommendedBonuses.slice(0, 3).map((bonus: string, index: number) => (
                <Badge key={index} variant="secondary">{bonus}</Badge>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Последняя активность */}
      <Card>
        <CardHeader>
          <CardTitle>Последняя активность</CardTitle>
          <CardDescription>Недавние действия игрока</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <User className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Последний вход</p>
                  <p className="text-xs text-muted-foreground">
                    {player.actionLog.loginHistory[0]?.date.toLocaleString('ru-RU')}
                  </p>
                </div>
              </div>
              <Badge variant="outline">{player.actionLog.loginHistory[0]?.device}</Badge>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Gamepad2 className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Последняя игра</p>
                  <p className="text-xs text-muted-foreground">
                    {player.gaming.lastPlayTime.toLocaleString('ru-RU')}
                  </p>
                </div>
              </div>
              <Badge variant="outline">{player.gaming.favoriteGames?.[0]}</Badge>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <DollarSign className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Последний депозит</p>
                  <p className="text-xs text-muted-foreground">
                    {player.financial.lastDepositDate.toLocaleString('ru-RU')}
                  </p>
                </div>
              </div>
              <Badge variant="outline">€{player.financial.depositHistory[0]?.amount}</Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Быстрые действия */}
      <Card>
        <CardHeader>
          <CardTitle>Быстрые действия</CardTitle>
          <CardDescription>Взаимодействие с игроком</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 md:grid-cols-2">
            <Button className="w-full" size="lg">
              <Gift className="mr-2 h-5 w-5" />
              Отправить бонус
            </Button>
            <Button className="w-full" size="lg" variant="outline">
              <MessageSquare className="mr-2 h-5 w-5" />
              Написать в чат
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}