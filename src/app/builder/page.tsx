import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Activity, BotMessageSquare, CheckCircle, Clock, GitBranch, Mail, MessageSquare, PlusCircle, Smartphone, Zap, Gift } from "lucide-react";

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
        <main className="flex-1 p-6">
            <div className="flex h-full w-full items-center justify-center rounded-lg border-2 border-dashed border-muted bg-background">
                <div className="text-center">
                    <h2 className="text-xl font-semibold">Холст для сценария</h2>
                    <p className="text-muted-foreground">Перетащите сюда элементы, чтобы начать строить сценарий</p>
                </div>
            </div>
        </main>
      </div>
    </div>
  );
}
