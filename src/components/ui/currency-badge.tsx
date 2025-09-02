"use client";

import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Info } from 'lucide-react';
import { 
  CurrencyCode, 
  MultiCurrencyAmount,
  CurrencyAmount,
  ConvertedAmount
} from '@/lib/currency-types';
import { 
  getCurrencyBadgeColor, 
  getCurrencyFlag, 
  formatCurrency,
  formatMultiCurrencyAmount,
  getConversionTooltip
} from '@/lib/currency-utils';
import { useCurrency } from '@/contexts/currency-context';

// Простой валютный бейдж
interface CurrencyBadgeProps {
  currency: CurrencyCode;
  size?: 'sm' | 'md' | 'lg';
  showFlag?: boolean;
  className?: string;
}

export function CurrencyBadge({ 
  currency, 
  size = 'sm', 
  showFlag = false, 
  className = '' 
}: CurrencyBadgeProps) {
  const flag = getCurrencyFlag(currency);
  const badgeColor = getCurrencyBadgeColor(currency);
  
  const sizeClasses = {
    sm: 'text-xs px-1.5 py-0.5',
    md: 'text-sm px-2 py-1',
    lg: 'text-base px-3 py-1.5'
  };

  return (
    <Badge 
      variant="outline" 
      className={`${badgeColor} ${sizeClasses[size]} font-medium ${className}`}
    >
      {showFlag && flag && <span className="mr-1">{flag}</span>}
      {currency}
    </Badge>
  );
}

// Мультивалютный бейдж для игроков
interface MultiCurrencyBadgeProps {
  currencies: CurrencyCode[];
  primaryCurrency?: CurrencyCode;
  maxVisible?: number;
  size?: 'sm' | 'md' | 'lg';
  showFlags?: boolean;
  walletBalances?: Record<CurrencyCode, number>;
  className?: string;
}

