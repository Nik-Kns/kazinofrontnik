import { Filters } from "@/components/dashboard/filters";
import { KpiGrid } from "@/components/dashboard/kpi-grid";
import { ScenariosTable } from "@/components/dashboard/scenarios-table";
import { AnalyticsCharts } from "@/components/dashboard/analytics-charts";
import { RisksAndWarnings } from "@/components/dashboard/risks-and-warnings";

export default function CommandCenterPage() {
  return (
    <div className="flex flex-col gap-6 p-4 md:p-6 lg:p-8">
      <div className="flex flex-col gap-4">
        <h1 className="text-2xl font-bold tracking-tight">Командный центр</h1>
        <p className="text-muted-foreground">
          Обзор ключевых показателей, активных кампаний и AI-рекомендаций.
        </p>
        <Filters />
      </div>
      
      <div className="space-y-6">
        <KpiGrid />
        <ScenariosTable />
        <RisksAndWarnings />
      </div>
    </div>
  );
}
