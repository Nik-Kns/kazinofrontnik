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
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { 
  LineChart, Line, BarChart, Bar, AreaChart, Area, 
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, 
  ResponsiveContainer, ReferenceLine, Brush, ComposedChart
} from "recharts";
import { 
  Settings, TrendingUp, Calendar, ChevronDown, 
  BarChart3, LineChart as LineChartIcon, AreaChart as AreaChartIcon,
  Eye, EyeOff, Download, Maximize2, X, Plus, Filter
} from "lucide-react";
import { cn } from "@/lib/utils";

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

// Временные периоды
const TIME_PERIODS = [
  { id: '24h', name: '24 часа', dataPoints: 24 },
  { id: '7d', name: '7 дней', dataPoints: 7 },
  { id: '30d', name: '30 дней', dataPoints: 30 },
  { id: '90d', name: '90 дней', dataPoints: 90 },
  { id: '1y', name: '1 год', dataPoints: 365 },
  { id: 'custom', name: 'Выбрать период', dataPoints: 0 }
];

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
  const [selectedMetrics, setSelectedMetrics] = useState<string[]>(['revenue', 'ggr']);
  const [timePeriod, setTimePeriod] = useState('7d');
  const [chartType, setChartType] = useState<'line' | 'bar' | 'area'>('line');
  const [showComparison, setShowComparison] = useState(false);
  const [comparisonPeriod, setComparisonPeriod] = useState('previous');
  const [showAverage, setShowAverage] = useState(false);
  const [showTrend, setShowTrend] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [isMetricSelectorOpen, setIsMetricSelectorOpen] = useState(false);

  // Генерация данных для графика
  const generateChartData = useMemo(() => {
    const period = TIME_PERIODS.find(p => p.id === timePeriod);
    const points = period?.dataPoints || 7;
    
    const data = [];
    const now = new Date();
    
    for (let i = points - 1; i >= 0; i--) {
      const date = new Date(now);
      date.setDate(date.getDate() - i);
      
      const dataPoint: any = {
        date: date.toLocaleDateString('ru-RU', { 
          day: 'numeric', 
          month: 'short' 
        }),
        fullDate: date.toISOString()
      };
      
      // Генерируем значения для выбранных метрик
      selectedMetrics.forEach(metricId => {
        const metric = ALL_METRICS.find(m => m.id === metricId);
        if (metric) {
          // Базовое значение с случайными вариациями
          const baseValue = metric.category === 'financial' 
            ? Math.random() * 50000 + 30000
            : metric.category === 'players'
            ? Math.floor(Math.random() * 500 + 200)
            : metric.unit === '%'
            ? Math.random() * 30 + 50
            : Math.random() * 1000 + 500;
          
          dataPoint[metricId] = Math.round(baseValue * 100) / 100;
          
          // Данные для сравнения
          if (showComparison) {
            dataPoint[`${metricId}_prev`] = Math.round((baseValue * (0.8 + Math.random() * 0.4)) * 100) / 100;
          }
        }
      });
      
      data.push(dataPoint);
    }
    
    return data;
  }, [selectedMetrics, timePeriod, showComparison]);

  // Расчет средних значений
  const averageValues = useMemo(() => {
    const averages: Record<string, number> = {};
    
    selectedMetrics.forEach(metricId => {
      const values = generateChartData.map(d => d[metricId]).filter(v => v !== undefined);
      averages[metricId] = values.reduce((sum, val) => sum + val, 0) / values.length;
    });
    
    return averages;
  }, [generateChartData, selectedMetrics]);

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
    const DataComponent = chartType === 'bar' ? Bar : chartType === 'area' ? Area : Line;

    return (
      <ResponsiveContainer width="100%" height={400}>
        <ChartComponent data={generateChartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip content={<CustomTooltip />} />
          <Legend />
          {selectedMetrics.length > 4 && <Brush dataKey="date" height={30} stroke="#8884d8" />}
          
          {selectedMetrics.map((metricId, index) => {
            const metric = ALL_METRICS.find(m => m.id === metricId);
            if (!metric) return null;
            
            return (
              <React.Fragment key={metricId}>
                <DataComponent
                  type="monotone"
                  dataKey={metricId}
                  stroke={metric.color}
                  fill={metric.color}
                  strokeWidth={2}
                  name={metric.name}
                  fillOpacity={chartType === 'area' ? 0.3 : 1}
                />
                
                {showComparison && (
                  <DataComponent
                    type="monotone"
                    dataKey={`${metricId}_prev`}
                    stroke={metric.color}
                    fill={metric.color}
                    strokeWidth={1}
                    strokeDasharray="5 5"
                    name={`${metric.name} (пред.)`}
                    fillOpacity={chartType === 'area' ? 0.1 : 0.5}
                  />
                )}
                
                {showAverage && (
                  <ReferenceLine 
                    y={averageValues[metricId]} 
                    stroke={metric.color}
                    strokeDasharray="3 3"
                    label={`Среднее: ${Math.round(averageValues[metricId])}`}
                  />
                )}
              </React.Fragment>
            );
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
            
            {/* Настройки */}
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" size="icon">
                  <Settings className="h-4 w-4" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-80">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <h4 className="font-medium">Настройки отображения</h4>
                  </div>
                  <Separator />
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="show-comparison">Сравнение с прошлым периодом</Label>
                      <Switch
                        id="show-comparison"
                        checked={showComparison}
                        onCheckedChange={setShowComparison}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="show-average">Показать средние линии</Label>
                      <Switch
                        id="show-average"
                        checked={showAverage}
                        onCheckedChange={setShowAverage}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="show-trend">Показать тренды</Label>
                      <Switch
                        id="show-trend"
                        checked={showTrend}
                        onCheckedChange={setShowTrend}
                      />
                    </div>
                  </div>
                </div>
              </PopoverContent>
            </Popover>
          </div>
        </div>
        
        {/* Панель управления */}
        <div className="flex flex-wrap items-center gap-2 mt-4">
          {/* Выбор периода */}
          <Select value={timePeriod} onValueChange={setTimePeriod}>
            <SelectTrigger className="w-[140px]">
              <Calendar className="h-4 w-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {TIME_PERIODS.map(period => (
                <SelectItem key={period.id} value={period.id}>
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
        
        {/* Статистика по выбранным метрикам */}
        {selectedMetrics.length > 0 && (
          <div className="grid gap-4 mt-6 md:grid-cols-2 lg:grid-cols-4">
            {selectedMetrics.slice(0, 4).map(metricId => {
              const metric = ALL_METRICS.find(m => m.id === metricId);
              if (!metric) return null;
              
              const currentValue = generateChartData[generateChartData.length - 1]?.[metricId] || 0;
              const previousValue = generateChartData[generateChartData.length - 2]?.[metricId] || 0;
              const change = previousValue ? ((currentValue - previousValue) / previousValue) * 100 : 0;
              
              return (
                <div key={metricId} className="space-y-2">
                  <div className="flex items-center gap-2">
                    <div 
                      className="w-3 h-3 rounded-full" 
                      style={{ backgroundColor: metric.color }}
                    />
                    <p className="text-sm font-medium">{metric.name}</p>
                  </div>
                  <div className="flex items-baseline justify-between">
                    <span className="text-2xl font-bold">
                      {currentValue.toLocaleString('ru-RU')}
                      <span className="text-sm text-muted-foreground ml-1">
                        {metric.unit}
                      </span>
                    </span>
                    <Badge 
                      variant={change > 0 ? 'default' : 'destructive'}
                      className="text-xs"
                    >
                      {change > 0 ? '+' : ''}{change.toFixed(1)}%
                    </Badge>
                  </div>
                  {showAverage && (
                    <p className="text-xs text-muted-foreground">
                      Среднее: {averageValues[metricId]?.toFixed(0)} {metric.unit}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}