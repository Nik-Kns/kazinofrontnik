"use client";

import * as React from "react";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Users, Search, TrendingUp, BarChart3 } from "lucide-react";
import { segmentsData } from "@/lib/mock-data";

export default function SegmentsListPage() {
  const [searchQuery, setSearchQuery] = React.useState("");

  const filteredSegments = segmentsData.filter(segment =>
    segment.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    segment.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
          <h1 className="text-3xl font-bold tracking-tight">Аналитика сегментов</h1>
          <p className="text-muted-foreground">
            Выберите сегмент для детального анализа производительности
          </p>
        </div>
      </div>

      {/* Search */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5" />
            Поиск сегментов
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Input
            placeholder="Поиск по названию или описанию сегмента..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="max-w-md"
          />
        </CardContent>
      </Card>

      {/* Segments Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredSegments.map((segment) => (
          <Card key={segment.id} className="hover:shadow-md transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                {segment.name}
              </CardTitle>
              <CardDescription>
                {segment.description}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Игроков в сегменте</span>
                <Badge variant="secondary">{segment.playerCount.toLocaleString()}</Badge>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Источник</span>
                <Badge variant="outline">{segment.createdBy}</Badge>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <TrendingUp className="h-4 w-4 text-green-600" />
                  <span>Retention: {Math.floor(Math.random() * 30 + 60)}%</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <BarChart3 className="h-4 w-4 text-blue-600" />
                  <span>ARPU: €{Math.floor(Math.random() * 200 + 50)}</span>
                </div>
              </div>

              <Link href={`/analytics/campaigns/segments/${segment.id}`}>
                <Button className="w-full">
                  Анализировать сегмент
                </Button>
              </Link>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredSegments.length === 0 && (
        <Card>
          <CardContent className="py-8 text-center">
            <Users className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">Сегменты не найдены</h3>
            <p className="text-muted-foreground">
              Попробуйте изменить поисковый запрос или создать новый сегмент
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
