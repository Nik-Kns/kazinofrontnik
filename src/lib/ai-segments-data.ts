import type { AiSegmentTemplate } from './types';

export const aiSegmentTemplates: AiSegmentTemplate[] = [
  {
    id: 'ai-churn-risk',
    name: 'Игроки с высоким риском оттока',
    description: 'Сегмент, определенный предиктивной моделью. Эти игроки скорее всего перестанут играть в ближайшие 7 дней.',
    category: 'Риск оттока',
    metrics: {
      playerCount: 890,
      retention: '25%',
      avgNgr: '€15.50',
    },
    source: 'Сгенерировано ИИ',
    updatedAt: '2024-07-15',
    details: {
      rules: [
        { field: 'Churn Probability Score', condition: '>', value: '75%' },
        { field: 'Частота сессий', condition: 'снижение на', value: '50% (за 14 дней)' },
        { field: 'Последняя активность', condition: 'более', value: '10 дней назад' },
      ],
      recommendation: 'Используйте этот сегмент для реактивационных кампаний с бонусами или эксклюзивными предложениями, чтобы предотвратить отток.'
    }
  },
  {
    id: 'ai-vip-low-activity',
    name: 'VIP с низкой активностью',
    description: 'Высокоценные игроки, чья активность значительно снизилась за последний месяц.',
    category: 'VIP',
    metrics: {
      playerCount: 120,
      retention: '85%',
      avgNgr: '€120.30',
    },
    source: 'Сгенерировано ИИ',
    updatedAt: '2024-07-14',
    details: {
      rules: [
        { field: 'Lifetime Revenue', condition: '>', value: '€5,000' },
        { field: 'Количество сессий (30 дней)', condition: '<', value: '5' },
        { field: 'Средний чек', condition: 'снижение на', value: '30%' },
      ],
      recommendation: 'Персонализированное общение через VIP-менеджера или эксклюзивные бонусы могут помочь восстановить их лояльность.'
    }
  },
  {
    id: 'ai-new-no-deposit',
    name: 'Новички без депозита (7 дней)',
    description: 'Игроки, которые зарегистрировались в течение последней недели, но еще не сделали ни одного депозита.',
    category: 'Новички',
    metrics: {
      playerCount: 1250,
      retention: '40%',
      avgNgr: '€0',
    },
    source: 'Сгенерировано ИИ',
    updatedAt: '2024-07-16',
    details: {
      rules: [
        { field: 'Дата регистрации', condition: 'в пределах', value: '7 дней' },
        { field: 'Количество депозитов', condition: '=', value: '0' },
        { field: 'Игровое время', condition: '>', value: '30 минут' },
      ],
      recommendation: 'Предложите бонус на первый депозит или фриспины, чтобы стимулировать первое пополнение счета.'
    }
  },
  {
    id: 'ai-high-value-potential',
    name: 'Потенциальные High-Value игроки',
    description: 'Игроки, показывающие паттерны поведения, схожие с VIP-игроками на ранних стадиях.',
    category: 'High-value',
    metrics: {
      playerCount: 650,
      retention: '70%',
      avgNgr: '€45.00',
    },
    source: 'Сгенерировано ИИ',
    updatedAt: '2024-07-16',
    details: {
      rules: [
        { field: 'Средний размер депозита', condition: '>', value: '€50' },
        { field: 'Частота депозитов', condition: '>', value: '3 (за 30 дней)' },
        { field: 'Предпочитаемые игры', condition: 'совпадает с', value: 'VIP-профилем' },
      ],
      recommendation: 'Специальные акции и повышенный кэшбек могут ускорить их переход в VIP-сегмент.'
    }
  }
];

