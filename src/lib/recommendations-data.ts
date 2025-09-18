// Shared recommendations data source
export interface Recommendation {
  id: string;
  title: string;
  description: string;
  category: 'retention' | 'revenue' | 'engagement' | 'risk' | 'optimization';
  type: 'segment' | 'campaign' | 'trigger' | 'optimization' | 'analysis';
  priority: 'critical' | 'high' | 'medium' | 'low';
  status: 'new' | 'in_progress' | 'completed' | 'dismissed' | 'postponed';
  impact?: { metric: string; value: string; trend: 'up' | 'down' | 'stable' };
  deadline?: Date;
  createdAt: Date;
  completedAt?: Date;
  tags: string[];
  actions: {
    primary: { label: string; href?: string; action?: string };
    secondary?: { label: string };
  };
  reasoning: string;
  dataPoints: Array<{ label: string; value: string }>;
  confidence: number;
  checklist?: string[];
  expectedUplift?: string;
  calculations?: string;
}

// Единый источник рекомендаций для всего приложения
export const sharedRecommendations: Recommendation[] = [
  {
    id: 'rec-001',
    title: 'Запустить кампанию реактивации для спящих игроков',
    description: 'Обнаружено 2,847 игроков без активности 30+ дней с высоким историческим LTV',
    category: 'retention',
    type: 'campaign',
    priority: 'critical',
    status: 'new',
    impact: { metric: 'Monthly Revenue', value: '+12%', trend: 'up' },
    deadline: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    tags: ['Реактивация', 'Высокий приоритет', 'Quick Win'],
    actions: {
      primary: { 
        label: 'Создать кампанию', 
        href: '/triggers/builder/new?template=reactivation',
        action: 'create_campaign'
      },
      secondary: { label: 'Детали анализа' }
    },
    reasoning: 'Анализ показал, что игроки с периодом неактивности 30-45 дней имеют 35% вероятность возврата при правильной стимуляции. Средний депозит после реактивации составляет €250.',
    dataPoints: [
      { label: 'Целевая аудитория', value: '2,847 игроков' },
      { label: 'Средний LTV', value: '€485' },
      { label: 'Ожидаемая конверсия', value: '8-12%' },
      { label: 'Потенциальный доход', value: '€142,350' }
    ],
    confidence: 92,
    expectedUplift: '+€142,350 в месяц (+12% к текущему доходу)',
    calculations: '2,847 игроков × 8% конверсия × €250 средний депозит × 2.5 LTV = €142,350',
    checklist: [
      'Создать сегмент спящих игроков (30+ дней без активности)',
      'Настроить триггер автоматической отправки',
      'Подготовить персонализированные предложения',
      'Настроить A/B тест различных бонусов',
      'Запустить кампанию в течение 48 часов'
    ]
  },
  {
    id: 'rec-002',
    title: 'Оптимизировать бонусную программу для VIP сегмента',
    description: 'VIP игроки используют только 45% доступных бонусов, что ниже среднего',
    category: 'revenue',
    type: 'segment',
    priority: 'high',
    status: 'new',
    impact: { metric: 'GGR', value: '+€85,000/мес', trend: 'up' },
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    tags: ['VIP', 'Бонусы', 'Оптимизация'],
    actions: {
      primary: { 
        label: 'Настроить бонусы', 
        href: '/segments?filter=vip',
        action: 'create_segment' 
      },
      secondary: { label: 'Анализ использования' }
    },
    reasoning: 'VIP игроки предпочитают cashback и эксклюзивные турниры вместо стандартных депозитных бонусов. Персонализация предложений может увеличить утилизацию до 75%.',
    dataPoints: [
      { label: 'VIP активность', value: '71%' },
      { label: 'Bonus ROI', value: '2.3x' },
      { label: 'Неиспользованные бонусы', value: '€124,000' },
      { label: 'Потенциал роста', value: '+30%' }
    ],
    confidence: 87,
    expectedUplift: '+€85,000 ежемесячно (+30% к текущему GGR сегмента)',
    calculations: '312 VIP игроков × €910 средний месячный GGR × 30% увеличение = €85,000',
    checklist: [
      'Проанализировать текущие предпочтения VIP игроков',
      'Создать персональные cashback предложения',
      'Настроить эксклюзивные VIP турниры',
      'Обновить триггеры для VIP коммуникаций'
    ]
  },
  {
    id: 'rec-003',
    title: 'Предотвратить отток высокоценных игроков',
    description: 'ML-модель обнаружила 156 игроков с высоким риском ухода в ближайшие 7 дней',
    category: 'risk',
    type: 'trigger',
    priority: 'critical',
    status: 'in_progress',
    impact: { metric: 'Потери', value: '-€68,000', trend: 'down' },
    deadline: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
    tags: ['Риск', 'Срочно', 'ML-прогноз'],
    actions: {
      primary: { 
        label: 'Применить стратегию', 
        href: '/triggers/builder/new?template=risk-prevention',
        action: 'create_trigger'
      },
      secondary: { label: 'Список игроков' }
    },
    reasoning: 'Снижение частоты игр на 40%, уменьшение размера ставок и увеличение времени между сессиями указывают на потерю интереса.',
    dataPoints: [
      { label: 'Risk Score', value: '8.7/10' },
      { label: 'Дней до ухода', value: '5-7' },
      { label: 'Средний LTV группы', value: '€436' },
      { label: 'Успех предотвращения', value: '65%' }
    ],
    confidence: 89,
    expectedUplift: 'Предотвращение потерь €68,000',
    calculations: '156 игроков × €436 LTV × (100% - 65% успех) = €68,016 потерь',
    checklist: [
      'Немедленно создать триггер для игроков в зоне риска',
      'Отправить персональные предложения',
      'Связаться с VIP-менеджерами',
      'Мониторить результаты в реальном времени'
    ]
  },
  {
    id: 'rec-004',
    title: 'Увеличить вовлеченность через турниры',
    description: 'Игроки с участием в турнирах показывают на 45% выше retention',
    category: 'engagement',
    type: 'campaign',
    priority: 'medium',
    status: 'new',
    impact: { metric: 'DAU', value: '+18%', trend: 'up' },
    createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000),
    tags: ['Турниры', 'Вовлеченность', 'Соревнования'],
    actions: {
      primary: { 
        label: 'Создать турнир', 
        href: '/campaigns?type=tournament',
        action: 'create_tournament'
      },
      secondary: { label: 'Расписание' }
    },
    reasoning: 'Еженедельные турниры с призовым фондом €5,000+ привлекают в среднем 1,200 участников и увеличивают время в игре на 35%.',
    dataPoints: [
      { label: 'Текущее участие', value: '12%' },
      { label: 'Целевое участие', value: '25%' },
      { label: 'ROI турниров', value: '3.8x' },
      { label: 'Средняя ставка в турнире', value: '€85' }
    ],
    confidence: 91,
    expectedUplift: '+18% DAU, +€102,000 доп. доход',
    calculations: '1,200 участников × €85 ср. ставка = €102,000',
    checklist: [
      'Определить формат и правила турнира',
      'Настроить призовой фонд и структуру',
      'Создать расписание турниров',
      'Настроить кампанию продвижения'
    ]
  },
  {
    id: 'rec-005',
    title: 'Оптимизировать время отправки push-уведомлений',
    description: 'Анализ показал низкий CTR уведомлений в текущие временные слоты',
    category: 'optimization',
    type: 'optimization',
    priority: 'low',
    status: 'completed',
    impact: { metric: 'CTR', value: '+34%', trend: 'up' },
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    completedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    tags: ['Push', 'Оптимизация', 'Коммуникации'],
    actions: {
      primary: { 
        label: 'Применено', 
        href: '#',
        action: 'completed' 
      },
    },
    reasoning: 'Оптимальное время для вашей аудитории: 19:00-21:00 в будни и 14:00-16:00 в выходные.',
    dataPoints: [
      { label: 'Прежний CTR', value: '2.1%' },
      { label: 'Новый CTR', value: '2.8%' },
      { label: 'Охват', value: '+15%' },
      { label: 'Конверсия', value: '+8%' }
    ],
    confidence: 94,
    expectedUplift: '+34% CTR, +8% конверсия',
    calculations: 'CTR: 2.1% → 2.8% (+0.7pp, +33.3% относительно)',
    checklist: [
      'Проанализировать текущее время отправки',
      'Настроить A/B тестирование',
      'Обновить расписание всех триггеров',
      'Мониторить результаты'
    ]
  }
];

// Функция для получения статуса рекомендации из localStorage
export function getRecommendationStatus(id: string): string {
  try {
    const status = localStorage.getItem(`rec_status_${id}`);
    return status || 'new';
  } catch {
    return 'new';
  }
}

// Функция для обновления статуса рекомендации
export function updateRecommendationStatus(id: string, status: string): void {
  try {
    localStorage.setItem(`rec_status_${id}`, status);
    // Trigger storage event for other components
    window.dispatchEvent(new Event('recommendationStatusChanged'));
  } catch {
    console.error('Failed to update recommendation status');
  }
}

// Функция для получения актуальных рекомендаций с учетом статусов
export function getRecommendationsWithStatus(): Recommendation[] {
  return sharedRecommendations.map(rec => ({
    ...rec,
    status: getRecommendationStatus(rec.id) as Recommendation['status']
  }));
}