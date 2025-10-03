/**
 * Страница "Бонусы и офферы"
 * Согласно ТЗ: оборачиваемость, экономика, ретеншн
 */

"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Gift, Plus, TrendingUp } from "lucide-react";
import { BonusesTable } from "@/components/bonuses/bonuses-table";
import { BonusDetailCard } from "@/components/bonuses/bonus-detail-card";
import { BonusComparison } from "@/components/bonuses/bonus-comparison";
import { MOCK_BONUSES, getBonusDetail } from "@/lib/mock-bonuses-data";
import { generateBonusKPI } from "@/lib/mock-bonuses-data";
import { BonusType } from "@/lib/types/bonuses";

// Интерфейс для создания бонуса
interface BonusCreation {
  name: string;
  type: BonusType;
  amount: number;
  amountType: 'percentage' | 'fixed';
  wageringRequirement: number;
  maxBet: number;
  minDeposit: number;
  maxWinnings: number;
  validityDays: number;
  autoActivate: boolean;
  stackable: boolean;
}

export default function BonusesPage() {
  const [selectedBonusId, setSelectedBonusId] = useState<string | null>(null);
  const [showDetailDialog, setShowDetailDialog] = useState(false);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [comparedBonusIds, setComparedBonusIds] = useState<string[]>([]);

  // State для создания бонуса
  const [newBonus, setNewBonus] = useState<BonusCreation>({
    name: '',
    type: 'deposit',
    amount: 100,
    amountType: 'percentage',
    wageringRequirement: 30,
    maxBet: 10,
    minDeposit: 20,
    maxWinnings: 1000,
    validityDays: 7,
    autoActivate: false,
    stackable: false
  });

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

  // Создать бонус
  const handleCreateBonus = () => {
    console.log("Создать бонус:", newBonus);
    setShowCreateDialog(false);
    // TODO: сохранить бонус
  };

  // Расчет оптимального wagering
  const calculateOptimalWagering = (bonusAmount: number, bonusType: BonusType): number => {
    const baseWagering = {
      deposit: 30,
      reload: 25,
      freespins: 40,
      cashback: 10,
      insurance: 15,
      tournament: 0
    };

    const wageringMultiplier = baseWagering[bonusType];
    const adjustedWagering = bonusAmount > 100
      ? wageringMultiplier * 0.9
      : wageringMultiplier;

    return Math.round(adjustedWagering);
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
          <Button onClick={() => setShowCreateDialog(true)}>
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
      <Card>
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
          <div className="grid gap-4 md:grid-cols-3">
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
      <BonusesTable
        bonuses={MOCK_BONUSES}
        onBonusClick={handleBonusClick}
        onCompareClick={handleCompare}
        onCreateCampaignClick={handleCreateCampaign}
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

      {/* Диалог создания бонуса */}
      <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Создание нового бонуса</DialogTitle>
            <DialogDescription>
              Настройте параметры бонуса с учетом рекомендаций ИИ
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 mt-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <Label>Название бонуса</Label>
                <Input
                  placeholder="Например: Welcome Bonus 200%"
                  value={newBonus.name}
                  onChange={(e) => setNewBonus({ ...newBonus, name: e.target.value })}
                />
              </div>
              <div>
                <Label>Тип бонуса</Label>
                <Select value={newBonus.type} onValueChange={(v) => setNewBonus({ ...newBonus, type: v as BonusType })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="deposit">Депозитный</SelectItem>
                    <SelectItem value="reload">Релоад</SelectItem>
                    <SelectItem value="cashback">Кэшбэк</SelectItem>
                    <SelectItem value="freespins">Фриспины</SelectItem>
                    <SelectItem value="insurance">Страховка</SelectItem>
                    <SelectItem value="tournament">Турнир</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <Label>Размер бонуса</Label>
                <div className="flex gap-2">
                  <Input
                    type="number"
                    value={newBonus.amount}
                    onChange={(e) => setNewBonus({ ...newBonus, amount: parseInt(e.target.value) })}
                  />
                  <Select value={newBonus.amountType} onValueChange={(v) => setNewBonus({ ...newBonus, amountType: v as 'percentage' | 'fixed' })}>
                    <SelectTrigger className="w-24">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="percentage">%</SelectItem>
                      <SelectItem value="fixed">€</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div>
                <Label>Wagering requirement</Label>
                <div className="flex items-center gap-4">
                  <Slider
                    value={[newBonus.wageringRequirement]}
                    onValueChange={([v]) => setNewBonus({ ...newBonus, wageringRequirement: v })}
                    max={100}
                    step={5}
                    className="flex-1"
                  />
                  <span className="text-lg font-semibold w-16">{newBonus.wageringRequirement}x</span>
                </div>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              <div>
                <Label>Мин. депозит</Label>
                <Input
                  type="number"
                  value={newBonus.minDeposit}
                  onChange={(e) => setNewBonus({ ...newBonus, minDeposit: parseInt(e.target.value) })}
                />
              </div>
              <div>
                <Label>Макс. ставка</Label>
                <Input
                  type="number"
                  value={newBonus.maxBet}
                  onChange={(e) => setNewBonus({ ...newBonus, maxBet: parseInt(e.target.value) })}
                />
              </div>
              <div>
                <Label>Срок действия (дней)</Label>
                <Input
                  type="number"
                  value={newBonus.validityDays}
                  onChange={(e) => setNewBonus({ ...newBonus, validityDays: parseInt(e.target.value) })}
                />
              </div>
            </div>

            {/* Рекомендации ИИ */}
            <Card className="bg-primary/5 border-primary/20">
              <CardHeader>
                <CardTitle className="text-lg">Рекомендации ИИ</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Оптимальный wagering:</span>
                  <Badge variant="secondary">
                    {calculateOptimalWagering(newBonus.amount, newBonus.type)}x
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Ожидаемый completion rate:</span>
                  <Badge variant="secondary">
                    {newBonus.wageringRequirement <= 30 ? '45-55%' : '25-35%'}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Риск bonus abuse:</span>
                  <Badge variant={newBonus.wageringRequirement < 20 ? 'destructive' : 'secondary'}>
                    {newBonus.wageringRequirement < 20 ? 'Высокий' : 'Низкий'}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Прогноз ROI:</span>
                  <Badge variant="secondary">
                    {150 + Math.round((50 - newBonus.wageringRequirement) * 5)}%
                  </Badge>
                </div>
              </CardContent>
            </Card>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="flex items-center space-x-2">
                  <Switch
                    id="auto-activate"
                    checked={newBonus.autoActivate}
                    onCheckedChange={(v) => setNewBonus({ ...newBonus, autoActivate: v })}
                  />
                  <Label htmlFor="auto-activate">Автоактивация</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="stackable"
                    checked={newBonus.stackable}
                    onCheckedChange={(v) => setNewBonus({ ...newBonus, stackable: v })}
                  />
                  <Label htmlFor="stackable">Стекируемый</Label>
                </div>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" onClick={() => setShowCreateDialog(false)}>
                  Отмена
                </Button>
                <Button onClick={handleCreateBonus}>
                  <Plus className="h-4 w-4 mr-2" />
                  Создать бонус
                </Button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
