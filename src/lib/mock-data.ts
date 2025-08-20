import type { KpiCardData, ScenarioData, ChartData, RiskData, SegmentData, TemplateData, ReportData, CampaignData, WebhookLogData, CampaignPerformanceData, PlayerData, PlayerKpi, PlayerActivityEvent } from "@/lib/types";
import {
  Mail,
  TrendingUp,
  Users,
  RefreshCw,
  Euro,
  MailWarning,
  MessageCircle,
  Smartphone,
  StickyNote,
  LogIn,
  Swords,
  Trophy
} from "lucide-react";

export const kpiData: KpiCardData[] = [
  {
    title: "Delivery Rate",
    value: "98.2%",
    change: "+0.5%",
    changeType: "increase",
    icon: "Mail",
    aiHint: "Процент успешно доставленных сообщений. Норма >95%. Низкий показатель может свидетельствовать о плохом качестве базы или проблемах с провайдером.",
  },
  {
    title: "Open Rate",
    value: "21.4%",
    change: "+3.1%",
    changeType: "increase",
    icon: "TrendingUp",
    aiHint: "Процент получателей, открывших сообщение. Ключевая метрика релевантности темы и заголовка.",
  },
  {
    title: "CTR",
    value: "4.8%",
    change: "-0.2%",
    changeType: "decrease",
    icon: "MousePointerClick",
    aiHint: "Click-Through Rate: Процент получателей, кликнувших по одной или нескольким ссылкам в сообщении. Показывает релевантность контента.",
  },
  {
    title: "Conversion Rate (CR)",
    value: "2.1%",
    change: "+0.8%",
    changeType: "increase",
    icon: "Target",
    aiHint: "Процент пользователей, выполнивших целевое действие (например, депозит) после получения сообщения.",
  },
  {
    title: "D7 Retention",
    value: "15.3%",
    change: "-1.5%",
    changeType: "decrease",
    icon: "Users",
    aiHint: "Процент новых пользователей, вернувшихся в приложение на 7-й день после первой сессии.",
  },
  {
    title: "Reactivation Rate",
    value: "5.7%",
    change: "+0.9%",
    changeType: "increase",
    icon: "RefreshCw",
    aiHint: "Процент \"спящих\" игроков, которых удалось вернуть с помощью CRM-кампаний.",
  },
  {
    title: "Revenue from CRM (€)",
    value: "€45,820",
    change: "+12.4%",
    changeType: "increase",
    icon: "Euro",
    aiHint: "Общий доход, сгенерированный непосредственно от CRM-кампаний за выбранный период.",
  },
  {
    title: "Unsubscribe Rate",
    value: "0.15%",
    change: "+0.02%",
    changeType: "decrease",
    icon: "MailWarning",
    aiHint: "Процент получателей, отписавшихся от рассылки. Рост этого показателя - признак усталости базы.",
  },
  {
    title: "GGR (Gross Gaming Revenue)",
    value: "€125,340",
    change: "+18.2%",
    changeType: "increase",
    icon: "Euro",
    aiHint: "Валовый игровой доход - общая сумма ставок минус выплаты. Ключевая метрика прибыльности казино.",
  },
  {
    title: "Total Bet",
    value: "€1,842,560",
    change: "+22.5%",
    changeType: "increase",
    icon: "DollarSign",
    aiHint: "Общая сумма ставок игроков за период. Показывает общий объем игровой активности на платформе.",
  },
];

