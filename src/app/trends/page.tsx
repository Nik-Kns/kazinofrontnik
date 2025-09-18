"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  TrendingUp,
  TrendingDown,
  Activity,
  AlertCircle,
  BarChart3,
  Calendar,
  Filter,
  Download,
  RefreshCw,
  ArrowUpRight,
  ArrowDownRight,
  Minus,
  Info,
  ChevronRight,
  Target,
  Users,
  DollarSign,
  Gamepad2,
  CreditCard
} from "lucide-react";
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import Link from "next/link";

// Данные для графиков трендов
const trendData = [
  { date: "01 Дек", revenue: 145000, players: 3200, deposits: 890, retention: 68 },
  { date: "02 Дек", revenue: 152000, players: 3350, deposits: 920, retention: 65 },
  { date: "03 Дек", revenue: 148000, players: 3100, deposits: 875, retention: 70 },
  { date: "04 Дек", revenue: 162000, players: 3450, deposits: 980, retention: 72 },
  { date: "05 Дек", revenue: 175000, players: 3600, deposits: 1050, retention: 69 },
  { date: "06 Дек", revenue: 168000, players: 3500, deposits: 1020, retention: 71 },
  { date: "07 Дек", revenue: 180000, players: 3750, deposits: 1100, retention: 73 },
];

interface TrendMetric {
  id: string;
  name: string;
  value: string;
  change: number;
  trend: 'up' | 'down' | 'stable';
  category: string;
  forecast: string;
  confidence: number;
}

const trendMetrics: TrendMetric[] = [
  {
    id: '1',
    name: 'Общий доход (GGR)',
    value: '€1,180,000',
    change: 12.5,
    trend: 'up',
    category: 'revenue',
    forecast: '€1,350,000 к концу месяца',
    confidence: 87
  },
  {
    id: '2',
    name: 'Активные игроки (MAU)',
    value: '24,567',
    change: -3.2,
    trend: 'down',
    category: 'players',
    forecast: 'Стабилизация на уровне 24,000',
    confidence: 75
  },
  {
    id: '3',
    name: 'Средний депозит',
    value: '€148',
    change: 8.7,
    trend: 'up',
    category: 'deposits',
    forecast: '€155 к концу недели',
    confidence: 92
  },
  {
    id: '4',
    name: 'Retention D7',
    value: '71%',
    change: 0,
    trend: 'stable',
    category: 'retention',
    forecast: 'Без изменений',
    confidence: 95
  },
  {
    id: '5',
    name: 'Конверсия в FTD',
    value: '18.5%',
    change: -5.1,
    trend: 'down',
    category: 'conversion',
    forecast: 'Требуется оптимизация',
    confidence: 78
  },
  {
    id: '6',
    name: 'LTV (6 мес)',
    value: '€485',
    change: 15.2,
    trend: 'up',
    category: 'ltv',
    forecast: '€520 в следующем квартале',
    confidence: 83
  }
];

