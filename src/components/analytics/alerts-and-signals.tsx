"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { 
  AlertCircle, TrendingDown, TrendingUp, Lightbulb, 
  ArrowRight, CheckCircle2, XCircle, Clock, Zap,
  Target, Users, DollarSign, Activity
} from "lucide-react";
import Link from "next/link";

type AlertType = 'critical' | 'warning' | 'info' | 'success';
type AlertCategory = 'retention' | 'revenue' | 'engagement' | 'campaign';

interface SystemAlert {
  id: string;
  type: AlertType;
  category: AlertCategory;
  metric: string;
  currentValue: string;
  threshold: string;
  message: string;
  recommendation: string;
  scenarios: {
    id: string;
    name: string;
    expectedImpact: string;
  }[];
  timestamp: Date;
}

// Генерация алертов на основе метрик
const generateAlerts = (): SystemAlert[] => {
  const alerts: SystemAlert[] = [
    {
      id: '1',
      type: 'critical',
      category: 'retention',
      metric: 'Retention Rate',
      currentValue: '58%',
      threshold: '< 60%',
      message: 'Retention Rate упал ниже критического уровня 60%',
      recommendation: 'Срочно запустите кампанию реактивации для сегментов "Предотток" и "Спящие"',
      scenarios: [
        { id: 'reactivation-vip', name: 'VIP Реактивация с персональными бонусами', expectedImpact: '+15% retention' },
        { id: 'weekend-promo', name: 'Выходная акция для активных', expectedImpact: '+8% retention' },
        { id: 'comeback-bonus', name: 'Welcome Back бонус для спящих', expectedImpact: '+12% reactivation' }
      ],
      timestamp: new Date()
    },
    {
      id: '2',
      type: 'warning',
      category: 'revenue',
      metric: 'ARPU',
      currentValue: '€82',
      threshold: '< €100',
      message: 'ARPU снизился на 18% за последние 7 дней',
      recommendation: 'Персонализированные офферы для сегмента "Выходного дня" могут увеличить средний чек',
      scenarios: [
        { id: 'deposit-bonus', name: 'Прогрессивный депозитный бонус', expectedImpact: '+€25 ARPU' },
        { id: 'vip-upgrade', name: 'Промо на апгрейд до VIP', expectedImpact: '+€45 ARPU' }
      ],
      timestamp: new Date(Date.now() - 1000 * 60 * 30)
    },
    {
      id: '3',
      type: 'critical',
      category: 'engagement',
      metric: 'Bonus Utilization',
      currentValue: '45%',
      threshold: '< 50%',
      message: 'Использование бонусов упало до 45% - игроки не активируют офферы',
      recommendation: 'Снизьте требования по отыгрышу или улучшите коммуникацию бонусных предложений',
      scenarios: [
        { id: 'simplified-bonus', name: 'Упрощенные условия бонусов', expectedImpact: '+25% activation' },
        { id: 'email-optimization', name: 'A/B тест email-цепочек', expectedImpact: '+15% CTR' }
      ],
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2)
    },
    {
      id: '4',
      type: 'warning',
      category: 'campaign',
      metric: 'Reactivation Rate',
      currentValue: '8.5%',
      threshold: '< 10%',
      message: 'Эффективность реактивационных кампаний снизилась',
      recommendation: 'Запустите новую серию "win-back" для сегмента глубокого оттока',
      scenarios: [
        { id: 'winback-series', name: 'Multi-stage Win-back кампания', expectedImpact: '+5% reactivation' },
        { id: 'personal-manager', name: 'Персональный менеджер для VIP', expectedImpact: '+12% VIP retention' }
      ],
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 5)
    },
    {
      id: '5',
      type: 'success',
      category: 'revenue',
      metric: 'VIP Conversion',
      currentValue: '12.5%',
      threshold: '> 10%',
      message: 'VIP конверсия превысила целевой показатель!',
      recommendation: 'Масштабируйте успешную стратегию на другие сегменты',
      scenarios: [
        { id: 'vip-expansion', name: 'Расширение VIP программы', expectedImpact: '+3% conversion' }
      ],
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24)
    },
    {
      id: '6',
      type: 'info',
      category: 'engagement',
      metric: 'Weekend Activity',
      currentValue: '+35%',
      threshold: 'trend',
      message: 'Обнаружен рост активности в выходные дни',
      recommendation: 'Оптимальное время для запуска турниров и специальных акций',
      scenarios: [
        { id: 'weekend-tournament', name: 'Выходной турнир с призовым фондом', expectedImpact: '+20% engagement' }
      ],
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 48)
    }
  ];
  
  return alerts.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
};

