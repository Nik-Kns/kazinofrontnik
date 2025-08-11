"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { risksData } from "@/lib/mock-data";
import { AlertTriangle, Lightbulb, XCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";

const riskMeta = {
  critical: {
    icon: XCircle,
    bgColor: "bg-destructive/5",
    borderColor: "border-destructive/50",
    iconColor: "text-destructive",
  },
  warning: {
    icon: AlertTriangle,
    bgColor: "bg-warning/5",
    borderColor: "border-warning/50",
    iconColor: "text-warning",
  },
  info: {
    icon: Lightbulb,
    bgColor: "bg-info/5",
    borderColor: "border-info/50",
    iconColor: "text-info",
  },
};

export function RisksAndWarnings() {
  // сортировка: critical -> warning -> info
  const sorted = [...risksData].sort((a, b) => {
    const weight = { critical: 0, warning: 1, info: 2 } as const;
    return weight[a.type] - weight[b.type];
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Риски и предупреждения</CardTitle>
        <CardDescription>
          Автоматические сигналы системы об ухудшении метрик, сбоях или зонах
          роста.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {sorted.length > 0 ? (
          sorted.map((risk, index) => {
            const meta = riskMeta[risk.type];
            const Icon = meta.icon;
            return (
              <div
                key={index}
                className={cn(
                  "flex flex-col md:flex-row items-start gap-4 rounded-lg border p-4",
                  meta.bgColor,
                  meta.borderColor
                )}
              >
                <Icon
                  className={cn("h-6 w-6 shrink-0 mt-1", meta.iconColor)}
                />
                <div className="flex-1 space-y-2">
                  <div className="flex items-start justify-between">
                    <p className="font-semibold">{risk.title}</p>
                    <p className="text-xs text-muted-foreground whitespace-nowrap ml-4">
                      {risk.date}
                    </p>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {risk.details}
                  </p>
                  <div className="rounded-md bg-background/50 p-3 mt-2">
                    <p className="text-sm text-foreground">
                      <span className="font-semibold text-info">AI-инсайт:</span> {risk.recommendation}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2 self-start md:self-center">
                  <span className={cn("text-xs font-medium px-2 py-1 rounded", meta.bgColor, meta.borderColor)}>
                    {risk.type === 'critical' ? 'Критично' : risk.type === 'warning' ? 'Предупреждение' : 'Возможность'}
                  </span>
                  <Button asChild variant="secondary" size="sm">
                    <Link href={risk.action.link}>Исправить сразу</Link>
                  </Button>
                </div>
              </div>
            );
          })
        ) : (
          <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-muted h-48">
            <div className="text-center">
              <p className="text-lg font-semibold text-success">
                ✅ Всё стабильно!
              </p>
              <p className="text-muted-foreground">
                Система не обнаружила критических проблем на текущий момент.
              </p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
