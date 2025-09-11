"use client";

import React from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
    Activity,
    CheckCircle,
    Clock,
    Gift,
    GitBranch,
    Mail,
    MessageSquare,
    PhoneCall,
    PlusCircle,
    Smartphone,
    Zap,
} from 'lucide-react';

const triggerElements = [
    { name: 'Попадание в сегмент', icon: GitBranch, description: 'Срабатывает при попадании игрока в определенный сегмент.', type: 'segmentTrigger' },
    { name: 'Регистрация', icon: PlusCircle, description: 'Сценарий запускается при регистрации нового пользователя.', type: 'registrationTrigger' },
    { name: 'Первый депозит', icon: CheckCircle, description: 'Срабатывает после первого пополнения счета.', type: 'depositTrigger' },
];

const actionElements = [
    { name: 'Отправить Email', icon: Mail, description: 'Отправка email-сообщения через SendGrid.', type: 'emailAction' },
    { name: 'Отправить Push', icon: Smartphone, description: 'Отправка push-уведомления.', type: 'pushAction' },
    { name: 'Отправить SMS', icon: MessageSquare, description: 'Отправка SMS через Twilio.', type: 'smsAction' },
    { name: 'AI Звонок', icon: PhoneCall, description: 'Инициировать звонок через Twilio с AI-ассистентом.', type: 'aiCallAction' },
    { name: 'In-App сообщение', icon: Zap, description: 'Показ сообщения внутри приложения.', type: 'inappAction' },
    { name: 'Начислить бонус', icon: Gift, description: 'Начисление бонусных баллов или фриспинов игроку.', type: 'bonusAction' },
];

const logicElements = [
    { name: 'Задержка', icon: Clock, description: 'Пауза в сценарии на заданное время.', type: 'delayLogic' },
    { name: 'Условие "Если/То"', icon: GitBranch, description: 'Разветвление сценария на основе данных игрока.', type: 'ifElseLogic' },
    { name: 'A/B тест', icon: Activity, description: 'Разделение аудитории для проверки гипотез.', type: 'abTestLogic' },
];

export const elementLibrary = {
    ...triggerElements.reduce((acc, el) => ({ ...acc, [el.type]: el }), {}),
    ...actionElements.reduce((acc, el) => ({ ...acc, [el.type]: el }), {}),
    ...logicElements.reduce((acc, el) => ({ ...acc, [el.type]: el }), {}),
};


const DraggableNode = ({ item }: { item: { name: string, icon: React.ElementType, description: string, type: string } }) => {
    const onDragStart = (event: React.DragEvent<HTMLDivElement>, nodeType: string) => {
        event.dataTransfer.setData('application/reactflow', nodeType);
        event.dataTransfer.effectAllowed = 'move';
    };

    return (
        <div
            className="mb-1.5 cursor-grab rounded-lg border p-2 hover:shadow-md active:cursor-grabbing bg-background"
            onDragStart={(event) => onDragStart(event, item.type)}
            draggable
        >
            <div className="flex items-center gap-2">
                <item.icon className="h-4 w-4 text-primary" />
                <span className="text-sm font-semibold">{item.name}</span>
            </div>
            <p className="mt-1 text-xs text-muted-foreground">{item.description}</p>
        </div>
    );
};


export const ScenarioBuilderSidebar = () => {
    return (
        <aside className="hidden w-[280px] flex-shrink-0 flex-col border-r bg-background/80 md:flex">
            <div className="flex h-full flex-col p-4">
                <h3 className="mb-4 text-lg font-semibold">Элементы</h3>
                <ScrollArea className="flex-1 -mr-4 pr-4">
                    <div className="space-y-4">
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
    );
};
