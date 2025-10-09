import { TooltipStep } from '@/components/onboarding/tooltip-overlay';

// Командный центр (Dashboard)
export const DASHBOARD_TOOLTIPS: TooltipStep[] = [
  {
    selector: '[data-tooltip="kpi-cards"]',
    title: '📊 Ключевые метрики',
    description: 'Здесь отображаются главные KPI вашего казино: retention, churn rate, ARPU и другие. Кликните на любую карточку для детального просмотра.',
    position: 'bottom'
  },
  {
    selector: '[data-tooltip="filters"]',
    title: '🔍 Фильтры и период',
    description: 'Фильтруйте данные по временным периодам, сегментам игроков и другим параметрам. Все графики обновятся автоматически.',
    position: 'bottom'
  },
  {
    selector: '[data-tooltip="charts"]',
    title: '📈 Интерактивные графики',
    description: 'Динамические графики показывают тренды метрик. Наведите курсор для деталей, масштабируйте области для детального просмотра.',
    position: 'top'
  },
  {
    selector: '[data-tooltip="actions"]',
    title: '⚡ Быстрые действия',
    description: 'Используйте эти кнопки для создания кампаний, настройки триггеров или экспорта отчетов прямо из дашборда.',
    position: 'left'
  }
];

// Сегменты
export const SEGMENTS_TOOLTIPS: TooltipStep[] = [
  {
    selector: '[data-tooltip="create-segment"]',
    title: '➕ Создать сегмент',
    description: 'Нажмите эту кнопку чтобы создать новый сегмент игроков с настраиваемыми условиями.',
    position: 'bottom'
  },
  {
    selector: '[data-tooltip="segments-table"]',
    title: '📋 Список сегментов',
    description: 'Все созданные сегменты отображаются здесь. Вы видите размер аудитории, LTV, retention и другие метрики для каждого сегмента.',
    position: 'top'
  },
  {
    selector: '[data-tooltip="segment-actions"]',
    title: '⚙️ Действия с сегментами',
    description: 'Кликните на три точки чтобы экспортировать сегмент, создать кампанию или настроить триггер для этой группы игроков.',
    position: 'left'
  },
  {
    selector: '[data-tooltip="ai-segments"]',
    title: '🤖 AI сегменты',
    description: 'Умные сегменты автоматически созданные AI на основе поведения игроков: риск оттока, VIP потенциал, спящие игроки.',
    position: 'top'
  }
];

// Сценарии (Triggers)
export const SCENARIOS_TOOLTIPS: TooltipStep[] = [
  {
    selector: '[data-tooltip="create-scenario"]',
    title: '🚀 Создать сценарий',
    description: 'Запустите создание нового автоматического сценария. Можете использовать шаблоны или создать с нуля.',
    position: 'bottom'
  },
  {
    selector: '[data-tooltip="scenarios-list"]',
    title: '📋 Активные сценарии',
    description: 'Все ваши триггеры и сценарии. Видите статус (активен/на паузе), количество срабатываний и конверсию.',
    position: 'top'
  },
  {
    selector: '[data-tooltip="scenario-builder"]',
    title: '🔀 Конструктор',
    description: 'Визуальный редактор для создания сложных сценариев с условиями, задержками и A/B тестами без программирования.',
    position: 'right'
  },
  {
    selector: '[data-tooltip="ai-copilot"]',
    title: '🤖 AI Copilot',
    description: 'AI предложит оптимальные сценарии на основе ваших целей: удержание игроков, реактивация, профилактика оттока.',
    position: 'left'
  }
];

// Кампании
export const CAMPAIGNS_TOOLTIPS: TooltipStep[] = [
  {
    selector: '[data-tooltip="create-campaign"]',
    title: '📣 Создать кампанию',
    description: 'Запустите новую маркетинговую кампанию: промо-акция, турнир, рассылка о новых играх.',
    position: 'bottom'
  },
  {
    selector: '[data-tooltip="campaigns-table"]',
    title: '📊 Статистика кампаний',
    description: 'Все запущенные и запланированные кампании с метриками: охват, открытия, клики, конверсия.',
    position: 'top'
  },
  {
    selector: '[data-tooltip="campaign-status"]',
    title: '🎯 Статусы',
    description: 'Отслеживайте статус кампании: черновик, запланирована, отправляется, завершена. Можно остановить в любой момент.',
    position: 'left'
  },
  {
    selector: '[data-tooltip="ab-testing"]',
    title: '🧪 A/B тестирование',
    description: 'Тестируйте разные варианты сообщений, времени отправки и аудиторий чтобы найти самую эффективную комбинацию.',
    position: 'top'
  }
];

// Бонусы
export const BONUSES_TOOLTIPS: TooltipStep[] = [
  {
    selector: '[data-tooltip="create-bonus"]',
    title: '🎁 Создать бонус',
    description: 'Создайте новый бонус: фриспины, кэшбэк, депозитный бонус или персональный оффер.',
    position: 'bottom'
  },
  {
    selector: '[data-tooltip="bonuses-list"]',
    title: '📋 Активные бонусы',
    description: 'Все бонусные предложения с условиями, сроками действия и статистикой активаций.',
    position: 'top'
  },
  {
    selector: '[data-tooltip="bonus-conditions"]',
    title: '⚙️ Условия',
    description: 'Настройте условия получения: минимальный депозит, вейджер, срок действия, допустимые игры.',
    position: 'left'
  },
  {
    selector: '[data-tooltip="bonus-performance"]',
    title: '📈 Эффективность',
    description: 'Анализируйте какие бонусы работают лучше: процент активации, выполнения вейджера, retention после бонуса.',
    position: 'top'
  }
];

// Игроки
export const PLAYERS_TOOLTIPS: TooltipStep[] = [
  {
    selector: '[data-tooltip="search-players"]',
    title: '🔍 Поиск игроков',
    description: 'Ищите игроков по имени, email, ID или номеру телефона. Быстрый доступ к любому профилю.',
    position: 'bottom'
  },
  {
    selector: '[data-tooltip="players-filters"]',
    title: '🎯 Фильтры',
    description: 'Фильтруйте базу по статусу, сегментам, уровню активности, LTV и другим параметрам.',
    position: 'bottom'
  },
  {
    selector: '[data-tooltip="players-table"]',
    title: '👥 База игроков',
    description: 'Полная таблица всех игроков с ключевыми метриками. Кликните на любого для просмотра детального профиля.',
    position: 'top'
  },
  {
    selector: '[data-tooltip="player-actions"]',
    title: '⚡ Действия',
    description: 'Отправляйте персональные сообщения, назначайте бонусы, добавляйте в сегменты прямо из списка.',
    position: 'left'
  }
];
