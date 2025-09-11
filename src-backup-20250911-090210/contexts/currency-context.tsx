"use client";

import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { 
  CurrencySettings, 
  CurrencyCode, 
  FxRate, 
  DEFAULT_CURRENCY_SETTINGS,
  RoundingMode,
  FxSource
} from '@/lib/currency-types';
import { mockFxRates } from '@/lib/currency-utils';

// Типы для контекста
interface CurrencyContextState extends CurrencySettings {
  fx_rates: Record<string, FxRate>;
  loading: boolean;
  error: string | null;
}

type CurrencyAction = 
  | { type: 'SET_BASE_CURRENCY'; payload: CurrencyCode }
  | { type: 'SET_FX_SOURCE'; payload: FxSource }
  | { type: 'SET_ROUNDING_MODE'; payload: RoundingMode }
  | { type: 'SET_TIMEZONE'; payload: string }
  | { type: 'SET_FX_AS_OF'; payload: string }
  | { type: 'TOGGLE_BASE_CURRENCY_DISPLAY'; payload?: boolean }
  | { type: 'SET_FX_RATES'; payload: Record<string, FxRate> }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'RESET_TO_DEFAULTS' };

// Начальное состояние
const initialState: CurrencyContextState = {
  ...DEFAULT_CURRENCY_SETTINGS,
  fx_rates: {},
  loading: false,
  error: null
};

// Reducer для управления состоянием валют
function currencyReducer(state: CurrencyContextState, action: CurrencyAction): CurrencyContextState {
  switch (action.type) {
    case 'SET_BASE_CURRENCY':
      return { ...state, base_currency: action.payload };
      
    case 'SET_FX_SOURCE':
      return { ...state, fx_source: action.payload };
      
    case 'SET_ROUNDING_MODE':
      return { ...state, rounding_mode: action.payload };
      
    case 'SET_TIMEZONE':
      return { ...state, timezone: action.payload };
      
    case 'SET_FX_AS_OF':
      return { ...state, fx_as_of: action.payload };
      
    case 'TOGGLE_BASE_CURRENCY_DISPLAY':
      return { 
        ...state, 
        show_in_base_currency: action.payload !== undefined ? action.payload : !state.show_in_base_currency 
      };
      
    case 'SET_FX_RATES':
      return { ...state, fx_rates: action.payload };
      
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
      
    case 'SET_ERROR':
      return { ...state, error: action.payload };
      
    case 'RESET_TO_DEFAULTS':
      return { ...initialState, fx_rates: state.fx_rates };
      
    default:
      return state;
  }
}

// Контекст
interface CurrencyContextValue {
  state: CurrencyContextState;
  setBaseCurrency: (currency: CurrencyCode) => void;
  setFxSource: (source: FxSource) => void;
  setRoundingMode: (mode: RoundingMode) => void;
  setTimezone: (timezone: string) => void;
  setFxAsOf: (date: string) => void;
  toggleBaseCurrencyDisplay: (show?: boolean) => void;
  refreshFxRates: () => Promise<void>;
  resetToDefaults: () => void;
}

const CurrencyContext = createContext<CurrencyContextValue | null>(null);

// Hook для использования контекста
export function useCurrency(): CurrencyContextValue {
  const context = useContext(CurrencyContext);
  if (!context) {
    throw new Error('useCurrency must be used within a CurrencyProvider');
  }
  return context;
}