export const scenariosData: ScenarioData[] = [
  {
    name: "Welcome Chain",
    category: "Onboarding",
    frequency: "Триггерный",
    channel: "Multi-channel",
    status: "Активен",
    segment: "Новички",
    goal: "Депозит",
    deliveryRate: "99.5%",
    openRate: "45.2%",
    ctr: "12.3%",
    cr: "8.1%",
    churnImpact: "-2.5%",
    geo: ["DE", "RU", "EN"],
    project: ["CasinoX", "LuckyWheel"]
  },
  {
    name: "Churn Reactivation",
    category: "Reactivation",
    frequency: "Триггерный",
    channel: "Push",
    status: "Активен",
    segment: "Спящие",
    goal: "Реактивация",
    deliveryRate: "92.1%",
    openRate: "15.8%",
    ctr: "5.2%",
    cr: "2.3%",
    churnImpact: "-15.0%",
    geo: ["DE", "EN"],
    project: ["CasinoX", "GoldenPlay"]
  },
  {
    name: "VIP Weekly Bonus",
    category: "Retention",
    frequency: "Регулярный",
    channel: "Email",
    status: "Активен",
    segment: "VIP",
    goal: "Повторная сессия",
    deliveryRate: "99.8%",
    openRate: "65.7%",
    ctr: "25.1%",
    cr: "18.9%",
    churnImpact: "-0.5%",
    geo: ["DE", "RU", "EN", "FR"],
    project: ["AIGAMING.BOT", "CasinoX", "LuckyWheel", "GoldenPlay"]
  },
  {
    name: "Summer Promo",
    category: "Promotion",
    frequency: "Разовый",
    channel: "SMS",
    status: "Пауза",
    segment: "Все активные",
    goal: "Депозит",
    deliveryRate: "97.4%",
    openRate: "N/A",
    ctr: "8.9%",
    cr: "4.5%",
    churnImpact: "N/A",
    geo: ["DE", "FR"],
    project: ["CasinoX", "GoldenPlay"]
  },
  {
    name: "Q2 Survey",
    category: "Feedback",
    frequency: "Триггерный",
    channel: "InApp",
    status: "Завершён",
    segment: "Активные 90д",
    goal: "Сбор обратной связи",
    deliveryRate: "100%",
    openRate: "100%",
    ctr: "35.6%",
    cr: "30.1%",
    churnImpact: "N/A",
    geo: ["RU", "EN"],
    project: ["AIGAMING.BOT", "LuckyWheel"]
  },
  {
    name: "German VIP Exclusive",
    category: "VIP",
    frequency: "Регулярный",
    channel: "Email",
    status: "Активен",
    segment: "VIP DE",
    goal: "Retention",
    deliveryRate: "99.9%",
    openRate: "72.3%",
    ctr: "28.5%",
    cr: "22.1%",
    churnImpact: "-1.2%",
    geo: ["DE"],
    project: ["CasinoX"]
  },
  {
    name: "Multi-Brand Welcome",
    category: "Onboarding",
    frequency: "Триггерный",
    channel: "Multi-channel",
    status: "Активен",
    segment: "Новые регистрации",
    goal: "Первый депозит",
    deliveryRate: "98.7%",
    openRate: "48.1%",
    ctr: "14.2%",
    cr: "9.3%",
    churnImpact: "-3.1%",
    geo: ["DE", "RU", "EN", "FR"],
    project: ["AIGAMING.BOT", "CasinoX", "LuckyWheel", "GoldenPlay"]
  },
  {
    name: "Russian Slots Promo",
    category: "Promotion",
    frequency: "Разовый",
    channel: "Push",
    status: "Активен",
    segment: "Слот-игроки RU",
    goal: "Активность",
    deliveryRate: "94.2%",
    openRate: "32.1%",
    ctr: "11.8%",
    cr: "6.7%",
    churnImpact: "N/A",
    geo: ["RU"],
    project: ["AIGAMING.BOT", "LuckyWheel"]
  }
];

