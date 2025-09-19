"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import {
  RefreshCw,
  CheckCircle,
  XCircle,
  AlertCircle,
  Clock,
  HelpCircle,
  Download,
  ChevronRight,
  Info,
  AlertTriangle,
  Loader2,
  ExternalLink,
  Brain,
  ArrowLeft,
  Filter
} from "lucide-react";
import { cn } from "@/lib/utils";
import { safeRender, safeJoin } from "@/lib/safe-render";
import type { AuditSnapshot, AuditStatus, AuditChecklistItem } from "@/lib/audit-types";
import { mockAuditSnapshot, calculateProgress } from "@/lib/audit-data";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function AuditPage() {
  const router = useRouter();
  const [snapshot, setSnapshot] = useState<AuditSnapshot | null>(null);
  const [loading, setLoading] = useState(false);
  const [activeFilter, setActiveFilter] = useState<'all' | AuditStatus>('all');
  const [isPolling, setIsPolling] = useState(false);

  // Загрузка данных аудита
  useEffect(() => {
    loadAuditSnapshot();
  }, []);

  // Polling для обновления прогресса
  useEffect(() => {
    if (!snapshot) return;
    
    const hasRunningItems = snapshot.sections.some(s => 
      s.items.some(i => i.status === 'running')
    );
    
    if (hasRunningItems && !isPolling) {
      setIsPolling(true);
      const interval = setInterval(() => {
        loadAuditSnapshot();
      }, 3000); // Обновление каждые 3 секунды
      
      return () => {
        clearInterval(interval);
        setIsPolling(false);
      };
    }
  }, [snapshot, isPolling]);

  const loadAuditSnapshot = async () => {
    setLoading(true);
    try {
      // В реальном приложении здесь будет API запрос
      // const response = await fetch('/api/audit/status?projectId=...');
      // const data = await response.json();
      
      // Для демо используем моковые данные с симуляцией прогресса
      setTimeout(() => {
        const updatedSnapshot = { ...mockAuditSnapshot };
        
        // Симуляция обновления статусов running -> passed
        updatedSnapshot.sections = updatedSnapshot.sections.map(section => ({
          ...section,
          items: section.items.map(item => {
            if (item.status === 'running' && Math.random() > 0.7) {
              return { 
                ...item, 
                status: Math.random() > 0.3 ? 'passed' : 'failed' as AuditStatus,
                lastCheckedAt: new Date().toISOString()
              };
            }
            return item;
          })
        }));
        
        updatedSnapshot.overallProgressPct = calculateProgress(updatedSnapshot);
        setSnapshot(updatedSnapshot);
        setLoading(false);
      }, 500);
    } catch (error) {
      console.error('Failed to load audit snapshot:', error);
      setLoading(false);
    }
  };

  const handleRestartAudit = async () => {
    setLoading(true);
    // Сброс всех статусов на running
    const resetSnapshot = { ...mockAuditSnapshot };
    resetSnapshot.sections = resetSnapshot.sections.map(section => ({
      ...section,
      items: section.items.map(item => ({
        ...item,
        status: 'running' as AuditStatus,
        lastCheckedAt: undefined
      }))
    }));
    resetSnapshot.overallProgressPct = 0;
    setSnapshot(resetSnapshot);
    setLoading(false);
    
    // Запуск нового аудита
    setTimeout(() => loadAuditSnapshot(), 1000);
  };

  const getStatusIcon = (status: AuditStatus) => {
    switch (status) {
      case 'passed':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'failed':
        return <XCircle className="h-4 w-4 text-red-600" />;
      case 'missing':
        return <AlertTriangle className="h-4 w-4 text-orange-600" />;
      case 'running':
        return <Loader2 className="h-4 w-4 text-blue-600 animate-spin" />;
      case 'review':
        return <AlertCircle className="h-4 w-4 text-yellow-600" />;
    }
  };

  const getStatusBadge = (status: AuditStatus) => {
    const variants = {
      passed: 'bg-green-100 text-green-700 border-green-200',
      failed: 'bg-red-100 text-red-700 border-red-200',
      missing: 'bg-orange-100 text-orange-700 border-orange-200',
      running: 'bg-blue-100 text-blue-700 border-blue-200',
      review: 'bg-yellow-100 text-yellow-700 border-yellow-200'
    };

    const labels = {
      passed: 'Пройдено',
      failed: 'Провалено',
      missing: 'Отсутствует',
      running: 'В процессе',
      review: 'На проверке'
    };

    return (
      <Badge variant="outline" className={cn("text-xs", variants[status])}>
        {getStatusIcon(status)}
        <span className="ml-1">{labels[status]}</span>
      </Badge>
    );
  };

  const getFilteredItems = () => {
    if (!snapshot) return [];
    
    const allItems = snapshot.sections.flatMap(section => 
      section.items.map(item => ({ ...item, sectionTitle: section.title }))
    );
    
    if (activeFilter === 'all') return allItems;
    return allItems.filter(item => item.status === activeFilter);
  };

  const criticalFailures = snapshot?.sections
    .flatMap(s => s.items)
    .filter(i => snapshot.criticalIds.includes(i.id) && ['failed', 'missing'].includes(i.status));

  const formatLastChecked = (dateStr?: string) => {
    if (!dateStr) return 'Не проверялось';
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    
    if (diffMins < 1) return 'Только что';
    if (diffMins < 60) return `${diffMins} мин назад`;
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours} ч назад`;
    return date.toLocaleDateString('ru-RU');
  };

  // Статистика по статусам
  const getStatusStats = () => {
    if (!snapshot) return { passed: 0, failed: 0, missing: 0, running: 0, review: 0, total: 0 };
    
    const allItems = snapshot.sections.flatMap(s => s.items);
    return {
      passed: allItems.filter(i => i.status === 'passed').length,
      failed: allItems.filter(i => i.status === 'failed').length,
      missing: allItems.filter(i => i.status === 'missing').length,
      running: allItems.filter(i => i.status === 'running').length,
      review: allItems.filter(i => i.status === 'review').length,
      total: allItems.length
    };
  };

  const stats = getStatusStats();

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Заголовок */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => router.push('/')}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Назад
          </Button>
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-2">
              <Brain className="h-8 w-8 text-primary" />
              Проверка проекта (ИИ)
            </h1>
            <p className="text-muted-foreground mt-1">
              Система проверяет готовность подключения и корректность данных
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button 
            variant="outline"
            onClick={handleRestartAudit}
            disabled={loading}
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Перезапустить аудит
          </Button>
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Экспорт отчёта
          </Button>
        </div>
      </div>

      {loading && !snapshot ? (
        <Card>
          <CardContent className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </CardContent>
        </Card>
      ) : snapshot ? (
        <>
          {/* Прогресс и статистика */}
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Общий прогресс</CardTitle>
                <CardDescription>
                  Обновлено: {formatLastChecked(snapshot.updatedAt)}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium text-2xl">
                    {snapshot.overallProgressPct}%
                  </span>
                  <span className="text-muted-foreground">
                    проанализировано
                  </span>
                </div>
                <Progress value={snapshot.overallProgressPct} className="h-3" />
                <div className="text-xs text-muted-foreground">
                  {stats.total - stats.running} из {stats.total} проверок завершено
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Статистика проверок</CardTitle>
                <CardDescription>
                  Распределение по статусам
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">{stats.passed}</div>
                    <div className="text-xs text-muted-foreground">Пройдено</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-red-600">{stats.failed}</div>
                    <div className="text-xs text-muted-foreground">Провалено</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-orange-600">{stats.missing}</div>
                    <div className="text-xs text-muted-foreground">Отсутствует</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">{stats.running}</div>
                    <div className="text-xs text-muted-foreground">В процессе</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-yellow-600">{stats.review}</div>
                    <div className="text-xs text-muted-foreground">На проверке</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold">{stats.total}</div>
                    <div className="text-xs text-muted-foreground">Всего</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Критические проблемы */}
          {criticalFailures && criticalFailures.length > 0 && (
            <Alert className="border-red-200 bg-red-50">
              <AlertTriangle className="h-4 w-4 text-red-600" />
              <AlertDescription>
                <span className="font-medium text-red-900">Критические проблемы ({criticalFailures.length}):</span>
                <ul className="mt-2 space-y-1">
                  {criticalFailures.map(item => (
                    <li key={item.id} className="text-sm text-red-800">
                      <span>• <strong>{safeRender(item.title)}:</strong> {safeRender(item.aiNotes)}</span>
                    </li>
                  ))}
                </ul>
              </AlertDescription>
            </Alert>
          )}

          {/* Фильтры */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Filter className="h-4 w-4" />
                  Фильтры
                </CardTitle>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <HelpCircle className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <div className="text-xs space-y-1">
                        <p>Прогресс считается как процент завершённых проверок.</p>
                        <p>Проверки выполняются ИИ автоматически и обновляются в реальном времени.</p>
                      </div>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex gap-2 flex-wrap">
                <Button
                  variant={activeFilter === 'all' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setActiveFilter('all')}
                >
                  Все ({stats.total})
                </Button>
                <Button
                  variant={activeFilter === 'passed' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setActiveFilter('passed')}
                >
                  <CheckCircle className="h-3 w-3 mr-1" />
                  Пройдено ({stats.passed})
                </Button>
                <Button
                  variant={activeFilter === 'failed' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setActiveFilter('failed')}
                >
                  <XCircle className="h-3 w-3 mr-1" />
                  Провалено ({stats.failed})
                </Button>
                <Button
                  variant={activeFilter === 'missing' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setActiveFilter('missing')}
                >
                  <AlertTriangle className="h-3 w-3 mr-1" />
                  Отсутствует ({stats.missing})
                </Button>
                <Button
                  variant={activeFilter === 'running' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setActiveFilter('running')}
                >
                  <Loader2 className="h-3 w-3 mr-1" />
                  В процессе ({stats.running})
                </Button>
                <Button
                  variant={activeFilter === 'review' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setActiveFilter('review')}
                >
                  <AlertCircle className="h-3 w-3 mr-1" />
                  На проверке ({stats.review})
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Секции чек-листа */}
          <Accordion type="multiple" className="space-y-2" defaultValue={snapshot?.sections.map(s => s.id) || []}>
            {snapshot.sections.map(section => {
              const filteredItems = activeFilter === 'all' 
                ? section.items 
                : section.items.filter(i => i.status === activeFilter);
              
              if (filteredItems.length === 0) return null;
              
              return (
                <AccordionItem key={section.id} value={section.id} className="border rounded-lg">
                  <AccordionTrigger className="px-4 hover:no-underline">
                    <div className="flex items-center justify-between w-full">
                      <span className="font-medium">{section.title}</span>
                      <div className="flex items-center gap-2 mr-4">
                        {section.items.filter(i => i.status === 'passed').length > 0 && (
                          <Badge variant="outline" className="bg-green-50">
                            {section.items.filter(i => i.status === 'passed').length} пройдено
                          </Badge>
                        )}
                        {section.items.filter(i => i.status === 'failed').length > 0 && (
                          <Badge variant="outline" className="bg-red-50">
                            {section.items.filter(i => i.status === 'failed').length} провалено
                          </Badge>
                        )}
                        <span className="text-sm text-muted-foreground">
                          ({filteredItems.length} пунктов)
                        </span>
                      </div>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="px-4 pb-4">
                    <div className="space-y-3">
                      {filteredItems.map(item => (
                        <Card key={item.id} className="border-l-4" style={{
                          borderLeftColor: 
                            item.status === 'passed' ? '#16a34a' :
                            item.status === 'failed' ? '#dc2626' :
                            item.status === 'missing' ? '#ea580c' :
                            item.status === 'running' ? '#2563eb' : '#ca8a04'
                        }}>
                          <CardContent className="p-4">
                            <div className="space-y-3">
                              <div className="flex items-start justify-between">
                                <div className="space-y-1 flex-1">
                                  <div className="flex items-center gap-2">
                                    <span className="font-medium">{safeRender(item.id)}. {safeRender(item.title)}</span>
                                    {getStatusBadge(item.status)}
                                  </div>
                                  <p className="text-sm text-muted-foreground">
                                    {safeRender(item.shortDescription)}
                                  </p>
                                </div>
                              </div>

                              {item.aiNotes && (
                                <div className="flex items-start gap-2 p-2 bg-muted rounded-md">
                                  <Info className="h-4 w-4 text-primary mt-0.5" />
                                  <p className="text-xs">{safeRender(item.aiNotes)}</p>
                                </div>
                              )}

                              <div className="flex items-center justify-between text-xs text-muted-foreground">
                                <div className="flex items-center gap-4">
                                  <span>Источники: {safeJoin(item.dataSources, ', ')}</span>
                                  <span>Проверка: {safeRender(item.howWeCheckShort)}</span>
                                  {item.lastCheckedAt && (
                                    <span>Обновлено: {formatLastChecked(item.lastCheckedAt)}</span>
                                  )}
                                </div>
                              </div>

                              {item.fixes && item.fixes.length > 0 && (
                                <div className="flex gap-2">
                                  {item.fixes.map((fix, idx) => (
                                    <Button
                                      key={idx}
                                      size="sm"
                                      variant={idx === 0 ? "default" : "outline"}
                                      asChild
                                    >
                                      <Link href={fix.href}>
                                        <span className="inline-flex items-center">
                                          {safeRender(fix.label)}
                                          <ChevronRight className="ml-1 h-3 w-3" />
                                        </span>
                                      </Link>
                                    </Button>
                                  ))}
                                  {item.moreLink && (
                                    <Button size="sm" variant="ghost">
                                      <ExternalLink className="h-3 w-3 mr-1" />
                                      Подробнее
                                    </Button>
                                  )}
                                </div>
                              )}
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              );
            })}
          </Accordion>
        </>
      ) : (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <AlertCircle className="h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-lg font-medium mb-2">Аудит ещё не запускался</p>
            <p className="text-sm text-muted-foreground mb-4">
              Нажмите "Перезапустить аудит" чтобы начать проверку
            </p>
            <Button onClick={handleRestartAudit}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Запустить аудит
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}