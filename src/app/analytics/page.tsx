import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { KpiGrid } from "@/components/dashboard/kpi-grid";
import { AnalyticsCharts } from "@/components/dashboard/analytics-charts";
import { Filters } from "@/components/dashboard/filters";
import { HandCoins, TrendingUp, Users } from "lucide-react";
import { CampaignPerformanceTable } from "@/components/analytics/campaign-performance-table";

export default function AnalyticsPage() {
  return (
    <div className="flex flex-col gap-6 p-4 md:p-6 lg:p-8">
      <div className="flex flex-col gap-4">
        <h1 className="text-2xl font-bold tracking-tight">Аналитика</h1>
        <p className="text-muted-foreground">
          Раздел с метриками по Retention, CRM, финансам. Здесь будут настраиваемые дашборды, сравнение периодов и экспорт отчетов.
        </p>
        <Filters />
      </div>

      <Tabs defaultValue="retention">
        <TabsList className="mb-4">
          <TabsTrigger value="retention"><TrendingUp className="mr-2 h-4 w-4" />Retention</TabsTrigger>
          <TabsTrigger value="crm"><Users className="mr-2 h-4 w-4" />CRM</TabsTrigger>
          <TabsTrigger value="finance"><HandCoins className="mr-2 h-4 w-4" />Финансы</TabsTrigger>
        </TabsList>

        <TabsContent value="retention" className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle>Ключевые метрики Retention</CardTitle>
                    <CardDescription>Обзор показателей удержания пользователей.</CardDescription>
                </CardHeader>
                <CardContent>
                    <KpiGrid />
                </CardContent>
            </Card>
            <AnalyticsCharts />
        </TabsContent>

        <TabsContent value="crm" className="space-y-6">
            <CampaignPerformanceTable />
            <AnalyticsCharts />
        </TabsContent>

        <TabsContent value="finance" className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle>Ключевые финансовые метрики</CardTitle>
                    <CardDescription>Обзор финансовых показателей, связанных с CRM-активностями.</CardDescription>
                </CardHeader>
                <CardContent>
                    <KpiGrid />
                </CardContent>
            </Card>
             <AnalyticsCharts />
        </TabsContent>
      </Tabs>
    </div>
  );
}
