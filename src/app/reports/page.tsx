"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { reportsData } from "@/lib/mock-data";
import { Download, PlusCircle, Trash2, Settings, FileText, Calendar, DollarSign } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { CompactCurrencyToggle, CurrencyToggleButton } from "@/components/ui/currency-toggle";
import { CurrencyFilters, CurrencyFiltersState } from "@/components/ui/currency-filters";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useState } from "react";

const statusColors: Record<string, string> = {
  "Готов": "bg-success text-success-foreground",
  "В процессе": "bg-warning text-warning-foreground",
};

// Компонент для создания отчета с мультивалютными настройками
function CreateReportDialog() {
  const [currencyFilters, setCurrencyFilters] = useState<CurrencyFiltersState>({
    display_mode: 'base',
    selected_currencies: [],
    is_multi_currency: undefined,
  });

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>
          <PlusCircle className="mr-2 h-4 w-4" />
          Сгенерировать отчёт
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Создание нового отчета</DialogTitle>
          <DialogDescription>
            Настройте параметры отчета, включая валютные настройки и формат экспорта.
          </DialogDescription>
        </DialogHeader>
        
        <Tabs defaultValue="general" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="general">
              <FileText className="mr-2 h-4 w-4" />
              Общие
            </TabsTrigger>
            <TabsTrigger value="currency">
              <DollarSign className="mr-2 h-4 w-4" />
              Валюты
            </TabsTrigger>
            <TabsTrigger value="export">
              <Download className="mr-2 h-4 w-4" />
              Экспорт
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="general" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label>Тип отчета</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Выберите тип" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="financial">Финансовый отчет</SelectItem>
                    <SelectItem value="retention">Отчет по удержанию</SelectItem>
                    <SelectItem value="campaigns">Отчет по кампаниям</SelectItem>
                    <SelectItem value="segments">Отчет по сегментам</SelectItem>
                    <SelectItem value="players">Отчет по игрокам</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label>Период</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Выберите период" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="today">Сегодня</SelectItem>
                    <SelectItem value="yesterday">Вчера</SelectItem>
                    <SelectItem value="week">Неделя</SelectItem>
                    <SelectItem value="month">Месяц</SelectItem>
                    <SelectItem value="quarter">Квартал</SelectItem>
                    <SelectItem value="custom">Выбрать период</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="currency" className="space-y-4">
            <div className="space-y-4">
              <div className="p-4 border rounded-lg bg-muted/30">
                <h4 className="text-sm font-semibold mb-3">Валютные настройки отчета</h4>
                <CurrencyFilters
                  value={currencyFilters}
                  onChange={setCurrencyFilters}
                  compact={false}
                />
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <Switch id="include-fx-rates" />
                  <Label htmlFor="include-fx-rates">Включить таблицу курсов валют</Label>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Switch id="separate-currency-sheets" />
                  <Label htmlFor="separate-currency-sheets">Отдельные листы для каждой валюты (Excel)</Label>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Switch id="include-conversion-notes" />
                  <Label htmlFor="include-conversion-notes">Включить примечания о конверсии</Label>
                </div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="export" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label>Формат экспорта</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Выберите формат" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="xlsx">Excel (.xlsx)</SelectItem>
                    <SelectItem value="csv">CSV</SelectItem>
                    <SelectItem value="pdf">PDF</SelectItem>
                    <SelectItem value="json">JSON</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label>Режим валют в экспорте</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Выберите режим" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="native">Исходные валюты</SelectItem>
                    <SelectItem value="base">В базовой валюте</SelectItem>
                    <SelectItem value="both">Оба варианта</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <Switch id="auto-schedule" />
                <Label htmlFor="auto-schedule">Автоматическая генерация по расписанию</Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <Switch id="email-delivery" />
                <Label htmlFor="email-delivery">Отправить по email после генерации</Label>
              </div>
            </div>
          </TabsContent>
        </Tabs>
        
        <div className="flex justify-end gap-2 mt-6">
          <Button variant="outline">Отмена</Button>
          <Button>Создать отчет</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default function ReportsPage() {
  return (
    <div className="p-4 md:p-6 lg:p-8 space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
            <h1 className="text-2xl font-bold tracking-tight">Отчёты</h1>
            <p className="text-muted-foreground">Генерация, управление и рассылка отчетов по сценариям, сегментам и retention.</p>
        </div>
        <div className="flex items-center gap-3">
          <CompactCurrencyToggle />
          <CreateReportDialog />
        </div>
      </div>

      {/* Валютные настройки для просмотра отчетов */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Настройки отображения
              </CardTitle>
              <CardDescription>Выберите валютные настройки для просмотра отчетов</CardDescription>
            </div>
            <CurrencyToggleButton size="sm" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-sm text-muted-foreground">
            Все суммы в отчетах будут отображаться в соответствии с выбранными валютными настройками.
            Используйте переключатель выше для быстрого изменения режима отображения.
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>История отчётов</CardTitle>
          <CardDescription>Список всех сгенерированных отчётов с валютными настройками.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Название отчёта</TableHead>
                <TableHead>Тип</TableHead>
                <TableHead>Валютный режим</TableHead>
                <TableHead>Дата создания</TableHead>
                <TableHead>Автор</TableHead>
                <TableHead>Статус</TableHead>
                <TableHead className="text-right">Действия</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {reportsData.map((report, index) => (
                <TableRow key={report.id}>
                  <TableCell className="font-medium">{report.name}</TableCell>
                  <TableCell>
                    <Badge variant="secondary">{report.type}</Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <DollarSign className="h-3 w-3 text-muted-foreground" />
                      <span className="text-xs">
                        {index % 3 === 0 ? 'EUR (base)' : index % 3 === 1 ? 'Native' : 'Multi'}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>{report.createdAt}</TableCell>
                  <TableCell>{report.createdBy}</TableCell>
                  <TableCell>
                    <Badge className={cn(statusColors[report.status])}>{report.status}</Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="icon" title="Скачать отчет">
                      <Download className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" title="Удалить отчет">
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
