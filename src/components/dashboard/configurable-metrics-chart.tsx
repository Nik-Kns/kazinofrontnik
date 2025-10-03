"use client";

import React, { useState, useMemo } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import {
  LineChart, Line, BarChart, Bar, AreaChart, Area,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  ResponsiveContainer, Brush
} from "recharts";
import {
  Calendar, ChevronDown,
  BarChart3, LineChart as LineChartIcon, AreaChart as AreaChartIcon,
  Download, X
} from "lucide-react";
import { cn } from "@/lib/utils";
import { getMetricsData, transformToChartData } from "@/lib/mock-metrics-data";

// Список всех доступных метрик
const ALL_METRICS = [
  { id: 'revenue', name: 'Выручка', color: '#3b82f6', unit: '€', category: 'financial' },
  { id: 'ggr', name: 'GGR', color: '#8b5cf6', unit: '€', category: 'financial' },
  { id: 'ngr', name: 'NGR', color: '#06b6d4', unit: '€', category: 'financial' },
  { id: 'deposits', name: 'Депозиты', color: '#10b981', unit: '€', category: 'financial' },
  { id: 'withdrawals', name: 'Выводы', color: '#ef4444', unit: '€', category: 'financial' },
  { id: 'bonus_cost', name: 'Стоимость бонусов', color: '#f59e0b', unit: '€', category: 'financial' },
  { id: 'new_players', name: 'Новые игроки', color: '#ec4899', unit: '', category: 'players' },
  { id: 'active_players', name: 'Активные игроки', color: '#14b8a6', unit: '', category: 'players' },
  { id: 'avg_deposit', name: 'Средний депозит', color: '#f97316', unit: '€', category: 'averages' },
  { id: 'arpu', name: 'ARPU', color: '#84cc16', unit: '€', category: 'averages' },
  { id: 'arppu', name: 'ARPPU', color: '#a855f7', unit: '€', category: 'averages' },
  { id: 'ltv', name: 'LTV', color: '#0ea5e9', unit: '€', category: 'averages' },
  { id: 'retention_d1', name: 'Retention D1', color: '#6366f1', unit: '%', category: 'retention' },
  { id: 'retention_d7', name: 'Retention D7', color: '#7c3aed', unit: '%', category: 'retention' },
  { id: 'retention_d30', name: 'Retention D30', color: '#2563eb', unit: '%', category: 'retention' },
  { id: 'conversion_rate', name: 'Конверсия', color: '#dc2626', unit: '%', category: 'conversion' },
  { id: 'churn_rate', name: 'Отток', color: '#991b1b', unit: '%', category: 'conversion' },
  { id: 'reactivation_rate', name: 'Реактивация', color: '#059669', unit: '%', category: 'conversion' },
  { id: 'rtp', name: 'RTP', color: '#0891b2', unit: '%', category: 'gaming' },
  { id: 'bet_amount', name: 'Объем ставок', color: '#be185d', unit: '€', category: 'gaming' },
  { id: 'win_amount', name: 'Выигрыши', color: '#7c2d12', unit: '€', category: 'gaming' },
  { id: 'game_sessions', name: 'Игровые сессии', color: '#4338ca', unit: '', category: 'gaming' },
  { id: 'avg_session_time', name: 'Среднее время сессии', color: '#b91c1c', unit: 'мин', category: 'gaming' },
  { id: 'bonus_conversion', name: 'Конверсия бонусов', color: '#a21caf', unit: '%', category: 'bonuses' },
  { id: 'wagering_completion', name: 'Отыгрыш вейджера', color: '#1e40af', unit: '%', category: 'bonuses' }
];

// Категории метрик
const METRIC_CATEGORIES = [
  { id: 'all', name: 'Все метрики' },
  { id: 'financial', name: 'Финансовые' },
  { id: 'players', name: 'Игроки' },
  { id: 'averages', name: 'Средние показатели' },
  { id: 'retention', name: 'Удержание' },
  { id: 'conversion', name: 'Конверсия' },
  { id: 'gaming', name: 'Игровая активность' },
  { id: 'bonuses', name: 'Бонусы' }
];

// Временные периоды (упрощено по ТЗ)
const TIME_PERIODS = [
  { id: 7, name: '7 дней' },
  { id: 30, name: '30 дней' },
  { id: 90, name: '90 дней' }
] as const;

