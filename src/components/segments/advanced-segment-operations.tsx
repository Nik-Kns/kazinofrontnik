"use client";

import * as React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { cn } from "@/lib/utils";
import { 
  Layers, Plus, Minus, Copy, Users, Filter, Info, 
  AlertTriangle, CheckCircle, Zap, Target, Shield,
  Scissors, Merge, ArrowRight, ArrowLeft, X,
  Eye, Save, Calculator, Brain
} from "lucide-react";

export type SegmentOperationType = 'union' | 'intersection' | 'difference' | 'symmetric_difference' | 'complement';

export interface SegmentOperation {
  id: string;
  type: SegmentOperationType;
  segments: string[];
  name: string;
  description?: string;
  resultPreview?: {
    count: number;
    percentage: number;
    overlap?: number;
  };
}

export interface BaseSegment {
  id: string;
  name: string;
  playerCount: number;
  description?: string;
}

interface AdvancedSegmentOperationsProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  availableSegments: BaseSegment[];
  baseSegment?: BaseSegment | null;
  onSave: (operation: SegmentOperation) => void;
}

export function AdvancedSegmentOperations({
  open,
  onOpenChange,
  availableSegments,
  baseSegment,
  onSave
}: AdvancedSegmentOperationsProps) {
  const [operationType, setOperationType] = React.useState<SegmentOperationType>('union');
  const [selectedSegments, setSelectedSegments] = React.useState<string[]>(
    baseSegment ? [baseSegment.id] : []
  );
  const [operationName, setOperationName] = React.useState('');
  const [operationDescription, setOperationDescription] = React.useState('');
  const [preview, setPreview] = React.useState<SegmentOperation['resultPreview'] | null>(null);
  const [activeTab, setActiveTab] = React.useState('simple');

  React.useEffect(() => {
    if (baseSegment && open) {
      setSelectedSegments([baseSegment.id]);
      setOperationName(`${baseSegment.name} - модифицированный`);
    }
  }, [baseSegment, open]);

  const calculatePreview = () => {
    // Симуляция расчета предпросмотра
    const totalPlayers = 50000;
    let resultCount = 0;
    let overlap = 0;

    const selectedSegmentData = selectedSegments.map(id => 
      availableSegments.find(s => s.id === id)
    ).filter(Boolean) as BaseSegment[];

    switch (operationType) {
      case 'union':
        // Объединение - все игроки из всех сегментов
        resultCount = selectedSegmentData.reduce((sum, s) => sum + s.playerCount, 0);
        // Учитываем пересечения (примерная оценка)
        overlap = Math.floor(resultCount * 0.15);
        resultCount = resultCount - overlap;
        break;
        
      case 'intersection':
        // Пересечение - только общие игроки
        if (selectedSegmentData.length > 0) {
          resultCount = Math.min(...selectedSegmentData.map(s => s.playerCount));
          resultCount = Math.floor(resultCount * 0.3); // Примерная оценка пересечения
        }
        break;
        
      case 'difference':
        // Разность - игроки из первого минус остальные
        if (selectedSegmentData.length > 0) {
          resultCount = selectedSegmentData[0].playerCount;
          for (let i = 1; i < selectedSegmentData.length; i++) {
            resultCount = Math.floor(resultCount * 0.7); // Уменьшаем на ~30%
          }
        }
        break;
        
      case 'symmetric_difference':
        // Симметричная разность - уникальные для каждого
        resultCount = selectedSegmentData.reduce((sum, s) => sum + s.playerCount, 0);
        overlap = Math.floor(resultCount * 0.25);
        resultCount = resultCount - overlap * 2;
        break;
        
      case 'complement':
        // Дополнение - все игроки не входящие в сегменты
        const segmentTotal = selectedSegmentData.reduce((sum, s) => sum + s.playerCount, 0);
        resultCount = totalPlayers - segmentTotal;
        break;
    }

    setPreview({
      count: Math.max(0, resultCount),
      percentage: (Math.max(0, resultCount) / totalPlayers) * 100,
      overlap
    });
  };

  const handleSegmentToggle = (segmentId: string) => {
    setSelectedSegments(prev => {
      if (prev.includes(segmentId)) {
        return prev.filter(id => id !== segmentId);
      }
      return [...prev, segmentId];
    });
  };

  const handleSave = () => {
    const operation: SegmentOperation = {
      id: `op_${Date.now()}`,
      type: operationType,
      segments: selectedSegments,
      name: operationName,
      description: operationDescription,
      resultPreview: preview || undefined
    };
    
    onSave(operation);
    onOpenChange(false);
  };

  const getOperationIcon = (type: SegmentOperationType) => {
    switch (type) {
      case 'union': return <Merge className="h-4 w-4" />;
      case 'intersection': return <Layers className="h-4 w-4" />;
      case 'difference': return <Minus className="h-4 w-4" />;
      case 'symmetric_difference': return <Scissors className="h-4 w-4" />;
      case 'complement': return <Shield className="h-4 w-4" />;
    }
  };

  const getOperationDescription = (type: SegmentOperationType) => {
    switch (type) {
      case 'union':
        return 'Объединение сегментов - включает всех игроков из выбранных сегментов';
      case 'intersection':
        return 'Пересечение сегментов - только игроки, присутствующие во всех выбранных сегментах';
      case 'difference':
        return 'Разность сегментов - игроки из первого сегмента, исключая игроков из остальных';
      case 'symmetric_difference':
        return 'Симметричная разность - игроки, входящие только в один из сегментов';
      case 'complement':
        return 'Дополнение - все игроки, НЕ входящие в выбранные сегменты';
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Calculator className="h-5 w-5" />
            Расширенные операции с сегментами
          </DialogTitle>
          <DialogDescription>
            Создайте новый сегмент на основе комбинации существующих сегментов
          </DialogDescription>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="simple">Простые операции</TabsTrigger>
            <TabsTrigger value="advanced">Сложные комбинации</TabsTrigger>
            <TabsTrigger value="ai">AI-помощник</TabsTrigger>
          </TabsList>

          <TabsContent value="simple" className="space-y-6">
            {/* Тип операции */}
            <div className="space-y-4">
              <Label>Тип операции</Label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {(['union', 'intersection', 'difference', 'symmetric_difference', 'complement'] as SegmentOperationType[]).map(type => (
                  <Card 
                    key={type}
                    className={cn(
                      "cursor-pointer transition-all hover:shadow-md",
                      operationType === type && "ring-2 ring-primary"
                    )}
                    onClick={() => setOperationType(type)}
                  >
                    <CardHeader className="p-4">
                      <div className="flex items-start gap-3">
                        {getOperationIcon(type)}
                        <div className="space-y-1">
                          <CardTitle className="text-sm">
                            {type === 'union' && 'Объединение (A ∪ B)'}
                            {type === 'intersection' && 'Пересечение (A ∩ B)'}
                            {type === 'difference' && 'Разность (A \\ B)'}
                            {type === 'symmetric_difference' && 'Симм. разность (A △ B)'}
                            {type === 'complement' && 'Дополнение (¬A)'}
                          </CardTitle>
                          <CardDescription className="text-xs">
                            {getOperationDescription(type)}
                          </CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                  </Card>
                ))}
              </div>
            </div>

            {/* Выбор сегментов */}
            <div className="space-y-4">
              <Label>Выберите сегменты для операции</Label>
              <ScrollArea className="h-[200px] border rounded-lg p-4">
                <div className="space-y-2">
                  {availableSegments.map(segment => (
                    <div
                      key={segment.id}
                      className={cn(
                        "flex items-center justify-between p-3 rounded-lg border cursor-pointer transition-colors",
                        selectedSegments.includes(segment.id) 
                          ? "bg-primary/10 border-primary" 
                          : "hover:bg-muted"
                      )}
                      onClick={() => handleSegmentToggle(segment.id)}
                    >
                      <div className="flex items-center gap-3">
                        <div className={cn(
                          "w-4 h-4 rounded border-2",
                          selectedSegments.includes(segment.id)
                            ? "bg-primary border-primary"
                            : "border-gray-300"
                        )}>
                          {selectedSegments.includes(segment.id) && (
                            <CheckCircle className="h-3 w-3 text-white" />
                          )}
                        </div>
                        <div>
                          <div className="font-medium">{segment.name}</div>
                          {segment.description && (
                            <div className="text-sm text-muted-foreground">{segment.description}</div>
                          )}
                        </div>
                      </div>
                      <Badge variant="secondary">
                        {segment.playerCount.toLocaleString()} игроков
                      </Badge>
                    </div>
                  ))}
                </div>
              </ScrollArea>
              
              {selectedSegments.length > 0 && (
                <Alert>
                  <Info className="h-4 w-4" />
                  <AlertDescription>
                    Выбрано сегментов: {selectedSegments.length}. 
                    {operationType === 'difference' && ' Первый сегмент будет базовым.'}
                  </AlertDescription>
                </Alert>
              )}
            </div>

            {/* Визуализация операции */}
            {selectedSegments.length >= 2 && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Визуализация операции</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-center gap-4">
                    {selectedSegments.slice(0, 2).map((segmentId, index) => {
                      const segment = availableSegments.find(s => s.id === segmentId);
                      return (
                        <React.Fragment key={segmentId}>
                          {index > 0 && (
                            <div className="flex flex-col items-center">
                              {getOperationIcon(operationType)}
                            </div>
                          )}
                          <div className="text-center">
                            <div className="w-24 h-24 rounded-full bg-primary/20 flex items-center justify-center">
                              <Users className="h-8 w-8 text-primary" />
                            </div>
                            <div className="mt-2 text-sm font-medium">{segment?.name}</div>
                          </div>
                        </React.Fragment>
                      );
                    })}
                    {selectedSegments.length > 2 && (
                      <>
                        <div className="flex flex-col items-center">
                          <Plus className="h-4 w-4" />
                        </div>
                        <Badge variant="secondary">
                          +{selectedSegments.length - 2} еще
                        </Badge>
                      </>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="advanced" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Построитель сложных комбинаций</CardTitle>
                <CardDescription>
                  Создайте многоуровневые операции с вложенными условиями
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <Alert>
                    <Zap className="h-4 w-4" />
                    <AlertDescription>
                      Используйте формулу для создания сложной комбинации:
                      <br />
                      Например: (A ∪ B) ∩ C \ D - объединить A и B, пересечь с C, исключить D
                    </AlertDescription>
                  </Alert>
                  
                  <Textarea
                    placeholder="Введите формулу комбинации сегментов..."
                    rows={3}
                    className="font-mono"
                  />
                  
                  <Button variant="outline" className="w-full">
                    <Brain className="mr-2 h-4 w-4" />
                    Анализировать формулу
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="ai" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>AI-помощник по сегментации</CardTitle>
                <CardDescription>
                  Опишите желаемый результат, и AI предложит оптимальную комбинацию
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <Textarea
                    placeholder="Например: Мне нужны все VIP игроки, которые активны, но не делали депозит последние 7 дней..."
                    rows={4}
                  />
                  
                  <Button className="w-full">
                    <Brain className="mr-2 h-4 w-4" />
                    Получить рекомендации AI
                  </Button>
                  
                  <div className="space-y-3 pt-4">
                    <Label>AI рекомендации:</Label>
                    <Card className="bg-muted/50">
                      <CardContent className="pt-6">
                        <p className="text-sm text-muted-foreground">
                          AI предложения появятся здесь...
                        </p>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <Separator />

        {/* Результат операции */}
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="operation-name">Название нового сегмента</Label>
              <Input
                id="operation-name"
                value={operationName}
                onChange={(e) => setOperationName(e.target.value)}
                placeholder="Например: VIP без депозитов 7 дней"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="operation-description">Описание</Label>
              <Textarea
                id="operation-description"
                value={operationDescription}
                onChange={(e) => setOperationDescription(e.target.value)}
                placeholder="Краткое описание результата операции"
                rows={1}
              />
            </div>
          </div>

          {preview && (
            <Card className="bg-muted/50">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm">Предварительный результат</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <div className="text-2xl font-bold">{preview.count.toLocaleString()}</div>
                    <div className="text-xs text-muted-foreground">Игроков в сегменте</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold">{preview.percentage.toFixed(1)}%</div>
                    <div className="text-xs text-muted-foreground">От общей базы</div>
                  </div>
                  {preview.overlap && preview.overlap > 0 && (
                    <div>
                      <div className="text-2xl font-bold">{preview.overlap.toLocaleString()}</div>
                      <div className="text-xs text-muted-foreground">Пересечений</div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Отмена
          </Button>
          <Button 
            variant="outline" 
            onClick={calculatePreview}
            disabled={selectedSegments.length === 0}
          >
            <Eye className="mr-2 h-4 w-4" />
            Предпросмотр
          </Button>
          <Button 
            onClick={handleSave}
            disabled={!operationName || selectedSegments.length === 0}
          >
            <Save className="mr-2 h-4 w-4" />
            Создать сегмент
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}