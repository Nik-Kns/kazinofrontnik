"use client";

import { useEffect, useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  TrendingUp, 
  TrendingDown, 
  Minus, 
  Info,
  Eye,
  EyeOff,
  BarChart2,
  LineChartIcon,
  Settings2,
  Calendar
} from "lucide-react";
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

// Конфигурация метрик
const metricsConfig: Record<string, { name: string; color: string; unit: string }> = {
  ggr: { name: "GGR", color: "#2962FF", unit: "€" },
  arpu: { name: "ARPU", color: "#9C27B0", unit: "€" },
  ltv: { name: "LTV", color: "#FF6F00", unit: "€" },
  dau: { name: "DAU", color: "#00BCD4", unit: "" },
  mau: { name: "MAU", color: "#E91E63", unit: "" },
  retention_rate: { name: "Retention", color: "#4CAF50", unit: "%" },
  churn_rate: { name: "Churn Rate", color: "#F44336", unit: "%" },
  conversion_rate: { name: "Conversion", color: "#FF9800", unit: "%" },
  crm_spend: { name: "CRM Spend", color: "#795548", unit: "€" },
  bonus_utilization: { name: "Bonus Usage", color: "#607D8B", unit: "%" }
};

// Функция для получения изображения графика
const getChartImage = (metrics: string[], chartType: string, dateRange: number): string => {
  // Мапинг метрик на локальные SVG файлы
  const chartFiles: Record<string, string> = {
    ggr: '/charts/chart-ggr.svg',
    arpu: '/charts/chart-arpu.svg',
    ltv: '/charts/chart-ltv.svg',
    dau: '/charts/chart-dau.svg',
    mau: '/charts/chart-mau.svg',
    retention_rate: '/charts/chart-retention_rate.svg',
    churn_rate: '/charts/chart-churn_rate.svg',
    conversion_rate: '/charts/chart-conversion_rate.svg',
    crm_spend: '/charts/chart-ggr.svg', // fallback to ggr
    bonus_utilization: '/charts/chart-conversion_rate.svg' // fallback to conversion
  };
  
  // Возвращаем путь к локальному SVG файлу для первой метрики
  const primaryMetric = metrics[0];
  return chartFiles[primaryMetric] || '/charts/chart-ggr.svg';
};

// Моковые статистические данные
const getMockStats = (metrics: string[], dateRange: number) => {
  const baseStats: Record<string, { value: number; change: number }> = {
    ggr: { value: 142000, change: 13.5 },
    arpu: { value: 135, change: 8.0 },
    ltv: { value: 480, change: 6.7 },
    dau: { value: 2850, change: 14.2 },
    mau: { value: 48000, change: 5.5 },
    retention_rate: { value: 72.5, change: 8.5 },
    churn_rate: { value: 3.2, change: -5.2 },
    conversion_rate: { value: 18.5, change: 12.3 },
    crm_spend: { value: 25000, change: -3.5 },
    bonus_utilization: { value: 65.3, change: 7.8 }
  };

  // Корректируем изменение в зависимости от периода
  const periodMultiplier = dateRange <= 7 ? 0.5 : dateRange <= 30 ? 1.0 : 1.5;
  
  return metrics.map(metric => {
    const stats = baseStats[metric] || { value: 100, change: 5.0 };
    return {
      metric,
      name: metricsConfig[metric]?.name || metric,
      value: stats.value,
      change: stats.change * periodMultiplier,
      unit: metricsConfig[metric]?.unit || '',
      color: metricsConfig[metric]?.color || '#6B7280'
    };
  });
};

interface AdvancedMetricsChartProps {
  selectedMetrics?: string[];
  timeRange?: string;
  activeMetric?: string;
  onMetricClick?: (metric: string) => void;
}