// Определение приоритета действий
const getActionPriority = (alert: SystemAlert): string => {
  const priorities = {
    critical: 'Срочно',
    warning: 'Средне',
    info: 'Низкий',
    success: 'Информация'
  };
  return priorities[alert.type];
};

export function AlertsAndSignals() {
  const [alerts] = useState<SystemAlert[]>(generateAlerts());
  const [expandedAlert, setExpandedAlert] = useState<string | null>(null);
  const [filter, setFilter] = useState<AlertType | 'all'>('all');

  const filteredAlerts = filter === 'all' 
    ? alerts 
    : alerts.filter(alert => alert.type === filter);

  const getAlertIcon = (type: AlertType) => {
    switch (type) {
      case 'critical': return <XCircle className="h-5 w-5 text-red-600" />;
      case 'warning': return <AlertCircle className="h-5 w-5 text-yellow-600" />;
      case 'info': return <Clock className="h-5 w-5 text-blue-600" />;
      case 'success': return <CheckCircle2 className="h-5 w-5 text-green-600" />;
    }
  };

  const getCategoryIcon = (category: AlertCategory) => {
    switch (category) {
      case 'retention': return <Users className="h-4 w-4" />;
      case 'revenue': return <DollarSign className="h-4 w-4" />;
      case 'engagement': return <Activity className="h-4 w-4" />;
      case 'campaign': return <Target className="h-4 w-4" />;
    }
  };

  const getAlertColor = (type: AlertType) => {
    switch (type) {
      case 'critical': return 'border-red-600 bg-red-50';
      case 'warning': return 'border-yellow-600 bg-yellow-50';
      case 'info': return 'border-blue-600 bg-blue-50';
      case 'success': return 'border-green-600 bg-green-50';
    }
  };

  const alertCounts = {
    critical: alerts.filter(a => a.type === 'critical').length,
    warning: alerts.filter(a => a.type === 'warning').length,
    info: alerts.filter(a => a.type === 'info').length,
    success: alerts.filter(a => a.type === 'success').length
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Сигналы и уведомления</CardTitle>
            <CardDescription>
              AI-анализ аномалий и рекомендации по оптимизации
            </CardDescription>
          </div>
          <div className="flex gap-2">
            <Badge variant={filter === 'all' ? 'default' : 'outline'} 
                   className="cursor-pointer"
                   onClick={() => setFilter('all')}>
              Все ({alerts.length})
            </Badge>
            <Badge variant={filter === 'critical' ? 'destructive' : 'outline'} 
                   className="cursor-pointer"
                   onClick={() => setFilter('critical')}>
              Критичные ({alertCounts.critical})
            </Badge>
            <Badge variant={filter === 'warning' ? 'secondary' : 'outline'} 
                   className="cursor-pointer"
                   onClick={() => setFilter('warning')}>
              Внимание ({alertCounts.warning})
            </Badge>
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        {/* Сводка по алертам */}
        {alertCounts.critical > 0 && filter === 'all' && (
          <Alert className="mb-4 border-red-600">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Требуется немедленное внимание!</AlertTitle>
            <AlertDescription>
              {alertCounts.critical} критических показателей требуют срочных действий
            </AlertDescription>
          </Alert>
        )}

        {/* Список алертов */}
        <div className="space-y-4">
          {filteredAlerts.map(alert => (
            <div
              key={alert.id}
              className={`p-4 rounded-lg border-2 transition-all ${getAlertColor(alert.type)}`}
            >
              {/* Заголовок алерта */}
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-start gap-3">
                  {getAlertIcon(alert.type)}
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-semibold">{alert.metric}</h4>
                      <Badge variant="outline" className="text-xs">
                        {getCategoryIcon(alert.category)}
                        <span className="ml-1 capitalize">{alert.category}</span>
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{alert.message}</p>
                  </div>
                </div>
                <div className="text-right">
                  <Badge variant={alert.type === 'critical' ? 'destructive' : 'secondary'}>
                    {getActionPriority(alert)}
                  </Badge>
                  <p className="text-xs text-muted-foreground mt-1">
                    {new Date(alert.timestamp).toLocaleString('ru-RU')}
                  </p>
                </div>
              </div>

              {/* Метрики */}
              <div className="grid grid-cols-3 gap-4 mb-3">
                <div className="text-center p-2 bg-background rounded">
                  <p className="text-xs text-muted-foreground">Текущее</p>
                  <p className="font-bold">{alert.currentValue}</p>
                </div>
                <div className="text-center p-2 bg-background rounded">
                  <p className="text-xs text-muted-foreground">Порог</p>
                  <p className="font-bold">{alert.threshold}</p>
                </div>
                <div className="text-center p-2 bg-background rounded">
                  <p className="text-xs text-muted-foreground">Статус</p>
                  <p className="font-bold text-sm">
                    {alert.type === 'critical' ? '🔴' : 
                     alert.type === 'warning' ? '🟡' : 
                     alert.type === 'success' ? '🟢' : '🔵'}
                  </p>
                </div>
              </div>

              {/* Рекомендация */}
              <div className="p-3 bg-background rounded-lg mb-3">
                <div className="flex items-start gap-2">
                  <Lightbulb className="h-4 w-4 text-primary mt-0.5" />
                  <div className="flex-1">
                    <p className="text-sm font-medium mb-1">AI Рекомендация</p>
                    <p className="text-sm text-muted-foreground">{alert.recommendation}</p>
                  </div>
                </div>
              </div>

              {/* Сценарии действий */}
              <div 
                className="cursor-pointer"
                onClick={() => setExpandedAlert(expandedAlert === alert.id ? null : alert.id)}
              >
                <div className="flex items-center justify-between text-sm font-medium">
                  <span>Рекомендуемые сценарии ({alert.scenarios.length})</span>
                  <ArrowRight className={`h-4 w-4 transition-transform ${
                    expandedAlert === alert.id ? 'rotate-90' : ''
                  }`} />
                </div>
              </div>

              {expandedAlert === alert.id && (
                <div className="mt-3 space-y-2">
                  {alert.scenarios.map(scenario => (
                    <div key={scenario.id} className="flex items-center justify-between p-3 bg-background rounded-lg">
                      <div className="flex items-center gap-3">
                        <Zap className="h-4 w-4 text-primary" />
                        <div>
                          <p className="text-sm font-medium">{scenario.name}</p>
                          <p className="text-xs text-muted-foreground">{scenario.expectedImpact}</p>
                        </div>
                      </div>
                      <Button size="sm" variant="outline" asChild>
                        <Link href={`/builder?template=${scenario.id}`}>
                          Создать
                          <ArrowRight className="ml-2 h-3 w-3" />
                        </Link>
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Пустое состояние */}
        {filteredAlerts.length === 0 && (
          <div className="text-center py-8">
            <CheckCircle2 className="h-12 w-12 text-green-600 mx-auto mb-4" />
            <p className="text-muted-foreground">
              Нет активных уведомлений в выбранной категории
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}