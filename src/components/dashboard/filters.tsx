"use client";

import { useState } from "react";
import { AdvancedFilters } from "@/components/ui/advanced-filters";
import type { FilterConfig, FilterGroup } from "@/lib/types";

// Конфигурация фильтров для командного центра
const DASHBOARD_FILTER_GROUPS: FilterGroup[] = [
  {
    id: 'games',
    label: 'Игра',
    type: 'multiselect',
    options: [
      { value: 'slots', label: 'Слоты' },
      { value: 'poker', label: 'Покер' },
      { value: 'blackjack', label: 'Блэкджек' },
      { value: 'roulette', label: 'Рулетка' },
      { value: 'sports', label: 'Спортбеттинг' },
    ]
  },
  {
    id: 'playerId',
    label: 'ID игрока',
    type: 'text',
    placeholder: 'Введите ID игрока'
  },
  {
    id: 'promocode',
    label: 'Промокод',
    type: 'text',
    placeholder: 'Введите промокод'
  },
  {
    id: 'dateRange',
    label: 'Период',
    type: 'daterange'
  },
  {
    id: 'depositAmount',
    label: 'Сумма депозита',
    type: 'range'
  },
  {
    id: 'trackingId',
    label: 'URL/Tracking ID',
    type: 'text',
    placeholder: 'Введите tracking ID'
  },
  {
    id: 'minDeposit',
    label: 'Минимальный депозит',
    type: 'number',
    placeholder: '0'
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
  }
];

interface FiltersProps {
  onFiltersChange?: (filters: FilterConfig) => void;
}

export function Filters({ onFiltersChange }: FiltersProps) {
  const [filters, setFilters] = useState<FilterConfig>({});

  const handleFiltersChange = (newFilters: FilterConfig) => {
    setFilters(newFilters);
    onFiltersChange?.(newFilters);
    
    // Здесь можно добавить логику применения фильтров
    console.log('Применены фильтры:', newFilters);
  };

  return (
    <AdvancedFilters
      filters={filters}
      onFiltersChange={handleFiltersChange}
      filterGroups={DASHBOARD_FILTER_GROUPS}
    />
  );
}