"use client";

import * as React from "react";

import Link from "next/link";
import { playersData } from "@/lib/mock-data";
import { extendedPlayersData, type ExtendedPlayerData } from "@/lib/mock-multicurrency-players";
import { Badge } from "@/components/ui/badge";
import { Button } from "../ui/button";
import { Settings, ArrowUpDown, Info } from "lucide-react";
import { cn } from "@/lib/utils";
import type { FilterConfig } from "@/lib/types";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { 
  MultiCurrencyBadge, 
  CurrencyAmountDisplay, 
  MultiCurrencyChip 
} from "@/components/ui/currency-badge";
import { 
  Tooltip, 
  TooltipContent, 
  TooltipProvider, 
  TooltipTrigger 
} from "@/components/ui/tooltip";
import { useCurrency } from "@/contexts/currency-context";
import { type CurrencyFiltersState } from "@/components/ui/currency-filters";
import { filterPlayersByCurrency } from "@/lib/currency-utils";
import { useFilteredPlayers } from '@/hooks/use-filtered-players';
import { Skeleton } from "@/components/ui/skeleton";

const statusColors = {
    'Активен': 'bg-success/20 text-success-foreground',
    'Спящий': 'bg-warning/20 text-warning-foreground',
    'Отток': 'bg-destructive/20 text-destructive-foreground',
};

const riskColors = {
    'Низкий': 'text-success',
    'Средний': 'text-warning',
    'Высокий': 'text-destructive',
};

interface PlayersTableProps {
    filters: FilterConfig;
    currencyFilters: CurrencyFiltersState;
}

