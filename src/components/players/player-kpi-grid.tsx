import type { PlayerKpi } from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";

export function PlayerKpiGrid({ kpis }: { kpis: PlayerKpi[] }) {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Ключевые метрики</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {kpis.map((kpi) => (
                    <div key={kpi.title} className="bg-muted/50 p-3 rounded-lg">
                        <p className="text-sm text-muted-foreground">{kpi.title}</p>
                        <p className="text-xl font-bold">{kpi.value}</p>
                    </div>
                ))}
            </CardContent>
        </Card>
    );
}
