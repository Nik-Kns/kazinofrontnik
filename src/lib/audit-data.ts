import type { AuditSnapshot, AuditSection } from './audit-types';

// Словарь описаний проверок
export const AI_CHECKLIST_DICTIONARY = {
  'A1': {
    title: 'Полнота источников',
    description: 'ИИ сверяет наличие игроков, транзакций, ставок, бонусов и событий коммуникаций, проверяет диапазоны дат и контрольные суммы.'
  },
  'A2': {
    title: 'Валюта/локаль/часовой пояс',
    description: 'ИИ проверяет корректность валют, конвертаций и TZ, чтобы суммы и KPI совпадали с отчётами.'
  },
  'A3': {
    title: 'Идентификация и дубли',
    description: 'ИИ выявляет дубли, строит карту соответствий ID между системами и оценивает риски искажений.'
  },
  'A4': {
    title: 'Мёртвые души',
    description: 'ИИ исключает боты/невалидные контакты по правилам активности и доставляемости.'
  },
  'B1': {
    title: 'Формулы KPI',
    description: 'ИИ сопоставляет формулы GGR/Retention/ROMI с базой знаний и сверяет с эталоном.'
  },
  'B2': {
    title: 'Контрольные суммы',
    description: 'ИИ проверяет баланс депозитов, выводов и GGR по контрольным точкам.'
  },
  'C1': {
    title: 'Реалистичные сегменты',
    description: 'ИИ валидирует дефолтные сегменты и их охват, сравнивает с бенчмарками.'
  },
  'C2': {
    title: 'Шаблоны коммуникаций',
    description: 'ИИ проверяет наличие базовых шаблонов (welcome, реактивация, VIP) и их настройку.'
  },
  'D1': {
    title: 'Каналы и телеметрия',
    description: 'ИИ проверяет webhooks и события доставляемости для атрибуции ROMI.'
  },
  'D2': {
    title: 'Частотные правила',
    description: 'ИИ анализирует лимиты отправки и fatigue-правила для предотвращения переспама.'
  },
  'E1': {
    title: 'A/B тестирование',
    description: 'ИИ проверяет настройку контрольных групп и статистическую значимость.'
  },
  'E2': {
    title: 'Оркестрация',
    description: 'ИИ тестирует fallback и ветвления (открыто/не открыто), чтобы повысить доставляемость.'
  },
  'F1': {
    title: 'GDPR и согласия',
    description: 'ИИ проверяет наличие согласий и соответствие правилам обработки данных.'
  },
  'G1': {
    title: 'Календарь и конфликты',
    description: 'ИИ выявляет пересечения кампаний и оптимизирует расписание.'
  },
  'H1': {
    title: 'Чистый ROMI',
    description: 'ИИ учитывает бонусные расходы и сервисные издержки, рассчитывает чистый ROI.'
  },
  'H2': {
    title: 'Прогнозы и бюджеты',
    description: 'ИИ строит прогнозы доходности и рекомендует оптимальные бюджеты.'
  }
};

