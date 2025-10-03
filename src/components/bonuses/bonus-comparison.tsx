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
import { X, Settings, Info } from "lucide-react";
import { Bonus } from "@/lib/types/bonuses";
import { generateBonusKPI, generateTimeSeries } from "@/lib/mock-bonuses-data";
import {
  Tooltip as UITooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface BonusComparisonProps {
  bonuses: Bonus[];
  onClose?: () => void;
}

// Доступные метрики для сравнения с описаниями
const METRICS = [
  {
    id: "completion_rate",
    name: "Процент отыгрыша",
    unit: "%",
    description: "Доля игроков, которые полностью отыграли бонус. Показывает, насколько выполнимы условия вейджера."
  },
  {
    id: "net_roi",
    name: "Чистый ROI",
    unit: "",
    description: "Возврат инвестиций с учетом всех затрат на бонус. Показывает реальную прибыльность бонуса."
  },
  {
    id: "abuse_rate",
    name: "Процент злоупотреблений",
    unit: "%",
    description: "Доля игроков, злоупотребляющих бонусом (мультиаккаунты, бонус-хантинг). Риск-индикатор."
  },
  {
    id: "deposit_uplift",
    name: "Прирост депозитов",
    unit: "%",
    description: "На сколько % вырос объем депозитов по сравнению с контрольной группой без бонуса."
  },
  {
    id: "take_up_rate",
    name: "Процент активации",
    unit: "%",
    description: "Доля игроков, активировавших бонус из тех, кто его получил. Показывает привлекательность оффера."
  },
  {
    id: "wagering_progress",
    name: "Прогресс отыгрыша",
    unit: "%",
    description: "Средний прогресс выполнения вейджера среди всех игроков. Помогает понять сложность условий."
  },
];

// Цвета для бонусов
const BONUS_COLORS = ["#3b82f6", "#8b5cf6", "#10b981"];

// Метрики для таблицы с тултипами
const TABLE_METRICS = [
  {
    key: "completion_rate",
    name: "Процент отыгрыша",
    description: "Доля игроков, полностью отыгравших бонус",
    format: (val: number) => `${val.toFixed(1)}%`
  },
  {
    key: "net_roi",
    name: "Чистый ROI",
    description: "Возврат инвестиций с учетом всех затрат",
    format: (val: number) => `${((val - 1) * 100).toFixed(0)}%`,
    badge: true
  },
  {
    key: "deposit_uplift",
    name: "Прирост депозитов",
    description: "Рост депозитов vs контроль",
    format: (val: number) => `+${val.toFixed(1)}%`,
    green: true
  },
  {
    key: "abuse_rate",
    name: "% злоупотреблений",
    description: "Доля игроков с подозрительным поведением",
    format: (val: number) => `${val.toFixed(1)}%`,
    badge: true
  },
  {
    key: "take_up_rate",
    name: "% активации",
    description: "Активировали из получивших",
    format: (val: number) => `${val.toFixed(1)}%`
  },
  {
    key: "effective_cost_pct",
    name: "Эффективная стоимость",
    description: "% от депозитов, потраченный на бонусы",
    format: (val: number) => `${val.toFixed(1)}%`
  },
  {
    key: "time_to_completion_median",
    name: "Время отыгрыша (медиана)",
    description: "Среднее время до полного отыгрыша",
    format: (val: number) => `${val.toFixed(0)}ч`
  },
  {
    key: "retention_uplift_d7",
    name: "Удержание D7",
    description: "Прирост удержания на 7 день",
    format: (val: number) => `+${val.toFixed(1)}%`,
    green: true
  },
  {
    key: "retention_uplift_d30",
    name: "Удержание D30",
    description: "Прирост удержания на 30 день",
    format: (val: number) => `+${val.toFixed(1)}%`,
    green: true
  }
];

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
            <PopoverContent className="w-96">
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium mb-3">Выберите показатели</h4>
                  <TooltipProvider>
                    <div className="space-y-3">
                      {METRICS.map((metric) => (
                        <div key={metric.id} className="flex items-start space-x-2">
                          <Checkbox
                            id={metric.id}
                            checked={selectedMetrics.includes(metric.id)}
                            onCheckedChange={() => toggleMetric(metric.id)}
                            className="mt-1"
                          />
                          <div className="flex-1">
                            <div className="flex items-center gap-1">
                              <Label htmlFor={metric.id} className="cursor-pointer font-medium">
                                {metric.name}
                              </Label>
                              <UITooltip>
                                <TooltipTrigger asChild>
                                  <Info className="h-3 w-3 text-muted-foreground cursor-help" />
                                </TooltipTrigger>
                                <TooltipContent className="max-w-xs">
                                  <p className="text-sm">{metric.description}</p>
                                </TooltipContent>
                              </UITooltip>
                            </div>
                            <p className="text-xs text-muted-foreground mt-0.5">
                              {metric.description}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </TooltipProvider>
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
            <TooltipProvider>
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
                  {TABLE_METRICS.map((metric) => (
                    <tr key={metric.key} className="border-b">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-1">
                          <span>{metric.name}</span>
                          <UITooltip>
                            <TooltipTrigger asChild>
                              <Info className="h-3 w-3 text-muted-foreground cursor-help" />
                            </TooltipTrigger>
                            <TooltipContent>
                              <p className="text-sm">{metric.description}</p>
                            </TooltipContent>
                          </UITooltip>
                        </div>
                      </td>
                      {bonusesKPI.map(({ kpi }) => {
                        const value = kpi[metric.key as keyof typeof kpi] as number;
                        const formatted = metric.format(value);

                        return (
                          <td
                            key={`${metric.key}_${kpi.bonus_id}`}
                            className={`text-right py-3 px-4 font-medium ${metric.green ? 'text-green-600' : ''}`}
                          >
                            {metric.badge ? (
                              <Badge
                                variant={
                                  metric.key === 'net_roi'
                                    ? value >= 2 ? "default" : value >= 1 ? "secondary" : "destructive"
                                    : metric.key === 'abuse_rate'
                                    ? value < 3 ? "secondary" : "destructive"
                                    : "secondary"
                                }
                              >
                                {formatted}
                              </Badge>
                            ) : (
                              formatted
                            )}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </TooltipProvider>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
