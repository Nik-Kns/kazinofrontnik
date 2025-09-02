"use client";

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { 
  Tooltip, 
  TooltipContent, 
  TooltipProvider, 
  TooltipTrigger 
} from '@/components/ui/tooltip';
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  CreditCard, 
  PiggyBank,
  ArrowUpDown,
  Info,
  BarChart3
} from 'lucide-react';
import { useCurrency } from '@/contexts/currency-context';
import { 
  CurrencyAmountDisplay, 
  CurrencyBadge, 
  MultiCurrencyBadge 
} from '@/components/ui/currency-badge';
import { CurrencyToggle } from '@/components/ui/currency-toggle';
import { type ExtendedPlayerData } from '@/lib/mock-multicurrency-players';
import { CurrencyCode, CURRENCY_CONFIGS } from '@/lib/currency-types';
import { formatCurrency } from '@/lib/currency-utils';

interface PlayerCurrencyFinancialsProps {
  player: ExtendedPlayerData;
}

// KPI карточка для сводного режима
function KPICard({ 
  title, 
  amount, 
  trend, 
  trendValue, 
  icon: Icon 
}: {
  title: string;
  amount: any;
  trend?: 'up' | 'down' | 'stable';
  trendValue?: string;
  icon: React.ComponentType<{ className?: string }>;
}) {
  const trendColor = trend === 'up' ? 'text-green-600' : trend === 'down' ? 'text-red-600' : 'text-gray-600';
  const TrendIcon = trend === 'up' ? TrendingUp : trend === 'down' ? TrendingDown : ArrowUpDown;

  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <CurrencyAmountDisplay amount={amount} size="lg" />
            {trend && trendValue && (
              <div className={`flex items-center gap-1 text-xs ${trendColor}`}>
                <TrendIcon className="h-3 w-3" />
                <span>{trendValue}</span>
              </div>
            )}
          </div>
          <div className="p-2 bg-primary/10 rounded-lg">
            <Icon className="h-5 w-5 text-primary" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export function PlayerCurrencyFinancials({ player }: PlayerCurrencyFinancialsProps) {
  const { state: currencyState } = useCurrency();
  const [selectedCurrency, setSelectedCurrency] = React.useState<CurrencyCode | 'all'>('all');

  // Данные для графика динамики депозитов (мок)
  const depositDynamics = React.useMemo(() => {
    return Array.from({ length: 30 }, (_, i) => ({
      date: new Date(Date.now() - (29 - i) * 24 * 60 * 60 * 1000).toLocaleDateString('ru-RU', { day: '2-digit', month: '2-digit' }),
      EUR: Math.random() * 500 + 100,
      USD: Math.random() * 300 + 50,
      GBP: Math.random() * 200 + 30
    }));
  }, []);

  return (
    <div className="space-y-6">
      {/* Переключатель валютного контекста */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <CardTitle className="text-lg">Финансовые показатели</CardTitle>
              <CardDescription>
                Депозиты, выводы и игровые метрики игрока
              </CardDescription>
            </div>
            <div className="flex items-center gap-3">
              <MultiCurrencyBadge 
                currencies={player.currencies}
                primaryCurrency={player.primary_currency}
                walletBalances={player.wallet_balances}
                showFlags
              />
              <CurrencyToggle size="sm" showLabel={false} />
            </div>
          </div>
        </CardHeader>
      </Card>

      <Tabs defaultValue="summary" className="space-y-4">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="summary">Сводно</TabsTrigger>
          <TabsTrigger value="by-currency">По валютам</TabsTrigger>
        </TabsList>

        {/* Сводный режим */}
        <TabsContent value="summary" className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <KPICard
              title="Total Deposits"
              amount={player.financial_metrics.total_deposits}
              trend="up"
              trendValue="+12.5%"
              icon={CreditCard}
            />
            <KPICard
              title="Total Withdrawals"
              amount={player.financial_metrics.total_withdrawals}
              trend="stable"
              trendValue="±0%"
              icon={PiggyBank}
            />
            <KPICard
              title="Net Deposits"
              amount={player.financial_metrics.net_deposits}
              trend="up"
              trendValue="+8.3%"
              icon={DollarSign}
            />
            <KPICard
              title="GGR"
              amount={player.financial_metrics.ggr}
              trend="down"
              trendValue="-2.1%"
              icon={BarChart3}
            />
          </div>

          {/* Дополнительные метрики */}
          <div className="grid gap-4 md:grid-cols-3">
            <Card>
              <CardContent className="p-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">ARPU</span>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger>
                          <Info className="h-3 w-3 text-muted-foreground" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <div className="text-xs">Average Revenue Per User</div>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                  <CurrencyAmountDisplay amount={player.financial_metrics.arpu} size="md" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">LTV</span>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger>
                          <Info className="h-3 w-3 text-muted-foreground" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <div className="text-xs">Lifetime Value (исторический)</div>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                  <CurrencyAmountDisplay amount={player.financial_metrics.ltv} size="md" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="space-y-2">
                  <span className="text-sm font-medium">Wallet Balance</span>
                  <div className="space-y-1">
                    {Object.entries(player.wallet_balances).map(([currency, balance]) => (
                      <div key={currency} className="flex items-center justify-between text-sm">
                        <CurrencyBadge currency={currency as CurrencyCode} size="sm" />
                        <span className="font-medium">
                          {formatCurrency(balance, currency as CurrencyCode)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Режим по валютам */}
        <TabsContent value="by-currency" className="space-y-6">
          {/* Селектор валюты для графика */}
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base">Динамика депозитов</CardTitle>
                <Select value={selectedCurrency} onValueChange={(value) => setSelectedCurrency(value as CurrencyCode | 'all')}>
                  <SelectTrigger className="w-40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Все валюты</SelectItem>
                    {player.currencies.map(currency => (
                      <SelectItem key={currency} value={currency}>
                        <div className="flex items-center gap-2">
                          <span>{CURRENCY_CONFIGS[currency].flag_emoji}</span>
                          <span>{currency}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardHeader>
            <CardContent>
              <div className="h-64 flex items-center justify-center border-2 border-dashed rounded">
                <div className="text-center text-muted-foreground">
                  <BarChart3 className="h-8 w-8 mx-auto mb-2" />
                  <p className="text-sm">График динамики депозитов</p>
                  <p className="text-xs">
                    {selectedCurrency === 'all' ? 'Все валюты' : `Валюта: ${selectedCurrency}`}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Таблица метрик по валютам */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Метрики по валютам</CardTitle>
              <CardDescription>
                Детальная разбивка финансовых показателей по каждой валюте
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Валюта</TableHead>
                    <TableHead>Deposits</TableHead>
                    <TableHead>Withdrawals</TableHead>
                    <TableHead>Net</TableHead>
                    <TableHead>GGR</TableHead>
                    <TableHead>NGR</TableHead>
                    <TableHead>ARPU</TableHead>
                    <TableHead>LTV</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {player.currencies.map(currency => {
                    const deposits = player.financial_metrics.total_deposits.amounts.find(a => a.currency === currency);
                    const withdrawals = player.financial_metrics.total_withdrawals.amounts.find(a => a.currency === currency);
                    const net = player.financial_metrics.net_deposits.amounts.find(a => a.currency === currency);
                    const ggr = player.financial_metrics.ggr.amounts.find(a => a.currency === currency);
                    const ngr = player.financial_metrics.ngr.amounts.find(a => a.currency === currency);
                    const arpu = player.financial_metrics.arpu.amounts.find(a => a.currency === currency);
                    const ltv = player.financial_metrics.ltv.amounts.find(a => a.currency === currency);

                    const isPrimary = currency === player.primary_currency;

                    return (
                      <TableRow key={currency} className={isPrimary ? 'bg-primary/5' : ''}>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <CurrencyBadge 
                              currency={currency} 
                              showFlag 
                              className={isPrimary ? 'ring-1 ring-primary/50' : ''}
                            />
                            {isPrimary && (
                              <Badge variant="outline" className="text-xs">
                                Primary
                              </Badge>
                            )}
                          </div>
                        </TableCell>
                        <TableCell className="font-medium">
                          {deposits ? formatCurrency(deposits.amount, deposits.currency) : '—'}
                        </TableCell>
                        <TableCell>
                          {withdrawals ? formatCurrency(withdrawals.amount, withdrawals.currency) : '—'}
                        </TableCell>
                        <TableCell className="font-medium">
                          {net ? formatCurrency(net.amount, net.currency) : '—'}
                        </TableCell>
                        <TableCell className="text-green-600 font-medium">
                          {ggr ? formatCurrency(ggr.amount, ggr.currency) : '—'}
                        </TableCell>
                        <TableCell className="text-green-700">
                          {ngr ? formatCurrency(ngr.amount, ngr.currency) : '—'}
                        </TableCell>
                        <TableCell>
                          {arpu ? formatCurrency(arpu.amount, arpu.currency) : '—'}
                        </TableCell>
                        <TableCell className="font-medium">
                          {ltv ? formatCurrency(ltv.amount, ltv.currency) : '—'}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>

              {/* Сводка */}
              <div className="mt-4 pt-4 border-t">
                <div className="grid gap-4 md:grid-cols-4 text-center">
                  <div>
                    <div className="text-2xl font-bold text-primary">{player.currencies.length}</div>
                    <div className="text-xs text-muted-foreground">Валют</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-green-600">
                      {player.financial_metrics.total_deposits.amounts.reduce((sum, amt) => sum + amt.amount, 0).toLocaleString()}
                    </div>
                    <div className="text-xs text-muted-foreground">Общий оборот</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-blue-600">
                      {Math.round(
                        (player.financial_metrics.ggr.amounts.reduce((sum, amt) => sum + amt.amount, 0) /
                        player.financial_metrics.total_deposits.amounts.reduce((sum, amt) => sum + amt.amount, 0)) * 100
                      )}%
                    </div>
                    <div className="text-xs text-muted-foreground">Hold %</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-purple-600">
                      {player.is_multi_currency ? 'Multi' : 'Mono'}
                    </div>
                    <div className="text-xs text-muted-foreground">Currency Type</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
