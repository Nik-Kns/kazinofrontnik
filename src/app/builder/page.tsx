"use client";

import * as React from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PlusCircle, Zap, Settings } from "lucide-react";
import { TemplatesGrid } from '@/components/builder/templates-grid';
import { TemplateData } from '@/lib/types';

// Динамический импорт Builder компонента для избежания SSR проблем
const BuilderWrapper = React.lazy(() => import('./builder-standalone'));

export default function ScenariosPage() {
    const [isBuilderMode, setIsBuilderMode] = React.useState(false);
    const [editingScenario, setEditingScenario] = React.useState<TemplateData | null>(null);

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
                    <Button onClick={handleCreateNew}>
                        <PlusCircle className="mr-2 h-4 w-4" />
                        Создать пустой сценарий
                    </Button>
                </div>
                
                <TemplatesGrid 
                    onClone={handleCloneTemplate} 
                    onEdit={handleEditTemplate}
                />
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
        </div>
    );
}