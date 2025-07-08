import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { campaignsData } from "@/lib/mock-data";
import { ChevronLeft, ChevronRight, PlusCircle } from "lucide-react";

// Helper to generate days of the month for the calendar grid
const generateCalendarDays = (year: number, month: number) => {
    const date = new Date(year, month, 1);
    const days = [];
    
    // Find the first day of the week for the current month
    const firstDayOfWeek = (date.getDay() + 6) % 7; // Monday is 0
    
    // Add blank days for the previous month
    for (let i = 0; i < firstDayOfWeek; i++) {
        days.push({ day: null, isCurrentMonth: false });
    }

    // Add days of the current month
    while (date.getMonth() === month) {
        days.push({ day: new Date(date), isCurrentMonth: true });
        date.setDate(date.getDate() + 1);
    }

    return days;
};

const weekDays = ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"];
const currentYear = 2024;
const currentMonth = 6; // July (0-indexed)
const monthName = "Июль";

const calendarDays = generateCalendarDays(currentYear, currentMonth);

const campaignsByDate = campaignsData.reduce((acc, campaign) => {
    const date = new Date(campaign.date).getDate();
    if (!acc[date]) {
        acc[date] = [];
    }
    acc[date].push(campaign);
    return acc;
}, {} as Record<number, typeof campaignsData>);

const campaignColors: Record<string, string> = {
    Email: "bg-blue-200 border-blue-400",
    Push: "bg-purple-200 border-purple-400",
    Promo: "bg-green-200 border-green-400",
};


export default function CalendarPage() {
  return (
    <div className="p-4 md:p-6 lg:p-8">
      <Card>
        <CardHeader className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
                <CardTitle>Календарь кампаний</CardTitle>
                <CardDescription>Визуальный план всех активностей с просмотром по месяцам.</CardDescription>
            </div>
            <div className="flex flex-wrap items-center gap-2">
                <div className="flex items-center gap-2">
                    <Button variant="outline" size="icon">
                        <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <span className="text-lg font-semibold">{monthName} {currentYear}</span>
                    <Button variant="outline" size="icon">
                        <ChevronRight className="h-4 w-4" />
                    </Button>
                </div>
                <Button>
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Запланировать кампанию
                </Button>
            </div>
        </CardHeader>
        <CardContent>
            <div className="grid grid-cols-7 border-t border-l">
                {weekDays.map(day => (
                    <div key={day} className="border-b border-r p-2 text-center font-semibold text-muted-foreground">{day}</div>
                ))}
                {calendarDays.map((dayInfo, index) => (
                    <div key={index} className={`h-36 border-b border-r p-2 overflow-y-auto ${dayInfo.isCurrentMonth ? '' : 'bg-muted/50'}`}>
                        {dayInfo.day && (
                            <>
                                <span className={`font-medium ${dayInfo.isCurrentMonth ? '' : 'text-muted-foreground'}`}>{dayInfo.day.getDate()}</span>
                                <div className="mt-1 space-y-1">
                                    {(campaignsByDate[dayInfo.day.getDate()] || []).map(campaign => (
                                        <div key={campaign.id} className={`rounded-md p-1 text-xs border ${campaignColors[campaign.type]}`}>
                                            {campaign.name}
                                        </div>
                                    ))}
                                </div>
                            </>
                        )}
                    </div>
                ))}
            </div>
        </CardContent>
      </Card>
    </div>
  );
}
