"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DatePickerWithRange } from "@/components/ui/date-picker-with-range";
import { Progress } from "@/components/ui/progress";
import { 
  ArrowUpDown, ArrowUp, ArrowDown, Download, Filter,
  Mail, MessageSquare, Euro, TrendingUp, Users, Target
} from "lucide-react";

interface CampaignData {
  id: string;
  name: string;
  roi: number;
  retentionImpact: number;
  depSumGrowth: number;
  avgDeposit: number;
  segment: string;
  type: 'email' | 'push' | 'sms' | 'in-app';
  status: 'active' | 'paused' | 'completed';
  sent: number;
  delivered: number;
  opened: number;
  clicked: number;
  converted: number;
  revenue: number;
  cost: number;
  startDate: Date;
  endDate?: Date;
}

// Генерация данных кампаний
const generateCampaignData = (): CampaignData[] => {
  const campaigns = [
    {
      id: '1',
      name: 'Welcome Bonus Flow',
      roi: 180,
      retentionImpact: 12,
      depSumGrowth: 2000,
      avgDeposit: 75,
      segment: 'Новички',
      type: 'email' as const,
      status: 'active' as const,
      sent: 15420,
      delivered: 14800,
      opened: 5920,
      clicked: 1480,
      converted: 740,
      revenue: 55500,
      cost: 30833,
      startDate: new Date('2024-01-15'),
    },
    {
      id: '2',
      name: 'VIP Reactivation Push',
      roi: 250,
      retentionImpact: 9,
      depSumGrowth: 800,
      avgDeposit: 450,
      segment: 'VIP',
      type: 'push' as const,
      status: 'active' as const,
      sent: 2340,
      delivered: 2200,
      opened: 1540,
      clicked: 462,
      converted: 198,
      revenue: 89100,
      cost: 35640,
      startDate: new Date('2024-02-01'),
    },
    {
      id: '3',
      name: 'Weekend Tournament Promo',
      roi: 90,
      retentionImpact: 2,
      depSumGrowth: 50,
      avgDeposit: 95,
      segment: 'Играющие в турнирах',
      type: 'email' as const,
      status: 'completed' as const,
      sent: 8900,
      delivered: 8500,
      opened: 2550,
      clicked: 510,
      converted: 153,
      revenue: 14535,
      cost: 16150,
      startDate: new Date('2024-01-20'),
      endDate: new Date('2024-01-27'),
    },
    {
      id: '4',
      name: 'Cashback Monday SMS',
      roi: 165,
      retentionImpact: 5,
      depSumGrowth: 350,
      avgDeposit: 120,
      segment: 'Активные',
      type: 'sms' as const,
      status: 'active' as const,
      sent: 5670,
      delivered: 5500,
      opened: 4400,
      clicked: 1320,
      converted: 528,
      revenue: 63360,
      cost: 38400,
      startDate: new Date('2024-02-05'),
    },
    {
      id: '5',
      name: 'Deep Churn Win-back',
      roi: 85,
      retentionImpact: 18,
      depSumGrowth: 1200,
      avgDeposit: 65,
      segment: 'Отток глубокий',
      type: 'email' as const,
      status: 'active' as const,
      sent: 12300,
      delivered: 11500,
      opened: 2300,
      clicked: 460,
      converted: 138,
      revenue: 8970,
      cost: 10553,
      startDate: new Date('2024-01-25'),
    },
    {
      id: '6',
      name: 'In-App Birthday Bonus',
      roi: 320,
      retentionImpact: 15,
      depSumGrowth: 500,
      avgDeposit: 200,
      segment: 'Все',
      type: 'in-app' as const,
      status: 'active' as const,
      sent: 890,
      delivered: 890,
      opened: 712,
      clicked: 534,
      converted: 374,
      revenue: 74800,
      cost: 23375,
      startDate: new Date('2024-01-01'),
    }
  ];
  
  return campaigns;
};

type SortConfig = {
  key: keyof CampaignData;
  direction: 'asc' | 'desc';
};

