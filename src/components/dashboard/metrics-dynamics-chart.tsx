"use client";

import { useEffect, useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { TrendingUp, TrendingDown, Minus, Calendar } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { format } from "date-fns";
import { ru } from "date-fns/locale";

interface MetricData {
  date: string;
  value: number;
}

interface MetricConfig {
  key: string;
  name: string;
  color: string;
  format: (value: number) => string;
}

const metricsConfig: MetricConfig[] = [
  { key: "ggr", name: "GGR", color: "#2962FF", format: (v) => `€${v.toLocaleString()}` },
  { key: "arpu", name: "ARPU", color: "#9C27B0", format: (v) => `€${v.toFixed(2)}` },
  { key: "ltv", name: "LTV", color: "#FF6F00", format: (v) => `€${v.toLocaleString()}` },
  { key: "dau", name: "DAU", color: "#00BCD4", format: (v) => v.toLocaleString() },
  { key: "mau", name: "MAU", color: "#E91E63", format: (v) => v.toLocaleString() },
  { key: "retention1", name: "Retention 1d", color: "#4CAF50", format: (v) => `${v.toFixed(1)}%` },
  { key: "retention7", name: "Retention 7d", color: "#FFC107", format: (v) => `${v.toFixed(1)}%` },
];

// Фиксированные моковые данные для каждой метрики
const fixedMockData: Record<string, Record<number, MetricData[]>> = {
  ggr: {
    7: [
      { date: "01.01", value: 110000 },
      { date: "02.01", value: 115000 },
      { date: "03.01", value: 108000 },
      { date: "04.01", value: 122000 },
      { date: "05.01", value: 130000 },
      { date: "06.01", value: 135000 },
      { date: "07.01", value: 142000 },
    ],
    30: [
      { date: "01.12", value: 95000 },
      { date: "05.12", value: 98000 },
      { date: "10.12", value: 102000 },
      { date: "15.12", value: 108000 },
      { date: "20.12", value: 115000 },
      { date: "25.12", value: 125000 },
      { date: "30.12", value: 142000 },
    ],
    90: [
      { date: "01.10", value: 75000 },
      { date: "15.10", value: 82000 },
      { date: "01.11", value: 90000 },
      { date: "15.11", value: 98000 },
      { date: "01.12", value: 110000 },
      { date: "15.12", value: 125000 },
      { date: "30.12", value: 142000 },
    ],
  },
  arpu: {
    7: [
      { date: "01.01", value: 105 },
      { date: "02.01", value: 110 },
      { date: "03.01", value: 108 },
      { date: "04.01", value: 115 },
      { date: "05.01", value: 120 },
      { date: "06.01", value: 125 },
      { date: "07.01", value: 135 },
    ],
    30: [
      { date: "01.12", value: 95 },
      { date: "05.12", value: 100 },
      { date: "10.12", value: 105 },
      { date: "15.12", value: 110 },
      { date: "20.12", value: 120 },
      { date: "25.12", value: 128 },
      { date: "30.12", value: 135 },
    ],
    90: [
      { date: "01.10", value: 85 },
      { date: "15.10", value: 90 },
      { date: "01.11", value: 95 },
      { date: "15.11", value: 105 },
      { date: "01.12", value: 115 },
      { date: "15.12", value: 125 },
      { date: "30.12", value: 135 },
    ],
  },
  ltv: {
    7: [
      { date: "01.01", value: 380 },
      { date: "02.01", value: 390 },
      { date: "03.01", value: 385 },
      { date: "04.01", value: 410 },
      { date: "05.01", value: 430 },
      { date: "06.01", value: 450 },
      { date: "07.01", value: 480 },
    ],
    30: [
      { date: "01.12", value: 350 },
      { date: "05.12", value: 365 },
      { date: "10.12", value: 380 },
      { date: "15.12", value: 400 },
      { date: "20.12", value: 425 },
      { date: "25.12", value: 450 },
      { date: "30.12", value: 480 },
    ],
    90: [
      { date: "01.10", value: 320 },
      { date: "15.10", value: 340 },
      { date: "01.11", value: 370 },
      { date: "15.11", value: 400 },
      { date: "01.12", value: 430 },
      { date: "15.12", value: 455 },
      { date: "30.12", value: 480 },
    ],
  },
  dau: {
    7: [
      { date: "01.01", value: 2200 },
      { date: "02.01", value: 2350 },
      { date: "03.01", value: 2280 },
      { date: "04.01", value: 2450 },
      { date: "05.01", value: 2550 },
      { date: "06.01", value: 2680 },
      { date: "07.01", value: 2850 },
    ],
    30: [
      { date: "01.12", value: 1900 },
      { date: "05.12", value: 2000 },
      { date: "10.12", value: 2150 },
      { date: "15.12", value: 2300 },
      { date: "20.12", value: 2500 },
      { date: "25.12", value: 2700 },
      { date: "30.12", value: 2850 },
    ],
    90: [
      { date: "01.10", value: 1500 },
      { date: "15.10", value: 1700 },
      { date: "01.11", value: 1950 },
      { date: "15.11", value: 2200 },
      { date: "01.12", value: 2450 },
      { date: "15.12", value: 2650 },
      { date: "30.12", value: 2850 },
    ],
  },
  mau: {
    7: [
      { date: "01.01", value: 42000 },
      { date: "02.01", value: 42500 },
      { date: "03.01", value: 43000 },
      { date: "04.01", value: 44000 },
      { date: "05.01", value: 45000 },
      { date: "06.01", value: 46500 },
      { date: "07.01", value: 48000 },
    ],
    30: [
      { date: "01.12", value: 38000 },
      { date: "05.12", value: 39500 },
      { date: "10.12", value: 41000 },
      { date: "15.12", value: 42500 },
      { date: "20.12", value: 44500 },
      { date: "25.12", value: 46000 },
      { date: "30.12", value: 48000 },
    ],
    90: [
      { date: "01.10", value: 32000 },
      { date: "15.10", value: 34500 },
      { date: "01.11", value: 37000 },
      { date: "15.11", value: 40000 },
      { date: "01.12", value: 43000 },
      { date: "15.12", value: 45500 },
      { date: "30.12", value: 48000 },
    ],
  },
  retention1: {
    7: [
      { date: "01.01", value: 38 },
      { date: "02.01", value: 40 },
      { date: "03.01", value: 39 },
      { date: "04.01", value: 42 },
      { date: "05.01", value: 44 },
      { date: "06.01", value: 46 },
      { date: "07.01", value: 48.5 },
    ],
    30: [
      { date: "01.12", value: 35 },
      { date: "05.12", value: 36.5 },
      { date: "10.12", value: 38 },
      { date: "15.12", value: 40 },
      { date: "20.12", value: 43 },
      { date: "25.12", value: 45.5 },
      { date: "30.12", value: 48.5 },
    ],
    90: [
      { date: "01.10", value: 32 },
      { date: "15.10", value: 34 },
      { date: "01.11", value: 36.5 },
      { date: "15.11", value: 39 },
      { date: "01.12", value: 42 },
      { date: "15.12", value: 45 },
      { date: "30.12", value: 48.5 },
    ],
  },
  retention7: {
    7: [
      { date: "01.01", value: 20 },
      { date: "02.01", value: 21 },
      { date: "03.01", value: 20.5 },
      { date: "04.01", value: 22 },
      { date: "05.01", value: 23.5 },
      { date: "06.01", value: 25 },
      { date: "07.01", value: 27 },
    ],
    30: [
      { date: "01.12", value: 18 },
      { date: "05.12", value: 19 },
      { date: "10.12", value: 20 },
      { date: "15.12", value: 21.5 },
      { date: "20.12", value: 23 },
      { date: "25.12", value: 25 },
      { date: "30.12", value: 27 },
    ],
    90: [
      { date: "01.10", value: 15 },
      { date: "15.10", value: 16.5 },
      { date: "01.11", value: 18 },
      { date: "15.11", value: 20 },
      { date: "01.12", value: 22.5 },
      { date: "15.12", value: 24.5 },
      { date: "30.12", value: 27 },
    ],
  },
};

// Получаем фиксированные данные для метрики и периода
const getFixedMockData = (metricKey: string, days: number): MetricData[] => {
  const metricData = fixedMockData[metricKey];
  if (!metricData) return [];
  
  // Выбираем ближайший доступный период
  if (days <= 7) return metricData[7] || [];
  if (days <= 30) return metricData[30] || [];
  return metricData[90] || [];
};

interface MetricsDynamicsChartProps {
  selectedMetrics: string[];
  dateRange?: number; // Количество дней для отображения
  activeMetric?: string;
  onMetricClick?: (metricKey: string) => void;
}

export function MetricsDynamicsChart({ 
  selectedMetrics = ["ggr", "arpu"],
  dateRange: propDateRange = 30,
  activeMetric: propActiveMetric,
  onMetricClick 
}: MetricsDynamicsChartProps) {
  const [activeMetric, setActiveMetric] = useState<string>(propActiveMetric || selectedMetrics[0] || "ggr");
  const [chartData, setChartData] = useState<MetricData[]>([]);
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState<number>(propDateRange);

  useEffect(() => {
    // Синхронизируем с пропсом activeMetric
    if (propActiveMetric && propActiveMetric !== activeMetric) {
      setActiveMetric(propActiveMetric);
    }
  }, [propActiveMetric]);

  // Мемоизируем получение фиксированных данных
  const memoizedChartData = useMemo(() => {
    return getFixedMockData(activeMetric, dateRange);
  }, [activeMetric, dateRange]);

  useEffect(() => {
    // Обновляем состояние только при изменении данных
    setLoading(true);
    setChartData(memoizedChartData);
    const timer = setTimeout(() => setLoading(false), 300); // Имитация загрузки
    return () => clearTimeout(timer);
  }, [memoizedChartData]);

  const handleMetricClick = (metricKey: string) => {
    setActiveMetric(metricKey);
    if (onMetricClick) {
      onMetricClick(metricKey);
    }
  };

  const activeConfig = metricsConfig.find(m => m.key === activeMetric) || metricsConfig[0];
  
  // Мемоизируем вычисление изменений для предотвращения лишних пересчетов
  const change = useMemo(() => {
    if (chartData.length < 2) return { value: 0, percentage: 0 };
    const first = chartData[0].value;
    const last = chartData[chartData.length - 1].value;
    const changeValue = last - first;
    const percentage = (changeValue / first) * 100;
    return { value: changeValue, percentage };
  }, [chartData]);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg">Динамика метрик</CardTitle>
            <p className="text-sm text-muted-foreground mt-1">
              Кликните на метрику для просмотра её динамики
            </p>
          </div>
          <div className="flex items-center gap-4">
            {/* Фильтр по времени */}
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <Select 
                value={dateRange.toString()} 
                onValueChange={(value) => setDateRange(parseInt(value))}
              >
                <SelectTrigger className="w-[120px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="7">7 дней</SelectItem>
                  <SelectItem value="30">30 дней</SelectItem>
                  <SelectItem value="90">90 дней</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="text-right">
              <p className="text-sm text-muted-foreground">Изменение</p>
              <div className="flex items-center gap-1">
                {change.percentage > 0 ? (
                  <TrendingUp className="h-4 w-4 text-green-500" />
                ) : change.percentage < 0 ? (
                  <TrendingDown className="h-4 w-4 text-red-500" />
                ) : (
                  <Minus className="h-4 w-4 text-gray-500" />
                )}
                <span className={`text-lg font-bold ${
                  change.percentage > 0 ? "text-green-600" : 
                  change.percentage < 0 ? "text-red-600" : 
                  "text-gray-600"
                }`}>
                  {change.percentage > 0 ? "+" : ""}{change.percentage.toFixed(1)}%
                </span>
              </div>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {/* Селектор метрик */}
        <div className="flex gap-2 mb-4 flex-wrap">
          {selectedMetrics.map(metricKey => {
            const config = metricsConfig.find(m => m.key === metricKey);
            if (!config) return null;
            
            return (
              <button
                key={metricKey}
                onClick={() => handleMetricClick(metricKey)}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                  activeMetric === metricKey
                    ? "bg-primary text-primary-foreground shadow-md"
                    : "bg-muted hover:bg-muted/80"
                }`}
              >
                {config.name}
              </button>
            );
          })}
        </div>

        {/* График */}
        {loading ? (
          <div className="h-[300px] flex items-center justify-center">
            <div className="animate-pulse text-muted-foreground">Загрузка данных...</div>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
              <XAxis 
                dataKey="date"
                tick={{ fontSize: 12 }}
                interval="preserveStartEnd"
              />
              <YAxis 
                tick={{ fontSize: 12 }}
                tickFormatter={(value) => {
                  if (value >= 1000000) return `${(value / 1000000).toFixed(1)}M`;
                  if (value >= 1000) return `${(value / 1000).toFixed(0)}k`;
                  return value.toFixed(0);
                }}
              />
              <Tooltip
                formatter={(value: number) => activeConfig.format(value)}
                labelFormatter={(label) => `Дата: ${label}`}
                contentStyle={{
                  backgroundColor: "rgba(255, 255, 255, 0.95)",
                  border: "1px solid #e2e8f0",
                  borderRadius: "8px",
                }}
              />
              <Line
                type="monotone"
                dataKey="value"
                stroke={activeConfig.color}
                strokeWidth={2}
                dot={{ r: 3 }}
                activeDot={{ r: 5 }}
                name={activeConfig.name}
              />
            </LineChart>
          </ResponsiveContainer>
        )}

        {/* Легенда с текущими значениями */}
        <div className="mt-4 p-3 bg-muted/30 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium">{activeConfig.name}</p>
              <p className="text-xs text-muted-foreground">Последнее значение</p>
            </div>
            <div className="text-right">
              <p className="text-lg font-bold" style={{ color: activeConfig.color }}>
                {chartData.length > 0 ? activeConfig.format(chartData[chartData.length - 1].value) : "—"}
              </p>
              <p className="text-xs text-muted-foreground">
                {chartData.length > 0 ? `за ${chartData[chartData.length - 1].date}` : ""}
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}