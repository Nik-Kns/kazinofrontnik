"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LineChart, Line, AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { Calendar, TrendingUp, Users, Euro, Target, Activity, Download } from "lucide-react";
import type { ChartData, SegmentType } from "@/lib/types";

// Доступные метрики для графиков
const chartMetrics = [
  { id: 'retention_rate', name: 'Retention Rate', unit: '%', color: '#3b82f6' },
  { id: 'churn_rate', name: 'Churn Rate', unit: '%', color: '#ef4444' },
  { id: 'ltv', name: 'LTV по когортам', unit: '€', color: '#10b981' },
  { id: 'arpu', name: 'ARPU', unit: '€', color: '#8b5cf6' },
  { id: 'player_reactivation_rate', name: 'Player Reactivation Rate', unit: '%', color: '#f59e0b' },
  { id: 'average_deposit', name: 'Средний депозит', unit: '€', color: '#06b6d4' },
  { id: 'average_deposit_first', name: 'Средняя сумма первого депозита', unit: '€', color: '#ec4899' }
];

// Периоды времени
const timePeriods = [
  { value: 'day', label: 'По дням' },
  { value: 'week', label: 'По неделям' },
  { value: 'month', label: 'По месяцам' }
];

// Генерация данных для графиков
const generateChartData = (metric: string, period: string, days: number = 30): ChartData[] => {
  const data: ChartData[] = [];
  const now = new Date();
  
  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);
    
    let dateStr = '';
    if (period === 'day') {
      dateStr = date.toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' });
    } else if (period === 'week') {
      const weekNum = Math.ceil((days - i) / 7);
      dateStr = `Неделя ${weekNum}`;
    } else {
      dateStr = date.toLocaleDateString('ru-RU', { month: 'short', year: 'numeric' });
    }
    
    // Базовое значение в зависимости от метрики
    let baseValue = 0;
    switch (metric) {
      case 'retention_rate': baseValue = 65 + Math.random() * 20; break;
      case 'churn_rate': baseValue = 2 + Math.random() * 3; break;
      case 'ltv': baseValue = 5000 + Math.random() * 5000; break;
      case 'arpu': baseValue = 80 + Math.random() * 40; break;
      case 'player_reactivation_rate': baseValue = 10 + Math.random() * 10; break;
      case 'average_deposit': baseValue = 150 + Math.random() * 100; break;
      case 'average_deposit_first': baseValue = 30 + Math.random() * 40; break;
    }
    
    // Добавляем тренд
    const trend = (days - i) / days * 0.1;
    const value = baseValue * (1 + trend + (Math.random() - 0.5) * 0.1);
    
    // Прогнозные значения для последних 20% данных
    const isPredicted = i < days * 0.2;
    
    data.push({
      date: dateStr,
      value: isPredicted ? null : value,
      predictedValue: isPredicted ? value : null,
      // Для сплитов по сегментам
      vip: value * 1.5,
      active: value * 0.9,
      new: value * 0.7,
      sleeping: value * 0.4
    });
  }
  
  return data;
};

interface FlexibleChartsProps {
  filters?: any;
}