export function CampaignDeepAnalytics() {
  const [campaigns] = useState<CampaignData[]>(generateCampaignData());
  const [sortConfig, setSortConfig] = useState<SortConfig | null>(null);
  const [selectedPeriod, setSelectedPeriod] = useState('all');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [selectedSegment, setSelectedSegment] = useState<string>('all');
  const [dateRange, setDateRange] = useState<{ from?: Date; to?: Date }>({});

  // Фильтрация кампаний
  const filteredCampaigns = campaigns.filter(campaign => {
    if (selectedType !== 'all' && campaign.type !== selectedType) return false;
    if (selectedSegment !== 'all' && campaign.segment !== selectedSegment) return false;
    if (dateRange.from && campaign.startDate < dateRange.from) return false;
    if (dateRange.to && campaign.startDate > dateRange.to) return false;
    return true;
  });

  // Сортировка
  const sortedCampaigns = [...filteredCampaigns].sort((a, b) => {
    if (!sortConfig) return 0;
    
    const aValue = a[sortConfig.key];
    const bValue = b[sortConfig.key];
    
    if (typeof aValue === 'number' && typeof bValue === 'number') {
      return sortConfig.direction === 'asc' ? aValue - bValue : bValue - aValue;
    }
    
    if (typeof aValue === 'string' && typeof bValue === 'string') {
      return sortConfig.direction === 'asc' 
        ? aValue.localeCompare(bValue)
        : bValue.localeCompare(aValue);
    }
    
    return 0;
  });

  const handleSort = (key: keyof CampaignData) => {
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

  const getSortIcon = (key: keyof CampaignData) => {
    if (!sortConfig || sortConfig.key !== key) {
      return <ArrowUpDown className="h-3 w-3 text-muted-foreground" />;
    }
    return sortConfig.direction === 'asc' 
      ? <ArrowUp className="h-3 w-3" />
      : <ArrowDown className="h-3 w-3" />;
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'email': return <Mail className="h-4 w-4" />;
      case 'push': return <MessageSquare className="h-4 w-4" />;
      case 'sms': return <MessageSquare className="h-4 w-4" />;
      case 'in-app': return <Target className="h-4 w-4" />;
      default: return null;
    }
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      active: 'default',
      paused: 'secondary',
      completed: 'outline'
    };
    return <Badge variant={variants[status as keyof typeof variants] as any}>{status}</Badge>;
  };

  // Расчет общей статистики
  const totalStats = sortedCampaigns.reduce((acc, campaign) => ({
    totalRevenue: acc.totalRevenue + campaign.revenue,
    totalCost: acc.totalCost + campaign.cost,
    totalConverted: acc.totalConverted + campaign.converted,
    avgRoi: 0, // Рассчитаем отдельно
    avgRetentionImpact: 0 // Рассчитаем отдельно
  }), { totalRevenue: 0, totalCost: 0, totalConverted: 0, avgRoi: 0, avgRetentionImpact: 0 });

  totalStats.avgRoi = sortedCampaigns.reduce((sum, c) => sum + c.roi, 0) / sortedCampaigns.length;
  totalStats.avgRetentionImpact = sortedCampaigns.reduce((sum, c) => sum + c.retentionImpact, 0) / sortedCampaigns.length;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Глубокая аналитика по кампаниям</CardTitle>
            <CardDescription>
              Детальный анализ эффективности маркетинговых кампаний и их влияния на ретеншен
            </CardDescription>
          </div>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Экспорт отчета
          </Button>
        </div>
      </CardHeader>
      
      <CardContent>
        {/* Фильтры */}
        <div className="grid gap-4 md:grid-cols-4 mb-6">
          <div className="space-y-2">
            <label className="text-sm font-medium">Период</label>
            <DatePickerWithRange
              date={dateRange}
              onDateChange={setDateRange}
            />
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium">Тип кампании</label>
            <Select value={selectedType} onValueChange={setSelectedType}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Все типы</SelectItem>
                <SelectItem value="email">Email</SelectItem>
                <SelectItem value="push">Push</SelectItem>
                <SelectItem value="sms">SMS</SelectItem>
                <SelectItem value="in-app">In-App</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium">Сегмент</label>
            <Select value={selectedSegment} onValueChange={setSelectedSegment}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Все сегменты</SelectItem>
                <SelectItem value="Новички">Новички</SelectItem>
                <SelectItem value="VIP">VIP</SelectItem>
                <SelectItem value="Активные">Активные</SelectItem>
                <SelectItem value="Отток глубокий">Отток глубокий</SelectItem>
                <SelectItem value="Играющие в турнирах">Играющие в турнирах</SelectItem>
                <SelectItem value="Все">Все игроки</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium">Статус</label>
            <Select defaultValue="all">
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Все статусы</SelectItem>
                <SelectItem value="active">Активные</SelectItem>
                <SelectItem value="paused">На паузе</SelectItem>
                <SelectItem value="completed">Завершенные</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Сводная статистика */}
        <div className="grid gap-4 md:grid-cols-5 mb-6">
          <Card>
            <CardContent className="p-4">
              <div className="text-sm text-muted-foreground">Общий доход</div>
              <div className="text-2xl font-bold">€{totalStats.totalRevenue.toLocaleString()}</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-sm text-muted-foreground">Общие затраты</div>
              <div className="text-2xl font-bold">€{totalStats.totalCost.toLocaleString()}</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-sm text-muted-foreground">Средний ROI</div>
              <div className="text-2xl font-bold">{totalStats.avgRoi.toFixed(0)}%</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-sm text-muted-foreground">Ср. влияние на Retention</div>
              <div className="text-2xl font-bold">+{totalStats.avgRetentionImpact.toFixed(1)}%</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-sm text-muted-foreground">Конверсий</div>
              <div className="text-2xl font-bold">{totalStats.totalConverted.toLocaleString()}</div>
            </CardContent>
          </Card>
        </div>

        {/* Таблица кампаний */}
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Кампания</TableHead>
                <TableHead 
                  className="cursor-pointer text-center"
                  onClick={() => handleSort('roi')}
                >
                  <div className="flex items-center justify-center gap-1">
                    ROI
                    {getSortIcon('roi')}
                  </div>
                </TableHead>
                <TableHead 
                  className="cursor-pointer text-center"
                  onClick={() => handleSort('retentionImpact')}
                >
                  <div className="flex items-center justify-center gap-1">
                    Retention Impact
                    {getSortIcon('retentionImpact')}
                  </div>
                </TableHead>
                <TableHead 
                  className="cursor-pointer text-center"
                  onClick={() => handleSort('depSumGrowth')}
                >
                  <div className="flex items-center justify-center gap-1">
                    Dep Sum прирост
                    {getSortIcon('depSumGrowth')}
                  </div>
                </TableHead>
                <TableHead 
                  className="cursor-pointer text-center"
                  onClick={() => handleSort('avgDeposit')}
                >
                  <div className="flex items-center justify-center gap-1">
                    Средний депозит
                    {getSortIcon('avgDeposit')}
                  </div>
                </TableHead>
                <TableHead>Сегмент</TableHead>
                <TableHead className="text-center">Тип</TableHead>
                <TableHead className="text-center">Воронка</TableHead>
                <TableHead className="text-center">Статус</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedCampaigns.map(campaign => {
                const deliveryRate = (campaign.delivered / campaign.sent * 100).toFixed(1);
                const openRate = (campaign.opened / campaign.delivered * 100).toFixed(1);
                const ctr = (campaign.clicked / campaign.opened * 100).toFixed(1);
                const convRate = (campaign.converted / campaign.clicked * 100).toFixed(1);
                
                return (
                  <TableRow key={campaign.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{campaign.name}</div>
                        <div className="text-xs text-muted-foreground">
                          {campaign.startDate.toLocaleDateString('ru-RU')}
                          {campaign.endDate && ` - ${campaign.endDate.toLocaleDateString('ru-RU')}`}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-center">
                      <div className={`font-bold ${campaign.roi > 100 ? 'text-green-600' : 'text-red-600'}`}>
                        {campaign.roi}%
                      </div>
                    </TableCell>
                    <TableCell className="text-center">
                      <div className="flex items-center justify-center gap-1">
                        <TrendingUp className="h-3 w-3 text-green-600" />
                        <span className="text-green-600">+{campaign.retentionImpact}%</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-center">
                      +€{campaign.depSumGrowth.toLocaleString()}
                    </TableCell>
                    <TableCell className="text-center">
                      €{campaign.avgDeposit}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">
                        <Users className="h-3 w-3 mr-1" />
                        {campaign.segment}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-center">
                      <div className="flex items-center justify-center gap-1">
                        {getTypeIcon(campaign.type)}
                        <span className="text-xs uppercase">{campaign.type}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="flex items-center justify-between text-xs">
                          <span>Доставка</span>
                          <span>{deliveryRate}%</span>
                        </div>
                        <Progress value={parseFloat(deliveryRate)} className="h-1" />
                        
                        <div className="flex items-center justify-between text-xs">
                          <span>Открытия</span>
                          <span>{openRate}%</span>
                        </div>
                        <Progress value={parseFloat(openRate)} className="h-1" />
                        
                        <div className="flex items-center justify-between text-xs">
                          <span>CTR</span>
                          <span>{ctr}%</span>
                        </div>
                        <Progress value={parseFloat(ctr)} className="h-1" />
                        
                        <div className="flex items-center justify-between text-xs">
                          <span>CR</span>
                          <span>{convRate}%</span>
                        </div>
                        <Progress value={parseFloat(convRate)} className="h-1" />
                      </div>
                    </TableCell>
                    <TableCell className="text-center">
                      {getStatusBadge(campaign.status)}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>

        {/* Алгоритм уведомлений */}
        <div className="mt-6">
          <h3 className="font-semibold mb-4">Рекомендации по оптимизации</h3>
          <div className="space-y-3">
            {sortedCampaigns
              .filter(c => c.roi < 100 || c.retentionImpact < 5)
              .slice(0, 3)
              .map(campaign => (
                <Alert key={campaign.id}>
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>{campaign.name}</AlertTitle>
                  <AlertDescription>
                    {campaign.roi < 100 && `ROI ниже 100% (${campaign.roi}%). Рекомендуется пересмотреть таргетинг или креативы.`}
                    {campaign.retentionImpact < 5 && `Низкое влияние на retention (+${campaign.retentionImpact}%). Попробуйте изменить условия или механику.`}
                  </AlertDescription>
                </Alert>
              ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}