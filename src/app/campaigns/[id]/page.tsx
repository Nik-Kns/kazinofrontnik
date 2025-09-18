"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  ChevronLeft,
  Calendar,
  Target,
  TrendingUp,
  Users,
  Mail,
  MessageSquare,
  Bell,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Sparkles,
  Play,
  Pause,
  Settings,
  BarChart3,
  ArrowRight,
  RefreshCcw,
  Zap,
  Download,
  FileText,
  DollarSign,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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
  PieChart,
  Pie,
  Cell,
} from "recharts";

// Данные для графика производительности
const performanceData = [
  { date: "01 Дек", sent: 2400, opened: 1800, clicked: 600, converted: 240 },
  { date: "02 Дек", sent: 2800, opened: 2100, clicked: 750, converted: 320 },
  { date: "03 Дек", sent: 3200, opened: 2400, clicked: 880, converted: 380 },
  { date: "04 Дек", sent: 2600, opened: 1950, clicked: 650, converted: 280 },
  { date: "05 Дек", sent: 3500, opened: 2800, clicked: 1050, converted: 450 },
  { date: "06 Дек", sent: 3100, opened: 2480, clicked: 930, converted: 400 },
  { date: "07 Дек", sent: 2900, opened: 2320, clicked: 870, converted: 370 },
];

// Данные для канальной воронки
const channelFunnelData = [
  { name: "Email", value: 45, color: "#3B82F6" },
  { name: "Push", value: 30, color: "#10B981" },
  { name: "SMS", value: 25, color: "#F59E0B" },
];

