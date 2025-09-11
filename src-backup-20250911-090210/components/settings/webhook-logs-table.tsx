import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { webhookLogsData } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

const statusColors = {
  Success: "bg-success text-success-foreground",
  Failed: "bg-destructive text-destructive-foreground",
};

const serviceColors = {
    SendGrid: "bg-blue-100 text-blue-800",
    Twilio: "bg-red-100 text-red-800",
    Custom: "bg-gray-100 text-gray-800"
}

export function WebhookLogsTable() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Логи входящих вебхуков</CardTitle>
        <CardDescription>
          История всех уведомлений, полученных от внешних сервисов в реальном времени.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Время</TableHead>
              <TableHead>Сервис</TableHead>
              <TableHead>Событие (Hook)</TableHead>
              <TableHead>Статус</TableHead>
              <TableHead className="text-right">ID запроса</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {webhookLogsData.map((log) => (
              <TableRow key={log.id}>
                <TableCell className="font-mono text-xs">{log.timestamp}</TableCell>
                <TableCell>
                    <Badge variant="secondary" className={cn(serviceColors[log.service])}>{log.service}</Badge>
                </TableCell>
                <TableCell className="font-medium">{log.event}</TableCell>
                <TableCell>
                  <Badge className={cn(statusColors[log.status])}>{log.status}</Badge>
                </TableCell>
                <TableCell className="text-right font-mono text-xs">{log.requestId}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
