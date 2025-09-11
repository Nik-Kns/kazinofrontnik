// Типы для работы с валютами

export type CurrencyCode = 'EUR' | 'USD' | 'USDT' | 'GBP' | 'RUB' | 'CAD' | 'AUD' | 'JPY' | 'CHF' | 'NOK' | 'SEK' | 'DKK' | 'PLN' | 'CZK' | 'HUF' | 'BGN' | 'RON' | 'HRK' | 'TRY' | 'BRL' | 'MXN' | 'ARS' | 'CLP' | 'COP' | 'PEN' | 'UYU';

export type RoundingMode = 'banker' | 'up' | 'down' | 'half_up' | 'half_down';

export type FxSource = 'backend' | 'fixed' | 'historical';

export interface CurrencyAmount {
  amount: number;
  currency: CurrencyCode;
  fx_rate?: number;
  fx_as_of?: string; // ISO date
}

export interface ConvertedAmount extends CurrencyAmount {
  original_amount: number;
  original_currency: CurrencyCode;
  conversion_rate: number;
  conversion_date: string;
}

export interface MultiCurrencyAmount {
  amounts: CurrencyAmount[];
  total_in_base?: ConvertedAmount;
  primary_currency?: CurrencyCode; // Главная валюта (с наибольшим оборотом)
}

export interface CurrencySettings {
  base_currency: CurrencyCode;
  fx_source: FxSource;
  rounding_mode: RoundingMode;
  timezone: string;
  fx_as_of?: string; // Дата курса для исторической конвертации
  show_in_base_currency: boolean; // Глобальный переключатель конвертации
}

export interface FxRate {
  from: CurrencyCode;
  to: CurrencyCode;
  rate: number;
  date: string;
  source: FxSource;
}

// Типы для игроков с мультивалютностью
export interface PlayerCurrencyData {
  player_id: string;
  currencies: CurrencyCode[];
  is_multi_currency: boolean;
  primary_currency: CurrencyCode;
  wallet_balances: Partial<Record<CurrencyCode, number>>;
  financial_metrics: {
    total_deposits: MultiCurrencyAmount;
    total_withdrawals: MultiCurrencyAmount;
    net_deposits: MultiCurrencyAmount;
    ggr: MultiCurrencyAmount;
    ngr: MultiCurrencyAmount;
    arpu: MultiCurrencyAmount;
    ltv: MultiCurrencyAmount;
  };
}

// Режимы отображения валют
export type CurrencyDisplayMode = 'native' | 'base_converted' | 'specific_currency';

export interface CurrencyFilter {
  currencies: CurrencyCode[];
  is_multi_currency?: boolean;
  amount_range?: {
    min: number;
    max: number;
    currency: CurrencyCode;
  };
  display_mode: CurrencyDisplayMode;
  specific_currency?: CurrencyCode; // Для режима specific_currency
}

// Конфигурация валют с визуальными настройками
export interface CurrencyConfig {
  code: CurrencyCode;
  name: string;
  symbol: string;
  decimal_places: number;
  badge_color: string;
  flag_emoji?: string;
}

