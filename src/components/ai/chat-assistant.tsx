"use client";

import { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  MessageCircle,
  Send,
  Bot,
  User,
  Sparkles,
  HelpCircle,
  Lightbulb,
  TrendingUp,
  AlertCircle,
  X,
  Minimize2,
  Maximize2
} from "lucide-react";
import { cn } from "@/lib/utils";

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'assistant';
  timestamp: Date;
  type?: 'text' | 'suggestion' | 'action';
  actions?: Array<{ label: string; action: () => void }>;
}

interface ChatAssistantProps {
  className?: string;
  defaultOpen?: boolean;
}

export function ChatAssistant({ className, defaultOpen = false }: ChatAssistantProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const [isMinimized, setIsMinimized] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: 'Привет! Я ваш ИИ-помощник. Могу помочь с анализом метрик, созданием кампаний и ответить на вопросы по платформе. Чем могу помочь?',
      sender: 'assistant',
      timestamp: new Date(),
      type: 'text'
    }
  ]);

  const quickActions = [
    { icon: TrendingUp, label: 'Анализ метрик', query: 'Покажи анализ текущих метрик' },
    { icon: Lightbulb, label: 'Рекомендации', query: 'Какие есть новые рекомендации?' },
    { icon: AlertCircle, label: 'Риски', query: 'Есть ли критические риски?' },
    { icon: HelpCircle, label: 'Помощь', query: 'Как создать новую кампанию?' }
  ];

  const handleSend = () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputValue,
      sender: 'user',
      timestamp: new Date(),
      type: 'text'
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    // Симуляция ответа ИИ
    setTimeout(() => {
      const assistantResponse = generateResponse(inputValue);
      setMessages(prev => [...prev, assistantResponse]);
      setIsTyping(false);
    }, 1500);
  };

  const generateResponse = (query: string): Message => {
    const lowerQuery = query.toLowerCase();
    
    if (lowerQuery.includes('метрик') || lowerQuery.includes('анализ')) {
      return {
        id: Date.now().toString(),
        content: 'Анализ текущих метрик:\n\n📊 Retention Rate: 62% (-3% за неделю)\n💰 LTV: €485 (+5% за месяц)\n📉 Churn Rate: 8.2% (требует внимания)\n\nРекомендую запустить кампанию реактивации для снижения оттока.',
        sender: 'assistant',
        timestamp: new Date(),
        type: 'text',
        actions: [
          { label: 'Создать кампанию', action: () => window.location.href = '/builder' },
          { label: 'Детальная аналитика', action: () => window.location.href = '/analytics' }
        ]
      };
    }
    
    if (lowerQuery.includes('рекоменд')) {
      return {
        id: Date.now().toString(),
        content: 'У вас есть 3 новые критические рекомендации:\n\n1. 🔴 Запустить реактивацию для 2,847 спящих игроков\n2. 🟡 Оптимизировать бонусы для VIP сегмента\n3. 🔴 Предотвратить отток 156 игроков с высоким риском',
        sender: 'assistant',
        timestamp: new Date(),
        type: 'text',
        actions: [
          { label: 'Все рекомендации', action: () => window.location.href = '/recommendations' }
        ]
      };
    }
    
    if (lowerQuery.includes('кампан') || lowerQuery.includes('создать')) {
      return {
        id: Date.now().toString(),
        content: 'Для создания кампании:\n\n1. Перейдите в раздел "Сценарии"\n2. Нажмите "Создать сценарий"\n3. Выберите шаблон или создайте с нуля\n4. Настройте триггеры и действия\n5. Запустите A/B тестирование\n\nМогу помочь создать кампанию реактивации прямо сейчас!',
        sender: 'assistant',
        timestamp: new Date(),
        type: 'text',
        actions: [
          { label: 'Создать кампанию', action: () => window.location.href = '/builder' },
          { label: 'Использовать шаблон', action: () => window.location.href = '/templates' }
        ]
      };
    }
    
    if (lowerQuery.includes('риск')) {
      return {
        id: Date.now().toString(),
        content: '⚠️ Обнаружены критические риски:\n\n• 156 игроков с высоким риском оттока (потенциальная потеря €68,000)\n• Retention Rate упал ниже целевого на 8%\n• Конверсия новых игроков снизилась на 12%\n\nНеобходимо срочно принять меры!',
        sender: 'assistant',
        timestamp: new Date(),
        type: 'text',
        actions: [
          { label: 'План действий', action: () => window.location.href = '/recommendations' }
        ]
      };
    }

    // Дефолтный ответ
    return {
      id: Date.now().toString(),
      content: 'Я проанализировал ваш запрос. Могу помочь с:\n• Анализом метрик и KPI\n• Созданием и оптимизацией кампаний\n• Сегментацией игроков\n• Настройкой автоматизаций\n\nЧто именно вас интересует?',
      sender: 'assistant',
      timestamp: new Date(),
      type: 'text'
    };
  };

  const handleQuickAction = (query: string) => {
    setInputValue(query);
    handleSend();
  };

  useEffect(() => {
    // Прокрутка к последнему сообщению
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [messages]);

  if (!isOpen) {
    return (
      <Button
        onClick={() => setIsOpen(true)}
        className={cn(
          "fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-lg",
          "bg-primary hover:bg-primary/90",
          className
        )}
      >
        <MessageCircle className="h-6 w-6" />
      </Button>
    );
  }

  if (isMinimized) {
    return (
      <Card className={cn(
        "fixed bottom-6 right-6 w-80 shadow-lg",
        className
      )}>
        <CardHeader className="p-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Bot className="h-5 w-5 text-primary" />
              <CardTitle className="text-sm">ИИ Помощник</CardTitle>
            </div>
            <div className="flex gap-1">
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6"
                onClick={() => setIsMinimized(false)}
              >
                <Maximize2 className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6"
                onClick={() => setIsOpen(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card className={cn(
      "fixed bottom-6 right-6 w-96 h-[600px] shadow-lg flex flex-col",
      className
    )}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Bot className="h-5 w-5 text-primary" />
            <CardTitle>ИИ Помощник</CardTitle>
            <Badge variant="secondary" className="text-xs">
              <Sparkles className="mr-1 h-3 w-3" />
              Online
            </Badge>
          </div>
          <div className="flex gap-1">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={() => setIsMinimized(true)}
            >
              <Minimize2 className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={() => setIsOpen(false)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col p-0">
        <ScrollArea 
          ref={scrollAreaRef}
          className="flex-1 px-4 py-2"
        >
          <div className="space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={cn(
                  "flex gap-3",
                  message.sender === 'user' && "justify-end"
                )}
              >
                {message.sender === 'assistant' && (
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="bg-primary text-white">
                      <Bot className="h-4 w-4" />
                    </AvatarFallback>
                  </Avatar>
                )}
                <div className={cn(
                  "max-w-[80%] space-y-2",
                  message.sender === 'user' && "items-end"
                )}>
                  <div className={cn(
                    "rounded-lg px-3 py-2",
                    message.sender === 'user' 
                      ? "bg-primary text-white" 
                      : "bg-muted"
                  )}>
                    <p className="text-sm whitespace-pre-line">{message.content}</p>
                  </div>
                  {message.actions && (
                    <div className="flex flex-wrap gap-2">
                      {message.actions.map((action, i) => (
                        <Button
                          key={i}
                          size="sm"
                          variant="outline"
                          onClick={action.action}
                          className="text-xs"
                        >
                          {action.label}
                        </Button>
                      ))}
                    </div>
                  )}
                  <p className="text-xs text-muted-foreground">
                    {message.timestamp.toLocaleTimeString('ru-RU', { 
                      hour: '2-digit', 
                      minute: '2-digit' 
                    })}
                  </p>
                </div>
                {message.sender === 'user' && (
                  <Avatar className="h-8 w-8">
                    <AvatarFallback>
                      <User className="h-4 w-4" />
                    </AvatarFallback>
                  </Avatar>
                )}
              </div>
            ))}
            {isTyping && (
              <div className="flex gap-3">
                <Avatar className="h-8 w-8">
                  <AvatarFallback className="bg-primary text-white">
                    <Bot className="h-4 w-4" />
                  </AvatarFallback>
                </Avatar>
                <div className="bg-muted rounded-lg px-3 py-2">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-primary/60 rounded-full animate-bounce" />
                    <div className="w-2 h-2 bg-primary/60 rounded-full animate-bounce delay-100" />
                    <div className="w-2 h-2 bg-primary/60 rounded-full animate-bounce delay-200" />
                  </div>
                </div>
              </div>
            )}
          </div>
        </ScrollArea>

        <div className="p-4 border-t space-y-3">
          {/* Быстрые действия */}
          <div className="flex flex-wrap gap-2">
            {quickActions.map((action, i) => {
              const Icon = action.icon;
              return (
                <Button
                  key={i}
                  variant="outline"
                  size="sm"
                  className="text-xs"
                  onClick={() => handleQuickAction(action.query)}
                >
                  <Icon className="mr-1 h-3 w-3" />
                  {action.label}
                </Button>
              );
            })}
          </div>

          {/* Поле ввода */}
          <div className="flex gap-2">
            <Input
              placeholder="Задайте вопрос..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSend()}
              className="flex-1"
            />
            <Button
              onClick={handleSend}
              disabled={!inputValue.trim() || isTyping}
              size="icon"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}