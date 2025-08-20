
"use client";

import * as React from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Activity, ArrowLeft, Bot, BotMessageSquare, CheckCircle, ClipboardCopy, Clock, FileText, GitBranch, Gift, Lightbulb, Mail, MessageSquare, Pencil, PhoneCall, PlusCircle, Smartphone, Sparkles, Star, Trash2, Zap, ChevronDown, ChevronRight, Eye, Calendar, Euro, Users, BarChart3, Filter, TrendingDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Sheet, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle, SheetClose } from '@/components/ui/sheet';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { segmentsData, scenariosData, templatesData, campaignsData } from '@/lib/mock-data';
import type { CampaignData, FunnelData, ABTestVariant, BenchmarkData, BenchmarkMetric, ClipboardItem, ClipboardItemType } from '@/lib/types';
import { ClipboardProvider, useClipboard } from '@/contexts/clipboard-context';
import { CopyMoveContextMenu, CopyMoveDropdownMenu, useKeyboardShortcuts } from '@/components/ui/copy-move-menu';
import { PasteTargetDialog } from '@/components/ui/paste-target-dialog';
import { DragDropWrapper, DropZone } from '@/components/ui/drag-drop-wrapper';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import type { ScenarioData } from '@/lib/types';
import { Textarea } from '@/components/ui/textarea';
import { Slider } from '@/components/ui/slider';

import ReactFlow, {
  Controls,
  MiniMap,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  ReactFlowProvider,
  Handle,
  Position,
  useReactFlow,
  getBezierPath,
  EdgeLabelRenderer,
  BaseEdge,
  type Node,
  type Edge,
  type OnConnect,
} from 'reactflow';
import 'reactflow/dist/style.css';
import { AiCopilotChat } from '@/components/ai/ai-copilot-chat';

// --- Helper components & data for TABS ---

// For "Templates" Tab
const channelIconsTemplates: { [key: string]: React.ElementType } = {
  Email: Mail,
  Push: Smartphone,
  SMS: MessageSquare,
  InApp: Zap,
  "Multi-channel": Zap,
};

const PerformanceStars = ({ count }: { count: number }) => (
  <div className="flex items-center gap-0.5">
    {Array.from({ length: 5 }).map((_, i) => (
      <Star key={i} className={`h-4 w-4 ${i < count ? 'text-yellow-400 fill-yellow-400' : 'text-muted-foreground/50'}`} />
    ))}
  </div>
);

// For "Campaigns" Tab
const channelIconsScenarios: Record<string, React.ElementType> = {
  Email: Mail,
  Push: Smartphone,
  SMS: MessageSquare,
  InApp: Zap,
  "Multi-channel": Zap,
};

const statusColors: { [key: string]: string } = {
  Активен: "bg-success",
  Пауза: "bg-warning",
  Завершён: "bg-muted-foreground",
};

const frequencyColors: { [key: string]: string } = {
  Триггерный: "secondary",
  Регулярный: "default",
  Разовый: "outline",
}

// --- BENCHMARK COMPONENT ---

