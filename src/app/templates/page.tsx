"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { templatesData } from "@/lib/mock-data";
import { 
  ClipboardCopy, 
  Filter, 
  LayoutGrid, 
  List, 
  Mail, 
  MessageSquare, 
  PlusCircle, 
  Smartphone, 
  Zap,
  Brain,
  Sparkles,
  AlertCircle,
  TrendingUp,
  Target,
  DollarSign,
  ArrowRight,
  Clock,
  CheckCircle2,
  Table,
  ExternalLink,
  Rocket,
  X,
  Users,
  Globe,
  Layers,
  Tag,
  Settings,
  ChevronLeft,
  ChevronRight,
  FileText,
  Send,
  Wand2
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";


const channelIcons: Record<string, React.ElementType> = {
  Email: Mail,
  Push: Smartphone,
  SMS: MessageSquare,
  InApp: Zap,
  "Multi-channel": Zap,
};


// ИИ-рекомендации для шаблонов
const aiTemplateRecommendations = [
  {
    id: '1',
    priority: 'critical',
    title: 'Внедрить Drip-кампанию для новых игроков',
    description: '78% новых регистраций не делают депозит в первые 24 часа',
    impact: '+45% конверсия FTD',
    metric: '+45% FTD конверсия',
    geo: ['DE', 'AT', 'CH'],
    segment: 'Новые регистрации',
    channels: ['Email', 'Push', 'SMS'],
    templateId: 'welcome-series',
    scenarioParams: {
      type: 'drip-campaign',
      steps: 7,
      duration: '7 days',
      channels: ['email', 'push', 'sms'],
      targetSegment: 'new_registrations',
      expectedConversion: '45%'
    }
  },
  {
    id: '2',
    priority: 'high',
    title: 'Создать триггеры для брошенных корзин',
    description: '4,230 брошенных корзин ежедневно со средней суммой €85',
    impact: '+18% возврат корзин',
    metric: '+18% возврат депозитов',
    geo: ['UK', 'IE'],
    segment: 'Незавершенные депозиты',
    channels: ['Email', 'Push'],
    templateId: 'abandoned-cart',
    scenarioParams: {
      type: 'trigger-based',
      trigger: 'cart_abandoned',
      delay: '1 hour',
      channels: ['email', 'push'],
      incentive: '10% bonus',
      expectedRecovery: '18%'
    }
  },
  {
    id: '3', 
    priority: 'medium',
    title: 'Запустить персонализированные турниры',
    description: 'Только 12% активных игроков участвуют в турнирах',
    impact: '+25% DAU',
    metric: '+13% участников турниров',
    geo: ['FR', 'BE', 'LU'],
    segment: 'Активные игроки',
    channels: ['Push', 'In-App'],
    templateId: 'tournament-invite',
    scenarioParams: {
      type: 'engagement',
      frequency: 'weekly',
      prizePool: 5000,
      channels: ['push', 'in-app'],
      targetSegment: 'active_players',
      expectedParticipation: '35%'
    }
  }
];

export default function TemplatesPage() {
  const router = useRouter();
  const [implementedTemplates, setImplementedTemplates] = useState<string[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<any>(null);
  const [showTemplateDetails, setShowTemplateDetails] = useState(false);
  const [showCreateWizard, setShowCreateWizard] = useState(false);
  const [wizardStep, setWizardStep] = useState(1);
  const [showAIRecommendations, setShowAIRecommendations] = useState(false);
  const [templateData, setTemplateData] = useState({
    name: '',
    category: '',
    channel: '',
    description: '',
    type: 'basic',
    event: '',
    geo: [] as string[],
    project: [] as string[],
    subject: '',
    content: '',
    ctaText: '',
    ctaLink: '',
    segmentRules: {
      minDeposit: '',
      daysFromReg: '',
      activity: ''
    },
    frequency: 'once',
    priority: 'medium'
  });

  const handleCreateCampaign = (template: any) => {
    // Сохраняем шаблон в localStorage для использования на странице кампаний
    const campaignData = {
      id: `campaign-${Date.now()}`,
      name: template.name,
      templateId: template.id,
      category: template.category,
      channel: template.channel,
      description: template.description,
      status: 'draft',
      createdAt: new Date().toISOString(),
      performance: template.performance
    };
    
    // Получаем существующие кампании или создаем новый массив
    const existingCampaigns = JSON.parse(localStorage.getItem('campaigns') || '[]');
    existingCampaigns.push(campaignData);
    localStorage.setItem('campaigns', JSON.stringify(existingCampaigns));
    
    // Переходим на страницу кампаний
    router.push(`/campaigns?newCampaign=${campaignData.id}`);
  };

  const handleImplementTemplate = (recommendation: any) => {
    // Отмечаем как внедренный
    setImplementedTemplates([...implementedTemplates, recommendation.id]);
    
    // Формируем URL с параметрами
    const params = new URLSearchParams({
      template: recommendation.templateId,
      type: recommendation.scenarioParams.type,
      priority: recommendation.priority,
      expectedRevenue: recommendation.revenue.replace(/[€,/мес]/g, ''),
      impact: recommendation.impact,
      ...recommendation.scenarioParams
    });
    
    // Переходим в builder с параметрами
    router.push(`/builder?${params.toString()}`);
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'bg-red-100 border-red-300 text-red-900';
      case 'high': return 'bg-orange-100 border-orange-300 text-orange-900';
      case 'medium': return 'bg-yellow-100 border-yellow-300 text-yellow-900';
      default: return 'bg-gray-100 border-gray-300 text-gray-900';
    }
  };

  const getPriorityLabel = (priority: string) => {
    switch (priority) {
      case 'critical': return 'Критично';
      case 'high': return 'Высокий';
      case 'medium': return 'Средний';
      default: return priority;
    }
  };

  return (
    <div className="p-4 md:p-6 lg:p-8 space-y-6">
       <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
            <h1 className="text-2xl font-bold tracking-tight">Шаблоны сценариев</h1>
            <p className="text-muted-foreground">Библиотека готовых шаблонов для быстрого старта ваших кампаний.</p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
            <div className="relative w-full md:w-64">
                <Filter className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Поиск по шаблонам..." className="pl-10" />
            </div>
            <Button variant="outline">Категории</Button>
            <Button variant="outline" size="icon"><List className="h-4 w-4"/></Button>
            <Button variant="secondary" size="icon"><LayoutGrid className="h-4 w-4"/></Button>
        </div>
      </div>
      
      {/* Блок ИИ-рекомендаций */}
      <Card className="border-primary/20 bg-gradient-to-r from-primary/5 to-purple-500/5">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Brain className="h-5 w-5 text-primary" />
              </div>
              <div>
                <CardTitle>ИИ рекомендует внедрить</CardTitle>
                <CardDescription>
                  Приоритетные шаблоны для роста выручки
                </CardDescription>
              </div>
            </div>
            <Badge variant="secondary">
              <Sparkles className="mr-1 h-3 w-3" />
              Потенциал: +28% общей конверсии
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            {aiTemplateRecommendations.map((rec) => (
              <div 
                key={rec.id}
                className={cn(
                  "p-4 rounded-lg border-2",
                  getPriorityColor(rec.priority),
                  implementedTemplates.includes(rec.id) && "opacity-60"
                )}
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between">
                    <Badge 
                      variant="outline" 
                      className={cn(
                        "text-xs font-bold",
                        rec.priority === 'critical' && "border-red-500 text-red-700",
                        rec.priority === 'high' && "border-orange-500 text-orange-700",
                        rec.priority === 'medium' && "border-yellow-600 text-yellow-700"
                      )}
                    >
                      <AlertCircle className="mr-1 h-3 w-3" />
                      {getPriorityLabel(rec.priority)}
                    </Badge>
                    {implementedTemplates.includes(rec.id) && (
                      <CheckCircle2 className="h-5 w-5 text-green-600" />
                    )}
                  </div>
                  
                  <div>
                    <h4 className="font-semibold text-sm mb-1">{rec.title}</h4>
                    <p className="text-xs text-muted-foreground">
                      {rec.description}
                    </p>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-xs">
                      <TrendingUp className="h-3 w-3 text-green-600" />
                      <span className="font-bold text-green-700">{rec.metric}</span>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      <Badge variant="outline" className="text-xs">
                        <Target className="mr-1 h-2.5 w-2.5" />
                        {rec.segment}
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        GEO: {rec.geo.join(', ')}
                      </Badge>
                    </div>
                    <div className="flex gap-1">
                      {rec.channels.map(channel => (
                        <Badge key={channel} variant="secondary" className="text-xs">
                          {channel}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <Button 
                    size="sm" 
                    className="w-full"
                    variant={implementedTemplates.includes(rec.id) ? "secondary" : "default"}
                    onClick={() => handleImplementTemplate(rec)}
                    disabled={implementedTemplates.includes(rec.id)}
                  >
                    {implementedTemplates.includes(rec.id) ? (
                      <>
                        <CheckCircle2 className="mr-2 h-4 w-4" />
                        Внедрено
                      </>
                    ) : (
                      <>
                        <ArrowRight className="mr-2 h-4 w-4" />
                        Внедрить
                      </>
                    )}
                  </Button>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-start gap-2">
              <Clock className="h-4 w-4 text-blue-600 mt-0.5" />
              <div className="text-sm">
                <p className="font-medium text-blue-900">Совет</p>
                <p className="text-blue-700">
                  Начните с критичных шаблонов - они дают максимальный ROI в первые 30 дней.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Таблица шаблонов */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Table className="h-5 w-5" />
                Библиотека шаблонов
              </CardTitle>
              <CardDescription>
                Готовые шаблоны для различных маркетинговых сценариев
              </CardDescription>
            </div>
            <Button onClick={() => setShowCreateWizard(true)}>
              <PlusCircle className="mr-2 h-4 w-4" />
              Создать шаблон
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-muted/50 border-b">
                <tr>
                  <th className="text-left p-4 font-medium text-sm">Название</th>
                  <th className="text-left p-4 font-medium text-sm">Категория</th>
                  <th className="text-left p-4 font-medium text-sm">Канал</th>
                  <th className="text-left p-4 font-medium text-sm">Описание</th>
                  <th className="text-right p-4 font-medium text-sm">Действия</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {templatesData.map(template => {
                  const ChannelIcon = channelIcons[template.channel];
                  return (
                    <tr key={template.id} className="hover:bg-muted/30 transition-colors">
                      <td className="p-4">
                        <div className="font-medium">{template.name}</div>
                      </td>
                      <td className="p-4">
                        <Badge variant="secondary">{template.category}</Badge>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <ChannelIcon className="h-4 w-4 text-muted-foreground"/>
                          <span className="text-sm">{template.channel}</span>
                        </div>
                      </td>
                      <td className="p-4">
                        <p className="text-sm text-muted-foreground max-w-md">{template.description}</p>
                      </td>
                      <td className="p-4">
                        <div className="flex justify-end gap-2">
                          <Button 
                            size="sm" 
                            variant="ghost"
                            onClick={() => {
                              setSelectedTemplate(template);
                              setShowTemplateDetails(true);
                            }}
                            title="Просмотр шаблона"
                          >
                            <Rocket className="h-4 w-4" />
                          </Button>
                          <Button size="sm">
                            <ClipboardCopy className="mr-2 h-3 w-3" />
                            Клонировать
                          </Button>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Template Details Dialog */}
      <Dialog open={showTemplateDetails} onOpenChange={setShowTemplateDetails}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center justify-between">
              <span>{selectedTemplate?.name}</span>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setShowTemplateDetails(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </DialogTitle>
          </DialogHeader>
          
          {selectedTemplate && (
            <div className="space-y-6 mt-4">
              <Tabs defaultValue="overview" className="space-y-4">
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="overview">Обзор</TabsTrigger>
                  <TabsTrigger value="settings">Настройки</TabsTrigger>
                  <TabsTrigger value="content">Контент</TabsTrigger>
                  <TabsTrigger value="analytics">Аналитика</TabsTrigger>
                </TabsList>

                <TabsContent value="overview" className="space-y-4">
                  {/* Основная информация */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Основная информация</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label className="text-sm text-muted-foreground">Категория</Label>
                          <div className="flex items-center gap-2 mt-1">
                            <Tag className="h-4 w-4 text-muted-foreground" />
                            <Badge variant="secondary">{selectedTemplate.category}</Badge>
                          </div>
                        </div>
                        <div>
                          <Label className="text-sm text-muted-foreground">Канал</Label>
                          <div className="flex items-center gap-2 mt-1">
                            {(() => {
                              const Icon = channelIcons[selectedTemplate.channel] || Mail;
                              return <Icon className="h-4 w-4 text-muted-foreground" />;
                            })()}
                            <span>{selectedTemplate.channel}</span>
                          </div>
                        </div>
                        <div>
                          <Label className="text-sm text-muted-foreground">Тип триггера</Label>
                          <p className="mt-1">{selectedTemplate.type || 'Базовый'}</p>
                        </div>
                        <div>
                          <Label className="text-sm text-muted-foreground">Производительность</Label>
                          <div className="flex items-center gap-2 mt-1">
                            <div className="flex gap-1">
                              {[...Array(5)].map((_, i) => (
                                <div
                                  key={i}
                                  className={cn(
                                    "h-2 w-6 rounded",
                                    i < (selectedTemplate.performance || 0)
                                      ? "bg-green-500"
                                      : "bg-gray-200"
                                  )}
                                />
                              ))}
                            </div>
                            <span className="text-sm text-muted-foreground">
                              {selectedTemplate.performance || 0}/5
                            </span>
                          </div>
                        </div>
                      </div>
                      <div>
                        <Label className="text-sm text-muted-foreground">Описание</Label>
                        <p className="mt-1 text-sm">{selectedTemplate.description}</p>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Целевая аудитория */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Целевая аудитория</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <Label className="text-sm text-muted-foreground">География</Label>
                        <div className="flex gap-2 mt-2">
                          {(selectedTemplate.geo || ['Все регионы']).map((geo: string) => (
                            <Badge key={geo} variant="outline">
                              <Globe className="mr-1 h-3 w-3" />
                              {geo}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      <div>
                        <Label className="text-sm text-muted-foreground">Проекты</Label>
                        <div className="flex flex-wrap gap-2 mt-2">
                          {(selectedTemplate.project || ['Все проекты']).map((proj: string) => (
                            <Badge key={proj} variant="secondary">
                              <Layers className="mr-1 h-3 w-3" />
                              {proj}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="settings" className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Настройки отправки</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label className="text-sm text-muted-foreground">Тип отправки</Label>
                          <p className="mt-1">{selectedTemplate.type === 'event' ? 'По событию' : 'Базовая'}</p>
                        </div>
                        {selectedTemplate.event && (
                          <div>
                            <Label className="text-sm text-muted-foreground">Событие</Label>
                            <p className="mt-1">{selectedTemplate.event}</p>
                          </div>
                        )}
                        <div>
                          <Label className="text-sm text-muted-foreground">Приоритет</Label>
                          <Badge className="mt-1">Средний</Badge>
                        </div>
                        <div>
                          <Label className="text-sm text-muted-foreground">Частота отправки</Label>
                          <p className="mt-1">Не чаще 1 раза в день</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Правила сегментации</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <Users className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm">Активные игроки за последние 30 дней</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <DollarSign className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm">Минимальный депозит: €10</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm">Время с регистрации: &gt; 7 дней</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="content" className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Шаблон сообщения</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <Label className="text-sm text-muted-foreground">Заголовок</Label>
                        <p className="mt-1 font-medium">🎁 {selectedTemplate.name}</p>
                      </div>
                      <div>
                        <Label className="text-sm text-muted-foreground">Текст сообщения</Label>
                        <div className="mt-2 p-3 bg-muted rounded-lg">
                          <p className="text-sm">
                            Привет, {'{имя}'}!
                            <br /><br />
                            {selectedTemplate.description}
                            <br /><br />
                            Не упустите шанс получить эксклюзивные бонусы!
                          </p>
                        </div>
                      </div>
                      <div>
                        <Label className="text-sm text-muted-foreground">CTA кнопка</Label>
                        <Button className="mt-2" size="sm">Получить бонус</Button>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="analytics" className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Статистика использования</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="text-center p-4 bg-muted rounded-lg">
                          <div className="text-2xl font-bold">127</div>
                          <p className="text-sm text-muted-foreground">Использований</p>
                        </div>
                        <div className="text-center p-4 bg-muted rounded-lg">
                          <div className="text-2xl font-bold text-green-600">23.4%</div>
                          <p className="text-sm text-muted-foreground">Средняя конверсия</p>
                        </div>
                        <div className="text-center p-4 bg-muted rounded-lg">
                          <div className="text-2xl font-bold text-blue-600">€45.2K</div>
                          <p className="text-sm text-muted-foreground">Общий доход</p>
                        </div>
                        <div className="text-center p-4 bg-muted rounded-lg">
                          <div className="text-2xl font-bold text-purple-600">+234%</div>
                          <p className="text-sm text-muted-foreground">Средний ROI</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Последние кампании</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between p-2 hover:bg-muted rounded">
                          <div>
                            <p className="font-medium text-sm">Summer Promo Campaign</p>
                            <p className="text-xs text-muted-foreground">Запущена 2 дня назад</p>
                          </div>
                          <Badge className="bg-green-100 text-green-700">Активна</Badge>
                        </div>
                        <div className="flex items-center justify-between p-2 hover:bg-muted rounded">
                          <div>
                            <p className="font-medium text-sm">Weekend Bonus Drop</p>
                            <p className="text-xs text-muted-foreground">Завершена 5 дней назад</p>
                          </div>
                          <Badge variant="secondary">Завершена</Badge>
                        </div>
                        <div className="flex items-center justify-between p-2 hover:bg-muted rounded">
                          <div>
                            <p className="font-medium text-sm">Flash Sale Monday</p>
                            <p className="text-xs text-muted-foreground">Запланирована на завтра</p>
                          </div>
                          <Badge variant="outline">Запланирована</Badge>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>

              {/* Действия */}
              <div className="flex justify-end gap-2 pt-4 border-t">
                <Button variant="outline">
                  <ClipboardCopy className="mr-2 h-4 w-4" />
                  Клонировать
                </Button>
                <Button variant="outline">
                  <Settings className="mr-2 h-4 w-4" />
                  Настроить
                </Button>
                <Button 
                  className="bg-green-600 hover:bg-green-700"
                  onClick={() => {
                    handleCreateCampaign(selectedTemplate);
                    setShowTemplateDetails(false);
                  }}
                >
                  <Rocket className="mr-2 h-4 w-4" />
                  Создать кампанию
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Create Template Wizard Dialog */}
      <Dialog open={showCreateWizard} onOpenChange={setShowCreateWizard}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center justify-between">
              <span>Создание нового шаблона</span>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setShowCreateWizard(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </DialogTitle>
          </DialogHeader>

          {/* Progress Bar */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>Шаг {wizardStep} из 5</span>
              <span>{Math.round((wizardStep / 5) * 100)}%</span>
            </div>
            <Progress value={(wizardStep / 5) * 100} className="h-2" />
          </div>

          {/* Wizard Steps */}
          <div className="mt-6">
            {/* Step 1: Basic Info */}
            {wizardStep === 1 && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold">Основная информация</h3>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => setShowAIRecommendations(!showAIRecommendations)}
                  >
                    <Brain className="mr-2 h-4 w-4" />
                    Создать по ИИ рекомендациям
                  </Button>
                </div>

                {/* AI Recommendations Dropdown */}
                {showAIRecommendations && (
                  <Card className="border-primary/20 bg-gradient-to-r from-primary/5 to-purple-500/5">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-base flex items-center gap-2">
                        <Sparkles className="h-4 w-4 text-primary" />
                        Рекомендованные шаблоны
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      {[
                        {
                          name: 'Drip-кампания для новых игроков',
                          description: '78% новых регистраций не делают депозит в первые 24 часа',
                          impact: '+45% FTD конверсия',
                          category: 'welcome',
                          channel: 'multichannel',
                          geo: ['DE', 'AT', 'CH'],
                          type: 'event',
                          event: 'registration',
                          priority: 'critical',
                          content: 'Добро пожаловать в наше казино! Мы подготовили для вас эксклюзивный бонус на первый депозит - 100% до €500 + 50 фриспинов!',
                          ctaText: 'Получить бонус',
                          segmentRules: { minDeposit: '0', daysFromReg: '1', activity: 'new' }
                        },
                        {
                          name: 'Триггер для брошенных депозитов',
                          description: '4,230 брошенных корзин ежедневно со средней суммой €85',
                          impact: '+18% возврат депозитов',
                          category: 'reactivation',
                          channel: 'email',
                          geo: ['UK', 'IE'],
                          type: 'event',
                          event: 'abandoned_deposit',
                          priority: 'high',
                          content: 'Вы были так близки! Завершите депозит и получите дополнительный бонус 10% к сумме пополнения.',
                          ctaText: 'Завершить депозит',
                          segmentRules: { minDeposit: '10', daysFromReg: '7', activity: 'active' }
                        },
                        {
                          name: 'Персонализированные турниры',
                          description: 'Только 12% активных игроков участвуют в турнирах',
                          impact: '+13% участников турниров',
                          category: 'promotion',
                          channel: 'push',
                          geo: ['FR', 'BE', 'LU'],
                          type: 'scheduled',
                          priority: 'medium',
                          frequency: 'weekly',
                          content: 'Эксклюзивный турнир с призовым фондом €5,000 начинается через 2 часа! Забронируйте место.',
                          ctaText: 'Участвовать',
                          segmentRules: { minDeposit: '50', daysFromReg: '30', activity: 'active' }
                        },
                        {
                          name: 'VIP Welcome бонус',
                          description: 'Персонализированный онбординг для хайроллеров',
                          impact: '+67% retention VIP',
                          category: 'loyalty',
                          channel: 'email',
                          geo: ['DE', 'UK', 'FR'],
                          type: 'event',
                          event: 'first_deposit',
                          priority: 'critical',
                          content: 'Добро пожаловать в VIP-клуб! Ваш персональный менеджер свяжется с вами в течение 24 часов для обсуждения эксклюзивных привилегий.',
                          ctaText: 'Активировать VIP статус',
                          segmentRules: { minDeposit: '1000', daysFromReg: '1', activity: 'new' }
                        }
                      ].map((recommendation, index) => (
                        <div 
                          key={index}
                          className="p-3 rounded-lg border hover:bg-muted/50 cursor-pointer transition-colors"
                          onClick={() => {
                            // Заполняем форму данными из рекомендации
                            setTemplateData({
                              name: recommendation.name,
                              category: recommendation.category,
                              channel: recommendation.channel,
                              description: recommendation.description,
                              type: recommendation.type || 'basic',
                              event: recommendation.event || '',
                              geo: recommendation.geo,
                              project: [],
                              subject: `🎁 ${recommendation.name}`,
                              content: recommendation.content,
                              ctaText: recommendation.ctaText,
                              ctaLink: 'https://example.com/promo',
                              segmentRules: recommendation.segmentRules,
                              frequency: recommendation.frequency || 'once',
                              priority: recommendation.priority
                            });
                            setShowAIRecommendations(false);
                          }}
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <h4 className="font-medium text-sm">{recommendation.name}</h4>
                              <p className="text-xs text-muted-foreground mt-1">
                                {recommendation.description}
                              </p>
                            </div>
                            <Badge className="ml-2 text-xs bg-green-100 text-green-700">
                              {recommendation.impact}
                            </Badge>
                          </div>
                          <div className="flex items-center gap-2 mt-2">
                            <Badge variant="outline" className="text-xs">
                              {recommendation.priority === 'critical' ? '🔴' : recommendation.priority === 'high' ? '🟠' : '🟡'}
                              {recommendation.priority === 'critical' ? 'Критично' : recommendation.priority === 'high' ? 'Высокий' : 'Средний'}
                            </Badge>
                            <Badge variant="secondary" className="text-xs">
                              {recommendation.channel === 'multichannel' ? 'Multi-channel' : recommendation.channel.toUpperCase()}
                            </Badge>
                            <Badge variant="secondary" className="text-xs">
                              GEO: {recommendation.geo.join(', ')}
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                )}

                <div className="space-y-4">
                  <div>
                    <Label htmlFor="name">Название шаблона *</Label>
                    <Input
                      id="name"
                      placeholder="Например: Welcome Series для новичков"
                      value={templateData.name}
                      onChange={(e) => setTemplateData({...templateData, name: e.target.value})}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="category">Категория *</Label>
                    <Select 
                      value={templateData.category}
                      onValueChange={(value) => setTemplateData({...templateData, category: value})}
                    >
                      <SelectTrigger className="mt-1">
                        <SelectValue placeholder="Выберите категорию" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="welcome">Welcome</SelectItem>
                        <SelectItem value="retention">Retention</SelectItem>
                        <SelectItem value="reactivation">Reactivation</SelectItem>
                        <SelectItem value="promotion">Promotion</SelectItem>
                        <SelectItem value="loyalty">Loyalty</SelectItem>
                        <SelectItem value="feedback">Feedback</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="channel">Канал отправки *</Label>
                    <Select
                      value={templateData.channel}
                      onValueChange={(value) => setTemplateData({...templateData, channel: value})}
                    >
                      <SelectTrigger className="mt-1">
                        <SelectValue placeholder="Выберите канал" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="email">Email</SelectItem>
                        <SelectItem value="sms">SMS</SelectItem>
                        <SelectItem value="push">Push-уведомления</SelectItem>
                        <SelectItem value="inapp">In-App</SelectItem>
                        <SelectItem value="multichannel">Multi-channel</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="description">Описание</Label>
                    <Textarea
                      id="description"
                      placeholder="Опишите цель и особенности шаблона..."
                      value={templateData.description}
                      onChange={(e) => setTemplateData({...templateData, description: e.target.value})}
                      className="mt-1 min-h-[100px]"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Target Audience */}
            {wizardStep === 2 && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Целевая аудитория</h3>
                <div className="space-y-4">
                  <div>
                    <Label>География</Label>
                    <div className="grid grid-cols-3 gap-3 mt-2">
                      {['DE', 'UK', 'FR', 'US', 'RU', 'ES'].map((geo) => (
                        <div key={geo} className="flex items-center space-x-2">
                          <Checkbox
                            id={geo}
                            checked={templateData.geo.includes(geo)}
                            onCheckedChange={(checked) => {
                              if (checked) {
                                setTemplateData({...templateData, geo: [...templateData.geo, geo]});
                              } else {
                                setTemplateData({...templateData, geo: templateData.geo.filter(g => g !== geo)});
                              }
                            }}
                          />
                          <Label htmlFor={geo} className="cursor-pointer">{geo}</Label>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <Label>Проекты</Label>
                    <div className="grid grid-cols-2 gap-3 mt-2">
                      {['CasinoX', 'LuckyWheel', 'GoldenPlay', 'AIGAMING.BOT'].map((project) => (
                        <div key={project} className="flex items-center space-x-2">
                          <Checkbox
                            id={project}
                            checked={templateData.project.includes(project)}
                            onCheckedChange={(checked) => {
                              if (checked) {
                                setTemplateData({...templateData, project: [...templateData.project, project]});
                              } else {
                                setTemplateData({...templateData, project: templateData.project.filter(p => p !== project)});
                              }
                            }}
                          />
                          <Label htmlFor={project} className="cursor-pointer">{project}</Label>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <Label>Правила сегментации</Label>
                    <div className="space-y-3 mt-2">
                      <div>
                        <Label htmlFor="minDeposit" className="text-sm">Минимальный депозит (€)</Label>
                        <Input
                          id="minDeposit"
                          type="number"
                          placeholder="10"
                          value={templateData.segmentRules.minDeposit}
                          onChange={(e) => setTemplateData({...templateData, segmentRules: {...templateData.segmentRules, minDeposit: e.target.value}})}
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label htmlFor="daysFromReg" className="text-sm">Дней с регистрации</Label>
                        <Input
                          id="daysFromReg"
                          type="number"
                          placeholder="7"
                          value={templateData.segmentRules.daysFromReg}
                          onChange={(e) => setTemplateData({...templateData, segmentRules: {...templateData.segmentRules, daysFromReg: e.target.value}})}
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label htmlFor="activity" className="text-sm">Активность</Label>
                        <Select
                          value={templateData.segmentRules.activity}
                          onValueChange={(value) => setTemplateData({...templateData, segmentRules: {...templateData.segmentRules, activity: value}})}
                        >
                          <SelectTrigger className="mt-1">
                            <SelectValue placeholder="Выберите активность" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="active">Активные</SelectItem>
                            <SelectItem value="sleeping">Спящие</SelectItem>
                            <SelectItem value="churned">В оттоке</SelectItem>
                            <SelectItem value="new">Новые</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Step 3: Content */}
            {wizardStep === 3 && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Контент сообщения</h3>
                <div className="space-y-4">
                  {templateData.channel === 'email' && (
                    <div>
                      <Label htmlFor="subject">Тема письма</Label>
                      <Input
                        id="subject"
                        placeholder="🎁 {имя}, у нас есть специальное предложение для вас!"
                        value={templateData.subject}
                        onChange={(e) => setTemplateData({...templateData, subject: e.target.value})}
                        className="mt-1"
                      />
                    </div>
                  )}
                  
                  <div>
                    <Label htmlFor="content">Текст сообщения *</Label>
                    <Textarea
                      id="content"
                      placeholder="Привет, {имя}!\n\nМы рады приветствовать вас..."
                      value={templateData.content}
                      onChange={(e) => setTemplateData({...templateData, content: e.target.value})}
                      className="mt-1 min-h-[200px]"
                    />
                    <div className="flex gap-2 mt-2">
                      <Button variant="outline" size="sm">
                        <Wand2 className="mr-2 h-4 w-4" />
                        ИИ генерация
                      </Button>
                      <Button variant="outline" size="sm">
                        Добавить переменные
                      </Button>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="ctaText">Текст CTA кнопки</Label>
                    <Input
                      id="ctaText"
                      placeholder="Получить бонус"
                      value={templateData.ctaText}
                      onChange={(e) => setTemplateData({...templateData, ctaText: e.target.value})}
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label htmlFor="ctaLink">Ссылка CTA</Label>
                    <Input
                      id="ctaLink"
                      placeholder="https://example.com/promo"
                      value={templateData.ctaLink}
                      onChange={(e) => setTemplateData({...templateData, ctaLink: e.target.value})}
                      className="mt-1"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Step 4: Trigger Settings */}
            {wizardStep === 4 && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Настройки триггера</h3>
                <div className="space-y-4">
                  <div>
                    <Label>Тип триггера</Label>
                    <RadioGroup
                      value={templateData.type}
                      onValueChange={(value) => setTemplateData({...templateData, type: value})}
                      className="mt-2"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="basic" id="basic" />
                        <Label htmlFor="basic">Базовый (ручной запуск)</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="event" id="event" />
                        <Label htmlFor="event">По событию</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="scheduled" id="scheduled" />
                        <Label htmlFor="scheduled">По расписанию</Label>
                      </div>
                    </RadioGroup>
                  </div>

                  {templateData.type === 'event' && (
                    <div>
                      <Label htmlFor="event">Событие</Label>
                      <Select
                        value={templateData.event}
                        onValueChange={(value) => setTemplateData({...templateData, event: value})}
                      >
                        <SelectTrigger className="mt-1">
                          <SelectValue placeholder="Выберите событие" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="registration">Регистрация</SelectItem>
                          <SelectItem value="first_deposit">Первый депозит</SelectItem>
                          <SelectItem value="login">Вход в систему</SelectItem>
                          <SelectItem value="level_up">Повышение уровня</SelectItem>
                          <SelectItem value="big_win">Крупный выигрыш</SelectItem>
                          <SelectItem value="birthday">День рождения</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  )}

                  <div>
                    <Label>Частота отправки</Label>
                    <RadioGroup
                      value={templateData.frequency}
                      onValueChange={(value) => setTemplateData({...templateData, frequency: value})}
                      className="mt-2"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="once" id="once" />
                        <Label htmlFor="once">Один раз</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="daily" id="daily" />
                        <Label htmlFor="daily">Ежедневно</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="weekly" id="weekly" />
                        <Label htmlFor="weekly">Еженедельно</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="monthly" id="monthly" />
                        <Label htmlFor="monthly">Ежемесячно</Label>
                      </div>
                    </RadioGroup>
                  </div>

                  <div>
                    <Label>Приоритет</Label>
                    <RadioGroup
                      value={templateData.priority}
                      onValueChange={(value) => setTemplateData({...templateData, priority: value})}
                      className="mt-2"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="low" id="low" />
                        <Label htmlFor="low">Низкий</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="medium" id="medium" />
                        <Label htmlFor="medium">Средний</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="high" id="high" />
                        <Label htmlFor="high">Высокий</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="critical" id="critical" />
                        <Label htmlFor="critical">Критический</Label>
                      </div>
                    </RadioGroup>
                  </div>
                </div>
              </div>
            )}

            {/* Step 5: Review */}
            {wizardStep === 5 && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Проверка и создание</h3>
                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    Проверьте все настройки перед созданием шаблона
                  </AlertDescription>
                </Alert>
                
                <div className="space-y-4">
                  <Card>
                    <CardContent className="pt-6">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label className="text-sm text-muted-foreground">Название</Label>
                          <p className="font-medium">{templateData.name || 'Не указано'}</p>
                        </div>
                        <div>
                          <Label className="text-sm text-muted-foreground">Категория</Label>
                          <p className="font-medium">{templateData.category || 'Не указана'}</p>
                        </div>
                        <div>
                          <Label className="text-sm text-muted-foreground">Канал</Label>
                          <p className="font-medium">{templateData.channel || 'Не указан'}</p>
                        </div>
                        <div>
                          <Label className="text-sm text-muted-foreground">Тип триггера</Label>
                          <p className="font-medium">{templateData.type || 'Базовый'}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="pt-6">
                      <Label className="text-sm text-muted-foreground">Описание</Label>
                      <p className="mt-1">{templateData.description || 'Не указано'}</p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="pt-6">
                      <Label className="text-sm text-muted-foreground">Целевая аудитория</Label>
                      <div className="mt-2 space-y-2">
                        <div className="flex gap-2">
                          <span className="text-sm text-muted-foreground">География:</span>
                          {templateData.geo.length > 0 ? (
                            <div className="flex gap-1">
                              {templateData.geo.map(g => (
                                <Badge key={g} variant="outline">{g}</Badge>
                              ))}
                            </div>
                          ) : (
                            <span className="text-sm">Все регионы</span>
                          )}
                        </div>
                        <div className="flex gap-2">
                          <span className="text-sm text-muted-foreground">Проекты:</span>
                          {templateData.project.length > 0 ? (
                            <div className="flex gap-1">
                              {templateData.project.map(p => (
                                <Badge key={p} variant="secondary">{p}</Badge>
                              ))}
                            </div>
                          ) : (
                            <span className="text-sm">Все проекты</span>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            )}
          </div>

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-6 pt-4 border-t">
            <Button
              variant="outline"
              onClick={() => setWizardStep(Math.max(1, wizardStep - 1))}
              disabled={wizardStep === 1}
            >
              <ChevronLeft className="mr-2 h-4 w-4" />
              Назад
            </Button>
            
            {wizardStep < 5 ? (
              <Button
                onClick={() => setWizardStep(Math.min(5, wizardStep + 1))}
                disabled={!templateData.name || !templateData.category || !templateData.channel}
              >
                Далее
                <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            ) : (
              <Button
                className="bg-green-600 hover:bg-green-700"
                onClick={() => {
                  // Сохранить шаблон
                  console.log('Создан новый шаблон:', templateData);
                  setShowCreateWizard(false);
                  setWizardStep(1);
                  // Сброс формы
                  setTemplateData({
                    name: '',
                    category: '',
                    channel: '',
                    description: '',
                    type: 'basic',
                    event: '',
                    geo: [],
                    project: [],
                    subject: '',
                    content: '',
                    ctaText: '',
                    ctaLink: '',
                    segmentRules: {
                      minDeposit: '',
                      daysFromReg: '',
                      activity: ''
                    },
                    frequency: 'once',
                    priority: 'medium'
                  });
                }}
              >
                <CheckCircle2 className="mr-2 h-4 w-4" />
                Создать шаблон
              </Button>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
