import { 
  CurrencyCode, 
  CurrencyAmount, 
  ConvertedAmount, 
  MultiCurrencyAmount, 
  CurrencySettings, 
  FxRate,
  RoundingMode,
  CURRENCY_CONFIGS
} from './currency-types';

// Функции для форматирования валют
export function formatCurrency(
  amount: number, 
  currency: CurrencyCode, 
  options: {
    showSymbol?: boolean;
    showCode?: boolean;
    decimals?: number;
  } = {}
): string {
  const config = CURRENCY_CONFIGS[currency];
  const { showSymbol = false, showCode = true, decimals = config.decimal_places } = options;
  
  const formattedAmount = new Intl.NumberFormat('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(amount);

  if (showSymbol && !showCode) {
    return `${config.symbol}${formattedAmount}`;
  }
  
  if (showSymbol && showCode) {
    return `${config.symbol}${formattedAmount} ${currency}`;
  }
  
  return `${formattedAmount} ${currency}`;
}

// Функция для форматирования мультивалютной суммы
export function formatMultiCurrencyAmount(
  multiAmount: MultiCurrencyAmount,
  settings: CurrencySettings,
  options: {
    separator?: string;
    maxCurrencies?: number;
    showConversion?: boolean;
  } = {}
): string {
  const { separator = ' · ', maxCurrencies = 3, showConversion = true } = options;

  // Если включена конвертация и есть базовая сумма
  if (settings.show_in_base_currency && multiAmount.total_in_base) {
    const baseAmount = formatCurrency(
      multiAmount.total_in_base.amount,
      multiAmount.total_in_base.currency,
      { showCode: true }
    );
    
    if (showConversion && multiAmount.amounts.length > 1) {
      const originalAmounts = multiAmount.amounts
        .slice(0, maxCurrencies)
        .map(amt => formatCurrency(amt.amount, amt.currency))
        .join(separator);
      
      const moreCount = multiAmount.amounts.length - maxCurrencies;
      const moreText = moreCount > 0 ? ` (+${moreCount} more)` : '';
      
      return `${baseAmount} (${originalAmounts}${moreText})`;
    }
    
    return baseAmount;
  }

  // Показываем в исходных валютах
  const displayAmounts = multiAmount.amounts.slice(0, maxCurrencies);
  const formatted = displayAmounts
    .map(amt => formatCurrency(amt.amount, amt.currency))
    .join(separator);

  const moreCount = multiAmount.amounts.length - maxCurrencies;
  if (moreCount > 0) {
    return `${formatted} (+${moreCount} more)`;
  }

  return formatted;
}

// Функция округления
export function roundAmount(amount: number, mode: RoundingMode, decimals: number = 2): number {
  const factor = Math.pow(10, decimals);
  
  switch (mode) {
    case 'up':
      return Math.ceil(amount * factor) / factor;
    case 'down':
      return Math.floor(amount * factor) / factor;
    case 'half_up':
      return Math.round(amount * factor) / factor;
    case 'half_down':
      return Math.floor(amount * factor + 0.5) / factor;
    case 'banker':
    default:
      // Банковское округление (к четному)
      const rounded = Math.round(amount * factor);
      const decimal = (amount * factor) % 1;
      
      if (Math.abs(decimal - 0.5) < Number.EPSILON) {
        // Если ровно 0.5, округляем к четному
        return (rounded % 2 === 0 ? rounded : rounded - Math.sign(rounded)) / factor;
      }
      
      return rounded / factor;
  }
}

// Конвертация валют
export function convertCurrency(
  amount: number,
  fromCurrency: CurrencyCode,
  toCurrency: CurrencyCode,
  fxRate: number,
  settings: CurrencySettings,
  conversionDate?: string
): ConvertedAmount {
  if (fromCurrency === toCurrency) {
    return {
      amount,
      currency: toCurrency,
      original_amount: amount,
      original_currency: fromCurrency,
      conversion_rate: 1,
      conversion_date: conversionDate || new Date().toISOString().split('T')[0]
    };
  }

  const convertedAmount = roundAmount(
    amount * fxRate, 
    settings.rounding_mode, 
    CURRENCY_CONFIGS[toCurrency].decimal_places
  );

  return {
    amount: convertedAmount,
    currency: toCurrency,
    original_amount: amount,
    original_currency: fromCurrency,
    conversion_rate: fxRate,
    conversion_date: conversionDate || new Date().toISOString().split('T')[0],
    fx_rate: fxRate,
    fx_as_of: conversionDate
  };
}

// Агрегация мультивалютных сумм
export function aggregateMultiCurrencyAmounts(
  amounts: CurrencyAmount[],
  settings: CurrencySettings,
  fxRates: Record<string, FxRate> = {}
): MultiCurrencyAmount {
  if (amounts.length === 0) {
    return { amounts: [] };
  }

  // Группируем по валютам
  const groupedAmounts = amounts.reduce((acc, amount) => {
    const existing = acc.find(a => a.currency === amount.currency);
    if (existing) {
      existing.amount += amount.amount;
    } else {
      acc.push({ ...amount });
    }
    return acc;
  }, [] as CurrencyAmount[]);

  // Определяем главную валюту (с наибольшей суммой)
  const primaryCurrency = groupedAmounts.reduce((max, current) => 
    current.amount > max.amount ? current : max
  ).currency;

  const result: MultiCurrencyAmount = {
    amounts: groupedAmounts,
    primary_currency: primaryCurrency
  };

  // Если включена конвертация, конвертируем в базовую валюту
  if (settings.show_in_base_currency) {
    let totalInBase = 0;
    let hasAllRates = true;

    for (const amount of groupedAmounts) {
      if (amount.currency === settings.base_currency) {
        totalInBase += amount.amount;
      } else {
        const rateKey = `${amount.currency}-${settings.base_currency}`;
        const fxRate = fxRates[rateKey];
        
        if (fxRate) {
          totalInBase += amount.amount * fxRate.rate;
        } else {
          hasAllRates = false;
          break;
        }
      }
    }

    if (hasAllRates) {
      result.total_in_base = {
        amount: roundAmount(totalInBase, settings.rounding_mode, CURRENCY_CONFIGS[settings.base_currency].decimal_places),
        currency: settings.base_currency,
        original_amount: totalInBase,
        original_currency: primaryCurrency,
        conversion_rate: 1, // Агрегированный курс
        conversion_date: settings.fx_as_of || new Date().toISOString().split('T')[0]
      };
    }
  }

  return result;
}

// Получение цвета валютного бейджа
export function getCurrencyBadgeColor(currency: CurrencyCode): string {
  return CURRENCY_CONFIGS[currency]?.badge_color || 'bg-gray-100 text-gray-800 border-gray-200';
}

// Получение символа валюты
export function getCurrencySymbol(currency: CurrencyCode): string {
  return CURRENCY_CONFIGS[currency]?.symbol || currency;
}

// Получение флага валюты
export function getCurrencyFlag(currency: CurrencyCode): string {
  return CURRENCY_CONFIGS[currency]?.flag_emoji || '';
}

// Проверка, является ли игрок мультивалютным
export function isMultiCurrencyPlayer(currencies: CurrencyCode[]): boolean {
  return currencies.length > 1;
}

// Генерация описания конвертации для tooltip
export function getConversionTooltip(
  convertedAmount: ConvertedAmount,
  fxRate?: FxRate
): string {
  const originalFormatted = formatCurrency(convertedAmount.original_amount, convertedAmount.original_currency);
  const convertedFormatted = formatCurrency(convertedAmount.amount, convertedAmount.currency);
  const rate = fxRate?.rate || convertedAmount.conversion_rate;
  const date = fxRate?.date || convertedAmount.conversion_date;
  
  return `${originalFormatted} → ${convertedFormatted}\nFX Rate: 1 ${convertedAmount.original_currency} = ${rate.toFixed(4)} ${convertedAmount.currency}\nAs of: ${date}`;
}

// Фильтрация по валютным критериям
export function filterPlayersByCurrency(
  players: any[],
  currencyFilter: {
    currencies?: CurrencyCode[];
    isMultiCurrency?: boolean;
    amountRange?: {
      min: number;
      max: number;
      currency: CurrencyCode;
    };
  }
): any[] {
  return players.filter(player => {
    // Фильтр по валютам
    if (currencyFilter.currencies && currencyFilter.currencies.length > 0) {
      const playerCurrencies = player.currencies || [];
      const hasMatchingCurrency = currencyFilter.currencies.some(currency => 
        playerCurrencies.includes(currency)
      );
      if (!hasMatchingCurrency) return false;
    }

    // Фильтр по мультивалютности
    if (currencyFilter.isMultiCurrency !== undefined) {
      const playerIsMultiCurrency = isMultiCurrencyPlayer(player.currencies || []);
      if (playerIsMultiCurrency !== currencyFilter.isMultiCurrency) return false;
    }

    // Фильтр по сумме в определенной валюте
    if (currencyFilter.amountRange) {
      const { min, max, currency } = currencyFilter.amountRange;
      const playerAmount = player.financial_metrics?.total_deposits?.amounts?.find(
        (amt: CurrencyAmount) => amt.currency === currency
      )?.amount || 0;
      
      if (playerAmount < min || playerAmount > max) return false;
    }

    return true;
  });
}

// Мок данные для курсов валют (в реальном приложении будут приходить с бэка)
export const mockFxRates: Record<string, FxRate> = {
  'USD-EUR': { from: 'USD', to: 'EUR', rate: 0.92, date: '2025-01-20', source: 'backend' },
  'EUR-USD': { from: 'EUR', to: 'USD', rate: 1.09, date: '2025-01-20', source: 'backend' },
  'GBP-EUR': { from: 'GBP', to: 'EUR', rate: 1.19, date: '2025-01-20', source: 'backend' },
  'EUR-GBP': { from: 'EUR', to: 'GBP', rate: 0.84, date: '2025-01-20', source: 'backend' },
  'GBP-USD': { from: 'GBP', to: 'USD', rate: 1.30, date: '2025-01-20', source: 'backend' },
  'USD-GBP': { from: 'USD', to: 'GBP', rate: 0.77, date: '2025-01-20', source: 'backend' },
  'RUB-EUR': { from: 'RUB', to: 'EUR', rate: 0.010, date: '2025-01-20', source: 'backend' },
  'EUR-RUB': { from: 'EUR', to: 'RUB', rate: 100.0, date: '2025-01-20', source: 'backend' }
};
