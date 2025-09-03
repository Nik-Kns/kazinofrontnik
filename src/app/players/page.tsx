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
import { Input } from "@/components/ui/input";
import { MultiSelect } from "@/components/ui/multi-select";

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

    const statusOptions = [
      { value: 'Активен', label: 'Активен' },
      { value: 'Спящий', label: 'Спящий' },
      { value: 'Отток', label: 'Отток' },
    ];
    const vipOptions = [
      { value: 'previp1', label: 'ПреVIP 1' },
      { value: 'previp2', label: 'ПреVIP 2' },
      { value: 'previp3', label: 'ПреVIP 3' },
      { value: 'vip', label: 'VIP' },
    ];
    const churnOptions = [
      { value: 'Низкий', label: 'Низкий' },
      { value: 'Средний', label: 'Средний' },
      { value: 'Высокий', label: 'Высокий' },
    ];
    const languageOptions = [
      { value: 'EN', label: 'EN' },
      { value: 'DE', label: 'DE' },
      { value: 'RU', label: 'RU' },
      { value: 'ES', label: 'ES' },
    ];

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
            
            {/* Убрали дублирующий переключатель валют из шапки */}
            
            {/* Горизонтальная панель фильтров */}
            <div className="rounded-lg border bg-card px-4 py-3 flex flex-wrap items-end gap-3">
              {/* Валютные */}
              <div className="flex items-end gap-2 pr-4 mr-2 border-r">
                <span className="text-xs font-medium text-muted-foreground">Валюты</span>
                <CurrencyFilters
                  value={currencyFilters}
                  onChange={setCurrencyFilters}
                  compact={true}
                />
              </div>

              {/* Быстрые фильтры */}
              <div className="flex flex-wrap items-end gap-3">
                <div className="space-y-1">
                  <label className="text-xs text-muted-foreground">ID</label>
                  <Input
                    className="h-9 w-[160px]"
                    placeholder="usr_..."
                    value={(filters.playerId as string) || ''}
                    onChange={(e) => setFilters(prev => ({ ...prev, playerId: e.target.value }))}
                  />
                </div>
                <div className="space-y-1 min-w-[220px]">
                  <label className="text-xs text-muted-foreground">Статус</label>
                  <MultiSelect
                    options={statusOptions}
                    selected={(filters.status as string[]) || []}
                    onChange={(selected) => setFilters(prev => ({ ...prev, status: selected }))}
                    placeholder="Выбрать"
                  />
                </div>
                <div className="space-y-1 min-w-[220px]">
                  <label className="text-xs text-muted-foreground">VIP</label>
                  <MultiSelect
                    options={vipOptions}
                    selected={(filters.vipLevels as string[]) || []}
                    onChange={(selected) => setFilters(prev => ({ ...prev, vipLevels: selected }))}
                    placeholder="Выбрать"
                  />
                </div>
                <div className="space-y-1 min-w-[220px]">
                  <label className="text-xs text-muted-foreground">Риск оттока</label>
                  <MultiSelect
                    options={churnOptions}
                    selected={(filters.churnRisk as string[]) || []}
                    onChange={(selected) => setFilters(prev => ({ ...prev, churnRisk: selected }))}
                    placeholder="Выбрать"
                  />
                </div>
                <div className="space-y-1 min-w-[220px]">
                  <label className="text-xs text-muted-foreground">Язык</label>
                  <MultiSelect
                    options={languageOptions}
                    selected={(filters.language as string[]) || []}
                    onChange={(selected) => setFilters(prev => ({ ...prev, language: selected as any }))}
                    placeholder="Выбрать"
                  />
                </div>
              </div>

              <div className="ml-auto flex items-center gap-2">
                <Button
                  variant="outline"
                  onClick={() => {
                    setFilters({});
                  }}
                >
                  Сбросить
                </Button>
                <Button onClick={() => setFilters(prev => ({ ...prev }))}>Применить</Button>
              </div>
            </div>
            
            {/* Секция разворачиваемых фильтров (оставим как отдельную страницу/кнопку при необходимости) */}
            {/* <AdvancedFilters ... /> можно оставить закомментированным */}
            
            <PlayersTable filters={filters} currencyFilters={currencyFilters} />
        </div>
    );
}
