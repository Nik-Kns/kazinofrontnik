"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { KpiGrid } from "@/components/dashboard/kpi-grid";
import { AnalyticsCharts } from "@/components/dashboard/analytics-charts";
import { EnhancedFilters } from "@/components/ui/enhanced-filters";
import { KPISummary } from "@/components/dashboard/kpi-summary";
import { FlexibleCharts } from "@/components/analytics/flexible-charts";
import { SegmentMetricsTable } from "@/components/analytics/segment-metrics-table";
import { AlertsAndSignals } from "@/components/analytics/alerts-and-signals";
import { CampaignDeepAnalytics } from "@/components/analytics/campaign-deep-analytics";
import { HandCoins, TrendingUp, Users, BarChart3, Activity } from "lucide-react";
import { CampaignPerformanceTable } from "@/components/analytics/campaign-performance-table";
import { RetentionMetricsDashboard } from "@/components/analytics/retention-metrics-dashboard";
import { useState } from "react";
import type { FilterConfig } from "@/lib/types";
import { SelectedKpiTile } from "@/components/analytics/analytics-filters";
import { ChevronDown, ChevronUp } from "lucide-react";

function CollapsibleSection({ id, title, children }: { id: string; title: string; children: React.ReactNode }) {
  const [open, setOpen] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem(`analytics_section_${id}`);
      return saved ? JSON.parse(saved) : true;
    } catch {
      return true;
    }
  });
  const toggle = () => {
    const next = !open;
    setOpen(next);
    try { localStorage.setItem(`analytics_section_${id}`, JSON.stringify(next)); } catch {}
  };
  return (
    <Card>
      <CardHeader className="pb-3 flex flex-row items-center justify-between">
        <div>
          <CardTitle>{title}</CardTitle>
          {!open && <CardDescription>Секция скрыта</CardDescription>}
        </div>
        <button onClick={toggle} className="text-sm px-2 py-1 rounded border hover:bg-muted transition">
          {open ? <><ChevronUp className="inline h-4 w-4 mr-1"/>Свернуть</> : <><ChevronDown className="inline h-4 w-4 mr-1"/>Развернуть</>}
        </button>
      </CardHeader>
      {open && <CardContent>{children}</CardContent>}
    </Card>
  );
}

export default function AnalyticsPage() {
  const [activeFilters, setActiveFilters] = useState<FilterConfig>(() => {
    try {
      const saved = localStorage.getItem('analyticsFilters');
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  const handleFiltersChange = (filters: FilterConfig) => {
    setActiveFilters(filters);
    // Сохраняем фильтры в localStorage для использования на главной
    localStorage.setItem('analyticsFilters', JSON.stringify(filters));
    console.log('Фильтры аналитики обновлены:', filters);
  };

  const handleExport = (format: 'pdf' | 'excel') => {
    // TODO: Реализовать экспорт
    console.log(`Экспорт в ${format}`);
  };

  return (
    <div className="flex flex-col gap-6 p-4 md:p-6 lg:p-8">
      <div className="flex flex-col gap-4">
        <h1 className="text-2xl font-bold tracking-tight">Аналитика</h1>
        <p className="text-muted-foreground">
          Полный контроль над метриками казино. Настраиваемые дашборды, глубокая аналитика и экспорт отчетов.
        </p>
      </div>

      {/* Расширенные фильтры с экспортом */}
      <EnhancedFilters 
        onApply={handleFiltersChange} 
        onExport={handleExport}
        defaultFilters={activeFilters}
      />

      {/* Пользовательская плитка KPI */}
      <SelectedKpiTile />

      <Tabs defaultValue="kpi-summary">
        <TabsList className="mb-4 grid w-full grid-cols-5">
          <TabsTrigger value="kpi-summary"><Activity className="mr-2 h-4 w-4" />KPI Summary</TabsTrigger>
          <TabsTrigger value="retention"><TrendingUp className="mr-2 h-4 w-4" />Retention</TabsTrigger>
          <TabsTrigger value="crm"><Users className="mr-2 h-4 w-4" />CRM</TabsTrigger>
          <TabsTrigger value="finance"><HandCoins className="mr-2 h-4 w-4" />Финансы</TabsTrigger>
          <TabsTrigger value="detailed"><BarChart3 className="mr-2 h-4 w-4" />25 метрик</TabsTrigger>
        </TabsList>

        <TabsContent value="kpi-summary" className="space-y-6">
          <CollapsibleSection id="kpi-summary-overview" title="KPI Summary">
            <KPISummary 
              filters={activeFilters}
              segment={activeFilters.segments?.[0]}
            />
          </CollapsibleSection>
          <CollapsibleSection id="alerts-signals" title="Сигналы и уведомления">
            <AlertsAndSignals />
          </CollapsibleSection>
          <CollapsibleSection id="flexible-charts" title="Динамика метрик">
            <FlexibleCharts filters={activeFilters} />
          </CollapsibleSection>
          <CollapsibleSection id="segment-metrics" title="Метрики по сегментам">
            <SegmentMetricsTable />
          </CollapsibleSection>
        </TabsContent>

        <TabsContent value="retention" className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle>Ключевые метрики Retention</CardTitle>
                    <CardDescription>Обзор показателей удержания пользователей.</CardDescription>
                </CardHeader>
                <CardContent>
                    <KpiGrid />
                </CardContent>
            </Card>
            <AnalyticsCharts />
        </TabsContent>

        <TabsContent value="crm" className="space-y-6">
            <CampaignPerformanceTable />
            <CampaignDeepAnalytics />
            <AlertsAndSignals />
        </TabsContent>

        <TabsContent value="finance" className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle>Ключевые финансовые метрики</CardTitle>
                    <CardDescription>Обзор финансовых показателей, связанных с CRM-активностями.</CardDescription>
                </CardHeader>
                <CardContent>
                    <KpiGrid />
                </CardContent>
            </Card>
             <AnalyticsCharts />
        </TabsContent>

        <TabsContent value="detailed" className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle>Подробная аналитика и мониторинг эффективности ретеншена</CardTitle>
                    <CardDescription>
                        25 важнейших показателей и их рекомендуемые значения для различных сегментов игроков. 
                        Эффективное удержание игроков требует глубокого и регулярного анализа ключевых метрик.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <RetentionMetricsDashboard />
                </CardContent>
            </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
