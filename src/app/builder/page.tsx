import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Activity, ArrowDown, BotMessageSquare, CheckCircle, Clock, GitBranch, Mail, MessageSquare, PlusCircle, Smartphone, Zap, Gift, Lightbulb } from "lucide-react";
import { cn } from "@/lib/utils";

const triggerElements = [
  { name: 'Регистрация', icon: PlusCircle, description: 'Сценарий запускается при регистрации нового пользователя.' },
  { name: 'Первый депозит', icon: CheckCircle, description: 'Срабатывает после первого пополнения счета.' },
  { name: 'Сегмент', icon: GitBranch, description: 'Срабатывает при попадании игрока в определенный сегмент.' },
];

const actionElements = [
  { name: 'Отправить Email', icon: Mail, description: 'Отправка email-сообщения через SendGrid.' },
  { name: 'Отправить Push', icon: Smartphone, description: 'Отправка push-уведомления.' },
  { name: 'Отправить SMS', icon: MessageSquare, description: 'Отправка SMS через Twilio.' },
  { name: 'In-App сообщение', icon: Zap, description: 'Показ сообщения внутри приложения.' },
  { name: 'Начислить бонус', icon: Gift, description: 'Начисление бонусных баллов или фриспинов игроку.' },
];

const logicElements = [
  { name: 'Задержка', icon: Clock, description: 'Пауза в сценарии на заданное время.' },
  { name: 'Условие "Если/То"', icon: GitBranch, description: 'Разветвление сценария на основе данных игрока.' },
  { name: 'A/B тест', icon: Activity, description: 'Разделение аудитории для проверки гипотез.' },
];


const ScenarioNode = ({ icon: Icon, title, children, className }: { icon: React.ElementType, title: string, children?: React.ReactNode, className?: string }) => {
  return (
    <Card className={cn("w-64 absolute shadow-lg hover:shadow-xl transition-shadow bg-card z-10", className)}>
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


export default function BuilderPage() {
  return (
    <div className="flex h-[calc(100vh-4rem)] flex-col">
       <header className="flex h-16 items-center justify-between border-b bg-background/95 px-6">
        <div>
          <h1 className="text-xl font-bold tracking-tight">Конструктор сценариев</h1>
          <p className="text-sm text-muted-foreground">Создавайте автоматизированные CRM-цепочки</p>
        </div>
        <div className="flex items-center gap-2">
            <Button variant="outline">Сохранить как черновик</Button>
            <Button>Активировать сценарий</Button>
            <Button variant="accent" className="bg-accent text-accent-foreground hover:bg-accent/90">
                <BotMessageSquare className="mr-2 h-4 w-4"/>
                AI Co-pilot
            </Button>
        </div>
      </header>
      <div className="grid flex-1 md:grid-cols-[260px_1fr]">
        <aside className="hidden flex-col border-r bg-background/80 md:flex">
            <div className="flex-1 p-4">
                <h3 className="mb-4 text-lg font-semibold">Элементы</h3>
                <ScrollArea className="h-[calc(100vh-12rem)]">
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
                {/* Example Scenario Flow */}
                <ScenarioNode icon={PlusCircle} title="Триггер: Регистрация" className="top-10 left-1/2 -translate-x-1/2" />
                <Connector className="top-[100px] left-1/2 -translate-x-1/2 w-0.5 h-16" />

                <ScenarioNode icon={Clock} title="Задержка: 1 час" className="top-40 left-1/2 -translate-x-1/2">
                  <p className="text-sm text-muted-foreground">Ожидаем 60 минут перед следующим шагом.</p>
                </ScenarioNode>
                <Connector className="top-[248px] left-1/2 -translate-x-1/2 w-0.5 h-16" />

                <ScenarioNode icon={Mail} title="Действие: Отправить Email" className="top-80 left-1/2 -translate-x-1/2">
                   <p className="text-sm text-muted-foreground mb-3">Шаблон: "Welcome Email #1".</p>
                   <Button variant="outline" size="sm" className="w-full">
                      <Lightbulb className="mr-2 h-4 w-4 text-yellow-400"/>
                      Улучшить контент с AI
                   </Button>
                </ScenarioNode>
                <Connector className="top-[416px] left-1/2 -translate-x-1/2 w-0.5 h-16" />
                
                <ScenarioNode icon={GitBranch} title="Условие: A/B тест 50/50" className="top-[496px] left-1/2 -translate-x-1/2"/>

                {/* Branching Connectors */}
                <div className="absolute top-[568px] left-1/2 -translate-x-1/2 w-0.5 h-8 bg-muted-foreground/50 z-0"></div>
                <div className="absolute top-[600px] left-[calc(50%-200px)] w-[400px] h-0.5 bg-muted-foreground/50 z-0"></div>
                <div className="absolute top-[600px] left-[calc(50%-200px)] w-0.5 h-8 bg-muted-foreground/50 z-0"><ArrowDown className="h-4 w-4 text-muted-foreground/80 absolute -bottom-5 -left-[7px]" /></div>
                <div className="absolute top-[600px] right-[calc(50%-200px)] w-0.5 h-8 bg-muted-foreground/50 z-0"><ArrowDown className="h-4 w-4 text-muted-foreground/80 absolute -bottom-5 -left-[7px]" /></div>

                {/* Branch A */}
                <ScenarioNode icon={Gift} title="Действие: Бонус 'A'" className="top-[660px] left-[calc(50%-200px)] -translate-x-1/2">
                  <p className="text-sm text-muted-foreground">Начислить 10 фриспинов.</p>
                </ScenarioNode>

                 {/* Branch B */}
                <ScenarioNode icon={Gift} title="Действие: Бонус 'B'" className="top-[660px] left-[calc(50%+200px)] -translate-x-1/2">
                   <p className="text-sm text-muted-foreground">Начислить 100% на депозит.</p>
                </ScenarioNode>
            </div>
        </main>
      </div>
    </div>
  );
}
