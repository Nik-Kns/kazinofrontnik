"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Brain,
  Filter,
  TrendingUp,
  TrendingDown,
  AlertCircle,
  CheckCircle2,
  Clock,
  XCircle,
  Timer,
  Sparkles,
  Zap,
  Search,
  Download,
  RefreshCw,
  Target,
  DollarSign,
  Users,
  Activity,
  ArrowRight,
  ChevronRight,
  Calendar
} from "lucide-react";
import { cn } from "@/lib/utils";

// Типы для рекомендаций
interface Recommendation {
  id: string;
  title: string;
  description: string;
  category: 'retention' | 'revenue' | 'engagement' | 'risk' | 'optimization';
  priority: 'critical' | 'high' | 'medium' | 'low';
  status: 'new' | 'in_progress' | 'completed' | 'dismissed' | 'postponed';
  impact: {
    metric: string;
    value: string;
    trend: 'up' | 'down';
  };
  deadline?: Date;
  createdAt: Date;
  completedAt?: Date;
  tags: string[];
  actions: {
    primary: { label: string; href?: string };
    secondary?: { label: string };
  };
  reasoning: string;
  dataPoints: Array<{ label: string; value: string }>;
  confidence: number;
}

// Моковые данные рекомендаций
const mockRecommendations: Recommendation[] = [
  {
    id: '1',
    title: 'Запустить кампанию реактивации для спящих игроков',
    description: 'Обнаружено 2,847 игроков без активности 30+ дней с высоким историческим LTV',
    category: 'retention',
    priority: 'critical',
    status: 'new',
    impact: { metric: 'Monthly Revenue', value: '+12%', trend: 'up' },
    deadline: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    tags: ['Реактивация', 'Высокий приоритет', 'Quick Win'],
    actions: {
      primary: { label: 'Создать кампанию', href: '/builder?template=reactivation' },
      secondary: { label: 'Детали анализа' }
    },
    reasoning: 'Анализ показал, что игроки с периодом неактивности 30-45 дней имеют 35% вероятность возврата при правильной стимуляции. Средний депозит после реактивации составляет €250.',
    dataPoints: [
      { label: 'Целевая аудитория', value: '2,847 игроков' },
      { label: 'Средний LTV', value: '€485' },
      { label: 'Ожидаемая конверсия', value: '8-12%' },
      { label: 'Потенциальный доход', value: '€142,350' }
    ],
    confidence: 92
  },
  {
    id: '2',
    title: 'Оптимизировать бонусную программу для VIP сегмента',
    description: 'VIP игроки используют только 45% доступных бонусов, что ниже среднего',
    category: 'revenue',
    priority: 'high',
    status: 'new',
    impact: { metric: 'GGR', value: '+€85,000/мес', trend: 'up' },
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    tags: ['VIP', 'Бонусы', 'Оптимизация'],
    actions: {
      primary: { label: 'Настроить бонусы', href: '/segments?filter=vip' },
      secondary: { label: 'Анализ использования' }
    },
    reasoning: 'VIP игроки предпочитают cashback и эксклюзивные турниры вместо стандартных депозитных бонусов. Персонализация предложений может увеличить утилизацию до 75%.',
    dataPoints: [
      { label: 'VIP активность', value: '71%' },
      { label: 'Bonus ROI', value: '2.3x' },
      { label: 'Неиспользованные бонусы', value: '€124,000' },
      { label: 'Потенциал роста', value: '+30%' }
    ],
    confidence: 87
  },
  {
    id: '3',
    title: 'Предотвратить отток высокоценных игроков',
    description: 'ML-модель обнаружила 156 игроков с высоким риском ухода в ближайшие 7 дней',
    category: 'risk',
    priority: 'critical',
    status: 'in_progress',
    impact: { metric: 'Потери', value: '-€68,000', trend: 'down' },
    deadline: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
    tags: ['Риск', 'Срочно', 'ML-прогноз'],
    actions: {
      primary: { label: 'Применить стратегию', href: '/builder?template=risk-prevention' },
      secondary: { label: 'Список игроков' }
    },
    reasoning: 'Снижение частоты игр на 40%, уменьшение размера ставок и увеличение времени между сессиями указывают на потерю интереса.',
    dataPoints: [
      { label: 'Risk Score', value: '8.7/10' },
      { label: 'Дней до ухода', value: '5-7' },
      { label: 'Средний LTV группы', value: '€436' },
      { label: 'Успех предотвращения', value: '65%' }
    ],
    confidence: 89
  },
  {
    id: '4',
    title: 'Увеличить вовлеченность через турниры',
    description: 'Игроки с участием в турнирах показывают на 45% выше retention',
    category: 'engagement',
    priority: 'medium',
    status: 'new',
    impact: { metric: 'DAU', value: '+18%', trend: 'up' },
    createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000),
    tags: ['Турниры', 'Вовлеченность', 'Соревнования'],
    actions: {
      primary: { label: 'Создать турнир', href: '/tournaments/create' },
      secondary: { label: 'Расписание' }
    },
    reasoning: 'Еженедельные турниры с призовым фондом €5,000+ привлекают в среднем 1,200 участников и увеличивают время в игре на 35%.',
    dataPoints: [
      { label: 'Текущее участие', value: '12%' },
      { label: 'Целевое участие', value: '25%' },
      { label: 'ROI турниров', value: '3.8x' },
      { label: 'Средняя ставка в турнире', value: '€85' }
    ],
    confidence: 91
  },
  {
    id: '5',
    title: 'Оптимизировать время отправки push-уведомлений',
    description: 'Анализ показал низкий CTR уведомлений в текущие временные слоты',
    category: 'optimization',
    priority: 'low',
    status: 'completed',
    impact: { metric: 'CTR', value: '+34%', trend: 'up' },
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    completedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    tags: ['Push', 'Оптимизация', 'Коммуникации'],
    actions: {
      primary: { label: 'Применено', href: '#' },
    },
    reasoning: 'Оптимальное время для вашей аудитории: 19:00-21:00 в будни и 14:00-16:00 в выходные.',
    dataPoints: [
      { label: 'Прежний CTR', value: '2.1%' },
      { label: 'Новый CTR', value: '2.8%' },
      { label: 'Охват', value: '+15%' },
      { label: 'Конверсия', value: '+8%' }
    ],
    confidence: 94
  }
];

