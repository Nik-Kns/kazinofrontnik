"use client";

import { useState } from "react";
import { CollapsibleFilters } from "@/components/ui/collapsible-filters";
import type { FilterConfig, FilterGroup } from "@/lib/types";

// Конфигурация фильтров для страницы аналитики
const ANALYTICS_FILTER_GROUPS: FilterGroup[] = [
  {
    id: 'vertical',
    label: 'Вертикаль',
    type: 'select',
    placeholder: 'Выберите вертикаль'
  },
  {
    id: 'games',
    label: 'Игры',
    type: 'multiselect',
    options: [] // Опции заполняются динамически в зависимости от вертикали
  },
  {
    id: 'dateRange',
    label: 'Период',
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
    id: 'depositAmount',
    label: 'Сумма депозита',
    type: 'range'
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

interface AnalyticsFiltersProps {
  onFiltersChange?: (filters: FilterConfig) => void;
  onSaveFilter?: (filters: FilterConfig) => void;
}

export function AnalyticsFilters({ onFiltersChange, onSaveFilter }: AnalyticsFiltersProps) {
  const [filters, setFilters] = useState<FilterConfig>({});

  const handleFiltersChange = (newFilters: FilterConfig) => {
    setFilters(newFilters);
    onFiltersChange?.(newFilters);
    
    // Сохраняем фильтры в localStorage для использования в дашборде
    if (Object.keys(newFilters).length > 0) {
      localStorage.setItem('analyticsFilters', JSON.stringify(newFilters));
      onSaveFilter?.(newFilters);
    }
  };

  return (
    <CollapsibleFilters
      filters={filters}
      onFiltersChange={handleFiltersChange}
      filterGroups={ANALYTICS_FILTER_GROUPS}
      defaultExpanded={true}
    />
  );
}