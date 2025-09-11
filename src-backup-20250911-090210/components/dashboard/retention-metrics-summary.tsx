"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowRight, TrendingUp, TrendingDown, AlertTriangle, Target } from "lucide-react";
import Link from "next/link";
import { retentionMetrics } from "@/lib/retention-metrics-data";

// Получаем топ-6 критически важных метрик для главной
const getCriticalMetrics = () => {
  const critical = [
    retentionMetrics.find(m => m.name === 'Retention Rate'),
    retentionMetrics.find(m => m.name === 'Churn Rate'),
    retentionMetrics.find(m => m.name === 'Lifetime Value (LTV)'),
    retentionMetrics.find(m => m.name === 'Average Revenue Per User (ARPU)'),
    retentionMetrics.find(m => m.name === 'Player Reactivation Rate'),
    retentionMetrics.find(m => m.name === 'Conversion Rate')
  ].filter(Boolean);
  
  return critical;
};

export function RetentionMetricsSummary() {
  const criticalMetrics = getCriticalMetrics();
  
  // Подсчитываем количество метрик с проблемами
  const problemMetrics = retentionMetrics.filter(metric => {
    if (metric.name === 'Retention Rate' && Number(metric.value) < 65) return true;
    if (metric.name === 'Churn Rate' && Number(metric.value) > 4) return true;
    if (metric.trend === 'down' && metric.category === 'retention') return true;
    return false;
  });

  const positiveMetrics = retentionMetrics.filter(metric => 
    metric.trend === 'up' && ['retention', 'revenue', 'conversion'].includes(metric.category)
  );

  return (
    <div className="space-y-6">
      {/* Заголовок с общим статусом */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Target className="h-5 w-5 text-primary" />
              <CardTitle>Ключевые метрики ретеншена</CardTitle>
            </div>
            <div className="flex items-center gap-2">
              {problemMetrics.length > 0 && (
                <Badge variant="destructive" className="flex items-center gap-1">
                  <AlertTriangle className="h-3 w-3" />
                  {problemMetrics.length} требуют внимания
                </Badge>
              )}
              <Button asChild variant="outline" size="sm">
                <Link href="/analytics?tab=detailed">
                  Подробная аналитика
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
          <CardDescription>
            Мониторинг 25 ключевых показателей эффективности удержания игроков
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {criticalMetrics.map((metric) => {
              if (!metric) return null;
              
              const isAlert = (metric.name === 'Retention Rate' && Number(metric.value) < 65) ||
                             (metric.name === 'Churn Rate' && Number(metric.value) > 4);
              
              const trendIcon = metric.trend === 'up' ? <TrendingUp className="h-4 w-4 text-green-600" /> :
                               metric.trend === 'down' ? <TrendingDown className="h-4 w-4 text-red-600" /> :
                               null;

              return (
                <div 
                  key={metric.id} 
                  className={`p-4 rounded-lg border ${isAlert ? 'border-red-200 bg-red-50' : 'border-gray-200 bg-gray-50'}`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium text-sm">{metric.name}</h4>
                    {trendIcon}
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold">
                      {metric.value}{metric.unit}
                    </span>
                    {metric.trendValue && (
                      <Badge 
                        variant="outline"
                        className={metric.trend === 'up' ? 'text-green-600' : 
                                  metric.trend === 'down' ? 'text-red-600' : 
                                  'text-gray-600'}
                      >
                        {metric.trendValue}
                      </Badge>
                    )}
                  </div>
                  {metric.targetValue && (
                    <div className="mt-2 text-xs text-muted-foreground">
                      Цель: {metric.targetValue}{metric.unit}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
          
          {/* Краткая сводка */}
          <div className="mt-6 p-4 bg-muted rounded-lg">
            <div className="grid gap-4 md:grid-cols-3">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">{positiveMetrics.length}</div>
                <div className="text-sm text-muted-foreground">Растущие метрики</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">{retentionMetrics.length}</div>
                <div className="text-sm text-muted-foreground">Всего метрик</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-red-600">{problemMetrics.length}</div>
                <div className="text-sm text-muted-foreground">Требуют внимания</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Критические предупреждения */}
      {problemMetrics.length > 0 && (
        <Card className="border-red-200">
          <CardHeader>
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-red-600" />
              <CardTitle className="text-red-600">Критические показатели</CardTitle>
            </div>
            <CardDescription>
              Метрики, требующие немедленного внимания
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {problemMetrics.slice(0, 3).map((metric) => (
                <div key={metric.id} className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                  <div>
                    <div className="font-medium text-sm">{metric.name}</div>
                    <div className="text-xs text-muted-foreground">{metric.description}</div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-red-600">
                      {metric.value}{metric.unit}
                    </div>
                    {metric.trendValue && (
                      <div className="text-xs text-red-600">{metric.trendValue}</div>
                    )}
                  </div>
                </div>
              ))}
              
              {problemMetrics.length > 3 && (
                <div className="text-center pt-2">
                  <Button asChild variant="outline" size="sm">
                    <Link href="/analytics?tab=detailed">
                      Посмотреть все {problemMetrics.length} проблемных метрик
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}