// Моковые данные для демонстрации
export const mockAuditSnapshot: AuditSnapshot = {
  projectId: 'project-123',
  overallProgressPct: 72,
  updatedAt: new Date().toISOString(),
  criticalIds: ['A1', 'B1', 'D1'],
  sections: [
    {
      id: 'A',
      title: 'A. Интеграция данных',
      items: [
        {
          id: 'A1',
          section: 'A. Интеграция данных',
          title: 'Полнота источников',
          shortDescription: AI_CHECKLIST_DICTIONARY['A1'].description,
          status: 'failed',
          lastCheckedAt: new Date(Date.now() - 5 * 60000).toISOString(),
          dataSources: ['players', 'deposits', 'bets', 'bonuses'],
          howWeCheckShort: 'COUNT записей, диапазоны дат, сверка ±2%',
          fixes: [
            { label: 'Настроить интеграцию', href: '/settings/integrations' },
            { label: 'Загрузить данные', href: '/data/import' }
          ],
          aiNotes: 'Отсутствуют данные по бонусам за последние 30 дней'
        },
        {
          id: 'A2',
          section: 'A. Интеграция данных',
          title: 'Валюта/локаль/часовой пояс',
          shortDescription: AI_CHECKLIST_DICTIONARY['A2'].description,
          status: 'passed',
          lastCheckedAt: new Date(Date.now() - 10 * 60000).toISOString(),
          dataSources: ['transactions', 'settings'],
          howWeCheckShort: 'Проверка форматов, курсов конвертации',
          aiNotes: 'Все валюты корректны, TZ = UTC+0'
        },
        {
          id: 'A3',
          section: 'A. Интеграция данных',
          title: 'Идентификация и дубли',
          shortDescription: AI_CHECKLIST_DICTIONARY['A3'].description,
          status: 'review',
          lastCheckedAt: new Date(Date.now() - 15 * 60000).toISOString(),
          dataSources: ['players', 'identity_mapping'],
          howWeCheckShort: 'Анализ дубликатов по email/phone/device',
          fixes: [
            { label: 'Просмотреть дубли', href: '/data/duplicates' }
          ],
          aiNotes: 'Обнаружено 124 потенциальных дубликата'
        },
        {
          id: 'A4',
          section: 'A. Интеграция данных',
          title: 'Мёртвые души',
          shortDescription: AI_CHECKLIST_DICTIONARY['A4'].description,
          status: 'running',
          dataSources: ['players', 'activity_log'],
          howWeCheckShort: 'ML-модель детекции ботов и фейков'
        }
      ]
    },
    {
      id: 'B',
      title: 'B. Расчёт метрик',
      items: [
        {
          id: 'B1',
          section: 'B. Расчёт метрик',
          title: 'Формулы KPI',
          shortDescription: AI_CHECKLIST_DICTIONARY['B1'].description,
          status: 'failed',
          lastCheckedAt: new Date(Date.now() - 20 * 60000).toISOString(),
          dataSources: ['formulas', 'benchmarks'],
          howWeCheckShort: 'Сверка с эталонными формулами',
          fixes: [
            { label: 'Настроить формулы', href: '/settings/kpi' },
            { label: 'Посмотреть расхождения', href: '/analytics/validation' }
          ],
          aiNotes: 'Retention считается неверно (без учёта реактивации)'
        },
        {
          id: 'B2',
          section: 'B. Расчёт метрик',
          title: 'Контрольные суммы',
          shortDescription: AI_CHECKLIST_DICTIONARY['B2'].description,
          status: 'passed',
          lastCheckedAt: new Date(Date.now() - 25 * 60000).toISOString(),
          dataSources: ['deposits', 'withdrawals', 'ggr'],
          howWeCheckShort: 'Баланс транзакций ±0.01%',
          aiNotes: 'Баланс сходится на 99.98%'
        }
      ]
    },
    {
      id: 'C',
      title: 'C. Настройка сегментов',
      items: [
        {
          id: 'C1',
          section: 'C. Настройка сегментов',
          title: 'Реалистичные сегменты',
          shortDescription: AI_CHECKLIST_DICTIONARY['C1'].description,
          status: 'passed',
          lastCheckedAt: new Date(Date.now() - 30 * 60000).toISOString(),
          dataSources: ['segments', 'players'],
          howWeCheckShort: 'Проверка охвата и пересечений',
          aiNotes: 'Все сегменты покрывают 94% базы'
        },
        {
          id: 'C2',
          section: 'C. Настройка сегментов',
          title: 'Шаблоны коммуникаций',
          shortDescription: AI_CHECKLIST_DICTIONARY['C2'].description,
          status: 'missing',
          dataSources: ['templates', 'campaigns'],
          howWeCheckShort: 'Наличие must-have шаблонов',
          fixes: [
            { label: 'Создать шаблоны', href: '/templates/new' },
            { label: 'Импортировать из библиотеки', href: '/templates/library' }
          ],
          aiNotes: 'Отсутствует welcome-серия и VIP-реактивация'
        }
      ]
    },
    {
      id: 'D',
      title: 'D. Каналы и доставляемость',
      items: [
        {
          id: 'D1',
          section: 'D. Каналы и доставляемость',
          title: 'Каналы и телеметрия',
          shortDescription: AI_CHECKLIST_DICTIONARY['D1'].description,
          status: 'failed',
          lastCheckedAt: new Date(Date.now() - 35 * 60000).toISOString(),
          dataSources: ['webhooks', 'delivery_events'],
          howWeCheckShort: 'Проверка webhook-статусов',
          fixes: [
            { label: 'Настроить webhooks', href: '/settings/webhooks' },
            { label: 'Проверить логи', href: '/logs/webhooks' }
          ],
          aiNotes: 'Push-канал не настроен, email bounce rate 15%'
        },
        {
          id: 'D2',
          section: 'D. Каналы и доставляемость',
          title: 'Частотные правила',
          shortDescription: AI_CHECKLIST_DICTIONARY['D2'].description,
          status: 'review',
          lastCheckedAt: new Date(Date.now() - 40 * 60000).toISOString(),
          dataSources: ['frequency_rules', 'send_history'],
          howWeCheckShort: 'Анализ fatigue и переспама',
          fixes: [
            { label: 'Настроить правила', href: '/settings/frequency' }
          ],
          aiNotes: '12% игроков получают >5 сообщений в день'
        }
      ]
    },
    {
      id: 'E',
      title: 'E. Тестирование и оптимизация',
      items: [
        {
          id: 'E1',
          section: 'E. Тестирование и оптимизация',
          title: 'A/B тестирование',
          shortDescription: AI_CHECKLIST_DICTIONARY['E1'].description,
          status: 'passed',
          lastCheckedAt: new Date(Date.now() - 45 * 60000).toISOString(),
          dataSources: ['ab_tests', 'control_groups'],
          howWeCheckShort: 'Статистическая значимость p<0.05',
          aiNotes: 'Контрольные группы настроены корректно'
        },
        {
          id: 'E2',
          section: 'E. Тестирование и оптимизация',
          title: 'Оркестрация',
          shortDescription: AI_CHECKLIST_DICTIONARY['E2'].description,
          status: 'running',
          dataSources: ['workflows', 'fallback_rules'],
          howWeCheckShort: 'Тестирование ветвлений и fallback'
        }
      ]
    }
  ]
};

// Функция для обновления статуса
export function updateAuditItemStatus(
  snapshot: AuditSnapshot, 
  itemId: string, 
  newStatus: AuditSnapshot['sections'][0]['items'][0]['status']
): AuditSnapshot {
  return {
    ...snapshot,
    sections: snapshot.sections.map(section => ({
      ...section,
      items: section.items.map(item => 
        item.id === itemId 
          ? { ...item, status: newStatus, lastCheckedAt: new Date().toISOString() }
          : item
      )
    }))
  };
}

// Функция для расчета прогресса
export function calculateProgress(snapshot: AuditSnapshot): number {
  const allItems = snapshot.sections.flatMap(s => s.items);
  const completedItems = allItems.filter(i => 
    ['passed', 'failed', 'missing', 'review'].includes(i.status)
  );
  return Math.round((completedItems.length / allItems.length) * 100);
}