export const analyticsChartsData: { title: string; type: "line" | "area" | "bar", icon: any, data: ChartData[] }[] = [
    {
        title: "Open Rate",
        type: "line",
        icon: TrendingUp,
        data: [
            { date: "Jul 1", value: 22, predictedValue: null },
            { date: "Jul 2", value: 21, predictedValue: null },
            { date: "Jul 3", value: 24, predictedValue: null },
            { date: "Jul 4", value: 23, predictedValue: null },
            { date: "Jul 5", value: 25, predictedValue: null },
            { date: "Jul 6", value: 26, predictedValue: null },
            { date: "Jul 7", value: 24, predictedValue: null },
            { date: "Jul 8", value: null, predictedValue: 24.5 },
            { date: "Jul 9", value: null, predictedValue: 25 },
            { date: "Jul 10", value: null, predictedValue: 25.2 },
            { date: "Jul 11", value: null, predictedValue: 24.8 },
        ]
    },
    {
        title: "Conversion Rate",
        type: "line",
        icon: Users,
        data: [
            { date: "Jul 1", value: 2.1, predictedValue: null },
            { date: "Jul 2", value: 2.3, predictedValue: null },
            { date: "Jul 3", value: 2.2, predictedValue: null },
            { date: "Jul 4", value: 2.5, predictedValue: null },
            { date: "Jul 5", value: 2.8, predictedValue: null },
            { date: "Jul 6", value: 3.1, predictedValue: null },
            { date: "Jul 7", value: 2.9, predictedValue: null },
            { date: "Jul 8", value: null, predictedValue: 3.0 },
            { date: "Jul 9", value: null, predictedValue: 3.2 },
            { date: "Jul 10", value: null, predictedValue: 3.3 },
            { date: "Jul 11", value: null, predictedValue: 3.1 },
        ]
    },
    {
        title: "Churn Rate",
        type: "line",
        icon: Users,
        data: [
            { date: "Jul 1", value: 1.5, predictedValue: null },
            { date: "Jul 2", value: 1.6, predictedValue: null },
            { date: "Jul 3", value: 1.4, predictedValue: null },
            { date: "Jul 4", value: 1.3, predictedValue: null },
            { date: "Jul 5", value: 1.2, predictedValue: null },
            { date: "Jul 6", value: 1.1, predictedValue: null },
            { date: "Jul 7", value: 1.0, predictedValue: null },
            { date: "Jul 8", value: null, predictedValue: 1.0 },
            { date: "Jul 9", value: null, predictedValue: 0.9 },
            { date: "Jul 10", value: null, predictedValue: 0.9 },
            { date: "Jul 11", value: null, predictedValue: 0.8 },
        ]
    },
    {
        title: "CRM ROI",
        type: "area",
        icon: Euro,
        data: [
            { date: "Jul 1", value: 150, predictedValue: null },
            { date: "Jul 2", value: 180, predictedValue: null },
            { date: "Jul 3", value: 220, predictedValue: null },
            { date: "Jul 4", value: 210, predictedValue: null },
            { date: "Jul 5", value: 250, predictedValue: null },
            { date: "Jul 6", value: 280, predictedValue: null },
            { date: "Jul 7", value: 300, predictedValue: null },
            { date: "Jul 8", value: null, predictedValue: 310 },
            { date: "Jul 9", value: null, predictedValue: 325 },
            { date: "Jul 10", value: null, predictedValue: 340 },
            { date: "Jul 11", value: null, predictedValue: 350 },
        ]
    }
]

export const risksData: RiskData[] = [
    {
        type: "critical",
        title: "Ошибка отправки email",
        date: "Обнаружено 3 июля, 18:47",
        details: "Канал: Email (SendGrid). Сценарий: 'VIP Weekly Bonus'. Ответ от API SendGrid превысил 10 секунд.",
        recommendation: "API SendGrid может быть перегружен или недоступен. Проверьте статус сервиса SendGrid и логи интеграции. Если проблема повторяется, свяжитесь с поддержкой.",
        action: {
            text: "Проверить интеграцию",
            link: "/settings"
        }
    },
    {
        type: "warning",
        title: "Open Rate резко упал",
        date: "Обнаружено 4 июля, 09:21",
        details: "Сценарий: 'Reactivate Sleepers' (Push). Open Rate упал на 40% по сравнению со средним за 14 дней для этого сценария.",
        recommendation: "Возможно, креативы выгорели или предложение стало нерелевантным. Рекомендуется провести A/B тест с новым текстом и/или бонусом.",
        action: {
            text: "Перейти к сценарию",
            link: "/builder"
        }
    },
    {
        type: "info",
        title: "Возможность роста ROI",
        date: "Обнаружено 2 июля, 11:03",
        details: "AI-анализ кампании “Welcome Chain” показал, что пользователи, пришедшие с источника X, конвертируются в депозит на 50% лучше среднего.",
        recommendation: "Попробуйте создать отдельный сценарий для этого сегмента с более агрессивным предложением, чтобы максимизировать конверсию.",
        action: {
            text: "Создать сегмент",
            link: "/segments"
        }
    },
]

