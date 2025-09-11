"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
  PieChart
} from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { FullMetricsDashboard } from "@/components/dashboard/full-metrics-dashboard";
import { SelectedKpiTile } from "@/components/analytics/analytics-filters";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

// Типы для ИИ-рекомендаций
interface AIRecommendation {
  id: string;
  title: string;
  description: string;
  priority: 'critical' | 'high' | 'medium' | 'low';
  impact: string;
  status: 'new' | 'in_progress' | 'completed' | 'dismissed';
  category: 'retention' | 'revenue' | 'engagement' | 'risk';
  actions: {
    primary: { label: string; href?: string; action?: () => void };
    secondary?: { label: string; action?: () => void };
  };
  metrics?: { name: string; value: string; trend: 'up' | 'down' }[];
  deadline?: Date;
}

// Полный список доступных метрик
const allMetricsData = [
  {
    id: 'churn',
    name: 'Churn Rate',
    value: 8.2,
    target: 5,
    unit: '%',
    trend: 'down',
    change: -1.3,
    icon: Users,
    color: 'text-red-600',
    bgColor: 'bg-red-50'
  },
  {
    id: 'ltv',
    name: 'LTV',
    value: 485,
    target: 500,
    unit: '€',
    trend: 'up',
    change: +23,
    icon: DollarSign,
    color: 'text-green-600',
    bgColor: 'bg-green-50'
  },
  {
    id: 'deposits',
    name: 'Депозиты',
    value: 1240000,
    target: 1500000,
    unit: '€',
    trend: 'up',
    change: +5.2,
    icon: TrendingUp,
    color: 'text-blue-600',
    bgColor: 'bg-blue-50'
  },
  {
    id: 'retention',
    name: 'Retention D30',
    value: 62,
    target: 70,
    unit: '%',
    trend: 'down',
    change: -3.1,
    icon: Activity,
    color: 'text-purple-600',
    bgColor: 'bg-purple-50'
  },
  {
    id: 'arpu',
    name: 'ARPU',
    value: 125,
    target: 150,
    unit: '€',
    trend: 'up',
    change: +8.5,
    icon: PieChart,
    color: 'text-blue-600',
    bgColor: 'bg-blue-50'
  },
  {
    id: 'conversion',
    name: 'Конверсия FTD',
    value: 24,
    target: 30,
    unit: '%',
    trend: 'up',
    change: +4.2,
    icon: Target,
    color: 'text-green-600',
    bgColor: 'bg-green-50'
  },
  {
    id: 'bonus_utilization',
    name: 'Использование бонусов',
    value: 67,
    target: 80,
    unit: '%',
    trend: 'down',
    change: -2.1,
    icon: Award,
    color: 'text-orange-600',
    bgColor: 'bg-orange-50'
  },
  {
    id: 'sessions',
    name: 'Сессии/день',
    value: 3.2,
    target: 4.0,
    unit: '',
    trend: 'up',
    change: +6.8,
    icon: Activity,
    color: 'text-purple-600',
    bgColor: 'bg-purple-50'
  },
  {
    id: 'withdrawal_success',
    name: 'Успешность выводов',
    value: 94.2,
    target: 98,
    unit: '%',
    trend: 'up',
    change: +1.8,
    icon: CreditCard,
    color: 'text-green-600',
    bgColor: 'bg-green-50'
  },
  {
    id: 'tournament_participation',
    name: 'Участие в турнирах',
    value: 18,
    target: 25,
    unit: '%',
    trend: 'up',
    change: +3.5,
    icon: Gamepad2,
    color: 'text-indigo-600',
    bgColor: 'bg-indigo-50'
  }
];

