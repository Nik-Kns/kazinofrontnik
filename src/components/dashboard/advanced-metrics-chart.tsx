"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  LineChart, 
  Line, 
  BarChart, 
  Bar, 
  ComposedChart,
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  Legend,
  ReferenceLine,
  Area
} from "recharts";
import { 
  TrendingUp, 
  TrendingDown, 
  Minus, 
  Info,
  Eye,
  EyeOff,
  BarChart2,
  LineChartIcon,
  Settings2
} from "lucide-react";
import { format, subDays, startOfMonth, endOfMonth } from "date-fns";
import { ru } from "date-fns/locale";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";

// Расширенная конфигурация метрик согласно требованиям
interface MetricConfig {
  key: string;
  name: string;
  unit: 'currency' | 'percent' | 'coefficient' | 'number';
  format: (value: number, currency?: string) => string;
  color: string;
  secondaryColor?: string;
  chartType: 'line' | 'bar' | 'area';
  description: string;
  goodThreshold?: number; // Пороговое значение для подсветки
  trendlineEnabled?: boolean;
}

const metricsConfig: Record<string, MetricConfig> = {
  ggr: {
    key: "ggr",
    name: "GGR",
    unit: 'currency',
    format: (v, currency = 'EUR') => {
      if (v == null || isNaN(v)) return '—';
      const symbols: Record<string, string> = { EUR: '€', USD: '$', VND: '₫' };
      return `${symbols[currency]}${v.toLocaleString()}`;
    },
    color: "#2962FF",
    chartType: 'line',
    description: "Gross Gaming Revenue - валовой игровой доход",
    trendlineEnabled: true
  },
  avg_deposit: {
    key: "avg_deposit",
    name: "Средний депозит",
    unit: 'currency',
    format: (v, currency = 'EUR') => {
      if (v == null || isNaN(v)) return '—';
      const symbols: Record<string, string> = { EUR: '€', USD: '$', VND: '₫' };
      return `${symbols[currency]}${v.toFixed(2)}`;
    },
    color: "#00C853",
    chartType: 'bar',
    description: "Средняя сумма депозита игроков"
  },
  retention_rate: {
    key: "retention_rate",
    name: "Retention Rate",
    unit: 'percent',
    format: (v) => v == null || isNaN(v) ? '—' : `${v.toFixed(1)}%`,
    color: "#9C27B0",
    chartType: 'line',
    description: "Общий процент удержания игроков"
  },
  retention_1d: {
    key: "retention_1d",
    name: "Retention 1-й депозит",
    unit: 'percent',
    format: (v) => v == null || isNaN(v) ? '—' : `${v.toFixed(1)}%`,
    color: "#FF6F00",
    secondaryColor: "#FFB300",
    chartType: 'line',
    description: "Удержание игроков после первого депозита"
  },
  romi: {
    key: "romi",
    name: "ROMI",
    unit: 'percent',
    format: (v) => v == null || isNaN(v) ? '—' : `${v.toFixed(0)}%`,
    color: "#00BCD4",
    chartType: 'bar',
    description: "Return on Marketing Investment",
    goodThreshold: 100 // ROMI > 100% - прибыльные кампании
  },
  arpu: {
    key: "arpu",
    name: "ARPU",
    unit: 'currency',
    format: (v, currency = 'EUR') => {
      if (v == null || isNaN(v)) return '—';
      const symbols: Record<string, string> = { EUR: '€', USD: '$', VND: '₫' };
      return `${symbols[currency]}${v.toFixed(2)}`;
    },
    color: "#E91E63",
    chartType: 'line',
    description: "Average Revenue Per User"
  },
  dau: {
    key: "dau",
    name: "DAU",
    unit: 'number',
    format: (v) => v == null || isNaN(v) ? '—' : v.toLocaleString(),
    color: "#FFC107",
    chartType: 'area',
    description: "Daily Active Users"
  },
  mau: {
    key: "mau",
    name: "MAU",
    unit: 'number',
    format: (v) => v == null || isNaN(v) ? '—' : v.toLocaleString(),
    color: "#795548",
    chartType: 'area',
    description: "Monthly Active Users"
  },
  ltv: {
    key: "ltv",
    name: "LTV",
    unit: 'currency',
    format: (v, currency = 'EUR') => {
      if (v == null || isNaN(v)) return '—';
      const symbols: Record<string, string> = { EUR: '€', USD: '$', VND: '₫' };
      return `${symbols[currency]}${v.toLocaleString()}`;
    },
    color: "#607D8B",
    chartType: 'line',
    description: "Lifetime Value игрока"
  },
  crm_spend: {
    key: "crm_spend",
    name: "CRM Spend",
    unit: 'currency',
    format: (v, currency = 'EUR') => {
      if (v == null || isNaN(v)) return '—';
      const symbols: Record<string, string> = { EUR: '€', USD: '$', VND: '₫' };
      return `${symbols[currency]}${v.toLocaleString()}`;
    },
    color: "#FF5722",
    chartType: 'bar',
    description: "Расходы на CRM кампании"
  },
  conversion_rate: {
    key: "conversion_rate",
    name: "Conversion Rate",
    unit: 'percent',
    format: (v) => v == null || isNaN(v) ? '—' : `${v.toFixed(2)}%`,
    color: "#3F51B5",
    chartType: 'line',
    description: "Конверсия регистрация → депозит"
  }
};

