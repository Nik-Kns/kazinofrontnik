"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  TrendingUp, TrendingDown, Minus, Settings, Info,
  Activity, Euro, Users, Target, Heart, AlertCircle
} from "lucide-react";
import type { KPIMetric, AvailableMetric } from "@/lib/types";

// Доступные метрики для выбора
const availableMetrics: AvailableMetric[] = [
  // Retention метрики
  { id: 'retention_rate', name: 'Retention Rate', category: 'retention', description: 'Процент удержанных игроков', unit: '%', defaultEnabled: true },
  { id: 'churn_rate', name: 'Churn Rate', category: 'retention', description: 'Уровень оттока игроков', unit: '%', defaultEnabled: true },
  { id: 'player_reactivation_rate', name: 'Player Reactivation Rate', category: 'retention', description: 'Процент возвращённых игроков', unit: '%' },
  
  // Revenue метрики
  { id: 'ltv', name: 'Lifetime Value (LTV)', category: 'revenue', description: 'Общий доход от игрока', unit: '€', defaultEnabled: true },
  { id: 'arpu', name: 'Average Revenue Per User (ARPU)', category: 'revenue', description: 'Средний доход на игрока', unit: '€', defaultEnabled: true },
  { id: 'average_deposit', name: 'Average Deposit Amount', category: 'revenue', description: 'Средний размер депозита', unit: '€' },
  { id: 'revenue_from_crm', name: 'Revenue from CRM', category: 'revenue', description: 'Доход от CRM кампаний', unit: '€' },
  { id: 'average_bet_size', name: 'Average Bet Size', category: 'revenue', description: 'Средний размер ставки', unit: '€' },
  
  // Engagement метрики
  { id: 'active_players_ratio', name: 'Active Players Ratio', category: 'engagement', description: 'Соотношение активных игроков', unit: '%', defaultEnabled: true },
  { id: 'frequency_deposits', name: 'Frequency of Deposits', category: 'engagement', description: 'Частота депозитов', unit: 'раз/мес', defaultEnabled: true },
  { id: 'average_session_duration', name: 'Average Session Duration', category: 'engagement', description: 'Средняя продолжительность сессии', unit: 'мин' },
  { id: 'session_frequency', name: 'Session Frequency', category: 'engagement', description: 'Частота игровых сессий', unit: 'раз/нед' },
  { id: 'peak_activity_time', name: 'Peak Activity Time', category: 'engagement', description: 'Время максимальной активности', unit: '' },
  
  // Conversion метрики
  { id: 'conversion_rate', name: 'Conversion Rate', category: 'conversion', description: 'Конверсия в активного игрока', unit: '%', defaultEnabled: true },
  { id: 'bonus_activation_rate', name: 'Bonus Activation Rate', category: 'conversion', description: 'Доля активирующих бонусы', unit: '%', defaultEnabled: true },
  { id: 'bonus_utilization_rate', name: 'Bonus Utilization Rate', category: 'conversion', description: 'Доля использованных бонусов', unit: '%' },
  { id: 'vip_conversion_rate', name: 'VIP Conversion Rate', category: 'conversion', description: 'Конверсия в VIP-уровень', unit: '%' },
  { id: 'first_deposit_time', name: 'First Deposit Time', category: 'conversion', description: 'Время до первого депозита', unit: 'часов' },
  { id: 're_deposit_rate', name: 'Re-deposit Rate', category: 'conversion', description: 'Частота повторных депозитов', unit: '%' },
  
  // Satisfaction метрики
  { id: 'csat', name: 'Customer Satisfaction Score', category: 'satisfaction', description: 'Удовлетворённость клиентов', unit: '/5' },
  { id: 'nps', name: 'Net Promoter Score', category: 'satisfaction', description: 'Готовность рекомендовать', unit: '' },
  { id: 'withdrawal_success_rate', name: 'Withdrawal Success Rate', category: 'satisfaction', description: 'Процент успешных выводов', unit: '%' },
  { id: 'support_interaction_rate', name: 'Support Interaction Rate', category: 'satisfaction', description: 'Частота обращений в поддержку', unit: '%' },
  { id: 'referral_rate', name: 'Referral Rate', category: 'satisfaction', description: 'Доля по рекомендациям', unit: '%' }
];

