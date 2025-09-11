import type { SegmentParameter, SegmentTemplate, SegmentBuilder, SegmentOperator } from '@/lib/types';

// Comprehensive segment parameters organized by groups
export const segmentParameters: SegmentParameter[] = [
  // Financial Parameters
  {
    id: 'total_deposits',
    name: 'Сумма депозитов',
    description: 'Общая сумма всех депозитов игрока',
    group: 'financial',
    type: 'currency',
    unit: '€',
    min: 0,
    max: 1000000
  },
  {
    id: 'deposit_count',
    name: 'Количество депозитов',
    description: 'Общее количество депозитов',
    group: 'financial',
    type: 'number',
    min: 0,
    max: 1000
  },
  {
    id: 'avg_deposit',
    name: 'Средний чек депозита',
    description: 'Средний размер депозита',
    group: 'financial',
    type: 'currency',
    unit: '€',
    min: 0,
    max: 50000
  },
  {
    id: 'ftd_amount',
    name: 'Сумма первого депозита',
    description: 'Размер первого депозита (FTD)',
    group: 'financial',
    type: 'currency',
    unit: '€',
    min: 0,
    max: 10000
  },
  {
    id: 'total_withdrawals',
    name: 'Сумма выводов',
    description: 'Общая сумма всех выводов',
    group: 'financial',
    type: 'currency',
    unit: '€',
    min: 0,
    max: 1000000
  },
  {
    id: 'net_deposits',
    name: 'Net Deposits',
    description: 'Депозиты минус выводы',
    group: 'financial',
    type: 'currency',
    unit: '€',
    min: -100000,
    max: 1000000
  },
  {
    id: 'ggr',
    name: 'GGR игрока',
    description: 'Gross Gaming Revenue',
    group: 'financial',
    type: 'currency',
    unit: '€',
    min: 0,
    max: 500000
  },

  {
    id: 'arpu',
    name: 'ARPU',
    description: 'Average Revenue Per User',
    group: 'financial',
    type: 'currency',
    unit: '€',
    min: 0,
    max: 10000
  },
  {
    id: 'ltv',
    name: 'LTV',
    description: 'Lifetime Value игрока',
    group: 'financial',
    type: 'currency',
    unit: '€',
    min: 0,
    max: 100000
  },
  {
    id: 'bonus_usage_count',
    name: 'Количество использованных бонусов',
    description: 'Общее количество активированных бонусов',
    group: 'financial',
    type: 'number',
    min: 0,
    max: 500
  },
  {
    id: 'bonus_wagering_rate',
    name: 'Процент отыгрыша бонусов',
    description: 'Средний процент отыгрыша бонусных средств',
    group: 'financial',
    type: 'percentage',
    unit: '%',
    min: 0,
    max: 100
  },
  {
    id: 'withdrawal_count',
    name: 'Количество выводов',
    description: 'Общее количество выводов средств',
    group: 'financial',
    type: 'number',
    min: 0,
    max: 1000
  },
  {
    id: 'total_bet_amount',
    name: 'Сумма ставок',
    description: 'Общая сумма всех ставок',
    group: 'financial',
    type: 'currency',
    unit: '€',
    min: 0,
    max: 10000000
  },
  {
    id: 'bonus_amount_received',
    name: 'Сумма полученных бонусов',
    description: 'Общая сумма всех полученных бонусов',
    group: 'financial',
    type: 'currency',
    unit: '€',
    min: 0,
    max: 100000
  },
  {
    id: 'bonus_activation_rate',
    name: 'Процент активации бонусов',
    description: 'Процент активированных бонусов от предложенных',
    group: 'financial',
    type: 'percentage',
    unit: '%',
    min: 0,
    max: 100
  },

  // Gaming Activity Parameters
  {
    id: 'session_count',
    name: 'Количество игровых сессий',
    description: 'Общее количество игровых сессий',
    group: 'gaming',
    type: 'number',
    min: 0,
    max: 10000
  },
  {
    id: 'avg_session_duration',
    name: 'Средняя продолжительность сессии',
    description: 'Средняя длительность игровой сессии',
    group: 'gaming',
    type: 'number',
    unit: 'мин',
    min: 0,
    max: 1440
  },
  {
    id: 'total_bets',
    name: 'Количество ставок',
    description: 'Общее количество сделанных ставок',
    group: 'gaming',
    type: 'number',
    min: 0,
    max: 100000
  },
  {
    id: 'avg_bet_size',
    name: 'Средний размер ставки',
    description: 'Средний размер ставки игрока',
    group: 'gaming',
    type: 'currency',
    unit: '€',
    min: 0,
    max: 1000
  },
  {
    id: 'favorite_games',
    name: 'Любимые игры',
    description: 'Наиболее часто играемые игры',
    group: 'gaming',
    type: 'list',
    options: ['Slots', 'Blackjack', 'Roulette', 'Poker', 'Baccarat', 'Live Casino', 'Sports Betting']
  },
  {
    id: 'game_providers',
    name: 'Провайдеры игр',
    description: 'Предпочитаемые провайдеры игр',
    group: 'gaming',
    type: 'list',
    options: ['NetEnt', 'Microgaming', 'Evolution', 'Pragmatic Play', 'Play\'n GO', 'Red Tiger', 'Big Time Gaming']
  },
  {
    id: 'player_rtp',
    name: 'RTP игрока',
    description: 'Return to Player процент',
    group: 'gaming',
    type: 'percentage',
    unit: '%',
    min: 0,
    max: 150
  },
  {
    id: 'volatility_preference',
    name: 'Предпочтение по волатильности',
    description: 'Предпочитаемая волатильность игр',
    group: 'gaming',
    type: 'list',
    options: ['Low', 'Medium', 'High', 'Very High']
  },
  {
    id: 'last_login_days_ago',
    name: 'Последний вход (дней назад)',
    description: 'Количество дней с последнего входа',
    group: 'gaming',
    type: 'number',
    unit: 'дней',
    min: 0,
    max: 365
  },
  {
    id: 'last_bet_days_ago',
    name: 'Последняя ставка (дней назад)',
    description: 'Количество дней с последней ставки',
    group: 'gaming',
    type: 'number',
    unit: 'дней',
    min: 0,
    max: 365
  },
  {
    id: 'unique_games_played',
    name: 'Количество уникальных игр',
    description: 'Количество различных игр, в которые играл игрок',
    group: 'gaming',
    type: 'number',
    min: 0,
    max: 1000
  },
  {
    id: 'total_playtime_hours',
    name: 'Общее время в игре',
    description: 'Общее время, проведенное в играх',
    group: 'gaming',
    type: 'number',
    unit: 'часов',
    min: 0,
    max: 10000
  },
  {
    id: 'game_categories',
    name: 'Категории игр',
    description: 'Предпочитаемые категории игр',
    group: 'gaming',
    type: 'list',
    options: ['Slots', 'Live Casino', 'Table Games', 'Sports', 'Poker', 'Crash Games', 'Virtual Sports']
  },
  {
    id: 'big_win_count',
    name: 'Количество больших выигрышей',
    description: 'Количество выигрышей выше определенного порога',
    group: 'gaming',
    type: 'number',
    min: 0,
    max: 1000
  },
  {
    id: 'big_loss_count',
    name: 'Количество больших проигрышей',
    description: 'Количество проигрышей выше определенного порога',
    group: 'gaming',
    type: 'number',
    min: 0,
    max: 1000
  },

  // Marketing/CRM Parameters
  {
    id: 'campaign_participation',
    name: 'Участие в кампаниях',
    description: 'Количество кампаний с участием игрока',
    group: 'marketing',
    type: 'number',
    min: 0,
    max: 1000
  },
  {
    id: 'reactivation_count',
    name: 'Количество реактиваций',
    description: 'Сколько раз игрок был реактивирован',
    group: 'marketing',
    type: 'number',
    min: 0,
    max: 50
  },
  {
    id: 'promo_codes_used',
    name: 'Использованные промокоды',
    description: 'Количество использованных промокодов',
    group: 'marketing',
    type: 'number',
    min: 0,
    max: 500
  },
  {
    id: 'email_open_rate',
    name: 'Email Open Rate',
    description: 'Процент открытых email сообщений',
    group: 'marketing',
    type: 'percentage',
    unit: '%',
    min: 0,
    max: 100
  },
  {
    id: 'push_ctr',
    name: 'Push CTR',
    description: 'Click-through rate по push уведомлениям',
    group: 'marketing',
    type: 'percentage',
    unit: '%',
    min: 0,
    max: 100
  },
  {
    id: 'preferred_channel',
    name: 'Предпочитаемый канал',
    description: 'Наиболее эффективный канал коммуникации',
    group: 'marketing',
    type: 'list',
    options: ['Email', 'Push', 'SMS', 'Telegram', 'In-App']
  },
  {
    id: 'tournament_participation',
    name: 'Участие в турнирах',
    description: 'Количество турниров с участием игрока',
    group: 'marketing',
    type: 'number',
    min: 0,
    max: 500
  },
  {
    id: 'sms_ctr',
    name: 'SMS CTR',
    description: 'Click-through rate по SMS сообщениям',
    group: 'marketing',
    type: 'percentage',
    unit: '%',
    min: 0,
    max: 100
  },
  {
    id: 'winback_success',
    name: 'Успешность winback',
    description: 'Был ли игрок успешно возвращен после оттока',
    group: 'marketing',
    type: 'boolean'
  },
  {
    id: 'utm_source',
    name: 'UTM Source',
    description: 'Источник трафика по UTM метке',
    group: 'marketing',
    type: 'list',
    options: ['google', 'facebook', 'instagram', 'tiktok', 'yandex', 'affiliate', 'direct', 'email']
  },
  {
    id: 'utm_campaign',
    name: 'UTM Campaign',
    description: 'Название кампании по UTM метке',
    group: 'marketing',
    type: 'string'
  },
  {
    id: 'affiliate_id',
    name: 'ID партнера',
    description: 'Идентификатор партнера-аффилиата',
    group: 'marketing',
    type: 'string'
  },

  // Profile Parameters
  {
    id: 'country',
    name: 'Страна',
    description: 'Страна регистрации игрока',
    group: 'profile',
    type: 'list',
    options: ['Germany', 'Russia', 'United Kingdom', 'France', 'Spain', 'Italy', 'Poland', 'Netherlands']
  },
  {
    id: 'currency',
    name: 'Валюта',
    description: 'Валюта аккаунта игрока',
    group: 'profile',
    type: 'list',
    options: ['EUR', 'USD', 'GBP', 'RUB', 'CAD', 'AUD', 'NOK', 'SEK']
  },
  {
    id: 'language',
    name: 'Язык интерфейса',
    description: 'Выбранный язык интерфейса',
    group: 'profile',
    type: 'list',
    options: ['English', 'Deutsch', 'Русский', 'Français', 'Español', 'Italiano', 'Polski']
  },
  {
    id: 'registration_date',
    name: 'Дата регистрации',
    description: 'Когда игрок зарегистрировался',
    group: 'profile',
    type: 'date'
  },
  {
    id: 'account_age_days',
    name: 'Возраст аккаунта',
    description: 'Количество дней с регистрации',
    group: 'profile',
    type: 'number',
    unit: 'дней',
    min: 0,
    max: 3650
  },
  {
    id: 'device_type',
    name: 'Тип устройства',
    description: 'Основное используемое устройство',
    group: 'profile',
    type: 'list',
    options: ['Desktop', 'Mobile', 'Tablet']
  },
  {
    id: 'operating_system',
    name: 'Операционная система',
    description: 'ОС основного устройства',
    group: 'profile',
    type: 'list',
    options: ['Windows', 'MacOS', 'iOS', 'Android', 'Linux']
  },
  {
    id: 'traffic_source',
    name: 'Источник трафика',
    description: 'Как игрок узнал о казино',
    group: 'profile',
    type: 'list',
    options: ['Organic', 'Google Ads', 'Facebook', 'Affiliate', 'Direct', 'Email', 'Referral']
  },
  {
    id: 'kyc_status',
    name: 'KYC статус',
    description: 'Статус верификации игрока',
    group: 'profile',
    type: 'list',
    options: ['Not Started', 'Pending', 'Verified', 'Rejected', 'Requires Update']
  },
  {
    id: 'vip_level',
    name: 'VIP уровень',
    description: 'Текущий VIP/Loyalty уровень',
    group: 'profile',
    type: 'list',
    options: ['Bronze', 'Silver', 'Gold', 'Platinum', 'Diamond', 'VIP']
  },
  {
    id: 'real_balance',
    name: 'Реальный баланс',
    description: 'Текущий реальный баланс игрока',
    group: 'profile',
    type: 'currency',
    unit: '€',
    min: 0,
    max: 100000
  },
  {
    id: 'bonus_balance',
    name: 'Бонусный баланс',
    description: 'Текущий бонусный баланс',
    group: 'profile',
    type: 'currency',
    unit: '€',
    min: 0,
    max: 50000
  },
  {
    id: 'city',
    name: 'Город',
    description: 'Город проживания игрока',
    group: 'profile',
    type: 'string'
  },
  {
    id: 'region',
    name: 'Регион',
    description: 'Регион/область проживания игрока',
    group: 'profile',
    type: 'string'
  },
  {
    id: 'first_deposit_made',
    name: 'Первый депозит сделан',
    description: 'Сделал ли игрок первый депозит',
    group: 'profile',
    type: 'boolean'
  },
  {
    id: 'retention_status',
    name: 'Retention статус',
    description: 'Текущий статус удержания игрока',
    group: 'profile',
    type: 'list',
    options: ['New', 'Active', 'At Risk', 'Churning', 'Churned', 'Reactivated', 'Dormant']
  },
  {
    id: 'login_frequency',
    name: 'Частота логинов',
    description: 'Как часто игрок заходит в систему',
    group: 'profile',
    type: 'list',
    options: ['Daily', 'Weekly', 'Monthly', 'Rarely', 'Never']
  },
  {
    id: 'uses_vpn',
    name: 'Использует VPN',
    description: 'Обнаружено ли использование VPN',
    group: 'profile',
    type: 'boolean'
  },
  {
    id: 'ip_country',
    name: 'Страна IP',
    description: 'Страна по IP адресу',
    group: 'profile',
    type: 'list',
    options: ['Germany', 'Russia', 'United Kingdom', 'France', 'Spain', 'Italy', 'Poland', 'Netherlands', 'Other']
  },

  // Risk/Compliance Parameters
  {
    id: 'chargeback_count',
    name: 'Количество chargebacks',
    description: 'Количество disputed транзакций',
    group: 'risk',
    type: 'number',
    min: 0,
    max: 100
  },
  {
    id: 'chargeback_rate',
    name: 'Chargeback rate',
    description: 'Процент disputed транзакций',
    group: 'risk',
    type: 'percentage',
    unit: '%',
    min: 0,
    max: 100
  },
  {
    id: 'fraud_score',
    name: 'Fraud score',
    description: 'Скор вероятности мошенничества',
    group: 'risk',
    type: 'number',
    min: 0,
    max: 100
  },
  {
    id: 'responsible_gambling_flags',
    name: 'RG флаги',
    description: 'Флаги ответственной игры',
    group: 'risk',
    type: 'list',
    options: ['Self Exclusion', 'Deposit Limits', 'Session Limits', 'Loss Limits', 'Cool Off Period']
  },
  {
    id: 'suspicious_transactions',
    name: 'Подозрительные транзакции',
    description: 'Количество подозрительных транзакций',
    group: 'risk',
    type: 'number',
    min: 0,
    max: 100
  },
  {
    id: 'support_tickets',
    name: 'Тикеты в саппорт',
    description: 'Количество обращений в поддержку',
    group: 'risk',
    type: 'number',
    min: 0,
    max: 500
  },
  {
    id: 'deposit_limit_set',
    name: 'Установлен лимит депозитов',
    description: 'Установил ли игрок лимит на депозиты',
    group: 'risk',
    type: 'boolean'
  },
  {
    id: 'bet_limit_set',
    name: 'Установлен лимит ставок',
    description: 'Установил ли игрок лимит на ставки',
    group: 'risk',
    type: 'boolean'
  },
  {
    id: 'time_limit_set',
    name: 'Установлен лимит времени',
    description: 'Установил ли игрок лимит времени игры',
    group: 'risk',
    type: 'boolean'
  },
  {
    id: 'self_exclusion_active',
    name: 'Активно самоисключение',
    description: 'Находится ли игрок в состоянии самоисключения',
    group: 'risk',
    type: 'boolean'
  },
  {
    id: 'responsible_gaming_requests',
    name: 'Запросы по responsible gaming',
    description: 'Количество запросов по ответственной игре',
    group: 'risk',
    type: 'number',
    min: 0,
    max: 100
  },

  // AI/Predictive Parameters
  {
    id: 'churn_probability',
    name: 'Вероятность оттока',
    description: 'AI-предсказание вероятности ухода игрока',
    group: 'ai_predictive',
    type: 'percentage',
    unit: '%',
    min: 0,
    max: 100
  },
  {
    id: 'predicted_ltv',
    name: 'Предсказанный LTV',
    description: 'AI-прогноз будущего LTV',
    group: 'ai_predictive',
    type: 'currency',
    unit: '€',
    min: 0,
    max: 50000
  },
  {
    id: 'deposit_probability_7d',
    name: 'Вероятность депозита (7 дней)',
    description: 'Вероятность депозита в ближайшие 7 дней',
    group: 'ai_predictive',
    type: 'percentage',
    unit: '%',
    min: 0,
    max: 100
  },
  {
    id: 'deposit_probability_30d',
    name: 'Вероятность депозита (30 дней)',
    description: 'Вероятность депозита в ближайшие 30 дней',
    group: 'ai_predictive',
    type: 'percentage',
    unit: '%',
    min: 0,
    max: 100
  },
  {
    id: 'recommended_channel',
    name: 'Рекомендованный канал',
    description: 'AI-рекомендация лучшего канала коммуникации',
    group: 'ai_predictive',
    type: 'list',
    options: ['Email', 'Push', 'SMS', 'Telegram', 'In-App', 'No Contact']
  },
  {
    id: 'next_best_offer',
    name: 'Next Best Offer',
    description: 'AI-рекомендация следующего лучшего предложения',
    group: 'ai_predictive',
    type: 'list',
    options: ['Deposit Bonus', 'Free Spins', 'Cashback', 'VIP Upgrade', 'Tournament', 'Sports Promo']
  },
  {
    id: 'optimal_send_time',
    name: 'Оптимальное время отправки',
    description: 'AI-рекомендация лучшего времени для коммуникации',
    group: 'ai_predictive',
    type: 'list',
    options: ['Morning', 'Afternoon', 'Evening', 'Night', 'Weekend']
  },
  {
    id: 'predicted_next_deposit_amount',
    name: 'Прогноз суммы следующего депозита',
    description: 'AI-прогноз суммы следующего депозита',
    group: 'ai_predictive',
    type: 'currency',
    unit: '€',
    min: 0,
    max: 10000
  },
  {
    id: 'vip_upgrade_probability',
    name: 'Вероятность перехода в VIP',
    description: 'Вероятность апгрейда до VIP статуса',
    group: 'ai_predictive',
    type: 'percentage',
    unit: '%',
    min: 0,
    max: 100
  },
  {
    id: 'reactivation_probability',
    name: 'Вероятность реактивации',
    description: 'Вероятность успешной реактивации игрока',
    group: 'ai_predictive',
    type: 'percentage',
    unit: '%',
    min: 0,
    max: 100
  }
];

