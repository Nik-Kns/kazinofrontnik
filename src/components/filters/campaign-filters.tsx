"use client";

import * as React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Collapsible, CollapsibleContent } from "@/components/ui/collapsible";
import { Separator } from "@/components/ui/separator";
import { 
  Filter, 
  X,
  Calendar,
  Users,
  Target,
  DollarSign,
  Brain,
  Shield,
  BarChart3,
  TrendingUp,
  Mail,
  Activity
} from "lucide-react";

interface CampaignFiltersProps {
  onFiltersChange?: (filters: any) => void;
}

export function CampaignFilters({ onFiltersChange }: CampaignFiltersProps) {
  const [isExpanded, setIsExpanded] = React.useState(false);
  const [filters, setFilters] = React.useState({
    // Базовые фильтры
    search: '',
    status: '',
    type: '',
    channel: '',
    
    // Даты
    dateFrom: '',
    dateTo: '',
    
    // Эффективность
    minROI: '',
    maxROI: '',
    minConversion: '',
    maxConversion: '',
    minRevenue: '',
    maxRevenue: '',
    
    // Аудитория
    targetSegments: [] as string[],
    minAudience: '',
    maxAudience: '',
    countries: [] as string[],
    
    // Финансовые
    minBudget: '',
    maxBudget: '',
    minCost: '',
    maxCost: '',
    
    // Метрики активности
    minOpenRate: '',
    minClickRate: '',
    minBonusUsage: '',
    
    // Целевые метрики
    targetGGR: '',
    targetRetention: '',
    targetLTV: '',
    targetDeposits: '',
    
    // AI прогнозы
    predictedROI: '',
    successProbability: '',
    riskLevel: ''
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
      status: '',
      type: '',
      channel: '',
      dateFrom: '',
      dateTo: '',
      minROI: '',
      maxROI: '',
      minConversion: '',
      maxConversion: '',
      minRevenue: '',
      maxRevenue: '',
      targetSegments: [],
      minAudience: '',
      maxAudience: '',
      countries: [],
      minBudget: '',
      maxBudget: '',
      minCost: '',
      maxCost: '',
      minOpenRate: '',
      minClickRate: '',
      minBonusUsage: '',
      targetGGR: '',
      targetRetention: '',
      targetLTV: '',
      targetDeposits: '',
      predictedROI: '',
      successProbability: '',
      riskLevel: ''
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
          Фильтры кампаний
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Основные фильтры */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <div className="space-y-2">
            <Label htmlFor="search">Поиск</Label>
            <Input
              id="search"
              placeholder="Название кампании..."
              value={filters.search}
              onChange={(e) => handleFilterChange('search', e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label>Статус</Label>
            <Select value={filters.status} onValueChange={(v) => handleFilterChange('status', v)}>
              <SelectTrigger>
                <SelectValue placeholder="Все статусы" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Все статусы</SelectItem>
                <SelectItem value="active">Активная</SelectItem>
                <SelectItem value="scheduled">Запланирована</SelectItem>
                <SelectItem value="paused">На паузе</SelectItem>
                <SelectItem value="completed">Завершена</SelectItem>
                <SelectItem value="draft">Черновик</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Тип кампании</Label>
            <Select value={filters.type} onValueChange={(v) => handleFilterChange('type', v)}>
              <SelectTrigger>
                <SelectValue placeholder="Все типы" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Все типы</SelectItem>
                <SelectItem value="reactivation">Реактивация</SelectItem>
                <SelectItem value="welcome">Приветственная</SelectItem>
                <SelectItem value="vip">VIP программа</SelectItem>
                <SelectItem value="tournament">Турнир</SelectItem>
                <SelectItem value="retention">Удержание</SelectItem>
                <SelectItem value="conversion">Конверсия</SelectItem>
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
                <SelectItem value="email">Email</SelectItem>
                <SelectItem value="sms">SMS</SelectItem>
                <SelectItem value="push">Push</SelectItem>
                <SelectItem value="inapp">In-App</SelectItem>
                <SelectItem value="multi">Мульти-канал</SelectItem>
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
            
            {/* Период кампании */}
            <div>
              <h3 className="flex items-center gap-2 text-sm font-medium mb-3">
                <Calendar className="h-4 w-4" />
                Период кампании
              </h3>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label>Дата начала</Label>
                  <Input
                    type="date"
                    value={filters.dateFrom}
                    onChange={(e) => handleFilterChange('dateFrom', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Дата окончания</Label>
                  <Input
                    type="date"
                    value={filters.dateTo}
                    onChange={(e) => handleFilterChange('dateTo', e.target.value)}
                  />
                </div>
              </div>
            </div>

            {/* Эффективность */}
            <div>
              <h3 className="flex items-center gap-2 text-sm font-medium mb-3">
                <TrendingUp className="h-4 w-4" />
                Эффективность кампании
              </h3>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                <div className="space-y-2">
                  <Label>ROI (%)</Label>
                  <div className="flex gap-2">
                    <Input
                      type="number"
                      placeholder="От"
                      value={filters.minROI}
                      onChange={(e) => handleFilterChange('minROI', e.target.value)}
                    />
                    <Input
                      type="number"
                      placeholder="До"
                      value={filters.maxROI}
                      onChange={(e) => handleFilterChange('maxROI', e.target.value)}
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label>Конверсия (%)</Label>
                  <div className="flex gap-2">
                    <Input
                      type="number"
                      placeholder="От"
                      value={filters.minConversion}
                      onChange={(e) => handleFilterChange('minConversion', e.target.value)}
                    />
                    <Input
                      type="number"
                      placeholder="До"
                      value={filters.maxConversion}
                      onChange={(e) => handleFilterChange('maxConversion', e.target.value)}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Доход (€)</Label>
                  <div className="flex gap-2">
                    <Input
                      type="number"
                      placeholder="От"
                      value={filters.minRevenue}
                      onChange={(e) => handleFilterChange('minRevenue', e.target.value)}
                    />
                    <Input
                      type="number"
                      placeholder="До"
                      value={filters.maxRevenue}
                      onChange={(e) => handleFilterChange('maxRevenue', e.target.value)}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Open Rate (мин %)</Label>
                  <Input
                    type="number"
                    placeholder="Минимум"
                    value={filters.minOpenRate}
                    onChange={(e) => handleFilterChange('minOpenRate', e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Click Rate (мин %)</Label>
                  <Input
                    type="number"
                    placeholder="Минимум"
                    value={filters.minClickRate}
                    onChange={(e) => handleFilterChange('minClickRate', e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Использование бонусов (мин %)</Label>
                  <Input
                    type="number"
                    placeholder="Минимум"
                    value={filters.minBonusUsage}
                    onChange={(e) => handleFilterChange('minBonusUsage', e.target.value)}
                  />
                </div>
              </div>
            </div>

            {/* Целевые метрики */}
            <div>
              <h3 className="flex items-center gap-2 text-sm font-medium mb-3">
                <Target className="h-4 w-4" />
                Целевые KPI
              </h3>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <div className="space-y-2">
                  <Label>Целевой GGR (€)</Label>
                  <Input
                    type="number"
                    placeholder="Минимум"
                    value={filters.targetGGR}
                    onChange={(e) => handleFilterChange('targetGGR', e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Целевой Retention (%)</Label>
                  <Input
                    type="number"
                    placeholder="Минимум"
                    value={filters.targetRetention}
                    onChange={(e) => handleFilterChange('targetRetention', e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Целевой LTV (€)</Label>
                  <Input
                    type="number"
                    placeholder="Минимум"
                    value={filters.targetLTV}
                    onChange={(e) => handleFilterChange('targetLTV', e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Целевые депозиты</Label>
                  <Input
                    type="number"
                    placeholder="Минимум"
                    value={filters.targetDeposits}
                    onChange={(e) => handleFilterChange('targetDeposits', e.target.value)}
                  />
                </div>
              </div>
            </div>

            {/* Аудитория */}
            <div>
              <h3 className="flex items-center gap-2 text-sm font-medium mb-3">
                <Users className="h-4 w-4" />
                Целевая аудитория
              </h3>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                <div className="space-y-2">
                  <Label>Размер аудитории</Label>
                  <div className="flex gap-2">
                    <Input
                      type="number"
                      placeholder="От"
                      value={filters.minAudience}
                      onChange={(e) => handleFilterChange('minAudience', e.target.value)}
                    />
                    <Input
                      type="number"
                      placeholder="До"
                      value={filters.maxAudience}
                      onChange={(e) => handleFilterChange('maxAudience', e.target.value)}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Сегменты</Label>
                  <div className="flex flex-wrap gap-1">
                    {['VIP', 'Active', 'New', 'Churning', 'Reactivated'].map(segment => (
                      <Badge
                        key={segment}
                        variant={filters.targetSegments.includes(segment) ? "default" : "outline"}
                        className="cursor-pointer"
                        onClick={() => handleMultiSelectChange('targetSegments', segment)}
                      >
                        {segment}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Страны</Label>
                  <div className="flex flex-wrap gap-1">
                    {['DE', 'FR', 'UK', 'ES', 'IT', 'RU'].map(country => (
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
              </div>
            </div>

            {/* Бюджет */}
            <div>
              <h3 className="flex items-center gap-2 text-sm font-medium mb-3">
                <DollarSign className="h-4 w-4" />
                Бюджет и расходы
              </h3>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label>Бюджет кампании (€)</Label>
                  <div className="flex gap-2">
                    <Input
                      type="number"
                      placeholder="От"
                      value={filters.minBudget}
                      onChange={(e) => handleFilterChange('minBudget', e.target.value)}
                    />
                    <Input
                      type="number"
                      placeholder="До"
                      value={filters.maxBudget}
                      onChange={(e) => handleFilterChange('maxBudget', e.target.value)}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Фактические расходы (€)</Label>
                  <div className="flex gap-2">
                    <Input
                      type="number"
                      placeholder="От"
                      value={filters.minCost}
                      onChange={(e) => handleFilterChange('minCost', e.target.value)}
                    />
                    <Input
                      type="number"
                      placeholder="До"
                      value={filters.maxCost}
                      onChange={(e) => handleFilterChange('maxCost', e.target.value)}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* AI прогнозы */}
            <div>
              <h3 className="flex items-center gap-2 text-sm font-medium mb-3">
                <Brain className="h-4 w-4" />
                AI анализ и прогнозы
              </h3>
              <div className="grid gap-4 md:grid-cols-3">
                <div className="space-y-2">
                  <Label>Прогнозируемый ROI (%)</Label>
                  <Input
                    type="number"
                    placeholder="Минимум"
                    value={filters.predictedROI}
                    onChange={(e) => handleFilterChange('predictedROI', e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Вероятность успеха (%)</Label>
                  <Input
                    type="number"
                    placeholder="Минимум"
                    value={filters.successProbability}
                    onChange={(e) => handleFilterChange('successProbability', e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Уровень риска</Label>
                  <Select value={filters.riskLevel} onValueChange={(v) => handleFilterChange('riskLevel', v)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Любой" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Любой</SelectItem>
                      <SelectItem value="low">Низкий</SelectItem>
                      <SelectItem value="medium">Средний</SelectItem>
                      <SelectItem value="high">Высокий</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </CollapsibleContent>
        </Collapsible>
      </CardContent>
    </Card>
  );
}