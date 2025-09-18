"use client";

import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import {
  RefreshCw,
  X,
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
  ExternalLink
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { AuditSnapshot, AuditStatus, AuditChecklistItem } from "@/lib/audit-types";
import { mockAuditSnapshot, calculateProgress } from "@/lib/audit-data";
import Link from "next/link";

interface AuditModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AuditModal({ open, onOpenChange }: AuditModalProps) {
  const [snapshot, setSnapshot] = useState<AuditSnapshot | null>(null);
  const [loading, setLoading] = useState(false);
  const [activeFilter, setActiveFilter] = useState<'all' | AuditStatus>('all');
  const [isPolling, setIsPolling] = useState(false);

  // Загрузка данных аудита
  useEffect(() => {
    if (open) {
      loadAuditSnapshot();
    }
  }, [open]);

  // Polling для обновления прогресса
  useEffect(() => {
    if (!snapshot || !open) return;
    
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
  }, [snapshot, open, isPolling]);

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

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader className="flex flex-row items-center justify-between pr-10">
          <div>
            <DialogTitle className="text-xl font-semibold">
              Аудит проекта (ИИ)
            </DialogTitle>
            <p className="text-sm text-muted-foreground mt-1">
              Система проверяет готовность подключения и корректность данных
            </p>
          </div>
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              size="sm"
              onClick={handleRestartAudit}
              disabled={loading}
            >
              <RefreshCw className="h-4 w-4 mr-1" />
              Перезапустить
            </Button>
          </div>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto space-y-4 pr-2">
          {loading && !snapshot ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : snapshot ? (
            <>
              {/* Глобальный прогресс */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium">
                    {snapshot.overallProgressPct}% проанализировано
                  </span>
                  <span className="text-xs text-muted-foreground">
                    Обновлено: {formatLastChecked(snapshot.updatedAt)}
                  </span>
                </div>
                <Progress value={snapshot.overallProgressPct} className="h-2" />
              </div>

              {/* Критические проблемы */}
              {criticalFailures && criticalFailures.length > 0 && (
                <Alert className="border-red-200 bg-red-50">
                  <AlertTriangle className="h-4 w-4 text-red-600" />
                  <AlertDescription>
                    <span className="font-medium text-red-900">Критические проблемы:</span>
                    <ul className="mt-2 space-y-1">
                      {criticalFailures.map(item => (
                        <li key={item.id} className="text-sm text-red-800">
                          • {item.title}: {item.aiNotes}
                        </li>
                      ))}
                    </ul>
                  </AlertDescription>
                </Alert>
              )}

              {/* Фильтры */}
              <div className="flex gap-2">
                <Button
                  variant={activeFilter === 'all' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setActiveFilter('all')}
                >
                  Все
                </Button>
                <Button
                  variant={activeFilter === 'passed' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setActiveFilter('passed')}
                >
                  Пройдено
                </Button>
                <Button
                  variant={activeFilter === 'failed' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setActiveFilter('failed')}
                >
                  Провалено
                </Button>
                <Button
                  variant={activeFilter === 'missing' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setActiveFilter('missing')}
                >
                  Отсутствует
                </Button>
                <Button
                  variant={activeFilter === 'running' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setActiveFilter('running')}
                >
                  В процессе
                </Button>
                <Button
                  variant={activeFilter === 'review' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setActiveFilter('review')}
                >
                  На проверке
                </Button>
              </div>

              {/* Секции чек-листа */}
              <Accordion type="multiple" className="space-y-2">
                {snapshot.sections.map(section => {
                  const filteredItems = activeFilter === 'all' 
                    ? section.items 
                    : section.items.filter(i => i.status === activeFilter);
                  
                  if (filteredItems.length === 0) return null;
                  
                  return (
                    <AccordionItem key={section.id} value={section.id} className="border rounded-lg">
                      <AccordionTrigger className="px-4">
                        <div className="flex items-center gap-3">
                          <span className="font-medium">{section.title}</span>
                          <span className="text-sm text-muted-foreground">
                            ({filteredItems.length} пунктов)
                          </span>
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
                                    <div className="space-y-1">
                                      <div className="flex items-center gap-2">
                                        <span className="font-medium">{item.id}. {item.title}</span>
                                        {getStatusBadge(item.status)}
                                      </div>
                                      <p className="text-sm text-muted-foreground">
                                        {item.shortDescription}
                                      </p>
                                    </div>
                                  </div>

                                  {item.aiNotes && (
                                    <div className="flex items-start gap-2 p-2 bg-muted rounded-md">
                                      <Info className="h-4 w-4 text-primary mt-0.5" />
                                      <p className="text-xs">{item.aiNotes}</p>
                                    </div>
                                  )}

                                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                                    <div className="flex items-center gap-4">
                                      <span>Источники: {item.dataSources.join(', ')}</span>
                                      <span>Проверка: {item.howWeCheckShort}</span>
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
                                            {fix.label}
                                            <ChevronRight className="ml-1 h-3 w-3" />
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
            <div className="text-center py-12">
              <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-lg font-medium mb-2">Аудит ещё не запускался</p>
              <p className="text-sm text-muted-foreground mb-4">
                Нажмите "Перезапустить аудит" чтобы начать проверку
              </p>
              <Button onClick={handleRestartAudit}>
                <RefreshCw className="h-4 w-4 mr-2" />
                Запустить аудит
              </Button>
            </div>
          )}
        </div>

        <div className="flex items-center justify-between pt-4 border-t">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="sm">
                  <HelpCircle className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p className="text-xs">
                  Прогресс считается как процент завершённых проверок.<br />
                  Проверки выполняются ИИ автоматически и обновляются в реальном времени.
                </p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-1" />
              Экспорт отчёта
            </Button>
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Закрыть
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}