import { 
  CurrencyCode, 
  PlayerCurrencyData, 
  MultiCurrencyAmount, 
  CurrencyAmount 
} from './currency-types';

// Функция для создания мультивалютной суммы
function createMultiCurrencyAmount(amounts: { currency: CurrencyCode; amount: number }[]): MultiCurrencyAmount {
  const currencyAmounts: CurrencyAmount[] = amounts.map(({ currency, amount }) => ({
    amount,
    currency,
    fx_rate: undefined,
    fx_as_of: undefined
  }));

  // Определяем главную валюту (с наибольшей суммой)
  const primaryCurrency = currencyAmounts.reduce((max, current) => 
    current.amount > max.amount ? current : max
  ).currency;

  return {
    amounts: currencyAmounts,
    primary_currency: primaryCurrency
  };
}

// Мок данные игроков с мультивалютностью
export const multiCurrencyPlayersData: PlayerCurrencyData[] = [
  {
    player_id: 'P001',
    currencies: ['EUR', 'USD'],
    is_multi_currency: true,
    primary_currency: 'EUR',
    wallet_balances: { EUR: 1250.50, USD: 890.75 },
    financial_metrics: {
      total_deposits: createMultiCurrencyAmount([
        { currency: 'EUR', amount: 5420.00 },
        { currency: 'USD', amount: 2150.00 }
      ]),
      total_withdrawals: createMultiCurrencyAmount([
        { currency: 'EUR', amount: 1200.00 },
        { currency: 'USD', amount: 450.00 }
      ]),
      net_deposits: createMultiCurrencyAmount([
        { currency: 'EUR', amount: 4220.00 },
        { currency: 'USD', amount: 1700.00 }
      ]),
      ggr: createMultiCurrencyAmount([
        { currency: 'EUR', amount: 890.50 },
        { currency: 'USD', amount: 320.25 }
      ]),
      ngr: createMultiCurrencyAmount([
        { currency: 'EUR', amount: 712.40 },
        { currency: 'USD', amount: 256.20 }
      ]),
      arpu: createMultiCurrencyAmount([
        { currency: 'EUR', amount: 180.67 },
        { currency: 'USD', amount: 71.67 }
      ]),
      ltv: createMultiCurrencyAmount([
        { currency: 'EUR', amount: 890.50 },
        { currency: 'USD', amount: 320.25 }
      ])
    }
  },
  {
    player_id: 'P002',
    currencies: ['USD'],
    is_multi_currency: false,
    primary_currency: 'USD',
    wallet_balances: { USD: 2340.80 },
    financial_metrics: {
      total_deposits: createMultiCurrencyAmount([
        { currency: 'USD', amount: 8750.00 }
      ]),
      total_withdrawals: createMultiCurrencyAmount([
        { currency: 'USD', amount: 2100.00 }
      ]),
      net_deposits: createMultiCurrencyAmount([
        { currency: 'USD', amount: 6650.00 }
      ]),
      ggr: createMultiCurrencyAmount([
        { currency: 'USD', amount: 1425.50 }
      ]),
      ngr: createMultiCurrencyAmount([
        { currency: 'USD', amount: 1140.40 }
      ]),
      arpu: createMultiCurrencyAmount([
        { currency: 'USD', amount: 291.67 }
      ]),
      ltv: createMultiCurrencyAmount([
        { currency: 'USD', amount: 1425.50 }
      ])
    }
  },
  {
    player_id: 'P003',
    currencies: ['GBP', 'EUR', 'USD'],
    is_multi_currency: true,
    primary_currency: 'GBP',
    wallet_balances: { GBP: 890.25, EUR: 450.60, USD: 125.00 },
    financial_metrics: {
      total_deposits: createMultiCurrencyAmount([
        { currency: 'GBP', amount: 3250.00 },
        { currency: 'EUR', amount: 1200.00 },
        { currency: 'USD', amount: 580.00 }
      ]),
      total_withdrawals: createMultiCurrencyAmount([
        { currency: 'GBP', amount: 850.00 },
        { currency: 'EUR', amount: 300.00 },
        { currency: 'USD', amount: 120.00 }
      ]),
      net_deposits: createMultiCurrencyAmount([
        { currency: 'GBP', amount: 2400.00 },
        { currency: 'EUR', amount: 900.00 },
        { currency: 'USD', amount: 460.00 }
      ]),
      ggr: createMultiCurrencyAmount([
        { currency: 'GBP', amount: 520.75 },
        { currency: 'EUR', amount: 180.30 },
        { currency: 'USD', amount: 92.15 }
      ]),
      ngr: createMultiCurrencyAmount([
        { currency: 'GBP', amount: 416.60 },
        { currency: 'EUR', amount: 144.24 },
        { currency: 'USD', amount: 73.72 }
      ]),
      arpu: createMultiCurrencyAmount([
        { currency: 'GBP', amount: 108.33 },
        { currency: 'EUR', amount: 40.00 },
        { currency: 'USD', amount: 19.33 }
      ]),
      ltv: createMultiCurrencyAmount([
        { currency: 'GBP', amount: 520.75 },
        { currency: 'EUR', amount: 180.30 },
        { currency: 'USD', amount: 92.15 }
      ])
    }
  },
  {
    player_id: 'P004',
    currencies: ['RUB'],
    is_multi_currency: false,
    primary_currency: 'RUB',
    wallet_balances: { RUB: 45000.00 },
    financial_metrics: {
      total_deposits: createMultiCurrencyAmount([
        { currency: 'RUB', amount: 125000.00 }
      ]),
      total_withdrawals: createMultiCurrencyAmount([
        { currency: 'RUB', amount: 35000.00 }
      ]),
      net_deposits: createMultiCurrencyAmount([
        { currency: 'RUB', amount: 90000.00 }
      ]),
      ggr: createMultiCurrencyAmount([
        { currency: 'RUB', amount: 18750.00 }
      ]),
      ngr: createMultiCurrencyAmount([
        { currency: 'RUB', amount: 15000.00 }
      ]),
      arpu: createMultiCurrencyAmount([
        { currency: 'RUB', amount: 4166.67 }
      ]),
      ltv: createMultiCurrencyAmount([
        { currency: 'RUB', amount: 18750.00 }
      ])
    }
  },
  {
    player_id: 'P005',
    currencies: ['CAD', 'USD'],
    is_multi_currency: true,
    primary_currency: 'CAD',
    wallet_balances: { CAD: 1850.75, USD: 420.50 },
    financial_metrics: {
      total_deposits: createMultiCurrencyAmount([
        { currency: 'CAD', amount: 6750.00 },
        { currency: 'USD', amount: 1250.00 }
      ]),
      total_withdrawals: createMultiCurrencyAmount([
        { currency: 'CAD', amount: 1500.00 },
        { currency: 'USD', amount: 380.00 }
      ]),
      net_deposits: createMultiCurrencyAmount([
        { currency: 'CAD', amount: 5250.00 },
        { currency: 'USD', amount: 870.00 }
      ]),
      ggr: createMultiCurrencyAmount([
        { currency: 'CAD', amount: 1080.00 },
        { currency: 'USD', amount: 200.50 }
      ]),
      ngr: createMultiCurrencyAmount([
        { currency: 'CAD', amount: 864.00 },
        { currency: 'USD', amount: 160.40 }
      ]),
      arpu: createMultiCurrencyAmount([
        { currency: 'CAD', amount: 225.00 },
        { currency: 'USD', amount: 41.67 }
      ]),
      ltv: createMultiCurrencyAmount([
        { currency: 'CAD', amount: 1080.00 },
        { currency: 'USD', amount: 200.50 }
      ])
    }
  }
];

