"use client";

import * as React from "react";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, Zap, BarChart3, TrendingUp, Target, GitBranch, Mail, Smartphone, MessageSquare } from "lucide-react";
import { templateAnalyticsData } from "@/lib/campaign-analytics-data";
import { templatesData } from "@/lib/mock-data";

interface Props {
  params: {
    templateId: string;
  };
  searchParams?: {
    version?: string;
  };
}

export default function TemplateAnalyticsPage({ params, searchParams }: Props) {
  const template = templatesData.find(t => t.id === params.templateId);
  const analytics = templateAnalyticsData; // In real app, would fetch based on templateId
  const [selectedVersion, setSelectedVersion] = React.useState(searchParams?.version || analytics.currentVersion);

  if (!template) {
    return (
      <div className="container mx-auto py-6">
        <Card>
          <CardContent className="py-8 text-center">
            <h3 className="text-lg font-semibold mb-2">Шаблон не найден</h3>
            <p className="text-muted-foreground mb-4">
              Шаблон с ID {params.templateId} не существует
            </p>
            <Link href="/analytics/campaigns/templates">
              <Button>Вернуться к списку</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  const getChannelIcon = (channel: string) => {
    switch (channel) {
      case 'Email': return <Mail className="h-4 w-4" />;
      case 'Push': return <Smartphone className="h-4 w-4" />;
      case 'SMS': return <MessageSquare className="h-4 w-4" />;
      default: return <Mail className="h-4 w-4" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'event': return 'bg-blue-100 text-blue-800';
      case 'basic': return 'bg-green-100 text-green-800';
      case 'custom': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'event': return 'Событийный';
      case 'basic': return 'Базовый';
      case 'custom': return 'Пользовательский';
      default: return type;
    }
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/analytics/campaigns/templates">
          <Button variant="outline" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            К списку шаблонов
          </Button>
        </Link>
        <div className="flex-1">
          <h1 className="text-3xl font-bold tracking-tight">{template.name}</h1>
          <p className="text-muted-foreground">{template.description}</p>
        </div>
      </div>

      {/* Template Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5" />
            Обзор шаблона
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-6 gap-6">
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Тип</p>
              <Badge className={getTypeColor(analytics.type)}>
                {getTypeLabel(analytics.type)}
              </Badge>
            </div>
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Канал</p>
              <div className="flex items-center gap-2">
                {getChannelIcon(template.channel)}
                <span className="text-sm">{template.channel}</span>
              </div>
            </div>
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Категория</p>
              <Badge variant="outline">{template.category}</Badge>
            </div>
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Текущая версия</p>
              <Badge variant="secondary">{analytics.currentVersion}</Badge>
            </div>
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Всего версий</p>
              <p className="text-lg font-semibold">{analytics.versions.length}</p>
            </div>
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Производительность</p>
              <div className="flex items-center gap-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div
                    key={i}
                    className={`h-2 w-2 rounded-full ${
                      i < template.performance ? 'bg-green-500' : 'bg-gray-200'
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Version Selector */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <GitBranch className="h-5 w-5" />
            Сравнение версий
          </CardTitle>
          <CardDescription>
            Выберите версию для анализа производительности
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Select value={selectedVersion} onValueChange={setSelectedVersion}>
            <SelectTrigger className="w-48">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {analytics.versions.map((version) => (
                <SelectItem key={version.id} value={version.version}>
                  {version.version} ({new Date(version.createdAt).toLocaleDateString('ru-RU')})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {/* Analytics Tabs */}
      <Tabs defaultValue="kpis" className="space-y-6">
        <TabsList>
          <TabsTrigger value="kpis">KPI метрики</TabsTrigger>
          <TabsTrigger value="funnel">Воронка</TabsTrigger>
          <TabsTrigger value="breakdowns">Разрезы</TabsTrigger>
          <TabsTrigger value="versions">Версии</TabsTrigger>
          <TabsTrigger value="campaigns">Кампании</TabsTrigger>
        </TabsList>

        <TabsContent value="kpis" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Ключевые метрики шаблона</CardTitle>
              <CardDescription>
                Производительность шаблона версии {selectedVersion}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
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

        <TabsContent value="funnel" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                {analytics.funnel.name}
              </CardTitle>
              <CardDescription>
                {analytics.funnel.totalUsers.toLocaleString()} пользователей • {analytics.funnel.conversionRate}% конверсия
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {analytics.funnel.steps.map((step) => (
                  <div key={step.id} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-medium">{step.name}</span>
                      <span className="text-sm text-muted-foreground">{step.rate}%</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-3">
                      <div 
                        className="bg-primary h-3 rounded-full transition-all duration-500"
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
        </TabsContent>

        <TabsContent value="breakdowns" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {Object.entries(analytics.breakdowns).map(([key, items]) => (
              <Card key={key}>
                <CardHeader>
                  <CardTitle className="capitalize">
                    {key === 'geo' ? 'География' : 
                     key === 'channels' ? 'Каналы' : 
                     key === 'devices' ? 'Устройства' : 
                     key === 'projects' ? 'Проекты' : key}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {items.map((item) => (
                      <div key={item.id} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{item.name}</span>
                          <Badge variant="outline" className="text-xs">
                            {item.percentage}%
                          </Badge>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-muted-foreground">
                            {item.value.toLocaleString()}
                          </span>
                          {item.trend === 'up' ? (
                            <TrendingUp className="h-3 w-3 text-green-600" />
                          ) : item.trend === 'down' ? (
                            <TrendingUp className="h-3 w-3 text-red-600 rotate-180" />
                          ) : null}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="versions" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <GitBranch className="h-5 w-5" />
                История версий
              </CardTitle>
              <CardDescription>
                Сравнение производительности разных версий шаблона
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {analytics.versions.map((version) => (
                  <Card key={version.id} className={selectedVersion === version.version ? 'ring-2 ring-primary' : ''}>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <h4 className="font-semibold">{version.version}</h4>
                          <p className="text-sm text-muted-foreground">
                            {new Date(version.createdAt).toLocaleDateString('ru-RU')}
                          </p>
                        </div>
                        {version.version === analytics.currentVersion && (
                          <Badge>Текущая</Badge>
                        )}
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        {version.performance.map((kpi) => (
                          <div key={kpi.id} className="flex items-center justify-between">
                            <span className="text-sm">{kpi.name}</span>
                            <div className="flex items-center gap-2">
                              <span className="font-medium">{kpi.value}</span>
                              {kpi.trend === 'up' ? (
                                <TrendingUp className="h-3 w-3 text-green-600" />
                              ) : (
                                <TrendingUp className="h-3 w-3 text-red-600 rotate-180" />
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="campaigns" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5" />
                Топ кампании с этим шаблоном
              </CardTitle>
              <CardDescription>
                Кампании, использующие данный шаблон, отсортированные по производительности
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-muted-foreground">
                <p>Список кампаний будет загружен...</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* AI Insights */}
      <Card>
        <CardHeader>
          <CardTitle>AI Инсайты</CardTitle>
          <CardDescription>
            Автоматически выявленные паттерны и рекомендации для шаблона
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {analytics.insights.map((insight, index) => (
              <div key={index} className="flex items-start gap-3 p-3 bg-muted/30 rounded-lg">
                <div className="h-2 w-2 rounded-full bg-primary mt-2 flex-shrink-0" />
                <p className="text-sm">{insight}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
