import type { RetentionMetric, SegmentMetrics, MonitoringSchedule } from "@/lib/types";

// 25 ключевых метрик ретеншена
export const retentionMetrics: RetentionMetric[] = [
  // Retention метрики
  {
    id: 'retention_rate',
    name: 'Retention Rate',
    description: 'Процент удержанных игроков',
    value: 62.3,
    unit: '%',
    category: 'retention',
    frequency: 'daily',
    targetValue: 75,
    trend: 'down',
    trendValue: '-2.1%',
    sparkline: [65, 64.5, 64, 63.5, 63, 62.8, 62.3],
    breakdown: [
      { label: 'VIP', value: 80, color: '#f59e42' },
      { label: 'Active', value: 70, color: '#60a5fa' },
      { label: 'New', value: 50, color: '#34d399' }
    ]
  },
  {
    id: 'churn_rate',
    name: 'Churn Rate',
    description: 'Уровень оттока игроков',
    value: 3.2,
    unit: '%',
    category: 'retention',
    frequency: 'daily',
    targetValue: 2.5,
    trend: 'up',
    trendValue: '+0.5%',
    sparkline: [2.8, 2.9, 3.0, 3.1, 3.1, 3.2, 3.2],
    breakdown: [
      { label: 'VIP', value: 1.5, color: '#f59e42' },
      { label: 'Active', value: 2.8, color: '#60a5fa' },
      { label: 'New', value: 5.5, color: '#34d399' }
    ]
  },
  {
    id: 'player_reactivation_rate',
    name: 'Player Reactivation Rate',
    description: 'Процент возвращённых игроков',
    value: 15.7,
    unit: '%',
    category: 'retention',
    frequency: 'weekly',
    targetValue: 20,
    trend: 'up',
    trendValue: '+2.3%'
  },
  
  // Revenue метрики
  {
    id: 'ggr',
    name: 'GGR',
    description: 'Gross Gaming Revenue — валовый игровой доход (ставки минус выигрыши)',
    value: 125340,
    unit: '€',
    category: 'revenue',
    frequency: 'daily',
    targetValue: 140000,
    trend: 'up',
    trendValue: '+18.2%'
  },
  {
    id: 'ngr',
    name: 'NGR',
    description: 'Net Gaming Revenue — чистый игровой доход (GGR минус бонусы/комиссии)',
    value: 71200,
    unit: '€',
    category: 'revenue',
    frequency: 'daily',
    targetValue: 80000,
    trend: 'up',
    trendValue: '+9.6%'
  },
  {
    id: 'ltv',
    name: 'Lifetime Value (LTV)',
    description: 'Общий доход от игрока',
    value: 8450,
    unit: '€',
    category: 'revenue',
    frequency: 'monthly',
    targetValue: 10000,
    trend: 'up',
    trendValue: '+€12.3',
    sparkline: [8200, 8250, 8300, 8350, 8400, 8430, 8450],
    breakdown: [
      { label: 'VIP', value: 50000, color: '#f59e42' },
      { label: 'Active', value: 8000, color: '#60a5fa' },
      { label: 'New', value: 1200, color: '#34d399' }
    ]
  },
  {
    id: 'arpu',
    name: 'Average Revenue Per User (ARPU)',
    description: 'Средний доход на игрока',
    value: 125,
    unit: '€',
    category: 'revenue',
    frequency: 'weekly',
    targetValue: 150,
    trend: 'up',
    trendValue: '+€0.2',
    sparkline: [120, 121, 122, 123, 124, 124.5, 125],
    breakdown: [
      { label: 'VIP', value: 350, color: '#f59e42' },
      { label: 'Active', value: 140, color: '#60a5fa' },
      { label: 'New', value: 30, color: '#34d399' }
    ]
  },
  {
    id: 'average_deposit',
    name: 'AVG DEP',
    description: 'Средний размер депозита',
    value: 85,
    unit: '€',
    category: 'revenue',
    frequency: 'weekly',
    targetValue: 100,
    trend: 'stable',
    trendValue: '0%'
  },
  {
    id: 'roi_campaigns',
    name: 'ROI of Campaigns',
    description: 'Возврат инвестиций в кампании',
    value: 145,
    unit: '%',
    category: 'revenue',
    frequency: 'weekly',
    targetValue: 150,
    trend: 'up',
    trendValue: '+5%'
  },
  {
    id: 'average_bet_size',
    name: 'Average Bet Size',
    description: 'Средний размер ставки',
    value: 12.5,
    unit: '€',
    category: 'revenue',
    frequency: 'daily',
    targetValue: 15,
    trend: 'down',
    trendValue: '-€0.5'
  },
  {
    id: 'average_time_between_deposits',
    name: 'Average Time Between Deposits',
    description: 'Среднее время между депозитами',
    value: 7.5,
    unit: 'days',
    category: 'revenue',
    frequency: 'weekly',
    targetValue: 5,
    trend: 'up',
    trendValue: '+0.5'
  },
  
  // Engagement метрики
  {
    id: 'frequency_deposits',
    name: 'Frequency of Deposits',
    description: 'Частота депозитов',
    value: 3.2,
    unit: 'times',
    category: 'engagement',
    frequency: 'weekly',
    targetValue: 4,
    trend: 'down',
    trendValue: '-0.3'
  },
  {
    id: 'average_session_duration',
    name: 'Average Session Duration',
    description: 'Средняя продолжительность сессии',
    value: 35,
    unit: 'min',
    category: 'engagement',
    frequency: 'daily',
    targetValue: 45,
    trend: 'stable',
    trendValue: '0'
  },
  {
    id: 'active_players_ratio',
    name: 'Active Players Ratio',
    description: 'Соотношение активных игроков',
    value: 68,
    unit: '%',
    category: 'engagement',
    frequency: 'daily',
    targetValue: 70,
    trend: 'up',
    trendValue: '+2%'
  },
  {
    id: 'session_frequency',
    name: 'Session Frequency',
    description: 'Частота игровых сессий',
    value: 4.5,
    unit: 'times',
    category: 'engagement',
    frequency: 'weekly',
    targetValue: 5,
    trend: 'stable',
    trendValue: '0'
  },
  {
    id: 'peak_activity_time',
    name: 'Peak Activity Time',
    description: 'Время максимальной активности',
    value: '20:00-23:00',
    unit: '',
    category: 'engagement',
    frequency: 'daily',
    trend: 'stable'
  },
  
  // Conversion метрики
  {
    id: 'conversion_rate',
    name: 'Conversion Rate',
    description: 'Конверсия в активного игрока',
    value: 52.4,
    unit: '%',
    category: 'conversion',
    frequency: 'weekly',
    targetValue: 60,
    trend: 'up',
    trendValue: '+3.1%'
  },
  {
    id: 'bonus_activation_rate',
    name: 'Bonus Activation Rate',
    description: 'Доля активирующих бонусы',
    value: 71,
    unit: '%',
    category: 'conversion',
    frequency: 'weekly',
    targetValue: 80,
    trend: 'down',
    trendValue: '-2%'
  },
  {
    id: 'bonus_utilization_rate',
    name: 'Bonus Utilization Rate',
    description: 'Доля использованных бонусов',
    value: 65,
    unit: '%',
    category: 'conversion',
    frequency: 'weekly',
    targetValue: 75,
    trend: 'stable',
    trendValue: '0%'
  },
  {
    id: 'vip_conversion_rate',
    name: 'VIP Conversion Rate',
    description: 'Конверсия в VIP-уровень',
    value: 8.3,
    unit: '%',
    category: 'conversion',
    frequency: 'monthly',
    targetValue: 10,
    trend: 'up',
    trendValue: '+0.5%'
  },
  {
    id: 'first_deposit_time',
    name: 'First Deposit Time',
    description: 'Время до первого депозита',
    value: 2.5,
    unit: 'hours',
    category: 'conversion',
    frequency: 'weekly',
    targetValue: 2,
    trend: 'down',
    trendValue: '-0.2'
  },
  {
    id: 're_deposit_rate',
    name: 'Re-deposit Rate',
    description: 'Частота повторных депозитов',
    value: 45,
    unit: '%',
    category: 'conversion',
    frequency: 'weekly',
    targetValue: 55,
    trend: 'up',
    trendValue: '+1.5%'
  },
  
  // Satisfaction метрики
  {
    id: 'csat',
    name: 'Customer Satisfaction Score (CSAT)',
    description: 'Удовлетворённость клиентов',
    value: 4.2,
    unit: '/5',
    category: 'satisfaction',
    frequency: 'monthly',
    targetValue: 4.5,
    trend: 'stable',
    trendValue: '0'
  },
  {
    id: 'nps',
    name: 'Net Promoter Score (NPS)',
    description: 'Готовность рекомендовать',
    value: 42,
    unit: '',
    category: 'satisfaction',
    frequency: 'monthly',
    targetValue: 50,
    trend: 'up',
    trendValue: '+3'
  },
  {
    id: 'withdrawal_success_rate',
    name: 'Withdrawal Success Rate',
    description: 'Процент успешных выводов',
    value: 98.5,
    unit: '%',
    category: 'satisfaction',
    frequency: 'daily',
    targetValue: 99,
    trend: 'stable',
    trendValue: '0%'
  },
  {
    id: 'support_interaction_rate',
    name: 'Customer Support Interaction Rate',
    description: 'Частота обращений в поддержку',
    value: 12,
    unit: '%',
    category: 'satisfaction',
    frequency: 'weekly',
    targetValue: 10,
    trend: 'down',
    trendValue: '-1%'
  },
  {
    id: 'referral_rate',
    name: 'Referral Rate',
    description: 'Доля по рекомендациям',
    value: 18,
    unit: '%',
    category: 'satisfaction',
    frequency: 'monthly',
    targetValue: 25,
    trend: 'up',
    trendValue: '+2%'
  }
];

