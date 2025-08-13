"use client";

import { useEffect, useState } from "react";
import { FullMetricsDashboard } from "@/components/dashboard/full-metrics-dashboard";
import { SelectedKpiTile } from "@/components/analytics/analytics-filters";
import { RisksAndWarnings } from "@/components/dashboard/risks-and-warnings";
import { DataAccessLevels } from "@/components/dashboard/data-access-levels";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowRight, Filter, TrendingUp, AlertCircle, Lightbulb, BarChart3, Users } from "lucide-react";
import Link from "next/link";
import type { FilterConfig } from "@/lib/types";
import { verticalsData, type VerticalKey } from "@/lib/verticals-data";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { retentionMetrics } from "@/lib/retention-metrics-data";
import { Progress } from "@/components/ui/progress";
import { MultiSelect } from "@/components/ui/multi-select";
import { Label } from "@/components/ui/label";

export default function CommandCenterPage() {
  const [savedFilters, setSavedFilters] = useState<FilterConfig | null>(null);
  const [goalsOpen, setGoalsOpen] = useState(false);
  const [metricGoals, setMetricGoals] = useState<Record<string, number>>({});
  const [tempGoals, setTempGoals] = useState<Record<string, number>>({});

  useEffect(() => {
    // Загружаем сохраненные фильтры из localStorage
    const filters = localStorage.getItem('analyticsFilters');
    if (filters) {
      setSavedFilters(JSON.parse(filters));
    }
    const storedGoals = localStorage.getItem('metricGoals');
    if (storedGoals) {
      setMetricGoals(JSON.parse(storedGoals));
    }
  }, []);

  // Быстрые справочники и синхронизация фильтров
  const projectOptions = [
    { value: 'main', label: 'Основной проект', icon: 'https://placehold.co/24x24/7C3AED/FFF?text=A' },
    { value: 'vip', label: 'VIP Casino', icon: 'https://placehold.co/24x24/F59E0B/FFF?text=V' },
    { value: 'sport', label: 'Sport Betting', icon: 'https://placehold.co/24x24/10B981/FFF?text=S' },
    { value: 'poker', label: 'Poker Room', icon: 'https://placehold.co/24x24/EF4444/FFF?text=P' },
  ];
  const geoOptions = [
    { value: 'de', label: 'Германия' },
    { value: 'fr', label: 'Франция' },
    { value: 'it', label: 'Италия' },
    { value: 'es', label: 'Испания' },
    { value: 'uk', label: 'Великобритания' },
    { value: 'pl', label: 'Польша' },
    { value: 'nl', label: 'Нидерланды' },
    { value: 'pt', label: 'Португалия' },
    { value: 'ru', label: 'Россия' },
    { value: 'ua', label: 'Украина' }
  ];

  const updateSavedFilters = (next: FilterConfig) => {
    setSavedFilters(next);
    try { localStorage.setItem('analyticsFilters', JSON.stringify(next)); } catch {}
  };

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
        <div className="flex items-center gap-2">
          <BarChart3 className="h-8 w-8 text-primary" />
          <h1 className="text-3xl font-bold tracking-tight">Командный центр</h1>
        </div>
        <p className="text-muted-foreground">
          Полный мониторинг 25 ключевых метрик эффективности ретеншена и AI-рекомендации
        </p>
      </div>

      {/* Цели по метрикам */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Цели по ключевым метрикам</CardTitle>
              <CardDescription>Отслеживайте прогресс по целевым значениям</CardDescription>
            </div>
            <Dialog open={goalsOpen} onOpenChange={setGoalsOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm">Добавить / изменить цели</Button>
              </DialogTrigger>
              <DialogContent className="max-w-3xl">
                <DialogHeader>
                  <DialogTitle>Настройка целей</DialogTitle>
                </DialogHeader>
                <div className="grid gap-3 max-h-[60vh] overflow-y-auto">
                  {retentionMetrics.map(m => (
                    <div key={m.id} className="grid grid-cols-3 items-center gap-3">
                      <label className="col-span-1 text-sm">{m.name}</label>
                      <Input
                        type="number"
                        className="col-span-2"
                        placeholder={m.unit === '€' ? 'Цель, €' : 'Цель'}
                        value={tempGoals[m.id] ?? metricGoals[m.id] ?? ''}
                        onChange={(e) => setTempGoals(prev => ({ ...prev, [m.id]: Number(e.target.value) }))}
                      />
                    </div>
                  ))}
                </div>
                <div className="flex justify-end gap-2 pt-2">
                  <Button variant="outline" onClick={() => { setTempGoals({}); setGoalsOpen(false); }}>Отмена</Button>
                  <Button onClick={() => { const next = { ...metricGoals, ...tempGoals }; setMetricGoals(next); localStorage.setItem('metricGoals', JSON.stringify(next)); setGoalsOpen(false); }}>Сохранить цели</Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          {Object.keys(metricGoals).length === 0 ? (
            <p className="text-sm text-muted-foreground">Цели ещё не заданы. Нажмите «Добавить / изменить цели», чтобы установить цели по метрикам.</p>
          ) : (
            <div className="overflow-auto rounded border">
              <table className="w-full text-sm">
                <thead className="bg-muted">
                  <tr>
                    <th className="px-3 py-2 text-left">Метрика</th>
                    <th className="px-3 py-2 text-right">Текущие</th>
                    <th className="px-3 py-2 text-right">Цель</th>
                    <th className="px-3 py-2 text-left">Прогресс</th>
                  </tr>
                </thead>
                <tbody>
                  {Object.entries(metricGoals).map(([id, target]) => {
                    const m = retentionMetrics.find(x => x.id === id);
                    if (!m) return null;
                    const current = Number(m.value);
                    const progress = Math.min(150, (current / (target || 1)) * 100);
                    const color = progress >= 100 ? 'text-green-600' : progress >= 80 ? 'text-yellow-600' : 'text-red-600';
                    return (
                      <tr key={id} className="border-t">
                        <td className="px-3 py-2">{m.name}</td>
                        <td className="px-3 py-2 text-right">{m.unit === '€' ? `€${current.toLocaleString()}` : `${current}${m.unit || ''}`}</td>
                        <td className="px-3 py-2 text-right">{m.unit === '€' ? `€${Number(target).toLocaleString()}` : `${target}${m.unit || ''}`}</td>
                        <td className="px-3 py-2">
                          <div className="flex items-center gap-3">
                            <Progress value={progress} className="w-56" />
                            <span className={`font-medium ${color}`}>{progress.toFixed(0)}%</span>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Избранные метрики (как на странице аналитики) */}
      <SelectedKpiTile />

      {/* Полный дашборд метрик - главный блок */}
      <FullMetricsDashboard filters={savedFilters || undefined} />

      {/* Блок с уровнями доступа к данным */}
      <DataAccessLevels />

      {/* AI Инсайты и быстрые действия */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Lightbulb className="h-5 w-5 text-primary" />
              <CardTitle>AI Рекомендации</CardTitle>
            </div>
            <CardDescription>
              Персонализированные советы на основе метрик
            </CardDescription>
          </CardHeader>
          <CardContent>
            {/* Быстрые фильтры: Проект(ы) и ГЕО */}
            <div className="grid gap-3 md:grid-cols-2 mb-4">
              <div className="space-y-2">
                <Label>Проекты</Label>
                <MultiSelect
                  options={projectOptions}
                  selected={(savedFilters?.projects as string[]) || (savedFilters?.projectBrand ? [savedFilters.projectBrand] : [])}
                  onChange={(selected) => updateSavedFilters({ ...(savedFilters || {}), projects: selected })}
                  placeholder="Выбрать проект(ы)"
                  showSelectAll
                  selectAllLabel="Выбрать все"
                  summaryFormatter={(count) => `Выбрано: ${count} проектов`}
                />
              </div>
              <div className="space-y-2">
                <Label>ГЕО</Label>
                <MultiSelect
                  options={geoOptions}
                  selected={savedFilters?.countries || []}
                  onChange={(selected) => updateSavedFilters({ ...(savedFilters || {}), countries: selected })}
                  placeholder="Выберите страны"
                  showSelectAll
                  selectAllLabel="Выбрать все"
                />
              </div>
            </div>
            <div className="space-y-3">
              {[{
                title: 'Срочно: Запустить кампанию реактивации',
                desc: 'Retention Rate упал ниже 65% - требуются меры',
                priority: 'urgent',
                impact: '+2.5% Retention'
              }, {
                title: 'Оптимизировать бонусную программу',
                desc: 'Bonus Utilization Rate 71% - есть потенциал роста',
                priority: 'recommended',
                impact: '+3% GGR'
              }, {
                title: 'Усилить работу с VIP-сегментом',
                desc: 'VIP Conversion Rate 8.3% ниже целевых 10%',
                priority: 'optional',
                impact: '+1% NGR'
              }].map((rec, i) => (
                <button key={i} className="w-full text-left p-3 rounded-lg border bg-background hover:bg-muted transition">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium">{rec.title}</p>
                    <span className={`text-xs px-2 py-0.5 rounded ${rec.priority === 'urgent' ? 'bg-destructive/10 text-destructive' : rec.priority === 'recommended' ? 'bg-primary/10 text-primary' : 'bg-muted text-muted-foreground'}`}>
                      {rec.priority === 'urgent' ? 'Срочно' : rec.priority === 'recommended' ? 'Рекомендуется' : 'Можно отложить'}
                    </span>
                  </div>
                  <div className="mt-1 text-xs text-muted-foreground">{rec.desc}</div>
                  <div className="mt-2 text-xs font-medium text-green-600">Ожидаемый эффект: {rec.impact}</div>
                </button>
              ))}
              <Button variant="default" size="sm" className="w-full" asChild>
                <Link href="/builder">
                  Создать сценарий
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Filter className="h-5 w-5 text-muted-foreground" />
              <CardTitle>Фильтры и настройки</CardTitle>
            </div>
            <CardDescription>
              Активные фильтры аналитики
            </CardDescription>
          </CardHeader>
          <CardContent>
            {savedFilters ? (
              <div className="space-y-3">
                <p className="text-sm text-muted-foreground">
                  {getFilterSummary(savedFilters)}
                </p>
                <div className="flex flex-wrap gap-2">
                  {savedFilters.vertical && (
                    <Badge variant="secondary">
                      {verticalsData[savedFilters.vertical as VerticalKey]?.label}
                    </Badge>
                  )}
                  {savedFilters.games && savedFilters.games.slice(0, 3).map((game) => (
                    <Badge key={game} variant="outline">
                      {savedFilters.vertical && 
                        verticalsData[savedFilters.vertical as VerticalKey]?.games.find(g => g.value === game)?.label || game
                      }
                    </Badge>
                  ))}
                  {savedFilters.games && savedFilters.games.length > 3 && (
                    <Badge variant="outline">+{savedFilters.games.length - 3}</Badge>
                  )}
                  {Array.isArray(savedFilters.projects) && savedFilters.projects.slice(0,3).map((p) => (
                    <Badge key={p} variant="outline">{p}</Badge>
                  ))}
                  {savedFilters.projects && (savedFilters.projects as string[]).length > 3 && (
                    <Badge variant="outline">+{(savedFilters.projects as string[]).length - 3}</Badge>
                  )}
                  {Array.isArray(savedFilters.countries) && savedFilters.countries.slice(0,3).map((c) => (
                    <Badge key={c} variant="outline">{c.toUpperCase()}</Badge>
                  ))}
                  {savedFilters.countries && (savedFilters.countries as string[]).length > 3 && (
                    <Badge variant="outline">+{(savedFilters.countries as string[]).length - 3}</Badge>
                  )}
                </div>
                <Button asChild variant="outline" size="sm" className="w-full">
                  <Link href="/analytics">
                    Изменить фильтры
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            ) : (
              <div className="text-center py-2">
                <p className="text-sm text-muted-foreground mb-3">
                  Настройте фильтры для персонализации
                </p>
                <Button asChild variant="default" size="sm" className="w-full">
                  <Link href="/analytics">
                    Настроить
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-warning" />
              <CardTitle>Быстрые действия</CardTitle>
            </div>
            <CardDescription>
              Рекомендуемые действия
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Button variant="outline" size="sm" className="w-full justify-start" asChild>
                <Link href="/segments">
                  <Users className="mr-2 h-4 w-4" />
                  Управление сегментами
                </Link>
              </Button>
              <Button variant="outline" size="sm" className="w-full justify-start" asChild>
                <Link href="/builder">
                  <TrendingUp className="mr-2 h-4 w-4" />
                  Создать кампанию
                </Link>
              </Button>
              <Button variant="secondary" size="sm" className="w-full justify-start" asChild>
                <Link href="/builder?template=reactivation">
                  <TrendingUp className="mr-2 h-4 w-4" />
                  Создать по шаблону: Реактивация
                </Link>
              </Button>
              <Button variant="outline" size="sm" className="w-full justify-start" asChild>
                <Link href="/reports">
                  <BarChart3 className="mr-2 h-4 w-4" />
                  Экспорт отчетов
                </Link>
              </Button>
              <div className="text-xs text-muted-foreground mt-2">
                AI-подсказка: Создать сегмент «VIP 80% активности» для бонусной кампании.
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* AI предупреждения и риски */}
      <RisksAndWarnings />
    </div>
  );
}