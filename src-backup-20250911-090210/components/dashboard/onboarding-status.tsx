"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, Circle, ArrowRight, Settings, Target, Database, Rocket } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface OnboardingStep {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  href: string;
  icon: React.ElementType;
  priority: "required" | "recommended" | "optional";
}

export function OnboardingStatus() {
  const [steps, setSteps] = useState<OnboardingStep[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Проверяем статус онбординга из localStorage
    const checkOnboardingStatus = () => {
      const integrationsData = localStorage.getItem('integrations');
      const projectData = localStorage.getItem('projectSettings');
      const goalsData = localStorage.getItem('kpiGoals');
      const analyticsFilters = localStorage.getItem('analyticsFilters');

      const integrationsConnected = integrationsData ? JSON.parse(integrationsData).connected : false;
      const projectConfigured = projectData ? JSON.parse(projectData).configured : false;
      const goalsSet = goalsData ? JSON.parse(goalsData).set : false;

      setSteps([
        {
          id: 'integrations',
          title: 'Интеграция данных',
          description: 'Подключите источники данных для анализа',
          completed: integrationsConnected,
          href: '/settings?tab=integrations',
          icon: Database,
          priority: 'required'
        },
        {
          id: 'project',
          title: 'Настройка проекта',
          description: 'Укажите информацию о вашем казино',
          completed: projectConfigured,
          href: '/settings?tab=project',
          icon: Settings,
          priority: 'required'
        },
        {
          id: 'goals',
          title: 'Постановка KPI-целей',
          description: 'Определите целевые показатели',
          completed: goalsSet,
          href: '/analytics?showGoals=true',
          icon: Target,
          priority: 'recommended'
        }
      ]);
      setLoading(false);
    };

    checkOnboardingStatus();
  }, []);

  const completedSteps = steps.filter(s => s.completed).length;
  const totalSteps = steps.length;
  const progress = totalSteps > 0 ? (completedSteps / totalSteps) * 100 : 0;
  const allCompleted = completedSteps === totalSteps;

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="animate-pulse space-y-3">
            <div className="h-4 bg-muted rounded w-1/3"></div>
            <div className="h-2 bg-muted rounded"></div>
            <div className="space-y-2">
              <div className="h-8 bg-muted rounded"></div>
              <div className="h-8 bg-muted rounded"></div>
              <div className="h-8 bg-muted rounded"></div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={cn(
      "transition-all",
      allCompleted ? "border-green-200 bg-green-50/30" : "border-yellow-200 bg-yellow-50/30"
    )}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Rocket className="h-5 w-5" />
              Быстрый старт
            </CardTitle>
            <CardDescription>
              {allCompleted 
                ? "Отлично! Система полностью настроена и готова к работе"
                : `Завершите настройку для полноценной работы (${completedSteps}/${totalSteps})`
              }
            </CardDescription>
          </div>
          <Badge variant={allCompleted ? "default" : "secondary"}>
            {Math.round(progress)}% готово
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <Progress value={progress} className="h-2" />
        
        <div className="space-y-3">
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <div 
                key={step.id} 
                className={cn(
                  "flex items-center justify-between p-3 rounded-lg border transition-all",
                  step.completed 
                    ? "bg-green-50/50 border-green-200" 
                    : "bg-white hover:bg-muted/50 border-border"
                )}
              >
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2">
                    {step.completed ? (
                      <CheckCircle2 className="h-5 w-5 text-green-600" />
                    ) : (
                      <Circle className="h-5 w-5 text-muted-foreground" />
                    )}
                    <span className="text-sm font-medium text-muted-foreground">
                      {index + 1}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Icon className={cn(
                      "h-4 w-4",
                      step.completed ? "text-green-600" : "text-muted-foreground"
                    )} />
                    <div>
                      <div className="flex items-center gap-2">
                        <span className={cn(
                          "font-medium",
                          step.completed && "text-green-900"
                        )}>
                          {step.title}
                        </span>
                        {step.priority === "required" && !step.completed && (
                          <Badge variant="destructive" className="text-xs">
                            Обязательно
                          </Badge>
                        )}
                        {step.priority === "recommended" && !step.completed && (
                          <Badge variant="secondary" className="text-xs">
                            Рекомендуется
                          </Badge>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {step.description}
                      </p>
                    </div>
                  </div>
                </div>
                {!step.completed && (
                  <Button asChild variant="outline" size="sm">
                    <Link href={step.href}>
                      Настроить
                      <ArrowRight className="ml-2 h-3 w-3" />
                    </Link>
                  </Button>
                )}
                {step.completed && (
                  <Badge variant="outline" className="text-green-600 border-green-300">
                    Готово
                  </Badge>
                )}
              </div>
            );
          })}
        </div>

        {!allCompleted && (
          <div className="pt-2">
            <Button asChild className="w-full">
              <Link href={steps.find(s => !s.completed)?.href || '/settings'}>
                Продолжить настройку
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}