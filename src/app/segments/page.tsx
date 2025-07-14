
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
  DialogClose,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/components/ui/select';
import type { SegmentData } from '@/lib/types';
import { AiCopilotChat } from '@/components/ai/ai-copilot-chat';


const segmentAttributeGroups = [
    {
      label: "Базовые атрибуты",
      attributes: [
        { value: "Country", type: "country-select", options: ["Германия", "США", "Канада", "Великобритания"] },
        { value: "Currency", type: "string" },
        { value: "Customer ID", type: "string" },
        { value: "Registration Date", type: "date" },
        { value: "Last Purchase Date", type: "date" },
        { value: "Age", type: "number" },
        { value: "Gender", type: "select", options: ["Мужской", "Женский"] },
        { value: "Language", type: "string" },
        { value: "Time Zone", type: "string" },
      ],
    },
    {
      label: "RFM и монетарные метрики",
      attributes: [
        { value: "Recency (days since last purchase)", type: "number" },
        { value: "Frequency (purchase frequency)", type: "number" },
        { value: "Monetary Value (total spend)", type: "number" },
        { value: "Average Order Value", type: "number" },
        { value: "Total Revenue", type: "number" },
        { value: "Total Orders", type: "number" },
      ],
    },
    {
      label: "Поведенческие атрибуты",
      attributes: [
        { value: "Website Sessions", type: "number" },
        { value: "Page Views", type: "number" },
        { value: "Time on Site", type: "number" }, // in seconds
        { value: "Device Type", type: "select", options: ["Desktop", "Mobile", "Tablet"] },
      ],
    },
    {
      label: "Предиктивные скоры (ИИ)",
      attributes: [
        { value: "Churn Probability", type: "percentage" },
        { value: "Predicted LTV", type: "number" },
        { value: "Engagement Score", type: "number" },
      ],
    },
    {
        label: "Жизненный цикл",
        attributes: [
            { value: "Customer Lifecycle Stage", type: "select", options: ["Lead", "Active", "At Risk", "Churned"] },
            { value: "VIP Status", type: "boolean" },
        ]
    }
];

const allAttributes = segmentAttributeGroups.flatMap(g => g.attributes);

const segmentConditions = [
    "равно", "не равно", "больше чем", "меньше чем", "содержит", "не содержит", "начинается с", "заканчивается на", "в списке", "не в списке", "заполнено", "не заполнено"
];


