/**
 * Моковые данные для графика метрик
 * Содержит реалистичные данные за 90 дней для всех метрик
 */

export interface MetricDataPoint {
  date: string; // YYYY-MM-DD
  value: number;
}

export interface MetricsData {
  [metricId: string]: MetricDataPoint[];
}

// Генерация данных за последние 90 дней
function generateMockData(
  baseValue: number,
  trend: 'up' | 'down' | 'stable' = 'stable',
  volatility: number = 0.15
): MetricDataPoint[] {
  const data: MetricDataPoint[] = [];
  const daysCount = 90;
  const now = new Date();

  for (let i = daysCount - 1; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);

    // Прогресс дня (0 = начало периода, 1 = конец периода)
    const dayProgress = (daysCount - i) / daysCount;

    // Тренд
    let trendMultiplier = 1;
    if (trend === 'up') {
      trendMultiplier = 1 + (dayProgress * 0.3); // Рост до +30%
    } else if (trend === 'down') {
      trendMultiplier = 1 - (dayProgress * 0.2); // Падение до -20%
    }

    // Недельная сезонность (выходные выше)
    const weekDay = date.getDay();
    const isWeekend = weekDay === 0 || weekDay === 6;
    const weekendMultiplier = isWeekend ? 1.25 : 0.95;

    // Случайные вариации
    const randomVariation = 1 + (Math.random() - 0.5) * volatility * 2;

    // Итоговое значение
    const value = baseValue * trendMultiplier * weekendMultiplier * randomVariation;

    data.push({
      date: date.toISOString().split('T')[0],
      value: Math.round(value * 100) / 100
    });
  }

  return data;
}

// Моковые данные для всех метрик
export const MOCK_METRICS_DATA: MetricsData = {
  // Финансовые метрики
  revenue: generateMockData(125000, 'up', 0.12),
  ggr: generateMockData(95000, 'up', 0.15),
  ngr: generateMockData(72000, 'up', 0.14),
  deposits: generateMockData(45000, 'up', 0.18),
  withdrawals: generateMockData(28000, 'stable', 0.16),
  bonus_cost: generateMockData(15000, 'down', 0.12),

  // Метрики игроков
  new_players: generateMockData(280, 'up', 0.25),
  active_players: generateMockData(3450, 'stable', 0.10),

  // Средние показатели
  avg_deposit: generateMockData(250, 'stable', 0.08),
  arpu: generateMockData(35.5, 'up', 0.12),
  arppu: generateMockData(125.8, 'up', 0.10),
  ltv: generateMockData(285, 'up', 0.15),

  // Retention метрики
  retention_d1: generateMockData(68, 'up', 0.08),
  retention_d7: generateMockData(42, 'up', 0.10),
  retention_d30: generateMockData(28, 'stable', 0.12),

  // Конверсия
  conversion_rate: generateMockData(8.5, 'up', 0.15),
  churn_rate: generateMockData(18, 'down', 0.12),
  reactivation_rate: generateMockData(12.5, 'up', 0.18),

  // Игровая активность
  rtp: generateMockData(96.5, 'stable', 0.02),
  bet_amount: generateMockData(850000, 'up', 0.14),
  win_amount: generateMockData(820000, 'up', 0.16),
  game_sessions: generateMockData(12500, 'up', 0.12),
  avg_session_time: generateMockData(42, 'stable', 0.10),

  // Бонусы
  bonus_conversion: generateMockData(22.5, 'up', 0.15),
  wagering_completion: generateMockData(35.8, 'up', 0.12),
};

/**
 * Фильтрует данные по временному периоду
 * @param data - массив точек данных
 * @param days - количество дней (7, 30, 90)
 * @returns отфильтрованный массив
 */
export function filterDataByPeriod(
  data: MetricDataPoint[],
  days: 7 | 30 | 90
): MetricDataPoint[] {
  return data.slice(-days);
}

/**
 * Получает данные для нескольких метрик с фильтрацией по периоду
 * @param metricIds - массив ID метрик
 * @param period - период в днях
 * @returns объект с данными по каждой метрике
 */
export function getMetricsData(
  metricIds: string[],
  period: 7 | 30 | 90 = 7
): Record<string, MetricDataPoint[]> {
  const result: Record<string, MetricDataPoint[]> = {};

  metricIds.forEach(metricId => {
    const metricData = MOCK_METRICS_DATA[metricId];
    if (metricData) {
      result[metricId] = filterDataByPeriod(metricData, period);
    }
  });

  return result;
}

/**
 * Трансформирует данные в формат для Recharts
 * @param metricsData - данные метрик
 * @returns массив объектов для графика
 */
export function transformToChartData(
  metricsData: Record<string, MetricDataPoint[]>
): any[] {
  const metricIds = Object.keys(metricsData);
  if (metricIds.length === 0) return [];

  const firstMetric = metricsData[metricIds[0]];
  if (!firstMetric) return [];

  return firstMetric.map((point, index) => {
    const chartPoint: any = {
      date: formatDate(point.date),
      fullDate: point.date
    };

    // Добавляем значения всех метрик для этой даты
    metricIds.forEach(metricId => {
      const metricPoint = metricsData[metricId]?.[index];
      if (metricPoint) {
        chartPoint[metricId] = metricPoint.value;
      }
    });

    return chartPoint;
  });
}

/**
 * Форматирует дату для отображения на графике
 * @param dateString - дата в формате YYYY-MM-DD
 * @returns отформатированная дата DD/MM
 */
function formatDate(dateString: string): string {
  const [year, month, day] = dateString.split('-');
  return `${day}/${month}`;
}
