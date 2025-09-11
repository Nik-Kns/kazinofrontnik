"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { 
  Target, 
  TrendingUp, 
  Users, 
  DollarSign, 
  Percent,
  Activity,
  Calendar,
  Info,
  Save,
  Sparkles
} from "lucide-react";
import { cn } from "@/lib/utils";

interface GoalsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface MetricGoal {
  id: string;
  name: string;
  description: string;
  icon: React.ElementType;
  unit: string;
  currentValue: number;
  targetValue: number;
  minValue: number;
  maxValue: number;
  step: number;
  category: "revenue" | "engagement" | "retention" | "acquisition";
  priority: "high" | "medium" | "low";
  aiRecommendation?: number;
}

const metricsGoals: MetricGoal[] = [
  {
    id: "ggr",
    name: "GGR (Gross Gaming Revenue)",
    description: "Валовой игровой доход - общая сумма ставок минус выплаты",
    icon: DollarSign,
    unit: "€",
    currentValue: 125000,
    targetValue: 150000,
    minValue: 0,
    maxValue: 500000,
    step: 5000,
    category: "revenue",
    priority: "high",
    aiRecommendation: 145000
  },
  {
    id: "arpu",
    name: "ARPU",
    description: "Средний доход на одного пользователя",
    icon: TrendingUp,
    unit: "€",
    currentValue: 125,
    targetValue: 150,
    minValue: 0,
    maxValue: 500,
    step: 5,
    category: "revenue",
    priority: "high",
    aiRecommendation: 145
  },
  {
    id: "retention_1d",
    name: "Retention 1-й день",
    description: "Процент игроков, вернувшихся на следующий день",
    icon: Users,
    unit: "%",
    currentValue: 45,
    targetValue: 55,
    minValue: 0,
    maxValue: 100,
    step: 1,
    category: "retention",
    priority: "high",
    aiRecommendation: 52
  },
  {
    id: "retention_7d",
    name: "Retention 7-й день",
    description: "Процент игроков, вернувшихся через неделю",
    icon: Calendar,
    unit: "%",
    currentValue: 25,
    targetValue: 35,
    minValue: 0,
    maxValue: 100,
    step: 1,
    category: "retention",
    priority: "medium",
    aiRecommendation: 32
  },
  {
    id: "dau",
    name: "DAU (Daily Active Users)",
    description: "Количество уникальных активных пользователей в день",
    icon: Activity,
    unit: "",
    currentValue: 2500,
    targetValue: 3500,
    minValue: 0,
    maxValue: 10000,
    step: 100,
    category: "engagement",
    priority: "medium",
    aiRecommendation: 3200
  },
  {
    id: "conversion_rate",
    name: "Конверсия в депозит",
    description: "Процент регистраций, совершивших первый депозит",
    icon: Percent,
    unit: "%",
    currentValue: 18,
    targetValue: 25,
    minValue: 0,
    maxValue: 100,
    step: 1,
    category: "acquisition",
    priority: "high",
    aiRecommendation: 23
  },
  {
    id: "avg_deposit",
    name: "Средний депозит",
    description: "Средняя сумма депозита на одну транзакцию",
    icon: DollarSign,
    unit: "€",
    currentValue: 85,
    targetValue: 120,
    minValue: 0,
    maxValue: 500,
    step: 5,
    category: "revenue",
    priority: "medium",
    aiRecommendation: 105
  },
  {
    id: "ltv",
    name: "LTV (Lifetime Value)",
    description: "Прогнозируемая прибыль от игрока за всё время",
    icon: TrendingUp,
    unit: "€",
    currentValue: 450,
    targetValue: 600,
    minValue: 0,
    maxValue: 2000,
    step: 10,
    category: "revenue",
    priority: "high",
    aiRecommendation: 550
  }
];

const categoryColors = {
  revenue: "text-green-600 bg-green-100",
  engagement: "text-blue-600 bg-blue-100",
  retention: "text-purple-600 bg-purple-100",
  acquisition: "text-orange-600 bg-orange-100"
};

const categoryLabels = {
  revenue: "Доход",
  engagement: "Вовлечение",
  retention: "Удержание",
  acquisition: "Привлечение"
};

