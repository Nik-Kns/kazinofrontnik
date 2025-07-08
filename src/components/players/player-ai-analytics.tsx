"use client";

import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent, ChartLegend, ChartLegendContent } from "@/components/ui/chart";
import { Area, AreaChart, Bar, BarChart, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from "recharts";

const chartConfig = {
  value: {
    label: "Value",
    color: "hsl(var(--primary))",
  },
};

export function PlayerAiAnalytics({ charts }: { charts: any[] }) {
    return (
         <div className="grid gap-6 md:grid-cols-2">
            {charts.map((chart) => (
              <Card key={chart.title}>
                <CardHeader>
                  <CardTitle>{chart.title}</CardTitle>
                </CardHeader>
                <CardContent>
                    <ChartContainer config={chartConfig} className="h-[250px] w-full">
                        {chart.type === 'bar' && (
                             <BarChart data={chart.data} margin={{ top: 5, right: 20, left: -10, bottom: 0 }}>
                                <XAxis dataKey="date" tickLine={false} axisLine={false} tickMargin={8} />
                                <YAxis tickLine={false} axisLine={false} tickMargin={8} />
                                <Tooltip content={<ChartTooltipContent />} />
                                <Bar dataKey="value" fill="var(--color-value)" radius={4} />
                            </BarChart>
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
                                <Area type="monotone" dataKey="value" stroke="var(--color-value)" fill="url(#fillValue)" strokeWidth={2} />
                            </AreaChart>
                        )}
                    </ChartContainer>
                </CardContent>
              </Card>
            ))}
        </div>
    );
}
