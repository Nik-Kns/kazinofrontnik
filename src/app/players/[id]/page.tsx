"use client";

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
  XCircle
} from "lucide-react";
import type { PlayerFullProfile } from "@/lib/types";

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
      { id: "1", date: new Date("2024-07-25"), amount: 500, currency: "EUR", status: "completed", method: "Visa", type: "deposit" },
      { id: "2", date: new Date("2024-07-22"), amount: 200, currency: "EUR", status: "completed", method: "Skrill", type: "deposit" },
      { id: "3", date: new Date("2024-07-20"), amount: 1500, currency: "EUR", status: "completed", method: "Bank Transfer", type: "withdrawal" }
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
    engagementLevel: "active"
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

      {/* Быстрая статистика */}
      <div className="grid gap-4 md:grid-cols-5">
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

            <Card>
              <CardHeader>
                <CardTitle>История транзакций</CardTitle>
                <CardDescription>Последние операции по счету</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {player.financial.depositHistory.map(transaction => (
                    <div key={transaction.id} className="flex items-center justify-between p-3 rounded-lg border">
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-full ${transaction.type === 'deposit' ? 'bg-green-100' : 'bg-red-100'}`}>
                          {transaction.type === 'deposit' ? 
                            <TrendingUp className="h-4 w-4 text-green-600" /> : 
                            <TrendingDown className="h-4 w-4 text-red-600" />
                          }
                        </div>
                        <div>
                          <p className="font-medium">
                            {transaction.type === 'deposit' ? 'Депозит' : 'Вывод'}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {transaction.date.toLocaleDateString('ru-RU')} • {transaction.method}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className={`font-bold ${transaction.type === 'deposit' ? 'text-green-600' : 'text-red-600'}`}>
                          {transaction.type === 'deposit' ? '+' : '-'}€{transaction.amount}
                        </p>
                        <Badge variant={transaction.status === 'completed' ? 'default' : 'secondary'} className="text-xs">
                          {transaction.status}
                        </Badge>
                      </div>
                    </div>
                  ))}
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
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="marketing">
          <Card>
            <CardHeader>
              <CardTitle>Маркетинговая активность</CardTitle>
              <CardDescription>Взаимодействие с кампаниями и бонусами</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-4 md:grid-cols-3">
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">Активировано бонусов</p>
                  <p className="text-2xl font-bold">{player.marketing.bonusActivations}</p>
                </div>
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">Использование бонусов</p>
                  <p className="text-2xl font-bold">{player.marketing.bonusUtilization}%</p>
                </div>
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">Email open rate</p>
                  <p className="text-2xl font-bold">{player.marketing.campaignMetrics.openRate}%</p>
                </div>
              </div>

              <div className="border-t pt-4">
                <h4 className="font-semibold mb-3">Типы бонусов</h4>
                <div className="flex flex-wrap gap-2">
                  {player.marketing.bonusTypes.map(type => (
                    <Badge key={type} variant="outline">{type}</Badge>
                  ))}
                </div>
              </div>

              <div className="border-t pt-4">
                <h4 className="font-semibold mb-3">Использованные промокоды</h4>
                <div className="flex flex-wrap gap-2">
                  {player.marketing.usedPromocodes.map(code => (
                    <Badge key={code} variant="secondary">{code}</Badge>
                  ))}
                </div>
              </div>

              <div className="border-t pt-4">
                <h4 className="font-semibold mb-3">Участие в программах</h4>
                <div className="grid gap-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Турниры</span>
                    <Badge variant={player.marketing.participatesIn.tournaments ? "default" : "outline"}>
                      {player.marketing.participatesIn.tournaments ? "Участвует" : "Не участвует"}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Кешбэк</span>
                    <Badge variant={player.marketing.participatesIn.cashback ? "default" : "outline"}>
                      {player.marketing.participatesIn.cashback ? "Участвует" : "Не участвует"}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Реферальная программа</span>
                    <Badge variant={player.marketing.participatesIn.referral ? "default" : "outline"}>
                      {player.marketing.participatesIn.referral ? "Участвует" : "Не участвует"}
                    </Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="behavior">
          <Card>
            <CardHeader>
              <CardTitle>Поведенческие метрики</CardTitle>
              <CardDescription>Аналитика поведения и прогнозы</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-4 md:grid-cols-3">
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">LTV</p>
                  <p className="text-2xl font-bold">€{player.behavior.ltv.toLocaleString()}</p>
                </div>
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">ARPU</p>
                  <p className="text-2xl font-bold">€{player.behavior.arpu}</p>
                </div>
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">Риск оттока</p>
                  <p className={`text-2xl font-bold ${getRiskColor(player.behavior.churnRisk)}`}>
                    {player.behavior.churnRisk}%
                  </p>
                </div>
              </div>

              <div className="border-t pt-4">
                <h4 className="font-semibold mb-3">Ретеншн по периодам</h4>
                <div className="grid gap-3 md:grid-cols-5">
                  {Object.entries(player.behavior.retentionRate).map(([period, rate]) => (
                    <div key={period} className="text-center">
                      <p className="text-sm text-muted-foreground uppercase">{period}</p>
                      <p className="text-xl font-bold">{rate}%</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2 border-t pt-4">
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">Прогнозируемый CLV</p>
                  <p className="font-medium">€{player.behavior.predictedCLV.toLocaleString()}</p>
                </div>
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">ROI от привлечения</p>
                  <p className="font-medium">{player.behavior.acquisitionROI}%</p>
                </div>
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">NPS</p>
                  <p className="font-medium">{player.behavior.nps || 'Н/Д'}</p>
                </div>
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">CSAT</p>
                  <p className="font-medium">{player.behavior.csat || 'Н/Д'}/5</p>
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