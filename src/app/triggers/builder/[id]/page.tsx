"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams, useSearchParams, useRouter } from "next/navigation";
import ReactFlow, {
  Background,
  Controls,
  MiniMap,
  Panel,
  addEdge,
  useNodesState,
  useEdgesState,
  Connection,
  Edge,
  Node,
  NodeTypes,
  MarkerType,
} from "reactflow";
import "reactflow/dist/style.css";

import {
  Play,
  Pause,
  Save,
  Download,
  Upload,
  Sparkles,
  ChevronLeft,
  Users,
  TrendingUp,
  Target,
  Clock,
  AlertCircle,
  CheckCircle,
  Settings,
  BarChart3,
} from "lucide-react";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";

import { ScenarioTemplate } from "@/lib/types";
import { DraggableNode } from "@/components/scenario-builder/draggable-node";
import { TriggerNodeComponent } from "@/components/scenario-builder/trigger-node";
import { ActionNodeComponent } from "@/components/scenario-builder/action-node";
import { LogicNodeComponent } from "@/components/scenario-builder/logic-node";

// Определяем типы узлов
const nodeTypes: NodeTypes = {
  trigger: TriggerNodeComponent,
  action: ActionNodeComponent,
  logic: LogicNodeComponent,
};

// Шаблоны сценариев с предзаполненными узлами
const scenarioTemplates: Record<string, { nodes: Node[], edges: Edge[] }> = {
  "welcome-series": {
    nodes: [
      {
        id: "trigger-1",
        type: "trigger",
        position: { x: 100, y: 100 },
        data: {
          type: "event",
          name: "Регистрация игрока",
          description: "Срабатывает при регистрации нового игрока",
          icon: "UserCheck",
          config: { eventType: "registration" }
        }
      },
      {
        id: "delay-1",
        type: "logic",
        position: { x: 350, y: 100 },
        data: {
          type: "delay",
          name: "Задержка 5 минут",
          description: "Ждать 5 минут после регистрации",
          icon: "Clock",
          config: { delayTime: 5, delayUnit: "minutes" }
        }
      },
      {
        id: "action-1",
        type: "action",
        position: { x: 600, y: 100 },
        data: {
          type: "email",
          name: "Приветственное письмо",
          description: "Отправить приветственное письмо с бонусом",
          icon: "Mail",
          config: { template: "welcome-bonus" }
        }
      },
      {
        id: "delay-2",
        type: "logic",
        position: { x: 850, y: 100 },
        data: {
          type: "delay",
          name: "Задержка 24 часа",
          description: "Ждать 1 день",
          icon: "Clock",
          config: { delayTime: 24, delayUnit: "hours" }
        }
      },
      {
        id: "condition-1",
        type: "logic",
        position: { x: 1100, y: 100 },
        data: {
          type: "condition",
          name: "Проверка депозита",
          description: "Сделал ли игрок первый депозит?",
          icon: "GitBranch",
          config: { condition: "has_deposit" }
        }
      },
      {
        id: "action-2",
        type: "action",
        position: { x: 1350, y: 50 },
        data: {
          type: "bonus",
          name: "Бонус за депозит",
          description: "Начислить бонус 100%",
          icon: "Gift",
          config: { bonusAmount: 100 }
        }
      },
      {
        id: "action-3",
        type: "action",
        position: { x: 1350, y: 200 },
        data: {
          type: "push",
          name: "Напоминание",
          description: "Push-уведомление с промокодом",
          icon: "Bell",
          config: { message: "Используйте промокод WELCOME50" }
        }
      }
    ],
    edges: [
      { id: "e1", source: "trigger-1", target: "delay-1", animated: true },
      { id: "e2", source: "delay-1", target: "action-1", animated: true },
      { id: "e3", source: "action-1", target: "delay-2", animated: true },
      { id: "e4", source: "delay-2", target: "condition-1", animated: true },
      { 
        id: "e5", 
        source: "condition-1", 
        target: "action-2", 
        sourceHandle: "yes",
        label: "Да",
        animated: true 
      },
      { 
        id: "e6", 
        source: "condition-1", 
        target: "action-3", 
        sourceHandle: "no",
        label: "Нет",
        animated: true 
      }
    ]
  },
  "churn-prevention": {
    nodes: [
      {
        id: "trigger-1",
        type: "trigger",
        position: { x: 100, y: 150 },
        data: {
          type: "behavior",
          name: "Снижение активности VIP",
          description: "Активность снизилась на 50% за неделю",
          icon: "TrendingDown",
          config: { behaviorRule: "activity_drop_50" }
        }
      },
      {
        id: "action-1",
        type: "action",
        position: { x: 400, y: 150 },
        data: {
          type: "segment",
          name: "Добавить в сегмент",
          description: "Добавить в сегмент 'В риске оттока'",
          icon: "Users",
          config: { segmentAction: "add", segmentId: "at-risk" }
        }
      },
      {
        id: "action-2",
        type: "action",
        position: { x: 700, y: 150 },
        data: {
          type: "email",
          name: "Персональное предложение",
          description: "Эксклюзивный бонус для VIP",
          icon: "Mail",
          config: { template: "vip-retention" }
        }
      },
      {
        id: "delay-1",
        type: "logic",
        position: { x: 1000, y: 150 },
        data: {
          type: "delay",
          name: "Задержка 3 дня",
          description: "Ждать реакции 3 дня",
          icon: "Clock",
          config: { delayTime: 3, delayUnit: "days" }
        }
      },
      {
        id: "condition-1",
        type: "logic",
        position: { x: 1300, y: 150 },
        data: {
          type: "condition",
          name: "Вернулся?",
          description: "Проверка активности игрока",
          icon: "GitBranch",
          config: { condition: "is_active" }
        }
      },
      {
        id: "action-3",
        type: "action",
        position: { x: 1600, y: 50 },
        data: {
          type: "segment",
          name: "Удалить из риска",
          description: "Удалить из сегмента 'В риске'",
          icon: "Users",
          config: { segmentAction: "remove", segmentId: "at-risk" }
        }
      },
      {
        id: "action-4",
        type: "action",
        position: { x: 1600, y: 250 },
        data: {
          type: "webhook",
          name: "Уведомить менеджера",
          description: "Webhook для VIP менеджера",
          icon: "AlertTriangle",
          config: { webhookUrl: "/api/notify-manager" }
        }
      }
    ],
    edges: [
      { id: "e1", source: "trigger-1", target: "action-1", animated: true },
      { id: "e2", source: "action-1", target: "action-2", animated: true },
      { id: "e3", source: "action-2", target: "delay-1", animated: true },
      { id: "e4", source: "delay-1", target: "condition-1", animated: true },
      { 
        id: "e5", 
        source: "condition-1", 
        target: "action-3", 
        sourceHandle: "yes",
        label: "Да",
        animated: true 
      },
      { 
        id: "e6", 
        source: "condition-1", 
        target: "action-4", 
        sourceHandle: "no",
        label: "Нет",
        animated: true 
      }
    ]
  }
};

