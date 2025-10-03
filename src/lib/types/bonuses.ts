/**
 * Типы и интерфейсы для бонусной системы
 * Согласно ТЗ: оборачиваемость, экономика, ретеншн
 */

// Типы бонусов
export type BonusType =
  | 'deposit'      // Депозитный
  | 'reload'       // Релоад
  | 'freespins'    // Фриспины
  | 'cashback'     // Кэшбэк
  | 'insurance'    // Страховка
  | 'tournament';  // Турнир

// Статус бонуса
export type BonusStatus =
  | 'draft'        // Черновик
  | 'active'       // Активен
  | 'paused'       // На паузе
  | 'completed';   // Завершён

// Сегменты игроков
export type PlayerSegment =
  | 'all'
  | 'new'
  | 'active'
  | 'vip'
  | 'at_risk'
  | 'churned';

// Основная структура бонуса
export interface Bonus {
  id: string;
  name: string;
  type: BonusType;
  status: BonusStatus;

  // География и валюта
  geo: string[];
  currency: string[];

  // Сегменты и период
  segments: PlayerSegment[];
  start_at: string;
  end_at: string;

  // Параметры бонуса
  params: {
    percent?: number;          // Процент бонуса (для депозитных)
    fixed_amount?: number;     // Фиксированная сумма
    w_req: number;            // Wagering requirement (множитель)
    min_dep: number;          // Минимальный депозит
    max_win: number;          // Максимальный выигрыш
    rollover_days: number;    // Дней на отыгрыш
  };

  // Метаданные
  created_by: string;
  updated_by: string;
  created_at: string;
  updated_at: string;

  // AI рекомендации
  ai_recommended?: boolean;
}

// Статистика бонуса за день
export interface BonusStatDaily {
  bonus_id: string;
  date: string;

  // Воронка
  sent: number;              // Отправлено
  viewed: number;            // Просмотрено
  activated: number;         // Активировано

  // Депозиты и отыгрыш
  deposit_count_from_bonus: number;
  deposit_amount_from_bonus: number;
  wager_amount: number;

  // Завершение
  completion_count: number;
  completion_rate: number;    // %

  // Abuse
  abuse_count: number;
  abuse_rate: number;         // %

  // Экономика
  net_revenue: number;        // Чистая выручка (Rev - C_bonus)
  bonus_cost: number;         // Стоимость бонусов
  net_roi: number;            // Чистый ROI
  effective_cost_pct: number; // Эффективная стоимость %

  // Время отыгрыша
  time_to_completion_p50: number; // Медианное время (часы)

  // Ретеншн
  retention_d7: number;       // %
  retention_d30: number;      // %
}

// Агрегированные KPI бонуса
export interface BonusKPI {
  bonus_id: string;
  period: {
    start: string;
    end: string;
  };

  // Оборачиваемость бонусов
  completion_rate: number;           // % завершивших отыгрыш
  wagering_progress_avg: number;     // Средний прогресс отыгрыша %
  avg_wagering_cycles: number;       // T_bet / B
  time_to_completion_median: number; // Медианное время (часы)
  breakage_rate: number;             // Не завершили до дедлайна %
  early_abandon_rate: number;        // Бросили на раннем этапе %

  // Экономика
  take_up_rate: number;              // Активировали / Получили %
  activation_to_deposit_cr: number;  // Депозит после бонуса / Получившие %
  deposit_uplift: number;            // (D_with - D_control) / D_control %
  net_revenue: number;               // €
  bonus_roi_gross: number;           // (Rev / C_bonus) - 1
  bonus_roi_net: number;             // (NetRev / C_bonus) - 1
  effective_cost_pct: number;        // C_bonus / D_with_bonus %
  bonus_liability: number;           // Текущие обязательства €
  abuse_rate: number;                // %

  // Влияние на удержание
  retention_uplift_d7: number;       // Разница с контролем %
  retention_uplift_d30: number;      // Разница с контролем %
  repeat_deposit_rate: number;       // После завершения %
  vip_save_rate: number;             // VIP выведенные из At-Risk %
}

// Временные ряды для графиков
export interface BonusTimeSeries {
  date: string;
  completion_rate: number;
  net_roi: number;
  abuse_rate: number;
  wagering_progress: number;
  deposits_from_bonus: number;
  deposits_control: number;
}

// История версий бонуса
export interface BonusVersion {
  bonus_id: string;
  version: number;
  changed_at: string;
  changed_by: string;
  diff: {
    field: string;
    old_value: any;
    new_value: any;
  }[];
  comment?: string;
}

// Рекомендация AI
export interface BonusRecommendation {
  id: string;
  bonus_id: string;
  type: 'adjust_percent' | 'adjust_wagering' | 'adjust_segment' | 'adjust_deadline';
  message: string;
  expected_uplift: {
    deposit_uplift?: number;
    completion_change?: number;
    net_roi_change?: number;
  };
  created_at: string;
  status: 'pending' | 'applied' | 'rejected';
  priority: 'high' | 'medium' | 'low';
}

// Вклад сегмента в бонус
export interface BonusSegmentContribution {
  segment: PlayerSegment;
  users: number;
  deposits: number;
  completion_rate: number;
  net_roi: number;
}

// Паттерны злоупотреблений
export interface AbusePattern {
  type: 'multi_account' | 'bonus_hunting' | 'low_risk_betting' | 'arbitrage';
  count: number;
  users: string[];
  detected_at: string;
}

// Фильтры для списка бонусов
export interface BonusFilters {
  period?: {
    start: string;
    end: string;
  };
  type?: BonusType[];
  status?: BonusStatus[];
  segment?: PlayerSegment[];
  geo?: string[];
  currency?: string[];

  // Диапазоны KPI
  roi_min?: number;
  roi_max?: number;
  completion_min?: number;
  completion_max?: number;
  abuse_max?: number;
}

// Сортировка
export type BonusSortField =
  | 'net_roi'
  | 'completion_rate'
  | 'deposit_uplift'
  | 'abuse_rate'
  | 'created_at';

export type BonusSortDirection = 'asc' | 'desc';

// Детальная карточка бонуса
export interface BonusDetail extends Bonus {
  kpi: BonusKPI;
  timeseries: BonusTimeSeries[];
  versions: BonusVersion[];
  recommendations: BonusRecommendation[];
  segment_contributions: BonusSegmentContribution[];
  abuse_patterns: AbusePattern[];
}
