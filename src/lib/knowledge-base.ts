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
  }
];