// Элементы для перетаскивания
const draggableElements = {
  triggers: [
    { type: "trigger", subtype: "event", name: "Событие", icon: "Zap", description: "Триггер по событию" },
    { type: "trigger", subtype: "schedule", name: "Расписание", icon: "Calendar", description: "По расписанию" },
    { type: "trigger", subtype: "segment", name: "Сегмент", icon: "Users", description: "Вход в сегмент" },
    { type: "trigger", subtype: "behavior", name: "Поведение", icon: "Activity", description: "Паттерн поведения" },
  ],
  actions: [
    { type: "action", subtype: "email", name: "Email", icon: "Mail", description: "Отправить письмо" },
    { type: "action", subtype: "sms", name: "SMS", icon: "MessageSquare", description: "Отправить SMS" },
    { type: "action", subtype: "push", name: "Push", icon: "Bell", description: "Push-уведомление" },
    { type: "action", subtype: "bonus", name: "Бонус", icon: "Gift", description: "Начислить бонус" },
    { type: "action", subtype: "segment", name: "Сегмент", icon: "Users", description: "Управление сегментом" },
    { type: "action", subtype: "webhook", name: "Webhook", icon: "Globe", description: "Вызов API" },
  ],
  logic: [
    { type: "logic", subtype: "condition", name: "Условие", icon: "GitBranch", description: "Ветвление логики" },
    { type: "logic", subtype: "delay", name: "Задержка", icon: "Clock", description: "Пауза в сценарии" },
    { type: "logic", subtype: "split", name: "A/B тест", icon: "Shuffle", description: "Разделение трафика" },
    { type: "logic", subtype: "merge", name: "Объединение", icon: "GitMerge", description: "Слияние веток" },
  ]
};

