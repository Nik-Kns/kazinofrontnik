"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Area, AreaChart, ScatterChart, Scatter
} from 'recharts';
import { 
  MessageSquare, Mail, Smartphone, Bell, Target, TrendingUp, TrendingDown, 
  Users, Euro, Calendar, Clock, Zap, Award, AlertTriangle, Info, 
  Filter, Download, RefreshCw, ChevronRight, ArrowUpRight, ArrowDownRight, ArrowRight,
  BarChart3, PieChart as PieChartIcon, Activity, Layers, GitBranch, GitCompare, ExternalLink,
  Send, Eye, MousePointer, DollarSign, Percent, Hash, Star, ThumbsUp, Search, Copy,
  CheckCircle, XCircle, Clock3, MessageCircle, PhoneCall, User, MapPin, Globe
} from "lucide-react";
import { cn } from "@/lib/utils";
import { ABTestCalculator } from "@/components/ab-testing/ab-test-calculator";

// Типы для детальной информации
interface MessageDetail {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  messageType: 'email' | 'sms' | 'push' | 'in-app';
  subject?: string;
  content: string;
  status: 'sent' | 'delivered' | 'opened' | 'clicked' | 'bounced' | 'failed';
  sentAt: string;
  deliveredAt?: string;
  openedAt?: string;
  clickedAt?: string;
  device?: string;
  location?: string;
  clicks?: number;
  revenue?: number;
}

// Расширяем типы существующих данных
interface CampaignDetailedMetrics {
  id: string;
  name: string;
  type: string;
  segment: string;
  sent: number;
  delivered: number;
  opened: number;
  clicked: number;
  converted: number;
  revenue: number;
  ggr: number;
  roi: number;
  openRate: number;
  ctr: number;
  conversionRate: number;
  ctaConversion: number;
  goalAchievement: number;
  trend: string;
  performance: number;
  // Детальные данные
  startDate: string;
  endDate: string;
  status: 'active' | 'paused' | 'completed';
  messages: MessageDetail[];
  channelStats: {
    email: { sent: number; opened: number; clicked: number; converted: number };
    sms: { sent: number; opened: number; clicked: number; converted: number };
    push: { sent: number; opened: number; clicked: number; converted: number };
  };
  timelineData: { date: string; sent: number; opened: number; clicked: number; revenue: number }[];
  segments: { name: string; users: number; conversion: number }[];
}

// Генерируем детальные данные сообщений
const generateMessageDetails = (campaignId: string, count: number): MessageDetail[] => {
  const statuses: MessageDetail['status'][] = ['sent', 'delivered', 'opened', 'clicked', 'bounced', 'failed'];
  const types: MessageDetail['messageType'][] = ['email', 'sms', 'push'];
  const devices = ['iPhone 14', 'Samsung Galaxy S23', 'Desktop Chrome', 'iPad Pro', 'Android'];
  const locations = ['Москва', 'Санкт-Петербург', 'Казань', 'Новосибирск', 'Екатеринбург'];
  
  return Array.from({ length: count }, (_, i) => ({
    id: `msg-${campaignId}-${i}`,
    userId: `user-${1000 + i}`,
    userName: `User ${1000 + i}`,
    userEmail: `user${1000 + i}@example.com`,
    messageType: types[Math.floor(Math.random() * types.length)],
    subject: 'Специальное предложение для вас!',
    content: 'Получите бонус 100% на первый депозит. Максимальная сумма бонуса €500.',
    status: statuses[Math.min(i, statuses.length - 1)],
    sentAt: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(),
    deliveredAt: i > 0 ? new Date(Date.now() - Math.random() * 6 * 24 * 60 * 60 * 1000).toISOString() : undefined,
    openedAt: i > 1 ? new Date(Date.now() - Math.random() * 5 * 24 * 60 * 60 * 1000).toISOString() : undefined,
    clickedAt: i > 2 ? new Date(Date.now() - Math.random() * 4 * 24 * 60 * 60 * 1000).toISOString() : undefined,
    device: devices[Math.floor(Math.random() * devices.length)],
    location: locations[Math.floor(Math.random() * locations.length)],
    clicks: Math.floor(Math.random() * 5),
    revenue: Math.random() > 0.7 ? Math.floor(Math.random() * 500) : 0,
  }));
};

