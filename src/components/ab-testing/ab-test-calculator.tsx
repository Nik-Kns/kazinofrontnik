'use client';

import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Checkbox } from '@/components/ui/checkbox';
import { Sparkles, TrendingUp, Users, DollarSign, Target, Clock, Globe, Gift, ArrowRight, ArrowLeft, Mail, MessageSquare, Bell } from 'lucide-react';

interface ABTestConfig {
  // Базовые настройки
  testName: string;
  segment: string;
  audienceSize: number;

  // Вариант А (контроль)
  variantA: {
    name: string;
    creative: string;
    bonus: string;
    offer: string;
  };

  // Вариант B (тест)
  variantB: {
    name: string;
    creative: string;
    bonus: string;
    offer: string;
  };

  // Дополнительные параметры
  timing: string;
  geo: string[];
  duration: number;
  confidence: number;
  channels: string[];
}

interface ABTestResult {
  predictedUplift: number;
  confidenceInterval: { min: number; max: number };
  estimatedRevenue: number;
  requiredSampleSize: number;
  recommendation: string;
  insights: string[];
}

interface ABTestCalculatorProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onTestCreated?: (config: ABTestConfig, result: ABTestResult) => void;
}

export function ABTestCalculator({ open, onOpenChange, onTestCreated }: ABTestCalculatorProps) {
  const [step, setStep] = useState(1);
  const [isCalculating, setIsCalculating] = useState(false);
  const [result, setResult] = useState<ABTestResult | null>(null);

  const [config, setConfig] = useState<ABTestConfig>({
    testName: '',
    segment: 'all',
    audienceSize: 10000,
    variantA: {
      name: 'Контроль (текущий)',
      creative: '',
      bonus: 'Стандартный бонус 100%',
      offer: '',
    },
    variantB: {
      name: 'Вариант B (новый)',
      creative: '',
      bonus: 'Увеличенный бонус 150%',
      offer: '',
    },
    timing: 'immediate',
    geo: ['all'],
    duration: 7,
    confidence: 95,
    channels: ['email'],
  });

  const totalSteps = 4;
  const progress = (step / totalSteps) * 100;

  const handleCalculate = async () => {
    setIsCalculating(true);

    // Симуляция AI-расчёта
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Генерируем предсказание на основе введённых данных
    const baseUplift = Math.random() * 20 + 5; // 5-25%
    const variance = baseUplift * 0.3;

    const aiResult: ABTestResult = {
      predictedUplift: baseUplift,
      confidenceInterval: {
        min: baseUplift - variance,
        max: baseUplift + variance
      },
      estimatedRevenue: config.audienceSize * 50 * (baseUplift / 100),
      requiredSampleSize: Math.ceil(config.audienceSize * 0.2),
      recommendation: baseUplift > 15
        ? '🚀 Высокий потенциал! Рекомендуем запустить тест немедленно.'
        : baseUplift > 8
        ? '✅ Хороший потенциал. Тест стоит провести.'
        : '⚠️ Умеренный потенциал. Рассмотрите другие варианты.',
      insights: [
        `Вариант B показывает на ${baseUplift.toFixed(1)}% лучшую конверсию чем контроль`,
        `Ожидаемый доход: €${(config.audienceSize * 50 * (baseUplift / 100)).toLocaleString()}`,
        `Минимальная длительность теста: ${config.duration} дней`,
        `Уровень достоверности: ${config.confidence}%`,
        config.audienceSize < 5000
          ? 'Небольшая аудитория может увеличить время до статистической значимости'
          : 'Размер аудитории достаточен для быстрого получения результатов'
      ]
    };

    setResult(aiResult);
    setIsCalculating(false);
    setStep(5); // Переход к результатам
  };

  const handleReset = () => {
    setStep(1);
    setResult(null);
    setConfig({
      ...config,
      testName: '',
      variantA: { ...config.variantA, creative: '', offer: '' },
      variantB: { ...config.variantB, creative: '', offer: '' },
    });
  };

  const handleCreateTest = () => {
    if (result) {
      onTestCreated?.(config, result);
      onOpenChange(false);
      handleReset();
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 flex items-center justify-center">
              <Sparkles className="h-5 w-5 text-white" />
            </div>
            <div>
              <DialogTitle className="text-2xl">AI A/B Test Calculator</DialogTitle>
              <DialogDescription>
                Предскажите эффективность A/B теста с помощью ИИ
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        {/* Progress Bar */}
        {step <= totalSteps && (
          <div className="space-y-2">
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>Шаг {step} из {totalSteps}</span>
              <span>{Math.round(progress)}%</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
        )}

        {/* Step 1: Базовые настройки */}
        {step === 1 && (
          <div className="space-y-4 py-4">
            <div>
              <Label htmlFor="testName">Название теста</Label>
              <Input
                id="testName"
                placeholder="Например: Тест увеличенного бонуса для VIP"
                value={config.testName}
                onChange={(e) => setConfig({ ...config, testName: e.target.value })}
              />
            </div>

            <div>
              <Label htmlFor="segment">Целевой сегмент</Label>
              <Select value={config.segment} onValueChange={(value) => setConfig({ ...config, segment: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Все игроки</SelectItem>
                  <SelectItem value="vip">VIP игроки</SelectItem>
                  <SelectItem value="new">Новые игроки</SelectItem>
                  <SelectItem value="inactive">Неактивные (7+ дней)</SelectItem>
                  <SelectItem value="high-value">Высокая ценность (LTV &gt; €500)</SelectItem>
                  <SelectItem value="slots-lovers">Любители слотов</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="audience">Размер аудитории</Label>
              <Input
                id="audience"
                type="number"
                value={config.audienceSize}
                onChange={(e) => setConfig({ ...config, audienceSize: parseInt(e.target.value) || 0 })}
              />
              <p className="text-xs text-muted-foreground mt-1">
                Рекомендуем минимум 2000 игроков для статистической значимости
              </p>
            </div>
          </div>
        )}

        {/* Step 2: Вариант A (контроль) */}
        {step === 2 && (
          <div className="space-y-4 py-4">
            <div className="flex items-center gap-2 mb-4">
              <Badge variant="outline">Вариант A - Контроль</Badge>
            </div>

            <div>
              <Label htmlFor="variantA-creative">Креатив / Сообщение</Label>
              <Textarea
                id="variantA-creative"
                placeholder="Текст email/push уведомления для варианта A..."
                value={config.variantA.creative}
                onChange={(e) => setConfig({
                  ...config,
                  variantA: { ...config.variantA, creative: e.target.value }
                })}
                rows={3}
              />
            </div>

            <div>
              <Label htmlFor="variantA-bonus">Бонус</Label>
              <Select
                value={config.variantA.bonus}
                onValueChange={(value) => setConfig({
                  ...config,
                  variantA: { ...config.variantA, bonus: value }
                })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Выберите тип бонуса" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="10% кэшбэк">10% кэшбэк</SelectItem>
                  <SelectItem value="20% кэшбэк">20% кэшбэк</SelectItem>
                  <SelectItem value="50% на депозит">50% на депозит</SelectItem>
                  <SelectItem value="100% на депозит">100% на депозит</SelectItem>
                  <SelectItem value="50 фриспинов">50 фриспинов</SelectItem>
                  <SelectItem value="100 фриспинов">100 фриспинов</SelectItem>
                  <SelectItem value="€10 бонус">€10 бонус</SelectItem>
                  <SelectItem value="€25 бонус">€25 бонус</SelectItem>
                  <SelectItem value="€50 бонус">€50 бонус</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="variantA-offer">Условия оффера</Label>
              <Select
                value={config.variantA.offer}
                onValueChange={(value) => setConfig({
                  ...config,
                  variantA: { ...config.variantA, offer: value }
                })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Выберите условия" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Вейджер x1, 7 дней">Вейджер x1, 7 дней</SelectItem>
                  <SelectItem value="Вейджер x3, 7 дней">Вейджер x3, 7 дней</SelectItem>
                  <SelectItem value="Вейджер x5, 14 дней">Вейджер x5, 14 дней</SelectItem>
                  <SelectItem value="Вейджер x10, 30 дней">Вейджер x10, 30 дней</SelectItem>
                  <SelectItem value="Без вейджера, 3 дня">Без вейджера, 3 дня</SelectItem>
                  <SelectItem value="Без вейджера, 7 дней">Без вейджера, 7 дней</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        )}

        {/* Step 3: Вариант B (тест) */}
        {step === 3 && (
          <div className="space-y-4 py-4">
            <div className="flex items-center gap-2 mb-4">
              <Badge className="bg-gradient-to-r from-purple-500 to-blue-500">Вариант B - Тест</Badge>
            </div>

            <div>
              <Label htmlFor="variantB-creative">Креатив / Сообщение</Label>
              <Textarea
                id="variantB-creative"
                placeholder="Текст email/push уведомления для варианта B..."
                value={config.variantB.creative}
                onChange={(e) => setConfig({
                  ...config,
                  variantB: { ...config.variantB, creative: e.target.value }
                })}
                rows={3}
              />
            </div>

            <div>
              <Label htmlFor="variantB-bonus">Бонус</Label>
              <Select
                value={config.variantB.bonus}
                onValueChange={(value) => setConfig({
                  ...config,
                  variantB: { ...config.variantB, bonus: value }
                })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Выберите тип бонуса" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="10% кэшбэк">10% кэшбэк</SelectItem>
                  <SelectItem value="20% кэшбэк">20% кэшбэк</SelectItem>
                  <SelectItem value="50% на депозит">50% на депозит</SelectItem>
                  <SelectItem value="100% на депозит">100% на депозит</SelectItem>
                  <SelectItem value="50 фриспинов">50 фриспинов</SelectItem>
                  <SelectItem value="100 фриспинов">100 фриспинов</SelectItem>
                  <SelectItem value="€10 бонус">€10 бонус</SelectItem>
                  <SelectItem value="€25 бонус">€25 бонус</SelectItem>
                  <SelectItem value="€50 бонус">€50 бонус</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="variantB-offer">Условия оффера</Label>
              <Select
                value={config.variantB.offer}
                onValueChange={(value) => setConfig({
                  ...config,
                  variantB: { ...config.variantB, offer: value }
                })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Выберите условия" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Вейджер x1, 7 дней">Вейджер x1, 7 дней</SelectItem>
                  <SelectItem value="Вейджер x3, 7 дней">Вейджер x3, 7 дней</SelectItem>
                  <SelectItem value="Вейджер x5, 14 дней">Вейджер x5, 14 дней</SelectItem>
                  <SelectItem value="Вейджер x10, 30 дней">Вейджер x10, 30 дней</SelectItem>
                  <SelectItem value="Без вейджера, 3 дня">Без вейджера, 3 дня</SelectItem>
                  <SelectItem value="Без вейджера, 7 дней">Без вейджера, 7 дней</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        )}

        {/* Step 4: Доп. параметры */}
        {step === 4 && (
          <div className="space-y-4 py-4">
            <div>
              <Label htmlFor="timing">Время отправки</Label>
              <Select value={config.timing} onValueChange={(value) => setConfig({ ...config, timing: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="immediate">Немедленно</SelectItem>
                  <SelectItem value="evening">Вечер (18:00-21:00)</SelectItem>
                  <SelectItem value="weekend">Выходные</SelectItem>
                  <SelectItem value="optimal">AI оптимальное время</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="geo">География</Label>
              <Select value={config.geo[0]} onValueChange={(value) => setConfig({ ...config, geo: [value] })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Все страны</SelectItem>
                  <SelectItem value="eu">Европа</SelectItem>
                  <SelectItem value="de">Германия</SelectItem>
                  <SelectItem value="uk">Великобритания</SelectItem>
                  <SelectItem value="nordic">Скандинавия</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="duration">Длительность теста (дни)</Label>
              <Input
                id="duration"
                type="number"
                min="3"
                max="30"
                value={config.duration}
                onChange={(e) => setConfig({ ...config, duration: parseInt(e.target.value) || 7 })}
              />
            </div>

            <div>
              <Label htmlFor="confidence">Уровень достоверности (%)</Label>
              <Select
                value={config.confidence.toString()}
                onValueChange={(value) => setConfig({ ...config, confidence: parseInt(value) })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="90">90% - Быстрый тест</SelectItem>
                  <SelectItem value="95">95% - Рекомендуемый</SelectItem>
                  <SelectItem value="99">99% - Максимальная точность</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-3">
              <Label>Каналы коммуникации</Label>
              <div className="space-y-2">
                <div className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-accent">
                  <Checkbox
                    id="channel-email"
                    checked={config.channels.includes('email')}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        setConfig({ ...config, channels: [...config.channels, 'email'] });
                      } else {
                        setConfig({ ...config, channels: config.channels.filter(c => c !== 'email') });
                      }
                    }}
                  />
                  <Label htmlFor="channel-email" className="flex items-center gap-2 cursor-pointer flex-1">
                    <Mail className="h-4 w-4 text-blue-600" />
                    <span>Email</span>
                  </Label>
                </div>

                <div className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-accent">
                  <Checkbox
                    id="channel-sms"
                    checked={config.channels.includes('sms')}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        setConfig({ ...config, channels: [...config.channels, 'sms'] });
                      } else {
                        setConfig({ ...config, channels: config.channels.filter(c => c !== 'sms') });
                      }
                    }}
                  />
                  <Label htmlFor="channel-sms" className="flex items-center gap-2 cursor-pointer flex-1">
                    <MessageSquare className="h-4 w-4 text-green-600" />
                    <span>SMS</span>
                  </Label>
                </div>

                <div className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-accent">
                  <Checkbox
                    id="channel-push"
                    checked={config.channels.includes('push')}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        setConfig({ ...config, channels: [...config.channels, 'push'] });
                      } else {
                        setConfig({ ...config, channels: config.channels.filter(c => c !== 'push') });
                      }
                    }}
                  />
                  <Label htmlFor="channel-push" className="flex items-center gap-2 cursor-pointer flex-1">
                    <Bell className="h-4 w-4 text-purple-600" />
                    <span>Push уведомления</span>
                  </Label>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Step 5: Результаты AI-предсказания */}
        {step === 5 && result && (
          <div className="space-y-4 py-4">
            <Card className="border-2 border-purple-500">
              <CardHeader className="bg-gradient-to-r from-purple-50 to-blue-50">
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-purple-600" />
                  AI Предсказание
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-4 bg-green-50 rounded-lg border border-green-200">
                    <div className="text-3xl font-bold text-green-600">
                      +{result.predictedUplift.toFixed(1)}%
                    </div>
                    <div className="text-sm text-muted-foreground mt-1">Predicted Uplift</div>
                  </div>

                  <div className="text-center p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <div className="text-3xl font-bold text-blue-600">
                      €{result.estimatedRevenue.toLocaleString()}
                    </div>
                    <div className="text-sm text-muted-foreground mt-1">Estimated Revenue</div>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Confidence Interval</span>
                    <span className="font-medium">
                      {result.confidenceInterval.min.toFixed(1)}% - {result.confidenceInterval.max.toFixed(1)}%
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Required Sample Size</span>
                    <span className="font-medium">{result.requiredSampleSize.toLocaleString()}</span>
                  </div>
                </div>

                <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
                  <div className="font-medium mb-2">Рекомендация:</div>
                  <p className="text-sm">{result.recommendation}</p>
                </div>

                <div>
                  <div className="font-medium mb-2">AI Insights:</div>
                  <ul className="space-y-1">
                    {result.insights.map((insight, i) => (
                      <li key={i} className="text-sm flex items-start gap-2">
                        <span className="text-purple-500 mt-0.5">•</span>
                        <span>{insight}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        <DialogFooter className="flex-row gap-2 sm:gap-2">
          {step > 1 && step <= totalSteps && (
            <Button variant="outline" onClick={() => setStep(step - 1)} className="flex-1">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Назад
            </Button>
          )}

          {step < totalSteps && (
            <Button onClick={() => setStep(step + 1)} className="flex-1">
              Далее
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          )}

          {step === totalSteps && !result && (
            <Button
              onClick={handleCalculate}
              disabled={isCalculating}
              className="flex-1 bg-gradient-to-r from-purple-600 to-blue-600"
            >
              {isCalculating ? (
                <>
                  <Sparkles className="h-4 w-4 mr-2 animate-spin" />
                  AI Считает...
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4 mr-2" />
                  Рассчитать Uplift
                </>
              )}
            </Button>
          )}

          {step === 5 && result && (
            <>
              <Button variant="outline" onClick={handleReset} className="flex-1">
                Новый тест
              </Button>
              <Button onClick={handleCreateTest} className="flex-1 bg-gradient-to-r from-purple-600 to-blue-600">
                Создать A/B тест
              </Button>
            </>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
