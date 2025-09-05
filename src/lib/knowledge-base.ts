export type KnowledgeMetric = {
  id: string;
  section: string;            // finance, retention, engagement
  type: 'base'|'derived';
  name: string;               // GGR
  aliases?: string[];
  definition: string;
  formula?: string;
  fields: Array<{
    field: string;
    dtype: 'number'|'string'|'datetime'|'currency'|'bool';
    source: string;
    sourceVendors?: string[];
    level: 1|2|3|4|5;
  }>;
  sources: Array<{
    system: string;
    vendors?: string[];
    notes?: string;
  }>;
  examples?: Array<{ input: Record<string, number|string>, result: string }>;
  uiUsage: Array<{
    page: string;
    widget: string;
    note?: string;
    deeplink?: string;
  }>;
  caveats?: string[];
  related?: string[];
  version: string;
  updatedAt: string;
  updatedBy: string;
  i18n?: { ru?: Partial<Pick<KnowledgeMetric, 'name'|'definition'|'formula'>> };
  restricted?: boolean;
  requiredRole?: string;
};

export type KnowledgeBaseResponse = {
  kbVersion: string;
  metrics: KnowledgeMetric[];
};

export const KB_VERSION = '1.0.0';

export const KB_MOCK: KnowledgeMetric[] = [
  {
    id: 'ggr',
    section: 'finance',
    type: 'derived',
    name: 'GGR',
    aliases: ['Gross Gaming Revenue'],
    definition: 'Сумма ставок минус сумма выигрышей за период.',
    formula: 'GGR = Total Bets - Total Wins',
    fields: [
      { field: 'total_bets', dtype: 'currency', source: 'Gameplay API', level: 1 },
      { field: 'total_wins', dtype: 'currency', source: 'Gameplay API', level: 1 }
    ],
    sources: [ { system: 'Gameplay', vendors: ['EveryMatrix','SoftSwiss'] } ],
    examples: [ { input: { total_bets: 1000, total_wins: 800 }, result: '200' } ],
    uiUsage: [
      { page: '/analytics', widget: 'Dashboard/KPI card', deeplink: '/knowledge-base/ggr' },
      { page: '/players/:id', widget: 'Players/Finance card', deeplink: '/knowledge-base/ggr' }
    ],
    caveats: ['учёт валют', 'лаг 24ч'],
    related: ['ngr','hold'],
    version: '1.0.0',
    updatedAt: new Date().toISOString(),
    updatedBy: 'data-team@example.com',
    i18n: { ru: { name: 'GGR', definition: 'Валовый игровой доход: ставки минус выигрыши.' } }
  },
  {
    id: 'ltv',
    section: 'finance',
    type: 'derived',
    name: 'LTV',
    definition: 'Суммарная маржа от игрока за весь жизненный цикл.',
    formula: 'LTV = Deposits - Withdrawals - Bonuses',
    fields: [
      { field: 'deposits', dtype: 'currency', source: 'Payments API', level: 1 },
      { field: 'withdrawals', dtype: 'currency', source: 'Payments API', level: 1 },
      { field: 'bonuses', dtype: 'currency', source: 'CRM/CDP', level: 2 }
    ],
    sources: [ { system: 'Payments', vendors: ['EveryMatrix'] }, { system: 'CRM/CDP', vendors: ['Smartico','Optimove'] } ],
    uiUsage: [ { page: '/players/:id', widget: 'Players/Finance card' } ],
    caveats: ['учёт валют'],
    related: ['arppu','arpu'],
    version: '1.1.0',
    updatedAt: new Date().toISOString(),
    updatedBy: 'data-team@example.com'
  },
  {
    id: 'arpu',
    section: 'finance',
    type: 'derived',
    name: 'ARPU',
    aliases: ['Average Revenue Per User'],
    definition: 'Средний доход на одного активного пользователя за период в базовой валюте.',
    formula: 'ARPU = Revenue / Active Users',
    fields: [
      { field: 'revenue', dtype: 'currency', source: 'Payments API', level: 1 },
      { field: 'active_users', dtype: 'number', source: 'CRM/CDP', level: 2 }
    ],
    sources: [ { system: 'Payments' }, { system: 'CRM/CDP' } ],
    uiUsage: [ { page: '/analytics', widget: 'Dashboard/KPI card' } ],
    caveats: ['учёт валют', 'лаг 24ч'],
    related: ['arppu','ltv'],
    version: '1.0.0',
    updatedAt: new Date().toISOString(),
    updatedBy: 'data-team@example.com'
  },
  {
    id: 'arppu',
    section: 'finance',
    type: 'derived',
    name: 'ARPPU',
    aliases: ['Average Revenue Per Paying User'],
    definition: 'Средний доход на одного платящего пользователя за период (в базовой валюте).',
    formula: 'ARPPU = Revenue / Paying Users',
    fields: [
      { field: 'revenue', dtype: 'currency', source: 'Payments API', level: 1 },
      { field: 'paying_users', dtype: 'number', source: 'Payments API', level: 1 }
    ],
    sources: [ { system: 'Payments' } ],
    uiUsage: [ { page: '/analytics', widget: 'Dashboard/KPI card' } ],
    caveats: ['учёт валют'],
    related: ['arpu','ltv'],
    version: '1.0.0',
    updatedAt: new Date().toISOString(),
    updatedBy: 'data-team@example.com'
  },
  {
    id: 'retention_rate',
    section: 'retention',
    type: 'derived',
    name: 'Retention Rate',
    aliases: ['D1','D7','D30 Retention'],
    definition: 'Доля пользователей, вернувшихся в продукт через заданное число дней после установки/регистрации.',
    formula: 'Retention Rate Dx = Returned Users on day x / Cohort Size * 100%',
    fields: [
      { field: 'cohort_size', dtype: 'number', source: 'CRM/CDP', level: 2 },
      { field: 'returned_users', dtype: 'number', source: 'CRM/CDP', level: 2 }
    ],
    sources: [ { system: 'CRM/CDP' } ],
    uiUsage: [ { page: '/analytics', widget: 'Cohort chart' } ],
    caveats: ['лаг 24ч'],
    related: ['churn_rate'],
    version: '1.0.0',
    updatedAt: new Date().toISOString(),
    updatedBy: 'data-team@example.com'
  },
  {
    id: 'churn_rate',
    section: 'retention',
    type: 'derived',
    name: 'Churn Rate',
    definition: 'Доля пользователей, не проявивших активность в течение заданного периода.',
    formula: 'Churn Rate = Churned Users / Active Users at start * 100%',
    fields: [
      { field: 'churned_users', dtype: 'number', source: 'CRM/CDP', level: 2 },
      { field: 'active_users_start', dtype: 'number', source: 'CRM/CDP', level: 2 }
    ],
    sources: [ { system: 'CRM/CDP' } ],
    uiUsage: [ { page: '/analytics', widget: 'Dashboard/KPI card' } ],
    caveats: ['определение активности зависит от проекта'],
    related: ['retention_rate'],
    version: '1.0.0',
    updatedAt: new Date().toISOString(),
    updatedBy: 'data-team@example.com'
  },
  {
    id: 'conversion_rate',
    section: 'conversion',
    type: 'derived',
    name: 'Conversion Rate',
    definition: 'Конверсия из зарегистрированных в сделавших первый депозит (FTD).',
    formula: 'CR = FTD Users / New Registered Users * 100%',
    fields: [
      { field: 'ftd_users', dtype: 'number', source: 'Payments API', level: 1 },
      { field: 'new_registered', dtype: 'number', source: 'CRM/CDP', level: 2 }
    ],
    sources: [ { system: 'Payments' }, { system: 'CRM/CDP' } ],
    uiUsage: [ { page: '/analytics', widget: 'Funnel' } ],
    caveats: ['учёт мультивалютности не требуется'],
    related: ['re_deposit_rate'],
    version: '1.0.0',
    updatedAt: new Date().toISOString(),
    updatedBy: 'data-team@example.com'
  },
  {
    id: 'bonus_utilization_rate',
    section: 'engagement',
    type: 'derived',
    name: 'Bonus Utilization Rate',
    definition: 'Доля активированных бонусов от выданных за период.',
    formula: 'BUR = Activated Bonuses / Issued Bonuses * 100%',
    fields: [
      { field: 'issued_bonuses', dtype: 'number', source: 'CRM/CDP', level: 2 },
      { field: 'activated_bonuses', dtype: 'number', source: 'CRM/CDP', level: 2 }
    ],
    sources: [ { system: 'CRM/CDP' } ],
    uiUsage: [ { page: '/analytics', widget: 'Dashboard/KPI card' } ],
    caveats: ['задержка наполняемости событий'],
    related: ['conversion_rate'],
    version: '1.0.0',
    updatedAt: new Date().toISOString(),
    updatedBy: 'data-team@example.com'
  },
  {
    id: 'withdrawal_success_rate',
    section: 'finance',
    type: 'derived',
    name: 'Withdrawal Success Rate',
    definition: 'Доля успешных выплат среди всех запросов на вывод.',
    formula: 'WSR = Successful Withdrawals / Total Withdrawal Requests * 100%',
    fields: [
      { field: 'withdrawal_requests', dtype: 'number', source: 'Payments API', level: 1 },
      { field: 'withdrawal_success', dtype: 'number', source: 'Payments API', level: 1 }
    ],
    sources: [ { system: 'Payments' } ],
    uiUsage: [ { page: '/analytics', widget: 'Dashboard/KPI card' } ],
    caveats: ['антифрод/повторные попытки'],
    related: ['hold'],
    version: '1.0.0',
    updatedAt: new Date().toISOString(),
    updatedBy: 'data-team@example.com'
  },
  {
    id: 'avg_deposit',
    section: 'finance',
    type: 'derived',
    name: 'Average Deposit Amount',
    aliases: ['AVG DEP'],
    definition: 'Средняя сумма депозита в базовой валюте.',
    formula: 'AVG DEP = Sum(Deposit Amount) / Number of Deposits',
    fields: [
      { field: 'deposit_amount', dtype: 'currency', source: 'Payments API', level: 1 },
      { field: 'deposit_count', dtype: 'number', source: 'Payments API', level: 1 }
    ],
    sources: [ { system: 'Payments' } ],
    uiUsage: [ { page: '/analytics', widget: 'Dashboard/KPI card' } ],
    caveats: ['учёт валют'],
    related: ['arpu'],
    version: '1.0.0',
    updatedAt: new Date().toISOString(),
    updatedBy: 'data-team@example.com'
  }
];


