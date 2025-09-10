"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { 
  CheckCircle2,
  XCircle,
  Loader2,
  Mail,
  Shield,
  Webhook,
  Target,
  Settings,
  AlertCircle,
  ChevronRight,
  ArrowRight,
  Server,
  Key,
  Link2,
  BarChart3,
  TrendingUp,
  Users,
  DollarSign,
  Activity,
  Clock,
  FileText,
  Eye,
  RefreshCw,
  CheckSquare
} from "lucide-react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

// Типы для интеграций
interface IntegrationStatus {
  id: string;
  name: string;
  description: string;
  status: 'pending' | 'checking' | 'success' | 'error';
  message?: string;
  icon: React.ElementType;
  required: boolean;
}

// Типы для вебхук логов
interface WebhookLog {
  id: string;
  timestamp: Date;
  service: string;
  event: string;
  status: 'success' | 'error';
  message: string;
  payload?: any;
}

// Типы для метрик
interface MetricGoal {
  id: string;
  name: string;
  description: string;
  value: number;
  unit: string;
  category: string;
  icon: React.ElementType;
}

export default function OnboardingPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [isChecking, setIsChecking] = useState(false);
  const [showLogs, setShowLogs] = useState(false);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  
  // Состояния интеграций
  const [integrations, setIntegrations] = useState<IntegrationStatus[]>([
    {
      id: 'email',
      name: 'Email рассыльщик',
      description: 'Подключение к сервису email рассылок (SendGrid, Mailgun)',
      status: 'pending',
      icon: Mail,
      required: true
    },
    {
      id: 'casino_admin',
      name: 'Админка казино',
      description: 'Интеграция с административной панелью казино',
      status: 'pending',
      icon: Shield,
      required: true
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
      status: 'pending',
      icon: Webhook,
      required: false
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
    }
  ]);

  // Метрики
  const [metricGoals, setMetricGoals] = useState<Record<string, number>>({
    retention_rate: 70,
    churn_rate: 5,
    ltv: 500,
    arpu: 45,
    conversion_rate: 3.5,
    daily_active_users: 10000,
    monthly_revenue: 1500000,
    average_session_time: 35
  });

  const metricsData: MetricGoal[] = [
    {
      id: 'retention_rate',
      name: 'Retention Rate',
      description: 'Целевой процент удержания игроков',
      value: metricGoals.retention_rate || 70,
      unit: '%',
      category: 'retention',
      icon: Users
    },
    {
      id: 'churn_rate',
      name: 'Churn Rate',
      description: 'Максимальный допустимый отток',
      value: metricGoals.churn_rate || 5,
      unit: '%',
      category: 'retention',
      icon: TrendingUp
    },
    {
      id: 'ltv',
      name: 'LTV (Lifetime Value)',
      description: 'Целевая пожизненная ценность игрока',
      value: metricGoals.ltv || 500,
      unit: '€',
      category: 'revenue',
      icon: DollarSign
    },
    {
      id: 'arpu',
      name: 'ARPU',
      description: 'Средний доход на пользователя',
      value: metricGoals.arpu || 45,
      unit: '€',
      category: 'revenue',
      icon: BarChart3
    },
    {
      id: 'conversion_rate',
      name: 'Conversion Rate',
      description: 'Целевая конверсия в депозит',
      value: metricGoals.conversion_rate || 3.5,
      unit: '%',
      category: 'conversion',
      icon: Activity
    },
    {
      id: 'daily_active_users',
      name: 'DAU',
      description: 'Целевое количество активных игроков в день',
      value: metricGoals.daily_active_users || 10000,
      unit: '',
      category: 'engagement',
      icon: Users
    },
    {
      id: 'monthly_revenue',
      name: 'Monthly Revenue',
      description: 'Целевая месячная выручка',
      value: metricGoals.monthly_revenue || 1500000,
      unit: '€',
      category: 'revenue',
      icon: DollarSign
    },
    {
      id: 'average_session_time',
      name: 'Avg Session Time',
      description: 'Целевая длительность сессии',
      value: metricGoals.average_session_time || 35,
      unit: 'min',
      category: 'engagement',
      icon: Clock
    }
  ];

  // Проверка интеграций
  const checkIntegrations = async () => {
    setIsChecking(true);
    
    for (const integration of integrations) {
      // Обновляем статус на "проверка"
      setIntegrations(prev => prev.map(i => 
        i.id === integration.id ? { ...i, status: 'checking' } : i
      ));
      
      // Симуляция проверки
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Случайный результат для демо (в реальности здесь будет API запрос)
      const isSuccess = Math.random() > 0.2;
      
      setIntegrations(prev => prev.map(i => 
        i.id === integration.id 
          ? { 
              ...i, 
              status: isSuccess ? 'success' : 'error',
              message: isSuccess 
                ? 'Подключение успешно установлено' 
                : 'Не удалось подключиться. Проверьте настройки.'
            } 
          : i
      ));
    }
    
    setIsChecking(false);
    
    // Проверяем, все ли обязательные интеграции успешны
    const allRequiredSuccess = integrations
      .filter(i => i.required)
      .every(i => {
        const updated = integrations.find(int => int.id === i.id);
        return updated?.status === 'success';
      });
    
    if (allRequiredSuccess) {
      setCompletedSteps(prev => [...prev, 1]);
    }
  };

  // Сохранение метрик
  const saveMetrics = () => {
    // Сохраняем в localStorage для демо
    localStorage.setItem('metricGoals', JSON.stringify(metricGoals));
    
    // Добавляем лог о сохранении
    const newLog: WebhookLog = {
      id: Date.now().toString(),
      timestamp: new Date(),
      service: 'Settings',
      event: 'metrics.saved',
      status: 'success',
      message: 'Target metrics saved successfully',
      payload: metricGoals
    };
    
    setWebhookLogs(prev => [newLog, ...prev]);
    setCompletedSteps(prev => [...prev, 2]);
    
    // Переход к следующему шагу
    setTimeout(() => {
      setCurrentStep(3);
    }, 1000);
  };

  // Завершение онбординга
  const completeOnboarding = () => {
    localStorage.setItem('onboardingCompleted', 'true');
    router.push('/settings');
  };

  const getStepStatus = (step: number) => {
    if (completedSteps.includes(step)) return 'completed';
    if (currentStep === step) return 'current';
    return 'pending';
  };

  return (
    <div className="container mx-auto py-8 max-w-6xl">
      {/* Заголовок */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <Settings className="h-8 w-8 text-primary" />
          Настройка платформы
        </h1>
        <p className="text-muted-foreground mt-2">
          Пошаговая настройка интеграций и целевых метрик
        </p>
      </div>

      {/* Прогресс */}
      <Card className="mb-8">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Badge variant="outline">Шаг {currentStep} из 3</Badge>
              <span className="text-sm text-muted-foreground">
                {currentStep === 1 && 'Проверка интеграций'}
                {currentStep === 2 && 'Настройка целевых метрик'}
                {currentStep === 3 && 'Готово к работе'}
              </span>
            </div>
            <span className="text-sm font-medium">
              {Math.round((completedSteps.length / 3) * 100)}% завершено
            </span>
          </div>
          <Progress value={(completedSteps.length / 3) * 100} className="h-2" />
          
          {/* Шаги */}
          <p className="text-xs text-muted-foreground text-center mt-4 mb-2">
            Нажмите на любой шаг для навигации
          </p>
          <div className="flex items-center justify-between">
            {[1, 2, 3].map((step) => {
              const status = getStepStatus(step);
              return (
                <div
                  key={step}
                  className={cn(
                    "flex items-center gap-2",
                    step < 3 && "flex-1"
                  )}
                >
                  <button
                    onClick={() => setCurrentStep(step)}
                    className={cn(
                      "w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-colors cursor-pointer hover:opacity-80",
                      status === 'completed' && "bg-green-100 text-green-700",
                      status === 'current' && "bg-primary text-primary-foreground",
                      status === 'pending' && "bg-muted text-muted-foreground hover:bg-muted-foreground/20"
                    )}
                  >
                    {status === 'completed' ? (
                      <CheckCircle2 className="h-5 w-5" />
                    ) : (
                      step
                    )}
                  </button>
                  <button
                    onClick={() => setCurrentStep(step)}
                    className="hidden sm:block cursor-pointer hover:opacity-80"
                  >
                    <div className="text-sm font-medium">
                      {step === 1 && 'Интеграции'}
                      {step === 2 && 'Метрики'}
                      {step === 3 && 'Завершение'}
                    </div>
                  </button>
                  {step < 3 && (
                    <ChevronRight className="h-4 w-4 text-muted-foreground flex-1" />
                  )}
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Контент шагов */}
      {currentStep === 1 && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Проверка интеграций</CardTitle>
              <CardDescription>
                Убедитесь, что все необходимые сервисы подключены и работают корректно
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {integrations.map((integration) => (
                <div
                  key={integration.id}
                  className={cn(
                    "p-4 rounded-lg border",
                    integration.status === 'success' && "bg-green-50 border-green-200",
                    integration.status === 'error' && "bg-red-50 border-red-200",
                    integration.status === 'checking' && "bg-blue-50 border-blue-200",
                    integration.status === 'pending' && "bg-muted"
                  )}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3">
                      <div className={cn(
                        "p-2 rounded-lg",
                        integration.status === 'success' && "bg-green-100",
                        integration.status === 'error' && "bg-red-100",
                        integration.status === 'checking' && "bg-blue-100",
                        integration.status === 'pending' && "bg-background"
                      )}>
                        <integration.icon className="h-5 w-5" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <h4 className="font-semibold">{integration.name}</h4>
                          {integration.required && (
                            <Badge variant="secondary" className="text-xs">
                              Обязательно
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">
                          {integration.description}
                        </p>
                        {integration.message && (
                          <p className={cn(
                            "text-sm mt-2",
                            integration.status === 'success' && "text-green-700",
                            integration.status === 'error' && "text-red-700"
                          )}>
                            {integration.message}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center">
                      {integration.status === 'success' && (
                        <CheckCircle2 className="h-5 w-5 text-green-600" />
                      )}
                      {integration.status === 'error' && (
                        <XCircle className="h-5 w-5 text-red-600" />
                      )}
                      {integration.status === 'checking' && (
                        <Loader2 className="h-5 w-5 text-blue-600 animate-spin" />
                      )}
                      {integration.status === 'pending' && (
                        <AlertCircle className="h-5 w-5 text-muted-foreground" />
                      )}
                    </div>
                  </div>
                </div>
              ))}
              
              <div className="flex items-center justify-between pt-4">
                <Button
                  variant="outline"
                  onClick={() => setShowLogs(true)}
                  className="gap-2"
                >
                  <Eye className="h-4 w-4" />
                  Webhook логи
                </Button>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    onClick={checkIntegrations}
                    disabled={isChecking}
                    className="gap-2"
                  >
                    {isChecking ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <RefreshCw className="h-4 w-4" />
                    )}
                    Проверить снова
                  </Button>
                  <Button
                    onClick={() => setCurrentStep(2)}
                    variant={completedSteps.includes(1) ? "default" : "outline"}
                  >
                    {completedSteps.includes(1) ? (
                      <>
                        Далее
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </>
                    ) : (
                      <>
                        Пропустить
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Инструкции */}
          <div className="space-y-4">
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                <strong>Важно:</strong> Для корректной работы платформы необходимо настроить все обязательные интеграции.
                Вы можете найти инструкции по настройке в разделе "База знаний".
              </AlertDescription>
            </Alert>
            
            {!completedSteps.includes(1) && (
              <Alert className="border-blue-200 bg-blue-50">
                <AlertCircle className="h-4 w-4 text-blue-600" />
                <AlertDescription>
                  <strong>Совет:</strong> Вы можете пропустить этот шаг и вернуться к нему позже через настройки.
                  Однако рекомендуем проверить интеграции сейчас для оптимальной работы платформы.
                </AlertDescription>
              </Alert>
            )}
          </div>
        </div>
      )}

      {currentStep === 2 && (
        <Card>
          <CardHeader>
            <CardTitle>Настройка целевых метрик</CardTitle>
            <CardDescription>
              Установите целевые значения для ключевых метрик вашего бизнеса
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="retention" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="retention">Retention</TabsTrigger>
                <TabsTrigger value="revenue">Revenue</TabsTrigger>
                <TabsTrigger value="engagement">Engagement</TabsTrigger>
                <TabsTrigger value="conversion">Conversion</TabsTrigger>
              </TabsList>
              
              {['retention', 'revenue', 'engagement', 'conversion'].map((category) => (
                <TabsContent key={category} value={category} className="space-y-4">
                  {metricsData
                    .filter(metric => metric.category === category)
                    .map((metric) => (
                      <div key={metric.id} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <Label htmlFor={metric.id} className="flex items-center gap-2">
                            <metric.icon className="h-4 w-4 text-muted-foreground" />
                            {metric.name}
                          </Label>
                          <span className="text-sm text-muted-foreground">
                            {metric.description}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Input
                            id={metric.id}
                            type="number"
                            value={metricGoals[metric.id] || 0}
                            onChange={(e) => setMetricGoals(prev => ({
                              ...prev,
                              [metric.id]: parseFloat(e.target.value) || 0
                            }))}
                            className="flex-1"
                          />
                          <span className="text-sm font-medium w-12">
                            {metric.unit}
                          </span>
                        </div>
                      </div>
                    ))}
                </TabsContent>
              ))}
            </Tabs>
            
            <div className="flex justify-between items-center mt-6 pt-6 border-t">
              <Button
                variant="outline"
                onClick={() => setCurrentStep(1)}
              >
                Назад
              </Button>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={() => setCurrentStep(3)}
                >
                  Пропустить
                </Button>
                <Button onClick={saveMetrics} className="gap-2">
                  <CheckSquare className="h-4 w-4" />
                  Сохранить метрики
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {currentStep === 3 && (
        <Card>
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 p-4 bg-green-100 rounded-full w-fit">
              <CheckCircle2 className="h-12 w-12 text-green-600" />
            </div>
            <CardTitle className="text-2xl">Настройка завершена!</CardTitle>
            <CardDescription className="text-base">
              Платформа готова к работе. Все интеграции настроены и целевые метрики установлены.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2">
              <Card className="border-green-200 bg-green-50/50">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-600" />
                    Интеграции настроены
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Все необходимые сервисы подключены и работают корректно
                  </p>
                </CardContent>
              </Card>
              
              <Card className="border-blue-200 bg-blue-50/50">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base flex items-center gap-2">
                    <Target className="h-4 w-4 text-blue-600" />
                    Метрики установлены
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Целевые показатели сохранены и доступны в настройках
                  </p>
                </CardContent>
              </Card>
            </div>
            
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Вы можете изменить настройки интеграций и целевые метрики в любое время через раздел "Настройки".
                История всех изменений и webhook событий доступна там же.
              </AlertDescription>
            </Alert>
            
            <div className="flex items-center justify-between pt-4 border-t">
              <Button
                variant="ghost"
                onClick={() => setCurrentStep(2)}
                className="gap-2"
              >
                Вернуться к настройкам
              </Button>
              <div className="flex gap-4">
                <Button variant="outline" onClick={() => router.push('/')}>
                  На главную
                </Button>
                <Button onClick={completeOnboarding} className="gap-2">
                  Перейти к настройкам
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Диалог с логами */}
      <Dialog open={showLogs} onOpenChange={setShowLogs}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Webhook логи</DialogTitle>
            <DialogDescription>
              История событий от подключенных сервисов
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-2 mt-4">
            {webhookLogs.map((log) => (
              <div
                key={log.id}
                className={cn(
                  "p-3 rounded-lg border text-sm",
                  log.status === 'success' ? "bg-green-50 border-green-200" : "bg-red-50 border-red-200"
                )}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <Badge variant={log.status === 'success' ? 'default' : 'destructive'}>
                        {log.service}
                      </Badge>
                      <span className="font-mono text-xs">{log.event}</span>
                      <span className="text-xs text-muted-foreground">
                        {log.timestamp.toLocaleTimeString()}
                      </span>
                    </div>
                    <p className="text-sm">{log.message}</p>
                    {log.payload && (
                      <details className="mt-2">
                        <summary className="cursor-pointer text-xs text-muted-foreground">
                          Payload
                        </summary>
                        <pre className="mt-1 p-2 bg-background rounded text-xs overflow-x-auto">
                          {JSON.stringify(log.payload, null, 2)}
                        </pre>
                      </details>
                    )}
                  </div>
                  <div>
                    {log.status === 'success' ? (
                      <CheckCircle2 className="h-4 w-4 text-green-600" />
                    ) : (
                      <XCircle className="h-4 w-4 text-red-600" />
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}