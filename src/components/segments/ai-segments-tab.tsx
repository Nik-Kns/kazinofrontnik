"use client";

import * as React from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Bot, Users, TrendingDown, TrendingUp, Euro, Calendar, Star, Lightbulb } from "lucide-react";

// Типы для AI-сегментов
interface AISegment {
  id: string;
  name: string;
  description: string;
  condition: string;
  playersCount: number;
  metrics: {
    arpu?: number;
    ggr?: number;
    avgDeposit?: number;
    lastActivity?: string;
    conversionRate?: number;
    activityChange?: number;
    avgSessions?: number;
  };
  aiRecommendation: string;
  priority: 'high' | 'medium' | 'low';
  category: string;
}

// Демо-данные AI-сегментов
const aiSegments: AISegment[] = [
  {
    id: 'ai-churn-risk',
    name: 'Игроки с высоким риском оттока',
    description: 'Игроки, которые показывают признаки потенциального оттока',
    condition: 'нет депозитов >14 дней, ранее были активны',
    playersCount: 1230,
    metrics: {
      arpu: 75,
      lastActivity: '16 дней назад',
      activityChange: -65
    },
    aiRecommendation: 'Free Spins бонус',
    priority: 'high',
    category: 'Риск оттока'
  },
  {
    id: 'ai-vip-low-activity',
    name: 'VIP с низкой активностью',
    description: 'VIP игроки со снижением игровой активности',
    condition: 'VIP игроки, снижение ставок за 7 дней',
    playersCount: 87,
    metrics: {
      ggr: 4500,
      activityChange: -45,
      arpu: 850
    },
    aiRecommendation: 'Эксклюзивный бонус',
    priority: 'high',
    category: 'VIP'
  },
  {
    id: 'ai-new-no-deposit',
    name: 'Новые игроки без депозита (7 дней)',
    description: 'Недавно зарегистрированные игроки без первого депозита',
    condition: 'регистрация, депозит = 0 за неделю',
    playersCount: 3410,
    metrics: {
      conversionRate: 0,
      avgSessions: 2.3,
      lastActivity: '2 дня назад'
    },
    aiRecommendation: 'Welcome offer',
    priority: 'medium',
    category: 'Конверсия'
  },
  {
    id: 'ai-high-value-top10',
    name: 'High-Value игроки (топ 10%)',
    description: 'Игроки с самыми высокими депозитами',
    condition: 'топ-10% депозитов за 30 дней',
    playersCount: 540,
    metrics: {
      avgDeposit: 850,
      ggr: 8900,
      arpu: 1250
    },
    aiRecommendation: 'Кэшбэк предложение',
    priority: 'medium',
    category: 'VIP'
  },
  {
    id: 'ai-no-deposit-active',
    name: 'Бездепозитные игроки с активными сессиями',
    description: 'Игроки с высокой активностью, но без депозитов',
    condition: '10+ сессий/неделя, депозиты = 0',
    playersCount: 1720,
    metrics: {
      avgSessions: 12,
      lastActivity: '1 день назад',
      conversionRate: 0
    },
    aiRecommendation: 'Бонус за первый депозит',
    priority: 'high',
    category: 'Конверсия'
  }
];

