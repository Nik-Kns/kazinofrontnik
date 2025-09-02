"use client";

import React from 'react';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Tooltip, 
  TooltipContent, 
  TooltipProvider, 
  TooltipTrigger 
} from '@/components/ui/tooltip';
import { Info, ArrowRightLeft } from 'lucide-react';
import { useCurrency } from '@/contexts/currency-context';
import { CurrencyBadge } from './currency-badge';

interface CurrencyToggleProps {
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
  showFxInfo?: boolean;
  className?: string;
}

export function CurrencyToggle({ 
  size = 'md', 
  showLabel = true,
  showFxInfo = true,
  className = ''
}: CurrencyToggleProps) {
  const { state, toggleBaseCurrencyDisplay } = useCurrency();

  const sizeClasses = {
    sm: 'gap-2',
    md: 'gap-3',
    lg: 'gap-4'
  };

  const labelSizeClasses = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base'
  };

  const handleToggle = (checked: boolean) => {
    toggleBaseCurrencyDisplay(checked);
  };

  // Получаем пример курса для tooltip
  const sampleFxRate = Object.values(state.fx_rates).find(rate => 
    rate.to === state.base_currency && rate.from !== state.base_currency
  );

  return (
    <div className={`flex items-center ${sizeClasses[size]} ${className}`}>
      <div className="flex items-center gap-2">
        <Switch
          id="currency-display-toggle"
          checked={state.show_in_base_currency}
          onCheckedChange={handleToggle}
          size={size === 'sm' ? 'sm' : 'default'}
        />
        
        {showLabel && (
          <Label 
            htmlFor="currency-display-toggle" 
            className={`${labelSizeClasses[size]} cursor-pointer select-none`}
          >
            Отображать суммы в базовой валюте
          </Label>
        )}
      </div>

      {/* Индикатор текущего режима */}
      <div className="flex items-center gap-2">
        {state.show_in_base_currency ? (
          <div className="flex items-center gap-1">
            <CurrencyBadge 
              currency={state.base_currency} 
              size={size === 'sm' ? 'sm' : 'md'}
              showFlag 
            />
            <Badge variant="outline" className="text-xs bg-green-50 text-green-700 border-green-200">
              Конвертация
            </Badge>
          </div>
        ) : (
          <div className="flex items-center gap-1">
            <Badge variant="outline" className="text-xs bg-blue-50 text-blue-700 border-blue-200">
              Исходные валюты
            </Badge>
            <ArrowRightLeft className="h-3 w-3 text-muted-foreground" />
          </div>
        )}

        {/* Информация о курсе */}
        {showFxInfo && state.show_in_base_currency && sampleFxRate && (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" className="h-6 w-6 p-0">
                  <Info className="h-3 w-3 text-muted-foreground" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <div className="space-y-1">
                  <div className="font-medium">Пример курса:</div>
                  <div className="text-sm">
                    1 {sampleFxRate.from} = {sampleFxRate.rate.toFixed(4)} {sampleFxRate.to}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    На дату: {sampleFxRate.date}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Источник: {sampleFxRate.source === 'backend' ? 'Backend API' : sampleFxRate.source}
                  </div>
                </div>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}
      </div>
    </div>
  );
}

// Компактная версия для фильтр-баров
interface CompactCurrencyToggleProps {
  className?: string;
}

export function CompactCurrencyToggle({ className = '' }: CompactCurrencyToggleProps) {
  const { state, toggleBaseCurrencyDisplay } = useCurrency();

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <Switch
        checked={state.show_in_base_currency}
        onCheckedChange={toggleBaseCurrencyDisplay}
        size="sm"
      />
      <Label className="text-xs font-medium whitespace-nowrap">
        В базовой валюте
      </Label>
      {state.show_in_base_currency && (
        <CurrencyBadge currency={state.base_currency} size="sm" />
      )}
    </div>
  );
}

// Версия с кнопкой для быстрого переключения
interface CurrencyToggleButtonProps {
  variant?: 'default' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function CurrencyToggleButton({ 
  variant = 'outline', 
  size = 'sm',
  className = ''
}: CurrencyToggleButtonProps) {
  const { state, toggleBaseCurrencyDisplay } = useCurrency();

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant={variant}
            size={size}
            onClick={() => toggleBaseCurrencyDisplay()}
            className={`gap-2 ${className}`}
          >
            <ArrowRightLeft className="h-4 w-4" />
            {state.show_in_base_currency ? (
              <>
                <CurrencyBadge currency={state.base_currency} size="sm" />
                <span className="text-xs">BASE</span>
              </>
            ) : (
              <span className="text-xs">NATIVE</span>
            )}
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <div className="text-sm">
            {state.show_in_base_currency 
              ? `Показать в исходных валютах` 
              : `Конвертировать в ${state.base_currency}`
            }
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
