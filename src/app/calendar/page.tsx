import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function CalendarPage() {
  return (
    <div className="p-4 md:p-6 lg:p-8">
      <Card>
        <CardHeader>
          <CardTitle>Календарь кампаний</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Визуальный план всех активностей с просмотром по неделям/месяцам, фильтрами и статусами кампаний.</p>
        </CardContent>
      </Card>
    </div>
  );
}