// Провайдер контекста
export function CurrencyProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(currencyReducer, initialState);

  // Загрузка настроек из localStorage при инициализации
  useEffect(() => {
    try {
      const savedSettings = localStorage.getItem('currency-settings');
      if (savedSettings) {
        const parsed = JSON.parse(savedSettings);
        dispatch({ type: 'SET_BASE_CURRENCY', payload: parsed.base_currency || DEFAULT_CURRENCY_SETTINGS.base_currency });
        dispatch({ type: 'SET_FX_SOURCE', payload: parsed.fx_source || DEFAULT_CURRENCY_SETTINGS.fx_source });
        dispatch({ type: 'SET_ROUNDING_MODE', payload: parsed.rounding_mode || DEFAULT_CURRENCY_SETTINGS.rounding_mode });
        dispatch({ type: 'SET_TIMEZONE', payload: parsed.timezone || DEFAULT_CURRENCY_SETTINGS.timezone });
        dispatch({ type: 'TOGGLE_BASE_CURRENCY_DISPLAY', payload: parsed.show_in_base_currency || DEFAULT_CURRENCY_SETTINGS.show_in_base_currency });
        if (parsed.fx_as_of) {
          dispatch({ type: 'SET_FX_AS_OF', payload: parsed.fx_as_of });
        }
      }
    } catch (error) {
      console.warn('Failed to load currency settings from localStorage:', error);
    }

    // Загружаем мок курсы при инициализации
    dispatch({ type: 'SET_FX_RATES', payload: mockFxRates });
  }, []);

  // Сохранение настроек в localStorage при изменении
  useEffect(() => {
    try {
      const settingsToSave = {
        base_currency: state.base_currency,
        fx_source: state.fx_source,
        rounding_mode: state.rounding_mode,
        timezone: state.timezone,
        fx_as_of: state.fx_as_of,
        show_in_base_currency: state.show_in_base_currency
      };
      localStorage.setItem('currency-settings', JSON.stringify(settingsToSave));
    } catch (error) {
      console.warn('Failed to save currency settings to localStorage:', error);
    }
  }, [state.base_currency, state.fx_source, state.rounding_mode, state.timezone, state.fx_as_of, state.show_in_base_currency]);

  // Функции для управления состоянием
  const setBaseCurrency = (currency: CurrencyCode) => {
    dispatch({ type: 'SET_BASE_CURRENCY', payload: currency });
  };

  const setFxSource = (source: FxSource) => {
    dispatch({ type: 'SET_FX_SOURCE', payload: source });
  };

  const setRoundingMode = (mode: RoundingMode) => {
    dispatch({ type: 'SET_ROUNDING_MODE', payload: mode });
  };

  const setTimezone = (timezone: string) => {
    dispatch({ type: 'SET_TIMEZONE', payload: timezone });
  };

  const setFxAsOf = (date: string) => {
    dispatch({ type: 'SET_FX_AS_OF', payload: date });
  };

  const toggleBaseCurrencyDisplay = (show?: boolean) => {
    dispatch({ type: 'TOGGLE_BASE_CURRENCY_DISPLAY', payload: show });
  };

  const refreshFxRates = async () => {
    dispatch({ type: 'SET_LOADING', payload: true });
    dispatch({ type: 'SET_ERROR', payload: null });
    
    try {
      // В реальном приложении здесь был бы запрос к API
      // const response = await fetch('/api/fx-rates', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({
      //     base_currency: state.base_currency,
      //     as_of: state.fx_as_of,
      //     source: state.fx_source
      //   })
      // });
      // const fxRates = await response.json();
      
      // Для демо используем мок данные с небольшой задержкой
      await new Promise(resolve => setTimeout(resolve, 500));
      dispatch({ type: 'SET_FX_RATES', payload: mockFxRates });
      
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error instanceof Error ? error.message : 'Failed to refresh FX rates' });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const resetToDefaults = () => {
    dispatch({ type: 'RESET_TO_DEFAULTS' });
  };

  const contextValue: CurrencyContextValue = {
    state,
    setBaseCurrency,
    setFxSource,
    setRoundingMode,
    setTimezone,
    setFxAsOf,
    toggleBaseCurrencyDisplay,
    refreshFxRates,
    resetToDefaults
  };

  return (
    <CurrencyContext.Provider value={contextValue}>
      {children}
    </CurrencyContext.Provider>
  );
}
