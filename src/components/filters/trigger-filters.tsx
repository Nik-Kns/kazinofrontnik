"use client";

import * as React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Separator } from "@/components/ui/separator";
import { 
  Filter, 
  ChevronDown, 
  ChevronUp, 
  X,
  Calendar,
  Users,
  Target,
  DollarSign,
  Brain,
  Shield,
  BarChart3
} from "lucide-react";
import { segmentParameters } from '@/lib/segment-builder-data';

interface TriggerFiltersProps {
  onFiltersChange?: (filters: any) => void;
}

export function TriggerFilters({ onFiltersChange }: TriggerFiltersProps) {
  const [isExpanded, setIsExpanded] = React.useState(false);
  const [filters, setFilters] = React.useState({
    // Базовые фильтры
    search: '',
    type: '',
    channel: '',
    category: '',
    
    // Финансовые
    minGGR: '',
    maxGGR: '',
    minDeposits: '',
    maxDeposits: '',
    avgDepositMin: '',
    avgDepositMax: '',
    
    // Игровая активность
    lastLoginDays: '',
    lastBetDays: '',
    sessionCountMin: '',
    sessionCountMax: '',
    gameCategories: [] as string[],
    
    // Маркетинг
    campaignParticipation: '',
    bonusUsage: '',
    emailOpenRate: '',
    pushCTR: '',
    
    // Профиль
    countries: [] as string[],
    currencies: [] as string[],
    languages: [] as string[],
    vipLevels: [] as string[],
    retentionStatus: '',
    
    // Риски
    churnProbabilityMin: '',
    churnProbabilityMax: '',
    hasLimits: '',
    fraudScoreMax: '',
    
    // AI предсказания
    depositProbability7d: '',
    reactivationProbability: '',
    nextBestOffer: ''
  });

  const handleFilterChange = (field: string, value: any) => {
    const newFilters = { ...filters, [field]: value };
    setFilters(newFilters);
    onFiltersChange?.(newFilters);
  };

  const handleMultiSelectChange = (field: string, value: string) => {
    const currentValues = filters[field as keyof typeof filters] as string[];
    const newValues = currentValues.includes(value)
      ? currentValues.filter(v => v !== value)
      : [...currentValues, value];
    handleFilterChange(field, newValues);
  };

  const resetFilters = () => {
    const emptyFilters = {
      search: '',
      type: '',
      channel: '',
      category: '',
      minGGR: '',
      maxGGR: '',
      minDeposits: '',
      maxDeposits: '',
      avgDepositMin: '',
      avgDepositMax: '',
      lastLoginDays: '',
      lastBetDays: '',
      sessionCountMin: '',
      sessionCountMax: '',
      gameCategories: [],
      campaignParticipation: '',
      bonusUsage: '',
      emailOpenRate: '',
      pushCTR: '',
      countries: [],
      currencies: [],
      languages: [],
      vipLevels: [],
      retentionStatus: '',
      churnProbabilityMin: '',
      churnProbabilityMax: '',
      hasLimits: '',
      fraudScoreMax: '',
      depositProbability7d: '',
      reactivationProbability: '',
      nextBestOffer: ''
    };
    setFilters(emptyFilters);
    onFiltersChange?.(emptyFilters);
  };

  const activeFiltersCount = Object.values(filters).filter(value => 
    Array.isArray(value) ? value.length > 0 : value !== ''
  ).length;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Filter className="h-5 w-5" />
          Фильтры триггеров
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Основные фильтры */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <div className="space-y-2">
            <Label htmlFor="search">Поиск</Label>
            <Input
              id="search"
              placeholder="Название или описание..."
              value={filters.search}
              onChange={(e) => handleFilterChange('search', e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label>Тип триггера</Label>
            <Select value={filters.type} onValueChange={(v) => handleFilterChange('type', v)}>
              <SelectTrigger>
                <SelectValue placeholder="Все типы" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Все типы</SelectItem>
                <SelectItem value="event">Событийный</SelectItem>
                <SelectItem value="basic">Базовый</SelectItem>
                <SelectItem value="custom">Пользовательский</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Канал</Label>
            <Select value={filters.channel} onValueChange={(v) => handleFilterChange('channel', v)}>
              <SelectTrigger>
                <SelectValue placeholder="Все каналы" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Все каналы</SelectItem>
                <SelectItem value="Email">Email</SelectItem>
                <SelectItem value="Push">Push</SelectItem>
                <SelectItem value="SMS">SMS</SelectItem>
                <SelectItem value="InApp">In-App</SelectItem>
                <SelectItem value="Multi-channel">Мульти-канал</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Категория</Label>
            <Select value={filters.category} onValueChange={(v) => handleFilterChange('category', v)}>
              <SelectTrigger>
                <SelectValue placeholder="Все категории" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Все категории</SelectItem>
                <SelectItem value="Onboarding">Onboarding</SelectItem>
                <SelectItem value="Retention">Retention</SelectItem>
                <SelectItem value="Reactivation">Reactivation</SelectItem>
                <SelectItem value="Engagement">Engagement</SelectItem>
                <SelectItem value="Conversion">Conversion</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Кнопка развернуть/свернуть */}
        <div className="flex items-center justify-between">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsExpanded(!isExpanded)}
          >
            <Filter className="mr-2 h-4 w-4" />
            {isExpanded ? 'Скрыть' : 'Показать'} расширенные фильтры
            {activeFiltersCount > 0 && (
              <Badge variant="secondary" className="ml-2">
                {activeFiltersCount}
              </Badge>
            )}
          </Button>
          
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={resetFilters}>
              <X className="mr-2 h-4 w-4" />
              Сбросить
            </Button>
            <Button size="sm">
              Применить фильтры
            </Button>
          </div>
        </div>

        {/* Расширенные фильтры */}
        <Collapsible open={isExpanded} onOpenChange={setIsExpanded}>
          <CollapsibleContent className="space-y-6 pt-4">
            <Separator />
            
            {/* Финансовые метрики */}
            <div>
              <h3 className="flex items-center gap-2 text-sm font-medium mb-3">
                <DollarSign className="h-4 w-4" />
                Финансовые метрики
              </h3>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                <div className="space-y-2">
                  <Label>GGR (€)</Label>
                  <div className="flex gap-2">
                    <Input
                      type="number"
                      placeholder="От"
                      value={filters.minGGR}
                      onChange={(e) => handleFilterChange('minGGR', e.target.value)}
                    />
                    <Input
                      type="number"
                      placeholder="До"
                      value={filters.maxGGR}
                      onChange={(e) => handleFilterChange('maxGGR', e.target.value)}
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label>Количество депозитов</Label>
                  <div className="flex gap-2">
                    <Input
                      type="number"
                      placeholder="От"
                      value={filters.minDeposits}
                      onChange={(e) => handleFilterChange('minDeposits', e.target.value)}
                    />
                    <Input
                      type="number"
                      placeholder="До"
                      value={filters.maxDeposits}
                      onChange={(e) => handleFilterChange('maxDeposits', e.target.value)}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Средний депозит (€)</Label>
                  <div className="flex gap-2">
                    <Input
                      type="number"
                      placeholder="От"
                      value={filters.avgDepositMin}
                      onChange={(e) => handleFilterChange('avgDepositMin', e.target.value)}
                    />
                    <Input
                      type="number"
                      placeholder="До"
                      value={filters.avgDepositMax}
                      onChange={(e) => handleFilterChange('avgDepositMax', e.target.value)}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Игровая активность */}
            <div>
              <h3 className="flex items-center gap-2 text-sm font-medium mb-3">
                <BarChart3 className="h-4 w-4" />
                Игровая активность
              </h3>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                <div className="space-y-2">
                  <Label>Последний вход (дней назад)</Label>
                  <Input
                    type="number"
                    placeholder="Максимум дней"
                    value={filters.lastLoginDays}
                    onChange={(e) => handleFilterChange('lastLoginDays', e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Последняя ставка (дней назад)</Label>
                  <Input
                    type="number"
                    placeholder="Максимум дней"
                    value={filters.lastBetDays}
                    onChange={(e) => handleFilterChange('lastBetDays', e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Категории игр</Label>
                  <div className="flex flex-wrap gap-1">
                    {['Slots', 'Live Casino', 'Sports', 'Poker'].map(category => (
                      <Badge
                        key={category}
                        variant={filters.gameCategories.includes(category) ? "default" : "outline"}
                        className="cursor-pointer"
                        onClick={() => handleMultiSelectChange('gameCategories', category)}
                      >
                        {category}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Маркетинг */}
            <div>
              <h3 className="flex items-center gap-2 text-sm font-medium mb-3">
                <Target className="h-4 w-4" />
                Маркетинг и CRM
              </h3>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                <div className="space-y-2">
                  <Label>Email Open Rate (%)</Label>
                  <Input
                    type="number"
                    placeholder="Минимум"
                    value={filters.emailOpenRate}
                    onChange={(e) => handleFilterChange('emailOpenRate', e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Push CTR (%)</Label>
                  <Input
                    type="number"
                    placeholder="Минимум"
                    value={filters.pushCTR}
                    onChange={(e) => handleFilterChange('pushCTR', e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Использование бонусов</Label>
                  <Select value={filters.bonusUsage} onValueChange={(v) => handleFilterChange('bonusUsage', v)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Любое" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Любое</SelectItem>
                      <SelectItem value="active">Активно использует</SelectItem>
                      <SelectItem value="rare">Редко использует</SelectItem>
                      <SelectItem value="never">Не использует</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* Профиль игрока */}
            <div>
              <h3 className="flex items-center gap-2 text-sm font-medium mb-3">
                <Users className="h-4 w-4" />
                Профиль игрока
              </h3>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                <div className="space-y-2">
                  <Label>Страны</Label>
                  <div className="flex flex-wrap gap-1">
                    {['DE', 'FR', 'UK', 'ES', 'IT'].map(country => (
                      <Badge
                        key={country}
                        variant={filters.countries.includes(country) ? "default" : "outline"}
                        className="cursor-pointer text-xs"
                        onClick={() => handleMultiSelectChange('countries', country)}
                      >
                        {country}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>VIP уровень</Label>
                  <div className="flex flex-wrap gap-1">
                    {['Bronze', 'Silver', 'Gold', 'VIP'].map(level => (
                      <Badge
                        key={level}
                        variant={filters.vipLevels.includes(level) ? "default" : "outline"}
                        className="cursor-pointer text-xs"
                        onClick={() => handleMultiSelectChange('vipLevels', level)}
                      >
                        {level}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Retention статус</Label>
                  <Select value={filters.retentionStatus} onValueChange={(v) => handleFilterChange('retentionStatus', v)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Все статусы" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Все статусы</SelectItem>
                      <SelectItem value="new">Новый</SelectItem>
                      <SelectItem value="active">Активный</SelectItem>
                      <SelectItem value="at_risk">В зоне риска</SelectItem>
                      <SelectItem value="churning">Уходящий</SelectItem>
                      <SelectItem value="churned">Ушедший</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* AI/Предиктивные */}
            <div>
              <h3 className="flex items-center gap-2 text-sm font-medium mb-3">
                <Brain className="h-4 w-4" />
                AI прогнозы
              </h3>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                <div className="space-y-2">
                  <Label>Вероятность оттока (%)</Label>
                  <div className="flex gap-2">
                    <Input
                      type="number"
                      placeholder="От"
                      value={filters.churnProbabilityMin}
                      onChange={(e) => handleFilterChange('churnProbabilityMin', e.target.value)}
                    />
                    <Input
                      type="number"
                      placeholder="До"
                      value={filters.churnProbabilityMax}
                      onChange={(e) => handleFilterChange('churnProbabilityMax', e.target.value)}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Вероятность депозита 7д (%)</Label>
                  <Input
                    type="number"
                    placeholder="Минимум"
                    value={filters.depositProbability7d}
                    onChange={(e) => handleFilterChange('depositProbability7d', e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Next Best Offer</Label>
                  <Select value={filters.nextBestOffer} onValueChange={(v) => handleFilterChange('nextBestOffer', v)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Любое" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Любое</SelectItem>
                      <SelectItem value="deposit_bonus">Депозитный бонус</SelectItem>
                      <SelectItem value="free_spins">Фриспины</SelectItem>
                      <SelectItem value="cashback">Кэшбэк</SelectItem>
                      <SelectItem value="vip_upgrade">VIP апгрейд</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* Риски */}
            <div>
              <h3 className="flex items-center gap-2 text-sm font-medium mb-3">
                <Shield className="h-4 w-4" />
                Риски и ответственная игра
              </h3>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                <div className="space-y-2">
                  <Label>Лимиты установлены</Label>
                  <Select value={filters.hasLimits} onValueChange={(v) => handleFilterChange('hasLimits', v)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Любые" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Любые</SelectItem>
                      <SelectItem value="yes">Да</SelectItem>
                      <SelectItem value="no">Нет</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Fraud Score (макс)</Label>
                  <Input
                    type="number"
                    placeholder="Максимум"
                    value={filters.fraudScoreMax}
                    onChange={(e) => handleFilterChange('fraudScoreMax', e.target.value)}
                  />
                </div>
              </div>
            </div>
          </CollapsibleContent>
        </Collapsible>
      </CardContent>
    </Card>
  );
}