"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { AlertCircle, TrendingUp, TrendingDown, Minus } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import type { RetentionMetric, SegmentMetrics } from "@/lib/types";
import { retentionMetrics, segmentMetricsData, monitoringSchedule, alertThresholds } from "@/lib/retention-metrics-data";

// Компонент для отображения одной метрики
function MetricCard({ metric }: { metric: RetentionMetric }) {
  const isAlert = metric.name === 'Retention Rate' && Number(metric.value) < 65;
  const trendIcon = metric.trend === 'up' ? <TrendingUp className="h-4 w-4" /> :
                    metric.trend === 'down' ? <TrendingDown className="h-4 w-4" /> :
                    <Minus className="h-4 w-4" />;
  
  const trendColor = metric.trend === 'up' ? 'text-green-600' :
                     metric.trend === 'down' ? 'text-red-600' :
                     'text-gray-600';

  return (
    <Card className={isAlert ? 'border-red-500' : ''}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-medium">{metric.name}</CardTitle>
          <Badge variant="outline" className="text-xs">
            {metric.frequency}
          </Badge>
        </div>
        <CardDescription className="text-xs">
          {metric.description}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between">
          <div className="text-2xl font-bold">
            {metric.value}{metric.unit}
          </div>
          {metric.trend && (
            <div className={`flex items-center gap-1 ${trendColor}`}>
              {trendIcon}
              <span className="text-sm">{metric.trendValue}</span>
            </div>
          )}
        </div>
        {metric.targetValue && (
          <div className="mt-2">
            <div className="flex justify-between text-xs text-muted-foreground mb-1">
              <span>Цель</span>
              <span>{metric.targetValue}{metric.unit}</span>
            </div>
            <Progress 
              value={Number(String(metric.value).replace(/[^0-9.-]/g, '')) / Number(String(metric.targetValue).replace(/[^0-9.-]/g, '')) * 100} 
              className="h-2"
            />
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// Компонент для отображения метрик по сегментам
function SegmentMetricsCard({ segment }: { segment: SegmentMetrics }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{segment.segmentName}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {Object.entries(segment.metrics).map(([key, value]) => (
            <div key={key} className="flex justify-between">
              <span className="text-sm text-muted-foreground">
                {key === 'retentionRate' && 'Retention Rate'}
                {key === 'averageDepositAmount' && 'Средний депозит'}
                {key === 'depositFrequency' && 'Частота депозитов'}
                {key === 'ltv' && 'LTV'}
                {key === 'conversionRate' && 'Конверсия'}
                {key === 'bonusActivationRate' && 'Активация бонусов'}
                {key === 'activePlayersRatio' && 'Активные игроки'}
                {key === 'referralRate' && 'Реферальная ставка'}
              </span>
              <span className="text-sm font-medium">{value}</span>
            </div>
          ))}
        </div>
        <div className="mt-4 pt-4 border-t">
          <h4 className="text-sm font-medium mb-2">Рекомендации:</h4>
          <ul className="text-xs text-muted-foreground space-y-1">
            {segment.recommendations.map((rec, idx) => (
              <li key={idx}>• {rec}</li>
            ))}
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}

export function RetentionMetricsDashboard() {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedFrequency, setSelectedFrequency] = useState<string>('all');
  
  // Фильтрация метрик
  const filteredMetrics = retentionMetrics.filter(metric => {
    const categoryMatch = selectedCategory === 'all' || metric.category === selectedCategory;
    const frequencyMatch = selectedFrequency === 'all' || metric.frequency === selectedFrequency;
    return categoryMatch && frequencyMatch;
  });

  // Проверка критических метрик
  const criticalMetrics = retentionMetrics.filter(metric => {
    if (metric.name === 'Retention Rate' && Number(metric.value) < 60) return true;
    if (metric.name === 'Churn Rate' && Number(metric.value) > 5) return true;
    if (metric.name === 'Withdrawal Success Rate' && Number(metric.value) < 95) return true;
    return false;
  });

  return (
    <div className="space-y-6">
      {/* Алерты для критических метрик */}
      {criticalMetrics.length > 0 && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Внимание! Критические показатели</AlertTitle>
          <AlertDescription>
            {criticalMetrics.map(metric => (
              <div key={metric.id}>
                • {metric.name}: {metric.value}{metric.unit} (критический порог)
              </div>
            ))}
          </AlertDescription>
        </Alert>
      )}

      {/* Фильтры */}
      <div className="flex gap-4">
        <Select value={selectedCategory} onValueChange={setSelectedCategory}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Выберите категорию" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Все категории</SelectItem>
            <SelectItem value="retention">Удержание</SelectItem>
            <SelectItem value="revenue">Доход</SelectItem>
            <SelectItem value="engagement">Вовлеченность</SelectItem>
            <SelectItem value="conversion">Конверсия</SelectItem>
            <SelectItem value="satisfaction">Удовлетворенность</SelectItem>
          </SelectContent>
        </Select>

        <Select value={selectedFrequency} onValueChange={setSelectedFrequency}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Частота обновления" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Все</SelectItem>
            <SelectItem value="daily">Ежедневно</SelectItem>
            <SelectItem value="weekly">Еженедельно</SelectItem>
            <SelectItem value="monthly">Ежемесячно</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Табы с метриками */}
      <Tabs defaultValue="metrics" className="space-y-4">
        <TabsList>
          <TabsTrigger value="metrics">25 ключевых метрик</TabsTrigger>
          <TabsTrigger value="segments">Метрики по сегментам</TabsTrigger>
          <TabsTrigger value="monitoring">Регламент мониторинга</TabsTrigger>
        </TabsList>

        <TabsContent value="metrics" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredMetrics.map(metric => (
              <MetricCard key={metric.id} metric={metric} />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="segments" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {segmentMetricsData.map(segment => (
              <SegmentMetricsCard key={segment.segmentId} segment={segment} />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="monitoring" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Регламент мониторинга метрик</CardTitle>
              <CardDescription>
                Рекомендуемая частота проверки ключевых показателей
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <h4 className="font-medium mb-2">Ежедневный мониторинг</h4>
                  <div className="flex flex-wrap gap-2">
                    {monitoringSchedule.daily.map(metric => (
                      <Badge key={metric} variant="secondary">{metric}</Badge>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h4 className="font-medium mb-2">Еженедельный мониторинг</h4>
                  <div className="flex flex-wrap gap-2">
                    {monitoringSchedule.weekly.map(metric => (
                      <Badge key={metric} variant="secondary">{metric}</Badge>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h4 className="font-medium mb-2">Ежемесячный мониторинг</h4>
                  <div className="flex flex-wrap gap-2">
                    {monitoringSchedule.monthly.map(metric => (
                      <Badge key={metric} variant="secondary">{metric}</Badge>
                    ))}
                  </div>
                </div>
              </div>

              <div className="mt-6 p-4 bg-muted rounded-lg">
                <h4 className="font-medium mb-2">Система оповещений</h4>
                <ul className="text-sm space-y-1">
                  <li>• Ухудшение Retention Rate ниже 60%: срочное обсуждение и меры по реактивации</li>
                  <li>• Падение ARPU на 15%+: персональные акции и усиленные маркетинговые мероприятия</li>
                  <li>• Снижение Bonus Utilization Rate ниже 50%: пересмотр условий бонусов</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}