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
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from "@/components/ui/chart";
import { analyticsChartsData } from "@/lib/mock-data";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";


const chartConfig = {
  value: {
    label: "Value",
    color: "hsl(var(--primary))",
  },
};

export function AnalyticsCharts() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Динамика метрик</CardTitle>
        <CardDescription>
          Динамика ключевых метрик по выбранным CRM-сценариям, каналам или
          сегментам.
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
                <ChartContainer config={chartConfig} className="h-[320px] w-full">
                  {chart.type === 'line' && (
                      <LineChart data={chart.data} margin={{ top: 5, right: 20, left: -10, bottom: 0 }}>
                          <XAxis dataKey="date" tickLine={false} axisLine={false} tickMargin={8} />
                          <YAxis tickLine={false} axisLine={false} tickMargin={8} />
                          <Tooltip content={<ChartTooltipContent />} />
                          <Legend content={<ChartLegendContent />} />
                          <Line type="monotone" dataKey="value" stroke="var(--color-value)" strokeWidth={2} dot={false} />
                      </LineChart>
                  )}
                  {chart.type === 'area' && (
                      <AreaChart data={chart.data} margin={{ top: 5, right: 20, left: -10, bottom: 0 }}>
                          <defs>
                              <linearGradient id="fillValue" x1="0" y1="0" x2="0" y2="1">
                                  <stop offset="5%" stopColor="var(--color-value)" stopOpacity={0.8}/>
                                  <stop offset="95%" stopColor="var(--color-value)" stopOpacity={0.1}/>
                              </linearGradient>
                          </defs>
                          <XAxis dataKey="date" tickLine={false} axisLine={false} tickMargin={8} />
                          <YAxis tickLine={false} axisLine={false} tickMargin={8} />
                          <Tooltip content={<ChartTooltipContent />} />
                          <Legend content={<ChartLegendContent />} />
                          <Area type="monotone" dataKey="value" stroke="var(--color-value)" fill="url(#fillValue)" strokeWidth={2} />
                      </AreaChart>
                  )}
                </ChartContainer>
              </TabsContent>
            ))}
          </div>
        </Tabs>
      </CardContent>
    </Card>
  );
}
