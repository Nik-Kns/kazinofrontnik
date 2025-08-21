"use client";

import * as React from "react";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, Zap, Search, TrendingUp, BarChart3, Mail, Smartphone, MessageSquare } from "lucide-react";
import { templatesData } from "@/lib/mock-data";

export default function TemplatesListPage() {
  const [searchQuery, setSearchQuery] = React.useState("");
  const [typeFilter, setTypeFilter] = React.useState<string>("all");

  const filteredTemplates = templatesData.filter(template => {
    const matchesSearch = template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      template.description?.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesType = typeFilter === "all" || template.type === typeFilter;
    
    return matchesSearch && matchesType;
  });

  const getChannelIcon = (channel: string) => {
    switch (channel) {
      case 'Email': return <Mail className="h-4 w-4" />;
      case 'Push': return <Smartphone className="h-4 w-4" />;
      case 'SMS': return <MessageSquare className="h-4 w-4" />;
      default: return <Mail className="h-4 w-4" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'event': return 'bg-blue-100 text-blue-800';
      case 'basic': return 'bg-green-100 text-green-800';
      case 'custom': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
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

  return (
    <div className="container mx-auto py-6 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/analytics/campaigns">
          <Button variant="outline" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Назад к аналитике
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Аналитика шаблонов</h1>
          <p className="text-muted-foreground">
            Выберите шаблон для анализа производительности по кампаниям
          </p>
        </div>
      </div>

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
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span>Найдено: {filteredTemplates.length} из {templatesData.length} шаблонов</span>
          </div>
        </CardContent>
      </Card>

      {/* Templates Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTemplates.map((template) => (
          <Card key={template.id} className="hover:shadow-md transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="space-y-2">
                  <CardTitle className="flex items-center gap-2">
                    <Zap className="h-5 w-5" />
                    {template.name}
                  </CardTitle>
                  <Badge className={getTypeColor(template.type || 'basic')}>
                    {getTypeLabel(template.type || 'basic')}
                  </Badge>
                </div>
                <div className="flex items-center gap-1">
                  {getChannelIcon(template.channel)}
                  <span className="text-xs text-muted-foreground">{template.channel}</span>
                </div>
              </div>
              <CardDescription>
                {template.description}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Категория</span>
                <Badge variant="outline">{template.category}</Badge>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Производительность</span>
                <div className="flex items-center gap-1">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <div
                      key={i}
                      className={`h-2 w-2 rounded-full ${
                        i < template.performance ? 'bg-green-500' : 'bg-gray-200'
                      }`}
                    />
                  ))}
                </div>
              </div>

              {template.geo && template.geo.length > 0 && (
                <div className="space-y-1">
                  <span className="text-sm text-muted-foreground">География</span>
                  <div className="flex flex-wrap gap-1">
                    {template.geo.map((geo) => (
                      <Badge key={geo} variant="secondary" className="text-xs">
                        {geo}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {template.project && template.project.length > 0 && (
                <div className="space-y-1">
                  <span className="text-sm text-muted-foreground">Проекты</span>
                  <div className="flex flex-wrap gap-1">
                    {template.project.map((project) => (
                      <Badge key={project} variant="secondary" className="text-xs">
                        {project}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              <div className="space-y-2 pt-2">
                <div className="flex items-center gap-2 text-sm">
                  <TrendingUp className="h-4 w-4 text-green-600" />
                  <span>Open Rate: {Math.floor(Math.random() * 20 + 35)}%</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <BarChart3 className="h-4 w-4 text-blue-600" />
                  <span>CTR: {Math.floor(Math.random() * 10 + 15)}%</span>
                </div>
              </div>

              <Link href={`/analytics/campaigns/templates/${template.id}`}>
                <Button className="w-full">
                  Анализировать шаблон
                </Button>
              </Link>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredTemplates.length === 0 && (
        <Card>
          <CardContent className="py-8 text-center">
            <Zap className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">Шаблоны не найдены</h3>
            <p className="text-muted-foreground">
              Попробуйте изменить поисковый запрос или фильтры
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
