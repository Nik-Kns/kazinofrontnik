import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Bell, CircleUserRound, KeyRound, Link, ShieldCheck, Variable, Wallet } from "lucide-react";

export default function SettingsPage() {
  return (
    <div className="p-4 md:p-6 lg:p-8">
      <h1 className="text-2xl font-bold tracking-tight mb-4">Настройки</h1>
      <Tabs defaultValue="profile">
        <TabsList className="grid w-full grid-cols-5 mb-6">
          <TabsTrigger value="profile"><CircleUserRound className="mr-2 h-4 w-4" />Профиль</TabsTrigger>
          <TabsTrigger value="access"><ShieldCheck className="mr-2 h-4 w-4" />Доступ</TabsTrigger>
          <TabsTrigger value="integrations"><Link className="mr-2 h-4 w-4" />Интеграции</TabsTrigger>
          <TabsTrigger value="variables"><Variable className="mr-2 h-4 w-4" />Переменные</TabsTrigger>
          <TabsTrigger value="notifications"><Bell className="mr-2 h-4 w-4" />Уведомления</TabsTrigger>
        </TabsList>

        <TabsContent value="profile">
          <Card>
            <CardHeader>
              <CardTitle>Настройки профиля</CardTitle>
              <CardDescription>Управление вашими персональными данными.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Имя</Label>
                <Input id="name" defaultValue="John Doe" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" defaultValue="john.doe@example.com" />
              </div>
              <Button>Сохранить изменения</Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="access">
          <Card>
            <CardHeader>
              <CardTitle>Пользователи и права доступа</CardTitle>
              <CardDescription>Управляйте доступом вашей команды к платформе.</CardDescription>
            </CardHeader>
            <CardContent>
              <p>Здесь будет интерфейс для добавления пользователей и назначения ролей.</p>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="integrations">
          <Card>
            <CardHeader>
              <CardTitle>Интеграции с сервисами</CardTitle>
              <CardDescription>Подключите внешние сервисы для отправки сообщений.</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-6 md:grid-cols-2">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                    <div className="flex items-center gap-3">
                        <img src="https://www.vectorlogo.zone/logos/sendgrid/sendgrid-icon.svg" alt="SendGrid Logo" className="h-8 w-8"/>
                        <CardTitle className="text-xl">SendGrid</CardTitle>
                    </div>
                    <Badge variant="secondary">Email</Badge>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-muted-foreground">Интеграция для отправки email-рассылок.</p>
                   <div className="grid gap-2">
                    <Label htmlFor="sendgrid-key">API Key</Label>
                    <Input id="sendgrid-key" type="password" placeholder="SG.XXXXXXXXXXXXXXXX" />
                  </div>
                  <Button>Подключить</Button>
                </CardContent>
              </Card>
               <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                    <div className="flex items-center gap-3">
                         <img src="https://www.vectorlogo.zone/logos/twilio/twilio-icon.svg" alt="Twilio Logo" className="h-8 w-8"/>
                        <CardTitle className="text-xl">Twilio</CardTitle>
                    </div>
                    <Badge variant="secondary">SMS</Badge>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-muted-foreground">Интеграция для отправки SMS-сообщений.</p>
                  <div className="grid gap-2">
                    <Label htmlFor="twilio-sid">Account SID</Label>
                    <Input id="twilio-sid" placeholder="ACxxxxxxxxxxxxxxxx" />
                  </div>
                   <div className="grid gap-2">
                    <Label htmlFor="twilio-token">Auth Token</Label>
                    <Input id="twilio-token" type="password" placeholder="••••••••••••••••" />
                  </div>
                  <Button>Подключить</Button>
                </CardContent>
              </Card>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="variables">
          <Card>
            <CardHeader>
              <CardTitle>Системные переменные</CardTitle>
              <CardDescription>Управление глобальными переменными для использования в сценариях.</CardDescription>
            </CardHeader>
            <CardContent>
                <p>Здесь будет интерфейс для создания и редактирования переменных (например, ссылки, промокоды).</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle>Настройки уведомлений</CardTitle>
              <CardDescription>Выберите, какие уведомления вы хотите получать от системы.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between rounded-lg border p-4">
                <div>
                    <Label htmlFor="risk-alerts">Оповещения о рисках</Label>
                    <p className="text-sm text-muted-foreground">Получать уведомления о критических ошибках и падении метрик.</p>
                </div>
                <Switch id="risk-alerts" defaultChecked />
              </div>
               <div className="flex items-center justify-between rounded-lg border p-4">
                <div>
                    <Label htmlFor="report-ready">Готовность отчётов</Label>
                    <p className="text-sm text-muted-foreground">Получать уведомления, когда scheduled-отчёт готов.</p>
                </div>
                <Switch id="report-ready" defaultChecked/>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

      </Tabs>
    </div>
  );
}