export const segmentsData: SegmentData[] = [
  { id: '1', name: 'Новые игроки (без депозита)', description: 'Пользователи, зарегистрировавшиеся за последние 7 дней и не совершившие ни одного депозита.', playerCount: 1250, createdAt: '2024-07-01', createdBy: 'AI' },
  { id: '2', name: 'VIP-игроки', description: 'Игроки с Lifetime Revenue > €5,000 и последней активностью не позднее 30 дней назад.', playerCount: 320, createdAt: '2024-06-28', createdBy: 'Пользователь' },
  { id: '3', name: 'Риск оттока (предиктивный)', description: 'Игроки с Churn Probability Score > 75% и снижением частоты сессий на 50% за последние 14 дней.', playerCount: 890, createdAt: '2024-07-03', createdBy: 'AI' },
  { id: '4', name: 'Сделали первый депозит', description: 'Игроки, которые совершили свой первый депозит за последний месяц.', playerCount: 2100, createdAt: '2024-06-15', createdBy: 'Пользователь' },
  { id: '5', name: 'Спящие (30+ дней)', description: 'Игроки, не заходившие в игру более 30 дней, но имеющие хотя бы 1 депозит в истории.', playerCount: 450, createdAt: '2024-05-20', createdBy: 'Пользователь' },
  { id: '6', name: 'Любители слотов', description: 'Игроки, у которых 80% игрового времени приходится на слоты.', playerCount: 5400, createdAt: '2024-07-04', createdBy: 'AI' },
];

export const templatesData: TemplateData[] = [
    { id: '1', name: 'Welcome-цепочка', description: 'Серия из 3 писем для новых игроков для их активации и первого депозита.', category: 'Onboarding', performance: 5, channel: 'Email', type: 'event', event: 'registration', geo: ['DE', 'RU', 'EN'], project: ['CasinoX', 'LuckyWheel'] },
    { id: '2', name: 'Реактивация "спящих"', description: 'Push-уведомление с бонусом для игроков, неактивных 30+ дней.', category: 'Reactivation', performance: 4, channel: 'Push', type: 'event', event: 'inactivity', geo: ['DE', 'EN'], project: ['CasinoX', 'GoldenPlay'] },
    { id: '3', name: 'Бонус для VIP-игроков', description: 'Еженедельное эксклюзивное предложение для сегмента VIP.', category: 'Retention', performance: 5, channel: 'Multi-channel', type: 'basic', geo: ['DE', 'RU', 'EN', 'FR'], project: ['AIGAMING.BOT', 'CasinoX', 'LuckyWheel', 'GoldenPlay'] },
    { id: '4', name: 'Запрос обратной связи', description: 'In-app сообщение с просьбой оценить игру после 5 сессий.', category: 'Feedback', performance: 3, channel: 'InApp', type: 'basic', geo: ['RU', 'EN'], project: ['AIGAMING.BOT', 'LuckyWheel'] },
    { id: '5', name: 'Напоминание о брошенном депозите', description: 'SMS-напоминание игрокам, которые начали, но не завершили процесс пополнения.', category: 'Conversion', performance: 4, channel: 'SMS', type: 'event', event: 'first_deposit', geo: ['DE', 'FR'], project: ['CasinoX', 'GoldenPlay'] },
    { id: '6', name: 'Поздравление с крупным выигрышем', description: 'Персональное поздравление при выигрыше свыше €500.', category: 'Engagement', performance: 5, channel: 'Email', type: 'event', event: 'big_win', geo: ['DE', 'RU', 'EN'], project: ['AIGAMING.BOT', 'CasinoX'] },
    { id: '7', name: 'Приглашение в турнир', description: 'Базовый шаблон приглашения на турниры.', category: 'Engagement', performance: 4, channel: 'Push', type: 'basic', geo: ['RU', 'EN', 'FR'], project: ['LuckyWheel', 'GoldenPlay'] },
    { id: '8', name: 'Индивидуальный сценарий', description: 'Пользовательский шаблон с настраиваемой логикой.', category: 'Custom', performance: 3, channel: 'Multi-channel', type: 'custom', geo: ['DE'], project: ['CasinoX'] },
    { id: '9', name: 'Активация бонуса', description: 'Уведомление при активации бонуса игроком.', category: 'Bonus', performance: 4, channel: 'InApp', type: 'event', event: 'bonus_activation', geo: ['DE', 'RU'], project: ['AIGAMING.BOT', 'GoldenPlay'] },
    { id: '10', name: 'Первый логин после регистрации', description: 'Приветственное сообщение при первом входе в систему.', category: 'Onboarding', performance: 5, channel: 'InApp', type: 'event', event: 'login', geo: ['DE', 'EN', 'FR'], project: ['CasinoX', 'LuckyWheel', 'GoldenPlay'] },
    { id: '11', name: 'Немецкий специальный бонус', description: 'Персонализированный шаблон для немецкой аудитории CasinoX.', category: 'Promotion', performance: 4, channel: 'Email', type: 'custom', geo: ['DE'], project: ['CasinoX'] },
    { id: '12', name: 'Система лояльности', description: 'Базовый шаблон для программы лояльности всех проектов.', category: 'Loyalty', performance: 5, channel: 'Multi-channel', type: 'basic', geo: ['DE', 'RU', 'EN', 'FR'], project: ['AIGAMING.BOT', 'CasinoX', 'LuckyWheel', 'GoldenPlay'] },
];

