"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Brain, TrendingUp, AlertTriangle, Lightbulb } from "lucide-react";
import { campaignsData } from "@/lib/mock-data";
import { ChevronLeft, ChevronRight, PlusCircle, ArrowLeft, DollarSign, Settings } from "lucide-react";
import { useState, useRef } from "react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { MultiSelect } from "@/components/ui/multi-select";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { CompactCurrencyToggle, CurrencyToggleButton } from "@/components/ui/currency-toggle";
import { CurrencyBadge, CurrencyAmountDisplay } from "@/components/ui/currency-badge";
import { useCurrency } from "@/contexts/currency-context";
import { formatCurrency } from "@/lib/currency-utils";
import dynamic from "next/dynamic";

// Тип для событий кампаний в календаре
interface CalendarCampaignEvent {
  id: string;
  name: string;
  date: string; // ISO YYYY-MM-DD
  type: string; // Email | Push | InApp | SMS | Promo
  typeDetail: string; // категория сценария
  channel: string;
  status: 'active' | 'paused' | 'completed';
  segment: string;
  goal: string;
  language: string; // RU/EN/DE
  offer: string;
  triggers: string;
  texts: string;
  media: string | null;
  deliveryRate: string | number;
  openRate: string | number;
  ctr: string | number;
  cr: string | number;
}

// Динамически импортируем конструктор сценариев для избежания SSR проблем
const ScenariosBuilder = dynamic(() => import("@/app/triggers/page"), { ssr: false });

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

// Преобразование данных кампаний для календаря
const adaptCampaignsForCalendar = (): CalendarCampaignEvent[] => {
  const calendarCampaigns: CalendarCampaignEvent[] = [];
  
  // Создаем события из сценариев внутри кампаний
  campaignsData.forEach(campaign => {
    campaign.scenarios.forEach(scenario => {
      // Генерируем даты для сценариев в текущем месяце
      const dates = [
        `2024-07-05`, `2024-07-08`, `2024-07-12`, `2024-07-15`, 
        `2024-07-18`, `2024-07-22`, `2024-07-25`, `2024-07-28`
      ];
      
      dates.forEach((date, index) => {
        if (Math.random() > 0.6) { // Случайное распределение
          calendarCampaigns.push({
            id: `${scenario.id}_${index}`,
            name: scenario.name,
            date: date,
            type: scenario.channel,
            typeDetail: scenario.category,
            channel: scenario.channel,
            status: scenario.status === 'Активен' ? 'active' : scenario.status === 'Пауза' ? 'paused' : 'completed',
            segment: scenario.segment,
            goal: scenario.goal,
            language: scenario.geo?.[0] || 'RU',
            offer: campaign.description || 'Специальное предложение',
            triggers: scenario.frequency,
            texts: `Контент для ${scenario.name}`,
            media: scenario.channel === 'Email' ? 'Banner 1200x400' : null,
            deliveryRate: scenario.deliveryRate,
            openRate: scenario.openRate,
            ctr: scenario.ctr,
            cr: scenario.cr
          });
        }
      });
    });
  });
  
  return calendarCampaigns;
};

