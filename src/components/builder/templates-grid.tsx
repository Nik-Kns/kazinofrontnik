"use client";

import * as React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Search, 
  Copy, 
  Edit, 
  Mail, 
  Smartphone, 
  MessageSquare, 
  MonitorSpeaker,
  Star,
  Settings
} from "lucide-react";
import { templatesData } from "@/lib/mock-data";
import { TemplateData } from "@/lib/types";

interface TemplatesGridProps {
  onClone: (template: TemplateData) => void;
  onEdit: (template: TemplateData) => void;
}

export function TemplatesGrid({ onClone, onEdit }: TemplatesGridProps) {
  const [searchQuery, setSearchQuery] = React.useState("");
  const [typeFilter, setTypeFilter] = React.useState<string>("all");
  const [categoryFilter, setCategoryFilter] = React.useState<string>("all");

  const filteredTemplates = templatesData.filter(template => {
    const matchesSearch = template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      template.description?.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesType = typeFilter === "all" || template.type === typeFilter;
    const matchesCategory = categoryFilter === "all" || template.category === categoryFilter;
    
    return matchesSearch && matchesType && matchesCategory;
  });

  const getChannelIcon = (channel: string) => {
    switch (channel) {
      case 'Email': return <Mail className="h-4 w-4" />;
      case 'Push': return <Smartphone className="h-4 w-4" />;
      case 'SMS': return <MessageSquare className="h-4 w-4" />;
      case 'InApp': return <MonitorSpeaker className="h-4 w-4" />;
      case 'Multi-channel': return <Settings className="h-4 w-4" />;
      default: return <Mail className="h-4 w-4" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'event': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
      case 'basic': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'custom': return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'event': return 'Событийный';
      case 'basic': return 'Базовый';
      case 'custom': return 'Пользовательский';
      default: return type;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Onboarding': return 'bg-cyan-100 text-cyan-800 dark:bg-cyan-900 dark:text-cyan-300';
      case 'Retention': return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300';
      case 'Reactivation': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
      case 'Engagement': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
      case 'Conversion': return 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-300';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
    }
  };

  const renderStars = (performance: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-3 w-3 ${
          i < performance 
            ? 'fill-yellow-400 text-yellow-400' 
            : 'text-gray-300 dark:text-gray-600'
        }`}
      />
    ));
  };

  // Get unique categories for filter
  const categories = Array.from(new Set(templatesData.map(t => t.category)));

  return (
    <div className="space-y-6">
      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5" />
            Поиск и фильтры
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col md:flex-row gap-4">
            <Input
              placeholder="Поиск по названию или описанию шаблона..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1"
            />
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Тип шаблона" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Все типы</SelectItem>
                <SelectItem value="event">Событийные</SelectItem>
                <SelectItem value="basic">Базовые</SelectItem>
                <SelectItem value="custom">Пользовательские</SelectItem>
              </SelectContent>
            </Select>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Категория" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Все категории</SelectItem>
                {categories.map(category => (
                  <SelectItem key={category} value={category}>{category}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span>Найдено: {filteredTemplates.length} из {templatesData.length} шаблонов</span>
          </div>
        </CardContent>
      </Card>

      {/* Templates Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredTemplates.map((template) => (
          <Card key={template.id} className="group hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="space-y-1 flex-1">
                  <CardTitle className="text-lg leading-tight">{template.name}</CardTitle>
                  <div className="flex items-center gap-2">
                    {getChannelIcon(template.channel)}
                    <span className="text-sm text-muted-foreground">{template.channel}</span>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  {renderStars(template.performance)}
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <CardDescription className="text-sm">
                {template.description}
              </CardDescription>
              
              <div className="flex flex-wrap gap-2">
                <Badge className={getTypeColor(template.type)}>
                  {getTypeLabel(template.type)}
                </Badge>
                <Badge className={getCategoryColor(template.category)}>
                  {template.category}
                </Badge>
                {template.event && (
                  <Badge variant="outline" className="text-xs">
                    {template.event}
                  </Badge>
                )}
              </div>

              {template.geo && template.geo.length > 0 && (
                <div className="text-xs text-muted-foreground">
                  <span className="font-medium">Регионы:</span> {template.geo.join(', ')}
                </div>
              )}

              {template.project && template.project.length > 0 && (
                <div className="text-xs text-muted-foreground">
                  <span className="font-medium">Проекты:</span> {template.project.join(', ')}
                </div>
              )}

              <div className="flex gap-2 pt-2">
                <Button 
                  size="sm" 
                  variant="outline" 
                  className="flex-1"
                  onClick={() => onClone(template)}
                >
                  <Copy className="h-4 w-4 mr-2" />
                  Клонировать
                </Button>
                <Button 
                  size="sm" 
                  className="flex-1"
                  onClick={() => onEdit(template)}
                >
                  <Edit className="h-4 w-4 mr-2" />
                  Редактировать
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredTemplates.length === 0 && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Search className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">Шаблоны не найдены</h3>
            <p className="text-muted-foreground text-center">
              Попробуйте изменить критерии поиска или фильтры
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