export const reportsData: ReportData[] = [
    { id: '1', name: 'Еженедельный отчет по Retention', type: 'Retention', createdAt: '2024-07-05 10:00', status: 'Готов', createdBy: 'Автоматически' },
    { id: '2', name: 'Эффективность Welcome-цепочки', type: 'Сценарий', createdAt: '2024-07-04 15:30', status: 'Готов', createdBy: 'John Doe' },
    { id: '3', name: 'Анализ сегмента VIP-игроков', type: 'Сегмент', createdAt: '2024-07-03 11:00', status: 'Готов', createdBy: 'Jane Smith' },
    { id: '4', name: 'Отчет по churn-кампаниям за Q2', type: 'Сценарий', createdAt: '2024-07-05 16:00', status: 'В процессе', createdBy: 'John Doe' },
];

const originalNames = [
  'Welcome Chain',
  'Summer Slots Promo',
  'Reactivation Push',
  'VIP Bonus Drop',
  'Weekend Tournament',
  'Feedback Request',
  'Deposit Reminder',
  'Jackpot Promo',
  'Personal Offer',
  'Slot Lovers Tournament',
  'Daily Promo',
  'VIP Only',
  'Weekend Push',
  'Survey',
  'Monday Promo',
];

function getRandomName(idx: number, offset: number) {
  return originalNames[(idx * 2 + offset) % originalNames.length];
}

