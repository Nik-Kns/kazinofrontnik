"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ArrowUpDown, ArrowUp, ArrowDown, Download, Settings, Users } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import type { SegmentType } from "@/lib/types";

// Данные по сегментам
const segmentData = [
  {
    segment: 'VIP',
    retention: 75,
    arpu: 1250,
    ltv: 50000,
    freqDeposits: '3 в мес',
    bonusActRate: 70,
    roiCampaigns: 210,
    playerCount: 1250,
    trend: 'up'
  },
  {
    segment: 'Активные игроки',
    retention: 55,
    arpu: 320,
    ltv: 7500,
    freqDeposits: '1 в нед',
    bonusActRate: 75,
    roiCampaigns: 150,
    playerCount: 15600,
    trend: 'stable'
  },
  {
    segment: 'Новички',
    retention: 25,
    arpu: 45,
    ltv: 600,
    freqDeposits: '1 в мес',
    bonusActRate: 80,
    roiCampaigns: 90,
    playerCount: 8900,
    trend: 'up'
  },
  {
    segment: 'Хайроллеры',
    retention: 82,
    arpu: 2100,
    ltv: 75000,
    freqDeposits: '5 в мес',
    bonusActRate: 65,
    roiCampaigns: 280,
    playerCount: 450,
    trend: 'up'
  },
  {
    segment: 'Предотток',
    retention: 35,
    arpu: 150,
    ltv: 2500,
    freqDeposits: '0.5 в мес',
    bonusActRate: 85,
    roiCampaigns: 110,
    playerCount: 3200,
    trend: 'down'
  },
  {
    segment: 'Реактивация',
    retention: 42,
    arpu: 180,
    ltv: 3200,
    freqDeposits: '0.8 в мес',
    bonusActRate: 90,
    roiCampaigns: 125,
    playerCount: 2100,
    trend: 'up'
  },
  {
    segment: 'Спящие',
    retention: 15,
    arpu: 0,
    ltv: 850,
    freqDeposits: '0',
    bonusActRate: 95,
    roiCampaigns: 65,
    playerCount: 12300,
    trend: 'down'
  },
  {
    segment: '1 депозит',
    retention: 30,
    arpu: 35,
    ltv: 120,
    freqDeposits: '0.1 в мес',
    bonusActRate: 88,
    roiCampaigns: 70,
    playerCount: 5600,
    trend: 'stable'
  }
];

// Доступные колонки для таблицы
const availableColumns = [
  { id: 'segment', name: 'Сегмент', fixed: true },
  { id: 'playerCount', name: 'Кол-во игроков', unit: '' },
  { id: 'retention', name: 'Retention', unit: '%' },
  { id: 'arpu', name: 'ARPU', unit: '€' },
  { id: 'ltv', name: 'LTV', unit: '€' },
  { id: 'freqDeposits', name: 'Частота депозитов', unit: '' },
  { id: 'bonusActRate', name: 'Bonus Act. Rate', unit: '%' },
  { id: 'roiCampaigns', name: 'ROI Campaigns', unit: '%' },
  { id: 'churnRate', name: 'Churn Rate', unit: '%' },
  { id: 'avgDeposit', name: 'Средний депозит', unit: '€' },
  { id: 'avgSessionTime', name: 'Ср. время сессии', unit: 'мин' },
  { id: 'conversionRate', name: 'Конверсия', unit: '%' }
];

type SortConfig = {
  key: string;
  direction: 'asc' | 'desc';
};

