import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function BuilderPage() {
  return (
    <div className="p-4 md:p-6 lg:p-8">
      <Card>
        <CardHeader>
          <CardTitle>Конструктор сценариев</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Здесь будет drag-and-drop редактор для построения CRM-сценариев с логикой, A/B-тестами и помощью AI Co-pilot.</p>
        </CardContent>
      </Card>
    </div>
  );
}