export const campaignsData: CampaignData[] = [
  ...Array.from({length: 31}, (_, i) => [
    {
      id: `d${i+1}-1`,
      name: getRandomName(i, 0),
      date: `2024-07-${String(i+1).padStart(2, '0')}`,
      type: 'Promo',
      goal: 'Активность',
      offer: `${10+i} фриспинов`,
      channel: i%2===0 ? 'Push' : 'Email',
      language: i%3===0 ? 'RU' : (i%3===1 ? 'EN' : 'DE'),
      segment: i%4===0 ? 'VIP' : (i%4===1 ? 'Все' : (i%4===2 ? 'Любители слотов' : 'Спящие')),
      media: '',
      texts: `Текст акции ${i+1}`,
      triggers: 'Промо-акция',
      status: i%3===0 ? 'active' : (i%3===1 ? 'paused' : 'completed'),
      typeDetail: 'промо',
    },
    {
      id: `d${i+1}-2`,
      name: getRandomName(i, 1),
      date: `2024-07-${String(i+1).padStart(2, '0')}`,
      type: 'Push',
      goal: 'Return',
      offer: `${5+i}€ бонус`,
      channel: i%2===0 ? 'SMS' : 'InApp',
      language: i%3===0 ? 'EN' : (i%3===1 ? 'DE' : 'RU'),
      segment: i%4===0 ? 'Спящие' : (i%4===1 ? 'VIP' : (i%4===2 ? 'Все' : 'Любители слотов')),
      media: '',
      texts: `Текст возврата ${i+1}`,
      triggers: '30+ дней неактивен',
      status: i%2===0 ? 'active' : 'paused',
      typeDetail: 'return',
    },
    {
      id: `d${i+1}-3`,
      name: getRandomName(i, 2),
      date: `2024-07-${String(i+1).padStart(2, '0')}`,
      type: 'Push',
      goal: 'Опрос',
      offer: '',
      channel: i%2===0 ? 'InApp' : 'Email',
      language: i%3===0 ? 'DE' : (i%3===1 ? 'RU' : 'EN'),
      segment: i%4===0 ? 'Любители слотов' : (i%4===1 ? 'Спящие' : (i%4===2 ? 'VIP' : 'Все')),
      media: '',
      texts: `Текст опроса ${i+1}`,
      triggers: 'Опрос',
      status: i%2===0 ? 'completed' : 'active',
      typeDetail: 'опрос',
    },
  ]).flat(),
];

export const webhookLogsData: WebhookLogData[] = [
  { id: '1', timestamp: '2024-07-10 14:01:59', service: 'SendGrid', event: 'email.delivered', status: 'Success', requestId: 'd-12345...' },
  { id: '2', timestamp: '2024-07-10 14:01:58', service: 'SendGrid', event: 'email.open', status: 'Success', requestId: 'd-12345...' },
  { id: '3', timestamp: '2024-07-10 14:00:12', service: 'Twilio', event: 'sms.sent', status: 'Success', requestId: 'SM-6789...' },
  { id: '4', timestamp: '2024-07-10 13:55:05', service: 'Custom', event: 'user.level_up', status: 'Success', requestId: 'evt-abc...' },
  { id: '5', timestamp: '2024-07-10 13:50:21', service: 'SendGrid', event: 'email.bounce', status: 'Failed', requestId: 'd-09876...' },
  { id: '6', timestamp: '2024-07-10 13:45:10', service: 'Twilio', event: 'sms.failed', status: 'Failed', requestId: 'SM-5432...' },
];

export const campaignPerformanceData: CampaignPerformanceData[] = [
    { id: '1', campaignName: 'Welcome Chain', segment: 'Новички', sent: 1250, delivered: 1243, openRate: '45.2%', ctr: '12.3%', cr: '8.1%', revenue: 12850 },
    { id: '2', campaignName: 'Churn Reactivation', segment: 'Спящие', sent: 450, delivered: 414, openRate: '15.8%', ctr: '5.2%', cr: '2.3%', revenue: 3420 },
    { id: '3', campaignName: 'VIP Weekly Bonus', segment: 'VIP-игроки', sent: 320, delivered: 320, openRate: '65.7%', ctr: '25.1%', cr: '18.9%', revenue: 21500 },
    { id: '4', campaignName: 'Summer Promo', segment: 'Все активные', sent: 8540, delivered: 8321, openRate: 'N/A', ctr: '8.9%', cr: '4.5%', revenue: 31200 },
    { id: '5', campaignName: 'Q2 Survey', segment: 'Активные 90д', sent: 6300, delivered: 6300, openRate: '100%', ctr: '35.6%', cr: '30.1%', revenue: 0 },
];

