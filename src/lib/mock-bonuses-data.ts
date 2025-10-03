/**
 * Моковые данные для бонусной системы
 * 30-50 бонусов с реалистичными KPI и временными рядами
 */

import {
  Bonus,
  BonusKPI,
  BonusTimeSeries,
  BonusVersion,
  BonusRecommendation,
  BonusSegmentContribution,
  AbusePattern,
  BonusDetail,
  BonusType,
  BonusStatus,
  PlayerSegment,
} from './types/bonuses';

// Генератор случайных чисел в диапазоне
const random = (min: number, max: number) => Math.random() * (max - min) + min;
const randomInt = (min: number, max: number) => Math.floor(random(min, max));

// Генератор реалистичных временных рядов
export function generateTimeSeries(days: number = 30): BonusTimeSeries[] {
  const data: BonusTimeSeries[] = [];
  const now = new Date();

  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);

    const dayProgress = (days - i) / days;
    const weekDay = date.getDay();
    const isWeekend = weekDay === 0 || weekDay === 6;

    data.push({
      date: date.toISOString().split('T')[0],
      completion_rate: 35 + dayProgress * 15 + random(-5, 5),
      net_roi: 150 + dayProgress * 100 + random(-30, 30),
      abuse_rate: 2.5 - dayProgress * 0.5 + random(-0.5, 0.5),
      wagering_progress: 40 + dayProgress * 30 + random(-10, 10),
      deposits_from_bonus: randomInt(10000, 50000) * (isWeekend ? 1.3 : 1),
      deposits_control: randomInt(8000, 40000) * (isWeekend ? 1.2 : 1),
    });
  }

  return data;
}

// Генератор названий бонусов
const bonusNames = [
  'Welcome Package 200%',
  'Weekend Reload 50%',
  'VIP Cashback 15%',
  'Monday Madness 100%',
  'First Deposit Boost 150%',
  'Reload Wednesday 75%',
  'High Roller 300%',
  'New Player Freespins 100',
  'Loyalty Cashback 10%',
  'Friday Freeroll Tournament',
  'Midweek Reload 50%',
  'Mega Weekend 200%',
  'VIP Exclusive 25% Cashback',
  'Second Chance 100%',
  'Monthly Loyalty 20%',
  'Daily Drop Freespins',
  'Bronze VIP Reload 40%',
  'Silver VIP Bonus 60%',
  'Gold VIP Package 100%',
  'Platinum VIP Cashback 20%',
  'New Year Mega 300%',
  'Christmas Special 250%',
  'Black Friday 500%',
  'Birthday Bonus 100%',
  'Anniversary Celebration 200%',
  'Summer Splash 150%',
  'Spring Festival 125%',
  'Autumn Bonus 100%',
  'Winter Reload 75%',
  'Halloween Spooky 200%',
  'Valentine Love 100%',
  'Easter Egg 150%',
  'Risk-Free Bet Insurance',
  'Weekly Tournament Prize',
  'Mega Slot Race',
  'Live Casino Cashback 12%',
  'Sports Welcome 100%',
  'Crypto Reload 80%',
  'Mobile-Only Bonus 120%',
  'Fast Track VIP 200%',
];

// Генератор бонусов
export function generateMockBonuses(count: number = 40): Bonus[] {
  const bonuses: Bonus[] = [];
  const types: BonusType[] = ['deposit', 'reload', 'freespins', 'cashback', 'insurance', 'tournament'];
  const statuses: BonusStatus[] = ['active', 'active', 'active', 'paused', 'completed', 'draft'];
  const geos = [['RU'], ['KZ'], ['RU', 'KZ'], ['BY'], ['UZ'], ['ALL']];
  const currencies = [['EUR'], ['USD'], ['RUB'], ['KZT'], ['EUR', 'USD']];
  const segmentOptions: PlayerSegment[][] = [
    ['all'],
    ['new'],
    ['vip'],
    ['at_risk'],
    ['active'],
    ['vip', 'active'],
    ['new', 'active'],
  ];

  for (let i = 0; i < count; i++) {
    const type = types[i % types.length];
    const status = statuses[i % statuses.length];

    bonuses.push({
      id: `bonus_${i + 1}`,
      name: bonusNames[i] || `Bonus ${i + 1}`,
      type,
      status,
      geo: geos[i % geos.length],
      currency: currencies[i % currencies.length],
      segments: segmentOptions[i % segmentOptions.length],
      start_at: new Date(Date.now() - randomInt(10, 90) * 24 * 60 * 60 * 1000).toISOString(),
      end_at: new Date(Date.now() + randomInt(10, 90) * 24 * 60 * 60 * 1000).toISOString(),
      params: {
        percent: type === 'deposit' || type === 'reload' ? randomInt(50, 300) : undefined,
        fixed_amount: type === 'freespins' ? randomInt(10, 100) : undefined,
        w_req: type === 'cashback' ? randomInt(5, 15) : randomInt(20, 50),
        min_dep: randomInt(10, 100),
        max_win: randomInt(500, 5000),
        rollover_days: randomInt(7, 30),
      },
      created_by: 'admin',
      updated_by: 'admin',
      created_at: new Date(Date.now() - randomInt(30, 180) * 24 * 60 * 60 * 1000).toISOString(),
      updated_at: new Date(Date.now() - randomInt(1, 30) * 24 * 60 * 60 * 1000).toISOString(),
      ai_recommended: i % 5 === 0, // Каждый 5-й бонус рекомендован AI
    });
  }

  return bonuses;
}