export default function ScenarioBuilderPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();
  const templateId = searchParams.get("template");
  
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);
  const [scenarioName, setScenarioName] = useState("Новый сценарий");
  const [scenarioStatus, setScenarioStatus] = useState<"draft" | "active" | "paused">("draft");
  const [isSaving, setIsSaving] = useState(false);

  // Загрузка шаблона при монтировании
  useEffect(() => {
    if (templateId && scenarioTemplates[templateId]) {
      const template = scenarioTemplates[templateId];
      setNodes(template.nodes);
      setEdges(template.edges);
      
      // Установка имени сценария по шаблону
      if (templateId === "welcome-series") {
        setScenarioName("Приветственная серия");
      } else if (templateId === "churn-prevention") {
        setScenarioName("Предотвращение оттока VIP");
      }
    } else if (params.id === "new") {
      // Пустой сценарий
      setNodes([]);
      setEdges([]);
    }
  }, [templateId, params.id, setNodes, setEdges]);

  // Обработка соединений
  const onConnect = useCallback((params: Connection) => {
    setEdges((eds) => addEdge({
      ...params,
      animated: true,
      markerEnd: {
        type: MarkerType.ArrowClosed,
        width: 20,
        height: 20,
      }
    }, eds));
  }, [setEdges]);

  // Обработка перетаскивания
  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  }, []);

  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();

      const reactFlowBounds = event.currentTarget.getBoundingClientRect();
      const nodeData = event.dataTransfer.getData("application/reactflow");

      if (nodeData) {
        const { type, subtype, name, icon, description } = JSON.parse(nodeData);
        
        const position = {
          x: event.clientX - reactFlowBounds.left,
          y: event.clientY - reactFlowBounds.top,
        };

        const newNode: Node = {
          id: `${type}-${Date.now()}`,
          type,
          position,
          data: {
            type: subtype,
            name,
            description,
            icon,
            config: {}
          }
        };

        setNodes((nds) => nds.concat(newNode));
      }
    },
    [setNodes]
  );

  // Обработка выбора узла
  const onNodeClick = useCallback((event: React.MouseEvent, node: Node) => {
    setSelectedNode(node);
  }, []);

  // Сохранение сценария
  const handleSave = async () => {
    setIsSaving(true);
    // Здесь будет логика сохранения
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsSaving(false);
  };

  // Запуск/остановка сценария
  const handleToggleStatus = () => {
    setScenarioStatus(prev => 
      prev === "active" ? "paused" : "active"
    );
  };

  return (
    <div className="flex h-screen">
      {/* Левая панель - элементы для перетаскивания */}
      <div className="w-64 border-r bg-background p-4">
        <div className="mb-4">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => router.push("/triggers")}
            className="mb-4"
          >
            <ChevronLeft className="mr-2 h-4 w-4" />
            Назад
          </Button>
          <h3 className="font-semibold">Элементы сценария</h3>
          <p className="text-sm text-muted-foreground">
            Перетащите на канвас
          </p>
        </div>
        
        <ScrollArea className="h-[calc(100vh-180px)]">
          <div className="space-y-6">
            {/* Триггеры */}
            <div>
              <h4 className="mb-3 text-sm font-medium">Триггеры</h4>
              <div className="space-y-2">
                {draggableElements.triggers.map((element) => (
                  <DraggableNode key={element.subtype} {...element} />
                ))}
              </div>
            </div>
            
            <Separator />
            
            {/* Действия */}
            <div>
              <h4 className="mb-3 text-sm font-medium">Действия</h4>
              <div className="space-y-2">
                {draggableElements.actions.map((element) => (
                  <DraggableNode key={element.subtype} {...element} />
                ))}
              </div>
            </div>
            
            <Separator />
            
            {/* Логика */}
            <div>
              <h4 className="mb-3 text-sm font-medium">Логика</h4>
              <div className="space-y-2">
                {draggableElements.logic.map((element) => (
                  <DraggableNode key={element.subtype} {...element} />
                ))}
              </div>
            </div>
          </div>
        </ScrollArea>
      </div>

      {/* Центральная область - канвас */}
      <div className="flex-1 relative">
        {/* Верхняя панель */}
        <div className="absolute top-0 left-0 right-0 z-10 bg-background/95 backdrop-blur border-b p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Input
                value={scenarioName}
                onChange={(e) => setScenarioName(e.target.value)}
                className="text-lg font-semibold w-64"
              />
              <Badge variant={
                scenarioStatus === "active" ? "default" :
                scenarioStatus === "paused" ? "secondary" : "outline"
              }>
                {scenarioStatus === "active" && "Активен"}
                {scenarioStatus === "paused" && "На паузе"}
                {scenarioStatus === "draft" && "Черновик"}
              </Badge>
            </div>
            
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleToggleStatus}
                disabled={scenarioStatus === "draft"}
              >
                {scenarioStatus === "active" ? (
                  <>
                    <Pause className="mr-2 h-4 w-4" />
                    Остановить
                  </>
                ) : (
                  <>
                    <Play className="mr-2 h-4 w-4" />
                    Запустить
                  </>
                )}
              </Button>
              
              <Button
                size="sm"
                onClick={handleSave}
                disabled={isSaving}
              >
                {isSaving ? (
                  <>Сохранение...</>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Сохранить
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>

        {/* ReactFlow канвас */}
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onNodeClick={onNodeClick}
          onDrop={onDrop}
          onDragOver={onDragOver}
          nodeTypes={nodeTypes}
          fitView
          className="bg-gray-50 dark:bg-gray-950"
        >
          <Background variant="dots" gap={12} size={1} />
          <Controls />
          <MiniMap />
        </ReactFlow>
      </div>

      {/* Правая панель - статистика и настройки */}
      <div className="w-80 border-l bg-background">
        <Tabs defaultValue="stats" className="h-full">
          <TabsList className="w-full rounded-none border-b">
            <TabsTrigger value="stats" className="flex-1">
              <BarChart3 className="mr-2 h-4 w-4" />
              Статистика
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex-1">
              <Settings className="mr-2 h-4 w-4" />
              Настройки
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="stats" className="p-4 space-y-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm">Производительность</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Охват</span>
                  <div className="flex items-center gap-1">
                    <Users className="h-4 w-4" />
                    <span className="font-semibold">12,450</span>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Конверсия</span>
                  <div className="flex items-center gap-1">
                    <Target className="h-4 w-4" />
                    <span className="font-semibold">24.5%</span>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Доход</span>
                  <div className="flex items-center gap-1">
                    <TrendingUp className="h-4 w-4 text-green-600" />
                    <span className="font-semibold text-green-600">€156K</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm">Последние запуски</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex items-center justify-between py-2">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span className="text-sm">2 часа назад</span>
                  </div>
                  <Badge variant="secondary">340 игроков</Badge>
                </div>
                <div className="flex items-center justify-between py-2">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span className="text-sm">6 часов назад</span>
                  </div>
                  <Badge variant="secondary">512 игроков</Badge>
                </div>
                <div className="flex items-center justify-between py-2">
                  <div className="flex items-center gap-2">
                    <AlertCircle className="h-4 w-4 text-yellow-600" />
                    <span className="text-sm">Вчера</span>
                  </div>
                  <Badge variant="secondary">1,203 игрока</Badge>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-blue-600" />
                  ИИ-рекомендации
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="p-3 rounded-lg bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800">
                    <p className="text-sm">
                      Добавьте A/B тест для email-рассылки - это может увеличить конверсию на 15%
                    </p>
                  </div>
                  <div className="p-3 rounded-lg bg-yellow-50 dark:bg-yellow-950 border border-yellow-200 dark:border-yellow-800">
                    <p className="text-sm">
                      Оптимизируйте время отправки - 18:00 показывает лучшие результаты для вашего сегмента
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="settings" className="p-4 space-y-4">
            {selectedNode ? (
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm">Настройки узла</CardTitle>
                  <CardDescription>{selectedNode.data.name}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label>Название</Label>
                    <Input
                      value={selectedNode.data.name}
                      onChange={(e) => {
                        const newNodes = nodes.map(node => 
                          node.id === selectedNode.id 
                            ? { ...node, data: { ...node.data, name: e.target.value } }
                            : node
                        );
                        setNodes(newNodes);
                        setSelectedNode({ ...selectedNode, data: { ...selectedNode.data, name: e.target.value } });
                      }}
                    />
                  </div>
                  
                  <div>
                    <Label>Описание</Label>
                    <Textarea
                      value={selectedNode.data.description}
                      onChange={(e) => {
                        const newNodes = nodes.map(node => 
                          node.id === selectedNode.id 
                            ? { ...node, data: { ...node.data, description: e.target.value } }
                            : node
                        );
                        setNodes(newNodes);
                        setSelectedNode({ ...selectedNode, data: { ...selectedNode.data, description: e.target.value } });
                      }}
                    />
                  </div>

                  {/* Специфичные настройки для типов узлов */}
                  {selectedNode.data.type === "delay" && (
                    <div className="space-y-3">
                      <div>
                        <Label>Время задержки</Label>
                        <div className="flex gap-2">
                          <Input
                            type="number"
                            value={selectedNode.data.config?.delayTime || 1}
                            onChange={(e) => {
                              const newNodes = nodes.map(node => 
                                node.id === selectedNode.id 
                                  ? { ...node, data: { ...node.data, config: { ...node.data.config, delayTime: parseInt(e.target.value) } } }
                                  : node
                              );
                              setNodes(newNodes);
                            }}
                          />
                          <Select
                            value={selectedNode.data.config?.delayUnit || "hours"}
                            onValueChange={(value) => {
                              const newNodes = nodes.map(node => 
                                node.id === selectedNode.id 
                                  ? { ...node, data: { ...node.data, config: { ...node.data.config, delayUnit: value } } }
                                  : node
                              );
                              setNodes(newNodes);
                            }}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="minutes">Минут</SelectItem>
                              <SelectItem value="hours">Часов</SelectItem>
                              <SelectItem value="days">Дней</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {selectedNode.data.type === "email" && (
                    <div>
                      <Label>Шаблон письма</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Выберите шаблон" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="welcome">Приветственное</SelectItem>
                          <SelectItem value="bonus">Бонусное предложение</SelectItem>
                          <SelectItem value="retention">Удержание</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  )}

                  <div>
                    <div className="flex items-center justify-between">
                      <Label>Активен</Label>
                      <Switch defaultChecked />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Настройки сценария</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label>Название сценария</Label>
                    <Input
                      value={scenarioName}
                      onChange={(e) => setScenarioName(e.target.value)}
                    />
                  </div>
                  
                  <div>
                    <Label>Описание</Label>
                    <Textarea
                      placeholder="Опишите цель и логику сценария..."
                      rows={4}
                    />
                  </div>
                  
                  <div>
                    <Label>Целевой сегмент</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Выберите сегмент" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Все игроки</SelectItem>
                        <SelectItem value="new">Новые игроки</SelectItem>
                        <SelectItem value="vip">VIP игроки</SelectItem>
                        <SelectItem value="at-risk">В риске оттока</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label>Приоритет</Label>
                    <Select defaultValue="medium">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="high">Высокий</SelectItem>
                        <SelectItem value="medium">Средний</SelectItem>
                        <SelectItem value="low">Низкий</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}