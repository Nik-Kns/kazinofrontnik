import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function SegmentsPage() {
  return (
    <div className="p-4 md:p-6 lg:p-8">
      <Card>
        <CardHeader>
          <CardTitle>Сегменты</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Страница для создания и управления сегментами пользователей. Здесь будет функционал для редактирования, истории изменений, интеграции с аналитикой и экспорта аудиторий.</p>
        </CardContent>
      </Card>
    </div>
  );
}
