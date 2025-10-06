"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import {
  ChevronLeft,
  ChevronRight,
  Sparkles,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Euro,
  Calendar,
  Target,
  Users,
  Mail,
  Bell,
  MessageSquare,
  BarChart3,
  Lightbulb
} from "lucide-react";
import { BonusType } from "@/lib/types/bonuses";

interface BonusWizardProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onComplete?: (bonus: BonusFormData) => void;
}

// Полная форма бонуса
export interface BonusFormData {
  // Шаг 1: Базовые параметры
  name: string;
  type: BonusType;
  currency: string;
  amount: number;
  amountType: 'percentage' | 'fixed';
  validityDays: number;
  minDeposit: number;
  maxBet: number;

  // Шаг 2: Механика отыгрыша
  wageringRequirement: number;
  bonusStructure: 'sticky' | 'non-sticky';
  maxWinnings: number;
  gameTypes: string[];
  contributionRates: Record<string, number>;
  wageringDays: number;

  // Шаг 3: Сегментация и таргетинг
  targetSegment: string;
  geo: string[];
  trafficSource: string[];
  vipLevel: string[];
  channels: string[];

  // Шаг 4: Интеграция с коммуникацией
  campaignId: string | null;
  triggerType: string;

  // Шаг 5: Прогноз (автоматически рассчитывается)
  // Шаг 6: Финализация
}

const STEPS = [
  { id: 1, name: 'Базовые параметры', icon: Target },
  { id: 2, name: 'Механика отыгрыша', icon: BarChart3 },
  { id: 3, name: 'Сегментация', icon: Users },
  { id: 4, name: 'Коммуникация', icon: MessageSquare },
  { id: 5, name: 'Прогноз экономики', icon: TrendingUp },
  { id: 6, name: 'Финализация', icon: CheckCircle }
];

