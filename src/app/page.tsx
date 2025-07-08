import { Filters } from "@/components/dashboard/filters";
import { KpiGrid } from "@/components/dashboard/kpi-grid";
import { ScenariosTable } from "@/components/dashboard/scenarios-table";
import { AnalyticsCharts } from "@/components/dashboard/analytics-charts";
import { RisksAndWarnings } from "@/components/dashboard/risks-and-warnings";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Briefcase, BrainCircuit, LineChart } from "lucide-react";

export default function CommandCenterPage() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-4">
        <h1 className="text-2xl font-bold tracking-tight">Дашборд</h1>
        <p className="text-muted-foreground">
          Обзор ключевых показателей, кампаний и AI-рекомендаций.
        </p>
        <Filters />
      </div>

      <Tabs defaultValue="campaigns">
        <TabsList className="mb-4 grid w-full grid-cols-1 sm:grid-cols-3 sm:w-auto">
          <TabsTrigger value="campaigns"><Briefcase className="mr-2 h-4 w-4" />Обзор кампаний</TabsTrigger>
          <TabsTrigger value="analytics"><LineChart className="mr-2 h-4 w-4" />Аналитика Retention</TabsTrigger>
          <TabsTrigger value="ai"><BrainCircuit className="mr-2 h-4 w-4" />AI Рекомендации</TabsTrigger>
        </TabsList>
        
        <TabsContent value="campaigns" className="space-y-6">
          <ScenariosTable />
        </TabsContent>
        
        <TabsContent value="analytics" className="space-y-6">
          <KpiGrid />
          <AnalyticsCharts />
        </TabsContent>
        
        <TabsContent value="ai">
          <RisksAndWarnings />
        </TabsContent>
      </Tabs>
    </div>
  );
}
