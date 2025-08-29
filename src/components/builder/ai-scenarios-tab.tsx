"use client";

import * as React from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Bot, TrendingUp, Users, DollarSign, Star, Target, Activity, Zap, Lightbulb } from "lucide-react";

// Типы для AI-сценариев
export interface AIScenario {
  id: string;
  name: string;
  description: string;
  targetMetric: string;
  expectedImprovement: string;
  category: string;
  priority: 'high' | 'medium' | 'low';
  channels: string[];
  estimatedTime: string;
  complexity: 'простой' | 'средний' | 'сложный';
  triggers: string[];
}

// Демо-данные AI-сценариев для буста метрик
const aiScenarios: AIScenario[] = [
  {
    id: 'ai-retention-boost',
    name: 'AI-буст Retention Rate',
    description: 'Интеллектуальная цепочка для увеличения удержания игроков на основе поведенческих паттернов',
    targetMetric: 'Retention Rate',
    expectedImprovement: '+15-25%',
    category: 'Retention',
    priority: 'high',
    channels: ['Email', 'Push', 'SMS'],
    estimatedTime: '3-5 дней',
    complexity: 'средний',
    triggers: ['Снижение активности', 'Пропуск сессий', 'Отсутствие депозитов']
  },
  {
    id: 'ai-ggr-optimization',
    name: 'Оптимизация GGR',
    description: 'AI-система для максимизации валового игрового дохода через персонализированные офферы',
    targetMetric: 'GGR (Gross Gaming Revenue)',
    expectedImprovement: '+20-35%',
    category: 'Revenue',
    priority: 'high',
    channels: ['Email', 'Push', 'InApp'],
    estimatedTime: '2-4 дня',
    complexity: 'сложный',
    triggers: ['Низкий оборот', 'Снижение ставок', 'Изменение RTP']
  },
  {
    id: 'ai-churn-prevention',
    name: 'Предотвращение оттока',
    description: 'Предиктивная модель для выявления и удержания игроков в риске ухода',
    targetMetric: 'Churn Rate',
    expectedImprovement: '-30-50%',
    category: 'Retention',
    priority: 'high',
    channels: ['Push', 'SMS', 'Call'],
    estimatedTime: '1-3 дня',
    complexity: 'средний',
    triggers: ['Churn probability >70%', 'Отсутствие >7 дней', 'Снижение частоты игр']
  },
  {
    id: 'ai-conversion-funnel',
    name: 'AI-воронка конверсии',
    description: 'Умная последовательность для конвертации новых игроков в депозитные',
    targetMetric: 'Conversion Rate',
    expectedImprovement: '+40-60%',
    category: 'Conversion',
    priority: 'medium',
    channels: ['Email', 'Push', 'InApp'],
    estimatedTime: '4-7 дней',
    complexity: 'простой',
    triggers: ['Регистрация', 'Первая сессия', 'Отсутствие депозита >24ч']
  },
  {
    id: 'ai-ltv-maximizer',
    name: 'Максимизатор LTV',
    description: 'Долгосрочная стратегия для увеличения жизненной ценности каждого игрока',
    targetMetric: 'LTV (Lifetime Value)',
    expectedImprovement: '+25-45%',
    category: 'Revenue',
    priority: 'medium',
    channels: ['Email', 'Push', 'SMS', 'InApp'],
    estimatedTime: '7-14 дней',
    complexity: 'сложный',
    triggers: ['Достижение милестоунов', 'Поведенческие сигналы', 'Сезонные события']
  },
  {
    id: 'ai-vip-engagement',
    name: 'VIP-вовлечение',
    description: 'Эксклюзивные сценарии для максимального вовлечения VIP-игроков',
    targetMetric: 'VIP Engagement Score',
    expectedImprovement: '+30-50%',
    category: 'VIP',
    priority: 'medium',
    channels: ['Email', 'Call', 'Personal Manager'],
    estimatedTime: '5-10 дней',
    complexity: 'сложный',
    triggers: ['VIP статус', 'Крупные выигрыши', 'Снижение активности VIP']
  },
  {
    id: 'ai-reactivation-master',
    name: 'Мастер реактивации',
    description: 'AI-алгоритм для возвращения неактивных игроков с персональными предложениями',
    targetMetric: 'Reactivation Rate',
    expectedImprovement: '+50-80%',
    category: 'Reactivation',
    priority: 'low',
    channels: ['Email', 'SMS', 'Push'],
    estimatedTime: '3-6 дней',
    complexity: 'средний',
    triggers: ['Неактивность >30 дней', 'Исторические данные', 'Предпочтения игрока']
  },
  {
    id: 'ai-first-deposit',
    name: 'AI-первый депозит',
    description: 'Интеллектуальная система для стимулирования первого депозита новых игроков',
    targetMetric: 'First Deposit Rate',
    expectedImprovement: '+35-55%',
    category: 'Conversion',
    priority: 'high',
    channels: ['Email', 'Push', 'InApp', 'SMS'],
    estimatedTime: '2-4 дня',
    complexity: 'простой',
    triggers: ['Регистрация', 'Игра без депозита', 'Время в системе']
  }
];

