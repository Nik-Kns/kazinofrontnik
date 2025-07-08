
"use client";

import * as React from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Activity, ArrowLeft, Bot, BotMessageSquare, CheckCircle, ClipboardCopy, Clock, FileText, GitBranch, Gift, Lightbulb, Mail, MessageSquare, Pencil, PlusCircle, Smartphone, Sparkles, Star, Trash2, Zap } from "lucide-react";
import { cn } from "@/lib/utils";
import { Sheet, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle, SheetClose } from '@/components/ui/sheet';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { segmentsData, scenariosData, templatesData } from '@/lib/mock-data';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import type { ScenarioData } from '@/lib/types';
import { Textarea } from '@/components/ui/textarea';
import { Slider } from '@/components/ui/slider';

import ReactFlow, {
  Controls,
  MiniMap,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  ReactFlowProvider,
  Handle,
  Position,
  useReactFlow,
  getBezierPath,
  EdgeLabelRenderer,
  BaseEdge,
  type Node,
  type Edge,
  type OnConnect,
} from 'reactflow';
import 'reactflow/dist/style.css';

// --- Helper components & data for TABS ---

// For "Templates" Tab
const channelIconsTemplates: { [key: string]: React.ElementType } = {
  Email: Mail,
  Push: Smartphone,
  SMS: MessageSquare,
  InApp: Zap,
  "Multi-channel": Zap,
};

const PerformanceStars = ({ count }: { count: number }) => (
  <div className="flex items-center gap-0.5">
    {Array.from({ length: 5 }).map((_, i) => (
      <Star key={i} className={`h-4 w-4 ${i < count ? 'text-yellow-400 fill-yellow-400' : 'text-muted-foreground/50'}`} />
    ))}
  </div>
);

// For "Campaigns" Tab
const channelIconsScenarios: Record<string, React.ElementType> = {
  Email: Mail,
  Push: Smartphone,
  SMS: MessageSquare,
  InApp: Zap,
  "Multi-channel": Zap,
};

const statusColors: { [key: string]: string } = {
  Активен: "bg-success",
  Пауза: "bg-warning",
  Завершён: "bg-muted-foreground",
};

const frequencyColors: { [key: string]: string } = {
  Триггерный: "secondary",
  Регулярный: "default",
  Разовый: "outline",
}

// --- TAB COMPONENTS ---

