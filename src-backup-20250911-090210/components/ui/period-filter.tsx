"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DatePickerWithRange } from "@/components/ui/date-picker-with-range";
import { Filter } from "lucide-react";
import { addDays } from "date-fns";
import { MultiSelect } from "@/components/ui/multi-select";
import { Label } from "@/components/ui/label";

interface PeriodFilterProps {
  dateRange: { from?: Date; to?: Date };
  onDateChange: (range: { from?: Date; to?: Date }) => void;
  title?: string;
  subtitle?: string;
  compareMode?: 'none' | 'yoy' | 'mom';
  onCompareChange?: (mode: 'none' | 'yoy' | 'mom') => void;
  projects?: string[];
  countries?: string[];
  onProjectsChange?: (projects: string[]) => void;
  onCountriesChange?: (countries: string[]) => void;
}

export function PeriodFilter({ 
  dateRange, 
  onDateChange, 
  title = "Фильтры",
  subtitle = "во всех вкладках",
  compareMode = 'none',
  onCompareChange,
  projects,
  countries,
  onProjectsChange,
  onCountriesChange,
}: PeriodFilterProps) {
  const presets = [
    { label: "Сегодня", days: 0 },
    { label: "7 дней", days: 7 },
    { label: "30 дней", days: 30 },
    { label: "90 дней", days: 90 },
  ];

  // Опции проектов и GEO (в реальности — с бэкенда)
  const projectOptions = [
    { value: 'main', label: 'Основной проект', icon: 'https://placehold.co/24x24/7C3AED/FFF?text=A' },
    { value: 'vip', label: 'VIP Casino', icon: 'https://placehold.co/24x24/F59E0B/FFF?text=V' },
    { value: 'sport', label: 'Sport Betting', icon: 'https://placehold.co/24x24/10B981/FFF?text=S' },
    { value: 'poker', label: 'Poker Room', icon: 'https://placehold.co/24x24/EF4444/FFF?text=P' },
  ];
  const geoOptions = [
    { value: 'de', label: 'Германия' },
    { value: 'fr', label: 'Франция' },
    { value: 'it', label: 'Италия' },
    { value: 'es', label: 'Испания' },
    { value: 'uk', label: 'Великобритания' },
    { value: 'pl', label: 'Польша' },
    { value: 'nl', label: 'Нидерланды' },
    { value: 'pt', label: 'Португалия' },
    { value: 'ru', label: 'Россия' },
    { value: 'ua', label: 'Украина' }
  ];

  // Внутреннее состояние с инициализацией из localStorage (для кросс‑страничной сессии)
  const [selectedProjects, setSelectedProjects] = useState<string[]>(() => {
    try {
      if (projects) return projects;
      const saved = localStorage.getItem('analyticsFilters');
      if (saved) {
        const parsed = JSON.parse(saved);
        return parsed.projects || (parsed.projectBrand ? [parsed.projectBrand] : []);
      }
    } catch {}
    return [];
  });
  const [selectedCountries, setSelectedCountries] = useState<string[]>(() => {
    try {
      if (countries) return countries;
      const saved = localStorage.getItem('analyticsFilters');
      if (saved) {
        const parsed = JSON.parse(saved);
        return parsed.countries || [];
      }
    } catch {}
    return [];
  });

  // Синхронизация вовне при изменениях
  useEffect(() => { if (projects) setSelectedProjects(projects); }, [projects]);
  useEffect(() => { if (countries) setSelectedCountries(countries); }, [countries]);

  const persistFilters = (next: { projects?: string[]; countries?: string[]; dateRange?: any; compareMode?: any }) => {
    try {
      const saved = localStorage.getItem('analyticsFilters');
      const base = saved ? JSON.parse(saved) : {};
      const merged = { ...base, ...next };
      localStorage.setItem('analyticsFilters', JSON.stringify(merged));
    } catch {}
  };

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="sticky top-16 z-20 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 rounded-md border p-3 flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-2">
            <Filter className="h-5 w-5 text-muted-foreground" />
            <h3 className="text-lg font-semibold">{title}</h3>
            <span className="text-sm text-muted-foreground">{subtitle}</span>
          </div>
          <div className="flex items-center gap-4 flex-wrap">
            {/* Проекты */}
            <div className="space-y-1 min-w-[240px]">
              <Label className="text-xs text-muted-foreground">Проекты</Label>
              <MultiSelect
                options={projectOptions}
                selected={selectedProjects}
                onChange={(sel) => {
                  setSelectedProjects(sel as string[]);
                  onProjectsChange?.(sel as string[]);
                  persistFilters({ projects: sel as string[] });
                }}
                placeholder="Выбрать проект(ы)"
                showSelectAll
                selectAllLabel="Выбрать все"
                summaryFormatter={(count) => `Выбрано: ${count}`}
              />
            </div>
            {/* GEO */}
            <div className="space-y-1 min-w-[220px]">
              <Label className="text-xs text-muted-foreground">ГЕО</Label>
              <MultiSelect
                options={geoOptions}
                selected={selectedCountries}
                onChange={(sel) => {
                  setSelectedCountries(sel as string[]);
                  onCountriesChange?.(sel as string[]);
                  persistFilters({ countries: sel as string[] });
                }}
                placeholder="Выберите страны"
                showSelectAll
                selectAllLabel="Выбрать все"
              />
            </div>
            <DatePickerWithRange 
              date={dateRange} 
              onDateChange={onDateChange}
              className="w-[300px]"
            />
            <div className="flex gap-2">
              {presets.map((preset) => (
                <Button
                  key={preset.label}
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    if (preset.days === 0) {
                      onDateChange({ from: new Date(), to: new Date() });
                      persistFilters({ dateRange: { from: new Date(), to: new Date() } });
                    } else {
                      const range = { from: addDays(new Date(), -preset.days), to: new Date() };
                      onDateChange(range);
                      persistFilters({ dateRange: range });
                    }
                  }}
                >
                  {preset.label}
                </Button>
              ))}
            </div>
            <div className="flex gap-1 rounded-md border p-1">
              {[{ key: 'none', label: 'None' }, { key: 'yoy', label: 'YoY' }, { key: 'mom', label: 'MoM' }].map(opt => (
                <Button
                  key={opt.key}
                  variant={compareMode === (opt.key as any) ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => {
                    onCompareChange && onCompareChange(opt.key as any);
                    persistFilters({ compareMode: opt.key });
                  }}
                >
                  {opt.label}
                </Button>
              ))}
            </div>
          </div>
        </div>
        {dateRange.from && dateRange.to && (
          <div className="mt-4 text-sm text-muted-foreground">
            Показаны данные за период: {dateRange.from.toLocaleDateString('ru-RU')} - {dateRange.to.toLocaleDateString('ru-RU')}
            {compareMode !== 'none' && (
              <span className="ml-2">(сравнение: {compareMode === 'yoy' ? 'год к году' : 'месяц к месяцу'})</span>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}