// Константы валют
export const CURRENCY_CONFIGS: Record<CurrencyCode, CurrencyConfig> = {
  EUR: { code: 'EUR', name: 'Euro', symbol: '€', decimal_places: 2, badge_color: 'bg-blue-100 text-blue-800 border-blue-200', flag_emoji: '🇪🇺' },
  USD: { code: 'USD', name: 'US Dollar', symbol: '$', decimal_places: 2, badge_color: 'bg-green-100 text-green-800 border-green-200', flag_emoji: '🇺🇸' },
  USDT: { code: 'USDT', name: 'Tether', symbol: '₮', decimal_places: 2, badge_color: 'bg-emerald-100 text-emerald-800 border-emerald-200', flag_emoji: '🪙' },
  GBP: { code: 'GBP', name: 'British Pound', symbol: '£', decimal_places: 2, badge_color: 'bg-purple-100 text-purple-800 border-purple-200', flag_emoji: '🇬🇧' },
  RUB: { code: 'RUB', name: 'Russian Ruble', symbol: '₽', decimal_places: 2, badge_color: 'bg-red-100 text-red-800 border-red-200', flag_emoji: '🇷🇺' },
  CAD: { code: 'CAD', name: 'Canadian Dollar', symbol: 'C$', decimal_places: 2, badge_color: 'bg-red-100 text-red-800 border-red-200', flag_emoji: '🇨🇦' },
  AUD: { code: 'AUD', name: 'Australian Dollar', symbol: 'A$', decimal_places: 2, badge_color: 'bg-yellow-100 text-yellow-800 border-yellow-200', flag_emoji: '🇦🇺' },
  JPY: { code: 'JPY', name: 'Japanese Yen', symbol: '¥', decimal_places: 0, badge_color: 'bg-pink-100 text-pink-800 border-pink-200', flag_emoji: '🇯🇵' },
  CHF: { code: 'CHF', name: 'Swiss Franc', symbol: 'CHF', decimal_places: 2, badge_color: 'bg-gray-100 text-gray-800 border-gray-200', flag_emoji: '🇨🇭' },
  NOK: { code: 'NOK', name: 'Norwegian Krone', symbol: 'kr', decimal_places: 2, badge_color: 'bg-blue-100 text-blue-800 border-blue-200', flag_emoji: '🇳🇴' },
  SEK: { code: 'SEK', name: 'Swedish Krona', symbol: 'kr', decimal_places: 2, badge_color: 'bg-yellow-100 text-yellow-800 border-yellow-200', flag_emoji: '🇸🇪' },
  DKK: { code: 'DKK', name: 'Danish Krone', symbol: 'kr', decimal_places: 2, badge_color: 'bg-red-100 text-red-800 border-red-200', flag_emoji: '🇩🇰' },
  PLN: { code: 'PLN', name: 'Polish Złoty', symbol: 'zł', decimal_places: 2, badge_color: 'bg-red-100 text-red-800 border-red-200', flag_emoji: '🇵🇱' },
  CZK: { code: 'CZK', name: 'Czech Koruna', symbol: 'Kč', decimal_places: 2, badge_color: 'bg-blue-100 text-blue-800 border-blue-200', flag_emoji: '🇨🇿' },
  HUF: { code: 'HUF', name: 'Hungarian Forint', symbol: 'Ft', decimal_places: 0, badge_color: 'bg-green-100 text-green-800 border-green-200', flag_emoji: '🇭🇺' },
  BGN: { code: 'BGN', name: 'Bulgarian Lev', symbol: 'лв', decimal_places: 2, badge_color: 'bg-green-100 text-green-800 border-green-200', flag_emoji: '🇧🇬' },
  RON: { code: 'RON', name: 'Romanian Leu', symbol: 'lei', decimal_places: 2, badge_color: 'bg-blue-100 text-blue-800 border-blue-200', flag_emoji: '🇷🇴' },
  HRK: { code: 'HRK', name: 'Croatian Kuna', symbol: 'kn', decimal_places: 2, badge_color: 'bg-red-100 text-red-800 border-red-200', flag_emoji: '🇭🇷' },
  TRY: { code: 'TRY', name: 'Turkish Lira', symbol: '₺', decimal_places: 2, badge_color: 'bg-red-100 text-red-800 border-red-200', flag_emoji: '🇹🇷' },
  BRL: { code: 'BRL', name: 'Brazilian Real', symbol: 'R$', decimal_places: 2, badge_color: 'bg-green-100 text-green-800 border-green-200', flag_emoji: '🇧🇷' },
  MXN: { code: 'MXN', name: 'Mexican Peso', symbol: '$', decimal_places: 2, badge_color: 'bg-green-100 text-green-800 border-green-200', flag_emoji: '🇲🇽' },
  ARS: { code: 'ARS', name: 'Argentine Peso', symbol: '$', decimal_places: 2, badge_color: 'bg-blue-100 text-blue-800 border-blue-200', flag_emoji: '🇦🇷' },
  CLP: { code: 'CLP', name: 'Chilean Peso', symbol: '$', decimal_places: 0, badge_color: 'bg-red-100 text-red-800 border-red-200', flag_emoji: '🇨🇱' },
  COP: { code: 'COP', name: 'Colombian Peso', symbol: '$', decimal_places: 2, badge_color: 'bg-yellow-100 text-yellow-800 border-yellow-200', flag_emoji: '🇨🇴' },
  PEN: { code: 'PEN', name: 'Peruvian Sol', symbol: 'S/', decimal_places: 2, badge_color: 'bg-red-100 text-red-800 border-red-200', flag_emoji: '🇵🇪' },
  UYU: { code: 'UYU', name: 'Uruguayan Peso', symbol: '$U', decimal_places: 2, badge_color: 'bg-blue-100 text-blue-800 border-blue-200', flag_emoji: '🇺🇾' }
};

// Дефолтные настройки
export const DEFAULT_CURRENCY_SETTINGS: CurrencySettings = {
  base_currency: 'EUR',
  fx_source: 'backend',
  rounding_mode: 'banker',
  timezone: 'UTC',
  show_in_base_currency: false
};