// Моковые ИИ-рекомендации с расширенными параметрами для сценариев
const aiRecommendations: AIRecommendation[] = [
  {
    id: '1',
    title: 'Запустить кампанию реактивации для спящих игроков',
    description: 'Обнаружено 2,847 игроков без активности 30+ дней с высоким LTV в ГЕО DE, AT, CH',
    priority: 'critical',
    impact: '+12% реактивация в ГЕО DE',
    status: 'new',
    category: 'retention',
    actions: {
      primary: { 
        label: 'Создать кампанию', 
        href: `/builder?template=dormant-reactivation&audience=2847&segment=dormant_30_days&urgency=critical&expectedRevenue=142350&conversion=8-12` 
      },
      secondary: { label: 'Отложить', action: () => console.log('postponed') }
    },
    metrics: [
      { name: 'Потенциал', value: '+8-12% конверсия', trend: 'up' },
      { name: 'Сегмент', value: 'Спящие 30+ дней', trend: 'up' },
      { name: 'ГЕО', value: 'DE, AT, CH', trend: 'up' },
      { name: 'Канал', value: 'Email + Push', trend: 'up' }
    ],
    deadline: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000)
  },
  {
    id: '2',
    title: 'Оптимизировать бонусную программу для VIP сегмента',
    description: 'VIP игроки используют только 45% доступных бонусов в регионе UK, IE',
    priority: 'high',
    impact: '+25% использование бонусов VIP в UK',
    status: 'new',
    category: 'revenue',
    actions: {
      primary: { 
        label: 'Настроить бонусы', 
        href: `/builder?template=vip-bonus-optimization&audience=450&segment=vip_players&bonusUtilization=45&expectedRevenue=85000&urgency=high` 
      },
      secondary: { label: 'Подробнее', action: () => console.log('details') }
    },
    metrics: [
      { name: 'VIP активность', value: '71%', trend: 'down' },
      { name: 'Bonus ROI', value: '2.3x', trend: 'up' },
      { name: 'ГЕО', value: 'UK, IE', trend: 'up' },
      { name: 'Канал', value: 'In-App', trend: 'up' }
    ]
  },
  {
    id: '3',
    title: 'Риск оттока: 156 высокоценных игроков',
    description: 'Алгоритм обнаружил признаки скорого ухода у VIP игроков в ГЕО FR, BE',
    priority: 'critical',
    impact: '-15% отток VIP в ГЕО FR',
    status: 'in_progress',
    category: 'risk',
    actions: {
      primary: { 
        label: 'Применить стратегию', 
        href: `/builder?template=churn-risk-prevention&audience=156&segment=at_risk_vip&riskScore=8.7&potentialLoss=68000&daysToChurn=5-7&urgency=critical` 
      },
      secondary: { label: 'Игнорировать', action: () => console.log('ignored') }
    },
    metrics: [
      { name: 'Risk Score', value: '8.7/10', trend: 'up' },
      { name: 'Дней до ухода', value: '5-7', trend: 'down' },
      { name: 'ГЕО', value: 'FR, BE', trend: 'down' },
      { name: 'Канал', value: 'SMS + Call', trend: 'up' }
    ],
    deadline: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000)
  }
];

// Данные геймификации
const gamificationData = {
  level: 3,
  levelName: 'Retention Expert',
  currentXP: 720,
  nextLevelXP: 1000,
  achievements: [
    { id: '1', name: 'First Campaign', icon: Trophy, unlocked: true },
    { id: '2', name: 'Revenue Master', icon: DollarSign, unlocked: true },
    { id: '3', name: 'Retention Guru', icon: Users, unlocked: false },
    { id: '4', name: 'AI Pioneer', icon: Brain, unlocked: false }
  ],
  missions: [
    { id: '1', title: 'Выполнить 5 рекомендаций ИИ', progress: 3, total: 5, reward: '+100 XP' },
    { id: '2', title: 'Достичь 70% Retention Rate', progress: 62, total: 70, reward: '+250 XP' },
    { id: '3', title: 'Создать 3 успешные кампании', progress: 1, total: 3, reward: '+150 XP' }
  ]
};

