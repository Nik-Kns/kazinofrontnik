"use client";

import React from 'react';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Input } from '@/components/ui/input';
import { RefreshCw, Settings, Info, Calendar, AlertTriangle } from 'lucide-react';
import { useCurrency } from '@/contexts/currency-context';
import { CurrencyCode, CURRENCY_CONFIGS, RoundingMode, FxSource } from '@/lib/currency-types';
import { CurrencyBadge } from './currency-badge';
import { CurrencyErrorHandler } from './currency-error-handler';

interface CurrencySettingsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CurrencySettingsDialog({ open, onOpenChange }: CurrencySettingsDialogProps) {
  const { 
    state, 
    setBaseCurrency, 
    setFxSource, 
    setRoundingMode, 
    setTimezone, 
    setFxAsOf,
    refreshFxRates, 
    resetToDefaults 
  } = useCurrency();

  const handleRefreshRates = async () => {
    await refreshFxRates();
  };

  const availableCurrencies = Object.keys(CURRENCY_CONFIGS) as CurrencyCode[];
  const popularCurrencies: CurrencyCode[] = ['EUR', 'USD', 'GBP', 'RUB', 'CAD', 'AUD'];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Настройки валют
          </DialogTitle>
          <DialogDescription>
            Управление базовой валютой, курсами обмена и правилами конвертации
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Базовая валюта */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Базовая валюта проекта</CardTitle>
              <CardDescription>
                Валюта для отображения конвертированных сумм и отчетов
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="base-currency">Базовая валюта</Label>
                <Select value={state.base_currency} onValueChange={setBaseCurrency}>
                  <SelectTrigger id="base-currency">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <div className="px-2 py-1 text-xs font-medium text-muted-foreground">
                      Популярные валюты
                    </div>
                    {popularCurrencies.map(currency => (
                      <SelectItem key={currency} value={currency}>
                        <div className="flex items-center gap-2">
                          <span>{CURRENCY_CONFIGS[currency].flag_emoji}</span>
                          <span>{currency}</span>
                          <span className="text-muted-foreground">
                            ({CURRENCY_CONFIGS[currency].name})
                          </span>
                        </div>
                      </SelectItem>
                    ))}
                    <Separator className="my-1" />
                    <div className="px-2 py-1 text-xs font-medium text-muted-foreground">
                      Все валюты
                    </div>
                    {availableCurrencies
                      .filter(c => !popularCurrencies.includes(c))
                      .map(currency => (
                        <SelectItem key={currency} value={currency}>
                          <div className="flex items-center gap-2">
                            <span>{CURRENCY_CONFIGS[currency].flag_emoji}</span>
                            <span>{currency}</span>
                            <span className="text-muted-foreground">
                              ({CURRENCY_CONFIGS[currency].name})
                            </span>
                          </div>
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">Текущая базовая валюта:</span>
                <CurrencyBadge currency={state.base_currency} showFlag />
              </div>
            </CardContent>
          </Card>

          {/* Источник курсов */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Курсы валют</CardTitle>
              <CardDescription>
                Настройка источника и параметров валютных курсов
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="fx-source">Источник курса</Label>
                  <Select value={state.fx_source} onValueChange={setFxSource}>
                    <SelectTrigger id="fx-source">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="backend">
                        <div className="flex flex-col items-start">
                          <span>Backend API</span>
                          <span className="text-xs text-muted-foreground">
                            Автоматическое обновление
                          </span>
                        </div>
                      </SelectItem>
                      <SelectItem value="fixed">
                        <div className="flex flex-col items-start">
                          <span>Фиксированный курс</span>
                          <span className="text-xs text-muted-foreground">
                            Ручная настройка
                          </span>
                        </div>
                      </SelectItem>
                      <SelectItem value="historical">
                        <div className="flex flex-col items-start">
                          <span>Исторический курс</span>
                          <span className="text-xs text-muted-foreground">
                            На определенную дату
                          </span>
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="fx-date">Дата курса (as-of)</Label>
                  <Input 
                    id="fx-date"
                    type="date" 
                    value={state.fx_as_of || new Date().toISOString().split('T')[0]}
                    onChange={(e) => setFxAsOf(e.target.value)}
                    disabled={state.fx_source === 'backend'}
                  />
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <div className="text-sm font-medium">Статус курсов</div>
                  <div className="flex items-center gap-2">
                    {state.loading ? (
                      <Badge variant="outline" className="text-blue-600">
                        <RefreshCw className="h-3 w-3 mr-1 animate-spin" />
                        Обновление...
                      </Badge>
                    ) : state.error ? (
                      <Badge variant="destructive">
                        Ошибка загрузки
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="text-green-600">
                        <div className="h-2 w-2 rounded-full bg-green-600 mr-1" />
                        Актуальные
                      </Badge>
                    )}
                    <span className="text-xs text-muted-foreground">
                      {Object.keys(state.fx_rates).length} пар валют
                    </span>
                  </div>
                </div>
                
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={handleRefreshRates}
                  disabled={state.loading}
                >
                  <RefreshCw className={`h-4 w-4 mr-2 ${state.loading ? 'animate-spin' : ''}`} />
                  Обновить курсы
                </Button>
              </div>

              <CurrencyErrorHandler
                error={state.error ? 'conversion_failed' : undefined}
                fromCurrency="USD"
                toCurrency={state.base_currency}
              >
                {state.error && (
                  <div className="p-3 bg-destructive/10 border border-destructive/20 rounded text-sm text-destructive">
                    {state.error}
                  </div>
                )}
              </CurrencyErrorHandler>
            </CardContent>
          </Card>

          {/* Правила округления и форматирования */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Правила вычислений</CardTitle>
              <CardDescription>
                Настройка округления и форматирования денежных сумм
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="rounding-mode">Политика округления</Label>
                  <Select value={state.rounding_mode} onValueChange={setRoundingMode}>
                    <SelectTrigger id="rounding-mode">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="banker">
                        <div className="flex flex-col items-start">
                          <span>Банковское округление</span>
                          <span className="text-xs text-muted-foreground">
                            0.5 → к четному (рекомендуется)
                          </span>
                        </div>
                      </SelectItem>
                      <SelectItem value="up">
                        <div className="flex flex-col items-start">
                          <span>Округление вверх</span>
                          <span className="text-xs text-muted-foreground">
                            0.1 → 1.0
                          </span>
                        </div>
                      </SelectItem>
                      <SelectItem value="down">
                        <div className="flex flex-col items-start">
                          <span>Округление вниз</span>
                          <span className="text-xs text-muted-foreground">
                            0.9 → 0.0
                          </span>
                        </div>
                      </SelectItem>
                      <SelectItem value="half_up">
                        <div className="flex flex-col items-start">
                          <span>Математическое округление</span>
                          <span className="text-xs text-muted-foreground">
                            0.5 → 1.0
                          </span>
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="timezone">Часовой пояс</Label>
                  <Select value={state.timezone} onValueChange={setTimezone}>
                    <SelectTrigger id="timezone">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="UTC">UTC (Всемирное время)</SelectItem>
                      <SelectItem value="Europe/London">Europe/London (GMT)</SelectItem>
                      <SelectItem value="Europe/Berlin">Europe/Berlin (CET)</SelectItem>
                      <SelectItem value="Europe/Moscow">Europe/Moscow (MSK)</SelectItem>
                      <SelectItem value="America/New_York">America/New_York (EST)</SelectItem>
                      <SelectItem value="America/Los_Angeles">America/Los_Angeles (PST)</SelectItem>
                      <SelectItem value="Asia/Tokyo">Asia/Tokyo (JST)</SelectItem>
                      <SelectItem value="Australia/Sydney">Australia/Sydney (AEST)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Примеры курсов */}
          {Object.keys(state.fx_rates).length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Info className="h-4 w-4" />
                  Текущие курсы валют
                </CardTitle>
                <CardDescription>
                  Актуальные курсы для конвертации в базовую валюту
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                  {Object.entries(state.fx_rates)
                    .filter(([key]) => key.endsWith(`-${state.base_currency}`))
                    .slice(0, 8)
                    .map(([key, rate]) => (
                      <div key={key} className="p-2 bg-muted/50 rounded text-sm">
                        <div className="font-medium">
                          1 {rate.from} = {rate.rate.toFixed(4)} {rate.to}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {rate.date}
                        </div>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Действия */}
          <div className="flex items-center justify-between pt-4 border-t">
            <Button variant="outline" onClick={resetToDefaults}>
              Сбросить к умолчанию
            </Button>
            
            <div className="flex items-center gap-2">
              <Button variant="outline" onClick={() => onOpenChange(false)}>
                Отмена
              </Button>
              <Button onClick={() => onOpenChange(false)}>
                Сохранить настройки
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
