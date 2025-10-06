/**
 * Валидатор и корреляции для моковых данных
 * Проверяет реалистичность метрик и их взаимосвязи
 */

export interface MetricRange {
  min: number;
  max: number;
  unit: string;
  description: string;
}

export interface MetricRanges {
  [key: string]: MetricRange;
}

// Реалистичные диапазоны метрик для iGaming (mid-tier казино)
export const REALISTIC_RANGES: MetricRanges = {
  // Финансовые метрики (недельные)
  ggr_weekly: { min: 80000, max: 250000, unit: '€', description: 'GGR за неделю' },
  crm_spend_weekly: { min: 2000, max: 8000, unit: '€', description: 'CRM расходы за неделю' },
  arpu: { min: 45, max: 160, unit: '€', description: 'Средний доход на пользователя' },

  // Retention (30D)
  retention_d30: { min: 25, max: 45, unit: '%', description: 'Retention 30 дней' },
  retention_d7: { min: 32, max: 55, unit: '%', description: 'Retention 7 дней' },

  // Конверсия
  conversion_reg_to_dep: { min: 18, max: 35, unit: '%', description: 'Конверсия регистрация → депозит' },

  // Бонусы
  bonus_completion_rate: { min: 30, max: 60, unit: '%', description: 'Процент отыгранных бонусов' },
  bonus_net_roi: { min: 110, max: 160, unit: '%', description: 'Net ROI бонусов' },
  bonus_deposit_uplift: { min: 10, max: 30, unit: '%', description: 'Прирост депозитов от бонусов' },
  bonus_abuse_rate: { min: 1.5, max: 4, unit: '%', description: 'Процент злоупотреблений' },
  bonus_breakage: { min: 15, max: 25, unit: '%', description: 'Процент неотыгранных бонусов' },

  // AI рекомендации
  ai_revenue_impact: { min: 5, max: 15, unit: '%', description: 'Влияние на месячный доход' },
  ai_loss_prevention: { min: 30000, max: 100000, unit: '€', description: 'Предотвращение оттока' },
  ai_bonus_optimization: { min: 8, max: 25, unit: '% uplift GGR', description: 'Оптимизация бонусов' },
  ai_ctr_growth: { min: 20, max: 45, unit: '%', description: 'Рост CTR при оптимизации' },

  // Сегменты
  segment_new_players: { min: 1000, max: 3000, unit: 'игроков', description: 'Новые (7 дней)' },
  segment_new_deposit: { min: 50, max: 100, unit: '€', description: 'Средний первый депозит' },
  segment_vip_players: { min: 300, max: 800, unit: 'игроков', description: 'VIP игроки' },
  segment_vip_deposit: { min: 400, max: 1000, unit: '€', description: 'VIP средний депозит' },
  segment_churn_risk: { min: 600, max: 1500, unit: 'игроков', description: 'Риск оттока' },
};

// Проверка метрики на нахождение в реалистичном диапазоне
export function validateMetric(
  metricKey: string,
  value: number
): { valid: boolean; message?: string } {
  const range = REALISTIC_RANGES[metricKey];
  if (!range) {
    return { valid: true }; // Нет правила - пропускаем
  }

  if (value < range.min || value > range.max) {
    return {
      valid: false,
      message: `${range.description}: ${value} вне диапазона ${range.min}-${range.max} ${range.unit}`,
    };
  }

  return { valid: true };
}