export function GoalsModal({ open, onOpenChange }: GoalsModalProps) {
  const [goals, setGoals] = useState<Record<string, number>>(
    metricsGoals.reduce((acc, metric) => ({
      ...acc,
      [metric.id]: metric.targetValue
    }), {})
  );

  const [useAiRecommendations, setUseAiRecommendations] = useState(false);

  const handleGoalChange = (metricId: string, value: number) => {
    setGoals(prev => ({
      ...prev,
      [metricId]: value
    }));
  };

  const applyAiRecommendations = () => {
    const aiGoals = metricsGoals.reduce((acc, metric) => ({
      ...acc,
      [metric.id]: metric.aiRecommendation || metric.targetValue
    }), {});
    setGoals(aiGoals);
    setUseAiRecommendations(true);
  };

  const saveGoals = () => {
    // Сохраняем цели в localStorage
    localStorage.setItem('kpiGoals', JSON.stringify({
      set: true,
      goals,
      date: new Date().toISOString(),
      useAi: useAiRecommendations
    }));
    
    // Закрываем модалку
    onOpenChange(false);
    
    // Обновляем страницу для отображения изменений
    window.location.reload();
  };

  const resetToDefaults = () => {
    setGoals(
      metricsGoals.reduce((acc, metric) => ({
        ...acc,
        [metric.id]: metric.currentValue
      }), {})
    );
    setUseAiRecommendations(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            Установка KPI-целей
          </DialogTitle>
          <DialogDescription>
            Определите целевые показатели для отслеживания эффективности вашего казино
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* AI Рекомендации */}
          <Card className="border-primary/20 bg-gradient-to-r from-primary/5 to-purple-500/5">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-primary" />
                  AI Рекомендации
                </CardTitle>
                <Button
                  variant={useAiRecommendations ? "default" : "outline"}
                  size="sm"
                  onClick={applyAiRecommendations}
                >
                  {useAiRecommendations ? "Применено" : "Применить"}
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                На основе анализа вашей текущей производительности и лучших практик индустрии, 
                AI рекомендует оптимальные цели для достижения в ближайшие 30 дней.
              </p>
            </CardContent>
          </Card>

          {/* Метрики по категориям */}
          {Object.entries(categoryLabels).map(([category, label]) => {
            const categoryMetrics = metricsGoals.filter(m => m.category === category);
            if (categoryMetrics.length === 0) return null;

            return (
              <Card key={category}>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base flex items-center gap-2">
                    <Badge className={cn("px-2 py-0.5", categoryColors[category as keyof typeof categoryColors])}>
                      {label}
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {categoryMetrics.map((metric) => {
                    const Icon = metric.icon;
                    const currentGoal = goals[metric.id];
                    const progress = ((currentGoal - metric.currentValue) / metric.currentValue * 100).toFixed(1);
                    const isAiRecommended = useAiRecommendations && metric.aiRecommendation === currentGoal;

                    return (
                      <div key={metric.id} className="space-y-2">
                        <div className="flex items-start justify-between">
                          <div className="flex items-center gap-2">
                            <Icon className="h-4 w-4 text-muted-foreground" />
                            <div>
                              <Label className="text-sm font-medium">
                                {metric.name}
                              </Label>
                              <p className="text-xs text-muted-foreground">
                                {metric.description}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            {isAiRecommended && (
                              <Badge variant="secondary" className="text-xs">
                                AI
                              </Badge>
                            )}
                            <Badge 
                              variant={metric.priority === "high" ? "destructive" : 
                                      metric.priority === "medium" ? "default" : "secondary"}
                              className="text-xs"
                            >
                              {metric.priority === "high" ? "Высокий" : 
                               metric.priority === "medium" ? "Средний" : "Низкий"}
                            </Badge>
                          </div>
                        </div>

                        <div className="flex items-center gap-4">
                          <div className="flex-1 space-y-1">
                            <div className="flex items-center justify-between text-xs">
                              <span className="text-muted-foreground">
                                Текущее: {metric.unit}{metric.currentValue.toLocaleString()}
                              </span>
                              <span className="font-medium">
                                Цель: {metric.unit}{currentGoal.toLocaleString()}
                              </span>
                              <span className={cn(
                                "font-medium",
                                Number(progress) > 0 ? "text-green-600" : "text-orange-600"
                              )}>
                                {Number(progress) > 0 ? "+" : ""}{progress}%
                              </span>
                            </div>
                            <Slider
                              value={[currentGoal]}
                              onValueChange={([value]) => handleGoalChange(metric.id, value)}
                              min={metric.minValue}
                              max={metric.maxValue}
                              step={metric.step}
                              className="w-full"
                            />
                            {metric.aiRecommendation && (
                              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                <Sparkles className="h-3 w-3" />
                                <span>AI рекомендует: {metric.unit}{metric.aiRecommendation.toLocaleString()}</span>
                              </div>
                            )}
                          </div>
                          <Input
                            type="number"
                            value={currentGoal}
                            onChange={(e) => handleGoalChange(metric.id, Number(e.target.value))}
                            min={metric.minValue}
                            max={metric.maxValue}
                            step={metric.step}
                            className="w-24 text-sm"
                          />
                        </div>
                      </div>
                    );
                  })}
                </CardContent>
              </Card>
            );
          })}
        </div>

        <DialogFooter className="flex items-center justify-between">
          <Button variant="ghost" onClick={resetToDefaults}>
            Сбросить на текущие
          </Button>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Отмена
            </Button>
            <Button onClick={saveGoals}>
              <Save className="mr-2 h-4 w-4" />
              Сохранить цели
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}