export default function TrendsPage() {
  const [selectedPeriod, setSelectedPeriod] = useState('7d');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedMetric, setSelectedMetric] = useState('revenue');

  const filteredMetrics = selectedCategory === 'all' 
    ? trendMetrics 
    : trendMetrics.filter(m => m.category === selectedCategory);

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Заголовок */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Activity className="h-8 w-8 text-primary" />
            Анализ трендов
          </h1>
          <p className="text-muted-foreground mt-1">
            Детальный анализ динамики ключевых метрик и прогнозы
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="24h">Последние 24ч</SelectItem>
              <SelectItem value="7d">Последние 7 дней</SelectItem>
              <SelectItem value="30d">Последние 30 дней</SelectItem>
              <SelectItem value="90d">Последние 90 дней</SelectItem>
              <SelectItem value="ytd">С начала года</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Экспорт
          </Button>
          <Button variant="outline" size="sm">
            <RefreshCw className="h-4 w-4 mr-2" />
            Обновить
          </Button>
        </div>
      </div>

      {/* Фильтры */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">Фильтры:</span>
            </div>
            <div className="flex gap-2">
              <Button
                variant={selectedCategory === 'all' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedCategory('all')}
              >
                Все метрики
              </Button>
              <Button
                variant={selectedCategory === 'revenue' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedCategory('revenue')}
              >
                <DollarSign className="h-3 w-3 mr-1" />
                Доход
              </Button>
              <Button
                variant={selectedCategory === 'players' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedCategory('players')}
              >
                <Users className="h-3 w-3 mr-1" />
                Игроки
              </Button>
              <Button
                variant={selectedCategory === 'retention' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedCategory('retention')}
              >
                <Target className="h-3 w-3 mr-1" />
                Удержание
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Основные тренды */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredMetrics.map((metric) => (
          <Card key={metric.id} className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium">
                  {metric.name}
                </CardTitle>
                <Badge 
                  variant={
                    metric.trend === 'up' ? 'default' : 
                    metric.trend === 'down' ? 'destructive' : 'secondary'
                  }
                  className="ml-2"
                >
                  {metric.trend === 'up' && <ArrowUpRight className="h-3 w-3 mr-1" />}
                  {metric.trend === 'down' && <ArrowDownRight className="h-3 w-3 mr-1" />}
                  {metric.trend === 'stable' && <Minus className="h-3 w-3 mr-1" />}
                  {Math.abs(metric.change)}%
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="text-2xl font-bold">{metric.value}</div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">Прогноз:</span>
                  <span className="font-medium">{metric.forecast}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">Уверенность:</span>
                  <div className="flex items-center gap-2">
                    <div className="w-20 h-2 bg-muted rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-primary rounded-full"
                        style={{ width: `${metric.confidence}%` }}
                      />
                    </div>
                    <span className="text-xs font-medium">{metric.confidence}%</span>
                  </div>
                </div>
              </div>

              <Button 
                variant="ghost" 
                size="sm" 
                className="w-full justify-between"
                asChild
              >
                <Link href={`/analytics?metric=${metric.category}`}>
                  Подробнее
                  <ChevronRight className="h-4 w-4" />
                </Link>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Графики трендов */}
      <Tabs defaultValue="revenue" className="space-y-4">
        <TabsList>
          <TabsTrigger value="revenue">Доход</TabsTrigger>
          <TabsTrigger value="players">Игроки</TabsTrigger>
          <TabsTrigger value="deposits">Депозиты</TabsTrigger>
          <TabsTrigger value="retention">Удержание</TabsTrigger>
        </TabsList>

        <TabsContent value="revenue" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Динамика дохода</CardTitle>
              <CardDescription>
                Общий игровой доход за выбранный период
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={trendData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip formatter={(value) => `€${value.toLocaleString()}`} />
                  <Area
                    type="monotone"
                    dataKey="revenue"
                    stroke="#3B82F6"
                    fill="#3B82F6"
                    fillOpacity={0.2}
                    strokeWidth={2}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="players" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Активность игроков</CardTitle>
              <CardDescription>
                Количество активных игроков по дням
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={trendData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="players"
                    stroke="#10B981"
                    strokeWidth={2}
                    dot={{ fill: '#10B981', r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="deposits" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Количество депозитов</CardTitle>
              <CardDescription>
                Ежедневная статистика депозитов
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={trendData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="deposits" fill="#F59E0B" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="retention" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Показатели удержания</CardTitle>
              <CardDescription>
                Процент удержания игроков D7
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={trendData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis domain={[0, 100]} />
                  <Tooltip formatter={(value) => `${value}%`} />
                  <Area
                    type="monotone"
                    dataKey="retention"
                    stroke="#8B5CF6"
                    fill="#8B5CF6"
                    fillOpacity={0.2}
                    strokeWidth={2}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Аномалии и алерты */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-yellow-600" />
            Обнаруженные аномалии
          </CardTitle>
          <CardDescription>
            Необычные паттерны в данных, требующие внимания
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-start gap-3 p-3 bg-red-50 dark:bg-red-950 rounded-lg">
              <TrendingDown className="h-5 w-5 text-red-600 mt-0.5" />
              <div className="flex-1">
                <h4 className="font-medium text-sm">Резкое падение конверсии</h4>
                <p className="text-xs text-muted-foreground mt-1">
                  Конверсия в FTD упала на 23% за последние 48 часов. Возможная проблема с платежной системой.
                </p>
                <Button size="sm" variant="link" className="h-auto p-0 mt-2">
                  Проверить платежи →
                </Button>
              </div>
            </div>
            
            <div className="flex items-start gap-3 p-3 bg-yellow-50 dark:bg-yellow-950 rounded-lg">
              <AlertCircle className="h-5 w-5 text-yellow-600 mt-0.5" />
              <div className="flex-1">
                <h4 className="font-medium text-sm">Необычная активность VIP сегмента</h4>
                <p className="text-xs text-muted-foreground mt-1">
                  Активность VIP игроков снизилась на 40% в выходные. Рекомендуется персональный контакт.
                </p>
                <Button size="sm" variant="link" className="h-auto p-0 mt-2">
                  Открыть VIP менеджер →
                </Button>
              </div>
            </div>
            
            <div className="flex items-start gap-3 p-3 bg-green-50 dark:bg-green-950 rounded-lg">
              <TrendingUp className="h-5 w-5 text-green-600 mt-0.5" />
              <div className="flex-1">
                <h4 className="font-medium text-sm">Позитивный всплеск активности</h4>
                <p className="text-xs text-muted-foreground mt-1">
                  Новый слот "Lucky Fortune" показывает ROI 380%. Рекомендуется увеличить промо.
                </p>
                <Button size="sm" variant="link" className="h-auto p-0 mt-2">
                  Создать кампанию →
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}