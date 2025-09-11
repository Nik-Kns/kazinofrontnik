"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { 
  Contact, Plus, Brain, TrendingUp, Users, Calendar, DollarSign, 
  Target, Zap, Gift, Trophy, Mail, MessageSquare, Bell, 
  ChevronRight, ChevronLeft, Sparkles, AlertCircle, CheckCircle2,
  Play, Pause, Archive, BarChart3, Clock, Filter, Search,
  Edit, Copy, Trash2, MoreVertical, Palette, Image, Wand2
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { CreativeGeneratorModal } from "@/components/campaigns/creative-generator-modal";

// Типы кампаний
const campaignTypes = [
  {
    id: "reactivation",
    name: "Реактивация",
    description: "Вернуть неактивных игроков",
    icon: Zap,
    color: "text-orange-600",
    bgColor: "bg-orange-100",
    metrics: { avgROI: "+124%", successRate: "18%" }
  },
  {
    id: "welcome",
    name: "Приветственная",
    description: "Онбординг новых игроков",
    icon: Gift,
    color: "text-blue-600",
    bgColor: "bg-blue-100",
    metrics: { avgROI: "+89%", successRate: "42%" }
  },
  {
    id: "vip",
    name: "VIP программа",
    description: "Эксклюзивные предложения для VIP",
    icon: Trophy,
    color: "text-purple-600",
    bgColor: "bg-purple-100",
    metrics: { avgROI: "+256%", successRate: "67%" }
  },
  {
    id: "tournament",
    name: "Турнир",
    description: "Продвижение турниров и событий",
    icon: Target,
    color: "text-green-600",
    bgColor: "bg-green-100",
    metrics: { avgROI: "+178%", successRate: "34%" }
  }
];

// Примеры сегментов
const segments = [
  { id: "1", name: "Спящие 30+ дней", size: 2847, value: "€485K" },
  { id: "2", name: "VIP игроки", size: 423, value: "€1.2M" },
  { id: "3", name: "Новые регистрации", size: 1256, value: "€0" },
  { id: "4", name: "Активные депозиторы", size: 3421, value: "€892K" },
  { id: "5", name: "Чурнеры высокого риска", size: 892, value: "€234K" }
];

// Каналы коммуникации
const channels = [
  { id: "email", name: "Email", icon: Mail },
  { id: "sms", name: "SMS", icon: MessageSquare },
  { id: "push", name: "Push", icon: Bell }
];

