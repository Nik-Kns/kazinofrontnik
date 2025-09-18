"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { 
  TrendingUp, 
  TrendingDown, 
  AlertCircle, 
  Lightbulb, 
  BarChart3, 
  Users,
  DollarSign,
  Activity,
  Target,
  Award,
  Zap,
  Clock,
  CheckCircle2,
  XCircle,
  Timer,
  Sparkles,
  Brain,
  ChevronRight,
  Trophy,
  Star,
  ClipboardCheck,
  Search,
  ArrowUp,
  MapPin,
  Send,
  Filter,
  Settings,
  Calendar,
  GamepadIcon as Gamepad2,
  CreditCard,
  PieChart,
  ChevronDown,
  ChevronUp,
  Shield,
  FileText,
  Heart
} from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { getRecommendationsWithStatus, updateRecommendationStatus, type Recommendation } from "@/lib/recommendations-data";
import { SelectedKpiTile } from "@/components/analytics/analytics-filters";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { OnboardingStatus } from "@/components/dashboard/onboarding-status";
import { AlertsAndSignals } from "@/components/analytics/alerts-and-signals";
import { AdvancedMetricsChart } from "@/components/dashboard/advanced-metrics-chart";

// Компонент для сворачиваемых секций
function CollapsibleSection({ 
  id, 
  title, 
  children, 
  defaultOpen = true 
}: { 
  id: string; 
  title: string; 
  children: React.ReactNode;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem(`dashboard_section_${id}`);
      return saved ? JSON.parse(saved) : defaultOpen;
    } catch {
      return defaultOpen;
    }
  });
  
  const toggle = () => {
    const next = !open;
    setOpen(next);
    try { 
      localStorage.setItem(`dashboard_section_${id}`, JSON.stringify(next)); 
    } catch {}
  };
  
  return (
    <Card>
      <CardHeader className="pb-3 flex flex-row items-center justify-between">
        <div>
          <CardTitle>{title}</CardTitle>
          {!open && <CardDescription>Секция скрыта</CardDescription>}
        </div>
        <button 
          onClick={toggle} 
          className="text-sm px-2 py-1 rounded border hover:bg-muted transition"
        >
          {open ? (
            <>
              <ChevronUp className="inline h-4 w-4 mr-1"/>
              Свернуть
            </>
          ) : (
            <>
              <ChevronDown className="inline h-4 w-4 mr-1"/>
              Развернуть
            </>
          )}
        </button>
      </CardHeader>
      {open && <CardContent>{children}</CardContent>}
    </Card>
  );
}

