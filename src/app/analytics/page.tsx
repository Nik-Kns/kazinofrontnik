"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { KpiGrid } from "@/components/dashboard/kpi-grid";
import { AnalyticsCharts } from "@/components/dashboard/analytics-charts";
import { EnhancedFilters } from "@/components/ui/enhanced-filters";
import { KPISummary } from "@/components/dashboard/kpi-summary";
import { FlexibleCharts } from "@/components/analytics/flexible-charts";
import { SegmentMetricsTable } from "@/components/analytics/segment-metrics-table";
import { AlertsAndSignals } from "@/components/analytics/alerts-and-signals";
import { CampaignDeepAnalytics } from "@/components/analytics/campaign-deep-analytics";
import { HandCoins, TrendingUp, Users, BarChart3, Activity, Target } from "lucide-react";
import Link from "next/link";
import { CampaignPerformanceTable } from "@/components/analytics/campaign-performance-table";
import { RetentionMetricsDashboard } from "@/components/analytics/retention-metrics-dashboard";
import { FullMetricsDashboard } from "@/components/dashboard/full-metrics-dashboard";
import { useState } from "react";
import type { FilterConfig } from "@/lib/types";
import { SelectedKpiTile } from "@/components/analytics/analytics-filters";
import { ChevronDown, ChevronUp, AlertTriangle, TrendingUp as TrendingUpIcon, DollarSign, Download, Plus, Sparkles } from "lucide-react";
import { useRouter } from "next/navigation";
import { SectionOnboarding } from "@/components/onboarding/section-onboarding";
import { DASHBOARD_ONBOARDING } from "@/lib/onboarding-configs";
import { TooltipOverlay } from "@/components/onboarding/tooltip-overlay";
import { DASHBOARD_TOOLTIPS_EXTENDED } from "@/lib/tooltip-configs-extended";

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
  const router = useRouter();
  const [isOnboardingOpen, setIsOnboardingOpen] = useState(false);
  const [isTooltipTourActive, setIsTooltipTourActive] = useState(false);
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
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Аналитика</h1>
            <p className="text-muted-foreground">
              Полный контроль над метриками казино. Настраиваемые дашборды, глубокая аналитика и экспорт отчетов.
            </p>
          </div>
          <div className="flex gap-2" data-tooltip="actions">
            <Button
              onClick={() => setIsOnboardingOpen(true)}
              className="flex items-center gap-2"
              variant="outline"
            >
              <Sparkles className="h-4 w-4" />
              Как работать с разделом
            </Button>
            <Button
              onClick={() => router.push('/analytics/custom-metric')}
              className="flex items-center gap-2"
              variant="outline"
            >
              <Plus className="h-4 w-4" />
              Создать кастомную метрику
            </Button>
            <Link href="/analytics/campaigns">
              <Button className="flex items-center gap-2">
                <Target className="h-4 w-4" />
                Аналитика кампаний
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Сворачиваемая панель фильтров */}
      <div data-tooltip="filters">
        <CollapsibleSection id="filters" title="Фильтры и настройки">
          <EnhancedFilters
            onApply={handleFiltersChange}
            onExport={handleExport}
            defaultFilters={activeFilters}
          />
        </CollapsibleSection>
      </div>

      <Tabs defaultValue="overview">
        <TabsList className="mb-4 grid w-full grid-cols-4">
          <TabsTrigger value="overview"><BarChart3 className="mr-2 h-4 w-4" />Обзор Аналитики</TabsTrigger>
          <TabsTrigger value="kpi-summary"><Activity className="mr-2 h-4 w-4" />KPI Summary</TabsTrigger>
          <TabsTrigger value="crm-analytics"><Users className="mr-2 h-4 w-4" />Аналитика CRM</TabsTrigger>
          <TabsTrigger value="all-metrics"><BarChart3 className="mr-2 h-4 w-4" />Все 25 метрик</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Избранные метрики */}
          <div data-tooltip="kpi-cards">
            <SelectedKpiTile />
          </div>

          {/* Карточки-шорткаты для навигации */}
          <div className="grid gap-4 md:grid-cols-3" data-tooltip="charts">
            {/* Карточка Сигналы и Риски */}
            <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => document.querySelector('[value="kpi-summary"]')?.dispatchEvent(new MouseEvent('click', { bubbles: true }))}>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5 text-yellow-500" />
                    Сигналы и Риски
                  </CardTitle>
                  <Badge variant="destructive">3 критических</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">Активных алертов: 12</p>
                <p className="text-sm text-muted-foreground">Требуют внимания: 5</p>
                <Button variant="link" className="p-0 h-auto mt-2">Перейти к сигналам →</Button>
              </CardContent>
            </Card>

            {/* Карточка Эффективность CRM */}
            <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => document.querySelector('[value="crm-analytics"]')?.dispatchEvent(new MouseEvent('click', { bubbles: true }))}>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base flex items-center gap-2">
                    <TrendingUpIcon className="h-5 w-5 text-green-500" />
                    Эффективность CRM
                  </CardTitle>
                  <Badge variant="secondary">ROI 285%</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">Активных кампаний: 24</p>
                <p className="text-sm text-muted-foreground">Конверсия: 12.5%</p>
                <Button variant="link" className="p-0 h-auto mt-2">Анализ кампаний →</Button>
              </CardContent>
            </Card>

            {/* Карточка Финансовые метрики */}
            <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => document.querySelector('[value="all-metrics"]')?.dispatchEvent(new MouseEvent('click', { bubbles: true }))}>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base flex items-center gap-2">
                    <DollarSign className="h-5 w-5 text-blue-500" />
                    Финансовые метрики
                  </CardTitle>
                  <Badge>GGR +15%</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">NGR: €1.2M</p>
                <p className="text-sm text-muted-foreground">ARPU: €125</p>
                <Button variant="link" className="p-0 h-auto mt-2">Все метрики →</Button>
              </CardContent>
            </Card>
          </div>

          {/* Основные KPI карточки */}
          <Card>
            <CardHeader>
              <CardTitle>Ключевые показатели</CardTitle>
              <CardDescription>Сводка основных метрик вашего казино</CardDescription>
            </CardHeader>
            <CardContent>
              <KpiGrid />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="kpi-summary" className="space-y-6">
          <KPISummary 
            filters={activeFilters}
            segment={activeFilters.segments?.[0]}
          />
        </TabsContent>

        <TabsContent value="crm-analytics" className="space-y-6">
          <CampaignPerformanceTable />
          <CampaignDeepAnalytics />
        </TabsContent>

        <TabsContent value="all-metrics" className="space-y-6">
          <CollapsibleSection id="retention-metrics" title="25 ключевых метрик удержания">
            <RetentionMetricsDashboard />
          </CollapsibleSection>
        </TabsContent>
      </Tabs>

      {/* Секция: Глубокий Анализ и Метрики */}
      <CollapsibleSection 
        id="deep-analysis" 
        title="Глубокий Анализ"
      >
        <div className="space-y-6">
          <CollapsibleSection 
            id="full-dashboard" 
            title="Все метрики системы (25 показателей)"
          >
            <FullMetricsDashboard />
          </CollapsibleSection>
        </div>
      </CollapsibleSection>

      {/* Онбординг раздела */}
      <SectionOnboarding
        open={isOnboardingOpen}
        onOpenChange={setIsOnboardingOpen}
        steps={DASHBOARD_ONBOARDING}
        sectionName="Командный центр"
        onStartDetailedTour={() => setIsTooltipTourActive(true)}
      />

      {/* Подсказки на элементах */}
      <TooltipOverlay
        steps={DASHBOARD_TOOLTIPS_EXTENDED}
        isActive={isTooltipTourActive}
        onClose={() => setIsTooltipTourActive(false)}
      />
    </div>
  );
}