// Примеры данных KPI с бенчмарками
const generateKPIData = (selectedIds: string[]): KPIMetric[] => {
  const benchmarks: Record<string, { target: number; warning: number; critical: number }> = {
    retention_rate: { target: 75, warning: 65, critical: 50 },
    churn_rate: { target: 2.5, warning: 4, critical: 6 },
    ltv: { target: 10000, warning: 7000, critical: 5000 },
    arpu: { target: 150, warning: 100, critical: 75 },
    conversion_rate: { target: 60, warning: 45, critical: 30 },
    active_players_ratio: { target: 70, warning: 55, critical: 40 }
  };

  return selectedIds.map(id => {
    const metric = availableMetrics.find(m => m.id === id)!;
    const benchmark = benchmarks[id] || { target: 100, warning: 75, critical: 50 };
    
    // Генерируем случайные значения для демо
    const currentValue = Math.random() * 100;
    const previousValue = currentValue * (0.8 + Math.random() * 0.4);
    const change = ((currentValue - previousValue) / previousValue) * 100;
    
    // Определяем статус по бенчмаркам
    let status: 'green' | 'yellow' | 'red' = 'green';
    if (id === 'churn_rate') { // Для churn rate меньше - лучше
      if (currentValue > benchmark.critical) status = 'red';
      else if (currentValue > benchmark.warning) status = 'yellow';
    } else {
      if (currentValue < benchmark.critical) status = 'red';
      else if (currentValue < benchmark.warning) status = 'yellow';
    }
    
    return {
      id,
      name: metric.name,
      currentValue: metric.unit === '€' ? `€${currentValue.toFixed(0)}` : 
                    metric.unit === '%' ? `${currentValue.toFixed(1)}%` :
                    metric.unit === '/5' ? `${(currentValue/20).toFixed(1)}/5` :
                    metric.unit ? `${currentValue.toFixed(1)} ${metric.unit}` :
                    currentValue.toFixed(1),
      previousValue: metric.unit === '€' ? `€${previousValue.toFixed(0)}` : 
                     metric.unit === '%' ? `${previousValue.toFixed(1)}%` :
                     previousValue.toFixed(1),
      unit: metric.unit,
      change: change,
      status,
      benchmark: metric.unit === '€' ? `€${benchmark.target}` : 
                 metric.unit === '%' ? `${benchmark.target}%` :
                 benchmark.target.toString(),
      description: metric.description
    };
  });
};

interface KPISummaryProps {
  filters?: any; // FilterConfig когда подключим
  segment?: string;
}

