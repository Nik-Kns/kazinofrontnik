"use client";

import { useState } from "react";
import { PlayersTable } from "@/components/players/players-table";
import { Button } from "@/components/ui/button";
import { PlusCircle, Upload, Download } from "lucide-react";
import { AdvancedFilters } from "@/components/ui/advanced-filters";
import { CurrencyFilters, type CurrencyFiltersState } from "@/components/ui/currency-filters";
import { CompactCurrencyToggle } from "@/components/ui/currency-toggle";
import { Separator } from "@/components/ui/separator";
import type { FilterConfig, FilterGroup } from "@/lib/types";

// Конфигурация фильтров для страницы игроков (соответствует ТЗ)
const PLAYERS_FILTER_GROUPS: FilterGroup[] = [
  { id: 'playerId', label: 'ID игрока', type: 'text', placeholder: 'Введите ID игрока' },
  { id: 'status', label: 'Статус', type: 'multiselect', options: [
    { value: 'Активен', label: 'Активен' },
    { value: 'Спящий', label: 'Спящий' },
    { value: 'Отток', label: 'Отток' },
  ] },
  { id: 'churnRisk', label: 'Риск оттока', type: 'multiselect', options: [
    { value: 'Низкий', label: 'Низкий' },
    { value: 'Средний', label: 'Средний' },
    { value: 'Высокий', label: 'Высокий' },
  ] },
  { id: 'vipLevels', label: 'VIP уровень', type: 'multiselect', options: [
    { value: 'previp1', label: 'ПреVIP 1' },
    { value: 'previp2', label: 'ПреVIP 2' },
    { value: 'previp3', label: 'ПреVIP 3' },
    { value: 'vip', label: 'VIP' },
  ] },
  { id: 'language', label: 'Язык', type: 'multiselect', options: [
    { value: 'EN', label: 'EN' },
    { value: 'DE', label: 'DE' },
    { value: 'RU', label: 'RU' },
    { value: 'ES', label: 'ES' },
  ] },
  { id: 'ltvRange', label: 'LTV', type: 'range' },
  { id: 'lastActivity', label: 'Последняя активность', type: 'daterange' },
  { id: 'depositAmount', label: 'Сумма депозитов', type: 'range' },
];

export default function PlayersPage() {
    const [filters, setFilters] = useState<FilterConfig>({});
    const [currencyFilters, setCurrencyFilters] = useState<CurrencyFiltersState>({
        display_mode: 'native',
        selected_currencies: [],
        is_multi_currency: undefined,
        amount_range: undefined
    });

    const handleFiltersChange = (newFilters: FilterConfig) => {
        setFilters(newFilters);
        // Здесь можно добавить логику фильтрации игроков
        console.log('Применены фильтры для игроков:', newFilters);
    };

    const handleCurrencyFiltersChange = (newCurrencyFilters: CurrencyFiltersState) => {
        setCurrencyFilters(newCurrencyFilters);
        // Здесь можно добавить логику валютной фильтрации
        console.log('Применены валютные фильтры:', newCurrencyFilters);
    };

    return (
        <div className="p-4 md:p-6 lg:p-8 space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Игроки</h1>
                    <p className="text-muted-foreground">
                        Поиск, фильтрация и просмотр профилей игроков.
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <Button variant="outline">
                        <Upload className="mr-2 h-4 w-4" />
                        Импортировать
                    </Button>
                    <Button variant="outline">
                        <Download className="mr-2 h-4 w-4" />
                        Экспортировать
                    </Button>
                    <Button>
                        <PlusCircle className="mr-2 h-4 w-4" />
                        Добавить игрока
                    </Button>
                </div>
            </div>
            
            {/* Компактный переключатель валют в шапке */}
            <div className="flex items-center justify-between py-2 border-b bg-muted/30 -mx-4 md:-mx-6 lg:-mx-8 px-4 md:px-6 lg:px-8">
                <CompactCurrencyToggle />
                <div className="text-xs text-muted-foreground">
                    {currencyFilters.selected_currencies.length > 0 && (
                        `Фильтр: ${currencyFilters.selected_currencies.join(', ')}`
                    )}
                </div>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                {/* Основные фильтры */}
                <div className="lg:col-span-3">
                    <AdvancedFilters
                        filters={filters}
                        onFiltersChange={handleFiltersChange}
                        filterGroups={PLAYERS_FILTER_GROUPS}
                    />
                </div>
                
                {/* Валютные фильтры */}
                <div className="lg:col-span-1">
                    <CurrencyFilters
                        value={currencyFilters}
                        onChange={handleCurrencyFiltersChange}
                        compact={false}
                    />
                </div>
            </div>
            
            <PlayersTable filters={filters} currencyFilters={currencyFilters} />
        </div>
    );
}