// Генератор KPI для бонуса
export function generateBonusKPI(bonusId: string, bonusType: BonusType): BonusKPI {
  const isGoodBonus = Math.random() > 0.3;

  return {
    bonus_id: bonusId,
    period: {
      start: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      end: new Date().toISOString().split('T')[0],
    },

    // Оборачиваемость
    completion_rate: random(isGoodBonus ? 35 : 20, isGoodBonus ? 65 : 40),
    wagering_progress_avg: random(40, 85),
    avg_wagering_cycles: random(1.5, 4.5),
    time_to_completion_median: random(24, 120),
    breakage_rate: random(15, 35),
    early_abandon_rate: random(10, 25),

    // Экономика
    take_up_rate: random(isGoodBonus ? 60 : 40, isGoodBonus ? 85 : 65),
    activation_to_deposit_cr: random(isGoodBonus ? 15 : 8, isGoodBonus ? 30 : 18),
    deposit_uplift: random(isGoodBonus ? 20 : 5, isGoodBonus ? 50 : 25),
    net_revenue: random(50000, 500000),
    bonus_roi_gross: random(isGoodBonus ? 2 : 1.2, isGoodBonus ? 5 : 2.5),
    bonus_roi_net: random(isGoodBonus ? 1.5 : 0.8, isGoodBonus ? 4 : 2),
    effective_cost_pct: random(5, 15),
    bonus_liability: random(10000, 100000),
    abuse_rate: random(1, isGoodBonus ? 3 : 8),

    // Ретеншн
    retention_uplift_d7: random(isGoodBonus ? 8 : 2, isGoodBonus ? 20 : 10),
    retention_uplift_d30: random(isGoodBonus ? 5 : 1, isGoodBonus ? 15 : 8),
    repeat_deposit_rate: random(isGoodBonus ? 25 : 15, isGoodBonus ? 45 : 30),
    vip_save_rate: random(isGoodBonus ? 30 : 10, isGoodBonus ? 60 : 35),
  };
}

// Генератор версий бонуса
export function generateBonusVersions(bonusId: string): BonusVersion[] {
  const versions: BonusVersion[] = [];
  const versionCount = randomInt(2, 6);

  for (let i = 0; i < versionCount; i++) {
    versions.push({
      bonus_id: bonusId,
      version: i + 1,
      changed_at: new Date(Date.now() - (versionCount - i) * 7 * 24 * 60 * 60 * 1000).toISOString(),
      changed_by: i % 2 === 0 ? 'admin' : 'manager',
      diff: [
        {
          field: 'params.w_req',
          old_value: 40 + i * 5,
          new_value: 35 + i * 5,
        },
        {
          field: 'params.rollover_days',
          old_value: 30 - i * 2,
          new_value: 25 - i * 2,
        },
      ],
      comment: i === 0 ? 'Начальная версия' : `Оптимизация wagering требований - итерация ${i}`,
    });
  }

  return versions;
}

// Генератор рекомендаций AI
export function generateBonusRecommendations(bonusId: string, kpi: BonusKPI): BonusRecommendation[] {
  const recommendations: BonusRecommendation[] = [];

  // Если completion_rate низкий
  if (kpi.completion_rate < 40) {
    recommendations.push({
      id: `reco_${bonusId}_1`,
      bonus_id: bonusId,
      type: 'adjust_wagering',
      message: `Снизить wagering requirement для повышения completion rate. Текущий CR: ${kpi.completion_rate.toFixed(1)}%`,
      expected_uplift: {
        completion_change: random(10, 20),
        deposit_uplift: random(5, 15),
      },
      created_at: new Date().toISOString(),
      status: 'pending',
      priority: 'high',
    });
  }

  // Если ROI отрицательный
  if (kpi.bonus_roi_net < 1) {
    recommendations.push({
      id: `reco_${bonusId}_2`,
      bonus_id: bonusId,
      type: 'adjust_percent',
      message: `Уменьшить размер бонуса для улучшения экономики. Текущий Net ROI: ${((kpi.bonus_roi_net - 1) * 100).toFixed(1)}%`,
      expected_uplift: {
        net_roi_change: random(30, 60),
      },
      created_at: new Date().toISOString(),
      status: 'pending',
      priority: 'high',
    });
  }

  // Если abuse_rate высокий
  if (kpi.abuse_rate > 5) {
    recommendations.push({
      id: `reco_${bonusId}_3`,
      bonus_id: bonusId,
      type: 'adjust_segment',
      message: `Ограничить сегменты для снижения abuse rate. Текущий: ${kpi.abuse_rate.toFixed(1)}%`,
      expected_uplift: {
        completion_change: random(5, 10),
      },
      created_at: new Date().toISOString(),
      status: 'pending',
      priority: 'medium',
    });
  }

  // Если breakage_rate высокий
  if (kpi.breakage_rate > 25) {
    recommendations.push({
      id: `reco_${bonusId}_4`,
      bonus_id: bonusId,
      type: 'adjust_deadline',
      message: `Увеличить срок отыгрыша. Текущий breakage rate: ${kpi.breakage_rate.toFixed(1)}%`,
      expected_uplift: {
        completion_change: random(8, 15),
        deposit_uplift: random(3, 8),
      },
      created_at: new Date().toISOString(),
      status: 'pending',
      priority: 'medium',
    });
  }

  return recommendations;
}

