"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { AlertCircle, TrendingUp, TrendingDown, Minus } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import type { RetentionMetric, SegmentMetrics } from "@/lib/types";
import { retentionMetrics, segmentMetricsData, monitoringSchedule } from "@/lib/retention-metrics-data";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";

// Компонент для отображения одной метрики
function MetricCard({ metric }: { metric: RetentionMetric }) {
  const isAlert = metric.name === 'Retention Rate' && Number(metric.value) < 65;
  const trendIcon = metric.trend === 'up' ? <TrendingUp className="h-4 w-4" /> :
                    metric.trend === 'down' ? <TrendingDown className="h-4 w-4" /> :
                    <Minus className="h-4 w-4" />;
  
  const trendColor = metric.trend === 'up' ? 'text-green-600' :
                     metric.trend === 'down' ? 'text-red-600' :
                     'text-gray-600';

  return (
    <Card className={isAlert ? 'border-red-500' : ''}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-medium">{metric.name}</CardTitle>
          <Badge variant="outline" className="text-xs">
            {metric.frequency}
          </Badge>
        </div>
        <CardDescription className="text-xs">
          {metric.description}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between">
          <div className="text-2xl font-bold">
            {metric.value}{metric.unit}
          </div>
          {metric.trend && (
            <div className={`flex items-center gap-1 ${trendColor}`}>
              {trendIcon}
              <span className="text-sm">{metric.trendValue}</span>
            </div>
          )}
        </div>
        {metric.targetValue && (
          <div className="mt-2">
            <div className="flex justify-between text-xs text-muted-foreground mb-1">
              <span>Цель</span>
              <span>{metric.targetValue}{metric.unit}</span>
            </div>
            <Progress 
              value={Number(String(metric.value).replace(/[^0-9.-]/g, '')) / Number(String(metric.targetValue).replace(/[^0-9.-]/g, '')) * 100} 
              className="h-2"
            />
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// Компонент для отображения метрик по сегментам
function SegmentMetricsCard({ segment }: { segment: SegmentMetrics }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{segment.segmentName}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {Object.entries(segment.metrics).map(([key, value]) => (
            <div key={key} className="flex justify-between">
              <span className="text-sm text-muted-foreground">
                {key === 'retentionRate' && 'Retention Rate'}
                {key === 'averageDepositAmount' && 'Средний депозит'}
                {key === 'depositFrequency' && 'Частота депозитов'}
                {key === 'ltv' && 'LTV'}
                {key === 'conversionRate' && 'Конверсия'}
                {key === 'bonusActivationRate' && 'Активация бонусов'}
                {key === 'activePlayersRatio' && 'Активные игроки'}
                {key === 'referralRate' && 'Реферальная ставка'}
              </span>
              <span className="text-sm font-medium">{value}</span>
            </div>
          ))}
        </div>
        <div className="mt-4 pt-4 border-t">
          <h4 className="text-sm font-medium mb-2">Рекомендации:</h4>
          <ul className="text-xs text-muted-foreground space-y-1">
            {segment.recommendations.map((rec, idx) => (
              <li key={idx}>• {rec}</li>
            ))}
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}

export function RetentionMetricsDashboard() {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedFrequency, setSelectedFrequency] = useState<string>('all');
  const [autoReports, setAutoReports] = useState<any[]>(() => {
    try { return JSON.parse(localStorage.getItem('autoReports') || '[]'); } catch { return []; }
  });
  const [history, setHistory] = useState<any[]>(() => {
    try { return JSON.parse(localStorage.getItem('reportHistory') || '[]'); } catch { return []; }
  });
  const [autoReportDialogOpen, setAutoReportDialogOpen] = useState(false);
  const [newReport, setNewReport] = useState<any>({
    name: '',
    schedule: 'daily',
    projects: [],
    countries: [],
    segments: [],
    metrics: [],
    time: '10:00',
    format: 'csv',
    channel: 'email'
  });
  
  // Фильтрация метрик
  const filteredMetrics = retentionMetrics.filter(metric => {
    const categoryMatch = selectedCategory === 'all' || metric.category === selectedCategory;
    const frequencyMatch = selectedFrequency === 'all' || metric.frequency === selectedFrequency;
    return categoryMatch && frequencyMatch;
  });

  // Проверка критических метрик
  const criticalMetrics = retentionMetrics.filter(metric => {
    if (metric.name === 'Retention Rate' && Number(metric.value) < 60) return true;
    if (metric.name === 'Churn Rate' && Number(metric.value) > 5) return true;
    if (metric.name === 'Withdrawal Success Rate' && Number(metric.value) < 95) return true;
    return false;
  });

  return (
    <div className="space-y-6">
      {/* Алерты для критических метрик */}
      {criticalMetrics.length > 0 && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Внимание! Критические показатели</AlertTitle>
          <AlertDescription>
            {criticalMetrics.map(metric => (
              <div key={metric.id}>
                • {metric.name}: {metric.value}{metric.unit} (критический порог)
              </div>
            ))}
          </AlertDescription>
        </Alert>
      )}

      {/* Фильтры */}
      <div className="flex gap-4">
        <Select value={selectedCategory} onValueChange={setSelectedCategory}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Выберите категорию" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Все категории</SelectItem>
            <SelectItem value="retention">Удержание</SelectItem>
            <SelectItem value="revenue">Доход</SelectItem>
            <SelectItem value="engagement">Вовлеченность</SelectItem>
            <SelectItem value="conversion">Конверсия</SelectItem>
            <SelectItem value="satisfaction">Удовлетворенность</SelectItem>
          </SelectContent>
        </Select>

        <Select value={selectedFrequency} onValueChange={setSelectedFrequency}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Частота обновления" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Все</SelectItem>
            <SelectItem value="daily">Ежедневно</SelectItem>
            <SelectItem value="weekly">Еженедельно</SelectItem>
            <SelectItem value="monthly">Ежемесячно</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Табы с метриками */}
      <Tabs defaultValue="metrics" className="space-y-4">
        <TabsList>
          <TabsTrigger value="metrics">25 ключевых метрик</TabsTrigger>
          <TabsTrigger value="segments">Метрики по сегментам</TabsTrigger>
          <TabsTrigger value="monitoring">Регламент мониторинга</TabsTrigger>
        </TabsList>

        <TabsContent value="metrics" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredMetrics.map(metric => (
              <MetricCard key={metric.id} metric={metric} />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="segments" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {segmentMetricsData.map(segment => (
              <SegmentMetricsCard key={segment.segmentId} segment={segment} />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="monitoring" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Регламент мониторинга метрик</CardTitle>
              <CardDescription>
                Рекомендуемая частота проверки ключевых показателей
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <h4 className="font-medium mb-2">Ежедневный мониторинг</h4>
                  <div className="flex flex-wrap gap-2">
                    {monitoringSchedule.daily.map(metric => (
                      <Badge key={metric} variant="secondary">{metric}</Badge>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h4 className="font-medium mb-2">Еженедельный мониторинг</h4>
                  <div className="flex flex-wrap gap-2">
                    {monitoringSchedule.weekly.map(metric => (
                      <Badge key={metric} variant="secondary">{metric}</Badge>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h4 className="font-medium mb-2">Ежемесячный мониторинг</h4>
                  <div className="flex flex-wrap gap-2">
                    {monitoringSchedule.monthly.map(metric => (
                      <Badge key={metric} variant="secondary">{metric}</Badge>
                    ))}
                  </div>
                </div>
              </div>

              <div className="mt-6 p-4 bg-muted rounded-lg">
                <h4 className="font-medium mb-2">Система оповещений</h4>
                <ul className="text-sm space-y-1">
                  <li>• Ухудшение Retention Rate ниже 60%: срочное обсуждение и меры по реактивации</li>
                  <li>• Падение ARPU на 15%+: персональные акции и усиленные маркетинговые мероприятия</li>
                  <li>• Снижение Bonus Utilization Rate ниже 50%: пересмотр условий бонусов</li>
                </ul>
              </div>

              {/* Настройка автоотчётов */}
              <div className="mt-6">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium">Автоотчёты</h4>
                  <Dialog open={autoReportDialogOpen} onOpenChange={setAutoReportDialogOpen}>
                    <DialogTrigger asChild>
                      <Button size="sm" variant="outline">Создать автоотчёт</Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-3xl">
                      <DialogHeader>
                        <DialogTitle>Новый автоотчёт</DialogTitle>
                      </DialogHeader>
                      <div className="grid gap-4 md:grid-cols-2">
                        <div className="space-y-2 md:col-span-2">
                          <label className="text-sm">Название</label>
                          <Input value={newReport.name} onChange={(e) => setNewReport({ ...newReport, name: e.target.value })} placeholder="Еженедельный отчёт по ретеншену" />
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm">Периодичность</label>
                          <Select value={newReport.schedule} onValueChange={(v) => setNewReport({ ...newReport, schedule: v })}>
                            <SelectTrigger><SelectValue /></SelectTrigger>
                            <SelectContent>
                              <SelectItem value="daily">Ежедневно</SelectItem>
                              <SelectItem value="weekly">Еженедельно</SelectItem>
                              <SelectItem value="monthly">Ежемесячно</SelectItem>
                              <SelectItem value="custom">Кастом</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm">Время генерации</label>
                          <Input type="time" value={newReport.time} onChange={(e) => setNewReport({ ...newReport, time: e.target.value })} />
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm">Формат</label>
                          <Select value={newReport.format} onValueChange={(v) => setNewReport({ ...newReport, format: v })}>
                            <SelectTrigger><SelectValue /></SelectTrigger>
                            <SelectContent>
                              <SelectItem value="csv">CSV</SelectItem>
                              <SelectItem value="xlsx">XLSX</SelectItem>
                              <SelectItem value="pdf">PDF</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm">Канал отправки</label>
                          <Select value={newReport.channel} onValueChange={(v) => setNewReport({ ...newReport, channel: v })}>
                            <SelectTrigger><SelectValue /></SelectTrigger>
                            <SelectContent>
                              <SelectItem value="email">Email</SelectItem>
                              <SelectItem value="telegram">Telegram</SelectItem>
                              <SelectItem value="inapp">Внутренние уведомления</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2 md:col-span-2">
                          <label className="text-sm">Метрики</label>
                          <div className="grid md:grid-cols-3 gap-2 max-h-48 overflow-auto p-2 border rounded">
                            {retentionMetrics.map(m => (
                              <label key={m.id} className="text-sm flex items-center gap-2">
                                <Checkbox checked={newReport.metrics.includes(m.id)} onCheckedChange={(v) => {
                                  setNewReport((prev: any) => ({
                                    ...prev,
                                    metrics: Boolean(v) ? Array.from(new Set([...prev.metrics, m.id])) : prev.metrics.filter((x: string) => x !== m.id)
                                  }));
                                }} />
                                {m.name}
                              </label>
                            ))}
                          </div>
                        </div>
                      </div>
                      <div className="flex justify-end">
                        <Button onClick={() => {
                          const item = { ...newReport, id: crypto.randomUUID(), createdAt: new Date().toISOString() };
                          const next = [item, ...autoReports];
                          setAutoReports(next);
                          localStorage.setItem('autoReports', JSON.stringify(next));
                          setAutoReportDialogOpen(false);
                        }}>Сохранить</Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>

                {/* Активные автоотчёты */}
                <div className="mt-3 overflow-auto rounded border">
                  <table className="w-full text-sm">
                    <thead className="bg-muted">
                      <tr>
                        <th className="px-3 py-2 text-left">Название</th>
                        <th className="px-3 py-2 text-left">Периодичность</th>
                        <th className="px-3 py-2 text-left">Метрики</th>
                        <th className="px-3 py-2 text-left">Канал</th>
                        <th className="px-3 py-2 text-left">Создан</th>
                        <th className="px-3 py-2 text-right">Действия</th>
                      </tr>
                    </thead>
                    <tbody>
                      {autoReports.length === 0 && (
                        <tr><td className="px-3 py-2 text-muted-foreground" colSpan={6}>Нет активных автоотчётов</td></tr>
                      )}
                      {autoReports.map(r => (
                        <tr key={r.id} className="border-t">
                          <td className="px-3 py-2">{r.name || 'Без названия'}</td>
                          <td className="px-3 py-2">{r.schedule}</td>
                          <td className="px-3 py-2">{r.metrics.length}</td>
                          <td className="px-3 py-2">{r.channel}</td>
                          <td className="px-3 py-2">{new Date(r.createdAt).toLocaleString('ru-RU')}</td>
                          <td className="px-3 py-2 text-right space-x-2">
                            <Button size="sm" variant="outline" onClick={() => { setNewReport(r); setAutoReportDialogOpen(true); }}>Редактировать</Button>
                            <Button size="sm" variant="destructive" onClick={() => {
                              const next = autoReports.filter(x => x.id !== r.id);
                              setAutoReports(next);
                              localStorage.setItem('autoReports', JSON.stringify(next));
                            }}>Удалить</Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* История отчётов */}
              <div className="mt-6">
                <h4 className="font-medium mb-2">История созданных отчётов (90 дней)</h4>
                <div className="overflow-auto rounded border">
                  <table className="w-full text-sm">
                    <thead className="bg-muted">
                      <tr>
                        <th className="px-3 py-2 text-left">Дата/время</th>
                        <th className="px-3 py-2 text-left">Фильтры</th>
                        <th className="px-3 py-2 text-left">Метрики</th>
                        <th className="px-3 py-2 text-left">Формат</th>
                        <th className="px-3 py-2 text-left">Статус</th>
                        <th className="px-3 py-2 text-left">Скачать</th>
                      </tr>
                    </thead>
                    <tbody>
                      {history.length === 0 && (
                        <tr><td className="px-3 py-2 text-muted-foreground" colSpan={6}>Пока нет записей</td></tr>
                      )}
                      {history.map(h => (
                        <tr key={h.id} className="border-t">
                          <td className="px-3 py-2">{new Date(h.date).toLocaleString('ru-RU')}</td>
                          <td className="px-3 py-2">{h.filtersSummary}</td>
                          <td className="px-3 py-2">{h.metrics?.length}</td>
                          <td className="px-3 py-2">{h.format?.toUpperCase()}</td>
                          <td className="px-3 py-2">{h.status}</td>
                          <td className="px-3 py-2"><Button size="sm" variant="outline">Скачать</Button></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}