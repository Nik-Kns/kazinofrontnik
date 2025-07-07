"use client";

import * as React from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { segmentsData } from "@/lib/mock-data";
import { Bot, Copy, Pencil, PlusCircle, Trash2 } from "lucide-react";
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


export default function SegmentsPage() {
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
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="name" className="text-right">Название</Label>
                    <Input id="name" placeholder="Например: VIP игроки" className="col-span-3" />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="description" className="text-right">Описание</Label>
                    <Textarea id="description" placeholder="Краткое описание для вашей команды" className="col-span-3" />
                  </div>
                  <div className="text-center text-muted-foreground p-4 border-2 border-dashed rounded-lg">
                    Здесь будет конструктор правил
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