export default function RecommendationsPage() {
  const [recommendations, setRecommendations] = useState(mockRecommendations);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedPriority, setSelectedPriority] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('active');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'priority' | 'deadline' | 'impact'>('priority');

  // Фильтрация рекомендаций
  const filteredRecommendations = recommendations.filter(rec => {
    if (selectedCategory !== 'all' && rec.category !== selectedCategory) return false;
    if (selectedPriority !== 'all' && rec.priority !== selectedPriority) return false;
    if (selectedStatus === 'active' && (rec.status === 'completed' || rec.status === 'dismissed')) return false;
    if (selectedStatus === 'completed' && rec.status !== 'completed') return false;
    if (selectedStatus === 'dismissed' && rec.status !== 'dismissed') return false;
    if (searchQuery && !rec.title.toLowerCase().includes(searchQuery.toLowerCase()) && 
        !rec.description.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  // Сортировка
  const sortedRecommendations = [...filteredRecommendations].sort((a, b) => {
    if (sortBy === 'priority') {
      const priorityOrder = { critical: 0, high: 1, medium: 2, low: 3 };
      return priorityOrder[a.priority] - priorityOrder[b.priority];
    }
    if (sortBy === 'deadline') {
      if (!a.deadline) return 1;
      if (!b.deadline) return -1;
      return a.deadline.getTime() - b.deadline.getTime();
    }
    if (sortBy === 'impact') {
      return b.confidence - a.confidence;
    }
    return 0;
  });

  // Статистика
  const stats = {
    total: recommendations.length,
    new: recommendations.filter(r => r.status === 'new').length,
    inProgress: recommendations.filter(r => r.status === 'in_progress').length,
    completed: recommendations.filter(r => r.status === 'completed').length,
    critical: recommendations.filter(r => r.priority === 'critical' && r.status !== 'completed').length,
    completionRate: Math.round((recommendations.filter(r => r.status === 'completed').length / recommendations.length) * 100)
  };

  const handleAction = (id: string, action: 'apply' | 'dismiss' | 'postpone') => {
    setRecommendations(prev => prev.map(rec => 
      rec.id === id 
        ? { 
            ...rec, 
            status: action === 'apply' ? 'in_progress' : 
                   action === 'dismiss' ? 'dismissed' : 
                   'postponed' 
          }
        : rec
    ));
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'bg-red-100 text-red-700 border-red-200';
      case 'high': return 'bg-orange-100 text-orange-700 border-orange-200';
      case 'medium': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'low': return 'bg-gray-100 text-gray-700 border-gray-200';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'retention': return Users;
      case 'revenue': return DollarSign;
      case 'engagement': return Activity;
      case 'risk': return AlertCircle;
      case 'optimization': return Target;
      default: return Brain;
    }
  };

  return (
    <div className="flex flex-col gap-6 p-6">
      {/* Заголовок */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
          <Brain className="h-8 w-8 text-primary" />
          ИИ Рекомендации
        </h1>
        <p className="text-muted-foreground mt-1">
          Персонализированные рекомендации на основе анализа данных и ML-моделей
        </p>
      </div>

      {/* Статистика */}
      <div className="grid gap-4 md:grid-cols-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Всего</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
            <p className="text-xs text-muted-foreground">рекомендаций</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Новые</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{stats.new}</div>
            <p className="text-xs text-muted-foreground">ожидают действия</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">В работе</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{stats.inProgress}</div>
            <p className="text-xs text-muted-foreground">выполняются</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Выполнено</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.completed}</div>
            <Progress value={stats.completionRate} className="mt-2 h-1" />
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Критичные</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{stats.critical}</div>
            <p className="text-xs text-muted-foreground">требуют внимания</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Эффективность</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">{stats.completionRate}%</div>
            <p className="text-xs text-muted-foreground">выполнения</p>
          </CardContent>
        </Card>
      </div>

      {/* Фильтры и поиск */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-base flex items-center gap-2">
              <Filter className="h-4 w-4" />
              Фильтры и сортировка
            </CardTitle>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <RefreshCw className="h-4 w-4 mr-1" />
                Обновить
              </Button>
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-1" />
                Экспорт
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-5">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Поиск..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger>
                <SelectValue placeholder="Категория" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Все категории</SelectItem>
                <SelectItem value="retention">Удержание</SelectItem>
                <SelectItem value="revenue">Доход</SelectItem>
                <SelectItem value="engagement">Вовлечение</SelectItem>
                <SelectItem value="risk">Риски</SelectItem>
                <SelectItem value="optimization">Оптимизация</SelectItem>
              </SelectContent>
            </Select>
            <Select value={selectedPriority} onValueChange={setSelectedPriority}>
              <SelectTrigger>
                <SelectValue placeholder="Приоритет" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Все приоритеты</SelectItem>
                <SelectItem value="critical">Критичный</SelectItem>
                <SelectItem value="high">Высокий</SelectItem>
                <SelectItem value="medium">Средний</SelectItem>
                <SelectItem value="low">Низкий</SelectItem>
              </SelectContent>
            </Select>
            <Select value={selectedStatus} onValueChange={setSelectedStatus}>
              <SelectTrigger>
                <SelectValue placeholder="Статус" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Все статусы</SelectItem>
                <SelectItem value="active">Активные</SelectItem>
                <SelectItem value="completed">Выполненные</SelectItem>
                <SelectItem value="dismissed">Отклоненные</SelectItem>
              </SelectContent>
            </Select>
            <Select value={sortBy} onValueChange={(v) => setSortBy(v as any)}>
              <SelectTrigger>
                <SelectValue placeholder="Сортировка" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="priority">По приоритету</SelectItem>
                <SelectItem value="deadline">По дедлайну</SelectItem>
                <SelectItem value="impact">По влиянию</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Список рекомендаций */}
      <div className="space-y-4">
        {sortedRecommendations.map((rec) => {
          const CategoryIcon = getCategoryIcon(rec.category);
          
          return (
            <Card key={rec.id} className={cn(
              "border-l-4",
              rec.priority === 'critical' && "border-l-red-500",
              rec.priority === 'high' && "border-l-orange-500",
              rec.priority === 'medium' && "border-l-blue-500",
              rec.priority === 'low' && "border-l-gray-400",
              rec.status === 'completed' && "opacity-60"
            )}>
              <CardHeader>
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <CategoryIcon className="h-5 w-5 text-muted-foreground" />
                      <Badge className={getPriorityColor(rec.priority)} variant="outline">
                        <Sparkles className="mr-1 h-3 w-3" />
                        {rec.priority === 'critical' ? 'Критичный' :
                         rec.priority === 'high' ? 'Высокий' :
                         rec.priority === 'medium' ? 'Средний' : 'Низкий'}
                      </Badge>
                      {rec.deadline && rec.status !== 'completed' && (
                        <Badge variant="outline" className="text-xs">
                          <Calendar className="mr-1 h-3 w-3" />
                          {Math.ceil((rec.deadline.getTime() - Date.now()) / (1000 * 60 * 60 * 24))} дней
                        </Badge>
                      )}
                      {rec.status === 'in_progress' && (
                        <Badge className="bg-blue-100 text-blue-700">
                          <Timer className="mr-1 h-3 w-3" />
                          В работе
                        </Badge>
                      )}
                      {rec.status === 'completed' && (
                        <Badge className="bg-green-100 text-green-700">
                          <CheckCircle2 className="mr-1 h-3 w-3" />
                          Выполнено
                        </Badge>
                      )}
                    </div>
                    <CardTitle className="text-lg">{rec.title}</CardTitle>
                    <CardDescription className="mt-1">{rec.description}</CardDescription>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center gap-1 text-sm font-medium">
                      <Zap className="h-4 w-4 text-green-600" />
                      <span className="text-green-600">{rec.impact.value}</span>
                    </div>
                    <p className="text-xs text-muted-foreground">{rec.impact.metric}</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="overview" className="w-full">
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="overview">Обзор</TabsTrigger>
                    <TabsTrigger value="reasoning">Обоснование</TabsTrigger>
                    <TabsTrigger value="data">Данные</TabsTrigger>
                  </TabsList>
                  <TabsContent value="overview" className="space-y-4">
                    <div className="flex flex-wrap gap-2">
                      {rec.tags.map((tag) => (
                        <Badge key={tag} variant="secondary" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-muted-foreground">Уверенность ИИ:</span>
                        <div className="flex items-center gap-2">
                          <Progress value={rec.confidence} className="w-24 h-2" />
                          <span className="text-sm font-medium">{rec.confidence}%</span>
                        </div>
                      </div>
                      {rec.status === 'new' && (
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            onClick={() => handleAction(rec.id, 'apply')}
                          >
                            <CheckCircle2 className="mr-1 h-4 w-4" />
                            {rec.actions.primary.label}
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleAction(rec.id, 'postpone')}
                          >
                            <Clock className="mr-1 h-4 w-4" />
                            Отложить
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleAction(rec.id, 'dismiss')}
                          >
                            <XCircle className="mr-1 h-4 w-4" />
                            Отклонить
                          </Button>
                        </div>
                      )}
                    </div>
                  </TabsContent>
                  <TabsContent value="reasoning">
                    <p className="text-sm text-muted-foreground">{rec.reasoning}</p>
                  </TabsContent>
                  <TabsContent value="data">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {rec.dataPoints.map((point, i) => (
                        <div key={i}>
                          <p className="text-xs text-muted-foreground">{point.label}</p>
                          <p className="text-sm font-semibold">{point.value}</p>
                        </div>
                      ))}
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {sortedRecommendations.length === 0 && (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Brain className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">Нет рекомендаций</h3>
            <p className="text-sm text-muted-foreground text-center max-w-sm">
              По выбранным фильтрам рекомендации не найдены. Попробуйте изменить параметры поиска.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}