// Расширенные данные игроков с дополнительной информацией
export interface ExtendedPlayerData extends PlayerCurrencyData {
  name: string;
  email: string;
  status: 'Активен' | 'Спящий' | 'Отток';
  vip_level: 'ПреVIP 1' | 'ПреVIP 2' | 'ПреVIP 3' | 'VIP' | 'Обычный';
  churn_risk: 'Низкий' | 'Средний' | 'Высокий';
  last_activity: string;
  registration_date: string;
  language: 'EN' | 'DE' | 'RU' | 'ES' | 'FR';
  country: string;
  segments: string[];
}

export const extendedPlayersData: ExtendedPlayerData[] = [
  {
    ...multiCurrencyPlayersData[0],
    name: 'Alexander Schmidt',
    email: 'alex.schmidt@email.com',
    status: 'Активен',
    vip_level: 'VIP',
    churn_risk: 'Низкий',
    last_activity: '2025-01-20T14:30:00Z',
    registration_date: '2024-08-15T10:00:00Z',
    language: 'DE',
    country: 'Germany',
    segments: ['VIP Players', 'High Rollers', 'Multi-Currency']
  },
  {
    ...multiCurrencyPlayersData[1],
    name: 'Sarah Johnson',
    email: 'sarah.j@email.com',
    status: 'Активен',
    vip_level: 'ПреVIP 3',
    churn_risk: 'Низкий',
    last_activity: '2025-01-20T12:15:00Z',
    registration_date: '2024-09-22T14:30:00Z',
    language: 'EN',
    country: 'United States',
    segments: ['Regular Players', 'USD Only']
  },
  {
    ...multiCurrencyPlayersData[2],
    name: 'James Wilson',
    email: 'j.wilson@email.com',
    status: 'Спящий',
    vip_level: 'ПреVIP 2',
    churn_risk: 'Средний',
    last_activity: '2025-01-15T09:45:00Z',
    registration_date: '2024-07-10T16:20:00Z',
    language: 'EN',
    country: 'United Kingdom',
    segments: ['Sleeping Players', 'Multi-Currency', 'At Risk']
  },
  {
    ...multiCurrencyPlayersData[3],
    name: 'Dmitri Volkov',
    email: 'd.volkov@email.com',
    status: 'Активен',
    vip_level: 'ПреVIP 1',
    churn_risk: 'Низкий',
    last_activity: '2025-01-20T16:00:00Z',
    registration_date: '2024-10-05T11:15:00Z',
    language: 'RU',
    country: 'Russia',
    segments: ['RUB Players', 'New Players']
  },
  {
    ...multiCurrencyPlayersData[4],
    name: 'Emma Thompson',
    email: 'emma.t@email.com',
    status: 'Отток',
    vip_level: 'Обычный',
    churn_risk: 'Высокий',
    last_activity: '2025-01-10T08:30:00Z',
    registration_date: '2024-11-12T13:45:00Z',
    language: 'EN',
    country: 'Canada',
    segments: ['Churned Players', 'Multi-Currency', 'High Risk']
  }
];
