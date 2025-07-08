"use client";

import * as React from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Activity, ArrowDown, BotMessageSquare, CheckCircle, Clock, GitBranch, Mail, MessageSquare, PlusCircle, Smartphone, Zap, Gift, Lightbulb, ClipboardCopy, Star, FileText, ArrowUpRight, ArrowLeft } from "lucide-react";
import { cn } from "@/lib/utils";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetFooter, SheetClose } from '@/components/ui/sheet';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { segmentsData, scenariosData, templatesData } from '@/lib/mock-data';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

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
const channelIconsScenarios = {
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

const AllCampaignsTab = () => (
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
                    <Button variant="ghost" size="icon">
                      <ArrowUpRight className="h-4 w-4" />
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


// --- Builder Components (from original page) ---

const triggerElements = [
  { name: 'Попадание в сегмент', icon: GitBranch, description: 'Срабатывает при попадании игрока в определенный сегмент.', type: 'segment_trigger' },
  { name: 'Регистрация', icon: PlusCircle, description: 'Сценарий запускается при регистрации нового пользователя.', type: 'registration_trigger' },
  { name: 'Первый депозит', icon: CheckCircle, description: 'Срабатывает после первого пополнения счета.', type: 'deposit_trigger' },
];

const actionElements = [
  { name: 'Отправить Email', icon: Mail, description: 'Отправка email-сообщения через SendGrid.', type: 'email_action' },
  { name: 'Отправить Push', icon: Smartphone, description: 'Отправка push-уведомления.', type: 'push_action' },
  { name: 'Отправить SMS', icon: MessageSquare, description: 'Отправка SMS через Twilio.', type: 'sms_action' },
  { name: 'In-App сообщение', icon: Zap, description: 'Показ сообщения внутри приложения.', type: 'inapp_action' },
  { name: 'Начислить бонус', icon: Gift, description: 'Начисление бонусных баллов или фриспинов игроку.', type: 'bonus_action' },
];

const logicElements = [
  { name: 'Задержка', icon: Clock, description: 'Пауза в сценарии на заданное время.', type: 'delay_logic' },
  { name: 'Условие "Если/То"', icon: GitBranch, description: 'Разветвление сценария на основе данных игрока.', type: 'if_else_logic' },
  { name: 'A/B тест', icon: Activity, description: 'Разделение аудитории для проверки гипотез.', type: 'ab_test_logic' },
];

const ScenarioNode = ({ icon: Icon, title, children, className, onClick }: { icon: React.ElementType, title: string, children?: React.ReactNode, className?: string, onClick?: () => void }) => {
  return (
    <Card className={cn("w-72 absolute shadow-lg hover:shadow-xl transition-shadow bg-card z-10 cursor-pointer hover:border-primary", className)} onClick={onClick}>
      <CardContent className="p-4">
        <div className="flex items-center gap-3 mb-2">
          <Icon className="h-5 w-5 text-primary" />
          <h4 className="font-semibold">{title}</h4>
        </div>
        {children}
      </CardContent>
    </Card>
  )
};

const Connector = ({ className }: { className?: string }) => {
  return (
    <div className={cn("absolute bg-muted-foreground/50 flex items-center justify-center z-0", className)}>
      <ArrowDown className="h-4 w-4 text-muted-foreground/80" />
    </div>
  )
};

const NodeConfigPanel = ({ node, isOpen, onOpenChange }: { node: any, isOpen: boolean, onOpenChange: (open: boolean) => void }) => {
    if (!node) return null;

    const renderForm = () => {
        switch(node.type) {
            case 'segment_trigger':
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
                                {segmentsData.find(s => s.id === (node.config?.segmentId || segmentsData[2].id))?.description}
                            </CardContent>
                        </Card>
                     </div>
                );
            case 'bonus_action':
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
                    <SheetTitle>Настройка: {node.title}</SheetTitle>
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

const BuilderTab = ({ onExit }: { onExit: () => void }) => {
    const [selectedNode, setSelectedNode] = React.useState<any>(null);
    const [isSheetOpen, setIsSheetOpen] = React.useState(false);

    const handleNodeClick = (node: any) => {
        setSelectedNode(node);
        setIsSheetOpen(true);
    };

    return (
        <div className="flex h-full flex-1 flex-col">
            <header className="flex h-16 shrink-0 items-center justify-between border-b bg-background/95 px-6">
                <div className="flex items-center gap-4">
                    <Button variant="outline" size="icon" onClick={onExit}>
                        <ArrowLeft className="h-4 w-4" />
                    </Button>
                    <div>
                        <h1 className="text-xl font-bold tracking-tight">Welcome-цепочка для новичков</h1>
                        <p className="text-sm text-muted-foreground">Создавайте автоматизированные CRM-цепочки</p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <Button variant="outline">Сохранить как черновик</Button>
                    <Button>Активировать сценарий</Button>
                    <Button variant="accent" className="bg-accent text-accent-foreground hover:bg-accent/90">
                        <BotMessageSquare className="mr-2 h-4 w-4" />
                        AI Co-pilot
                    </Button>
                </div>
            </header>
            <div className="grid flex-1 md:grid-cols-[260px_1fr]">
                <aside className="hidden flex-col border-r bg-background/80 md:flex">
                    <div className="flex flex-1 flex-col p-4">
                        <h3 className="mb-4 text-lg font-semibold">Элементы</h3>
                        <ScrollArea className="flex-1">
                            <div className="space-y-6 p-1">
                                <div>
                                    <h4 className="mb-2 text-sm font-medium text-muted-foreground">Триггеры</h4>
                                    {triggerElements.map(item => (
                                        <div key={item.name} className="mb-2 cursor-grab rounded-lg border p-3 hover:shadow-md active:cursor-grabbing">
                                            <div className="flex items-center gap-3">
                                                <item.icon className="h-5 w-5 text-primary" />
                                                <span className="font-semibold">{item.name}</span>
                                            </div>
                                            <p className="mt-1 text-xs text-muted-foreground">{item.description}</p>
                                        </div>
                                    ))}
                                </div>
                                <div>
                                    <h4 className="mb-2 text-sm font-medium text-muted-foreground">Действия</h4>
                                    {actionElements.map(item => (
                                        <div key={item.name} className="mb-2 cursor-grab rounded-lg border p-3 hover:shadow-md active:cursor-grabbing">
                                            <div className="flex items-center gap-3">
                                                <item.icon className="h-5 w-5 text-primary" />
                                                <span className="font-semibold">{item.name}</span>
                                            </div>
                                            <p className="mt-1 text-xs text-muted-foreground">{item.description}</p>
                                        </div>
                                    ))}
                                </div>
                                <div>
                                    <h4 className="mb-2 text-sm font-medium text-muted-foreground">Логика</h4>
                                    {logicElements.map(item => (
                                        <div key={item.name} className="mb-2 cursor-grab rounded-lg border p-3 hover:shadow-md active:cursor-grabbing">
                                            <div className="flex items-center gap-3">
                                                <item.icon className="h-5 w-5 text-primary" />
                                                <span className="font-semibold">{item.name}</span>
                                            </div>
                                            <p className="mt-1 text-xs text-muted-foreground">{item.description}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </ScrollArea>
                    </div>
                </aside>
                <main className="flex-1 p-6 bg-muted/30">
                    <div className="relative h-full w-full rounded-lg border-2 border-dashed border-muted bg-background overflow-auto p-8">
                        <ScenarioNode icon={GitBranch} title="Триггер: Попал в сегмент" className="top-10 left-1/2 -translate-x-1/2" onClick={() => handleNodeClick({ title: 'Триггер: Попал в сегмент', type: 'segment_trigger' })}>
                            <p className="text-sm text-muted-foreground">Сегмент: <span className="font-semibold text-foreground">Риск оттока (предиктивный)</span></p>
                        </ScenarioNode>
                        <Connector className="top-[108px] left-1/2 -translate-x-1/2 w-0.5 h-16" />

                        <ScenarioNode icon={Gift} title="Действие: Начислить бонус" className="top-44 left-1/2 -translate-x-1/2" onClick={() => handleNodeClick({ title: 'Действие: Начислить бонус', type: 'bonus_action' })}>
                            <p className="text-sm text-muted-foreground">Тип: Фриспины, Кол-во: 25</p>
                        </ScenarioNode>
                        <Connector className="top-[252px] left-1/2 -translate-x-1/2 w-0.5 h-16" />

                        <ScenarioNode icon={Mail} title="Действие: Отправить Email" className="top-80 left-1/2 -translate-x-1/2" onClick={() => handleNodeClick({ title: 'Действие: Отправить Email', type: 'email_action' })}>
                            <p className="text-sm text-muted-foreground mb-3">Шаблон: "We miss you bonus".</p>
                            <Button variant="outline" size="sm" className="w-full">
                                <Lightbulb className="mr-2 h-4 w-4 text-yellow-400" />
                                Улучшить контент с AI
                            </Button>
                        </ScenarioNode>
                    </div>
                </main>
            </div>
            <NodeConfigPanel node={selectedNode} isOpen={isSheetOpen} onOpenChange={setIsSheetOpen} />
        </div>
    )
};


export default function ScenariosPage() {
    const [activeTab, setActiveTab] = React.useState('campaigns');
    const [isBuilderMode, setIsBuilderMode] = React.useState(false);

    const handleTabChange = (value: string) => {
        if (value === 'builder') {
            setIsBuilderMode(true);
        } else {
            setActiveTab(value);
        }
    };

    if (isBuilderMode) {
        return <BuilderTab onExit={() => setIsBuilderMode(false)} />;
    }

    return (
        <div className="p-4 md:p-6 lg:p-8">
            <h1 className="text-2xl font-bold tracking-tight">Сценарии</h1>
            <p className="text-muted-foreground mb-6">
                Создавайте, управляйте и анализируйте ваши CRM-кампании и сценарии.
            </p>
            <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
                <TabsList className="grid w-full grid-cols-4">
                    <TabsTrigger value="campaigns">Все кампании</TabsTrigger>
                    <TabsTrigger value="active">Активные</TabsTrigger>
                    <TabsTrigger value="templates">Шаблоны сценариев</TabsTrigger>
                    <TabsTrigger value="builder">Конструктор</TabsTrigger>
                </TabsList>
                <TabsContent value="campaigns" className="mt-6">
                    <AllCampaignsTab />
                </TabsContent>
                <TabsContent value="active" className="mt-6">
                    <AllCampaignsTab />
                </TabsContent>
                <TabsContent value="templates" className="mt-6">
                    <TemplatesTab />
                </TabsContent>
                <TabsContent value="builder">
                    {/* The content is rendered conditionally at the top level */}
                </TabsContent>
            </Tabs>
        </div>
    );
}
