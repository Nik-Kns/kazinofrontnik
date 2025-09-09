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
  Star, 
  Zap,
  Brain,
  Sparkles,
  AlertCircle,
  TrendingUp,
  Target,
  DollarSign,
  ArrowRight,
  Clock,
  CheckCircle2
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";


const channelIcons: Record<string, React.ElementType> = {
  Email: Mail,
  Push: Smartphone,
  SMS: MessageSquare,
  InApp: Zap,
  "Multi-channel": Zap,
};

const PerformanceStars = ({ count }: { count: number }) => (
  <div className="flex items-center gap-0.5">
    {Array.from({ length: 5 }).map((_, i) => (
      <Star key={i} className={`h-4 w-4 ${i < count ? 'text-yellow-400 fill-yellow-400' : 'text-muted-foreground/50'}`} />
    ))}
  </div>
);

// ИИ-рекомендации для шаблонов
const aiTemplateRecommendations = [
  {
    id: '1',
    priority: 'critical',
    title: 'Внедрить Drip-кампанию для новых игроков',
    description: '78% новых регистраций не делают депозит в первые 24 часа',
    impact: '+45% конверсия FTD',
    revenue: '€380,000/мес',
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
    revenue: '€245,000/мес',
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
    revenue: '€168,000/мес',
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
              Общий потенциал: €793,000/мес
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

                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-1">
                        <TrendingUp className="h-3 w-3 text-green-600" />
                        <span className="font-medium">{rec.impact}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <DollarSign className="h-3 w-3 text-green-600" />
                        <span className="font-bold text-green-700">{rec.revenue}</span>
                      </div>
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

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {templatesData.map(template => {
          const ChannelIcon = channelIcons[template.channel];
          return (
            <Card key={template.id} className="flex flex-col">
              <CardHeader>
                <div className="flex items-start justify-between">
                    <div>
                        <Badge variant="secondary" className="mb-2">{template.category}</Badge>
                        <CardTitle>{template.name}</CardTitle>
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                        <ChannelIcon className="h-5 w-5"/>
                        <span>{template.channel}</span>
                    </div>
                </div>
                <CardDescription>{template.description}</CardDescription>
              </CardHeader>
              <CardContent className="flex flex-1 flex-col justify-end">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-xs text-muted-foreground mb-1">Эффективность</p>
                        <PerformanceStars count={template.performance} />
                    </div>
                    <Button>
                        <ClipboardCopy className="mr-2 h-4 w-4" />
                        Клонировать
                    </Button>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  );
}
