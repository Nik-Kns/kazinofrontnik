/**
 * Компонент сравнения бонусов с графиком
 * Позволяет сравнивать до 3 бонусов по выбранным показателям
 */

"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { X, Settings } from "lucide-react";
import { Bonus } from "@/lib/types/bonuses";
import { generateBonusKPI, generateTimeSeries } from "@/lib/mock-bonuses-data";

interface BonusComparisonProps {
  bonuses: Bonus[];
  onClose?: () => void;
}

// Доступные метрики для сравнения
const METRICS = [
  { id: "completion_rate", name: "Completion Rate", unit: "%" },
  { id: "net_roi", name: "Net ROI", unit: "" },
  { id: "abuse_rate", name: "Abuse Rate", unit: "%" },
  { id: "deposit_uplift", name: "Deposit Uplift", unit: "%" },
  { id: "take_up_rate", name: "Take-up Rate", unit: "%" },
  { id: "wagering_progress", name: "Wagering Progress", unit: "%" },
];

// Цвета для бонусов
const BONUS_COLORS = ["#3b82f6", "#8b5cf6", "#10b981"];

export function BonusComparison({ bonuses, onClose }: BonusComparisonProps) {
  const [selectedMetrics, setSelectedMetrics] = useState<string[]>(["completion_rate", "net_roi"]);

  // Обработка выбора метрик
  const toggleMetric = (metricId: string) => {
    setSelectedMetrics((prev) => {
      if (prev.includes(metricId)) {
        return prev.filter((id) => id !== metricId);
      }
      return [...prev, metricId];
    });
  };

  // Получение данных для графика
  const getChartData = () => {
    // Используем временные ряды первого бонуса как базу для дат
    const timeseries = generateTimeSeries(30);

    return timeseries.map((point, index) => {
      const dataPoint: any = {
        date: point.date,
      };

      // Добавляем данные по каждому бонусу
      bonuses.forEach((bonus, bonusIndex) => {
        const bonusTimeseries = generateTimeSeries(30);
        selectedMetrics.forEach((metricId) => {
          const value = bonusTimeseries[index]?.[metricId as keyof typeof bonusTimeseries[0]];
          if (value !== undefined) {
            dataPoint[`${bonus.id}_${metricId}`] = value;
          }
        });
      });

      return dataPoint;
    });
  };

  // Получение KPI для таблицы сравнения
  const bonusesKPI = bonuses.map((bonus) => ({
    bonus,
    kpi: generateBonusKPI(bonus.id, bonus.type),
  }));

  const chartData = getChartData();

  return (
    <div className="space-y-4">
      {/* Хедер */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">
            Сравнение бонусов ({bonuses.length})
          </h3>
          <p className="text-sm text-muted-foreground">
            Сравните до 3 бонусов по ключевым показателям
          </p>
        </div>
        <div className="flex items-center gap-2">
          {/* Выбор показателей */}
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" size="sm">
                <Settings className="h-4 w-4 mr-2" />
                Показатели ({selectedMetrics.length})
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80">
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium mb-3">Выберите показатели</h4>
                  <div className="space-y-2">
                    {METRICS.map((metric) => (
                      <div key={metric.id} className="flex items-center space-x-2">
                        <Checkbox
                          id={metric.id}
                          checked={selectedMetrics.includes(metric.id)}
                          onCheckedChange={() => toggleMetric(metric.id)}
                        />
                        <Label htmlFor={metric.id} className="cursor-pointer">
                          {metric.name}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </PopoverContent>
          </Popover>

          {onClose && (
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>

      {/* График */}
      <Card>
        <CardHeader>
          <CardTitle>Динамика показателей</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              {bonuses.map((bonus, index) => (
                selectedMetrics.map((metricId) => {
                  const metric = METRICS.find((m) => m.id === metricId);
                  return (
                    <Line
                      key={`${bonus.id}_${metricId}`}
                      type="monotone"
                      dataKey={`${bonus.id}_${metricId}`}
                      stroke={BONUS_COLORS[index]}
                      strokeWidth={2}
                      name={`${bonus.name} - ${metric?.name}`}
                      dot={false}
                      strokeDasharray={metricId === selectedMetrics[0] ? "0" : "5 5"}
                    />
                  );
                })
              ))}
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Таблица сравнения */}
      <Card>
        <CardHeader>
          <CardTitle>Сравнительная таблица KPI</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4 font-medium">Метрика</th>
                  {bonuses.map((bonus, index) => (
                    <th key={bonus.id} className="text-right py-3 px-4 font-medium">
                      <div className="flex items-center justify-end gap-2">
                        <div
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: BONUS_COLORS[index] }}
                        />
                        {bonus.name}
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {/* Completion Rate */}
                <tr className="border-b">
                  <td className="py-3 px-4">Completion Rate</td>
                  {bonusesKPI.map(({ kpi }) => (
                    <td key={`cr_${kpi.bonus_id}`} className="text-right py-3 px-4 font-medium">
                      {kpi.completion_rate.toFixed(1)}%
                    </td>
                  ))}
                </tr>

                {/* Net ROI */}
                <tr className="border-b">
                  <td className="py-3 px-4">Net ROI</td>
                  {bonusesKPI.map(({ kpi }) => (
                    <td key={`roi_${kpi.bonus_id}`} className="text-right py-3 px-4 font-medium">
                      <Badge
                        variant={kpi.bonus_roi_net >= 2 ? "default" : kpi.bonus_roi_net >= 1 ? "secondary" : "destructive"}
                      >
                        {((kpi.bonus_roi_net - 1) * 100).toFixed(0)}%
                      </Badge>
                    </td>
                  ))}
                </tr>

                {/* Deposit Uplift */}
                <tr className="border-b">
                  <td className="py-3 px-4">Deposit Uplift</td>
                  {bonusesKPI.map(({ kpi }) => (
                    <td key={`uplift_${kpi.bonus_id}`} className="text-right py-3 px-4 font-medium text-green-600">
                      +{kpi.deposit_uplift.toFixed(1)}%
                    </td>
                  ))}
                </tr>

                {/* Abuse Rate */}
                <tr className="border-b">
                  <td className="py-3 px-4">Abuse Rate</td>
                  {bonusesKPI.map(({ kpi }) => (
                    <td key={`abuse_${kpi.bonus_id}`} className="text-right py-3 px-4 font-medium">
                      <Badge variant={kpi.abuse_rate < 3 ? "secondary" : "destructive"}>
                        {kpi.abuse_rate.toFixed(1)}%
                      </Badge>
                    </td>
                  ))}
                </tr>

                {/* Take-up Rate */}
                <tr className="border-b">
                  <td className="py-3 px-4">Take-up Rate</td>
                  {bonusesKPI.map(({ kpi }) => (
                    <td key={`takeup_${kpi.bonus_id}`} className="text-right py-3 px-4 font-medium">
                      {kpi.take_up_rate.toFixed(1)}%
                    </td>
                  ))}
                </tr>

                {/* Effective Cost */}
                <tr className="border-b">
                  <td className="py-3 px-4">Effective Cost %</td>
                  {bonusesKPI.map(({ kpi }) => (
                    <td key={`cost_${kpi.bonus_id}`} className="text-right py-3 px-4 font-medium">
                      {kpi.effective_cost_pct.toFixed(1)}%
                    </td>
                  ))}
                </tr>

                {/* Time to Completion */}
                <tr className="border-b">
                  <td className="py-3 px-4">Time to Completion (медиана)</td>
                  {bonusesKPI.map(({ kpi }) => (
                    <td key={`time_${kpi.bonus_id}`} className="text-right py-3 px-4 font-medium">
                      {kpi.time_to_completion_median.toFixed(0)}ч
                    </td>
                  ))}
                </tr>

                {/* Retention Uplift D7 */}
                <tr className="border-b">
                  <td className="py-3 px-4">Retention Uplift D7</td>
                  {bonusesKPI.map(({ kpi }) => (
                    <td key={`ret7_${kpi.bonus_id}`} className="text-right py-3 px-4 font-medium text-green-600">
                      +{kpi.retention_uplift_d7.toFixed(1)}%
                    </td>
                  ))}
                </tr>

                {/* Retention Uplift D30 */}
                <tr>
                  <td className="py-3 px-4">Retention Uplift D30</td>
                  {bonusesKPI.map(({ kpi }) => (
                    <td key={`ret30_${kpi.bonus_id}`} className="text-right py-3 px-4 font-medium text-green-600">
                      +{kpi.retention_uplift_d30.toFixed(1)}%
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