// Метрики по сегментам
export const segmentMetricsData: SegmentMetrics[] = [
  {
    segmentName: 'VIP-игроки',
    segmentId: 'vip',
    metrics: {
      retentionRate: '80-90%',
      averageDepositAmount: 'от €5000',
      depositFrequency: '2-4 раза в месяц',
      ltv: '€50,000+',
      conversionRate: '95%',
      bonusActivationRate: '70%',
      activePlayersRatio: '92%',
      referralRate: '35%'
    },
    recommendations: [
      'Персональный менеджер для каждого VIP',
      'Эксклюзивные бонусы и турниры',
      'Приоритетная поддержка 24/7'
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
      conversionRate: '75%',
      bonusActivationRate: '80%',
      activePlayersRatio: '85%',
      referralRate: '20%'
    },
    recommendations: [
      'Регулярные акции и турниры',
      'Программа лояльности с уровнями',
      'Персонализированные email-кампании'
    ]
  },
  {
    segmentName: 'Новички',
    segmentId: 'new',
    metrics: {
      retentionRate: '40-60%',
      averageDepositAmount: '€10-€100',
      depositFrequency: '1-2 раза в месяц',
      ltv: '€500-€1,500',
      conversionRate: '40-60%',
      bonusActivationRate: '70-80%',
      activePlayersRatio: '45%',
      referralRate: '5%'
    },
    recommendations: [
      'Улучшенный онбординг',
      'Приветственные бонусы',
      'Обучающие материалы'
    ]
  },
  {
    segmentName: 'Консервативные игроки',
    segmentId: 'conservative',
    metrics: {
      retentionRate: '70-80%',
      averageDepositAmount: '€10-€50',
      depositFrequency: '4-8 раз в месяц',
      ltv: '€2,000-€4,000',
      conversionRate: '65%',
      bonusActivationRate: '60%',
      activePlayersRatio: '75%',
      referralRate: '15%'
    },
    recommendations: [
      'Низкорисковые игры',
      'Кешбэк программы',
      'Длительные акции'
    ]
  },
  {
    segmentName: 'Игроки выходного дня',
    segmentId: 'weekend',
    metrics: {
      retentionRate: '50-65%',
      averageDepositAmount: '€50-€200',
      depositFrequency: 'раз в неделю',
      ltv: '€3,000-€6,000',
      activePlayersRatio: '70-85%',
      bonusActivationRate: '75%',
      conversionRate: '55%',
      referralRate: '10%'
    },
    recommendations: [
      'Выходные турниры',
      'Пятничные бонусы',
      'Специальные акции на выходные'
    ]
  },
  {
    segmentName: 'Игроки от стримеров',
    segmentId: 'streamer',
    metrics: {
      retentionRate: '45-60%',
      averageDepositAmount: '€30-€150',
      depositFrequency: '2-3 раза в месяц',
      ltv: '€1,500-€3,500',
      conversionRate: '50-70%',
      bonusActivationRate: '60-80%',
      activePlayersRatio: '65%',
      referralRate: '20-30%'
    },
    recommendations: [
      'Эксклюзивные промокоды стримеров',
      'Совместные турниры',
      'Интеграция с платформами стриминга'
    ]
  }
];

// Регламент мониторинга
export const monitoringSchedule: MonitoringSchedule = {
  daily: [
    'Retention Rate',
    'Churn Rate',
    'Average Session Duration',
    'Active Players Ratio',
    'Withdrawal Success Rate',
    'Average Bet Size'
  ],
  weekly: [
    'ARPU',
    'Average Deposit Amount',
    'Frequency of Deposits',
    'Bonus Activation Rate',
    'Player Reactivation Rate',
    'Conversion Rate',
    'Bonus Utilization Rate',
    'Customer Support Interaction Rate',
    'Session Frequency',
    'First Deposit Time',
    'Re-deposit Rate',
    'Average Time Between Deposits',
    'ROI of Campaigns'
  ],
  monthly: [
    'LTV',
    'VIP Conversion Rate',
    'Customer Satisfaction Score',
    'Net Promoter Score',
    'Referral Rate'
  ]
};