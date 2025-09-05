"use client";

import * as React from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PlusCircle, Zap, Settings, Bot, Layers, Target, DollarSign } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { TemplatesGrid } from '@/components/builder/templates-grid';
import { AIScenariosTab, type AIScenario } from '@/components/builder/ai-scenarios-tab';
import { TemplateData } from '@/lib/types';
import { CompactCurrencyToggle, CurrencyToggleButton } from "@/components/ui/currency-toggle";
import { CurrencyBadge } from "@/components/ui/currency-badge";
import { useCurrency } from "@/contexts/currency-context";
import { useRouter, useSearchParams } from "next/navigation";

function searchParamsSafe() {
  // хелпер, возвращаем прокси без SSR обращения
  const sp = typeof window !== 'undefined' ? new URLSearchParams(window.location.search) : null;
  return {
    get: (key: string) => sp ? sp.get(key) : null
  } as unknown as URLSearchParams;
}

// Динамический импорт Builder компонента для избежания SSR проблем
const BuilderWrapper = React.lazy(() => import('./builder-standalone'));

export default function ScenariosPage() {
    const [isBuilderMode, setIsBuilderMode] = React.useState(false);
    const [editingScenario, setEditingScenario] = React.useState<TemplateData | null>(null);
    const [isCreateDialogOpen, setIsCreateDialogOpen] = React.useState(false);
    
    // Валютные настройки
    const { state: currencyState } = useCurrency();
    const router = useRouter();
    const search = searchParamsSafe();
    const initialTab = (search?.get('tab') || 'all') as 'all'|'default'|'tournaments'|'event-driven'|'promo-events';
    const [tab, setTab] = React.useState<typeof initialTab>(initialTab);

    const handleTabChange = (value: string) => {
        setTab(value as any);
        if (typeof window !== 'undefined') {
          const params = new URLSearchParams(window.location.search);
          params.set('tab', value);
          router.replace(`/builder?${params.toString()}`);
        }
    };

    const handleEditTemplate = (templateData: TemplateData) => {
        setEditingScenario(templateData); // Передаем данные шаблона для редактирования
        setIsBuilderMode(true);
    };
    
    const handleCloneTemplate = (templateData: TemplateData) => {
        // Клонируем шаблон (создаем копию с новым ID)
        const clonedTemplate = {
            ...templateData,
            id: `${templateData.id}_clone_${Date.now()}`,
            name: `${templateData.name} (копия)`
        };
        setEditingScenario(clonedTemplate);
        setIsBuilderMode(true);
    };
    
    const handleCreateNew = () => {
        setEditingScenario(null); // Создаем новый сценарий
        setIsBuilderMode(true);
        setIsCreateDialogOpen(false); // Закрываем диалог
    };

    const handleCreateAIScenario = (aiScenario: AIScenario) => {
        const mapChannel = (c: string): 'Email' | 'Push' | 'SMS' | 'InApp' | 'Multi-channel' => {
            const lc = (c || '').toLowerCase();
            if (lc === 'email') return 'Email';
            if (lc === 'push') return 'Push';
            if (lc === 'sms') return 'SMS';
            if (lc === 'inapp' || lc === 'in-app' || lc === 'in_app') return 'InApp';
            return 'Email';
        };
        // Конвертируем AI-сценарий в TemplateData для передачи в builder
        const templateData: TemplateData = {
            id: `ai_${aiScenario.id}_${Date.now()}`,
            name: aiScenario.name,
            description: `${aiScenario.description}\n\nЦелевая метрика: ${aiScenario.targetMetric}\nОжидаемое улучшение: ${aiScenario.expectedImprovement}\nКаналы: ${aiScenario.channels.join(', ')}\nТриггеры: ${aiScenario.triggers.join(', ')}`,
            type: 'custom',
            category: aiScenario.category.toLowerCase(),
            channel: aiScenario.channels.length > 1 ? 'Multi-channel' : mapChannel(aiScenario.channels[0] || 'email'),
            performance: 5, // AI-сценарии имеют высокую оценку
            // Builder-specific config omitted to satisfy TemplateData type
        };
        setEditingScenario(templateData);
        setIsBuilderMode(true);
        setIsCreateDialogOpen(false);
    };

    const handleCreateFromScratch = () => {
        setEditingScenario(null);
        setIsBuilderMode(true);
        setIsCreateDialogOpen(false);
    };

    const handleBuilderExit = () => {
        setIsBuilderMode(false);
        setEditingScenario(null);
    };

    if (isBuilderMode) {
    return (
            <React.Suspense fallback={
                <div className="flex items-center justify-center h-screen">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                        <p className="text-muted-foreground">Загружаем конструктор...</p>
                    </div>
        </div>
            }>
                <BuilderWrapper onExit={handleBuilderExit} scenario={editingScenario} />
            </React.Suspense>
        );
    }

    return (
        <div className="p-4 md:p-6 lg:p-8 space-y-6">
            <div className="flex items-center justify-between">
                        <div>
                    <h1 className="text-2xl font-bold tracking-tight">Сценарии</h1>
                    <p className="text-muted-foreground">
                        Создавайте, управляйте и анализируйте ваши CRM-кампании и сценарии.
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <CompactCurrencyToggle />
                    <div className="text-xs text-muted-foreground">
                        Офферы в: <CurrencyBadge currency={currencyState.base_currency || 'EUR'} size="sm" />
                    </div>
                </div>
                        </div>
            
            {/* Раздел с шаблонами */}
            <div id="templates-section">
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h2 className="text-xl font-semibold">Библиотека шаблонов</h2>
                        <p className="text-sm text-muted-foreground">
                            Готовые сценарии для быстрого старта. Клонируйте или редактируйте под свои нужды.
                        </p>
                    </div>
                    <Button onClick={() => setIsCreateDialogOpen(true)}>
                        <PlusCircle className="mr-2 h-4 w-4" />
                        Создать пустой сценарий
                    </Button>
                </div>

                <Tabs value={tab} onValueChange={handleTabChange} className="space-y-4">
                    <TabsList className="flex flex-wrap gap-2">
                        <TabsTrigger value="all">Все</TabsTrigger>
                        <TabsTrigger value="default">Дефолтные</TabsTrigger>
                        <TabsTrigger value="tournaments">Турниры</TabsTrigger>
                        <TabsTrigger value="event-driven">Событийные</TabsTrigger>
                        <TabsTrigger value="promo-events">Эвенты</TabsTrigger>
                    </TabsList>

                    <TabsContent value="all">
                        <TemplatesGrid onClone={handleCloneTemplate} onEdit={handleEditTemplate} />
                    </TabsContent>
                    <TabsContent value="default">
                        <TemplatesGrid onClone={handleCloneTemplate} onEdit={handleEditTemplate} predicate={(t)=> t.type==='basic'} />
                    </TabsContent>
                    <TabsContent value="tournaments">
                        <TemplatesGrid onClone={handleCloneTemplate} onEdit={handleEditTemplate} predicate={(t)=> (t.category||'').toLowerCase().includes('tournament')} />
                    </TabsContent>
                    <TabsContent value="event-driven">
                        <TemplatesGrid onClone={handleCloneTemplate} onEdit={handleEditTemplate} predicate={(t)=> t.type==='event'} />
                    </TabsContent>
                    <TabsContent value="promo-events">
                        <TemplatesGrid onClone={handleCloneTemplate} onEdit={handleEditTemplate} predicate={(t)=> (t.category||'').toLowerCase().includes('promotion') || (t.category||'').toLowerCase().includes('loyalty')} />
                    </TabsContent>
                </Tabs>
            </div>

            {/* Раздел с конструктором */}
            <div id="constructor-section" className="pt-8 mt-8 border-t">
                <div className="grid gap-6 md:grid-cols-2">
                    <Card className="relative overflow-hidden border-2 border-dashed hover:border-primary/50 transition-colors group">
                        <CardHeader>
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-primary/10 rounded-lg group-hover:bg-primary/20 transition-colors">
                                    <Zap className="h-6 w-6 text-primary" />
                                </div>
                                <div>
                                    <CardTitle>Быстрое создание</CardTitle>
                                    <CardDescription>Создайте сценарий с нуля</CardDescription>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <p className="text-sm text-muted-foreground">
                                Используйте drag&drop конструктор для создания сложных многошаговых кампаний 
                                с условной логикой, A/B тестами и персонализацией.
                            </p>
                            <Button size="lg" onClick={handleCreateNew} className="w-full">
                                Перейти в конструктор
                            </Button>
                        </CardContent>
                    </Card>

                    <Card className="relative overflow-hidden border-2 border-dashed hover:border-primary/50 transition-colors group">
                        <CardHeader>
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-primary/10 rounded-lg group-hover:bg-primary/20 transition-colors">
                                    <Settings className="h-6 w-6 text-primary" />
                                </div>
                                <div>
                                    <CardTitle>Расширенные функции</CardTitle>
                                    <CardDescription>Мощные возможности для экспертов</CardDescription>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <ul className="text-sm text-muted-foreground space-y-2">
                                <li>• Условная логика и ветвления</li>
                                <li>• A/B тестирование кампаний</li>
                                <li>• Интеграция с сегментами и метриками</li>
                                <li>• AI-ассистент для оптимизации</li>
                            </ul>
                            <Button size="lg" variant="outline" onClick={handleCreateNew} className="w-full">
                                Создать продвинутый сценарий
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            </div>

            {/* Create Scenario Dialog */}
            <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
                <DialogContent className="max-w-6xl max-h-[90vh] flex flex-col">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                            <Target className="h-5 w-5" />
                            Создание сценария
                        </DialogTitle>
                        <DialogDescription>
                            Выберите способ создания сценария: используйте AI-рекомендации, создайте с нуля или выберите готовый шаблон
                        </DialogDescription>
                    </DialogHeader>

                    <Tabs defaultValue="ai-scenarios" className="flex-1 flex flex-col">
                        <TabsList className="grid w-full grid-cols-3">
                            <TabsTrigger value="ai-scenarios">
                                <div className="flex items-center gap-2">
                                    <Bot className="h-4 w-4" />
                                    <span>ИИ сценарии</span>
                                </div>
                            </TabsTrigger>
                            <TabsTrigger value="from-scratch">
                                <div className="flex items-center gap-2">
                                    <Zap className="h-4 w-4" />
                                    <span>Создать с нуля</span>
                                </div>
                            </TabsTrigger>
                            <TabsTrigger value="templates">
                                <div className="flex items-center gap-2">
                                    <Layers className="h-4 w-4" />
                                    <span>Шаблоны сценариев</span>
                                </div>
                            </TabsTrigger>
                        </TabsList>

                        <TabsContent value="ai-scenarios" className="flex-1 overflow-hidden">
                            <ScrollArea className="h-[500px]">
                                <AIScenariosTab onCreateScenario={handleCreateAIScenario} />
                            </ScrollArea>
                        </TabsContent>

                        <TabsContent value="from-scratch" className="flex-1">
                            <div className="flex items-center justify-center h-[500px]">
                                <Card className="w-full max-w-md p-6 text-center">
                                    <CardHeader>
                                        <div className="p-4 bg-primary/10 rounded-full w-fit mx-auto mb-4">
                                            <Zap className="h-8 w-8 text-primary" />
                                        </div>
                                        <CardTitle>Создать сценарий с нуля</CardTitle>
                                        <CardDescription>
                                            Используйте drag&drop конструктор для создания кампаний с условной логикой и персонализацией
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <Button size="lg" onClick={handleCreateFromScratch} className="w-full">
                                            <Zap className="mr-2 h-5 w-5" />
                                            Открыть конструктор
                                        </Button>
                                    </CardContent>
                                </Card>
                            </div>
                        </TabsContent>

                        <TabsContent value="templates" className="flex-1 overflow-hidden">
                            <ScrollArea className="h-[500px]">
                                <div className="p-1">
                                    <div className="space-y-2 mb-4">
                                        <h3 className="text-lg font-semibold flex items-center gap-2">
                                            <Layers className="h-5 w-5" />
                                            Шаблоны сценариев
                                        </h3>
                                        <p className="text-sm text-muted-foreground">
                                            Готовые шаблоны для быстрого создания кампаний
                                        </p>
                                    </div>
                                    <TemplatesGrid 
                                        onClone={(template) => {
                                            handleCloneTemplate(template);
                                            setIsCreateDialogOpen(false);
                                        }} 
                                        onEdit={(template) => {
                                            handleEditTemplate(template);
                                            setIsCreateDialogOpen(false);
                                        }}
                                    />
                                </div>
                            </ScrollArea>
                        </TabsContent>
                    </Tabs>
                </DialogContent>
            </Dialog>
        </div>
    );
}