export function BonusWizard({ open, onOpenChange, onComplete }: BonusWizardProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<BonusFormData>({
    name: '',
    type: 'deposit',
    currency: 'EUR',
    amount: 100,
    amountType: 'percentage',
    validityDays: 7,
    minDeposit: 20,
    maxBet: 10,
    wageringRequirement: 30,
    bonusStructure: 'sticky',
    maxWinnings: 1000,
    gameTypes: ['slots'],
    contributionRates: { slots: 100, live: 20, table: 10 },
    wageringDays: 14,
    targetSegment: 'new_players',
    geo: ['EU'],
    trafficSource: ['direct'],
    vipLevel: ['regular'],
    channels: ['email'],
    campaignId: null,
    triggerType: 'on_registration'
  });

  // AI-прогноз на основе текущих параметров
  const calculatePredictions = () => {
    const baseCompletion = 45;
    const wageringPenalty = (formData.wageringRequirement - 30) * 0.5;
    const daysPenalty = formData.validityDays < 7 ? 5 : 0;

    const completionRate = Math.max(25, Math.min(60, baseCompletion - wageringPenalty - daysPenalty));
    const depositUplift = formData.amount > 100 ? 25 : 20;
    const abuseRate = formData.maxWinnings > 2000 ? 3.5 : 2.2;
    const netROI = 85 + (completionRate - 40) * 2;
    const breakEven = Math.round(15 - (completionRate - 40) * 0.2);

    return {
      completionRate: completionRate.toFixed(1),
      depositUplift: depositUplift.toFixed(1),
      abuseRate: abuseRate.toFixed(1),
      netROI: netROI.toFixed(0),
      breakEven,
      forecastRevenue: '€28,500',
      retentionUplift: '+15%',
      confidence: 85
    };
  };

  const predictions = calculatePredictions();

  const handleNext = () => {
    if (currentStep < 6) {
      setCurrentStep(currentStep + 1);
    } else {
      // Финализация
      onComplete?.(formData);
      onOpenChange(false);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const updateFormData = (updates: Partial<BonusFormData>) => {
    setFormData({ ...formData, ...updates });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            Конструктор бонусов с AI-помощником
          </DialogTitle>
          <DialogDescription>
            Шаг {currentStep} из 6: {STEPS[currentStep - 1].name}
          </DialogDescription>
        </DialogHeader>

        {/* Progress indicator */}
        <div className="flex items-center justify-between mb-6">
          {STEPS.map((step, index) => {
            const Icon = step.icon;
            const isActive = step.id === currentStep;
            const isCompleted = step.id < currentStep;

            return (
              <div key={step.id} className="flex items-center flex-1">
                <div className={`flex flex-col items-center ${index > 0 ? 'flex-1' : ''}`}>
                  {index > 0 && (
                    <div className={`h-0.5 w-full mb-2 ${isCompleted ? 'bg-primary' : 'bg-muted'}`} />
                  )}
                  <div
                    className={`
                      w-10 h-10 rounded-full flex items-center justify-center
                      ${isActive ? 'bg-primary text-primary-foreground' : ''}
                      ${isCompleted ? 'bg-primary/20 text-primary' : ''}
                      ${!isActive && !isCompleted ? 'bg-muted text-muted-foreground' : ''}
                    `}
                  >
                    {isCompleted ? <CheckCircle className="h-5 w-5" /> : <Icon className="h-5 w-5" />}
                  </div>
                  <span className="text-xs mt-1 text-center hidden md:block">{step.name}</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Step content */}
        <div className="space-y-6">
          {/* ШАГ 1: Базовые параметры */}
          {currentStep === 1 && (
            <div className="space-y-4">
              <Card className="bg-primary/5 border-primary/20">
                <CardHeader>
                  <CardTitle className="text-sm flex items-center gap-2">
                    <Lightbulb className="h-4 w-4" />
                    AI-подсказка
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground">
                  Для GEO EU бонус +100% на 7 дней показывает средний completion 42%, uplift +24%
                </CardContent>
              </Card>

              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <Label>Название бонуса</Label>
                  <Input
                    placeholder="Welcome Pack 200%"
                    value={formData.name}
                    onChange={(e) => updateFormData({ name: e.target.value })}
                  />
                </div>
                <div>
                  <Label>Тип бонуса</Label>
                  <Select value={formData.type} onValueChange={(v) => updateFormData({ type: v as BonusType })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="deposit">Deposit</SelectItem>
                      <SelectItem value="reload">Reload</SelectItem>
                      <SelectItem value="cashback">Cashback</SelectItem>
                      <SelectItem value="freespins">Free spins</SelectItem>
                      <SelectItem value="tournament">Tournament</SelectItem>
                      <SelectItem value="insurance">Insurance</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-3">
                <div>
                  <Label>Валюта</Label>
                  <Select value={formData.currency} onValueChange={(v) => updateFormData({ currency: v })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="EUR">EUR</SelectItem>
                      <SelectItem value="USD">USD</SelectItem>
                      <SelectItem value="multi">Multi-currency</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Размер</Label>
                  <div className="flex gap-2">
                    <Input
                      type="number"
                      value={formData.amount}
                      onChange={(e) => updateFormData({ amount: parseInt(e.target.value) })}
                    />
                    <Select value={formData.amountType} onValueChange={(v) => updateFormData({ amountType: v as 'percentage' | 'fixed' })}>
                      <SelectTrigger className="w-20">
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
                  <Label>Срок действия (дней)</Label>
                  <Input
                    type="number"
                    value={formData.validityDays}
                    onChange={(e) => updateFormData({ validityDays: parseInt(e.target.value) })}
                  />
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <Label>Минимальный депозит (€)</Label>
                  <Input
                    type="number"
                    value={formData.minDeposit}
                    onChange={(e) => updateFormData({ minDeposit: parseInt(e.target.value) })}
                  />
                </div>
                <div>
                  <Label>Максимальная ставка (€)</Label>
                  <Input
                    type="number"
                    value={formData.maxBet}
                    onChange={(e) => updateFormData({ maxBet: parseInt(e.target.value) })}
                  />
                </div>
              </div>
            </div>
          )}

          {/* ШАГ 2: Механика отыгрыша */}
          {currentStep === 2 && (
            <div className="space-y-4">
              <Card className="bg-primary/5 border-primary/20">
                <CardHeader>
                  <CardTitle className="text-sm flex items-center gap-2">
                    <Lightbulb className="h-4 w-4" />
                    AI-рекомендации
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-sm">
                  <p>✓ Оптимальный wagering для этого типа: x{formData.type === 'deposit' ? '30' : '25'}</p>
                  <p>✓ Ожидаемый completion rate: {predictions.completionRate}%</p>
                  {formData.wageringRequirement > 50 && (
                    <p className="text-orange-600 flex items-center gap-2">
                      <AlertTriangle className="h-4 w-4" />
                      Высокий wagering может снизить completion до &lt;20%
                    </p>
                  )}
                </CardContent>
              </Card>

              <div>
                <Label>Wagering requirement (x{formData.wageringRequirement})</Label>
                <div className="flex items-center gap-4 mt-2">
                  <Slider
                    value={[formData.wageringRequirement]}
                    onValueChange={([v]) => updateFormData({ wageringRequirement: v })}
                    min={5}
                    max={60}
                    step={5}
                    className="flex-1"
                  />
                  <span className="text-lg font-semibold w-16">x{formData.wageringRequirement}</span>
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <Label>Тип бонуса</Label>
                  <Select value={formData.bonusStructure} onValueChange={(v) => updateFormData({ bonusStructure: v as 'sticky' | 'non-sticky' })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="sticky">Sticky (невыводимый)</SelectItem>
                      <SelectItem value="non-sticky">Non-sticky (выводимый)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Максимальный выигрыш (€)</Label>
                  <Input
                    type="number"
                    value={formData.maxWinnings}
                    onChange={(e) => updateFormData({ maxWinnings: parseInt(e.target.value) })}
                    placeholder="Опционально"
                  />
                </div>
              </div>

              <div>
                <Label>Участвующие игры</Label>
                <div className="grid gap-2 mt-2">
                  {['slots', 'live', 'table'].map((game) => (
                    <div key={game} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-2">
                        <Checkbox
                          checked={formData.gameTypes.includes(game)}
                          onCheckedChange={(checked) => {
                            const newGames = checked
                              ? [...formData.gameTypes, game]
                              : formData.gameTypes.filter(g => g !== game);
                            updateFormData({ gameTypes: newGames });
                          }}
                        />
                        <span className="capitalize">{game === 'slots' ? 'Слоты' : game === 'live' ? 'Live-игры' : 'Настольные игры'}</span>
                      </div>
                      {formData.gameTypes.includes(game) && (
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-muted-foreground">Вклад:</span>
                          <Input
                            type="number"
                            value={formData.contributionRates[game]}
                            onChange={(e) => updateFormData({
                              contributionRates: { ...formData.contributionRates, [game]: parseInt(e.target.value) }
                            })}
                            className="w-20"
                          />
                          <span className="text-sm">%</span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <Label>Срок на отыгрыш (дней)</Label>
                <Input
                  type="number"
                  value={formData.wageringDays}
                  onChange={(e) => updateFormData({ wageringDays: parseInt(e.target.value) })}
                  min={1}
                  max={30}
                />
              </div>
            </div>
          )}

          {/* ШАГ 3: Сегментация и таргетинг */}
          {currentStep === 3 && (
            <div className="space-y-4">
              <Card className="bg-primary/5 border-primary/20">
                <CardHeader>
                  <CardTitle className="text-sm flex items-center gap-2">
                    <Lightbulb className="h-4 w-4" />
                    AI-рекомендация
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground">
                  Этот бонус показывает наилучший uplift в сегменте «VIP inactive 15–30d» (+32% deposits)
                </CardContent>
              </Card>

              <div>
                <Label>Целевой сегмент</Label>
                <Select value={formData.targetSegment} onValueChange={(v) => updateFormData({ targetSegment: v })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="new_players">Новые игроки</SelectItem>
                    <SelectItem value="sleeping_30">Спящие 30+ дней</SelectItem>
                    <SelectItem value="vip">VIP</SelectItem>
                    <SelectItem value="high_risk">High risk</SelectItem>
                    <SelectItem value="loss_recovery">Loss recovery</SelectItem>
                    <SelectItem value="custom">Custom</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <Label>GEO</Label>
                  <div className="space-y-2 mt-2">
                    {['EU', 'NA', 'ASIA', 'LATAM'].map((geo) => (
                      <div key={geo} className="flex items-center gap-2">
                        <Checkbox
                          checked={formData.geo.includes(geo)}
                          onCheckedChange={(checked) => {
                            const newGeo = checked
                              ? [...formData.geo, geo]
                              : formData.geo.filter(g => g !== geo);
                            updateFormData({ geo: newGeo });
                          }}
                        />
                        <span>{geo}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <Label>VIP уровень</Label>
                  <div className="space-y-2 mt-2">
                    {['regular', 'bronze', 'silver', 'gold', 'platinum'].map((level) => (
                      <div key={level} className="flex items-center gap-2">
                        <Checkbox
                          checked={formData.vipLevel.includes(level)}
                          onCheckedChange={(checked) => {
                            const newLevels = checked
                              ? [...formData.vipLevel, level]
                              : formData.vipLevel.filter(l => l !== level);
                            updateFormData({ vipLevel: newLevels });
                          }}
                        />
                        <span className="capitalize">{level}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div>
                <Label>Источники трафика</Label>
                <div className="grid grid-cols-2 gap-2 mt-2">
                  {['affiliate', 'direct', 'crm', 'organic'].map((source) => (
                    <div key={source} className="flex items-center gap-2">
                      <Checkbox
                        checked={formData.trafficSource.includes(source)}
                        onCheckedChange={(checked) => {
                          const newSources = checked
                            ? [...formData.trafficSource, source]
                            : formData.trafficSource.filter(s => s !== source);
                          updateFormData({ trafficSource: newSources });
                        }}
                      />
                      <span className="capitalize">{source}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <Label>Каналы коммуникации</Label>
                <div className="grid grid-cols-2 gap-2 mt-2">
                  {[
                    { id: 'email', label: 'Email', icon: Mail },
                    { id: 'push', label: 'Push', icon: Bell },
                    { id: 'popup', label: 'Pop-up', icon: MessageSquare },
                    { id: 'inapp', label: 'In-app', icon: MessageSquare }
                  ].map(({ id, label, icon: Icon }) => (
                    <div key={id} className="flex items-center gap-2">
                      <Checkbox
                        checked={formData.channels.includes(id)}
                        onCheckedChange={(checked) => {
                          const newChannels = checked
                            ? [...formData.channels, id]
                            : formData.channels.filter(c => c !== id);
                          updateFormData({ channels: newChannels });
                        }}
                      />
                      <Icon className="h-4 w-4" />
                      <span>{label}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ШАГ 4: Интеграция с коммуникацией */}
          {currentStep === 4 && (
            <div className="space-y-4">
              <Card className="bg-primary/5 border-primary/20">
                <CardHeader>
                  <CardTitle className="text-sm flex items-center gap-2">
                    <Lightbulb className="h-4 w-4" />
                    AI-рекомендация
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground">
                  Оптимальный триггер: "On first deposit" с email каналом (прогноз CTR: 24%, CR: 38%)
                </CardContent>
              </Card>

              <div>
                <Label>Привязка к кампании</Label>
                <Select value={formData.campaignId || 'none'} onValueChange={(v) => updateFormData({ campaignId: v === 'none' ? null : v })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Выберите кампанию" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">Без кампании</SelectItem>
                    <SelectItem value="camp-1">Welcome Campaign 2024</SelectItem>
                    <SelectItem value="camp-2">VIP Retention Q1</SelectItem>
                    <SelectItem value="camp-3">Weekend Reload</SelectItem>
                    <SelectItem value="new">+ Создать новую кампанию</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Триггер активации</Label>
                <Select value={formData.triggerType} onValueChange={(v) => updateFormData({ triggerType: v })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="on_registration">При регистрации</SelectItem>
                    <SelectItem value="on_first_deposit">При первом депозите</SelectItem>
                    <SelectItem value="on_inactivity_7">Неактивность 7 дней</SelectItem>
                    <SelectItem value="on_inactivity_30">Неактивность 30 дней</SelectItem>
                    <SelectItem value="on_loss">При проигрыше &gt; X</SelectItem>
                    <SelectItem value="on_win">При выигрыше &gt; X</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="p-4 border rounded-lg bg-muted/50">
                <h4 className="font-semibold mb-2">Прогноз эффективности каналов</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Email</span>
                    <span className="font-medium">CTR: 24% | CR: 38%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Push</span>
                    <span className="font-medium">CTR: 18% | CR: 28%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Pop-up</span>
                    <span className="font-medium">CTR: 42% | CR: 31%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>In-app</span>
                    <span className="font-medium">CTR: 35% | CR: 45%</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ШАГ 5: Экономика и прогноз */}
          {currentStep === 5 && (
            <div className="space-y-4">
              <Card className="bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-primary" />
                    AI-прогноз экономики бонуса
                  </CardTitle>
                  <CardDescription>
                    Уверенность модели: {predictions.confidence}%
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    <div className="p-4 bg-background rounded-lg border">
                      <p className="text-sm text-muted-foreground mb-1">Completion Rate</p>
                      <p className="text-2xl font-bold text-green-600">{predictions.completionRate}%</p>
                      <p className="text-xs text-muted-foreground mt-1">Диапазон: 35-45%</p>
                    </div>

                    <div className="p-4 bg-background rounded-lg border">
                      <p className="text-sm text-muted-foreground mb-1">Deposit Uplift</p>
                      <p className="text-2xl font-bold text-green-600">+{predictions.depositUplift}%</p>
                      <p className="text-xs text-muted-foreground mt-1">vs контроль</p>
                    </div>

                    <div className="p-4 bg-background rounded-lg border">
                      <p className="text-sm text-muted-foreground mb-1">Abuse Rate</p>
                      <p className={`text-2xl font-bold ${parseFloat(predictions.abuseRate) < 3 ? 'text-green-600' : 'text-orange-600'}`}>
                        {predictions.abuseRate}%
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">Целевой: &lt;3%</p>
                    </div>

                    <div className="p-4 bg-background rounded-lg border">
                      <p className="text-sm text-muted-foreground mb-1">Break-even</p>
                      <p className="text-2xl font-bold">{predictions.breakEven} дней</p>
                      <p className="text-xs text-muted-foreground mt-1">До окупаемости</p>
                    </div>

                    <div className="p-4 bg-background rounded-lg border">
                      <p className="text-sm text-muted-foreground mb-1">Net ROI</p>
                      <p className="text-2xl font-bold text-green-600">+{predictions.netROI}%</p>
                      <p className="text-xs text-muted-foreground mt-1">Чистая прибыль</p>
                    </div>

                    <div className="p-4 bg-background rounded-lg border">
                      <p className="text-sm text-muted-foreground mb-1">Forecast Revenue</p>
                      <p className="text-2xl font-bold">{predictions.forecastRevenue}</p>
                      <p className="text-xs text-muted-foreground mt-1">Первый месяц</p>
                    </div>
                  </div>

                  <Separator />

                  <div className="p-4 bg-background rounded-lg border">
                    <h4 className="font-semibold mb-2 flex items-center gap-2">
                      <Target className="h-4 w-4" />
                      Retention Uplift (D30)
                    </h4>
                    <p className="text-2xl font-bold text-green-600">{predictions.retentionUplift}</p>
                    <p className="text-xs text-muted-foreground mt-1">Прогнозируемое улучшение удержания</p>
                  </div>

                  <Card className="bg-blue-50 border-blue-200">
                    <CardHeader>
                      <CardTitle className="text-sm">Объяснение AI</CardTitle>
                    </CardHeader>
                    <CardContent className="text-sm text-muted-foreground space-y-1">
                      <p>✓ Прогноз основан на исторических данных за последние 12 месяцев</p>
                      <p>✓ Учтены паттерны сегмента "{formData.targetSegment}"</p>
                      <p>✓ Wagering x{formData.wageringRequirement} соответствует industry best practices</p>
                      <p>✓ Completion rate скорректирован с учетом GEO и VIP-уровня</p>
                    </CardContent>
                  </Card>
                </CardContent>
              </Card>
            </div>
          )}

          {/* ШАГ 6: Финализация */}
          {currentStep === 6 && (
            <div className="space-y-4">
              <Card className="bg-green-50 border-green-200">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-green-700">
                    <CheckCircle className="h-5 w-5" />
                    Бонус готов к созданию!
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-semibold mb-2">Краткая информация</h4>
                    <div className="grid gap-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Название:</span>
                        <span className="font-medium">{formData.name || 'Без названия'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Тип:</span>
                        <span className="font-medium capitalize">{formData.type}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Размер:</span>
                        <span className="font-medium">{formData.amount}{formData.amountType === 'percentage' ? '%' : '€'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Wagering:</span>
                        <span className="font-medium">x{formData.wageringRequirement}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Прогноз ROI:</span>
                        <span className="font-medium text-green-600">+{predictions.netROI}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Completion Rate:</span>
                        <span className="font-medium">{predictions.completionRate}%</span>
                      </div>
                    </div>
                  </div>

                  <Separator />

                  <div className="p-4 bg-background rounded-lg border">
                    <h4 className="font-semibold mb-2">Что произойдет после создания?</h4>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                      <li className="flex items-start gap-2">
                        <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
                        <span>Бонус автоматически попадет в таблицу Active Bonuses</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
                        <span>AI начнет трекинг фактического completion vs прогноз</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
                        <span>Real-time мониторинг ROI и uplift</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
                        <span>Early fraud detection и алерты при аномалиях</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
                        <span>Через 3-5 дней: автоматический Post-launch review от AI</span>
                      </li>
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>

        {/* Navigation buttons */}
        <div className="flex justify-between mt-6 pt-6 border-t">
          <Button
            variant="outline"
            onClick={handlePrevious}
            disabled={currentStep === 1}
          >
            <ChevronLeft className="h-4 w-4 mr-2" />
            Назад
          </Button>

          <Button onClick={handleNext}>
            {currentStep === 6 ? 'Создать бонус' : 'Далее'}
            {currentStep < 6 && <ChevronRight className="h-4 w-4 ml-2" />}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
