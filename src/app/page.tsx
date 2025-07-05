import { Filters } from "@/components/dashboard/filters";
import { KpiGrid } from "@/components/dashboard/kpi-grid";
import { ScenariosTable } from "@/components/dashboard/scenarios-table";
import { AnalyticsCharts } from "@/components/dashboard/analytics-charts";
import { RisksAndWarnings } from "@/components/dashboard/risks-and-warnings";

export default function CommandCenterPage() {
  return (
    <div className="flex flex-col gap-6">
      <div className="sticky top-0 z-10 bg-background/95 py-4 backdrop-blur-sm">
        <h1 className="text-2xl font-bold tracking-tight mb-4">Командный центр</h1>
        <Filters />
      </div>
      <KpiGrid />
      <ScenariosTable />
      <AnalyticsCharts />
      <RisksAndWarnings />
    </div>
  );
}
