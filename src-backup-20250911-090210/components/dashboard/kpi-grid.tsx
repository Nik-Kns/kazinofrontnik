import { KpiCard, KpiCardSkeleton } from "./kpi-card";
import { kpiData } from "@/lib/mock-data";

export function KpiGrid() {
  const isLoading = false; // Set to true to see skeleton loaders

  return (
    <div>
      <div className="grid gap-4 md:grid-cols-2 md:gap-6 lg:grid-cols-4 xl:grid-cols-5">
        {isLoading
          ? Array.from({ length: 8 }).map((_, i) => <KpiCardSkeleton key={i} />)
          : kpiData.map((kpi) => <KpiCard key={kpi.title} {...kpi} />)}
      </div>
    </div>
  );
}
