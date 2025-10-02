"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { 
  Gift, TrendingUp, Calculator, AlertTriangle, Lightbulb, 
  DollarSign, Target, Users, Percent, BarChart3, 
  Plus, Settings, Brain, Zap, Trophy, ChevronRight,
  CircleDollarSign, RotateCw, Timer, UserCheck,
  Lock, Unlock, Star, Flame, Info
} from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

// Типы бонусов
type BonusType = 'deposit' | 'no_deposit' | 'cashback' | 'freespins' | 'reload' | 'vip' | 'tournament';

// Интерфейс для метрик бонусов
interface BonusMetric {
  name: string;
  value: string | number;
  change?: number;
  status?: 'success' | 'warning' | 'danger';
  description?: string;
  icon?: React.ReactNode;
}

// Интерфейс для создания бонуса
interface BonusCreation {
  name: string;
  type: BonusType;
  amount: number;
  amountType: 'percentage' | 'fixed';
  wageringRequirement: number;
  maxBet: number;
  minDeposit: number;
  maxWinnings: number;
  validityDays: number;
  games: string[];
  segments: string[];
  autoActivate: boolean;
  stackable: boolean;
}

export default function BonusesPage() {
  const [selectedBonus, setSelectedBonus] = useState<string | null>(null);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [newBonus, setNewBonus] = useState<BonusCreation>({
    name: '',
    type: 'deposit',
    amount: 100,
    amountType: 'percentage',
    wageringRequirement: 30,
    maxBet: 10,
    minDeposit: 20,
    maxWinnings: 1000,
    validityDays: 7,
    games: [],
    segments: [],
    autoActivate: false,
    stackable: false
  });

  // Ключевые метрики бонусов
  const keyMetrics: BonusMetric[] = [
    {
      name: 'Средний Wagering',
      value: '32.5x',
      change: -2.3,
      status: 'success',
      description: 'Оптимальный уровень для конверсии',
      icon: <RotateCw className="h-4 w-4" />
    },
    {
      name: 'Конверсия в депозит',
      value: '18.5%',
      change: 3.2,
      status: 'success',
      description: 'Процент игроков, сделавших депозит после бонуса',
      icon: <CircleDollarSign className="h-4 w-4" />
    },
    {
      name: 'Bonus Abuse Rate',
      value: '2.3%',
      change: -0.5,
      status: 'success',
      description: 'Процент злоупотреблений бонусами',
      icon: <AlertTriangle className="h-4 w-4" />
    },
    {
      name: 'ROI бонусов',
      value: '285%',
      change: 15,
      status: 'success',
      description: 'Возврат инвестиций от бонусной программы',
      icon: <TrendingUp className="h-4 w-4" />
    },
    {
      name: 'Completion Rate',
      value: '42.3%',
      change: 5.1,
      status: 'warning',
      description: 'Процент отыгранных бонусов',
      icon: <UserCheck className="h-4 w-4" />
    },
    {
      name: 'Средний Hold',
      value: '€125',
      change: 8,
      status: 'success',
      description: 'Средний остаток после отыгрыша',
      icon: <Lock className="h-4 w-4" />
    }
  ];

  // ИИ рекомендации по математике бонусов
  const aiRecommendations = [
    {
      title: 'Оптимизация Wagering Requirements',
      priority: 'high',
      impact: '+€45k/месяц',
      description: 'Снижение wagering с 40x до 30x для депозитных бонусов увеличит completion rate на 18%',
      metrics: {
        currentWagering: '40x',
        recommendedWagering: '30x',
        expectedCompletionIncrease: '18%',
        expectedRevenueImpact: '€45,000'
      },
      action: 'Применить рекомендацию'
    },
    {
      title: 'Сегментированные кэшбэк-офферы',
      priority: 'medium',
      impact: '+€28k/месяц',
      description: 'Внедрение динамического кэшбэка 5-15% в зависимости от VIP уровня',
      metrics: {
        segments: ['Regular: 5%', 'VIP: 10%', 'Premium: 15%'],
        expectedRetention: '+12%',
        expectedLTV: '+€85'
      },
      action: 'Настроить кэшбэк'
    },
    {
      title: 'Временные ограничения бонусов',
      priority: 'high',
      impact: '+€32k/месяц',
      description: 'Сокращение срока действия с 30 до 7 дней увеличивает urgency и активность',
      metrics: {
        currentValidity: '30 дней',
        recommendedValidity: '7 дней',
        expectedActivityIncrease: '25%',
        expectedDepositIncrease: '15%'
      },
      action: 'Обновить сроки'
    }
  ];

  // Активные бонусы
  const activeBonuses = [
    {
      id: '1',
      name: 'Welcome Package 200%',
      type: 'deposit' as BonusType,
      status: 'active',
      users: 1234,
      deposited: '€125,450',
      wagered: '€3,245,000',
      roi: 320,
      completionRate: 45
    },
    {
      id: '2',
      name: 'Weekend Reload 50%',
      type: 'reload' as BonusType,
      status: 'active',
      users: 567,
      deposited: '€45,230',
      wagered: '€890,000',
      roi: 180,
      completionRate: 62
    },
    {
      id: '3',
      name: 'VIP Cashback 10%',
      type: 'cashback' as BonusType,
      status: 'active',
      users: 234,
      deposited: '€89,000',
      wagered: '€450,000',
      roi: 425,
      completionRate: 78
    }
  ];

  // Функция для расчета оптимального wagering
  const calculateOptimalWagering = (bonusAmount: number, bonusType: BonusType): number => {
    const baseWagering = {
      deposit: 30,
      no_deposit: 50,
      cashback: 10,
      freespins: 40,
      reload: 25,
      vip: 20,
      tournament: 0
    };
    
    const wageringMultiplier = baseWagering[bonusType];
    const adjustedWagering = bonusAmount > 100 
      ? wageringMultiplier * 0.9 
      : wageringMultiplier;
    
    return Math.round(adjustedWagering);
  };

  return (
    <div className="flex flex-col gap-6 p-4 md:p-6 lg:p-8">
      {/* Заголовок */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
            <Gift className="h-6 w-6 text-primary" />
            Бонусы и офферы
          </h1>
          <p className="text-muted-foreground">
            Управление бонусной системой, математика офферов и оптимизация wagering requirements
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Settings className="h-4 w-4 mr-2" />
            Настройки
          </Button>
          <Button onClick={() => setShowCreateDialog(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Создать бонус
          </Button>
        </div>
      </div>

      {/* Ключевые метрики */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-6">
        {keyMetrics.map((metric, index) => (
          <Card key={index}>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-muted-foreground">
                  {metric.name}
                </span>
                {metric.icon}
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-baseline justify-between">
                <span className="text-2xl font-bold">{metric.value}</span>
                {metric.change && (
                  <Badge 
                    variant={metric.change > 0 ? 'default' : 'destructive'}
                    className="text-xs"
                  >
                    {metric.change > 0 ? '+' : ''}{metric.change}%
                  </Badge>
                )}
              </div>
              {metric.description && (
                <p className="text-xs text-muted-foreground mt-1">
                  {metric.description}
                </p>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* ИИ Рекомендации */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5 text-primary" />
            ИИ-рекомендации по оптимизации бонусов
          </CardTitle>
          <CardDescription>
            Математический анализ и оптимизация параметров бонусной системы
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {aiRecommendations.map((rec, index) => (
              <Alert key={index} className="relative">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Lightbulb className="h-4 w-4 text-yellow-500" />
                      <AlertTitle className="text-base font-semibold">
                        {rec.title}
                      </AlertTitle>
                      <Badge 
                        variant={rec.priority === 'high' ? 'destructive' : 'secondary'}
                        className="text-xs"
                      >
                        {rec.priority === 'high' ? 'Высокий приоритет' : 'Средний приоритет'}
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        {rec.impact}
                      </Badge>
                    </div>
                    <AlertDescription className="text-sm">
                      {rec.description}
                    </AlertDescription>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-3">
                      {Object.entries(rec.metrics).map(([key, value]) => (
                        <div key={key} className="space-y-1">
                          <p className="text-xs text-muted-foreground capitalize">
                            {key.replace(/([A-Z])/g, ' $1').toLowerCase()}
                          </p>
                          <p className="text-sm font-medium">
                            {Array.isArray(value) ? (
                              <div className="space-y-1">
                                {value.map((v, i) => (
                                  <div key={i} className="text-xs">{v}</div>
                                ))}
                              </div>
                            ) : value}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                  <Button size="sm" className="ml-4">
                    <Zap className="h-4 w-4 mr-1" />
                    {rec.action}
                  </Button>
                </div>
              </Alert>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Табы с контентом */}
      <Tabs defaultValue="active" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="active">Активные бонусы</TabsTrigger>
          <TabsTrigger value="calculator">Калькулятор Wagering</TabsTrigger>
          <TabsTrigger value="analytics">Аналитика</TabsTrigger>
          <TabsTrigger value="abuse">Anti-Abuse</TabsTrigger>
        </TabsList>

        <TabsContent value="active" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Активные бонусные кампании</CardTitle>
              <CardDescription>
                Мониторинг эффективности текущих бонусов
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {activeBonuses.map((bonus) => (
                  <div 
                    key={bonus.id}
                    className="p-4 border rounded-lg hover:bg-accent/50 transition-colors cursor-pointer"
                    onClick={() => setSelectedBonus(bonus.id)}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className={cn(
                          "p-2 rounded-lg",
                          bonus.type === 'deposit' && "bg-blue-100 text-blue-600",
                          bonus.type === 'reload' && "bg-green-100 text-green-600",
                          bonus.type === 'cashback' && "bg-purple-100 text-purple-600"
                        )}>
                          <Gift className="h-5 w-5" />
                        </div>
                        <div>
                          <h4 className="font-semibold">{bonus.name}</h4>
                          <p className="text-sm text-muted-foreground">
                            Тип: {bonus.type} • Статус: {bonus.status}
                          </p>
                        </div>
                      </div>
                      <ChevronRight className="h-5 w-5 text-muted-foreground" />
                    </div>
                    
                    <div className="grid grid-cols-5 gap-4">
                      <div>
                        <p className="text-xs text-muted-foreground">Пользователи</p>
                        <p className="text-lg font-semibold">{bonus.users.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Депозиты</p>
                        <p className="text-lg font-semibold">{bonus.deposited}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Отыграно</p>
                        <p className="text-lg font-semibold">{bonus.wagered}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">ROI</p>
                        <p className="text-lg font-semibold text-green-600">{bonus.roi}%</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Completion</p>
                        <div className="flex items-center gap-2">
                          <Progress value={bonus.completionRate} className="flex-1" />
                          <span className="text-sm font-medium">{bonus.completionRate}%</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="calculator" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calculator className="h-5 w-5" />
                Калькулятор Wagering Requirements
              </CardTitle>
              <CardDescription>
                Расчет оптимальных параметров отыгрыша бонусов
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-4">
                  <div>
                    <Label>Тип бонуса</Label>
                    <Select value={newBonus.type} onValueChange={(v) => setNewBonus({...newBonus, type: v as BonusType})}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="deposit">Депозитный</SelectItem>
                        <SelectItem value="no_deposit">Бездепозитный</SelectItem>
                        <SelectItem value="cashback">Кэшбэк</SelectItem>
                        <SelectItem value="freespins">Фриспины</SelectItem>
                        <SelectItem value="reload">Релоад</SelectItem>
                        <SelectItem value="vip">VIP</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label>Размер бонуса (%)</Label>
                    <div className="flex items-center gap-4">
                      <Slider 
                        value={[newBonus.amount]} 
                        onValueChange={([v]) => setNewBonus({...newBonus, amount: v})}
                        max={500}
                        step={10}
                        className="flex-1"
                      />
                      <span className="text-lg font-semibold w-16">{newBonus.amount}%</span>
                    </div>
                  </div>
                  
                  <div>
                    <Label>Wagering Requirement</Label>
                    <div className="flex items-center gap-4">
                      <Slider 
                        value={[newBonus.wageringRequirement]} 
                        onValueChange={([v]) => setNewBonus({...newBonus, wageringRequirement: v})}
                        max={100}
                        step={5}
                        className="flex-1"
                      />
                      <span className="text-lg font-semibold w-16">{newBonus.wageringRequirement}x</span>
                    </div>
                  </div>
                  
                  <div>
                    <Label>Минимальный депозит</Label>
                    <Input 
                      type="number" 
                      value={newBonus.minDeposit}
                      onChange={(e) => setNewBonus({...newBonus, minDeposit: parseInt(e.target.value)})}
                    />
                  </div>
                </div>
                
                <div className="space-y-4">
                  <Card className="bg-primary/5 border-primary/20">
                    <CardHeader>
                      <CardTitle className="text-lg">Рекомендации ИИ</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Оптимальный wagering:</span>
                        <Badge variant="secondary">
                          {calculateOptimalWagering(newBonus.amount, newBonus.type)}x
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Ожидаемый completion rate:</span>
                        <Badge variant="secondary">
                          {newBonus.wageringRequirement <= 30 ? '45-55%' : '25-35%'}
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Риск bonus abuse:</span>
                        <Badge variant={newBonus.wageringRequirement < 20 ? 'destructive' : 'secondary'}>
                          {newBonus.wageringRequirement < 20 ? 'Высокий' : 'Низкий'}
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Прогноз ROI:</span>
                        <Badge variant="secondary">
                          {150 + Math.round((50 - newBonus.wageringRequirement) * 5)}%
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Alert>
                    <Info className="h-4 w-4" />
                    <AlertTitle>Математика бонуса</AlertTitle>
                    <AlertDescription>
                      При депозите €100 и бонусе {newBonus.amount}%, игрок получит €{newBonus.amount}. 
                      Для отыгрыша потребуется сделать ставок на сумму €{newBonus.amount * newBonus.wageringRequirement}.
                      При среднем RTP 96%, математическое ожидание игрока составит €{Math.round((newBonus.amount * newBonus.wageringRequirement * 0.04) * -1)}.
                    </AlertDescription>
                  </Alert>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Аналитика бонусной системы</CardTitle>
              <CardDescription>
                Детальный анализ эффективности бонусных кампаний
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold mb-3">Воронка конверсии бонусов</h3>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                      <span>Получили бонус</span>
                      <span className="font-semibold">10,245 игроков</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-blue-50/80 rounded-lg">
                      <span>Начали отыгрыш</span>
                      <span className="font-semibold">7,823 игроков (76.4%)</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-blue-50/60 rounded-lg">
                      <span>Отыграли 50%</span>
                      <span className="font-semibold">5,234 игроков (51.1%)</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-blue-50/40 rounded-lg">
                      <span>Полностью отыграли</span>
                      <span className="font-semibold">4,334 игроков (42.3%)</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                      <span>Конвертировали в реальные деньги</span>
                      <span className="font-semibold">3,567 игроков (34.8%)</span>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold mb-3">Распределение по типам бонусов</h3>
                  <div className="grid gap-3 md:grid-cols-3">
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm">Депозитные</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">€523,450</div>
                        <p className="text-xs text-muted-foreground">45% от общего объема</p>
                        <Progress value={45} className="mt-2" />
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm">Кэшбэк</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">€234,120</div>
                        <p className="text-xs text-muted-foreground">30% от общего объема</p>
                        <Progress value={30} className="mt-2" />
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm">Фриспины</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">€189,340</div>
                        <p className="text-xs text-muted-foreground">25% от общего объема</p>
                        <Progress value={25} className="mt-2" />
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="abuse" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-red-500" />
                Anti-Abuse система
              </CardTitle>
              <CardDescription>
                Мониторинг и предотвращение злоупотреблений бонусами
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Alert>
                  <AlertTriangle className="h-4 w-4" />
                  <AlertTitle>Обнаружено 23 подозрительных аккаунта</AlertTitle>
                  <AlertDescription>
                    Система выявила аномальное поведение при использовании бонусов
                  </AlertDescription>
                </Alert>
                
                <div className="grid gap-4 md:grid-cols-2">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base">Паттерны abuse</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Multi-accounting</span>
                        <Badge variant="destructive">12 случаев</Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Bonus hunting</span>
                        <Badge variant="destructive">8 случаев</Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Low-risk betting</span>
                        <Badge variant="destructive">3 случая</Badge>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base">Защитные меры</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm">IP проверка</span>
                        <Switch defaultChecked />
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Device fingerprint</span>
                        <Switch defaultChecked />
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Betting pattern анализ</span>
                        <Switch defaultChecked />
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Диалог создания бонуса */}
      <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Создание нового бонуса</DialogTitle>
            <DialogDescription>
              Настройте параметры бонуса с учетом рекомендаций ИИ
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 mt-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <Label>Название бонуса</Label>
                <Input 
                  placeholder="Например: Welcome Bonus 200%"
                  value={newBonus.name}
                  onChange={(e) => setNewBonus({...newBonus, name: e.target.value})}
                />
              </div>
              <div>
                <Label>Тип бонуса</Label>
                <Select value={newBonus.type} onValueChange={(v) => setNewBonus({...newBonus, type: v as BonusType})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="deposit">Депозитный</SelectItem>
                    <SelectItem value="no_deposit">Бездепозитный</SelectItem>
                    <SelectItem value="cashback">Кэшбэк</SelectItem>
                    <SelectItem value="freespins">Фриспины</SelectItem>
                    <SelectItem value="reload">Релоад</SelectItem>
                    <SelectItem value="vip">VIP</SelectItem>
                    <SelectItem value="tournament">Турнирный</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <Label>Размер бонуса</Label>
                <div className="flex gap-2">
                  <Input 
                    type="number"
                    value={newBonus.amount}
                    onChange={(e) => setNewBonus({...newBonus, amount: parseInt(e.target.value)})}
                  />
                  <Select value={newBonus.amountType} onValueChange={(v) => setNewBonus({...newBonus, amountType: v as 'percentage' | 'fixed'})}>
                    <SelectTrigger className="w-24">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="percentage">%</SelectItem>
                      <SelectItem value="fixed">€</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div>
                <Label>Wagering requirement</Label>
                <div className="flex items-center gap-2">
                  <Input 
                    type="number"
                    value={newBonus.wageringRequirement}
                    onChange={(e) => setNewBonus({...newBonus, wageringRequirement: parseInt(e.target.value)})}
                  />
                  <span className="text-sm text-muted-foreground">x</span>
                </div>
              </div>
            </div>
            
            <div className="grid gap-4 md:grid-cols-3">
              <div>
                <Label>Мин. депозит</Label>
                <Input 
                  type="number"
                  value={newBonus.minDeposit}
                  onChange={(e) => setNewBonus({...newBonus, minDeposit: parseInt(e.target.value)})}
                />
              </div>
              <div>
                <Label>Макс. ставка</Label>
                <Input 
                  type="number"
                  value={newBonus.maxBet}
                  onChange={(e) => setNewBonus({...newBonus, maxBet: parseInt(e.target.value)})}
                />
              </div>
              <div>
                <Label>Срок действия (дней)</Label>
                <Input 
                  type="number"
                  value={newBonus.validityDays}
                  onChange={(e) => setNewBonus({...newBonus, validityDays: parseInt(e.target.value)})}
                />
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="flex items-center space-x-2">
                  <Switch 
                    id="auto-activate"
                    checked={newBonus.autoActivate}
                    onCheckedChange={(v) => setNewBonus({...newBonus, autoActivate: v})}
                  />
                  <Label htmlFor="auto-activate">Автоактивация</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch 
                    id="stackable"
                    checked={newBonus.stackable}
                    onCheckedChange={(v) => setNewBonus({...newBonus, stackable: v})}
                  />
                  <Label htmlFor="stackable">Стекируемый</Label>
                </div>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" onClick={() => setShowCreateDialog(false)}>
                  Отмена
                </Button>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Создать бонус
                </Button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}