// Моковые данные для метрик по кампаниям (расширенные)
const campaignMetrics: CampaignDetailedMetrics[] = [
  {
    id: '1',
    name: 'Welcome Series',
    type: 'Email',
    segment: 'Новички',
    sent: 15420,
    delivered: 15100,
    opened: 8765,
    clicked: 2341,
    converted: 456,
    revenue: 125400,
    ggr: 87500,
    roi: 245,
    openRate: 58,
    ctr: 26.7,
    conversionRate: 3.0,
    ctaConversion: 42.3,
    goalAchievement: 92,
    trend: 'up',
    performance: 92,
    startDate: '2024-01-01',
    endDate: '2024-01-31',
    status: 'completed',
    messages: generateMessageDetails('1', 20),
    channelStats: {
      email: { sent: 10000, opened: 5800, clicked: 1500, converted: 300 },
      sms: { sent: 3420, opened: 2000, clicked: 600, converted: 100 },
      push: { sent: 2000, opened: 965, clicked: 241, converted: 56 }
    },
    timelineData: [
      { date: '01.01', sent: 2000, opened: 1160, clicked: 300, revenue: 15000 },
      { date: '05.01', sent: 3000, opened: 1740, clicked: 450, revenue: 22500 },
      { date: '10.01', sent: 2500, opened: 1450, clicked: 375, revenue: 18750 },
      { date: '15.01', sent: 2800, opened: 1624, clicked: 420, revenue: 21000 },
      { date: '20.01', sent: 2620, opened: 1520, clicked: 393, revenue: 19650 },
      { date: '25.01', sent: 2500, opened: 1450, clicked: 375, revenue: 18750 },
      { date: '30.01', sent: 0, opened: 821, clicked: 28, revenue: 9750 }
    ],
    segments: [
      { name: 'Мужчины 18-25', users: 5420, conversion: 3.2 },
      { name: 'Женщины 18-25', users: 4200, conversion: 2.8 },
      { name: 'Мужчины 26-35', users: 3800, conversion: 3.5 },
      { name: 'Женщины 26-35', users: 2000, conversion: 2.1 }
    ]
  },
  {
    id: '2',
    name: 'VIP Retention',
    type: 'Multi-channel',
    segment: 'VIP',
    sent: 3200,
    delivered: 3180,
    opened: 2450,
    clicked: 1120,
    converted: 320,
    revenue: 450000,
    ggr: 315000,
    roi: 520,
    openRate: 77,
    ctr: 45.7,
    conversionRate: 10.1,
    ctaConversion: 61.4,
    goalAchievement: 98,
    trend: 'up',
    performance: 98,
    startDate: '2024-01-15',
    endDate: '2024-02-15',
    status: 'active',
    messages: generateMessageDetails('2', 15),
    channelStats: {
      email: { sent: 1600, opened: 1232, clicked: 560, converted: 160 },
      sms: { sent: 800, opened: 616, clicked: 280, converted: 80 },
      push: { sent: 800, opened: 602, clicked: 280, converted: 80 }
    },
    timelineData: [
      { date: '15.01', sent: 500, opened: 385, clicked: 175, revenue: 70000 },
      { date: '20.01', sent: 600, opened: 462, clicked: 210, revenue: 84000 },
      { date: '25.01', sent: 550, opened: 424, clicked: 193, revenue: 77000 },
      { date: '01.02', sent: 650, opened: 500, clicked: 228, revenue: 91000 },
      { date: '05.02', sent: 450, opened: 347, clicked: 158, revenue: 63000 },
      { date: '10.02', sent: 450, opened: 332, clicked: 156, revenue: 65000 }
    ],
    segments: [
      { name: 'Platinum VIP', users: 800, conversion: 12.5 },
      { name: 'Gold VIP', users: 1200, conversion: 10.8 },
      { name: 'Silver VIP', users: 1200, conversion: 8.3 }
    ]
  },
  {
    id: '3',
    name: 'Реактивация 30 дней',
    type: 'Push',
    segment: 'Спящие',
    sent: 8900,
    delivered: 7500,
    opened: 2100,
    clicked: 450,
    converted: 89,
    revenue: 15600,
    ggr: 10920,
    roi: 120,
    openRate: 28,
    ctr: 21.4,
    conversionRate: 1.2,
    ctaConversion: 19.8,
    goalAchievement: 65,
    trend: 'down',
    performance: 65,
    startDate: '2024-02-01',
    endDate: '2024-02-28',
    status: 'completed',
    messages: generateMessageDetails('3', 25),
    channelStats: {
      email: { sent: 0, opened: 0, clicked: 0, converted: 0 },
      sms: { sent: 0, opened: 0, clicked: 0, converted: 0 },
      push: { sent: 8900, opened: 2100, clicked: 450, converted: 89 }
    },
    timelineData: [
      { date: '01.02', sent: 2000, opened: 560, clicked: 120, revenue: 3900 },
      { date: '07.02', sent: 1800, opened: 504, clicked: 108, revenue: 3510 },
      { date: '14.02', sent: 2100, opened: 588, clicked: 126, revenue: 4095 },
      { date: '21.02', sent: 1500, opened: 420, clicked: 90, revenue: 2925 },
      { date: '28.02', sent: 1500, opened: 28, clicked: 6, revenue: 1170 }
    ],
    segments: [
      { name: 'Неактивные 30 дней', users: 4000, conversion: 1.5 },
      { name: 'Неактивные 60 дней', users: 3000, conversion: 1.0 },
      { name: 'Неактивные 90+ дней', users: 1900, conversion: 0.5 }
    ]
  },
  {
    id: '4',
    name: 'Персональные предложения',
    type: 'SMS',
    segment: 'Лояльные',
    sent: 5420,
    delivered: 5380,
    opened: 4304,
    clicked: 1721,
    converted: 344,
    revenue: 67800,
    ggr: 47460,
    roi: 310,
    openRate: 80,
    ctr: 40,
    conversionRate: 6.4,
    ctaConversion: 20.0,
    goalAchievement: 85,
    trend: 'up',
    performance: 85,
    startDate: '2024-01-20',
    endDate: '2024-02-20',
    status: 'active',
    messages: generateMessageDetails('4', 18),
    channelStats: {
      email: { sent: 0, opened: 0, clicked: 0, converted: 0 },
      sms: { sent: 5420, opened: 4304, clicked: 1721, converted: 344 },
      push: { sent: 0, opened: 0, clicked: 0, converted: 0 }
    },
    timelineData: [
      { date: '20.01', sent: 1000, opened: 800, clicked: 320, revenue: 12600 },
      { date: '27.01', sent: 1200, opened: 960, clicked: 384, revenue: 15120 },
      { date: '03.02', sent: 1100, opened: 880, clicked: 352, revenue: 13860 },
      { date: '10.02', sent: 1120, opened: 896, clicked: 358, revenue: 14112 },
      { date: '17.02', sent: 1000, opened: 768, clicked: 307, revenue: 12108 }
    ],
    segments: [
      { name: 'Активные ежедневно', users: 2000, conversion: 8.5 },
      { name: 'Активные еженедельно', users: 2420, conversion: 5.8 },
      { name: 'Активные ежемесячно', users: 1000, conversion: 4.2 }
    ]
  },
  {
    id: '5',
    name: 'Flash Sale Weekend',
    type: 'Email',
    segment: 'Активные',
    sent: 12500,
    delivered: 12200,
    opened: 7320,
    clicked: 2196,
    converted: 549,
    revenue: 98200,
    ggr: 68740,
    roi: 280,
    openRate: 60,
    ctr: 30,
    conversionRate: 4.5,
    ctaConversion: 25.0,
    goalAchievement: 78,
    trend: 'up',
    performance: 78,
    startDate: '2024-02-10',
    endDate: '2024-02-12',
    status: 'completed',
    messages: generateMessageDetails('5', 30),
    channelStats: {
      email: { sent: 12500, opened: 7320, clicked: 2196, converted: 549 },
      sms: { sent: 0, opened: 0, clicked: 0, converted: 0 },
      push: { sent: 0, opened: 0, clicked: 0, converted: 0 }
    },
    timelineData: [
      { date: '10.02', sent: 4000, opened: 2400, clicked: 720, revenue: 32100 },
      { date: '11.02', sent: 4500, opened: 2700, clicked: 810, revenue: 36150 },
      { date: '12.02', sent: 4000, opened: 2220, clicked: 666, revenue: 29950 }
    ],
    segments: [
      { name: 'Хайроллеры', users: 2500, conversion: 6.8 },
      { name: 'Средние игроки', users: 5000, conversion: 4.5 },
      { name: 'Лоуроллеры', users: 5000, conversion: 3.2 }
    ]
  },
  {
    id: '6',
    name: 'Birthday Bonus',
    type: 'Multi-channel',
    segment: 'Все',
    sent: 1820,
    delivered: 1810,
    opened: 1629,
    clicked: 1302,
    converted: 912,
    revenue: 45600,
    ggr: 31920,
    roi: 420,
    openRate: 90,
    ctr: 80,
    conversionRate: 50.4,
    ctaConversion: 70.0,
    goalAchievement: 110,
    trend: 'up',
    performance: 96,
    startDate: '2024-01-01',
    endDate: '2024-02-29',
    status: 'active',
    messages: generateMessageDetails('6', 10),
    channelStats: {
      email: { sent: 910, opened: 819, clicked: 655, converted: 458 },
      sms: { sent: 455, opened: 410, clicked: 328, converted: 229 },
      push: { sent: 455, opened: 400, clicked: 319, converted: 225 }
    },
    timelineData: [
      { date: 'Янв', sent: 900, opened: 810, clicked: 648, revenue: 22680 },
      { date: 'Фев', sent: 920, opened: 819, clicked: 654, revenue: 22920 }
    ],
    segments: [
      { name: 'Именинники', users: 1820, conversion: 50.4 }
    ]
  }
];

// Данные по триггерам (расширенные)
interface TriggerDetailedMetrics {
  id: string;
  name: string;
  event: string;
  activations: number;
  conversions: number;
  revenue: number;
  avgResponseTime: string;
  effectiveness: number;
  status: string;
  messages: MessageDetail[];
  dailyActivations: { date: string; count: number }[];
  conversionFunnel: { stage: string; users: number }[];
}

const triggerMetrics: TriggerDetailedMetrics[] = [
  {
    id: '1',
    name: 'Первый депозит',
    event: 'first_deposit',
    activations: 4520,
    conversions: 2260,
    revenue: 125000,
    avgResponseTime: '2 мин',
    effectiveness: 95,
    status: 'active',
    messages: generateMessageDetails('t1', 12),
    dailyActivations: [
      { date: '01.02', count: 645 },
      { date: '02.02', count: 720 },
      { date: '03.02', count: 580 },
      { date: '04.02', count: 695 },
      { date: '05.02', count: 710 },
      { date: '06.02', count: 625 },
      { date: '07.02', count: 545 }
    ],
    conversionFunnel: [
      { stage: 'Триггер сработал', users: 4520 },
      { stage: 'Сообщение отправлено', users: 4500 },
      { stage: 'Сообщение открыто', users: 3600 },
      { stage: 'Переход по ссылке', users: 2700 },
      { stage: 'Конверсия', users: 2260 }
    ]
  },
  {
    id: '2',
    name: 'Большой выигрыш',
    event: 'big_win',
    activations: 890,
    conversions: 445,
    revenue: 78000,
    avgResponseTime: '30 сек',
    effectiveness: 88,
    status: 'active',
    messages: generateMessageDetails('t2', 8),
    dailyActivations: [
      { date: '01.02', count: 127 },
      { date: '02.02', count: 142 },
      { date: '03.02', count: 115 },
      { date: '04.02', count: 138 },
      { date: '05.02', count: 141 },
      { date: '06.02', count: 124 },
      { date: '07.02', count: 103 }
    ],
    conversionFunnel: [
      { stage: 'Триггер сработал', users: 890 },
      { stage: 'Сообщение отправлено', users: 885 },
      { stage: 'Сообщение открыто', users: 750 },
      { stage: 'Переход по ссылке', users: 580 },
      { stage: 'Конверсия', users: 445 }
    ]
  },
  {
    id: '3',
    name: 'Предотток 7 дней',
    event: 'pre_churn_7d',
    activations: 3200,
    conversions: 960,
    revenue: 45000,
    avgResponseTime: '1 час',
    effectiveness: 72,
    status: 'active',
    messages: generateMessageDetails('t3', 15),
    dailyActivations: [
      { date: '01.02', count: 457 },
      { date: '02.02', count: 512 },
      { date: '03.02', count: 410 },
      { date: '04.02', count: 492 },
      { date: '05.02', count: 503 },
      { date: '06.02', count: 442 },
      { date: '07.02', count: 384 }
    ],
    conversionFunnel: [
      { stage: 'Триггер сработал', users: 3200 },
      { stage: 'Сообщение отправлено', users: 3150 },
      { stage: 'Сообщение открыто', users: 1800 },
      { stage: 'Переход по ссылке', users: 1200 },
      { stage: 'Конверсия', users: 960 }
    ]
  }
];