export const playersData: PlayerData[] = [
    { id: '1', name: 'John "Gamer" Doe', avatar: 'https://placehold.co/40x40.png', ltv: 1250, lastSeen: '2 часа назад', churnRisk: 'Низкий', status: 'Активен' },
    { id: '2', name: 'Jane "Winner" Smith', avatar: 'https://placehold.co/40x40.png', ltv: 5320, lastSeen: '1 день назад', churnRisk: 'Низкий', status: 'Активен' },
    { id: '3', name: 'Peter "Sleeper" Jones', avatar: 'https://placehold.co/40x40.png', ltv: 320, lastSeen: '35 дней назад', churnRisk: 'Высокий', status: 'Спящий' },
    { id: '4', name: 'Mary "HighRoller" White', avatar: 'https://placehold.co/40x40.png', ltv: 25800, lastSeen: '2 дня назад', churnRisk: 'Средний', status: 'Активен' },
    { id: '5', name: 'Chris "Churned" Green', avatar: 'https://placehold.co/40x40.png', ltv: 150, lastSeen: '95 дней назад', churnRisk: 'Высокий', status: 'Отток' },
];

export const getPlayerDetails = (id: string) => {
    const playerBase = playersData.find(p => p.id === id) || playersData[0];
    return {
        ...playerBase,
        demographics: {
            "ID клиента": `usr_${id.padStart(8, '0')}`,
            "Пол": "Мужской",
            "Возраст": "34",
            "Страна": "Германия",
            "Язык": "DE",
            "Дата регистрации": "2023-05-12",
            "Устройство": "iPhone 15 Pro",
        },
        kpis: [
            { title: "Lifetime Value", value: `€${playerBase.ltv.toLocaleString()}`},
            { title: "Средний депозит", value: "€52.50"},
            { title: "Всего депозитов", value: "24"},
            { title: "Всего выводов", value: "5"},
            { title: "NGR (Net Gaming Revenue)", value: "€820"},
            { title: "RTP (Return to Player)", value: "96.5%"},
            { title: "Кол-во сессий (30д)", value: "48"},
            { title: "Сред. длит. сессии", value: "25 мин"},
        ] as PlayerKpi[],
        activity: [
            { id: '1', timestamp: '2024-07-19 15:30', type: 'note', title: 'Добавлена заметка', details: 'Менеджер John S. добавил заметку: "Игрок жаловался на долгий вывод средств, вопрос решен."', icon: StickyNote },
            { id: '2', timestamp: '2024-07-19 14:00', type: 'deposit', title: 'Депозит', details: 'VISA **** 1234', value: "+ €50.00", icon: Euro },
            { id: '3', timestamp: '2024-07-19 13:45', type: 'communication', title: 'Отправлено Push-уведомление', details: 'Сценарий "VIP Bonus Drop": "Ваш еженедельный бонус ждет!"', icon: Smartphone },
            { id: '4', timestamp: '2024-07-18 21:10', type: 'win', title: 'Крупный выигрыш', details: 'Слот: Book of Dead', value: "+ €350.00", icon: Trophy },
            { id: '5', timestamp: '2024-07-18 20:30', type: 'bet', title: 'Ставка', details: 'Слот: Book of Dead', value: "- €5.00", icon: Swords },
            { id: '6', timestamp: '2024-07-18 20:25', type: 'session', title: 'Начало сессии', details: 'Устройство: iPhone 15 Pro, IP: 89.123.45.67', icon: LogIn },
            { id: '7', timestamp: '2024-07-15 10:00', type: 'communication', title: 'Отправлено Email', details: 'Сценарий "Welcome Chain": "Добро пожаловать в AIGAMING.BOT!"', icon: Mail },
        ] as PlayerActivityEvent[],
        aiCharts: [
            {
                title: "Динамика LTV",
                type: "area",
                icon: Euro,
                data: [ { date: "Jan", value: 150 }, { date: "Feb", value: 280 }, { date: "Mar", value: 420 }, { date: "Apr", value: 510 }, { date: "May", value: 850 }, { date: "Jun", value: 1100 }, { date: "Jul", value: 1250 } ]
            },
            {
                title: "Частота сессий",
                type: "bar",
                icon: Users,
                data: [ { date: "Mon", value: 2 }, { date: "Tue", value: 3 }, { date: "Wed", value: 1 }, { date: "Thu", value: 4 }, { date: "Fri", value: 5 }, { date: "Sat", value: 8 }, { date: "Sun", value: 3 } ]
            }
        ]
    };
};
