"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Brain,
  DollarSign,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  Sparkles,
  Zap,
  CreditCard,
  PiggyBank,
  Activity,
  Package,
  Users,
  BarChart3,
  Info,
  ChevronUp,
  ChevronDown,
  Shield,
  Settings,
  FileText
} from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

// Типы для отслеживания стоимости
interface ProjectUsage {
  projectId: string;
  projectName: string;
  tokensUsed: number;
  cost: number;
  requests: number;
  lastUsed: Date;
  features: {
    recommendations: number;
    insights: number;
    predictions: number;
    contentGeneration: number;
  };
}

interface AIModel {
  name: string;
  costPer1kTokens: number;
  tokensUsed: number;
  requests: number;
}

export function AICostTracking() {
  const [economyMode, setEconomyMode] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [pendingAction, setPendingAction] = useState<any>(null);
  const [selectedPeriod, setSelectedPeriod] = useState<'day' | 'week' | 'month'>('month');

  // Моковые данные по использованию
  const projectsUsage: ProjectUsage[] = [
    {
      projectId: '1',
      projectName: 'CasinoX',
      tokensUsed: 2450000,
      cost: 24.50,
      requests: 3420,
      lastUsed: new Date(),
      features: {
        recommendations: 850,
        insights: 1200,
        predictions: 670,
        contentGeneration: 700
      }
    },
    {
      projectId: '2',
      projectName: 'LuckyWheel',
      tokensUsed: 1820000,
      cost: 18.20,
      requests: 2150,
      lastUsed: new Date(Date.now() - 3600000),
      features: {
        recommendations: 420,
        insights: 890,
        predictions: 450,
        contentGeneration: 390
      }
    },
    {
      projectId: '3',
      projectName: 'GoldenPlay',
      tokensUsed: 980000,
      cost: 9.80,
      requests: 1280,
      lastUsed: new Date(Date.now() - 7200000),
      features: {
        recommendations: 320,
        insights: 450,
        predictions: 280,
        contentGeneration: 230
      }
    },
    {
      projectId: '4',
      projectName: 'AIGAMING.BOT',
      tokensUsed: 3200000,
      cost: 32.00,
      requests: 4100,
      lastUsed: new Date(),
      features: {
        recommendations: 1100,
        insights: 1500,
        predictions: 800,
        contentGeneration: 700
      }
    }
  ];

  const models: AIModel[] = [
    {
      name: 'GPT-4 Turbo',
      costPer1kTokens: 0.01,
      tokensUsed: 5200000,
      requests: 6500
    },
    {
      name: 'GPT-3.5 Turbo',
      costPer1kTokens: 0.002,
      tokensUsed: 3250000,
      requests: 4450
    },
    {
      name: 'Claude 3',
      costPer1kTokens: 0.015,
      tokensUsed: 0,
      requests: 0
    }
  ];

  // Расчет общих метрик
  const totalTokens = projectsUsage.reduce((sum, p) => sum + p.tokensUsed, 0);
  const totalCost = projectsUsage.reduce((sum, p) => sum + p.cost, 0);
  const totalRequests = projectsUsage.reduce((sum, p) => sum + p.requests, 0);
  
  // Прогноз на месяц
  const monthlyProjection = totalCost * 30; // Упрощенный прогноз
  const budgetLimit = 150; // Лимит бюджета в евро
  const budgetUsagePercent = (totalCost / budgetLimit) * 100;

  const handleEconomyModeToggle = (checked: boolean) => {
    setEconomyMode(checked);
    if (checked) {
      // Сохраняем в localStorage
      localStorage.setItem('aiEconomyMode', 'true');
    } else {
      localStorage.removeItem('aiEconomyMode');
    }
  };

  const handleAIAction = (action: any) => {
    if (economyMode) {
      setPendingAction(action);
      setShowConfirmDialog(true);
    } else {
      // Выполняем действие без подтверждения
      executeAction(action);
    }
  };

  const executeAction = (action: any) => {
    console.log('Executing AI action:', action);
    // Здесь будет логика выполнения ИИ действия
  };

  return (
    <div className="space-y-6">
      {/* Заголовок с переключателем режима экономии */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Brain className="h-5 w-5 text-primary" />
              </div>
              <div>
                <CardTitle>Обслуживание и стоимость ИИ</CardTitle>
                <CardDescription>
                  Мониторинг использования токенов и затрат по проектам
                </CardDescription>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Switch
                  id="economy-mode"
                  checked={economyMode}
                  onCheckedChange={handleEconomyModeToggle}
                />
                <Label htmlFor="economy-mode" className="cursor-pointer">
                  <div className="flex items-center gap-2">
                    {economyMode ? (
                      <>
                        <PiggyBank className="h-4 w-4 text-green-600" />
                        <span className="text-sm font-medium text-green-600">Режим экономии</span>
                      </>
                    ) : (
                      <>
                        <Zap className="h-4 w-4 text-blue-600" />
                        <span className="text-sm font-medium">Базовый режим</span>
                      </>
                    )}
                  </div>
                </Label>
              </div>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Алерт о режиме экономии */}
      {economyMode && (
        <Alert className="border-green-200 bg-green-50">
          <PiggyBank className="h-4 w-4 text-green-600" />
          <AlertDescription className="text-green-800">
            <strong>Режим экономии активен</strong> — все ИИ-рекомендации будут требовать подтверждения перед внедрением для контроля расходов.
          </AlertDescription>
        </Alert>
      )}

      {/* Общая статистика */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Общие расходы
              </CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">€{totalCost.toFixed(2)}</div>
            <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
              <TrendingUp className="h-3 w-3 text-red-500" />
              <span className="text-red-500">+12.5%</span>
              <span>vs прошлый месяц</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Токены использовано
              </CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{(totalTokens / 1000000).toFixed(2)}M</div>
            <div className="text-xs text-muted-foreground mt-1">
              {totalRequests.toLocaleString()} запросов
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Прогноз на месяц
              </CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">€{monthlyProjection.toFixed(0)}</div>
            <div className="text-xs text-muted-foreground mt-1">
              При текущем темпе
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Бюджет использован
              </CardTitle>
              <CreditCard className="h-4 w-4 text-muted-foreground" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{budgetUsagePercent.toFixed(1)}%</div>
            <Progress value={budgetUsagePercent} className="h-1 mt-2" />
            <div className="text-xs text-muted-foreground mt-1">
              €{totalCost.toFixed(0)} / €{budgetLimit}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Вкладки с детальной информацией */}
      <Tabs defaultValue="projects" className="space-y-4">
        <TabsList>
          <TabsTrigger value="projects">По проектам</TabsTrigger>
          <TabsTrigger value="models">По моделям</TabsTrigger>
          <TabsTrigger value="features">По функциям</TabsTrigger>
        </TabsList>

        <TabsContent value="projects" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Использование по проектам клиентов</CardTitle>
              <CardDescription>
                Детальная статистика расходов по каждому проекту
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {projectsUsage.map((project) => (
                  <div key={project.projectId} className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-primary/10 rounded-lg">
                          <Package className="h-4 w-4 text-primary" />
                        </div>
                        <div>
                          <div className="font-medium">{project.projectName}</div>
                          <div className="text-sm text-muted-foreground">
                            {project.requests.toLocaleString()} запросов
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold">€{project.cost.toFixed(2)}</div>
                        <div className="text-xs text-muted-foreground">
                          {(project.tokensUsed / 1000).toFixed(0)}k токенов
                        </div>
                      </div>
                    </div>
                    
                    {/* Детальная разбивка по функциям */}
                    <div className="grid grid-cols-4 gap-2 pl-11">
                      <div className="text-xs">
                        <div className="text-muted-foreground">Рекомендации</div>
                        <div className="font-medium">{project.features.recommendations}</div>
                      </div>
                      <div className="text-xs">
                        <div className="text-muted-foreground">Инсайты</div>
                        <div className="font-medium">{project.features.insights}</div>
                      </div>
                      <div className="text-xs">
                        <div className="text-muted-foreground">Прогнозы</div>
                        <div className="font-medium">{project.features.predictions}</div>
                      </div>
                      <div className="text-xs">
                        <div className="text-muted-foreground">Генерация</div>
                        <div className="font-medium">{project.features.contentGeneration}</div>
                      </div>
                    </div>
                    
                    <div className="h-px bg-border" />
                  </div>
                ))}
              </div>
              
              {/* Суммарная информация */}
              <div className="mt-4 pt-4 border-t">
                <div className="flex items-center justify-between">
                  <div className="text-sm font-medium">Всего по всем проектам</div>
                  <div className="text-right">
                    <div className="font-bold text-lg">€{totalCost.toFixed(2)}</div>
                    <div className="text-xs text-muted-foreground">
                      {(totalTokens / 1000000).toFixed(2)}M токенов
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="models" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Использование по моделям ИИ</CardTitle>
              <CardDescription>
                Распределение токенов и стоимости между разными моделями
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {models.map((model) => (
                  <div key={model.name} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium">{model.name}</div>
                        <div className="text-sm text-muted-foreground">
                          ${model.costPer1kTokens} за 1k токенов
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold">
                          €{(model.tokensUsed / 1000 * model.costPer1kTokens).toFixed(2)}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {model.requests.toLocaleString()} запросов
                        </div>
                      </div>
                    </div>
                    <Progress 
                      value={model.tokensUsed / Math.max(...models.map(m => m.tokensUsed)) * 100} 
                      className="h-2"
                    />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="features" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Использование по функциям</CardTitle>
              <CardDescription>
                Какие ИИ-функции потребляют больше всего ресурсов
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                    <div className="flex items-center gap-2">
                      <Sparkles className="h-4 w-4 text-purple-600" />
                      <span className="font-medium">ИИ Рекомендации</span>
                    </div>
                    <div className="text-right">
                      <div className="font-bold">€32.40</div>
                      <div className="text-xs text-muted-foreground">2,690 запросов</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                    <div className="flex items-center gap-2">
                      <Brain className="h-4 w-4 text-blue-600" />
                      <span className="font-medium">Аналитические инсайты</span>
                    </div>
                    <div className="text-right">
                      <div className="font-bold">€28.60</div>
                      <div className="text-xs text-muted-foreground">4,040 запросов</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                    <div className="flex items-center gap-2">
                      <TrendingUp className="h-4 w-4 text-green-600" />
                      <span className="font-medium">Прогнозирование</span>
                    </div>
                    <div className="text-right">
                      <div className="font-bold">€18.20</div>
                      <div className="text-xs text-muted-foreground">2,200 запросов</div>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4 text-orange-600" />
                      <span className="font-medium">Генерация контента</span>
                    </div>
                    <div className="text-right">
                      <div className="font-bold">€15.30</div>
                      <div className="text-xs text-muted-foreground">2,020 запросов</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-indigo-600" />
                      <span className="font-medium">Сегментация</span>
                    </div>
                    <div className="text-right">
                      <div className="font-bold">€12.80</div>
                      <div className="text-xs text-muted-foreground">1,450 запросов</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                    <div className="flex items-center gap-2">
                      <Shield className="h-4 w-4 text-red-600" />
                      <span className="font-medium">Детекция рисков</span>
                    </div>
                    <div className="text-right">
                      <div className="font-bold">€8.90</div>
                      <div className="text-xs text-muted-foreground">980 запросов</div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Рекомендации по оптимизации */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-purple-600" />
            <CardTitle className="text-base">Рекомендации по оптимизации расходов</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <div className="p-1 bg-green-100 rounded">
                <ChevronDown className="h-4 w-4 text-green-600" />
              </div>
              <div className="flex-1">
                <div className="font-medium text-sm">Используйте кэширование для повторяющихся запросов</div>
                <div className="text-sm text-muted-foreground">
                  Проект "CasinoX" делает 30% идентичных запросов. Потенциальная экономия: €7.35/мес
                </div>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <div className="p-1 bg-blue-100 rounded">
                <Settings className="h-4 w-4 text-blue-600" />
              </div>
              <div className="flex-1">
                <div className="font-medium text-sm">Переключите простые задачи на GPT-3.5</div>
                <div className="text-sm text-muted-foreground">
                  Генерация базового контента не требует GPT-4. Потенциальная экономия: €12.20/мес
                </div>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <div className="p-1 bg-amber-100 rounded">
                <AlertTriangle className="h-4 w-4 text-amber-600" />
              </div>
              <div className="flex-1">
                <div className="font-medium text-sm">Объедините мелкие запросы в батчи</div>
                <div className="text-sm text-muted-foreground">
                  Группировка запросов снизит накладные расходы. Потенциальная экономия: €5.60/мес
                </div>
              </div>
            </div>
          </div>
          
          <div className="mt-4 pt-4 border-t">
            <div className="flex items-center justify-between">
              <div className="text-sm">
                <span className="font-medium">Общая потенциальная экономия:</span>
                <span className="ml-2 text-green-600 font-bold">€25.15/мес</span>
              </div>
              <Button size="sm" variant="outline">
                Применить рекомендации
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Диалог подтверждения в режиме экономии */}
      <Dialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <PiggyBank className="h-5 w-5 text-green-600" />
              Подтверждение использования ИИ
            </DialogTitle>
            <DialogDescription>
              Режим экономии активен. Это действие потребует использования ИИ-ресурсов.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="p-3 bg-muted rounded-lg space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span>Примерная стоимость:</span>
                <span className="font-bold">€0.12</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span>Токенов:</span>
                <span className="font-bold">~12,000</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span>Модель:</span>
                <span className="font-bold">GPT-4 Turbo</span>
              </div>
            </div>
            
            <Alert className="border-amber-200 bg-amber-50">
              <Info className="h-4 w-4 text-amber-600" />
              <AlertDescription className="text-amber-800 text-sm">
                Вы можете отключить режим экономии в настройках для автоматического выполнения ИИ-операций.
              </AlertDescription>
            </Alert>
          </div>
          
          <DialogFooter className="flex gap-2">
            <Button variant="outline" onClick={() => setShowConfirmDialog(false)}>
              Отмена
            </Button>
            <Button 
              onClick={() => {
                if (pendingAction) {
                  executeAction(pendingAction);
                }
                setShowConfirmDialog(false);
                setPendingAction(null);
              }}
              className="bg-green-600 hover:bg-green-700"
            >
              Подтвердить и выполнить
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}