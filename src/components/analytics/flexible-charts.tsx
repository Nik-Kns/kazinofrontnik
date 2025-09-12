"use client";

import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Image from "next/image";
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

// Функция для получения изображения графика в зависимости от метрики
const getChartImage = (metric: string): string => {
  // Используем плейсхолдер изображения для каждой метрики
  // В реальном проекте здесь будут пути к реальным изображениям
  switch (metric) {
    case 'retention_rate':
      return 'https://via.placeholder.com/800x400/3b82f6/ffffff?text=Retention+Rate+Chart';
    case 'churn_rate':
      return 'https://via.placeholder.com/800x400/ef4444/ffffff?text=Churn+Rate+Chart';
    case 'ltv':
      return 'https://via.placeholder.com/800x400/10b981/ffffff?text=LTV+Chart';
    case 'arpu':
      return 'https://via.placeholder.com/800x400/8b5cf6/ffffff?text=ARPU+Chart';
    case 'player_reactivation_rate':
      return 'https://via.placeholder.com/800x400/f59e0b/ffffff?text=Reactivation+Rate+Chart';
    case 'average_deposit':
      return 'https://via.placeholder.com/800x400/06b6d4/ffffff?text=Average+Deposit+Chart';
    case 'average_deposit_first':
      return 'https://via.placeholder.com/800x400/ec4899/ffffff?text=First+Deposit+Chart';
    default:
      return 'https://via.placeholder.com/800x400/6b7280/ffffff?text=Default+Chart';
  }
};

// Моковые данные для статистики
const getMockStats = (metric: string) => {
  const stats: Record<string, { avg: number; max: number; min: number; trend: number }> = {
    'retention_rate': { avg: 72.5, max: 85.3, min: 62.1, trend: 8.5 },
    'churn_rate': { avg: 3.2, max: 4.8, min: 2.1, trend: -5.2 },
    'ltv': { avg: 7250, max: 9800, min: 5100, trend: 12.3 },
    'arpu': { avg: 105, max: 140, min: 85, trend: 6.7 },
    'player_reactivation_rate': { avg: 15.3, max: 19.2, min: 11.5, trend: 4.1 },
    'average_deposit': { avg: 200, max: 250, min: 150, trend: 9.8 },
    'average_deposit_first': { avg: 50, max: 70, min: 30, trend: 11.2 }
  };
  return stats[metric] || { avg: 100, max: 150, min: 50, trend: 5.0 };
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
  const chartImage = getChartImage(selectedMetric);
  const stats = getMockStats(selectedMetric);
  
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
        
        {/* График - статичное изображение */}
        <div className="border rounded-lg p-4 bg-gray-50 relative">
          <div className="relative w-full h-[400px]">
            <img 
              src={chartImage} 
              alt={`${currentMetric.name} Chart`}
              className="w-full h-full object-contain rounded"
            />
          </div>
        </div>
        
        {/* Дополнительная информация */}
        <div className="mt-4 grid gap-4 md:grid-cols-4">
          <div className="p-3 bg-muted rounded-lg">
            <div className="text-sm text-muted-foreground">Среднее значение</div>
            <div className="text-lg font-bold">
              {stats.avg.toFixed(2)}{currentMetric.unit}
            </div>
          </div>
          <div className="p-3 bg-muted rounded-lg">
            <div className="text-sm text-muted-foreground">Максимум</div>
            <div className="text-lg font-bold">
              {stats.max.toFixed(2)}{currentMetric.unit}
            </div>
          </div>
          <div className="p-3 bg-muted rounded-lg">
            <div className="text-sm text-muted-foreground">Минимум</div>
            <div className="text-lg font-bold">
              {stats.min.toFixed(2)}{currentMetric.unit}
            </div>
          </div>
          <div className="p-3 bg-muted rounded-lg">
            <div className="text-sm text-muted-foreground">Тренд</div>
            <div className="text-lg font-bold flex items-center gap-1">
              {stats.trend > 0 ? (
                <>
                  <TrendingUp className="h-4 w-4 text-green-600" />
                  <span className="text-green-600">+{stats.trend}%</span>
                </>
              ) : (
                <>
                  <TrendingUp className="h-4 w-4 text-red-600 rotate-180" />
                  <span className="text-red-600">{stats.trend}%</span>
                </>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}