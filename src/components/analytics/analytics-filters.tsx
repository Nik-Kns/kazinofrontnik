"use client";

import { useMemo, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { retentionMetrics } from "@/lib/retention-metrics-data";
import type { RetentionMetric } from "@/lib/types";
import { TrendingDown, TrendingUp, Settings } from "lucide-react";
import { CollapsibleFilters } from "@/components/ui/collapsible-filters";
import type { FilterConfig, FilterGroup } from "@/lib/types";

const DEFAULT_IDS = ["ggr", "retention_rate", "ngr", "crm_spend", "arpu", "conversion_rate"];

export function SelectedKpiTile() {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem("analyticsSelectedTile");
      return saved ? JSON.parse(saved) : DEFAULT_IDS;
    } catch {
      return DEFAULT_IDS;
    }
  });

  const metricsMap = useMemo(() => {
    const map: Record<string, RetentionMetric> = {} as any;
    for (const m of retentionMetrics) map[m.id] = m as any;
    return map;
  }, []);

  const apply = () => {
    try { localStorage.setItem("analyticsSelectedTile", JSON.stringify(selected)); } catch {}
    setOpen(false);
  };

  const toggle = (id: string, checked: boolean) => {
    setSelected(prev => checked ? Array.from(new Set([...prev, id])).slice(0, 6) : prev.filter(x => x !== id));
  };

  return (
    <Card>
      <CardHeader className="pb-3 flex flex-row items-center justify-between">
        <div>
          <CardTitle>Избранные метрики</CardTitle>
          <CardDescription>Быстрый доступ к важным KPI. До 6 метрик.</CardDescription>
        </div>
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
      </CardHeader>
      <CardContent>
        <div className="grid gap-3 md:grid-cols-3 lg:grid-cols-6">
          {selected.map((id) => {
            const m = metricsMap[id];
            if (!m) return null;
            const up = m.trend === 'up';
            return (
              <div key={id} className={`rounded-lg border p-3 ${up ? 'bg-green-50 border-green-200' : m.trend === 'down' ? 'bg-red-50 border-red-200' : 'bg-background'}`}>
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