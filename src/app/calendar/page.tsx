"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { campaignsData } from "@/lib/mock-data";
import { ChevronLeft, ChevronRight, PlusCircle } from "lucide-react";
import { useState, useRef } from "react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { MultiSelect } from "@/components/ui/multi-select";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

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

const campaignColors: Record<string, string> = {
    Email: "bg-blue-200 border-blue-400",
    Push: "bg-purple-200 border-purple-400",
    Promo: "bg-green-200 border-green-400",
};


export default function CalendarPage() {
  const [view, setView] = useState("month");
  const [selectedType, setSelectedType] = useState<string[]>([]);
  const [selectedChannel, setSelectedChannel] = useState<string[]>([]);
  const [selectedLang, setSelectedLang] = useState<string[]>([]);
  const [selectedSegment, setSelectedSegment] = useState<string[]>([]);
  const [selectedStatus, setSelectedStatus] = useState<string[]>([]);
  const [selectedCampaign, setSelectedCampaign] = useState<any>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [hoveredDay, setHoveredDay] = useState<number | null>(null);
  const [tooltipPos, setTooltipPos] = useState<{x: number, y: number} | null>(null);
  const calendarRef = useRef<HTMLDivElement>(null);

  // Фильтрация кампаний
  const filteredCampaigns = campaignsData.filter(c => {
    if (selectedType.length && !selectedType.includes(c.typeDetail)) return false;
    if (selectedChannel.length && !selectedChannel.includes(c.channel)) return false;
    if (selectedLang.length && !selectedLang.includes(c.language)) return false;
    if (selectedSegment.length && !selectedSegment.includes(c.segment)) return false;
    if (selectedStatus.length && !selectedStatus.includes(c.status)) return false;
    return true;
  });

  // campaignsByDate теперь строится по filteredCampaigns
  const campaignsByDate = filteredCampaigns.reduce((acc, campaign) => {
    const date = new Date(campaign.date).getDate();
    if (!acc[date]) acc[date] = [];
    acc[date].push(campaign);
    return acc;
  }, {} as Record<number, typeof campaignsData>);

  // Helper для цвета бейджа по типу
  const badgeColor = (type: string) => {
    switch (type) {
      case 'Email': return 'bg-blue-200 border-blue-400 text-blue-900';
      case 'Push': return 'bg-purple-200 border-purple-400 text-purple-900';
      case 'Promo': return 'bg-green-200 border-green-400 text-green-900';
      case 'InApp': return 'bg-yellow-200 border-yellow-400 text-yellow-900';
      case 'SMS': return 'bg-pink-200 border-pink-400 text-pink-900';
      default: return 'bg-gray-200 border-gray-400 text-gray-900';
    }
  };

  return (
    <div className="p-4 md:p-6 lg:p-8" ref={calendarRef}>
      <Card>
        <CardHeader className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <CardTitle>Календарь кампаний</CardTitle>
            <CardDescription>Визуальный план всех активностей с просмотром по месяцам и неделям.</CardDescription>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Tabs value={view} onValueChange={setView} className="mr-4">
              <TabsList>
                <TabsTrigger value="month">Месяц</TabsTrigger>
                <TabsTrigger value="week">Неделя</TabsTrigger>
              </TabsList>
            </Tabs>
            <Button>
              <PlusCircle className="mr-2 h-4 w-4" />
              Запланировать кампанию
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2 mb-4">
            <MultiSelect
              options={[{label:'Промо',value:'промо'},{label:'Цепочка',value:'цепочка'},{label:'Индивидуальная',value:'индивидуальная'},{label:'Return',value:'return'},{label:'Турнир',value:'турнир'},{label:'Опрос',value:'опрос'}]}
              value={selectedType}
              onChange={setSelectedType}
              placeholder="Тип кампании"
              className="w-40"
            />
            <MultiSelect
              options={[{label:'Email',value:'Email'},{label:'Push',value:'Push'},{label:'InApp',value:'InApp'},{label:'SMS',value:'SMS'}]}
              value={selectedChannel}
              onChange={setSelectedChannel}
              placeholder="Канал"
              className="w-32"
            />
            <MultiSelect
              options={[{label:'RU',value:'RU'},{label:'EN',value:'EN'},{label:'DE',value:'DE'}]}
              value={selectedLang}
              onChange={setSelectedLang}
              placeholder="Язык"
              className="w-24"
            />
            <MultiSelect
              options={[{label:'Новые игроки',value:'Новые игроки'},{label:'Любители слотов',value:'Любители слотов'},{label:'Спящие',value:'Спящие'},{label:'VIP',value:'VIP'},{label:'Все активные',value:'Все активные'},{label:'Активные 90д',value:'Активные 90д'},{label:'Без депозита',value:'Без депозита'},{label:'Все',value:'Все'}]}
              value={selectedSegment}
              onChange={setSelectedSegment}
              placeholder="Сегмент"
              className="w-44"
            />
            <MultiSelect
              options={[{label:'Активна',value:'active'},{label:'Пауза',value:'paused'},{label:'Завершена',value:'completed'}]}
              value={selectedStatus}
              onChange={setSelectedStatus}
              placeholder="Статус"
              className="w-32"
            />
          </div>
          {/* Календарь: месяц или неделя */}
          <TooltipProvider>
          {view === "month" ? (
            <div className="grid grid-cols-7 border-t border-l relative">
              {weekDays.map(day => (
                <div key={day} className="border-b border-r p-2 text-center font-semibold text-muted-foreground">{day}</div>
              ))}
              {calendarDays.map((dayInfo, index) => {
                const day = dayInfo.day?.getDate();
                const events = day ? (campaignsByDate[day] || []) : [];
                return (
                  <div
                    key={index}
                    className={`h-36 border-b border-r p-2 overflow-y-auto group ${dayInfo.isCurrentMonth ? '' : 'bg-muted/50'}`}
                    onMouseEnter={e => {
                      if (events.length) {
                        setHoveredDay(day || null);
                        setTooltipPos({ x: e.clientX, y: e.clientY });
                      }
                    }}
                    onMouseLeave={() => { setHoveredDay(null); setTooltipPos(null); }}
                  >
                    {dayInfo.day && (
                      <>
                        <span className={`font-medium ${dayInfo.isCurrentMonth ? '' : 'text-muted-foreground'}`}>{dayInfo.day.getDate()}</span>
                        <div className="mt-1 flex flex-col gap-1">
                          {events.slice(0, 4).map((campaign, i) => (
                            <div
                              key={campaign.id}
                              className={`rounded px-1 py-0.5 text-xs border truncate cursor-pointer ${badgeColor(campaign.type)}`}
                              onClick={() => { setSelectedCampaign(campaign); setDialogOpen(true); }}
                              title={campaign.name}
                              style={{ zIndex: 2 + i }}
                            >
                              {campaign.name}
                            </div>
                          ))}
                          {events.length > 4 && (
                            <div className="text-xs text-muted-foreground">+{events.length - 4} ещё</div>
                          )}
                        </div>
                        {/* Оверлей при наведении */}
                        {hoveredDay === day && tooltipPos && (
                          <div
                            className="absolute z-50 bg-white border rounded shadow-lg p-2 text-xs min-w-[180px]"
                            style={{ left: tooltipPos.x - (calendarRef.current?.getBoundingClientRect().left || 0) + 10, top: tooltipPos.y - (calendarRef.current?.getBoundingClientRect().top || 0) + 10 }}
                          >
                            <b>Коммуникации:</b>
                            <ul className="mt-1 space-y-1">
                              {events.map(ev => (
                                <li key={ev.id} className="flex items-center gap-1">
                                  <span className={`inline-block w-2 h-2 rounded-full ${ev.status === 'active' ? 'bg-green-500' : ev.status === 'paused' ? 'bg-yellow-400' : 'bg-gray-400'}`}></span>
                                  <span>{ev.name}</span>
                                  <span className="ml-auto text-muted-foreground">{ev.status}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </>
                    )}
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="grid grid-cols-7 border-t border-l relative">
              {/* Неделя: показываем только текущую неделю месяца */}
              {weekDays.map(day => (
                <div key={day} className="border-b border-r p-2 text-center font-semibold text-muted-foreground">{day}</div>
              ))}
              {/* Для простоты: показываем первую неделю месяца */}
              {calendarDays.slice(0, 7).map((dayInfo, index) => {
                const day = dayInfo.day?.getDate();
                const events = day ? (campaignsByDate[day] || []) : [];
                return (
                  <div
                    key={index}
                    className={`h-36 border-b border-r p-2 overflow-y-auto group ${dayInfo.isCurrentMonth ? '' : 'bg-muted/50'}`}
                    onMouseEnter={e => {
                      if (events.length) {
                        setHoveredDay(day || null);
                        setTooltipPos({ x: e.clientX, y: e.clientY });
                      }
                    }}
                    onMouseLeave={() => { setHoveredDay(null); setTooltipPos(null); }}
                  >
                    {dayInfo.day && (
                      <>
                        <span className={`font-medium ${dayInfo.isCurrentMonth ? '' : 'text-muted-foreground'}`}>{dayInfo.day.getDate()}</span>
                        <div className="mt-1 flex flex-col gap-1">
                          {events.slice(0, 4).map((campaign, i) => (
                            <div
                              key={campaign.id}
                              className={`rounded px-1 py-0.5 text-xs border truncate cursor-pointer ${badgeColor(campaign.type)}`}
                              onClick={() => { setSelectedCampaign(campaign); setDialogOpen(true); }}
                              title={campaign.name}
                              style={{ zIndex: 2 + i }}
                            >
                              {campaign.name}
                            </div>
                          ))}
                          {events.length > 4 && (
                            <div className="text-xs text-muted-foreground">+{events.length - 4} ещё</div>
                          )}
                        </div>
                        {/* Оверлей при наведении */}
                        {hoveredDay === day && tooltipPos && (
                          <div
                            className="absolute z-50 bg-white border rounded shadow-lg p-2 text-xs min-w-[180px]"
                            style={{ left: tooltipPos.x - (calendarRef.current?.getBoundingClientRect().left || 0) + 10, top: tooltipPos.y - (calendarRef.current?.getBoundingClientRect().top || 0) + 10 }}
                          >
                            <b>Коммуникации:</b>
                            <ul className="mt-1 space-y-1">
                              {events.map(ev => (
                                <li key={ev.id} className="flex items-center gap-1">
                                  <span className={`inline-block w-2 h-2 rounded-full ${ev.status === 'active' ? 'bg-green-500' : ev.status === 'paused' ? 'bg-yellow-400' : 'bg-gray-400'}`}></span>
                                  <span>{ev.name}</span>
                                  <span className="ml-auto text-muted-foreground">{ev.status}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </>
                    )}
                  </div>
                );
              })}
            </div>
          )}
          </TooltipProvider>
          {/* Диалог карточки кампании */}
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogContent className="max-w-lg">
              {selectedCampaign && (
                <>
                  <DialogHeader>
                    <DialogTitle>{selectedCampaign.name}</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-2">
                    <div className="flex flex-wrap gap-2">
                      <Badge>{selectedCampaign.typeDetail}</Badge>
                      <Badge>{selectedCampaign.status}</Badge>
                      <Badge>{selectedCampaign.channel}</Badge>
                      <Badge>{selectedCampaign.language}</Badge>
                      <Badge>{selectedCampaign.segment}</Badge>
                    </div>
                    <div><b>Цель:</b> {selectedCampaign.goal}</div>
                    <div><b>Оффер/бонус:</b> {selectedCampaign.offer}</div>
                    <div><b>Триггер:</b> {selectedCampaign.triggers}</div>
                    <div><b>Тексты:</b> {selectedCampaign.texts}</div>
                    {selectedCampaign.media && <div><b>Медиа:</b> {selectedCampaign.media}</div>}
                  </div>
                  <DialogFooter className="flex flex-row gap-2 justify-end">
                    <Button variant="outline" onClick={() => {/* TODO: клон */}}>Клонировать</Button>
                    <Button variant="outline" onClick={() => {/* TODO: edit */}}>Редактировать</Button>
                    <Button variant="destructive" onClick={() => {/* TODO: pause/stop */}}>{selectedCampaign.status === 'active' ? 'Приостановить' : 'Активировать'}</Button>
                  </DialogFooter>
                </>
              )}
            </DialogContent>
          </Dialog>
        </CardContent>
      </Card>
    </div>
  );
}
