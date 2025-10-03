/**
 * Карточка детальной информации по бонусу
 * Согласно ТЗ: воронка, графики, KPI, рекомендации, версии
 */

"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Area,
  AreaChart,
} from "recharts";
import {
  TrendingUp,
  TrendingDown,
  Info,
  Lightbulb,
  AlertTriangle,
  CheckCircle2,
  X,
  Send,
  History,
  Users,
  Shield,
  Zap,
} from "lucide-react";
import { BonusDetail } from "@/lib/types/bonuses";
import { cn } from "@/lib/utils";

interface BonusDetailCardProps {
  bonus: BonusDetail;
  onClose?: () => void;
  onCreateCampaign?: (bonusId: string) => void;
  onApplyRecommendation?: (recoId: string) => void;
}

export function BonusDetailCard({
  bonus,
  onClose,
  onCreateCampaign,
  onApplyRecommendation,
}: BonusDetailCardProps) {
  const [selectedTab, setSelectedTab] = useState("funnel");

  const { kpi, timeseries, versions, recommendations, segment_contributions, abuse_patterns } = bonus;

  // Форматирование чисел
  const formatPercent = (value: number) => `${value.toFixed(1)}%`;
  const formatROI = (value: number) => `${((value - 1) * 100).toFixed(0)}%`;
  const formatMoney = (value: number) => `€${(value / 1000).toFixed(0)}k`;
  const formatHours = (value: number) => `${value.toFixed(0)}ч`;

  // Данные воронки
  const funnelData = [
    { stage: "Отправлено", value: 10000, percent: 100 },
    { stage: "Просмотрено", value: 7500, percent: 75 },
    { stage: "Активировано", value: 6000, percent: 60 },
    { stage: "Начали отыгрыш", value: 5000, percent: 50 },
    { stage: "50% отыграно", value: 3500, percent: 35 },
    { stage: "100% отыграно", value: kpi.completion_rate * 100, percent: kpi.completion_rate },
    { stage: "Повторный депозит", value: kpi.repeat_deposit_rate * 100, percent: kpi.repeat_deposit_rate },
  ];

  // Приоритет рекомендации -> цвет
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "destructive";
      case "medium":
        return "default";
      default:
        return "secondary";
    }
  };

  return (
    <div className="space-y-4">
      {/* Хедер */}
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <CardTitle className="text-2xl">{bonus.name}</CardTitle>
                {bonus.ai_recommended && (
                  <Badge variant="outline" className="gap-1">
                    <Zap className="h-3 w-3 text-yellow-500" />
                    Рекомендовано ИИ
                  </Badge>
                )}
                <Badge variant={bonus.status === "active" ? "default" : "secondary"}>
                  {bonus.status}
                </Badge>
              </div>
              <CardDescription className="space-y-1">
                <div>
                  Тип: {bonus.type} • Период: {new Date(bonus.start_at).toLocaleDateString()} -{" "}
                  {new Date(bonus.end_at).toLocaleDateString()}
                </div>
                <div>
                  География: {bonus.geo.join(", ")} • Валюта: {bonus.currency.join(", ")} •
                  Сегменты: {bonus.segments.join(", ")}
                </div>
                <div className="mt-2 font-medium">
                  Условия: {bonus.params.percent && `${bonus.params.percent}% бонус`}
                  {bonus.params.fixed_amount && `€${bonus.params.fixed_amount} фикс`} •
                  Wagering: {bonus.params.w_req}x • Срок: {bonus.params.rollover_days} дней •
                  Мин. депозит: €{bonus.params.min_dep}
                </div>
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Button onClick={() => onCreateCampaign?.(bonus.id)}>
                <Send className="h-4 w-4 mr-2" />
                Создать кампанию
              </Button>
              {onClose && (
                <Button variant="ghost" size="icon" onClick={onClose}>
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* KPI карточки */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Completion Rate
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatPercent(kpi.completion_rate)}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Среднее время: {formatHours(kpi.time_to_completion_median)}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Net ROI
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{formatROI(kpi.bonus_roi_net)}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Gross: {formatROI(kpi.bonus_roi_gross)}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Deposit Uplift
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              +{formatPercent(kpi.deposit_uplift)}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Take-up: {formatPercent(kpi.take_up_rate)}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Abuse Rate
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div
              className={cn(
                "text-2xl font-bold",
                kpi.abuse_rate < 3 ? "text-green-600" : "text-red-600"
              )}
            >
              {formatPercent(kpi.abuse_rate)}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Effective cost: {formatPercent(kpi.effective_cost_pct)}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Рекомендации ИИ */}
      {recommendations.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lightbulb className="h-5 w-5 text-yellow-500" />
              Рекомендации ИИ
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {recommendations.map((reco) => (
              <Alert key={reco.id}>
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <AlertTitle>{reco.message}</AlertTitle>
                      <Badge variant={getPriorityColor(reco.priority)}>{reco.priority}</Badge>
                    </div>
                    <AlertDescription className="text-sm">
                      Ожидаемый эффект:{" "}
                      {reco.expected_uplift.deposit_uplift &&
                        `Deposit uplift: +${formatPercent(reco.expected_uplift.deposit_uplift)}`}
                      {reco.expected_uplift.completion_change &&
                        ` • Completion: +${formatPercent(reco.expected_uplift.completion_change)}`}
                      {reco.expected_uplift.net_roi_change &&
                        ` • ROI: +${formatPercent(reco.expected_uplift.net_roi_change)}`}
                    </AlertDescription>
                  </div>
                  <Button size="sm" onClick={() => onApplyRecommendation?.(reco.id)}>
                    <Zap className="h-4 w-4 mr-1" />
                    Применить
                  </Button>
                </div>
              </Alert>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Табы с детальной информацией */}
      <Tabs value={selectedTab} onValueChange={setSelectedTab}>
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="funnel">Воронка</TabsTrigger>
          <TabsTrigger value="charts">Графики</TabsTrigger>
          <TabsTrigger value="segments">Сегменты</TabsTrigger>
          <TabsTrigger value="versions">История</TabsTrigger>
          <TabsTrigger value="abuse">Антифрод</TabsTrigger>
        </TabsList>

        {/* Воронка */}
        <TabsContent value="funnel" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Воронка конверсии бонуса</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {funnelData.map((stage, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span>{stage.stage}</span>
                      <span className="font-medium">
                        {stage.value.toLocaleString()} ({formatPercent(stage.percent)})
                      </span>
                    </div>
                    <Progress value={stage.percent} className="h-2" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Графики */}
        <TabsContent value="charts" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Динамика ключевых метрик</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={timeseries}>
                  <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                  <XAxis dataKey="date" />
                  <YAxis yAxisId="left" />
                  <YAxis yAxisId="right" orientation="right" />
                  <Tooltip />
                  <Legend />
                  <Line
                    yAxisId="left"
                    type="monotone"
                    dataKey="completion_rate"
                    stroke="#3b82f6"
                    name="Completion Rate %"
                    strokeWidth={2}
                  />
                  <Line
                    yAxisId="right"
                    type="monotone"
                    dataKey="net_roi"
                    stroke="#10b981"
                    name="Net ROI"
                    strokeWidth={2}
                  />
                  <Line
                    yAxisId="left"
                    type="monotone"
                    dataKey="abuse_rate"
                    stroke="#ef4444"
                    name="Abuse Rate %"
                    strokeWidth={2}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Депозиты: бонус vs контроль</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={timeseries}>
                  <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="deposits_from_bonus" fill="#3b82f6" name="С бонусом" />
                  <Bar dataKey="deposits_control" fill="#94a3b8" name="Контроль" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Сегменты */}
        <TabsContent value="segments" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Вклад сегментов
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {segment_contributions.map((seg, index) => (
                  <div key={index} className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-semibold capitalize">{seg.segment}</h4>
                      <Badge variant="secondary">{seg.users.toLocaleString()} игроков</Badge>
                    </div>
                    <div className="grid grid-cols-3 gap-4 text-sm">
                      <div>
                        <p className="text-muted-foreground">Депозиты</p>
                        <p className="font-semibold">{formatMoney(seg.deposits)}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Completion</p>
                        <p className="font-semibold">{formatPercent(seg.completion_rate)}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Net ROI</p>
                        <p className="font-semibold">{formatROI(seg.net_roi)}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* История версий */}
        <TabsContent value="versions" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <History className="h-5 w-5" />
                История изменений
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {versions.map((version, index) => (
                  <div key={index} className="border-l-2 border-primary/20 pl-4 pb-4">
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <h4 className="font-semibold">Версия {version.version}</h4>
                        <p className="text-sm text-muted-foreground">
                          {new Date(version.changed_at).toLocaleString()} • {version.changed_by}
                        </p>
                      </div>
                    </div>
                    {version.comment && (
                      <p className="text-sm mb-2">{version.comment}</p>
                    )}
                    <div className="space-y-1">
                      {version.diff.map((change, i) => (
                        <div key={i} className="text-sm font-mono bg-muted p-2 rounded">
                          {change.field}: {String(change.old_value)} → {String(change.new_value)}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Антифрод */}
        <TabsContent value="abuse" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-red-500" />
                Паттерны злоупотреблений
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {abuse_patterns.map((pattern, index) => (
                  <Alert key={index}>
                    <AlertTriangle className="h-4 w-4" />
                    <AlertTitle className="capitalize">
                      {pattern.type.replace(/_/g, " ")}
                    </AlertTitle>
                    <AlertDescription>
                      Обнаружено случаев: {pattern.count} • Пользователей: {pattern.users.length}
                      <br />
                      Дата обнаружения: {new Date(pattern.detected_at).toLocaleString()}
                    </AlertDescription>
                  </Alert>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
