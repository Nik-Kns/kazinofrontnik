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
  type: string;
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
