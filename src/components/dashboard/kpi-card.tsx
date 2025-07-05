"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import type { KpiCardData } from "@/lib/types";
import {
  Lightbulb,
  TrendingDown,
  TrendingUp,
  Mail,
  MousePointerClick,
  Target,
  Users,
  RefreshCw,
  Euro,
  MailWarning,
  type LucideIcon,
} from "lucide-react";
import { Skeleton } from "../ui/skeleton";

const iconMap: { [key: string]: LucideIcon } = {
  Mail,
  TrendingUp,
  MousePointerClick,
  Target,
  Users,
  RefreshCw,
  Euro,
  MailWarning,
};

export function KpiCard({
  title,
  value,
  change,
  changeType,
  icon,
  aiHint,
}: KpiCardData) {
  const Icon = iconMap[icon];

  return (
    <Card className="hover:shadow-lg transition-shadow duration-300">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {Icon && <Icon className="h-4 w-4 text-muted-foreground" />}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <div className="flex items-center gap-1 text-xs text-muted-foreground">
          <span
            className={cn(
              "flex items-center gap-1",
              changeType === "increase" ? "text-success" : "text-destructive"
            )}
          >
            {changeType === "increase" ? (
              <TrendingUp className="h-4 w-4" />
            ) : (
              <TrendingDown className="h-4 w-4" />
            )}
            {change}
          </span>
        </div>
        <div className="absolute bottom-2 right-2">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <Lightbulb className="h-4 w-4 text-muted-foreground hover:text-accent transition-colors" />
              </TooltipTrigger>
              <TooltipContent>
                <p>{aiHint}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </CardContent>
    </Card>
  );
}

export function KpiCardSkeleton() {
  return <Skeleton className="h-[110px] w-full" />;
}
