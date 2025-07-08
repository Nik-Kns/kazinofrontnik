import { ArrowLeft, Bot, Mail, MessageSquare, Phone } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Card, CardContent } from "../ui/card";
import Link from "next/link";
import { cn } from "@/lib/utils";

const riskColors = {
    'Низкий': 'bg-success/20 text-success-foreground border-success/30',
    'Средний': 'bg-warning/20 text-warning-foreground border-warning/30',
    'Высокий': 'bg-destructive/20 text-destructive-foreground border-destructive/30',
};

export function PlayerProfileHeader({ player }: { player: any }) {
    return (
        <Card>
            <CardContent className="p-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                     <Button asChild variant="outline" size="icon" className="h-8 w-8">
                        <Link href="/players">
                            <ArrowLeft className="h-4 w-4" />
                        </Link>
                    </Button>
                    <Avatar className="h-16 w-16">
                        <AvatarImage src={player.avatar} alt={player.name} data-ai-hint="person avatar" />
                        <AvatarFallback>{player.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">{player.name}</h1>
                        <div className="flex items-center gap-2 mt-1">
                            <Badge variant="secondary">VIP</Badge>
                            <Badge variant="secondary" className="bg-purple-100 text-purple-800">
                                <Bot className="h-3 w-3 mr-1" />
                                Предиктивный: Риск оттока
                            </Badge>
                        </div>
                    </div>
                </div>
                <div className="flex items-center gap-4 flex-wrap">
                    <div className="flex flex-col items-end">
                        <p className="text-sm text-muted-foreground">Риск оттока</p>
                        <Badge variant="outline" className={cn("text-lg", riskColors[player.churnRisk])}>
                            {player.churnRisk}
                        </Badge>
                    </div>
                    <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm"><Phone className="mr-2 h-4 w-4" /> Позвонить</Button>
                        <Button variant="outline" size="sm"><Mail className="mr-2 h-4 w-4" /> Email</Button>
                        <Button variant="default" size="sm"><MessageSquare className="mr-2 h-4 w-4" /> Написать в чат</Button>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