export function FlexibleCharts({ filters }: FlexibleChartsProps) {
  const [selectedMetric, setSelectedMetric] = useState('retention_rate');
  const [timePeriod, setTimePeriod] = useState('day');
  const [showSplits, setShowSplits] = useState(false);
  const [splitBy, setSplitBy] = useState<'segment' | 'geo' | 'source'>('segment');
  const [chartType, setChartType] = useState<'line' | 'area' | 'bar'>('line');
  
  const currentMetric = chartMetrics.find(m => m.id === selectedMetric)!;
  const chartData = generateChartData(selectedMetric, timePeriod);
  
  // Расчет средних значений
  const avgValue = chartData
    .filter(d => d.value !== null)
    .reduce((sum, d) => sum + (d.value || 0), 0) / chartData.filter(d => d.value !== null).length;
    
  const renderChart = () => {
    const commonProps = {
      data: chartData,
      margin: { top: 5, right: 30, left: 20, bottom: 5 }
    };
    
    const ChartComponent = chartType === 'line' ? LineChart : 
                          chartType === 'area' ? AreaChart : BarChart;
    const DataComponent = chartType === 'line' ? Line : 
                         chartType === 'area' ? Area : Bar;
    
    return (
      <ResponsiveContainer width="100%" height={400}>
        <ChartComponent {...commonProps}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip 
            formatter={(value: any) => [
              `${typeof value === 'number' ? value.toFixed(2) : value}${currentMetric.unit}`,
              currentMetric.name
            ]}
          />
          <Legend />
          
          {!showSplits ? (
            <>
              <DataComponent
                type="monotone"
                dataKey="value"
                stroke={currentMetric.color}
                fill={currentMetric.color}
                fillOpacity={chartType === 'area' ? 0.6 : 1}
                name={currentMetric.name}
                strokeWidth={2}
              />
              <DataComponent
                type="monotone"
                dataKey="predictedValue"
                stroke={currentMetric.color}
                fill={currentMetric.color}
                fillOpacity={chartType === 'area' ? 0.3 : 0.5}
                strokeDasharray="5 5"
                name="Прогноз"
                strokeWidth={2}
              />
              <Line
                type="monotone"
                dataKey={() => avgValue}
                stroke="#666"
                strokeDasharray="3 3"
                name={`Среднее (${avgValue.toFixed(2)}${currentMetric.unit})`}
                dot={false}
              />
            </>
          ) : (
            <>
              <DataComponent dataKey="vip" stroke="#f59e0b" fill="#f59e0b" name="VIP" stackId="a" />
              <DataComponent dataKey="active" stroke="#3b82f6" fill="#3b82f6" name="Активные" stackId="a" />
              <DataComponent dataKey="new" stroke="#10b981" fill="#10b981" name="Новые" stackId="a" />
              <DataComponent dataKey="sleeping" stroke="#6b7280" fill="#6b7280" name="Спящие" stackId="a" />
            </>
          )}
        </ChartComponent>
      </ResponsiveContainer>
    );
  };
  
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Динамика метрик</CardTitle>
            <CardDescription>
              Интерактивные графики с возможностью переключения и сравнения
            </CardDescription>
          </div>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Скачать данные
          </Button>
        </div>
      </CardHeader>
      
      <CardContent>
        {/* Контролы для управления графиком */}
        <div className="grid gap-4 md:grid-cols-4 mb-6">
          <div className="space-y-2">
            <label className="text-sm font-medium">Метрика</label>
            <Select value={selectedMetric} onValueChange={setSelectedMetric}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {chartMetrics.map(metric => (
                  <SelectItem key={metric.id} value={metric.id}>
                    {metric.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium">Период</label>
            <Select value={timePeriod} onValueChange={setTimePeriod}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {timePeriods.map(period => (
                  <SelectItem key={period.value} value={period.value}>
                    {period.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium">Тип графика</label>
            <Select value={chartType} onValueChange={(v: any) => setChartType(v)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="line">Линейный</SelectItem>
                <SelectItem value="area">Область</SelectItem>
                <SelectItem value="bar">Столбчатый</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium">Сплиты</label>
            <div className="flex gap-2">
              <Button
                variant={showSplits ? "default" : "outline"}
                size="sm"
                onClick={() => setShowSplits(!showSplits)}
                className="flex-1"
              >
                {showSplits ? "Скрыть" : "Показать"}
              </Button>
              {showSplits && (
                <Select value={splitBy} onValueChange={(v: any) => setSplitBy(v)}>
                  <SelectTrigger className="w-[120px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="segment">По сегментам</SelectItem>
                    <SelectItem value="geo">По гео</SelectItem>
                    <SelectItem value="source">По источникам</SelectItem>
                  </SelectContent>
                </Select>
              )}
            </div>
          </div>
        </div>
        
        {/* График */}
        <div className="border rounded-lg p-4">
          {renderChart()}
        </div>
        
        {/* Дополнительная информация */}
        <div className="mt-4 grid gap-4 md:grid-cols-4">
          <div className="p-3 bg-muted rounded-lg">
            <div className="text-sm text-muted-foreground">Среднее значение</div>
            <div className="text-lg font-bold">
              {avgValue.toFixed(2)}{currentMetric.unit}
            </div>
          </div>
          <div className="p-3 bg-muted rounded-lg">
            <div className="text-sm text-muted-foreground">Максимум</div>
            <div className="text-lg font-bold">
              {Math.max(...chartData.map(d => d.value || 0)).toFixed(2)}{currentMetric.unit}
            </div>
          </div>
          <div className="p-3 bg-muted rounded-lg">
            <div className="text-sm text-muted-foreground">Минимум</div>
            <div className="text-lg font-bold">
              {Math.min(...chartData.filter(d => d.value).map(d => d.value || 0)).toFixed(2)}{currentMetric.unit}
            </div>
          </div>
          <div className="p-3 bg-muted rounded-lg">
            <div className="text-sm text-muted-foreground">Тренд</div>
            <div className="text-lg font-bold flex items-center gap-1">
              <TrendingUp className="h-4 w-4 text-green-600" />
              <span className="text-green-600">+8.5%</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}