export function AdvancedMetricsChart({ 
  selectedMetrics = ["ggr", "arpu", "retention_rate"],
  timeRange = "today",
  activeMetric: propActiveMetric,
  onMetricClick 
}: AdvancedMetricsChartProps) {
  const [chartType, setChartType] = useState<'line' | 'bar' | 'composed'>('line');
  const [dateRange, setDateRange] = useState<number>(() => {
    switch(timeRange) {
      case 'today': return 1;
      case 'yesterday': return 1;
      case 'week': return 7;
      case 'month': return 30;
      case 'quarter': return 90;
      default: return 30;
    }
  });
  const [showComparison, setShowComparison] = useState(false);
  const [showPrediction, setShowPrediction] = useState(false);
  const [loading, setLoading] = useState(false);
  const [activeMetric, setActiveMetric] = useState<string>(propActiveMetric || selectedMetrics[0] || "ggr");

  // Синхронизация с пропсами
  useEffect(() => {
    if (propActiveMetric && propActiveMetric !== activeMetric) {
      setActiveMetric(propActiveMetric);
    }
  }, [propActiveMetric]);

  useEffect(() => {
    const newRange = timeRange === 'week' ? 7 : 
                    timeRange === 'month' ? 30 : 
                    timeRange === 'quarter' ? 90 : 30;
    setDateRange(newRange);
  }, [timeRange]);

  // Получаем изображение графика и статистику
  const chartImage = useMemo(() => {
    return getChartImage(selectedMetrics, chartType, dateRange);
  }, [selectedMetrics, chartType, dateRange]);

  const stats = useMemo(() => {
    return getMockStats(selectedMetrics, dateRange);
  }, [selectedMetrics, dateRange]);

  // Имитация загрузки при изменении параметров
  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => setLoading(false), 500);
    return () => clearTimeout(timer);
  }, [selectedMetrics, chartType, dateRange]);

  const handleMetricClick = (metric: string) => {
    setActiveMetric(metric);
    if (onMetricClick) {
      onMetricClick(metric);
    }
  };

  // Находим активную метрику
  const activeMetricData = stats.find(s => s.metric === activeMetric) || stats[0];

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg">График метрик</CardTitle>
            <p className="text-sm text-muted-foreground mt-1">
              Визуализация выбранных показателей
            </p>
          </div>
          <div className="flex items-center gap-2">
            {/* Период времени */}
            <Select value={dateRange.toString()} onValueChange={(v) => setDateRange(parseInt(v))}>
              <SelectTrigger className="w-[120px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7">7 дней</SelectItem>
                <SelectItem value="30">30 дней</SelectItem>
                <SelectItem value="90">90 дней</SelectItem>
              </SelectContent>
            </Select>

            {/* Тип графика */}
            <div className="flex gap-1 border rounded-lg p-1">
              <Button
                variant={chartType === 'line' ? 'default' : 'ghost'}
                size="icon"
                className="h-7 w-7"
                onClick={() => setChartType('line')}
              >
                <LineChartIcon className="h-4 w-4" />
              </Button>
              <Button
                variant={chartType === 'bar' ? 'default' : 'ghost'}
                size="icon"
                className="h-7 w-7"
                onClick={() => setChartType('bar')}
              >
                <BarChart2 className="h-4 w-4" />
              </Button>
              <Button
                variant={chartType === 'composed' ? 'default' : 'ghost'}
                size="icon"
                className="h-7 w-7"
                onClick={() => setChartType('composed')}
              >
                <Settings2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {/* Селектор метрик */}
        <div className="flex gap-2 mb-4 flex-wrap">
          {selectedMetrics.map(metric => {
            const config = metricsConfig[metric];
            if (!config) return null;
            
            return (
              <button
                key={metric}
                onClick={() => handleMetricClick(metric)}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                  activeMetric === metric
                    ? "bg-primary text-primary-foreground shadow-md"
                    : "bg-muted hover:bg-muted/80"
                }`}
              >
                {config.name}
              </button>
            );
          })}
        </div>

        {/* Опции отображения */}
        <div className="flex gap-4 mb-4">
          <div className="flex items-center space-x-2">
            <Switch 
              id="comparison" 
              checked={showComparison}
              onCheckedChange={setShowComparison}
            />
            <Label htmlFor="comparison" className="text-sm">
              Сравнение с прошлым периодом
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <Switch 
              id="prediction" 
              checked={showPrediction}
              onCheckedChange={setShowPrediction}
            />
            <Label htmlFor="prediction" className="text-sm">
              Показать прогноз
            </Label>
          </div>
        </div>

        {/* График - статичное изображение */}
        {loading ? (
          <div className="h-[400px] flex items-center justify-center bg-gray-50 rounded-lg">
            <div className="animate-pulse text-muted-foreground">Загрузка данных...</div>
          </div>
        ) : (
          <div className="relative h-[400px] bg-gray-50 rounded-lg overflow-hidden border">
            <img 
              src={chartImage}
              alt="Metrics Chart"
              className="w-full h-full object-contain"
              style={{ imageRendering: 'crisp-edges' }}
            />
            {/* Оверлей с опциями */}
            {showComparison && (
              <div className="absolute top-2 left-2 bg-white/90 px-2 py-1 rounded shadow-sm">
                <Badge variant="outline" className="text-xs">
                  Сравнение включено
                </Badge>
              </div>
            )}
            {showPrediction && (
              <div className="absolute top-2 right-2 bg-white/90 px-2 py-1 rounded shadow-sm">
                <Badge variant="outline" className="text-xs">
                  Прогноз включен
                </Badge>
              </div>
            )}
          </div>
        )}

        {/* Статистика по метрикам */}
        <div className="mt-4 grid gap-3 md:grid-cols-3 lg:grid-cols-5">
          {stats.map((stat) => (
            <div 
              key={stat.metric}
              className={`p-3 rounded-lg border transition-all cursor-pointer ${
                activeMetric === stat.metric 
                  ? 'bg-primary/5 border-primary' 
                  : 'bg-muted/30 hover:bg-muted/50'
              }`}
              onClick={() => handleMetricClick(stat.metric)}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-medium text-muted-foreground">
                  {stat.name}
                </span>
                <div className="flex items-center gap-0.5">
                  {stat.change > 0 ? (
                    <TrendingUp className="h-3 w-3 text-green-500" />
                  ) : stat.change < 0 ? (
                    <TrendingDown className="h-3 w-3 text-red-500" />
                  ) : (
                    <Minus className="h-3 w-3 text-gray-500" />
                  )}
                  <span className={`text-xs font-medium ${
                    stat.change > 0 ? 'text-green-600' : 
                    stat.change < 0 ? 'text-red-600' : 
                    'text-gray-600'
                  }`}>
                    {stat.change > 0 ? '+' : ''}{stat.change.toFixed(1)}%
                  </span>
                </div>
              </div>
              <div className="text-lg font-bold" style={{ color: stat.color }}>
                {stat.value.toLocaleString()}{stat.unit}
              </div>
            </div>
          ))}
        </div>

        {/* Детали активной метрики */}
        {activeMetricData && (
          <div className="mt-4 p-4 bg-muted/30 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">{activeMetricData.name}</p>
                <p className="text-xs text-muted-foreground">Текущее значение за последние {dateRange} дней</p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold" style={{ color: activeMetricData.color }}>
                  {activeMetricData.value.toLocaleString()}{activeMetricData.unit}
                </p>
                <div className="flex items-center gap-1 justify-end mt-1">
                  {activeMetricData.change > 0 ? (
                    <TrendingUp className="h-4 w-4 text-green-500" />
                  ) : activeMetricData.change < 0 ? (
                    <TrendingDown className="h-4 w-4 text-red-500" />
                  ) : (
                    <Minus className="h-4 w-4 text-gray-500" />
                  )}
                  <span className={`text-sm font-medium ${
                    activeMetricData.change > 0 ? 'text-green-600' : 
                    activeMetricData.change < 0 ? 'text-red-600' : 
                    'text-gray-600'
                  }`}>
                    {activeMetricData.change > 0 ? '+' : ''}{activeMetricData.change.toFixed(1)}%
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}