import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { segmentsData } from "@/lib/mock-data";
import { Bot, Copy, Pencil, PlusCircle, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function SegmentsPage() {
  return (
    <div className="p-4 md:p-6 lg:p-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
            <h1 className="text-2xl font-bold tracking-tight">Сегменты</h1>
            <p className="text-muted-foreground">Создание и управление сегментами пользователей для CRM-кампаний.</p>
        </div>
        <Button>
            <PlusCircle className="mr-2 h-4 w-4" />
            Создать сегмент
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Список сегментов</CardTitle>
          <CardDescription>Все доступные сегменты пользователей.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-1/3">Название</TableHead>
                <TableHead>Описание</TableHead>
                <TableHead>Игроков</TableHead>
                <TableHead>Дата создания</TableHead>
                <TableHead>Автор</TableHead>
                <TableHead className="text-right">Действия</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {segmentsData.map((segment) => (
                <TableRow key={segment.id}>
                  <TableCell className="font-medium">{segment.name}</TableCell>
                  <TableCell className="text-muted-foreground">{segment.description}</TableCell>
                  <TableCell>{segment.playerCount.toLocaleString()}</TableCell>
                  <TableCell>{segment.createdAt}</TableCell>
                  <TableCell>
                    <Badge variant={segment.createdBy === 'AI' ? 'default' : 'secondary'} className={segment.createdBy === 'AI' ? 'bg-accent text-accent-foreground' : ''}>
                        {segment.createdBy === 'AI' && <Bot className="h-3 w-3 mr-1" />}
                        {segment.createdBy}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="icon">
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon">
                      <Copy className="h-4 w-4" />
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
