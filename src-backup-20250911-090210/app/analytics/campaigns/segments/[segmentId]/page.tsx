// This page is rendered on the server by default; we don't need client features here

import * as React from "react";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, Users, BarChart3, TrendingUp, Target, Calendar } from "lucide-react";
import { segmentAnalyticsData } from "@/lib/campaign-analytics-data";
import { segmentsData } from "@/lib/mock-data";

export default async function SegmentAnalyticsPage({ params }: { params: Promise<{ segmentId: string }> }) {
  const { segmentId } = await params;
  const segment = segmentsData.find(s => s.id === segmentId);
  const analytics = segmentAnalyticsData; // In real app, would fetch based on segmentId

  if (!segment) {
    return (
      <div className="container mx-auto py-6">
        <Card>
          <CardContent className="py-8 text-center">
            <h3 className="text-lg font-semibold mb-2">Сегмент не найден</h3>
            <p className="text-muted-foreground mb-4">
              Сегмент с ID {segmentId} не существует
            </p>
            <Link href="/analytics/campaigns/segments">
              <Button>Вернуться к списку</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/analytics/campaigns/segments">
          <Button variant="outline" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            К списку сегментов
          </Button>
        </Link>
        <div className="flex-1">
          <h1 className="text-3xl font-bold tracking-tight">{segment.name}</h1>
          <p className="text-muted-foreground">{segment.description}</p>
        </div>
      </div>

      {/* Segment Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Обзор сегмента
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Игроков в сегменте</p>
              <p className="text-2xl font-bold">{analytics.totalUsers.toLocaleString()}</p>
            </div>
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Источник</p>
              <Badge variant="outline">{segment.createdBy}</Badge>
            </div>
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">ID сегмента</p>
              <Badge variant="secondary">{segment.id}</Badge>
            </div>
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Создан</p>
              <p className="text-sm">{new Date(segment.createdAt).toLocaleDateString('ru-RU')}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Analytics Tabs */}
      <Tabs defaultValue="kpis" className="space-y-6">
        <TabsList>
          <TabsTrigger value="kpis">KPI метрики</TabsTrigger>
          <TabsTrigger value="funnels">Воронки</TabsTrigger>
          <TabsTrigger value="cohorts">Когорты</TabsTrigger>
          <TabsTrigger value="comparison">Сравнение</TabsTrigger>
        </TabsList>

        <TabsContent value="kpis" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Ключевые метрики сегмента</CardTitle>
              <CardDescription>
                Производительность сегмента за выбранный период
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {analytics.kpis.map((kpi) => (
                  <Card key={kpi.id}>
                    <CardContent className="p-4">
                      <div className="space-y-2">
                        <p className="text-sm text-muted-foreground">{kpi.name}</p>
                        <p className="text-2xl font-bold">{kpi.value}</p>
                        <div className="flex items-center gap-2">
                          {kpi.trend === 'up' ? (
                            <TrendingUp className="h-4 w-4 text-green-600" />
                          ) : (
                            <TrendingUp className="h-4 w-4 text-red-600 rotate-180" />
                          )}
                          <span className={`text-sm ${kpi.change > 0 ? 'text-green-600' : 'text-red-600'}`}>
                            {kpi.change > 0 ? '+' : ''}{kpi.change}%
                          </span>
                          {kpi.benchmark && (
                            <Badge variant="outline" className="text-xs">
                              Benchmark: {kpi.benchmark}{kpi.unit}
                            </Badge>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="funnels" className="space-y-6">
          {analytics.funnels.map((funnel) => (
            <Card key={funnel.id}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  {funnel.name}
                </CardTitle>
                <CardDescription>
                  {funnel.totalUsers.toLocaleString()} пользователей • {funnel.conversionRate}% конверсия
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {funnel.steps.map((step) => (
                    <div key={step.id} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-medium">{step.name}</span>
                        <span className="text-sm text-muted-foreground">{step.rate}%</span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2">
                        <div 
                          className="bg-primary h-2 rounded-full transition-all duration-500"
                          style={{ width: `${step.rate}%` }}
                        />
                      </div>
                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <span>{step.value.toLocaleString()} пользователей</span>
                        {step.benchmark && (
                          <span>Benchmark: {step.benchmark}%</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="cohorts" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Когортный анализ
              </CardTitle>
              <CardDescription>
                Анализ удержания пользователей по периодам
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {analytics.cohorts.map((cohort) => (
                  <div key={cohort.period} className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h4 className="font-semibold">Когорта {cohort.period}</h4>
                      <Badge variant="outline">{cohort.totalUsers} пользователей</Badge>
                    </div>
                    <div className="grid grid-cols-7 gap-2 text-sm">
                      {cohort.periods.map((period, index) => (
                        <div key={period} className="text-center">
                          <div className="font-medium text-muted-foreground mb-2">{period}</div>
                          <div className="p-2 rounded" style={{
                            backgroundColor: `hsl(${120 * (cohort.retention[index] / 100)}, 50%, 90%)`
                          }}>
                            {cohort.retention[index]}%
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="comparison" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5" />
                Сравнение с базой
              </CardTitle>
              <CardDescription>
                Сравнение показателей сегмента с общими показателями базы
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold mb-4">Показатели сегмента</h4>
                  <div className="space-y-3">
                    {analytics.comparison.segment.map((kpi) => (
                      <div key={kpi.id} className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                        <span className="font-medium">{kpi.name}</span>
                        <span className="text-lg font-bold text-blue-600">{kpi.value}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold mb-4">Показатели базы</h4>
                  <div className="space-y-3">
                    {analytics.comparison.base.map((kpi) => (
                      <div key={kpi.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <span className="font-medium">{kpi.name}</span>
                        <span className="text-lg font-bold text-gray-600">{kpi.value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
