"use client";

import * as React from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { aiSegmentTemplates } from "@/lib/ai-segments-data";
import type { AiSegmentTemplate } from "@/lib/types";
import { Users, BarChart3, Clock, Copy, PlusCircle, Bot, Eye, Calendar, Sparkles } from "lucide-react";

// Main Component for the AI Segments Tab
export function AiSegmentsTab() {
  const [filters, setFilters] = React.useState({ category: 'all', date: '' });
  const [selectedSegment, setSelectedSegment] = React.useState<AiSegmentTemplate | null>(null);

  const filteredSegments = aiSegmentTemplates.filter(segment => {
    const categoryMatch = filters.category === 'all' || segment.category === filters.category;
    // Date filtering logic can be added here
    return categoryMatch;
  });

  const categories = ['all', ...Array.from(new Set(aiSegmentTemplates.map(s => s.category)))];

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex items-center gap-4">
        <div className="w-full max-w-xs">
          <Label htmlFor="ai-category-filter">Фильтр по типу</Label>
          <Select value={filters.category} onValueChange={(value) => setFilters(prev => ({...prev, category: value}))}>
            <SelectTrigger id="ai-category-filter">
              <SelectValue placeholder="Выберите тип" />
            </SelectTrigger>
            <SelectContent>
              {categories.map(cat => (
                <SelectItem key={cat} value={cat}>{cat === 'all' ? 'Все типы' : cat}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="w-full max-w-xs">
          <Label htmlFor="ai-date-filter">Фильтр по дате генерации</Label>
          <Input type="date" id="ai-date-filter" value={filters.date} onChange={(e) => setFilters(prev => ({...prev, date: e.target.value}))} />
        </div>
      </div>

      {/* Segments Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredSegments.map(segment => (
          <AiSegmentCard 
            key={segment.id} 
            segment={segment}
            onSelect={() => console.log(`Using segment ${segment.name}`)}
            onViewDetails={() => setSelectedSegment(segment)}
          />
        ))}
      </div>

      {/* Details Dialog */}
      {selectedSegment && (
        <Dialog open={!!selectedSegment} onOpenChange={(open) => !open && setSelectedSegment(null)}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Bot className="h-5 w-5 text-primary" />
                {selectedSegment.name}
              </DialogTitle>
              <DialogDescription>{selectedSegment.description}</DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div>
                <h4 className="font-semibold mb-2">Правила сегментации</h4>
                <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                  {selectedSegment.details.rules.map((rule, i) => (
                    <li key={i}>
                      <strong>{rule.field}</strong> {rule.condition} <strong>{rule.value}</strong>
                    </li>
                  ))}
                </ul>
              </div>
              <Separator />
              <div>
                <h4 className="font-semibold mb-2 flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-yellow-500" />
                  Рекомендации AI
                </h4>
                <p className="text-sm text-muted-foreground">{selectedSegment.details.recommendation}</p>
              </div>
            </div>
             <div className="flex justify-end gap-2">
               <Button variant="outline" onClick={() => setSelectedSegment(null)}>Закрыть</Button>
               <Button>
                 <Copy className="mr-2 h-4 w-4" />
                 Скопировать и редактировать
               </Button>
             </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}

// Card Component for a single AI Segment
function AiSegmentCard({ 
  segment, 
  onSelect,
  onViewDetails
}: { 
  segment: AiSegmentTemplate, 
  onSelect: () => void,
  onViewDetails: () => void
}) {
  return (
    <Card className="flex flex-col">
      <CardHeader>
        <div className="flex items-start justify-between">
          <CardTitle className="text-base">{segment.name}</CardTitle>
          <Badge variant="outline">{segment.category}</Badge>
        </div>
        <CardDescription className="text-xs">{segment.description}</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 space-y-3">
        <div className="flex justify-between items-center text-sm">
          <span className="flex items-center text-muted-foreground"><Users className="h-4 w-4 mr-1.5" /> Игроков</span>
          <span className="font-semibold">{segment.metrics.playerCount.toLocaleString()}</span>
        </div>
        <div className="flex justify-between items-center text-sm">
          <span className="flex items-center text-muted-foreground"><BarChart3 className="h-4 w-4 mr-1.5" /> Retention</span>
          <span className="font-semibold">{segment.metrics.retention}</span>
        </div>
        <div className="flex justify-between items-center text-sm">
          <span className="flex items-center text-muted-foreground"><Clock className="h-4 w-4 mr-1.5" /> Обновлено</span>
          <span className="font-semibold">{segment.updatedAt}</span>
        </div>
      </CardContent>
      <CardFooter className="flex gap-2">
        <Button size="sm" className="w-full" onClick={onSelect}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Использовать
        </Button>
        <DialogTrigger asChild>
          <Button size="sm" variant="outline" className="w-full" onClick={onViewDetails}>
            <Eye className="mr-2 h-4 w-4" />
            Детали
          </Button>
        </DialogTrigger>
      </CardFooter>
    </Card>
  );
}

