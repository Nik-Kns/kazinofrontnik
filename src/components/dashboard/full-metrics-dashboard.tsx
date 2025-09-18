"use client";

import { useMemo, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PeriodFilter } from "@/components/ui/period-filter";
import { 
  TrendingUp, TrendingDown, AlertCircle, Target, Euro, Users, 
  Activity, Heart, ArrowRight, AlertTriangle, CheckCircle2,
  BarChart3, PieChart, Clock, Coins
} from "lucide-react";
import Link from "next/link";
import { retentionMetrics, segmentMetricsData, monitoringSchedule } from "@/lib/retention-metrics-data";
import type { RetentionMetric, FilterConfig } from "@/lib/types";
import { addDays } from "date-fns";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import {
  Line,
  LineChart,
  XAxis,
  YAxis,
  ResponsiveContainer,
} from "recharts";

// Группировка метрик по категориям
const getMetricsByCategory = () => {
  return {
    retention: retentionMetrics.filter(m => m.category === 'retention'),
    revenue: retentionMetrics.filter(m => m.category === 'revenue'),
    engagement: retentionMetrics.filter(m => m.category === 'engagement'),
    conversion: retentionMetrics.filter(m => m.category === 'conversion'),
    satisfaction: retentionMetrics.filter(m => m.category === 'satisfaction')
  };
};