// Генерация моковых данных с учетом типа метрики
const generateMockData = (
  metricKeys: string[], 
  dateRange: number, 
  segment?: string,
  campaign?: string
) => {
  const data = [];
  const now = new Date();
  
  for (let i = dateRange - 1; i >= 0; i--) {
    const date = subDays(now, i);
    const dayData: any = {
      date: format(date, "dd.MM", { locale: ru }),
      fullDate: date.toISOString(),
      dayOfWeek: date.getDay()
    };
    
    metricKeys.forEach(key => {
      const config = metricsConfig[key];
      if (!config) return;
      
      let baseValue = 0;
      let variance = 0;
      
      // Базовые значения и вариации для каждой метрики
      switch (key) {
        case 'ggr':
          baseValue = segment === 'vip' ? 250000 : segment === 'new' ? 50000 : 125000;
          variance = baseValue * 0.2;
          break;
        case 'avg_deposit':
          baseValue = segment === 'vip' ? 2000 : segment === 'new' ? 50 : 125;
          variance = baseValue * 0.3;
          break;
        case 'retention_rate':
          baseValue = segment === 'vip' ? 65 : segment === 'new' ? 35 : 45;
          variance = 5;
          break;
        case 'retention_1d':
          baseValue = segment === 'vip' ? 75 : segment === 'new' ? 25 : 35;
          variance = 8;
          break;
        case 'romi':
          baseValue = campaign === 'email' ? 150 : campaign === 'social' ? 85 : 120;
          variance = 30;
          break;
        case 'arpu':
          baseValue = segment === 'vip' ? 500 : segment === 'new' ? 25 : 125;
          variance = baseValue * 0.15;
          break;
        case 'dau':
          baseValue = 2500;
          variance = 500;
          // Выходные дни имеют больше активности
          if (dayData.dayOfWeek === 0 || dayData.dayOfWeek === 6) {
            baseValue *= 1.3;
          }
          break;
        case 'mau':
          baseValue = 45000;
          variance = 5000;
          break;
        case 'ltv':
          baseValue = segment === 'vip' ? 5000 : segment === 'new' ? 200 : 450;
          variance = baseValue * 0.1;
          break;
        case 'crm_spend':
          baseValue = 5000;
          variance = 1000;
          break;
        case 'conversion_rate':
          baseValue = segment === 'vip' ? 25 : segment === 'new' ? 8 : 12.5;
          variance = 2;
          break;
        default:
          baseValue = 100;
          variance = 20;
      }
      
      // Добавляем тренд и случайные колебания
      const trend = (dateRange - i) / dateRange * 0.2;
      const randomFactor = (Math.random() - 0.5) * 2;
      const value = baseValue * (1 + trend) + randomFactor * variance;
      
      dayData[key] = Math.max(0, value);
    });
    
    data.push(dayData);
  }
  
  return data;
};

