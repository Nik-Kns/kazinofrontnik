"use client";

import * as React from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { segmentsData } from "@/lib/mock-data";
import { 
  Bot, Copy, Pencil, PlusCircle, Trash2, X, Filter, Eye, Play, 
  Save, Download, Plus, Minus, Move, Grip, Settings,
  ChevronDown, ChevronRight, Users, BarChart3, Target,
  Layers, Zap, Shield, Brain, Euro, Calendar, Hash
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
  const [isCreateDialogOpen, setIsCreateDialogOpen] = React.useState(false);
  const [isAdvancedBuilderOpen, setIsAdvancedBuilderOpen] = React.useState(false);
  const [selectedSegment, setSelectedSegment] = React.useState<SegmentData | null>(null);

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
        <Button onClick={() => setIsCreateDialogOpen(true)}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Создать сегмент
        </Button>
      </div>

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
                  <TableCell>{segment.createdAt}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {segment.isAIGenerated ? (
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
                      
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button 
                              variant="ghost" 
                              size="icon"
                              onClick={() => {
                                setSelectedSegment(segment);
                                setIsAdvancedBuilderOpen(true);
                              }}
                            >
                              <Pencil className="h-4 w-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>Редактировать</TooltipContent>
                        </Tooltip>
                      </TooltipProvider>

                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <Copy className="h-4 w-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>Копировать</TooltipContent>
                        </Tooltip>
                      </TooltipProvider>

                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>Удалить</TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Simple Create Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Создание сегмента</DialogTitle>
            <DialogDescription>
              Создайте сегмент с помощью AI или настройте правила вручную.
            </DialogDescription>
          </DialogHeader>
          
          <div className="flex flex-col gap-4">
            <Button 
              className="justify-start" 
              onClick={() => {
                setIsCreateDialogOpen(false);
                setSelectedSegment(null);
                setIsAdvancedBuilderOpen(true);
              }}
            >
              <Bot className="mr-2 h-4 w-4" />
              Создать с AI
            </Button>
            
            <Button 
              variant="outline" 
              className="justify-start"
              onClick={() => {
                setIsCreateDialogOpen(false);
                setSelectedSegment(null);
                setIsAdvancedBuilderOpen(true);
              }}
            >
              <Settings className="mr-2 h-4 w-4" />
              Ручная настройка
            </Button>
          </div>

          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Отмена</Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Advanced Segment Builder */}
      <AdvancedSegmentBuilder 
        open={isAdvancedBuilderOpen}
        onOpenChange={setIsAdvancedBuilderOpen}
        segment={selectedSegment}
      />
    </div>
  );
}

// Advanced Segment Builder Component
function AdvancedSegmentBuilder({ 
  open, 
  onOpenChange, 
  segment 
}: { 
  open: boolean; 
  onOpenChange: (open: boolean) => void; 
  segment: SegmentData | null; 
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
  const [activeTab, setActiveTab] = React.useState('builder');
  const [selectedTemplate, setSelectedTemplate] = React.useState<string>('');

  // Reset state when dialog opens/closes
  React.useEffect(() => {
    if (open && !segment) {
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
  }, [open, segment]);

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
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="templates">Шаблоны</TabsTrigger>
            <TabsTrigger value="builder">Конструктор</TabsTrigger>
            <TabsTrigger value="preview">Предпросмотр</TabsTrigger>
          </TabsList>

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
    { value: 'vip', label: 'VIP' },
    { value: 'retention', label: 'Retention' },
    { value: 'churn', label: 'Churn' },
    { value: 'reactivation', label: 'Реактивация' },
    { value: 'onboarding', label: 'Онбординг' },
    { value: 'engagement', label: 'Вовлечение' },
    { value: 'conversion', label: 'Конверсия' }
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