// Расширенный список кампаний с метриками эффективности
const allCampaigns = [
  {
    id: "1",
    name: "Weekend Cashback VIP",
    type: "vip",
    status: "active",
    startDate: "2024-01-15",
    endDate: null,
    sent: 423,
    opened: 387,
    clicked: 234,
    converted: 89,
    revenue: "€45,230",
    roi: "+312%",
    metrics: {
      conversionRate: 21.0,
      bonusUsage: 67.3,
      avgDeposit: 508.76,
      openRate: 91.5,
      clickRate: 55.3
    },
    targets: {
      conversionRate: 15.0,
      bonusUsage: 50.0,
      avgDeposit: 400.0
    }
  },
  {
    id: "2",
    name: "Реактивация DE игроков",
    type: "reactivation",
    status: "active",
    startDate: "2024-01-12",
    endDate: null,
    sent: 1847,
    opened: 723,
    clicked: 312,
    converted: 134,
    revenue: "€23,450",
    roi: "+178%",
    metrics: {
      conversionRate: 7.3,
      bonusUsage: 45.2,
      avgDeposit: 175.0,
      openRate: 39.1,
      clickRate: 16.9
    },
    targets: {
      conversionRate: 10.0,
      bonusUsage: 40.0,
      avgDeposit: 150.0
    }
  },
  {
    id: "3",
    name: "Welcome Series Q1",
    type: "welcome",
    status: "scheduled",
    startDate: "2024-01-20",
    endDate: null,
    sent: 0,
    opened: 0,
    clicked: 0,
    converted: 0,
    revenue: "€0",
    roi: "—",
    metrics: {
      conversionRate: 0,
      bonusUsage: 0,
      avgDeposit: 0,
      openRate: 0,
      clickRate: 0
    },
    targets: {
      conversionRate: 25.0,
      bonusUsage: 60.0,
      avgDeposit: 100.0
    }
  },
  {
    id: "4",
    name: "Flash Sale Monday Madness",
    type: "tournament",
    status: "completed",
    startDate: "2024-01-08",
    endDate: "2024-01-09",
    sent: 5234,
    opened: 3456,
    clicked: 1234,
    converted: 456,
    revenue: "€67,890",
    roi: "+425%",
    metrics: {
      conversionRate: 8.7,
      bonusUsage: 78.4,
      avgDeposit: 148.88,
      openRate: 66.0,
      clickRate: 23.6
    },
    targets: {
      conversionRate: 5.0,
      bonusUsage: 70.0,
      avgDeposit: 120.0
    }
  },
  {
    id: "5",
    name: "Birthday Bonus Campaign",
    type: "vip",
    status: "active",
    startDate: "2024-01-14",
    endDate: null,
    sent: 156,
    opened: 145,
    clicked: 98,
    converted: 67,
    revenue: "€18,340",
    roi: "+567%",
    metrics: {
      conversionRate: 42.9,
      bonusUsage: 89.3,
      avgDeposit: 273.73,
      openRate: 92.9,
      clickRate: 62.8
    },
    targets: {
      conversionRate: 30.0,
      bonusUsage: 80.0,
      avgDeposit: 200.0
    }
  },
  {
    id: "6",
    name: "Churn Prevention Wave 3",
    type: "reactivation",
    status: "paused",
    startDate: "2024-01-10",
    endDate: null,
    sent: 2345,
    opened: 567,
    clicked: 123,
    converted: 34,
    revenue: "€4,560",
    roi: "-23%",
    metrics: {
      conversionRate: 1.4,
      bonusUsage: 23.5,
      avgDeposit: 134.12,
      openRate: 24.2,
      clickRate: 5.2
    },
    targets: {
      conversionRate: 8.0,
      bonusUsage: 50.0,
      avgDeposit: 200.0
    }
  },
  {
    id: "7",
    name: "Mega Tournament Weekend",
    type: "tournament",
    status: "active",
    startDate: "2024-01-16",
    endDate: null,
    sent: 8456,
    opened: 6234,
    clicked: 3456,
    converted: 1234,
    revenue: "€145,670",
    roi: "+678%",
    metrics: {
      conversionRate: 14.6,
      bonusUsage: 56.7,
      avgDeposit: 118.08,
      openRate: 73.7,
      clickRate: 40.9
    },
    targets: {
      conversionRate: 10.0,
      bonusUsage: 45.0,
      avgDeposit: 100.0
    }
  },
  {
    id: "8",
    name: "New Year Special Offer",
    type: "welcome",
    status: "completed",
    startDate: "2024-01-01",
    endDate: "2024-01-07",
    sent: 3456,
    opened: 2890,
    clicked: 1567,
    converted: 678,
    revenue: "€34,567",
    roi: "+234%",
    metrics: {
      conversionRate: 19.6,
      bonusUsage: 67.8,
      avgDeposit: 50.98,
      openRate: 83.7,
      clickRate: 45.4
    },
    targets: {
      conversionRate: 15.0,
      bonusUsage: 55.0,
      avgDeposit: 75.0
    }
  },
  {
    id: "9",
    name: "VIP Exclusive Tournament",
    type: "vip",
    status: "draft",
    startDate: "2024-01-25",
    endDate: null,
    sent: 0,
    opened: 0,
    clicked: 0,
    converted: 0,
    revenue: "€0",
    roi: "—",
    metrics: {
      conversionRate: 0,
      bonusUsage: 0,
      avgDeposit: 0,
      openRate: 0,
      clickRate: 0
    },
    targets: {
      conversionRate: 35.0,
      bonusUsage: 75.0,
      avgDeposit: 500.0
    }
  },
  {
    id: "10",
    name: "Weekend Warriors Promo",
    type: "tournament",
    status: "failed",
    startDate: "2024-01-05",
    endDate: "2024-01-06",
    sent: 1234,
    opened: 234,
    clicked: 45,
    converted: 12,
    revenue: "€890",
    roi: "-67%",
    metrics: {
      conversionRate: 1.0,
      bonusUsage: 12.3,
      avgDeposit: 74.17,
      openRate: 19.0,
      clickRate: 3.6
    },
    targets: {
      conversionRate: 12.0,
      bonusUsage: 60.0,
      avgDeposit: 150.0
    }
  }
];

