import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function ReportsPage() {
  return (
    <div className="p-4 md:p-6 lg:p-8">
      <Card>
        <CardHeader>
          <CardTitle>Отчёты</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Страница для генерации и управления отчетами по сценариям, сегментам и ретеншену. Здесь будет планировщик и рассылка отчетов.</p>
        </CardContent>
      </Card>
    </div>
  );
}