const AllCampaignsTab = ({ onEdit }: { onEdit: (scenario: ScenarioData) => void }) => (
    <Card>
      <CardHeader>
        <CardTitle>Все сценарии и кампании</CardTitle>
        <CardDescription>
          Сводная таблица всех CRM-сценариев с ключевыми показателями эффективности.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[250px]">Название сценария</TableHead>
              <TableHead>Тип</TableHead>
              <TableHead>Канал</TableHead>
              <TableHead>Статус</TableHead>
              <TableHead>Сегмент</TableHead>
              <TableHead>Цель</TableHead>
              <TableHead className="text-right">CR</TableHead>
              <TableHead className="text-right">Действия</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {scenariosData.map((scenario) => {
              const ChannelIcon = channelIconsScenarios[scenario.channel];
              return (
                <TableRow key={scenario.name}>
                  <TableCell className="font-medium">{scenario.name}</TableCell>
                  <TableCell>
                     <Badge variant={frequencyColors[scenario.frequency] as "secondary" | "default" | "outline"}>{scenario.frequency}</Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <ChannelIcon className="h-4 w-4 text-muted-foreground" />
                      {scenario.channel}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <span className={cn("h-2.5 w-2.5 rounded-full", statusColors[scenario.status])} />
                      {scenario.status}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{scenario.segment}</Badge>
                  </TableCell>
                  <TableCell>{scenario.goal}</TableCell>
                  <TableCell className="text-right text-success font-semibold">{scenario.cr}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="icon" onClick={() => onEdit(scenario)}>
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon">
                      <FileText className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
);

const TemplatesTab = () => (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {templatesData.map(template => {
          const ChannelIcon = channelIconsTemplates[template.channel];
          return (
            <Card key={template.id} className="flex flex-col">
              <CardHeader>
                <div className="flex items-start justify-between">
                    <div>
                        <Badge variant="secondary" className="mb-2">{template.category}</Badge>
                        <CardTitle>{template.name}</CardTitle>
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                        <ChannelIcon className="h-5 w-5"/>
                        <span>{template.channel}</span>
                    </div>
                </div>
                <CardDescription>{template.description}</CardDescription>
              </CardHeader>
              <CardContent className="flex flex-1 flex-col justify-end">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-xs text-muted-foreground mb-1">Эффективность</p>
                        <PerformanceStars count={template.performance} />
                    </div>
                    <Button>
                        <ClipboardCopy className="mr-2 h-4 w-4" />
                        Клонировать
                    </Button>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>
);


// --- Builder Components ---

const triggerElements = [
  { name: 'Попадание в сегмент', icon: GitBranch, description: 'Срабатывает при попадании игрока в определенный сегмент.', type: 'segmentTrigger' },
  { name: 'Регистрация', icon: PlusCircle, description: 'Сценарий запускается при регистрации нового пользователя.', type: 'registrationTrigger' },
  { name: 'Первый депозит', icon: CheckCircle, description: 'Срабатывает после первого пополнения счета.', type: 'depositTrigger' },
];

const actionElements = [
  { name: 'Отправить Email', icon: Mail, description: 'Отправка email-сообщения через SendGrid.', type: 'emailAction' },
  { name: 'Отправить Push', icon: Smartphone, description: 'Отправка push-уведомления.', type: 'pushAction' },
  { name: 'Отправить SMS', icon: MessageSquare, description: 'Отправка SMS через Twilio.', type: 'smsAction' },
  { name: 'In-App сообщение', icon: Zap, description: 'Показ сообщения внутри приложения.', type: 'inappAction' },
  { name: 'Начислить бонус', icon: Gift, description: 'Начисление бонусных баллов или фриспинов игроку.', type: 'bonusAction' },
];

const logicElements = [
  { name: 'Задержка', icon: Clock, description: 'Пауза в сценарии на заданное время.', type: 'delayLogic' },
  { name: 'Условие "Если/То"', icon: GitBranch, description: 'Разветвление сценария на основе данных игрока.', type: 'ifElseLogic' },
  { name: 'A/B тест', icon: Activity, description: 'Разделение аудитории для проверки гипотез.', type: 'abTestLogic' },
];

const elementLibrary = {
    ...triggerElements.reduce((acc, el) => ({ ...acc, [el.type]: el }), {}),
    ...actionElements.reduce((acc, el) => ({ ...acc, [el.type]: el }), {}),
    ...logicElements.reduce((acc, el) => ({ ...acc, [el.type]: el }), {}),
};


const NodeConfigPanel = ({ node, isOpen, onOpenChange }: { node: Node | null, isOpen: boolean, onOpenChange: (open: boolean) => void }) => {
    if (!node) return null;

    const renderForm = () => {
        switch(node.data.configType) {
            case 'segmentTrigger':
                return (
                     <div className="space-y-4">
                        <Label>Выберите сегмент</Label>
                        <Select defaultValue={segmentsData[2].id}>
                            <SelectTrigger>
                                <SelectValue placeholder="Выберите сегмент..." />
                            </SelectTrigger>
                            <SelectContent>
                                {segmentsData.map(s => <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>)}
                            </SelectContent>
                        </Select>
                        <Card className="bg-muted/50">
                            <CardContent className="p-3 text-sm text-muted-foreground">
                                <p className="font-bold mb-2">Описание сегмента:</p>
                                {segmentsData.find(s => s.id === (node.data.config?.segmentId || segmentsData[2].id))?.description}
                            </CardContent>
                        </Card>
                     </div>
                );
            case 'emailAction':
                return (
                    <div className="space-y-4">
                        <div>
                            <Label>Интеграция</Label>
                            <div className="flex items-center gap-2 rounded-md border p-2 bg-muted/50">
                                <img src="https://www.vectorlogo.zone/logos/sendgrid/sendgrid-icon.svg" alt="SendGrid" className="h-5 w-5"/>
                                <span className="text-sm font-medium">Отправка через SendGrid</span>
                            </div>
                        </div>
                         <div>
                            <Label htmlFor="email-template">Шаблон письма</Label>
                            <Select defaultValue="we-miss-you">
                                <SelectTrigger id="email-template"><SelectValue /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="we-miss-you">We miss you bonus</SelectItem>
                                    <SelectItem value="welcome-gift">Welcome Gift</SelectItem>
                                    <SelectItem value="deposit-success">Успешный депозит</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div>
                            <Label htmlFor="email-subject">Тема письма</Label>
                            <Input id="email-subject" defaultValue="Для вас специальный бонус!"/>
                        </div>
                        <div>
                            <Label>Контент</Label>
                            <Tabs defaultValue="ai" className="w-full">
                                <TabsList className="grid w-full grid-cols-2">
                                    <TabsTrigger value="ai"><Bot className="mr-2 h-4 w-4"/> С AI</TabsTrigger>
                                    <TabsTrigger value="manual">Редактор</TabsTrigger>
                                </TabsList>
                                <TabsContent value="ai" className="pt-4 space-y-2">
                                    <Textarea placeholder="Опишите суть письма: напомнить про бонус, поздравить с годовщиной регистрации..." defaultValue="Напомни игроку, что мы скучаем и даем ему 25 фриспинов на Book of Ra, если он вернется."/>
                                    <Button className="w-full"><Bot className="mr-2 h-4 w-4"/>Сгенерировать</Button>
                                </TabsContent>
                                <TabsContent value="manual" className="pt-4">
                                    <Textarea defaultValue="Привет, {{firstName}}! Мы скучали! Чтобы скрасить твое возвращение, мы начислили тебе 25 фриспинов в игре Book of Ra. Жми на кнопку и забирай свой подарок!" className="min-h-[200px]"/>
                                </TabsContent>
                            </Tabs>
                        </div>
                    </div>
                )
            case 'ifElseLogic':
                return (
                    <div className="space-y-4">
                       <Label>Условие ветвления</Label>
                       <div className="p-4 border rounded-lg space-y-2 bg-muted/30">
                           <p className="text-sm">Если пользователь соответствует правилу:</p>
                           <div className="flex items-center gap-2">
                               <Select defaultValue="Monetary Value (total spend)">
                                   <SelectTrigger><SelectValue/></SelectTrigger>
                                   <SelectContent><SelectItem value="Monetary Value (total spend)">Lifetime Spend</SelectItem></SelectContent>
                               </Select>
                               <Select defaultValue="больше чем">
                                   <SelectTrigger><SelectValue/></SelectTrigger>
                                   <SelectContent><SelectItem value="больше чем">больше чем</SelectItem></SelectContent>
                               </Select>
                               <Input placeholder="Значение" defaultValue="1000" />
                           </div>
                       </div>
                       <p className="text-sm text-muted-foreground">Пользователи, не соответствующие правилу, пойдут по ветке "Else".</p>
                    </div>
                )
             case 'abTestLogic':
                return (
                    <div className="space-y-6">
                        <Label>Разделение трафика</Label>
                        <div className="flex items-center gap-4">
                            <span className="text-sm font-medium">Ветка A</span>
                            <Slider defaultValue={[50]} max={100} step={1} />
                            <span className="text-sm font-medium">Ветка B</span>
                        </div>
                        <div className="flex justify-between text-sm font-bold text-primary">
                            <span>50%</span>
                            <span>50%</span>
                        </div>
                        <p className="text-xs text-muted-foreground">Аудитория будет случайным образом разделена в указанной пропорции для отправки разных версий сообщения.</p>
                    </div>
                )
            case 'bonusAction':
                 return (
                     <div className="space-y-4">
                         <div>
                            <Label htmlFor="bonus-type">Тип бонуса</Label>
                            <Select defaultValue="freespins">
                                <SelectTrigger id="bonus-type">
                                    <SelectValue placeholder="Выберите тип" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="freespins">Фриспины</SelectItem>
                                    <SelectItem value="deposit_bonus">Бонус на депозит</SelectItem>
                                    <SelectItem value="cashback">Кэшбек</SelectItem>
                                </SelectContent>
                            </Select>
                         </div>
                         <div>
                            <Label htmlFor="bonus-amount">Количество / Процент</Label>
                            <Input id="bonus-amount" type="number" defaultValue="25" />
                         </div>
                         <div>
                            <Label htmlFor="bonus-wager">Вейджер (Wager)</Label>
                            <Input id="bonus-wager" type="number" defaultValue="40" placeholder="x40" />
                         </div>
                         <div>
                            <Label htmlFor="bonus-ttl">Срок жизни бонуса (в часах)</Label>
                            <Input id="bonus-ttl" type="number" defaultValue="72" />
                         </div>
                     </div>
                 )
            default:
                return <p className="text-muted-foreground">Для этого элемента нет дополнительных настроек.</p>
        }
    }

    return (
        <Sheet open={isOpen} onOpenChange={onOpenChange}>
            <SheetContent className="sm:max-w-md">
                <SheetHeader>
                    <SheetTitle>Настройка: {node.data.label}</SheetTitle>
                    <SheetDescription>
                        Отредактируйте параметры для выбранного элемента сценария.
                    </SheetDescription>
                </SheetHeader>
                <div className="py-6">
                    {renderForm()}
                </div>
                <SheetFooter>
                    <SheetClose asChild>
                        <Button type="button" variant="secondary">Отмена</Button>
                    </SheetClose>
                     <SheetClose asChild>
                        <Button type="submit">Сохранить</Button>
                    </SheetClose>
                </SheetFooter>
            </SheetContent>
        </Sheet>
    )
}

// --- React Flow Implementation ---

const initialNodes: Node[] = [
  { id: '1', type: 'custom', position: { x: 250, y: 5 }, data: { label: 'Триггер: Попал в сегмент', description: 'Сегмент: Риск оттока (предиктивный)', icon: GitBranch, configType: 'segmentTrigger' } },
  { id: '2', type: 'custom', position: { x: 250, y: 155 }, data: { label: 'Условие: VIP игрок?', description: 'Если Lifetime Spend > €1000', icon: GitBranch, configType: 'ifElseLogic' } },
  { id: '3', type: 'custom', position: { x: 50, y: 305 }, data: { label: 'Действие: Начислить бонус', description: 'Тип: Кэшбек, Кол-во: 10%', icon: Gift, configType: 'bonusAction' } },
  { id: '4', type: 'custom', position: { x: 450, y: 305 }, data: { label: 'Логика: A/B тест', description: 'Разделение 50% / 50%', icon: Activity, configType: 'abTestLogic' } },
  { id: '5', type: 'custom', position: { x: 350, y: 455 }, data: { label: 'Действие: Email (Скидка)', description: 'Шаблон: "Скидка 15%"', icon: Mail, configType: 'emailAction' } },
  { id: '6', type: 'custom', position: { x: 550, y: 455 }, data: { label: 'Действие: Email (Бонус)', description: 'Шаблон: "Бонус 25 FS"', icon: Mail, configType: 'emailAction' } },
];

const initialEdges: Edge[] = [
  { id: 'e1-2', source: '1', target: '2', animated: true, type: 'custom' },
  { id: 'e2-3', source: '2', target: '3', label: 'Да', type: 'custom' },
  { id: 'e2-4', source: '2', target: '4', label: 'Нет', type: 'custom' },
  { id: 'e4-5', source: '4', target: '5', label: 'Ветка A', type: 'custom' },
  { id: 'e4-6', source: '4', target: '6', label: 'Ветка B', type: 'custom' },
];

const CustomNode = ({ data }: { data: { label: string, description: string, icon: React.ElementType } }) => {
  const Icon = data.icon;
  return (
    <>
      <Handle type="target" position={Position.Top} className="!bg-primary" />
      <Card className="w-72 shadow-lg hover:shadow-xl transition-shadow bg-card z-10 hover:border-primary">
        <CardContent className="p-4">
          <div className="flex items-center gap-3 mb-2">
            <Icon className="h-5 w-5 text-primary" />
            <h4 className="font-semibold">{data.label}</h4>
          </div>
          <p className="text-sm text-muted-foreground">{data.description}</p>
        </CardContent>
      </Card>
      <Handle type="source" position={Position.Bottom} className="!bg-primary" />
    </>
  );
};

function CustomEdge({ id, sourceX, sourceY, targetX, targetY, sourcePosition, targetPosition, style = {}, label }: any) {
  const { setEdges } = useReactFlow();
  const [edgePath, labelX, labelY] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });

  const onEdgeClick = (evt: React.MouseEvent) => {
    evt.stopPropagation();
    setEdges((edges) => edges.filter((edge) => edge.id !== id));
  };

  return (
    <>
      <BaseEdge path={edgePath} style={style} />
      <EdgeLabelRenderer>
        <div
          style={{
            position: 'absolute',
            transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
            pointerEvents: 'all',
          }}
          className="nodrag nopan bg-background p-1 rounded-md text-xs font-semibold"
        >
          {label}
        </div>
        <div
           style={{
            position: 'absolute',
            transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
            pointerEvents: 'all',
          }}
          className="nodrag nopan group"
        >
            <Button
                variant="destructive"
                className="h-6 w-6 opacity-0 group-hover:opacity-100"
                size="icon"
                onClick={onEdgeClick}
                >
                <Trash2 className="h-3 w-3" />
            </Button>
        </div>
      </EdgeLabelRenderer>
    </>
  );
}

const nodeTypes = {
  custom: CustomNode,
};

const edgeTypes = {
  custom: CustomEdge,
};

let id = 7;
const getId = () => `dndnode_${id++}`;

const Builder = ({ onExit, scenario }: { onExit: () => void; scenario: ScenarioData | null }) => {
    const reactFlowWrapper = React.useRef<HTMLDivElement>(null);
    const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
    const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
    const [selectedNode, setSelectedNode] = React.useState<Node | null>(null);
    const [isSheetOpen, setIsSheetOpen] = React.useState(false);
    const { screenToFlowPosition } = useReactFlow();

    const onConnect: OnConnect = React.useCallback(
        (params) => setEdges((eds) => addEdge({ ...params, animated: true, type: 'custom' }, eds)),
        [setEdges]
    );

    const handleNodeClick = React.useCallback((event: React.MouseEvent, node: Node) => {
        setSelectedNode(node);
        setIsSheetOpen(true);
    }, []);

    const onDragStart = (event: React.DragEvent<HTMLDivElement>, nodeType: string) => {
        event.dataTransfer.setData('application/reactflow', nodeType);
        event.dataTransfer.effectAllowed = 'move';
    };

    const onDragOver = React.useCallback((event: React.DragEvent) => {
        event.preventDefault();
        event.dataTransfer.dropEffect = 'move';
    }, []);

    const onDrop = React.useCallback(
        (event: React.DragEvent) => {
            event.preventDefault();

            if (!reactFlowWrapper.current) return;
            const type = event.dataTransfer.getData('application/reactflow');

            if (typeof type === 'undefined' || !type) {
                return;
            }

            const position = screenToFlowPosition({
                x: event.clientX,
                y: event.clientY,
            });

            const elementInfo = elementLibrary[type as keyof typeof elementLibrary];

            if (!elementInfo) return;

            const newNode: Node = {
                id: getId(),
                type: 'custom',
                position,
                data: { label: elementInfo.name, description: elementInfo.description, icon: elementInfo.icon, configType: elementInfo.type },
            };
            
            setNodes((nds) => nds.concat(newNode));
        },
        [screenToFlowPosition, setNodes]
    );

    const DraggableNode = ({ item }: { item: { name: string, icon: React.ElementType, description: string, type: string } }) => (
        <div
            className="mb-2 cursor-grab rounded-lg border p-3 hover:shadow-md active:cursor-grabbing bg-background"
            onDragStart={(event) => onDragStart(event, item.type)}
            draggable
        >
            <div className="flex items-center gap-3">
                <item.icon className="h-5 w-5 text-primary" />
                <span className="font-semibold">{item.name}</span>
            </div>
            <p className="mt-1 text-xs text-muted-foreground">{item.description}</p>
        </div>
    );
    
    return (
        <div className="fixed inset-0 bg-background z-50 flex flex-col">
            <header className="flex h-16 shrink-0 items-center justify-between border-b bg-background/95 px-6 flex-wrap gap-2 z-10">
                <div className="flex items-center gap-4">
                    <Button variant="outline" size="icon" onClick={onExit}>
                        <ArrowLeft className="h-4 w-4" />
                    </Button>
                    <div>
                        <h1 className="text-xl font-bold tracking-tight">{scenario?.name || "Новый сценарий"}</h1>
                        <p className="text-sm text-muted-foreground">Создавайте автоматизированные CRM-цепочки</p>
                    </div>
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                    <Button variant="outline" size="sm"> <Sparkles className="mr-2 h-4 w-4" />Prettify</Button>
                    <Button variant="outline">Сохранить как черновик</Button>
                    <Button>Активировать сценарий</Button>
                    <Button variant="accent" className="bg-accent text-accent-foreground hover:bg-accent/90">
                        <BotMessageSquare className="mr-2 h-4 w-4" />
                        AI Co-pilot
                    </Button>
                </div>
            </header>
            <div className="flex flex-1 flex-row overflow-hidden">
                <aside className="hidden w-[260px] flex-shrink-0 flex-col border-r bg-background/80 md:flex">
                    <div className="flex flex-1 flex-col p-4">
                        <h3 className="mb-4 text-lg font-semibold">Элементы</h3>
                        <ScrollArea className="flex-1">
                            <div className="space-y-6 p-1">
                                <div>
                                    <h4 className="mb-2 text-sm font-medium text-muted-foreground">Триггеры</h4>
                                    {triggerElements.map(item => <DraggableNode key={item.name} item={item} />)}
                                </div>
                                <div>
                                    <h4 className="mb-2 text-sm font-medium text-muted-foreground">Действия</h4>
                                    {actionElements.map(item => <DraggableNode key={item.name} item={item} />)}
                                </div>
                                <div>
                                    <h4 className="mb-2 text-sm font-medium text-muted-foreground">Логика</h4>
                                    {logicElements.map(item => <DraggableNode key={item.name} item={item} />)}
                                </div>
                            </div>
                        </ScrollArea>
                    </div>
                </aside>
                <main className="flex-1" ref={reactFlowWrapper}>
                    <ReactFlow
                        nodes={nodes}
                        edges={edges}
                        onNodesChange={onNodesChange}
                        onEdgesChange={onEdgesChange}
                        onConnect={onConnect}
                        onNodeClick={handleNodeClick}
                        nodeTypes={nodeTypes}
                        edgeTypes={edgeTypes}
                        onDrop={onDrop}
                        onDragOver={onDragOver}
                        fitView
                    >
                        <Controls />
                        <MiniMap />
                        <Background gap={16} />
                    </ReactFlow>
                </main>
            </div>
            <NodeConfigPanel node={selectedNode} isOpen={isSheetOpen} onOpenChange={setIsSheetOpen} />
        </div>
    );
};

const BuilderWrapper = (props: { onExit: () => void; scenario: ScenarioData | null }) => (
    <ReactFlowProvider>
        <Builder {...props} />
    </ReactFlowProvider>
);


export default function ScenariosPage() {
    const [activeTab, setActiveTab] = React.useState('campaigns');
    const [isBuilderMode, setIsBuilderMode] = React.useState(false);
    const [editingScenario, setEditingScenario] = React.useState<ScenarioData | null>(null);

    const handleEditClick = (scenario: ScenarioData) => {
        setEditingScenario(scenario);
        setIsBuilderMode(true);
    };

    const handleTabChange = (value: string) => {
        if (value === 'builder') {
            setEditingScenario(null);
            setIsBuilderMode(true);
        } else {
            setIsBuilderMode(false);
            setActiveTab(value);
        }
    };
    
    const handleExitBuilder = () => {
        setIsBuilderMode(false);
        setEditingScenario(null);
    };

    return (
        <div className="p-4 md:p-6 lg:p-8">
            <h1 className="text-2xl font-bold tracking-tight">Сценарии</h1>
            <p className="text-muted-foreground mb-6">
                Создавайте, управляйте и анализируйте ваши CRM-кампании и сценарии.
            </p>
            <Tabs value={isBuilderMode ? 'builder' : activeTab} onValueChange={handleTabChange} className="w-full">
                <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4">
                    <TabsTrigger value="campaigns">Все кампании</TabsTrigger>
                    <TabsTrigger value="active">Активные</TabsTrigger>
                    <TabsTrigger value="templates">Шаблоны сценариев</TabsTrigger>
                    <TabsTrigger value="builder">Конструктор</TabsTrigger>
                </TabsList>
                <TabsContent value="campaigns" className="mt-6">
                    <AllCampaignsTab onEdit={handleEditClick} />
                </TabsContent>
                <TabsContent value="active" className="mt-6">
                    <AllCampaignsTab onEdit={handleEditClick} />
                </TabsContent>
                <TabsContent value="templates" className="mt-6">
                    <TemplatesTab />
                </TabsContent>
            </Tabs>

            {isBuilderMode && <BuilderWrapper onExit={handleExitBuilder} scenario={editingScenario} />}
        </div>
    );
}
