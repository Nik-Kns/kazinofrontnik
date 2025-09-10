"use client";

import { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Bell, CircleUserRound, History, Link as LinkIcon, ShieldCheck, Variable, 
  GitPullRequest, GitBranch, DollarSign, Euro, Bitcoin, TrendingUp, AlertCircle, 
  Sparkles, Target, BarChart3, Users, Activity, Clock, Settings,
  CheckCircle2, XCircle, Loader2, Mail, Shield, Webhook, Server, 
  RefreshCw, Eye, EyeOff, ExternalLink, FileText
} from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { WebhookLogsTable } from "@/components/settings/webhook-logs-table";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Типы для интеграций
interface IntegrationStatus {
  id: string;
  name: string;
  description: string;
  status: 'pending' | 'checking' | 'connected' | 'error';
  icon: React.ElementType;
  required: boolean;
  lastChecked?: Date;
  error?: string;
}

// Типы для вебхук логов
interface WebhookLog {
  id: string;
  timestamp: Date;
  service: string;
  event: string;
  status: 'success' | 'error' | 'warning';
  message: string;
  payload?: any;
}

export default function SettingsPage() {
  const [metricGoals, setMetricGoals] = useState<Record<string, number>>({});
  const [onboardingCompleted, setOnboardingCompleted] = useState(false);
  const [isChecking, setIsChecking] = useState(false);
  const [showLogs, setShowLogs] = useState(false);
  
  // Состояния интеграций
  const [integrations, setIntegrations] = useState<IntegrationStatus[]>([
    {
      id: 'email',
      name: 'Email рассыльщик',
      description: 'Подключение к сервису email рассылок (SendGrid, Mailgun)',
      status: 'connected',
      icon: Mail,
      required: true,
      lastChecked: new Date(Date.now() - 3600000)
    },
    {
      id: 'casino_admin',
      name: 'Админка казино',
      description: 'Интеграция с административной панелью казино',
      status: 'connected',
      icon: Shield,
      required: true,
      lastChecked: new Date(Date.now() - 7200000)
    },
    {
      id: 'api',
      name: 'API интеграция',
      description: 'Подключение к внешним сервисам через API',
      status: 'pending',
      icon: Server,
      required: true
    },
    {
      id: 'webhooks',
      name: 'Webhook endpoints',
      description: 'Настройка webhook эндпоинтов для получения событий',
      status: 'error',
      icon: Webhook,
      required: false,
      error: 'Connection timeout'
    }
  ]);

  // Вебхук логи
  const [webhookLogs, setWebhookLogs] = useState<WebhookLog[]>([
    {
      id: '1',
      timestamp: new Date(Date.now() - 60000),
      service: 'Casino Admin',
      event: 'player.registered',
      status: 'success',
      message: 'New player registered: player_12345',
      payload: { playerId: 'player_12345', email: 'test@example.com' }
    },
    {
      id: '2',
      timestamp: new Date(Date.now() - 120000),
      service: 'Email Service',
      event: 'email.sent',
      status: 'success',
      message: 'Welcome email sent successfully',
      payload: { to: 'test@example.com', template: 'welcome' }
    },
    {
      id: '3',
      timestamp: new Date(Date.now() - 180000),
      service: 'API Gateway',
      event: 'api.call',
      status: 'error',
      message: 'Rate limit exceeded',
      payload: { endpoint: '/api/players', error: 'Too many requests' }
    },
    {
      id: '4',
      timestamp: new Date(Date.now() - 240000),
      service: 'Webhook',
      event: 'webhook.received',
      status: 'warning',
      message: 'Webhook signature verification failed',
      payload: { source: 'payment_provider', event: 'deposit.completed' }
    },
    {
      id: '5',
      timestamp: new Date(Date.now() - 300000),
      service: 'Casino Admin',
      event: 'player.deposit',
      status: 'success',
      message: 'Player deposit processed: €100',
      payload: { playerId: 'player_67890', amount: 100, currency: 'EUR' }
    }
  ]);

  // Проверка интеграций
  const checkIntegrations = async () => {
    setIsChecking(true);
    
    // Симуляция проверки каждой интеграции
    for (let i = 0; i < integrations.length; i++) {
      const integration = integrations[i];
      
      // Обновляем статус на "проверка"
      setIntegrations(prev => prev.map((item, index) => 
        index === i ? { ...item, status: 'checking' } : item
      ));
      
      // Симуляция задержки проверки
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Случайный результат проверки для демо
      const isConnected = Math.random() > 0.3;
      const newStatus = isConnected ? 'connected' : 'error';
      const error = !isConnected ? 'Connection failed' : undefined;
      
      setIntegrations(prev => prev.map((item, index) => 
        index === i ? { 
          ...item, 
          status: newStatus as any,
          lastChecked: new Date(),
          error
        } : item
      ));
      
      // Добавляем лог о проверке
      const newLog: WebhookLog = {
        id: Date.now().toString() + i,
        timestamp: new Date(),
        service: integration.name,
        event: 'integration.check',
        status: isConnected ? 'success' : 'error',
        message: isConnected ? `${integration.name} connected successfully` : `Failed to connect to ${integration.name}`,
        payload: { integrationId: integration.id, status: newStatus }
      };
      
      setWebhookLogs(prev => [newLog, ...prev]);
    }
    
    setIsChecking(false);
  };

  useEffect(() => {
    // Загружаем сохраненные метрики из localStorage
    const savedMetrics = localStorage.getItem('metricGoals');
    if (savedMetrics) {
      setMetricGoals(JSON.parse(savedMetrics));
    }
    
    // Проверяем, завершен ли онбординг
    const completed = localStorage.getItem('onboardingCompleted');
    setOnboardingCompleted(completed === 'true');
  }, []);

  const updateMetric = (id: string, value: number) => {
    const newMetrics = { ...metricGoals, [id]: value };
    setMetricGoals(newMetrics);
    localStorage.setItem('metricGoals', JSON.stringify(newMetrics));
  };

  return (
    <div className="p-4 md:p-6 lg:p-8">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold tracking-tight">Настройки</h1>
        {!onboardingCompleted && (
          <Button variant="outline" asChild>
            <a href="/onboarding">
              <Settings className="mr-2 h-4 w-4" />
              Запустить онбординг
            </a>
          </Button>
        )}
      </div>
      <Tabs defaultValue="profile" className="w-full">
        <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 mb-6">
          <TabsTrigger value="profile"><CircleUserRound className="mr-2 h-4 w-4" />Профиль</TabsTrigger>
          <TabsTrigger value="metrics"><Target className="mr-2 h-4 w-4" />Метрики</TabsTrigger>
          <TabsTrigger value="access"><ShieldCheck className="mr-2 h-4 w-4" />Доступ</TabsTrigger>
          <TabsTrigger value="integrations"><LinkIcon className="mr-2 h-4 w-4" />Интеграции</TabsTrigger>
          <TabsTrigger value="webhooks"><History className="mr-2 h-4 w-4" />Логи</TabsTrigger>
          <TabsTrigger value="variables"><Variable className="mr-2 h-4 w-4" />Переменные</TabsTrigger>
          <TabsTrigger value="notifications"><Bell className="mr-2 h-4 w-4" />Уведомления</TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="space-y-6">
          {/* Основная информация профиля */}
          <Card>
            <CardHeader>
              <CardTitle>Настройки профиля</CardTitle>
              <CardDescription>Управление вашими персональными данными.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Имя</Label>
                <Input id="name" defaultValue="John Doe" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" defaultValue="john.doe@example.com" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="company">Компания</Label>
                <Input id="company" defaultValue="AIGAMING" />
              </div>
              <Button>Сохранить изменения</Button>
            </CardContent>
          </Card>

          {/* Мультивалютные счета */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Мультивалютные счета</CardTitle>
                  <CardDescription>Управление валютными счетами и рекомендации по оптимизации</CardDescription>
                </div>
                <Badge variant="secondary">
                  <Sparkles className="mr-1 h-3 w-3" />
                  AI-оптимизация
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* EUR счет */}
              <div className="p-4 border rounded-lg space-y-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <Euro className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold">EUR - Основной счет</h4>
                      <p className="text-sm text-muted-foreground">Европейский рынок</p>
                    </div>
                  </div>
                  <Badge className="bg-green-100 text-green-700">Активен</Badge>
                </div>
                
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <p className="text-xs text-muted-foreground">Баланс</p>
                    <p className="text-lg font-bold">€485,320</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">GGR (месяц)</p>
                    <p className="text-lg font-bold">€124,850</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">ROI</p>
                    <p className="text-lg font-bold text-green-600">+23.4%</p>
                  </div>
                </div>

                <div className="p-3 bg-blue-50 rounded-lg">
                  <div className="flex items-start gap-2">
                    <AlertCircle className="h-4 w-4 text-blue-600 mt-0.5" />
                    <div className="text-sm">
                      <p className="font-medium text-blue-900">ИИ рекомендация</p>
                      <p className="text-blue-700">CTR в EUR зоне ниже среднего на 15%. Рекомендуем протестировать новые креативы для немецкого сегмента.</p>
                      <Button variant="link" className="h-auto p-0 text-blue-600 mt-1">
                        Создать A/B тест →
                      </Button>
                    </div>
                  </div>
                </div>
              </div>

              {/* USD счет */}
              <div className="p-4 border rounded-lg space-y-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-green-100 rounded-lg">
                      <DollarSign className="h-5 w-5 text-green-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold">USD - Дополнительный</h4>
                      <p className="text-sm text-muted-foreground">Глобальные рынки</p>
                    </div>
                  </div>
                  <Badge className="bg-green-100 text-green-700">Активен</Badge>
                </div>
                
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <p className="text-xs text-muted-foreground">Баланс</p>
                    <p className="text-lg font-bold">$312,480</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">GGR (месяц)</p>
                    <p className="text-lg font-bold">$89,230</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">ROI</p>
                    <p className="text-lg font-bold text-green-600">+18.2%</p>
                  </div>
                </div>

                <div className="p-3 bg-green-50 rounded-lg">
                  <div className="flex items-start gap-2">
                    <TrendingUp className="h-4 w-4 text-green-600 mt-0.5" />
                    <div className="text-sm">
                      <p className="font-medium text-green-900">ИИ рекомендация</p>
                      <p className="text-green-700">USD счет показывает рост конверсии на 8% за последние 2 недели. Увеличьте бюджет на успешные кампании.</p>
                      <Button variant="link" className="h-auto p-0 text-green-600 mt-1">
                        Масштабировать кампании →
                      </Button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Crypto счет */}
              <div className="p-4 border rounded-lg space-y-4 opacity-60">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-orange-100 rounded-lg">
                      <Bitcoin className="h-5 w-5 text-orange-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold">Crypto</h4>
                      <p className="text-sm text-muted-foreground">Криптовалютные операции</p>
                    </div>
                  </div>
                  <Badge variant="secondary">Неактивен</Badge>
                </div>
                
                <div className="text-center py-4">
                  <p className="text-sm text-muted-foreground mb-3">Криптовалютный счет пока не подключен</p>
                  <Button variant="outline" size="sm">
                    Подключить Crypto счет
                  </Button>
                </div>
              </div>

              {/* Добавить новую валюту */}
              <div className="flex items-center justify-between p-4 border border-dashed rounded-lg">
                <div>
                  <p className="font-medium">Добавить новую валюту</p>
                  <p className="text-sm text-muted-foreground">Расширьте географию вашего бизнеса</p>
                </div>
                <Button variant="outline">
                  <DollarSign className="mr-2 h-4 w-4" />
                  Добавить валюту
                </Button>
              </div>

              {/* Общая статистика */}
              <div className="p-4 bg-muted rounded-lg">
                <h4 className="font-semibold mb-3">Сводка по всем валютам</h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <p className="text-xs text-muted-foreground">Общий баланс</p>
                    <p className="text-lg font-bold">€797,800</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Общий GGR</p>
                    <p className="text-lg font-bold">€214,080</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Средний ROI</p>
                    <p className="text-lg font-bold text-green-600">+20.8%</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Активных валют</p>
                    <p className="text-lg font-bold">2 из 3</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Вкладка с целевыми метриками */}
        <TabsContent value="metrics" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Целевые метрики</CardTitle>
              <CardDescription>
                Управление целевыми показателями для мониторинга и оптимизации
              </CardDescription>
            </CardHeader>
            <CardContent>
              {Object.keys(metricGoals).length === 0 ? (
                <div className="text-center py-8">
                  <Target className="mx-auto h-12 w-12 text-muted-foreground/50 mb-4" />
                  <p className="text-muted-foreground mb-4">
                    Целевые метрики еще не настроены
                  </p>
                  <Button asChild>
                    <a href="/onboarding">
                      <Settings className="mr-2 h-4 w-4" />
                      Настроить метрики
                    </a>
                  </Button>
                </div>
              ) : (
                <div className="space-y-6">
                  {/* Retention метрики */}
                  <div>
                    <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
                      <Users className="h-4 w-4" />
                      Retention
                    </h3>
                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="retention_rate">Retention Rate (%)</Label>
                        <Input
                          id="retention_rate"
                          type="number"
                          value={metricGoals.retention_rate || 70}
                          onChange={(e) => updateMetric('retention_rate', parseFloat(e.target.value))}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="churn_rate">Churn Rate (%)</Label>
                        <Input
                          id="churn_rate"
                          type="number"
                          value={metricGoals.churn_rate || 5}
                          onChange={(e) => updateMetric('churn_rate', parseFloat(e.target.value))}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Revenue метрики */}
                  <div>
                    <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
                      <DollarSign className="h-4 w-4" />
                      Revenue
                    </h3>
                    <div className="grid gap-4 md:grid-cols-3">
                      <div className="space-y-2">
                        <Label htmlFor="ltv">LTV (€)</Label>
                        <Input
                          id="ltv"
                          type="number"
                          value={metricGoals.ltv || 500}
                          onChange={(e) => updateMetric('ltv', parseFloat(e.target.value))}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="arpu">ARPU (€)</Label>
                        <Input
                          id="arpu"
                          type="number"
                          value={metricGoals.arpu || 45}
                          onChange={(e) => updateMetric('arpu', parseFloat(e.target.value))}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="monthly_revenue">Monthly Revenue (€)</Label>
                        <Input
                          id="monthly_revenue"
                          type="number"
                          value={metricGoals.monthly_revenue || 1500000}
                          onChange={(e) => updateMetric('monthly_revenue', parseFloat(e.target.value))}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Engagement метрики */}
                  <div>
                    <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
                      <Activity className="h-4 w-4" />
                      Engagement
                    </h3>
                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="daily_active_users">DAU</Label>
                        <Input
                          id="daily_active_users"
                          type="number"
                          value={metricGoals.daily_active_users || 10000}
                          onChange={(e) => updateMetric('daily_active_users', parseFloat(e.target.value))}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="average_session_time">Avg Session Time (min)</Label>
                        <Input
                          id="average_session_time"
                          type="number"
                          value={metricGoals.average_session_time || 35}
                          onChange={(e) => updateMetric('average_session_time', parseFloat(e.target.value))}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Conversion метрики */}
                  <div>
                    <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
                      <BarChart3 className="h-4 w-4" />
                      Conversion
                    </h3>
                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="conversion_rate">Conversion Rate (%)</Label>
                        <Input
                          id="conversion_rate"
                          type="number"
                          step="0.1"
                          value={metricGoals.conversion_rate || 3.5}
                          onChange={(e) => updateMetric('conversion_rate', parseFloat(e.target.value))}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 border-t">
                    <p className="text-sm text-muted-foreground">
                      Последнее обновление: {new Date().toLocaleString('ru-RU')}
                    </p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="access">
          <Card>
            <CardHeader>
              <CardTitle>Пользователи и права доступа</CardTitle>
              <CardDescription>Управляйте доступом вашей команды к платформе.</CardDescription>
            </CardHeader>
            <CardContent>
              <p>Здесь будет интерфейс для добавления пользователей и назначения ролей.</p>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="integrations" className="space-y-6">
          {/* Статус интеграций */}
          <Card>
            <CardHeader>
              <CardTitle>Статус интеграций</CardTitle>
              <CardDescription>
                Проверьте подключение всех необходимых сервисов
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Badge variant="outline">
                    {integrations.filter(i => i.status === 'connected').length} из {integrations.length} подключено
                  </Badge>
                  <Badge 
                    variant={integrations.filter(i => i.required && i.status !== 'connected').length > 0 ? 'destructive' : 'default'}
                  >
                    {integrations.filter(i => i.required && i.status !== 'connected').length} требуют внимания
                  </Badge>
                </div>
                <Button 
                  onClick={checkIntegrations} 
                  disabled={isChecking}
                  variant="outline"
                  size="sm"
                >
                  {isChecking ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Проверка...
                    </>
                  ) : (
                    <>
                      <RefreshCw className="mr-2 h-4 w-4" />
                      Проверить все
                    </>
                  )}
                </Button>
              </div>

              <div className="space-y-3">
                {integrations.map((integration) => (
                  <div 
                    key={integration.id} 
                    className={cn(
                      "flex items-center justify-between p-4 rounded-lg border",
                      integration.status === 'connected' && "border-green-200 bg-green-50/50",
                      integration.status === 'error' && "border-red-200 bg-red-50/50",
                      integration.status === 'checking' && "border-blue-200 bg-blue-50/50",
                      integration.status === 'pending' && "border-gray-200"
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <div className={cn(
                        "p-2 rounded-lg",
                        integration.status === 'connected' && "bg-green-100",
                        integration.status === 'error' && "bg-red-100",
                        integration.status === 'checking' && "bg-blue-100",
                        integration.status === 'pending' && "bg-gray-100"
                      )}>
                        <integration.icon className={cn(
                          "h-5 w-5",
                          integration.status === 'connected' && "text-green-600",
                          integration.status === 'error' && "text-red-600",
                          integration.status === 'checking' && "text-blue-600",
                          integration.status === 'pending' && "text-gray-600"
                        )} />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-semibold">{integration.name}</h4>
                          {integration.required && (
                            <Badge variant="outline" className="text-xs">Обязательно</Badge>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {integration.description}
                        </p>
                        {integration.lastChecked && (
                          <p className="text-xs text-muted-foreground mt-1">
                            Последняя проверка: {integration.lastChecked.toLocaleTimeString('ru-RU')}
                          </p>
                        )}
                        {integration.error && (
                          <p className="text-xs text-red-600 mt-1">
                            Ошибка: {integration.error}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {integration.status === 'connected' && (
                        <CheckCircle2 className="h-5 w-5 text-green-600" />
                      )}
                      {integration.status === 'error' && (
                        <XCircle className="h-5 w-5 text-red-600" />
                      )}
                      {integration.status === 'checking' && (
                        <Loader2 className="h-5 w-5 text-blue-600 animate-spin" />
                      )}
                      {integration.status === 'pending' && (
                        <AlertCircle className="h-5 w-5 text-gray-400" />
                      )}
                      <Button variant="ghost" size="sm">
                        Настроить
                      </Button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Информационные сообщения */}
              {integrations.filter(i => i.required && i.status !== 'connected').length > 0 && (
                <Alert className="border-orange-200 bg-orange-50">
                  <AlertCircle className="h-4 w-4 text-orange-600" />
                  <AlertDescription>
                    <strong>Внимание:</strong> Некоторые обязательные интеграции не настроены. 
                    Это может повлиять на работу платформы.
                  </AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>

          {/* Детальные настройки интеграций */}
          <Card>
            <CardHeader>
              <CardTitle>Настройки интеграций</CardTitle>
              <CardDescription>Подключите и настройте внешние сервисы</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-6 md:grid-cols-2">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-4">
                    <div className="flex items-center gap-3">
                        <img src="https://www.vectorlogo.zone/logos/sendgrid/sendgrid-icon.svg" alt="SendGrid Logo" className="h-8 w-8"/>
                        <CardTitle className="text-xl">SendGrid</CardTitle>
                    </div>
                    <Badge variant="default" className="bg-success text-success-foreground">Подключено</Badge>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-muted-foreground">Интеграция для отправки email-рассылок.</p>
                   <div className="grid gap-2">
                    <Label htmlFor="sendgrid-key">API Key</Label>
                    <Input id="sendgrid-key" type="password" defaultValue="SG.XXXXXXXXXXXXXXXX" />
                  </div>
                  <Button variant="destructive">Отключить</Button>
                  <Accordion type="single" collapsible className="w-full">
                    <AccordionItem value="item-1">
                      <AccordionTrigger>Вебхуки</AccordionTrigger>
                      <AccordionContent>
                        <div className="space-y-2 text-sm">
                          <div className="flex items-center gap-2"><GitPullRequest className="h-4 w-4 text-primary"/><span>email.delivered</span></div>
                          <div className="flex items-center gap-2"><GitPullRequest className="h-4 w-4 text-primary"/><span>email.open</span></div>
                          <div className="flex items-center gap-2"><GitPullRequest className="h-4 w-4 text-primary"/><span>email.click</span></div>
                          <div className="flex items-center gap-2"><GitPullRequest className="h-4 w-4 text-primary"/><span>email.bounce</span></div>
                          <div className="flex items-center gap-2"><GitPullRequest className="h-4 w-4 text-primary"/><span>email.spamreport</span></div>
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                </CardContent>
              </Card>
               <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-4">
                    <div className="flex items-center gap-3">
                         <img src="https://www.vectorlogo.zone/logos/twilio/twilio-icon.svg" alt="Twilio Logo" className="h-8 w-8"/>
                        <CardTitle className="text-xl">Twilio</CardTitle>
                    </div>
                     <Badge variant="secondary">Не подключено</Badge>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-muted-foreground">Интеграция для отправки SMS-сообщений.</p>
                  <div className="grid gap-2">
                    <Label htmlFor="twilio-sid">Account SID</Label>
                    <Input id="twilio-sid" placeholder="ACxxxxxxxxxxxxxxxx" />
                  </div>
                   <div className="grid gap-2">
                    <Label htmlFor="twilio-token">Auth Token</Label>
                    <Input id="twilio-token" type="password" placeholder="••••••••••••••••" />
                  </div>
                  <Button>Подключить</Button>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-4">
                    <div className="flex items-center gap-3">
                         <img src="https://www.vectorlogo.zone/logos/sendpulse/sendpulse-icon.svg" alt="SendPulse Logo" className="h-8 w-8"/>
                        <CardTitle className="text-xl">SendPulse</CardTitle>
                    </div>
                     <Badge variant="secondary">Не подключено</Badge>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-muted-foreground">Интеграция для отправки Push-уведомлений.</p>
                  <div className="grid gap-2">
                    <Label htmlFor="sendpulse-id">User ID</Label>
                    <Input id="sendpulse-id" placeholder="User ID" />
                  </div>
                   <div className="grid gap-2">
                    <Label htmlFor="sendpulse-secret">REST API ID</Label>
                    <Input id="sendpulse-secret" type="password" placeholder="••••••••••••••••" />
                  </div>
                  <Button>Подключить</Button>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-4">
                    <div className="flex items-center gap-3">
                         <GitBranch className="h-8 w-8 text-primary"/>
                        <CardTitle className="text-xl">Custom Webhook</CardTitle>
                    </div>
                     <Badge variant="secondary">Не подключено</Badge>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-muted-foreground">Получение кастомных событий из вашей системы.</p>
                  <div className="grid gap-2">
                    <Label htmlFor="webhook-url">Webhook URL</Label>
                    <Input id="webhook-url" placeholder="https://yourapi.com/webhook" />
                  </div>
                   <div className="grid gap-2">
                    <Label htmlFor="webhook-token">Secret Token</Label>
                    <Input id="webhook-token" type="password" placeholder="••••••••••••••••" />
                  </div>
                  <Button>Подключить</Button>
                </CardContent>
              </Card>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="webhooks" className="space-y-6">
          {/* Webhook логи */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Webhook логи</CardTitle>
                  <CardDescription>
                    История всех webhook событий и API вызовов
                  </CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => setShowLogs(!showLogs)}
                  >
                    {showLogs ? (
                      <><EyeOff className="mr-2 h-4 w-4" />Скрыть детали</>
                    ) : (
                      <><Eye className="mr-2 h-4 w-4" />Показать детали</>
                    )}
                  </Button>
                  <Button variant="outline" size="sm">
                    <RefreshCw className="mr-2 h-4 w-4" />
                    Обновить
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {webhookLogs.map((log) => (
                  <div 
                    key={log.id} 
                    className={cn(
                      "flex items-start justify-between p-3 rounded-lg border",
                      log.status === 'success' && "border-green-200 bg-green-50/30",
                      log.status === 'error' && "border-red-200 bg-red-50/30",
                      log.status === 'warning' && "border-yellow-200 bg-yellow-50/30"
                    )}
                  >
                    <div className="flex items-start gap-3">
                      <div className={cn(
                        "p-1.5 rounded",
                        log.status === 'success' && "bg-green-100",
                        log.status === 'error' && "bg-red-100",
                        log.status === 'warning' && "bg-yellow-100"
                      )}>
                        {log.status === 'success' && <CheckCircle2 className="h-4 w-4 text-green-600" />}
                        {log.status === 'error' && <XCircle className="h-4 w-4 text-red-600" />}
                        {log.status === 'warning' && <AlertCircle className="h-4 w-4 text-yellow-600" />}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-semibold text-sm">{log.service}</span>
                          <Badge variant="outline" className="text-xs">{log.event}</Badge>
                          <span className="text-xs text-muted-foreground">
                            {log.timestamp.toLocaleString('ru-RU')}
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground">{log.message}</p>
                        {showLogs && log.payload && (
                          <pre className="mt-2 p-2 bg-muted rounded text-xs overflow-x-auto">
                            {JSON.stringify(log.payload, null, 2)}
                          </pre>
                        )}
                      </div>
                    </div>
                    <Button variant="ghost" size="sm">
                      <ExternalLink className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
              
              <div className="flex items-center justify-between mt-4 pt-4 border-t">
                <p className="text-sm text-muted-foreground">
                  Показано {webhookLogs.length} последних событий
                </p>
                <Button variant="outline" size="sm">
                  Показать все логи
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Оригинальная таблица логов */}
          <WebhookLogsTable />
        </TabsContent>

        <TabsContent value="variables">
          <Card>
            <CardHeader>
              <CardTitle>Системные переменные</CardTitle>
              <CardDescription>Управление глобальными переменными для использования в сценариях.</CardDescription>
            </CardHeader>
            <CardContent>
                <p>Здесь будет интерфейс для создания и редактирования переменных (например, ссылки, промокоды).</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle>Настройки уведомлений</CardTitle>
              <CardDescription>Выберите, какие уведомления вы хотите получать от системы.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between rounded-lg border p-4">
                <div>
                    <Label htmlFor="risk-alerts">Оповещения о рисках</Label>
                    <p className="text-sm text-muted-foreground">Получать уведомления о критических ошибках и падении метрик.</p>
                </div>
                <Switch id="risk-alerts" defaultChecked />
              </div>
               <div className="flex items-center justify-between rounded-lg border p-4">
                <div>
                    <Label htmlFor="report-ready">Готовность отчётов</Label>
                    <p className="text-sm text-muted-foreground">Получать уведомления, когда scheduled-отчёт готов.</p>
                </div>
                <Switch id="report-ready" defaultChecked/>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

      </Tabs>
    </div>
  );
}