export function PlayersTable({ filters, currencyFilters }: PlayersTableProps) {
    const { state: currencyState } = useCurrency();
    const { isLoading, filteredPlayers } = useFilteredPlayers(filters, currencyFilters);
 
    const [visibleCols, setVisibleCols] = React.useState<string[]>([]);
    const [configOpen, setConfigOpen] = React.useState(false);
    React.useEffect(() => {
        try {
            const savedCols = localStorage.getItem('playersVisibleCols');
            if (savedCols) {
                setVisibleCols(JSON.parse(savedCols));
            }
        } catch (error) {
            console.error("Failed to parse visible columns from localStorage", error);
        }
    }, []);
    
    // Функция для определения цвета прогресс-бара риска
    const getRiskProgressColor = (risk: string) => {
        switch (risk) {
            case 'Низкий': return 'bg-green-500';
            case 'Средний': return 'bg-yellow-500';
            case 'Высокий': return 'bg-red-500';
            default: return 'bg-gray-500';
        }
    };
    
    // Функция для получения значения риска в процентах
    const getRiskValue = (risk: string) => {
        switch (risk) {
            case 'Низкий': return 20;
            case 'Средний': return 60;
            case 'Высокий': return 90;
            default: return 0;
        }
    };

    const toggleCol = (id: string, checked: boolean) => {
      setVisibleCols(prev => {
        const next = checked ? Array.from(new Set([...prev, id])) : prev.filter(c => c !== id);
        try { localStorage.setItem('playersVisibleCols', JSON.stringify(next)); } catch {}
        return next;
      });
    };

    const has = (id: string) => visibleCols.includes(id);

    return (
      <div className="space-y-4">
            <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold">Найдено игроков: {isLoading ? <Skeleton className="h-6 w-12 inline-block" /> : filteredPlayers.length}</h2>
          <Dialog open={configOpen} onOpenChange={setConfigOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm"><Settings className="h-4 w-4 mr-2"/>Настроить отображение</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Выберите дополнительные столбцы</DialogTitle>
              </DialogHeader>
              <div className="grid grid-cols-2 gap-2 text-sm">
                {(['balance','currency','geo','depositsCount','depositsSum','avgDeposit','lastDeposit','withdrawalsCount','withdrawalsSum','retention','loginFrequency','gamesCount','topGame','vip','bonuses','lastCampaign'] || []).map((id) => (
                  <label key={id} className="flex items-center gap-2">
                    <input type="checkbox" checked={has(id)} onChange={(e) => toggleCol(id, e.target.checked)} />
                    <span>
                      {id === 'balance' && 'Баланс'}
                      {id === 'currency' && 'Валюта'}
                      {id === 'geo' && 'GEO / язык'}
                      {id === 'depositsCount' && 'Кол-во депозитов'}
                      {id === 'depositsSum' && 'Сумма депозитов'}
                      {id === 'avgDeposit' && 'Средний депозит'}
                      {id === 'lastDeposit' && 'Последняя сумма депозита'}
                      {id === 'withdrawalsCount' && 'Кол-во выводов'}
                      {id === 'withdrawalsSum' && 'Сумма выводов'}
                      {id === 'retention' && 'Retention D1/D7/D30'}
                      {id === 'loginFrequency' && 'Частота входов'}
                      {id === 'gamesCount' && 'Кол-во игр'}
                      {id === 'topGame' && 'Популярная игра'}
                      {id === 'vip' && 'VIP статус'}
                      {id === 'bonuses' && 'Применённые бонусы'}
                      {id === 'lastCampaign' && 'Реакция на кампанию'}
                                                </span>
                  </label>
                ))}
                                            </div>
            </DialogContent>
          </Dialog>
                                        </div>

        <div className="overflow-auto rounded-md border">
          <table className="min-w-[1000px] w-full text-sm">
            <thead className="sticky top-0 bg-background">
              <tr className="border-b">
                <th className="px-3 py-2 text-left">ID игрока</th>
                <th className="px-3 py-2 text-left">Имя</th>
                <th className="px-3 py-2 text-left">Статус</th>
                <th className="px-3 py-2 text-left">VIP</th>
                <th className="px-3 py-2 text-left">
                  <div className="flex items-center gap-1">
                    Валюты кошельков
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger>
                          <Info className="h-3 w-3 text-muted-foreground" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <div className="text-xs">
                            Валюты игрока и количество кошельков
                          </div>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                </th>
                <th className="px-3 py-2 text-left">
                  <div className="flex items-center gap-1">
                    Total Deposits
                    {!currencyState.settings?.show_in_base_currency && (
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger>
                            <ArrowUpDown className="h-3 w-3 text-muted-foreground opacity-50" />
                          </TooltipTrigger>
                          <TooltipContent>
                            <div className="text-xs">
                              Сортировка доступна после включения конвертации
                            </div>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    )}
                  </div>
                </th>
                <th className="px-3 py-2 text-left">
                  <div className="flex items-center gap-1">
                    Net Deposits
                    {!currencyState.settings?.show_in_base_currency && (
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger>
                            <ArrowUpDown className="h-3 w-3 text-muted-foreground opacity-50" />
                          </TooltipTrigger>
                          <TooltipContent>
                            <div className="text-xs">
                              Сортировка доступна после включения конвертации
                            </div>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    )}
                  </div>
                </th>
                <th className="px-3 py-2 text-left">
                  <div className="flex items-center gap-1">
                    GGR
                    {!currencyState.settings?.show_in_base_currency && (
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger>
                            <ArrowUpDown className="h-3 w-3 text-muted-foreground opacity-50" />
                          </TooltipTrigger>
                          <TooltipContent>
                            <div className="text-xs">
                              Сортировка доступна после включения конвертации
                            </div>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    )}
                  </div>
                </th>
                <th className="px-3 py-2 text-left">Последняя активность</th>
                <th className="px-3 py-2 text-left">Риск оттока</th>
                {has('geo') && <th className="px-3 py-2 text-left">GEO/Язык</th>}
                {has('withdrawalsSum') && <th className="px-3 py-2 text-left">Сумма выводов</th>}
                {has('retention') && <th className="px-3 py-2 text-left">Retention</th>}
                {has('loginFrequency') && <th className="px-3 py-2 text-left">Частота входов</th>}
                {has('gamesCount') && <th className="px-3 py-2 text-left">Кол-во игр</th>}
                {has('topGame') && <th className="px-3 py-2 text-left">Популярная игра</th>}
                {has('vip') && <th className="px-3 py-2 text-left">VIP</th>}
                {has('bonuses') && <th className="px-3 py-2 text-left">Бонусы</th>}
                {has('lastCampaign') && <th className="px-3 py-2 text-left">Реакция</th>}
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                Array.from({ length: 5 }).map((_, index) => (
                  <tr key={index} className="border-b">
                    <td className="px-3 py-2"><Skeleton className="h-5 w-20" /></td>
                    <td className="px-3 py-2"><Skeleton className="h-5 w-32" /></td>
                    <td className="px-3 py-2"><Skeleton className="h-6 w-24" /></td>
                    <td className="px-3 py-2"><Skeleton className="h-6 w-24" /></td>
                    <td className="px-3 py-2"><Skeleton className="h-6 w-32" /></td>
                    <td className="px-3 py-2"><Skeleton className="h-5 w-40" /></td>
                    <td className="px-3 py-2"><Skeleton className="h-5 w-40" /></td>
                    <td className="px-3 py-2"><Skeleton className="h-5 w-40" /></td>
                    <td className="px-3 py-2"><Skeleton className="h-5 w-24" /></td>
                    <td className="px-3 py-2"><Skeleton className="h-5 w-16" /></td>
                  </tr>
                ))
              ) : (
                filteredPlayers.map((p) => (
                  <tr key={p.player_id} className="border-b hover:bg-muted/40 cursor-pointer" onClick={() => window.location.assign(`/players/${p.player_id}`)}>
                    <td className="px-3 py-2">usr_{p.player_id}</td>
                    <td className="px-3 py-2">{p.name}</td>
                    <td className="px-3 py-2">
                      <Badge variant="outline" className={cn(statusColors[p.status])}>
                        {p.status}
                      </Badge>
                    </td>
                    <td className="px-3 py-2">
                      <Badge variant="outline" className={
                        p.vip_level === 'VIP' ? 'bg-purple-100 text-purple-800 border-purple-200' :
                        p.vip_level.startsWith('ПреVIP') ? 'bg-blue-100 text-blue-800 border-blue-200' :
                        'bg-gray-100 text-gray-800 border-gray-200'
                      }>
                        {p.vip_level}
                      </Badge>
                    </td>
                    <td className="px-3 py-2">
                      <MultiCurrencyBadge 
                        currencies={p.currencies}
                        primaryCurrency={p.primary_currency}
                        walletBalances={p.wallet_balances}
                        maxVisible={2}
                        size="sm"
                      />
                    </td>
                    <td className="px-3 py-2">
                      <CurrencyAmountDisplay 
                        amount={p.financial_metrics.total_deposits}
                        size="sm"
                      />
                    </td>
                    <td className="px-3 py-2">
                      <CurrencyAmountDisplay 
                        amount={p.financial_metrics.net_deposits}
                        size="sm"
                      />
                    </td>
                    <td className="px-3 py-2">
                      <CurrencyAmountDisplay 
                        amount={p.financial_metrics.ggr}
                        size="sm"
                      />
                    </td>
                    <td className="px-3 py-2 text-sm text-muted-foreground">
                      {new Date(p.last_activity).toLocaleDateString('ru-RU', {
                        day: '2-digit',
                        month: '2-digit',
                        year: '2-digit',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </td>
                    <td className={cn("px-3 py-2 font-medium", riskColors[p.churn_risk])}>
                      {p.churn_risk}
                    </td>
                    {has('geo') && <td className="px-3 py-2">{p.country} / {p.language}</td>}
                    {has('lastDeposit') && <td className="px-3 py-2">€{Math.round((p.ltv%200)+20)}</td>}
                    {has('withdrawalsCount') && <td className="px-3 py-2">{Math.floor(p.ltv/400)}</td>}
                    {has('withdrawalsSum') && <td className="px-3 py-2">€{Math.round(p.ltv*0.2)}</td>}
                    {has('retention') && <td className="px-3 py-2">D1 35% · D7 20% · D30 12%</td>}
                    {has('loginFrequency') && <td className="px-3 py-2">{Math.max(1,Math.floor(7 - p.id.length))}/нед</td>}
                    {has('gamesCount') && <td className="px-3 py-2">{Math.floor(p.ltv/25)}</td>}
                    {has('topGame') && <td className="px-3 py-2">Book of Dead</td>}
                    {has('vip') && <td className="px-3 py-2">{p.ltv>5000 ? 'VIP' : '-'}</td>}
                    {has('bonuses') && <td className="px-3 py-2">{p.ltv>1000 ? 'Welcome, Cashback' : 'Welcome'}</td>}
                    {has('lastCampaign') && <td className="px-3 py-2">Open 45% / CTR 12%</td>}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        </div>
    );
}
