"use client";

import { useEffect, useState } from "react";
import { RisksAndWarnings } from "@/components/dashboard/risks-and-warnings";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowRight, Filter, TrendingUp, AlertCircle, Lightbulb } from "lucide-react";
import Link from "next/link";
import type { FilterConfig } from "@/lib/types";
import { verticalsData, type VerticalKey } from "@/lib/verticals-data";

export default function CommandCenterPage() {
  const [savedFilters, setSavedFilters] = useState<FilterConfig | null>(null);

  useEffect(() => {
    // Загружаем сохраненные фильтры из localStorage
    const filters = localStorage.getItem('analyticsFilters');
    if (filters) {
      setSavedFilters(JSON.parse(filters));
    }
  }, []);

  const getFilterSummary = (filters: FilterConfig): string => {
    const parts = [];
    
    if (filters.vertical) {
      parts.push(`Вертикаль: ${verticalsData[filters.vertical as VerticalKey]?.label}`);
    }
    if (filters.games && filters.games.length > 0) {
      parts.push(`${filters.games.length} игр`);
    }
    if (filters.segments && filters.segments.length > 0) {
      parts.push(`${filters.segments.length} сегментов`);
    }
    if (filters.dateRange?.from && filters.dateRange?.to) {
      parts.push('Период задан');
    }
    
    return parts.length > 0 ? parts.join(', ') : 'Фильтры не заданы';
  };

  return (
    <div className="flex flex-col gap-6 p-4 md:p-6 lg:p-8">
      <div className="flex flex-col gap-4">
        <h1 className="text-2xl font-bold tracking-tight">Командный центр</h1>
        <p className="text-muted-foreground">
          AI-рекомендации и инсайты на основе ваших настроек аналитики
        </p>
      </div>

      {/* Блок с сохраненными фильтрами */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Filter className="h-5 w-5 text-muted-foreground" />
              <CardTitle>Активные фильтры аналитики</CardTitle>
            </div>
            <Button asChild variant="outline" size="sm">
              <Link href="/analytics">
                Изменить в аналитике
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {savedFilters ? (
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">
                {getFilterSummary(savedFilters)}
              </p>
              <div className="flex flex-wrap gap-2">
                {savedFilters.vertical && (
                  <Badge variant="secondary">
                    {verticalsData[savedFilters.vertical as VerticalKey]?.label}
                  </Badge>
                )}
                {savedFilters.games && savedFilters.games.map((game) => (
                  <Badge key={game} variant="outline">
                    {savedFilters.vertical && 
                      verticalsData[savedFilters.vertical as VerticalKey]?.games.find(g => g.value === game)?.label || game
                    }
                  </Badge>
                ))}
                {savedFilters.segments && savedFilters.segments.map((segment) => (
                  <Badge key={segment} variant="secondary">
                    {segment}
                  </Badge>
                ))}
              </div>
            </div>
          ) : (
            <div className="text-center py-4">
              <p className="text-muted-foreground mb-2">
                Настройте фильтры в разделе аналитики для получения персонализированных рекомендаций
              </p>
              <Button asChild variant="default" size="sm">
                <Link href="/analytics">
                  Перейти к аналитике
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* AI Инсайты */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-success" />
              <CardTitle>Трендовые метрики</CardTitle>
            </div>
            <CardDescription>
              AI-анализ ключевых показателей
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm">Retention D7</span>
                <div className="flex items-center gap-2">
                  <span className="font-semibold">42.3%</span>
                  <Badge variant="outline" className="text-success">
                    +5.2%
                  </Badge>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">ARPU</span>
                <div className="flex items-center gap-2">
                  <span className="font-semibold">€89.50</span>
                  <Badge variant="outline" className="text-destructive">
                    -2.1%
                  </Badge>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Конверсия в депозит</span>
                <div className="flex items-center gap-2">
                  <span className="font-semibold">18.7%</span>
                  <Badge variant="outline" className="text-success">
                    +1.3%
                  </Badge>
                </div>
              </div>
              <p className="text-xs text-muted-foreground pt-2">
                {savedFilters?.vertical 
                  ? `Анализ для вертикали "${verticalsData[savedFilters.vertical as VerticalKey]?.label}"`
                  : "Общий анализ по всем вертикалям"
                }
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-warning" />
              <CardTitle>Требуют внимания</CardTitle>
            </div>
            <CardDescription>
              Сегменты с отрицательной динамикой
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="p-3 bg-warning/10 rounded-lg">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-medium text-sm">VIP игроки</span>
                  <Badge variant="outline" className="text-warning">
                    Риск
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground">
                  Снижение активности на 23% за последние 7 дней
                </p>
              </div>
              <div className="p-3 bg-destructive/10 rounded-lg">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-medium text-sm">Новые регистрации</span>
                  <Badge variant="outline" className="text-destructive">
                    Критично
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground">
                  Падение конверсии FTD на 15%
                </p>
              </div>
              <Button variant="outline" size="sm" className="w-full" asChild>
                <Link href="/segments">
                  Перейти к сегментам
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Lightbulb className="h-5 w-5 text-primary" />
              <CardTitle>AI Рекомендации</CardTitle>
            </div>
            <CardDescription>
              Персонализированные советы
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="p-3 bg-primary/10 rounded-lg">
                <p className="text-sm font-medium mb-1">
                  Запустить кампанию реактивации
                </p>
                <p className="text-xs text-muted-foreground">
                  Оптимальное время для возврата спящих игроков
                </p>
              </div>
              <div className="p-3 bg-primary/10 rounded-lg">
                <p className="text-sm font-medium mb-1">
                  Увеличить бонусы для новых игроков
                </p>
                <p className="text-xs text-muted-foreground">
                  Прогнозируемый рост FTD на 20%
                </p>
              </div>
              <Button variant="default" size="sm" className="w-full" asChild>
                <Link href="/builder">
                  Создать сценарий
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* AI предупреждения и риски */}
      <RisksAndWarnings />
    </div>
  );
}