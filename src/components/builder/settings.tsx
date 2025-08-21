"use client";

import React from 'react';
import { Node } from 'reactflow';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Sheet,
    SheetClose,
    SheetContent,
    SheetDescription,
    SheetFooter,
    SheetHeader,
    SheetTitle,
} from "@/components/ui/sheet";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Textarea } from '@/components/ui/textarea';
import { Slider } from '@/components/ui/slider';

interface NodeConfigPanelProps {
    node: Node | null;
    isOpen: boolean;
    onOpenChange: (isOpen: boolean) => void;
}

export const NodeConfigPanel = ({ node, isOpen, onOpenChange }: NodeConfigPanelProps) => {
    if (!node) return null;

    const renderForm = () => {
        const configType = node.data.configType;

        switch (configType) {
            case 'segmentTrigger':
                return (
                    <div className="space-y-4">
                        <div>
                            <Label htmlFor="segment-select">Целевой сегмент</Label>
                            <Select defaultValue="churn_risk">
                                <SelectTrigger id="segment-select">
                                    <SelectValue placeholder="Выберите сегмент" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="churn_risk">Риск оттока (предиктивный)</SelectItem>
                                    <SelectItem value="high_rollers">High Rollers</SelectItem>
                                    <SelectItem value="new_players">Новые игроки</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                )
            case 'emailAction':
                return (
                    <div className="space-y-4">
                        <div>
                            <Label htmlFor="email-template">Email-шаблон</Label>
                            <Select defaultValue="discount_15">
                                <SelectTrigger id="email-template">
                                    <SelectValue placeholder="Выберите шаблон" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="discount_15">Скидка 15%</SelectItem>
                                    <SelectItem value="bonus_25fs">Бонус 25 FS</SelectItem>
                                    <SelectItem value="welcome_email">Welcome-цепочка</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div>
                            <Label htmlFor="email-subject">Тема письма</Label>
                            <Input id="email-subject" defaultValue={`Специальное предложение для вас, {player_name}!`} />
                        </div>
                    </div>
                )
            case 'ifElseLogic':
                return (
                    <div className="space-y-4">
                        <div>
                            <Label>Условие</Label>
                            <div className="flex items-center gap-2">
                                <Select defaultValue="lifetime_spend">
                                    <SelectTrigger><SelectValue /></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="lifetime_spend">Lifetime Spend</SelectItem>
                                        <SelectItem value="last_activity">Последняя активность</SelectItem>
                                        <SelectItem value="balance">Баланс</SelectContent>
                                </Select>
                                <Select defaultValue="gt">
                                    <SelectTrigger><SelectValue /></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="gt">&gt;</SelectItem>
                                        <SelectItem value="lt">&lt;</SelectItem>
                                        <SelectItem value="eq">=</SelectItem>
                                    </SelectContent>
                                </Select>
                                <Input type="number" defaultValue="1000" />
                            </div>
                        </div>
                        <p className="text-xs text-muted-foreground">Создайте условие для разделения игроков на ветки "Да" и "Нет".</p>
                    </div>
                )
            case 'abTestLogic':
                return (
                    <div className="space-y-4">
                        <Label>Разделение трафика</Label>
                        <div className="flex items-center gap-4">
                            <span className="text-sm font-medium">Ветка A</span>
                            <Slider defaultValue={[50]} max={100} step={1} />
                            <span className="text-sm font-medium">Ветка B</span>
                        </div>
                        <div className="flex justify-between text-sm font-bold text-primary">
                            <span>50%</span>
                            <span>50%</span>
                        </div>
                        <p className="text-xs text-muted-foreground">Аудитория будет случайным образом разделена в указанной пропорции для отправки разных версий сообщения.</p>
                    </div>
                )
            case 'bonusAction':
                return (
                    <div className="space-y-4">
                        <div>
                            <Label htmlFor="bonus-type">Тип бонуса</Label>
                            <Select defaultValue="freespins">
                                <SelectTrigger id="bonus-type">
                                    <SelectValue placeholder="Выберите тип" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="freespins">Фриспины</SelectItem>
                                    <SelectItem value="deposit_bonus">Бонус на депозит</SelectItem>
                                    <SelectItem value="cashback">Кэшбек</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div>
                            <Label htmlFor="bonus-amount">Количество / Процент</Label>
                            <Input id="bonus-amount" type="number" defaultValue="25" />
                        </div>
                        <div>
                            <Label htmlFor="bonus-wager">Вейджер (Wager)</Label>
                            <Input id="bonus-wager" type="number" defaultValue="40" placeholder="x40" />
                        </div>
                        <div>
                            <Label htmlFor="bonus-ttl">Срок жизни бонуса (в часах)</Label>
                            <Input id="bonus-ttl" type="number" defaultValue="72" />
                        </div>
                    </div>
                )
            default:
                return <p className="text-muted-foreground">Для этого элемента нет дополнительных настроек.</p>
        }
    }

    return (
        <Sheet open={isOpen} onOpenChange={onOpenChange}>
            <SheetContent className="sm:max-w-md">
                <SheetHeader>
                    <SheetTitle>Настройка: {node.data.label}</SheetTitle>
                    <SheetDescription>
                        Отредактируйте параметры для выбранного элемента сценария.
                    </SheetDescription>
                </SheetHeader>
                <div className="py-6">
                    {renderForm()}
                </div>
                <SheetFooter>
                    <SheetClose asChild>
                        <Button type="button" variant="secondary">Отмена</Button>
                    </SheetClose>
                    <SheetClose asChild>
                        <Button type="submit">Сохранить</Button>
                    </SheetClose>
                </SheetFooter>
            </SheetContent>
        </Sheet>
    )
}
