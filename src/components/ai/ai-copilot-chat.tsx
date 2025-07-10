
"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { Bot, Send, User } from "lucide-react";
import * as React from 'react';

type Message = {
    id: string;
    text: string;
    sender: 'user' | 'ai';
};

const scenarioBuilderWelcome = [
    { id: '1', text: "Привет! Я AI Co-pilot. Чем могу помочь в создании сценария? Например, можешь попросить: 'Создай сценарий для реактивации игроков, которые не заходили 30 дней'.", sender: 'ai' as const }
];
const segmentGeneratorWelcome = [
    { id: '1', text: "Привет! Я AI Co-pilot. Опиши, какой сегмент тебе нужен, и я помогу его создать. Например: 'Игроки с высоким LTV, но риском оттока'.", sender: 'ai' as const }
];


export function AiCopilotChat({ copilotType }: { copilotType: 'scenario_builder' | 'segment_generator' }) {
    const [messages, setMessages] = React.useState<Message[]>(
        copilotType === 'scenario_builder' ? scenarioBuilderWelcome : segmentGeneratorWelcome
    );
    const [input, setInput] = React.useState('');
    const [isLoading, setIsLoading] = React.useState(false);

    const handleSendMessage = (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim()) return;

        const userMessage: Message = { id: Date.now().toString(), text: input, sender: 'user' };
        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setIsLoading(true);

        // Simulate AI response
        setTimeout(() => {
            const aiResponse: Message = { 
                id: (Date.now() + 1).toString(), 
                text: copilotType === 'scenario_builder' 
                    ? "Отличная идея! Вот шаги для сценария реактивации:\n1. Триггер: Неактивность 30 дней.\n2. Действие: Отправить Push с бонусом.\n3. Условие: Если не открыл Push в течение 3 дней, отправить Email."
                    : "Понял. Вот критерии для сегмента:\n- Predicted Churn Rate > 70%\n- Lifetime Value > $1000\n- Last Seen > 14 days ago. \n\nТакой сегмент подойдет?", 
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
                            <Avatar className="h-8 w-8">
                                <AvatarFallback><Bot /></AvatarFallback>
                            </Avatar>
                        )}
                        <div
                            className={cn(
                                "max-w-xs rounded-lg p-3 text-sm whitespace-pre-wrap",
                                message.sender === 'user'
                                    ? "bg-primary text-primary-foreground"
                                    : "bg-muted"
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
                        <Avatar className="h-8 w-8">
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
                <Button type="submit" size="icon" disabled={isLoading}>
                    <Send className="h-4 w-4" />
                </Button>
            </form>
        </div>
    );
}
