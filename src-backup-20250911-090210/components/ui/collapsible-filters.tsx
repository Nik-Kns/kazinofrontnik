'use client';

import React, { useState, useEffect } from 'react';
import { ChevronDown, ChevronUp, X, RotateCcw } from 'lucide-react';
import { Button } from './button';
import { Input } from './input';
import { Badge } from './badge';
import { Card } from './card';
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
import { cn } from '@/lib/utils';
import type { FilterConfig, FilterGroup } from '@/lib/types';
import { verticalsData, type VerticalKey } from '@/lib/verticals-data';

interface CollapsibleFiltersProps {
  filters: FilterConfig;
  onFiltersChange: (filters: FilterConfig) => void;
  filterGroups: FilterGroup[];
  className?: string;
  defaultExpanded?: boolean;
}

export function CollapsibleFilters({
  filters,
  onFiltersChange,
  filterGroups,
  className = '',
  defaultExpanded = true,
}: CollapsibleFiltersProps) {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);
  const [tempFilters, setTempFilters] = useState<FilterConfig>(filters);
  const [selectedVertical, setSelectedVertical] = useState<VerticalKey | ''>('');

  // Синхронизируем tempFilters с filters при изменении извне
  useEffect(() => {
    setTempFilters(filters);
  }, [filters]);

  // Подсчет активных фильтров
  const activeFiltersCount = Object.values(filters).filter(
    (value) => value !== undefined && value !== null && 
    (Array.isArray(value) ? value.length > 0 : true)
  ).length;

  const handleApplyFilters = () => {
    onFiltersChange(tempFilters);
  };

  const handleResetFilters = () => {
    setTempFilters({});
    setSelectedVertical('');
    onFiltersChange({});
  };

  const handleVerticalChange = (vertical: VerticalKey) => {
    setSelectedVertical(vertical);
    // Сбрасываем выбранные игры при смене вертикали
    setTempFilters({
      ...tempFilters,
      games: [],
      vertical: vertical
    });
  };

  const renderFilterControl = (group: FilterGroup) => {
    // Специальная обработка для вертикалей и игр
    if (group.id === 'vertical') {
      return (
        <Select
          value={selectedVertical}
          onValueChange={(value) => handleVerticalChange(value as VerticalKey)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Выберите вертикаль" />
          </SelectTrigger>
          <SelectContent>
            {Object.entries(verticalsData).map(([key, data]) => (
              <SelectItem key={key} value={key}>
                {data.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      );
    }

    if (group.id === 'games' && selectedVertical) {
      const games = verticalsData[selectedVertical].games;
      const selectedGames = (tempFilters.games as string[]) || [];
      
      return (
        <div className="space-y-2">
          <div className="flex flex-wrap gap-2 max-h-[200px] overflow-y-auto p-2 border rounded-lg">
            {games.map((game) => (
              <Badge
                key={game.value}
                variant={selectedGames.includes(game.value) ? 'default' : 'outline'}
                className="cursor-pointer"
                onClick={() => {
                  const newGames = selectedGames.includes(game.value)
                    ? selectedGames.filter((v) => v !== game.value)
                    : [...selectedGames, game.value];
                  setTempFilters({
                    ...tempFilters,
                    games: newGames
                  });
                }}
              >
                {game.label}
              </Badge>
            ))}
          </div>
          {selectedGames.length > 0 && (
            <p className="text-sm text-muted-foreground">
              Выбрано: {selectedGames.length}
            </p>
          )}
        </div>
      );
    }

    if (group.id === 'games' && !selectedVertical) {
      return (
        <p className="text-sm text-muted-foreground p-2 border rounded-lg">
          Сначала выберите вертикаль
        </p>
      );
    }

    // Стандартная обработка остальных типов фильтров
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
                <Button variant="outline" size="sm" className="w-full">
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
                <Button variant="outline" size="sm" className="w-full">
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
    <Card className={cn("overflow-hidden", className)}>
      <div className="p-4 bg-muted/30">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h3 className="font-semibold">Фильтры</h3>
            {activeFiltersCount > 0 && (
              <Badge variant="default">
                {activeFiltersCount} активных
              </Badge>
            )}
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleResetFilters}
              disabled={activeFiltersCount === 0}
            >
              <RotateCcw className="h-4 w-4 mr-1" />
              Сбросить
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsExpanded(!isExpanded)}
            >
              {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </Button>
          </div>
        </div>
      </div>

      {isExpanded && (
        <div className="p-4 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filterGroups.map((group) => (
              <div key={group.id} className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  {group.label}
                </label>
                {renderFilterControl(group)}
              </div>
            ))}
          </div>

          <div className="flex justify-end pt-4 border-t">
            <Button
              onClick={handleApplyFilters}
              className="bg-primary hover:bg-primary/90"
            >
              Применить фильтры
            </Button>
          </div>
        </div>
      )}

      {/* Отображение активных фильтров */}
      {!isExpanded && activeFiltersCount > 0 && (
        <div className="p-4 pt-0">
          <div className="flex flex-wrap gap-2">
            {Object.entries(filters).map(([key, value]) => {
              if (!value || (Array.isArray(value) && value.length === 0)) return null;
              
              let displayValue = value;
              if (key === 'vertical' && typeof value === 'string') {
                displayValue = verticalsData[value as VerticalKey]?.label || value;
              }
              
              return (
                <Badge
                  key={key}
                  variant="secondary"
                  className="gap-1"
                >
                  {key}: {Array.isArray(displayValue) ? displayValue.length + ' выбрано' : String(displayValue)}
                  <X
                    className="h-3 w-3 cursor-pointer"
                    onClick={() => {
                      const newFilters = { ...filters };
                      delete newFilters[key as keyof FilterConfig];
                      if (key === 'vertical') {
                        delete newFilters.games;
                        setSelectedVertical('');
                      }
                      onFiltersChange(newFilters);
                    }}
                  />
                </Badge>
              );
            })}
          </div>
        </div>
      )}
    </Card>
  );
}