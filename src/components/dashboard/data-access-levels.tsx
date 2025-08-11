"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Check, Lock, Unlock, Database, Cable, ChartBar, Brain, Zap, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

const dataLevels = [
  {
    level: 1,
    title: "Ручная выгрузка данных",
    icon: Database,
    status: "active",
    description: "CSV/Excel отчеты",
    benefits: [
      "Быстрый старт без интеграции",
      "Базовые инсайты по сегментам",
      "Анализ эффективности кампаний"
    ],
    requirements: "Периодическая выгрузка маркетинговых отчетов"
  },
  {
    level: 2,
    title: "CRM API интеграция",
    icon: Cable,
    status: "active",
    description: "Real-time данные игроков",
    benefits: [
      "Автоматические триггеры",
      "Сегментация в реальном времени",
      "Welcome-воронки и реактивация"
    ],
    requirements: "API доступ к CRM или админке"
  },
  {
    level: 3,
    title: "Технические данные",
    icon: ChartBar,
    status: "active",
    description: "Устройства и каналы",
    benefits: [
      "Персонализация по устройствам",
      "Оптимизация каналов доставки",
      "Время отправки по часовым поясам"
    ],
    requirements: "Данные об устройствах и трафике"
  },
  {
    level: 4,
    title: "Продуктовая аналитика",
    icon: Brain,
    status: "active",
    description: "Игровое поведение",
    benefits: [
      "Продуктовые сегменты",
      "Персонализация бонусов по играм",
      "ROI оптимизация офферов"
    ],
    requirements: "История игровых сессий"
  },
  {
    level: 5,
    title: "Предиктивный AI модуль",
    icon: Zap,
    status: "locked",
    description: "Полная автоматизация",
    benefits: [
      "Прогнозы churn и LTV",
      "Autopilot для сегментов",
      "Гиперперсонализация"
    ],
    requirements: "Полный синхрон всех данных за 6-12 месяцев",
    special: true
  }
];

export function DataAccessLevels() {
  const [unlockedLevel5, setUnlockedLevel5] = useState(false);
  const completedPercent = 80; // пример прогресса интеграции

  const handleUnlock = () => {
    setUnlockedLevel5(true);
  };

  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-2xl">5 уровней интеграции данных</CardTitle>
            <CardDescription>
              Чем больше данных — тем точнее AI-рекомендации и выше ROI
            </CardDescription>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-36">
              <div className="h-2 w-full rounded-full bg-muted">
                <div className="h-2 rounded-full bg-primary" style={{ width: `${completedPercent}%` }} />
              </div>
              <div className="mt-1 text-xs text-muted-foreground">Прогресс {completedPercent}%</div>
            </div>
            <Badge variant="secondary" className="px-3 py-1">
              <Database className="mr-1 h-3 w-3" />
              Уровень 4/5
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-4">
          {dataLevels.map((item) => {
            const Icon = item.icon;
            const isLocked = item.status === "locked" && !unlockedLevel5;
            const isLevel5 = item.level === 5;
            
            return (
              <div
                key={item.level}
                className={cn(
                  "relative rounded-lg border p-4 transition-all",
                  isLocked ? "border-muted bg-muted/30" : "border-primary/5 bg-gradient-to-r from-primary/5 to-background",
                  isLevel5 && unlockedLevel5 && "border-green-500 bg-green-50 animate-pulse-once"
                )}
              >
                <div className="flex items-start gap-4">
                  <div className={cn(
                    "flex h-12 w-12 items-center justify-center rounded-lg",
                    isLocked ? "bg-muted" : "bg-primary/10"
                  )}>
                    {isLocked ? (
                      <Lock className="h-6 w-6 text-muted-foreground" />
                    ) : (
                      <Icon className={cn(
                        "h-6 w-6",
                        isLevel5 && unlockedLevel5 ? "text-green-600" : "text-primary"
                      )} />
                    )}
                  </div>
                  
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-2">
                      <h3 className={cn(
                        "font-semibold",
                        isLocked && "text-muted-foreground"
                      )}>
                        Уровень {item.level}: {item.title}
                      </h3>
                      {item.special && (
                        <Badge variant={isLocked ? "outline" : "default"} className="ml-2">
                          {isLocked ? "Требуется уровень 4" : "Разблокировано!"}
                        </Badge>
                      )}
                    </div>
                    
                    <p className={cn(
                      "text-sm",
                      isLocked ? "text-muted-foreground" : "text-muted-foreground"
                    )}>
                      {item.description}
                    </p>
                    
                    <div className="flex flex-wrap gap-2 pt-2">
                      {item.benefits.map((benefit, idx) => (
                        <div
                          key={idx}
                          className={cn(
                            "flex items-center gap-1 text-xs",
                            isLocked ? "text-muted-foreground" : "text-primary"
                          )}
                        >
                          <Check className="h-3 w-3" />
                          <span>{benefit}</span>
                        </div>
                      ))}
                    </div>
                    
                    <div className="pt-2">
                      <p className="text-xs text-muted-foreground">
                        <span className="font-medium">Требуется:</span> {item.requirements}
                      </p>
                    </div>
                  </div>
                  
                  {item.level < 5 && (
                    <Check className="h-5 w-5 text-green-600" />
                  )}
                  
                  {isLevel5 && isLocked && (
                    <Button
                      size="sm"
                      variant="default"
                      onClick={handleUnlock}
                      className="animate-pulse"
                    >
                      <Unlock className="mr-1 h-4 w-4" />
                      Разблокировать
                    </Button>
                  )}
                  
                  {isLevel5 && unlockedLevel5 && (
                    <Button size="sm" variant="default" className="bg-green-600 hover:bg-green-700">
                      Активировано
                      <ArrowRight className="ml-1 h-4 w-4" />
                    </Button>
                  )}
                </div>
                
                {isLevel5 && unlockedLevel5 && (
                  <div className="mt-4 rounded-lg bg-green-100 p-4 border border-green-200">
                    <h4 className="font-semibold text-green-900 mb-2">
                      🎉 Предиктивный AI модуль разблокирован!
                    </h4>
                    <p className="text-sm text-green-800 mb-3">
                      Теперь доступны 3 сценария развития ваших метрик:
                    </p>
                    <div className="grid grid-cols-3 gap-2">
                      <div className="text-center p-2 bg-white rounded border border-green-300">
                        <div className="text-xs font-medium text-green-700">Текущий тренд</div>
                        <div className="text-lg font-bold text-red-600">-15%</div>
                        <div className="text-xs text-muted-foreground">за 3 месяца</div>
                      </div>
                      <div className="text-center p-2 bg-white rounded border border-green-300">
                        <div className="text-xs font-medium text-green-700">С оптимизацией</div>
                        <div className="text-lg font-bold text-yellow-600">+5%</div>
                        <div className="text-xs text-muted-foreground">за 3 месяца</div>
                      </div>
                      <div className="text-center p-2 bg-white rounded border border-green-300">
                        <div className="text-xs font-medium text-green-700">Идеальный</div>
                        <div className="text-lg font-bold text-green-600">+25%</div>
                        <div className="text-xs text-muted-foreground">за 3 месяца</div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
        
        <div className="mt-6 p-4 rounded-lg bg-muted/50 border border-muted">
          <p className="text-sm text-muted-foreground">
            <span className="font-medium">💡 Совет:</span> Каждый новый уровень данных увеличивает точность AI-рекомендаций на 15-20% и ROI кампаний на 10-30%
          </p>
        </div>
      </CardContent>
    </Card>
  );
}