"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";
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
  { key: "ngr", name: "NGR", color: "#00C853", format: (v) => `€${v.toLocaleString()}` },
  { key: "arpu", name: "ARPU", color: "#9C27B0", format: (v) => `€${v.toFixed(2)}` },
  { key: "ltv", name: "LTV", color: "#FF6F00", format: (v) => `€${v.toLocaleString()}` },
  { key: "dau", name: "DAU", color: "#00BCD4", format: (v) => v.toLocaleString() },
  { key: "mau", name: "MAU", color: "#E91E63", format: (v) => v.toLocaleString() },
  { key: "retention1", name: "Retention 1d", color: "#4CAF50", format: (v) => `${v.toFixed(1)}%` },
  { key: "retention7", name: "Retention 7d", color: "#FFC107", format: (v) => `${v.toFixed(1)}%` },
];

// Генерируем моковые данные для графика
const generateMockData = (metricKey: string, days: number = 30): MetricData[] => {
  const data: MetricData[] = [];
  const now = new Date();
  
  // Базовые значения для разных метрик
  const baseValues: Record<string, { base: number, variance: number }> = {
    ggr: { base: 125000, variance: 25000 },
    ngr: { base: 100000, variance: 20000 },
    arpu: { base: 125, variance: 30 },
    ltv: { base: 450, variance: 100 },
    dau: { base: 2500, variance: 500 },
    mau: { base: 45000, variance: 5000 },
    retention1: { base: 45, variance: 10 },
    retention7: { base: 25, variance: 8 },
  };
  
  const config = baseValues[metricKey] || { base: 100, variance: 20 };
  
  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);
    
    // Добавляем тренд и случайные колебания
    const trend = (days - i) / days * 0.3; // Растущий тренд
    const randomFactor = Math.random() * 2 - 1; // От -1 до 1
    const value = config.base * (1 + trend) + randomFactor * config.variance;
    
    data.push({
      date: format(date, "dd.MM", { locale: ru }),
      value: Math.max(0, value),
    });
  }
  
  return data;
};

interface MetricsDynamicsChartProps {
  selectedMetrics: string[];
  dateRange?: number; // Количество дней для отображения
  activeMetric?: string;
  onMetricClick?: (metricKey: string) => void;
}

export function MetricsDynamicsChart({ 
  selectedMetrics = ["ggr", "ngr", "arpu"],
  dateRange = 30,
  activeMetric: propActiveMetric,
  onMetricClick 
}: MetricsDynamicsChartProps) {
  const [activeMetric, setActiveMetric] = useState<string>(propActiveMetric || selectedMetrics[0] || "ggr");
  const [chartData, setChartData] = useState<MetricData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Синхронизируем с пропсом activeMetric
    if (propActiveMetric && propActiveMetric !== activeMetric) {
      setActiveMetric(propActiveMetric);
    }
  }, [propActiveMetric]);

  useEffect(() => {
    // Генерируем данные для активной метрики
    setLoading(true);
    const data = generateMockData(activeMetric, dateRange);
    setChartData(data);
    setTimeout(() => setLoading(false), 300); // Имитация загрузки
  }, [activeMetric, dateRange]);

  const handleMetricClick = (metricKey: string) => {
    setActiveMetric(metricKey);
    if (onMetricClick) {
      onMetricClick(metricKey);
    }
  };

  const activeConfig = metricsConfig.find(m => m.key === activeMetric) || metricsConfig[0];
  
  // Вычисляем изменение за период
  const calculateChange = () => {
    if (chartData.length < 2) return { value: 0, percentage: 0 };
    const first = chartData[0].value;
    const last = chartData[chartData.length - 1].value;
    const change = last - first;
    const percentage = (change / first) * 100;
    return { value: change, percentage };
  };

  const change = calculateChange();

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
          <div className="flex items-center gap-2">
            <div className="text-right">
              <p className="text-sm text-muted-foreground">Изменение за период</p>
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