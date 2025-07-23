// Структура данных для 25 ключевых метрик ретеншена в онлайн-казино

import type { RetentionMetric, SegmentMetrics } from "@/lib/types";

// 25 ключевых метрик для мониторинга ретеншена
export const retentionMetrics: RetentionMetric[] = [
  {
    id: '1',
    name: 'Retention Rate',
    description: 'Процент удержанных игроков за период',
    value: '72.3',
    unit: '%',
    category: 'retention',
    frequency: 'daily',
    targetValue: '75',
    trend: 'down',
    trendValue: '-2.1%'
  },
  {
    id: '2',
    name: 'Churn Rate',
    description: 'Уровень оттока игроков',
    value: '3.2',
    unit: '%',
    category: 'retention',
    frequency: 'daily',
    targetValue: '2.5',
    trend: 'up',
    trendValue: '+0.5%'
  },
  {
    id: '3',
    name: 'Lifetime Value (LTV)',
    description: 'Общий доход от игрока за всё время',
    value: '8,450',
    unit: '€',
    category: 'revenue',
    frequency: 'monthly',
    targetValue: '10,000',
    trend: 'up',
    trendValue: '+12.3%'
  },
  {
    id: '4',
    name: 'Average Revenue Per User (ARPU)',
    description: 'Средний доход на игрока',
    value: '125',
    unit: '€',
    category: 'revenue',
    frequency: 'weekly',
    targetValue: '150',
    trend: 'stable',
    trendValue: '+0.2%'
  },
  {
    id: '5',
    name: 'Average Deposit Amount',
    description: 'Средний размер депозита',
    value: '85',
    unit: '€',
    category: 'revenue',
    frequency: 'weekly',
    targetValue: '100',
    trend: 'up',
    trendValue: '+5.4%'
  },
  {
    id: '6',
    name: 'Frequency of Deposits',
    description: 'Частота депозитов (раз в месяц)',
    value: '3.8',
    unit: 'times',
    category: 'engagement',
    frequency: 'weekly',
    targetValue: '4.5',
    trend: 'down',
    trendValue: '-0.3'
  },
  {
    id: '7',
    name: 'Conversion Rate',
    description: 'Конверсия из регистрации в активного игрока',
    value: '52.4',
    unit: '%',
    category: 'conversion',
    frequency: 'daily',
    targetValue: '60',
    trend: 'up',
    trendValue: '+3.1%'
  },
  {
    id: '8',
    name: 'Bonus Activation Rate',
    description: 'Доля игроков, активирующих бонусы',
    value: '68.9',
    unit: '%',
    category: 'engagement',
    frequency: 'weekly',
    targetValue: '75',
    trend: 'stable',
    trendValue: '+0.8%'
  },
  {
    id: '9',
    name: 'Bonus Utilization Rate',
    description: 'Доля использованных бонусов',
    value: '71.2',
    unit: '%',
    category: 'engagement',
    frequency: 'weekly',
    targetValue: '80',
    trend: 'up',
    trendValue: '+2.5%'
  },
  {
    id: '10',
    name: 'Average Session Duration',
    description: 'Средняя продолжительность сессии (минуты)',
    value: '32.5',
    unit: 'min',
    category: 'engagement',
    frequency: 'daily',
    targetValue: '35',
    trend: 'down',
    trendValue: '-1.2 min'
  },
  {
    id: '11',
    name: 'Active Players Ratio',
    description: 'Соотношение активных игроков к общему числу',
    value: '42.8',
    unit: '%',
    category: 'retention',
    frequency: 'daily',
    targetValue: '50',
    trend: 'stable',
    trendValue: '+0.3%'
  },
  {
    id: '12',
    name: 'VIP Conversion Rate',
    description: 'Конверсия игроков в VIP-уровень',
    value: '8.3',
    unit: '%',
    category: 'conversion',
    frequency: 'monthly',
    targetValue: '10',
    trend: 'up',
    trendValue: '+1.1%'
  },
  {
    id: '13',
    name: 'ROI of Campaigns',
    description: 'Возврат инвестиций в маркетинговые кампании',
    value: '285',
    unit: '%',
    category: 'revenue',
    frequency: 'weekly',
    targetValue: '300',
    trend: 'up',
    trendValue: '+15%'
  },
  {
    id: '14',
    name: 'Average Bet Size',
    description: 'Средний размер ставки',
    value: '12.50',
    unit: '€',
    category: 'engagement',
    frequency: 'daily',
    targetValue: '15',
    trend: 'stable',
    trendValue: '+0.25€'
  },
  {
    id: '15',
    name: 'Player Reactivation Rate',
    description: 'Процент возвращённых игроков',
    value: '15.7',
    unit: '%',
    category: 'retention',
    frequency: 'weekly',
    targetValue: '20',
    trend: 'up',
    trendValue: '+2.3%'
  },
  {
    id: '16',
    name: 'Customer Satisfaction Score (CSAT)',
    description: 'Удовлетворённость клиентов',
    value: '4.2',
    unit: '/5',
    category: 'satisfaction',
    frequency: 'monthly',
    targetValue: '4.5',
    trend: 'stable',
    trendValue: '+0.1'
  },
  {
    id: '17',
    name: 'Net Promoter Score (NPS)',
    description: 'Готовность рекомендовать казино',
    value: '42',
    unit: '',
    category: 'satisfaction',
    frequency: 'monthly',
    targetValue: '50',
    trend: 'up',
    trendValue: '+5'
  },
  {
    id: '18',
    name: 'Withdrawal Success Rate',
    description: 'Процент успешных выводов средств',
    value: '98.7',
    unit: '%',
    category: 'satisfaction',
    frequency: 'daily',
    targetValue: '99',
    trend: 'stable',
    trendValue: '+0.1%'
  },
  {
    id: '19',
    name: 'Customer Support Interaction Rate',
    description: 'Частота обращений в поддержку',
    value: '12.3',
    unit: '%',
    category: 'satisfaction',
    frequency: 'weekly',
    targetValue: '10',
    trend: 'down',
    trendValue: '-0.8%'
  },
  {
    id: '20',
    name: 'Referral Rate',
    description: 'Доля игроков, приходящих по рекомендациям',
    value: '18.5',
    unit: '%',
    category: 'conversion',
    frequency: 'weekly',
    targetValue: '25',
    trend: 'up',
    trendValue: '+1.7%'
  },
  {
    id: '21',
    name: 'First Deposit Time',
    description: 'Время до первого депозита (часы)',
    value: '4.2',
    unit: 'hours',
    category: 'conversion',
    frequency: 'daily',
    targetValue: '3',
    trend: 'down',
    trendValue: '-0.3h'
  },
  {
    id: '22',
    name: 'Re-deposit Rate',
    description: 'Частота повторных депозитов',
    value: '64.8',
    unit: '%',
    category: 'engagement',
    frequency: 'weekly',
    targetValue: '70',
    trend: 'up',
    trendValue: '+2.1%'
  },
  {
    id: '23',
    name: 'Peak Activity Time',
    description: 'Время максимальной активности игроков',
    value: '21:00-23:00',
    unit: '',
    category: 'engagement',
    frequency: 'daily',
    trend: 'stable'
  },
  {
    id: '24',
    name: 'Average Time Between Deposits',
    description: 'Среднее время между депозитами',
    value: '7.8',
    unit: 'days',
    category: 'engagement',
    frequency: 'weekly',
    targetValue: '5',
    trend: 'down',
    trendValue: '-0.5 days'
  },
  {
    id: '25',
    name: 'Session Frequency',
    description: 'Частота игровых сессий (в неделю)',
    value: '5.2',
    unit: 'times',
    category: 'engagement',
    frequency: 'daily',
    targetValue: '7',
    trend: 'stable',
    trendValue: '+0.1'
  }
];

