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
  },
];

export const analyticsChartsData: { title: string; type: "line" | "area" | "bar", icon: any, data: ChartData[] }[] = [
    {
        title: "Open Rate",
        type: "line",
        icon: TrendingUp,
        data: [
            { date: "Mon", value: 22 },
            { date: "Tue", value: 21 },
            { date: "Wed", value: 24 },
            { date: "Thu", value: 23 },
            { date: "Fri", value: 25 },
            { date: "Sat", value: 26 },
            { date: "Sun", value: 24 },
        ]
    },
    {
        title: "Conversion Rate",
        type: "line",
        icon: Users,
        data: [
            { date: "Mon", value: 2.1 },
            { date: "Tue", value: 2.3 },
            { date: "Wed", value: 2.2 },
            { date: "Thu", value: 2.5 },
            { date: "Fri", value: 2.8 },
            { date: "Sat", value: 3.1 },
            { date: "Sun", value: 2.9 },
        ]
    },
    {
        title: "Churn Rate",
        type: "line",
        icon: Users,
        data: [
            { date: "Mon", value: 1.5 },
            { date: "Tue", value: 1.6 },
            { date: "Wed", value: 1.4 },
            { date: "Thu", value: 1.3 },
            { date: "Fri", value: 1.2 },
            { date: "Sat", value: 1.1 },
            { date: "Sun", value: 1.0 },
        ]
    },
    {
        title: "CRM ROI",
        type: "area",
        icon: Euro,
        data: [
            { date: "Mon", value: 150 },
            { date: "Tue", value: 180 },
            { date: "Wed", value: 220 },
            { date: "Thu", value: 210 },
            { date: "Fri", value: 250 },
            { date: "Sat", value: 280 },
            { date: "Sun", value: 300 },
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
    { id: '1', name: 'Welcome-цепочка', description: 'Серия из 3 писем для новых игроков для их активации и первого депозита.', category: 'Onboarding', performance: 5, channel: 'Email' },
    { id: '2', name: 'Реактивация "спящих"', description: 'Push-уведомление с бонусом для игроков, неактивных 30+ дней.', category: 'Reactivation', performance: 4, channel: 'Push' },
    { id: '3', name: 'Бонус для VIP-игроков', description: 'Еженедельное эксклюзивное предложение для сегмента VIP.', category: 'Retention', performance: 5, channel: 'Multi-channel' },
    { id: '4', name: 'Запрос обратной связи', description: 'In-app сообщение с просьбой оценить игру после 5 сессий.', category: 'Feedback', performance: 3, channel: 'InApp' },
    { id: '5', name: 'Напоминание о брошенном депозите', description: 'SMS-напоминание игрокам, которые начали, но не завершили процесс пополнения.', category: 'Conversion', performance: 4, channel: 'SMS' },
];

export const reportsData: ReportData[] = [
    { id: '1', name: 'Еженедельный отчет по Retention', type: 'Retention', createdAt: '2024-07-05 10:00', status: 'Готов', createdBy: 'Автоматически' },
    { id: '2', name: 'Эффективность Welcome-цепочки', type: 'Сценарий', createdAt: '2024-07-04 15:30', status: 'Готов', createdBy: 'John Doe' },
    { id: '3', name: 'Анализ сегмента VIP-игроков', type: 'Сегмент', createdAt: '2024-07-03 11:00', status: 'Готов', createdBy: 'Jane Smith' },
    { id: '4', name: 'Отчет по churn-кампаниям за Q2', type: 'Сценарий', createdAt: '2024-07-05 16:00', status: 'В процессе', createdBy: 'John Doe' },
];

export const campaignsData: CampaignData[] = [
    { id: '1', name: 'Welcome Chain', date: '2024-07-01', type: 'Email' },
    { id: '2', name: 'Summer Slots Promo', date: '2024-07-05', type: 'Promo' },
    { id: '3', name: 'Reactivation Push', date: '2024-07-08', type: 'Push' },
    { id: '4', name: 'VIP Bonus Drop', date: '2024-07-12', type: 'Email' },
    { id: '5', name: 'Weekend Tournament', date: '2024-07-19', type: 'Promo' },
    { id: '6', name: 'Feedback Request', date: '2024-07-22', type: 'Push' },
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