// Компонент для отображения одной метрики
function MetricCard({ metric, isCompact = false, onOpen }: { metric: RetentionMetric; isCompact?: boolean; onOpen?: (m: RetentionMetric) => void }) {
  const isAlert = (metric.name === 'Retention Rate' && Number(metric.value) < 65) ||
                 (metric.name === 'Churn Rate' && Number(metric.value) > 4) ||
                 (metric.name === 'Withdrawal Success Rate' && Number(metric.value) < 95);
  
  const trendIcon = metric.trend === 'up' ? <TrendingUp className="h-3 w-3" /> :
                   metric.trend === 'down' ? <TrendingDown className="h-3 w-3" /> :
                   null;
  
  const trendColor = metric.trend === 'up' ? 'text-green-600' :
                    metric.trend === 'down' ? 'text-red-600' :
                    'text-gray-600';

  if (isCompact) {
    return (
      <div className={`p-3 rounded-lg border ${isAlert ? 'border-red-200 bg-red-50' : 'bg-white'}`}>
        <div className="flex items-center justify-between mb-1">
          <span className="text-sm font-medium truncate">{metric.name}</span>
          {metric.frequency === 'daily' && <Badge variant="outline" className="text-xs">Daily</Badge>}
        </div>
        <div className="flex items-center justify-between">
          <span className="text-xl font-bold">{metric.value}{metric.unit}</span>
          {trendIcon && (
            <div className={`flex items-center gap-1 ${trendColor}`}>
              {trendIcon}
              <span className="text-xs">{metric.trendValue}</span>
            </div>
          )}
        </div>
        {/* мини-спарклайн */}
        {Array.isArray((metric as any).sparkline) && (
          <div className="mt-2 h-8">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={(metric as any).sparkline.map((v: number, i: number) => ({ i, v }))}>
                <Line type="monotone" dataKey="v" stroke="#6366F1" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>
    );
  }

  return (
    <Card className={`${isAlert ? 'border-red-500' : ''} transition hover:shadow-md cursor-pointer`} onClick={() => onOpen && onOpen(metric)}>
      <CardHeader className="pb-3">
        <CardTitle className="text-base">{metric.name}</CardTitle>
        <CardDescription className="text-xs">{metric.description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between mb-2">
          <span className="text-2xl font-bold">{metric.value}{metric.unit}</span>
          {trendIcon && (
            <div className={`flex items-center gap-1 ${trendColor}`}>
              {trendIcon}
              <span className="text-sm">{metric.trendValue}</span>
            </div>
          )}
        </div>
        {metric.targetValue && (
          <div>
            <div className="flex justify-between text-xs text-muted-foreground mb-1">
              <span>Цель: <span>{metric.targetValue}{metric.unit}</span></span>
              <span>{Math.round(Number(String(metric.value).replace(/[^0-9.-]/g, '')) / Number(String(metric.targetValue).replace(/[^0-9.-]/g, '')) * 100)}%</span>
            </div>
            <Progress 
              value={Number(String(metric.value).replace(/[^0-9.-]/g, '')) / Number(String(metric.targetValue).replace(/[^0-9.-]/g, '')) * 100} 
              className="h-2"
            />
          </div>
        )}
        {/* мини-спарклайн */}
        {Array.isArray((metric as any).sparkline) && (
          <div className="mt-3 h-16">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={(metric as any).sparkline.map((v: number, i: number) => ({ i, v }))}>
                <Line type="monotone" dataKey="v" stroke="#6366F1" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// Основной компонент дашборда
export function FullMetricsDashboard({ filters }: { filters?: FilterConfig }) {
  const [dateRange, setDateRange] = useState<{ from?: Date; to?: Date }>({
    from: addDays(new Date(), -30),
    to: new Date()
  });
  const [compareMode, setCompareMode] = useState<'none' | 'yoy' | 'mom'>('none');
  const [openedMetric, setOpenedMetric] = useState<RetentionMetric | null>(null);
  // загрузка порядка табов
  useState(() => {
    try {
      const saved = localStorage.getItem('tabOrder');
      if (saved) setTabOrder(JSON.parse(saved));
    } catch {}
  });
  
  const metricsByCategory = getMetricsByCategory();
  const [tabOrder, setTabOrder] = useState<string[]>([
    'all','retention','revenue','engagement','conversion','satisfaction'
  ]);
  const [dragging, setDragging] = useState<string | null>(null);
  
  // Критические метрики
  const criticalMetrics = retentionMetrics.filter(metric => {
    if (metric.name === 'Retention Rate' && Number(metric.value) < 60) return true;
    if (metric.name === 'Churn Rate' && Number(metric.value) > 5) return true;
    if (metric.name === 'Withdrawal Success Rate' && Number(metric.value) < 95) return true;
    if (metric.name === 'Bonus Utilization Rate' && Number(metric.value) < 50) return true;
    return false;
  });

  // Топ метрики для быстрого обзора
  const topMetrics = [
    retentionMetrics.find(m => m.name === 'Retention Rate'),
    retentionMetrics.find(m => m.name === 'GGR'),
    retentionMetrics.find(m => m.name === 'AVG DEP'),
  ].filter(Boolean) as RetentionMetric[];

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'retention': return <Users className="h-5 w-5" />;
      case 'revenue': return <Euro className="h-5 w-5" />;
      case 'engagement': return <Activity className="h-5 w-5" />;
      case 'conversion': return <Target className="h-5 w-5" />;
      case 'satisfaction': return <Heart className="h-5 w-5" />;
      default: return <BarChart3 className="h-5 w-5" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Фильтр по периоду времени */}
      <PeriodFilter 
        dateRange={dateRange}
        onDateChange={setDateRange}
        compareMode={compareMode}
        onCompareChange={setCompareMode}
        projects={(filters as any)?.projects}
        countries={(filters as any)?.countries}
        onProjectsChange={() => {}}
        onCountriesChange={() => {}}
      />

      {/* Критические алерты - самое важное сверху */}
      {criticalMetrics.length > 0 && (
        <Card className="border-red-200 bg-red-50">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-red-600" />
                <CardTitle className="text-red-600">Критические показатели требуют внимания!</CardTitle>
              </div>
              <Badge variant="destructive">{criticalMetrics.length} проблем</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-4">
              {criticalMetrics.map(metric => (
                <div key={metric.id} className="p-3 bg-white border border-red-200 rounded-lg">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-medium text-sm">{metric.name}</span>
                    <span className="text-red-600 font-bold">{metric.value}{metric.unit}</span>
                  </div>
                  <p className="text-xs text-muted-foreground">{metric.description}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Топ-4 ключевые метрики */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {topMetrics.map(metric => (
          <MetricCard key={metric.id} metric={metric} onOpen={setOpenedMetric} />
        ))}
      </div>

      {/* Все 25 метрик по категориям */}
      <Tabs defaultValue="all" className="space-y-4">
        <TabsList className="grid w-full grid-cols-6">
          {tabOrder.map((value) => {
            const t = (
              value === 'all' ? { value, label: 'Все метрики' } :
              value === 'retention' ? { value, label: 'Удержание' } :
              value === 'revenue' ? { value, label: 'Доход' } :
              value === 'engagement' ? { value, label: 'Вовлеченность' } :
              value === 'conversion' ? { value, label: 'Конверсия' } :
              { value, label: 'Удовлетворенность' }
            );
            return (
              <div
                key={t.value}
                draggable
                onDragStart={() => setDragging(t.value)}
                onDragOver={(e) => e.preventDefault()}
                onDrop={() => {
                  if (!dragging || dragging === t.value) return;
                  const next = [...tabOrder];
                  const from = next.indexOf(dragging);
                  const to = next.indexOf(t.value);
                  next.splice(to, 0, next.splice(from, 1)[0]);
                  setTabOrder(next);
                  try { localStorage.setItem('tabOrder', JSON.stringify(next)); } catch {}
                }}
                className="cursor-move"
              >
                <TabsTrigger
                  value={t.value}
                  className="w-full data-[state=active]:bg-primary/10 data-[state=active]:text-primary data-[state=active]:underline"
                >
                  {t.label}
                </TabsTrigger>
              </div>
            );
          })}
        </TabsList>

        <TabsContent value="all" className="space-y-6">
          {Object.entries(metricsByCategory).map(([category, metrics]) => (
            <Card key={category}>
              <CardHeader>
                <div className="flex items-center gap-2">
                  {getCategoryIcon(category)}
                  <CardTitle className="capitalize">
                    {category === 'retention' && 'Метрики удержания'}
                    {category === 'revenue' && 'Финансовые метрики'}
                    {category === 'engagement' && 'Метрики вовлеченности'}
                    {category === 'conversion' && 'Метрики конверсии'}
                    {category === 'satisfaction' && 'Метрики удовлетворенности'}
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                  {metrics.map(metric => (
                    <MetricCard key={metric.id} metric={metric} isCompact onOpen={setOpenedMetric} />
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="retention">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                <CardTitle>Метрики удержания игроков</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {metricsByCategory.retention.map(metric => (
                  <MetricCard key={metric.id} metric={metric} onOpen={setOpenedMetric} />
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="revenue">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Euro className="h-5 w-5" />
                <CardTitle>Финансовые показатели</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {metricsByCategory.revenue.map(metric => (
                  <MetricCard key={metric.id} metric={metric} onOpen={setOpenedMetric} />
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="engagement">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Activity className="h-5 w-5" />
                <CardTitle>Вовлеченность игроков</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {metricsByCategory.engagement.map(metric => (
                  <MetricCard key={metric.id} metric={metric} onOpen={setOpenedMetric} />
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="conversion">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Target className="h-5 w-5" />
                <CardTitle>Конверсионные метрики</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {metricsByCategory.conversion.map(metric => (
                  <MetricCard key={metric.id} metric={metric} onOpen={setOpenedMetric} />
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="satisfaction">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Heart className="h-5 w-5" />
                <CardTitle>Удовлетворенность клиентов</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {metricsByCategory.satisfaction.map(metric => (
                  <MetricCard key={metric.id} metric={metric} onOpen={setOpenedMetric} />
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Модалка с подробным трендом метрики */}
      {openedMetric && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/40" onClick={() => setOpenedMetric(null)}>
          <div className="w-full max-w-3xl rounded-lg bg-background p-6 shadow-xl" onClick={(e) => e.stopPropagation()}>
            <div className="mb-4">
              <h3 className="text-xl font-semibold">{openedMetric.name}</h3>
              <p className="text-sm text-muted-foreground">{openedMetric.description}</p>
            </div>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={(openedMetric as any).sparkline?.map((v: number, i: number) => ({ label: i + 1, value: v })) ?? []}>
                  <XAxis dataKey="label" hide />
                  <YAxis hide />
                  <Line type="monotone" dataKey="value" stroke="#3b82f6" strokeWidth={2} dot={false} />
                  <ChartTooltip content={<ChartTooltipContent />} />
                </LineChart>
              </ResponsiveContainer>
            </div>
            {openedMetric.id === 'churn_rate' && (
              <div className="mt-6 rounded-lg border p-4 bg-muted/30">
                <h4 className="font-medium mb-2">AI‑прогноз оттока (30 дней)</h4>
                <p className="text-sm text-muted-foreground mb-3">{(openedMetric as any).aiForecast?.baseTrend}</p>
                <div className="grid gap-3 md:grid-cols-3">
                  {(openedMetric as any).aiForecast?.scenarios?.map((s: any, i: number) => (
                    <div key={i} className="p-3 rounded border bg-background">
                      <div className="text-sm font-medium">{s.name}</div>
                      <div className="text-lg font-bold mt-1">{s.expectedValue}</div>
                      <div className="text-xs text-muted-foreground mt-1">{s.impact}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Метрики по сегментам */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <PieChart className="h-5 w-5" />
              <CardTitle>Метрики по ключевым сегментам</CardTitle>
            </div>
            <Button asChild variant="outline" size="sm">
              <Link href="/segments">
                <span>Все сегменты</span>
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {segmentMetricsData.slice(0, 3).map(segment => (
              <Card key={segment.segmentId}>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base">{segment.segmentName}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Retention</span>
                      <span className="font-medium">{segment.metrics.retentionRate}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Ср. депозит</span>
                      <span className="font-medium">{segment.metrics.averageDepositAmount}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">LTV</span>
                      <span className="font-medium">{segment.metrics.ltv}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Регламент мониторинга (сворачиваемый) */}
      <details className="group">
        <summary className="list-none">
          <Card className="cursor-pointer">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                <CardTitle>Регламент мониторинга</CardTitle>
                <span className="ml-auto text-sm text-muted-foreground group-open:hidden">Нажмите, чтобы развернуть</span>
                <span className="ml-auto text-sm text-muted-foreground hidden group-open:block">Нажмите, чтобы свернуть</span>
              </div>
            </CardHeader>
          </Card>
        </summary>
        <Card className="mt-3">
          <CardContent>
            <div className="grid gap-4 md:grid-cols-3">
              <div className="p-4 bg-blue-50 rounded-lg" title="Ежедневно следим за краткосрочными изменениями и аномалиями">
                <h4 className="font-medium mb-2 flex items-center gap-2">
                  <Badge variant="secondary">Ежедневно</Badge>
                  <span className="text-sm text-muted-foreground">{monitoringSchedule.daily.length} <span>метрик</span></span>
                </h4>
                <p className="text-xs text-muted-foreground">
                  Retention Rate, Churn Rate, Active Players и другие критические показатели
                </p>
              </div>
              <div className="p-4 bg-green-50 rounded-lg" title="Еженедельно анализируем тренды и эффективность кампаний">
                <h4 className="font-medium mb-2 flex items-center gap-2">
                  <Badge variant="secondary">Еженедельно</Badge>
                  <span className="text-sm text-muted-foreground">{monitoringSchedule.weekly.length} <span>метрик</span></span>
                </h4>
                <p className="text-xs text-muted-foreground">
                  ARPU, Frequency of Deposits, ROI Campaigns и финансовые показатели
                </p>
              </div>
              <div className="p-4 bg-purple-50 rounded-lg" title="Ежемесячно смотрим долгосрочные цели и стратегию">
                <h4 className="font-medium mb-2 flex items-center gap-2">
                  <Badge variant="secondary">Ежемесячно</Badge>
                  <span className="text-sm text-muted-foreground">{monitoringSchedule.monthly.length} <span>метрик</span></span>
                </h4>
                <p className="text-xs text-muted-foreground">
                  LTV, VIP Conversion, NPS и долгосрочные показатели
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </details>
    </div>
  );
}