export default function DashboardPage() {
  const [recommendations, setRecommendations] = useState(aiRecommendations);
  const [completedToday, setCompletedToday] = useState(2);
  const [totalRecommendations, setTotalRecommendations] = useState(12);
  const [auditPerformed, setAuditPerformed] = useState(false);
  const [retentionImprovements, setRetentionImprovements] = useState<any[]>([]);
  const [showImprovementsModal, setShowImprovementsModal] = useState(false);
  
  // Новые состояния для метрик
  const [selectedMetrics, setSelectedMetrics] = useState<string[]>(['churn', 'ltv', 'deposits', 'retention', 'arpu', 'conversion']);
  const [timeRange, setTimeRange] = useState<string>('');
  const [showMetricsModal, setShowMetricsModal] = useState(false);
  
  // Состояния для целей по метрикам
  const [goalsOpen, setGoalsOpen] = useState(false);
  const [metricGoals, setMetricGoals] = useState<Record<string, number>>({});
  const [tempGoals, setTempGoals] = useState<Record<string, string>>({});
  const [savedFilters, setSavedFilters] = useState<any>(null);

  // Фильтруем метрики по выбору
  const displayedMetrics = selectedMetrics.slice(0, 8).map(id => 
    allMetricsData.find(metric => metric.id === id)
  ).filter(Boolean);

  const handleRecommendationAction = (id: string, action: 'apply' | 'dismiss' | 'postpone') => {
    setRecommendations(prev => prev.map(rec => 
      rec.id === id 
        ? { ...rec, status: action === 'apply' ? 'in_progress' : action === 'dismiss' ? 'dismissed' : rec.status }
        : rec
    ));
    if (action === 'apply') {
      setCompletedToday(prev => prev + 1);
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'text-red-600 bg-red-100';
      case 'high': return 'text-orange-600 bg-orange-100';
      case 'medium': return 'text-blue-600 bg-blue-100';
      case 'low': return 'text-gray-600 bg-gray-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getPriorityLabel = (priority: string) => {
    switch (priority) {
      case 'critical': return 'Критично';
      case 'high': return 'Высокий';
      case 'medium': return 'Средний';
      case 'low': return 'Низкий';
      default: return priority;
    }
  };

  return (
    <div className="flex flex-col gap-6 p-6">
      {/* Заголовок */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
          <BarChart3 className="h-8 w-8 text-primary" />
          Dashboard
        </h1>
        <p className="text-muted-foreground mt-1">
          Центр управления с ИИ-рекомендациями и ключевыми метриками
        </p>
      </div>

      {/* Блок ИИ рекомендует - приоритетные действия */}
      <Card className="border-primary/20 bg-gradient-to-r from-primary/5 to-purple-500/5">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Brain className="h-5 w-5 text-primary" />
              </div>
              <div>
                <CardTitle>ИИ рекомендует</CardTitle>
                <CardDescription>
                  Приоритетные действия на основе анализа данных
                </CardDescription>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="secondary">
                {completedToday}/{totalRecommendations} выполнено сегодня
              </Badge>
              <Button variant="outline" size="sm" asChild>
                <Link href="/recommendations">
                  Все рекомендации
                  <ChevronRight className="ml-1 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {recommendations.slice(0, 3).map((rec) => (
              <div key={rec.id} className={cn(
                "p-4 rounded-lg border bg-background",
                rec.status === 'in_progress' && "border-primary/50 bg-primary/5",
                rec.status === 'completed' && "opacity-60"
              )}>
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-2">
                      <Badge className={getPriorityColor(rec.priority)} variant="secondary">
                        <Sparkles className="mr-1 h-3 w-3" />
                        {getPriorityLabel(rec.priority)}
                      </Badge>
                      {rec.deadline && (
                        <Badge variant="outline" className="text-xs">
                          <Clock className="mr-1 h-3 w-3" />
                          {Math.ceil((rec.deadline.getTime() - Date.now()) / (1000 * 60 * 60 * 24))} дней
                        </Badge>
                      )}
                      {rec.status === 'in_progress' && (
                        <Badge className="bg-blue-100 text-blue-700">
                          <Timer className="mr-1 h-3 w-3" />
                          В работе
                        </Badge>
                      )}
                    </div>
                    <h4 className="font-semibold">{rec.title}</h4>
                    <p className="text-sm text-muted-foreground">{rec.description}</p>
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-1 text-sm">
                        <Zap className="h-4 w-4 text-green-600" />
                        <span className="font-medium text-green-600">{rec.impact}</span>
                      </div>
                      {rec.metrics && rec.metrics.map((metric, i) => (
                        <div key={i} className="flex items-center gap-1 text-sm">
                          {metric.trend === 'up' ? (
                            <TrendingUp className="h-4 w-4 text-green-600" />
                          ) : (
                            <TrendingDown className="h-4 w-4 text-red-600" />
                          )}
                          <span className="text-muted-foreground">{metric.name}:</span>
                          <span className="font-medium">{metric.value}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="flex flex-col gap-2">
                    {rec.status === 'new' && (
                      <>
                        <Button
                          size="sm"
                          className="bg-primary hover:bg-primary/90"
                          onClick={() => rec.actions.primary.href ? 
                            window.location.href = rec.actions.primary.href : 
                            handleRecommendationAction(rec.id, 'apply')
                          }
                        >
                          <CheckCircle2 className="mr-1 h-4 w-4" />
                          {rec.actions.primary.label}
                        </Button>
                        <div className="flex gap-1">
                          <Button
                            size="sm"
                            variant="outline"
                            className="flex-1"
                            onClick={() => handleRecommendationAction(rec.id, 'postpone')}
                          >
                            <Clock className="mr-1 h-3 w-3" />
                            Отложить
                          </Button>
                          {rec.actions.secondary && (
                            <Button
                              size="sm"
                              variant="ghost"
                              className="flex-1"
                              onClick={rec.actions.secondary.action}
                            >
                              Подробнее
                            </Button>
                          )}
                        </div>
                      </>
                    )}
                    {rec.status === 'in_progress' && (
                      <Button size="sm" variant="secondary" disabled>
                        <Timer className="mr-1 h-4 w-4" />
                        В процессе
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* БЛОК 1: Цели по ключевым метрикам */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Цели по ключевым метрикам</CardTitle>
              <CardDescription>Отслеживайте прогресс по целевым значениям</CardDescription>
            </div>
            <Dialog open={goalsOpen} onOpenChange={setGoalsOpen}>
              <Button 
                variant="outline" 
                onClick={() => {
                  setGoalsOpen(true);
                  // Инициализируем временные цели текущими значениями
                  const initialGoals: Record<string, string> = {};
                  allMetricsData.forEach(metric => {
                    initialGoals[metric.id] = metricGoals[metric.id]?.toString() || metric.target.toString();
                  });
                  setTempGoals(initialGoals);
                }}
              >
                <Target className="mr-2 h-4 w-4" />
                Настроить цели
              </Button>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Настройка целевых показателей</DialogTitle>
                  <DialogDescription>
                    Установите целевые значения для ключевых метрик на текущий период
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  {allMetricsData.map(metric => (
                    <div key={metric.id} className="grid grid-cols-3 items-center gap-4">
                      <Label htmlFor={`goal-${metric.id}`} className="text-right">
                        {metric.name}
                      </Label>
                      <Input
                        id={`goal-${metric.id}`}
                        type="number"
                        value={tempGoals[metric.id] || ''}
                        onChange={(e) => setTempGoals(prev => ({
                          ...prev,
                          [metric.id]: e.target.value
                        }))}
                        className="col-span-2"
                        placeholder={`Текущее: ${metric.value}${metric.unit}`}
                      />
                    </div>
                  ))}
                </div>
                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setGoalsOpen(false)}>
                    Отмена
                  </Button>
                  <Button onClick={() => {
                    // Сохраняем цели
                    const newGoals: Record<string, number> = {};
                    Object.entries(tempGoals).forEach(([key, value]) => {
                      if (value) {
                        newGoals[key] = parseFloat(value);
                      }
                    });
                    setMetricGoals(newGoals);
                    setGoalsOpen(false);
                  }}>
                    Сохранить цели
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          {Object.keys(metricGoals).length === 0 ? (
            <div className="text-center py-8">
              <Target className="mx-auto h-12 w-12 text-muted-foreground/50" />
              <p className="mt-2 text-sm text-muted-foreground">
                Цели ещё не заданы. Нажмите "Настроить цели" для начала отслеживания прогресса.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {allMetricsData.filter(metric => metricGoals[metric.id]).map(metric => {
                const goal = metricGoals[metric.id];
                const current = typeof metric.value === 'number' ? metric.value : parseFloat(String(metric.value).replace(/[^0-9.-]/g, ''));
                const progress = (current / goal) * 100;
                const isAchieved = progress >= 100;
                
                return (
                  <div key={metric.id} className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-medium">{metric.name}</span>
                      <div className="flex items-center gap-2">
                        <span className={cn(
                          "font-semibold",
                          isAchieved ? "text-green-600" : "text-muted-foreground"
                        )}>
                          {current}{metric.unit} / {goal}{metric.unit}
                        </span>
                        {isAchieved && <CheckCircle2 className="h-4 w-4 text-green-600" />}
                      </div>
                    </div>
                    <Progress value={Math.min(progress, 100)} className="h-2" />
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>Прогресс: {progress.toFixed(1)}%</span>
                      {!isAchieved && (
                        <span>Осталось: {Math.abs(goal - current).toFixed(1)}{metric.unit}</span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Retention аудит - перемещен наверх */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Trophy className="h-5 w-5 text-primary" />
              <CardTitle>Улучшения Retention</CardTitle>
            </div>
          </div>
          <CardDescription>
            Области с упущенной выручкой
          </CardDescription>
        </CardHeader>
        <CardContent>
          {!auditPerformed ? (
            <div className="space-y-4">
              <div className="flex items-center gap-3 p-4 rounded-lg bg-yellow-50 border border-yellow-200">
                <AlertCircle className="h-5 w-5 text-yellow-600 shrink-0" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-yellow-900">
                    Вы еще не прошли базовый аудит retention структуры!
                  </p>
                  <p className="text-xs text-yellow-700 mt-1">
                    Проведите аудит чтобы найти возможности для улучшения retention и увеличения выручки
                  </p>
                </div>
                <Button 
                  onClick={() => {
                    setAuditPerformed(true);
                    // Генерируем рекомендации по улучшению retention
                    setRetentionImprovements([
                      {
                        id: '1',
                        title: 'Welcome серия для новых игроков',
                        status: 'critical',
                        description: 'Отсутствует онбординг для новых пользователей. 67% новых игроков уходят в первые 3 дня.',
                        reason: 'Правильный онбординг увеличивает D1 retention на 35% и конверсию в первый депозит на 40%',
                        potentialRevenue: '+40% FTD в ГЕО DE, AT',
                        geo: 'DE, AT, CH',
                        segment: 'Новые регистрации',
                        channel: 'Email + Push',
                        icon: Users
                      },
                      {
                        id: '2',
                        title: 'VIP программа лояльности',
                        status: 'high',
                        description: 'VIP игроки не получают эксклюзивных преимуществ. Churn rate VIP = 12% (выше среднего)',
                        reason: 'VIP игроки генерируют 65% всей выручки. Снижение их оттока на 5%',
                        potentialRevenue: '-5% Churn VIP в UK',
                        geo: 'UK, IE',
                        segment: 'VIP игроки',
                        channel: 'Personal Manager',
                        icon: DollarSign
                      },
                      {
                        id: '3',
                        title: 'Реактивация спящих',
                        status: 'high',
                        description: '8,450 спящих игроков с LTV > €200 не получают коммуникаций',
                        reason: 'Каждый реактивированный игрок возвращается к активности',
                        potentialRevenue: '+15% реактивация в FR',
                        geo: 'FR, BE, LU',
                        segment: 'Спящие 30+ дней',
                        channel: 'Email + SMS',
                        icon: Activity
                      },
                      {
                        id: '4',
                        title: 'Персонализация бонусов',
                        status: 'medium',
                        description: 'Все игроки получают одинаковые офферы без учета предпочтений',
                        reason: 'Персонализированные бонусы повышают конверсию в депозит',
                        potentialRevenue: '+28% бонус использование ES',
                        geo: 'ES, PT',
                        segment: 'Активные игроки',
                        channel: 'In-App',
                        icon: Target
                      },
                      {
                        id: '5',
                        title: 'Win-back кампании',
                        status: 'medium',
                        description: 'Нет систематических кампаний для ушедших игроков',
                        reason: 'Ушедших игроков можно вернуть с правильным оффером',
                        potentialRevenue: '+12% возврат через 90 дней IT',
                        geo: 'IT, GR',
                        segment: 'Ушедшие 90+ дней',
                        channel: 'Email',
                        icon: Zap
                      }
                    ]);
                  }}
                  className="bg-yellow-600 hover:bg-yellow-700 text-white"
                >
                  <Search className="mr-2 h-4 w-4" />
                  Пройти аудит
                </Button>
              </div>
            </div>
          ) : (
            retentionImprovements.length > 0 && (
              <div className="space-y-4">
                {retentionImprovements.slice(0, 3).map((improvement) => {
                  const Icon = improvement.icon;
                  return (
                    <div key={improvement.id} className="group relative">
                      <div className="flex items-start gap-3 p-4 rounded-lg border hover:bg-muted/50 transition-colors">
                        <div className={cn(
                          "p-2 rounded-lg shrink-0",
                          improvement.status === 'critical' && "bg-red-100",
                          improvement.status === 'high' && "bg-orange-100",
                          improvement.status === 'medium' && "bg-yellow-100"
                        )}>
                          <Icon className={cn(
                            "h-4 w-4",
                            improvement.status === 'critical' && "text-red-600",
                            improvement.status === 'high' && "text-orange-600",
                            improvement.status === 'medium' && "text-yellow-600"
                          )} />
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2">
                            <div className="flex-1">
                              <h4 className="font-medium text-sm">{improvement.title}</h4>
                              <p className="text-xs text-muted-foreground mt-1">
                                {improvement.description}
                              </p>
                            </div>
                            <Badge 
                              className={cn(
                                "shrink-0",
                                improvement.status === 'critical' && "bg-red-100 text-red-700",
                                improvement.status === 'high' && "bg-orange-100 text-orange-700",
                                improvement.status === 'medium' && "bg-yellow-100 text-yellow-700"
                              )}
                            >
                              {improvement.status === 'critical' && 'Критично'}
                              {improvement.status === 'high' && 'Важно'}
                              {improvement.status === 'medium' && 'Средне'}
                            </Badge>
                          </div>

                          <div className="flex flex-wrap items-center gap-4 mt-3 text-xs">
                            <div className="flex items-center gap-1">
                              <MapPin className="h-3 w-3 text-muted-foreground" />
                              <span className="text-muted-foreground">{improvement.geo}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Users className="h-3 w-3 text-muted-foreground" />
                              <span className="text-muted-foreground">{improvement.segment}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Send className="h-3 w-3 text-muted-foreground" />
                              <span className="text-muted-foreground">{improvement.channel}</span>
                            </div>
                            <div className="flex items-center gap-1 ml-auto">
                              <TrendingUp className="h-3 w-3 text-green-600" />
                              <span className="font-medium text-green-600">
                                {improvement.potentialRevenue}
                              </span>
                            </div>
                          </div>

                          <div className="flex items-center justify-between mt-3">
                            <p className="text-xs text-muted-foreground italic">
                              {improvement.reason}
                            </p>
                            <Button size="sm" variant="outline" className="h-7 text-xs">
                              Создать кампанию
                              <ChevronRight className="ml-1 h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
                
                {retentionImprovements.length > 3 && (
                  <Button variant="outline" className="w-full" size="sm">
                    <ChevronRight className="mr-2 h-4 w-4" />
                    Все улучшения Retention ({retentionImprovements.length})
                  </Button>
                )}
              </div>
            )
          )}
        </CardContent>
      </Card>

      {/* БЛОК 2: Плитка с избранными метриками */}
      <SelectedKpiTile />

      {/* БЛОК 3: Полный дашборд со всеми метриками */}
      <FullMetricsDashboard filters={savedFilters || undefined} />

      {/* Ключевые KPI */}
      <div className="space-y-4">
        {/* Кнопки управления метриками */}
        <div className="flex items-center gap-4">
          <Popover open={showMetricsModal} onOpenChange={setShowMetricsModal}>
            <PopoverTrigger asChild>
              <Button variant="outline" className="flex items-center gap-2">
                <Settings className="h-4 w-4" />
                Выбрать метрики
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80">
              <div className="space-y-4">
                <div className="space-y-2">
                  <h4 className="font-medium leading-none">Выберите метрики</h4>
                  <p className="text-sm text-muted-foreground">Максимум 8 метрик для отображения</p>
                </div>
                <div className="space-y-3">
                  {allMetricsData.map((metric) => {
                    const isSelected = selectedMetrics.includes(metric.id);
                    const isDisabled = !isSelected && selectedMetrics.length >= 8;
                    
                    return (
                      <div key={metric.id} className="flex items-center space-x-2">
                        <Checkbox 
                          id={metric.id}
                          checked={isSelected}
                          disabled={isDisabled}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              if (selectedMetrics.length < 8) {
                                setSelectedMetrics([...selectedMetrics, metric.id]);
                              }
                            } else {
                              setSelectedMetrics(selectedMetrics.filter(id => id !== metric.id));
                            }
                          }}
                        />
                        <label 
                          htmlFor={metric.id} 
                          className={cn(
                            "text-sm cursor-pointer",
                            isDisabled && "text-muted-foreground"
                          )}
                        >
                          {metric.name}
                        </label>
                      </div>
                    );
                  })}
                </div>
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Выбрано: {selectedMetrics.length}/8</span>
                </div>
              </div>
            </PopoverContent>
          </Popover>
          
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-[200px]">
              <Calendar className="mr-2 h-4 w-4" />
              <SelectValue placeholder="Выберите период" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">Последние 7 дней</SelectItem>
              <SelectItem value="30d">Последние 30 дней</SelectItem>
              <SelectItem value="90d">Последние 90 дней</SelectItem>
              <SelectItem value="6m">Последние 6 месяцев</SelectItem>
              <SelectItem value="1y">Последний год</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {displayedMetrics.map((kpi) => {
            if (!timeRange) {
              return (
                <Card key={kpi?.id || 'fallback'}>
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-sm font-medium text-muted-foreground">
                        {kpi?.name || ''}
                      </CardTitle>
                      <div className={cn("p-2 rounded-lg", kpi?.bgColor || '')}>
                        {kpi?.icon && <kpi.icon className={cn("h-4 w-4", kpi?.color || '')} />}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-center h-20">
                      <div className="text-center text-sm text-muted-foreground">
                        <Calendar className="h-6 w-6 mx-auto mb-1 opacity-50" />
                        <p>Выберите временной<br />промежуток</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            }
            
          const progress = ((kpi?.value || 0) / (kpi?.target || 1)) * 100;
          const Icon = kpi?.icon;
          
          return (
            <Card key={kpi?.id || 'fallback'}>
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    {kpi?.name || ''}
                  </CardTitle>
                  <div className={cn("p-2 rounded-lg", kpi?.bgColor || '')}>
                    {Icon && <Icon className={cn("h-4 w-4", kpi?.color || '')} />}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex items-baseline justify-between">
                    <span className="text-2xl font-bold">
                      {kpi?.unit === '€' && '€'}
                      {(kpi?.value || 0).toLocaleString()}
                      {kpi?.unit === '%' && '%'}
                    </span>
                    <div className={cn(
                      "flex items-center gap-1 text-sm",
                      kpi?.trend === 'up' ? 'text-green-600' : 'text-red-600'
                    )}>
                      {kpi?.trend === 'up' ? (
                        <TrendingUp className="h-4 w-4" />
                      ) : (
                        <TrendingDown className="h-4 w-4" />
                      )}
                      {Math.abs(kpi?.change || 0)}%
                    </div>
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span>Цель: {kpi?.unit === '€' && '€'}{(kpi?.target || 0).toLocaleString()}{kpi?.unit === '%' && '%'}</span>
                      <span>{Math.round(progress)}%</span>
                    </div>
                    <Progress value={Math.min(progress, 100)} className="h-2" />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
        </div>
      </div>


      {/* Быстрые действия */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Быстрые действия</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button variant="outline" className="w-full justify-start" asChild>
              <Link href="/segments">
                <Users className="mr-2 h-4 w-4" />
                Управление сегментами
              </Link>
            </Button>
            <Button variant="outline" className="w-full justify-start" asChild>
              <Link href="/builder">
                <Zap className="mr-2 h-4 w-4" />
                Создать кампанию
              </Link>
            </Button>
            <Button variant="outline" className="w-full justify-start" asChild>
              <Link href="/analytics">
                <BarChart3 className="mr-2 h-4 w-4" />
                Детальная аналитика
              </Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Активность системы</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Активных кампаний</span>
                <Badge variant="secondary">12</Badge>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Обработано событий</span>
                <Badge variant="secondary">24.5K</Badge>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">ИИ-анализов сегодня</span>
                <Badge variant="secondary">156</Badge>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Точность прогнозов</span>
                <Badge className="bg-green-100 text-green-700">94.2%</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Следующие шаги</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm">
              <div className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5" />
                <span>Настроить Dashboard</span>
              </div>
              <div className="flex items-start gap-2">
                <div className="h-4 w-4 rounded-full border-2 border-primary mt-0.5" />
                <span>Создать первую кампанию</span>
              </div>
              <div className="flex items-start gap-2">
                <div className="h-4 w-4 rounded-full border-2 border-muted mt-0.5" />
                <span>Настроить сегменты</span>
              </div>
              <div className="flex items-start gap-2">
                <div className="h-4 w-4 rounded-full border-2 border-muted mt-0.5" />
                <span>Изучить ИИ-инсайты</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Модальное окно с улучшениями */}
      <Dialog open={showImprovementsModal} onOpenChange={setShowImprovementsModal}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Trophy className="h-5 w-5 text-primary" />
              Все улучшения Retention
            </DialogTitle>
            <DialogDescription>
              Полный список возможностей для улучшения метрик удержания игроков
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <AlertCircle className="h-5 w-5 text-blue-600" />
                  <span className="font-semibold text-blue-900">Обнаружено областей для улучшения:</span>
                </div>
                <span className="text-xl font-bold text-blue-600">
                  {retentionImprovements.length} критичных метрик
                </span>
              </div>
            </div>
            
            {retentionImprovements.map((improvement) => {
              const Icon = improvement.icon;
              const statusColor = improvement.status === 'critical' ? 'bg-red-100 border-red-300' : 
                                 improvement.status === 'high' ? 'bg-orange-100 border-orange-300' : 
                                 'bg-yellow-100 border-yellow-300';
              
              return (
                <div key={improvement.id} className={`p-4 rounded-lg border ${statusColor}`}>
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-white rounded-lg">
                      <Icon className="h-5 w-5 text-primary" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-semibold text-lg">{improvement.title}</h4>
                        <Badge variant="secondary" className="text-sm font-bold">
                          <TrendingUp className="mr-1 h-4 w-4" />
                          {improvement.potentialRevenue}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-3">
                        {improvement.description}
                      </p>
                      <div className="flex flex-wrap gap-2 mb-3">
                        <Badge variant="outline" className="text-sm">
                          <MapPin className="mr-1 h-3 w-3" />
                          GEO: {improvement.geo}
                        </Badge>
                        <Badge variant="outline" className="text-sm">
                          <Target className="mr-1 h-3 w-3" />
                          {improvement.segment}
                        </Badge>
                        <Badge variant="outline" className="text-sm">
                          <Send className="mr-1 h-3 w-3" />
                          {improvement.channel}
                        </Badge>
                      </div>
                      <div className="p-3 bg-white/80 rounded mb-3">
                        <p className="text-sm">
                          <span className="font-medium">Почему это важно:</span> {improvement.reason}
                        </p>
                      </div>
                      <Button variant="default" className="w-full">
                        Создать кампанию для этого улучшения →
                      </Button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}