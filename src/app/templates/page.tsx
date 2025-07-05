import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function TemplatesPage() {
  return (
    <div className="p-4 md:p-6 lg:p-8">
      <Card>
        <CardHeader>
          <CardTitle>Шаблоны сценариев</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Библиотека готовых шаблонов сценариев (Welcome, Churn, VIP и др.) с рейтингами эффективности и возможностью быстрого клонирования.</p>
        </CardContent>
      </Card>
    </div>
  );
}
