"use client";

import * as React from "react";
import {
  Area,
  AreaChart,
  Line,
  LineChart,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from "@/components/ui/chart";
import { analyticsChartsData } from "@/lib/mock-data";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { explainMetricPrediction } from "@/ai/flows/explain-metric-prediction";
import { Skeleton } from "../ui/skeleton";
import { Bot } from "lucide-react";


const chartConfig = {
  value: {
    label: "Value",
    color: "hsl(var(--primary))",
  },
  predictedValue: {
    label: "Predicted",
    color: "hsl(var(--primary))",
  },
};

export function AnalyticsCharts() {
  const [isPredictionDialogOpen, setIsPredictionDialogOpen] = React.useState(false);
  const [predictionExplanation, setPredictionExplanation] = React.useState('');
  const [isExplanationLoading, setIsExplanationLoading] = React.useState(false);

  const handleChartClick = async (metricName: string, data: any) => {
    // A simplified example. In a real app, you'd pass more context from the clicked data point.
    const lastActualPoint = data.slice().reverse().find((p: any) => p.value !== null);
    const firstPredictedPoint = data.find((p: any) => p.predictedValue !== null);

    if (!lastActualPoint || !firstPredictedPoint) return;

    setIsPredictionDialogOpen(true);
    setIsExplanationLoading(true);
    setPredictionExplanation('');

    try {
        const response = await explainMetricPrediction({
            metricName: metricName,
            currentValue: `${lastActualPoint.value}%`,
            predictedValue: `${firstPredictedPoint.predictedValue}%`,
            timePeriod: 'next 7 days'
        });
        setPredictionExplanation(response.explanation);
    } catch (error) {
        console.error(error);
        setPredictionExplanation('Не удалось загрузить объяснение. Пожалуйста, попробуйте еще раз.');
    } finally {
        setIsExplanationLoading(false);
    }
  };


  return (
    <>
    <Card>
      <CardHeader>
        <CardTitle>Динамика метрик</CardTitle>
        <CardDescription>
          Динамика ключевых метрик по выбранным CRM-сценариям, каналам или
          сегментам. Кликните на график для получения AI-прогноза.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue={analyticsChartsData[0].title}>
          <div className="flex flex-wrap items-center justify-between gap-4">
            <TabsList>
                {analyticsChartsData.map((chart) => (
                    <TabsTrigger key={chart.title} value={chart.title}>
                        <chart.icon className="h-4 w-4 mr-2" />
                        {chart.title}
                    </TabsTrigger>
                ))}
            </TabsList>
            <div className="flex items-center gap-2">
              <Select defaultValue="all">
                  <SelectTrigger className="w-[200px]">
                      <SelectValue placeholder="Все сценарии" />
                  </SelectTrigger>
                  <SelectContent>
                      <SelectItem value="all">Все сценарии</SelectItem>
                      <SelectItem value="welcome">Welcome Chain</SelectItem>
                      <SelectItem value="churn">Churn Reactivation</SelectItem>
                  </SelectContent>
              </Select>
               <Select defaultValue="all">
                  <SelectTrigger className="w-[200px]">
                      <SelectValue placeholder="Все сегменты" />
                  </SelectTrigger>
                  <SelectContent>
                      <SelectItem value="all">Все сегменты</SelectItem>
                      <SelectItem value="new">Новички</SelectItem>
                      <SelectItem value="vip">VIP-игроки</SelectItem>
                      <SelectItem value="churn-risk">Риск оттока</SelectItem>
                  </SelectContent>
              </Select>
            </div>
          </div>
          <div className="mt-6">
            {analyticsChartsData.map((chart) => (
              <TabsContent key={chart.title} value={chart.title}>
                <div className="cursor-pointer" onClick={() => handleChartClick(chart.title, chart.data)}>
                  <ChartContainer config={chartConfig} className="h-[320px] w-full">
                    {chart.type === 'line' ? (
                      <LineChart data={chart.data} margin={{ top: 5, right: 20, left: -10, bottom: 0 }}>
                        <XAxis dataKey="date" tickLine={false} axisLine={false} tickMargin={8} />
                        <YAxis tickLine={false} axisLine={false} tickMargin={8} />
                        <Tooltip content={<ChartTooltipContent />} />
                        <Legend content={<ChartLegendContent />} />
                        <Line type="monotone" dataKey="value" stroke="var(--color-value)" strokeWidth={2} dot={false} name="Actual" />
                        <Line type="monotone" dataKey="predictedValue" stroke="var(--color-predictedValue)" strokeWidth={2} strokeDasharray="5 5" dot={false} name="Predicted" />
                      </LineChart>
                    ) : (
                      <AreaChart data={chart.data} margin={{ top: 5, right: 20, left: -10, bottom: 0 }}>
                        <defs>
                          <linearGradient id="fillValue" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="var(--color-value)" stopOpacity={0.8} />
                            <stop offset="95%" stopColor="var(--color-value)" stopOpacity={0.1} />
                          </linearGradient>
                        </defs>
                        <XAxis dataKey="date" tickLine={false} axisLine={false} tickMargin={8} />
                        <YAxis tickLine={false} axisLine={false} tickMargin={8} />
                        <Tooltip content={<ChartTooltipContent />} />
                        <Legend content={<ChartLegendContent />} />
                        <Area type="monotone" dataKey="value" stroke="var(--color-value)" fill="url(#fillValue)" strokeWidth={2} name="Actual" />
                        <Line type="monotone" dataKey="predictedValue" stroke="var(--color-predictedValue)" strokeWidth={2} strokeDasharray="5 5" dot={false} name="Predicted" />
                      </AreaChart>
                    )}
                  </ChartContainer>
                </div>
              </TabsContent>
            ))}
          </div>
        </Tabs>
      </CardContent>
    </Card>
    <Dialog open={isPredictionDialogOpen} onOpenChange={setIsPredictionDialogOpen}>
      <DialogContent>
          <DialogHeader>
              <DialogTitle className="flex items-center gap-2"><Bot className="h-5 w-5 text-primary"/>AI-прогноз</DialogTitle>
              <DialogDescription>Основания для прогноза по выбранной метрике.</DialogDescription>
          </DialogHeader>
          <div className="py-4">
            {isExplanationLoading ? (
                <div className="space-y-2">
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-1/2" />
                </div>
            ) : (
              <p className="text-sm">{predictionExplanation}</p>
            )}
          </div>
      </DialogContent>
    </Dialog>
    </>
  );
}
