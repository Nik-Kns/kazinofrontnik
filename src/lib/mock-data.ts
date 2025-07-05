import type { KpiCardData, ScenarioData, ChartData, RiskData } from "@/lib/types";
import type { LucideIcon } from "lucide-react";
import {
  Mail,
  MousePointerClick,
  Target,
  TrendingUp,
  Users,
  RefreshCw,
  Euro,
  MailWarning,
  AlertTriangle,
  Lightbulb,
  XCircle,
  BarChart,
  LineChart,
  AreaChart,
} from "lucide-react";

export const kpiData: KpiCardData[] = [
  {
    title: "Delivery Rate",
    value: "98.2%",
    change: "+0.5%",
    changeType: "increase",
    icon: "Mail",
    aiHint: "The percentage of emails successfully delivered to the recipients' mailboxes.",
  },
  {
    title: "Open Rate",
    value: "21.4%",
    change: "+3.1%",
    changeType: "increase",
    icon: "TrendingUp",
    aiHint: "The percentage of recipients who opened your email campaign.",
  },
  {
    title: "CTR",
    value: "4.8%",
    change: "-0.2%",
    changeType: "decrease",
    icon: "MousePointerClick",
    aiHint: "Click-Through Rate: The percentage of email recipients who clicked on one or more links contained in an email.",
  },
  {
    title: "Conversion Rate (CR)",
    value: "2.1%",
    change: "+0.8%",
    changeType: "increase",
    icon: "Target",
    aiHint: "The percentage of users who completed a desired action (e.g., made a deposit).",
  },
  {
    title: "D7 Retention",
    value: "15.3%",
    change: "-1.5%",
    changeType: "decrease",
    icon: "Users",
    aiHint: "The percentage of new users who returned to the app on the 7th day after their first session.",
  },
  {
    title: "Reactivation Rate",
    value: "5.7%",
    change: "+0.9%",
    changeType: "increase",
    icon: "RefreshCw",
    aiHint: "The percentage of churned users who became active again after a reactivation campaign.",
  },
  {
    title: "Revenue from CRM (€)",
    value: "€45,820",
    change: "+12.4%",
    changeType: "increase",
    icon: "Euro",
    aiHint: "Total revenue generated directly from CRM campaigns within the selected period.",
  },
  {
    title: "Unsubscribe Rate",
    value: "0.15%",
    change: "+0.02%",
    changeType: "decrease",
    icon: "MailWarning",
    aiHint: "The percentage of recipients who unsubscribed from your mailing list. Lower is better.",
  },
];

export const scenariosData: ScenarioData[] = [
  {
    name: "Welcome Chain",
    type: "Onboarding",
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
    type: "Reactivation",
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
    type: "Retention",
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
    type: "Promotion",
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
    type: "Feedback",
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

export const analyticsChartsData: { title: string; type: "line" | "area" | "bar", icon: LucideIcon, data: ChartData[] }[] = [
    {
        title: "Open Rate",
        type: "line",
        icon: LineChart,
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
        icon: LineChart,
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
        icon: LineChart,
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
        icon: AreaChart,
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
        title: "Ошибка отправки сообщений",
        date: "Обнаружено 3 июля, 18:47",
        details: "Канал: Email. Сценарий: 'VIP Retention Offer'. Описание: Вебхук не дал ответ в течение 5 секунд.",
        recommendation: "Возможно, интеграция с вашим почтовым сервисом неисправна. Проверьте статус API.",
        action: {
            text: "Проверить интеграцию",
            link: "#"
        }
    },
    {
        type: "warning",
        title: "Open Rate резко упал",
        date: "Обнаружено 4 июля, 09:21",
        details: "Сценарий: 'Reactivate Sleepers' (Push). Причина: Упала вовлечённость среди игроков сегмента 'спящие'.",
        recommendation: "Рекомендуется сократить частоту сообщений или обновить креативы.",
        action: {
            text: "Перейти к сценарию",
            link: "#"
        }
    },
    {
        type: "info",
        title: "Возможность роста ROI",
        date: "Обнаружено 2 июля, 11:03",
        details: "AI-анализ: Кампания “Welcome Chain” показала рост ROI на 35% — расширьте сегмент.",
        recommendation: "Попробуйте включить в сегмент пользователей со схожими поведенческими паттернами для увеличения охвата.",
        action: {
            text: "Расширить аудиторию",
            link: "#"
        }
    },
]
