"use client";

import * as React from 'react';
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { segmentsData } from "@/lib/mock-data";
import {
  Bot, Copy, Pencil, PlusCircle, Trash2, X, Filter, Eye, Play,
  Save, Download, Plus, Minus, Move, Grip, Settings,
  ChevronDown, ChevronRight, Users, BarChart3, Target,
  Layers, Zap, Shield, Brain, Euro, Calendar, Hash,
  TrendingUp, TrendingDown, Calculator, Merge, GitBranch, Sparkles
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { cn } from "@/lib/utils";
import { AiSegmentsTab, convertAISegmentToBuilder, type AISegment } from "@/components/segments/ai-segments-tab";
import { AdvancedSegmentOperations, type SegmentOperation, type BaseSegment } from "@/components/segments/advanced-segment-operations";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { SectionOnboarding } from "@/components/onboarding/section-onboarding";
import { SEGMENTS_ONBOARDING } from "@/lib/onboarding-configs";

import type { 
  SegmentData, 
  SegmentBuilder, 
  SegmentCondition, 
  SegmentConditionGroup, 
  SegmentParameter,
  SegmentOperator,
  SegmentPreview,
  SegmentTemplate
} from '@/lib/types';

import { 
  segmentParameters, 
  operatorsByType, 
  parameterGroupLabels, 
  operatorLabels,
  segmentTemplates 
} from '@/lib/segment-builder-data';

export default function SegmentsPage() {
  const [isAdvancedBuilderOpen, setIsAdvancedBuilderOpen] = React.useState(false);
  const [selectedSegment, setSelectedSegment] = React.useState<SegmentData | null>(null);
  const [defaultTab, setDefaultTab] = React.useState("builder");
  const [activeMainTab, setActiveMainTab] = React.useState("library");
  const [isOperationsOpen, setIsOperationsOpen] = React.useState(false);
  const [operationBaseSegment, setOperationBaseSegment] = React.useState<BaseSegment | null>(null);
  const [isOnboardingOpen, setIsOnboardingOpen] = useState(false);

  // Обработчики для AI-сегментов
  const handleCreateAISegment = (aiSegment: AISegment) => {
    const segmentBuilder = convertAISegmentToBuilder(aiSegment);
    setSelectedSegment(null);
    setDefaultTab("builder");
    setIsAdvancedBuilderOpen(true);
    // Устанавливаем предзаполненные данные через ref или состояние
    setPredefinedSegment(segmentBuilder);
  };

  const handleViewAISegmentDetails = (aiSegment: AISegment) => {
    const segmentBuilder = convertAISegmentToBuilder(aiSegment);
    setSelectedSegment(null);
    setDefaultTab("builder");
    setIsAdvancedBuilderOpen(true);
    // Устанавливаем предзаполненные данные
    setPredefinedSegment(segmentBuilder);
  };

  const [predefinedSegment, setPredefinedSegment] = React.useState<SegmentBuilder | null>(null);

  // Обработчик сохранения операции
  const handleOperationSave = (operation: SegmentOperation) => {
    console.log('Saving segment operation:', operation);
    // Здесь будет логика создания нового сегмента на основе операции
    // Можно добавить API вызов или обновление состояния
  };

  // Преобразование данных сегмента для операций
  const availableSegmentsForOperations: BaseSegment[] = segmentsData.map(s => ({
    id: s.id,
    name: s.name,
    playerCount: s.playerCount,
    description: s.description
  }));

  return (
    <div className="flex flex-col gap-6 p-4 md:p-6 lg:p-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Сегменты</h1>
          <p className="text-muted-foreground">
            Создание и управление сегментами пользователей для CRM-кампаний.
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            onClick={() => setIsOnboardingOpen(true)}
            className="flex items-center gap-2"
            variant="outline"
          >
            <Sparkles className="h-4 w-4" />
            Как работать с разделом
          </Button>
          <Button
            variant="outline"
            onClick={() => {
              setOperationBaseSegment(null);
              setIsOperationsOpen(true);
            }}
          >
            <Calculator className="mr-2 h-4 w-4" />
            Операции с сегментами
          </Button>
          <Button onClick={() => {
            setSelectedSegment(null);
            setDefaultTab(activeMainTab === "constructor" ? "ai-templates" : "builder");
            setIsAdvancedBuilderOpen(true);
          }}>
            <PlusCircle className="mr-2 h-4 w-4" />
            Создать сегмент
          </Button>
        </div>
      </div>

      {/* Main Tabs */}
      <Tabs value={activeMainTab} onValueChange={setActiveMainTab}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="library">
            <Layers className="mr-2 h-4 w-4" />
            Библиотека
          </TabsTrigger>
          <TabsTrigger value="constructor">
            <Settings className="mr-2 h-4 w-4" />
            Конструктор
          </TabsTrigger>
        </TabsList>

        <TabsContent value="library" className="space-y-6">
          {/* Filters */}
          <Card>
            <CardHeader>
              <CardTitle>
                <Filter className="mr-2 h-5 w-5 inline" />
                Фильтры
              </CardTitle>
            </CardHeader>
            <CardContent>
              <SegmentFilters />
            </CardContent>
          </Card>

          {/* Segments Table */}
          <Card>
            <CardHeader>
              <CardTitle>Список сегментов</CardTitle>
              <CardDescription>
                Все доступные сегменты пользователей.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Название</TableHead>
                    <TableHead>Описание</TableHead>
                    <TableHead>Игроков</TableHead>
                    <TableHead>Прирост/Отток за 30д</TableHead>
                    <TableHead>Средний депозит</TableHead>
                    <TableHead>Ранрейт до цели</TableHead>
                    <TableHead>Дата создания</TableHead>
                    <TableHead>Автор</TableHead>
                    <TableHead>Действия</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {segmentsData.map((segment) => (
                    <TableRow key={segment.id}>
                      <TableCell className="font-medium">{segment.name}</TableCell>
                      <TableCell className="max-w-md">
                        <p className="text-sm text-muted-foreground truncate">
                          {segment.description}
                        </p>
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary">
                          {segment.playerCount.toLocaleString()}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          {segment.growthChurn30d !== undefined && (
                            <>
                              {segment.growthChurn30d > 0 ? (
                                <TrendingUp className="h-4 w-4 text-green-600" />
                              ) : (
                                <TrendingDown className="h-4 w-4 text-red-600" />
                              )}
                              <span className={cn(
                                "font-medium",
                                segment.growthChurn30d > 0 ? "text-green-600" : "text-red-600"
                              )}>
                                {segment.growthChurn30d > 0 ? '+' : ''}{segment.growthChurn30d}%
                              </span>
                            </>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        {segment.avgDeposit !== undefined ? (
                          <div className="flex items-center gap-1">
                            <Euro className="h-3 w-3 text-muted-foreground" />
                            <span className="font-medium">{segment.avgDeposit}</span>
                          </div>
                        ) : '—'}
                      </TableCell>
                      <TableCell>
                        {segment.runRateToTarget !== undefined ? (
                          <div className="flex items-center gap-2">
                            <div className="flex-1 bg-gray-200 rounded-full h-2 max-w-[100px]">
                              <div 
                                className={cn(
                                  "h-2 rounded-full",
                                  segment.runRateToTarget >= 80 ? "bg-green-500" :
                                  segment.runRateToTarget >= 50 ? "bg-yellow-500" :
                                  "bg-red-500"
                                )}
                                style={{ width: `${segment.runRateToTarget}%` }}
                              />
                            </div>
                            <span className="text-sm font-medium">{segment.runRateToTarget}%</span>
                          </div>
                        ) : '—'}
                      </TableCell>
                      <TableCell>{segment.createdAt}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {segment.createdBy === 'AI' ? (
                            <Badge variant="outline" className="text-blue-600">
                              <Bot className="mr-1 h-3 w-3" />
                              AI
                            </Badge>
                          ) : (
                            <Badge variant="outline">Пользователь</Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button variant="ghost" size="icon">
                                  <Eye className="h-4 w-4" />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>Просмотреть</TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                          
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <GitBranch className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuLabel>Операции с сегментом</DropdownMenuLabel>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                onClick={() => {
                                  setSelectedSegment(segment);
                                  setIsAdvancedBuilderOpen(true);
                                }}
                              >
                                <Pencil className="mr-2 h-4 w-4" />
                                Редактировать
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => {
                                  // Копирование с изменением
                                  setSelectedSegment(segment);
                                  setDefaultTab("builder");
                                  setIsAdvancedBuilderOpen(true);
                                }}
                              >
                                <Copy className="mr-2 h-4 w-4" />
                                Дублировать и изменить
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                onClick={() => {
                                  setOperationBaseSegment({
                                    id: segment.id,
                                    name: segment.name,
                                    playerCount: segment.playerCount,
                                    description: segment.description
                                  });
                                  setIsOperationsOpen(true);
                                }}
                              >
                                <Merge className="mr-2 h-4 w-4" />
                                Объединить с другими
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => {
                                  setOperationBaseSegment({
                                    id: segment.id,
                                    name: segment.name,
                                    playerCount: segment.playerCount,
                                    description: segment.description
                                  });
                                  setIsOperationsOpen(true);
                                }}
                              >
                                <Minus className="mr-2 h-4 w-4" />
                                Исключить из этого
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => {
                                  setOperationBaseSegment({
                                    id: segment.id,
                                    name: segment.name,
                                    playerCount: segment.playerCount,
                                    description: segment.description
                                  });
                                  setIsOperationsOpen(true);
                                }}
                              >
                                <Calculator className="mr-2 h-4 w-4" />
                                Расширенные операции
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem className="text-red-600">
                                <Trash2 className="mr-2 h-4 w-4" />
                                Удалить
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="constructor" className="space-y-6">
          {/* AI рекомендации */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bot className="h-5 w-5" />
                Рекомендации ИИ
              </CardTitle>
              <CardDescription>
                Сегменты, созданные на основе анализа поведения игроков
              </CardDescription>
            </CardHeader>
            <CardContent>
              <AiSegmentsTab 
                onCreateSegment={handleCreateAISegment}
                onViewDetails={handleViewAISegmentDetails}
              />
            </CardContent>
          </Card>

          {/* Шаблоны */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Copy className="h-5 w-5" />
                Шаблоны сегментов
              </CardTitle>
              <CardDescription>
                Готовые шаблоны для быстрого создания сегментов
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {segmentTemplates.slice(0, 6).map((template) => (
                  <Card 
                    key={template.id}
                    className="cursor-pointer hover:shadow-lg transition-shadow"
                    onClick={() => {
                      setPredefinedSegment(template.builder);
                      setDefaultTab("builder");
                      setIsAdvancedBuilderOpen(true);
                    }}
                  >
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm">{template.name}</CardTitle>
                      <Badge variant="outline" className="w-fit">{template.category}</Badge>
                    </CardHeader>
                    <CardContent>
                      <p className="text-xs text-muted-foreground">{template.description}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
              <Button 
                variant="outline" 
                className="w-full mt-4"
                onClick={() => {
                  setDefaultTab("templates");
                  setIsAdvancedBuilderOpen(true);
                }}
              >
                Посмотреть все шаблоны
              </Button>
            </CardContent>
          </Card>

          {/* Быстрый конструктор */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5" />
                Быстрый конструктор
              </CardTitle>
              <CardDescription>
                Создайте сегмент с нуля используя конструктор условий
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button 
                className="w-full"
                onClick={() => {
                  setSelectedSegment(null);
                  setPredefinedSegment(null);
                  setDefaultTab("builder");
                  setIsAdvancedBuilderOpen(true);
                }}
              >
                <PlusCircle className="mr-2 h-4 w-4" />
                Открыть конструктор
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Advanced Segment Builder */}
      <AdvancedSegmentBuilder 
        open={isAdvancedBuilderOpen}
        onOpenChange={setIsAdvancedBuilderOpen}
        segment={selectedSegment}
        defaultTab={defaultTab}
        predefinedSegment={predefinedSegment}
        onClearPredefined={() => setPredefinedSegment(null)}
      />

      {/* Advanced Segment Operations */}
      <AdvancedSegmentOperations
        open={isOperationsOpen}
        onOpenChange={setIsOperationsOpen}
        availableSegments={availableSegmentsForOperations}
        baseSegment={operationBaseSegment}
        onSave={handleOperationSave}
      />

      {/* Section Onboarding */}
      <SectionOnboarding
        open={isOnboardingOpen}
        onOpenChange={setIsOnboardingOpen}
        steps={SEGMENTS_ONBOARDING}
        sectionName="Сегменты"
      />
    </div>
  );
}

// Advanced Segment Builder Component
function AdvancedSegmentBuilder({ 
  open, 
  onOpenChange, 
  segment,
  defaultTab,
  predefinedSegment,
  onClearPredefined
}: { 
  open: boolean; 
  onOpenChange: (open: boolean) => void; 
  segment: SegmentData | null; 
  defaultTab: string;
  predefinedSegment?: SegmentBuilder | null;
  onClearPredefined?: () => void;
}) {
  const [segmentBuilder, setSegmentBuilder] = React.useState<SegmentBuilder>({
    name: segment?.name || '',
    description: segment?.description || '',
    rootGroup: {
      id: 'root',
      type: 'AND',
      conditions: []
    }
  });

  const [preview, setPreview] = React.useState<SegmentPreview>({ count: 0, percentage: 0 });
  const [activeTab, setActiveTab] = React.useState(defaultTab);
  const [selectedTemplate, setSelectedTemplate] = React.useState<string>('');

  // Reset state when dialog opens/closes
  React.useEffect(() => {
    if (open) {
      setActiveTab(defaultTab);
      if (predefinedSegment) {
        // Используем предзаполненные данные из AI-сегмента
        setSegmentBuilder(predefinedSegment);
        setPreview({ count: 0, percentage: 0 });
      } else if (!segment) {
        setSegmentBuilder({
          name: '',
          description: '',
          rootGroup: {
            id: 'root',
            type: 'AND',
            conditions: []
          }
        });
        setPreview({ count: 0, percentage: 0 });
      }
    } else {
      // Очищаем предзаполненные данные при закрытии
      onClearPredefined?.();
    }
  }, [open, segment, defaultTab, predefinedSegment, onClearPredefined]);

  const updateSegmentName = (name: string) => {
    setSegmentBuilder(prev => ({ ...prev, name }));
  };

  const updateSegmentDescription = (description: string) => {
    setSegmentBuilder(prev => ({ ...prev, description }));
  };

  const addCondition = (groupId: string) => {
    const newCondition: SegmentCondition = {
      id: `condition_${Date.now()}`,
      parameter: '',
      operator: 'equals',
      value: ''
    };

    setSegmentBuilder(prev => ({
      ...prev,
      rootGroup: addConditionToGroup(prev.rootGroup, groupId, newCondition)
    }));
  };

  const addConditionGroup = (parentGroupId: string) => {
    const newGroup: SegmentConditionGroup = {
      id: `group_${Date.now()}`,
      type: 'AND',
      conditions: []
    };

    setSegmentBuilder(prev => ({
      ...prev,
      rootGroup: addConditionToGroup(prev.rootGroup, parentGroupId, newGroup)
    }));
  };

  const addConditionToGroup = (
    group: SegmentConditionGroup, 
    targetGroupId: string, 
    newItem: SegmentCondition | SegmentConditionGroup
  ): SegmentConditionGroup => {
    if (group.id === targetGroupId) {
      return {
        ...group,
        conditions: [...group.conditions, newItem]
      };
    }

    return {
      ...group,
      conditions: group.conditions.map(condition => {
        if ('type' in condition) {
          return addConditionToGroup(condition, targetGroupId, newItem);
        }
        return condition;
      })
    };
  };

  const removeCondition = (conditionId: string) => {
    setSegmentBuilder(prev => ({
      ...prev,
      rootGroup: removeConditionFromGroup(prev.rootGroup, conditionId)
    }));
  };

  const removeConditionFromGroup = (
    group: SegmentConditionGroup,
    conditionId: string
  ): SegmentConditionGroup => {
    return {
      ...group,
      conditions: group.conditions
        .filter(condition => condition.id !== conditionId)
        .map(condition => {
          if ('type' in condition) {
            return removeConditionFromGroup(condition, conditionId);
          }
          return condition;
        })
    };
  };

  const updateCondition = (conditionId: string, updates: Partial<SegmentCondition>) => {
    setSegmentBuilder(prev => ({
      ...prev,
      rootGroup: updateConditionInGroup(prev.rootGroup, conditionId, updates)
    }));
  };

  const updateConditionInGroup = (
    group: SegmentConditionGroup,
    conditionId: string,
    updates: Partial<SegmentCondition>
  ): SegmentConditionGroup => {
    return {
      ...group,
      conditions: group.conditions.map(condition => {
        if (condition.id === conditionId && !('type' in condition)) {
          return { ...condition, ...updates };
        }
        if ('type' in condition) {
          return updateConditionInGroup(condition, conditionId, updates);
        }
        return condition;
      })
    };
  };

  const previewSegment = () => {
    // Mock preview calculation
    const mockCount = Math.floor(Math.random() * 10000) + 100;
    const totalPlayers = 50000; // Mock total players
    setPreview({
      count: mockCount,
      percentage: (mockCount / totalPlayers) * 100,
      breakdown: {
        'Germany': Math.floor(mockCount * 0.4),
        'Russia': Math.floor(mockCount * 0.3),
        'UK': Math.floor(mockCount * 0.2),
        'France': Math.floor(mockCount * 0.1),
      }
    });
  };

  const saveSegment = () => {
    console.log('Saving segment:', segmentBuilder);
    // Mock save operation
    onOpenChange(false);
  };

  const loadTemplate = (templateId: string) => {
    const template = segmentTemplates.find(t => t.id === templateId);
    if (template) {
      setSegmentBuilder(template.builder);
      setSelectedTemplate(templateId);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-7xl max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            {segment ? 'Редактирование сегмента' : 'Создание сегмента'}
          </DialogTitle>
          <DialogDescription>
            Используйте расширенный конструктор для создания точных сегментов игроков
          </DialogDescription>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="ai-templates">
                <div className="flex items-center gap-2">
                    <Bot className="h-4 w-4" />
                    <span>Сегменты от ИИ</span>
                    <Badge variant="secondary" className="text-xs">New</Badge>
                </div>
            </TabsTrigger>
            <TabsTrigger value="templates">Шаблоны</TabsTrigger>
            <TabsTrigger value="builder">Конструктор</TabsTrigger>
            <TabsTrigger value="preview">Предпросмотр</TabsTrigger>
          </TabsList>

          <TabsContent value="ai-templates" className="flex-1 overflow-hidden">
            <ScrollArea className="h-[500px]">
              <AiSegmentsTab 
                onCreateSegment={(aiSegment) => {
                  const segmentBuilder = convertAISegmentToBuilder(aiSegment);
                  setSegmentBuilder(segmentBuilder);
                  setActiveTab("builder");
                }}
                onViewDetails={(aiSegment) => {
                  const segmentBuilder = convertAISegmentToBuilder(aiSegment);
                  setSegmentBuilder(segmentBuilder);
                  setActiveTab("builder");
                }}
              />
            </ScrollArea>
          </TabsContent>

          <TabsContent value="templates" className="flex-1">
            <SegmentTemplatesTab 
              templates={segmentTemplates}
              selectedTemplate={selectedTemplate}
              onLoadTemplate={loadTemplate}
            />
          </TabsContent>

          <TabsContent value="builder" className="flex-1">
            <SegmentBuilderTab 
              segmentBuilder={segmentBuilder}
              onUpdateName={updateSegmentName}
              onUpdateDescription={updateSegmentDescription}
              onAddCondition={addCondition}
              onAddConditionGroup={addConditionGroup}
              onRemoveCondition={removeCondition}
              onUpdateCondition={updateCondition}
              onPreview={previewSegment}
            />
          </TabsContent>

          <TabsContent value="preview" className="flex-1">
            <SegmentPreviewTab 
              preview={preview}
              segmentBuilder={segmentBuilder}
              onRefresh={previewSegment}
            />
          </TabsContent>
        </Tabs>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Отмена
          </Button>
          <Button onClick={previewSegment} variant="outline">
            <Eye className="mr-2 h-4 w-4" />
            Предпросмотр
          </Button>
          <Button onClick={saveSegment}>
            <Save className="mr-2 h-4 w-4" />
            Сохранить сегмент
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// Segment Templates Tab
function SegmentTemplatesTab({
  templates,
  selectedTemplate,
  onLoadTemplate
}: {
  templates: SegmentTemplate[];
  selectedTemplate: string;
  onLoadTemplate: (templateId: string) => void;
}) {
  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-semibold">Готовые шаблоны</h3>
        <p className="text-sm text-muted-foreground">
          Выберите шаблон для быстрого создания сегмента
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {templates.map((template) => (
          <Card 
            key={template.id} 
            className={cn(
              "cursor-pointer transition-colors hover:bg-muted/50",
              selectedTemplate === template.id && "ring-2 ring-primary"
            )}
            onClick={() => onLoadTemplate(template.id)}
          >
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm">{template.name}</CardTitle>
                <Badge variant="outline">{template.category}</Badge>
              </div>
              <CardDescription className="text-xs">
                {template.description}
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>Использований: {template.usageCount}</span>
                <span>{new Date(template.createdAt).toLocaleDateString('ru-RU')}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

// Segment Builder Tab
function SegmentBuilderTab({
  segmentBuilder,
  onUpdateName,
  onUpdateDescription,
  onAddCondition,
  onAddConditionGroup,
  onRemoveCondition,
  onUpdateCondition,
  onPreview
}: {
  segmentBuilder: SegmentBuilder;
  onUpdateName: (name: string) => void;
  onUpdateDescription: (description: string) => void;
  onAddCondition: (groupId: string) => void;
  onAddConditionGroup: (groupId: string) => void;
  onRemoveCondition: (conditionId: string) => void;
  onUpdateCondition: (conditionId: string, updates: Partial<SegmentCondition>) => void;
  onPreview: () => void;
}) {
  return (
    <ScrollArea className="h-[500px]">
      <div className="space-y-6 p-1">
        {/* Basic Info */}
        <div className="space-y-4">
          <div>
            <Label htmlFor="segment-name">Название сегмента</Label>
            <Input
              id="segment-name"
              value={segmentBuilder.name}
              onChange={(e) => onUpdateName(e.target.value)}
              placeholder="Например: VIP игроки на грани оттока"
            />
          </div>
          <div>
            <Label htmlFor="segment-description">Описание</Label>
            <Textarea
              id="segment-description"
              value={segmentBuilder.description || ''}
              onChange={(e) => onUpdateDescription(e.target.value)}
              placeholder="Краткое описание сегмента и его назначения"
              rows={2}
            />
          </div>
        </div>

        <Separator />

        {/* Conditions Builder */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Условия сегментации</h3>
            <div className="flex gap-2">
              <Button 
                size="sm" 
                variant="outline" 
                onClick={() => onAddCondition(segmentBuilder.rootGroup.id)}
              >
                <Plus className="h-4 w-4 mr-2" />
                Добавить условие
              </Button>
              <Button 
                size="sm" 
                variant="outline"
                onClick={() => onAddConditionGroup(segmentBuilder.rootGroup.id)}
              >
                <Layers className="h-4 w-4 mr-2" />
                Добавить группу
              </Button>
            </div>
          </div>

          <ConditionGroupBuilder
            group={segmentBuilder.rootGroup}
            onAddCondition={onAddCondition}
            onAddConditionGroup={onAddConditionGroup}
            onRemoveCondition={onRemoveCondition}
            onUpdateCondition={onUpdateCondition}
            level={0}
          />
        </div>
      </div>
    </ScrollArea>
  );
}

// Condition Group Builder Component
function ConditionGroupBuilder({
  group,
  onAddCondition,
  onAddConditionGroup,
  onRemoveCondition,
  onUpdateCondition,
  level
}: {
  group: SegmentConditionGroup;
  onAddCondition: (groupId: string) => void;
  onAddConditionGroup: (groupId: string) => void;
  onRemoveCondition: (conditionId: string) => void;
  onUpdateCondition: (conditionId: string, updates: Partial<SegmentCondition>) => void;
  level: number;
}) {
  const indent = level * 24;

  return (
    <div className="space-y-2" style={{ marginLeft: `${indent}px` }}>
      {level > 0 && (
        <div className="flex items-center gap-2 p-2 bg-muted/50 rounded-lg">
          <Badge variant="outline">{group.type}</Badge>
          <span className="text-sm text-muted-foreground">группа условий</span>
        </div>
      )}
      
      {group.conditions.map((condition, index) => (
        <div key={condition.id}>
          {index > 0 && (
            <div className="flex items-center gap-2 my-2">
              <Badge variant="secondary" className="text-xs">
                {group.type}
              </Badge>
            </div>
          )}
          
          {'type' in condition ? (
            <ConditionGroupBuilder
              group={condition}
              onAddCondition={onAddCondition}
              onAddConditionGroup={onAddConditionGroup}
              onRemoveCondition={onRemoveCondition}
              onUpdateCondition={onUpdateCondition}
              level={level + 1}
            />
          ) : (
            <ConditionBuilder
              condition={condition}
              onRemove={() => onRemoveCondition(condition.id)}
              onUpdate={(updates) => onUpdateCondition(condition.id, updates)}
            />
          )}
        </div>
      ))}

      {level > 0 && (
        <div className="flex gap-2 mt-2">
          <Button 
            size="sm" 
            variant="ghost" 
            onClick={() => onAddCondition(group.id)}
          >
            <Plus className="h-3 w-3 mr-1" />
            Условие
          </Button>
          <Button 
            size="sm" 
            variant="ghost"
            onClick={() => onAddConditionGroup(group.id)}
          >
            <Layers className="h-3 w-3 mr-1" />
            Группа
          </Button>
        </div>
      )}
    </div>
  );
}

// Individual Condition Builder
function ConditionBuilder({
  condition,
  onRemove,
  onUpdate
}: {
  condition: SegmentCondition;
  onRemove: () => void;
  onUpdate: (updates: Partial<SegmentCondition>) => void;
}) {
  const selectedParameter = segmentParameters.find(p => p.id === condition.parameter);
  const availableOperators = selectedParameter 
    ? operatorsByType[selectedParameter.type] || []
    : [];

  const getParameterIcon = (group: string) => {
    switch (group) {
      case 'financial': return <Euro className="h-4 w-4" />;
      case 'gaming': return <BarChart3 className="h-4 w-4" />;
      case 'marketing': return <Target className="h-4 w-4" />;
      case 'profile': return <Users className="h-4 w-4" />;
      case 'risk': return <Shield className="h-4 w-4" />;
      case 'ai_predictive': return <Brain className="h-4 w-4" />;
      default: return <Hash className="h-4 w-4" />;
    }
  };

  return (
    <Card className="p-4">
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 min-w-0 flex-1">
          {/* Parameter Selection */}
          <div className="min-w-[200px]">
            <Select 
              value={condition.parameter} 
              onValueChange={(value) => onUpdate({ parameter: value, operator: 'equals', value: '' })}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Выберите параметр" />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(
                  segmentParameters.reduce((acc, param) => {
                    if (!acc[param.group]) acc[param.group] = [];
                    acc[param.group].push(param);
                    return acc;
                  }, {} as Record<string, SegmentParameter[]>)
                ).map(([group, params]) => (
                  <div key={group}>
                    <div className="flex items-center gap-2 px-2 py-1.5 text-sm font-medium text-muted-foreground">
                      {getParameterIcon(group)}
                      {parameterGroupLabels[group]}
                    </div>
                    {params.map((param) => (
                      <SelectItem key={param.id} value={param.id}>
                        <div>
                          <div>{param.name}</div>
                          <div className="text-xs text-muted-foreground">{param.description}</div>
                        </div>
                      </SelectItem>
                    ))}
                  </div>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Operator Selection */}
          <div className="min-w-[120px]">
            <Select 
              value={condition.operator} 
              onValueChange={(value: SegmentOperator) => onUpdate({ operator: value })}
              disabled={!selectedParameter}
            >
              <SelectTrigger>
                <SelectValue placeholder="Оператор" />
              </SelectTrigger>
              <SelectContent>
                {availableOperators.map((operator) => (
                  <SelectItem key={operator} value={operator}>
                    {operatorLabels[operator]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Value Input */}
          <div className="min-w-[150px]">
            <ConditionValueInput
              parameter={selectedParameter}
              operator={condition.operator}
              value={condition.value}
              onChange={(value) => onUpdate({ value })}
            />
          </div>
        </div>

        {/* Remove Button */}
        <Button
          variant="ghost"
          size="icon"
          onClick={onRemove}
          className="text-red-500 hover:text-red-700"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
    </Card>
  );
}

// Condition Value Input Component
function ConditionValueInput({
  parameter,
  operator,
  value,
  onChange
}: {
  parameter?: SegmentParameter;
  operator: SegmentOperator;
  value: any;
  onChange: (value: any) => void;
}) {
  if (!parameter) {
    return <Input placeholder="Выберите параметр" disabled />;
  }

  const handleInputChange = (newValue: string) => {
    if (parameter.type === 'number' || parameter.type === 'currency' || parameter.type === 'percentage') {
      const numValue = parseFloat(newValue);
      onChange(isNaN(numValue) ? 0 : numValue);
    } else {
      onChange(newValue);
    }
  };

  if (operator === 'between' || operator === 'not_between') {
    return (
      <div className="flex gap-2">
        <Input
          type="number"
          placeholder="От"
          value={typeof value === 'object' && value?.min !== undefined ? value.min : ''}
          onChange={(e) => onChange({ 
            ...value, 
            min: parseFloat(e.target.value) || 0 
          })}
        />
        <Input
          type="number"
          placeholder="До"
          value={typeof value === 'object' && value?.max !== undefined ? value.max : ''}
          onChange={(e) => onChange({ 
            ...value, 
            max: parseFloat(e.target.value) || 0 
          })}
        />
      </div>
    );
  }

  if (parameter.type === 'list') {
    return (
      <Select value={Array.isArray(value) ? value[0] : value} onValueChange={onChange}>
        <SelectTrigger>
          <SelectValue placeholder="Выберите значение" />
        </SelectTrigger>
        <SelectContent>
          {parameter.options?.map((option) => (
            <SelectItem key={option} value={option}>
              {option}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    );
  }

  if (parameter.type === 'date') {
    return (
      <Input
        type="date"
        value={value instanceof Date ? value.toISOString().split('T')[0] : value}
        onChange={(e) => onChange(e.target.value)}
      />
    );
  }

  if (parameter.type === 'boolean') {
    return (
      <Select value={value?.toString()} onValueChange={(v) => onChange(v === 'true')}>
        <SelectTrigger>
          <SelectValue placeholder="Выберите" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="true">Да</SelectItem>
          <SelectItem value="false">Нет</SelectItem>
        </SelectContent>
      </Select>
    );
  }

  return (
    <Input
      type={parameter.type === 'number' || parameter.type === 'currency' || parameter.type === 'percentage' ? 'number' : 'text'}
      placeholder={`Введите ${parameter.name.toLowerCase()}`}
      value={value || ''}
      onChange={(e) => handleInputChange(e.target.value)}
      min={parameter.min}
      max={parameter.max}
    />
  );
}

// Segment Preview Tab
function SegmentPreviewTab({
  preview,
  segmentBuilder,
  onRefresh
}: {
  preview: SegmentPreview;
  segmentBuilder: SegmentBuilder;
  onRefresh: () => void;
}) {
  return (
    <div className="space-y-6">
      {/* Preview Stats */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Предпросмотр сегмента
          </CardTitle>
          <CardDescription>
            Количество игроков, которые соответствуют условиям
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-sm text-muted-foreground">Количество игроков</Label>
              <div className="text-3xl font-bold">{preview.count.toLocaleString()}</div>
            </div>
            <div className="space-y-2">
              <Label className="text-sm text-muted-foreground">Процент от базы</Label>
              <div className="text-3xl font-bold">{preview.percentage.toFixed(1)}%</div>
            </div>
          </div>
          
          <Button onClick={onRefresh} className="mt-4" variant="outline">
            <Play className="mr-2 h-4 w-4" />
            Обновить предпросмотр
          </Button>
        </CardContent>
      </Card>

      {/* Breakdown */}
      {preview.breakdown && (
        <Card>
          <CardHeader>
            <CardTitle>Разбивка по странам</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {Object.entries(preview.breakdown).map(([country, count]) => (
                <div key={country} className="flex items-center justify-between">
                  <span>{country}</span>
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{count.toLocaleString()}</span>
                    <span className="text-sm text-muted-foreground">
                      ({((count / preview.count) * 100).toFixed(1)}%)
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Segment Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Сводка сегмента</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div>
              <Label className="text-sm text-muted-foreground">Название</Label>
              <p>{segmentBuilder.name || 'Без названия'}</p>
            </div>
            {segmentBuilder.description && (
              <div>
                <Label className="text-sm text-muted-foreground">Описание</Label>
                <p>{segmentBuilder.description}</p>
              </div>
            )}
            <div>
              <Label className="text-sm text-muted-foreground">Количество условий</Label>
              <p>{countConditions(segmentBuilder.rootGroup)} условий</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// Helper function to count conditions
function countConditions(group: SegmentConditionGroup): number {
  return group.conditions.reduce((count, condition) => {
    if ('type' in condition) {
      return count + countConditions(condition);
    }
    return count + 1;
  }, 0);
}

// Segment Filters Component
function SegmentFilters() {
  const [filters, setFilters] = React.useState({
    search: '',
    author: '',
    dateFrom: '',
    dateTo: '',
    minPlayers: '',
    maxPlayers: '',
    categories: [] as string[],
    projects: [] as string[],
    countries: [] as string[],
    status: '',
    source: ''
  });

  const [isExpanded, setIsExpanded] = React.useState(false);

  const authorOptions = [
    { value: 'all', label: 'Все авторы' },
    { value: 'user', label: 'Пользователь' },
    { value: 'ai', label: 'AI' }
  ];

  const categoryOptions = [
    { value: 'active', label: 'Активные' },
    { value: 'deposits', label: 'Депозиты' },
    { value: 'vip', label: 'VIP' },
    { value: 'previp', label: 'PreVIP' },
    { value: 'churn', label: 'Отток' },
    { value: 'prechurn', label: 'Предотток' },
    { value: 'no_deposit', label: 'Без депозита' }
  ];

  const projectOptions = [
    { value: 'AIGAMING.BOT', label: 'AIGAMING.BOT' },
    { value: 'CasinoX', label: 'CasinoX' },
    { value: 'LuckyWheel', label: 'LuckyWheel' },
    { value: 'GoldenPlay', label: 'GoldenPlay' }
  ];

  const countryOptions = [
    { value: 'de', label: 'Германия' },
    { value: 'fr', label: 'Франция' },
    { value: 'it', label: 'Италия' },
    { value: 'es', label: 'Испания' },
    { value: 'uk', label: 'Великобритания' },
    { value: 'pl', label: 'Польша' },
    { value: 'nl', label: 'Нидерланды' },
    { value: 'pt', label: 'Португалия' },
    { value: 'ru', label: 'Россия' },
    { value: 'ua', label: 'Украина' }
  ];

  const statusOptions = [
    { value: 'all', label: 'Все статусы' },
    { value: 'active', label: 'Активные' },
    { value: 'inactive', label: 'Неактивные' },
    { value: 'draft', label: 'Черновики' }
  ];

  const sourceOptions = [
    { value: 'all', label: 'Все источники' },
    { value: 'manual', label: 'Ручное создание' },
    { value: 'template', label: 'Из шаблона' },
    { value: 'import', label: 'Импорт' },
    { value: 'ai_generated', label: 'AI генерация' }
  ];

  const handleInputChange = (field: string, value: any) => {
    setFilters(prev => ({ ...prev, [field]: value }));
  };

  const handleMultiSelectChange = (field: string, values: string[]) => {
    setFilters(prev => ({ ...prev, [field]: values }));
  };

  const applyFilters = () => {
    console.log('Applied filters:', filters);
    // Здесь будет логика применения фильтров
  };

  const resetFilters = () => {
    setFilters({
      search: '',
      author: '',
      dateFrom: '',
      dateTo: '',
      minPlayers: '',
      maxPlayers: '',
      categories: [],
      projects: [],
      countries: [],
      status: '',
      source: ''
    });
  };

  const activeFiltersCount = Object.values(filters).filter(value => 
    Array.isArray(value) ? value.length > 0 : value !== ''
  ).length;

  return (
    <div className="space-y-4">
      {/* Основные фильтры - всегда видимы */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {/* Поиск */}
        <div className="space-y-2">
          <Label htmlFor="search">Поиск по названию</Label>
          <Input
            id="search"
            placeholder="Введите название сегмента..."
            value={filters.search}
            onChange={(e) => handleInputChange('search', e.target.value)}
          />
        </div>

        {/* Автор */}
        <div className="space-y-2">
          <Label>Автор</Label>
          <Select value={filters.author} onValueChange={(value) => handleInputChange('author', value)}>
            <SelectTrigger>
              <SelectValue placeholder="Выберите автора" />
            </SelectTrigger>
            <SelectContent>
              {authorOptions.map(option => (
                <SelectItem key={option.value} value={option.value}>
                  <div className="flex items-center gap-2">
                    {option.value === 'ai' && <Bot className="h-4 w-4" />}
                    {option.value === 'user' && <Users className="h-4 w-4" />}
                    {option.label}
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Категория */}
        <div className="space-y-2">
          <Label>Категории</Label>
          <div className="flex flex-wrap gap-1">
            {categoryOptions.map(option => (
              <Badge
                key={option.value}
                variant={filters.categories.includes(option.value) ? "default" : "outline"}
                className="cursor-pointer"
                onClick={() => {
                  const newCategories = filters.categories.includes(option.value)
                    ? filters.categories.filter(c => c !== option.value)
                    : [...filters.categories, option.value];
                  handleMultiSelectChange('categories', newCategories);
                }}
              >
                {option.label}
              </Badge>
            ))}
          </div>
        </div>

        {/* Количество игроков */}
        <div className="space-y-2">
          <Label>Количество игроков</Label>
          <div className="flex gap-2">
            <Input
              placeholder="От"
              type="number"
              value={filters.minPlayers}
              onChange={(e) => handleInputChange('minPlayers', e.target.value)}
            />
            <Input
              placeholder="До"
              type="number"
              value={filters.maxPlayers}
              onChange={(e) => handleInputChange('maxPlayers', e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Кнопка развернуть/свернуть */}
      <div className="flex items-center justify-between">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          <Filter className="mr-2 h-4 w-4" />
          {isExpanded ? 'Скрыть' : 'Показать'} расширенные фильтры
          <Badge variant="secondary" className="ml-2">
            {activeFiltersCount}
          </Badge>
        </Button>
        
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={resetFilters}>
            Сброс
          </Button>
          <Button size="sm" onClick={applyFilters}>
            Применить фильтры
          </Button>
        </div>
      </div>

      {/* Расширенные фильтры */}
      <Collapsible open={isExpanded} onOpenChange={setIsExpanded}>
        <CollapsibleContent className="space-y-4">
          <Separator />
          
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {/* Дата создания */}
            <div className="space-y-2">
              <Label>Дата создания</Label>
              <div className="flex gap-2">
                <Input
                  type="date"
                  value={filters.dateFrom}
                  onChange={(e) => handleInputChange('dateFrom', e.target.value)}
                />
                <Input
                  type="date"
                  value={filters.dateTo}
                  onChange={(e) => handleInputChange('dateTo', e.target.value)}
                />
              </div>
            </div>

            {/* Проекты */}
            <div className="space-y-2">
              <Label>Проекты</Label>
              <div className="flex flex-wrap gap-1">
                {projectOptions.map(option => (
                  <Badge
                    key={option.value}
                    variant={filters.projects.includes(option.value) ? "default" : "outline"}
                    className="cursor-pointer"
                    onClick={() => {
                      const newProjects = filters.projects.includes(option.value)
                        ? filters.projects.filter(p => p !== option.value)
                        : [...filters.projects, option.value];
                      handleMultiSelectChange('projects', newProjects);
                    }}
                  >
                    {option.label}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Страны */}
            <div className="space-y-2">
              <Label>Геолокация</Label>
              <div className="flex flex-wrap gap-1 max-h-20 overflow-y-auto">
                {countryOptions.map(option => (
                  <Badge
                    key={option.value}
                    variant={filters.countries.includes(option.value) ? "default" : "outline"}
                    className="cursor-pointer text-xs"
                    onClick={() => {
                      const newCountries = filters.countries.includes(option.value)
                        ? filters.countries.filter(c => c !== option.value)
                        : [...filters.countries, option.value];
                      handleMultiSelectChange('countries', newCountries);
                    }}
                  >
                    {option.label}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Статус */}
            <div className="space-y-2">
              <Label>Статус</Label>
              <Select value={filters.status} onValueChange={(value) => handleInputChange('status', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Выберите статус" />
                </SelectTrigger>
                <SelectContent>
                  {statusOptions.map(option => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Источник создания */}
            <div className="space-y-2">
              <Label>Источник создания</Label>
              <Select value={filters.source} onValueChange={(value) => handleInputChange('source', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Выберите источник" />
                </SelectTrigger>
                <SelectContent>
                  {sourceOptions.map(option => (
                    <SelectItem key={option.value} value={option.value}>
                      <div className="flex items-center gap-2">
                        {option.value === 'ai_generated' && <Brain className="h-4 w-4" />}
                        {option.value === 'template' && <Copy className="h-4 w-4" />}
                        {option.value === 'import' && <Download className="h-4 w-4" />}
                        {option.value === 'manual' && <Settings className="h-4 w-4" />}
                        {option.label}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button variant="outline" onClick={resetFilters}>
              <X className="mr-2 h-4 w-4" />
              Сбросить все
            </Button>
            <Button onClick={applyFilters}>
              <Filter className="mr-2 h-4 w-4" />
              Применить фильтры
            </Button>
          </div>
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
}