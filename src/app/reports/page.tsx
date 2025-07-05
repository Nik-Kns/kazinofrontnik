import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { reportsData } from "@/lib/mock-data";
import { Download, PlusCircle, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const statusColors = {
  "Готов": "bg-success text-success-foreground",
  "В процессе": "bg-warning text-warning-foreground",
};

export default function ReportsPage() {
  return (
    <div className="p-4 md:p-6 lg:p-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
            <h1 className="text-2xl font-bold tracking-tight">Отчёты</h1>
            <p className="text-muted-foreground">Генерация, управление и рассылка отчетов по сценариям, сегментам и retention.</p>
        </div>
        <Button>
            <PlusCircle className="mr-2 h-4 w-4" />
            Сгенерировать отчёт
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>История отчётов</CardTitle>
          <CardDescription>Список всех сгенерированных отчётов.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Название отчёта</TableHead>
                <TableHead>Тип</TableHead>
                <TableHead>Дата создания</TableHead>
                <TableHead>Автор</TableHead>
                <TableHead>Статус</TableHead>
                <TableHead className="text-right">Действия</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {reportsData.map((report) => (
                <TableRow key={report.id}>
                  <TableCell className="font-medium">{report.name}</TableCell>
                  <TableCell>
                    <Badge variant="secondary">{report.type}</Badge>
                  </TableCell>
                  <TableCell>{report.createdAt}</TableCell>
                  <TableCell>{report.createdBy}</TableCell>
                  <TableCell>
                    <Badge className={cn(statusColors[report.status])}>{report.status}</Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="icon" disabled={report.status !== 'Готов'}>
                      <Download className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon">
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