export function AiSegmentsTab() {
  const [selectedSegment, setSelectedSegment] = React.useState<AISegment | null>(null);

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-600 bg-red-50 border-red-200';
      case 'medium': return 'text-orange-600 bg-orange-50 border-orange-200';
      case 'low': return 'text-green-600 bg-green-50 border-green-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getPriorityLabel = (priority: string) => {
    switch (priority) {
      case 'high': return 'Высокий';
      case 'medium': return 'Средний';
      case 'low': return 'Низкий';
      default: return priority;
    }
  };

  const formatMetricValue = (key: string, value: number | string) => {
    switch (key) {
      case 'arpu':
      case 'ggr':
      case 'avgDeposit':
        return `$${typeof value === 'number' ? value.toLocaleString() : value}`;
      case 'conversionRate':
        return `${value}%`;
      case 'activityChange':
        return `${value > 0 ? '+' : ''}${value}%`;
      case 'avgSessions':
        return `${value} сессий`;
      default:
        return value;
    }
  };

  const getMetricIcon = (key: string) => {
    switch (key) {
      case 'arpu':
      case 'ggr':
      case 'avgDeposit':
        return <Euro className="h-4 w-4" />;
      case 'conversionRate':
        return <TrendingUp className="h-4 w-4" />;
      case 'activityChange':
        return value => value < 0 ? <TrendingDown className="h-4 w-4 text-red-500" /> : <TrendingUp className="h-4 w-4 text-green-500" />;
      case 'avgSessions':
        return <Users className="h-4 w-4" />;
      case 'lastActivity':
        return <Calendar className="h-4 w-4" />;
      default:
        return <Users className="h-4 w-4" />;
    }
  };

  const getMetricLabel = (key: string) => {
    switch (key) {
      case 'arpu': return 'ARPU';
      case 'ggr': return 'GGR';
      case 'avgDeposit': return 'Средний депозит';
      case 'conversionRate': return 'Конверсия';
      case 'activityChange': return 'Изменение активности';
      case 'avgSessions': return 'Средние сессии';
      case 'lastActivity': return 'Последняя активность';
      default: return key;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <Bot className="h-6 w-6 text-blue-600" />
          <h3 className="text-xl font-semibold">Сегменты рекомендованные ИИ</h3>
          <Badge variant="outline" className="text-blue-600 border-blue-200 bg-blue-50">
            Powered by AI
          </Badge>
        </div>
        <p className="text-sm text-muted-foreground">
          Автоматически сгенерированные сегменты на основе поведенческих паттернов и прогнозных моделей
        </p>
      </div>

      {/* AI Segments Grid */}
      <div className="grid gap-4 md:grid-cols-1 lg:grid-cols-2">
        {aiSegments.map((segment) => (
          <Card 
            key={segment.id} 
            className="hover:shadow-md transition-shadow cursor-pointer"
            onClick={() => setSelectedSegment(segment)}
          >
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="space-y-1 flex-1">
                  <div className="flex items-center gap-2">
                    <CardTitle className="text-lg leading-tight">{segment.name}</CardTitle>
                    <Badge 
                      variant="outline" 
                      className={getPriorityColor(segment.priority)}
                    >
                      {getPriorityLabel(segment.priority)}
                    </Badge>
                  </div>
                  <CardDescription className="text-sm">
                    {segment.description}
                  </CardDescription>
                </div>
              </div>
              
              {/* Category and Players Count */}
              <div className="flex items-center justify-between pt-2">
                <Badge variant="secondary">{segment.category}</Badge>
                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                  <Users className="h-4 w-4" />
                  <span className="font-medium">{segment.playersCount.toLocaleString()}</span>
                  <span>игроков</span>
                </div>
              </div>
            </CardHeader>

            <CardContent className="space-y-4">
              {/* Condition */}
              <div className="space-y-1">
                <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                  Условие сегментации
                </label>
                <p className="text-sm bg-muted/30 p-2 rounded text-muted-foreground">
                  {segment.condition}
                </p>
              </div>

              {/* Metrics */}
              <div className="space-y-2">
                <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                  Ключевые метрики
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {Object.entries(segment.metrics).map(([key, value]) => (
                    <div key={key} className="flex items-center gap-2">
                      {typeof getMetricIcon(key) === 'function' ? getMetricIcon(key)(value) : getMetricIcon(key)}
                      <div className="min-w-0 flex-1">
                        <div className="text-xs text-muted-foreground">
                          {getMetricLabel(key)}
                        </div>
                        <div className="text-sm font-medium truncate">
                          {formatMetricValue(key, value)}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* AI Recommendation */}
              <div className="space-y-2">
                <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide flex items-center gap-1">
                  <Lightbulb className="h-3 w-3" />
                  AI рекомендация
                </label>
                <div className="flex items-center gap-2 p-2 bg-blue-50 rounded-lg border border-blue-200">
                  <Bot className="h-4 w-4 text-blue-600 flex-shrink-0" />
                  <span className="text-sm font-medium text-blue-900">
                    {segment.aiRecommendation}
                  </span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-2 pt-2">
                <Button size="sm" className="flex-1">
                  <Star className="mr-2 h-4 w-4" />
                  Создать сегмент
                </Button>
                <Button size="sm" variant="outline">
                  Подробнее
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Stats Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bot className="h-5 w-5 text-blue-600" />
            Сводка по AI-сегментам
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {aiSegments.length}
              </div>
              <div className="text-sm text-muted-foreground">Доступных сегментов</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">
                {aiSegments.filter(s => s.priority === 'high').length}
              </div>
              <div className="text-sm text-muted-foreground">Высокий приоритет</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">
                {aiSegments.reduce((sum, s) => sum + s.playersCount, 0).toLocaleString()}
              </div>
              <div className="text-sm text-muted-foreground">Всего игроков</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {Math.round(
                  aiSegments.reduce((sum, s) => sum + s.playersCount, 0) / 50000 * 100
                )}%
              </div>
              <div className="text-sm text-muted-foreground">Покрытие базы</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}