'use client';

import React, { useState } from 'react';
import { X, Filter, Calendar } from 'lucide-react';
import { Button } from './button';
import { Input } from './input';
import { Badge } from './badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './select';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from './popover';
import { Calendar as CalendarComponent } from './calendar';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';
import type { FilterConfig, FilterGroup, ChannelType, SegmentType, VipLevel } from '@/lib/types';

interface AdvancedFiltersProps {
  filters: FilterConfig;
  onFiltersChange: (filters: FilterConfig) => void;
  filterGroups: FilterGroup[];
  className?: string;
}

// Предопределенные опции для фильтров
const SEGMENT_OPTIONS = [
  { value: 'active' as SegmentType, label: 'Актив' },
  { value: 'reactivated' as SegmentType, label: 'Реактив' },
  { value: 'churning' as SegmentType, label: 'Предотток' },
  { value: 'new' as SegmentType, label: 'Новорег' },
  { value: 'firstdeposit' as SegmentType, label: 'Перводеп' },
];

const CHANNEL_OPTIONS = [
  { value: 'sms' as ChannelType, label: 'SMS' },
  { value: 'email' as ChannelType, label: 'Email' },
  { value: 'telegram' as ChannelType, label: 'Telegram' },
  { value: 'whatsapp' as ChannelType, label: 'WhatsApp' },
  { value: 'push' as ChannelType, label: 'Push' },
];

const VIP_OPTIONS = [
  { value: 'previp1' as VipLevel, label: 'ПреVIP 1' },
  { value: 'previp2' as VipLevel, label: 'ПреVIP 2' },
  { value: 'previp3' as VipLevel, label: 'ПреVIP 3' },
  { value: 'vip' as VipLevel, label: 'VIP' },
];

export function AdvancedFilters({
  filters,
  onFiltersChange,
  filterGroups,
  className = '',
}: AdvancedFiltersProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [tempFilters, setTempFilters] = useState<FilterConfig>(filters);

  // Подсчет активных фильтров
  const activeFiltersCount = Object.values(filters).filter(
    (value) => value !== undefined && value !== null && 
    (Array.isArray(value) ? value.length > 0 : true)
  ).length;

  const handleApplyFilters = () => {
    onFiltersChange(tempFilters);
    setIsOpen(false);
  };

  const handleResetFilters = () => {
    setTempFilters({});
    onFiltersChange({});
  };

  const renderFilterControl = (group: FilterGroup) => {
    switch (group.type) {
      case 'text':
        return (
          <Input
            placeholder={group.placeholder}
            value={(tempFilters as any)[group.id] || ''}
            onChange={(e) => setTempFilters({
              ...tempFilters,
              [group.id]: e.target.value
            })}
          />
        );

      case 'select':
        return (
          <Select
            value={(tempFilters as any)[group.id] || ''}
            onValueChange={(value) => setTempFilters({
              ...tempFilters,
              [group.id]: value
            })}
          >
            <SelectTrigger>
              <SelectValue placeholder={group.placeholder} />
            </SelectTrigger>
            <SelectContent>
              {group.options?.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        );

      case 'multiselect':
        const selectedValues = (tempFilters as any)[group.id] || [];
        return (
          <div className="space-y-2">
            <div className="flex flex-wrap gap-2">
              {group.options?.map((option) => (
                <Badge
                  key={option.value}
                  variant={selectedValues.includes(option.value) ? 'default' : 'outline'}
                  className="cursor-pointer"
                  onClick={() => {
                    const newValues = selectedValues.includes(option.value)
                      ? selectedValues.filter((v: string) => v !== option.value)
                      : [...selectedValues, option.value];
                    setTempFilters({
                      ...tempFilters,
                      [group.id]: newValues
                    });
                  }}
                >
                  {option.label}
                </Badge>
              ))}
            </div>
          </div>
        );

      case 'daterange':
        const dateRange = (tempFilters as any)[group.id] || {};
        return (
          <div className="flex gap-2">
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" size="sm">
                  <Calendar className="h-4 w-4 mr-2" />
                  {dateRange.from ? format(new Date(dateRange.from), 'dd.MM.yyyy', { locale: ru }) : 'От'}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <CalendarComponent
                  mode="single"
                  selected={dateRange.from ? new Date(dateRange.from) : undefined}
                  onSelect={(date) => setTempFilters({
                    ...tempFilters,
                    [group.id]: { ...dateRange, from: date }
                  })}
                  locale={ru}
                />
              </PopoverContent>
            </Popover>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" size="sm">
                  <Calendar className="h-4 w-4 mr-2" />
                  {dateRange.to ? format(new Date(dateRange.to), 'dd.MM.yyyy', { locale: ru }) : 'До'}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <CalendarComponent
                  mode="single"
                  selected={dateRange.to ? new Date(dateRange.to) : undefined}
                  onSelect={(date) => setTempFilters({
                    ...tempFilters,
                    [group.id]: { ...dateRange, to: date }
                  })}
                  locale={ru}
                />
              </PopoverContent>
            </Popover>
          </div>
        );

      case 'range':
        const range = (tempFilters as any)[group.id] || {};
        return (
          <div className="flex gap-2">
            <Input
              type="number"
              placeholder="От"
              value={range.min || ''}
              onChange={(e) => setTempFilters({
                ...tempFilters,
                [group.id]: { ...range, min: Number(e.target.value) }
              })}
            />
            <Input
              type="number"
              placeholder="До"
              value={range.max || ''}
              onChange={(e) => setTempFilters({
                ...tempFilters,
                [group.id]: { ...range, max: Number(e.target.value) }
              })}
            />
          </div>
        );

      case 'number':
        return (
          <Input
            type="number"
            placeholder={group.placeholder}
            value={(tempFilters as any)[group.id] || ''}
            onChange={(e) => setTempFilters({
              ...tempFilters,
              [group.id]: Number(e.target.value)
            })}
          />
        );

      default:
        return null;
    }
  };

  return (
    <div className={className}>
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button variant="outline" className="gap-2">
            <Filter className="h-4 w-4" />
            Фильтры
            {activeFiltersCount > 0 && (
              <Badge variant="default" className="ml-1">
                {activeFiltersCount}
              </Badge>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[600px] p-0" align="start">
          <div className="p-4 border-b">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold">Фильтры</h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsOpen(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
          
          <div className="p-4 space-y-4 max-h-[500px] overflow-y-auto">
            {filterGroups.map((group) => (
              <div key={group.id} className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  {group.label}
                </label>
                {renderFilterControl(group)}
              </div>
            ))}
          </div>

          <div className="p-4 border-t flex justify-between">
            <Button
              variant="ghost"
              onClick={handleResetFilters}
            >
              Сбросить
            </Button>
            <Button
              onClick={handleApplyFilters}
            >
              Применить
            </Button>
          </div>
        </PopoverContent>
      </Popover>

      {/* Отображение активных фильтров */}
      {activeFiltersCount > 0 && (
        <div className="mt-2 flex flex-wrap gap-2">
          {Object.entries(filters).map(([key, value]) => {
            if (!value || (Array.isArray(value) && value.length === 0)) return null;
            
            return (
              <Badge
                key={key}
                variant="secondary"
                className="gap-1"
              >
                {key}: {Array.isArray(value) ? value.join(', ') : String(value)}
                <X
                  className="h-3 w-3 cursor-pointer"
                  onClick={() => {
                    const newFilters = { ...filters };
                    delete newFilters[key as keyof FilterConfig];
                    onFiltersChange(newFilters);
                  }}
                />
              </Badge>
            );
          })}
        </div>
      )}
    </div>
  );
}