const calendarCampaignsData = adaptCampaignsForCalendar();

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
  
  // Состояния для конструктора сценариев
  const [isBuilderOpen, setIsBuilderOpen] = useState(false);
  const [editingScenario, setEditingScenario] = useState<any | null>(null);
  
  // Валютные настройки
  const { state: currencyState } = useCurrency();

  // Фильтрация кампаний
  const filteredCampaigns = calendarCampaignsData.filter(c => {
    if (selectedType.length && !selectedType.includes(c.typeDetail)) return false;
    if (selectedChannel.length && !selectedChannel.includes(c.channel)) return false;
    if (selectedLang.length && !selectedLang.includes(c.language)) return false;
    if (selectedSegment.length && !selectedSegment.includes(c.segment)) return false;
    if (selectedStatus.length && !selectedStatus.includes(c.status)) return false;
    return true;
  });

  // campaignsByDate строится по filteredCampaigns
  const campaignsByDate: Record<number, CalendarCampaignEvent[]> = filteredCampaigns.reduce((acc, campaign) => {
    const date = new Date(campaign.date).getDate();
    if (!acc[date]) acc[date] = [];
    acc[date].push(campaign);
    return acc;
  }, {} as Record<number, CalendarCampaignEvent[]>);

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

  // Обработчики для работы с конструктором
  const handleEditClick = (campaign: any) => {
    setEditingScenario(campaign);
    setIsBuilderOpen(true);
    setDialogOpen(false); // Закрываем диалог
  };

  const handleBuilderClose = () => {
    setIsBuilderOpen(false);
    setEditingScenario(null);
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
            <CompactCurrencyToggle />
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
              selected={selectedType}
              onChange={setSelectedType}
              placeholder="Тип кампании"
              className="w-40"
            />
            <MultiSelect
              options={[{label:'Email',value:'Email'},{label:'Push',value:'Push'},{label:'InApp',value:'InApp'},{label:'SMS',value:'SMS'}]}
              selected={selectedChannel}
              onChange={setSelectedChannel}
              placeholder="Канал"
              className="w-32"
            />
            <MultiSelect
              options={[{label:'RU',value:'RU'},{label:'EN',value:'EN'},{label:'DE',value:'DE'}]}
              selected={selectedLang}
              onChange={setSelectedLang}
              placeholder="Язык"
              className="w-24"
            />
            <MultiSelect
              options={[{label:'Новые игроки',value:'Новые игроки'},{label:'Любители слотов',value:'Любители слотов'},{label:'Спящие',value:'Спящие'},{label:'VIP',value:'VIP'},{label:'Все активные',value:'Все активные'},{label:'Активные 90д',value:'Активные 90д'},{label:'Без депозита',value:'Без депозита'},{label:'Все',value:'Все'}]}
              selected={selectedSegment}
              onChange={setSelectedSegment}
              placeholder="Сегмент"
              className="w-44"
            />
            <MultiSelect
              options={[{label:'Активна',value:'active'},{label:'Пауза',value:'paused'},{label:'Завершена',value:'completed'}]}
              selected={selectedStatus}
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
                            <Tooltip key={campaign.id}>
                              <TooltipTrigger asChild>
                                <div
                                  className={`rounded px-1 py-0.5 text-xs border truncate cursor-pointer hover:shadow-sm transition-shadow ${badgeColor(campaign.type)}`}
                                  onClick={() => { setSelectedCampaign(campaign); setDialogOpen(true); }}
                                  style={{ zIndex: 2 + i }}
                                >
                                  {campaign.name}
                                </div>
                              </TooltipTrigger>
                              <TooltipContent side="right" className="max-w-xs">
                                <div className="space-y-1">
                                  <p className="font-medium">{campaign.name}</p>
                                  <p className="text-xs"><span className="font-medium">Канал:</span> {campaign.channel}</p>
                                  <p className="text-xs"><span className="font-medium">Сегмент:</span> {campaign.segment}</p>
                                  <p className="text-xs"><span className="font-medium">Статус:</span> <span className={`${campaign.status === 'active' ? 'text-green-600' : campaign.status === 'paused' ? 'text-yellow-600' : 'text-gray-600'}`}>{campaign.status}</span></p>
                                  <p className="text-xs"><span className="font-medium">Цель:</span> {campaign.goal}</p>
                                </div>
                              </TooltipContent>
                            </Tooltip>
                          ))}
                          {events.length > 4 && (
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <div 
                                  className="text-xs text-blue-600 font-semibold cursor-pointer mt-1 hover:text-blue-800 transition-colors"
                                  onClick={() => {
                                    // TODO: Открыть диалог со всеми событиями за день
                                    console.log('Показать все события за день:', events);
                                  }}
                                >
                                  +{events.length - 4} ещё
                                </div>
                              </TooltipTrigger>
                              <TooltipContent side="right" className="max-w-sm">
                                <div className="space-y-1">
                                  <p className="font-medium">Остальные события ({events.length - 4}):</p>
                                  {events.slice(4).map(event => (
                                    <p key={event.id} className="text-xs">• {event.name}</p>
                                  ))}
                                </div>
                              </TooltipContent>
                            </Tooltip>
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
                            <Tooltip key={campaign.id}>
                              <TooltipTrigger asChild>
                                <div
                                  className={`rounded px-1 py-0.5 text-xs border truncate cursor-pointer hover:shadow-sm transition-shadow ${badgeColor(campaign.type)}`}
                                  onClick={() => { setSelectedCampaign(campaign); setDialogOpen(true); }}
                                  style={{ zIndex: 2 + i }}
                                >
                                  {campaign.name}
                                </div>
                              </TooltipTrigger>
                              <TooltipContent side="right" className="max-w-xs">
                                <div className="space-y-1">
                                  <p className="font-medium">{campaign.name}</p>
                                  <p className="text-xs"><span className="font-medium">Канал:</span> {campaign.channel}</p>
                                  <p className="text-xs"><span className="font-medium">Сегмент:</span> {campaign.segment}</p>
                                  <p className="text-xs"><span className="font-medium">Статус:</span> <span className={`${campaign.status === 'active' ? 'text-green-600' : campaign.status === 'paused' ? 'text-yellow-600' : 'text-gray-600'}`}>{campaign.status}</span></p>
                                  <p className="text-xs"><span className="font-medium">Цель:</span> {campaign.goal}</p>
                                </div>
                              </TooltipContent>
                            </Tooltip>
                          ))}
                          {events.length > 4 && (
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <div 
                                  className="text-xs text-blue-600 font-semibold cursor-pointer mt-1 hover:text-blue-800 transition-colors"
                                  onClick={() => {
                                    // TODO: Открыть диалог со всеми событиями за день
                                    console.log('Показать все события за день:', events);
                                  }}
                                >
                                  +{events.length - 4} ещё
                                </div>
                              </TooltipTrigger>
                              <TooltipContent side="right" className="max-w-sm">
                                <div className="space-y-1">
                                  <p className="font-medium">Остальные события ({events.length - 4}):</p>
                                  {events.slice(4).map(event => (
                                    <p key={event.id} className="text-xs">• {event.name}</p>
                                  ))}
                                </div>
                              </TooltipContent>
                            </Tooltip>
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
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              {selectedCampaign && (
                <>
                  <DialogHeader>
                    <DialogTitle>{selectedCampaign.name}</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
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

                    {/* === СТАТИСТИКА ЭФФЕКТИВНОСТИ === */}
                    <div className="mt-6 pt-4 border-t">
                      <div className="flex items-center justify-between mb-4">
                        <h4 className="font-semibold text-lg">Статистика эффективности</h4>
                        <div className="flex items-center gap-2">
                          <CurrencyToggleButton size="sm" />
                          <CurrencyBadge currency={currencyState.base_currency || 'EUR'} showFlag size="sm" />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div className="p-3 bg-muted rounded-lg">
                          <div className="text-muted-foreground mb-1">Delivery Rate</div>
                          <div className="font-bold text-xl text-green-600">98.5%</div>
                        </div>
                        <div className="p-3 bg-muted rounded-lg">
                          <div className="text-muted-foreground mb-1">Open Rate</div>
                          <div className="font-bold text-xl">42.1%</div>
                        </div>
                        <div className="p-3 bg-muted rounded-lg">
                          <div className="text-muted-foreground mb-1">Click-Through Rate (CTR)</div>
                          <div className="font-bold text-xl">15.8%</div>
                        </div>
                        <div className="p-3 bg-muted rounded-lg">
                          <div className="text-muted-foreground mb-1">Conversion Rate (CR)</div>
                          <div className="font-bold text-xl text-green-600">9.2%</div>
                        </div>
                        <div className="p-3 bg-muted rounded-lg">
                          <div className="text-muted-foreground mb-1">
                            Доход (Revenue)
                            {currencyState.show_in_base_currency && (
                              <span className="ml-1 text-xs">
                                в {currencyState.base_currency || 'EUR'}
                              </span>
                            )}
                          </div>
                          <div className="font-bold text-xl">
                            {currencyState.show_in_base_currency 
                              ? formatCurrency(1230, currencyState.base_currency || 'EUR')
                              : "€1,230 • $1,340 • £1,080"
                            }
                          </div>
                        </div>
                        <div className="p-3 bg-muted rounded-lg">
                          <div className="text-muted-foreground mb-1">ROI</div>
                          <div className="font-bold text-xl text-green-600">185%</div>
                        </div>
                      </div>
                      
                      {/* Дополнительные метрики */}
                      <div className="mt-4">
                        <h5 className="font-medium mb-2">Детальные показатели</h5>
                        <div className="grid grid-cols-3 gap-3 text-sm">
                          <div className="p-2 bg-slate-50 rounded">
                            <div className="text-muted-foreground">Отправлено</div>
                            <div className="font-semibold">2,450</div>
                          </div>
                          <div className="p-2 bg-slate-50 rounded">
                            <div className="text-muted-foreground">Доставлено</div>
                            <div className="font-semibold">2,413</div>
                          </div>
                          <div className="p-2 bg-slate-50 rounded">
                            <div className="text-muted-foreground">Открыто</div>
                            <div className="font-semibold">1,016</div>
                          </div>
                          <div className="p-2 bg-slate-50 rounded">
                            <div className="text-muted-foreground">Кликов</div>
                            <div className="font-semibold">381</div>
                          </div>
                          <div className="p-2 bg-slate-50 rounded">
                            <div className="text-muted-foreground">Конверсий</div>
                            <div className="font-semibold">35</div>
                          </div>
                          <div className="p-2 bg-slate-50 rounded">
                            <div className="text-muted-foreground">Средний депозит</div>
                            <div className="font-semibold">
                              {currencyState.show_in_base_currency 
                                ? formatCurrency(35.14, currencyState.base_currency || 'EUR')
                                : "€35.14"
                              }
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Влияние на retention */}
                      <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                        <div className="flex items-center gap-2">
                          <span className="font-medium">Влияние на Retention:</span>
                          <span className="font-bold text-blue-600">+12.5%</span>
                        </div>
                        <div className="text-sm text-muted-foreground mt-1">
                          Игроки, получившие эту коммуникацию, на 12.5% чаще возвращаются в течение 7 дней
                        </div>
                      </div>
                    </div>
                  </div>
                  <DialogFooter className="flex flex-row gap-2 justify-end pt-4">
                    <Button variant="outline" onClick={() => {/* TODO: клон */}}>Клонировать</Button>
                    <Button variant="outline" onClick={() => handleEditClick(selectedCampaign)}>Редактировать</Button>
                    <Button variant="destructive" onClick={() => {/* TODO: pause/stop */}}>{selectedCampaign.status === 'active' ? 'Приостановить' : 'Активировать'}</Button>
                  </DialogFooter>
                </>
              )}
            </DialogContent>
          </Dialog>
        </CardContent>
      </Card>

      {/* AI Рекомендации */}
      <Card className="mt-6">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Brain className="h-5 w-5 text-blue-600" />
            <CardTitle>AI Рекомендации</CardTitle>
          </div>
          <CardDescription>
            Персонализированные инсайты и предложения на основе анализа календаря кампаний
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            {/* Оптимизация расписания */}
            <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
              <div className="flex items-start gap-3">
                <TrendingUp className="h-5 w-5 text-blue-600 mt-0.5" />
                <div className="space-y-2 flex-1">
                  <h4 className="font-semibold text-blue-900">Оптимизация расписания</h4>
                  <p className="text-sm text-blue-700">
                    Обнаружено перекрытие кампаний для сегмента "VIP" 15 и 18 июля. 
                    Рекомендуем перенести кампанию "Турнир выходного дня" на 20 июля для 
                    избежания усталости от коммуникаций.
                  </p>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" className="text-blue-600 border-blue-300 hover:bg-blue-100">
                      Применить рекомендацию
                    </Button>
                    <Button size="sm" variant="ghost" className="text-blue-600">
                      Подробнее
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            {/* Предупреждение о конфликтах */}
            <div className="p-4 bg-amber-50 rounded-lg border border-amber-200">
              <div className="flex items-start gap-3">
                <AlertTriangle className="h-5 w-5 text-amber-600 mt-0.5" />
                <div className="space-y-2 flex-1">
                  <h4 className="font-semibold text-amber-900">Конфликт каналов</h4>
                  <p className="text-sm text-amber-700">
                    22 июля запланировано 3 email-кампании для сегмента "Новые игроки". 
                    Высокий риск снижения Open Rate из-за перегрузки канала. 
                    Рекомендуем использовать мультиканальный подход: Email + Push + InApp.
                  </p>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" className="text-amber-600 border-amber-300 hover:bg-amber-100">
                      Перераспределить каналы
                    </Button>
                    <Button size="sm" variant="ghost" className="text-amber-600">
                      Игнорировать
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            {/* Новые возможности */}
            <div className="p-4 bg-green-50 rounded-lg border border-green-200">
              <div className="flex items-start gap-3">
                <Lightbulb className="h-5 w-5 text-green-600 mt-0.5" />
                <div className="space-y-2 flex-1">
                  <h4 className="font-semibold text-green-900">Упущенная возможность</h4>
                  <p className="text-sm text-green-700">
                    Сегмент "Спящие игроки" не имеет запланированных кампаний на последнюю 
                    неделю июля. На основе исторических данных, реактивационная кампания 
                    в этот период может принести дополнительно €45,000 в GGR.
                  </p>
                  <div className="flex gap-2">
                    <Button size="sm" className="bg-green-600 hover:bg-green-700 text-white">
                      Создать кампанию с AI
                    </Button>
                    <Button size="sm" variant="ghost" className="text-green-600">
                      Анализ данных
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            {/* Прогноз эффективности */}
            <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
              <div className="flex items-start gap-3">
                <Brain className="h-5 w-5 text-purple-600 mt-0.5" />
                <div className="space-y-2 flex-1">
                  <h4 className="font-semibold text-purple-900">Прогноз месяца</h4>
                  <p className="text-sm text-purple-700">
                    На основе текущего расписания кампаний прогнозируемые показатели на июль:
                  </p>
                  <div className="grid grid-cols-3 gap-3 mt-2">
                    <div className="bg-white p-2 rounded border border-purple-200">
                      <div className="text-xs text-purple-600">Охват</div>
                      <div className="font-bold text-purple-900">85.4%</div>
                      <div className="text-xs text-green-600">↑ 12% vs июнь</div>
                    </div>
                    <div className="bg-white p-2 rounded border border-purple-200">
                      <div className="text-xs text-purple-600">Ожидаемый GGR</div>
                      <div className="font-bold text-purple-900">€425K</div>
                      <div className="text-xs text-green-600">↑ 8% vs июнь</div>
                    </div>
                    <div className="bg-white p-2 rounded border border-purple-200">
                      <div className="text-xs text-purple-600">ROI</div>
                      <div className="font-bold text-purple-900">312%</div>
                      <div className="text-xs text-green-600">↑ 15% vs июнь</div>
                    </div>
                  </div>
                  <Button size="sm" variant="outline" className="text-purple-600 border-purple-300 hover:bg-purple-100 mt-3">
                    Детальный прогноз
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Конструктор сценариев в полноэкранном режиме */}
      {isBuilderOpen && (
        <div className="fixed inset-0 z-50 bg-background">
          <div className="flex items-center gap-2 p-4 border-b">
            <Button variant="ghost" size="sm" onClick={handleBuilderClose}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Вернуться в календарь
            </Button>
            <div className="text-sm text-muted-foreground">
              Редактирование сценария: <span className="font-medium">{editingScenario?.name}</span>
            </div>
          </div>
          <div className="h-[calc(100vh-64px)]">
            <ScenariosBuilder />
          </div>
        </div>
      )}
    </div>
  );
}
