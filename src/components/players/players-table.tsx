"use client";

import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { playersData } from "@/lib/mock-data";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Button } from "../ui/button";
import { ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";

const statusColors = {
    'Активен': 'bg-success/20 text-success-foreground',
    'Спящий': 'bg-warning/20 text-warning-foreground',
    'Отток': 'bg-destructive/20 text-destructive-foreground',
};

const riskColors = {
    'Низкий': 'text-success',
    'Средний': 'text-warning',
    'Высокий': 'text-destructive',
};

export function PlayersTable() {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Список игроков</CardTitle>
                <CardDescription>Все игроки в вашей системе.</CardDescription>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Игрок</TableHead>
                            <TableHead>LTV</TableHead>
                            <TableHead>Последняя активность</TableHead>
                            <TableHead>Риск оттока</TableHead>
                            <TableHead>Статус</TableHead>
                            <TableHead className="text-right">Действия</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {playersData.map((player) => (
                            <TableRow key={player.id}>
                                <TableCell>
                                    <div className="flex items-center gap-3">
                                        <Avatar>
                                            <AvatarImage src={player.avatar} alt={player.name} data-ai-hint="person avatar" />
                                            <AvatarFallback>{player.name.charAt(0)}</AvatarFallback>
                                        </Avatar>
                                        <div>
                                            <p className="font-medium">{player.name}</p>
                                            <p className="text-xs text-muted-foreground">ID: usr_{player.id.padStart(8, '0')}</p>
                                        </div>
                                    </div>
                                </TableCell>
                                <TableCell className="font-semibold">€{player.ltv.toLocaleString()}</TableCell>
                                <TableCell>{player.lastSeen}</TableCell>
                                <TableCell>
                                    <span className={cn("font-medium", riskColors[player.churnRisk])}>{player.churnRisk}</span>
                                </TableCell>
                                <TableCell>
                                    <Badge variant="outline" className={cn(statusColors[player.status])}>{player.status}</Badge>
                                </TableCell>
                                <TableCell className="text-right">
                                    <Button asChild variant="ghost" size="icon">
                                        <Link href={`/players/${player.id}`}>
                                            <ArrowUpRight className="h-4 w-4" />
                                        </Link>
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    );
}