const BenchmarkComparison = ({ benchmarks, selectedGeo }: { 
  benchmarks: BenchmarkData[]; 
  selectedGeo?: string; 
}) => {
  const [showBenchmarks, setShowBenchmarks] = React.useState(false);
  const [currentGeo, setCurrentGeo] = React.useState(selectedGeo || benchmarks[0]?.geo || 'DE');

  const currentBenchmark = benchmarks.find(b => b.geo === currentGeo) || benchmarks[0];
  
  if (!currentBenchmark) return null;

  const getStatusColor = (status?: string) => {
    switch (status) {
      case 'above': return 'text-green-600 bg-green-50';
      case 'within': return 'text-yellow-600 bg-yellow-50';
      case 'below': return 'text-red-600 bg-red-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const getStatusIcon = (status?: string) => {
    switch (status) {
      case 'above': return '🟢';
      case 'within': return '🟡';
      case 'below': return '🔴';
      default: return '⚪';
    }
  };

  const formatMetricValue = (key: string, value: number) => {
    if (key.includes('rate') || key === 'ctr' || key === 'conversion_rate') {
      return `${value}%`;
    }
    if (key.includes('deposit') || key === 'arpu') {
      return `€${value}`;
    }
    if (key === 'roi') {
      return `${value}x`;
    }
    return value.toString();
  };

  const metricLabels = {
    delivery_rate: 'Delivery Rate',
    open_rate: 'Open Rate',
    ctr: 'CTR',
    click_to_deposit: 'Click-to-Deposit',
    conversion_rate: 'Conversion Rate',
    avg_deposit: 'Avg Deposit',
    arpu: 'ARPU',
    roi: 'ROI'
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Button 
          variant="outline" 
          size="sm"
          onClick={() => setShowBenchmarks(!showBenchmarks)}
          className="flex items-center gap-2"
        >
          <BarChart3 className="h-4 w-4" />
          {showBenchmarks ? 'Скрыть бенчмарки' : 'Показать бенчмарки'}
          <ChevronDown className={cn(
            "h-4 w-4 transition-transform",
            showBenchmarks && "rotate-180"
          )} />
        </Button>
        
        {showBenchmarks && benchmarks.length > 1 && (
          <Select value={currentGeo} onValueChange={setCurrentGeo}>
            <SelectTrigger className="w-24">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {benchmarks.map(benchmark => (
                <SelectItem key={benchmark.geo} value={benchmark.geo}>
                  {benchmark.geo}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      </div>

      {showBenchmarks && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Бенчмарки vs Результаты (GEO: {currentGeo})</CardTitle>
            <CardDescription>
              Сравнение фактических показателей с эталонными значениями для региона
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Метрика</TableHead>
                    <TableHead>Benchmark ({currentGeo})</TableHead>
                    <TableHead>Result</TableHead>
                    <TableHead>Δ (отклонение)</TableHead>
                    <TableHead>Статус</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {Object.entries(currentBenchmark.metrics).map(([key, metric]) => (
                    <TableRow key={key}>
                      <TableCell className="font-medium">
                        {metricLabels[key as keyof typeof metricLabels]}
                      </TableCell>
                      <TableCell>
                        {formatMetricValue(key, metric.benchmark)}
                      </TableCell>
                      <TableCell className="font-semibold">
                        {formatMetricValue(key, metric.result)}
                      </TableCell>
                      <TableCell className={cn(
                        "font-medium",
                        metric.delta! > 0 ? "text-green-600" : 
                        metric.delta! < 0 ? "text-red-600" : "text-gray-600"
                      )}>
                        {metric.delta! > 0 ? '+' : ''}{metric.delta}%
                      </TableCell>
                      <TableCell>
                        <div className={cn(
                          "inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium",
                          getStatusColor(metric.status)
                        )}>
                          {getStatusIcon(metric.status)}
                          {metric.status === 'above' ? 'Выше' : 
                           metric.status === 'within' ? 'Норма' : 'Ниже'}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {/* Summary */}
            <div className="mt-4 p-4 bg-muted/30 rounded-lg">
              <h4 className="font-medium mb-2">Краткая сводка</h4>
              <div className="grid grid-cols-3 gap-4 text-sm">
                <div>
                  <Label className="text-muted-foreground">Выше бенчмарка</Label>
                  <p className="font-medium text-green-600">
                    {Object.values(currentBenchmark.metrics).filter(m => m.status === 'above').length} метрик
                  </p>
                </div>
                <div>
                  <Label className="text-muted-foreground">В пределах нормы</Label>
                  <p className="font-medium text-yellow-600">
                    {Object.values(currentBenchmark.metrics).filter(m => m.status === 'within').length} метрик
                  </p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Ниже бенчмарка</Label>
                  <p className="font-medium text-red-600">
                    {Object.values(currentBenchmark.metrics).filter(m => m.status === 'below').length} метрик
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

// --- FUNNEL COMPONENT ---

const FunnelVisualization = ({ funnel, title, isDetailed = false }: { 
  funnel: FunnelData; 
  title?: string; 
  isDetailed?: boolean; 
}) => {
  const [expandedStep, setExpandedStep] = React.useState<string | null>(null);

  // Calculate conversion rates
  const deliveryRate = funnel.sent > 0 ? (funnel.delivered / funnel.sent * 100).toFixed(1) : '0';
  const openRate = funnel.delivered > 0 ? (funnel.opens / funnel.delivered * 100).toFixed(1) : '0';
  const ctr = funnel.opens > 0 ? (funnel.clicks / funnel.opens * 100).toFixed(1) : '0';
  const conversionRate = funnel.clicks > 0 ? (funnel.deposits / funnel.clicks * 100).toFixed(1) : '0';

  // Color coding based on performance
  const getColorByRate = (rate: number, step: string) => {
    if (step === 'delivery') return rate >= 95 ? 'bg-green-500' : rate >= 90 ? 'bg-yellow-500' : 'bg-red-500';
    if (step === 'open') return rate >= 30 ? 'bg-green-500' : rate >= 20 ? 'bg-yellow-500' : 'bg-red-500';
    if (step === 'click') return rate >= 15 ? 'bg-green-500' : rate >= 10 ? 'bg-yellow-500' : 'bg-red-500';
    if (step === 'conversion') return rate >= 20 ? 'bg-green-500' : rate >= 10 ? 'bg-yellow-500' : 'bg-red-500';
    return 'bg-gray-400';
  };

  const steps = [
    {
      id: 'sent',
      label: 'Отправлено',
      value: funnel.sent,
      rate: '100%',
      color: 'bg-blue-500',
      width: '100%'
    },
    {
      id: 'delivered',
      label: 'Доставлено',
      value: funnel.delivered,
      rate: `${deliveryRate}%`,
      color: getColorByRate(parseFloat(deliveryRate), 'delivery'),
      width: `${(funnel.delivered / funnel.sent * 100)}%`
    },
    {
      id: 'opens',
      label: 'Открыто',
      value: funnel.opens,
      rate: `${openRate}%`,
      color: getColorByRate(parseFloat(openRate), 'open'),
      width: `${(funnel.opens / funnel.sent * 100)}%`
    },
    {
      id: 'clicks',
      label: 'Клики',
      value: funnel.clicks,
      rate: `${ctr}%`,
      color: getColorByRate(parseFloat(ctr), 'click'),
      width: `${(funnel.clicks / funnel.sent * 100)}%`
    },
    {
      id: 'deposits',
      label: 'Депозиты',
      value: funnel.deposits,
      rate: `${conversionRate}%`,
      color: getColorByRate(parseFloat(conversionRate), 'conversion'),
      width: `${(funnel.deposits / funnel.sent * 100)}%`
    }
  ];

  return (
    <div className="space-y-4">
      {title && <h3 className="text-lg font-medium">{title}</h3>}
      
      {/* Funnel Steps */}
      <div className="space-y-2">
        {steps.map((step, index) => (
          <div key={step.id} className="space-y-2">
            <div 
              className={cn(
                "relative p-4 rounded-lg border transition-all cursor-pointer",
                expandedStep === step.id ? "bg-muted/50" : "hover:bg-muted/30"
              )}
              onClick={() => setExpandedStep(expandedStep === step.id ? null : step.id)}
              style={{ 
                width: step.width,
                marginLeft: `${(100 - parseFloat(step.width)) / 2}%`,
                minWidth: '300px'
              }}
            >
              {/* Step Header */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={cn("w-3 h-3 rounded-full", step.color)}></div>
                  <div>
                    <h4 className="font-medium">{step.label}</h4>
                    <p className="text-sm text-muted-foreground">
                      {step.value.toLocaleString()} ({step.rate})
                    </p>
                  </div>
                </div>
                {funnel.ab_tests && step.id === 'clicks' && (
                  <Button variant="ghost" size="sm">
                    <ChevronDown className={cn(
                      "h-4 w-4 transition-transform",
                      expandedStep === step.id && "rotate-180"
                    )} />
                  </Button>
                )}
              </div>

              {/* Progress Bar */}
              <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
                <div 
                  className={cn("h-2 rounded-full transition-all", step.color)}
                  style={{ width: step.rate }}
                ></div>
              </div>
            </div>

            {/* A/B Test Details */}
            {expandedStep === step.id && funnel.ab_tests && step.id === 'clicks' && (
              <div className="ml-8 space-y-2">
                {funnel.ab_tests.map((variant) => (
                  <div key={variant.variant} className="p-3 bg-muted/30 rounded-lg border-l-4 border-blue-400">
                    <div className="flex items-center justify-between">
                      <div>
                        <h5 className="font-medium">Вариант {variant.variant}</h5>
                        <div className="text-sm text-muted-foreground">
                          Клики: {variant.clicks.toLocaleString()} | 
                          Депозиты: {variant.deposits.toLocaleString()} | 
                          CR: {((variant.deposits / variant.clicks) * 100).toFixed(1)}%
                        </div>
                      </div>
                      <Badge variant={variant.variant === 'B' ? 'default' : 'secondary'}>
                        {variant.variant === 'B' ? 'Лучший' : 'Базовый'}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Connection Line */}
            {index < steps.length - 1 && (
              <div className="flex justify-center">
                <TrendingDown className="h-4 w-4 text-muted-foreground" />
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Summary Stats */}
      {isDetailed && (
        <div className="p-4 bg-muted/20 rounded-lg">
          <h4 className="font-medium mb-2">Ключевые показатели</h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div>
              <Label className="text-muted-foreground">Delivery Rate</Label>
              <p className="font-medium">{deliveryRate}%</p>
            </div>
            <div>
              <Label className="text-muted-foreground">Open Rate</Label>
              <p className="font-medium">{openRate}%</p>
            </div>
            <div>
              <Label className="text-muted-foreground">CTR</Label>
              <p className="font-medium">{ctr}%</p>
            </div>
            <div>
              <Label className="text-muted-foreground">Conversion Rate</Label>
              <p className="font-medium">{conversionRate}%</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// --- TAB COMPONENTS ---

const AllCampaignsTab = ({ onEdit }: { onEdit: (scenario: ScenarioData) => void }) => {
  const [selectedStatusFilters, setSelectedStatusFilters] = React.useState<string[]>([]);
  const [selectedGeoFilters, setSelectedGeoFilters] = React.useState<string[]>([]);
  const [selectedProjectFilters, setSelectedProjectFilters] = React.useState<string[]>([]);
  const [searchQuery, setSearchQuery] = React.useState('');
  const [expandedCampaigns, setExpandedCampaigns] = React.useState<Set<string>>(new Set());
  const [selectedCampaign, setSelectedCampaign] = React.useState<CampaignData | null>(null);
  const [isDetailDialogOpen, setIsDetailDialogOpen] = React.useState(false);
  const [selectedFunnelCampaign, setSelectedFunnelCampaign] = React.useState<CampaignData | null>(null);
  const [isFunnelDialogOpen, setIsFunnelDialogOpen] = React.useState(false);
  const [isPasteDialogOpen, setIsPasteDialogOpen] = React.useState(false);

  // Copy/Move functionality
  const { clipboard, paste } = useClipboard();
  useKeyboardShortcuts();

  // Get available filter options for campaigns
  const availableStatuses = React.useMemo(() => {
    return Array.from(new Set(campaignsData.map(c => c.status))).sort();
  }, []);

  const availableGeos = React.useMemo(() => {
    const geos = new Set<string>();
    campaignsData.forEach(campaign => {
      campaign.geo.forEach(geo => geos.add(geo));
    });
    return Array.from(geos).sort();
  }, []);

  const availableProjects = React.useMemo(() => {
    const projects = new Set<string>();
    campaignsData.forEach(campaign => {
      campaign.project.forEach(project => projects.add(project));
    });
    return Array.from(projects).sort();
  }, []);

  // Filter campaigns based on multiple criteria
  const filteredCampaigns = React.useMemo(() => {
    return campaignsData.filter(campaign => {
      // Status filter
      const matchesStatus = selectedStatusFilters.length === 0 || 
        selectedStatusFilters.includes(campaign.status);

      // GEO filter
      const matchesGeo = selectedGeoFilters.length === 0 || 
        selectedGeoFilters.some(geo => campaign.geo.includes(geo));

      // Project filter
      const matchesProject = selectedProjectFilters.length === 0 || 
        selectedProjectFilters.some(project => campaign.project.includes(project));

      // Search filter
      const matchesSearch = searchQuery === '' || 
        campaign.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        campaign.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        campaign.scenarios.some(scenario => 
          scenario.name.toLowerCase().includes(searchQuery.toLowerCase())
        );

      return matchesStatus && matchesGeo && matchesProject && matchesSearch;
    });
  }, [selectedStatusFilters, selectedGeoFilters, selectedProjectFilters, searchQuery]);

  // Handle campaign expansion
  const toggleCampaignExpansion = (campaignId: string) => {
    setExpandedCampaigns(prev => {
      const newSet = new Set(prev);
      if (newSet.has(campaignId)) {
        newSet.delete(campaignId);
      } else {
        newSet.add(campaignId);
      }
      return newSet;
    });
  };

  // Handle campaign detail view
  const openCampaignDetail = (campaign: CampaignData) => {
    setSelectedCampaign(campaign);
    setIsDetailDialogOpen(true);
  };

  // Handle funnel view
  const openFunnelView = (campaign: CampaignData) => {
    setSelectedFunnelCampaign(campaign);
    setIsFunnelDialogOpen(true);
  };

  // Copy/Move handlers
  const handlePasteFromClipboard = React.useCallback(async (targetId: string, targetType: ClipboardItemType) => {
    if (!clipboard) return;
    
    const success = await paste(targetId, targetType);
    if (success) {
      // Refresh data or update state as needed
      console.log(`Successfully pasted ${clipboard.type} into ${targetType} ${targetId}`);
    }
  }, [clipboard, paste]);

  const handleDrop = React.useCallback((item: ClipboardItem, targetId: string, targetType: ClipboardItemType) => {
    console.log(`Dropped ${item.type} ${item.id} into ${targetType} ${targetId}`);
    // Handle the actual drop operation
    handlePasteFromClipboard(targetId, targetType);
  }, [handlePasteFromClipboard]);

  const handleCampaignPaste = React.useCallback((campaignId: string) => {
    // Refresh campaigns data after paste
    console.log(`Pasted into campaign ${campaignId}`);
  }, []);

  const handleScenarioPaste = React.useCallback((scenarioId: string) => {
    // Refresh scenario data after paste
    console.log(`Pasted into scenario ${scenarioId}`);
  }, []);

  // Status colors for campaigns
  const campaignStatusColors = {
    active: "bg-success",
    inactive: "bg-muted-foreground",
    paused: "bg-warning",
  };

  // Type badge helper for scenarios
  const getTypeBadge = (type?: string) => {
    switch (type) {
      case 'event': return { emoji: '🟦', color: 'bg-blue-100 text-blue-700 border-blue-200' };
      case 'basic': return { emoji: '🟩', color: 'bg-green-100 text-green-700 border-green-200' };
      case 'custom': return { emoji: '🟨', color: 'bg-yellow-100 text-yellow-700 border-yellow-200' };
      default: return { emoji: '', color: '' };
    }
  };

  return (
    <div className="space-y-6">
      {/* Filter Panel */}
    <Card>
      <CardHeader>
          <CardTitle>Фильтры кампаний</CardTitle>
        <CardDescription>
            Настройте фильтры для поиска кампаний. Найдено: {filteredCampaigns.length} из {campaignsData.length} кампаний
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col space-y-4">
            {/* Search */}
            <div>
              <Label className="text-sm font-medium mb-2 block">Поиск</Label>
              <Input 
                placeholder="Поиск по названию кампании или сценария..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="max-w-sm"
              />
            </div>

            {/* Status Filter */}
            <div>
              <Label className="text-sm font-medium mb-2 block">Статус кампании</Label>
              <div className="flex flex-wrap gap-2">
                {availableStatuses.map((status) => (
                  <Button
                    key={status}
                    variant={selectedStatusFilters.includes(status) ? "default" : "outline"}
                    onClick={() => setSelectedStatusFilters(prev => 
                      prev.includes(status) 
                        ? prev.filter(s => s !== status)
                        : [...prev, status]
                    )}
                    size="sm"
                  >
                    <span className={cn("h-2 w-2 rounded-full mr-2", campaignStatusColors[status as keyof typeof campaignStatusColors])} />
                    {status === 'active' ? 'Активна' : status === 'paused' ? 'Пауза' : 'Неактивна'} ({campaignsData.filter(c => c.status === status).length})
                  </Button>
                ))}
                {selectedStatusFilters.length > 0 && (
                  <Button
                    variant="ghost"
                    onClick={() => setSelectedStatusFilters([])}
                    size="sm"
                    className="text-muted-foreground"
                  >
                    Очистить
                  </Button>
                )}
              </div>
            </div>

            {/* GEO Filter */}
            <div>
              <Label className="text-sm font-medium mb-2 block">География (GEO)</Label>
              <div className="flex flex-wrap gap-2">
                {availableGeos.map((geo) => (
                  <Button
                    key={geo}
                    variant={selectedGeoFilters.includes(geo) ? "default" : "outline"}
                    onClick={() => setSelectedGeoFilters(prev => 
                      prev.includes(geo) 
                        ? prev.filter(g => g !== geo)
                        : [...prev, geo]
                    )}
                    size="sm"
                  >
                    {geo} ({campaignsData.filter(c => c.geo.includes(geo)).length})
                  </Button>
                ))}
                {selectedGeoFilters.length > 0 && (
                  <Button
                    variant="ghost"
                    onClick={() => setSelectedGeoFilters([])}
                    size="sm"
                    className="text-muted-foreground"
                  >
                    Очистить
                  </Button>
                )}
              </div>
            </div>

            {/* Project Filter */}
            <div>
              <Label className="text-sm font-medium mb-2 block">Проект</Label>
              <div className="flex flex-wrap gap-2">
                {availableProjects.map((project) => (
                  <Button
                    key={project}
                    variant={selectedProjectFilters.includes(project) ? "default" : "outline"}
                    onClick={() => setSelectedProjectFilters(prev => 
                      prev.includes(project) 
                        ? prev.filter(p => p !== project)
                        : [...prev, project]
                    )}
                    size="sm"
                  >
                    {project} ({campaignsData.filter(c => c.project.includes(project)).length})
                  </Button>
                ))}
                {selectedProjectFilters.length > 0 && (
                  <Button
                    variant="ghost"
                    onClick={() => setSelectedProjectFilters([])}
                    size="sm"
                    className="text-muted-foreground"
                  >
                    Очистить
                  </Button>
                )}
              </div>
            </div>

            {/* Active Filters Summary */}
            {(selectedStatusFilters.length > 0 || selectedGeoFilters.length > 0 || selectedProjectFilters.length > 0) && (
              <div className="p-3 bg-muted/50 rounded-lg">
                <p className="text-sm font-medium mb-2">Активные фильтры:</p>
                <div className="flex flex-wrap gap-1 text-xs">
                  {selectedStatusFilters.length > 0 && (
                    <Badge variant="secondary">
                      Статус: {selectedStatusFilters.map(s => s === 'active' ? 'Активна' : s === 'paused' ? 'Пауза' : 'Неактивна').join(', ')}
                    </Badge>
                  )}
                  {selectedGeoFilters.length > 0 && (
                    <Badge variant="secondary">
                      GEO: {selectedGeoFilters.join(', ')}
                    </Badge>
                  )}
                  {selectedProjectFilters.length > 0 && (
                    <Badge variant="secondary">
                      Проекты: {selectedProjectFilters.join(', ')}
                    </Badge>
                  )}
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Campaigns Table */}
      <Card>
        <CardHeader>
          <CardTitle>Все кампании</CardTitle>
          <CardDescription>
            Кампании с вложенными сценариями. Нажмите на стрелку для просмотра сценариев или на название для детального просмотра.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
                <TableHead className="w-8"></TableHead>
                <TableHead className="w-[300px]">Название кампании</TableHead>
              <TableHead>Статус</TableHead>
                <TableHead>GEO</TableHead>
                <TableHead>Проект</TableHead>
                <TableHead>Сценариев</TableHead>
                <TableHead>Бюджет</TableHead>
                <TableHead>Период</TableHead>
              <TableHead className="text-right">Действия</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
              {filteredCampaigns.map((campaign) => {
                const isExpanded = expandedCampaigns.has(campaign.id);
              return (
                                              <React.Fragment key={campaign.id}>
                              {/* Campaign Row */}
                              <DropZone
                                dropZone={{
                                  type: 'campaign',
                                  id: campaign.id,
                                  accepts: ['scenario'],
                                  level: 0
                                }}
                                onDrop={handleDrop}
                                className="relative"
                              >
                                <CopyMoveContextMenu
                                  item={{
                                    id: campaign.id,
                                    type: 'campaign',
                                    data: campaign,
                                    name: campaign.name
                                  }}
                                  showPasteOption={true}
                                  onPaste={handleCampaignPaste}
                                >
                                  <DragDropWrapper
                                    item={{
                                      id: campaign.id,
                                      type: 'campaign',
                                      data: campaign,
                                      name: campaign.name
                                    }}
                                    draggable={true}
                                  >
                                    <TableRow className="hover:bg-muted/50">
                  <TableCell>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => toggleCampaignExpansion(campaign.id)}
                          className="h-6 w-6"
                        >
                          {isExpanded ? 
                            <ChevronDown className="h-4 w-4" /> : 
                            <ChevronRight className="h-4 w-4" />
                          }
                        </Button>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col">
                          <button
                            onClick={() => openCampaignDetail(campaign)}
                            className="font-medium text-left hover:underline"
                          >
                            {campaign.name}
                          </button>
                          {campaign.description && (
                            <p className="text-xs text-muted-foreground mt-1">
                              {campaign.description}
                            </p>
                          )}
                        </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                          <span className={cn("h-2.5 w-2.5 rounded-full", campaignStatusColors[campaign.status])} />
                          {campaign.status === 'active' ? 'Активна' : campaign.status === 'paused' ? 'Пауза' : 'Неактивна'}
                    </div>
                  </TableCell>
                  <TableCell>
                        <div className="text-sm">
                          {campaign.geo.join(', ')}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          {campaign.project.join(', ')}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">
                          {campaign.scenarios.length} сценар{campaign.scenarios.length === 1 ? 'ий' : campaign.scenarios.length < 5 ? 'ия' : 'иев'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {campaign.budget && campaign.currency && (
                          <div className="flex items-center gap-1">
                            <Euro className="h-3 w-3 text-muted-foreground" />
                            <span>{campaign.budget.toLocaleString()}</span>
                          </div>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="text-xs text-muted-foreground">
                          <div>{new Date(campaign.startDate).toLocaleDateString('ru-RU')}</div>
                          {campaign.endDate && (
                            <div>до {new Date(campaign.endDate).toLocaleDateString('ru-RU')}</div>
                          )}
                        </div>
                      </TableCell>
                                        <TableCell className="text-right">
                    <div className="flex items-center gap-1">
                      <Button variant="ghost" size="icon" onClick={() => openCampaignDetail(campaign)}>
                        <Eye className="h-4 w-4" />
                      </Button>
                      {campaign.funnel && (
                        <Button variant="ghost" size="icon" onClick={() => openFunnelView(campaign)}>
                          <BarChart3 className="h-4 w-4" />
                        </Button>
                      )}
                      <Button variant="ghost" size="icon">
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <CopyMoveDropdownMenu
                        item={{
                          id: campaign.id,
                          type: 'campaign',
                          data: campaign,
                          name: campaign.name
                        }}
                        showPasteOption={true}
                        onPaste={handleCampaignPaste}
                      />
                    </div>
                  </TableCell>
                    </TableRow>
                                  </DragDropWrapper>
                                </CopyMoveContextMenu>
                              </DropZone>

                    {/* Expanded Scenarios */}
                    {isExpanded && campaign.scenarios.map((scenario, index) => {
                      const ChannelIcon = channelIconsScenarios[scenario.channel];
                      const typeBadge = getTypeBadge(scenario.type);
                      
                      return (
                        <CopyMoveContextMenu
                          key={`${campaign.id}-${scenario.id}`}
                          item={{
                            id: scenario.id || `${campaign.id}-${index}`,
                            type: 'scenario',
                            data: scenario,
                            name: scenario.name
                          }}
                          sourceId={campaign.id}
                          showPasteOption={false}
                        >
                          <DragDropWrapper
                            item={{
                              id: scenario.id || `${campaign.id}-${index}`,
                              type: 'scenario',
                              data: scenario,
                              name: scenario.name
                            }}
                            sourceId={campaign.id}
                            draggable={true}
                          >
                            <TableRow className="bg-muted/20">
                          <TableCell></TableCell>
                          <TableCell className="pl-8">
                    <div className="flex items-center gap-2">
                              <div className="flex items-center gap-2">
                                <Badge className={`${typeBadge.color} text-xs`}>
                                  {typeBadge.emoji} {scenario.type === 'event' ? 'Событийный' : scenario.type === 'basic' ? 'Базовый' : 'Пользовательский'}
                                </Badge>
                                <span className="font-medium">{scenario.name}</span>
                              </div>
                            </div>
                            <div className="text-xs text-muted-foreground mt-1">
                              {scenario.segment} • {scenario.goal}
                    </div>
                  </TableCell>
                  <TableCell>
                            <div className="flex items-center gap-2">
                              <span className={cn("h-2 w-2 rounded-full", statusColors[scenario.status])} />
                              <span className="text-sm">{scenario.status}</span>
                            </div>
                  </TableCell>
                          <TableCell>
                            <div className="text-xs text-muted-foreground">
                              {scenario.geo?.join(', ') || '—'}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="text-xs text-muted-foreground">
                              {scenario.project?.join(', ') || '—'}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <ChannelIcon className="h-3 w-3 text-muted-foreground" />
                              <span className="text-xs">{scenario.channel}</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <span className="text-xs text-muted-foreground">
                              CR: {scenario.cr}
                            </span>
                          </TableCell>
                          <TableCell>
                            <div className="text-xs text-muted-foreground">
                              {scenario.updatedAt && new Date(scenario.updatedAt).toLocaleDateString('ru-RU')}
                            </div>
                          </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center gap-1">
                    <Button variant="ghost" size="icon" onClick={() => onEdit(scenario)}>
                        <Pencil className="h-3 w-3" />
                    </Button>
                      {scenario.funnel && (
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          onClick={() => {
                            setSelectedFunnelCampaign({
                              ...campaign,
                              name: scenario.name,
                              description: `Сценарий: ${scenario.segment} • ${scenario.goal}`,
                              funnel: scenario.funnel
                            });
                            setIsFunnelDialogOpen(true);
                          }}
                        >
                          <BarChart3 className="h-3 w-3" />
                    </Button>
                      )}
                      <CopyMoveDropdownMenu
                        item={{
                          id: scenario.id || `${campaign.id}-${index}`,
                          type: 'scenario',
                          data: scenario,
                          name: scenario.name
                        }}
                        sourceId={campaign.id}
                        showPasteOption={false}
                        className="h-6 w-6"
                      />
                    </div>
                  </TableCell>
                </TableRow>
                          </DragDropWrapper>
                        </CopyMoveContextMenu>
                      );
                    })}
                  </React.Fragment>
              );
            })}
          </TableBody>
        </Table>
          
          {filteredCampaigns.length === 0 && (
            <div className="py-8 text-center">
              <p className="text-muted-foreground">
                Кампании не найдены. Попробуйте изменить фильтры или поисковый запрос.
              </p>
            </div>
          )}
      </CardContent>
    </Card>

      {/* Campaign Detail Dialog */}
      <Dialog open={isDetailDialogOpen} onOpenChange={setIsDetailDialogOpen}>
        <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-3">
              <span>{selectedCampaign?.name}</span>
              {selectedCampaign && (
                <div className="flex items-center gap-2">
                  <span className={cn("h-2.5 w-2.5 rounded-full", campaignStatusColors[selectedCampaign.status])} />
                  <span className="text-sm font-normal">
                    {selectedCampaign.status === 'active' ? 'Активна' : selectedCampaign.status === 'paused' ? 'Пауза' : 'Неактивна'}
                  </span>
                </div>
              )}
            </DialogTitle>
            <DialogDescription>
              {selectedCampaign?.description}
            </DialogDescription>
          </DialogHeader>
          
          {selectedCampaign && (
            <div className="space-y-6">
              {/* Campaign Info */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-muted/50 rounded-lg">
                <div>
                  <Label className="text-xs text-muted-foreground">GEO</Label>
                  <p className="font-medium">{selectedCampaign.geo.join(', ')}</p>
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground">Проекты</Label>
                  <p className="font-medium">{selectedCampaign.project.join(', ')}</p>
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground">Бюджет</Label>
                  <p className="font-medium">
                    {selectedCampaign.budget && selectedCampaign.currency ? 
                      `€${selectedCampaign.budget.toLocaleString()}` : '—'}
                  </p>
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground">Период</Label>
                  <p className="font-medium text-xs">
                    {new Date(selectedCampaign.startDate).toLocaleDateString('ru-RU')}
                    {selectedCampaign.endDate && ` - ${new Date(selectedCampaign.endDate).toLocaleDateString('ru-RU')}`}
                  </p>
                </div>
              </div>

              {/* Scenarios in Campaign */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-medium">Сценарии кампании ({selectedCampaign.scenarios.length})</h3>
                  <Button size="sm">
                    <PlusCircle className="h-4 w-4 mr-2" />
                    Добавить сценарий
                  </Button>
                </div>
                
                <div className="grid gap-3">
                  {selectedCampaign.scenarios.map((scenario) => {
                    const ChannelIcon = channelIconsScenarios[scenario.channel];
                    const typeBadge = getTypeBadge(scenario.type);
                    
                    return (
                      <div key={scenario.id} className="border rounded-lg p-4 hover:bg-muted/50">
                        <div className="flex items-start justify-between">
                          <div className="space-y-2">
                            <div className="flex items-center gap-2">
                              <Badge className={`${typeBadge.color} text-xs`}>
                                {typeBadge.emoji} {scenario.type === 'event' ? 'Событийный' : scenario.type === 'basic' ? 'Базовый' : 'Пользовательский'}
                              </Badge>
                              <h4 className="font-medium">{scenario.name}</h4>
                              <div className="flex items-center gap-2">
                                <span className={cn("h-2 w-2 rounded-full", statusColors[scenario.status])} />
                                <span className="text-sm text-muted-foreground">{scenario.status}</span>
                              </div>
                            </div>
                            <div className="flex items-center gap-4 text-sm text-muted-foreground">
                              <div className="flex items-center gap-1">
                                <ChannelIcon className="h-3 w-3" />
                                {scenario.channel}
                              </div>
                              <div>{scenario.segment}</div>
                              <div>Цель: {scenario.goal}</div>
                              <div>CR: {scenario.cr}</div>
                            </div>
                            <div className="flex items-center gap-4 text-xs text-muted-foreground">
                              <div>GEO: {scenario.geo?.join(', ') || '—'}</div>
                              <div>Проекты: {scenario.project?.join(', ') || '—'}</div>
                              {scenario.updatedAt && <div>Обновлено: {new Date(scenario.updatedAt).toLocaleDateString('ru-RU')}</div>}
                            </div>
                          </div>
                          <div className="flex items-center gap-1">
                            <Button variant="ghost" size="icon" onClick={() => onEdit(scenario)}>
                              <Pencil className="h-3 w-3" />
                            </Button>
                            <Button variant="ghost" size="icon">
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Funnel Dialog */}
      <Dialog open={isFunnelDialogOpen} onOpenChange={setIsFunnelDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Воронка конверсии: {selectedFunnelCampaign?.name}
            </DialogTitle>
            <DialogDescription>
              {selectedFunnelCampaign?.description}
            </DialogDescription>
          </DialogHeader>
          
          {selectedFunnelCampaign?.funnel && (
            <div className="space-y-6">
              {/* Benchmarks Section */}
              {selectedFunnelCampaign.funnel.benchmarks && (
                <BenchmarkComparison 
                  benchmarks={selectedFunnelCampaign.funnel.benchmarks}
                  selectedGeo={selectedFunnelCampaign.geo?.[0]}
                />
              )}
              
              <FunnelVisualization 
                funnel={selectedFunnelCampaign.funnel} 
                isDetailed={true}
              />
              
              {/* Additional Campaign Info */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-muted/20 rounded-lg">
                <div>
                  <Label className="text-xs text-muted-foreground">GEO</Label>
                  <p className="font-medium">{selectedFunnelCampaign.geo?.join(', ') || '—'}</p>
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground">Проекты</Label>
                  <p className="font-medium">{selectedFunnelCampaign.project?.join(', ') || '—'}</p>
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground">Статус</Label>
                  <p className="font-medium">
                    {selectedFunnelCampaign.status === 'active' ? 'Активна' : 
                     selectedFunnelCampaign.status === 'paused' ? 'Пауза' : 'Неактивна'}
                  </p>
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground">Период</Label>
                  <p className="font-medium text-xs">
                    {new Date(selectedFunnelCampaign.startDate).toLocaleDateString('ru-RU')}
                    {selectedFunnelCampaign.endDate && ` - ${new Date(selectedFunnelCampaign.endDate).toLocaleDateString('ru-RU')}`}
                  </p>
                </div>
              </div>

              {/* Export Options */}
              <div className="flex justify-end gap-2">
                <Button variant="outline" size="sm">
                  <FileText className="h-4 w-4 mr-2" />
                  Воронка PDF
                </Button>
                <Button variant="outline" size="sm">
                  <FileText className="h-4 w-4 mr-2" />
                  Воронка Excel
                </Button>
                {selectedFunnelCampaign.funnel.benchmarks && (
                  <>
                    <Button variant="outline" size="sm">
                      <BarChart3 className="h-4 w-4 mr-2" />
                      Бенчмарки PDF
                    </Button>
                    <Button variant="outline" size="sm">
                      <BarChart3 className="h-4 w-4 mr-2" />
                      Бенчмарки Excel
                    </Button>
                  </>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Paste Target Dialog */}
      <PasteTargetDialog
        open={isPasteDialogOpen}
        onOpenChange={setIsPasteDialogOpen}
        onPaste={handlePasteFromClipboard}
      />
    </div>
  );
};

const TemplatesTab = () => {
  const [selectedTypeFilters, setSelectedTypeFilters] = React.useState<string[]>(['all']);
  const [selectedGeoFilters, setSelectedGeoFilters] = React.useState<string[]>([]);
  const [selectedProjectFilters, setSelectedProjectFilters] = React.useState<string[]>([]);
  const [searchQuery, setSearchQuery] = React.useState('');
  const [isCreateDialogOpen, setIsCreateDialogOpen] = React.useState(false);
  const [newTemplate, setNewTemplate] = React.useState({
    name: '',
    description: '',
    type: 'basic' as 'event' | 'basic' | 'custom',
    event: '' as string,
    channel: 'Email' as 'Email' | 'Push' | 'SMS' | 'InApp' | 'Multi-channel',
    category: '',
    geo: [] as string[],
    project: [] as string[]
  });
  
  // Get available filter options
  const availableGeos = React.useMemo(() => {
    const geos = new Set<string>();
    templatesData.forEach(template => {
      template.geo?.forEach(geo => geos.add(geo));
    });
    return Array.from(geos).sort();
  }, []);

  const availableProjects = React.useMemo(() => {
    const projects = new Set<string>();
    templatesData.forEach(template => {
      template.project?.forEach(project => projects.add(project));
    });
    return Array.from(projects).sort();
  }, []);

  // Filter templates based on multiple criteria
  const filteredTemplates = React.useMemo(() => {
    return templatesData.filter(template => {
      // Type filter
      const matchesType = selectedTypeFilters.includes('all') || 
        selectedTypeFilters.some(type => template.type === type);

      // GEO filter
      const matchesGeo = selectedGeoFilters.length === 0 || 
        selectedGeoFilters.some(geo => template.geo?.includes(geo));

      // Project filter
      const matchesProject = selectedProjectFilters.length === 0 || 
        selectedProjectFilters.some(project => template.project?.includes(project));

      // Search filter (works within selected filters)
      const matchesSearch = searchQuery === '' || 
        template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        template.description.toLowerCase().includes(searchQuery.toLowerCase());

      return matchesType && matchesGeo && matchesProject && matchesSearch;
    });
  }, [selectedTypeFilters, selectedGeoFilters, selectedProjectFilters, searchQuery]);

  // Calculate dynamic statistics based on current filters
  const filterStats = React.useMemo(() => {
    // First apply geo and project filters
    const baseFiltered = templatesData.filter(template => {
      const matchesGeo = selectedGeoFilters.length === 0 || 
        selectedGeoFilters.some(geo => template.geo?.includes(geo));
      const matchesProject = selectedProjectFilters.length === 0 || 
        selectedProjectFilters.some(project => template.project?.includes(project));
      return matchesGeo && matchesProject;
    });

    // Then calculate type stats within those constraints
    const stats = {
      all: baseFiltered.length,
      event: baseFiltered.filter(t => t.type === 'event').length,
      basic: baseFiltered.filter(t => t.type === 'basic').length,
      custom: baseFiltered.filter(t => t.type === 'custom').length,
    };
    return stats;
  }, [selectedGeoFilters, selectedProjectFilters]);

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'event': return 'Событийный';
      case 'basic': return 'Базовый'; 
      case 'custom': return 'Пользовательский';
      default: return 'Все';
    }
  };

  const getTypeBadge = (type: string) => {
    switch (type) {
      case 'event': return { emoji: '🟦', color: 'bg-blue-100 text-blue-700 border-blue-200' };
      case 'basic': return { emoji: '🟩', color: 'bg-green-100 text-green-700 border-green-200' };
      case 'custom': return { emoji: '🟨', color: 'bg-yellow-100 text-yellow-700 border-yellow-200' };
      default: return { emoji: '', color: '' };
    }
  };

  const getEventLabel = (event?: string) => {
    switch (event) {
      case 'first_deposit': return 'Первый депозит';
      case 'withdrawal': return 'Вывод';
      case 'registration': return 'Регистрация';
      case 'inactivity': return 'Неактивность';
      case 'big_win': return 'Крупный выигрыш';
      case 'bonus_activation': return 'Активация бонуса';
      case 'login': return 'Логин';
      case 'game_start': return 'Начало игры';
      default: return '';
    }
  };

  // Handle multi-select for type filters
  const handleTypeFilterToggle = (type: string) => {
    if (type === 'all') {
      setSelectedTypeFilters(['all']);
    } else {
      setSelectedTypeFilters(prev => {
        const newFilters = prev.filter(f => f !== 'all');
        if (newFilters.includes(type)) {
          const filtered = newFilters.filter(f => f !== type);
          return filtered.length === 0 ? ['all'] : filtered;
        } else {
          return [...newFilters, type];
        }
      });
    }
  };

  // Handle GEO filter toggle
  const handleGeoFilterToggle = (geo: string) => {
    setSelectedGeoFilters(prev => 
      prev.includes(geo) 
        ? prev.filter(g => g !== geo)
        : [...prev, geo]
    );
  };

  // Handle Project filter toggle
  const handleProjectFilterToggle = (project: string) => {
    setSelectedProjectFilters(prev => 
      prev.includes(project) 
        ? prev.filter(p => p !== project)
        : [...prev, project]
    );
  };

  const handleCreateTemplate = () => {
    // Here you would typically make an API call to create the template
    console.log('Creating template:', newTemplate);
    setIsCreateDialogOpen(false);
    setNewTemplate({
      name: '',
      description: '',
      type: 'basic',
      event: '',
      channel: 'Email',
      category: '',
      geo: [],
      project: []
    });
  };

  return (
    <div className="space-y-6">
      {/* Filter Panel */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Фильтры шаблонов</CardTitle>
              <CardDescription>
                Настройте фильтры по типу, географии и проектам. Найдено: {filteredTemplates.length} из {templatesData.length} шаблонов
              </CardDescription>
            </div>
            <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Создать шаблон
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Создать новый шаблон</DialogTitle>
                  <DialogDescription>
                    Создайте новый шаблон сценария для использования в кампаниях.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label htmlFor="template-name">Название шаблона</Label>
                    <Input
                      id="template-name"
                      value={newTemplate.name}
                      onChange={(e) => setNewTemplate(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="Например: Приветственный бонус"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="template-description">Описание</Label>
                    <Textarea
                      id="template-description"
                      value={newTemplate.description}
                      onChange={(e) => setNewTemplate(prev => ({ ...prev, description: e.target.value }))}
                      placeholder="Краткое описание шаблона..."
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="template-type">Тип шаблона</Label>
                    <Select
                      value={newTemplate.type}
                      onValueChange={(value: 'event' | 'basic' | 'custom') => 
                        setNewTemplate(prev => ({ ...prev, type: value, event: value !== 'event' ? '' : prev.event }))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="basic">🟩 Базовый</SelectItem>
                        <SelectItem value="event">🟦 Событийный</SelectItem>
                        <SelectItem value="custom">🟨 Пользовательский</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  {newTemplate.type === 'event' && (
                    <div className="grid gap-2">
                      <Label htmlFor="template-event">Событие</Label>
                      <Select
                        value={newTemplate.event}
                        onValueChange={(value) => setNewTemplate(prev => ({ ...prev, event: value }))}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Выберите событие..." />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="registration">Регистрация</SelectItem>
                          <SelectItem value="first_deposit">Первый депозит</SelectItem>
                          <SelectItem value="withdrawal">Вывод</SelectItem>
                          <SelectItem value="inactivity">Неактивность</SelectItem>
                          <SelectItem value="big_win">Крупный выигрыш</SelectItem>
                          <SelectItem value="bonus_activation">Активация бонуса</SelectItem>
                          <SelectItem value="login">Логин</SelectItem>
                          <SelectItem value="game_start">Начало игры</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  )}
                  <div className="grid gap-2">
                    <Label htmlFor="template-channel">Канал коммуникации</Label>
                    <Select
                      value={newTemplate.channel}
                      onValueChange={(value: 'Email' | 'Push' | 'SMS' | 'InApp' | 'Multi-channel') => 
                        setNewTemplate(prev => ({ ...prev, channel: value }))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Email">Email</SelectItem>
                        <SelectItem value="Push">Push</SelectItem>
                        <SelectItem value="SMS">SMS</SelectItem>
                        <SelectItem value="InApp">InApp</SelectItem>
                        <SelectItem value="Multi-channel">Multi-channel</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="template-category">Категория</Label>
                    <Input
                      id="template-category"
                      value={newTemplate.category}
                      onChange={(e) => setNewTemplate(prev => ({ ...prev, category: e.target.value }))}
                      placeholder="Например: Onboarding, Retention..."
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="template-geo">География (GEO)</Label>
                    <div className="flex flex-wrap gap-1">
                      {availableGeos.map(geo => (
                        <Button
                          key={geo}
                          type="button"
                          variant={newTemplate.geo.includes(geo) ? "default" : "outline"}
                          size="sm"
                          onClick={() => setNewTemplate(prev => ({
                            ...prev,
                            geo: prev.geo.includes(geo) 
                              ? prev.geo.filter(g => g !== geo)
                              : [...prev.geo, geo]
                          }))}
                        >
                          {geo}
                        </Button>
                      ))}
                    </div>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="template-project">Проекты</Label>
                    <div className="flex flex-wrap gap-1">
                      {availableProjects.map(project => (
                        <Button
                          key={project}
                          type="button"
                          variant={newTemplate.project.includes(project) ? "default" : "outline"}
                          size="sm"
                          onClick={() => setNewTemplate(prev => ({
                            ...prev,
                            project: prev.project.includes(project) 
                              ? prev.project.filter(p => p !== project)
                              : [...prev.project, project]
                          }))}
                        >
                          {project}
                        </Button>
                      ))}
                    </div>
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                    Отмена
                  </Button>
                  <Button onClick={handleCreateTemplate} disabled={!newTemplate.name || !newTemplate.description}>
                    Создать шаблон
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col space-y-6">
            {/* Search Input */}
            <div>
              <Label className="text-sm font-medium mb-2 block">Поиск</Label>
              <Input 
                placeholder="Поиск по названию или описанию..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="max-w-sm"
              />
              {searchQuery && (
                <p className="text-xs text-muted-foreground mt-1">
                  Поиск работает в рамках выбранных фильтров
                </p>
              )}
            </div>
            
            {/* Type Filter Buttons */}
            <div>
              <Label className="text-sm font-medium mb-2 block">Тип шаблона</Label>
              <div className="flex flex-wrap gap-2">
                {(['all', 'event', 'basic', 'custom'] as const).map((type) => (
                  <Button
                    key={type}
                    variant={selectedTypeFilters.includes(type) ? "default" : "outline"}
                    onClick={() => handleTypeFilterToggle(type)}
                    className="flex items-center gap-2"
                    size="sm"
                  >
                    {type !== 'all' && <span>{getTypeBadge(type).emoji}</span>}
                    {getTypeLabel(type)} ({filterStats[type]})
                  </Button>
                ))}
              </div>
            </div>

            {/* GEO Filter */}
            <div>
              <Label className="text-sm font-medium mb-2 block">География (GEO)</Label>
              <div className="flex flex-wrap gap-2">
                {availableGeos.map((geo) => (
                  <Button
                    key={geo}
                    variant={selectedGeoFilters.includes(geo) ? "default" : "outline"}
                    onClick={() => handleGeoFilterToggle(geo)}
                    size="sm"
                  >
                    {geo} ({templatesData.filter(t => t.geo?.includes(geo)).length})
                  </Button>
                ))}
                {selectedGeoFilters.length > 0 && (
                  <Button
                    variant="ghost"
                    onClick={() => setSelectedGeoFilters([])}
                    size="sm"
                    className="text-muted-foreground"
                  >
                    Очистить
                  </Button>
                )}
              </div>
            </div>

            {/* Project Filter */}
            <div>
              <Label className="text-sm font-medium mb-2 block">Проект</Label>
              <div className="flex flex-wrap gap-2">
                {availableProjects.map((project) => (
                  <Button
                    key={project}
                    variant={selectedProjectFilters.includes(project) ? "default" : "outline"}
                    onClick={() => handleProjectFilterToggle(project)}
                    size="sm"
                  >
                    {project} ({templatesData.filter(t => t.project?.includes(project)).length})
                  </Button>
                ))}
                {selectedProjectFilters.length > 0 && (
                  <Button
                    variant="ghost"
                    onClick={() => setSelectedProjectFilters([])}
                    size="sm"
                    className="text-muted-foreground"
                  >
                    Очистить
                  </Button>
                )}
              </div>
            </div>

            {/* Active Filters Summary */}
            {(selectedTypeFilters.length > 1 || !selectedTypeFilters.includes('all') || 
              selectedGeoFilters.length > 0 || selectedProjectFilters.length > 0) && (
              <div className="p-3 bg-muted/50 rounded-lg">
                <p className="text-sm font-medium mb-2">Активные фильтры:</p>
                <div className="flex flex-wrap gap-1 text-xs">
                  {!selectedTypeFilters.includes('all') && selectedTypeFilters.length > 0 && (
                    <Badge variant="secondary">
                      Типы: {selectedTypeFilters.map(t => getTypeLabel(t)).join(', ')}
                    </Badge>
                  )}
                  {selectedGeoFilters.length > 0 && (
                    <Badge variant="secondary">
                      GEO: {selectedGeoFilters.join(', ')}
                    </Badge>
                  )}
                  {selectedProjectFilters.length > 0 && (
                    <Badge variant="secondary">
                      Проекты: {selectedProjectFilters.join(', ')}
                    </Badge>
                  )}
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Templates Grid */}
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredTemplates.map(template => {
          const ChannelIcon = channelIconsTemplates[template.channel];
          const typeBadge = getTypeBadge(template.type);
          
          return (
            <Card key={template.id} className="flex flex-col">
              <CardHeader>
                <div className="flex items-start justify-between">
                    <div>
                        <div className="flex items-center gap-2 mb-2">
                          <Badge variant="secondary">{template.category}</Badge>
                          <Badge className={`${typeBadge.color} text-xs`}>
                            {typeBadge.emoji} {getTypeLabel(template.type)}
                          </Badge>
                        </div>
                        <CardTitle>{template.name}</CardTitle>
                        {template.type === 'event' && template.event && (
                          <p className="text-xs text-muted-foreground mt-1">
                            Событие: {getEventLabel(template.event)}
                          </p>
                        )}
                        {template.geo && template.geo.length > 0 && (
                          <p className="text-xs text-muted-foreground mt-1">
                            GEO: {template.geo.join(', ')}
                          </p>
                        )}
                        {template.project && template.project.length > 0 && (
                          <p className="text-xs text-muted-foreground mt-1">
                            Проекты: {template.project.join(', ')}
                          </p>
                        )}
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                        <ChannelIcon className="h-5 w-5"/>
                        <span>{template.channel}</span>
                    </div>
                </div>
                <CardDescription>{template.description}</CardDescription>
              </CardHeader>
              <CardContent className="flex flex-1 flex-col justify-end">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-xs text-muted-foreground mb-1">Эффективность</p>
                        <PerformanceStars count={template.performance} />
                    </div>
                    <Button>
                        <ClipboardCopy className="mr-2 h-4 w-4" />
                        Клонировать
                    </Button>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Empty State */}
      {filteredTemplates.length === 0 && (
        <Card>
          <CardContent className="py-8 text-center">
            <p className="text-muted-foreground">
              Шаблоны не найдены. Попробуйте изменить фильтры или поисковый запрос.
            </p>
          </CardContent>
        </Card>
      )}
      </div>
);
};


// --- Builder Components ---

const triggerElements = [
  { name: 'Попадание в сегмент', icon: GitBranch, description: 'Срабатывает при попадании игрока в определенный сегмент.', type: 'segmentTrigger' },
  { name: 'Регистрация', icon: PlusCircle, description: 'Сценарий запускается при регистрации нового пользователя.', type: 'registrationTrigger' },
  { name: 'Первый депозит', icon: CheckCircle, description: 'Срабатывает после первого пополнения счета.', type: 'depositTrigger' },
];

const actionElements = [
  { name: 'Отправить Email', icon: Mail, description: 'Отправка email-сообщения через SendGrid.', type: 'emailAction' },
  { name: 'Отправить Push', icon: Smartphone, description: 'Отправка push-уведомления.', type: 'pushAction' },
  { name: 'Отправить SMS', icon: MessageSquare, description: 'Отправка SMS через Twilio.', type: 'smsAction' },
  { name: 'AI Звонок', icon: PhoneCall, description: 'Инициировать звонок через Twilio с AI-ассистентом.', type: 'aiCallAction' },
  { name: 'In-App сообщение', icon: Zap, description: 'Показ сообщения внутри приложения.', type: 'inappAction' },
  { name: 'Начислить бонус', icon: Gift, description: 'Начисление бонусных баллов или фриспинов игроку.', type: 'bonusAction' },
];

const logicElements = [
  { name: 'Задержка', icon: Clock, description: 'Пауза в сценарии на заданное время.', type: 'delayLogic' },
  { name: 'Условие "Если/То"', icon: GitBranch, description: 'Разветвление сценария на основе данных игрока.', type: 'ifElseLogic' },
  { name: 'A/B тест', icon: Activity, description: 'Разделение аудитории для проверки гипотез.', type: 'abTestLogic' },
];

const elementLibrary = {
    ...triggerElements.reduce((acc, el) => ({ ...acc, [el.type]: el }), {}),
    ...actionElements.reduce((acc, el) => ({ ...acc, [el.type]: el }), {}),
    ...logicElements.reduce((acc, el) => ({ ...acc, [el.type]: el }), {}),
};


const NodeConfigPanel = ({ node, isOpen, onOpenChange }: { node: Node | null, isOpen: boolean, onOpenChange: (open: boolean) => void }) => {
    if (!node) return null;

    const renderForm = () => {
        switch(node.data.configType) {
            case 'segmentTrigger':
                return (
                     <div className="space-y-4">
                        <Label>Выберите сегмент</Label>
                        <Select defaultValue={segmentsData[2].id}>
                            <SelectTrigger>
                                <SelectValue placeholder="Выберите сегмент..." />
                            </SelectTrigger>
                            <SelectContent>
                                {segmentsData.map(s => <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>)}
                            </SelectContent>
                        </Select>
                        <Card className="bg-muted/50">
                            <CardContent className="p-3 text-sm text-muted-foreground">
                                <p className="font-bold mb-2">Описание сегмента:</p>
                                {segmentsData.find(s => s.id === (node.data.config?.segmentId || segmentsData[2].id))?.description}
                            </CardContent>
                        </Card>
                     </div>
                );
            case 'emailAction':
                return (
                    <div className="space-y-4">
                        <div>
                            <Label>Интеграция</Label>
                            <div className="flex items-center gap-2 rounded-md border p-2 bg-muted/50">
                                <img src="https://www.vectorlogo.zone/logos/sendgrid/sendgrid-icon.svg" alt="SendGrid" className="h-5 w-5"/>
                                <span className="text-sm font-medium">Отправка через SendGrid</span>
                            </div>
                        </div>
                         <div>
                            <Label htmlFor="email-template">Шаблон письма</Label>
                            <Select defaultValue="we-miss-you">
                                <SelectTrigger id="email-template"><SelectValue /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="we-miss-you">We miss you bonus</SelectItem>
                                    <SelectItem value="welcome-gift">Welcome Gift</SelectItem>
                                    <SelectItem value="deposit-success">Успешный депозит</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div>
                            <Label htmlFor="email-subject">Тема письма</Label>
                            <Input id="email-subject" defaultValue="Для вас специальный бонус!"/>
                        </div>
                        <div>
                            <Label>Контент</Label>
                            <Tabs defaultValue="ai" className="w-full">
                                <TabsList className="grid w-full grid-cols-2">
                                    <TabsTrigger value="ai"><Bot className="mr-2 h-4 w-4"/> С AI</TabsTrigger>
                                    <TabsTrigger value="manual">Редактор</TabsTrigger>
                                </TabsList>
                                <TabsContent value="ai" className="pt-4 space-y-2">
                                    <Textarea placeholder="Опишите суть письма: напомнить про бонус, поздравить с годовщиной регистрации..." defaultValue="Напомни игроку, что мы скучаем и даем ему 25 фриспинов на Book of Ra, если он вернется."/>
                                    <Button className="w-full"><Bot className="mr-2 h-4 w-4"/>Сгенерировать</Button>
                                </TabsContent>
                                <TabsContent value="manual" className="pt-4">
                                    <Textarea defaultValue="Привет, {{firstName}}! Мы скучали! Чтобы скрасить твое возвращение, мы начислили тебе 25 фриспинов в игре Book of Ra. Жми на кнопку и забирай свой подарок!" className="min-h-[200px]"/>
                                </TabsContent>
                            </Tabs>
                        </div>
                    </div>
                )
             case 'aiCallAction':
                return (
                    <div className="space-y-4">
                        <div>
                            <Label>Интеграция</Label>
                            <div className="flex items-center gap-2 rounded-md border p-2 bg-muted/50">
                                <img src="https://www.vectorlogo.zone/logos/twilio/twilio-icon.svg" alt="Twilio" className="h-5 w-5"/>
                                <span className="text-sm font-medium">Звонок через Twilio</span>
                            </div>
                        </div>
                        <div>
                            <Label htmlFor="ai-voice">Голос AI</Label>
                            <Select defaultValue="female-1">
                                <SelectTrigger id="ai-voice"><SelectValue /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="female-1">Женский (Eva)</SelectItem>
                                    <SelectItem value="male-1">Мужской (Alex)</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div>
                            <Label htmlFor="ai-prompt">Сценарий звонка (AI промпт)</Label>
                            <Textarea
                                id="ai-prompt"
                                placeholder="Опишите цель звонка и что должен сказать AI. Вы можете использовать переменные, например {{firstName}}."
                                defaultValue="Привет, {{firstName}}. Мы из AIGAMING.BOT. Заметили, что вы давно не заходили. Хотим предложить вам специальный бонус - 50 фриспинов. Вам интересно?"
                                className="min-h-[200px]"
                            />
                        </div>
                    </div>
                );
            case 'ifElseLogic':
                return (
                    <div className="space-y-4">
                       <Label>Условие ветвления</Label>
                       <div className="p-4 border rounded-lg space-y-2 bg-muted/30">
                           <p className="text-sm">Если пользователь соответствует правилу:</p>
                           <div className="flex items-center gap-2">
                               <Select defaultValue="Monetary Value (total spend)">
                                   <SelectTrigger><SelectValue/></SelectTrigger>
                                   <SelectContent><SelectItem value="Monetary Value (total spend)">Lifetime Spend</SelectItem></SelectContent>
                               </Select>
                               <Select defaultValue="больше чем">
                                   <SelectTrigger><SelectValue/></SelectTrigger>
                                   <SelectContent><SelectItem value="больше чем">больше чем</SelectItem></SelectContent>
                               </Select>
                               <Input placeholder="Значение" defaultValue="1000" />
                           </div>
                       </div>
                       <p className="text-sm text-muted-foreground">Пользователи, не соответствующие правилу, пойдут по ветке "Else".</p>
                    </div>
                )
             case 'abTestLogic':
                return (
                    <div className="space-y-6">
                        <Label>Разделение трафика</Label>
                        <div className="flex items-center gap-4">
                            <span className="text-sm font-medium">Ветка A</span>
                            <Slider defaultValue={[50]} max={100} step={1} />
                            <span className="text-sm font-medium">Ветка B</span>
                        </div>
                        <div className="flex justify-between text-sm font-bold text-primary">
                            <span>50%</span>
                            <span>50%</span>
                        </div>
                        <p className="text-xs text-muted-foreground">Аудитория будет случайным образом разделена в указанной пропорции для отправки разных версий сообщения.</p>
                    </div>
                )
            case 'bonusAction':
                 return (
                     <div className="space-y-4">
                         <div>
                            <Label htmlFor="bonus-type">Тип бонуса</Label>
                            <Select defaultValue="freespins">
                                <SelectTrigger id="bonus-type">
                                    <SelectValue placeholder="Выберите тип" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="freespins">Фриспины</SelectItem>
                                    <SelectItem value="deposit_bonus">Бонус на депозит</SelectItem>
                                    <SelectItem value="cashback">Кэшбек</SelectItem>
                                </SelectContent>
                            </Select>
                         </div>
                         <div>
                            <Label htmlFor="bonus-amount">Количество / Процент</Label>
                            <Input id="bonus-amount" type="number" defaultValue="25" />
                         </div>
                         <div>
                            <Label htmlFor="bonus-wager">Вейджер (Wager)</Label>
                            <Input id="bonus-wager" type="number" defaultValue="40" placeholder="x40" />
                         </div>
                         <div>
                            <Label htmlFor="bonus-ttl">Срок жизни бонуса (в часах)</Label>
                            <Input id="bonus-ttl" type="number" defaultValue="72" />
                         </div>
                     </div>
                 )
            default:
                return <p className="text-muted-foreground">Для этого элемента нет дополнительных настроек.</p>
        }
    }

    return (
        <Sheet open={isOpen} onOpenChange={onOpenChange}>
            <SheetContent className="sm:max-w-md">
                <SheetHeader>
                    <SheetTitle>Настройка: {node.data.label}</SheetTitle>
                    <SheetDescription>
                        Отредактируйте параметры для выбранного элемента сценария.
                    </SheetDescription>
                </SheetHeader>
                <div className="py-6">
                    {renderForm()}
                </div>
                <SheetFooter>
                    <SheetClose asChild>
                        <Button type="button" variant="secondary">Отмена</Button>
                    </SheetClose>
                     <SheetClose asChild>
                        <Button type="submit">Сохранить</Button>
                    </SheetClose>
                </SheetFooter>
            </SheetContent>
        </Sheet>
    )
}

// --- React Flow Implementation ---

const initialNodes: Node[] = [
  { id: '1', type: 'custom', position: { x: 250, y: 5 }, data: { label: 'Триггер: Попал в сегмент', description: 'Сегмент: Риск оттока (предиктивный)', icon: GitBranch, configType: 'segmentTrigger' } },
  { id: '2', type: 'custom', position: { x: 250, y: 155 }, data: { label: 'Условие: VIP игрок?', description: 'Если Lifetime Spend > €1000', icon: GitBranch, configType: 'ifElseLogic' } },
  { id: '3', type: 'custom', position: { x: 50, y: 305 }, data: { label: 'Действие: Начислить бонус', description: 'Тип: Кэшбек, Кол-во: 10%', icon: Gift, configType: 'bonusAction' } },
  { id: '4', type: 'custom', position: { x: 450, y: 305 }, data: { label: 'Логика: A/B тест', description: 'Разделение 50% / 50%', icon: Activity, configType: 'abTestLogic' } },
  { id: '5', type: 'custom', position: { x: 350, y: 455 }, data: { label: 'Действие: Email (Скидка)', description: 'Шаблон: "Скидка 15%"', icon: Mail, configType: 'emailAction' } },
  { id: '6', type: 'custom', position: { x: 550, y: 455 }, data: { label: 'Действие: Email (Бонус)', description: 'Шаблон: "Бонус 25 FS"', icon: Mail, configType: 'emailAction' } },
];

const initialEdges: Edge[] = [
  { id: 'e1-2', source: '1', target: '2', animated: true, type: 'custom' },
  { id: 'e2-3', source: '2', target: '3', label: 'Да', type: 'custom' },
  { id: 'e2-4', source: '2', target: '4', label: 'Нет', type: 'custom' },
  { id: 'e4-5', source: '4', target: '5', label: 'Ветка A', type: 'custom' },
  { id: 'e4-6', source: '4', target: '6', label: 'Ветка B', type: 'custom' },
];

const CustomNode = ({ data }: { data: { label: string, description: string, icon: React.ElementType } }) => {
  const Icon = data.icon;
  return (
    <>
      <Handle type="target" position={Position.Top} className="!bg-primary" />
      <Card className="w-72 shadow-lg hover:shadow-xl transition-shadow bg-card z-10 hover:border-primary">
        <CardContent className="p-4">
          <div className="flex items-center gap-3 mb-2">
            <Icon className="h-5 w-5 text-primary" />
            <h4 className="font-semibold">{data.label}</h4>
          </div>
          <p className="text-sm text-muted-foreground">{data.description}</p>
        </CardContent>
      </Card>
      <Handle type="source" position={Position.Bottom} className="!bg-primary" />
    </>
  );
};

function CustomEdge({ id, sourceX, sourceY, targetX, targetY, sourcePosition, targetPosition, style = {}, label }: any) {
  const { setEdges } = useReactFlow();
  const [edgePath, labelX, labelY] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });

  const onEdgeClick = (evt: React.MouseEvent) => {
    evt.stopPropagation();
    setEdges((edges) => edges.filter((edge) => edge.id !== id));
  };

  return (
    <>
      <BaseEdge path={edgePath} style={style} />
      <EdgeLabelRenderer>
        <div
          style={{
            position: 'absolute',
            transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
            pointerEvents: 'all',
          }}
          className="nodrag nopan bg-background p-1 rounded-md text-xs font-semibold"
        >
          {label}
        </div>
        <div
           style={{
            position: 'absolute',
            transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
            pointerEvents: 'all',
          }}
          className="nodrag nopan group"
        >
            <Button
                variant="destructive"
                className="h-6 w-6 opacity-0 group-hover:opacity-100"
                size="icon"
                onClick={onEdgeClick}
                >
                <Trash2 className="h-3 w-3" />
            </Button>
        </div>
      </EdgeLabelRenderer>
    </>
  );
}

const nodeTypes = {
  custom: CustomNode,
};

const edgeTypes = {
  custom: CustomEdge,
};

let id = 7;
const getId = () => `dndnode_${id++}`;

const Builder = ({ onExit, scenario }: { onExit: () => void; scenario: ScenarioData | null }) => {
    const reactFlowWrapper = React.useRef<HTMLDivElement>(null);
    const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
    const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
    const [selectedNode, setSelectedNode] = React.useState<Node | null>(null);
    const [isSheetOpen, setIsSheetOpen] = React.useState(false);
    const [isCopilotOpen, setIsCopilotOpen] = React.useState(false);
    const { screenToFlowPosition } = useReactFlow();

    const onConnect: OnConnect = React.useCallback(
        (params) => setEdges((eds) => addEdge({ ...params, animated: true, type: 'custom' }, eds)),
        [setEdges]
    );

    const handleNodeClick = React.useCallback((event: React.MouseEvent, node: Node) => {
        setSelectedNode(node);
        setIsSheetOpen(true);
    }, []);

    const onDragStart = (event: React.DragEvent<HTMLDivElement>, nodeType: string) => {
        event.dataTransfer.setData('application/reactflow', nodeType);
        event.dataTransfer.effectAllowed = 'move';
    };

    const onDragOver = React.useCallback((event: React.DragEvent) => {
        event.preventDefault();
        event.dataTransfer.dropEffect = 'move';
    }, []);

    const onDrop = React.useCallback(
        (event: React.DragEvent) => {
            event.preventDefault();

            if (!reactFlowWrapper.current) return;
            const type = event.dataTransfer.getData('application/reactflow');

            if (typeof type === 'undefined' || !type) {
                return;
            }

            const position = screenToFlowPosition({
                x: event.clientX,
                y: event.clientY,
            });

            const elementInfo = elementLibrary[type as keyof typeof elementLibrary];

            if (!elementInfo) return;

            const newNode: Node = {
                id: getId(),
                type: 'custom',
                position,
                data: { 
                    label: (elementInfo as any).name, 
                    description: (elementInfo as any).description, 
                    icon: (elementInfo as any).icon, 
                    configType: (elementInfo as any).type 
                },
            };
            
            setNodes((nds) => nds.concat(newNode));
        },
        [screenToFlowPosition, setNodes]
    );

    const DraggableNode = ({ item }: { item: { name: string, icon: React.ElementType, description: string, type: string } }) => (
        <div
            className="mb-1.5 cursor-grab rounded-lg border p-2 hover:shadow-md active:cursor-grabbing bg-background"
            onDragStart={(event) => onDragStart(event, item.type)}
            draggable
        >
            <div className="flex items-center gap-2">
                <item.icon className="h-4 w-4 text-primary" />
                <span className="text-sm font-semibold">{item.name}</span>
            </div>
            <p className="mt-1 text-xs text-muted-foreground">{item.description}</p>
        </div>
    );
    
    return (
        <div className="fixed inset-0 bg-background z-50 flex flex-col">
            <header className="flex h-16 shrink-0 items-center justify-between border-b bg-background/95 px-6 flex-wrap gap-2 z-10">
                <div className="flex items-center gap-4">
                    <Button variant="outline" size="icon" onClick={onExit}>
                        <ArrowLeft className="h-4 w-4" />
                    </Button>
                    <div>
                        <h1 className="text-xl font-bold tracking-tight">{scenario?.name || "Новый сценарий"}</h1>
                        <p className="text-sm text-muted-foreground">Создавайте автоматизированные CRM-цепочки</p>
                    </div>
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                    <Button variant="outline" size="sm"> <Sparkles className="mr-2 h-4 w-4" />Prettify</Button>
                    <Button variant="outline">Сохранить как черновик</Button>
                    <Button>Активировать сценарий</Button>
                    <Button variant="default" className="bg-accent text-accent-foreground hover:bg-accent/90" onClick={() => setIsCopilotOpen(true)}>
                        <BotMessageSquare className="mr-2 h-4 w-4" />
                        AI Co-pilot
                    </Button>
                </div>
            </header>
            <div className="flex flex-1 flex-row overflow-hidden">
                <aside className="hidden w-[280px] flex-shrink-0 flex-col border-r bg-background/80 md:flex">
                    <div className="flex h-full flex-col p-4">
                        <h3 className="mb-4 text-lg font-semibold">Элементы</h3>
                        <ScrollArea className="flex-1 -mr-4 pr-4">
                            <div className="space-y-4">
                                <div>
                                    <h4 className="mb-2 text-sm font-medium text-muted-foreground">Триггеры</h4>
                                    {triggerElements.map(item => <DraggableNode key={item.name} item={item} />)}
                                </div>
                                <div>
                                    <h4 className="mb-2 text-sm font-medium text-muted-foreground">Действия</h4>
                                    {actionElements.map(item => <DraggableNode key={item.name} item={item} />)}
                                </div>
                                <div>
                                    <h4 className="mb-2 text-sm font-medium text-muted-foreground">Логика</h4>
                                    {logicElements.map(item => <DraggableNode key={item.name} item={item} />)}
                                </div>
                            </div>
                        </ScrollArea>
                    </div>
                </aside>
                <main className="flex-1" ref={reactFlowWrapper}>
                    <ReactFlow
                        nodes={nodes}
                        edges={edges}
                        onNodesChange={onNodesChange}
                        onEdgesChange={onEdgesChange}
                        onConnect={onConnect}
                        onNodeClick={handleNodeClick}
                        nodeTypes={nodeTypes}
                        edgeTypes={edgeTypes}
                        onDrop={onDrop}
                        onDragOver={onDragOver}
                        fitView
                    >
                        <Controls />
                        <MiniMap />
                        <Background gap={16} />
                    </ReactFlow>
                </main>
            </div>
            <NodeConfigPanel node={selectedNode} isOpen={isSheetOpen} onOpenChange={setIsSheetOpen} />
            <Sheet open={isCopilotOpen} onOpenChange={setIsCopilotOpen}>
                <SheetContent className="sm:max-w-lg">
                    <SheetHeader>
                        <SheetTitle className="flex items-center gap-2"><BotMessageSquare /> AI Co-pilot</SheetTitle>
                        <SheetDescription>
                            Ваш помощник в создании эффективных сценариев. Опишите задачу, и AI предложит решение.
                        </SheetDescription>
                    </SheetHeader>
                    <div className="py-4 h-[calc(100%-80px)]">
                       <AiCopilotChat copilotType="scenario_builder" />
                    </div>
                </SheetContent>
            </Sheet>
        </div>
    );
};

const BuilderWrapper = (props: { onExit: () => void; scenario: ScenarioData | null }) => (
    <ReactFlowProvider>
        <Builder {...props} />
    </ReactFlowProvider>
);


function ScenariosPageContent() {
    const [activeTab, setActiveTab] = React.useState('campaigns');
    const [isBuilderMode, setIsBuilderMode] = React.useState(false);
    const [editingScenario, setEditingScenario] = React.useState<ScenarioData | null>(null);

    const handleEditClick = (scenario: ScenarioData) => {
        setEditingScenario(scenario);
        setIsBuilderMode(true);
    };

    const handleTabChange = (value: string) => {
        if (value === 'builder') {
            setEditingScenario(null);
            setIsBuilderMode(true);
        } else {
            setIsBuilderMode(false);
            setActiveTab(value);
        }
    };
    
    const handleExitBuilder = () => {
        setIsBuilderMode(false);
        setEditingScenario(null);
    };

    return (
        <div className="p-4 md:p-6 lg:p-8">
            <h1 className="text-2xl font-bold tracking-tight">Сценарии</h1>
            <p className="text-muted-foreground mb-6">
                Создавайте, управляйте и анализируйте ваши CRM-кампании и сценарии.
            </p>
            <Tabs value={isBuilderMode ? 'builder' : activeTab} onValueChange={handleTabChange} className="w-full">
                <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4">
                    <TabsTrigger value="campaigns">Все кампании</TabsTrigger>
                    <TabsTrigger value="active">Активные</TabsTrigger>
                    <TabsTrigger value="templates">Шаблоны сценариев</TabsTrigger>
                    <TabsTrigger value="builder">Конструктор</TabsTrigger>
                </TabsList>
                <TabsContent value="campaigns" className="mt-6">
                    <AllCampaignsTab onEdit={handleEditClick} />
                </TabsContent>
                <TabsContent value="active" className="mt-6">
                    <AllCampaignsTab onEdit={handleEditClick} />
                </TabsContent>
                <TabsContent value="templates" className="mt-6">
                    <TemplatesTab />
                </TabsContent>
            </Tabs>

            {isBuilderMode && <BuilderWrapper onExit={handleExitBuilder} scenario={editingScenario} />}
        </div>
    );
}

export default function ScenariosPage() {
    return (
        <ClipboardProvider>
            <ScenariosPageContent />
        </ClipboardProvider>
    );
}