// Примерные значения метрик для разных сегментов
export const segmentMetricsData: SegmentMetrics[] = [
  {
    segmentName: 'VIP-игроки',
    segmentId: 'vip',
    metrics: {
      retentionRate: '80-90%',
      averageDepositAmount: 'от €5,000',
      depositFrequency: '2-4 раза в месяц',
      ltv: '€50,000+',
    },
    recommendations: [
      'Персональный менеджер для каждого VIP',
      'Эксклюзивные бонусы и турниры',
      'Приоритетная обработка выводов',
      'Индивидуальные лимиты'
    ]
  },
  {
    segmentName: 'Активные игроки',
    segmentId: 'active',
    metrics: {
      retentionRate: '60-75%',
      averageDepositAmount: '€200-€500',
      depositFrequency: 'еженедельно',
      ltv: '€5,000-€10,000',
    },
    recommendations: [
      'Регулярные бонусы на депозит',
      'Программа лояльности с уровнями',
      'Персонализированные push-уведомления',
      'Участие в турнирах'
    ]
  },
  {
    segmentName: 'Новички',
    segmentId: 'newbies',
    metrics: {
      conversionRate: '40-60%',
      averageDepositAmount: '€10-€100',
      bonusActivationRate: '70-80%',
      depositFrequency: '1-2 раза',
      ltv: '€100-€500',
      retentionRate: '30-40%'
    },
    recommendations: [
      'Агрессивный Welcome-бонус',
      'Обучающие материалы',
      'Быстрая верификация',
      'Бесплатные спины для знакомства'
    ]
  },
  {
    segmentName: 'Консервативные игроки',
    segmentId: 'conservative',
    metrics: {
      retentionRate: '70-80%',
      averageDepositAmount: '€10-€50',
      depositFrequency: '4-8 раз в месяц',
      ltv: '€1,000-€3,000',
    },
    recommendations: [
      'Низкие минимальные ставки',
      'Кэшбек программы',
      'Лимиты на депозиты',
      'Игры с низкой волатильностью'
    ]
  },
  {
    segmentName: 'Игроки выходного дня',
    segmentId: 'weekend',
    metrics: {
      activePlayersRatio: '70-85%',
      averageDepositAmount: '€50-€200',
      depositFrequency: 'раз в неделю',
      ltv: '€2,000-€5,000',
      retentionRate: '50-65%'
    },
    recommendations: [
      'Специальные акции на выходные',
      'Турниры по пятницам и субботам',
      'Happy hours с повышенными бонусами',
      'Push-уведомления в пятницу вечером'
    ]
  },
  {
    segmentName: 'Игроки от стримеров',
    segmentId: 'streamers',
    metrics: {
      conversionRate: '50-70%',
      bonusActivationRate: '60-80%',
      referralRate: '20-30%',
      averageDepositAmount: '€50-€300',
      depositFrequency: '2-3 раза в месяц',
      ltv: '€1,000-€5,000',
      retentionRate: '45-60%'
    },
    recommendations: [
      'Специальные промокоды стримеров',
      'Эксклюзивные турниры для подписчиков',
      'Интеграция с Twitch/YouTube',
      'Реферальная программа для стримеров'
    ]
  }
];

// Регламент мониторинга метрик
export const monitoringSchedule = {
  daily: ['Retention Rate', 'Churn Rate', 'Average Session Duration', 'Active Players Ratio', 'Conversion Rate', 'Withdrawal Success Rate'],
  weekly: ['ARPU', 'Average Deposit Amount', 'Frequency of Deposits', 'Bonus Activation Rate', 'Player Reactivation Rate', 'ROI of Campaigns'],
  monthly: ['LTV', 'VIP Conversion Rate', 'Customer Satisfaction Score', 'Net Promoter Score', 'Referral Rate']
};

// Система оповещений
export const alertThresholds = {
  retentionRate: { critical: 60, warning: 65 },
  arpu: { criticalDrop: 15 }, // процент падения
  bonusUtilizationRate: { critical: 50, warning: 60 },
  churnRate: { critical: 5, warning: 4 },
  withdrawalSuccessRate: { critical: 95, warning: 97 }
};