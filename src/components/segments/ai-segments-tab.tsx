"use client";

import * as React from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Bot, Users, TrendingDown, TrendingUp, Euro, Calendar, Star, Lightbulb } from "lucide-react";
import type { SegmentBuilder, SegmentCondition, SegmentConditionGroup } from '@/lib/types';

// Типы для AI-сегментов
export interface AISegment {
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

export function AiSegmentsTab({ 
  onCreateSegment, 
  onViewDetails 
}: { 
  onCreateSegment?: (segment: AISegment) => void;
  onViewDetails?: (segment: AISegment) => void;
}) {
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
    <div className="space-y-4 p-1">
      {/* Header */}
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <Bot className="h-5 w-5 text-blue-600" />
          <h3 className="text-lg font-semibold">Сегменты рекомендованные ИИ</h3>
          <Badge variant="outline" className="text-blue-600 border-blue-200 bg-blue-50 text-xs">
            Powered by AI
          </Badge>
        </div>
        <p className="text-sm text-muted-foreground">
          Автоматически сгенерированные сегменты на основе поведенческих паттернов и прогнозных моделей
        </p>
      </div>

      {/* AI Segments Grid */}
      <div className="grid gap-3 grid-cols-1">
        {aiSegments.map((segment) => (
          <Card 
            key={segment.id} 
            className="hover:shadow-md transition-shadow cursor-pointer"
            onClick={() => setSelectedSegment(segment)}
          >
            <CardHeader className="pb-2">
              <div className="flex items-start justify-between">
                <div className="space-y-1 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <CardTitle className="text-base leading-tight">{segment.name}</CardTitle>
                    <Badge 
                      variant="outline" 
                      className={`text-xs ${getPriorityColor(segment.priority)}`}
                    >
                      {getPriorityLabel(segment.priority)}
                    </Badge>
                    <Badge variant="secondary" className="text-xs">{segment.category}</Badge>
                  </div>
                  <CardDescription className="text-xs">
                    {segment.description}
                  </CardDescription>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground pt-1">
                    <Users className="h-3 w-3" />
                    <span className="font-medium">{segment.playersCount.toLocaleString()}</span>
                    <span>игроков</span>
                  </div>
                </div>
              </div>
            </CardHeader>

            <CardContent className="space-y-3 pt-0">
              {/* Condition */}
              <div className="space-y-1">
                <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                  Условие
                </label>
                <p className="text-xs bg-muted/30 p-1.5 rounded text-muted-foreground">
                  {segment.condition}
                </p>
              </div>

              {/* Metrics */}
              <div className="space-y-1">
                <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                  Метрики
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {Object.entries(segment.metrics).slice(0, 3).map(([key, value]) => (
                    <div key={key} className="flex items-center gap-1">
                      {typeof getMetricIcon(key) === 'function' ? getMetricIcon(key)(value) : getMetricIcon(key)}
                      <div className="min-w-0 flex-1">
                        <div className="text-xs font-medium truncate">
                          {formatMetricValue(key, value)}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* AI Recommendation */}
              <div className="space-y-1">
                <div className="flex items-center gap-2 p-1.5 bg-blue-50 rounded border border-blue-200">
                  <Bot className="h-3 w-3 text-blue-600 flex-shrink-0" />
                  <span className="text-xs font-medium text-blue-900">
                    {segment.aiRecommendation}
                  </span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-2">
                <Button 
                  size="sm" 
                  className="flex-1 h-8 text-xs"
                  onClick={(e) => {
                    e.stopPropagation();
                    onCreateSegment?.(segment);
                  }}
                >
                  <Star className="mr-1 h-3 w-3" />
                  Создать сегмент
                </Button>
                <Button 
                  size="sm" 
                  variant="outline" 
                  className="h-8 text-xs"
                  onClick={(e) => {
                    e.stopPropagation();
                    onViewDetails?.(segment);
                  }}
                >
                  Подробнее
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Stats Summary */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2 text-base">
            <Bot className="h-4 w-4 text-blue-600" />
            Сводка по AI-сегментам
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="grid grid-cols-4 gap-3">
            <div className="text-center">
              <div className="text-lg font-bold text-blue-600">
                {aiSegments.length}
              </div>
              <div className="text-xs text-muted-foreground">Сегментов</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-orange-600">
                {aiSegments.filter(s => s.priority === 'high').length}
              </div>
              <div className="text-xs text-muted-foreground">Высокий приоритет</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold">
                {Math.round(aiSegments.reduce((sum, s) => sum + s.playersCount, 0) / 1000)}k
              </div>
              <div className="text-xs text-muted-foreground">Игроков</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-green-600">
                {Math.round(
                  aiSegments.reduce((sum, s) => sum + s.playersCount, 0) / 50000 * 100
                )}%
              </div>
              <div className="text-xs text-muted-foreground">Покрытие</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// Функция для конвертации AI-сегмента в данные конструктора
export function convertAISegmentToBuilder(aiSegment: AISegment): SegmentBuilder {
  // Создаем условия на основе AI-сегмента
  const conditions: SegmentCondition[] = [];

  // Базовые условия на основе типа сегмента
  switch (aiSegment.id) {
    case 'ai-churn-risk':
      conditions.push({
        id: 'condition_1',
        parameter: 'last_deposit_days',
        operator: 'greater_than',
        value: 14
      });
      conditions.push({
        id: 'condition_2',
        parameter: 'total_deposits',
        operator: 'greater_than',
        value: 0
      });
      break;
    case 'ai-vip-low-activity':
      conditions.push({
        id: 'condition_1',
        parameter: 'ltv',
        operator: 'greater_than',
        value: 5000
      });
      conditions.push({
        id: 'condition_2',
        parameter: 'activity_change_7d',
        operator: 'less_than',
        value: -30
      });
      break;
    case 'ai-new-no-deposit':
      conditions.push({
        id: 'condition_1',
        parameter: 'registration_days',
        operator: 'less_than_or_equal',
        value: 7
      });
      conditions.push({
        id: 'condition_2',
        parameter: 'total_deposits',
        operator: 'equals',
        value: 0
      });
      break;
    case 'ai-high-value-top10':
      conditions.push({
        id: 'condition_1',
        parameter: 'avg_deposit_amount',
        operator: 'greater_than',
        value: 500
      });
      conditions.push({
        id: 'condition_2',
        parameter: 'total_deposit_amount',
        operator: 'greater_than',
        value: 5000
      });
      break;
    case 'ai-no-deposit-active':
      conditions.push({
        id: 'condition_1',
        parameter: 'session_count',
        operator: 'greater_than_or_equal',
        value: 10
      });
      conditions.push({
        id: 'condition_2',
        parameter: 'total_deposits',
        operator: 'equals',
        value: 0
      });
      break;
    default:
      // Базовое условие для неизвестных сегментов
      conditions.push({
        id: 'condition_1',
        parameter: 'total_deposits',
        operator: 'greater_than_or_equal',
        value: 0
      });
  }

  const rootGroup: SegmentConditionGroup = {
    id: 'root',
    type: 'AND',
    conditions: conditions
  };

  return {
    name: aiSegment.name,
    description: `${aiSegment.description}\n\nУсловие: ${aiSegment.condition}\n\nAI рекомендация: ${aiSegment.aiRecommendation}`,
    rootGroup
  };
}