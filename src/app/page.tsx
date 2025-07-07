import { Filters } from "@/components/dashboard/filters";
import { KpiGrid } from "@/components/dashboard/kpi-grid";
import { ScenariosTable } from "@/components/dashboard/scenarios-table";
import { AnalyticsCharts } from "@/components/dashboard/analytics-charts";
import { RisksAndWarnings } from "@/components/dashboard/risks-and-warnings";

export default function CommandCenterPage() {
  return (
    <div>
      <div className="sticky top-0 z-10 bg-background/95 py-4 backdrop-blur-sm px-4 md:px-6 lg:px-8">
        <h1 className="text-2xl font-bold tracking-tight mb-4">Командный центр</h1>
        <Filters />
      </div>
      <div className="p-4 md:p-6 lg:p-8 flex flex-col gap-6">
        <KpiGrid />
        <ScenariosTable />
        <AnalyticsCharts />
        <RisksAndWarnings />
      </div>
    </div>
  );
}
