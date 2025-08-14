"use client";

import { useMemo, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  User, 
  CreditCard, 
  Gamepad2, 
  Gift, 
  Brain, 
  Activity,
  Shield,
  MessageSquare,
  TrendingUp,
  TrendingDown,
  AlertCircle,
  Zap,
  Star,
  MapPin,
  Calendar,
  Smartphone,
  CheckCircle,
  XCircle,
  Settings,
  Download
} from "lucide-react";
import type { PlayerFullProfile } from "@/lib/types";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
// Моки для истории игр и почасовой активности
const mockGameHistory = Array.from({ length: 120 }).map((_, i) => ({
  date: new Date(Date.now() - i * 36e5).toLocaleString('ru-RU', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' }),
  game: ['Book of Dead','Sweet Bonanza','Roulette','Aviator','Blackjack'][i % 5],
  provider: ['Play’n GO','Pragmatic','Evolution','Spribe'][i % 4],
  bet: Math.round((5 + Math.random() * 45) * 100) / 100,
  win: Math.round((Math.random() * 120) * 100) / 100,
  result: Math.random() > 0.5 ? 'win' as const : 'lose' as const,
}));

const mockHourlyGames: Record<number, { time: string; game: string; bet: number; win: number; result: 'win'|'lose' }[]> = Object.fromEntries(
  Array.from({ length: 24 }).map((_, h) => [h, Math.random() > 0.4 ? Array.from({ length: Math.floor(Math.random()*4)+1 }).map(() => ({
    time: `${String(h).padStart(2,'0')}:${String(Math.floor(Math.random()*60)).padStart(2,'0')}`,
    game: ['Book of Dead','Roulette','Aviator','Blackjack'][Math.floor(Math.random()*4)],
    bet: Math.round((5 + Math.random()*20)*100)/100,
    win: Math.round((Math.random()*50)*100)/100,
    result: Math.random() > 0.5 ? 'win' : 'lose'
  })) : []])
);

// Моки для маркетинга
const mockBonusHistory = Array.from({ length: 40 }).map((_, i) => ({
  date: new Date(Date.now() - i*86400000).toLocaleDateString('ru-RU'),
  name: ['Welcome 100%','Cashback 10%','FreeSpins 50','Reload 50%'][i%4],
  type: ['приветственный','кешбэк','фриспины','reload'][i%4],
  source: ['email','sms','push','messenger'][i%4],
  status: ['активирован','не использован','истёк'][i%3],
  offer: ['Welcome Chain','VIP Friday','Weekend Spins','Reload Booster'][i%4],
  result: ['депозит','игра','—'][i%3],
}));

const mockPromoHistory = Array.from({ length: 10 }).map((_, i) => ({
  code: ['WELCOME100','RELOAD50','VIP20','SPINS40'][i%4],
  received: new Date(Date.now()-i*5*86400000).toLocaleDateString('ru-RU'),
  activated: Math.random()>0.3 ? new Date(Date.now()-i*5*86400000+86400000).toLocaleDateString('ru-RU') : '—',
  campaign: ['Welcome Chain','Reload Spring','VIP Booster'][i%3],
  outcome: ['депозит €50','выигрыш €120','активность +'][i%3]
}));

// Мок: попытки депозитов (успешные и неуспешные)
const mockDepositAttempts = Array.from({ length: 14 }).map((_, i) => ({
  date: new Date(Date.now() - i * 36e5),
  amount: Math.round((20 + Math.random() * 480) * 100) / 100,
  method: ['Visa','Skrill','Mastercard','Bitcoin'][i % 4],
  status: ['completed','failed','failed','completed','pending'][i % 5] as 'completed' | 'failed' | 'pending',
})).sort((a,b) => +a.date - +b.date);

const mockResponseAnalytics = {
  offers: 38,
  responses: 14,
  topChannel: 'email',
  avgResponseHours: 9.5,
  avgDepositAfter: 85,
};

const mockAiRecs = [
  { type: 'Кешбэк 15%', channel: 'push', reason: 'Падает активность, реагировал на кешбэк', effect: '+8% депозиты (14д)' },
  { type: 'Турнир выходного дня', channel: 'email', reason: 'Пик активности в выходные', effect: '+12% GGR (7д)' },
  { type: 'Промокод VIP20', channel: 'sms', reason: 'Частые депозиты небольшими суммами', effect: '+5% NGR (30д)' },
];

const mockFavoriteOffers = [
  { name: 'VIP Friday Cashback', responses: 62, ctr: 18.5 },
  { name: 'Weekend FreeSpins', responses: 48, ctr: 15.2 },
  { name: 'Reload 50%', responses: 37, ctr: 12.1 },
  { name: 'Welcome Chain', responses: 28, ctr: 9.3 },
  { name: 'Tournament: Summer Slots', responses: 21, ctr: 7.8 },
];

// Моковые данные для демонстрации
const mockPlayerData: PlayerFullProfile = {
  mainInfo: {
    id: "PLR-12345",
    nickname: "LuckyAce777",
    country: "DE",
    geo: "Berlin, Germany",
    language: "de",
    registrationDate: new Date("2023-01-15"),
    trafficSource: {
      utm: "facebook_campaign_2023",
      referral: "www.casinostreamer.de",
      affiliate: "AFF-98765",
      streamer: "CasinoKing_DE"
    },
    platform: "desktop",
    kycStatus: "verified",
    sourceChannel: "streamer"
  },
  financial: {
    totalDeposit: 15420,
    totalWithdrawal: 8300,
    currentBalance: 2150,
    depositFrequency: "2.3 раза в неделю",
    averageDeposit: 285,
    averageTimeBetweenDeposits: "3.2 дня",
    lastDepositDate: new Date("2024-07-25"),
    firstDepositAmount: 50,
    timeToFirstDeposit: "2.5 часа",
    reDepositsCount: 54,
    reDepositFrequency: "Стабильная",
    accountCurrency: "EUR",
    depositHistory: [
      { 
        id: "1", 
        date: new Date("2024-07-25"), 
        amount: 500, 
        currency: "EUR", 
        status: "completed", 
        method: "Visa", 
        processor: "CloudPayments",
        type: "deposit",
        commission: 15,
        commissionRate: 3
      },
      { 
        id: "2", 
        date: new Date("2024-07-22"), 
        amount: 200, 
        currency: "EUR", 
        status: "completed", 
        method: "Skrill", 
        processor: "PayOP",
        type: "deposit",
        commission: 4,
        commissionRate: 2
      },
      { 
        id: "3", 
        date: new Date("2024-07-20"), 
        amount: 1500, 
        currency: "EUR", 
        status: "completed", 
        method: "Bank Transfer", 
        processor: "Paysafe",
        type: "withdrawal",
        commission: 25,
        commissionRate: 1.67
      },
      {
        id: "4",
        date: new Date("2024-07-18"),
        amount: 300,
        currency: "EUR",
        status: "completed",
        method: "Mastercard",
        processor: "Stripe",
        type: "deposit",
        commission: 8.7,
        commissionRate: 2.9
      },
      {
        id: "5",
        date: new Date("2024-07-15"),
        amount: 1000,
        currency: "EUR",
        status: "completed",
        method: "Bitcoin",
        processor: "CoinGate",
        type: "deposit",
        commission: 10,
        commissionRate: 1
      }
    ],
    withdrawalHistory: [],
    successfulTransactions: 108,
    failedTransactions: 3,
    paymentMethods: ["Visa", "Skrill", "Bank Transfer", "Bitcoin"]
  },
  gaming: {
    favoriteGames: ["Book of Dead", "Sweet Bonanza", "Crazy Time", "Aviator"],
    favoriteProviders: ["Play'n GO", "Pragmatic Play", "Evolution", "Spribe"],
    totalWagered: 125000,
    averageBetSize: 2.5,
    sessionCount: 342,
    averageSessionDuration: "45 мин",
    lastSessionDuration: "1 ч 23 мин",
    lastPlayTime: new Date("2024-07-26T21:30:00"),
    sessionFrequency: "4-5 раз в неделю",
    peakActivityTime: "20:00-23:00",
    winHistory: [
      { id: "1", date: new Date("2024-07-24"), game: "Sweet Bonanza", amount: 1250, multiplier: 125 },
      { id: "2", date: new Date("2024-07-20"), game: "Aviator", amount: 500, multiplier: 50 }
    ],
    playerRTP: 96.5,
    gameTypes: {
      live: true,
      slots: true,
      table: false,
      aviator: true,
      other: ["Турниры", "Дропы"]
    },
    engagementLevel: "active",
    totalTimeOnSite: "342 ч 15 мин",
    averageTimePerDay: "1 ч 45 мин",
    activityByDayOfWeek: {
      monday: 85,
      tuesday: 120,
      wednesday: 95,
      thursday: 140,
      friday: 180,
      saturday: 220,
      sunday: 160
    },
    activityByHour: {
      0: 10, 1: 5, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0, 7: 0, 8: 15, 9: 20,
      10: 25, 11: 30, 12: 35, 13: 30, 14: 25, 15: 20, 16: 30, 17: 40,
      18: 55, 19: 75, 20: 120, 21: 140, 22: 100, 23: 60
    },
    mostActiveDay: "Суббота",
    mostActiveTimeSlot: "20:00-23:00"
  },
  marketing: {
    bonusParticipation: true,
    bonusActivations: 28,
    bonusUtilization: 85,
    bonusTypes: ["Приветственный", "Релоад", "Кешбэк", "Фриспины"],
    campaignMetrics: {
      openRate: 42,
      clickRate: 18,
      conversionRate: 12
    },
    communicationHistory: [
      { id: "1", date: new Date("2024-07-25"), type: "email", campaign: "Weekend Cashback", status: "opened" },
      { id: "2", date: new Date("2024-07-23"), type: "push", campaign: "New Game Launch", status: "clicked" }
    ],
    reactivationHistory: [],
    usedPromocodes: ["WELCOME100", "RELOAD50", "VIP20"],
    lastPromoActivity: new Date("2024-07-25"),
    vipStatus: true,
    vipLevel: 3,
    participatesIn: {
      tournaments: true,
      cashback: true,
      referral: false
    }
  },
  behavior: {
    retentionRate: {
      d7: 85,
      d14: 78,
      d30: 72,
      d60: 68,
      d90: 65
    },
    churnRisk: 15,
    ltv: 8450,
    arpu: 125,
    arppu: 285,
    ngr: 7120,
    acquisitionROI: 320,
    customerSegment: "VIP Bronze",
    nps: 8,
    csat: 4.5,
    predictedCLV: 12500,
    fraudRisk: "low"
  },
  ai: {
    mlSegment: "High-Value Regular",
    behaviorProfile: "Вечерний игрок, предпочитает слоты с высокой волатильностью",
    recommendedGames: ["Gates of Olympus", "Big Bass Bonanza", "Wanted Dead or a Wild"],
    recommendedBonuses: ["Ежедневный кешбэк 10%", "VIP релоад 100%", "Турнир выходного дня"],
    reDepositProbability: 88,
    recommendedReactivationOffer: "Персональный бонус 150% до €1000",
    churnProbability: 15,
    autoTriggers: ["Ждёт пятничный кешбэк", "Играет после 20:00", "Любит новые слоты Pragmatic"]
  },
  actionLog: {
    loginHistory: [
      { id: "1", date: new Date("2024-07-26T20:15:00"), ip: "192.168.1.1", device: "Windows PC", location: "Berlin, DE" },
      { id: "2", date: new Date("2024-07-25T21:00:00"), ip: "192.168.1.1", device: "Windows PC", location: "Berlin, DE" }
    ],
    supportRequests: [
      { id: "1", date: new Date("2024-07-15"), subject: "Вопрос по бонусу", status: "resolved", priority: "medium" }
    ],
    complaints: [],
    managerNotes: [
      { id: "1", date: new Date("2024-07-20"), author: "VIP Manager", content: "Игрок интересовался увеличением лимитов", type: "info" }
    ],
    manualInterventions: []
  },
  vipInfo: {
    personalManager: "Maria Schmidt",
    limits: {
      depositLimit: 5000,
      lossLimit: 2000,
      sessionLimit: "4 часа"
    },
    responsibleGambling: {
      score: 85,
      flags: [],
      lastAssessment: new Date("2024-07-01")
    }
  }
};

// Функция для получения цвета риска
const getRiskColor = (risk: number) => {
  if (risk < 30) return "text-green-600";
  if (risk < 60) return "text-yellow-600";
  return "text-red-600";
};

// Функция для получения иконки статуса KYC
const getKycIcon = (status: string) => {
  switch (status) {
    case "verified": return <CheckCircle className="h-4 w-4 text-green-600" />;
    case "pending": return <AlertCircle className="h-4 w-4 text-yellow-600" />;
    case "rejected": return <XCircle className="h-4 w-4 text-red-600" />;
    default: return <AlertCircle className="h-4 w-4 text-gray-400" />;
  }
};

export default function PlayerProfilePage({ params }: { params: { id: string } }) {
  const player = mockPlayerData; // В реальном приложении загружать по ID

  return (
    <div className="flex flex-col gap-6 p-4 md:p-6 lg:p-8">
      {/* Заголовок с основной информацией */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-4">
          <Avatar className="h-16 w-16">
            <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${player.mainInfo.nickname}`} />
            <AvatarFallback>{player.mainInfo.nickname.slice(0, 2).toUpperCase()}</AvatarFallback>
          </Avatar>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold">{player.mainInfo.nickname}</h1>
              {player.marketing.vipStatus && (
                <Badge variant="default" className="bg-gradient-to-r from-yellow-500 to-yellow-600">
                  <Star className="mr-1 h-3 w-3" />
                  VIP {player.marketing.vipLevel}
                </Badge>
              )}
            </div>
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <span className="flex items-center gap-1">
                <MapPin className="h-4 w-4" />
                {player.mainInfo.country}
              </span>
              <span className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                С {player.mainInfo.registrationDate.toLocaleDateString('ru-RU')}
              </span>
              <span className="flex items-center gap-1">
                <Smartphone className="h-4 w-4" />
                {player.mainInfo.platform}
              </span>
              <span className="flex items-center gap-1">
                {getKycIcon(player.mainInfo.kycStatus)}
                KYC: {player.mainInfo.kycStatus}
              </span>
            </div>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <MessageSquare className="mr-2 h-4 w-4" />
            Написать
          </Button>
          <Button variant="default">
            <Gift className="mr-2 h-4 w-4" />
            Отправить бонус
          </Button>
        </div>
      </div>

      {/* Ключевые показатели игрока (Key Casino KPIs) */}
      <Card>
        <CardHeader className="pb-2 flex items-center justify-between">
          <CardTitle className="text-sm font-medium">Ключевые показатели</CardTitle>
          <div className="flex gap-2">
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm"><Settings className="h-4 w-4 mr-2"/>Настроить</Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Отображаемые метрики</DialogTitle>
                </DialogHeader>
                <div className="grid md:grid-cols-2 gap-2 text-sm">
                  {[
                    { key: 'ggr', label: 'GGR' },
                    { key: 'ngr', label: 'NGR' },
                    { key: 'hold', label: 'Hold %' },
                    { key: 'ltv', label: 'LTV' },
                    { key: 'netDeposits', label: 'Net Deposits' },
                    { key: 'totalDeposits', label: 'Total Deposits' },
                    { key: 'totalWithdrawals', label: 'Total Withdrawals' },
                    { key: 'rtp', label: 'RTP' },
                    { key: 'avgDeposit', label: 'Avg Deposit' },
                    { key: 'avgBet', label: 'Avg Bet Size' },
                    { key: 'depFreq', label: 'Deposit Frequency' },
                  ].map(opt => (
                    <label key={opt.key} className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        defaultChecked={(typeof window !== 'undefined' && JSON.parse(localStorage.getItem('playerKeyKpis')||'null'))?.includes(opt.key) ?? true}
                        onChange={(e) => {
                          try {
                            const cur = JSON.parse(localStorage.getItem('playerKeyKpis')||'null') || ['ggr','ngr','hold','ltv','netDeposits','totalDeposits','totalWithdrawals','rtp','avgDeposit','avgBet','depFreq'];
                            const next = e.target.checked ? Array.from(new Set([...cur, opt.key])) : cur.filter((k: string) => k !== opt.key);
                            localStorage.setItem('playerKeyKpis', JSON.stringify(next));
                          } catch {}
                        }}
                      />
                      {opt.label}
                    </label>
                  ))}
                </div>
              </DialogContent>
            </Dialog>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                const fileName = `player-${player.mainInfo.id}-kpis.csv`;
                const totalBets = player.gaming.totalWagered;
                const totalWins = Math.round(totalBets * (player.gaming.playerRTP/100));
                const ggr = totalBets - totalWins;
                const bonusCost = Math.round(totalBets * 0.02);
                const taxes = Math.round(ggr * 0.15);
                const ngr = ggr - bonusCost - taxes;
                const hold = totalBets>0 ? (ggr/totalBets)*100 : 0;
                const rows = [
                  ['Metric','Value'],
                  ['GGR', `€${ggr.toLocaleString()}`],
                  ['NGR', `€${ngr.toLocaleString()}`],
                  ['Hold %', `${hold.toFixed(2)}%`],
                  ['LTV', `€${player.behavior.ltv.toLocaleString()}`],
                  ['Net Deposits', `€${(player.financial.totalDeposit - player.financial.totalWithdrawal).toLocaleString()}`],
                  ['Total Deposits', `€${player.financial.totalDeposit.toLocaleString()}`],
                  ['Total Withdrawals', `€${player.financial.totalWithdrawal.toLocaleString()}`],
                  ['RTP', `${player.gaming.playerRTP}%`],
                  ['Average Deposit', `€${player.financial.averageDeposit}`],
                  ['Average Bet Size', `€${player.gaming.averageBetSize}`],
                  ['Deposit Frequency', `${player.financial.depositFrequency}`],
                ];
                const csv = rows.map(r => r.join(',')).join('\n');
                const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url; a.download = fileName; a.click();
                URL.revokeObjectURL(url);
              }}
            >
              <Download className="h-4 w-4 mr-2"/>CSV
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {(() => {
            const totalBets = player.gaming.totalWagered;
            const totalWins = Math.round(totalBets * (player.gaming.playerRTP/100));
            const ggr = totalBets - totalWins;
            const bonusCost = Math.round(totalBets * 0.02);
            const taxes = Math.round(ggr * 0.15);
            const ngr = ggr - bonusCost - taxes;
            const hold = totalBets>0 ? (ggr/totalBets)*100 : 0;
            const netDeposits = player.financial.totalDeposit - player.financial.totalWithdrawal;
            const visible: string[] = (() => { try { return JSON.parse(localStorage.getItem('playerKeyKpis')||'null') || ['ggr','ngr','hold','ltv','netDeposits','totalDeposits','totalWithdrawals','rtp','avgDeposit','avgBet','depFreq']; } catch { return ['ggr','ngr','hold','ltv','netDeposits','totalDeposits','totalWithdrawals','rtp','avgDeposit','avgBet','depFreq']; } })();
            const kpis = [
              { key:'ggr', name:'GGR', value:`€${ggr.toLocaleString()}`, formula:'GGR = Total Bets – Total Wins', good:ggr>=0 },
              { key:'ngr', name:'NGR', value:`€${ngr.toLocaleString()}`, formula:'NGR = GGR – Bonus Cost – Taxes', good:ngr>=0 },
              { key:'hold', name:'Hold %', value:`${hold.toFixed(2)}%`, formula:'Hold = GGR / Total Bets × 100%', good:hold>=3.5 },
              { key:'ltv', name:'LTV', value:`€${player.behavior.ltv.toLocaleString()}`, formula:'Lifetime Value', good:true },
              { key:'netDeposits', name:'Net Deposits', value:`€${netDeposits.toLocaleString()}`, formula:'Net Deposits = Total Deposits – Total Withdrawals', good:netDeposits>=0 },
              { key:'totalDeposits', name:'Total Deposits', value:`€${player.financial.totalDeposit.toLocaleString()}`, formula:'Sum of all deposits', good:true },
              { key:'totalWithdrawals', name:'Total Withdrawals', value:`€${player.financial.totalWithdrawal.toLocaleString()}`, formula:'Sum of all withdrawals', good:false },
              { key:'rtp', name:'RTP', value:`${player.gaming.playerRTP}%`, formula:'RTP = Total Wins / Total Bets × 100%', good:player.gaming.playerRTP<=97 },
              { key:'avgDeposit', name:'Avg Deposit', value:`€${player.financial.averageDeposit}`, formula:'Average deposit amount', good:true },
              { key:'avgBet', name:'Avg Bet Size', value:`€${player.gaming.averageBetSize}`, formula:'Average bet size', good:true },
              { key:'depFreq', name:'Deposit Frequency', value:player.financial.depositFrequency, formula:'Deposits per period', good:true },
            ].filter(k => visible.includes(k.key));
            return (
              <TooltipProvider>
                <div className="grid gap-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
                  {kpis.map((k) => (
                    <Tooltip key={k.key}>
                      <TooltipTrigger asChild>
                        <div className={`p-3 rounded-lg border ${k.good ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
                          <div className="text-xs text-muted-foreground mb-1">{k.name}</div>
                          <div className="text-xl font-bold">{k.value}</div>
                        </div>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="text-xs">{k.formula}</p>
                      </TooltipContent>
                    </Tooltip>
                  ))}
                </div>
              </TooltipProvider>
            );
          })()}
        </CardContent>
      </Card>

      {/* Roadmap перехода по сегментам */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Дорожная карта сегмента</CardTitle>
          <CardDescription>Путь апгрейда статуса и условия перехода</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-2 text-sm">
              <Badge variant="secondary">Текущий</Badge>
              <span className="font-medium">{player.behavior.customerSegment}</span>
              <span className="text-muted-foreground">→</span>
              <Badge variant="default">Следующий</Badge>
              <span className="font-medium">VIP Silver</span>
            </div>
            <div className="text-sm text-muted-foreground">
              Условие: достигните LTV €10 000 и сделайте 5 депозитов за месяц
            </div>
            <div className="grid md:grid-cols-3 gap-4">
              <div>
                <div className="flex items-center justify-between text-xs mb-1">
                  <span>LTV</span>
                  <span>€{player.behavior.ltv.toLocaleString()} / €10 000</span>
                </div>
                <Progress value={Math.min(100, (player.behavior.ltv / 10000) * 100)} />
              </div>
              <div>
                <div className="flex items-center justify-between text-xs mb-1">
                  <span>Депозиты за 30 дней</span>
                  <span>4 / 5</span>
                </div>
                <Progress value={(4 / 5) * 100} />
              </div>
              <div>
                <div className="flex items-center justify-between text-xs mb-1">
                  <span>Частота входов (нед.)</span>
                  <span>2.3 / 3</span>
                </div>
                <Progress value={(2.3 / 3) * 100} />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Быстрая статистика (настраиваемая) */}
      <div className="grid gap-4 md:grid-cols-5 relative">
        <div className="absolute right-0 -top-10">
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm"><Settings className="h-4 w-4 mr-2"/>Настроить</Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Выберите показатели (до 6)</DialogTitle>
              </DialogHeader>
              <div className="grid grid-cols-2 gap-2 text-sm">
                {['LTV','Баланс','Риск оттока','Статусы','Сегмент','NGR','ARPPU','ROI','Ср. депозит'].map((id) => (
                  <label key={id} className="flex items-center gap-2">
                    <input type="checkbox" defaultChecked />
                    {id}
                  </label>
                ))}
              </div>
              <div className="flex justify-end mt-4">
                <Button>Сохранить</Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">LTV</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">€{player.behavior.ltv.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              Прогноз: €{player.behavior.predictedCLV.toLocaleString()}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Баланс</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">€{player.financial.currentBalance.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              NGR: €{player.behavior.ngr.toLocaleString()}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Риск оттока</CardTitle>
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${getRiskColor(player.behavior.churnRisk)}`}>
              {player.behavior.churnRisk}%
            </div>
            <Progress value={player.behavior.churnRisk} className="mt-2 h-1" />
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Статусы</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-1">
              <Badge variant="outline" className="text-xs">
                {player.gaming.engagementLevel === 'active' ? 'Активен' : 'Неактивен'}
              </Badge>
              <Badge variant="outline" className="text-xs">
                {player.mainInfo.sourceChannel}
              </Badge>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Сегмент</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-lg font-medium">{player.ai.mlSegment}</div>
            <p className="text-xs text-muted-foreground">{player.behavior.customerSegment}</p>
          </CardContent>
        </Card>
      </div>

      {/* AI триггеры */}
      {player.ai.autoTriggers.length > 0 && (
        <Alert>
          <Zap className="h-4 w-4" />
          <AlertDescription className="flex items-center gap-2">
            <span className="font-medium">AI триггеры:</span>
            <div className="flex flex-wrap gap-2">
              {player.ai.autoTriggers.map((trigger, index) => (
                <Badge key={index} variant="secondary" className="text-xs">
                  {trigger}
                </Badge>
              ))}
            </div>
          </AlertDescription>
        </Alert>
      )}

      {/* Вкладки с подробной информацией */}
      <Tabs defaultValue="main" className="w-full">
        <TabsList className="grid w-full grid-cols-8">
          <TabsTrigger value="main">
            <User className="mr-2 h-4 w-4" />
            Основное
          </TabsTrigger>
          <TabsTrigger value="financial">
            <CreditCard className="mr-2 h-4 w-4" />
            Финансы
          </TabsTrigger>
          <TabsTrigger value="gaming">
            <Gamepad2 className="mr-2 h-4 w-4" />
            Игры
          </TabsTrigger>
          <TabsTrigger value="marketing">
            <Gift className="mr-2 h-4 w-4" />
            Маркетинг
          </TabsTrigger>
          <TabsTrigger value="behavior">
            <TrendingUp className="mr-2 h-4 w-4" />
            Поведение
          </TabsTrigger>
          <TabsTrigger value="ai">
            <Brain className="mr-2 h-4 w-4" />
            AI
          </TabsTrigger>
          <TabsTrigger value="activity">
            <Activity className="mr-2 h-4 w-4" />
            Активность
          </TabsTrigger>
          <TabsTrigger value="vip">
            <Shield className="mr-2 h-4 w-4" />
            VIP
          </TabsTrigger>
        </TabsList>

        <TabsContent value="main">
          <Card>
            <CardHeader>
              <CardTitle>Основная информация</CardTitle>
              <CardDescription>Регистрационные данные и источники трафика</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">ID игрока</p>
                  <p className="font-medium">{player.mainInfo.id}</p>
                </div>
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">Гео</p>
                  <p className="font-medium">{player.mainInfo.geo}</p>
                </div>
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">Язык</p>
                  <p className="font-medium">{player.mainInfo.language.toUpperCase()}</p>
                </div>
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">Платформа</p>
                  <p className="font-medium capitalize">{player.mainInfo.platform}</p>
                </div>
              </div>
              
              <div className="border-t pt-4">
                <h4 className="font-semibold mb-3">Источник трафика</h4>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">UTM</p>
                    <p className="font-medium text-sm">{player.mainInfo.trafficSource.utm}</p>
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">Реферал</p>
                    <p className="font-medium text-sm">{player.mainInfo.trafficSource.referral}</p>
                  </div>
                  {player.mainInfo.trafficSource.affiliate && (
                    <div className="space-y-2">
                      <p className="text-sm text-muted-foreground">Партнёр</p>
                      <p className="font-medium text-sm">{player.mainInfo.trafficSource.affiliate}</p>
                    </div>
                  )}
                  {player.mainInfo.trafficSource.streamer && (
                    <div className="space-y-2">
                      <p className="text-sm text-muted-foreground">Стример</p>
                      <p className="font-medium text-sm">{player.mainInfo.trafficSource.streamer}</p>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="financial">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Финансовая активность</CardTitle>
                <CardDescription>Статистика депозитов и выводов</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-3">
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">Всего депозитов</p>
                    <p className="text-2xl font-bold">€{player.financial.totalDeposit.toLocaleString()}</p>
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">Всего выводов</p>
                    <p className="text-2xl font-bold">€{player.financial.totalWithdrawal.toLocaleString()}</p>
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">Текущий баланс</p>
                    <p className="text-2xl font-bold">€{player.financial.currentBalance.toLocaleString()}</p>
                  </div>
                </div>
                
                <div className="grid gap-4 md:grid-cols-2 mt-6 pt-6 border-t">
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">Средний депозит</p>
                    <p className="font-medium">€{player.financial.averageDeposit}</p>
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">Частота депозитов</p>
                    <p className="font-medium">{player.financial.depositFrequency}</p>
                  </div>
                  {/* Метрика: Deposit Conversion Rate */}
                  {(() => {
                    const successful = mockDepositAttempts.filter(a => a.status === 'completed').length;
                    const total = mockDepositAttempts.length;
                    const rate = total ? Math.round((successful / total) * 100) : null;
                    const color = rate === null ? 'text-muted-foreground' : rate >= 90 ? 'text-green-600' : rate >= 70 ? 'text-yellow-600' : 'text-red-600';
                    return (
                      <div className="space-y-2">
                        <p className="text-sm text-muted-foreground">Deposit Conversion Rate</p>
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <p className={`font-medium ${color} cursor-pointer`}>
                                {rate === null ? '—' : `${rate}%`} {rate !== null && <span className="text-xs text-muted-foreground">({successful} из {total})</span>}
                              </p>
                            </TooltipTrigger>
                            <TooltipContent className="max-w-sm text-xs">
                              Показывает процент успешных депозитов. Если низкий — возможны технические или UX‑проблемы.
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                        <p className="text-xs text-muted-foreground">Успешные депозиты / Все попытки</p>
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="outline" size="sm">Подробнее</Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-3xl">
                            <DialogHeader>
                              <DialogTitle>Попытки депозита</DialogTitle>
                            </DialogHeader>
                            <div className="overflow-auto rounded border">
                              <table className="w-full text-sm">
                                <thead className="bg-muted">
                                  <tr>
                                    <th className="px-3 py-2 text-left">Дата</th>
                                    <th className="px-3 py-2 text-right">Сумма</th>
                                    <th className="px-3 py-2 text-left">Метод</th>
                                    <th className="px-3 py-2 text-left">Статус</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {mockDepositAttempts.map((a, i) => (
                                    <tr key={i} className="border-t">
                                      <td className="px-3 py-2">{a.date.toLocaleString('ru-RU')}</td>
                                      <td className="px-3 py-2 text-right">€{a.amount.toFixed(2)}</td>
                                      <td className="px-3 py-2">{a.method}</td>
                                      <td className={`px-3 py-2 ${a.status==='completed'?'text-green-600':a.status==='failed'?'text-red-600':'text-yellow-600'}`}>{a.status}</td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>
                            <div className="flex justify-end">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                  const rows = [['date','amount','method','status']];
                                  mockDepositAttempts.forEach(a => rows.push([a.date.toISOString(), `${a.amount}`, a.method, a.status]));
                                  const csv = rows.map(r=>r.join(',')).join('\n');
                                  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
                                  const url = URL.createObjectURL(blob);
                                  const link = document.createElement('a');
                                  link.href = url; link.download = `player-${player.mainInfo.id}-deposit-attempts.csv`; link.click();
                                  URL.revokeObjectURL(url);
                                }}
                              >
                                Экспорт CSV
                              </Button>
                            </div>
                          </DialogContent>
                        </Dialog>
                      </div>
                    );
                  })()}
                  {/* Новая метрика: Withdrawal-to-Next-Deposit Interval */}
                  {(() => {
                    // Мок: рассчёт на фронте для демо. В проде прийдёт с бэка
                    const withdrawals = player.financial.depositHistory.filter(t => t.type === 'withdrawal' && t.status === 'completed');
                    const deposits = player.financial.depositHistory.filter(t => t.type === 'deposit' && t.status === 'completed');
                    const diffs: number[] = [];
                    withdrawals.forEach(w => {
                      const after = deposits
                        .map(d => d.date)
                        .filter(d => d > w.date)
                        .sort((a,b) => +a - +b)[0];
                      if (after) {
                        diffs.push((+after - +w.date) / 3600000); // часы
                      }
                    });
                    const avgHours = diffs.length ? diffs.reduce((a,b)=>a+b,0) / diffs.length : 0;
                    const value = avgHours < 48 ? `${avgHours.toFixed(1)} ч` : `${(avgHours/24).toFixed(1)} дн`;
                    const color = avgHours < 24 ? 'text-green-600' : avgHours <= 168 ? 'text-yellow-600' : 'text-red-600';
                    const tooltip = 'Среднее время между успешным выводом и следующим депозитом. Берём все выводы (completed) → ищем ближайший следующий депозит → считаем среднее.';
                    return (
                      <div className="space-y-2">
                        <p className="text-sm text-muted-foreground">Withdrawal-to-Next-Deposit Interval</p>
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <p className={`font-medium ${color} cursor-pointer`}>{value}</p>
                            </TooltipTrigger>
                            <TooltipContent className="max-w-sm text-xs">{tooltip}</TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                        <p className="text-xs text-muted-foreground">Средний интервал между выводом и депозитом</p>
                        {/* Детали по клику */}
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="outline" size="sm">Показать детали</Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-3xl">
                            <DialogHeader>
                              <DialogTitle>Интервалы после выводов</DialogTitle>
                            </DialogHeader>
                            <div className="overflow-auto rounded border">
                              <table className="w-full text-sm">
                                <thead className="bg-muted">
                                  <tr>
                                    <th className="px-3 py-2 text-left">Дата вывода</th>
                                    <th className="px-3 py-2 text-right">Сумма</th>
                                    <th className="px-3 py-2 text-left">Следующий депозит</th>
                                    <th className="px-3 py-2 text-right">Сумма</th>
                                    <th className="px-3 py-2 text-left">Интервал</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {withdrawals.map((w, i) => {
                                    const after = deposits.filter(d => d.date > w.date).sort((a,b)=> +a.date - +b.date)[0];
                                    if (!after) return null;
                                    const hours = ((+after.date - +w.date)/3600000);
                                    const txt = hours < 48 ? `${hours.toFixed(1)} ч` : `${(hours/24).toFixed(1)} дн`;
                                    return (
                                      <tr key={i} className="border-t">
                                        <td className="px-3 py-2">{w.date.toLocaleString('ru-RU')}</td>
                                        <td className="px-3 py-2 text-right">€{w.amount}</td>
                                        <td className="px-3 py-2">{after.date.toLocaleString('ru-RU')}</td>
                                        <td className="px-3 py-2 text-right">€{after.amount}</td>
                                        <td className="px-3 py-2">{txt}</td>
                                      </tr>
                                    );
                                  })}
                                </tbody>
                              </table>
                            </div>
                            <div className="flex justify-end">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                  const rows = [['withdrawal_date','withdrawal_amount','deposit_date','deposit_amount','interval']];
                                  withdrawals.forEach(w => {
                                    const after = deposits.filter(d => d.date > w.date).sort((a,b)=> +a.date - +b.date)[0];
                                    if (!after) return;
                                    const hours = ((+after.date - +w.date)/3600000);
                                    const txt = hours < 48 ? `${hours.toFixed(1)}h` : `${(hours/24).toFixed(1)}d`;
                                    rows.push([
                                      w.date.toISOString(), `${w.amount}`, after.date.toISOString(), `${after.amount}`, txt
                                    ]);
                                  });
                                  const csv = rows.map(r=>r.join(',')).join('\n');
                                  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
                                  const url = URL.createObjectURL(blob);
                                  const a = document.createElement('a');
                                  a.href = url; a.download = `player-${player.mainInfo.id}-withdrawal-to-deposit.csv`; a.click();
                                  URL.revokeObjectURL(url);
                                }}
                              >
                                Экспорт CSV
                              </Button>
                            </div>
                          </DialogContent>
                        </Dialog>
                      </div>
                    );
                  })()}
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">Время между депозитами</p>
                    <p className="font-medium">{player.financial.averageTimeBetweenDeposits}</p>
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">Количество редепозитов</p>
                    <p className="font-medium">{player.financial.reDepositsCount}</p>
                  </div>
                </div>

                <div className="mt-6 pt-6 border-t">
                  <h4 className="font-semibold mb-3">Методы оплаты</h4>
                  <div className="flex flex-wrap gap-2">
                    {player.financial.paymentMethods.map(method => (
                      <Badge key={method} variant="secondary">{method}</Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Ключевые финансовые метрики */}
            <Card>
              <CardHeader>
                <CardTitle>Ключевые финансовые метрики</CardTitle>
                <CardDescription>Плитки в стиле «Избранных метрик»</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {[
                    { title: 'GGR', value: 125340, change: +18.2 },
                    { title: 'NGR', value: 71200, change: +9.6 },
                    { title: 'Всего депозитов', value: player.financial.totalDeposit, change: +5.0 },
                    { title: 'Всего выводов', value: player.financial.totalWithdrawal, change: -2.1 },
                    { title: 'Чистый доход', value: 125340 - player.financial.totalWithdrawal, change: +7.5 },
                    { title: 'Средний депозит', value: player.financial.averageDeposit, change: +0.8 },
                    { title: 'Частота депозитов/нед', value: parseFloat((player.financial.depositFrequency.match(/\d+(\.\d+)?/)||['0'])[0]), change: +1.2 },
                    { title: 'Средняя ставка', value: player.gaming.averageBetSize, change: -3.9 },
                    { title: 'Кол-во транзакций', value: player.financial.depositHistory.length + player.financial.withdrawalHistory?.length || player.financial.depositHistory.length, change: +4.0 },
                    { title: 'Рейтинг прибыльности', value: Math.round((125340 / Math.max(1, player.financial.totalWithdrawal)) * 10) / 10, change: +2.0 },
                    { title: 'Доля бонусов в депозитах', value: 12.5, suffix: '%', change: -0.5 },
                    { title: 'ARPU (оценка)', value: Math.round((player.behavior.ltv / 365) * 100) / 100, change: +1.1 },
                  ].map((m, idx) => (
                    <div key={idx} className={`p-4 rounded-lg border ${m.change>0?'bg-green-50 border-green-200':m.change<0?'bg-red-50 border-red-200':'bg-muted/30'}`}>
                      <div className="text-sm text-muted-foreground mb-1">{m.title}</div>
                      <div className="flex items-baseline justify-between">
                        <div className="text-2xl font-bold">{typeof m.value === 'number' ? (m.title.includes('депозит') || m.title.includes('вывод') || m.title==='GGR' || m.title==='NGR' || m.title==='Чистый доход' || m.title==='Средняя ставка' ? `€${m.value.toLocaleString()}` : `${m.value}${m.suffix||''}`) : m.value}
                        </div>
                        <div className={`text-sm ${m.change>0?'text-green-600':m.change<0?'text-red-600':'text-muted-foreground'}`}>
                          {m.change>0?'↑':m.change<0?'↓':'→'} {Math.abs(m.change)}%
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>История транзакций</CardTitle>
                <CardDescription>Последние операции по счету</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {player.financial.depositHistory.map(transaction => (
                    <div key={transaction.id} className="p-4 rounded-lg border hover:border-primary/50 transition-colors">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex items-start gap-3">
                          <div className={`p-2 rounded-full mt-1 ${transaction.type === 'deposit' ? 'bg-green-100' : 'bg-red-100'}`}>
                            {transaction.type === 'deposit' ? 
                              <TrendingUp className="h-4 w-4 text-green-600" /> : 
                              <TrendingDown className="h-4 w-4 text-red-600" />
                            }
                          </div>
                          <div className="space-y-1">
                            <p className="font-medium">
                              {transaction.type === 'deposit' ? 'Депозит' : 'Вывод'}
                            </p>
                            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-muted-foreground">
                              <span>{transaction.date.toLocaleDateString('ru-RU')}</span>
                              <span>•</span>
                              <span>{transaction.method}</span>
                              <span>•</span>
                              <span className="font-medium">{transaction.processor}</span>
                            </div>
                            {transaction.commission && (
                              <p className="text-xs text-muted-foreground">
                                Комиссия: €{transaction.commission.toFixed(2)} ({transaction.commissionRate}%)
                              </p>
                            )}
                          </div>
                        </div>
                        <div className="text-right space-y-1">
                          <p className={`font-bold text-lg ${transaction.type === 'deposit' ? 'text-green-600' : 'text-red-600'}`}>
                            {transaction.type === 'deposit' ? '+' : '-'}€{transaction.amount}
                          </p>
                          <Badge variant={transaction.status === 'completed' ? 'default' : 'secondary'} className="text-xs">
                            {transaction.status}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                
                {/* Сводка по комиссиям */}
                <div className="mt-6 p-4 rounded-lg bg-secondary/50 border">
                  <h5 className="font-medium text-sm mb-2">Анализ комиссий</h5>
                  <div className="grid gap-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Всего комиссий:</span>
                      <span className="font-medium">
                        €{player.financial.depositHistory
                          .reduce((sum, t) => sum + (t.commission || 0), 0)
                          .toFixed(2)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Средняя комиссия:</span>
                      <span className="font-medium">
                        {(player.financial.depositHistory
                          .filter(t => t.commissionRate)
                          .reduce((sum, t) => sum + (t.commissionRate || 0), 0) / 
                          player.financial.depositHistory.filter(t => t.commissionRate).length)
                          .toFixed(2)}%
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="gaming">
          <Card>
            <CardHeader>
              <CardTitle>Игровая активность</CardTitle>
              <CardDescription>Статистика и предпочтения в играх</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-4 md:grid-cols-3">
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">Всего поставлено</p>
                  <p className="text-2xl font-bold">€{player.gaming.totalWagered.toLocaleString()}</p>
                </div>
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">Средняя ставка</p>
                  <p className="text-2xl font-bold">€{player.gaming.averageBetSize}</p>
                </div>
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">RTP игрока</p>
                  <p className="text-2xl font-bold">{player.gaming.playerRTP}%</p>
                </div>
              </div>

              <div className="border-t pt-4">
                <h4 className="font-semibold mb-3">Любимые игры</h4>
                <div className="flex flex-wrap gap-2">
                  {player.gaming.favoriteGames.map(game => (
                    <Badge key={game} variant="outline">{game}</Badge>
                  ))}
                </div>
              </div>

              <div className="border-t pt-4">
                <h4 className="font-semibold mb-3">Любимые провайдеры</h4>
                <div className="flex flex-wrap gap-2">
                  {player.gaming.favoriteProviders.map(provider => (
                    <Badge key={provider} variant="secondary">{provider}</Badge>
                  ))}
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2 border-t pt-4">
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">Количество сессий</p>
                  <p className="font-medium">{player.gaming.sessionCount}</p>
                </div>
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">Средняя длительность сессии</p>
                  <p className="font-medium">{player.gaming.averageSessionDuration}</p>
                </div>
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">Частота игры</p>
                  <p className="font-medium">{player.gaming.sessionFrequency}</p>
                </div>
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">Пиковое время активности</p>
                  <p className="font-medium">{player.gaming.peakActivityTime}</p>
                </div>
              </div>

              <div className="border-t pt-4">
                <h4 className="font-semibold mb-3">Время на сайте</h4>
                <div className="grid gap-4 md:grid-cols-3">
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">Общее время на сайте</p>
                    <p className="text-xl font-bold">{player.gaming.totalTimeOnSite}</p>
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">Среднее время в день</p>
                    <p className="text-xl font-bold">{player.gaming.averageTimePerDay}</p>
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">Самый активный день</p>
                    <p className="text-xl font-bold">{player.gaming.mostActiveDay}</p>
                  </div>
                </div>
              </div>

              <div className="border-t pt-4">
                <h4 className="font-semibold mb-3">Активность по дням недели</h4>
                <div className="grid grid-cols-7 gap-2">
                  {Object.entries(player.gaming.activityByDayOfWeek).map(([day, minutes]) => (
                    <div key={day} className="text-center">
                      <p className="text-xs text-muted-foreground capitalize">{day.slice(0, 3)}</p>
                      <div className="mt-1 relative">
                        <div className="h-20 bg-secondary rounded" />
                        <div 
                          className="absolute bottom-0 left-0 right-0 bg-primary rounded transition-all"
                          style={{ height: `${Math.min((minutes / 220) * 100, 100)}%` }}
                        />
                      </div>
                      <p className="text-xs mt-1 font-medium">{Math.floor(minutes / 60)}ч {minutes % 60}м</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="border-t pt-4">
                <h4 className="font-semibold mb-3">Активность по времени суток</h4>
                <div className="space-y-3">
                  {/* График по часам */}
                  <div className="grid grid-cols-24 gap-0.5">
                    {Object.entries(player.gaming.activityByHour).map(([hour, minutes]) => (
                      <div key={hour} className="relative group">
                        <div 
                          className="w-full bg-primary/20 hover:bg-primary/30 transition-colors rounded-t"
                          style={{ 
                            height: `${Math.max((minutes / 140) * 60, 4)}px`,
                            backgroundColor: minutes > 100 ? 'rgb(var(--primary))' : undefined
                          }}
                        />
                        <div className="opacity-0 pointer-events-none group-hover:opacity-100 absolute bottom-full mb-2 left-1/2 -translate-x-1/2 bg-popover text-popover-foreground px-3 py-2 rounded text-xs z-10 shadow-lg w-64 max-h-48 overflow-auto">
                          {mockHourlyGames[Number(hour)] && mockHourlyGames[Number(hour)].length > 0 ? (
                            <div className="space-y-1">
                              {mockHourlyGames[Number(hour)].map((g, idx) => (
                                <div key={idx} className="flex items-center justify-between gap-2">
                                  <span className="truncate">{g.time} • {g.game}</span>
                                  <span className={g.result === 'win' ? 'text-green-600' : 'text-red-600'}>
                                    €{g.bet} / {g.result === 'win' ? `+€${g.win}` : 'проигрыш'}
                                  </span>
                          </div>
                              ))}
                            </div>
                          ) : (
                            <span>Игровой активности нет</span>
                          )}
                        </div>
                        {Number(hour) % 3 === 0 && (
                          <p className="text-xs text-muted-foreground mt-1">{hour}</p>
                        )}
                      </div>
                    ))}
                  </div>
                  
                  {/* Легенда времени суток */}
                  <div className="grid grid-cols-4 gap-2 mt-4">
                    <div className="text-center p-2 rounded bg-secondary/50">
                      <p className="text-xs text-muted-foreground">Ночь</p>
                      <p className="text-sm font-medium">00:00 - 06:00</p>
                      <p className="text-xs">{Object.entries(player.gaming.activityByHour).slice(0, 6).reduce((sum, [_, min]) => sum + min, 0)} мин</p>
                    </div>
                    <div className="text-center p-2 rounded bg-secondary/50">
                      <p className="text-xs text-muted-foreground">Утро</p>
                      <p className="text-sm font-medium">06:00 - 12:00</p>
                      <p className="text-xs">{Object.entries(player.gaming.activityByHour).slice(6, 12).reduce((sum, [_, min]) => sum + min, 0)} мин</p>
                    </div>
                    <div className="text-center p-2 rounded bg-secondary/50">
                      <p className="text-xs text-muted-foreground">День</p>
                      <p className="text-sm font-medium">12:00 - 18:00</p>
                      <p className="text-xs">{Object.entries(player.gaming.activityByHour).slice(12, 18).reduce((sum, [_, min]) => sum + min, 0)} мин</p>
                    </div>
                    <div className="text-center p-2 rounded bg-primary/20 border-2 border-primary">
                      <p className="text-xs text-muted-foreground">Вечер</p>
                      <p className="text-sm font-medium">18:00 - 00:00</p>
                      <p className="text-xs font-bold">{Object.entries(player.gaming.activityByHour).slice(18, 24).reduce((sum, [_, min]) => sum + min, 0)} мин</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* История игр */}
              <div className="border-t pt-4">
                <h4 className="font-semibold mb-3">История игр</h4>
                <div className="grid gap-2 md:grid-cols-4 mb-3">
                  <input type="date" className="border rounded px-2 py-1" />
                  <input type="date" className="border rounded px-2 py-1" />
                  <input placeholder="Название игры" className="border rounded px-2 py-1" />
                  <select className="border rounded px-2 py-1">
                    <option>Все провайдеры</option>
                    {player.gaming.favoriteProviders.map(p => (<option key={p}>{p}</option>))}
                  </select>
                </div>
                <div className="overflow-auto rounded border">
                  <table className="w-full text-sm">
                    <thead className="bg-muted">
                      <tr>
                        <th className="px-3 py-2 text-left cursor-pointer">Дата ▲</th>
                        <th className="px-3 py-2 text-left">Игра</th>
                        <th className="px-3 py-2 text-left">Провайдер</th>
                        <th className="px-3 py-2 text-right cursor-pointer">Ставка €</th>
                        <th className="px-3 py-2 text-right">Выигрыш €</th>
                        <th className="px-3 py-2 text-center">Результат</th>
                      </tr>
                    </thead>
                    <tbody>
                      {mockGameHistory.slice(0,20).map((row, i) => (
                        <tr key={i} className="border-t">
                          <td className="px-3 py-2">{row.date}</td>
                          <td className="px-3 py-2">{row.game}</td>
                          <td className="px-3 py-2">{row.provider}</td>
                          <td className="px-3 py-2 text-right">{row.bet.toFixed(2)}</td>
                          <td className="px-3 py-2 text-right">{row.win.toFixed(2)}</td>
                          <td className={`px-3 py-2 text-center ${row.result==='win'?'text-green-600':'text-red-600'}`}>{row.result==='win'?'Выигрыш':'Проигрыш'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="flex items-center justify-between mt-3 text-sm">
                  <span>1–20 из {mockGameHistory.length}</span>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm">Назад</Button>
                    <Button variant="outline" size="sm">Вперёд</Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="marketing">
          <Card>
            <CardHeader>
              <CardTitle>Маркетинговая активность</CardTitle>
              <CardDescription>Взаимодействие с кампаниями и бонусами</CardDescription>
            </CardHeader>
            <CardContent className="space-y-8">
              {/* Подсводка */}
              <div className="grid gap-4 md:grid-cols-3">
                <div className="p-4 rounded-lg border bg-secondary/30">
                  <p className="text-sm text-muted-foreground">Активировано бонусов</p>
                  <p className="text-2xl font-bold">{player.marketing.bonusActivations}</p>
                </div>
                <div className="p-4 rounded-lg border bg-secondary/30">
                  <p className="text-sm text-muted-foreground">Использование бонусов</p>
                  <p className="text-2xl font-bold">{player.marketing.bonusUtilization}%</p>
                </div>
                <div className="p-4 rounded-lg border bg-secondary/30">
                  <p className="text-sm text-muted-foreground">Email open rate</p>
                  <p className="text-2xl font-bold">{player.marketing.campaignMetrics.openRate}%</p>
                </div>
              </div>

              {/* Участие в программах */}
              <div className="border-t pt-4">
                <h4 className="font-semibold mb-3">Участие в программах</h4>
                <div className="grid gap-2 md:grid-cols-3">
                  <div className="flex items-center justify-between p-2 rounded-lg border bg-background">
                    <span className="text-sm">Турниры</span>
                    <Badge variant={player.marketing.participatesIn.tournaments ? 'default' : 'outline'}>
                      {player.marketing.participatesIn.tournaments ? 'Участвует' : 'Не участвует'}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between p-2 rounded-lg border bg-background">
                    <span className="text-sm">Кешбэк</span>
                    <Badge variant={player.marketing.participatesIn.cashback ? 'default' : 'outline'}>
                      {player.marketing.participatesIn.cashback ? 'Участвует' : 'Не участвует'}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between p-2 rounded-lg border bg-background">
                    <span className="text-sm">Реферальная программа</span>
                    <Badge variant={player.marketing.participatesIn.referral ? 'default' : 'outline'}>
                      {player.marketing.participatesIn.referral ? 'Участвует' : 'Не участвует'}
                    </Badge>
                  </div>
                </div>
              </div>

              {/* Внутренние вкладки маркетинга */}
              <Tabs defaultValue="history" className="w-full">
                <TabsList className="grid w-full grid-cols-5">
                  <TabsTrigger value="history">История бонусов</TabsTrigger>
                  <TabsTrigger value="promos">История промокодов</TabsTrigger>
                  <TabsTrigger value="analytics">Аналитика откликов</TabsTrigger>
                  <TabsTrigger value="ai">AI рекомендации</TabsTrigger>
                  <TabsTrigger value="favorites">Любимый оффер</TabsTrigger>
                </TabsList>

                {/* История бонусов и CRM-активности */}
                <TabsContent value="history" className="space-y-3 mt-4">
                  <div className="grid gap-2 md:grid-cols-4">
                    <Input placeholder="Поиск по офферу/промокоду" />
                    <Select>
                      <SelectTrigger><SelectValue placeholder="Тип бонуса" /></SelectTrigger>
                      <SelectContent>
                        {['приветственный','кешбэк','фриспины','reload'].map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                      </SelectContent>
                    </Select>
                    <Select>
                      <SelectTrigger><SelectValue placeholder="Источник" /></SelectTrigger>
                      <SelectContent>
                        {['email','sms','push','messenger'].map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                      </SelectContent>
                    </Select>
                    <Input placeholder="Период: 01.07–31.07" />
                  </div>
                  <div className="overflow-auto rounded border">
                    <table className="w-full text-sm">
                      <thead className="bg-muted">
                        <tr>
                          <th className="px-3 py-2 text-left">Дата</th>
                          <th className="px-3 py-2 text-left">Бонус</th>
                          <th className="px-3 py-2 text-left">Тип</th>
                          <th className="px-3 py-2 text-left">Источник</th>
                          <th className="px-3 py-2 text-left">Статус</th>
                          <th className="px-3 py-2 text-left">Оффер</th>
                          <th className="px-3 py-2 text-left">Результат</th>
                        </tr>
                      </thead>
                      <tbody>
                        {mockBonusHistory.map((row, i) => (
                          <tr key={i} className="border-t">
                            <td className="px-3 py-2">{row.date}</td>
                            <td className="px-3 py-2">{row.name}</td>
                            <td className="px-3 py-2">{row.type}</td>
                            <td className="px-3 py-2">{row.source}</td>
                            <td className="px-3 py-2">{row.status}</td>
                            <td className="px-3 py-2">{row.offer}</td>
                            <td className="px-3 py-2">{row.result}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </TabsContent>

                {/* История промокодов */}
                <TabsContent value="promos" className="space-y-3 mt-4">
                  <div className="grid gap-2 md:grid-cols-4">
                    <Input placeholder="Поиск по коду/офферу" />
                    <Input placeholder="С даты" />
                    <Input placeholder="По дату" />
                  </div>
                  <div className="space-y-2">
                    {mockPromoHistory.map((p, i) => (
                      <div key={i} className="p-3 rounded-lg border flex items-center justify-between">
                        <div className="flex-1">
                          <p className="font-medium">{p.code}</p>
                          <p className="text-xs text-muted-foreground">Получен: {p.received} • Активирован: {p.activated}</p>
                          <p className="text-xs text-muted-foreground">Кампания: {p.campaign} • Результат: {p.outcome}</p>
                        </div>
                        <Badge variant="secondary">Промокод</Badge>
                      </div>
                    ))}
                  </div>
                </TabsContent>

                {/* Аналитика откликов */}
                <TabsContent value="analytics" className="mt-4">
                  <div className="grid gap-4 md:grid-cols-3">
                    <div className="p-4 rounded-lg border bg-secondary/30">
                      <p className="text-sm text-muted-foreground">Получено офферов</p>
                      <p className="text-2xl font-bold">{mockResponseAnalytics.offers}</p>
                    </div>
                    <div className="p-4 rounded-lg border bg-secondary/30">
                      <p className="text-sm text-muted-foreground">Отклики (конверсия)</p>
                      <p className="text-2xl font-bold">{mockResponseAnalytics.responses} ({((mockResponseAnalytics.responses/mockResponseAnalytics.offers)*100).toFixed(1)}%)</p>
                    </div>
                    <div className="p-4 rounded-lg border bg-secondary/30">
                      <p className="text-sm text-muted-foreground">Топ-канал</p>
                      <p className="text-2xl font-bold capitalize">{mockResponseAnalytics.topChannel}</p>
                    </div>
                    <div className="p-4 rounded-lg border bg-secondary/30">
                      <p className="text-sm text-muted-foreground">Среднее время отклика</p>
                      <p className="text-2xl font-bold">{mockResponseAnalytics.avgResponseHours} ч</p>
                    </div>
                    <div className="p-4 rounded-lg border bg-secondary/30">
                      <p className="text-sm text-muted-foreground">Средний депозит после отклика</p>
                      <p className="text-2xl font-bold">€{mockResponseAnalytics.avgDepositAfter}</p>
                    </div>
                  </div>
                </TabsContent>

                {/* AI рекомендации */}
                <TabsContent value="ai" className="space-y-3 mt-4">
                  {mockAiRecs.map((r, i) => (
                    <div key={i} className="p-3 rounded-lg border flex items-center justify-between">
                      <div>
                        <p className="font-medium">{r.type} • канал: {r.channel}</p>
                        <p className="text-xs text-muted-foreground">{r.reason}</p>
                      </div>
                      <Badge>{r.effect}</Badge>
                    </div>
                  ))}
                </TabsContent>

                {/* Любимый оффер */}
                <TabsContent value="favorites" className="mt-4">
                  <div className="overflow-auto rounded border">
                    <table className="w-full text-sm">
                      <thead className="bg-muted">
                        <tr>
                          <th className="px-3 py-2 text-left">Оффер/Кампания</th>
                          <th className="px-3 py-2 text-right">Отклики</th>
                          <th className="px-3 py-2 text-right">CTR</th>
                        </tr>
                      </thead>
                      <tbody>
                        {mockFavoriteOffers.map((o, i) => (
                          <tr key={i} className="border-t">
                            <td className="px-3 py-2">{o.name}</td>
                            <td className="px-3 py-2 text-right">{o.responses}</td>
                            <td className="px-3 py-2 text-right">{o.ctr}%</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="behavior">
          <Card>
            <CardHeader>
              <CardTitle>Поведенческие данные</CardTitle>
              <CardDescription>Сводная информация по источникам</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Фильтры */}
              <div className="grid gap-3 md:grid-cols-3">
                <div>
                  <label className="text-sm text-muted-foreground">Период</label>
                  <input type="date" className="w-full border rounded px-2 py-1" />
                </div>
                <div>
                  <label className="text-sm text-muted-foreground">До</label>
                  <input type="date" className="w-full border rounded px-2 py-1" />
                </div>
                <div>
                  <label className="text-sm text-muted-foreground">Тип активности</label>
                  <select className="w-full border rounded px-2 py-1">
                    <option>Все</option>
                    <option>Сессии</option>
                    <option>Депозиты</option>
                    <option>Выводы</option>
                    <option>Кампании/Бонусы</option>
                    <option>Турниры</option>
                    <option>Поддержка</option>
                    <option>Рефералы</option>
                    <option>Технические</option>
                  </select>
                </div>
              </div>

              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-4">
                  <div>
                    <h4 className="text-sm font-medium mb-2">Player Registrations (CRM)</h4>
                    <div className="text-sm text-muted-foreground">
                      <p>Дата: {player.mainInfo.registrationDate.toLocaleDateString('ru-RU')}</p>
                      <p>ГЕО / язык: {player.mainInfo.geo} / {player.mainInfo.language.toUpperCase()}</p>
                      <p>Источник: UTM {player.mainInfo.trafficSource.utm}, Партнер {player.mainInfo.trafficSource.affiliate}</p>
                      <p>Устройство: {player.mainInfo.platform}</p>
                    </div>
                </div>
                  <div>
                    <h4 className="text-sm font-medium mb-2">Session Data (BI)</h4>
                    <div className="text-sm text-muted-foreground">
                      <p>Последний вход: {new Date().toLocaleString('ru-RU')}</p>
                      <p>Длительность сессии: {player.gaming.averageSessionDuration}</p>
                      <p>Сыгранные игры: {player.gaming.favoriteGames.slice(0,3).join(', ')}</p>
                      <p>Частота входов: {player.behavior.sessionFrequency}/нед</p>
                      <p>IP/Гео: 178.23.11.3 / {player.mainInfo.geo}</p>
                      <p>Устройство/соединение: {player.mainInfo.platform} / Wi‑Fi</p>
              </div>
                </div>
                  <div>
                    <h4 className="text-sm font-medium mb-2">Deposits (Finance)</h4>
                    <div className="text-sm text-muted-foreground">
                      <p>Сумма: €{player.financial.totalDeposit.toLocaleString()} • Ср. депозит: €{player.financial.averageDeposit}</p>
                      <p>Методы: {player.financial.paymentMethods.join(', ')}</p>
                      <p>Применен бонус: 35%</p>
                </div>
                </div>
                  <div>
                    <h4 className="text-sm font-medium mb-2">Withdrawals (Finance)</h4>
                    <div className="text-sm text-muted-foreground">
                      <p>Сумма: €{player.financial.totalWithdrawal.toLocaleString()}</p>
                      <p>Успешность: 96%</p>
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <h4 className="text-sm font-medium mb-2">Campaigns & Bonuses (CRM/CDP)</h4>
                    <div className="text-sm text-muted-foreground">
                      <p>Последняя кампания: VIP Weekly Bonus (Email)</p>
                      <p>Время отправки: вчера, 18:30 • Open 42% • CTR 12%</p>
                      <p>Промокод: VIP50 • Депозит после коммуникации: €120</p>
                      <p>A/B тесты: вариант B (+8%)</p>
                    </div>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium mb-2">VIP & Loyalty Data (Admin)</h4>
                    <div className="text-sm text-muted-foreground">
                      <p>VIP: {player.marketing.vipStatus ? `VIP ${player.marketing.vipLevel}` : '—'}</p>
                      <p>Дата апгрейда: 2024-05-12</p>
                      <p>Полученные бонусы: 12</p>
                    </div>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium mb-2">Tournaments & Events (Promo)</h4>
                    <div className="text-sm text-muted-foreground">
                      <p>Последний турнир: Summer Slots • Призовые: €5,000 • Результат: 12 место</p>
                    </div>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium mb-2">Support Interactions (Helpdesk)</h4>
                    <div className="text-sm text-muted-foreground">
                      <p>Обращений: 4 • Каналы: чат, email</p>
                      <p>Среднее время ответа: 12 мин</p>
                    </div>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium mb-2">Referral System (CRM)</h4>
                    <div className="text-sm text-muted-foreground">
                      <p>Реферер ID: REF-2024-7788 • Приглашенных: 6 • Депозиты: €540</p>
                    </div>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium mb-2">Device & Technical Data (SDK/API)</h4>
                    <div className="text-sm text-muted-foreground">
                      <p>Модель: iPhone 15 Pro • OS: iOS 17 • Соединение: LTE</p>
                      <p>Средняя скорость загрузки: 1.2s • Ошибки: 0.3%</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="ai">
          <Card>
            <CardHeader>
              <CardTitle>AI Инсайты и рекомендации</CardTitle>
              <CardDescription>Машинное обучение и предиктивная аналитика</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">ML сегмент</p>
                  <p className="font-medium">{player.ai.mlSegment}</p>
                </div>
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">Поведенческий профиль</p>
                  <p className="font-medium">{player.ai.behaviorProfile}</p>
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2 border-t pt-4">
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">Вероятность редепозита</p>
                  <div className="flex items-center gap-2">
                    <Progress value={player.ai.reDepositProbability} className="flex-1" />
                    <span className="font-medium">{player.ai.reDepositProbability}%</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">Вероятность оттока</p>
                  <div className="flex items-center gap-2">
                    <Progress value={player.ai.churnProbability} className="flex-1" />
                    <span className={`font-medium ${getRiskColor(player.ai.churnProbability)}`}>
                      {player.ai.churnProbability}%
                    </span>
                  </div>
                </div>
              </div>

              <div className="border-t pt-4">
                <h4 className="font-semibold mb-3">Рекомендованные игры</h4>
                <div className="flex flex-wrap gap-2">
                  {player.ai.recommendedGames.map(game => (
                    <Badge key={game} variant="outline">{game}</Badge>
                  ))}
                </div>
              </div>

              <div className="border-t pt-4">
                <h4 className="font-semibold mb-3">Рекомендованные бонусы</h4>
                <div className="grid gap-2">
                  {player.ai.recommendedBonuses.map(bonus => (
                    <div key={bonus} className="p-3 rounded-lg border bg-secondary/20">
                      <p className="text-sm font-medium">{bonus}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="border-t pt-4">
                <h4 className="font-semibold mb-3">Рекомендованное предложение реактивации</h4>
                <div className="p-4 rounded-lg border-2 border-primary/20 bg-primary/5">
                  <p className="font-medium">{player.ai.recommendedReactivationOffer}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="activity">
          <Card>
            <CardHeader>
              <CardTitle>Журнал активности</CardTitle>
              <CardDescription>История взаимодействий и событий</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h4 className="font-semibold mb-3">История входов</h4>
                <div className="space-y-2">
                  {player.actionLog.loginHistory.slice(0, 5).map(login => (
                    <div key={login.id} className="flex items-center justify-between p-2 rounded-lg border">
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4 text-muted-foreground" />
                        <div>
                          <p className="text-sm">{login.device}</p>
                          <p className="text-xs text-muted-foreground">{login.location}</p>
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {login.date.toLocaleString('ru-RU')}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {player.actionLog.supportRequests.length > 0 && (
                <div className="border-t pt-4">
                  <h4 className="font-semibold mb-3">Обращения в поддержку</h4>
                  <div className="space-y-2">
                    {player.actionLog.supportRequests.map(ticket => (
                      <div key={ticket.id} className="p-3 rounded-lg border">
                        <div className="flex items-center justify-between mb-1">
                          <p className="font-medium text-sm">{ticket.subject}</p>
                          <Badge variant={ticket.status === 'resolved' ? 'default' : 'secondary'}>
                            {ticket.status}
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          {ticket.date.toLocaleDateString('ru-RU')}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {player.actionLog.managerNotes.length > 0 && (
                <div className="border-t pt-4">
                  <h4 className="font-semibold mb-3">Заметки менеджера</h4>
                  <div className="space-y-2">
                    {player.actionLog.managerNotes.map(note => (
                      <div key={note.id} className="p-3 rounded-lg border bg-secondary/20">
                        <div className="flex items-center justify-between mb-2">
                          <p className="font-medium text-sm">{note.author}</p>
                          <p className="text-xs text-muted-foreground">
                            {note.date.toLocaleDateString('ru-RU')}
                          </p>
                        </div>
                        <p className="text-sm">{note.content}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="vip">
          {player.vipInfo ? (
            <Card>
              <CardHeader>
                <CardTitle>VIP информация</CardTitle>
                <CardDescription>Персональное обслуживание и лимиты</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">Персональный менеджер</p>
                    <p className="font-medium">{player.vipInfo.personalManager}</p>
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">VIP уровень</p>
                    <div className="flex items-center gap-2">
                      <Badge variant="default" className="bg-gradient-to-r from-yellow-500 to-yellow-600">
                        Level {player.marketing.vipLevel}
                      </Badge>
                    </div>
                  </div>
                </div>

                {player.vipInfo.limits && (
                  <div className="border-t pt-4">
                    <h4 className="font-semibold mb-3">Лимиты</h4>
                    <div className="grid gap-4 md:grid-cols-3">
                      {player.vipInfo.limits.depositLimit && (
                        <div className="space-y-2">
                          <p className="text-sm text-muted-foreground">Лимит депозита</p>
                          <p className="font-medium">€{player.vipInfo.limits.depositLimit}</p>
                        </div>
                      )}
                      {player.vipInfo.limits.lossLimit && (
                        <div className="space-y-2">
                          <p className="text-sm text-muted-foreground">Лимит проигрыша</p>
                          <p className="font-medium">€{player.vipInfo.limits.lossLimit}</p>
                        </div>
                      )}
                      {player.vipInfo.limits.sessionLimit && (
                        <div className="space-y-2">
                          <p className="text-sm text-muted-foreground">Лимит сессии</p>
                          <p className="font-medium">{player.vipInfo.limits.sessionLimit}</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                <div className="border-t pt-4">
                  <h4 className="font-semibold mb-3">Ответственная игра</h4>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <p className="text-sm text-muted-foreground">Оценка риска</p>
                      <div className="flex items-center gap-2">
                        <Progress value={player.vipInfo.responsibleGambling.score} className="flex-1" />
                        <span className="font-medium">{player.vipInfo.responsibleGambling.score}%</span>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <p className="text-sm text-muted-foreground">Последняя оценка</p>
                      <p className="font-medium">
                        {player.vipInfo.responsibleGambling.lastAssessment.toLocaleDateString('ru-RU')}
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="pt-6">
                <p className="text-center text-muted-foreground">
                  Игрок не является VIP
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}