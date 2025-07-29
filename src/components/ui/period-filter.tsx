"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DatePickerWithRange } from "@/components/ui/date-picker-with-range";
import { Calendar, Filter } from "lucide-react";
import { addDays } from "date-fns";

interface PeriodFilterProps {
  dateRange: { from?: Date; to?: Date };
  onDateChange: (range: { from?: Date; to?: Date }) => void;
  title?: string;
  subtitle?: string;
}

export function PeriodFilter({ 
  dateRange, 
  onDateChange, 
  title = "Фильтр по периоду времени",
  subtitle = "во всех вкладках"
}: PeriodFilterProps) {
  const presets = [
    { label: "Сегодня", days: 0 },
    { label: "7 дней", days: 7 },
    { label: "30 дней", days: 30 },
    { label: "90 дней", days: 90 },
  ];

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-2">
            <Filter className="h-5 w-5 text-muted-foreground" />
            <h3 className="text-lg font-semibold">{title}</h3>
            <span className="text-sm text-muted-foreground">{subtitle}</span>
          </div>
          <div className="flex items-center gap-4">
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
                    } else {
                      onDateChange({ 
                        from: addDays(new Date(), -preset.days), 
                        to: new Date() 
                      });
                    }
                  }}
                >
                  {preset.label}
                </Button>
              ))}
            </div>
          </div>
        </div>
        {dateRange.from && dateRange.to && (
          <div className="mt-4 flex items-center gap-2">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">
              Показаны данные за период: {dateRange.from.toLocaleDateString('ru-RU')} - {dateRange.to.toLocaleDateString('ru-RU')}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}