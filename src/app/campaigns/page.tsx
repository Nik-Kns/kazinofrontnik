"use client";

import { useState } from "react";
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

// Активные кампании
const activeCampaigns = [
  {
    id: "1",
    name: "Weekend Cashback VIP",
    type: "vip",
    status: "active",
    startDate: "2024-01-15",
    sent: 423,
    opened: 387,
    converted: 89,
    revenue: "€45,230"
  },
  {
    id: "2",
    name: "Реактивация DE игроков",
    type: "reactivation",
    status: "active",
    startDate: "2024-01-12",
    sent: 1847,
    opened: 723,
    converted: 134,
    revenue: "€23,450"
  },
  {
    id: "3",
    name: "Welcome Series Q1",
    type: "welcome",
    status: "scheduled",
    startDate: "2024-01-20",
    sent: 0,
    opened: 0,
    converted: 0,
    revenue: "€0"
  }
];

export default function CampaignsPage() {
  const [showCreateWizard, setShowCreateWizard] = useState(false);
  const [wizardStep, setWizardStep] = useState(1);
  const [campaignData, setCampaignData] = useState({
    name: "",
    type: "",
    segments: [] as string[],
    channels: [] as string[],
    schedule: "immediate",
    message: "",
    budget: ""
  });

  const handleNext = () => {
    if (wizardStep < 5) setWizardStep(wizardStep + 1);
  };

  const handleBack = () => {
    if (wizardStep > 1) setWizardStep(wizardStep - 1);
  };

  const canProceed = () => {
    switch (wizardStep) {
      case 1: return campaignData.name && campaignData.type;
      case 2: return campaignData.segments.length > 0;
      case 3: return campaignData.channels.length > 0;
      case 4: return campaignData.message;
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
            <Progress value={(wizardStep / 5) * 100} className="mt-4" />
            <div className="flex justify-between mt-2">
              {["Основное", "Сегменты", "Каналы", "Сообщение", "Креативы"].map((step, index) => (
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

            {/* Шаг 2: Выбор сегментов */}
            {wizardStep === 2 && (
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

            {/* Шаг 3: Выбор каналов */}
            {wizardStep === 3 && (
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

            {/* Шаг 4: Сообщение */}
            {wizardStep === 4 && (
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

            {/* Шаг 5: Креативы */}
            {wizardStep === 5 && (
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
                    <Button variant="outline">
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
              
              {wizardStep < 5 ? (
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
          {activeCampaigns.filter(c => c.status === "active").map((campaign) => (
            <Card key={campaign.id}>
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4">
                    <div className={cn(
                      "p-2 rounded-lg",
                      campaignTypes.find(t => t.id === campaign.type)?.bgColor
                    )}>
                      {(() => {
                        const type = campaignTypes.find(t => t.id === campaign.type);
                        const Icon = type?.icon || Contact;
                        return <Icon className={cn("h-5 w-5", type?.color)} />;
                      })()}
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold">{campaign.name}</h3>
                        <Badge className="bg-green-100 text-green-700">Активна</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-3">
                        Запущена {campaign.startDate}
                      </p>
                      <div className="flex gap-6 text-sm">
                        <div>
                          <span className="text-muted-foreground">Отправлено:</span>
                          <span className="ml-1 font-medium">{campaign.sent}</span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Открыто:</span>
                          <span className="ml-1 font-medium">{campaign.opened}</span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Конверсия:</span>
                          <span className="ml-1 font-medium">{campaign.converted}</span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Доход:</span>
                          <span className="ml-1 font-medium text-green-600">{campaign.revenue}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="ghost" size="icon">
                      <Pause className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon">
                      <BarChart3 className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="scheduled">
          {activeCampaigns.filter(c => c.status === "scheduled").map((campaign) => (
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
      </Tabs>
    </div>
  );
}