import type { LucideIcon } from "lucide-react";

export type KpiCardData = {
  title: string;
  value: string;
  change: string;
  changeType: "increase" | "decrease";
  icon: string;
  aiHint: string;
};

export type ScenarioData = {
  name: string;
  category: string;
  frequency: "Регулярный" | "Разовый" | "Триггерный";
  channel: "Email" | "Push" | "SMS" | "InApp" | "Multi-channel";
  status: "Активен" | "Пауза" | "Завершён";
  segment: string;
  goal: string;
  deliveryRate: string;
  openRate: string;
  ctr: string;
  cr: string;
  churnImpact: string;
};

export type ChartData = {
  date: string;
  [key: string]: number | string;
};

export type RiskData = {
    type: "critical" | "warning" | "info";
    title: string;
    date: string;
    details: string;
    recommendation: string;
    action: {
        text: string;
        link: string;
    };
}

export type SegmentData = {
  id: string;
  name: string;
  description: string;
  playerCount: number;
  createdAt: string;
  createdBy: 'AI' | 'Пользователь';
};

export type TemplateData = {
  id: string;
  name: string;
  description: string;
  category: string;
  performance: number; // 1-5 stars
  channel: "Email" | "Push" | "SMS" | "InApp" | "Multi-channel";
};

export type ReportData = {
  id: string;
  name: string;
  type: "Сценарий" | "Сегмент" | "Retention";
  createdAt: string;
  status: "Готов" | "В процессе";
  createdBy: string;
};

export type CampaignData = {
  id: string;
  name: string;
  date: string; // e.g. "2024-07-15"
  type: "Email" | "Push" | "Promo";
};

export type ScenarioNodeData = {
  id: string;
  type: 'trigger' | 'action' | 'logic';
  title: string;
  description?: string;
  icon: React.ElementType;
  position: { top: number; left: string; transform?: string };
  config?: any;
}