// Operators for different parameter types
export const operatorsByType: Record<string, SegmentOperator[]> = {
  number: ['equals', 'not_equals', 'greater_than', 'less_than', 'greater_than_or_equal', 'less_than_or_equal', 'between', 'not_between'],
  currency: ['equals', 'not_equals', 'greater_than', 'less_than', 'greater_than_or_equal', 'less_than_or_equal', 'between', 'not_between'],
  percentage: ['equals', 'not_equals', 'greater_than', 'less_than', 'greater_than_or_equal', 'less_than_or_equal', 'between', 'not_between'],
  string: ['equals', 'not_equals', 'contains', 'not_contains', 'starts_with', 'ends_with'],
  date: ['equals', 'not_equals', 'greater_than', 'less_than', 'greater_than_or_equal', 'less_than_or_equal', 'between', 'not_between'],
  boolean: ['equals', 'not_equals'],
  list: ['in_list', 'not_in_list'],
  range: ['between', 'not_between']
};

// Group labels for UI
export const parameterGroupLabels: Record<string, string> = {
  financial: 'Финансовые метрики',
  gaming: 'Игровая активность',
  marketing: 'Маркетинг / CRM',
  profile: 'Профиль игрока',
  risk: 'Риск / Комплаенс',
  ai_predictive: 'AI / Предиктивные метрики'
};

