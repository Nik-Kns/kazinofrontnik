import type { PlayerActivityEvent } from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { cn } from "@/lib/utils";

const eventColors = {
    deposit: "bg-green-500",
    win: "bg-green-500",
    bet: "bg-red-500",
    session: "bg-blue-500",
    communication: "bg-purple-500",
    note: "bg-yellow-500",
};

export function PlayerActivityFeed({ events }: { events: PlayerActivityEvent[] }) {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Лента событий</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="relative pl-6">
                    <div className="absolute left-0 top-0 h-full w-0.5 bg-border -translate-x-1/2" />
                    {events.map((event) => {
                        const Icon = event.icon;
                        return (
                            <div key={event.id} className="relative flex items-start gap-4 pb-8">
                                <div className={cn("absolute left-0 top-1 h-3 w-3 rounded-full -translate-x-1/2", eventColors[event.type])} />
                                <div className="pt-0.5">
                                    <Icon className="h-5 w-5 text-muted-foreground" />
                                </div>
                                <div className="flex-1">
                                    <div className="flex items-center justify-between">
                                        <p className="font-semibold">{event.title}</p>
                                        <p className="text-xs text-muted-foreground">{event.timestamp}</p>
                                    </div>
                                    <p className="text-sm text-muted-foreground">{event.details}</p>
                                    {event.value && (
                                        <p className={`text-sm font-bold ${event.value.startsWith('+') ? 'text-success' : 'text-destructive'}`}>{event.value}</p>
                                    )}
                                </div>
                            </div>
                        )
                    })}
                </div>
            </CardContent>
        </Card>
    );
}
