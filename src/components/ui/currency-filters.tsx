"use client";

import React from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { 
  Collapsible, 
  CollapsibleContent, 
  CollapsibleTrigger 
} from '@/components/ui/collapsible';
import { MultiSelect } from '@/components/ui/multi-select';
import { 
  ChevronDown, 
  ChevronUp, 
  ArrowUpDown, 
  Info, 
  Calendar,
  Coins,
  Filter,
  X,
  RefreshCw
} from 'lucide-react';
import { useCurrency } from '@/contexts/currency-context';
import { CurrencyBadge } from './currency-badge';
import { 
  CurrencyCode, 
  CurrencyDisplayMode, 
  CurrencyFilter,
  CURRENCY_CONFIGS
} from '@/lib/currency-types';

// Типы для валютных фильтров
export interface CurrencyFiltersState {
  display_mode: CurrencyDisplayMode;
  selected_currencies: CurrencyCode[];
  is_multi_currency?: boolean;
  amount_range?: {
    min: number;
    max: number;
    currency: CurrencyCode;
  };
  fx_as_of?: string;
}

interface CurrencyFiltersProps {
  value: CurrencyFiltersState;
  onChange: (filters: CurrencyFiltersState) => void;
  showAdvanced?: boolean;
  compact?: boolean;
  className?: string;
}