interface AdvancedMetricsChartProps {
  selectedMetrics: string[];
  dateRange?: number;
  timeRange?: string;
  activeMetric?: string;
  onMetricClick?: (metricKey: string) => void;
  segment?: 'all' | 'new' | 'active' | 'vip';
  campaign?: string;
  currency?: 'EUR' | 'USD' | 'VND';
}

export function AdvancedMetricsChart({
  selectedMetrics = ["ggr", "retention_rate"],
  dateRange,
  timeRange,
  activeMetric: propActiveMetric,
  onMetricClick,
  segment = 'all',
  campaign,
  currency = 'EUR'
}: AdvancedMetricsChartProps) {
  const [showMetricsDialog, setShowMetricsDialog] = useState(false);
  const [tempSelectedMetrics, setTempSelectedMetrics] = useState<string[]>([]);
  // Конвертируем timeRange в количество дней
  const getDaysFromTimeRange = (range: string): number => {
    switch(range) {
      case 'today':
      case 'yesterday':
        return 1;
      case 'week':
        return 7;
      case 'month':
        return 30;
      case 'quarter':
        return 90;
      case 'year':
        return 365;
      default:
        return 30;
    }
  };
  
  const effectiveDateRange = timeRange ? getDaysFromTimeRange(timeRange) : (dateRange || 30);
  const [displayedMetrics, setDisplayedMetrics] = useState<string[]>(selectedMetrics);
  const [activeMetrics, setActiveMetrics] = useState<string[]>([selectedMetrics[0]]);
  const [chartData, setChartData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [chartType, setChartType] = useState<'composed' | 'line' | 'bar'>('composed');
  const [showTrendline, setShowTrendline] = useState(true);
  const [compareMode, setCompareMode] = useState(false);
  
  // Открытие диалога выбора метрик
  const handleOpenMetricsDialog = () => {
    setTempSelectedMetrics([...displayedMetrics]);
    setShowMetricsDialog(true);
  };

  // Применение выбранных метрик
  const handleApplyMetrics = () => {
    if (tempSelectedMetrics.length > 0) {
      setDisplayedMetrics(tempSelectedMetrics);
      setActiveMetrics([tempSelectedMetrics[0]]);
      setLoading(true);
    }
    setShowMetricsDialog(false);
  };

  // Переключение метрики в диалоге
  const toggleMetricSelection = (metricKey: string) => {
    setTempSelectedMetrics(prev => {
      if (prev.includes(metricKey)) {
        return prev.filter(m => m !== metricKey);
      } else {
        return [...prev, metricKey];
      }
    });
  };

  useEffect(() => {
    // Если включен режим сравнения, показываем до 2х метрик
    if (compareMode && displayedMetrics.length > 1) {
      setActiveMetrics([displayedMetrics[0], displayedMetrics[1]]);
    } else if (propActiveMetric && displayedMetrics.includes(propActiveMetric)) {
      setActiveMetrics([propActiveMetric]);
    } else {
      setActiveMetrics([displayedMetrics[0]]);
    }
  }, [propActiveMetric, displayedMetrics, compareMode]);
  
  useEffect(() => {
    setLoading(true);
    const data = generateMockData(
      compareMode ? activeMetrics : displayedMetrics,
      effectiveDateRange,
      segment !== 'all' ? segment : undefined,
      campaign
    );
    setChartData(data);
    setTimeout(() => setLoading(false), 300);
  }, [activeMetrics, effectiveDateRange, segment, campaign, compareMode, displayedMetrics]);
  
  // Вычисляем среднее значение для трендовой линии
  const calculateAverage = (metricKey: string) => {
    if (!chartData.length) return 0;
    const sum = chartData.reduce((acc, item) => acc + (item[metricKey] || 0), 0);
    return sum / chartData.length;
  };
  
  // Форматтер для осей
  const formatYAxis = (value: number, metricKey: string) => {
    const config = metricsConfig[metricKey];
    if (!config) return value.toString();
    
    if (config.unit === 'currency') {
      if (value >= 1000000) return `${(value / 1000000).toFixed(1)}M`;
      if (value >= 1000) return `${(value / 1000).toFixed(0)}k`;
      return value.toFixed(0);
    }
    
    if (config.unit === 'percent') {
      return `${value.toFixed(0)}%`;
    }
    
    if (value >= 1000) return `${(value / 1000).toFixed(0)}k`;
    return value.toFixed(0);
  };
  
  // Обновляем displayedMetrics при изменении selectedMetrics
  useEffect(() => {
    if (selectedMetrics.length > 0) {
      setDisplayedMetrics(selectedMetrics);
    }
  }, [selectedMetrics]);

  // Кастомный тултип
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (!active || !payload || !payload.length) return null;
    
    return (
      <div className="bg-background border rounded-lg shadow-lg p-3">
        <p className="font-semibold mb-2">{label}</p>
        {payload.map((entry: any, index: number) => {
          const config = metricsConfig[entry.dataKey];
          if (!config) return null;
          
          const value = config.format(entry.value, currency);
          const isGood = config.goodThreshold 
            ? entry.value >= config.goodThreshold 
            : entry.value > calculateAverage(entry.dataKey);
          
          return (
            <div key={index} className="flex items-center gap-2 text-sm">
              <div 
                className="w-3 h-3 rounded-full" 
                style={{ backgroundColor: entry.color }}
              />
              <span className="font-medium">{config.name}:</span>
              <span className={isGood ? "text-green-600" : ""}>
                {value}
              </span>
              {config.goodThreshold && entry.value < config.goodThreshold && (
                <Badge variant="destructive" className="text-xs px-1 py-0">
                  Низкий
                </Badge>
              )}
            </div>
          );
        })}
      </div>
    );
  };
  
  const renderChart = () => {
    if (loading) {
      return (
        <div className="h-[400px] flex items-center justify-center">
          <div className="animate-pulse text-muted-foreground">
            Загрузка данных...
          </div>
        </div>
      );
    }
    
    const metrics = compareMode ? activeMetrics : [activeMetrics[0]];
    const primaryMetric = metricsConfig[metrics[0]];
    const secondaryMetric = metrics[1] ? metricsConfig[metrics[1]] : null;
    
    // Определяем тип графика на основе метрик
    const useBarChart = metrics.some(m => 
      metricsConfig[m]?.chartType === 'bar'
    ) && !compareMode;
    
    const chartComponent = useBarChart ? (
      <BarChart data={chartData}>
        <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
        <XAxis 
          dataKey="date"
          tick={{ fontSize: 12 }}
          interval="preserveStartEnd"
        />
        <YAxis 
          tick={{ fontSize: 12 }}
          tickFormatter={(v) => formatYAxis(v, metrics[0])}
        />
        <Tooltip content={<CustomTooltip />} />
        <Legend />
        {metrics.map(metricKey => {
          const config = metricsConfig[metricKey];
          if (!config) return null;
          
          return (
            <Bar
              key={metricKey}
              dataKey={metricKey}
              fill={config.color}
              name={config.name}
              radius={[4, 4, 0, 0]}
            />
          );
        })}
        {showTrendline && primaryMetric?.trendlineEnabled && (
          <ReferenceLine 
            y={calculateAverage(metrics[0])} 
            stroke="#888"
            strokeDasharray="5 5"
            label="Среднее"
          />
        )}
      </BarChart>
    ) : (
      <LineChart data={chartData}>
        <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
        <XAxis 
          dataKey="date"
          tick={{ fontSize: 12 }}
          interval="preserveStartEnd"
        />
        <YAxis 
          yAxisId="left"
          tick={{ fontSize: 12 }}
          tickFormatter={(v) => formatYAxis(v, metrics[0])}
        />
        {secondaryMetric && secondaryMetric.unit !== primaryMetric?.unit && (
          <YAxis 
            yAxisId="right"
            orientation="right"
            tick={{ fontSize: 12 }}
            tickFormatter={(v) => formatYAxis(v, metrics[1])}
          />
        )}
        <Tooltip content={<CustomTooltip />} />
        <Legend />
        {metrics.map((metricKey, index) => {
          const config = metricsConfig[metricKey];
          if (!config) return null;
          
          const yAxisId = index === 0 || 
            (secondaryMetric && secondaryMetric.unit === primaryMetric?.unit) 
            ? "left" : "right";
          
          if (config.chartType === 'area') {
            return (
              <Area
                key={metricKey}
                yAxisId={yAxisId}
                type="monotone"
                dataKey={metricKey}
                stroke={config.color}
                fill={config.color}
                fillOpacity={0.3}
                strokeWidth={2}
                name={config.name}
              />
            );
          }
          
          return (
            <Line
              key={metricKey}
              yAxisId={yAxisId}
              type="monotone"
              dataKey={metricKey}
              stroke={config.color}
              strokeWidth={2}
              dot={{ r: 3 }}
              activeDot={{ r: 5 }}
              name={config.name}
              strokeDasharray={index === 1 && config.secondaryColor ? "5 5" : undefined}
            />
          );
        })}
        {showTrendline && primaryMetric?.trendlineEnabled && (
          <ReferenceLine 
            yAxisId="left"
            y={calculateAverage(metrics[0])} 
            stroke="#888"
            strokeDasharray="5 5"
            label="Среднее"
          />
        )}
      </LineChart>
    );
    
    return (
      <ResponsiveContainer width="100%" height={400}>
        {chartComponent}
      </ResponsiveContainer>
    );
  };
  
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg">Динамика метрик</CardTitle>
            <p className="text-sm text-muted-foreground mt-1">
              {compareMode ? "Режим сравнения (до 2х метрик)" : "Кликните на метрику для просмотра"}
            </p>
          </div>
          <div className="flex items-center gap-4">
            {/* Кнопка выбора метрик */}
            <Button
              variant="outline"
              size="sm"
              onClick={handleOpenMetricsDialog}
              className="flex items-center gap-2"
            >
              <Settings2 className="h-4 w-4" />
              Выбор метрик
            </Button>
            {/* Переключатель режима сравнения */}
            <div className="flex items-center gap-2">
              <Switch
                id="compare-mode"
                checked={compareMode}
                onCheckedChange={setCompareMode}
              />
              <Label htmlFor="compare-mode" className="text-sm">
                Сравнить метрики
              </Label>
            </div>
            
            {/* Переключатель трендовой линии */}
            <div className="flex items-center gap-2">
              <Switch
                id="trendline"
                checked={showTrendline}
                onCheckedChange={setShowTrendline}
              />
              <Label htmlFor="trendline" className="text-sm">
                Тренд
              </Label>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {/* Селектор метрик */}
        <div className="flex gap-2 mb-4 flex-wrap">
          {selectedMetrics.map(metricKey => {
            const config = metricsConfig[metricKey];
            if (!config) return null;
            
            const isActive = activeMetrics.includes(metricKey);
            
            return (
              <Button
                key={metricKey}
                variant={isActive ? "default" : "outline"}
                size="sm"
                onClick={() => {
                  if (compareMode) {
                    if (isActive) {
                      setActiveMetrics(activeMetrics.filter(m => m !== metricKey));
                    } else if (activeMetrics.length < 2) {
                      setActiveMetrics([...activeMetrics, metricKey]);
                    }
                  } else {
                    setActiveMetrics([metricKey]);
                    if (onMetricClick) onMetricClick(metricKey);
                  }
                }}
                className="gap-1"
              >
                <div 
                  className="w-3 h-3 rounded-full" 
                  style={{ backgroundColor: config.color }}
                />
                {config.name}
                <Info className="h-3 w-3 opacity-50" />
              </Button>
            );
          })}
        </div>
        
        {/* Информация о выбранных метриках */}
        {activeMetrics.length > 0 && (
          <div className="mb-4 p-3 bg-muted/30 rounded-lg space-y-2">
            {activeMetrics.map(metricKey => {
              const config = metricsConfig[metricKey];
              if (!config) return null;
              
              const avg = calculateAverage(metricKey);
              const lastValue = chartData.length > 0 
                ? chartData[chartData.length - 1][metricKey] 
                : 0;
              const change = avg > 0 ? ((lastValue - avg) / avg) * 100 : 0;
              
              return (
                <div key={metricKey} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div 
                      className="w-3 h-3 rounded-full" 
                      style={{ backgroundColor: config.color }}
                    />
                    <span className="font-medium">{config.name}</span>
                    <span className="text-xs text-muted-foreground">
                      {config.description}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-bold">
                      {config.format(lastValue, currency)}
                    </span>
                    <Badge 
                      variant={change > 0 ? "default" : "destructive"}
                      className="gap-1"
                    >
                      {change > 0 ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                      {Math.abs(change).toFixed(1)}%
                    </Badge>
                  </div>
                </div>
              );
            })}
          </div>
        )}
        
        {/* График */}
        {renderChart()}
        
        {/* Легенда с дополнительной информацией */}
        {activeMetrics.some(m => metricsConfig[m]?.goodThreshold) && (
          <div className="mt-4 p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
            <p className="text-sm text-yellow-800 dark:text-yellow-200">
              <Info className="inline h-4 w-4 mr-1" />
              Метрики с порогом: 
              {activeMetrics.filter(m => metricsConfig[m]?.goodThreshold).map(m => {
                const config = metricsConfig[m];
                return ` ${config.name} (>${config.goodThreshold}${config.unit === 'percent' ? '%' : ''})`;
              }).join(', ')}
            </p>
          </div>
        )}
      </CardContent>
      
      {/* Диалог выбора метрик */}
      <Dialog open={showMetricsDialog} onOpenChange={setShowMetricsDialog}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-hidden flex flex-col">
          <DialogHeader>
            <DialogTitle>Выбор метрик для отображения</DialogTitle>
            <DialogDescription>
              Выберите метрики, которые хотите видеть на графике (минимум одна метрика)
            </DialogDescription>
          </DialogHeader>
          <div className="flex-1 overflow-y-auto py-4">
            <div className="grid grid-cols-2 gap-4">
              {Object.entries(metricsConfig).map(([key, metric]) => (
                <div key={key} className="flex items-start space-x-3 p-2 rounded-lg hover:bg-muted/50 transition-colors">
                  <Checkbox
                    id={key}
                    checked={tempSelectedMetrics.includes(key)}
                    onCheckedChange={() => toggleMetricSelection(key)}
                    className="mt-1"
                  />
                  <div className="flex-1 space-y-1">
                    <Label
                      htmlFor={key}
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer flex items-center gap-2"
                    >
                      <div 
                        className="w-3 h-3 rounded-full flex-shrink-0" 
                        style={{ backgroundColor: metric.color }}
                      />
                      {metric.name}
                    </Label>
                    <p className="text-xs text-muted-foreground">
                      {metric.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <DialogFooter className="flex justify-between items-center">
            <p className="text-sm text-muted-foreground">
              Выбрано: {tempSelectedMetrics.length} из {Object.keys(metricsConfig).length}
            </p>
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => setShowMetricsDialog(false)}
              >
                Отмена
              </Button>
              <Button 
                onClick={handleApplyMetrics}
                disabled={tempSelectedMetrics.length === 0}
              >
                Применить
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
}