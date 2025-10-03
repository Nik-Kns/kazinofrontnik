/**
 * Таблица бонусов с фильтрами, сортировкой и пагинацией
 * Согласно ТЗ: список бонусов с KPI
 */

"use client";

import { useState, useMemo } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import {
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  Filter,
  Search,
  Eye,
  Copy,
  Send,
  Sparkles,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Bonus, BonusKPI } from "@/lib/types/bonuses";
import { generateBonusKPI, filterAndSortBonuses } from "@/lib/mock-bonuses-data";
import { cn } from "@/lib/utils";

interface BonusesTableProps {
  bonuses: Bonus[];
  onBonusClick?: (bonusId: string) => void;
  onCompareClick?: (bonusIds: string[]) => void;
  onCreateCampaignClick?: (bonusId: string) => void;
}

export function BonusesTable({
  bonuses,
  onBonusClick,
  onCompareClick,
  onCreateCampaignClick,
}: BonusesTableProps) {
  // State
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState<string[]>([]);
  const [statusFilter, setStatusFilter] = useState<string[]>([]);
  const [segmentFilter, setSegmentFilter] = useState<string[]>([]);
  const [sortField, setSortField] = useState<string>("net_roi");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");
  const [selectedBonuses, setSelectedBonuses] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(20);

  // Типы бонусов для фильтра
  const bonusTypes = [
    { value: "deposit", label: "Депозитный" },
    { value: "reload", label: "Релоад" },
    { value: "freespins", label: "Фриспины" },
    { value: "cashback", label: "Кэшбэк" },
    { value: "insurance", label: "Страховка" },
    { value: "tournament", label: "Турнир" },
  ];

  const statuses = [
    { value: "active", label: "Активен", color: "bg-green-500" },
    { value: "paused", label: "Пауза", color: "bg-yellow-500" },
    { value: "completed", label: "Завершён", color: "bg-gray-500" },
    { value: "draft", label: "Черновик", color: "bg-blue-500" },
  ];

  const segments = [
    { value: "all", label: "Все" },
    { value: "new", label: "Новые" },
    { value: "active", label: "Активные" },
    { value: "vip", label: "VIP" },
    { value: "at_risk", label: "В риске" },
  ];

  // Фильтрация и сортировка
  const filteredBonuses = useMemo(() => {
    let filtered = bonuses;

    // Поиск по названию
    if (searchQuery) {
      filtered = filtered.filter((b) =>
        b.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Применение фильтров
    filtered = filterAndSortBonuses(
      filtered,
      {
        type: typeFilter.length > 0 ? typeFilter : undefined,
        status: statusFilter.length > 0 ? statusFilter : undefined,
        segment: segmentFilter.length > 0 ? segmentFilter : undefined,
      },
      sortField,
      sortDirection
    );

    return filtered;
  }, [bonuses, searchQuery, typeFilter, statusFilter, segmentFilter, sortField, sortDirection]);

  // Пагинация
  const paginatedBonuses = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    const end = start + pageSize;
    return filteredBonuses.slice(start, end);
  }, [filteredBonuses, currentPage, pageSize]);

  const totalPages = Math.ceil(filteredBonuses.length / pageSize);

  // Получение KPI для бонуса
  const getBonusKPI = (bonus: Bonus): BonusKPI => {
    return generateBonusKPI(bonus.id, bonus.type);
  };

  // Обработка сортировки
  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("desc");
    }
  };

  // Рендер иконки сортировки
  const renderSortIcon = (field: string) => {
    if (sortField !== field) {
      return <ArrowUpDown className="h-4 w-4 text-muted-foreground" />;
    }
    return sortDirection === "asc" ? (
      <ArrowUp className="h-4 w-4" />
    ) : (
      <ArrowDown className="h-4 w-4" />
    );
  };

  // Выбор бонуса для сравнения
  const toggleBonusSelection = (bonusId: string) => {
    setSelectedBonuses((prev) => {
      if (prev.includes(bonusId)) {
        return prev.filter((id) => id !== bonusId);
      }
      if (prev.length >= 3) {
        return prev;
      }
      return [...prev, bonusId];
    });
  };

  // Форматирование процентов
  const formatPercent = (value: number) => `${value.toFixed(1)}%`;

  // Форматирование ROI
  const formatROI = (value: number) => `${((value - 1) * 100).toFixed(0)}%`;

  // Цвет значка ROI
  const getRoiBadgeVariant = (roi: number) => {
    if (roi >= 2) return "default";
    if (roi >= 1) return "secondary";
    return "destructive";
  };

  return (
    <div className="space-y-4">
      {/* Фильтры */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Список бонусов</CardTitle>
              <CardDescription>
                Всего: {filteredBonuses.length} бонусов
              </CardDescription>
            </div>
            {selectedBonuses.length > 0 && (
              <Button
                variant="outline"
                onClick={() => onCompareClick?.(selectedBonuses)}
                disabled={selectedBonuses.length < 2}
              >
                Сравнить ({selectedBonuses.length}/3)
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-4">
            {/* Поиск */}
            <div className="md:col-span-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Поиск по названию..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>

            {/* Фильтр по типу */}
            <Select
              value={typeFilter[0] || "all"}
              onValueChange={(v) => setTypeFilter(v === "all" ? [] : [v])}
            >
              <SelectTrigger>
                <SelectValue placeholder="Тип бонуса" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Все типы</SelectItem>
                {bonusTypes.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Фильтр по статусу */}
            <Select
              value={statusFilter[0] || "all"}
              onValueChange={(v) => setStatusFilter(v === "all" ? [] : [v])}
            >
              <SelectTrigger>
                <SelectValue placeholder="Статус" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Все статусы</SelectItem>
                {statuses.map((status) => (
                  <SelectItem key={status.value} value={status.value}>
                    {status.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Таблица */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12">
                    <Checkbox />
                  </TableHead>
                  <TableHead className="w-12">AI</TableHead>
                  <TableHead>Название</TableHead>
                  <TableHead>Тип</TableHead>
                  <TableHead>Статус</TableHead>
                  <TableHead>Условия</TableHead>
                  <TableHead className="text-right">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleSort("completion_rate")}
                      className="gap-1"
                    >
                      Completion
                      {renderSortIcon("completion_rate")}
                    </Button>
                  </TableHead>
                  <TableHead className="text-right">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleSort("net_roi")}
                      className="gap-1"
                    >
                      Net ROI
                      {renderSortIcon("net_roi")}
                    </Button>
                  </TableHead>
                  <TableHead className="text-right">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleSort("deposit_uplift")}
                      className="gap-1"
                    >
                      Uplift
                      {renderSortIcon("deposit_uplift")}
                    </Button>
                  </TableHead>
                  <TableHead className="text-right">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleSort("abuse_rate")}
                      className="gap-1"
                    >
                      Abuse
                      {renderSortIcon("abuse_rate")}
                    </Button>
                  </TableHead>
                  <TableHead className="text-right">Действия</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedBonuses.map((bonus) => {
                  const kpi = getBonusKPI(bonus);
                  const statusInfo = statuses.find((s) => s.value === bonus.status);

                  return (
                    <TableRow
                      key={bonus.id}
                      className="cursor-pointer hover:bg-accent/50"
                      onClick={() => onBonusClick?.(bonus.id)}
                    >
                      <TableCell onClick={(e) => e.stopPropagation()}>
                        <Checkbox
                          checked={selectedBonuses.includes(bonus.id)}
                          onCheckedChange={() => toggleBonusSelection(bonus.id)}
                          disabled={
                            !selectedBonuses.includes(bonus.id) && selectedBonuses.length >= 3
                          }
                        />
                      </TableCell>
                      <TableCell>
                        {bonus.ai_recommended && (
                          <Sparkles className="h-4 w-4 text-yellow-500" />
                        )}
                      </TableCell>
                      <TableCell className="font-medium">{bonus.name}</TableCell>
                      <TableCell>
                        <Badge variant="outline">
                          {bonusTypes.find((t) => t.value === bonus.type)?.label}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <div className={cn("w-2 h-2 rounded-full", statusInfo?.color)} />
                          <span className="text-sm">{statusInfo?.label}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {bonus.params.percent && `${bonus.params.percent}%`}
                        {bonus.params.fixed_amount && `€${bonus.params.fixed_amount}`}
                        {" • "}
                        {bonus.params.w_req}x
                        {" • "}
                        {bonus.params.rollover_days}д
                      </TableCell>
                      <TableCell className="text-right font-medium">
                        {formatPercent(kpi.completion_rate)}
                      </TableCell>
                      <TableCell className="text-right">
                        <Badge variant={getRoiBadgeVariant(kpi.bonus_roi_net)}>
                          {formatROI(kpi.bonus_roi_net)}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right font-medium text-green-600">
                        +{formatPercent(kpi.deposit_uplift)}
                      </TableCell>
                      <TableCell className="text-right">
                        <Badge
                          variant={kpi.abuse_rate < 3 ? "secondary" : "destructive"}
                          className="text-xs"
                        >
                          {formatPercent(kpi.abuse_rate)}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-end gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => onBonusClick?.(bonus.id)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => onCreateCampaignClick?.(bonus.id)}
                          >
                            <Send className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>

          {/* Пагинация */}
          <div className="flex items-center justify-between p-4 border-t">
            <div className="text-sm text-muted-foreground">
              Показано {((currentPage - 1) * pageSize) + 1}-
              {Math.min(currentPage * pageSize, filteredBonuses.length)} из{" "}
              {filteredBonuses.length}
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <div className="text-sm">
                Страница {currentPage} из {totalPages}
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
