"use client";

import { useMemo, useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { retentionMetrics } from "@/lib/retention-metrics-data";
import type { RetentionMetric } from "@/lib/types";
import { TrendingDown, TrendingUp, Settings, Calendar } from "lucide-react";
import { CollapsibleFilters } from "@/components/ui/collapsible-filters";
import type { FilterConfig, FilterGroup } from "@/lib/types";

const DEFAULT_IDS = ["ggr", "retention_rate", "crm_spend", "arpu", "conversion_rate"];

interface SelectedKpiTileProps {
  activeMetric?: string;
  onMetricClick?: (metricKey: string) => void;
}

export function SelectedKpiTile({ activeMetric, onMetricClick }: SelectedKpiTileProps = {}) {
  const [open, setOpen] = useState(false);
  const [timeRange, setTimeRange] = useState<string>(() => {
    try {
      const saved = localStorage.getItem("selectedKpiTimeRange");
      return saved || "today";
    } catch {
      return "today";
    }
  });
  const [selected, setSelected] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem("analyticsSelectedTile");
      return saved ? JSON.parse(saved) : DEFAULT_IDS;
    } catch {
      return DEFAULT_IDS;
    }
  });
  const [metrics, setMetrics] = useState<Record<string, RetentionMetric>>({});

  const metricsMap = useMemo(() => {
    const map: Record<string, RetentionMetric> = {} as any;
    for (const m of retentionMetrics) map[m.id] = m as any;
    return map;
  }, []);

  // Функция для генерации метрик в зависимости от временного периода
  const generateMetricsForPeriod = (period: string) => {
    const baseMetrics = { ...metricsMap };
    const result: Record<string, RetentionMetric> = {};
    
    // Множители для разных периодов
    const multipliers: Record<string, { value: number, trend: number }> = {
      today: { value: 1, trend: 0.05 },
      yesterday: { value: 0.95, trend: -0.02 },
      week: { value: 7.2, trend: 0.12 },
      month: { value: 30.5, trend: 0.18 },
      quarter: { value: 91, trend: 0.25 },
      year: { value: 365, trend: 0.35 }
    };
    
    const mult = multipliers[period] || multipliers.today;
    
    for (const [id, metric] of Object.entries(baseMetrics)) {
      const newMetric = { ...metric };
      
      // Обновляем значения в зависимости от типа метрики
      if (metric.unit === '€') {
        const baseValue = parseFloat(metric.value.toString().replace(/[€,]/g, ''));
        newMetric.value = (baseValue * mult.value).toFixed(0);
      } else if (metric.unit === '%') {
        // Проценты остаются примерно одинаковыми, с небольшими вариациями
        const baseValue = parseFloat(metric.value.toString());
        newMetric.value = (baseValue + (Math.random() * 4 - 2)).toFixed(1);
      } else {
        // Для чисел без единиц
        const baseValue = parseFloat(metric.value.toString().replace(/,/g, ''));
        newMetric.value = Math.round(baseValue * mult.value).toLocaleString();
      }
      
      // Обновляем тренд
      if (metric.trendValue) {
        const trendNum = parseFloat(metric.trendValue.toString().replace(/[+%]/g, ''));
        const newTrend = trendNum * (1 + mult.trend);
        newMetric.trendValue = `+${newTrend.toFixed(1)}%`;
        newMetric.trend = newTrend > 0 ? 'up' : newTrend < 0 ? 'down' : 'stable';
      }
      
      result[id] = newMetric;
    }
    
    return result;
  };

  useEffect(() => {
    const newMetrics = generateMetricsForPeriod(timeRange);
    setMetrics(newMetrics);
  }, [timeRange]);

  const handleTimeRangeChange = (value: string) => {
    setTimeRange(value);
    try {
      localStorage.setItem("selectedKpiTimeRange", value);
      // Сохраняем в основные фильтры для синхронизации
      localStorage.setItem("selectedKpis", JSON.stringify(selected));
    } catch {}
  };

  const apply = () => {
    try { 
      localStorage.setItem("analyticsSelectedTile", JSON.stringify(selected));
      // Также сохраняем для использования в главной странице
      localStorage.setItem("selectedKpis", JSON.stringify(selected));
      // Вызываем событие для обновления
      window.dispatchEvent(new Event('storage'));
    } catch {}
    setOpen(false);
  };

  const toggle = (id: string, checked: boolean) => {
    setSelected(prev => checked ? Array.from(new Set([...prev, id])).slice(0, 6) : prev.filter(x => x !== id));
  };

  const handleMetricClick = (metricId: string) => {
    if (onMetricClick) {
      onMetricClick(metricId);
      // Сохраняем активную метрику в localStorage
      try {
        localStorage.setItem('activeMetric', metricId);
      } catch {}
    }
  };

  return (
    <Card>
      <CardHeader className="pb-3 flex flex-row items-center justify-between">
        <div>
          <CardTitle>Избранные метрики</CardTitle>
          <CardDescription>Быстрый доступ к важным KPI. До 6 метрик.</CardDescription>
        </div>
        <div className="flex items-center gap-2">
          <Select value={timeRange} onValueChange={handleTimeRangeChange}>
            <SelectTrigger className="w-[140px]">
              <Calendar className="h-4 w-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="today">Сегодня</SelectItem>
              <SelectItem value="yesterday">Вчера</SelectItem>
              <SelectItem value="week">Неделя</SelectItem>
              <SelectItem value="month">Месяц</SelectItem>
              <SelectItem value="quarter">Квартал</SelectItem>
              <SelectItem value="year">Год</SelectItem>
            </SelectContent>
          </Select>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm"><Settings className="h-4 w-4 mr-2"/>Настроить</Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Выберите метрики (до 6)</DialogTitle>
            </DialogHeader>
            <div className="grid md:grid-cols-2 gap-3 mt-2 max-h-[60vh] overflow-y-auto">
              {retentionMetrics.map(m => (
                <label key={m.id} className="flex items-start gap-2">
                  <Checkbox checked={selected.includes(m.id)} onCheckedChange={(v) => toggle(m.id, Boolean(v))} />
                  <span className="text-sm">{m.name}</span>
                </label>
              ))}
            </div>
            <div className="flex justify-end mt-4">
              <Button onClick={apply}>Сохранить</Button>
            </div>
          </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid gap-3 md:grid-cols-3 lg:grid-cols-6">
          {selected.map((id) => {
            const m = metrics[id] || metricsMap[id];
            if (!m) return null;
            const up = m.trend === 'up';
            const isActive = activeMetric === id;
            return (
              <div 
                key={id} 
                onClick={() => handleMetricClick(id)}
                className={`rounded-lg border p-3 cursor-pointer transition-all hover:shadow-md ${
                  isActive ? 'ring-2 ring-primary ring-offset-2 shadow-lg' : ''
                } ${up ? 'bg-green-50 border-green-200' : m.trend === 'down' ? 'bg-red-50 border-red-200' : 'bg-background'}`}
              >
                <div className="text-xs text-muted-foreground mb-1 truncate">{m.name}</div>
                <div className="flex items-center justify-between">
                  <div className="text-xl font-bold">{m.value}{m.unit}</div>
                  {up ? <TrendingUp className="h-4 w-4 text-green-600"/> : m.trend === 'down' ? <TrendingDown className="h-4 w-4 text-red-600"/> : null}
                </div>
                {m.trendValue && <div className={`text-xs mt-1 ${up ? 'text-green-600' : m.trend === 'down' ? 'text-red-600' : 'text-muted-foreground'}`}>{m.trendValue}</div>}
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}


// Конфигурация фильтров для страницы аналитики
const ANALYTICS_FILTER_GROUPS: FilterGroup[] = [
  {
    id: 'vertical',
    label: 'Вертикаль',
    type: 'select',
    placeholder: 'Выберите вертикаль'
  },
  {
    id: 'countries',
    label: 'ГЕО',
    type: 'multiselect',
    options: [
      { value: 'de', label: 'Германия' },
      { value: 'fr', label: 'Франция' },
      { value: 'it', label: 'Италия' },
      { value: 'es', label: 'Испания' },
      { value: 'uk', label: 'Великобритания' },
      { value: 'pl', label: 'Польша' },
      { value: 'nl', label: 'Нидерланды' },
      { value: 'pt', label: 'Португалия' },
      { value: 'ru', label: 'Россия' },
      { value: 'ua', label: 'Украина' },
    ]
  },
  {
    id: 'games',
    label: 'Игры',
    type: 'multiselect',
    options: [] // Опции заполняются динамически в зависимости от вертикали
  },
  {
    id: 'dateRange',
    label: 'Период',
    type: 'daterange'
  },
  {
    id: 'segments',
    label: 'Сегмент',
    type: 'multiselect',
    options: [
      { value: 'active', label: 'Актив' },
      { value: 'reactivated', label: 'Реактив' },
      { value: 'churning', label: 'Предотток' },
      { value: 'new', label: 'Новорег' },
      { value: 'firstdeposit', label: 'Перводеп' },
    ]
  },
  {
    id: 'playerId',
    label: 'ID игрока',
    type: 'text',
    placeholder: 'Введите ID игрока'
  },
  {
    id: 'promocode',
    label: 'Промокод',
    type: 'text',
    placeholder: 'Введите промокод'
  },
  {
    id: 'depositAmount',
    label: 'Сумма депозита',
    type: 'range'
  },
  {
    id: 'sources',
    label: 'Источник',
    type: 'multiselect',
    options: [
      { value: 'google', label: 'Google' },
      { value: 'facebook', label: 'Facebook' },
      { value: 'instagram', label: 'Instagram' },
      { value: 'tiktok', label: 'TikTok' },
      { value: 'organic', label: 'Органика' },
      { value: 'referral', label: 'Реферальная программа' },
    ]
  },
  {
    id: 'channels',
    label: 'Подключенные каналы',
    type: 'multiselect',
    options: [
      { value: 'sms', label: 'SMS' },
      { value: 'email', label: 'Email' },
      { value: 'telegram', label: 'Telegram' },
      { value: 'whatsapp', label: 'WhatsApp' },
      { value: 'push', label: 'Push' },
    ]
  },
  {
    id: 'vipLevels',
    label: 'VIP уровень',
    type: 'multiselect',
    options: [
      { value: 'previp1', label: 'ПреVIP 1' },
      { value: 'previp2', label: 'ПреVIP 2' },
      { value: 'previp3', label: 'ПреVIP 3' },
      { value: 'vip', label: 'VIP' },
    ]
  }
];

interface AnalyticsFiltersProps {
  onFiltersChange?: (filters: FilterConfig) => void;
  onSaveFilter?: (filters: FilterConfig) => void;
}

export function AnalyticsFilters({ onFiltersChange, onSaveFilter }: AnalyticsFiltersProps) {
  const [filters, setFilters] = useState<FilterConfig>({});

  const handleFiltersChange = (newFilters: FilterConfig) => {
    setFilters(newFilters);
    onFiltersChange?.(newFilters);
    
    // Сохраняем фильтры в localStorage для использования в дашборде
    if (Object.keys(newFilters).length > 0) {
      localStorage.setItem('analyticsFilters', JSON.stringify(newFilters));
      onSaveFilter?.(newFilters);
    }
  };

  return (
    <CollapsibleFilters
      filters={filters}
      onFiltersChange={handleFiltersChange}
      filterGroups={ANALYTICS_FILTER_GROUPS}
      defaultExpanded={true}
    />
  );
}