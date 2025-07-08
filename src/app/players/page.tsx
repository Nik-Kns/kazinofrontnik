import { PlayersTable } from "@/components/players/players-table";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";

export default function PlayersPage() {
    return (
        <div className="p-4 md:p-6 lg:p-8 space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Игроки</h1>
                    <p className="text-muted-foreground">
                        Поиск, фильтрация и просмотр профилей игроков.
                    </p>
                </div>
                <Button>
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Добавить игрока
                </Button>
            </div>
            <PlayersTable />
        </div>
    );
}