export default function CampaignDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [campaign, setCampaign] = useState<any>(null);
  const [selectedTab, setSelectedTab] = useState("overview");
  const [aiRecommendations, setAiRecommendations] = useState<any[]>([]);

  useEffect(() => {
    // Загружаем данные кампании
    const mockCampaign = {
      id: params.id,
      name: "Приветственная серия для новых игроков",
      status: "active",
      type: "multi-channel",
      startDate: "2024-12-01",
      goals: {
        depositConversion: 25,
        bonusUsage: 60,
        avgDeposit: 150,
      },
      performance: {
        sent: 18900,
        delivered: 18200,
        opened: 14560,
        clicked: 5460,
        converted: 2340,
        revenue: 351000,
      },
      runRate: {
        depositConversion: { current: 18.5, target: 25, trend: "up" },
        bonusUsage: { current: 52, target: 60, trend: "up" },
        avgDeposit: { current: 142, target: 150, trend: "stable" },
      },
    };
    setCampaign(mockCampaign);

    // Генерируем ИИ-рекомендации
    setAiRecommendations([
      {
        id: 1,
        type: "timing",
        priority: "high",
        title: "Оптимизация времени отправки",
        description: "Переместите отправку на 18:00-20:00 для увеличения открываемости на 23%",
        impact: "+23% открываемость",
        status: "new",
      },
      {
        id: 2,
        type: "segmentation",
        priority: "medium",
        title: "Уточнить сегментацию",
        description: "Исключите игроков с депозитом >$1000 - они лучше реагируют на VIP-кампании",
        impact: "+15% конверсия",
        status: "new",
      },
      {
        id: 3,
        type: "offer",
        priority: "high",
        title: "A/B тест оффера",
        description: "Протестируйте 150% бонус вместо 100% для сегмента 25-34 лет",
        impact: "+$45K доход",
        status: "new",
      },
      {
        id: 4,
        type: "channel",
        priority: "low",
        title: "Добавить WhatsApp",
        description: "30% вашей аудитории активны в WhatsApp - добавьте этот канал",
        impact: "+8% охват",
        status: "declined",
      },
    ]);
  }, [params.id]);

  if (!campaign) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Загрузка кампании...</p>
        </div>
      </div>
    );
  }

  // Расчет run-rate прогресса
  const calculateRunRateProgress = (current: number, target: number) => {
    return Math.min((current / target) * 100, 100);
  };

  const handleAcceptRecommendation = (id: number) => {
    setAiRecommendations(prev =>
      prev.map(rec => rec.id === id ? { ...rec, status: "accepted" } : rec)
    );
  };

  const handleDeclineRecommendation = (id: number) => {
    setAiRecommendations(prev =>
      prev.map(rec => rec.id === id ? { ...rec, status: "declined" } : rec)
    );
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Шапка */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.push("/campaigns")}
          >
            <ChevronLeft className="h-4 w-4 mr-1" />
            Назад
          </Button>
          <div>
            <h1 className="text-2xl font-bold">{campaign.name}</h1>
            <p className="text-sm text-muted-foreground mt-1">
              ID кампании: {campaign.id}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Badge
            variant={campaign.status === "active" ? "default" : "secondary"}
          >
            {campaign.status === "active" ? "Активна" : "На паузе"}
          </Badge>
          <Button variant="outline" size="sm">
            <Settings className="h-4 w-4 mr-2" />
            Настройки
          </Button>
          <Button
            variant={campaign.status === "active" ? "secondary" : "default"}
            size="sm"
          >
            {campaign.status === "active" ? (
              <>
                <Pause className="h-4 w-4 mr-2" />
                Пауза
              </>
            ) : (
              <>
                <Play className="h-4 w-4 mr-2" />
                Запустить
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Run-rate до целей */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            Run-rate до целей кампании
          </CardTitle>
          <CardDescription>
            Текущий прогресс и прогноз достижения целей
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Конверсия в депозит */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Конверсия в депозит</span>
                <Badge variant={campaign.runRate.depositConversion.trend === "up" ? "default" : "secondary"}>
                  {campaign.runRate.depositConversion.current}% / {campaign.runRate.depositConversion.target}%
                </Badge>
              </div>
              <Progress 
                value={calculateRunRateProgress(
                  campaign.runRate.depositConversion.current,
                  campaign.runRate.depositConversion.target
                )}
                className="h-2"
              />
              <p className="text-xs text-muted-foreground">
                {campaign.runRate.depositConversion.trend === "up" ? (
                  <span className="text-green-600">↑ Растет, прогноз: достигнет цели через 5 дней</span>
                ) : (
                  <span className="text-yellow-600">→ Стабильно, требуется оптимизация</span>
                )}
              </p>
            </div>

            {/* Использование бонусов */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Использование бонусов</span>
                <Badge variant={campaign.runRate.bonusUsage.trend === "up" ? "default" : "secondary"}>
                  {campaign.runRate.bonusUsage.current}% / {campaign.runRate.bonusUsage.target}%
                </Badge>
              </div>
              <Progress 
                value={calculateRunRateProgress(
                  campaign.runRate.bonusUsage.current,
                  campaign.runRate.bonusUsage.target
                )}
                className="h-2"
              />
              <p className="text-xs text-muted-foreground">
                {campaign.runRate.bonusUsage.trend === "up" ? (
                  <span className="text-green-600">↑ Растет, прогноз: достигнет цели через 3 дня</span>
                ) : (
                  <span className="text-yellow-600">→ Требуется увеличение на 8%</span>
                )}
              </p>
            </div>

            {/* Средний депозит */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Средний депозит</span>
                <Badge variant={campaign.runRate.avgDeposit.trend === "stable" ? "secondary" : "default"}>
                  ${campaign.runRate.avgDeposit.current} / ${campaign.runRate.avgDeposit.target}
                </Badge>
              </div>
              <Progress 
                value={calculateRunRateProgress(
                  campaign.runRate.avgDeposit.current,
                  campaign.runRate.avgDeposit.target
                )}
                className="h-2"
              />
              <p className="text-xs text-muted-foreground">
                {campaign.runRate.avgDeposit.trend === "stable" ? (
                  <span className="text-yellow-600">→ Стабильно, недостает $8 до цели</span>
                ) : (
                  <span className="text-green-600">↑ Растет</span>
                )}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Обзор</TabsTrigger>
          <TabsTrigger value="channels">Каналы</TabsTrigger>
          <TabsTrigger value="history">История</TabsTrigger>
          <TabsTrigger value="ai">ИИ-рекомендации</TabsTrigger>
        </TabsList>

        {/* Вкладка: Обзор */}
        <TabsContent value="overview" className="space-y-6">
          {/* Ключевые метрики */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardDescription>Отправлено</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{campaign.performance.sent.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground mt-1">+12% к прошлой неделе</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardDescription>Открыто</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {((campaign.performance.opened / campaign.performance.sent) * 100).toFixed(1)}%
                </div>
                <p className="text-xs text-green-600 mt-1">↑ Выше среднего на 5%</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardDescription>Конверсия</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {((campaign.performance.converted / campaign.performance.sent) * 100).toFixed(1)}%
                </div>
                <p className="text-xs text-yellow-600 mt-1">→ В пределах нормы</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardDescription>Доход</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">
                  ${(campaign.performance.revenue / 1000).toFixed(0)}K
                </div>
                <p className="text-xs text-green-600 mt-1">↑ ROI 320%</p>
              </CardContent>
            </Card>
          </div>

          {/* График производительности */}
          <Card>
            <CardHeader>
              <CardTitle>Динамика показателей</CardTitle>
              <CardDescription>
                Производительность кампании за последние 7 дней
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={performanceData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="sent"
                    stroke="#94A3B8"
                    name="Отправлено"
                    strokeWidth={2}
                  />
                  <Line
                    type="monotone"
                    dataKey="opened"
                    stroke="#3B82F6"
                    name="Открыто"
                    strokeWidth={2}
                  />
                  <Line
                    type="monotone"
                    dataKey="clicked"
                    stroke="#10B981"
                    name="Кликнули"
                    strokeWidth={2}
                  />
                  <Line
                    type="monotone"
                    dataKey="converted"
                    stroke="#F59E0B"
                    name="Конвертировали"
                    strokeWidth={2}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Вкладка: Каналы */}
        <TabsContent value="channels" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Воронка по каналам</CardTitle>
              <CardDescription>
                Последовательность отправок: Email → Push → SMS
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {/* Визуализация воронки */}
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Mail className="h-5 w-5 text-blue-600" />
                      <span className="font-medium">Email</span>
                      <Badge variant="outline">1-й канал</Badge>
                    </div>
                    <Progress value={45} className="h-8" />
                    <div className="mt-2 text-sm text-muted-foreground">
                      8,505 отправлено • 3,827 открыто (45%)
                    </div>
                  </div>
                  <ArrowRight className="h-5 w-5 mx-4 text-muted-foreground" />
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Bell className="h-5 w-5 text-green-600" />
                      <span className="font-medium">Push</span>
                      <Badge variant="outline">2-й канал</Badge>
                    </div>
                    <Progress value={30} className="h-8" />
                    <div className="mt-2 text-sm text-muted-foreground">
                      5,670 отправлено • 1,701 кликнули (30%)
                    </div>
                  </div>
                  <ArrowRight className="h-5 w-5 mx-4 text-muted-foreground" />
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <MessageSquare className="h-5 w-5 text-yellow-600" />
                      <span className="font-medium">SMS</span>
                      <Badge variant="outline">3-й канал</Badge>
                    </div>
                    <Progress value={25} className="h-8" />
                    <div className="mt-2 text-sm text-muted-foreground">
                      4,725 отправлено • 1,181 конвертировали (25%)
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Распределение по каналам */}
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <h4 className="text-sm font-medium mb-4">Распределение конверсий</h4>
                    <ResponsiveContainer width="100%" height={200}>
                      <PieChart>
                        <Pie
                          data={channelFunnelData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({ name, value }) => `${name}: ${value}%`}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                        >
                          {channelFunnelData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium mb-4">Эффективность каналов</h4>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Mail className="h-4 w-4 text-blue-600" />
                          <span className="text-sm">Email</span>
                        </div>
                        <div className="text-right">
                          <div className="text-sm font-medium">$158K</div>
                          <div className="text-xs text-muted-foreground">ROI 450%</div>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Bell className="h-4 w-4 text-green-600" />
                          <span className="text-sm">Push</span>
                        </div>
                        <div className="text-right">
                          <div className="text-sm font-medium">$105K</div>
                          <div className="text-xs text-muted-foreground">ROI 380%</div>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <MessageSquare className="h-4 w-4 text-yellow-600" />
                          <span className="text-sm">SMS</span>
                        </div>
                        <div className="text-right">
                          <div className="text-sm font-medium">$88K</div>
                          <div className="text-xs text-muted-foreground">ROI 220%</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Вкладка: История */}
        <TabsContent value="history" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>История отправок</CardTitle>
              <CardDescription>
                Последние запуски и их результаты
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Дата</TableHead>
                    <TableHead>Канал</TableHead>
                    <TableHead>Сегмент</TableHead>
                    <TableHead>Отправлено</TableHead>
                    <TableHead>Открыто</TableHead>
                    <TableHead>Конверсия</TableHead>
                    <TableHead>Доход</TableHead>
                    <TableHead>Статус</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell>07.12 18:00</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Mail className="h-4 w-4" />
                        Email
                      </div>
                    </TableCell>
                    <TableCell>Новые игроки</TableCell>
                    <TableCell>2,900</TableCell>
                    <TableCell>
                      <Badge variant="outline">80%</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant="default">12.7%</Badge>
                    </TableCell>
                    <TableCell className="font-medium">$55K</TableCell>
                    <TableCell>
                      <CheckCircle className="h-4 w-4 text-green-600" />
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>06.12 19:30</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Bell className="h-4 w-4" />
                        Push
                      </div>
                    </TableCell>
                    <TableCell>Активные 7д</TableCell>
                    <TableCell>3,100</TableCell>
                    <TableCell>
                      <Badge variant="outline">45%</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant="default">8.9%</Badge>
                    </TableCell>
                    <TableCell className="font-medium">$42K</TableCell>
                    <TableCell>
                      <CheckCircle className="h-4 w-4 text-green-600" />
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>05.12 14:00</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <MessageSquare className="h-4 w-4" />
                        SMS
                      </div>
                    </TableCell>
                    <TableCell>VIP игроки</TableCell>
                    <TableCell>500</TableCell>
                    <TableCell>
                      <Badge variant="outline">92%</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant="default">28.0%</Badge>
                    </TableCell>
                    <TableCell className="font-medium">$120K</TableCell>
                    <TableCell>
                      <CheckCircle className="h-4 w-4 text-green-600" />
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>04.12 16:00</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Mail className="h-4 w-4" />
                        Email
                      </div>
                    </TableCell>
                    <TableCell>В риске оттока</TableCell>
                    <TableCell>2,600</TableCell>
                    <TableCell>
                      <Badge variant="outline">75%</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary">6.5%</Badge>
                    </TableCell>
                    <TableCell className="font-medium">$28K</TableCell>
                    <TableCell>
                      <AlertCircle className="h-4 w-4 text-yellow-600" />
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>03.12 20:00</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Bell className="h-4 w-4" />
                        Push
                      </div>
                    </TableCell>
                    <TableCell>Все игроки</TableCell>
                    <TableCell>3,200</TableCell>
                    <TableCell>
                      <Badge variant="outline">40%</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant="destructive">4.2%</Badge>
                    </TableCell>
                    <TableCell className="font-medium">$18K</TableCell>
                    <TableCell>
                      <XCircle className="h-4 w-4 text-red-600" />
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Вкладка: ИИ-рекомендации */}
        <TabsContent value="ai" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-blue-600" />
                ИИ-рекомендации для улучшения кампании
              </CardTitle>
              <CardDescription>
                Персонализированные советы на основе анализа данных
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {aiRecommendations.map((rec) => (
                  <Card 
                    key={rec.id}
                    className={rec.status === "declined" ? "opacity-60" : ""}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <Badge 
                              variant={
                                rec.priority === "high" ? "destructive" :
                                rec.priority === "medium" ? "default" : "secondary"
                              }
                            >
                              {rec.priority === "high" ? "Высокий приоритет" :
                               rec.priority === "medium" ? "Средний приоритет" : "Низкий приоритет"}
                            </Badge>
                            {rec.status === "accepted" && (
                              <Badge variant="outline" className="bg-green-50">
                                <CheckCircle className="h-3 w-3 mr-1" />
                                Принято
                              </Badge>
                            )}
                            {rec.status === "declined" && (
                              <Badge variant="outline" className="bg-red-50">
                                <XCircle className="h-3 w-3 mr-1" />
                                Отклонено
                              </Badge>
                            )}
                          </div>
                          <h4 className="font-medium mb-1">{rec.title}</h4>
                          <p className="text-sm text-muted-foreground mb-2">
                            {rec.description}
                          </p>
                          <div className="flex items-center gap-4">
                            <Badge variant="secondary">
                              <TrendingUp className="h-3 w-3 mr-1" />
                              {rec.impact}
                            </Badge>
                            {rec.type === "timing" && (
                              <span className="text-xs text-muted-foreground flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                Оптимизация времени
                              </span>
                            )}
                            {rec.type === "segmentation" && (
                              <span className="text-xs text-muted-foreground flex items-center gap-1">
                                <Users className="h-3 w-3" />
                                Сегментация
                              </span>
                            )}
                            {rec.type === "offer" && (
                              <span className="text-xs text-muted-foreground flex items-center gap-1">
                                <Zap className="h-3 w-3" />
                                Оффер
                              </span>
                            )}
                            {rec.type === "channel" && (
                              <span className="text-xs text-muted-foreground flex items-center gap-1">
                                <MessageSquare className="h-3 w-3" />
                                Канал
                              </span>
                            )}
                          </div>
                        </div>
                        {rec.status === "new" && (
                          <div className="flex gap-2 ml-4">
                            <Button
                              size="sm"
                              variant="default"
                              onClick={() => handleAcceptRecommendation(rec.id)}
                            >
                              <CheckCircle className="h-4 w-4 mr-1" />
                              Применить
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleDeclineRecommendation(rec.id)}
                            >
                              <XCircle className="h-4 w-4 mr-1" />
                              Отклонить
                            </Button>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <Separator className="my-6" />

              {/* История примененных рекомендаций */}
              <div>
                <h3 className="text-sm font-medium mb-4">История рекомендаций</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span>Изменено время отправки на 18:00</span>
                    </div>
                    <div className="text-right">
                      <div className="text-muted-foreground">3 дня назад</div>
                      <div className="text-xs text-green-600">+18% открываемость</div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span>Добавлен A/B тест заголовков</span>
                    </div>
                    <div className="text-right">
                      <div className="text-muted-foreground">Неделю назад</div>
                      <div className="text-xs text-green-600">+12% CTR</div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <XCircle className="h-4 w-4 text-red-600" />
                      <span>Отклонено: увеличение частоты</span>
                    </div>
                    <div className="text-right">
                      <div className="text-muted-foreground">2 недели назад</div>
                      <div className="text-xs text-muted-foreground">Не применено</div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}