export function KPISummary({ filters, segment }: KPISummaryProps) {
  const defaultMetrics = availableMetrics
    .filter(m => m.defaultEnabled)
    .map(m => m.id);
  
  const [selectedMetrics, setSelectedMetrics] = useState<string[]>(defaultMetrics);
  const [kpiData, setKpiData] = useState<KPIMetric[]>(generateKPIData(defaultMetrics));
  const [dialogOpen, setDialogOpen] = useState(false);

  const handleMetricToggle = (metricId: string, checked: boolean) => {
    if (checked) {
      setSelectedMetrics(prev => [...prev, metricId]);
    } else {
      setSelectedMetrics(prev => prev.filter(id => id !== metricId));
    }
  };

  const applyMetricSelection = () => {
    setKpiData(generateKPIData(selectedMetrics));
    setDialogOpen(false);
  };

  const getStatusIcon = (status: 'green' | 'yellow' | 'red') => {
    switch (status) {
      case 'green': return '🟢';
      case 'yellow': return '🟡';
      case 'red': return '🔴';
    }
  };

  const getTrendIcon = (change: number | undefined) => {
    if (change === undefined || change === null) return <Minus className="h-4 w-4 text-gray-500" />;
    if (Math.abs(change) < 0.5) return <Minus className="h-4 w-4 text-gray-500" />;
    if (change > 0) return <TrendingUp className="h-4 w-4 text-green-600" />;
    return <TrendingDown className="h-4 w-4 text-red-600" />;
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'retention': return <Users className="h-4 w-4" />;
      case 'revenue': return <Euro className="h-4 w-4" />;
      case 'engagement': return <Activity className="h-4 w-4" />;
      case 'conversion': return <Target className="h-4 w-4" />;
      case 'satisfaction': return <Heart className="h-4 w-4" />;
      default: return <Activity className="h-4 w-4" />;
    }
  };

  const criticalMetrics = kpiData.filter(m => m.status === 'red');
  const warningMetrics = kpiData.filter(m => m.status === 'yellow');

  const toNumber = (v: string | number): number => {
    if (typeof v === 'number') return v;
    const cleaned = v.replace(/[^0-9.-]/g, '');
    const n = Number(cleaned);
    return isNaN(n) ? 0 : n;
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Обзор ключевых метрик (KPI Summary)</CardTitle>
            <CardDescription>
              <span>{segment ? `Сегмент: ${segment}` : 'Все сегменты'} • {kpiData.length} метрик</span>
            </CardDescription>
          </div>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm">
                <Settings className="h-4 w-4 mr-2" />
                Выбрать метрики
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Выберите метрики для отображения</DialogTitle>
                <DialogDescription>
                  Отметьте метрики, которые хотите видеть в дашборде
                </DialogDescription>
              </DialogHeader>
              
              <Tabs defaultValue="all" className="mt-4">
                <TabsList className="grid w-full grid-cols-6">
                  <TabsTrigger value="all">Все</TabsTrigger>
                  <TabsTrigger value="retention">Удержание</TabsTrigger>
                  <TabsTrigger value="revenue">Доход</TabsTrigger>
                  <TabsTrigger value="engagement">Вовлеченность</TabsTrigger>
                  <TabsTrigger value="conversion">Конверсия</TabsTrigger>
                  <TabsTrigger value="satisfaction">Удовлетворенность</TabsTrigger>
                </TabsList>

                <TabsContent value="all" className="space-y-4 mt-4">
                  {['retention', 'revenue', 'engagement', 'conversion', 'satisfaction'].map(category => (
                    <div key={category} className="space-y-2">
                      <h4 className="font-medium capitalize flex items-center gap-2">
                        {getCategoryIcon(category)}
                        {category === 'retention' && 'Метрики удержания'}
                        {category === 'revenue' && 'Финансовые метрики'}
                        {category === 'engagement' && 'Метрики вовлеченности'}
                        {category === 'conversion' && 'Метрики конверсии'}
                        {category === 'satisfaction' && 'Метрики удовлетворенности'}
                      </h4>
                      <div className="grid grid-cols-2 gap-2">
                        {availableMetrics
                          .filter(m => m.category === category)
                          .map(metric => (
                            <div key={metric.id} className="flex items-center space-x-2">
                              <Checkbox
                                id={metric.id}
                                checked={selectedMetrics.includes(metric.id)}
                                onCheckedChange={(checked) => 
                                  handleMetricToggle(metric.id, checked as boolean)
                                }
                              />
                              <label
                                htmlFor={metric.id}
                                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                              >
                                {metric.name}
                              </label>
                            </div>
                          ))}
                      </div>
                    </div>
                  ))}
                </TabsContent>

                {['retention', 'revenue', 'engagement', 'conversion', 'satisfaction'].map(category => (
                  <TabsContent key={category} value={category} className="space-y-2 mt-4">
                    {availableMetrics
                      .filter(m => m.category === category)
                      .map(metric => (
                        <div key={metric.id} className="flex items-start space-x-2">
                          <Checkbox
                            id={`${category}-${metric.id}`}
                            checked={selectedMetrics.includes(metric.id)}
                            onCheckedChange={(checked) => 
                              handleMetricToggle(metric.id, checked as boolean)
                            }
                          />
                          <div className="grid gap-1.5 leading-none">
                            <label
                              htmlFor={`${category}-${metric.id}`}
                              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                            >
                              {metric.name}
                            </label>
                            <p className="text-sm text-muted-foreground">
                              {metric.description}
                            </p>
                          </div>
                        </div>
                      ))}
                  </TabsContent>
                ))}
              </Tabs>

              <div className="flex justify-between mt-6">
                <Button variant="outline" onClick={() => setSelectedMetrics(defaultMetrics)}>
                  Сбросить к стандартным
                </Button>
                <Button onClick={applyMetricSelection}>
                  Применить ({selectedMetrics.length} выбрано)
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>

      <CardContent>
        {/* Алерты о критических метриках */}
        {(criticalMetrics.length > 0 || warningMetrics.length > 0) && (
          <div className="mb-6 space-y-2">
            {criticalMetrics.length > 0 && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                <div className="flex items-center gap-2">
                  <AlertCircle className="h-4 w-4 text-red-600" />
                  <span className="font-medium text-red-600">
                    {criticalMetrics.length} критических показателей требуют внимания
                  </span>
                </div>
              </div>
            )}
            {warningMetrics.length > 0 && (
              <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                <div className="flex items-center gap-2">
                  <AlertCircle className="h-4 w-4 text-yellow-600" />
                  <span className="font-medium text-yellow-600">
                    {warningMetrics.length} показателей близки к критическим значениям
                  </span>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Таблица метрик */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left py-3 px-4">Метрика</th>
                <th className="text-center py-3 px-4">Текущее значение</th>
                <th className="text-center py-3 px-4">Прошлый период</th>
                <th className="text-center py-3 px-4">Изменение</th>
                <th className="text-center py-3 px-4">Статус</th>
                <th className="text-center py-3 px-4">Цель</th>
              </tr>
            </thead>
            <tbody>
              {kpiData.map((metric) => (
                <tr key={metric.id} className="border-b hover:bg-muted/50">
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{metric.name}</span>
                      <Info className="h-3 w-3 text-muted-foreground" />
                    </div>
                  </td>
                  <td className="text-center py-3 px-4">
                    <span className="font-bold text-lg">{metric.currentValue}</span>
                  </td>
                  <td className="text-center py-3 px-4 text-muted-foreground">
                    {metric.previousValue}
                  </td>
                  <td className="text-center py-3 px-4">
                    <div className="flex items-center justify-center gap-1">
                      {getTrendIcon(metric.change)}
                      <span className={(metric.change ?? 0) > 0 ? 'text-green-600' : 'text-red-600'}>
                        {Math.abs(metric.change ?? 0).toFixed(1)}%
                      </span>
                    </div>
                  </td>
                  <td className="text-center py-3 px-4 text-2xl">
                    {getStatusIcon(metric.status)}
                  </td>
                  <td className="text-center py-3 px-4">
                    <div>
                      <div className="text-sm font-medium">{metric.benchmark}</div>
                      <Progress 
                        value={
                          metric.id === 'churn_rate' 
                            ? (100 - toNumber(metric.currentValue) * 2)
                            : Math.min(100, (toNumber(metric.currentValue) / toNumber(metric.benchmark || 0)) * 100)
                        } 
                        className="h-1 mt-1"
                      />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-4 flex items-center justify-between text-sm text-muted-foreground">
          <div className="flex items-center gap-4">
            <span>Легенда:</span>
            <span>🟢 В норме</span>
            <span>🟡 Требует внимания</span>
            <span>🔴 Критично</span>
          </div>
          <span>
            Данные обновлены: {new Date().toLocaleString('ru-RU')}
          </span>
        </div>
      </CardContent>
    </Card>
  );
}