// Operator labels for UI
export const operatorLabels: Record<SegmentOperator, string> = {
  equals: 'равно',
  not_equals: 'не равно',
  greater_than: 'больше',
  less_than: 'меньше',
  greater_than_or_equal: 'больше или равно',
  less_than_or_equal: 'меньше или равно',
  between: 'между',
  not_between: 'не между',
  in_list: 'в списке',
  not_in_list: 'не в списке',
  contains: 'содержит',
  not_contains: 'не содержит',
  starts_with: 'начинается с',
  ends_with: 'заканчивается на',
  is_null: 'пустое',
  is_not_null: 'не пустое'
};

// Sample segment templates
export const segmentTemplates: SegmentTemplate[] = [
  {
    id: 'high_value_players',
    name: 'Высокоценные игроки',
    description: 'Игроки с высоким LTV и частыми депозитами',
    category: 'VIP',
    usageCount: 15,
    createdAt: '2024-01-15T10:00:00Z',
    builder: {
      name: 'Высокоценные игроки',
      description: 'Игроки с LTV > €5000 и более 10 депозитов',
      rootGroup: {
        id: 'root',
        type: 'AND',
        conditions: [
          {
            id: 'cond1',
            parameter: 'ltv',
            operator: 'greater_than',
            value: 5000
          },
          {
            id: 'cond2',
            parameter: 'deposit_count',
            operator: 'greater_than',
            value: 10
          }
        ]
      }
    }
  },
  {
    id: 'churn_risk',
    name: 'Риск оттока',
    description: 'Игроки с высокой вероятностью ухода',
    category: 'Retention',
    usageCount: 8,
    createdAt: '2024-01-10T14:30:00Z',
    builder: {
      name: 'Риск оттока',
      description: 'Игроки с churn probability > 75%',
      rootGroup: {
        id: 'root',
        type: 'AND',
        conditions: [
          {
            id: 'cond1',
            parameter: 'churn_probability',
            operator: 'greater_than',
            value: 75
          },
          {
            id: 'cond2',
            parameter: 'account_age_days',
            operator: 'greater_than',
            value: 30
          }
        ]
      }
    }
  }
];