// Шаблоны и их эффективность (расширенные)
interface TemplateDetailedMetrics {
  id: string;
  name: string;
  type: string;
  usage: number;
  avgOpenRate: number;
  avgCtr: number;
  avgConversion: number;
  rating: number;
  lastUpdated: string;
  messages: MessageDetail[];
  performanceBySegment: { segment: string; openRate: number; ctr: number; conversion: number }[];
  versions: { version: string; date: string; changes: string; performance: number }[];
}

const templateMetrics: TemplateDetailedMetrics[] = [
  {
    id: '1',
    name: 'Welcome Email v2',
    type: 'Email',
    usage: 15420,
    avgOpenRate: 58,
    avgCtr: 26.7,
    avgConversion: 3.0,
    rating: 4.8,
    lastUpdated: '2024-01-15',
    messages: generateMessageDetails('tmpl1', 5),
    performanceBySegment: [
      { segment: 'Новички', openRate: 62, ctr: 28, conversion: 3.5 },
      { segment: 'Реактивация', openRate: 55, ctr: 25, conversion: 2.8 },
      { segment: 'VIP', openRate: 58, ctr: 26, conversion: 2.7 }
    ],
    versions: [
      { version: 'v2.1', date: '2024-01-15', changes: 'Обновлен заголовок', performance: 105 },
      { version: 'v2.0', date: '2024-01-01', changes: 'Новый дизайн', performance: 98 },
      { version: 'v1.0', date: '2023-12-01', changes: 'Первая версия', performance: 85 }
    ]
  },
  {
    id: '2',
    name: 'VIP Birthday',
    type: 'Email',
    usage: 890,
    avgOpenRate: 82,
    avgCtr: 45.2,
    avgConversion: 12.5,
    rating: 4.9,
    lastUpdated: '2024-01-10',
    messages: generateMessageDetails('tmpl2', 3),
    performanceBySegment: [
      { segment: 'Platinum VIP', openRate: 88, ctr: 52, conversion: 15.2 },
      { segment: 'Gold VIP', openRate: 82, ctr: 45, conversion: 12.8 },
      { segment: 'Silver VIP', openRate: 78, ctr: 40, conversion: 10.5 }
    ],
    versions: [
      { version: 'v1.2', date: '2024-01-10', changes: 'Добавлена персонализация', performance: 112 },
      { version: 'v1.1', date: '2023-12-15', changes: 'Улучшен CTA', performance: 102 },
      { version: 'v1.0', date: '2023-11-01', changes: 'Первая версия', performance: 90 }
    ]
  },
  {
    id: '3',
    name: 'Cashback Push',
    type: 'Push',
    usage: 8900,
    avgOpenRate: 35,
    avgCtr: 18.3,
    avgConversion: 2.1,
    rating: 4.2,
    lastUpdated: '2024-01-12',
    messages: generateMessageDetails('tmpl3', 7),
    performanceBySegment: [
      { segment: 'Активные', openRate: 42, ctr: 22, conversion: 2.8 },
      { segment: 'Средние', openRate: 35, ctr: 18, conversion: 2.1 },
      { segment: 'Спящие', openRate: 28, ctr: 15, conversion: 1.5 }
    ],
    versions: [
      { version: 'v2.0', date: '2024-01-12', changes: 'Новый формат уведомления', performance: 95 },
      { version: 'v1.5', date: '2023-12-20', changes: 'Оптимизация текста', performance: 88 },
      { version: 'v1.0', date: '2023-10-01', changes: 'Первая версия', performance: 80 }
    ]
  }
];

// Лучшие комбинации сегмент + коммуникация
const bestCombinations = [
  {
    segment: 'VIP',
    communication: 'Персональный менеджер',
    channel: 'Email + Call',
    effectiveness: 98,
    revenue: 1250000,
    ltv: 5000,
    retention: 85
  },
  {
    segment: 'Новички',
    communication: 'Welcome Series',
    channel: 'Email',
    effectiveness: 92,
    revenue: 450000,
    ltv: 350,
    retention: 45
  },
  {
    segment: 'Хайроллеры',
    communication: 'Эксклюзивные турниры',
    channel: 'Multi-channel',
    effectiveness: 95,
    revenue: 2100000,
    ltv: 12000,
    retention: 78
  },
  {
    segment: 'Предотток',
    communication: 'Win-back кампания',
    channel: 'Email + Push',
    effectiveness: 75,
    revenue: 125000,
    ltv: 180,
    retention: 32
  }
];

// Данные для графика производительности каналов
const channelPerformance = [
  { channel: 'Email', openRate: 45, ctr: 22, conversion: 3.5, roi: 250 },
  { channel: 'Push', openRate: 28, ctr: 15, conversion: 2.1, roi: 180 },
  { channel: 'SMS', openRate: 92, ctr: 35, conversion: 4.2, roi: 320 },
  { channel: 'In-App', openRate: 65, ctr: 42, conversion: 5.8, roi: 410 },
  { channel: 'WhatsApp', openRate: 78, ctr: 38, conversion: 4.5, roi: 380 }
];

// Временные метрики
const timeMetrics = [
  { hour: '00:00', emails: 120, push: 45, sms: 10, conversions: 12 },
  { hour: '06:00', emails: 340, push: 120, sms: 25, conversions: 28 },
  { hour: '12:00', emails: 890, push: 450, sms: 120, conversions: 95 },
  { hour: '18:00', emails: 1250, push: 680, sms: 180, conversions: 145 },
  { hour: '21:00', emails: 980, push: 520, sms: 150, conversions: 125 }
];