export default function SegmentsPage() {
    const [rules, setRules] = React.useState([{ id: 1, attribute: 'Recency (days since last purchase)', condition: 'больше чем', value: '30' }]);
    const [isDialogOpen, setIsDialogOpen] = React.useState(false);
    const [selectedSegment, setSelectedSegment] = React.useState<SegmentData | null>(null);

    const addRule = () => {
        setRules([...rules, { id: Date.now(), attribute: '', condition: '', value: '' }]);
    };

    const removeRule = (id: number) => {
        setRules(rules.filter(rule => rule.id !== id));
    };

    const handleRuleChange = (id: number, field: string, value: any) => {
        setRules(rules.map(rule => rule.id === id ? { ...rule, [field]: value } : rule));
    }

    const handleCreateClick = () => {
        setSelectedSegment(null);
        setRules([{ id: 1, attribute: 'Recency (days since last purchase)', condition: 'больше чем', value: '30' }]);
        setIsDialogOpen(true);
    }

    const handleEditClick = (segment: SegmentData) => {
        setSelectedSegment(segment);
        // Mock rules for demo
        if (segment.name.includes('VIP')) {
             setRules([{ id: 1, attribute: 'Monetary Value (total spend)', condition: 'больше чем', value: '5000' }]);
        } else {
             setRules([{ id: 1, attribute: 'Last Login Date', condition: 'больше чем', value: '7' }]);
        }
        setIsDialogOpen(true);
    }

    const renderValueInput = (rule: any) => {
        const attributeInfo = allAttributes.find(a => a.value === rule.attribute);

        if (!attributeInfo) return <Input placeholder="Значение" value={rule.value} onChange={(e) => handleRuleChange(rule.id, 'value', e.target.value)} />;
        
        switch (attributeInfo.type) {
            case 'number':
            case 'percentage':
                return <Input type="number" placeholder="Значение" value={rule.value} onChange={(e) => handleRuleChange(rule.id, 'value', e.target.value)} />;
            case 'date':
                return <Input type="date" value={rule.value} onChange={(e) => handleRuleChange(rule.id, 'value', e.target.value)} />;
            case 'boolean':
                return (
                    <Select value={rule.value} onValueChange={(value) => handleRuleChange(rule.id, 'value', value)}>
                        <SelectTrigger><SelectValue placeholder="Выберите..." /></SelectTrigger>
                        <SelectContent>
                            <SelectItem value="true">Да</SelectItem>
                            <SelectItem value="false">Нет</SelectItem>
                        </SelectContent>
                    </Select>
                );
            case 'select':
            case 'country-select':
                 return (
                    <Select value={rule.value} onValueChange={(value) => handleRuleChange(rule.id, 'value', value)}>
                        <SelectTrigger><SelectValue placeholder="Выберите..." /></SelectTrigger>
                        <SelectContent>
                            {attributeInfo.options?.map(opt => <SelectItem key={opt} value={opt}>{opt}</SelectItem>)}
                        </SelectContent>
                    </Select>
                );
            default:
                return <Input placeholder="Значение" value={rule.value} onChange={(e) => handleRuleChange(rule.id, 'value', e.target.value)} />;
        }
    }


  return (
    <div className="p-4 md:p-6 lg:p-8 space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
            <h1 className="text-2xl font-bold tracking-tight">Сегменты</h1>
            <p className="text-muted-foreground">Создание и управление сегментами пользователей для CRM-кампаний.</p>
        </div>
        <Button onClick={handleCreateClick}>
            <PlusCircle className="mr-2 h-4 w-4" />
            Создать сегмент
        </Button>
      </div>

       <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="sm:max-w-4xl" key={selectedSegment?.id ?? 'new'}>
            <DialogHeader>
              <DialogTitle>{selectedSegment ? "Редактировать сегмент" : "Создание сегмента"}</DialogTitle>
              <DialogDescription>
                {selectedSegment 
                    ? `Измените правила для сегмента "${selectedSegment.name}".`
                    : "Создайте сегмент с помощью AI или настройте правила вручную."
                }
              </DialogDescription>
            </DialogHeader>
            <Tabs defaultValue="manual" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="ai"><Bot className="mr-2 h-4 w-4"/> Создать с AI</TabsTrigger>
                <TabsTrigger value="manual"><Pencil className="mr-2 h-4 w-4"/> Ручная настройка</TabsTrigger>
              </TabsList>
              <TabsContent value="ai" className="min-h-[400px]">
                 <AiCopilotChat copilotType="segment_generator" />
              </TabsContent>
              <TabsContent value="manual">
                <div className="space-y-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="name" className="text-right">Название</Label>
                    <Input id="name" defaultValue={selectedSegment?.name} placeholder="Например: VIP игроки на грани оттока" className="col-span-3" />
                  </div>
                   <div className="p-4 border-2 border-dashed rounded-lg space-y-3">
                    <Label>Правила сегментации</Label>
                    {rules.map((rule, index) => (
                         <div key={rule.id} className="grid grid-cols-1 sm:grid-cols-4 items-center gap-2">
                            <Select value={rule.attribute} onValueChange={(value) => handleRuleChange(rule.id, 'attribute', value)}>
                                <SelectTrigger className="sm:col-span-2"><SelectValue placeholder="Атрибут" /></SelectTrigger>
                                <SelectContent>
                                    {segmentAttributeGroups.map(group => (
                                        <SelectGroup key={group.label}>
                                            <SelectLabel>{group.label}</SelectLabel>
                                            {group.attributes.map(attr => <SelectItem key={attr.value} value={attr.value}>{attr.value}</SelectItem>)}
                                        </SelectGroup>
                                    ))}
                                </SelectContent>
                            </Select>
                             <Select value={rule.condition} onValueChange={(value) => handleRuleChange(rule.id, 'condition', value)}>
                                <SelectTrigger><SelectValue placeholder="Условие" /></SelectTrigger>
                                <SelectContent>
                                    {segmentConditions.map(cond => <SelectItem key={cond} value={cond}>{cond}</SelectItem>)}
                                </SelectContent>
                            </Select>
                            <div className="flex items-center gap-2">
                                {renderValueInput(rule)}
                                <Button variant="ghost" size="icon" onClick={() => removeRule(rule.id)}>
                                    <X className="h-4 w-4" />
                                </Button>
                            </div>
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
                    <Button variant="ghost" size="icon" onClick={() => handleEditClick(segment)}>
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
