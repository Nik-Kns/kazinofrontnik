
"use client";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { Bot, Code2, Send, User } from "lucide-react";
import * as React from 'react';

type Message = {
    id: string;
    text: string;
    sender: 'user' | 'ai' | 'tool';
};

const scenarioBuilderWelcome: Message[] = [
    { id: '1', text: "Привет! Я AI Co-pilot. Чем могу помочь в создании сценария? Например, можешь попросить: 'Создай сценарий для реактивации игроков, которые не заходили 30 дней'.", sender: 'ai' }
];
const segmentGeneratorWelcome: Message[] = [
    { id: '1', text: "Привет! Я AI Co-pilot. Опиши, какой сегмент тебе нужен, и я помогу его создать. Например: 'Игроки с высоким LTV, но риском оттока'.", sender: 'ai' }
];

const scenarioBuilderDemo: Message[] = [
    ...scenarioBuilderWelcome,
    { id: '2', text: "Создай сценарий для реактивации VIP-игроков, которых давно не было.", sender: 'user'},
    { id: '3', text: "Хорошая идея. Чтобы быть точнее, мне нужно знать, что мы считаем 'давно'. Могу я посмотреть определение сегмента 'VIP-игроки'?", sender: 'ai'},
    { id: '4', text: "TOOL CALL: `get_player_segment(name='VIP-игроки')`", sender: 'tool'},
    { id: '5', text: "Окей, я вижу, что VIP-игроки - это те, у кого LTV > €5000. Предлагаю такой сценарий:\n\n1. **Триггер:** Игрок из сегмента 'VIP-игроки' не заходил в игру 14 дней.\n2. **Действие:** Отправить персонализированный Email с эксклюзивным бонусом 20% на следующий депозит.\n3. **Условие:** Если Email не открыт в течение 48 часов, инициировать AI-звонок с напоминанием о бонусе.\n\nЧто думаешь? Можем что-то изменить или добавить?", sender: 'ai'},
]


export function AiCopilotChat({ copilotType }: { copilotType: 'scenario_builder' | 'segment_generator' }) {
    const initialMessages = copilotType === 'scenario_builder' ? scenarioBuilderDemo : segmentGeneratorWelcome;
    const [messages, setMessages] = React.useState<Message[]>(initialMessages);
    const [input, setInput] = React.useState('');
    const [isLoading, setIsLoading] = React.useState(false);

    const handleSendMessage = (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim() || isLoading) return;

        const userMessage: Message = { id: Date.now().toString(), text: input, sender: 'user' };
        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setIsLoading(true);

        // Simulate AI response
        setTimeout(() => {
            const aiResponse: Message = { 
                id: (Date.now() + 1).toString(), 
                text: "Это симуляция. В реальном приложении здесь был бы ответ от AI.", 
                sender: 'ai' 
            };
            setMessages(prev => [...prev, aiResponse]);
            setIsLoading(false);
        }, 1500);
    };

    return (
        <div className="flex flex-col h-full">
            <div className="flex-1 overflow-y-auto pr-4 space-y-4">
                {messages.map((message) => (
                    <div
                        key={message.id}
                        className={cn(
                            "flex items-start gap-3",
                            message.sender === 'user' ? "justify-end" : ""
                        )}
                    >
                        {message.sender === 'ai' && (
                            <Avatar className="h-8 w-8 bg-accent text-accent-foreground">
                                <AvatarFallback><Bot /></AvatarFallback>
                            </Avatar>
                        )}
                        {message.sender === 'tool' && (
                            <Avatar className="h-8 w-8 bg-muted border">
                                <AvatarFallback><Code2 className="h-5 w-5"/></AvatarFallback>
                            </Avatar>
                        )}
                        <div
                            className={cn(
                                "max-w-xs rounded-lg p-3 text-sm whitespace-pre-wrap",
                                message.sender === 'user' && "bg-primary text-primary-foreground",
                                message.sender === 'ai' && "bg-muted",
                                message.sender === 'tool' && "bg-background border font-mono text-xs"
                            )}
                        >
                            {message.text}
                        </div>
                        {message.sender === 'user' && (
                             <Avatar className="h-8 w-8">
                                <AvatarFallback><User /></AvatarFallback>
                            </Avatar>
                        )}
                    </div>
                ))}
                {isLoading && (
                    <div className="flex items-start gap-3">
                        <Avatar className="h-8 w-8 bg-accent text-accent-foreground">
                            <AvatarFallback><Bot /></AvatarFallback>
                        </Avatar>
                        <div className="max-w-xs rounded-lg p-3 text-sm bg-muted">
                            <div className="flex items-center gap-2">
                                <div className="h-2 w-2 bg-foreground/50 rounded-full animate-pulse [animation-delay:-0.3s]"></div>
                                <div className="h-2 w-2 bg-foreground/50 rounded-full animate-pulse [animation-delay:-0.15s]"></div>
                                <div className="h-2 w-2 bg-foreground/50 rounded-full animate-pulse"></div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
            <form onSubmit={handleSendMessage} className="flex items-center gap-2 pt-4 border-t">
                <Input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Спросите что-нибудь..."
                    disabled={isLoading}
                />
                <Button type="submit" size="icon" disabled={isLoading || !input.trim()}>
                    <Send className="h-4 w-4" />
                </Button>
            </form>
        </div>
    );
}