function CampaignsContent() {
  const searchParams = useSearchParams();
  const [showCreateWizard, setShowCreateWizard] = useState(false);
  const [wizardStep, setWizardStep] = useState(1);
  const [showCreativeModal, setShowCreativeModal] = useState(false);
  const [templateCampaigns, setTemplateCampaigns] = useState<any[]>([]);
  const [highlightedCampaign, setHighlightedCampaign] = useState<string | null>(null);
  const [campaignData, setCampaignData] = useState({
    name: "",
    type: "",
    segments: [] as string[],
    channels: [] as string[],
    schedule: "immediate",
    message: "",
    budget: "",
    targets: {
      conversionRate: "",
      bonusUsage: "",
      avgDeposit: ""
    }
  });

  useEffect(() => {
    // Загружаем кампании из localStorage
    const savedCampaigns = localStorage.getItem('campaigns');
    if (savedCampaigns) {
      setTemplateCampaigns(JSON.parse(savedCampaigns));
    }

    // Проверяем, есть ли новая кампания для подсветки
    const newCampaignId = searchParams.get('newCampaign');
    if (newCampaignId) {
      setHighlightedCampaign(newCampaignId);
      // Убираем подсветку через 3 секунды
      setTimeout(() => setHighlightedCampaign(null), 3000);
    }
  }, [searchParams]);

  const handleNext = () => {
    if (wizardStep < 6) setWizardStep(wizardStep + 1);
  };

  const handleBack = () => {
    if (wizardStep > 1) setWizardStep(wizardStep - 1);
  };

  const canProceed = () => {
    switch (wizardStep) {
      case 1: return campaignData.name && campaignData.type;
      case 2: return campaignData.targets.conversionRate && campaignData.targets.bonusUsage && campaignData.targets.avgDeposit;
      case 3: return campaignData.segments.length > 0;
      case 4: return campaignData.channels.length > 0;
      case 5: return campaignData.message;
      default: return true;
    }
  };

  return (
    <div className="p-4 md:p-6 lg:p-8">
      {/* Заголовок */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
            <Contact className="h-6 w-6 text-primary" />
            Кампании
          </h1>
          <p className="text-muted-foreground mt-1">
            Управление маркетинговыми кампаниями и коммуникациями
          </p>
        </div>
        <Button onClick={() => setShowCreateWizard(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Создать кампанию
        </Button>
      </div>

      {/* ИИ рекомендации */}
      <Card className="mb-6 border-primary/20 bg-gradient-to-r from-primary/5 to-purple-500/5">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Brain className="h-5 w-5 text-primary" />
              <CardTitle>ИИ рекомендации для кампаний</CardTitle>
            </div>
            <Badge variant="secondary">3 новых</Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 md:grid-cols-3">
            <div className="p-3 rounded-lg bg-background border">
              <div className="flex items-center gap-2 mb-2">
                <div className="p-1 bg-red-100 rounded">
                  <Zap className="h-4 w-4 text-red-600" />
                </div>
                <Badge variant="destructive" className="text-xs">Срочно</Badge>
              </div>
              <p className="text-sm font-medium mb-1">Запустить Flash Sale</p>
              <p className="text-xs text-muted-foreground mb-2">
                Пятница - лучший день для Flash Sale. Конверсия выше на 34%
              </p>
              <Button size="sm" className="w-full">Создать</Button>
            </div>
            
            <div className="p-3 rounded-lg bg-background border">
              <div className="flex items-center gap-2 mb-2">
                <div className="p-1 bg-orange-100 rounded">
                  <Users className="h-4 w-4 text-orange-600" />
                </div>
                <Badge className="text-xs bg-orange-100 text-orange-700">Сегмент</Badge>
              </div>
              <p className="text-sm font-medium mb-1">892 игрока в риске</p>
              <p className="text-xs text-muted-foreground mb-2">
                Чурн вероятность &gt;70%. Нужна срочная реактивация
              </p>
              <Button size="sm" variant="outline" className="w-full">Настроить</Button>
            </div>
            
            <div className="p-3 rounded-lg bg-background border">
              <div className="flex items-center gap-2 mb-2">
                <div className="p-1 bg-green-100 rounded">
                  <TrendingUp className="h-4 w-4 text-green-600" />
                </div>
                <Badge className="text-xs bg-green-100 text-green-700">Тренд</Badge>
              </div>
              <p className="text-sm font-medium mb-1">Бонусы на выходные</p>
              <p className="text-xs text-muted-foreground mb-2">
                +156% депозитов в выходные с бонусами
              </p>
              <Button size="sm" variant="outline" className="w-full">Изучить</Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Wizard создания кампании */}
      {showCreateWizard && (
        <Card className="mb-6">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Создание новой кампании</CardTitle>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => {
                  setShowCreateWizard(false);
                  setWizardStep(1);
                }}
              >
                Отмена
              </Button>
            </div>
            <Progress value={(wizardStep / 6) * 100} className="mt-4" />
            <div className="flex justify-between mt-2">
              {["Основное", "Цели", "Сегменты", "Каналы", "Сообщение", "Креативы"].map((step, index) => (
                <span 
                  key={step}
                  className={cn(
                    "text-xs",
                    wizardStep === index + 1 ? "font-semibold text-primary" : "text-muted-foreground"
                  )}
                >
                  {step}
                </span>
              ))}
            </div>
          </CardHeader>
          <CardContent>
            {/* Шаг 1: Основная информация */}
            {wizardStep === 1 && (
              <div className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="campaign-name">Название кампании</Label>
                  <Input
                    id="campaign-name"
                    placeholder="Например: VIP Weekend Cashback"
                    value={campaignData.name}
                    onChange={(e) => setCampaignData({...campaignData, name: e.target.value})}
                  />
                </div>
                
                <div className="space-y-3">
                  <Label>Тип кампании</Label>
                  <RadioGroup 
                    value={campaignData.type}
                    onValueChange={(value) => setCampaignData({...campaignData, type: value})}
                  >
                    <div className="grid gap-3 md:grid-cols-2">
                      {campaignTypes.map((type) => (
                        <div key={type.id} className="relative">
                          <RadioGroupItem
                            value={type.id}
                            id={type.id}
                            className="peer sr-only"
                          />
                          <Label
                            htmlFor={type.id}
                            className={cn(
                              "flex items-start gap-3 rounded-lg border p-4 cursor-pointer",
                              "hover:bg-accent hover:border-primary/50",
                              "peer-checked:border-primary peer-checked:bg-primary/5"
                            )}
                          >
                            <div className={cn("p-2 rounded-lg", type.bgColor)}>
                              <type.icon className={cn("h-5 w-5", type.color)} />
                            </div>
                            <div className="flex-1">
                              <div className="font-semibold">{type.name}</div>
                              <div className="text-sm text-muted-foreground">{type.description}</div>
                              <div className="flex gap-3 mt-2">
                                <span className="text-xs">ROI: {type.metrics.avgROI}</span>
                                <span className="text-xs">CR: {type.metrics.successRate}</span>
                              </div>
                            </div>
                          </Label>
                        </div>
                      ))}
                    </div>
                  </RadioGroup>
                </div>
                
                {/* ИИ подсказка */}
                <Alert className="border-blue-200 bg-blue-50">
                  <Brain className="h-4 w-4 text-blue-600" />
                  <AlertDescription>
                    <strong>ИИ совет:</strong> Для вашей аудитории реактивационные кампании 
                    показывают лучший ROI в пятницу вечером (18:00-20:00)
                  </AlertDescription>
                </Alert>
              </div>
            )}

            {/* Шаг 2: Целевые метрики */}
            {wizardStep === 2 && (
              <div className="space-y-6">
                <div>
                  <h3 className="font-semibold mb-4">Установите целевые показатели кампании</h3>
                  <p className="text-sm text-muted-foreground mb-6">
                    Определите KPI для оценки эффективности кампании
                  </p>
                </div>
                
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="target-conversion">
                      Конверсия в депозит (%)
                    </Label>
                    <div className="flex items-center gap-2">
                      <Input
                        id="target-conversion"
                        type="number"
                        placeholder="15"
                        value={campaignData.targets.conversionRate}
                        onChange={(e) => setCampaignData({
                          ...campaignData,
                          targets: {...campaignData.targets, conversionRate: e.target.value}
                        })}
                        className="w-32"
                      />
                      <span className="text-sm text-muted-foreground">%</span>
                      <Badge variant="outline" className="ml-auto">
                        Средний по типу: {
                          campaignData.type === 'vip' ? '25%' :
                          campaignData.type === 'reactivation' ? '8%' :
                          campaignData.type === 'welcome' ? '20%' :
                          '12%'
                        }
                      </Badge>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="target-bonus">
                      Использование бонусов (%)
                    </Label>
                    <div className="flex items-center gap-2">
                      <Input
                        id="target-bonus"
                        type="number"
                        placeholder="50"
                        value={campaignData.targets.bonusUsage}
                        onChange={(e) => setCampaignData({
                          ...campaignData,
                          targets: {...campaignData.targets, bonusUsage: e.target.value}
                        })}
                        className="w-32"
                      />
                      <span className="text-sm text-muted-foreground">%</span>
                      <Badge variant="outline" className="ml-auto">
                        Средний по типу: {
                          campaignData.type === 'vip' ? '70%' :
                          campaignData.type === 'reactivation' ? '45%' :
                          campaignData.type === 'welcome' ? '60%' :
                          '55%'
                        }
                      </Badge>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="target-deposit">
                      Средний депозит (€)
                    </Label>
                    <div className="flex items-center gap-2">
                      <Input
                        id="target-deposit"
                        type="number"
                        placeholder="150"
                        value={campaignData.targets.avgDeposit}
                        onChange={(e) => setCampaignData({
                          ...campaignData,
                          targets: {...campaignData.targets, avgDeposit: e.target.value}
                        })}
                        className="w-32"
                      />
                      <span className="text-sm text-muted-foreground">€</span>
                      <Badge variant="outline" className="ml-auto">
                        Средний по типу: {
                          campaignData.type === 'vip' ? '€450' :
                          campaignData.type === 'reactivation' ? '€180' :
                          campaignData.type === 'welcome' ? '€85' :
                          '€150'
                        }
                      </Badge>
                    </div>
                  </div>
                </div>

                {/* ИИ рекомендация по целям */}
                <Alert className="border-purple-200 bg-purple-50">
                  <Sparkles className="h-4 w-4 text-purple-600" />
                  <AlertDescription>
                    <strong>ИИ рекомендация:</strong> Для {
                      campaignData.type === 'vip' ? 'VIP кампаний' :
                      campaignData.type === 'reactivation' ? 'реактивационных кампаний' :
                      campaignData.type === 'welcome' ? 'приветственных кампаний' :
                      'данного типа кампаний'
                    } оптимальные цели: конверсия {
                      campaignData.type === 'vip' ? '20-30%' :
                      campaignData.type === 'reactivation' ? '7-12%' :
                      campaignData.type === 'welcome' ? '18-25%' :
                      '10-15%'
                    }, средний депозит {
                      campaignData.type === 'vip' ? '€400-600' :
                      campaignData.type === 'reactivation' ? '€150-250' :
                      campaignData.type === 'welcome' ? '€75-120' :
                      '€100-200'
                    }
                  </AlertDescription>
                </Alert>
              </div>
            )}

            {/* Шаг 3: Выбор сегментов */}
            {wizardStep === 3 && (
              <div className="space-y-6">
                <div className="space-y-3">
                  <Label>Выберите целевые сегменты</Label>
                  <div className="space-y-2">
                    {segments.map((segment) => (
                      <div 
                        key={segment.id}
                        className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-accent"
                      >
                        <Checkbox
                          id={segment.id}
                          checked={campaignData.segments.includes(segment.id)}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              setCampaignData({
                                ...campaignData,
                                segments: [...campaignData.segments, segment.id]
                              });
                            } else {
                              setCampaignData({
                                ...campaignData,
                                segments: campaignData.segments.filter(s => s !== segment.id)
                              });
                            }
                          }}
                        />
                        <Label htmlFor={segment.id} className="flex-1 cursor-pointer">
                          <div className="flex items-center justify-between">
                            <div>
                              <div className="font-medium">{segment.name}</div>
                              <div className="text-sm text-muted-foreground">
                                {segment.size.toLocaleString()} игроков • LTV: {segment.value}
                              </div>
                            </div>
                            <Badge variant="outline">{segment.size}</Badge>
                          </div>
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>
                
                {/* ИИ рекомендация сегментов */}
                <Alert className="border-green-200 bg-green-50">
                  <Sparkles className="h-4 w-4 text-green-600" />
                  <AlertDescription>
                    <strong>ИИ рекомендует:</strong> Сегмент "Спящие 30+ дней" показывает 
                    высокий потенциал реактивации (18% CR) при правильном офере
                  </AlertDescription>
                </Alert>
              </div>
            )}

            {/* Шаг 4: Выбор каналов */}
            {wizardStep === 4 && (
              <div className="space-y-6">
                <div className="space-y-3">
                  <Label>Каналы коммуникации</Label>
                  <div className="grid gap-3 md:grid-cols-3">
                    {channels.map((channel) => (
                      <div key={channel.id} className="relative">
                        <Checkbox
                          id={`channel-${channel.id}`}
                          checked={campaignData.channels.includes(channel.id)}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              setCampaignData({
                                ...campaignData,
                                channels: [...campaignData.channels, channel.id]
                              });
                            } else {
                              setCampaignData({
                                ...campaignData,
                                channels: campaignData.channels.filter(c => c !== channel.id)
                              });
                            }
                          }}
                          className="peer sr-only"
                        />
                        <Label
                          htmlFor={`channel-${channel.id}`}
                          className={cn(
                            "flex flex-col items-center gap-2 rounded-lg border p-4 cursor-pointer",
                            "hover:bg-accent hover:border-primary/50",
                            "peer-checked:border-primary peer-checked:bg-primary/5"
                          )}
                        >
                          <channel.icon className="h-8 w-8 text-muted-foreground" />
                          <span className="font-medium">{channel.name}</span>
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label>Расписание отправки</Label>
                  <RadioGroup 
                    value={campaignData.schedule}
                    onValueChange={(value) => setCampaignData({...campaignData, schedule: value})}
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="immediate" id="immediate" />
                      <Label htmlFor="immediate">Отправить немедленно</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="scheduled" id="scheduled" />
                      <Label htmlFor="scheduled">Запланировать на конкретное время</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="optimal" id="optimal" />
                      <Label htmlFor="optimal">
                        ИИ оптимальное время (пятница 18:00)
                        <Badge className="ml-2 text-xs">Рекомендовано</Badge>
                      </Label>
                    </div>
                  </RadioGroup>
                </div>
              </div>
            )}

            {/* Шаг 5: Сообщение */}
            {wizardStep === 5 && (
              <div className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="message">Текст сообщения</Label>
                  <Textarea
                    id="message"
                    placeholder="Введите текст сообщения..."
                    className="min-h-[150px]"
                    value={campaignData.message}
                    onChange={(e) => setCampaignData({...campaignData, message: e.target.value})}
                  />
                </div>
                
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    <Wand2 className="mr-2 h-4 w-4" />
                    ИИ генерация текста
                  </Button>
                  <Button variant="outline" size="sm">
                    Добавить переменные
                  </Button>
                  <Button variant="outline" size="sm">
                    Предпросмотр
                  </Button>
                </div>
                
                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    <strong>Совет:</strong> Используйте персонализацию {"{имя}"} и четкий CTA 
                    для увеличения конверсии на 23%
                  </AlertDescription>
                </Alert>
              </div>
            )}

            {/* Шаг 6: Креативы */}
            {wizardStep === 6 && (
              <div className="space-y-6">
                <div className="text-center py-12 border-2 border-dashed rounded-lg">
                  <Image className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Создание креативов</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Создайте визуальные материалы для вашей кампании
                  </p>
                  <div className="flex justify-center gap-3">
                    <Button>
                      <Palette className="mr-2 h-4 w-4" />
                      Создать креатив
                    </Button>
                    <Button variant="outline" onClick={() => setShowCreativeModal(true)}>
                      <Wand2 className="mr-2 h-4 w-4" />
                      ИИ генерация
                    </Button>
                  </div>
                </div>
                
                <Alert className="border-purple-200 bg-purple-50">
                  <Sparkles className="h-4 w-4 text-purple-600" />
                  <AlertDescription>
                    <strong>ИИ креативы:</strong> Наш ИИ может создать персонализированные 
                    баннеры и изображения на основе ваших предпочтений и бренда
                  </AlertDescription>
                </Alert>
              </div>
            )}

            {/* Навигация */}
            <div className="flex justify-between mt-6 pt-6 border-t">
              <Button
                variant="outline"
                onClick={handleBack}
                disabled={wizardStep === 1}
              >
                <ChevronLeft className="mr-2 h-4 w-4" />
                Назад
              </Button>
              
              {wizardStep < 6 ? (
                <Button
                  onClick={handleNext}
                  disabled={!canProceed()}
                >
                  Далее
                  <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
              ) : (
                <Button className="bg-green-600 hover:bg-green-700">
                  <CheckCircle2 className="mr-2 h-4 w-4" />
                  Запустить кампанию
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Табы с кампаниями */}
      <Tabs defaultValue="active" className="space-y-4">
        <TabsList>
          <TabsTrigger value="active">Активные</TabsTrigger>
          <TabsTrigger value="scheduled">Запланированные</TabsTrigger>
          <TabsTrigger value="drafts">Черновики</TabsTrigger>
          <TabsTrigger value="completed">Завершенные</TabsTrigger>
        </TabsList>

        <TabsContent value="active" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Активные кампании</CardTitle>
              <CardDescription>Кампании в процессе выполнения с метриками эффективности</CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-muted/50 border-b">
                    <tr>
                      <th className="text-left p-3 font-medium text-sm">Кампания</th>
                      <th className="text-left p-3 font-medium text-sm">Тип</th>
                      <th className="text-left p-3 font-medium text-sm">Статус</th>
                      <th className="text-center p-3 font-medium text-sm">Отправлено</th>
                      <th className="text-center p-3 font-medium text-sm">Конверсия</th>
                      <th className="text-center p-3 font-medium text-sm">Бонусы</th>
                      <th className="text-center p-3 font-medium text-sm">Ср. депозит</th>
                      <th className="text-center p-3 font-medium text-sm">ROI</th>
                      <th className="text-center p-3 font-medium text-sm">Доход</th>
                      <th className="text-right p-3 font-medium text-sm">Действия</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {allCampaigns.filter(c => c.status === "active").map((campaign) => {
                      const type = campaignTypes.find(t => t.id === campaign.type);
                      const isOverTarget = {
                        conversion: campaign.metrics.conversionRate >= campaign.targets.conversionRate,
                        bonus: campaign.metrics.bonusUsage >= campaign.targets.bonusUsage,
                        deposit: campaign.metrics.avgDeposit >= campaign.targets.avgDeposit
                      };
                      
                      return (
                        <tr key={campaign.id} className="hover:bg-muted/30 transition-colors">
                          <td className="p-3">
                            <div className="font-medium">{campaign.name}</div>
                            <div className="text-xs text-muted-foreground mt-1">
                              Начата {campaign.startDate}
                            </div>
                          </td>
                          <td className="p-3">
                            <div className="flex items-center gap-2">
                              <div className={cn("p-1 rounded", type?.bgColor)}>
                                {(() => {
                                  const Icon = type?.icon || Contact;
                                  return <Icon className={cn("h-3 w-3", type?.color)} />;
                                })()}
                              </div>
                              <span className="text-sm">{type?.name}</span>
                            </div>
                          </td>
                          <td className="p-3">
                            <Badge className="bg-green-100 text-green-700">Активна</Badge>
                          </td>
                          <td className="p-3 text-center">
                            <div className="text-sm font-medium">{campaign.sent.toLocaleString()}</div>
                            <div className="text-xs text-muted-foreground">
                              {campaign.opened} откр.
                            </div>
                          </td>
                          <td className="p-3 text-center">
                            <div className={cn(
                              "text-sm font-medium",
                              isOverTarget.conversion ? "text-green-600" : "text-orange-600"
                            )}>
                              {campaign.metrics.conversionRate}%
                            </div>
                            <div className="text-xs text-muted-foreground">
                              Цель: {campaign.targets.conversionRate}%
                            </div>
                          </td>
                          <td className="p-3 text-center">
                            <div className={cn(
                              "text-sm font-medium",
                              isOverTarget.bonus ? "text-green-600" : "text-orange-600"
                            )}>
                              {campaign.metrics.bonusUsage}%
                            </div>
                            <div className="text-xs text-muted-foreground">
                              Цель: {campaign.targets.bonusUsage}%
                            </div>
                          </td>
                          <td className="p-3 text-center">
                            <div className={cn(
                              "text-sm font-medium",
                              isOverTarget.deposit ? "text-green-600" : "text-orange-600"
                            )}>
                              €{campaign.metrics.avgDeposit}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              Цель: €{campaign.targets.avgDeposit}
                            </div>
                          </td>
                          <td className="p-3 text-center">
                            <div className={cn(
                              "text-sm font-bold",
                              campaign.roi.startsWith('+') ? "text-green-600" : "text-red-600"
                            )}>
                              {campaign.roi}
                            </div>
                          </td>
                          <td className="p-3 text-center">
                            <div className="text-sm font-bold text-green-600">
                              {campaign.revenue}
                            </div>
                          </td>
                          <td className="p-3">
                            <div className="flex justify-end gap-1">
                              <Button variant="ghost" size="icon" className="h-8 w-8">
                                <Pause className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="icon" className="h-8 w-8">
                                <BarChart3 className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="icon" className="h-8 w-8">
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="scheduled">
          {allCampaigns.filter(c => c.status === "scheduled").map((campaign) => (
            <Card key={campaign.id}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold">{campaign.name}</h3>
                    <p className="text-sm text-muted-foreground">
                      Запланирована на {campaign.startDate}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      <Edit className="mr-2 h-4 w-4" />
                      Изменить
                    </Button>
                    <Button size="sm">
                      <Play className="mr-2 h-4 w-4" />
                      Запустить сейчас
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="drafts" className="space-y-4">
          {templateCampaigns.length === 0 ? (
            <Card>
              <CardContent className="p-6 text-center">
                <p className="text-muted-foreground">
                  Нет черновиков кампаний. Создайте кампанию из шаблона на странице шаблонов.
                </p>
              </CardContent>
            </Card>
          ) : (
            templateCampaigns.map((campaign) => (
              <Card 
                key={campaign.id}
                className={cn(
                  "transition-all",
                  highlightedCampaign === campaign.id && "ring-2 ring-primary ring-offset-2"
                )}
              >
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4">
                      <div className="p-2 rounded-lg bg-gray-100">
                        <Contact className="h-5 w-5 text-gray-600" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold">{campaign.name}</h3>
                          <Badge variant="secondary">Черновик</Badge>
                          {highlightedCampaign === campaign.id && (
                            <Badge className="bg-green-100 text-green-700">Новая</Badge>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">
                          {campaign.description}
                        </p>
                        <div className="flex gap-4 text-sm">
                          <div className="flex items-center gap-2">
                            <Badge variant="outline">{campaign.category}</Badge>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-muted-foreground">Канал:</span>
                            <span>{campaign.channel}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-muted-foreground">Создана:</span>
                            <span>{new Date(campaign.createdAt).toLocaleDateString('ru-RU')}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        <Edit className="mr-2 h-4 w-4" />
                        Настроить
                      </Button>
                      <Button size="sm" className="bg-green-600 hover:bg-green-700">
                        <Play className="mr-2 h-4 w-4" />
                        Запустить
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </TabsContent>

        <TabsContent value="completed">
          <Card>
            <CardContent className="p-6 text-center">
              <p className="text-muted-foreground">
                Нет завершенных кампаний.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Creative Generator Modal */}
      <CreativeGeneratorModal
        open={showCreativeModal}
        onOpenChange={setShowCreativeModal}
        campaignType={campaignData.type}
        campaignName={campaignData.name}
      />
    </div>
  );
}

export default function CampaignsPage() {
  return (
    <Suspense fallback={<div className="p-4 md:p-6 lg:p-8">Загрузка...</div>}>
      <CampaignsContent />
    </Suspense>
  );
}