// Генератор вклада сегментов
export function generateSegmentContributions(bonusId: string): BonusSegmentContribution[] {
  const segments: PlayerSegment[] = ['new', 'active', 'vip', 'at_risk'];

  return segments.map((segment) => ({
    segment,
    users: randomInt(100, 5000),
    deposits: random(10000, 200000),
    completion_rate: random(25, 65),
    net_roi: random(1.2, 4.5),
  }));
}

// Генератор паттернов злоупотреблений
export function generateAbusePatterns(): AbusePattern[] {
  return [
    {
      type: 'multi_account',
      count: randomInt(5, 25),
      users: Array(randomInt(5, 25))
        .fill(0)
        .map((_, i) => `user_${i + 1000}`),
      detected_at: new Date(Date.now() - randomInt(1, 30) * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      type: 'bonus_hunting',
      count: randomInt(3, 15),
      users: Array(randomInt(3, 15))
        .fill(0)
        .map((_, i) => `user_${i + 2000}`),
      detected_at: new Date(Date.now() - randomInt(1, 20) * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      type: 'low_risk_betting',
      count: randomInt(2, 10),
      users: Array(randomInt(2, 10))
        .fill(0)
        .map((_, i) => `user_${i + 3000}`),
      detected_at: new Date(Date.now() - randomInt(1, 15) * 24 * 60 * 60 * 1000).toISOString(),
    },
  ];
}

// Генератор полной детализации бонуса
export function generateBonusDetail(bonus: Bonus): BonusDetail {
  const kpi = generateBonusKPI(bonus.id, bonus.type);

  return {
    ...bonus,
    kpi,
    timeseries: generateTimeSeries(30),
    versions: generateBonusVersions(bonus.id),
    recommendations: generateBonusRecommendations(bonus.id, kpi),
    segment_contributions: generateSegmentContributions(bonus.id),
    abuse_patterns: generateAbusePatterns(),
  };
}

// Экспорт моковых данных
export const MOCK_BONUSES = generateMockBonuses(40);

// Функция для получения детализации по ID
export function getBonusDetail(bonusId: string): BonusDetail | null {
  const bonus = MOCK_BONUSES.find((b) => b.id === bonusId);
  if (!bonus) return null;
  return generateBonusDetail(bonus);
}

// Функция для фильтрации и сортировки бонусов
export function filterAndSortBonuses(
  bonuses: Bonus[],
  filters?: {
    type?: string[];
    status?: string[];
    segment?: string[];
  },
  sortField?: string,
  sortDirection?: 'asc' | 'desc'
): Bonus[] {
  let filtered = [...bonuses];

  // Применяем фильтры
  if (filters?.type && filters.type.length > 0) {
    filtered = filtered.filter((b) => filters.type!.includes(b.type));
  }

  if (filters?.status && filters.status.length > 0) {
    filtered = filtered.filter((b) => filters.status!.includes(b.status));
  }

  if (filters?.segment && filters.segment.length > 0) {
    filtered = filtered.filter((b) => b.segments.some((s) => filters.segment!.includes(s)));
  }

  // Сортировка (на клиенте для демо)
  if (sortField) {
    filtered.sort((a, b) => {
      const kpiA = generateBonusKPI(a.id, a.type);
      const kpiB = generateBonusKPI(b.id, b.type);

      let valA = 0;
      let valB = 0;

      switch (sortField) {
        case 'net_roi':
          valA = kpiA.bonus_roi_net;
          valB = kpiB.bonus_roi_net;
          break;
        case 'completion_rate':
          valA = kpiA.completion_rate;
          valB = kpiB.completion_rate;
          break;
        case 'deposit_uplift':
          valA = kpiA.deposit_uplift;
          valB = kpiB.deposit_uplift;
          break;
        case 'abuse_rate':
          valA = kpiA.abuse_rate;
          valB = kpiB.abuse_rate;
          break;
      }

      return sortDirection === 'asc' ? valA - valB : valB - valA;
    });
  }

  return filtered;
}