export function AIScenariosTab({ 
  onCreateScenario 
}: { 
  onCreateScenario?: (scenario: AIScenario) => void;
}) {
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
      case 'high': return 'Высокий приоритет';
      case 'medium': return 'Средний приоритет';
      case 'low': return 'Низкий приоритет';
      default: return priority;
    }
  };

  const getMetricIcon = (metric: string) => {
    if (metric.includes('Retention') || metric.includes('Churn')) return <Users className="h-4 w-4" />;
    if (metric.includes('GGR') || metric.includes('LTV')) return <DollarSign className="h-4 w-4" />;
    if (metric.includes('Conversion')) return <TrendingUp className="h-4 w-4" />;
    if (metric.includes('VIP')) return <Star className="h-4 w-4" />;
    if (metric.includes('Engagement')) return <Activity className="h-4 w-4" />;
    return <Target className="h-4 w-4" />;
  };

  return (
    <div className="space-y-4 p-1">
      {/* Header */}
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <Bot className="h-5 w-5 text-blue-600" />
          <h3 className="text-lg font-semibold">ИИ сценарии</h3>
          <Badge variant="outline" className="text-blue-600 border-blue-200 bg-blue-50 text-xs">
            AI-Powered
          </Badge>
        </div>
        <p className="text-sm text-muted-foreground">
          Рекомендованные AI-сценарии для буста определенных метрик на основе данных и прогнозов
        </p>
      </div>

      {/* AI Scenarios Grid */}
      <div className="grid gap-3 grid-cols-1 max-h-[400px] overflow-y-auto">
        {aiScenarios.map((scenario) => (
          <Card 
            key={scenario.id} 
            className="hover:shadow-md transition-shadow cursor-pointer p-3"
          >
            <CardHeader className="pb-2">
              <div className="flex items-start justify-between">
                <div className="space-y-1 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <CardTitle className="text-base leading-tight">{scenario.name}</CardTitle>
                    <Badge 
                      variant="outline" 
                      className={`text-xs ${getPriorityColor(scenario.priority)}`}
                    >
                      {getPriorityLabel(scenario.priority)}
                    </Badge>
                    <Badge variant="secondary" className="text-xs">{scenario.category}</Badge>
                  </div>
                  <CardDescription className="text-xs">
                    {scenario.description}
                  </CardDescription>
                </div>
              </div>
            </CardHeader>

            <CardContent className="space-y-3 pt-0">
              {/* Target Metric */}
              <div className="flex items-center gap-2">
                {getMetricIcon(scenario.targetMetric)}
                <div className="flex-1">
                  <div className="text-xs text-muted-foreground">Целевая метрика</div>
                  <div className="text-sm font-medium">{scenario.targetMetric}</div>
                </div>
                <div className="text-right">
                  <div className="text-xs text-muted-foreground">Улучшение</div>
                  <div className="text-sm font-bold text-green-600">{scenario.expectedImprovement}</div>
                </div>
              </div>

              {/* Details */}
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div>
                  <span className="text-muted-foreground">Каналы: </span>
                  <span className="font-medium">{scenario.channels.join(', ')}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Время: </span>
                  <span className="font-medium">{scenario.estimatedTime}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Сложность: </span>
                  <span className="font-medium">{scenario.complexity}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Триггеров: </span>
                  <span className="font-medium">{scenario.triggers.length}</span>
                </div>
              </div>

              {/* AI Recommendation */}
              <div className="flex items-center gap-2 p-1.5 bg-blue-50 rounded border border-blue-200">
                <Lightbulb className="h-3 w-3 text-blue-600 flex-shrink-0" />
                <span className="text-xs font-medium text-blue-900">
                  Рекомендуется для проектов с низким {scenario.targetMetric}
                </span>
              </div>

              {/* Actions */}
              <div className="flex gap-2">
                <Button 
                  size="sm" 
                  className="flex-1 h-8 text-xs"
                  onClick={(e) => {
                    e.stopPropagation();
                    onCreateScenario?.(scenario);
                  }}
                >
                  <Zap className="mr-1 h-3 w-3" />
                  Создать сценарий
                </Button>
                <Button size="sm" variant="outline" className="h-8 text-xs">
                  Подробнее
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Summary */}
      <Card className="mt-4">
        <CardContent className="p-4">
          <div className="grid grid-cols-4 gap-3 text-center">
            <div>
              <div className="text-lg font-bold text-blue-600">{aiScenarios.length}</div>
              <div className="text-xs text-muted-foreground">AI-сценариев</div>
            </div>
            <div>
              <div className="text-lg font-bold text-red-600">
                {aiScenarios.filter(s => s.priority === 'high').length}
              </div>
              <div className="text-xs text-muted-foreground">Высокий приоритет</div>
            </div>
            <div>
              <div className="text-lg font-bold text-green-600">
                {new Set(aiScenarios.flatMap(s => s.channels)).size}
              </div>
              <div className="text-xs text-muted-foreground">Каналов</div>
            </div>
            <div>
              <div className="text-lg font-bold text-purple-600">
                {Math.round(aiScenarios.reduce((sum, s) => {
                  const improvement = parseFloat(s.expectedImprovement.replace(/[^\d.-]/g, ''));
                  return sum + (improvement || 0);
                }, 0) / aiScenarios.length)}%
              </div>
              <div className="text-xs text-muted-foreground">Ср. улучшение</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