export function SegmentMetricsTable() {
  const [sortConfig, setSortConfig] = useState<SortConfig | null>(null);
  const [selectedColumns, setSelectedColumns] = useState<string[]>([
    'segment', 'playerCount', 'retention', 'arpu', 'ltv', 'freqDeposits', 'bonusActRate', 'roiCampaigns'
  ]);
  const [dialogOpen, setDialogOpen] = useState(false);

  // Сортировка данных
  const sortedData = [...segmentData].sort((a, b) => {
    if (!sortConfig) return 0;
    
    const aValue = a[sortConfig.key as keyof typeof a];
    const bValue = b[sortConfig.key as keyof typeof b];
    
    if (typeof aValue === 'number' && typeof bValue === 'number') {
      return sortConfig.direction === 'asc' ? aValue - bValue : bValue - aValue;
    }
    
    return 0;
  });

  const handleSort = (key: string) => {
    setSortConfig(current => {
      if (!current || current.key !== key) {
        return { key, direction: 'desc' };
      }
      if (current.direction === 'desc') {
        return { key, direction: 'asc' };
      }
      return null;
    });
  };

  const getSortIcon = (key: string) => {
    if (!sortConfig || sortConfig.key !== key) {
      return <ArrowUpDown className="h-3 w-3 text-muted-foreground" />;
    }
    return sortConfig.direction === 'asc' 
      ? <ArrowUp className="h-3 w-3" />
      : <ArrowDown className="h-3 w-3" />;
  };

  const getTrendBadge = (trend: string) => {
    const colors = {
      up: 'bg-green-100 text-green-800',
      down: 'bg-red-100 text-red-800',
      stable: 'bg-gray-100 text-gray-800'
    };
    const icons = {
      up: '↑',
      down: '↓',
      stable: '→'
    };
    
    return (
      <Badge variant="outline" className={colors[trend as keyof typeof colors]}>
        {icons[trend as keyof typeof icons]}
      </Badge>
    );
  };

  const formatValue = (value: any, unit: string) => {
    if (unit === '%') return `${value}%`;
    if (unit === '€') return `€${value.toLocaleString()}`;
    if (unit === 'мин') return `${value} мин`;
    return value;
  };

  const handleColumnToggle = (columnId: string, checked: boolean) => {
    if (checked) {
      setSelectedColumns(prev => [...prev, columnId]);
    } else {
      setSelectedColumns(prev => prev.filter(id => id !== columnId));
    }
  };

  const applyColumnSelection = () => {
    setDialogOpen(false);
  };

  // Добавляем случайные значения для дополнительных колонок
  const getAdditionalValue = (segment: any, columnId: string) => {
    switch (columnId) {
      case 'churnRate':
        return 100 - segment.retention;
      case 'avgDeposit':
        return Math.round(segment.arpu * 1.5);
      case 'avgSessionTime':
        return Math.round(20 + Math.random() * 40);
      case 'conversionRate':
        return Math.round(segment.retention * 0.8);
      default:
        return segment[columnId];
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Метрики по сегментам</CardTitle>
            <CardDescription>
              Сравнительная таблица показателей по всем сегментам игроков
            </CardDescription>
          </div>
          <div className="flex gap-2">
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm">
                  <Settings className="h-4 w-4 mr-2" />
                  Настроить колонки
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Выберите колонки для отображения</DialogTitle>
                  <DialogDescription>
                    Отметьте метрики, которые хотите видеть в таблице
                  </DialogDescription>
                </DialogHeader>
                
                <div className="space-y-4 mt-4">
                  {availableColumns
                    .filter(col => !col.fixed)
                    .map(column => (
                      <div key={column.id} className="flex items-center space-x-2">
                        <Checkbox
                          id={column.id}
                          checked={selectedColumns.includes(column.id)}
                          onCheckedChange={(checked) => 
                            handleColumnToggle(column.id, checked as boolean)
                          }
                        />
                        <label
                          htmlFor={column.id}
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          {column.name}
                        </label>
                      </div>
                    ))}
                </div>
                
                <div className="flex justify-end mt-6">
                  <Button onClick={applyColumnSelection}>
                    Применить
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
            
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Экспорт
            </Button>
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                {selectedColumns.map(colId => {
                  const column = availableColumns.find(c => c.id === colId);
                  if (!column) return null;
                  
                  return (
                    <TableHead 
                      key={column.id}
                      className={column.fixed ? 'sticky left-0 bg-background z-10' : 'cursor-pointer'}
                      onClick={() => !column.fixed && handleSort(column.id)}
                    >
                      <div className="flex items-center gap-1">
                        {column.name}
                        {!column.fixed && getSortIcon(column.id)}
                      </div>
                    </TableHead>
                  );
                })}
                <TableHead>Тренд</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedData.map((row, index) => (
                <TableRow key={index}>
                  {selectedColumns.map(colId => {
                    const column = availableColumns.find(c => c.id === colId);
                    if (!column) return null;
                    
                    const value = getAdditionalValue(row, colId);
                    
                    return (
                      <TableCell 
                        key={colId}
                        className={column.fixed ? 'sticky left-0 bg-background z-10 font-medium' : ''}
                      >
                        {colId === 'segment' ? (
                          <div className="flex items-center gap-2">
                            <Users className="h-4 w-4 text-muted-foreground" />
                            {value}
                          </div>
                        ) : colId === 'playerCount' ? (
                          <Badge variant="secondary">
                            {value.toLocaleString()}
                          </Badge>
                        ) : (
                          formatValue(value, column.unit || '')
                        )}
                      </TableCell>
                    );
                  })}
                  <TableCell>{getTrendBadge(row.trend)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        
        {/* Итоговая строка */}
        <div className="mt-4 p-4 bg-muted rounded-lg">
          <div className="grid gap-4 md:grid-cols-4">
            <div>
              <div className="text-sm text-muted-foreground">Всего игроков</div>
              <div className="text-lg font-bold">
                {segmentData.reduce((sum, s) => sum + s.playerCount, 0).toLocaleString()}
              </div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground">Средний Retention</div>
              <div className="text-lg font-bold">
                {(segmentData.reduce((sum, s) => sum + s.retention, 0) / segmentData.length).toFixed(1)}%
              </div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground">Средний ARPU</div>
              <div className="text-lg font-bold">
                €{(segmentData.reduce((sum, s) => sum + s.arpu, 0) / segmentData.length).toFixed(0)}
              </div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground">Средний ROI</div>
              <div className="text-lg font-bold">
                {(segmentData.reduce((sum, s) => sum + s.roiCampaigns, 0) / segmentData.length).toFixed(0)}%
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}