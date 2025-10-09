/**
 * Страница "Бонусы и офферы"
 * Согласно ТЗ: оборачиваемость, экономика, ретеншн
 */

"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Gift, Plus, TrendingUp } from "lucide-react";
import { BonusesTable } from "@/components/bonuses/bonuses-table";
import { BonusDetailCard } from "@/components/bonuses/bonus-detail-card";
import { BonusComparison } from "@/components/bonuses/bonus-comparison";
import { BonusWizard, BonusFormData } from "@/components/bonuses/bonus-wizard";
import { BonusFunnel } from "@/components/bonuses/bonus-funnel";
import { MOCK_BONUSES, getBonusDetail } from "@/lib/mock-bonuses-data";
import { generateBonusKPI } from "@/lib/mock-bonuses-data";
import { BonusType } from "@/lib/types/bonuses";
import { SectionOnboarding } from "@/components/onboarding/section-onboarding";
import { BONUSES_ONBOARDING } from "@/lib/onboarding-configs";
import { Sparkles } from "lucide-react";
import { TooltipOverlay } from "@/components/onboarding/tooltip-overlay";
import { BONUSES_TOOLTIPS } from "@/lib/tooltip-configs";

export default function BonusesPage() {
  const [selectedBonusId, setSelectedBonusId] = useState<string | null>(null);
  const [showDetailDialog, setShowDetailDialog] = useState(false);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [comparedBonusIds, setComparedBonusIds] = useState<string[]>([]);
  const [isOnboardingOpen, setIsOnboardingOpen] = useState(false);

  // Общие метрики по всем бонусам
  const activeBonuses = MOCK_BONUSES.filter((b) => b.status === "active");
  const allKPIs = activeBonuses.map((b) => generateBonusKPI(b.id, b.type));

  const avgCompletionRate =
    allKPIs.reduce((sum, kpi) => sum + kpi.completion_rate, 0) / allKPIs.length;
  const avgNetROI = allKPIs.reduce((sum, kpi) => sum + kpi.bonus_roi_net, 0) / allKPIs.length;
  const avgAbuseRate = allKPIs.reduce((sum, kpi) => sum + kpi.abuse_rate, 0) / allKPIs.length;
  const totalRevenue = allKPIs.reduce((sum, kpi) => sum + kpi.net_revenue, 0);
  const avgDepositUplift = allKPIs.reduce((sum, kpi) => sum + kpi.deposit_uplift, 0) / allKPIs.length;
  const avgTakeUpRate = allKPIs.reduce((sum, kpi) => sum + kpi.take_up_rate, 0) / allKPIs.length;

  // Обработка клика по бонусу
  const handleBonusClick = (bonusId: string) => {
    setSelectedBonusId(bonusId);
    setShowDetailDialog(true);
  };

  // Обработка сравнения
  const handleCompare = (bonusIds: string[]) => {
    setComparedBonusIds(bonusIds);
  };

  // Создание кампании из бонуса
  const handleCreateCampaign = (bonusId: string) => {
    console.log("Создать кампанию из бонуса:", bonusId);
    // TODO: открыть форму создания кампании
  };

  // Применить рекомендацию
  const handleApplyRecommendation = (recoId: string) => {
    console.log("Применить рекомендацию:", recoId);
    // TODO: применить рекомендацию
  };

  // Создать бонус через новый визард
  const handleCreateBonusComplete = (bonusData: BonusFormData) => {
    console.log("Создан бонус:", bonusData);
    // TODO: сохранить бонус в state или отправить на сервер
  };

  // Получить детализацию бонуса
  const selectedBonusDetail = selectedBonusId ? getBonusDetail(selectedBonusId) : null;

  // Получить бонусы для сравнения
  const comparedBonuses = MOCK_BONUSES.filter((b) => comparedBonusIds.includes(b.id));

  return (
    <div className="flex flex-col gap-6 p-4 md:p-6 lg:p-8">
      {/* Заголовок */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
            <Gift className="h-6 w-6 text-primary" />
            Бонусы и офферы
          </h1>
          <p className="text-muted-foreground">
            Оборачиваемость бонусов, экономика и влияние на удержание
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            onClick={() => setIsOnboardingOpen(true)}
            variant="outline"
            className="flex items-center gap-2"
          >
            <Sparkles className="h-4 w-4" />
            Как работать с разделом
          </Button>
          <Button data-tooltip="create-bonus" onClick={() => setShowCreateDialog(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Создать бонус
          </Button>
        </div>
      </div>

      {/* Ключевые метрики */}
      <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Активных бонусов
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeBonuses.length}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Всего: {MOCK_BONUSES.length}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Средний Completion
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{avgCompletionRate.toFixed(1)}%</div>
            <p className="text-xs text-muted-foreground mt-1">
              Процент отыгранных бонусов
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Средний Net ROI
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {((avgNetROI - 1) * 100).toFixed(0)}%
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Чистый возврат инвестиций
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Общая выручка
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">€{(totalRevenue / 1000000).toFixed(1)}M</div>
            <p className="text-xs text-muted-foreground mt-1">
              Чистая за период
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
              +{avgDepositUplift.toFixed(1)}%
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              vs контрольная группа
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
              className={`text-2xl font-bold ${
                avgAbuseRate < 3 ? "text-green-600" : "text-red-600"
              }`}
            >
              {avgAbuseRate.toFixed(1)}%
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Take-up: {avgTakeUpRate.toFixed(1)}%
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Топ рекомендаций ИИ */}
      <Card data-tooltip="bonus-performance">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-primary" />
                Топ рекомендаций ИИ
              </CardTitle>
              <CardDescription>
                Автоматические рекомендации по оптимизации бонусной программы
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3" data-tooltip="bonus-conditions">
            <Card className="border-primary/20 bg-primary/5">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <Badge variant="destructive">High Priority</Badge>
                  <Badge variant="outline">+€45k/мес</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <h4 className="font-semibold mb-2">Снизить wagering для депозитных бонусов</h4>
                <p className="text-sm text-muted-foreground mb-3">
                  Снижение wagering с 40x до 30x увеличит completion rate на 18%
                </p>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <p className="text-muted-foreground">Текущий</p>
                    <p className="font-medium">40x</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Рекомендуется</p>
                    <p className="font-medium">30x</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-primary/20 bg-primary/5">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <Badge variant="default">Medium Priority</Badge>
                  <Badge variant="outline">+€28k/мес</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <h4 className="font-semibold mb-2">Сегментированный кэшбэк</h4>
                <p className="text-sm text-muted-foreground mb-3">
                  Динамический кэшбэк 5-15% по VIP уровням
                </p>
                <div className="space-y-1 text-xs">
                  <p>Regular: 5%</p>
                  <p>VIP: 10%</p>
                  <p>Premium: 15%</p>
                </div>
              </CardContent>
            </Card>

            <Card className="border-primary/20 bg-primary/5">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <Badge variant="default">Medium Priority</Badge>
                  <Badge variant="outline">+€32k/мес</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <h4 className="font-semibold mb-2">Скорректировать сроки</h4>
                <p className="text-sm text-muted-foreground mb-3">
                  Сокращение с 30 до 7 дней увеличит urgency
                </p>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <p className="text-muted-foreground">Activity</p>
                    <p className="font-medium">+25%</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Deposits</p>
                    <p className="font-medium">+15%</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>

      {/* Сравнение бонусов (если выбраны) */}
      {comparedBonuses.length >= 2 && (
        <BonusComparison
          bonuses={comparedBonuses}
          onClose={() => setComparedBonusIds([])}
        />
      )}

      {/* Таблица бонусов */}
      <div data-tooltip="bonuses-list">
        <BonusesTable
          bonuses={MOCK_BONUSES}
          onBonusClick={handleBonusClick}
          onCompareClick={handleCompare}
          onCreateCampaignClick={handleCreateCampaign}
        />
      </div>

      {/* Воронка конверсии для примера бонуса */}
      <BonusFunnel
        bonusName="Welcome Pack 200%"
        data={{
          offered: 5420,
          claimed: 4680,
          activated: 3920,
          inProgress: 2145,
          completed: 1820,
          abandoned: 2860
        }}
      />

      {/* Диалог с деталями бонуса */}
      <Dialog open={showDetailDialog} onOpenChange={setShowDetailDialog}>
        <DialogContent className="max-w-7xl max-h-[90vh] overflow-y-auto">
          {selectedBonusDetail && (
            <BonusDetailCard
              bonus={selectedBonusDetail}
              onClose={() => setShowDetailDialog(false)}
              onCreateCampaign={handleCreateCampaign}
              onApplyRecommendation={handleApplyRecommendation}
            />
          )}
        </DialogContent>
      </Dialog>


      {/* Конструктор бонусов с AI-помощником (6 шагов) */}
      <BonusWizard
        open={showCreateDialog}
        onOpenChange={setShowCreateDialog}
        onComplete={handleCreateBonusComplete}
      />

      {/* Section Onboarding */}
      <SectionOnboarding
        open={isOnboardingOpen}
        onOpenChange={setIsOnboardingOpen}
        steps={BONUSES_ONBOARDING}
        sectionName="Бонусы"
      />

      {/* Tooltip Overlay */}
      <TooltipOverlay
        steps={BONUSES_TOOLTIPS}
        storageKey="bonuses-tooltips-completed"
      />
    </div>
  );
}
