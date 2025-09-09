"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
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
  Send
} from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

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

// Моковые данные KPI
const kpiData = [
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

      {/* Ключевые KPI */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {kpiData.map((kpi) => {
          const progress = (kpi.value / kpi.target) * 100;
          const Icon = kpi.icon;
          
          return (
            <Card key={kpi.id}>
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    {kpi.name}
                  </CardTitle>
                  <div className={cn("p-2 rounded-lg", kpi.bgColor)}>
                    <Icon className={cn("h-4 w-4", kpi.color)} />
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex items-baseline justify-between">
                    <span className="text-2xl font-bold">
                      {kpi.unit === '€' && '€'}
                      {kpi.value.toLocaleString()}
                      {kpi.unit === '%' && '%'}
                    </span>
                    <div className={cn(
                      "flex items-center gap-1 text-sm",
                      kpi.trend === 'up' ? 'text-green-600' : 'text-red-600'
                    )}>
                      {kpi.trend === 'up' ? (
                        <TrendingUp className="h-4 w-4" />
                      ) : (
                        <TrendingDown className="h-4 w-4" />
                      )}
                      {Math.abs(kpi.change)}%
                    </div>
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span>Цель: {kpi.unit === '€' && '€'}{kpi.target.toLocaleString()}{kpi.unit === '%' && '%'}</span>
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

      {/* Чек-лист улучшений и Retention аудит */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Чек-лист улучшений */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <ClipboardCheck className="h-5 w-5 text-primary" />
              <CardTitle>Чек-лист улучшений</CardTitle>
            </div>
            <CardDescription>
              Критические задачи для роста retention
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {gamificationData.missions.map((mission) => {
                const progress = (mission.progress / mission.total) * 100;
                return (
                  <div key={mission.id} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium">{mission.title}</p>
                      <Badge variant="secondary" className="text-xs">
                        {mission.reward}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2">
                      <Progress value={progress} className="flex-1" />
                      <span className="text-xs text-muted-foreground whitespace-nowrap">
                        {mission.progress}/{mission.total}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
            <Button 
              variant="outline" 
              className="w-full mt-4"
              onClick={() => {
                // Генерируем улучшения если их еще нет
                if (!auditPerformed) {
                  setAuditPerformed(true);
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
                }
                setShowImprovementsModal(true);
              }}
            >
              Все улучшения
              <Award className="ml-2 h-4 w-4" />
            </Button>
          </CardContent>
        </Card>

        {/* Улучшения Retention */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Trophy className="h-5 w-5 text-primary" />
                <CardTitle>Улучшения Retention</CardTitle>
              </div>
              {!auditPerformed && (
                <Button 
                  size="sm" 
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
                >
                  <Search className="mr-2 h-4 w-4" />
                  Провести аудит
                </Button>
              )}
            </div>
            <CardDescription>
              Области с упущенной выручкой
            </CardDescription>
          </CardHeader>
          <CardContent>
            {!auditPerformed ? (
              <div className="text-center py-8">
                <Search className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
                <p className="text-sm text-muted-foreground mb-4">
                  Проведите аудит чтобы найти возможности для улучшения retention
                </p>
                <Button 
                  onClick={() => {
                    setAuditPerformed(true);
                    setRetentionImprovements([
                      {
                        id: '1',
                        title: 'Welcome серия для новых игроков',
                        status: 'critical',
                        description: 'Отсутствует онбординг для новых пользователей. 67% новых игроков уходят в первые 3 дня.',
                        reason: 'Правильный онбординг увеличивает D1 retention на 35% и конверсию в первый депозит на 40%',
                        potentialRevenue: '€285,000/мес',
                        icon: Users
                      },
                      {
                        id: '2',
                        title: 'VIP программа лояльности',
                        status: 'high',
                        description: 'VIP игроки не получают эксклюзивных преимуществ. Churn rate VIP = 12% (выше среднего)',
                        reason: 'VIP игроки генерируют 65% всей выручки. Снижение их оттока на 5% = +€420,000/мес',
                        potentialRevenue: '€420,000/мес',
                        icon: DollarSign
                      }
                    ]);
                  }}
                >
                  <Search className="mr-2 h-4 w-4" />
                  Начать аудит
                </Button>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg mb-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <AlertCircle className="h-5 w-5 text-red-600" />
                      <span className="font-semibold text-red-900">Обнаружено областей для улучшения:</span>
                    </div>
                    <span className="text-xl font-bold text-red-600">5 критичных метрик</span>
                  </div>
                </div>
                
                {retentionImprovements.map((improvement) => {
                  const Icon = improvement.icon;
                  const statusColor = improvement.status === 'critical' ? 'bg-red-100 border-red-300' : 
                                     improvement.status === 'high' ? 'bg-orange-100 border-orange-300' : 
                                     'bg-yellow-100 border-yellow-300';
                  
                  return (
                    <div key={improvement.id} className={`p-3 rounded-lg border ${statusColor}`}>
                      <div className="flex items-start gap-3">
                        <div className="p-2 bg-white rounded-lg">
                          <Icon className="h-4 w-4 text-primary" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-1">
                            <h4 className="font-semibold text-sm">{improvement.title}</h4>
                            <Badge variant="secondary" className="text-xs font-bold">
                              <TrendingUp className="mr-1 h-3 w-3" />
                              {improvement.potentialRevenue}
                            </Badge>
                          </div>
                          <p className="text-xs text-muted-foreground mb-2">
                            {improvement.description}
                          </p>
                          <div className="flex flex-wrap gap-1 mb-2">
                            <Badge variant="outline" className="text-xs">
                              <MapPin className="mr-1 h-2.5 w-2.5" />
                              GEO: {improvement.geo}
                            </Badge>
                            <Badge variant="outline" className="text-xs">
                              <Target className="mr-1 h-2.5 w-2.5" />
                              {improvement.segment}
                            </Badge>
                            <Badge variant="outline" className="text-xs">
                              <Send className="mr-1 h-2.5 w-2.5" />
                              {improvement.channel}
                            </Badge>
                          </div>
                          <div className="p-2 bg-white/80 rounded">
                            <p className="text-xs">
                              <span className="font-medium">Почему это важно:</span> {improvement.reason}
                            </p>
                          </div>
                          <Button size="sm" variant="link" className="h-auto p-0 mt-2 text-xs">
                            Создать кампанию →
                          </Button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
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