export function MultiCurrencyBadge({ 
  currencies, 
  primaryCurrency,
  maxVisible = 3, 
  size = 'sm',
  showFlags = false,
  walletBalances,
  className = ''
}: MultiCurrencyBadgeProps) {
  if (currencies.length === 0) return null;

  const visibleCurrencies = currencies.slice(0, maxVisible);
  const hiddenCount = currencies.length - maxVisible;
  
  // Сортируем валюты: главная валюта первая, остальные по алфавиту
  const sortedCurrencies = [...visibleCurrencies].sort((a, b) => {
    if (a === primaryCurrency) return -1;
    if (b === primaryCurrency) return 1;
    return a.localeCompare(b);
  });

  const tooltipContent = walletBalances ? (
    <div className="space-y-1">
      <div className="font-medium">Wallet Balances:</div>
      {currencies.map(currency => {
        const balance = walletBalances[currency] || 0;
        const isPrimary = currency === primaryCurrency;
        return (
          <div key={currency} className={`text-sm ${isPrimary ? 'font-medium' : ''}`}>
            {getCurrencyFlag(currency)} {formatCurrency(balance, currency)}
            {isPrimary && <span className="ml-1 text-xs opacity-75">(primary)</span>}
          </div>
        );
      })}
      {hiddenCount > 0 && (
        <div className="text-xs opacity-75 mt-1">
          +{hiddenCount} more currencies
        </div>
      )}
    </div>
  ) : (
    <div className="space-y-1">
      <div className="font-medium">Player Currencies:</div>
      {currencies.map(currency => (
        <div key={currency} className="text-sm">
          {getCurrencyFlag(currency)} {currency}
          {currency === primaryCurrency && <span className="ml-1 text-xs opacity-75">(primary)</span>}
        </div>
      ))}
    </div>
  );

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className={`flex items-center gap-1 ${className}`}>
            {sortedCurrencies.map(currency => (
              <CurrencyBadge 
                key={currency} 
                currency={currency} 
                size={size}
                showFlag={showFlags}
                className={currency === primaryCurrency ? 'ring-1 ring-primary/50' : ''}
              />
            ))}
            {hiddenCount > 0 && (
              <Badge variant="outline" className={`text-xs px-1.5 py-0.5 bg-gray-50 text-gray-600`}>
                +{hiddenCount}
              </Badge>
            )}
            {currencies.length > 1 && (
              <span className="text-xs text-muted-foreground ml-1">
                ({currencies.length} wallets)
              </span>
            )}
          </div>
        </TooltipTrigger>
        <TooltipContent side="top" className="max-w-xs">
          {tooltipContent}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

// Компонент для отображения суммы с валютой
interface CurrencyAmountDisplayProps {
  amount: CurrencyAmount | ConvertedAmount | MultiCurrencyAmount;
  showTooltip?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function CurrencyAmountDisplay({ 
  amount, 
  showTooltip = true, 
  size = 'md',
  className = ''
}: CurrencyAmountDisplayProps) {
  const { state: currencySettings } = useCurrency();

  // Если это мультивалютная сумма
  if ('amounts' in amount) {
    const formatted = formatMultiCurrencyAmount(amount, currencySettings);
    
    return (
      <div className={`flex items-center gap-2 ${className}`}>
        <span className={`font-medium ${size === 'sm' ? 'text-sm' : size === 'lg' ? 'text-lg' : 'text-base'}`}>
          {formatted}
        </span>
        {showTooltip && currencySettings.show_in_base_currency && amount.total_in_base && (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Info className="h-3 w-3 text-muted-foreground cursor-help" />
              </TooltipTrigger>
              <TooltipContent>
                {getConversionTooltip(amount.total_in_base)}
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}
      </div>
    );
  }

  // Если это конвертированная сумма
  if ('original_amount' in amount) {
    const formatted = formatCurrency(amount.amount, amount.currency);
    
    return (
      <div className={`flex items-center gap-2 ${className}`}>
        <span className={`font-medium ${size === 'sm' ? 'text-sm' : size === 'lg' ? 'text-lg' : 'text-base'}`}>
          {formatted}
        </span>
        {showTooltip && (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Info className="h-3 w-3 text-muted-foreground cursor-help" />
              </TooltipTrigger>
              <TooltipContent>
                {getConversionTooltip(amount)}
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}
      </div>
    );
  }

  // Обычная сумма
  const formatted = formatCurrency(amount.amount, amount.currency);
  
  return (
    <span className={`font-medium ${size === 'sm' ? 'text-sm' : size === 'lg' ? 'text-lg' : 'text-base'} ${className}`}>
      {formatted}
    </span>
  );
}

// Компонент мультичипа для таблиц (когда несколько валют в одной ячейке)
interface MultiCurrencyChipProps {
  amounts: CurrencyAmount[];
  separator?: string;
  maxVisible?: number;
  size?: 'sm' | 'md';
  className?: string;
}

export function MultiCurrencyChip({ 
  amounts, 
  separator = ' · ', 
  maxVisible = 2,
  size = 'sm',
  className = ''
}: MultiCurrencyChipProps) {
  if (amounts.length === 0) return <span className="text-muted-foreground">—</span>;
  
  if (amounts.length === 1) {
    return (
      <span className={`${size === 'sm' ? 'text-sm' : 'text-base'} ${className}`}>
        {formatCurrency(amounts[0].amount, amounts[0].currency)}
      </span>
    );
  }

  const visibleAmounts = amounts.slice(0, maxVisible);
  const hiddenCount = amounts.length - maxVisible;
  
  const formatted = visibleAmounts
    .map(amt => formatCurrency(amt.amount, amt.currency))
    .join(separator);

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <span className={`${size === 'sm' ? 'text-sm' : 'text-base'} cursor-help ${className}`}>
            {formatted}
            {hiddenCount > 0 && (
              <span className="text-muted-foreground ml-1">
                (+{hiddenCount} more)
              </span>
            )}
          </span>
        </TooltipTrigger>
        <TooltipContent>
          <div className="space-y-1">
            {amounts.map((amt, idx) => (
              <div key={idx} className="text-sm">
                {formatCurrency(amt.amount, amt.currency)}
              </div>
            ))}
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
