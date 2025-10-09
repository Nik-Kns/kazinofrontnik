"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Plus,
  Sparkles,
  Clock,
  Users,
  TrendingUp,
  Zap,
  Calendar,
  UserCheck,
  UserX,
  Gift,
  Target,
  AlertCircle,
  ChevronRight,
  Filter,
  Search
} from "lucide-react";
import { SectionOnboarding } from "@/components/onboarding/section-onboarding";
import { SCENARIOS_ONBOARDING } from "@/lib/onboarding-configs";
import { TooltipOverlay } from "@/components/onboarding/tooltip-overlay";
import { SCENARIOS_TOOLTIPS } from "@/lib/tooltip-configs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScenarioTemplate } from "@/lib/types";

const aiTemplates: ScenarioTemplate[] = [
  {
    id: "welcome-series",
    name: "Приветственная серия для новых игроков",
    description: "Автоматическая последовательность коммуникаций для онбординга новых игроков с персонализированными бонусами",
    category: "onboarding",
    estimatedRevenue: "€45K - €67K/мес",
    conversionRate: "32%",
    segmentCoverage: {
      percentage: 85,
      totalPlayers: 2340
    },
    scenario: {
      name: "Welcome Series",
      description: "Multi-step onboarding flow",
      status: "draft"
    },
    aiRecommended: true,
    difficulty: "easy"
  },
  {
    id: "churn-prevention",
    name: "Предотвращение оттока VIP игроков",
    description: "Триггерный сценарий для удержания VIP игроков при снижении активности",
    category: "retention",
    estimatedRevenue: "€187K - €245K/мес",
    conversionRate: "47%",
    segmentCoverage: {
      percentage: 92,
      totalPlayers: 450
    },
    scenario: {
      name: "VIP Churn Prevention",
      description: "Advanced retention flow for VIP players",
      status: "draft"
    },
    aiRecommended: true,
    difficulty: "medium"
  },
  {
    id: "deposit-booster",
    name: "Стимулирование повторных депозитов",
    description: "Умная система начисления бонусов на основе паттернов игрового поведения",
    category: "reactivation",
    estimatedRevenue: "€78K - €112K/мес",
    conversionRate: "28%",
    segmentCoverage: {
      percentage: 73,
      totalPlayers: 8920
    },
    scenario: {
      name: "Smart Deposit Booster",
      description: "Behavioral trigger-based bonus system",
      status: "draft"
    },
    aiRecommended: true,
    difficulty: "hard"
  },
  {
    id: "weekly-tournaments",
    name: "Еженедельные турниры для активных",
    description: "Автоматические приглашения на турниры с прогрессивными наградами",
    category: "retention",
    estimatedRevenue: "€95K - €130K/мес",
    conversionRate: "38%",
    segmentCoverage: {
      percentage: 67,
      totalPlayers: 5430
    },
    scenario: {
      name: "Weekly Tournament Invites",
      description: "Automated tournament invitation system",
      status: "draft"
    },
    aiRecommended: false,
    difficulty: "easy"
  },
  {
    id: "birthday-campaign",
    name: "Поздравления с днем рождения",
    description: "Персонализированные поздравления с эксклюзивными подарками",
    category: "retention",
    estimatedRevenue: "€12K - €18K/мес",
    conversionRate: "52%",
    segmentCoverage: {
      percentage: 100,
      totalPlayers: 890
    },
    scenario: {
      name: "Birthday Celebrations",
      description: "Personalized birthday greetings and bonuses",
      status: "draft"
    },
    aiRecommended: false,
    difficulty: "easy"
  },
  {
    id: "win-back-30days",
    name: "Возврат игроков после 30 дней",
    description: "Многоэтапная кампания для реактивации неактивных игроков",
    category: "reactivation",
    estimatedRevenue: "€156K - €189K/мес",
    conversionRate: "18%",
    segmentCoverage: {
      percentage: 88,
      totalPlayers: 12450
    },
    scenario: {
      name: "30-Day Win-Back",
      description: "Multi-step reactivation campaign",
      status: "draft"
    },
    aiRecommended: true,
    difficulty: "medium"
  }
];

const existingScenarios = [
  {
    id: "scenario-1",
    name: "Утренние фриспины",
    status: "active" as const,
    players: 3450,
    conversionRate: 24,
    revenue: 67000,
    lastRun: "2 часа назад"
  },
  {
    id: "scenario-2",
    name: "VIP кэшбэк программа",
    status: "active" as const,
    players: 890,
    conversionRate: 42,
    revenue: 234000,
    lastRun: "5 часов назад"
  },
  {
    id: "scenario-3",
    name: "Реактивация спящих",
    status: "paused" as const,
    players: 12300,
    conversionRate: 15,
    revenue: 45000,
    lastRun: "3 дня назад"
  }
];

