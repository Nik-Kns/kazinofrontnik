"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  MessageSquare,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Sparkles,
  Send,
  RefreshCw,
  Copy,
  Wand2,
  Target,
  Users,
  TrendingUp,
  AlertCircle
} from "lucide-react";
import { cn } from "@/lib/utils";

interface CommunicationCheck {
  category: 'grammar' | 'style' | 'compliance' | 'effectiveness';
  status: 'good' | 'warning' | 'error';
  message: string;
  suggestion?: string;
}

interface AIAnalysis {
  score: number;
  checks: CommunicationCheck[];
  improvements: string[];
  targetAudience: string;
  expectedCTR: number;
  sentiment: 'positive' | 'neutral' | 'negative';
}

export function CommunicationAssistant() {
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState<'email' | 'push' | 'sms' | 'in-app'>('email');
  const [audience, setAudience] = useState<'all' | 'vip' | 'new' | 'dormant'>('all');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<AIAnalysis | null>(null);
  const [improvedMessage, setImprovedMessage] = useState('');

  const analyzeMessage = () => {
    setIsAnalyzing(true);
    // Симуляция анализа
    setTimeout(() => {
      setAnalysis({
        score: 78,
        checks: [
          {
            category: 'grammar',
            status: 'good',
            message: 'Грамматика и орфография корректны'
          },
          {
            category: 'style',
            status: 'warning',
            message: 'Текст слишком длинный для push-уведомления',
            suggestion: 'Сократите до 50 символов для лучшей читаемости'
          },
          {
            category: 'compliance',
            status: 'good',
            message: 'Соответствует правилам бренда'
          },
          {
            category: 'effectiveness',
            status: 'warning',
            message: 'Отсутствует четкий CTA',
            suggestion: 'Добавьте призыв к действию'
          }
        ],
        improvements: [
          'Добавьте персонализацию (имя игрока)',
          'Укажите конкретную выгоду в цифрах',
          'Используйте эмоциональные триггеры',
          'Создайте ощущение срочности'
        ],
        targetAudience: 'VIP игроки',
        expectedCTR: 3.2,
        sentiment: 'neutral'
      });
      setImprovedMessage('🎰 {name}, ваш VIP бонус 100% до €500 ждет! Только 24 часа. Играть сейчас →');
      setIsAnalyzing(false);
    }, 1500);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'good': return <CheckCircle2 className="h-4 w-4 text-green-600" />;
      case 'warning': return <AlertTriangle className="h-4 w-4 text-yellow-600" />;
      case 'error': return <XCircle className="h-4 w-4 text-red-600" />;
      default: return null;
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center gap-2">
          <MessageSquare className="h-5 w-5 text-primary" />
          <CardTitle>ИИ-ассистент коммуникаций</CardTitle>
        </div>
        <CardDescription>
          Проверка и оптимизация сообщений для рассылок
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label>Тип сообщения</Label>
              <Select value={messageType} onValueChange={(v: any) => setMessageType(v)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="email">Email</SelectItem>
                  <SelectItem value="push">Push-уведомление</SelectItem>
                  <SelectItem value="sms">SMS</SelectItem>
                  <SelectItem value="in-app">In-App сообщение</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Целевая аудитория</Label>
              <Select value={audience} onValueChange={(v: any) => setAudience(v)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Все игроки</SelectItem>
                  <SelectItem value="vip">VIP сегмент</SelectItem>
                  <SelectItem value="new">Новые игроки</SelectItem>
                  <SelectItem value="dormant">Спящие игроки</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Текст сообщения</Label>
            <Textarea
              placeholder="Введите текст сообщения для проверки..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="min-h-[100px]"
            />
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">
                {message.length} символов
              </span>
              <Button
                onClick={analyzeMessage}
                disabled={!message || isAnalyzing}
                size="sm"
              >
                {isAnalyzing ? (
                  <>
                    <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                    Анализирую...
                  </>
                ) : (
                  <>
                    <Sparkles className="mr-2 h-4 w-4" />
                    Анализировать
                  </>
                )}
              </Button>
            </div>
          </div>

          {analysis && (
            <Tabs defaultValue="analysis" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="analysis">Анализ</TabsTrigger>
                <TabsTrigger value="improvements">Улучшения</TabsTrigger>
                <TabsTrigger value="metrics">Метрики</TabsTrigger>
              </TabsList>

              <TabsContent value="analysis" className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
                  <div>
                    <p className="text-sm font-medium">Общая оценка</p>
                    <p className={cn("text-2xl font-bold", getScoreColor(analysis.score))}>
                      {analysis.score}/100
                    </p>
                  </div>
                  <Progress value={analysis.score} className="w-32" />
                </div>

                <div className="space-y-2">
                  {analysis.checks.map((check, i) => (
                    <div key={i} className="flex items-start gap-3 p-3 border rounded-lg">
                      {getStatusIcon(check.status)}
                      <div className="flex-1">
                        <p className="text-sm font-medium">{check.message}</p>
                        {check.suggestion && (
                          <p className="text-xs text-muted-foreground mt-1">
                            💡 {check.suggestion}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="improvements" className="space-y-4">
                <div className="space-y-2">
                  <Label>Рекомендации по улучшению</Label>
                  <ul className="space-y-2">
                    {analysis.improvements.map((improvement, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm">
                        <Wand2 className="h-4 w-4 text-primary mt-0.5" />
                        <span>{improvement}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {improvedMessage && (
                  <div className="space-y-2">
                    <Label>Оптимизированная версия</Label>
                    <div className="p-3 bg-primary/5 border border-primary/20 rounded-lg">
                      <p className="text-sm">{improvedMessage}</p>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          navigator.clipboard.writeText(improvedMessage);
                        }}
                      >
                        <Copy className="mr-2 h-4 w-4" />
                        Копировать
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setMessage(improvedMessage)}
                      >
                        <Send className="mr-2 h-4 w-4" />
                        Применить
                      </Button>
                    </div>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="metrics" className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <Target className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">Целевая аудитория</span>
                    </div>
                    <p className="font-medium">{analysis.targetAudience}</p>
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <TrendingUp className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">Ожидаемый CTR</span>
                    </div>
                    <p className="font-medium">{analysis.expectedCTR}%</p>
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">Тональность</span>
                    </div>
                    <Badge variant={
                      analysis.sentiment === 'positive' ? 'default' :
                      analysis.sentiment === 'negative' ? 'destructive' : 'secondary'
                    }>
                      {analysis.sentiment === 'positive' ? 'Позитивная' :
                       analysis.sentiment === 'negative' ? 'Негативная' : 'Нейтральная'}
                    </Badge>
                  </div>
                </div>

                <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <div className="flex gap-2">
                    <AlertCircle className="h-4 w-4 text-yellow-600 mt-0.5" />
                    <div className="text-sm">
                      <p className="font-medium text-yellow-900">Совет</p>
                      <p className="text-yellow-700">
                        Для {messageType === 'push' ? 'push-уведомлений' : 
                             messageType === 'sms' ? 'SMS' : 
                             messageType === 'email' ? 'email-рассылок' : 'in-app сообщений'} 
                        {' '}оптимальное время отправки: 19:00-21:00
                      </p>
                    </div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          )}
        </div>
      </CardContent>
    </Card>
  );
}