import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function AnalyticsPage() {
  return (
    <div className="p-4 md:p-6 lg:p-8">
      <Card>
        <CardHeader>
          <CardTitle>Аналитика</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Раздел с метриками по Retention, CRM, финансам. Здесь будут настраиваемые дашборды, сравнение периодов и экспорт отчетов.</p>
        </CardContent>
      </Card>
    </div>
  );
}