export function CurrencyFilters({ 
  value, 
  onChange, 
  showAdvanced = true,
  compact = false,
  className = ''
}: CurrencyFiltersProps) {
  const { state: currencyState, toggleBaseCurrencyDisplay } = useCurrency();
  const [isAdvancedOpen, setIsAdvancedOpen] = React.useState(false);

  // Популярные валюты для быстрого выбора
  const popularCurrencies: CurrencyCode[] = ['EUR', 'USD', 'GBP', 'RUB', 'CAD', 'AUD'];
  
  // Все доступные валюты для мультиселекта
  const allCurrencies = Object.keys(CURRENCY_CONFIGS).map(code => ({
    value: code as CurrencyCode,
    label: `${CURRENCY_CONFIGS[code as CurrencyCode].flag_emoji} ${code} - ${CURRENCY_CONFIGS[code as CurrencyCode].name}`,
    badge: code
  }));

  const handleDisplayModeChange = (mode: CurrencyDisplayMode) => {
    onChange({ ...value, display_mode: mode });
    
    // Синхронизируем с глобальным переключателем
    if (mode === 'base_converted') {
      toggleBaseCurrencyDisplay(true);
    } else if (mode === 'native') {
      toggleBaseCurrencyDisplay(false);
    }
  };

  const handleCurrenciesChange = (currencies: string[]) => {
    onChange({ 
      ...value, 
      selected_currencies: currencies as CurrencyCode[] 
    });
  };

  const handleMultiCurrencyChange = (checked: boolean | 'indeterminate') => {
    onChange({ 
      ...value, 
      is_multi_currency: checked === 'indeterminate' ? undefined : checked as boolean
    });
  };

  const handleAmountRangeChange = (field: 'min' | 'max' | 'currency', newValue: string | number) => {
    const currentRange = value.amount_range || { 
      min: 0, 
      max: 100000, 
      currency: currencyState.base_currency 
    };
    
    onChange({
      ...value,
      amount_range: {
        ...currentRange,
        [field]: field === 'currency' ? newValue as CurrencyCode : Number(newValue)
      }
    });
  };

  const clearAmountRange = () => {
    onChange({ ...value, amount_range: undefined });
  };

  const clearAllFilters = () => {
    onChange({
      display_mode: 'native',
      selected_currencies: [],
      is_multi_currency: undefined,
      amount_range: undefined,
      fx_as_of: undefined
    });
    toggleBaseCurrencyDisplay(false);
  };

  if (compact) {
    return (
      <div className={`flex items-center gap-2 ${className}`}>
        {/* Переключатель режима отображения */}
        <div className="flex items-center gap-2">
          <Switch
            checked={value.display_mode === 'base_converted' || currencyState.show_in_base_currency}
            onCheckedChange={(checked) => 
              handleDisplayModeChange(checked ? 'base_converted' : 'native')
            }
          />
          <Label className="text-sm">
            В базовой валюте
          </Label>
          {currencyState.show_in_base_currency && (
            <CurrencyBadge currency={currencyState.base_currency} size="sm" />
          )}
        </div>

        {/* Быстрый выбор валют */}
        <Separator orientation="vertical" className="h-6" />
        <div className="flex items-center gap-1">
          {popularCurrencies.map(currency => (
            <Button
              key={currency}
              variant={value.selected_currencies.includes(currency) ? "default" : "outline"}
              size="sm"
              className="h-7 px-2"
              onClick={() => {
                const newCurrencies = value.selected_currencies.includes(currency)
                  ? value.selected_currencies.filter(c => c !== currency)
                  : [...value.selected_currencies, currency];
                handleCurrenciesChange(newCurrencies);
              }}
            >
              {CURRENCY_CONFIGS[currency].flag_emoji} {currency}
            </Button>
          ))}
        </div>

        {/* Индикатор активных фильтров */}
        {(value.selected_currencies.length > 0 || value.is_multi_currency !== undefined || value.amount_range) && (
          <Badge variant="secondary" className="ml-2">
            {[
              value.selected_currencies.length > 0 && `${value.selected_currencies.length} валют`,
              value.is_multi_currency !== undefined && (value.is_multi_currency ? 'мульти' : 'моно'),
              value.amount_range && 'сумма'
            ].filter(Boolean).join(', ')}
          </Badge>
        )}
      </div>
    );
  }

  return (
    <Card className={className}>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-base">
          <Coins className="h-4 w-4" />
          Валютные фильтры
        </CardTitle>
        <CardDescription>
          Настройка отображения и фильтрации по валютам
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Режим отображения */}
        <div className="space-y-3">
          <Label className="text-sm font-medium">Тип учёта</Label>
          <div className="grid grid-cols-1 gap-2">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="native-mode"
                checked={value.display_mode === 'native'}
                onCheckedChange={() => handleDisplayModeChange('native')}
              />
              <Label htmlFor="native-mode" className="text-sm">
                По исходным валютам
              </Label>
              <Badge variant="outline" className="text-xs">по умолчанию</Badge>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="base-mode"
                checked={value.display_mode === 'base_converted'}
                onCheckedChange={() => handleDisplayModeChange('base_converted')}
              />
              <Label htmlFor="base-mode" className="text-sm">
                В базовой валюте (конвертация)
              </Label>
              <CurrencyBadge currency={currencyState.base_currency} size="sm" />
            </div>
          </div>
          
          {value.display_mode === 'native' && (
            <div className="flex items-start gap-2 p-2 bg-amber-50 border border-amber-200 rounded text-xs text-amber-800">
              <Info className="h-3 w-3 mt-0.5 flex-shrink-0" />
              <span>Сортировка колонок с суммами недоступна. Включите конвертацию для сортировки.</span>
            </div>
          )}
          
          {value.display_mode === 'base_converted' && currencyState.fx_as_of && (
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Calendar className="h-3 w-3" />
              <span>Курс на дату: {currencyState.fx_as_of}</span>
            </div>
          )}
        </div>

        <Separator />

        {/* Фильтр по валютам */}
        <div className="space-y-3">
          <Label className="text-sm font-medium">Фильтр по валютам</Label>
          
          {/* Быстрый выбор популярных валют */}
          <div className="space-y-2">
            <div className="text-xs text-muted-foreground">Популярные:</div>
            <div className="flex flex-wrap gap-1">
              {popularCurrencies.map(currency => (
                <Button
                  key={currency}
                  variant={value.selected_currencies.includes(currency) ? "default" : "outline"}
                  size="sm"
                  className="h-7 px-2"
                  onClick={() => {
                    const newCurrencies = value.selected_currencies.includes(currency)
                      ? value.selected_currencies.filter(c => c !== currency)
                      : [...value.selected_currencies, currency];
                    handleCurrenciesChange(newCurrencies);
                  }}
                >
                  {CURRENCY_CONFIGS[currency].flag_emoji} {currency}
                </Button>
              ))}
            </div>
          </div>

          {/* Мультиселект всех валют */}
          <div className="space-y-2">
            <div className="text-xs text-muted-foreground">Все валюты:</div>
            <MultiSelect
              options={allCurrencies}
              value={value.selected_currencies}
              onValueChange={handleCurrenciesChange}
              placeholder="Выберите валюты..."
              maxCount={3}
            />
          </div>

          {value.selected_currencies.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {value.selected_currencies.map(currency => (
                <CurrencyBadge 
                  key={currency} 
                  currency={currency} 
                  showFlag 
                  size="sm" 
                />
              ))}
            </div>
          )}
        </div>

        <Separator />

        {/* Мультивалютность */}
        <div className="space-y-3">
          <Label className="text-sm font-medium">Тип игроков</Label>
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="multi-currency"
                checked={value.is_multi_currency === true}
                onCheckedChange={() => handleMultiCurrencyChange(
                  value.is_multi_currency === true ? 'indeterminate' : true
                )}
              />
              <Label htmlFor="multi-currency" className="text-sm">
                Мультивалютные игроки
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="mono-currency"
                checked={value.is_multi_currency === false}
                onCheckedChange={() => handleMultiCurrencyChange(
                  value.is_multi_currency === false ? 'indeterminate' : false
                )}
              />
              <Label htmlFor="mono-currency" className="text-sm">
                Моновалютные игроки
              </Label>
            </div>
          </div>
        </div>

        {/* Расширенные фильтры */}
        {showAdvanced && (
          <>
            <Separator />
            <Collapsible open={isAdvancedOpen} onOpenChange={setIsAdvancedOpen}>
              <CollapsibleTrigger asChild>
                <Button variant="ghost" className="w-full justify-between p-0 h-auto">
                  <span className="text-sm font-medium">Расширенные фильтры</span>
                  {isAdvancedOpen ? (
                    <ChevronUp className="h-4 w-4" />
                  ) : (
                    <ChevronDown className="h-4 w-4" />
                  )}
                </Button>
              </CollapsibleTrigger>
              
              <CollapsibleContent className="space-y-4 pt-3">
                {/* Порог по валюте */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label className="text-sm font-medium">Порог по валюте</Label>
                    {value.amount_range && (
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={clearAmountRange}
                        className="h-6 px-2 text-xs"
                      >
                        <X className="h-3 w-3 mr-1" />
                        Очистить
                      </Button>
                    )}
                  </div>
                  
                  <div className="grid grid-cols-3 gap-2">
                    <div className="space-y-1">
                      <Label className="text-xs text-muted-foreground">От</Label>
                      <Input
                        type="number"
                        placeholder="0"
                        value={value.amount_range?.min || ''}
                        onChange={(e) => handleAmountRangeChange('min', e.target.value)}
                        className="h-8"
                      />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-xs text-muted-foreground">До</Label>
                      <Input
                        type="number"
                        placeholder="100000"
                        value={value.amount_range?.max || ''}
                        onChange={(e) => handleAmountRangeChange('max', e.target.value)}
                        className="h-8"
                      />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-xs text-muted-foreground">Валюта</Label>
                      <Select 
                        value={value.amount_range?.currency || currencyState.base_currency}
                        onValueChange={(currency) => handleAmountRangeChange('currency', currency)}
                      >
                        <SelectTrigger className="h-8">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {popularCurrencies.map(currency => (
                            <SelectItem key={currency} value={currency}>
                              <div className="flex items-center gap-2">
                                <span>{CURRENCY_CONFIGS[currency].flag_emoji}</span>
                                <span>{currency}</span>
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  {value.display_mode === 'base_converted' && (
                    <div className="text-xs text-muted-foreground">
                      Фильтрация по конвертированным значениям в {currencyState.base_currency}
                    </div>
                  )}
                </div>

                {/* Дата курса */}
                {value.display_mode === 'base_converted' && (
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Дата курса (as-of)</Label>
                    <Input
                      type="date"
                      value={value.fx_as_of || currencyState.fx_as_of || new Date().toISOString().split('T')[0]}
                      onChange={(e) => onChange({ ...value, fx_as_of: e.target.value })}
                      className="h-8"
                    />
                    <div className="text-xs text-muted-foreground">
                      Курс валют на указанную дату для исторической аналитики
                    </div>
                  </div>
                )}
              </CollapsibleContent>
            </Collapsible>
          </>
        )}

        {/* Действия */}
        <div className="flex items-center justify-between pt-2 border-t">
          <div className="text-xs text-muted-foreground">
            {[
              value.selected_currencies.length > 0 && `${value.selected_currencies.length} валют`,
              value.is_multi_currency !== undefined && (value.is_multi_currency ? 'мультивалютные' : 'моновалютные'),
              value.amount_range && 'с порогом суммы'
            ].filter(Boolean).join(' • ') || 'Фильтры не применены'}
          </div>
          
          <Button 
            variant="outline" 
            size="sm" 
            onClick={clearAllFilters}
            className="h-7 px-2 text-xs"
          >
            <RefreshCw className="h-3 w-3 mr-1" />
            Сбросить
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
