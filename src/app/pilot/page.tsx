"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Bot,
  Users,
  TrendingUp,
  Clock,
  Target,
  BarChart3,
  Lightbulb,
  Settings,
  Calendar,
  UserCheck,
  Star,
  ChevronRight,
  CheckCircle,
  Zap,
  Shield,
  Rocket,
  Eye,
  DollarSign,
  Euro,
  Brain,
  Database,
  Filter,
  MessageSquare,
  Mail,
  Smartphone,
  Globe,
  CreditCard,
  Trophy,
  AlertTriangle,
  LineChart,
  PieChart,
  Activity
} from "lucide-react";

export default function LandingDemo2Page() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Bot className="h-8 w-8 text-blue-600" />
            <span className="text-xl font-bold">AIGAMING.BOT</span>
          </div>
          
          <nav className="hidden md:flex items-center gap-6">
            <a href="#" className="text-sm hover:text-blue-600 transition-colors">Дашборд</a>
            <a href="#" className="text-sm hover:text-blue-600 transition-colors">Аналитика</a>
            <a href="#" className="text-sm hover:text-blue-600 transition-colors">Сценарии</a>
            <a href="#" className="text-sm hover:text-blue-600 transition-colors">Игроки</a>
            <a href="#" className="text-sm hover:text-blue-600 transition-colors">Календарь</a>
          </nav>

          <div className="flex items-center gap-3">
            <Button variant="outline" size="sm">Войти</Button>
            <Button size="sm">Попробовать демо</Button>
          </div>
        </div>
      </header>

      <main>
        {/* Hero Section */}
        <section className="container mx-auto px-4 py-16 md:py-24">
          <div className="text-center max-w-4xl mx-auto space-y-8">
            <Badge variant="outline" className="text-blue-600 border-blue-200 bg-blue-50">
              🤖 Оффер для ранних клиентов
            </Badge>
            
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
              AI-CRM iGaming Платформа
              <span className="block text-blue-600">Пилотный проект</span>
            </h1>
            
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Принимайте участие в пилотном проекте по внедрению AI-CRM платформы. 
              За 2 месяца система обучится на ваших данных и трансформирует подход к удержанию игроков.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="text-lg px-8">
                <Rocket className="mr-2 h-5 w-5" />
                Запросить пилот
              </Button>
              <Button size="lg" variant="outline" className="text-lg px-8">
                <Eye className="mr-2 h-5 w-5" />
                Посмотреть MVP
              </Button>
            </div>

            <div className="flex items-center justify-center gap-8 text-sm text-muted-foreground pt-8">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-600" />
                Пилот за себестоимость
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-600" />
                Первые инсайты через 2 месяца
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-600" />
                Поддержка основателей
              </div>
            </div>
          </div>
        </section>

        {/* Что это */}
        <section className="py-16 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="text-center max-w-3xl mx-auto mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Что это</h2>
              <p className="text-lg text-muted-foreground">
                Пилотный проект по внедрению AI-CRM платформы для iGaming проектов
              </p>
            </div>

            <div className="grid gap-8 lg:grid-cols-2 max-w-7xl mx-auto items-center">
              {/* Текстовый контент */}
              <div className="space-y-6">
                <Card className="p-6">
                  <CardHeader className="pb-4">
                    <div className="flex items-center gap-3">
                      <div className="p-3 bg-blue-100 rounded-lg">
                        <Clock className="h-6 w-6 text-blue-600" />
                      </div>
                      <div>
                        <CardTitle className="text-xl">Формат пилота</CardTitle>
                        <CardDescription>60 дней обучения системы</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">
                      В течение 2 месяцев платформа обучится на ваших данных до первых 
                      AI-инсайтов, AI-сегментов и аналитики. Фокус на качестве данных, 
                      прозрачности и скорости принятия решений.
                    </p>
                  </CardContent>
                </Card>

                <Card className="p-6">
                  <CardHeader className="pb-4">
                    <div className="flex items-center gap-3">
                      <div className="p-3 bg-green-100 rounded-lg">
                        <Target className="h-6 w-6 text-green-600" />
                      </div>
                      <div>
                        <CardTitle className="text-xl">Результат</CardTitle>
                        <CardDescription>Достижение целевых метрик</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">
                      Ранрейт до нужных целей в каждой поставленной вами метрике. 
                      Система покажет как и за счет чего достичь результатов с помощью 
                      точных AI-рекомендаций и гиперсегментации.
                    </p>
                  </CardContent>
                </Card>
              </div>

              {/* Демонстрация интерфейса - Скриншот дашборда */}
              <div className="lg:order-last">
                <div className="rounded-xl overflow-hidden shadow-2xl border bg-white">
                  <Image
                    src="/screenshots/dashboard-metrics.png"
                    alt="Избранные метрики дашборда AIGAMING.BOT"
                    width={1400}
                    height={800}
                    className="w-full h-auto"
                    priority
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Ключевые выгоды */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="text-center max-w-3xl mx-auto mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Ключевые выгоды</h2>
              <p className="text-lg text-muted-foreground">
                AiGamingBot анализирует поведение игроков и оптимизирует каждую точку их пути
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 max-w-7xl mx-auto">
              <Card className="p-6 hover:shadow-lg transition-shadow">
                <CardHeader className="pb-4">
                  <div className="p-3 bg-red-100 rounded-lg w-fit">
                    <Users className="h-6 w-6 text-red-600" />
                  </div>
                  <CardTitle className="text-lg">Сокращение затрат на команду</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Больше не нужно держать штат из 5–10 ретеншн-специалистов. 
                    Один менеджер и наша платформа выполняют ту же работу быстрее и эффективнее.
                  </p>
                </CardContent>
              </Card>

              <Card className="p-6 hover:shadow-lg transition-shadow">
                <CardHeader className="pb-4">
                  <div className="p-3 bg-blue-100 rounded-lg w-fit">
                    <BarChart3 className="h-6 w-6 text-blue-600" />
                  </div>
                  <CardTitle className="text-lg">Мгновенные инсайты</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Автоматический сбор и визуализация данных. Отчёты формируются в реальном времени, 
                    без BI-аналитиков и сложных выгрузок.
                  </p>
                </CardContent>
              </Card>

              <Card className="p-6 hover:shadow-lg transition-shadow">
                <CardHeader className="pb-4">
                  <div className="p-3 bg-purple-100 rounded-lg w-fit">
                    <Brain className="h-6 w-6 text-purple-600" />
                  </div>
                  <CardTitle className="text-lg">ИИ-рекомендации</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Прогнозирует отток, LTV, предлагает лучшие офферы и оптимальное время отправки. 
                    Использует более 170 показателей для формирования выводов.
                  </p>
                </CardContent>
              </Card>

              <Card className="p-6 hover:shadow-lg transition-shadow">
                <CardHeader className="pb-4">
                  <div className="p-3 bg-green-100 rounded-lg w-fit">
                    <Star className="h-6 w-6 text-green-600" />
                  </div>
                  <CardTitle className="text-lg">Персонализация Big Tech</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Индивидуальные предложения на основе истории ставок, депозитов и любимых игр. 
                    Чем больше данных — тем качественнее персонализация.
                  </p>
                </CardContent>
              </Card>

              <Card className="p-6 hover:shadow-lg transition-shadow">
                <CardHeader className="pb-4">
                  <div className="p-3 bg-orange-100 rounded-lg w-fit">
                    <Zap className="h-6 w-6 text-orange-600" />
                  </div>
                  <CardTitle className="text-lg">Скорость и масштабируемость</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Первые инсайты через 2 месяца пилота. Лёгкое масштабирование на все проекты 
                    и бренды без повторной интеграции.
                  </p>
                </CardContent>
              </Card>

              <Card className="p-6 hover:shadow-lg transition-shadow">
                <CardHeader className="pb-4">
                  <div className="p-3 bg-yellow-100 rounded-lg w-fit">
                    <Lightbulb className="h-6 w-6 text-yellow-600" />
                  </div>
                  <CardTitle className="text-lg">AI-маркетолог</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Генерирует сценарии, тексты и офферы на основе данных, а не интуиции. 
                    Next Best Offer с рекомендациями по каждому игроку.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* AI-анализ и оптимизация бонусов */}
        <section className="py-16 bg-gradient-to-br from-purple-50 to-blue-50">
          <div className="container mx-auto px-4">
            <div className="text-center max-w-3xl mx-auto mb-12">
              <Badge variant="outline" className="text-purple-600 border-purple-200 bg-purple-50 mb-4">
                🎁 Работа с бонусами
              </Badge>
              <h2 className="text-3xl md:text-4xl font-bold mb-4">AI-анализ и оптимизация бонусов</h2>
              <p className="text-lg text-muted-foreground">
                Платформа помогает считать оборачиваемость бонусов, прогнозировать их эффективность и снижать издержки
              </p>
            </div>

            <div className="grid gap-6 lg:grid-cols-2 max-w-7xl mx-auto mb-12">
              {/* Карточки возможностей */}
              <div className="space-y-6">
                <Card className="p-6 hover:shadow-lg transition-shadow bg-white">
                  <CardHeader className="pb-4">
                    <div className="flex items-center gap-3">
                      <div className="p-3 bg-blue-100 rounded-lg">
                        <Activity className="h-6 w-6 text-blue-600" />
                      </div>
                      <CardTitle className="text-xl">Оборачиваемость бонусов</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground mb-4">
                      Полная картина эффективности каждого бонуса с ключевыми метриками
                    </p>
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <span><strong>Completion rate</strong> — процент полного отыгрыша</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <span><strong>Breakage</strong> — доля неиспользованных бонусов</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <span><strong>Abuse rate</strong> — выявление bonus hunters</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <span><strong>Deposit uplift</strong> — рост депозитов от бонуса</span>
                      </li>
                    </ul>
                  </CardContent>
                </Card>

                <Card className="p-6 hover:shadow-lg transition-shadow bg-white">
                  <CardHeader className="pb-4">
                    <div className="flex items-center gap-3">
                      <div className="p-3 bg-green-100 rounded-lg">
                        <Euro className="h-6 w-6 text-green-600" />
                      </div>
                      <CardTitle className="text-xl">ROI с учётом бонусов</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground mb-4">
                      Прозрачная экономика бонусов с учётом всех затрат
                    </p>
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-3">
                      <div className="text-sm font-mono text-green-800">
                        Net Revenue = GGR − Bonus Costs
                      </div>
                    </div>
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <span>Чистый ROI по каждому бонусу</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <span>Учёт стоимости отыгрыша</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <span>Прогноз прибыльности</span>
                      </li>
                    </ul>
                  </CardContent>
                </Card>

                <Card className="p-6 hover:shadow-lg transition-shadow bg-white">
                  <CardHeader className="pb-4">
                    <div className="flex items-center gap-3">
                      <div className="p-3 bg-purple-100 rounded-lg">
                        <Brain className="h-6 w-6 text-purple-600" />
                      </div>
                      <CardTitle className="text-xl">AI-рекомендации</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground mb-4">
                      Elasticity-модуль прогнозирует оптимальные условия бонусов
                    </p>
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-center gap-2">
                        <Lightbulb className="h-4 w-4 text-yellow-600" />
                        <span>Оптимальный размер бонуса для сегмента</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <Lightbulb className="h-4 w-4 text-yellow-600" />
                        <span>Влияние wagering на retention</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <Lightbulb className="h-4 w-4 text-yellow-600" />
                        <span>Прогноз ROI при изменении условий</span>
                      </li>
                    </ul>
                  </CardContent>
                </Card>
              </div>

              {/* Визуализация воронки и ROI */}
              <div className="space-y-6">
                {/* Воронка бонуса */}
                <Card className="p-6 bg-white shadow-xl">
                  <CardHeader className="pb-4">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">Воронка бонуса "Welcome Pack"</CardTitle>
                      <Badge className="bg-green-600">Рекомендовано AI</Badge>
                    </div>
                    <CardDescription>Конверсия по этапам жизненного цикла</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-3">
                      <div>
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-sm font-medium">Получил</span>
                          <span className="text-sm font-bold">10,000 игроков</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-3">
                          <div className="bg-blue-600 h-3 rounded-full" style={{width: '100%'}}></div>
                        </div>
                      </div>

                      <div>
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-sm font-medium">Активировал</span>
                          <span className="text-sm font-bold">8,200 игроков (82%)</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-3">
                          <div className="bg-blue-600 h-3 rounded-full" style={{width: '82%'}}></div>
                        </div>
                      </div>

                      <div>
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-sm font-medium">Начал отыгрывать</span>
                          <span className="text-sm font-bold">6,500 игроков (65%)</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-3">
                          <div className="bg-green-600 h-3 rounded-full" style={{width: '65%'}}></div>
                        </div>
                      </div>

                      <div>
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-sm font-medium">Завершил отыгрыш</span>
                          <span className="text-sm font-bold">3,900 игроков (39%)</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-3">
                          <div className="bg-green-600 h-3 rounded-full" style={{width: '39%'}}></div>
                        </div>
                      </div>

                      <div>
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-sm font-medium">Повторный депозит</span>
                          <span className="text-sm font-bold">2,800 игроков (28%)</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-3">
                          <div className="bg-purple-600 h-3 rounded-full" style={{width: '28%'}}></div>
                        </div>
                      </div>
                    </div>

                    <div className="pt-4 border-t">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <div className="text-xs text-muted-foreground">Completion Rate</div>
                          <div className="text-lg font-bold text-green-600">39%</div>
                        </div>
                        <div>
                          <div className="text-xs text-muted-foreground">Retention Uplift</div>
                          <div className="text-lg font-bold text-blue-600">+28%</div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* ROI график */}
                <Card className="p-6 bg-white shadow-xl">
                  <CardHeader className="pb-4">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">ROI бонуса по времени</CardTitle>
                      <Badge variant="outline" className="text-green-600 border-green-200">
                        Окупается за 12 дней
                      </Badge>
                    </div>
                    <CardDescription>Чистая прибыль с учётом всех затрат</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {/* Простой график ROI */}
                      <div className="h-40 flex items-end gap-2">
                        {[
                          {day: 1, roi: -100},
                          {day: 3, roi: -80},
                          {day: 7, roi: -40},
                          {day: 12, roi: 0},
                          {day: 15, roi: 45},
                          {day: 21, roi: 85},
                          {day: 30, roi: 142}
                        ].map((point, i) => (
                          <div key={i} className="flex-1 flex flex-col items-center gap-1">
                            <div className="text-xs font-bold text-green-600">
                              {point.roi > 0 ? '+' : ''}{point.roi}%
                            </div>
                            <div
                              className={`w-full rounded-t ${point.roi >= 0 ? 'bg-green-500' : 'bg-red-400'}`}
                              style={{height: `${Math.abs(point.roi) / 142 * 100}%`, minHeight: '4px'}}
                            ></div>
                            <div className="text-xs text-muted-foreground">D{point.day}</div>
                          </div>
                        ))}
                      </div>

                      <div className="grid grid-cols-3 gap-3 pt-4 border-t">
                        <div className="text-center">
                          <div className="text-xs text-muted-foreground">Net ROI</div>
                          <div className="text-lg font-bold text-green-600">+142%</div>
                        </div>
                        <div className="text-center">
                          <div className="text-xs text-muted-foreground">Break-even</div>
                          <div className="text-lg font-bold">12 дней</div>
                        </div>
                        <div className="text-center">
                          <div className="text-xs text-muted-foreground">Net Revenue</div>
                          <div className="text-lg font-bold">€42,300</div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* Killer Features MVP */}
        <section className="py-16 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="text-center max-w-3xl mx-auto mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Killer Features базовой MVP версии</h2>
              <p className="text-lg text-muted-foreground">
                Возможности AI-платформы, доступные уже сейчас
              </p>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 max-w-7xl mx-auto">
              {[
                { title: "ИИ-маркетолог", desc: "генерирует сценарии, тексты и офферы на основе данных", icon: Brain },
                { title: "Next Best Offer", desc: "рекомендации по каждому игроку (бонус, оффер, канал, тайминг)", icon: Target },
                { title: "Предиктивная аналитика", desc: "churn, LTV, вероятность депозита с бенчмарками по GEO", icon: TrendingUp },
                { title: "Автоматический контент-план", desc: "коммуникации формируются и тестируются без ручной работы", icon: Calendar },
                { title: "Аналитика и ROI", desc: "базовые и расширенные метрики", icon: BarChart3 },
                { title: "AI-сегменты", desc: "автоматическая гиперсегментация, которую невозможно построить вручную", icon: Filter },
                { title: "Карточка игрока", desc: "churn probability, next deposit, next best offer", icon: UserCheck },
                { title: "Бенчмарки по GEO", desc: "сравнение ваших метрик с рынком", icon: Globe },
                { title: "Автоотчёты", desc: "регламентные отчёты собираются без участия сотрудников", icon: Activity },
                { title: "Бонусная аналитика", desc: "полный цикл — начисление, отыгрыш, депозиты, повторные депозиты", icon: CreditCard },
                { title: "Elasticity Analysis", desc: "система прогнозирует оптимальный размер и условия бонуса для разных сегментов", icon: PieChart },
                { title: "Антифрод-модуль", desc: "выявляет bonus hunters и подсвечивает подозрительные паттерны", icon: Shield }
              ].map((feature, index) => (
                <Card key={index} className="p-4 hover:shadow-md transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="flex items-center gap-3">
                      <feature.icon className="h-5 w-5 text-blue-600" />
                      <CardTitle className="text-base">{feature.title}</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <p className="text-sm text-muted-foreground">{feature.desc}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* 5 уровней доступа */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="text-center max-w-3xl mx-auto mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">5 уровней доступа к данным</h2>
              <p className="text-lg text-muted-foreground">
                Чем больше данных у системы — тем качественнее персонализация, аналитика и рекомендации
              </p>
            </div>

            <div className="space-y-6 max-w-6xl mx-auto">
              {[
                {
                  level: 1,
                  title: "CSV / API",
                  desc: "базовые данные: регистрации, депозиты/выводы, кампании/бонусы, сессии",
                  value: "Сводный дашборд финансов и retention, базовые AI-рекомендации. Кампании и бонусы → система считает completion rate, breakage, ROI",
                  color: "bg-blue-100 text-blue-600"
                },
                {
                  level: 2,
                  title: "Admin API",
                  desc: "турниры, саппорт, рефералы",
                  value: "AI связывает игровые и поведенческие данные с маркетингом",
                  color: "bg-green-100 text-green-600"
                },
                {
                  level: 3,
                  title: "SDK / Technical",
                  desc: "устройство, ОС, соединение, ошибки",
                  value: "Оптимизация конверсии за счёт исключения технического шума",
                  color: "bg-yellow-100 text-yellow-600"
                },
                {
                  level: 4,
                  title: "Gameplay",
                  desc: "ставки, выигрыши, игры, провайдеры",
                  value: "Next Best Game рекомендации, понимание маржинальности",
                  color: "bg-orange-100 text-orange-600"
                },
                {
                  level: 5,
                  title: "Predictive",
                  desc: "прогнозы, моделирование, оптимизация бюджета",
                  value: "Предиктивный 'мозг' CRM, AI управляет стратегиями и бюджетом. Elasticity бонусов и прогноз uplift от изменений условий",
                  color: "bg-red-100 text-red-600"
                }
              ].map((level, index) => (
                <Card key={index} className="p-6">
                  <div className="flex items-start gap-4">
                    <div className={`p-3 rounded-lg ${level.color} font-bold text-lg min-w-[60px] text-center`}>
                      L{level.level}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-xl font-semibold">{level.title}</h3>
                        <Badge variant="outline">{level.desc}</Badge>
                      </div>
                      <p className="text-muted-foreground">{level.value}</p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Что вы получаете */}
        <section className="py-16 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="text-center max-w-3xl mx-auto mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Что вы получаете после интеграции</h2>
              <p className="text-lg text-muted-foreground">
                Результаты внедрения базовой версии MVP
              </p>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 max-w-7xl mx-auto">
              {[
                "Полная автоматизация отчетности",
                "Существенное сокращение времени на аналитику",
                "AI-инсайты, которых нет в обычных BI",
                "Автоматическая динамическая сегментация игроков",
                "Возможность тестировать десятки стратегий с одним менеджером",
                "Персонализированные офферы и бонусы",
                "Экономия времени на запуск кампаний",
                "Автоматический подбор креативов",
                "Преимущество перед конкурентами",
                "Снижение расходов на маркетинг",
                "Поведенческий скоринг игроков",
                "Генерация удерживающих стратегий",
                "Динамическая адаптация кампаний",
                "AI-бенчмарки по воронкам",
                "Триггерные коммуникации в реальном времени",
                "Единый контроль всех каналов",
                "Комплаенс и безопасность",
                "Полная прозрачность пути игрока",
                "Полный контроль бонусов → видите, сколько депозитов принес каждый бонус, сколько ушло на отыгрыш, какой ROI и retention uplift он дал"
              ].map((benefit, index) => (
                <Card key={index} className="p-4">
                  <CardContent className="p-0">
                    <div className="flex items-start gap-3">
                      <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                      <p className="text-sm">{benefit}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <Card className="max-w-4xl mx-auto p-8 bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
              <div className="text-center space-y-6">
                <Badge variant="outline" className="text-blue-600 border-blue-200 bg-blue-50">
                  🚀 Что мы предлагаем
                </Badge>
                
                <h2 className="text-3xl md:text-4xl font-bold">
                  Готовы получить AI-преимущество?
                </h2>
                
                <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                  Пилот за себестоимость, первые инсайты через 2 месяца, масштабируемость на все бренды и GEO
                </p>

                <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
                  <Button size="lg" className="text-lg px-8">
                    <Rocket className="mr-2 h-5 w-5" />
                    Запросить пилот
                  </Button>
                  <Button size="lg" variant="outline" className="text-lg px-8">
                    <MessageSquare className="mr-2 h-5 w-5" />
                    Обсудить условия
                  </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-8">
                  <div className="text-center">
                    <div className="p-3 bg-green-100 rounded-lg w-fit mx-auto mb-3">
                      <DollarSign className="h-6 w-6 text-green-600" />
                    </div>
                    <h3 className="font-semibold mb-2">Пилот за себестоимость</h3>
                    <p className="text-sm text-muted-foreground">Прозрачная цена без коммерческой наценки</p>
                  </div>
                  <div className="text-center">
                    <div className="p-3 bg-blue-100 rounded-lg w-fit mx-auto mb-3">
                      <Clock className="h-6 w-6 text-blue-600" />
                    </div>
                    <h3 className="font-semibold mb-2">Первые инсайты через 2 месяца</h3>
                    <p className="text-sm text-muted-foreground">AI-рекомендации, сегменты, прогнозы</p>
                  </div>
                  <div className="text-center">
                    <div className="p-3 bg-purple-100 rounded-lg w-fit mx-auto mb-3">
                      <Rocket className="h-6 w-6 text-purple-600" />
                    </div>
                    <h3 className="font-semibold mb-2">Масштабируемость</h3>
                    <p className="text-sm text-muted-foreground">Один пилот → все ваши бренды и GEO</p>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-gray-50 border-t py-12">
        <div className="container mx-auto px-4">
          <div className="grid gap-8 md:grid-cols-4">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Bot className="h-6 w-6 text-blue-600" />
                <span className="text-lg font-bold">AIGAMING.BOT</span>
              </div>
              <p className="text-sm text-muted-foreground">
                AI-powered CRM для максимизации retention и LTV игроков онлайн-казино
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold mb-3">Продукт</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>Функции</li>
                <li>Интеграции</li>
                <li>API</li>
                <li>Безопасность</li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-3">Компания</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>О нас</li>
                <li>Блог</li>
                <li>Карьера</li>
                <li>Контакты</li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-3">Поддержка</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>Документация</li>
                <li>База знаний</li>
                <li>Техподдержка</li>
                <li>Статус сервиса</li>
              </ul>
            </div>
          </div>
          
          <div className="border-t mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm text-muted-foreground">
              © 2024 AIGAMING.BOT. Все права защищены.
            </p>
            <div className="flex gap-6 text-sm text-muted-foreground mt-4 md:mt-0">
              <a href="#" className="hover:text-foreground">Политика конфиденциальности</a>
              <a href="#" className="hover:text-foreground">Условия использования</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