export default function TriggersPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [isOnboardingOpen, setIsOnboardingOpen] = useState(false);

  const handleCreateFromTemplate = (templateId: string) => {
    router.push(`/triggers/builder/new?template=${templateId}`);
  };

  const handleEditScenario = (scenarioId: string) => {
    router.push(`/triggers/builder/${scenarioId}`);
  };

  const handleCreateNew = () => {
    router.push("/triggers/builder/new");
  };

  const filteredTemplates = aiTemplates.filter(template => {
    const matchesSearch = template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          template.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter === "all" || template.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="flex-1 space-y-6 p-8 pt-6">
      {/* Заголовок */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Конструктор сценариев</h1>
          <p className="text-muted-foreground">
            Создавайте автоматические сценарии для управления коммуникациями
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            onClick={() => setIsOnboardingOpen(true)}
            variant="outline"
            className="flex items-center gap-2"
          >
            <Sparkles className="h-4 w-4" />
            Как работать с разделом
          </Button>
          <Button data-tooltip="create-scenario" onClick={handleCreateNew} size="lg">
            <Plus className="mr-2 h-5 w-5" />
            Создать сценарий
          </Button>
        </div>
      </div>

      <Tabs defaultValue="templates" className="space-y-6">
        <TabsList>
          <TabsTrigger value="templates">
            <Sparkles className="mr-2 h-4 w-4" />
            ИИ-рекомендации
          </TabsTrigger>
          <TabsTrigger value="active">
            <Zap className="mr-2 h-4 w-4" />
            Активные ({existingScenarios.filter(s => s.status === 'active').length})
          </TabsTrigger>
          <TabsTrigger value="all">
            <Clock className="mr-2 h-4 w-4" />
            Все сценарии ({existingScenarios.length})
          </TabsTrigger>
        </TabsList>

        {/* ИИ-рекомендации */}
        <TabsContent value="templates" className="space-y-6" data-tooltip="ai-copilot">
          {/* Фильтры */}
          <div className="flex gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Поиск шаблонов..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-[200px]">
                <Filter className="mr-2 h-4 w-4" />
                <SelectValue placeholder="Категория" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Все категории</SelectItem>
                <SelectItem value="onboarding">Онбординг</SelectItem>
                <SelectItem value="retention">Удержание</SelectItem>
                <SelectItem value="reactivation">Реактивация</SelectItem>
                <SelectItem value="vip">VIP</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Алерт с рекомендациями */}
          <Card className="border-blue-200 bg-blue-50/50">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Sparkles className="h-5 w-5 text-blue-600" />
                ИИ обнаружил возможности для роста
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-3">
                На основе анализа вашей базы игроков, мы рекомендуем запустить следующие сценарии:
              </p>
              <div className="flex flex-wrap gap-2">
                <Badge variant="secondary">
                  <TrendingUp className="mr-1 h-3 w-3" />
                  +€823K потенциальный доход
                </Badge>
                <Badge variant="secondary">
                  <Users className="mr-1 h-3 w-3" />
                  Покрытие 89% активных игроков
                </Badge>
                <Badge variant="secondary">
                  <Target className="mr-1 h-3 w-3" />
                  Средняя конверсия 35%
                </Badge>
              </div>
            </CardContent>
          </Card>

          {/* Сетка шаблонов */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3" data-tooltip="scenario-builder">
            {filteredTemplates.map((template) => (
              <Card
                key={template.id}
                className="group hover:shadow-lg transition-all cursor-pointer relative overflow-hidden"
                onClick={() => handleCreateFromTemplate(template.id)}
              >
                {template.aiRecommended && (
                  <div className="absolute top-0 right-0 bg-gradient-to-l from-blue-600 to-purple-600 text-white px-3 py-1 text-xs font-medium rounded-bl-lg">
                    <Sparkles className="inline-block h-3 w-3 mr-1" />
                    ИИ рекомендует
                  </div>
                )}
                
                <CardHeader>
                  <div className="flex items-start justify-between mb-2">
                    <div className="p-2 rounded-lg bg-primary/10">
                      {template.category === 'onboarding' && <UserCheck className="h-5 w-5 text-primary" />}
                      {template.category === 'retention' && <Users className="h-5 w-5 text-primary" />}
                      {template.category === 'reactivation' && <UserX className="h-5 w-5 text-primary" />}
                      {template.category === 'vip' && <Gift className="h-5 w-5 text-primary" />}
                      {template.category === 'custom' && <Zap className="h-5 w-5 text-primary" />}
                    </div>
                    <Badge variant={
                      template.difficulty === 'easy' ? 'secondary' :
                      template.difficulty === 'medium' ? 'default' : 'destructive'
                    }>
                      {template.difficulty === 'easy' && 'Простой'}
                      {template.difficulty === 'medium' && 'Средний'}
                      {template.difficulty === 'hard' && 'Сложный'}
                    </Badge>
                  </div>
                  
                  <CardTitle className="text-lg group-hover:text-primary transition-colors">
                    {template.name}
                  </CardTitle>
                  <CardDescription className="line-clamp-2">
                    {template.description}
                  </CardDescription>
                </CardHeader>
                
                <CardContent>
                  <div className="space-y-3">
                    {/* Метрики */}
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div>
                        <p className="text-muted-foreground">Доход</p>
                        <p className="font-semibold text-green-600">{template.estimatedRevenue}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Конверсия</p>
                        <p className="font-semibold">{template.conversionRate}</p>
                      </div>
                    </div>
                    
                    {/* Покрытие сегмента */}
                    <div className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Покрытие сегмента</span>
                        <span className="font-medium">{template.segmentCoverage.percentage}%</span>
                      </div>
                      <div className="h-2 bg-secondary rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-primary transition-all"
                          style={{ width: `${template.segmentCoverage.percentage}%` }}
                        />
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {template.segmentCoverage.totalPlayers.toLocaleString()} игроков
                      </p>
                    </div>

                    {/* Кнопка действия */}
                    <Button className="w-full group-hover:bg-primary" variant="outline">
                      Создать сценарий
                      <ChevronRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Активные сценарии */}
        <TabsContent value="active" className="space-y-4" data-tooltip="scenarios-list">
          {existingScenarios.filter(s => s.status === 'active').map((scenario) => (
            <Card key={scenario.id} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-green-100">
                      <Zap className="h-5 w-5 text-green-600" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{scenario.name}</CardTitle>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="secondary" className="bg-green-100 text-green-700">
                          Активен
                        </Badge>
                        <span className="text-sm text-muted-foreground">
                          Последний запуск: {scenario.lastRun}
                        </span>
                      </div>
                    </div>
                  </div>
                  <Button 
                    variant="outline"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleEditScenario(scenario.id);
                    }}
                  >
                    Редактировать
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Охват</p>
                    <p className="text-lg font-semibold">
                      <Users className="inline-block h-4 w-4 mr-1" />
                      {scenario.players.toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Конверсия</p>
                    <p className="text-lg font-semibold">
                      <Target className="inline-block h-4 w-4 mr-1" />
                      {scenario.conversionRate}%
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Доход</p>
                    <p className="text-lg font-semibold text-green-600">
                      €{scenario.revenue.toLocaleString()}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        {/* Все сценарии */}
        <TabsContent value="all" className="space-y-4">
          {existingScenarios.map((scenario) => (
            <Card key={scenario.id} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${
                      scenario.status === 'active' ? 'bg-green-100' : 'bg-gray-100'
                    }`}>
                      <Zap className={`h-5 w-5 ${
                        scenario.status === 'active' ? 'text-green-600' : 'text-gray-600'
                      }`} />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{scenario.name}</CardTitle>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge 
                          variant="secondary" 
                          className={scenario.status === 'active' 
                            ? "bg-green-100 text-green-700" 
                            : "bg-gray-100 text-gray-700"
                          }
                        >
                          {scenario.status === 'active' ? 'Активен' : 'На паузе'}
                        </Badge>
                        <span className="text-sm text-muted-foreground">
                          Последний запуск: {scenario.lastRun}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    {scenario.status === 'paused' && (
                      <Button variant="outline" size="sm">
                        <Zap className="mr-2 h-4 w-4" />
                        Запустить
                      </Button>
                    )}
                    <Button 
                      variant="outline"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleEditScenario(scenario.id);
                      }}
                    >
                      Редактировать
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Охват</p>
                    <p className="text-lg font-semibold">
                      <Users className="inline-block h-4 w-4 mr-1" />
                      {scenario.players.toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Конверсия</p>
                    <p className="text-lg font-semibold">
                      <Target className="inline-block h-4 w-4 mr-1" />
                      {scenario.conversionRate}%
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Доход</p>
                    <p className="text-lg font-semibold text-green-600">
                      €{scenario.revenue.toLocaleString()}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>
      </Tabs>

      {/* Section Onboarding */}
      <SectionOnboarding
        open={isOnboardingOpen}
        onOpenChange={setIsOnboardingOpen}
        steps={SCENARIOS_ONBOARDING}
        sectionName="Сценарии"
      />

      {/* Tooltip Overlay */}
      <TooltipOverlay
        steps={SCENARIOS_TOOLTIPS}
        storageKey="scenarios-tooltips-completed"
      />
    </div>
  );
}