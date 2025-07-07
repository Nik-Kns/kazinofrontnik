"use client";

import * as React from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { segmentsData } from "@/lib/mock-data";
import { Bot, Copy, Pencil, PlusCircle, Trash2, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';


const segmentAttributes = [
    "Recency", "Frequency", "Monetary Value", "Country", "Age", "Gender", "Last Login Date", "Churn Probability", "Total Revenue"
];
const segmentConditions = [
    "равно", "не равно", "больше чем", "меньше чем", "содержит", "не содержит"
];


export default function SegmentsPage() {
    const [rules, setRules] = React.useState([{ id: 1, attribute: 'Recency', condition: 'больше чем', value: '30' }]);

    const addRule = () => {
        setRules([...rules, { id: Date.now(), attribute: '', condition: '', value: '' }]);
    };

    const removeRule = (id: number) => {
        setRules(rules.filter(rule => rule.id !== id));
    };

  return (
    <div className="p-4 md:p-6 lg:p-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
            <h1 className="text-2xl font-bold tracking-tight">Сегменты</h1>
            <p className="text-muted-foreground">Создание и управление сегментами пользователей для CRM-кампаний.</p>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button>
                <PlusCircle className="mr-2 h-4 w-4" />
                Создать сегмент
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[625px]">
            <DialogHeader>
              <DialogTitle>Создание сегмента</DialogTitle>
              <DialogDescription>
                Создайте сегмент с помощью AI или настройте правила вручную.
              </DialogDescription>
            </DialogHeader>
            <Tabs defaultValue="ai" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="ai"><Bot className="mr-2 h-4 w-4"/> Создать с AI</TabsTrigger>
                <TabsTrigger value="manual"><Pencil className="mr-2 h-4 w-4"/> Ручная настройка</TabsTrigger>
              </TabsList>
              <TabsContent value="ai">
                 <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label htmlFor="ai-description">Опишите сегмент</Label>
                    <Textarea id="ai-description" placeholder="Например: 'Высокодоходные игроки, которые давно не заходили в игру, но часто покупали дорогие предметы'" className="min-h-[100px]" />
                    <p className="text-xs text-muted-foreground">Наш AI проанализирует ваш запрос и создаст набор правил.</p>
                  </div>
                  <Button type="submit" className="w-full">
                    <Bot className="mr-2 h-4 w-4" />
                    Сгенерировать правила
                  </Button>
                </div>
              </TabsContent>
              <TabsContent value="manual">
                <div className="space-y-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="name" className="text-right">Название</Label>
                    <Input id="name" placeholder="Например: VIP игроки на грани оттока" className="col-span-3" />
                  </div>
                   <div className="p-4 border-2 border-dashed rounded-lg space-y-3">
                    <Label>Правила сегментации</Label>
                    {rules.map((rule, index) => (
                         <div key={rule.id} className="flex items-center gap-2">
                            <Select defaultValue={rule.attribute}>
                                <SelectTrigger><SelectValue placeholder="Атрибут" /></SelectTrigger>
                                <SelectContent>
                                    {segmentAttributes.map(attr => <SelectItem key={attr} value={attr}>{attr}</SelectItem>)}
                                </SelectContent>
                            </Select>
                             <Select defaultValue={rule.condition}>
                                <SelectTrigger><SelectValue placeholder="Условие" /></SelectTrigger>
                                <SelectContent>
                                    {segmentConditions.map(cond => <SelectItem key={cond} value={cond}>{cond}</SelectItem>)}
                                </SelectContent>
                            </Select>
                            <Input placeholder="Значение" defaultValue={rule.value} />
                            <Button variant="ghost" size="icon" onClick={() => removeRule(rule.id)} disabled={rules.length <= 1}>
                                <X className="h-4 w-4" />
                            </Button>
                         </div>
                    ))}

                    <Button variant="outline" size="sm" onClick={addRule}>
                        <PlusCircle className="mr-2 h-4 w-4"/>
                        Добавить правило
                    </Button>
                   </div>
                </div>
              </TabsContent>
            </Tabs>
            <DialogFooter>
              <DialogClose asChild>
                <Button type="button" variant="secondary">Отмена</Button>
              </DialogClose>
              <Button type="submit">Сохранить сегмент</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
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