// Типы графиков
const CHART_TYPES = [
  { id: 'line', name: 'Линейный', icon: LineChartIcon },
  { id: 'bar', name: 'Столбчатый', icon: BarChart3 },
  { id: 'area', name: 'С заливкой', icon: AreaChartIcon }
];

interface ConfigurableMetricsChartProps {
  className?: string;
}

export function ConfigurableMetricsChart({ className }: ConfigurableMetricsChartProps) {
  // State - упрощено по ТЗ
  const [selectedMetrics, setSelectedMetrics] = useState<string[]>(['revenue', 'ggr']);
  const [timePeriod, setTimePeriod] = useState<7 | 30 | 90>(7);
  const [chartType, setChartType] = useState<'line' | 'bar' | 'area'>('line');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [isMetricSelectorOpen, setIsMetricSelectorOpen] = useState(false);

  // Получение данных для графика из моковых данных
  const chartData = useMemo(() => {
    // Получаем данные для выбранных метрик с фильтрацией по периоду
    const metricsData = getMetricsData(selectedMetrics, timePeriod);
    // Трансформируем в формат для Recharts
    return transformToChartData(metricsData);
  }, [selectedMetrics, timePeriod]);

  // Обработка выбора метрик
  const handleMetricToggle = (metricId: string) => {
    setSelectedMetrics(prev => {
      if (prev.includes(metricId)) {
        return prev.filter(id => id !== metricId);
      } else if (prev.length < 8) {
        return [...prev, metricId];
      }
      return prev;
    });
  };

  // Фильтрация метрик по категории
  const filteredMetrics = selectedCategory === 'all' 
    ? ALL_METRICS 
    : ALL_METRICS.filter(m => m.category === selectedCategory);

  // Custom Tooltip
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-background border rounded-lg p-3 shadow-lg">
          <p className="font-semibold mb-2">{label}</p>
          {payload.map((entry: any, index: number) => {
            const metric = ALL_METRICS.find(m => m.id === entry.dataKey || m.id === entry.dataKey.replace('_prev', ''));
            return (
              <div key={index} className="flex items-center justify-between gap-4 text-sm">
                <span style={{ color: entry.color }}>
                  {entry.name || metric?.name}
                  {entry.dataKey.includes('_prev') && ' (пред. период)'}
                </span>
                <span className="font-mono font-medium">
                  {entry.value.toLocaleString('ru-RU')} {metric?.unit}
                </span>
              </div>
            );
          })}
        </div>
      );
    }
    return null;
  };

  // Рендер графика
  const renderChart = () => {
    const ChartComponent = chartType === 'bar' ? BarChart : chartType === 'area' ? AreaChart : LineChart;

    return (
      <ResponsiveContainer width="100%" height={400}>
        <ChartComponent data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
          <XAxis dataKey="date" />
          <YAxis yAxisId="left" />
          <YAxis yAxisId="right" orientation="right" />
          <Tooltip content={<CustomTooltip />} />
          <Legend />
          {selectedMetrics.length > 4 && <Brush dataKey="date" height={30} stroke="#8884d8" />}

          {selectedMetrics.map((metricId) => {
            const metric = ALL_METRICS.find(m => m.id === metricId);
            if (!metric) return null;

            // Финансовые метрики на левой оси, остальные на правой
            const yAxisId = metric.category === 'financial' ? 'left' : 'right';

            if (chartType === 'bar') {
              return (
                <Bar
                  key={metricId}
                  yAxisId={yAxisId}
                  dataKey={metricId}
                  fill={metric.color}
                  name={metric.name}
                />
              );
            } else if (chartType === 'area') {
              return (
                <Area
                  key={metricId}
                  yAxisId={yAxisId}
                  type="monotone"
                  dataKey={metricId}
                  stroke={metric.color}
                  fill={metric.color}
                  strokeWidth={2}
                  name={metric.name}
                  fillOpacity={0.3}
                />
              );
            } else {
              return (
                <Line
                  key={metricId}
                  yAxisId={yAxisId}
                  type="monotone"
                  dataKey={metricId}
                  stroke={metric.color}
                  strokeWidth={2}
                  name={metric.name}
                  dot={false}
                />
              );
            }
          })}
        </ChartComponent>
      </ResponsiveContainer>
    );
  };

  return (
    <Card className={cn("w-full", className)}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Аналитика метрик</CardTitle>
            <CardDescription>
              Выберите до 8 метрик для отображения и сравнения
            </CardDescription>
          </div>
          <div className="flex items-center gap-2">
            {/* Тип графика */}
            <Tabs value={chartType} onValueChange={(v) => setChartType(v as any)}>
              <TabsList className="h-9">
                {CHART_TYPES.map(type => (
                  <TabsTrigger key={type.id} value={type.id} className="px-2">
                    <type.icon className="h-4 w-4" />
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>

            {/* Кнопка экспорта */}
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4" />
            </Button>
          </div>
        </div>
        
        {/* Панель управления */}
        <div className="flex flex-wrap items-center gap-2 mt-4">
          {/* Выбор периода */}
          <Select value={String(timePeriod)} onValueChange={(v) => setTimePeriod(Number(v) as 7 | 30 | 90)}>
            <SelectTrigger className="w-[140px]">
              <Calendar className="h-4 w-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {TIME_PERIODS.map(period => (
                <SelectItem key={period.id} value={String(period.id)}>
                  {period.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          {/* Выбор метрик */}
          <Popover open={isMetricSelectorOpen} onOpenChange={setIsMetricSelectorOpen}>
            <PopoverTrigger asChild>
              <Button variant="outline" className="justify-between">
                <span>Метрики ({selectedMetrics.length}/8)</span>
                <ChevronDown className="h-4 w-4 ml-2" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[400px] p-0" align="start">
              <div className="p-4 border-b">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-medium">Выберите метрики</h4>
                  <Badge variant="secondary">
                    {selectedMetrics.length} из 8
                  </Badge>
                </div>
                
                {/* Фильтр по категориям */}
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {METRIC_CATEGORIES.map(cat => (
                      <SelectItem key={cat.id} value={cat.id}>
                        {cat.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="max-h-[400px] overflow-y-auto p-4">
                <div className="space-y-2">
                  {filteredMetrics.map(metric => (
                    <div
                      key={metric.id}
                      className={cn(
                        "flex items-center space-x-3 p-2 rounded-md hover:bg-accent transition-colors cursor-pointer",
                        selectedMetrics.includes(metric.id) && "bg-accent"
                      )}
                      onClick={() => handleMetricToggle(metric.id)}
                    >
                      <Checkbox
                        checked={selectedMetrics.includes(metric.id)}
                        onCheckedChange={() => handleMetricToggle(metric.id)}
                        disabled={!selectedMetrics.includes(metric.id) && selectedMetrics.length >= 8}
                      />
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <div 
                            className="w-3 h-3 rounded-full" 
                            style={{ backgroundColor: metric.color }}
                          />
                          <Label className="font-normal cursor-pointer">
                            {metric.name}
                          </Label>
                          {metric.unit && (
                            <Badge variant="outline" className="text-xs">
                              {metric.unit}
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="p-4 border-t bg-muted/50">
                <div className="flex items-center justify-between">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setSelectedMetrics([])}
                    disabled={selectedMetrics.length === 0}
                  >
                    Очистить
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => setIsMetricSelectorOpen(false)}
                  >
                    Применить
                  </Button>
                </div>
              </div>
            </PopoverContent>
          </Popover>
          
          {/* Выбранные метрики */}
          <div className="flex flex-wrap gap-2">
            {selectedMetrics.map(metricId => {
              const metric = ALL_METRICS.find(m => m.id === metricId);
              if (!metric) return null;
              
              return (
                <Badge
                  key={metricId}
                  variant="secondary"
                  className="flex items-center gap-1 pr-1"
                >
                  <div 
                    className="w-2 h-2 rounded-full" 
                    style={{ backgroundColor: metric.color }}
                  />
                  <span>{metric.name}</span>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-4 w-4 p-0 hover:bg-transparent"
                    onClick={() => handleMetricToggle(metricId)}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </Badge>
              );
            })}
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        {selectedMetrics.length > 0 ? (
          renderChart()
        ) : (
          <div className="flex flex-col items-center justify-center h-[400px] text-muted-foreground">
            <BarChart3 className="h-12 w-12 mb-4" />
            <p>Выберите метрики для отображения на графике</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}