export default function CommunicationAnalyticsPage() {
  const [selectedPeriod, setSelectedPeriod] = useState('7d');
  const [selectedChannel, setSelectedChannel] = useState('all');
  const [selectedSegment, setSelectedSegment] = useState('all');
  const [activeTab, setActiveTab] = useState('overview');
  const [isCompareModalOpen, setIsCompareModalOpen] = useState(false);
  const [selectedCampaigns, setSelectedCampaigns] = useState<string[]>([]);
  const [showComparison, setShowComparison] = useState(false);
  
  // Новые состояния для детальных модальных окон
  const [selectedCampaign, setSelectedCampaign] = useState<CampaignDetailedMetrics | null>(null);
  const [selectedTrigger, setSelectedTrigger] = useState<TriggerDetailedMetrics | null>(null);
  const [selectedTemplate, setSelectedTemplate] = useState<TemplateDetailedMetrics | null>(null);
  const [messageSearchQuery, setMessageSearchQuery] = useState('');
  const [messageStatusFilter, setMessageStatusFilter] = useState<string>('all');
  const [showABTestCalculator, setShowABTestCalculator] = useState(false);

  const getPerformanceColor = (value: number) => {
    if (value >= 90) return 'text-green-600';
    if (value >= 70) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getPerformanceBadge = (value: number) => {
    if (value >= 90) return { label: 'Отлично', color: 'bg-green-100 text-green-800' };
    if (value >= 70) return { label: 'Хорошо', color: 'bg-yellow-100 text-yellow-800' };
    return { label: 'Требует внимания', color: 'bg-red-100 text-red-800' };
  };

  const getStatusIcon = (status: MessageDetail['status']) => {
    switch (status) {
      case 'sent': return <Send className="h-4 w-4 text-blue-500" />;
      case 'delivered': return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'opened': return <Eye className="h-4 w-4 text-purple-500" />;
      case 'clicked': return <MousePointer className="h-4 w-4 text-orange-500" />;
      case 'bounced': return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      case 'failed': return <XCircle className="h-4 w-4 text-red-500" />;
      default: return null;
    }
  };

  const getMessageTypeIcon = (type: MessageDetail['messageType']) => {
    switch (type) {
      case 'email': return <Mail className="h-4 w-4" />;
      case 'sms': return <MessageCircle className="h-4 w-4" />;
      case 'push': return <Bell className="h-4 w-4" />;
      case 'in-app': return <Smartphone className="h-4 w-4" />;
      default: return null;
    }
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleString('ru-RU', {
      day: '2-digit',
      month: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Анализ коммуникаций</h1>
          <p className="text-muted-foreground mt-1">
            Эффективность кампаний, триггеров и комбинаций сегмент + коммуникация
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => setShowABTestCalculator(true)}
            className="gap-2 bg-gradient-to-r from-purple-50 to-blue-50 border-purple-200"
          >
            <Target className="h-4 w-4" />
            A/B тест
          </Button>
          <Button
            variant="outline"
            onClick={() => setIsCompareModalOpen(true)}
            className="gap-2"
          >
            <GitCompare className="h-4 w-4" />
            Сравнить кампании
          </Button>
          <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Период" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1d">Последние 24 часа</SelectItem>
              <SelectItem value="7d">Последние 7 дней</SelectItem>
              <SelectItem value="30d">Последние 30 дней</SelectItem>
              <SelectItem value="90d">Последние 90 дней</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline">
            <RefreshCw className="mr-2 h-4 w-4" />
            Обновить
          </Button>
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Экспорт
          </Button>
        </div>
      </div>

      {/* Key Metrics Summary */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Отправлено</CardTitle>
            <Send className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">127,420</div>
            <div className="flex items-center text-xs text-muted-foreground">
              <TrendingUp className="mr-1 h-3 w-3 text-green-600" />
              <span className="text-green-600">+12%</span> vs прошлый период
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Open Rate</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">42.8%</div>
            <div className="flex items-center text-xs text-muted-foreground">
              <TrendingUp className="mr-1 h-3 w-3 text-green-600" />
              <span className="text-green-600">+3.2%</span> улучшение
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">CTR</CardTitle>
            <MousePointer className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">18.5%</div>
            <div className="flex items-center text-xs text-muted-foreground">
              <TrendingDown className="mr-1 h-3 w-3 text-red-600" />
              <span className="text-red-600">-1.2%</span> снижение
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Конверсия</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3.8%</div>
            <div className="flex items-center text-xs text-muted-foreground">
              <TrendingUp className="mr-1 h-3 w-3 text-green-600" />
              <span className="text-green-600">+0.5%</span> рост
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Обзор</TabsTrigger>
          <TabsTrigger value="campaigns">Кампании</TabsTrigger>
          <TabsTrigger value="triggers">Триггеры</TabsTrigger>
          <TabsTrigger value="templates">Шаблоны</TabsTrigger>
          <TabsTrigger value="combinations">Комбинации</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            {/* Channel Performance */}
            <Card>
              <CardHeader>
                <CardTitle>Эффективность каналов</CardTitle>
                <CardDescription>
                  Сравнение метрик по каналам коммуникации
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <RadarChart data={channelPerformance}>
                    <PolarGrid strokeDasharray="3 3" />
                    <PolarAngleAxis dataKey="channel" />
                    <PolarRadiusAxis angle={90} domain={[0, 100]} />
                    <Radar name="Open Rate" dataKey="openRate" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.3} />
                    <Radar name="CTR" dataKey="ctr" stroke="#10b981" fill="#10b981" fillOpacity={0.3} />
                    <Tooltip />
                    <Legend />
                  </RadarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Time Distribution */}
            <Card>
              <CardHeader>
                <CardTitle>Распределение по времени</CardTitle>
                <CardDescription>
                  Активность отправок и конверсий по часам
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={timeMetrics}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="hour" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Area type="monotone" dataKey="emails" stackId="1" stroke="#3b82f6" fill="#3b82f6" />
                    <Area type="monotone" dataKey="push" stackId="1" stroke="#10b981" fill="#10b981" />
                    <Area type="monotone" dataKey="sms" stackId="1" stroke="#f59e0b" fill="#f59e0b" />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* Top Performing Campaigns */}
          <Card>
            <CardHeader>
              <CardTitle>Топ кампаний по эффективности</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {campaignMetrics.slice(0, 3).map((campaign) => (
                  <div 
                    key={campaign.id} 
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent/50 cursor-pointer transition-colors"
                    onClick={() => setSelectedCampaign(campaign)}
                  >
                    <div className="flex items-center gap-4">
                      <div className={cn(
                        "w-16 h-16 rounded-lg flex flex-col items-center justify-center",
                        campaign.goalAchievement >= 90 ? "bg-green-100" : 
                        campaign.goalAchievement >= 70 ? "bg-yellow-100" : "bg-red-100"
                      )}>
                        <span className="font-bold text-lg">{campaign.goalAchievement}%</span>
                        <span className="text-xs">цели</span>
                      </div>
                      <div>
                        <h4 className="font-semibold">{campaign.name}</h4>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Badge variant="outline">{campaign.type}</Badge>
                          <span>•</span>
                          <span>{campaign.segment}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-center">
                        <div className="text-sm text-muted-foreground">GGR</div>
                        <div className="font-semibold">€{campaign.ggr.toLocaleString()}</div>
                      </div>
                      <div className="text-center">
                        <div className="text-sm text-muted-foreground">CR в CTA</div>
                        <div className="font-semibold">{campaign.ctaConversion}%</div>
                      </div>
                      <Button variant="ghost" size="sm" className="gap-1">
                        <ExternalLink className="h-3 w-3" />
                        Детали
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Campaigns Tab */}
        <TabsContent value="campaigns" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Метрики по кампаниям</CardTitle>
                  <CardDescription>
                    Детальная статистика по всем активным кампаниям
                  </CardDescription>
                </div>
                <div className="flex gap-2">
                  <Select value={selectedChannel} onValueChange={setSelectedChannel}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Канал" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Все каналы</SelectItem>
                      <SelectItem value="email">Email</SelectItem>
                      <SelectItem value="push">Push</SelectItem>
                      <SelectItem value="sms">SMS</SelectItem>
                      <SelectItem value="multi">Multi-channel</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Кампания</TableHead>
                    <TableHead>Тип</TableHead>
                    <TableHead>Сегмент</TableHead>
                    <TableHead className="text-right">Отправлено</TableHead>
                    <TableHead className="text-right">Open Rate</TableHead>
                    <TableHead className="text-right">CTR</TableHead>
                    <TableHead className="text-right">CR</TableHead>
                    <TableHead className="text-right">Revenue</TableHead>
                    <TableHead className="text-right">ROI</TableHead>
                    <TableHead>Статус</TableHead>
                    <TableHead></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {campaignMetrics.map((campaign) => (
                    <TableRow 
                      key={campaign.id} 
                      className="cursor-pointer hover:bg-accent/50"
                      onClick={() => setSelectedCampaign(campaign)}
                    >
                      <TableCell className="font-medium">{campaign.name}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{campaign.type}</Badge>
                      </TableCell>
                      <TableCell>{campaign.segment}</TableCell>
                      <TableCell className="text-right">{campaign.sent.toLocaleString()}</TableCell>
                      <TableCell className="text-right">{campaign.openRate}%</TableCell>
                      <TableCell className="text-right">{campaign.ctr}%</TableCell>
                      <TableCell className="text-right">{campaign.conversionRate}%</TableCell>
                      <TableCell className="text-right">€{campaign.revenue.toLocaleString()}</TableCell>
                      <TableCell className="text-right font-semibold text-green-600">
                        {campaign.roi}%
                      </TableCell>
                      <TableCell>
                        <Badge className={getPerformanceBadge(campaign.performance).color}>
                          {getPerformanceBadge(campaign.performance).label}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Button variant="ghost" size="sm">
                          <ChevronRight className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {/* Campaign Performance Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Динамика показателей кампаний</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={[
                  { day: 'Пн', sent: 18000, opened: 7200, clicked: 1800, converted: 360 },
                  { day: 'Вт', sent: 22000, opened: 9900, clicked: 2640, converted: 528 },
                  { day: 'Ср', sent: 25000, opened: 11250, clicked: 3375, converted: 675 },
                  { day: 'Чт', sent: 21000, opened: 8820, clicked: 2520, converted: 504 },
                  { day: 'Пт', sent: 28000, opened: 13440, clicked: 4032, converted: 806 },
                  { day: 'Сб', sent: 32000, opened: 16000, clicked: 5120, converted: 1024 },
                  { day: 'Вс', sent: 30000, opened: 14400, clicked: 4320, converted: 864 }
                ]}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="day" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="sent" stroke="#94a3b8" name="Отправлено" />
                  <Line type="monotone" dataKey="opened" stroke="#3b82f6" name="Открыто" />
                  <Line type="monotone" dataKey="clicked" stroke="#10b981" name="Клики" />
                  <Line type="monotone" dataKey="converted" stroke="#f59e0b" name="Конверсии" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Triggers Tab */}
        <TabsContent value="triggers" className="space-y-6">
          <div className="grid gap-4 md:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Активные триггеры</CardTitle>
                <Zap className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">24</div>
                <p className="text-xs text-muted-foreground">
                  Из них 18 показывают рост
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Срабатываний за период</CardTitle>
                <Activity className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">8,610</div>
                <p className="text-xs text-muted-foreground">
                  +23% к прошлому периоду
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Средняя конверсия</CardTitle>
                <Percent className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">42%</div>
                <p className="text-xs text-muted-foreground">
                  Лучший результат за квартал
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Revenue от триггеров</CardTitle>
                <Euro className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">€248K</div>
                <p className="text-xs text-muted-foreground">
                  35% от общего revenue
                </p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Эффективность триггеров</CardTitle>
              <CardDescription>
                Метрики по всем активным триггерным коммуникациям
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Триггер</TableHead>
                    <TableHead>Событие</TableHead>
                    <TableHead className="text-right">Активаций</TableHead>
                    <TableHead className="text-right">Конверсий</TableHead>
                    <TableHead className="text-right">CR %</TableHead>
                    <TableHead className="text-right">Revenue</TableHead>
                    <TableHead>Время отклика</TableHead>
                    <TableHead>Эффективность</TableHead>
                    <TableHead></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {triggerMetrics.map((trigger) => (
                    <TableRow 
                      key={trigger.id}
                      className="cursor-pointer hover:bg-accent/50"
                      onClick={() => setSelectedTrigger(trigger)}
                    >
                      <TableCell className="font-medium">{trigger.name}</TableCell>
                      <TableCell>
                        <code className="text-xs bg-muted px-1 py-0.5 rounded">
                          {trigger.event}
                        </code>
                      </TableCell>
                      <TableCell className="text-right">{trigger.activations.toLocaleString()}</TableCell>
                      <TableCell className="text-right">{trigger.conversions.toLocaleString()}</TableCell>
                      <TableCell className="text-right">
                        {((trigger.conversions / trigger.activations) * 100).toFixed(1)}%
                      </TableCell>
                      <TableCell className="text-right">€{trigger.revenue.toLocaleString()}</TableCell>
                      <TableCell>{trigger.avgResponseTime}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Progress value={trigger.effectiveness} className="w-[60px]" />
                          <span className="text-sm font-medium">{trigger.effectiveness}%</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Button variant="ghost" size="sm">
                          <ChevronRight className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {/* Trigger Timeline */}
          <Card>
            <CardHeader>
              <CardTitle>Временная шкала срабатываний</CardTitle>
              <CardDescription>
                Распределение триггерных событий по времени
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={[
                  { time: '00:00', triggers: 45 },
                  { time: '04:00', triggers: 28 },
                  { time: '08:00', triggers: 120 },
                  { time: '12:00', triggers: 280 },
                  { time: '16:00', triggers: 195 },
                  { time: '20:00', triggers: 340 },
                  { time: '23:00', triggers: 210 }
                ]}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="time" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="triggers" fill="#3b82f6" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Templates Tab */}
        <TabsContent value="templates" className="space-y-6">
          <div className="grid gap-4 md:grid-cols-3">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Всего шаблонов</CardTitle>
                <Mail className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">42</div>
                <p className="text-xs text-muted-foreground">
                  12 новых за месяц
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Средний рейтинг</CardTitle>
                <Star className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">4.6/5.0</div>
                <p className="text-xs text-muted-foreground">
                  На основе 1,234 использований
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Топ шаблон</CardTitle>
                <Award className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-lg font-bold">VIP Birthday</div>
                <p className="text-xs text-muted-foreground">
                  82% open rate, 12.5% CR
                </p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Эффективность шаблонов</CardTitle>
              <CardDescription>
                Статистика использования и результативности шаблонов коммуникаций
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Название шаблона</TableHead>
                    <TableHead>Тип</TableHead>
                    <TableHead className="text-right">Использований</TableHead>
                    <TableHead className="text-right">Avg Open Rate</TableHead>
                    <TableHead className="text-right">Avg CTR</TableHead>
                    <TableHead className="text-right">Avg CR</TableHead>
                    <TableHead>Рейтинг</TableHead>
                    <TableHead>Обновлен</TableHead>
                    <TableHead></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {templateMetrics.map((template) => (
                    <TableRow 
                      key={template.id}
                      className="cursor-pointer hover:bg-accent/50"
                      onClick={() => setSelectedTemplate(template)}
                    >
                      <TableCell className="font-medium">{template.name}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{template.type}</Badge>
                      </TableCell>
                      <TableCell className="text-right">{template.usage.toLocaleString()}</TableCell>
                      <TableCell className="text-right">{template.avgOpenRate}%</TableCell>
                      <TableCell className="text-right">{template.avgCtr}%</TableCell>
                      <TableCell className="text-right">{template.avgConversion}%</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                          <span className="font-medium">{template.rating}</span>
                        </div>
                      </TableCell>
                      <TableCell>{template.lastUpdated}</TableCell>
                      <TableCell>
                        <Button variant="ghost" size="sm">
                          <ChevronRight className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {/* Template Performance Distribution */}
          <Card>
            <CardHeader>
              <CardTitle>Распределение эффективности</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <ScatterChart>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="openRate" name="Open Rate" unit="%" />
                  <YAxis dataKey="conversion" name="Conversion" unit="%" />
                  <Tooltip cursor={{ strokeDasharray: '3 3' }} />
                  <Scatter 
                    name="Шаблоны" 
                    data={[
                      { openRate: 58, conversion: 3.0, name: 'Welcome Email v2' },
                      { openRate: 82, conversion: 12.5, name: 'VIP Birthday' },
                      { openRate: 35, conversion: 2.1, name: 'Cashback Push' },
                      { openRate: 65, conversion: 5.5, name: 'Weekend Bonus' },
                      { openRate: 45, conversion: 3.8, name: 'Retention Alert' }
                    ]} 
                    fill="#3b82f6"
                  />
                </ScatterChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Combinations Tab */}
        <TabsContent value="combinations" className="space-y-6">
          <Alert>
            <Info className="h-4 w-4" />
            <AlertDescription>
              Анализ показывает лучшие комбинации сегментов и типов коммуникаций на основе исторических данных
            </AlertDescription>
          </Alert>

          <Card>
            <CardHeader>
              <CardTitle>Лучшие комбинации "Сегмент + Коммуникация"</CardTitle>
              <CardDescription>
                Топ комбинаций по эффективности и revenue
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {bestCombinations.map((combo, index) => (
                  <div key={index} className="p-4 border rounded-lg space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={cn(
                          "w-10 h-10 rounded-full flex items-center justify-center text-white font-bold",
                          index === 0 ? "bg-yellow-500" :
                          index === 1 ? "bg-gray-400" :
                          index === 2 ? "bg-orange-600" : "bg-blue-500"
                        )}>
                          #{index + 1}
                        </div>
                        <div>
                          <h4 className="font-semibold flex items-center gap-2">
                            {combo.segment} 
                            <ArrowRight className="h-4 w-4" />
                            {combo.communication}
                          </h4>
                          <p className="text-sm text-muted-foreground">
                            Канал: {combo.channel}
                          </p>
                        </div>
                      </div>
                      <Badge className={cn(
                        combo.effectiveness >= 90 ? "bg-green-100 text-green-800" :
                        combo.effectiveness >= 70 ? "bg-yellow-100 text-yellow-800" :
                        "bg-red-100 text-red-800"
                      )}>
                        Эффективность: {combo.effectiveness}%
                      </Badge>
                    </div>
                    
                    <div className="grid grid-cols-4 gap-4 pt-2">
                      <div className="text-center">
                        <div className="text-2xl font-bold">€{combo.revenue.toLocaleString()}</div>
                        <div className="text-xs text-muted-foreground">Revenue</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold">€{combo.ltv.toLocaleString()}</div>
                        <div className="text-xs text-muted-foreground">LTV</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold">{combo.retention}%</div>
                        <div className="text-xs text-muted-foreground">Retention</div>
                      </div>
                      <div className="text-center">
                        <Button variant="outline" size="sm">
                          Применить
                          <ChevronRight className="ml-1 h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Combination Matrix */}
          <Card>
            <CardHeader>
              <CardTitle>Матрица эффективности комбинаций</CardTitle>
              <CardDescription>
                Тепловая карта результативности различных комбинаций
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr>
                      <th className="text-left p-2">Сегмент / Канал</th>
                      <th className="text-center p-2">Email</th>
                      <th className="text-center p-2">Push</th>
                      <th className="text-center p-2">SMS</th>
                      <th className="text-center p-2">In-App</th>
                      <th className="text-center p-2">Multi</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="p-2 font-medium">VIP</td>
                      <td className="text-center p-2 bg-green-100">95%</td>
                      <td className="text-center p-2 bg-green-50">78%</td>
                      <td className="text-center p-2 bg-green-100">92%</td>
                      <td className="text-center p-2 bg-yellow-50">65%</td>
                      <td className="text-center p-2 bg-green-200">98%</td>
                    </tr>
                    <tr>
                      <td className="p-2 font-medium">Новички</td>
                      <td className="text-center p-2 bg-green-100">92%</td>
                      <td className="text-center p-2 bg-yellow-50">62%</td>
                      <td className="text-center p-2 bg-yellow-100">58%</td>
                      <td className="text-center p-2 bg-green-50">75%</td>
                      <td className="text-center p-2 bg-green-50">82%</td>
                    </tr>
                    <tr>
                      <td className="p-2 font-medium">Предотток</td>
                      <td className="text-center p-2 bg-yellow-100">68%</td>
                      <td className="text-center p-2 bg-green-50">75%</td>
                      <td className="text-center p-2 bg-yellow-50">52%</td>
                      <td className="text-center p-2 bg-yellow-100">60%</td>
                      <td className="text-center p-2 bg-green-50">78%</td>
                    </tr>
                    <tr>
                      <td className="p-2 font-medium">Спящие</td>
                      <td className="text-center p-2 bg-red-50">35%</td>
                      <td className="text-center p-2 bg-red-100">28%</td>
                      <td className="text-center p-2 bg-yellow-50">45%</td>
                      <td className="text-center p-2 bg-red-50">22%</td>
                      <td className="text-center p-2 bg-yellow-50">48%</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div className="flex items-center justify-center gap-4 mt-4 text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-green-200 rounded"></div>
                  <span>90-100% (Отлично)</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-green-100 rounded"></div>
                  <span>70-89% (Хорошо)</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-yellow-100 rounded"></div>
                  <span>50-69% (Средне)</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-red-100 rounded"></div>
                  <span>&lt;50% (Плохо)</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* AI Recommendations */}
          <Card className="border-blue-200 bg-blue-50/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5 text-blue-600" />
                AI Рекомендации по оптимизации
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <Alert className="border-blue-200">
                  <ThumbsUp className="h-4 w-4" />
                  <AlertDescription>
                    <strong>Высокий потенциал:</strong> Сегмент "Хайроллеры" показывает отличные результаты 
                    с Multi-channel коммуникациями. Рекомендуем увеличить частоту до 2 раз в неделю.
                  </AlertDescription>
                </Alert>
                
                <Alert className="border-yellow-200">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>
                    <strong>Требует внимания:</strong> Сегмент "Спящие" имеет низкую эффективность 
                    через Push (28%). Попробуйте SMS с персонализированными офферами.
                  </AlertDescription>
                </Alert>
                
                <Alert className="border-green-200">
                  <Info className="h-4 w-4" />
                  <AlertDescription>
                    <strong>Новая возможность:</strong> Создайте кросс-сегмент "VIP + Предотток" 
                    для таргетированной кампании возврата ценных игроков.
                  </AlertDescription>
                </Alert>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Campaign Detail Modal */}
      <Dialog open={!!selectedCampaign} onOpenChange={() => setSelectedCampaign(null)}>
        <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl">
              {selectedCampaign?.name}
            </DialogTitle>
            <DialogDescription className="flex items-center gap-4">
              <Badge variant="outline">{selectedCampaign?.type}</Badge>
              <span>•</span>
              <span>Сегмент: {selectedCampaign?.segment}</span>
              <span>•</span>
              <span>
                {selectedCampaign?.startDate} - {selectedCampaign?.endDate}
              </span>
              <span>•</span>
              <Badge className={
                selectedCampaign?.status === 'active' ? 'bg-green-100 text-green-800' :
                selectedCampaign?.status === 'paused' ? 'bg-yellow-100 text-yellow-800' :
                'bg-gray-100 text-gray-800'
              }>
                {selectedCampaign?.status === 'active' ? 'Активна' :
                 selectedCampaign?.status === 'paused' ? 'На паузе' : 'Завершена'}
              </Badge>
            </DialogDescription>
          </DialogHeader>

          {selectedCampaign && (
            <Tabs defaultValue="overview" className="mt-6">
              <TabsList className="grid w-full grid-cols-5">
                <TabsTrigger value="overview">Обзор</TabsTrigger>
                <TabsTrigger value="timeline">История</TabsTrigger>
                <TabsTrigger value="messages">Сообщения</TabsTrigger>
                <TabsTrigger value="channels">Каналы</TabsTrigger>
                <TabsTrigger value="segments">Сегменты</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-4 mt-4">
                {/* Key Metrics */}
                <div className="grid grid-cols-4 gap-4">
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm">Отправлено</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{selectedCampaign.sent.toLocaleString()}</div>
                      <div className="text-xs text-muted-foreground">
                        Доставлено: {selectedCampaign.delivered.toLocaleString()}
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm">Open Rate</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{selectedCampaign.openRate}%</div>
                      <div className="text-xs text-muted-foreground">
                        {selectedCampaign.opened.toLocaleString()} открытий
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm">CTR</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{selectedCampaign.ctr}%</div>
                      <div className="text-xs text-muted-foreground">
                        {selectedCampaign.clicked.toLocaleString()} кликов
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm">Revenue</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">€{selectedCampaign.revenue.toLocaleString()}</div>
                      <div className="text-xs text-muted-foreground">
                        ROI: {selectedCampaign.roi}%
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Performance Chart */}
                <Card>
                  <CardHeader>
                    <CardTitle>Динамика показателей</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={250}>
                      <LineChart data={selectedCampaign.timelineData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Line type="monotone" dataKey="sent" stroke="#94a3b8" name="Отправлено" />
                        <Line type="monotone" dataKey="opened" stroke="#3b82f6" name="Открыто" />
                        <Line type="monotone" dataKey="clicked" stroke="#10b981" name="Клики" />
                        <Line type="monotone" dataKey="revenue" stroke="#f59e0b" name="Revenue €" />
                      </LineChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="timeline" className="mt-4">
                <Card>
                  <CardHeader>
                    <CardTitle>История событий</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {selectedCampaign.timelineData.map((event, index) => (
                        <div key={index} className="flex items-start gap-4 pb-4 border-b last:border-0">
                          <div className="min-w-[80px] text-sm text-muted-foreground">
                            {event.date}
                          </div>
                          <div className="flex-1 space-y-2">
                            <div className="flex items-center gap-4">
                              <Badge variant="outline">
                                <Send className="mr-1 h-3 w-3" />
                                {event.sent} отправлено
                              </Badge>
                              <Badge variant="outline">
                                <Eye className="mr-1 h-3 w-3" />
                                {event.opened} открыто
                              </Badge>
                              <Badge variant="outline">
                                <MousePointer className="mr-1 h-3 w-3" />
                                {event.clicked} кликов
                              </Badge>
                              <Badge variant="outline">
                                <Euro className="mr-1 h-3 w-3" />
                                €{event.revenue.toLocaleString()}
                              </Badge>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="messages" className="mt-4">
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle>Детали сообщений</CardTitle>
                      <div className="flex gap-2">
                        <Input
                          placeholder="Поиск по пользователю..."
                          value={messageSearchQuery}
                          onChange={(e) => setMessageSearchQuery(e.target.value)}
                          className="w-[200px]"
                        />
                        <Select value={messageStatusFilter} onValueChange={setMessageStatusFilter}>
                          <SelectTrigger className="w-[150px]">
                            <SelectValue placeholder="Статус" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">Все статусы</SelectItem>
                            <SelectItem value="sent">Отправлено</SelectItem>
                            <SelectItem value="delivered">Доставлено</SelectItem>
                            <SelectItem value="opened">Открыто</SelectItem>
                            <SelectItem value="clicked">Клик</SelectItem>
                            <SelectItem value="bounced">Отскок</SelectItem>
                            <SelectItem value="failed">Ошибка</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <ScrollArea className="h-[400px]">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Пользователь</TableHead>
                            <TableHead>Тип</TableHead>
                            <TableHead>Статус</TableHead>
                            <TableHead>Время отправки</TableHead>
                            <TableHead>Устройство</TableHead>
                            <TableHead>Локация</TableHead>
                            <TableHead className="text-right">Revenue</TableHead>
                            <TableHead></TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {selectedCampaign.messages
                            .filter(msg => 
                              (messageStatusFilter === 'all' || msg.status === messageStatusFilter) &&
                              (!messageSearchQuery || 
                               msg.userName.toLowerCase().includes(messageSearchQuery.toLowerCase()) ||
                               msg.userEmail.toLowerCase().includes(messageSearchQuery.toLowerCase()))
                            )
                            .map((message) => (
                            <TableRow key={message.id}>
                              <TableCell>
                                <div className="flex items-center gap-2">
                                  <Avatar className="h-8 w-8">
                                    <AvatarFallback>
                                      {message.userName.split(' ').map(n => n[0]).join('')}
                                    </AvatarFallback>
                                  </Avatar>
                                  <div>
                                    <div className="font-medium">{message.userName}</div>
                                    <div className="text-xs text-muted-foreground">{message.userEmail}</div>
                                  </div>
                                </div>
                              </TableCell>
                              <TableCell>
                                {getMessageTypeIcon(message.messageType)}
                              </TableCell>
                              <TableCell>
                                <div className="flex items-center gap-1">
                                  {getStatusIcon(message.status)}
                                  <span className="text-sm">{message.status}</span>
                                </div>
                              </TableCell>
                              <TableCell className="text-sm">
                                {formatDate(message.sentAt)}
                              </TableCell>
                              <TableCell className="text-sm">{message.device}</TableCell>
                              <TableCell className="text-sm">{message.location}</TableCell>
                              <TableCell className="text-right">
                                {message.revenue ? `€${message.revenue}` : '—'}
                              </TableCell>
                              <TableCell>
                                <Button variant="ghost" size="sm">
                                  <Info className="h-3 w-3" />
                                </Button>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </ScrollArea>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="channels" className="mt-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Статистика по каналам</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {Object.entries(selectedCampaign.channelStats).map(([channel, stats]) => (
                      <div key={channel} className="border rounded-lg p-4">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-2">
                            <Badge variant="outline" className="capitalize">{channel}</Badge>
                            <span className="text-sm text-muted-foreground">
                              {stats.sent} сообщений
                            </span>
                          </div>
                          <div className="text-sm">
                            CR: {stats.sent > 0 ? ((stats.converted / stats.sent) * 100).toFixed(1) : 0}%
                          </div>
                        </div>
                        <div className="grid grid-cols-4 gap-4 text-center">
                          <div>
                            <div className="text-xl font-bold">{stats.sent}</div>
                            <div className="text-xs text-muted-foreground">Отправлено</div>
                          </div>
                          <div>
                            <div className="text-xl font-bold">{stats.opened}</div>
                            <div className="text-xs text-muted-foreground">Открыто</div>
                          </div>
                          <div>
                            <div className="text-xl font-bold">{stats.clicked}</div>
                            <div className="text-xs text-muted-foreground">Кликов</div>
                          </div>
                          <div>
                            <div className="text-xl font-bold">{stats.converted}</div>
                            <div className="text-xs text-muted-foreground">Конверсий</div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="segments" className="mt-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Результаты по сегментам</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Сегмент</TableHead>
                          <TableHead className="text-right">Пользователей</TableHead>
                          <TableHead className="text-right">Конверсия</TableHead>
                          <TableHead className="text-right">% от общего</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {selectedCampaign.segments.map((segment, index) => (
                          <TableRow key={index}>
                            <TableCell className="font-medium">{segment.name}</TableCell>
                            <TableCell className="text-right">{segment.users.toLocaleString()}</TableCell>
                            <TableCell className="text-right">{segment.conversion}%</TableCell>
                            <TableCell className="text-right">
                              {((segment.users / selectedCampaign.sent) * 100).toFixed(1)}%
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          )}
        </DialogContent>
      </Dialog>

      {/* Trigger Detail Modal */}
      <Dialog open={!!selectedTrigger} onOpenChange={() => setSelectedTrigger(null)}>
        <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl">{selectedTrigger?.name}</DialogTitle>
            <DialogDescription className="flex items-center gap-4">
              <code className="bg-muted px-2 py-1 rounded text-sm">{selectedTrigger?.event}</code>
              <span>•</span>
              <span>Время отклика: {selectedTrigger?.avgResponseTime}</span>
              <span>•</span>
              <Badge className="bg-green-100 text-green-800">
                {selectedTrigger?.status === 'active' ? 'Активен' : 'Неактивен'}
              </Badge>
            </DialogDescription>
          </DialogHeader>

          {selectedTrigger && (
            <div className="space-y-6 mt-6">
              {/* Key Metrics */}
              <div className="grid grid-cols-4 gap-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm">Активаций</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{selectedTrigger.activations.toLocaleString()}</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm">Конверсий</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{selectedTrigger.conversions.toLocaleString()}</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm">CR</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {((selectedTrigger.conversions / selectedTrigger.activations) * 100).toFixed(1)}%
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm">Revenue</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">€{selectedTrigger.revenue.toLocaleString()}</div>
                  </CardContent>
                </Card>
              </div>

              {/* Daily Activations Chart */}
              <Card>
                <CardHeader>
                  <CardTitle>Активации по дням</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={200}>
                    <BarChart data={selectedTrigger.dailyActivations}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="count" fill="#3b82f6" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Conversion Funnel */}
              <Card>
                <CardHeader>
                  <CardTitle>Воронка конверсии</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {selectedTrigger.conversionFunnel.map((stage, index) => (
                      <div key={index} className="flex items-center gap-4">
                        <div className="min-w-[200px] font-medium">{stage.stage}</div>
                        <div className="flex-1">
                          <Progress 
                            value={(stage.users / selectedTrigger.conversionFunnel[0].users) * 100} 
                            className="h-6"
                          />
                        </div>
                        <div className="min-w-[100px] text-right">
                          <span className="font-bold">{stage.users.toLocaleString()}</span>
                          <span className="text-sm text-muted-foreground ml-1">
                            ({((stage.users / selectedTrigger.conversionFunnel[0].users) * 100).toFixed(1)}%)
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Recent Messages */}
              <Card>
                <CardHeader>
                  <CardTitle>Последние сообщения</CardTitle>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-[300px]">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Пользователь</TableHead>
                          <TableHead>Тип</TableHead>
                          <TableHead>Статус</TableHead>
                          <TableHead>Время</TableHead>
                          <TableHead className="text-right">Revenue</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {selectedTrigger.messages.map((message) => (
                          <TableRow key={message.id}>
                            <TableCell>
                              <div className="font-medium">{message.userName}</div>
                              <div className="text-xs text-muted-foreground">{message.userEmail}</div>
                            </TableCell>
                            <TableCell>{getMessageTypeIcon(message.messageType)}</TableCell>
                            <TableCell>
                              <div className="flex items-center gap-1">
                                {getStatusIcon(message.status)}
                                <span className="text-sm">{message.status}</span>
                              </div>
                            </TableCell>
                            <TableCell className="text-sm">{formatDate(message.sentAt)}</TableCell>
                            <TableCell className="text-right">
                              {message.revenue ? `€${message.revenue}` : '—'}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </ScrollArea>
                </CardContent>
              </Card>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Template Detail Modal */}
      <Dialog open={!!selectedTemplate} onOpenChange={() => setSelectedTemplate(null)}>
        <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl">{selectedTemplate?.name}</DialogTitle>
            <DialogDescription className="flex items-center gap-4">
              <Badge variant="outline">{selectedTemplate?.type}</Badge>
              <span>•</span>
              <div className="flex items-center gap-1">
                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                <span>{selectedTemplate?.rating}/5.0</span>
              </div>
              <span>•</span>
              <span>Обновлен: {selectedTemplate?.lastUpdated}</span>
            </DialogDescription>
          </DialogHeader>

          {selectedTemplate && (
            <div className="space-y-6 mt-6">
              {/* Key Metrics */}
              <div className="grid grid-cols-4 gap-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm">Использований</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{selectedTemplate.usage.toLocaleString()}</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm">Avg Open Rate</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{selectedTemplate.avgOpenRate}%</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm">Avg CTR</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{selectedTemplate.avgCtr}%</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm">Avg CR</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{selectedTemplate.avgConversion}%</div>
                  </CardContent>
                </Card>
              </div>

              {/* Performance by Segment */}
              <Card>
                <CardHeader>
                  <CardTitle>Эффективность по сегментам</CardTitle>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Сегмент</TableHead>
                        <TableHead className="text-right">Open Rate</TableHead>
                        <TableHead className="text-right">CTR</TableHead>
                        <TableHead className="text-right">Конверсия</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {selectedTemplate.performanceBySegment.map((perf, index) => (
                        <TableRow key={index}>
                          <TableCell className="font-medium">{perf.segment}</TableCell>
                          <TableCell className="text-right">{perf.openRate}%</TableCell>
                          <TableCell className="text-right">{perf.ctr}%</TableCell>
                          <TableCell className="text-right">{perf.conversion}%</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>

              {/* Version History */}
              <Card>
                <CardHeader>
                  <CardTitle>История версий</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {selectedTemplate.versions.map((version, index) => (
                      <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center gap-4">
                          <Badge variant={index === 0 ? "default" : "outline"}>{version.version}</Badge>
                          <div>
                            <div className="font-medium">{version.changes}</div>
                            <div className="text-sm text-muted-foreground">{version.date}</div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Progress value={version.performance} className="w-[100px]" />
                          <span className="text-sm font-medium">{version.performance}%</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Sample Messages */}
              <Card>
                <CardHeader>
                  <CardTitle>Примеры сообщений</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {selectedTemplate.messages.slice(0, 3).map((message) => (
                      <div key={message.id} className="border rounded-lg p-4">
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex items-center gap-2">
                            {getMessageTypeIcon(message.messageType)}
                            <span className="font-medium">{message.subject}</span>
                          </div>
                          <Button variant="ghost" size="sm">
                            <Copy className="h-3 w-3" />
                          </Button>
                        </div>
                        <p className="text-sm text-muted-foreground">{message.content}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Comparison Modal */}
      <Dialog open={isCompareModalOpen} onOpenChange={setIsCompareModalOpen}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Сравнение кампаний</DialogTitle>
            <DialogDescription>
              Выберите кампании для сравнения по всем ключевым метрикам
            </DialogDescription>
          </DialogHeader>
          
          {!showComparison ? (
            <div className="space-y-4">
              <div className="space-y-2">
                {campaignMetrics.map((campaign) => (
                  <div key={campaign.id} className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-accent/50 cursor-pointer">
                    <Checkbox
                      id={campaign.id}
                      checked={selectedCampaigns.includes(campaign.id)}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setSelectedCampaigns([...selectedCampaigns, campaign.id]);
                        } else {
                          setSelectedCampaigns(selectedCampaigns.filter(id => id !== campaign.id));
                        }
                      }}
                    />
                    <label htmlFor={campaign.id} className="flex-1 cursor-pointer">
                      <div className="flex items-center justify-between">
                        <div>
                          <span className="font-medium">{campaign.name}</span>
                          <span className="ml-2 text-sm text-muted-foreground">
                            ({campaign.type} • {campaign.segment})
                          </span>
                        </div>
                        <Badge variant={campaign.performance >= 90 ? "default" : campaign.performance >= 70 ? "secondary" : "destructive"}>
                          {campaign.performance}% эффективность
                        </Badge>
                      </div>
                    </label>
                  </div>
                ))}
              </div>
              
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setIsCompareModalOpen(false)}>
                  Отмена
                </Button>
                <Button 
                  onClick={() => setShowComparison(true)}
                  disabled={selectedCampaigns.length < 2}
                >
                  Сравнить ({selectedCampaigns.length})
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="font-semibold">Сравнение {selectedCampaigns.length} кампаний</h3>
                <Button variant="outline" size="sm" onClick={() => setShowComparison(false)}>
                  Назад к выбору
                </Button>
              </div>
              
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Метрика</TableHead>
                    {selectedCampaigns.map(id => {
                      const campaign = campaignMetrics.find(c => c.id === id);
                      return (
                        <TableHead key={id} className="text-center">
                          <div>
                            <div className="font-medium">{campaign?.name}</div>
                            <div className="text-xs text-muted-foreground">
                              {campaign?.type} • {campaign?.segment}
                            </div>
                          </div>
                        </TableHead>
                      );
                    })}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-medium">% достижения цели</TableCell>
                    {selectedCampaigns.map(id => {
                      const campaign = campaignMetrics.find(c => c.id === id);
                      return (
                        <TableCell key={id} className="text-center">
                          <div className={cn(
                            "inline-flex px-2 py-1 rounded-md font-medium",
                            campaign && campaign.goalAchievement >= 90 ? "bg-green-100 text-green-700" : 
                            campaign && campaign.goalAchievement >= 70 ? "bg-yellow-100 text-yellow-700" : "bg-red-100 text-red-700"
                          )}>
                            {campaign?.goalAchievement}%
                          </div>
                        </TableCell>
                      );
                    })}
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">GGR кампании</TableCell>
                    {selectedCampaigns.map(id => {
                      const campaign = campaignMetrics.find(c => c.id === id);
                      return (
                        <TableCell key={id} className="text-center font-medium">
                          €{campaign?.ggr.toLocaleString()}
                        </TableCell>
                      );
                    })}
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">CR в CTA</TableCell>
                    {selectedCampaigns.map(id => {
                      const campaign = campaignMetrics.find(c => c.id === id);
                      return (
                        <TableCell key={id} className="text-center">
                          {campaign?.ctaConversion}%
                        </TableCell>
                      );
                    })}
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Open Rate</TableCell>
                    {selectedCampaigns.map(id => {
                      const campaign = campaignMetrics.find(c => c.id === id);
                      return (
                        <TableCell key={id} className="text-center">
                          {campaign?.openRate}%
                        </TableCell>
                      );
                    })}
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">CTR</TableCell>
                    {selectedCampaigns.map(id => {
                      const campaign = campaignMetrics.find(c => c.id === id);
                      return (
                        <TableCell key={id} className="text-center">
                          {campaign?.ctr}%
                        </TableCell>
                      );
                    })}
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Конверсия</TableCell>
                    {selectedCampaigns.map(id => {
                      const campaign = campaignMetrics.find(c => c.id === id);
                      return (
                        <TableCell key={id} className="text-center">
                          {campaign?.conversionRate}%
                        </TableCell>
                      );
                    })}
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Revenue</TableCell>
                    {selectedCampaigns.map(id => {
                      const campaign = campaignMetrics.find(c => c.id === id);
                      return (
                        <TableCell key={id} className="text-center">
                          €{campaign?.revenue.toLocaleString()}
                        </TableCell>
                      );
                    })}
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">ROI</TableCell>
                    {selectedCampaigns.map(id => {
                      const campaign = campaignMetrics.find(c => c.id === id);
                      return (
                        <TableCell key={id} className="text-center">
                          <div className={cn(
                            "inline-flex px-2 py-1 rounded-md font-medium",
                            campaign && campaign.roi >= 300 ? "bg-green-100 text-green-700" : 
                            campaign && campaign.roi >= 150 ? "bg-yellow-100 text-yellow-700" : "bg-red-100 text-red-700"
                          )}>
                            {campaign?.roi}%
                          </div>
                        </TableCell>
                      );
                    })}
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Отправлено</TableCell>
                    {selectedCampaigns.map(id => {
                      const campaign = campaignMetrics.find(c => c.id === id);
                      return (
                        <TableCell key={id} className="text-center">
                          {campaign?.sent.toLocaleString()}
                        </TableCell>
                      );
                    })}
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Доставлено</TableCell>
                    {selectedCampaigns.map(id => {
                      const campaign = campaignMetrics.find(c => c.id === id);
                      return (
                        <TableCell key={id} className="text-center">
                          {campaign?.delivered.toLocaleString()}
                        </TableCell>
                      );
                    })}
                  </TableRow>
                </TableBody>
              </Table>
              
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => {
                  setIsCompareModalOpen(false);
                  setShowComparison(false);
                  setSelectedCampaigns([]);
                }}>
                  Закрыть
                </Button>
                <Button className="gap-2">
                  <Download className="h-4 w-4" />
                  Экспорт сравнения
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* A/B Test Calculator */}
      <ABTestCalculator
        open={showABTestCalculator}
        onOpenChange={setShowABTestCalculator}
      />
    </div>
  );
}