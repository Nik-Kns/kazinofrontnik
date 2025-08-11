"use client";

import { useState } from "react";
import { PlayersTable } from "@/components/players/players-table";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { AdvancedFilters } from "@/components/ui/advanced-filters";
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

    const handleFiltersChange = (newFilters: FilterConfig) => {
        setFilters(newFilters);
        // Здесь можно добавить логику фильтрации игроков
        console.log('Применены фильтры для игроков:', newFilters);
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
                <Button>
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Добавить игрока
                </Button>
            </div>
            <AdvancedFilters
                filters={filters}
                onFiltersChange={handleFiltersChange}
                filterGroups={PLAYERS_FILTER_GROUPS}
            />
            <PlayersTable filters={filters} />
        </div>
    );
}
