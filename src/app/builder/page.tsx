
"use client";

import * as React from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Activity, ArrowLeft, Bot, BotMessageSquare, CheckCircle, ClipboardCopy, Clock, FileText, GitBranch, Gift, Lightbulb, Mail, MessageSquare, Pencil, PhoneCall, PlusCircle, Smartphone, Sparkles, Star, Trash2, Zap } from "lucide-react";
import { cn } from "@/lib/utils";
import { Sheet, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle, SheetClose } from '@/components/ui/sheet';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { segmentsData, scenariosData, templatesData } from '@/lib/mock-data';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import type { ScenarioData } from '@/lib/types';
import { Textarea } from '@/components/ui/textarea';
import { Slider } from '@/components/ui/slider';

import ReactFlow, {
  Controls,
  MiniMap,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  ReactFlowProvider,
  Handle,
  Position,
  useReactFlow,
  getBezierPath,
  EdgeLabelRenderer,
  BaseEdge,
  type Node,
  type Edge,
  type OnConnect,
} from 'reactflow';
import 'reactflow/dist/style.css';
import { AiCopilotChat } from '@/components/ai/ai-copilot-chat';

// --- Helper components & data for TABS ---

// For "Templates" Tab
const channelIconsTemplates: { [key: string]: React.ElementType } = {
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

// For "Campaigns" Tab
const channelIconsScenarios: Record<string, React.ElementType> = {
  Email: Mail,
  Push: Smartphone,
  SMS: MessageSquare,
  InApp: Zap,
  "Multi-channel": Zap,
};

const statusColors: { [key: string]: string } = {
  Активен: "bg-success",
  Пауза: "bg-warning",
  Завершён: "bg-muted-foreground",
};

const frequencyColors: { [key: string]: string } = {
  Триггерный: "secondary",
  Регулярный: "default",
  Разовый: "outline",
}

// --- TAB COMPONENTS ---

const AllCampaignsTab = ({ onEdit }: { onEdit: (scenario: ScenarioData) => void }) => (
    <Card>
      <CardHeader>
        <CardTitle>Все сценарии и кампании</CardTitle>
        <CardDescription>
          Сводная таблица всех CRM-сценариев с ключевыми показателями эффективности.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[250px]">Название сценария</TableHead>
              <TableHead>Тип</TableHead>
              <TableHead>Канал</TableHead>
              <TableHead>Статус</TableHead>
              <TableHead>Сегмент</TableHead>
              <TableHead>Цель</TableHead>
              <TableHead className="text-right">CR</TableHead>
              <TableHead className="text-right">Действия</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {scenariosData.map((scenario) => {
              const ChannelIcon = channelIconsScenarios[scenario.channel];
              return (
                <TableRow key={scenario.name}>
                  <TableCell className="font-medium">{scenario.name}</TableCell>
                  <TableCell>
                     <Badge variant={frequencyColors[scenario.frequency] as "secondary" | "default" | "outline"}>{scenario.frequency}</Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <ChannelIcon className="h-4 w-4 text-muted-foreground" />
                      {scenario.channel}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <span className={cn("h-2.5 w-2.5 rounded-full", statusColors[scenario.status])} />
                      {scenario.status}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{scenario.segment}</Badge>
                  </TableCell>
                  <TableCell>{scenario.goal}</TableCell>
                  <TableCell className="text-right text-success font-semibold">{scenario.cr}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="icon" onClick={() => onEdit(scenario)}>
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon">
                      <FileText className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
);

const TemplatesTab = () => {
  const [selectedTypeFilters, setSelectedTypeFilters] = React.useState<string[]>(['all']);
  const [selectedGeoFilters, setSelectedGeoFilters] = React.useState<string[]>([]);
  const [selectedProjectFilters, setSelectedProjectFilters] = React.useState<string[]>([]);
  const [searchQuery, setSearchQuery] = React.useState('');
  const [isCreateDialogOpen, setIsCreateDialogOpen] = React.useState(false);
  const [newTemplate, setNewTemplate] = React.useState({
    name: '',
    description: '',
    type: 'basic' as 'event' | 'basic' | 'custom',
    event: '' as string,
    channel: 'Email' as 'Email' | 'Push' | 'SMS' | 'InApp' | 'Multi-channel',
    category: '',
    geo: [] as string[],
    project: [] as string[]
  });
  
  // Get available filter options
  const availableGeos = React.useMemo(() => {
    const geos = new Set<string>();
    templatesData.forEach(template => {
      template.geo?.forEach(geo => geos.add(geo));
    });
    return Array.from(geos).sort();
  }, []);

  const availableProjects = React.useMemo(() => {
    const projects = new Set<string>();
    templatesData.forEach(template => {
      template.project?.forEach(project => projects.add(project));
    });
    return Array.from(projects).sort();
  }, []);

  // Filter templates based on multiple criteria
  const filteredTemplates = React.useMemo(() => {
    return templatesData.filter(template => {
      // Type filter
      const matchesType = selectedTypeFilters.includes('all') || 
        selectedTypeFilters.some(type => template.type === type);

      // GEO filter
      const matchesGeo = selectedGeoFilters.length === 0 || 
        selectedGeoFilters.some(geo => template.geo?.includes(geo));

      // Project filter
      const matchesProject = selectedProjectFilters.length === 0 || 
        selectedProjectFilters.some(project => template.project?.includes(project));

      // Search filter (works within selected filters)
      const matchesSearch = searchQuery === '' || 
        template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        template.description.toLowerCase().includes(searchQuery.toLowerCase());

      return matchesType && matchesGeo && matchesProject && matchesSearch;
    });
  }, [selectedTypeFilters, selectedGeoFilters, selectedProjectFilters, searchQuery]);

  // Calculate dynamic statistics based on current filters
  const filterStats = React.useMemo(() => {
    // First apply geo and project filters
    const baseFiltered = templatesData.filter(template => {
      const matchesGeo = selectedGeoFilters.length === 0 || 
        selectedGeoFilters.some(geo => template.geo?.includes(geo));
      const matchesProject = selectedProjectFilters.length === 0 || 
        selectedProjectFilters.some(project => template.project?.includes(project));
      return matchesGeo && matchesProject;
    });

    // Then calculate type stats within those constraints
    const stats = {
      all: baseFiltered.length,
      event: baseFiltered.filter(t => t.type === 'event').length,
      basic: baseFiltered.filter(t => t.type === 'basic').length,
      custom: baseFiltered.filter(t => t.type === 'custom').length,
    };
    return stats;
  }, [selectedGeoFilters, selectedProjectFilters]);

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'event': return 'Событийный';
      case 'basic': return 'Базовый'; 
      case 'custom': return 'Пользовательский';
      default: return 'Все';
    }
  };

  const getTypeBadge = (type: string) => {
    switch (type) {
      case 'event': return { emoji: '🟦', color: 'bg-blue-100 text-blue-700 border-blue-200' };
      case 'basic': return { emoji: '🟩', color: 'bg-green-100 text-green-700 border-green-200' };
      case 'custom': return { emoji: '🟨', color: 'bg-yellow-100 text-yellow-700 border-yellow-200' };
      default: return { emoji: '', color: '' };
    }
  };

  const getEventLabel = (event?: string) => {
    switch (event) {
      case 'first_deposit': return 'Первый депозит';
      case 'withdrawal': return 'Вывод';
      case 'registration': return 'Регистрация';
      case 'inactivity': return 'Неактивность';
      case 'big_win': return 'Крупный выигрыш';
      case 'bonus_activation': return 'Активация бонуса';
      case 'login': return 'Логин';
      case 'game_start': return 'Начало игры';
      default: return '';
    }
  };

  // Handle multi-select for type filters
  const handleTypeFilterToggle = (type: string) => {
    if (type === 'all') {
      setSelectedTypeFilters(['all']);
    } else {
      setSelectedTypeFilters(prev => {
        const newFilters = prev.filter(f => f !== 'all');
        if (newFilters.includes(type)) {
          const filtered = newFilters.filter(f => f !== type);
          return filtered.length === 0 ? ['all'] : filtered;
        } else {
          return [...newFilters, type];
        }
      });
    }
  };

  // Handle GEO filter toggle
  const handleGeoFilterToggle = (geo: string) => {
    setSelectedGeoFilters(prev => 
      prev.includes(geo) 
        ? prev.filter(g => g !== geo)
        : [...prev, geo]
    );
  };

  // Handle Project filter toggle
  const handleProjectFilterToggle = (project: string) => {
    setSelectedProjectFilters(prev => 
      prev.includes(project) 
        ? prev.filter(p => p !== project)
        : [...prev, project]
    );
  };

  const handleCreateTemplate = () => {
    // Here you would typically make an API call to create the template
    console.log('Creating template:', newTemplate);
    setIsCreateDialogOpen(false);
    setNewTemplate({
      name: '',
      description: '',
      type: 'basic',
      event: '',
      channel: 'Email',
      category: '',
      geo: [],
      project: []
    });
  };

  return (
    <div className="space-y-6">
      {/* Filter Panel */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Фильтры шаблонов</CardTitle>
              <CardDescription>
                Настройте фильтры по типу, географии и проектам. Найдено: {filteredTemplates.length} из {templatesData.length} шаблонов
              </CardDescription>
            </div>
            <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Создать шаблон
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Создать новый шаблон</DialogTitle>
                  <DialogDescription>
                    Создайте новый шаблон сценария для использования в кампаниях.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label htmlFor="template-name">Название шаблона</Label>
                    <Input
                      id="template-name"
                      value={newTemplate.name}
                      onChange={(e) => setNewTemplate(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="Например: Приветственный бонус"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="template-description">Описание</Label>
                    <Textarea
                      id="template-description"
                      value={newTemplate.description}
                      onChange={(e) => setNewTemplate(prev => ({ ...prev, description: e.target.value }))}
                      placeholder="Краткое описание шаблона..."
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="template-type">Тип шаблона</Label>
                    <Select
                      value={newTemplate.type}
                      onValueChange={(value: 'event' | 'basic' | 'custom') => 
                        setNewTemplate(prev => ({ ...prev, type: value, event: value !== 'event' ? '' : prev.event }))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="basic">🟩 Базовый</SelectItem>
                        <SelectItem value="event">🟦 Событийный</SelectItem>
                        <SelectItem value="custom">🟨 Пользовательский</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  {newTemplate.type === 'event' && (
                    <div className="grid gap-2">
                      <Label htmlFor="template-event">Событие</Label>
                      <Select
                        value={newTemplate.event}
                        onValueChange={(value) => setNewTemplate(prev => ({ ...prev, event: value }))}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Выберите событие..." />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="registration">Регистрация</SelectItem>
                          <SelectItem value="first_deposit">Первый депозит</SelectItem>
                          <SelectItem value="withdrawal">Вывод</SelectItem>
                          <SelectItem value="inactivity">Неактивность</SelectItem>
                          <SelectItem value="big_win">Крупный выигрыш</SelectItem>
                          <SelectItem value="bonus_activation">Активация бонуса</SelectItem>
                          <SelectItem value="login">Логин</SelectItem>
                          <SelectItem value="game_start">Начало игры</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  )}
                  <div className="grid gap-2">
                    <Label htmlFor="template-channel">Канал коммуникации</Label>
                    <Select
                      value={newTemplate.channel}
                      onValueChange={(value: 'Email' | 'Push' | 'SMS' | 'InApp' | 'Multi-channel') => 
                        setNewTemplate(prev => ({ ...prev, channel: value }))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Email">Email</SelectItem>
                        <SelectItem value="Push">Push</SelectItem>
                        <SelectItem value="SMS">SMS</SelectItem>
                        <SelectItem value="InApp">InApp</SelectItem>
                        <SelectItem value="Multi-channel">Multi-channel</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="template-category">Категория</Label>
                    <Input
                      id="template-category"
                      value={newTemplate.category}
                      onChange={(e) => setNewTemplate(prev => ({ ...prev, category: e.target.value }))}
                      placeholder="Например: Onboarding, Retention..."
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="template-geo">География (GEO)</Label>
                    <div className="flex flex-wrap gap-1">
                      {availableGeos.map(geo => (
                        <Button
                          key={geo}
                          type="button"
                          variant={newTemplate.geo.includes(geo) ? "default" : "outline"}
                          size="sm"
                          onClick={() => setNewTemplate(prev => ({
                            ...prev,
                            geo: prev.geo.includes(geo) 
                              ? prev.geo.filter(g => g !== geo)
                              : [...prev.geo, geo]
                          }))}
                        >
                          {geo}
                        </Button>
                      ))}
                    </div>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="template-project">Проекты</Label>
                    <div className="flex flex-wrap gap-1">
                      {availableProjects.map(project => (
                        <Button
                          key={project}
                          type="button"
                          variant={newTemplate.project.includes(project) ? "default" : "outline"}
                          size="sm"
                          onClick={() => setNewTemplate(prev => ({
                            ...prev,
                            project: prev.project.includes(project) 
                              ? prev.project.filter(p => p !== project)
                              : [...prev.project, project]
                          }))}
                        >
                          {project}
                        </Button>
                      ))}
                    </div>
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                    Отмена
                  </Button>
                  <Button onClick={handleCreateTemplate} disabled={!newTemplate.name || !newTemplate.description}>
                    Создать шаблон
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col space-y-6">
            {/* Search Input */}
            <div>
              <Label className="text-sm font-medium mb-2 block">Поиск</Label>
              <Input 
                placeholder="Поиск по названию или описанию..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="max-w-sm"
              />
              {searchQuery && (
                <p className="text-xs text-muted-foreground mt-1">
                  Поиск работает в рамках выбранных фильтров
                </p>
              )}
            </div>
            
            {/* Type Filter Buttons */}
            <div>
              <Label className="text-sm font-medium mb-2 block">Тип шаблона</Label>
              <div className="flex flex-wrap gap-2">
                {(['all', 'event', 'basic', 'custom'] as const).map((type) => (
                  <Button
                    key={type}
                    variant={selectedTypeFilters.includes(type) ? "default" : "outline"}
                    onClick={() => handleTypeFilterToggle(type)}
                    className="flex items-center gap-2"
                    size="sm"
                  >
                    {type !== 'all' && <span>{getTypeBadge(type).emoji}</span>}
                    {getTypeLabel(type)} ({filterStats[type]})
                  </Button>
                ))}
              </div>
            </div>

            {/* GEO Filter */}
            <div>
              <Label className="text-sm font-medium mb-2 block">География (GEO)</Label>
              <div className="flex flex-wrap gap-2">
                {availableGeos.map((geo) => (
                  <Button
                    key={geo}
                    variant={selectedGeoFilters.includes(geo) ? "default" : "outline"}
                    onClick={() => handleGeoFilterToggle(geo)}
                    size="sm"
                  >
                    {geo} ({templatesData.filter(t => t.geo?.includes(geo)).length})
                  </Button>
                ))}
                {selectedGeoFilters.length > 0 && (
                  <Button
                    variant="ghost"
                    onClick={() => setSelectedGeoFilters([])}
                    size="sm"
                    className="text-muted-foreground"
                  >
                    Очистить
                  </Button>
                )}
              </div>
            </div>

            {/* Project Filter */}
            <div>
              <Label className="text-sm font-medium mb-2 block">Проект</Label>
              <div className="flex flex-wrap gap-2">
                {availableProjects.map((project) => (
                  <Button
                    key={project}
                    variant={selectedProjectFilters.includes(project) ? "default" : "outline"}
                    onClick={() => handleProjectFilterToggle(project)}
                    size="sm"
                  >
                    {project} ({templatesData.filter(t => t.project?.includes(project)).length})
                  </Button>
                ))}
                {selectedProjectFilters.length > 0 && (
                  <Button
                    variant="ghost"
                    onClick={() => setSelectedProjectFilters([])}
                    size="sm"
                    className="text-muted-foreground"
                  >
                    Очистить
                  </Button>
                )}
              </div>
            </div>

            {/* Active Filters Summary */}
            {(selectedTypeFilters.length > 1 || !selectedTypeFilters.includes('all') || 
              selectedGeoFilters.length > 0 || selectedProjectFilters.length > 0) && (
              <div className="p-3 bg-muted/50 rounded-lg">
                <p className="text-sm font-medium mb-2">Активные фильтры:</p>
                <div className="flex flex-wrap gap-1 text-xs">
                  {!selectedTypeFilters.includes('all') && selectedTypeFilters.length > 0 && (
                    <Badge variant="secondary">
                      Типы: {selectedTypeFilters.map(t => getTypeLabel(t)).join(', ')}
                    </Badge>
                  )}
                  {selectedGeoFilters.length > 0 && (
                    <Badge variant="secondary">
                      GEO: {selectedGeoFilters.join(', ')}
                    </Badge>
                  )}
                  {selectedProjectFilters.length > 0 && (
                    <Badge variant="secondary">
                      Проекты: {selectedProjectFilters.join(', ')}
                    </Badge>
                  )}
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Templates Grid */}
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredTemplates.map(template => {
          const ChannelIcon = channelIconsTemplates[template.channel];
          const typeBadge = getTypeBadge(template.type);
          
          return (
            <Card key={template.id} className="flex flex-col">
              <CardHeader>
                <div className="flex items-start justify-between">
                    <div>
                        <div className="flex items-center gap-2 mb-2">
                          <Badge variant="secondary">{template.category}</Badge>
                          <Badge className={`${typeBadge.color} text-xs`}>
                            {typeBadge.emoji} {getTypeLabel(template.type)}
                          </Badge>
                        </div>
                        <CardTitle>{template.name}</CardTitle>
                        {template.type === 'event' && template.event && (
                          <p className="text-xs text-muted-foreground mt-1">
                            Событие: {getEventLabel(template.event)}
                          </p>
                        )}
                        {template.geo && template.geo.length > 0 && (
                          <p className="text-xs text-muted-foreground mt-1">
                            GEO: {template.geo.join(', ')}
                          </p>
                        )}
                        {template.project && template.project.length > 0 && (
                          <p className="text-xs text-muted-foreground mt-1">
                            Проекты: {template.project.join(', ')}
                          </p>
                        )}
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

      {/* Empty State */}
      {filteredTemplates.length === 0 && (
        <Card>
          <CardContent className="py-8 text-center">
            <p className="text-muted-foreground">
              Шаблоны не найдены. Попробуйте изменить фильтры или поисковый запрос.
            </p>
          </CardContent>
        </Card>
      )}
      </div>
);
};


// --- Builder Components ---

const triggerElements = [
  { name: 'Попадание в сегмент', icon: GitBranch, description: 'Срабатывает при попадании игрока в определенный сегмент.', type: 'segmentTrigger' },
  { name: 'Регистрация', icon: PlusCircle, description: 'Сценарий запускается при регистрации нового пользователя.', type: 'registrationTrigger' },
  { name: 'Первый депозит', icon: CheckCircle, description: 'Срабатывает после первого пополнения счета.', type: 'depositTrigger' },
];

const actionElements = [
  { name: 'Отправить Email', icon: Mail, description: 'Отправка email-сообщения через SendGrid.', type: 'emailAction' },
  { name: 'Отправить Push', icon: Smartphone, description: 'Отправка push-уведомления.', type: 'pushAction' },
  { name: 'Отправить SMS', icon: MessageSquare, description: 'Отправка SMS через Twilio.', type: 'smsAction' },
  { name: 'AI Звонок', icon: PhoneCall, description: 'Инициировать звонок через Twilio с AI-ассистентом.', type: 'aiCallAction' },
  { name: 'In-App сообщение', icon: Zap, description: 'Показ сообщения внутри приложения.', type: 'inappAction' },
  { name: 'Начислить бонус', icon: Gift, description: 'Начисление бонусных баллов или фриспинов игроку.', type: 'bonusAction' },
];

const logicElements = [
  { name: 'Задержка', icon: Clock, description: 'Пауза в сценарии на заданное время.', type: 'delayLogic' },
  { name: 'Условие "Если/То"', icon: GitBranch, description: 'Разветвление сценария на основе данных игрока.', type: 'ifElseLogic' },
  { name: 'A/B тест', icon: Activity, description: 'Разделение аудитории для проверки гипотез.', type: 'abTestLogic' },
];

const elementLibrary = {
    ...triggerElements.reduce((acc, el) => ({ ...acc, [el.type]: el }), {}),
    ...actionElements.reduce((acc, el) => ({ ...acc, [el.type]: el }), {}),
    ...logicElements.reduce((acc, el) => ({ ...acc, [el.type]: el }), {}),
};


const NodeConfigPanel = ({ node, isOpen, onOpenChange }: { node: Node | null, isOpen: boolean, onOpenChange: (open: boolean) => void }) => {
    if (!node) return null;

    const renderForm = () => {
        switch(node.data.configType) {
            case 'segmentTrigger':
                return (
                     <div className="space-y-4">
                        <Label>Выберите сегмент</Label>
                        <Select defaultValue={segmentsData[2].id}>
                            <SelectTrigger>
                                <SelectValue placeholder="Выберите сегмент..." />
                            </SelectTrigger>
                            <SelectContent>
                                {segmentsData.map(s => <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>)}
                            </SelectContent>
                        </Select>
                        <Card className="bg-muted/50">
                            <CardContent className="p-3 text-sm text-muted-foreground">
                                <p className="font-bold mb-2">Описание сегмента:</p>
                                {segmentsData.find(s => s.id === (node.data.config?.segmentId || segmentsData[2].id))?.description}
                            </CardContent>
                        </Card>
                     </div>
                );
            case 'emailAction':
                return (
                    <div className="space-y-4">
                        <div>
                            <Label>Интеграция</Label>
                            <div className="flex items-center gap-2 rounded-md border p-2 bg-muted/50">
                                <img src="https://www.vectorlogo.zone/logos/sendgrid/sendgrid-icon.svg" alt="SendGrid" className="h-5 w-5"/>
                                <span className="text-sm font-medium">Отправка через SendGrid</span>
                            </div>
                        </div>
                         <div>
                            <Label htmlFor="email-template">Шаблон письма</Label>
                            <Select defaultValue="we-miss-you">
                                <SelectTrigger id="email-template"><SelectValue /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="we-miss-you">We miss you bonus</SelectItem>
                                    <SelectItem value="welcome-gift">Welcome Gift</SelectItem>
                                    <SelectItem value="deposit-success">Успешный депозит</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div>
                            <Label htmlFor="email-subject">Тема письма</Label>
                            <Input id="email-subject" defaultValue="Для вас специальный бонус!"/>
                        </div>
                        <div>
                            <Label>Контент</Label>
                            <Tabs defaultValue="ai" className="w-full">
                                <TabsList className="grid w-full grid-cols-2">
                                    <TabsTrigger value="ai"><Bot className="mr-2 h-4 w-4"/> С AI</TabsTrigger>
                                    <TabsTrigger value="manual">Редактор</TabsTrigger>
                                </TabsList>
                                <TabsContent value="ai" className="pt-4 space-y-2">
                                    <Textarea placeholder="Опишите суть письма: напомнить про бонус, поздравить с годовщиной регистрации..." defaultValue="Напомни игроку, что мы скучаем и даем ему 25 фриспинов на Book of Ra, если он вернется."/>
                                    <Button className="w-full"><Bot className="mr-2 h-4 w-4"/>Сгенерировать</Button>
                                </TabsContent>
                                <TabsContent value="manual" className="pt-4">
                                    <Textarea defaultValue="Привет, {{firstName}}! Мы скучали! Чтобы скрасить твое возвращение, мы начислили тебе 25 фриспинов в игре Book of Ra. Жми на кнопку и забирай свой подарок!" className="min-h-[200px]"/>
                                </TabsContent>
                            </Tabs>
                        </div>
                    </div>
                )
             case 'aiCallAction':
                return (
                    <div className="space-y-4">
                        <div>
                            <Label>Интеграция</Label>
                            <div className="flex items-center gap-2 rounded-md border p-2 bg-muted/50">
                                <img src="https://www.vectorlogo.zone/logos/twilio/twilio-icon.svg" alt="Twilio" className="h-5 w-5"/>
                                <span className="text-sm font-medium">Звонок через Twilio</span>
                            </div>
                        </div>
                        <div>
                            <Label htmlFor="ai-voice">Голос AI</Label>
                            <Select defaultValue="female-1">
                                <SelectTrigger id="ai-voice"><SelectValue /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="female-1">Женский (Eva)</SelectItem>
                                    <SelectItem value="male-1">Мужской (Alex)</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div>
                            <Label htmlFor="ai-prompt">Сценарий звонка (AI промпт)</Label>
                            <Textarea
                                id="ai-prompt"
                                placeholder="Опишите цель звонка и что должен сказать AI. Вы можете использовать переменные, например {{firstName}}."
                                defaultValue="Привет, {{firstName}}. Мы из AIGAMING.BOT. Заметили, что вы давно не заходили. Хотим предложить вам специальный бонус - 50 фриспинов. Вам интересно?"
                                className="min-h-[200px]"
                            />
                        </div>
                    </div>
                );
            case 'ifElseLogic':
                return (
                    <div className="space-y-4">
                       <Label>Условие ветвления</Label>
                       <div className="p-4 border rounded-lg space-y-2 bg-muted/30">
                           <p className="text-sm">Если пользователь соответствует правилу:</p>
                           <div className="flex items-center gap-2">
                               <Select defaultValue="Monetary Value (total spend)">
                                   <SelectTrigger><SelectValue/></SelectTrigger>
                                   <SelectContent><SelectItem value="Monetary Value (total spend)">Lifetime Spend</SelectItem></SelectContent>
                               </Select>
                               <Select defaultValue="больше чем">
                                   <SelectTrigger><SelectValue/></SelectTrigger>
                                   <SelectContent><SelectItem value="больше чем">больше чем</SelectItem></SelectContent>
                               </Select>
                               <Input placeholder="Значение" defaultValue="1000" />
                           </div>
                       </div>
                       <p className="text-sm text-muted-foreground">Пользователи, не соответствующие правилу, пойдут по ветке "Else".</p>
                    </div>
                )
             case 'abTestLogic':
                return (
                    <div className="space-y-6">
                        <Label>Разделение трафика</Label>
                        <div className="flex items-center gap-4">
                            <span className="text-sm font-medium">Ветка A</span>
                            <Slider defaultValue={[50]} max={100} step={1} />
                            <span className="text-sm font-medium">Ветка B</span>
                        </div>
                        <div className="flex justify-between text-sm font-bold text-primary">
                            <span>50%</span>
                            <span>50%</span>
                        </div>
                        <p className="text-xs text-muted-foreground">Аудитория будет случайным образом разделена в указанной пропорции для отправки разных версий сообщения.</p>
                    </div>
                )
            case 'bonusAction':
                 return (
                     <div className="space-y-4">
                         <div>
                            <Label htmlFor="bonus-type">Тип бонуса</Label>
                            <Select defaultValue="freespins">
                                <SelectTrigger id="bonus-type">
                                    <SelectValue placeholder="Выберите тип" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="freespins">Фриспины</SelectItem>
                                    <SelectItem value="deposit_bonus">Бонус на депозит</SelectItem>
                                    <SelectItem value="cashback">Кэшбек</SelectItem>
                                </SelectContent>
                            </Select>
                         </div>
                         <div>
                            <Label htmlFor="bonus-amount">Количество / Процент</Label>
                            <Input id="bonus-amount" type="number" defaultValue="25" />
                         </div>
                         <div>
                            <Label htmlFor="bonus-wager">Вейджер (Wager)</Label>
                            <Input id="bonus-wager" type="number" defaultValue="40" placeholder="x40" />
                         </div>
                         <div>
                            <Label htmlFor="bonus-ttl">Срок жизни бонуса (в часах)</Label>
                            <Input id="bonus-ttl" type="number" defaultValue="72" />
                         </div>
                     </div>
                 )
            default:
                return <p className="text-muted-foreground">Для этого элемента нет дополнительных настроек.</p>
        }
    }

    return (
        <Sheet open={isOpen} onOpenChange={onOpenChange}>
            <SheetContent className="sm:max-w-md">
                <SheetHeader>
                    <SheetTitle>Настройка: {node.data.label}</SheetTitle>
                    <SheetDescription>
                        Отредактируйте параметры для выбранного элемента сценария.
                    </SheetDescription>
                </SheetHeader>
                <div className="py-6">
                    {renderForm()}
                </div>
                <SheetFooter>
                    <SheetClose asChild>
                        <Button type="button" variant="secondary">Отмена</Button>
                    </SheetClose>
                     <SheetClose asChild>
                        <Button type="submit">Сохранить</Button>
                    </SheetClose>
                </SheetFooter>
            </SheetContent>
        </Sheet>
    )
}

// --- React Flow Implementation ---

const initialNodes: Node[] = [
  { id: '1', type: 'custom', position: { x: 250, y: 5 }, data: { label: 'Триггер: Попал в сегмент', description: 'Сегмент: Риск оттока (предиктивный)', icon: GitBranch, configType: 'segmentTrigger' } },
  { id: '2', type: 'custom', position: { x: 250, y: 155 }, data: { label: 'Условие: VIP игрок?', description: 'Если Lifetime Spend > €1000', icon: GitBranch, configType: 'ifElseLogic' } },
  { id: '3', type: 'custom', position: { x: 50, y: 305 }, data: { label: 'Действие: Начислить бонус', description: 'Тип: Кэшбек, Кол-во: 10%', icon: Gift, configType: 'bonusAction' } },
  { id: '4', type: 'custom', position: { x: 450, y: 305 }, data: { label: 'Логика: A/B тест', description: 'Разделение 50% / 50%', icon: Activity, configType: 'abTestLogic' } },
  { id: '5', type: 'custom', position: { x: 350, y: 455 }, data: { label: 'Действие: Email (Скидка)', description: 'Шаблон: "Скидка 15%"', icon: Mail, configType: 'emailAction' } },
  { id: '6', type: 'custom', position: { x: 550, y: 455 }, data: { label: 'Действие: Email (Бонус)', description: 'Шаблон: "Бонус 25 FS"', icon: Mail, configType: 'emailAction' } },
];

const initialEdges: Edge[] = [
  { id: 'e1-2', source: '1', target: '2', animated: true, type: 'custom' },
  { id: 'e2-3', source: '2', target: '3', label: 'Да', type: 'custom' },
  { id: 'e2-4', source: '2', target: '4', label: 'Нет', type: 'custom' },
  { id: 'e4-5', source: '4', target: '5', label: 'Ветка A', type: 'custom' },
  { id: 'e4-6', source: '4', target: '6', label: 'Ветка B', type: 'custom' },
];

const CustomNode = ({ data }: { data: { label: string, description: string, icon: React.ElementType } }) => {
  const Icon = data.icon;
  return (
    <>
      <Handle type="target" position={Position.Top} className="!bg-primary" />
      <Card className="w-72 shadow-lg hover:shadow-xl transition-shadow bg-card z-10 hover:border-primary">
        <CardContent className="p-4">
          <div className="flex items-center gap-3 mb-2">
            <Icon className="h-5 w-5 text-primary" />
            <h4 className="font-semibold">{data.label}</h4>
          </div>
          <p className="text-sm text-muted-foreground">{data.description}</p>
        </CardContent>
      </Card>
      <Handle type="source" position={Position.Bottom} className="!bg-primary" />
    </>
  );
};

function CustomEdge({ id, sourceX, sourceY, targetX, targetY, sourcePosition, targetPosition, style = {}, label }: any) {
  const { setEdges } = useReactFlow();
  const [edgePath, labelX, labelY] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });

  const onEdgeClick = (evt: React.MouseEvent) => {
    evt.stopPropagation();
    setEdges((edges) => edges.filter((edge) => edge.id !== id));
  };

  return (
    <>
      <BaseEdge path={edgePath} style={style} />
      <EdgeLabelRenderer>
        <div
          style={{
            position: 'absolute',
            transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
            pointerEvents: 'all',
          }}
          className="nodrag nopan bg-background p-1 rounded-md text-xs font-semibold"
        >
          {label}
        </div>
        <div
           style={{
            position: 'absolute',
            transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
            pointerEvents: 'all',
          }}
          className="nodrag nopan group"
        >
            <Button
                variant="destructive"
                className="h-6 w-6 opacity-0 group-hover:opacity-100"
                size="icon"
                onClick={onEdgeClick}
                >
                <Trash2 className="h-3 w-3" />
            </Button>
        </div>
      </EdgeLabelRenderer>
    </>
  );
}

const nodeTypes = {
  custom: CustomNode,
};

const edgeTypes = {
  custom: CustomEdge,
};

let id = 7;
const getId = () => `dndnode_${id++}`;

const Builder = ({ onExit, scenario }: { onExit: () => void; scenario: ScenarioData | null }) => {
    const reactFlowWrapper = React.useRef<HTMLDivElement>(null);
    const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
    const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
    const [selectedNode, setSelectedNode] = React.useState<Node | null>(null);
    const [isSheetOpen, setIsSheetOpen] = React.useState(false);
    const [isCopilotOpen, setIsCopilotOpen] = React.useState(false);
    const { screenToFlowPosition } = useReactFlow();

    const onConnect: OnConnect = React.useCallback(
        (params) => setEdges((eds) => addEdge({ ...params, animated: true, type: 'custom' }, eds)),
        [setEdges]
    );

    const handleNodeClick = React.useCallback((event: React.MouseEvent, node: Node) => {
        setSelectedNode(node);
        setIsSheetOpen(true);
    }, []);

    const onDragStart = (event: React.DragEvent<HTMLDivElement>, nodeType: string) => {
        event.dataTransfer.setData('application/reactflow', nodeType);
        event.dataTransfer.effectAllowed = 'move';
    };

    const onDragOver = React.useCallback((event: React.DragEvent) => {
        event.preventDefault();
        event.dataTransfer.dropEffect = 'move';
    }, []);

    const onDrop = React.useCallback(
        (event: React.DragEvent) => {
            event.preventDefault();

            if (!reactFlowWrapper.current) return;
            const type = event.dataTransfer.getData('application/reactflow');

            if (typeof type === 'undefined' || !type) {
                return;
            }

            const position = screenToFlowPosition({
                x: event.clientX,
                y: event.clientY,
            });

            const elementInfo = elementLibrary[type as keyof typeof elementLibrary];

            if (!elementInfo) return;

            const newNode: Node = {
                id: getId(),
                type: 'custom',
                position,
                data: { 
                    label: (elementInfo as any).name, 
                    description: (elementInfo as any).description, 
                    icon: (elementInfo as any).icon, 
                    configType: (elementInfo as any).type 
                },
            };
            
            setNodes((nds) => nds.concat(newNode));
        },
        [screenToFlowPosition, setNodes]
    );

    const DraggableNode = ({ item }: { item: { name: string, icon: React.ElementType, description: string, type: string } }) => (
        <div
            className="mb-1.5 cursor-grab rounded-lg border p-2 hover:shadow-md active:cursor-grabbing bg-background"
            onDragStart={(event) => onDragStart(event, item.type)}
            draggable
        >
            <div className="flex items-center gap-2">
                <item.icon className="h-4 w-4 text-primary" />
                <span className="text-sm font-semibold">{item.name}</span>
            </div>
            <p className="mt-1 text-xs text-muted-foreground">{item.description}</p>
        </div>
    );
    
    return (
        <div className="fixed inset-0 bg-background z-50 flex flex-col">
            <header className="flex h-16 shrink-0 items-center justify-between border-b bg-background/95 px-6 flex-wrap gap-2 z-10">
                <div className="flex items-center gap-4">
                    <Button variant="outline" size="icon" onClick={onExit}>
                        <ArrowLeft className="h-4 w-4" />
                    </Button>
                    <div>
                        <h1 className="text-xl font-bold tracking-tight">{scenario?.name || "Новый сценарий"}</h1>
                        <p className="text-sm text-muted-foreground">Создавайте автоматизированные CRM-цепочки</p>
                    </div>
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                    <Button variant="outline" size="sm"> <Sparkles className="mr-2 h-4 w-4" />Prettify</Button>
                    <Button variant="outline">Сохранить как черновик</Button>
                    <Button>Активировать сценарий</Button>
                    <Button variant="default" className="bg-accent text-accent-foreground hover:bg-accent/90" onClick={() => setIsCopilotOpen(true)}>
                        <BotMessageSquare className="mr-2 h-4 w-4" />
                        AI Co-pilot
                    </Button>
                </div>
            </header>
            <div className="flex flex-1 flex-row overflow-hidden">
                <aside className="hidden w-[280px] flex-shrink-0 flex-col border-r bg-background/80 md:flex">
                    <div className="flex h-full flex-col p-4">
                        <h3 className="mb-4 text-lg font-semibold">Элементы</h3>
                        <ScrollArea className="flex-1 -mr-4 pr-4">
                            <div className="space-y-4">
                                <div>
                                    <h4 className="mb-2 text-sm font-medium text-muted-foreground">Триггеры</h4>
                                    {triggerElements.map(item => <DraggableNode key={item.name} item={item} />)}
                                </div>
                                <div>
                                    <h4 className="mb-2 text-sm font-medium text-muted-foreground">Действия</h4>
                                    {actionElements.map(item => <DraggableNode key={item.name} item={item} />)}
                                </div>
                                <div>
                                    <h4 className="mb-2 text-sm font-medium text-muted-foreground">Логика</h4>
                                    {logicElements.map(item => <DraggableNode key={item.name} item={item} />)}
                                </div>
                            </div>
                        </ScrollArea>
                    </div>
                </aside>
                <main className="flex-1" ref={reactFlowWrapper}>
                    <ReactFlow
                        nodes={nodes}
                        edges={edges}
                        onNodesChange={onNodesChange}
                        onEdgesChange={onEdgesChange}
                        onConnect={onConnect}
                        onNodeClick={handleNodeClick}
                        nodeTypes={nodeTypes}
                        edgeTypes={edgeTypes}
                        onDrop={onDrop}
                        onDragOver={onDragOver}
                        fitView
                    >
                        <Controls />
                        <MiniMap />
                        <Background gap={16} />
                    </ReactFlow>
                </main>
            </div>
            <NodeConfigPanel node={selectedNode} isOpen={isSheetOpen} onOpenChange={setIsSheetOpen} />
            <Sheet open={isCopilotOpen} onOpenChange={setIsCopilotOpen}>
                <SheetContent className="sm:max-w-lg">
                    <SheetHeader>
                        <SheetTitle className="flex items-center gap-2"><BotMessageSquare /> AI Co-pilot</SheetTitle>
                        <SheetDescription>
                            Ваш помощник в создании эффективных сценариев. Опишите задачу, и AI предложит решение.
                        </SheetDescription>
                    </SheetHeader>
                    <div className="py-4 h-[calc(100%-80px)]">
                       <AiCopilotChat copilotType="scenario_builder" />
                    </div>
                </SheetContent>
            </Sheet>
        </div>
    );
};

const BuilderWrapper = (props: { onExit: () => void; scenario: ScenarioData | null }) => (
    <ReactFlowProvider>
        <Builder {...props} />
    </ReactFlowProvider>
);


export default function ScenariosPage() {
    const [activeTab, setActiveTab] = React.useState('campaigns');
    const [isBuilderMode, setIsBuilderMode] = React.useState(false);
    const [editingScenario, setEditingScenario] = React.useState<ScenarioData | null>(null);

    const handleEditClick = (scenario: ScenarioData) => {
        setEditingScenario(scenario);
        setIsBuilderMode(true);
    };

    const handleTabChange = (value: string) => {
        if (value === 'builder') {
            setEditingScenario(null);
            setIsBuilderMode(true);
        } else {
            setIsBuilderMode(false);
            setActiveTab(value);
        }
    };
    
    const handleExitBuilder = () => {
        setIsBuilderMode(false);
        setEditingScenario(null);
    };

    return (
        <div className="p-4 md:p-6 lg:p-8">
            <h1 className="text-2xl font-bold tracking-tight">Сценарии</h1>
            <p className="text-muted-foreground mb-6">
                Создавайте, управляйте и анализируйте ваши CRM-кампании и сценарии.
            </p>
            <Tabs value={isBuilderMode ? 'builder' : activeTab} onValueChange={handleTabChange} className="w-full">
                <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4">
                    <TabsTrigger value="campaigns">Все кампании</TabsTrigger>
                    <TabsTrigger value="active">Активные</TabsTrigger>
                    <TabsTrigger value="templates">Шаблоны сценариев</TabsTrigger>
                    <TabsTrigger value="builder">Конструктор</TabsTrigger>
                </TabsList>
                <TabsContent value="campaigns" className="mt-6">
                    <AllCampaignsTab onEdit={handleEditClick} />
                </TabsContent>
                <TabsContent value="active" className="mt-6">
                    <AllCampaignsTab onEdit={handleEditClick} />
                </TabsContent>
                <TabsContent value="templates" className="mt-6">
                    <TemplatesTab />
                </TabsContent>
            </Tabs>

            {isBuilderMode && <BuilderWrapper onExit={handleExitBuilder} scenario={editingScenario} />}
        </div>
    );
}
