"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, Circle, ArrowRight, Settings, Target, Database, Rocket, Shield, Loader2, CheckCircle, AlertCircle, TrendingUp, Brain } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { GoalsModal } from "./goals-modal";
import { AuditModal } from "./audit-modal";

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
  const [auditRunning, setAuditRunning] = useState(false);
  const [auditCompleted, setAuditCompleted] = useState(false);
  const [auditResults, setAuditResults] = useState<any>(null);
  const [goalsModalOpen, setGoalsModalOpen] = useState(false);
  const [auditModalOpen, setAuditModalOpen] = useState(false);

  useEffect(() => {
    // Проверяем статус онбординга из localStorage
    const checkOnboardingStatus = () => {
      const integrationsData = localStorage.getItem('integrations');
      const projectData = localStorage.getItem('projectSettings');
      const goalsData = localStorage.getItem('kpiGoals');
      const auditData = localStorage.getItem('retentionAudit');

      const integrationsConnected = integrationsData ? JSON.parse(integrationsData).connected : false;
      const projectConfigured = projectData ? JSON.parse(projectData).configured : false;
      const goalsSet = goalsData ? JSON.parse(goalsData).set : false;
      const auditPassed = auditData ? JSON.parse(auditData).completed : false;
      
      if (auditData && JSON.parse(auditData).results) {
        setAuditResults(JSON.parse(auditData).results);
        setAuditCompleted(true);
      }

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
          href: '#',
          icon: Target,
          priority: 'recommended'
        },
        {
          id: 'audit',
          title: 'Проверка проекта (ИИ)',
          description: 'Система проверяет готовность подключения и корректность данных',
          completed: auditPassed,
          href: '#',
          icon: Brain,
          priority: 'recommended'
        }
      ]);
      setLoading(false);
    };

    checkOnboardingStatus();
  }, []);

  const runAudit = async () => {
    setAuditRunning(true);
    
    // Имитация анализа
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    const results = {
      totalSegments: 12,
      recommendedSegments: [
        'Игроки на грани оттока (не играли 7 дней)',
        'VIP без депозитов 14 дней',
        'Новички после первого депозита'
      ],
      communicationCoverage: 68,
      missingCommunication: [
        'Утренние игроки (6:00-10:00)',
        'Игроки с низким RTP'
      ],
      triggerCoverage: 45,
      recommendedTests: [
        'A/B тест welcome-бонусов',
        'Тестирование push vs email для VIP',
        'Оптимизация времени отправки'
      ]
    };
    
    setAuditResults(results);
    setAuditCompleted(true);
    setAuditRunning(false);
    
    // Сохраняем результаты
    localStorage.setItem('retentionAudit', JSON.stringify({
      completed: true,
      results,
      date: new Date().toISOString()
    }));
    
    // Обновляем шаги
    setSteps(prev => prev.map(step => 
      step.id === 'audit' ? { ...step, completed: true } : step
    ));
  };

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
                  step.id === 'audit' ? (
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => setAuditModalOpen(true)}
                    >
                      Проверка проекта
                      <ArrowRight className="ml-2 h-3 w-3" />
                    </Button>
                  ) : step.id === 'goals' ? (
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => setGoalsModalOpen(true)}
                    >
                      Настроить
                      <ArrowRight className="ml-2 h-3 w-3" />
                    </Button>
                  ) : (
                    <Button asChild variant="outline" size="sm">
                      <Link href={step.href}>
                        Настроить
                        <ArrowRight className="ml-2 h-3 w-3" />
                      </Link>
                    </Button>
                  )
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

        {auditCompleted && auditResults && (
          <div className="mt-4 p-4 rounded-lg bg-muted/50 space-y-3">
            <h4 className="font-semibold flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-600" />
              Результаты аудита retention структуры
            </h4>
            
            <div className="space-y-3 text-sm">
              <div className="border rounded-lg p-3 space-y-2">
                <div className="flex items-start gap-2">
                  <AlertCircle className="h-4 w-4 text-yellow-500 mt-0.5" />
                  <div className="flex-1">
                    <p className="font-medium">Сегментация: {auditResults.totalSegments} сегментов</p>
                    <p className="text-muted-foreground mb-2">Рекомендуем добавить:</p>
                    <div className="space-y-1">
                      {auditResults.recommendedSegments.map((segment: string, idx: number) => (
                        <div key={idx} className="flex items-center justify-between">
                          <span className="text-muted-foreground">• {segment}</span>
                          <Button size="sm" variant="ghost" className="h-7 px-2 text-xs" asChild>
                            <Link href={`/segments?action=create&name=${encodeURIComponent(segment)}&type=behavioral`}>
                              Создать
                              <ArrowRight className="ml-1 h-3 w-3" />
                            </Link>
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="border rounded-lg p-3 space-y-2">
                <div className="flex items-start gap-2">
                  <TrendingUp className="h-4 w-4 text-blue-500 mt-0.5" />
                  <div className="flex-1">
                    <p className="font-medium">Коммуникации покрывают {auditResults.communicationCoverage}% игроков</p>
                    <p className="text-muted-foreground mb-2">Добавить коммуникации для:</p>
                    <div className="space-y-1">
                      {auditResults.missingCommunication.map((comm: string, idx: number) => (
                        <div key={idx} className="flex items-center justify-between">
                          <span className="text-muted-foreground">• {comm}</span>
                          <Button size="sm" variant="ghost" className="h-7 px-2 text-xs" asChild>
                            <Link href={`/builder?action=create&audience=${encodeURIComponent(comm)}&type=retention`}>
                              Создать сценарий
                              <ArrowRight className="ml-1 h-3 w-3" />
                            </Link>
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="border rounded-lg p-3 space-y-2">
                <div className="flex items-start gap-2">
                  <Target className="h-4 w-4 text-purple-500 mt-0.5" />
                  <div className="flex-1">
                    <p className="font-medium">Триггеры покрывают {auditResults.triggerCoverage}% игроков</p>
                    <p className="text-muted-foreground mb-2">Рекомендуемые A/B тесты:</p>
                    <div className="space-y-1">
                      {auditResults.recommendedTests.map((test: string, idx: number) => (
                        <div key={idx} className="flex items-center justify-between">
                          <span className="text-muted-foreground">• {test}</span>
                          <Button size="sm" variant="ghost" className="h-7 px-2 text-xs" asChild>
                            <Link href={`/triggers?action=create&test=${encodeURIComponent(test)}&type=ab`}>
                              Создать тест
                              <ArrowRight className="ml-1 h-3 w-3" />
                            </Link>
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
        
      </CardContent>
      
      <GoalsModal 
        open={goalsModalOpen} 
        onOpenChange={(open) => {
          setGoalsModalOpen(open);
          if (!open) {
            // Обновляем статус после закрытия модалки
            const goalsData = localStorage.getItem('kpiGoals');
            const goalsSet = goalsData ? JSON.parse(goalsData).set : false;
            setSteps(prev => prev.map(step => 
              step.id === 'goals' ? { ...step, completed: goalsSet } : step
            ));
          }
        }}
      />
      
      <AuditModal
        open={auditModalOpen}
        onOpenChange={(open) => {
          setAuditModalOpen(open);
          if (!open) {
            // Обновляем статус после закрытия модалки
            const auditData = localStorage.getItem('projectAudit');
            const auditPassed = auditData ? JSON.parse(auditData).completed : false;
            setSteps(prev => prev.map(step => 
              step.id === 'audit' ? { ...step, completed: auditPassed } : step
            ));
          }
        }}
      />
    </Card>
  );
}