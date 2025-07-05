import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function SettingsPage() {
  return (
    <div className="p-4 md:p-6 lg:p-8">
      <Card>
        <CardHeader>
          <CardTitle>Настройки</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Здесь будут настройки пользователей, ролей, прав доступа, каналов коммуникации и системных переменных.</p>
        </CardContent>
      </Card>
    </div>
  );
}