// Компонент для рисков и предупреждений
function RisksAndWarnings() {
  const risks = [
    {
      id: '1',
      type: 'critical',
      title: 'Высокий отток VIP игроков',
      description: '12% VIP игроков не активны более 14 дней',
      action: 'Запустить VIP реактивацию',
      icon: AlertCircle,
      color: 'text-red-600',
      bgColor: 'bg-red-50'
    },
    {
      id: '2',
      type: 'warning',
      title: 'Снижение конверсии в FTD',
      description: 'Конверсия упала на 18% за последнюю неделю',
      action: 'Оптимизировать воронку',
      icon: TrendingDown,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-50'
    },
    {
      id: '3',
      type: 'info',
      title: 'Новый сегмент обнаружен',
      description: 'Weekend Warriors - игроки активные только в выходные',
      action: 'Создать таргетированную кампанию',
      icon: Users,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50'
    }
  ];

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Shield className="h-5 w-5 text-primary" />
          <CardTitle>Риски и предупреждения</CardTitle>
        </div>
        <CardDescription>
          Требуют вашего внимания
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        {risks.map((risk) => {
          const Icon = risk.icon;
          return (
            <div 
              key={risk.id} 
              className={cn(
                "p-3 rounded-lg border",
                risk.bgColor
              )}
            >
              <div className="flex items-start gap-3">
                <Icon className={cn("h-5 w-5 mt-0.5", risk.color)} />
                <div className="flex-1">
                  <h4 className="font-medium text-sm">{risk.title}</h4>
                  <p className="text-xs text-muted-foreground mt-1">
                    {risk.description}
                  </p>
                  <Button 
                    size="sm" 
                    variant="link" 
                    className="h-auto p-0 mt-2 text-xs"
                  >
                    {risk.action} →
                  </Button>
                </div>
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}

// Компонент кратких трендов
function TrendsSummary() {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Activity className="h-5 w-5 text-primary" />
            <CardTitle>Краткие тренды</CardTitle>
          </div>
          <Button size="sm" variant="outline" asChild>
            <Link href="/trends">
              Подробный анализ
              <ChevronRight className="ml-1 h-3 w-3" />
            </Link>
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid gap-3 md:grid-cols-2">
          <div className="space-y-2">
            <h4 className="text-sm font-medium">Положительные тренды</h4>
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-sm">
                <TrendingUp className="h-4 w-4 text-green-600" />
                <span>LTV вырос на 12% за месяц</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <TrendingUp className="h-4 w-4 text-green-600" />
                <span>Конверсия в депозит +5%</span>
              </div>
            </div>
          </div>
          <div className="space-y-2">
            <h4 className="text-sm font-medium">Требуют внимания</h4>
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-sm">
                <TrendingDown className="h-4 w-4 text-red-600" />
                <span>Retention D7 -8%</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <AlertCircle className="h-4 w-4 text-yellow-600" />
                <span>Рост жалоб +3%</span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default function DashboardPage() {
  const [savedFilters, setSavedFilters] = useState<any>(null);
  const [selectedMetrics, setSelectedMetrics] = useState<string[]>(() => {
    // Загружаем выбранные метрики из localStorage
    try {
      const saved = localStorage.getItem('analyticsSelectedTile') || localStorage.getItem('selectedKpis');
      if (saved) {
        const parsed = JSON.parse(saved);
        return Array.isArray(parsed) ? parsed : parsed.map((m: any) => m.key || m);
      }
    } catch {
      // Метрики по умолчанию
      return ['ggr', 'retention_rate', 'crm_spend', 'arpu', 'conversion_rate'];
    }
    return ['ggr', 'retention_rate', 'crm_spend', 'arpu', 'conversion_rate'];
  });
  const [activeMetric, setActiveMetric] = useState<string>(() => {
    try {
      const saved = localStorage.getItem('activeMetric');
      if (saved) return saved;
      // Если нет сохраненной, берем первую из выбранных
      const savedMetrics = localStorage.getItem('analyticsSelectedTile') || localStorage.getItem('selectedKpis');
      if (savedMetrics) {
        const parsed = JSON.parse(savedMetrics);
        const metrics = Array.isArray(parsed) ? parsed : parsed.map((m: any) => m.key || m);
        return metrics[0] || 'ggr';
      }
    } catch {}
    return 'ggr';
  });
  const [timeRange, setTimeRange] = useState<string>(() => {
    try {
      return localStorage.getItem('selectedKpiTimeRange') || 'today';
    } catch {
      return 'today';
    }
  });

  useEffect(() => {
    // Загружаем сохраненные фильтры из localStorage
    try {
      const filters = localStorage.getItem('analyticsFilters');
      if (filters) {
        setSavedFilters(JSON.parse(filters));
      }
    } catch (error) {
      console.error('Error loading saved filters:', error);
    }
  }, []);

  useEffect(() => {
    // Следим за изменениями выбранных метрик и временного периода в localStorage
    const handleStorageChange = () => {
      try {
        // Проверяем обновления выбранных метрик
        const savedMetrics = localStorage.getItem('analyticsSelectedTile') || localStorage.getItem('selectedKpis');
        if (savedMetrics) {
          const parsed = JSON.parse(savedMetrics);
          const newMetrics = Array.isArray(parsed) ? parsed : parsed.map((m: any) => m.key || m);
          setSelectedMetrics(newMetrics);
          
          // Если активная метрика не в новом списке, сбрасываем её
          if (activeMetric && !newMetrics.includes(activeMetric)) {
            setActiveMetric(newMetrics[0] || '');
            localStorage.setItem('activeMetric', newMetrics[0] || '');
          }
        }
        
        const savedTimeRange = localStorage.getItem('selectedKpiTimeRange');
        if (savedTimeRange) {
          setTimeRange(savedTimeRange);
        }
        
        const savedActiveMetric = localStorage.getItem('activeMetric');
        if (savedActiveMetric) {
          setActiveMetric(savedActiveMetric);
        }
      } catch {}
    };

    window.addEventListener('storage', handleStorageChange);
    // Также проверяем при изменении через наш же компонент
    const interval = setInterval(handleStorageChange, 1000);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      clearInterval(interval);
    };
  }, [activeMetric]);

  return (
    <div className="flex flex-col gap-6 p-6">
      {/* Заголовок */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
          <BarChart3 className="h-8 w-8 text-primary" />
          Командный центр
        </h1>
        <p className="text-muted-foreground mt-1">
          Управление казино с помощью ИИ-аналитики
        </p>
      </div>

      {/* Секция 1: Базовая настройка и аудит */}
      <CollapsibleSection 
        id="basic-setup-audit" 
        title="⚙️ Базовая настройка и аудит" 
        defaultOpen={true}
      >
        <OnboardingStatus />
      </CollapsibleSection>

      {/* Основные метрики и аналитика */}
      <div className="space-y-6">
        {/* Избранные метрики */}
        <SelectedKpiTile 
          activeMetric={activeMetric}
          onMetricClick={setActiveMetric}
        />
        
        {/* График динамики выбранных метрик */}
        <AdvancedMetricsChart 
          selectedMetrics={selectedMetrics}
          timeRange={timeRange}
          activeMetric={activeMetric}
          onMetricClick={setActiveMetric}
        />
        
        {/* Риски и предупреждения */}
        <RisksAndWarnings />
      </div>

      {/* Краткие тренды с ссылкой на детальный анализ */}
      <TrendsSummary />

      {/* Секция 3: Рекомендации и Действия */}
      <CollapsibleSection 
        id="recommendations-actions" 
        title="💡 Рекомендации и Действия" 
        defaultOpen={true}
      >
        <div className="space-y-6">
          {/* AI Рекомендации и алерты */}
          <AlertsAndSignals />

          {/* Следующие шаги */}
          <Card>
            <CardHeader>
              <CardTitle>Рекомендуемые следующие шаги</CardTitle>
              <CardDescription>
                На основе анализа текущей ситуации
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="h-6 w-6 rounded-full bg-red-100 flex items-center justify-center mt-0.5">
                    <span className="text-xs font-bold text-red-600">1</span>
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium text-sm">Срочно: Запустить VIP реактивацию</h4>
                    <p className="text-xs text-muted-foreground mt-1">
                      892 VIP игрока в зоне риска. Потенциальная потеря €125,000/мес
                    </p>
                    <Button size="sm" variant="link" className="h-auto p-0 mt-2">
                      Создать кампанию →
                    </Button>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="h-6 w-6 rounded-full bg-yellow-100 flex items-center justify-center mt-0.5">
                    <span className="text-xs font-bold text-yellow-600">2</span>
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium text-sm">Оптимизировать Welcome серию</h4>
                    <p className="text-xs text-muted-foreground mt-1">
                      Конверсия в FTD упала на 18%. Требуется A/B тестирование
                    </p>
                    <Button size="sm" variant="link" className="h-auto p-0 mt-2">
                      Настроить тест →
                    </Button>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="h-6 w-6 rounded-full bg-blue-100 flex items-center justify-center mt-0.5">
                    <span className="text-xs font-bold text-blue-600">3</span>
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium text-sm">Создать сегмент "Weekend Warriors"</h4>
                    <p className="text-xs text-muted-foreground mt-1">
                      Новая возможность: 2,340 игроков активны только в выходные
                    </p>
                    <Button size="sm" variant="link" className="h-auto p-0 mt-2">
                      Создать сегмент →
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </CollapsibleSection>
    </div>
  );
}