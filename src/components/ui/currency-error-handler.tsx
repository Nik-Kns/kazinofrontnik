"use client";

import React from 'react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, RefreshCw, Info, Clock } from 'lucide-react';
import { useCurrency } from '@/contexts/currency-context';
import { formatCurrency } from '@/lib/currency-utils';
import type { CurrencyCode } from '@/lib/currency-types';

interface CurrencyErrorHandlerProps {
  error?: 'no_fx_rate' | 'stale_fx_rate' | 'mixed_fx_dates' | 'conversion_failed';
  fromCurrency?: CurrencyCode;
  toCurrency?: CurrencyCode;
  requestedDate?: string;
  fallbackAmount?: number;
  children?: React.ReactNode;
}

export const CurrencyErrorHandler: React.FC<CurrencyErrorHandlerProps> = ({
  error,
  fromCurrency,
  toCurrency,
  requestedDate,
  fallbackAmount,
  children
}) => {
  const { refreshFxRates } = useCurrency();

  if (!error) {
    return <>{children}</>;
  }

  const getErrorContent = () => {
    switch (error) {
      case 'no_fx_rate':
        return {
          icon: <AlertTriangle className="h-4 w-4" />,
          title: 'Курс валюты недоступен',
          description: (
            <>
              Не удалось найти курс обмена {fromCurrency} → {toCurrency} на дату {requestedDate}.
              {fallbackAmount && (
                <div className="mt-2">
                  <Badge variant="outline">
                    Используется приближенное значение: {formatCurrency(fallbackAmount, toCurrency || 'EUR')}
                  </Badge>
                </div>
              )}
            </>
          ),
          variant: 'destructive' as const,
          action: (
            <Button size="sm" variant="outline" onClick={refreshFxRates}>
              <RefreshCw className="h-3 w-3 mr-1" />
              Обновить курсы
            </Button>
          )
        };

      case 'stale_fx_rate':
        return {
          icon: <Clock className="h-4 w-4" />,
          title: 'Устаревший курс валюты',
          description: (
            <>
              Курс {fromCurrency} → {toCurrency} устарел (последнее обновление: {requestedDate}).
              Используется последний доступный курс.
            </>
          ),
          variant: 'default' as const,
          action: (
            <Button size="sm" variant="outline" onClick={refreshFxRates}>
              <RefreshCw className="h-3 w-3 mr-1" />
              Обновить
            </Button>
          )
        };

      case 'mixed_fx_dates':
        return {
          icon: <Info className="h-4 w-4" />,
          title: 'Смешанные даты курсов',
          description: (
            <>
              В отчете используются курсы валют с разных дат. 
              Это может повлиять на точность агрегированных показателей.
            </>
          ),
          variant: 'default' as const,
          action: (
            <Button size="sm" variant="outline" onClick={refreshFxRates}>
              <Info className="h-3 w-3 mr-1" />
              Подробнее
            </Button>
          )
        };

      case 'conversion_failed':
        return {
          icon: <AlertTriangle className="h-4 w-4" />,
          title: 'Ошибка конверсии валюты',
          description: (
            <>
              Не удалось выполнить конверсию {fromCurrency} → {toCurrency}.
              Суммы отображаются в исходных валютах.
            </>
          ),
          variant: 'destructive' as const,
          action: (
            <Button size="sm" variant="outline" onClick={refreshFxRates}>
              <RefreshCw className="h-3 w-3 mr-1" />
              Повторить
            </Button>
          )
        };

      default:
        return null;
    }
  };

  const errorContent = getErrorContent();
  
  if (!errorContent) {
    return <>{children}</>;
  }

  return (
    <div className="space-y-4">
      <Alert variant={errorContent.variant}>
        {errorContent.icon}
        <AlertTitle>{errorContent.title}</AlertTitle>
        <AlertDescription className="flex items-center justify-between">
          <div className="flex-1">{errorContent.description}</div>
          {errorContent.action && (
            <div className="ml-4 flex-shrink-0">
              {errorContent.action}
            </div>
          )}
        </AlertDescription>
      </Alert>
      {children}
    </div>
  );
};

// Hook для отслеживания валютных ошибок
export const useCurrencyErrors = () => {
  const [errors, setErrors] = React.useState<Array<{
    id: string;
    type: CurrencyErrorHandlerProps['error'];
    fromCurrency?: CurrencyCode;
    toCurrency?: CurrencyCode;
    requestedDate?: string;
    timestamp: number;
  }>>([]);

  const addError = React.useCallback((error: {
    type: CurrencyErrorHandlerProps['error'];
    fromCurrency?: CurrencyCode;
    toCurrency?: CurrencyCode;
    requestedDate?: string;
  }) => {
    const newError = {
      ...error,
      id: `${error.type}_${Date.now()}`,
      timestamp: Date.now(),
    };
    
    setErrors(prev => [...prev, newError].slice(-5)); // Храним только последние 5 ошибок
  }, []);

  const clearError = React.useCallback((id: string) => {
    setErrors(prev => prev.filter(error => error.id !== id));
  }, []);

  const clearAllErrors = React.useCallback(() => {
    setErrors([]);
  }, []);

  return {
    errors,
    addError,
    clearError,
    clearAllErrors,
  };
};

// Компонент для отображения списка всех валютных ошибок
export const CurrencyErrorsList: React.FC = () => {
  const { errors, clearError } = useCurrencyErrors();

  if (errors.length === 0) {
    return null;
  }

  return (
    <div className="space-y-2">
      {errors.map((error) => (
        <CurrencyErrorHandler
          key={error.id}
          error={error.type}
          fromCurrency={error.fromCurrency}
          toCurrency={error.toCurrency}
          requestedDate={error.requestedDate}
        >
          <div className="flex justify-end">
            <Button
              size="sm"
              variant="ghost"
              onClick={() => clearError(error.id)}
            >
              Скрыть
            </Button>
          </div>
        </CurrencyErrorHandler>
      ))}
    </div>
  );
};
