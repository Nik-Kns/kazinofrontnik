"use client";

import * as React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DatePickerWithRange } from "@/components/ui/date-picker-with-range";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { 
  Settings, 
  Filter, 
  Download, 
  Save, 
  RotateCcw, 
  TrendingUp, 
  TrendingDown, 
  Minus,
  ChevronDown,
  ChevronUp,
  BarChart3,
  PieChart,
  Users,
  Target,
  Zap,
  ArrowUpRight,
  ArrowDownRight,
  Info,
  BookmarkPlus,
  Eye,
  FileDown
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { 
  AnalyticsFilters, 
  AnalyticsTimeRange, 
  CampaignKPI, 
  CampaignFunnel, 
  CompanyAnalytics,
  SegmentAnalytics,
  TemplateAnalytics,
  SavedAnalyticsView 
} from "@/lib/types";
import { 
  companyAnalyticsData, 
  segmentAnalyticsData, 
  templateAnalyticsData, 
  savedAnalyticsViews 
} from "@/lib/campaign-analytics-data";

export default function CampaignAnalyticsPage() {
  const [activeTab, setActiveTab] = React.useState("company");
  const [isFiltersOpen, setIsFiltersOpen] = React.useState(false);
  const [isKpiConfigOpen, setIsKpiConfigOpen] = React.useState(false);
  const [selectedKpis, setSelectedKpis] = React.useState<string[]>(['ggr', 'retention_d7', 'arpu', 'conversion_rate', 'ltv']);
  const [savedViews, setSavedViews] = React.useState<SavedAnalyticsView[]>(savedAnalyticsViews);
  
  const [filters, setFilters] = React.useState<AnalyticsFilters>({
    period: { type: "D30" },
    projects: ["casinox", "luckywheel"],
    geo: ["DE", "RU"],
    channels: [],
    devices: [],
    vipLevels: [],
    languages: [],
    gameProviders: []
  });

  const handleKpiToggle = (kpiId: string) => {
    setSelectedKpis(prev => 
      prev.includes(kpiId) 
        ? prev.filter(id => id !== kpiId)
        : [...prev, kpiId]
    );
  };

  const handleFilterReset = () => {
    setFilters({
      period: { type: "D30" },
      projects: [],
      geo: [],
      channels: [],
      devices: [],
      vipLevels: [],
      languages: [],
      gameProviders: []
    });
  };

  const handleSaveView = () => {
    const newView: SavedAnalyticsView = {
      id: `view_${Date.now()}`,
      name: `Custom View ${savedViews.length + 1}`,
      type: activeTab as "company" | "segment" | "template",
      filters,
      selectedKpis,
      createdAt: new Date().toISOString(),
      userId: 'current_user'
    };
    setSavedViews(prev => [...prev, newView]);
  };

  const getKpiIcon = (status: string) => {
    switch (status) {
      case 'good': return <TrendingUp className="h-4 w-4 text-green-600" />;
      case 'warning': return <Minus className="h-4 w-4 text-yellow-600" />;
      case 'critical': return <TrendingDown className="h-4 w-4 text-red-600" />;
      default: return <Minus className="h-4 w-4 text-gray-600" />;
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return <ArrowUpRight className="h-3 w-3 text-green-600" />;
      case 'down': return <ArrowDownRight className="h-3 w-3 text-red-600" />;
      default: return <Minus className="h-3 w-3 text-gray-600" />;
    }
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Аналитика кампаний</h1>
          <p className="text-muted-foreground">
            Глубинная аналитика эффективности по компаниям, сегментам и шаблонам
          </p>
        </div>
        
        {/* Global Actions */}
        <div className="flex items-center gap-2">
          <Sheet open={isFiltersOpen} onOpenChange={setIsFiltersOpen}>
            <SheetTrigger asChild>
              <Button variant="outline" size="sm">
                <Filter className="h-4 w-4 mr-2" />
                Фильтры
                {(filters.projects.length > 0 || filters.geo.length > 0) && (
                  <Badge variant="secondary" className="ml-2">{filters.projects.length + filters.geo.length}</Badge>
                )}
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-96">
              <SheetHeader>
                <SheetTitle>Глобальные фильтры</SheetTitle>
                <SheetDescription>
                  Настройте фильтры для всех вкладок аналитики
                </SheetDescription>
              </SheetHeader>
              <div className="py-6 space-y-6">
                <GlobalFilters filters={filters} setFilters={setFilters} />
                <Separator />
                <div className="flex gap-2">
                  <Button onClick={() => setIsFiltersOpen(false)}>Применить</Button>
                  <Button variant="outline" onClick={handleFilterReset}>
                    <RotateCcw className="h-4 w-4 mr-2" />
                    Сбросить
                  </Button>
                </div>
              </div>
            </SheetContent>
          </Sheet>

          <Button variant="outline" size="sm" onClick={handleSaveView}>
            <BookmarkPlus className="h-4 w-4 mr-2" />
            Сохранить вид
          </Button>

          <Button variant="outline" size="sm">
            <FileDown className="h-4 w-4 mr-2" />
            Экспорт
          </Button>
        </div>
      </div>

      {/* Active Filters */}
      <ActiveFilters filters={filters} />

      {/* Saved Views */}
      <SavedViews views={savedViews} onLoadView={setFilters} />

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="company">Компания</TabsTrigger>
          <TabsTrigger value="segments">Сегменты</TabsTrigger>
          <TabsTrigger value="templates">Шаблоны</TabsTrigger>
        </TabsList>

        <TabsContent value="company" className="space-y-6">
          <CompanyAnalyticsTab 
            data={companyAnalyticsData} 
            selectedKpis={selectedKpis}
            onKpiToggle={handleKpiToggle}
          />
        </TabsContent>

        <TabsContent value="segments" className="space-y-6">
          <SegmentAnalyticsTab data={segmentAnalyticsData} />
        </TabsContent>

        <TabsContent value="templates" className="space-y-6">
          <TemplateAnalyticsTab data={templateAnalyticsData} />
        </TabsContent>
      </Tabs>
    </div>
  );
}

// Global Filters Component
function GlobalFilters({ 
  filters, 
  setFilters 
}: { 
  filters: AnalyticsFilters; 
  setFilters: (filters: AnalyticsFilters) => void; 
}) {
  const periodOptions: { value: AnalyticsTimeRange; label: string }[] = [
    { value: "D7", label: "Последние 7 дней" },
    { value: "D30", label: "Последние 30 дней" },
    { value: "QTD", label: "Квартал до даты" },
    { value: "MTD", label: "Месяц до даты" },
    { value: "YTD", label: "Год до даты" },
    { value: "custom", label: "Кастомный период" }
  ];

  return (
    <div className="space-y-6">
      {/* Period */}
      <div className="space-y-2">
        <Label>Период</Label>
        <Select 
          value={filters.period.type} 
          onValueChange={(value: AnalyticsTimeRange) => 
            setFilters({ ...filters, period: { type: value } })
          }
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {periodOptions.map(option => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Projects */}
      <div className="space-y-2">
        <Label>Проекты</Label>
        <div className="space-y-2">
          {['casinox', 'luckywheel', 'goldenplay', 'aigaming'].map(project => (
            <div key={project} className="flex items-center space-x-2">
              <Checkbox 
                id={project}
                checked={filters.projects.includes(project)}
                onCheckedChange={(checked) => {
                  if (checked) {
                    setFilters({ ...filters, projects: [...filters.projects, project] });
                  } else {
                    setFilters({ ...filters, projects: filters.projects.filter(p => p !== project) });
                  }
                }}
              />
              <Label htmlFor={project} className="capitalize">{project}</Label>
            </div>
          ))}
        </div>
      </div>

      {/* GEO */}
      <div className="space-y-2">
        <Label>География</Label>
        <div className="space-y-2">
          {['DE', 'RU', 'EN', 'FR', 'ES', 'IT'].map(geo => (
            <div key={geo} className="flex items-center space-x-2">
              <Checkbox 
                id={geo}
                checked={filters.geo.includes(geo)}
                onCheckedChange={(checked) => {
                  if (checked) {
                    setFilters({ ...filters, geo: [...filters.geo, geo] });
                  } else {
                    setFilters({ ...filters, geo: filters.geo.filter(g => g !== geo) });
                  }
                }}
              />
              <Label htmlFor={geo}>{geo}</Label>
            </div>
          ))}
        </div>
      </div>

      {/* Channels */}
      <div className="space-y-2">
        <Label>Каналы</Label>
        <div className="space-y-2">
          {['email', 'push', 'sms', 'telegram', 'inapp'].map(channel => (
            <div key={channel} className="flex items-center space-x-2">
              <Checkbox 
                id={channel}
                checked={filters.channels.includes(channel)}
                onCheckedChange={(checked) => {
                  if (checked) {
                    setFilters({ ...filters, channels: [...filters.channels, channel] });
                  } else {
                    setFilters({ ...filters, channels: filters.channels.filter(c => c !== channel) });
                  }
                }}
              />
              <Label htmlFor={channel} className="capitalize">{channel}</Label>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// Active Filters Component
function ActiveFilters({ filters }: { filters: AnalyticsFilters }) {
  const hasActiveFilters = filters.projects.length > 0 || filters.geo.length > 0 || filters.channels.length > 0;

  if (!hasActiveFilters) return null;

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-sm">Активные фильтры</CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="flex flex-wrap gap-2">
          <Badge variant="secondary">{filters.period.type}</Badge>
          {filters.projects.map(project => (
            <Badge key={project} variant="outline">Проект: <span>{project}</span></Badge>
          ))}
          {filters.geo.map(geo => (
            <Badge key={geo} variant="outline">GEO: <span>{geo}</span></Badge>
          ))}
          {filters.channels.map(channel => (
            <Badge key={channel} variant="outline">Канал: <span>{channel}</span></Badge>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

// Saved Views Component
function SavedViews({ 
  views, 
  onLoadView 
}: { 
  views: SavedAnalyticsView[]; 
  onLoadView: (filters: AnalyticsFilters) => void; 
}) {
  if (views.length === 0) return null;

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-sm">Сохранённые виды</CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="flex gap-2 overflow-x-auto">
          {views.slice(0, 5).map(view => (
            <Button 
              key={view.id} 
              variant="outline" 
              size="sm" 
              onClick={() => onLoadView(view.filters)}
              className="whitespace-nowrap"
            >
              <Eye className="h-3 w-3 mr-1" />
              {view.name}
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

// Company Analytics Tab
function CompanyAnalyticsTab({ 
  data, 
  selectedKpis, 
  onKpiToggle 
}: { 
  data: CompanyAnalytics; 
  selectedKpis: string[]; 
  onKpiToggle: (kpiId: string) => void; 
}) {
  return (
    <div className="space-y-6">
      <KpiTilesGrid kpis={data.kpis} selectedKpis={selectedKpis} onKpiToggle={onKpiToggle} />
      <FunnelsSection funnels={data.funnels} />
      <InsightsSection insights={data.insights} />
    </div>
  );
}

// Segment Analytics Tab
function SegmentAnalyticsTab({ data }: { data: SegmentAnalytics }) {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            {data.segmentName}
          </CardTitle>
          <CardDescription>
            {data.totalUsers.toLocaleString()} <span>игроков в сегменте</span>
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {data.kpis.map(kpi => (
              <KpiCard key={kpi.id} kpi={kpi} />
            ))}
          </div>
        </CardContent>
      </Card>
      
      {data.funnels.map(funnel => (
        <FunnelCard key={funnel.id} funnel={funnel} />
      ))}
    </div>
  );
}

// Template Analytics Tab
function TemplateAnalyticsTab({ data }: { data: TemplateAnalytics }) {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5" />
            {data.templateName}
          </CardTitle>
          <CardDescription>
            Тип: <span>{data.type}</span> • Версия: <span>{data.currentVersion}</span>
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {data.kpis.map(kpi => (
              <KpiCard key={kpi.id} kpi={kpi} />
            ))}
          </div>
        </CardContent>
      </Card>
      
      <FunnelCard funnel={data.funnel} />
      <InsightsSection insights={data.insights} />
    </div>
  );
}

// KPI Tiles Grid Component
function KpiTilesGrid({ 
  kpis, 
  selectedKpis, 
  onKpiToggle 
}: { 
  kpis: CampaignKPI[]; 
  selectedKpis: string[]; 
  onKpiToggle: (kpiId: string) => void; 
}) {
  const [isConfigOpen, setIsConfigOpen] = React.useState(false);

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Ключевые метрики</CardTitle>
          <CardDescription>
            Выбрано {selectedKpis.length} из {kpis.length} <span>метрик</span>
          </CardDescription>
        </div>
        <Dialog open={isConfigOpen} onOpenChange={setIsConfigOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" size="sm">
              <Settings className="h-4 w-4 mr-2" />
              Настроить
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Настройка KPI</DialogTitle>
              <DialogDescription>
                Выберите метрики для отображения на дашборде
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 max-h-96 overflow-y-auto">
              {kpis.map(kpi => (
                <div key={kpi.id} className="flex items-center space-x-2">
                  <Checkbox 
                    id={kpi.id}
                    checked={selectedKpis.includes(kpi.id)}
                    onCheckedChange={() => onKpiToggle(kpi.id)}
                  />
                  <Label htmlFor={kpi.id} className="flex-1">
                    <div className="font-medium">{kpi.name}</div>
                    {kpi.description && (
                      <div className="text-sm text-muted-foreground">{kpi.description}</div>
                    )}
                  </Label>
                </div>
              ))}
            </div>
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {kpis.filter(kpi => selectedKpis.includes(kpi.id)).map(kpi => (
            <KpiCard key={kpi.id} kpi={kpi} />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

// KPI Card Component
function KpiCard({ kpi }: { kpi: CampaignKPI }) {
  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-muted-foreground">{kpi.name}</span>
          {getKpiIcon(kpi.status)}
        </div>
        <div className="space-y-1">
          <div className="text-2xl font-bold">{kpi.value}</div>
          <div className="flex items-center gap-2 text-sm">
            {getTrendIcon(kpi.trend)}
            <span className={cn(
              kpi.change > 0 ? "text-green-600" : kpi.change < 0 ? "text-red-600" : "text-gray-600"
            )}>
              {kpi.change > 0 ? "+" : ""}{kpi.change}%
            </span>
            {kpi.benchmark && (
              <Badge variant="outline" className="text-xs">
                Benchmark: <span>{kpi.benchmark}{kpi.unit}</span>
              </Badge>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// Funnels Section Component
function FunnelsSection({ funnels }: { funnels: CampaignFunnel[] }) {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Воронки конверсии</h3>
      <div className="space-y-4">
        {funnels.map(funnel => (
          <FunnelCard key={funnel.id} funnel={funnel} />
        ))}
      </div>
    </div>
  );
}

// Funnel Card Component
function FunnelCard({ funnel }: { funnel: CampaignFunnel }) {
  const [isExpanded, setIsExpanded] = React.useState(false);

  return (
    <Card>
      <Collapsible open={isExpanded} onOpenChange={setIsExpanded}>
        <CollapsibleTrigger asChild>
          <CardHeader className="cursor-pointer hover:bg-muted/50">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  {funnel.name}
                </CardTitle>
                <CardDescription>
                  {funnel.totalUsers.toLocaleString()} <span>пользователей</span> • {funnel.conversionRate}% <span>конверсия</span>
                </CardDescription>
              </div>
              {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </div>
          </CardHeader>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <CardContent>
            <div className="space-y-4">
              {funnel.steps.map((step, index) => (
                <div key={step.id} className="flex items-center gap-4">
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-medium">{step.name}</span>
                      <span className="text-sm text-muted-foreground">{step.rate}%</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div 
                        className="bg-primary h-2 rounded-full transition-all duration-500"
                        style={{ width: `${step.rate}%` }}
                      />
                    </div>
                    <div className="flex items-center justify-between mt-1 text-xs text-muted-foreground">
                      <span>{step.value.toLocaleString()} <span>пользователей</span></span>
                      {step.benchmark && (
                        <span>Benchmark: <span>{step.benchmark}%</span></span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  );
}

// Insights Section Component
function InsightsSection({ insights }: { insights: string[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Info className="h-5 w-5" />
          AI Инсайты
        </CardTitle>
        <CardDescription>
          Автоматически выявленные паттерны и рекомендации
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {insights.map((insight, index) => (
            <div key={index} className="flex items-start gap-3 p-3 bg-muted/30 rounded-lg">
              <div className="h-2 w-2 rounded-full bg-primary mt-2 flex-shrink-0" />
              <p className="text-sm">{insight}</p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

function getKpiIcon(status: string) {
  switch (status) {
    case 'good': return <TrendingUp className="h-4 w-4 text-green-600" />;
    case 'warning': return <Minus className="h-4 w-4 text-yellow-600" />;
    case 'critical': return <TrendingDown className="h-4 w-4 text-red-600" />;
    default: return <Minus className="h-4 w-4 text-gray-600" />;
  }
}

function getTrendIcon(trend: string) {
  switch (trend) {
    case 'up': return <ArrowUpRight className="h-3 w-3 text-green-600" />;
    case 'down': return <ArrowDownRight className="h-3 w-3 text-red-600" />;
    default: return <Minus className="h-3 w-3 text-gray-600" />;
  }
}
