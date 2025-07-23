"use client";

import { useState } from "react";
import { PlayersTable } from "@/components/players/players-table";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { AdvancedFilters } from "@/components/ui/advanced-filters";
import type { FilterConfig, FilterGroup } from "@/lib/types";

// Конфигурация фильтров для страницы игроков
const PLAYERS_FILTER_GROUPS: FilterGroup[] = [
  {
    id: 'playerId',
    label: 'ID игрока',
    type: 'text',
    placeholder: 'Введите ID игрока'
  },
  {
    id: 'registrationDate',
    label: 'Дата регистрации',
    type: 'daterange'
  },
  {
    id: 'segments',
    label: 'Сегмент',
    type: 'multiselect',
    options: [
      { value: 'active', label: 'Актив' },
      { value: 'reactivated', label: 'Реактив' },
      { value: 'churning', label: 'Предотток' },
      { value: 'new', label: 'Новорег' },
      { value: 'firstdeposit', label: 'Перводеп' },
    ]
  },
  {
    id: 'vipLevels',
    label: 'VIP уровень',
    type: 'multiselect',
    options: [
      { value: 'previp1', label: 'ПреVIP 1' },
      { value: 'previp2', label: 'ПреVIP 2' },
      { value: 'previp3', label: 'ПреVIP 3' },
      { value: 'vip', label: 'VIP' },
    ]
  },
  {
    id: 'depositAmount',
    label: 'Сумма депозита',
    type: 'range'
  },
  {
    id: 'minDeposit',
    label: 'Минимальный депозит',
    type: 'number',
    placeholder: '0'
  },
  {
    id: 'sources',
    label: 'Источник',
    type: 'multiselect',
    options: [
      { value: 'google', label: 'Google' },
      { value: 'facebook', label: 'Facebook' },
      { value: 'instagram', label: 'Instagram' },
      { value: 'tiktok', label: 'TikTok' },
      { value: 'organic', label: 'Органика' },
      { value: 'referral', label: 'Реферальная программа' },
    ]
  },
  {
    id: 'channels',
    label: 'Подключенные каналы',
    type: 'multiselect',
    options: [
      { value: 'sms', label: 'SMS' },
      { value: 'email', label: 'Email' },
      { value: 'telegram', label: 'Telegram' },
      { value: 'whatsapp', label: 'WhatsApp' },
      { value: 'push', label: 'Push' },
    ]
  },
  {
    id: 'lastInteractionChannel',
    label: 'Последний канал взаимодействия',
    type: 'select',
    options: [
      { value: 'sms', label: 'SMS' },
      { value: 'email', label: 'Email' },
      { value: 'telegram', label: 'Telegram' },
      { value: 'whatsapp', label: 'WhatsApp' },
      { value: 'push', label: 'Push' },
    ],
    placeholder: 'Выберите канал'
  }
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
