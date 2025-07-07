import { Filters } from "@/components/dashboard/filters";
import { KpiGrid } from "@/components/dashboard/kpi-grid";
import { ScenariosTable } from "@/components/dashboard/scenarios-table";
import { AnalyticsCharts } from "@/components/dashboard/analytics-charts";
import { RisksAndWarnings } from "@/components/dashboard/risks-and-warnings";

export default function CommandCenterPage() {
  return (
    <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-4">
            <h1 className="text-2xl font-bold tracking-tight">Командный центр</h1>
            <Filters />
        </div>
        <KpiGrid />
        <ScenariosTable />
        <AnalyticsCharts />
        <RisksAndWarnings />
    </div>
  );
}
