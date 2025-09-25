"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { 
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Area, AreaChart, ScatterChart, Scatter
} from 'recharts';
import { 
  MessageSquare, Mail, Smartphone, Bell, Target, TrendingUp, TrendingDown, 
  Users, Euro, Calendar, Clock, Zap, Award, AlertTriangle, Info, 
  Filter, Download, RefreshCw, ChevronRight, ArrowUpRight, ArrowDownRight,
  BarChart3, PieChart as PieChartIcon, Activity, Layers, GitBranch,
  Send, Eye, MousePointer, DollarSign, Percent, Hash, Star, ThumbsUp
} from "lucide-react";
import { cn } from "@/lib/utils";

// Моковые данные для метрик по кампаниям
const campaignMetrics = [
  {
    id: '1',
    name: 'Welcome Series',
    type: 'Email',
    segment: 'Новички',
    sent: 15420,
    delivered: 15100,
    opened: 8765,
    clicked: 2341,
    converted: 456,
    revenue: 125400,
    roi: 245,
    openRate: 58,
    ctr: 26.7,
    conversionRate: 3.0,
    trend: 'up',
    performance: 92
  },
  {
    id: '2',
    name: 'VIP Retention',
    type: 'Multi-channel',
    segment: 'VIP',
    sent: 3200,
    delivered: 3180,
    opened: 2450,
    clicked: 1120,
    converted: 320,
    revenue: 450000,
    roi: 520,
    openRate: 77,
    ctr: 45.7,
    conversionRate: 10.1,
    trend: 'up',
    performance: 98
  },
  {
    id: '3',
    name: 'Реактивация 30 дней',
    type: 'Push',
    segment: 'Спящие',
    sent: 8900,
    delivered: 7500,
    opened: 2100,
    clicked: 450,
    converted: 89,
    revenue: 15600,
    roi: 120,
    openRate: 28,
    ctr: 21.4,
    conversionRate: 1.2,
    trend: 'down',
    performance: 65
  }
];

// Данные по триггерам
const triggerMetrics = [
  {
    id: '1',
    name: 'Первый депозит',
    event: 'first_deposit',
    activations: 4520,
    conversions: 2260,
    revenue: 125000,
    avgResponseTime: '2 мин',
    effectiveness: 95,
    status: 'active'
  },
  {
    id: '2',
    name: 'Большой выигрыш',
    event: 'big_win',
    activations: 890,
    conversions: 445,
    revenue: 78000,
    avgResponseTime: '30 сек',
    effectiveness: 88,
    status: 'active'
  },
  {
    id: '3',
    name: 'Предотток 7 дней',
    event: 'pre_churn_7d',
    activations: 3200,
    conversions: 960,
    revenue: 45000,
    avgResponseTime: '1 час',
    effectiveness: 72,
    status: 'active'
  }
];

// Шаблоны и их эффективность
const templateMetrics = [
  {
    id: '1',
    name: 'Welcome Email v2',
    type: 'Email',
    usage: 15420,
    avgOpenRate: 58,
    avgCtr: 26.7,
    avgConversion: 3.0,
    rating: 4.8,
    lastUpdated: '2024-01-15'
  },
  {
    id: '2',
    name: 'VIP Birthday',
    type: 'Email',
    usage: 890,
    avgOpenRate: 82,
    avgCtr: 45.2,
    avgConversion: 12.5,
    rating: 4.9,
    lastUpdated: '2024-01-10'
  },
  {
    id: '3',
    name: 'Cashback Push',
    type: 'Push',
    usage: 8900,
    avgOpenRate: 35,
    avgCtr: 18.3,
    avgConversion: 2.1,
    rating: 4.2,
    lastUpdated: '2024-01-12'
  }
];

// Лучшие комбинации сегмент + коммуникация
const bestCombinations = [
  {
    segment: 'VIP',
    communication: 'Персональный менеджер',
    channel: 'Email + Call',
    effectiveness: 98,
    revenue: 1250000,
    ltv: 5000,
    retention: 85
  },
  {
    segment: 'Новички',
    communication: 'Welcome Series',
    channel: 'Email',
    effectiveness: 92,
    revenue: 450000,
    ltv: 350,
    retention: 45
  },
  {
    segment: 'Хайроллеры',
    communication: 'Эксклюзивные турниры',
    channel: 'Multi-channel',
    effectiveness: 95,
    revenue: 2100000,
    ltv: 12000,
    retention: 78
  },
  {
    segment: 'Предотток',
    communication: 'Win-back кампания',
    channel: 'Email + Push',
    effectiveness: 75,
    revenue: 125000,
    ltv: 180,
    retention: 32
  }
];