// Проверка корреляций между метриками
export function validateCorrelations(metrics: {
  retention_rate?: number;
  arpu?: number;
  crm_spend_percent?: number;
  bonus_utilization?: number;
  breakage?: number;
  deposit_uplift?: number;
  abuse_rate?: number;
  net_roi?: number;
  completion_rate?: number;
}): { valid: boolean; warnings: string[] } {
  const warnings: string[] = [];

  // Корреляция 1: Если Retention растёт → ARPU растёт, CRM Spend/GGR % падает
  if (
    metrics.retention_rate !== undefined &&
    metrics.arpu !== undefined &&
    metrics.crm_spend_percent !== undefined
  ) {
    if (metrics.retention_rate > 38 && metrics.arpu < 70) {
      warnings.push(
        'Высокий Retention обычно коррелирует с более высоким ARPU (> 70€)'
      );
    }
  }

  // Корреляция 2: Если Bonus Utilization падает → Breakage растёт, Deposit Uplift падает
  if (
    metrics.bonus_utilization !== undefined &&
    metrics.breakage !== undefined &&
    metrics.deposit_uplift !== undefined
  ) {
    if (metrics.bonus_utilization < 45 && metrics.breakage < 20) {
      warnings.push(
        'Низкая утилизация бонусов обычно приводит к высокому Breakage (> 20%)'
      );
    }
    if (metrics.bonus_utilization < 45 && metrics.deposit_uplift > 25) {
      warnings.push(
        'Низкая утилизация бонусов редко даёт высокий Deposit Uplift'
      );
    }
  }

  // Корреляция 3: Если Abuse Rate > 4% → снижать Net ROI на 10-15%
  if (metrics.abuse_rate !== undefined && metrics.net_roi !== undefined) {
    if (metrics.abuse_rate > 4 && metrics.net_roi > 1.4) {
      warnings.push(
        'Высокий Abuse Rate (> 4%) обычно снижает Net ROI до 110-130%'
      );
    }
  }

  // Корреляция 4: Высокая completion rate должна коррелировать с лучшим ROI
  if (
    metrics.completion_rate !== undefined &&
    metrics.net_roi !== undefined
  ) {
    if (metrics.completion_rate > 55 && metrics.net_roi < 1.3) {
      warnings.push(
        'Высокий Completion Rate (> 55%) обычно даёт Net ROI > 130%'
      );
    }
  }

  // Корреляция 5: Проверка ROI > 400% (нереально без крупного объёма)
  if (metrics.net_roi !== undefined && metrics.net_roi > 4.0) {
    warnings.push('ROI > 400% нереалистично для iGaming без экстра-трафика');
  }

  // Корреляция 6: Retention > 70% нереалистично
  if (metrics.retention_rate !== undefined && metrics.retention_rate > 70) {
    warnings.push('Retention > 70% встречается крайне редко в iGaming');
  }

  // Корреляция 7: Conversion > 50% нереалистично
  if (
    metrics.deposit_uplift !== undefined &&
    metrics.deposit_uplift > 50
  ) {
    warnings.push('Deposit Uplift > 50% крайне редок в индустрии');
  }

  // Корреляция 8: Abuse Rate < 1% недостоверно
  if (metrics.abuse_rate !== undefined && metrics.abuse_rate < 1) {
    warnings.push('Abuse Rate < 1% нетипично низкий для бонусных программ');
  }

  return {
    valid: warnings.length === 0,
    warnings,
  };
}

// Генератор связанных метрик с учётом корреляций
export function generateCorrelatedMetrics(baseMetrics: {
  retention_rate: number;
  active_players: number;
  avg_deposit: number;
}): {
  arpu: number;
  crm_spend: number;
  bonus_utilization: number;
  breakage: number;
  deposit_uplift: number;
} {
  const { retention_rate, active_players, avg_deposit } = baseMetrics;

  // ARPU растёт с ростом retention
  const arpu =
    retention_rate > 38
      ? 80 + (retention_rate - 38) * 2.5
      : 55 + retention_rate * 0.8;

  // CRM Spend масштабируется с количеством игроков
  const crm_spend = (active_players / 1000) * (500 + Math.random() * 300);

  // Bonus utilization обратно коррелирует с breakage
  const bonus_utilization = 45 + Math.random() * 20;
  const breakage = 35 - bonus_utilization * 0.3;

  // Deposit uplift зависит от утилизации бонусов
  const deposit_uplift =
    bonus_utilization > 55
      ? 20 + Math.random() * 10
      : 12 + Math.random() * 8;

  return {
    arpu: Math.round(arpu * 100) / 100,
    crm_spend: Math.round(crm_spend),
    bonus_utilization: Math.round(bonus_utilization * 10) / 10,
    breakage: Math.round(breakage * 10) / 10,
    deposit_uplift: Math.round(deposit_uplift * 10) / 10,
  };
}

// Автоматическая корректировка метрик с учётом корреляций
export function autoCorrectMetrics(metrics: Record<string, number>): {
  corrected: Record<string, number>;
  changes: string[];
} {
  const corrected = { ...metrics };
  const changes: string[] = [];

  // Коррекция 1: Если Abuse Rate высокий, снизить ROI
  if (corrected.abuse_rate > 4 && corrected.net_roi > 1.4) {
    const oldROI = corrected.net_roi;
    corrected.net_roi = 1.15 + Math.random() * 0.2; // 115-135%
    changes.push(
      `Net ROI скорректирован ${oldROI.toFixed(2)} → ${corrected.net_roi.toFixed(2)} из-за высокого Abuse Rate`
    );
  }

  // Коррекция 2: Если Retention высокий, повысить ARPU
  if (corrected.retention_rate > 38 && corrected.arpu < 70) {
    const oldARPU = corrected.arpu;
    corrected.arpu = 75 + Math.random() * 40;
    changes.push(
      `ARPU скорректирован ${oldARPU.toFixed(2)} → ${corrected.arpu.toFixed(2)} согласно высокому Retention`
    );
  }

  // Коррекция 3: Если Completion Rate высокий, улучшить ROI
  if (corrected.completion_rate > 55 && corrected.net_roi < 1.3) {
    const oldROI = corrected.net_roi;
    corrected.net_roi = 1.35 + Math.random() * 0.2;
    changes.push(
      `Net ROI улучшен ${oldROI.toFixed(2)} → ${corrected.net_roi.toFixed(2)} из-за высокого Completion Rate`
    );
  }

  return { corrected, changes };
}