// Данные для графика производительности каналов
const channelPerformance = [
  { channel: 'Email', openRate: 45, ctr: 22, conversion: 3.5, roi: 250 },
  { channel: 'Push', openRate: 28, ctr: 15, conversion: 2.1, roi: 180 },
  { channel: 'SMS', openRate: 92, ctr: 35, conversion: 4.2, roi: 320 },
  { channel: 'In-App', openRate: 65, ctr: 42, conversion: 5.8, roi: 410 },
  { channel: 'WhatsApp', openRate: 78, ctr: 38, conversion: 4.5, roi: 380 }
];

// Временные метрики
const timeMetrics = [
  { hour: '00:00', emails: 120, push: 45, sms: 10, conversions: 12 },
  { hour: '06:00', emails: 340, push: 120, sms: 25, conversions: 28 },
  { hour: '12:00', emails: 890, push: 450, sms: 120, conversions: 95 },
  { hour: '18:00', emails: 1250, push: 680, sms: 180, conversions: 145 },
  { hour: '21:00', emails: 980, push: 520, sms: 150, conversions: 125 }
];

export default function CommunicationAnalyticsPage() {
  const [selectedPeriod, setSelectedPeriod] = useState('7d');
  const [selectedChannel, setSelectedChannel] = useState('all');
  const [selectedSegment, setSelectedSegment] = useState('all');
  const [activeTab, setActiveTab] = useState('overview');

  const getPerformanceColor = (value: number) => {
    if (value >= 90) return 'text-green-600';
    if (value >= 70) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getPerformanceBadge = (value: number) => {
    if (value >= 90) return { label: 'Отлично', color: 'bg-green-100 text-green-800' };
    if (value >= 70) return { label: 'Хорошо', color: 'bg-yellow-100 text-yellow-800' };
    return { label: 'Требует внимания', color: 'bg-red-100 text-red-800' };
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Анализ коммуникаций</h1>
          <p className="text-muted-foreground mt-1">
            Эффективность кампаний, триггеров и комбинаций сегмент + коммуникация
          </p>
        </div>
        <div className="flex gap-2">
          <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Период" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1d">Последние 24 часа</SelectItem>
              <SelectItem value="7d">Последние 7 дней</SelectItem>
              <SelectItem value="30d">Последние 30 дней</SelectItem>
              <SelectItem value="90d">Последние 90 дней</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline">
            <RefreshCw className="mr-2 h-4 w-4" />
            Обновить
          </Button>
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Экспорт
          </Button>
        </div>
      </div>

      {/* Key Metrics Summary */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Отправлено</CardTitle>
            <Send className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">127,420</div>
            <div className="flex items-center text-xs text-muted-foreground">
              <TrendingUp className="mr-1 h-3 w-3 text-green-600" />
              <span className="text-green-600">+12%</span> vs прошлый период
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Open Rate</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">42.8%</div>
            <div className="flex items-center text-xs text-muted-foreground">
              <TrendingUp className="mr-1 h-3 w-3 text-green-600" />
              <span className="text-green-600">+3.2%</span> улучшение
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">CTR</CardTitle>
            <MousePointer className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">18.5%</div>
            <div className="flex items-center text-xs text-muted-foreground">
              <TrendingDown className="mr-1 h-3 w-3 text-red-600" />
              <span className="text-red-600">-1.2%</span> снижение
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Конверсия</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3.8%</div>
            <div className="flex items-center text-xs text-muted-foreground">
              <TrendingUp className="mr-1 h-3 w-3 text-green-600" />
              <span className="text-green-600">+0.5%</span> рост
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">ROI</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">285%</div>
            <div className="flex items-center text-xs text-muted-foreground">
              <TrendingUp className="mr-1 h-3 w-3 text-green-600" />
              <span className="text-green-600">+45%</span> улучшение
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Обзор</TabsTrigger>
          <TabsTrigger value="campaigns">Кампании</TabsTrigger>
          <TabsTrigger value="triggers">Триггеры</TabsTrigger>
          <TabsTrigger value="templates">Шаблоны</TabsTrigger>
          <TabsTrigger value="combinations">Комбинации</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            {/* Channel Performance */}
            <Card>
              <CardHeader>
                <CardTitle>Эффективность каналов</CardTitle>
                <CardDescription>
                  Сравнение метрик по каналам коммуникации
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <RadarChart data={channelPerformance}>
                    <PolarGrid strokeDasharray="3 3" />
                    <PolarAngleAxis dataKey="channel" />
                    <PolarRadiusAxis angle={90} domain={[0, 100]} />
                    <Radar name="Open Rate" dataKey="openRate" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.3} />
                    <Radar name="CTR" dataKey="ctr" stroke="#10b981" fill="#10b981" fillOpacity={0.3} />
                    <Tooltip />
                    <Legend />
                  </RadarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Time Distribution */}
            <Card>
              <CardHeader>
                <CardTitle>Распределение по времени</CardTitle>
                <CardDescription>
                  Активность отправок и конверсий по часам
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={timeMetrics}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="hour" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Area type="monotone" dataKey="emails" stackId="1" stroke="#3b82f6" fill="#3b82f6" />
                    <Area type="monotone" dataKey="push" stackId="1" stroke="#10b981" fill="#10b981" />
                    <Area type="monotone" dataKey="sms" stackId="1" stroke="#f59e0b" fill="#f59e0b" />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* Top Performing Campaigns */}
          <Card>
            <CardHeader>
              <CardTitle>Топ кампаний по эффективности</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {campaignMetrics.slice(0, 3).map((campaign) => (
                  <div key={campaign.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-4">
                      <div className={cn(
                        "w-12 h-12 rounded-full flex items-center justify-center",
                        campaign.performance >= 90 ? "bg-green-100" : 
                        campaign.performance >= 70 ? "bg-yellow-100" : "bg-red-100"
                      )}>
                        <span className="font-bold text-lg">{campaign.performance}</span>
                      </div>
                      <div>
                        <h4 className="font-semibold">{campaign.name}</h4>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Badge variant="outline">{campaign.type}</Badge>
                          <span>•</span>
                          <span>{campaign.segment}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-6">
                      <div className="text-right">
                        <div className="text-sm text-muted-foreground">ROI</div>
                        <div className="font-semibold">{campaign.roi}%</div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm text-muted-foreground">Revenue</div>
                        <div className="font-semibold">€{campaign.revenue.toLocaleString()}</div>
                      </div>
                      <Button variant="ghost" size="sm">
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Campaigns Tab */}
        <TabsContent value="campaigns" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Метрики по кампаниям</CardTitle>
                  <CardDescription>
                    Детальная статистика по всем активным кампаниям
                  </CardDescription>
                </div>
                <div className="flex gap-2">
                  <Select value={selectedChannel} onValueChange={setSelectedChannel}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Канал" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Все каналы</SelectItem>
                      <SelectItem value="email">Email</SelectItem>
                      <SelectItem value="push">Push</SelectItem>
                      <SelectItem value="sms">SMS</SelectItem>
                      <SelectItem value="multi">Multi-channel</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Кампания</TableHead>
                    <TableHead>Тип</TableHead>
                    <TableHead>Сегмент</TableHead>
                    <TableHead className="text-right">Отправлено</TableHead>
                    <TableHead className="text-right">Open Rate</TableHead>
                    <TableHead className="text-right">CTR</TableHead>
                    <TableHead className="text-right">CR</TableHead>
                    <TableHead className="text-right">Revenue</TableHead>
                    <TableHead className="text-right">ROI</TableHead>
                    <TableHead>Статус</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {campaignMetrics.map((campaign) => (
                    <TableRow key={campaign.id}>
                      <TableCell className="font-medium">{campaign.name}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{campaign.type}</Badge>
                      </TableCell>
                      <TableCell>{campaign.segment}</TableCell>
                      <TableCell className="text-right">{campaign.sent.toLocaleString()}</TableCell>
                      <TableCell className="text-right">{campaign.openRate}%</TableCell>
                      <TableCell className="text-right">{campaign.ctr}%</TableCell>
                      <TableCell className="text-right">{campaign.conversionRate}%</TableCell>
                      <TableCell className="text-right">€{campaign.revenue.toLocaleString()}</TableCell>
                      <TableCell className="text-right font-semibold text-green-600">
                        {campaign.roi}%
                      </TableCell>
                      <TableCell>
                        <Badge className={getPerformanceBadge(campaign.performance).color}>
                          {getPerformanceBadge(campaign.performance).label}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {/* Campaign Performance Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Динамика показателей кампаний</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={[
                  { day: 'Пн', sent: 18000, opened: 7200, clicked: 1800, converted: 360 },
                  { day: 'Вт', sent: 22000, opened: 9900, clicked: 2640, converted: 528 },
                  { day: 'Ср', sent: 25000, opened: 11250, clicked: 3375, converted: 675 },
                  { day: 'Чт', sent: 21000, opened: 8820, clicked: 2520, converted: 504 },
                  { day: 'Пт', sent: 28000, opened: 13440, clicked: 4032, converted: 806 },
                  { day: 'Сб', sent: 32000, opened: 16000, clicked: 5120, converted: 1024 },
                  { day: 'Вс', sent: 30000, opened: 14400, clicked: 4320, converted: 864 }
                ]}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="day" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="sent" stroke="#94a3b8" name="Отправлено" />
                  <Line type="monotone" dataKey="opened" stroke="#3b82f6" name="Открыто" />
                  <Line type="monotone" dataKey="clicked" stroke="#10b981" name="Клики" />
                  <Line type="monotone" dataKey="converted" stroke="#f59e0b" name="Конверсии" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Triggers Tab */}
        <TabsContent value="triggers" className="space-y-6">
          <div className="grid gap-4 md:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Активные триггеры</CardTitle>
                <Zap className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">24</div>
                <p className="text-xs text-muted-foreground">
                  Из них 18 показывают рост
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Срабатываний за период</CardTitle>
                <Activity className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">8,610</div>
                <p className="text-xs text-muted-foreground">
                  +23% к прошлому периоду
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Средняя конверсия</CardTitle>
                <Percent className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">42%</div>
                <p className="text-xs text-muted-foreground">
                  Лучший результат за квартал
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Revenue от триггеров</CardTitle>
                <Euro className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">€248K</div>
                <p className="text-xs text-muted-foreground">
                  35% от общего revenue
                </p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Эффективность триггеров</CardTitle>
              <CardDescription>
                Метрики по всем активным триггерным коммуникациям
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Триггер</TableHead>
                    <TableHead>Событие</TableHead>
                    <TableHead className="text-right">Активаций</TableHead>
                    <TableHead className="text-right">Конверсий</TableHead>
                    <TableHead className="text-right">CR %</TableHead>
                    <TableHead className="text-right">Revenue</TableHead>
                    <TableHead>Время отклика</TableHead>
                    <TableHead>Эффективность</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {triggerMetrics.map((trigger) => (
                    <TableRow key={trigger.id}>
                      <TableCell className="font-medium">{trigger.name}</TableCell>
                      <TableCell>
                        <code className="text-xs bg-muted px-1 py-0.5 rounded">
                          {trigger.event}
                        </code>
                      </TableCell>
                      <TableCell className="text-right">{trigger.activations.toLocaleString()}</TableCell>
                      <TableCell className="text-right">{trigger.conversions.toLocaleString()}</TableCell>
                      <TableCell className="text-right">
                        {((trigger.conversions / trigger.activations) * 100).toFixed(1)}%
                      </TableCell>
                      <TableCell className="text-right">€{trigger.revenue.toLocaleString()}</TableCell>
                      <TableCell>{trigger.avgResponseTime}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Progress value={trigger.effectiveness} className="w-[60px]" />
                          <span className="text-sm font-medium">{trigger.effectiveness}%</span>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {/* Trigger Timeline */}
          <Card>
            <CardHeader>
              <CardTitle>Временная шкала срабатываний</CardTitle>
              <CardDescription>
                Распределение триггерных событий по времени
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={[
                  { time: '00:00', triggers: 45 },
                  { time: '04:00', triggers: 28 },
                  { time: '08:00', triggers: 120 },
                  { time: '12:00', triggers: 280 },
                  { time: '16:00', triggers: 195 },
                  { time: '20:00', triggers: 340 },
                  { time: '23:00', triggers: 210 }
                ]}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="time" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="triggers" fill="#3b82f6" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Templates Tab */}
        <TabsContent value="templates" className="space-y-6">
          <div className="grid gap-4 md:grid-cols-3">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Всего шаблонов</CardTitle>
                <Mail className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">42</div>
                <p className="text-xs text-muted-foreground">
                  12 новых за месяц
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Средний рейтинг</CardTitle>
                <Star className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">4.6/5.0</div>
                <p className="text-xs text-muted-foreground">
                  На основе 1,234 использований
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Топ шаблон</CardTitle>
                <Award className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-lg font-bold">VIP Birthday</div>
                <p className="text-xs text-muted-foreground">
                  82% open rate, 12.5% CR
                </p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Эффективность шаблонов</CardTitle>
              <CardDescription>
                Статистика использования и результативности шаблонов коммуникаций
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Название шаблона</TableHead>
                    <TableHead>Тип</TableHead>
                    <TableHead className="text-right">Использований</TableHead>
                    <TableHead className="text-right">Avg Open Rate</TableHead>
                    <TableHead className="text-right">Avg CTR</TableHead>
                    <TableHead className="text-right">Avg CR</TableHead>
                    <TableHead>Рейтинг</TableHead>
                    <TableHead>Обновлен</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {templateMetrics.map((template) => (
                    <TableRow key={template.id}>
                      <TableCell className="font-medium">{template.name}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{template.type}</Badge>
                      </TableCell>
                      <TableCell className="text-right">{template.usage.toLocaleString()}</TableCell>
                      <TableCell className="text-right">{template.avgOpenRate}%</TableCell>
                      <TableCell className="text-right">{template.avgCtr}%</TableCell>
                      <TableCell className="text-right">{template.avgConversion}%</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                          <span className="font-medium">{template.rating}</span>
                        </div>
                      </TableCell>
                      <TableCell>{template.lastUpdated}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {/* Template Performance Distribution */}
          <Card>
            <CardHeader>
              <CardTitle>Распределение эффективности</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <ScatterChart>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="openRate" name="Open Rate" unit="%" />
                  <YAxis dataKey="conversion" name="Conversion" unit="%" />
                  <Tooltip cursor={{ strokeDasharray: '3 3' }} />
                  <Scatter 
                    name="Шаблоны" 
                    data={[
                      { openRate: 58, conversion: 3.0, name: 'Welcome Email v2' },
                      { openRate: 82, conversion: 12.5, name: 'VIP Birthday' },
                      { openRate: 35, conversion: 2.1, name: 'Cashback Push' },
                      { openRate: 65, conversion: 5.5, name: 'Weekend Bonus' },
                      { openRate: 45, conversion: 3.8, name: 'Retention Alert' }
                    ]} 
                    fill="#3b82f6"
                  />
                </ScatterChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Combinations Tab */}
        <TabsContent value="combinations" className="space-y-6">
          <Alert>
            <Info className="h-4 w-4" />
            <AlertDescription>
              Анализ показывает лучшие комбинации сегментов и типов коммуникаций на основе исторических данных
            </AlertDescription>
          </Alert>

          <Card>
            <CardHeader>
              <CardTitle>Лучшие комбинации "Сегмент + Коммуникация"</CardTitle>
              <CardDescription>
                Топ комбинаций по эффективности и revenue
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {bestCombinations.map((combo, index) => (
                  <div key={index} className="p-4 border rounded-lg space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={cn(
                          "w-10 h-10 rounded-full flex items-center justify-center text-white font-bold",
                          index === 0 ? "bg-yellow-500" :
                          index === 1 ? "bg-gray-400" :
                          index === 2 ? "bg-orange-600" : "bg-blue-500"
                        )}>
                          #{index + 1}
                        </div>
                        <div>
                          <h4 className="font-semibold flex items-center gap-2">
                            {combo.segment} 
                            <ArrowRight className="h-4 w-4" />
                            {combo.communication}
                          </h4>
                          <p className="text-sm text-muted-foreground">
                            Канал: {combo.channel}
                          </p>
                        </div>
                      </div>
                      <Badge className={cn(
                        combo.effectiveness >= 90 ? "bg-green-100 text-green-800" :
                        combo.effectiveness >= 70 ? "bg-yellow-100 text-yellow-800" :
                        "bg-red-100 text-red-800"
                      )}>
                        Эффективность: {combo.effectiveness}%
                      </Badge>
                    </div>
                    
                    <div className="grid grid-cols-4 gap-4 pt-2">
                      <div className="text-center">
                        <div className="text-2xl font-bold">€{combo.revenue.toLocaleString()}</div>
                        <div className="text-xs text-muted-foreground">Revenue</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold">€{combo.ltv.toLocaleString()}</div>
                        <div className="text-xs text-muted-foreground">LTV</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold">{combo.retention}%</div>
                        <div className="text-xs text-muted-foreground">Retention</div>
                      </div>
                      <div className="text-center">
                        <Button variant="outline" size="sm">
                          Применить
                          <ChevronRight className="ml-1 h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Combination Matrix */}
          <Card>
            <CardHeader>
              <CardTitle>Матрица эффективности комбинаций</CardTitle>
              <CardDescription>
                Тепловая карта результативности различных комбинаций
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr>
                      <th className="text-left p-2">Сегмент / Канал</th>
                      <th className="text-center p-2">Email</th>
                      <th className="text-center p-2">Push</th>
                      <th className="text-center p-2">SMS</th>
                      <th className="text-center p-2">In-App</th>
                      <th className="text-center p-2">Multi</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="p-2 font-medium">VIP</td>
                      <td className="text-center p-2 bg-green-100">95%</td>
                      <td className="text-center p-2 bg-green-50">78%</td>
                      <td className="text-center p-2 bg-green-100">92%</td>
                      <td className="text-center p-2 bg-yellow-50">65%</td>
                      <td className="text-center p-2 bg-green-200">98%</td>
                    </tr>
                    <tr>
                      <td className="p-2 font-medium">Новички</td>
                      <td className="text-center p-2 bg-green-100">92%</td>
                      <td className="text-center p-2 bg-yellow-50">62%</td>
                      <td className="text-center p-2 bg-yellow-100">58%</td>
                      <td className="text-center p-2 bg-green-50">75%</td>
                      <td className="text-center p-2 bg-green-50">82%</td>
                    </tr>
                    <tr>
                      <td className="p-2 font-medium">Предотток</td>
                      <td className="text-center p-2 bg-yellow-100">68%</td>
                      <td className="text-center p-2 bg-green-50">75%</td>
                      <td className="text-center p-2 bg-yellow-50">52%</td>
                      <td className="text-center p-2 bg-yellow-100">60%</td>
                      <td className="text-center p-2 bg-green-50">78%</td>
                    </tr>
                    <tr>
                      <td className="p-2 font-medium">Спящие</td>
                      <td className="text-center p-2 bg-red-50">35%</td>
                      <td className="text-center p-2 bg-red-100">28%</td>
                      <td className="text-center p-2 bg-yellow-50">45%</td>
                      <td className="text-center p-2 bg-red-50">22%</td>
                      <td className="text-center p-2 bg-yellow-50">48%</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div className="flex items-center justify-center gap-4 mt-4 text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-green-200 rounded"></div>
                  <span>90-100% (Отлично)</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-green-100 rounded"></div>
                  <span>70-89% (Хорошо)</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-yellow-100 rounded"></div>
                  <span>50-69% (Средне)</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-red-100 rounded"></div>
                  <span>&lt;50% (Плохо)</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* AI Recommendations */}
          <Card className="border-blue-200 bg-blue-50/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5 text-blue-600" />
                AI Рекомендации по оптимизации
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <Alert className="border-blue-200">
                  <ThumbsUp className="h-4 w-4" />
                  <AlertDescription>
                    <strong>Высокий потенциал:</strong> Сегмент "Хайроллеры" показывает отличные результаты 
                    с Multi-channel коммуникациями. Рекомендуем увеличить частоту до 2 раз в неделю.
                  </AlertDescription>
                </Alert>
                
                <Alert className="border-yellow-200">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>
                    <strong>Требует внимания:</strong> Сегмент "Спящие" имеет низкую эффективность 
                    через Push (28%). Попробуйте SMS с персонализированными офферами.
                  </AlertDescription>
                </Alert>
                
                <Alert className="border-green-200">
                  <Info className="h-4 w-4" />
                  <AlertDescription>
                    <strong>Новая возможность:</strong> Создайте кросс-сегмент "VIP + Предотток" 
                    для таргетированной кампании возврата ценных игроков.
                  </AlertDescription>
                </Alert>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}