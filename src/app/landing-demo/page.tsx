"use client";

import * as React from "react";
import Link from "next/link";
import { 
  ArrowRight, 
  BarChart3, 
  Users, 
  Target, 
  Zap, 
  Shield, 
  TrendingUp,
  Check,
  PlayCircle,
  Star,
  MessageSquare,
  Mail,
  Smartphone,
  BotMessageSquare,
  Menu,
  Eye,
  Clock,
  DollarSign,
  CheckCircle
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";

const LandingHeader = () => {
  const [isOpen, setIsOpen] = React.useState(false);

  const navItems = [
    { href: "/", label: "Дашборд" },
    { href: "/analytics", label: "Аналитика" },
    { href: "/builder", label: "Сценарии" },
    { href: "/players", label: "Игроки" },
    { href: "/calendar", label: "Календарь" },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 font-semibold text-primary">
            <BotMessageSquare className="h-6 w-6" />
            <span className="font-bold">AIGAMING.BOT</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* CTA Buttons */}
          <div className="hidden md:flex items-center gap-3">
            <Button variant="ghost" size="sm">
              Войти
            </Button>
            <Button size="sm">
              Попробовать демо
            </Button>
          </div>

          {/* Mobile menu trigger */}
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="sm">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Открыть меню</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-80">
              <div className="flex flex-col gap-6 pt-6">
                <div className="flex items-center gap-2">
                  <BotMessageSquare className="h-6 w-6 text-primary" />
                  <span className="font-bold">AIGAMING.BOT</span>
                </div>
                
                <nav className="flex flex-col gap-4">
                  {navItems.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors py-2"
                      onClick={() => setIsOpen(false)}
                    >
                      {item.label}
                    </Link>
                  ))}
                </nav>

                <div className="flex flex-col gap-3 pt-6 border-t">
                  <Button variant="ghost" size="sm" onClick={() => setIsOpen(false)}>
                    Войти
                  </Button>
                  <Button size="sm" onClick={() => setIsOpen(false)}>
                    Попробовать демо
                  </Button>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
};

export default function LandingDemoPage() {
  return (
    <div className="fixed inset-0 bg-background overflow-auto">
      <LandingHeader />
      
      {/* Hero Section */}
      <section className="relative overflow-hidden border-b bg-gradient-to-br from-background via-background to-muted/20">
        <div className="container mx-auto px-4 py-16 md:py-24 lg:py-32">
          <div className="mx-auto max-w-4xl text-center">
            <Badge variant="secondary" className="mb-4">
              🤖 AI-Powered iGaming CRM
            </Badge>
            <h1 className="mb-6 text-4xl font-bold tracking-tight md:text-6xl lg:text-7xl">
              CRM-платформа
              <br />
              <span className="text-primary">нового поколения</span> для iGaming
            </h1>
            <p className="mx-auto mb-8 max-w-2xl text-lg text-muted-foreground md:text-xl">
              Интеллектуальная платформа для автоматизации маркетинга и CRM в онлайн-казино. 
              Соединяем аналитику, поведенческое моделирование и AI для retention-команд
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button size="lg" className="h-12 px-8">
                <PlayCircle className="mr-2 h-5 w-5" />
                Запросить пилот
              </Button>
              <Button size="lg" variant="outline" className="h-12 px-8">
                Посмотреть MVP
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
        
        {/* Decorative elements */}
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute -top-40 -right-32 h-80 w-80 rounded-full bg-primary/5 blur-3xl" />
          <div className="absolute -bottom-40 -left-32 h-80 w-80 rounded-full bg-primary/5 blur-3xl" />
        </div>
      </section>

      {/* Who we are Section */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-2xl text-center mb-16">
            <h2 className="mb-4 text-3xl font-bold md:text-4xl">
              Кто мы?
            </h2>
            <p className="text-muted-foreground text-lg">
              AIgamingBOT — это интеллектуальная платформа для автоматизации маркетинга и CRM в онлайн-казино. 
              Мы соединяем аналитику, поведенческое моделирование и AI, чтобы помочь retention-командам в сфере iGaming:
            </p>
          </div>
          
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <Card className="p-6 border-2 hover:border-primary/20 transition-colors">
              <div className="flex items-start gap-3 mb-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 flex-shrink-0 mt-1">
                  <MessageSquare className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Персонализированные коммуникации</h3>
                  <p className="text-sm text-muted-foreground">
                    Создавать персонализированные коммуникации с помощью ИИ без участия копирайтера и дизайнера / верстальщика
                  </p>
                </div>
              </div>
            </Card>

            <Card className="p-6 border-2 hover:border-primary/20 transition-colors">
              <div className="flex items-start gap-3 mb-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 flex-shrink-0 mt-1">
                  <TrendingUp className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Предиктивные маркеры оттока</h3>
                  <p className="text-sm text-muted-foreground">
                    Видеть предиктивные маркеры оттока и реагировать на них своевременно
                  </p>
                </div>
              </div>
            </Card>

            <Card className="p-6 border-2 hover:border-primary/20 transition-colors">
              <div className="flex items-start gap-3 mb-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 flex-shrink-0 mt-1">
                  <Target className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Гиперсегментация</h3>
                  <p className="text-sm text-muted-foreground">
                    Повышать ROI от промо-активностей за счёт гиперсегментации и персональных цепочек
                  </p>
                </div>
              </div>
            </Card>

            <Card className="p-6 border-2 hover:border-primary/20 transition-colors">
              <div className="flex items-start gap-3 mb-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 flex-shrink-0 mt-1">
                  <Eye className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Неочевидные инсайты</h3>
                  <p className="text-sm text-muted-foreground">
                    Находить неочевидные инсайты, которые могут оптимизировать бюджет и результативность коммуникаций
                  </p>
                </div>
              </div>
            </Card>

            <Card className="p-6 border-2 hover:border-primary/20 transition-colors">
              <div className="flex items-start gap-3 mb-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 flex-shrink-0 mt-1">
                  <BarChart3 className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Анализ эффективности</h3>
                  <p className="text-sm text-muted-foreground">
                    Анализировать эффективность каждой коммуникации с визуальными отчётами
                  </p>
                </div>
              </div>
            </Card>

            <Card className="p-6 border-2 hover:border-primary/20 transition-colors">
              <div className="flex items-start gap-3 mb-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 flex-shrink-0 mt-1">
                  <Zap className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Адаптивный контент</h3>
                  <p className="text-sm text-muted-foreground">
                    Адаптировать контент под гео, тип игрока и стиль игры без переписывания всей цепочки
                  </p>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* MVP Modules Section */}
      <section className="py-16 md:py-24 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-2xl text-center mb-16">
            <h2 className="mb-4 text-3xl font-bold md:text-4xl">
              Ключевые модули MVP
            </h2>
            <p className="text-muted-foreground text-lg">
              Это MVP-версия продукта, сейчас мы реализовываем фундамент технологического ядра, 
              которое сделает CRM-маркетинг в iGaming точнее, быстрее и результативнее
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <Card className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary text-primary-foreground font-bold">
                  1
                </div>
                <h3 className="text-lg font-semibold">Аналитика</h3>
              </div>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• Retention по дням/неделям/месяцам + Run rate по достижению целей</li>
                <li>• Статистика по кампаниям и сегментам</li>
                <li>• Сводка по игрокам: ARPU, ROI, депозиты, churn</li>
                <li>• Возможность загрузки отчетов</li>
                <li>• Уведомления об отклонениях от Run rate</li>
              </ul>
            </Card>

            <Card className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary text-primary-foreground font-bold">
                  2
                </div>
                <h3 className="text-lg font-semibold">Главная панель (Dashboard)</h3>
              </div>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• Настраиваемый дэшборд с метриками проекта</li>
                <li>• Уровень интеграции и потенциал улучшений Retention</li>
                <li>• Прогресс по сценарям welcome/retention/чурн</li>
                <li>• Уведомления и AI-инсайты (в следующих релизах)</li>
                <li>• Рекомендованные к запуску цепочки и коммуникации</li>
              </ul>
            </Card>

            <Card className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary text-primary-foreground font-bold">
                  3
                </div>
                <h3 className="text-lg font-semibold">Редактор сценариев (Builder)</h3>
              </div>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• Drag&Drop конструктор цепочек коммуникаций</li>
                <li>• Фильтр и статистика по каналам</li>
                <li>• Редактор фильтров и сегментов</li>
                <li>• Метки и статистика по каждому сценарию</li>
              </ul>
            </Card>

            <Card className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary text-primary-foreground font-bold">
                  4
                </div>
                <h3 className="text-lg font-semibold">Контент-план и Календарь</h3>
              </div>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• Глобальный календарь коммуникаций</li>
                <li>• Просмотр и фильтрация по каналам, офферам, сегментам</li>
                <li>• Карточка кампании: оффер, сегмент, статус, ответственный</li>
              </ul>
            </Card>

            <Card className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary text-primary-foreground font-bold">
                  5
                </div>
                <h3 className="text-lg font-semibold">Карточка игрока</h3>
              </div>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• История активности, транзакций, коммуникаций</li>
                <li>• Метки сегментов и участие в сценариях</li>
                <li>• AI-рекомендаций внутри карточки</li>
              </ul>
            </Card>

            <Card className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary text-primary-foreground font-bold">
                  6
                </div>
                <h3 className="text-lg font-semibold">Сегменты</h3>
              </div>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• Статистика, фильтры, создание / редактирование</li>
                <li>• Автоматическое обновление по условиям</li>
                <li>• Гибкая фильтрация, тегирование, экспорт</li>
              </ul>
            </Card>
          </div>
        </div>
      </section>

      {/* AI Features Section */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-2xl text-center mb-16">
            <h2 className="mb-4 text-3xl font-bold md:text-4xl">
              Киллер-фичи на базе AI
            </h2>
            <p className="text-muted-foreground text-lg">
              Эти функции станут доступными по мере накопления данных и развития интеграций
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <Card className="p-6 border-2 hover:border-primary/20 transition-colors">
              <div className="flex items-center gap-3 mb-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-primary/80 text-primary-foreground">
                  <MessageSquare className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-semibold">AI-сценарист</h3>
                  <Badge variant="secondary" className="text-xs">Coming Soon</Badge>
                </div>
              </div>
              <p className="text-sm text-muted-foreground">
                Генерация сценариев под конкретные KPI (retention, churm, VIP growth)
              </p>
            </Card>

            <Card className="p-6 border-2 hover:border-primary/20 transition-colors">
              <div className="flex items-center gap-3 mb-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-primary/80 text-primary-foreground">
                  <TrendingUp className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-semibold">Предиктивная аналитика</h3>
                  <Badge variant="secondary" className="text-xs">Coming Soon</Badge>
                </div>
              </div>
              <p className="text-sm text-muted-foreground">
                Прогноз churn, LTV, вероятность депозита
              </p>
            </Card>

            <Card className="p-6 border-2 hover:border-primary/20 transition-colors">
              <div className="flex items-center gap-3 mb-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-primary/80 text-primary-foreground">
                  <Target className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-semibold">AI-сегментация</h3>
                  <Badge variant="secondary" className="text-xs">Coming Soon</Badge>
                </div>
              </div>
              <p className="text-sm text-muted-foreground">
                Автоматическое создание сегментов на основе кластеров поведения
              </p>
            </Card>

            <Card className="p-6 border-2 hover:border-primary/20 transition-colors">
              <div className="flex items-center gap-3 mb-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-primary/80 text-primary-foreground">
                  <Users className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-semibold">AI-рекомендации</h3>
                  <Badge variant="secondary" className="text-xs">Coming Soon</Badge>
                </div>
              </div>
              <p className="text-sm text-muted-foreground">
                Когда, через какой канал, с каким оффером лучше обратиться
              </p>
            </Card>

            <Card className="p-6 border-2 hover:border-primary/20 transition-colors">
              <div className="flex items-center gap-3 mb-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-primary/80 text-primary-foreground">
                  <Mail className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-semibold">Автогенерация контента</h3>
                  <Badge variant="secondary" className="text-xs">Coming Soon</Badge>
                </div>
              </div>
              <p className="text-sm text-muted-foreground">
                Автоматическая генерация текстов и креативов под кампанию: учитывая стиль, канал и цели
              </p>
            </Card>

            <Card className="p-6 border-2 hover:border-primary/20 transition-colors">
              <div className="flex items-center gap-3 mb-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-primary/80 text-primary-foreground">
                  <BarChart3 className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-semibold">Интеграции (5 уровней)</h3>
                  <Badge variant="outline" className="text-xs">MVP Ready</Badge>
                </div>
              </div>
              <p className="text-sm text-muted-foreground">
                CSV / API / webhook / event stream / поведенческое ядро. Чем выше уровень — тем выше качество персонализации
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* Why MVP Section */}
      <section className="py-16 md:py-24 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-3xl text-center mb-16">
            <h2 className="mb-4 text-3xl font-bold md:text-4xl">
              Почему MVP уже дает ценность?
            </h2>
            <div className="grid gap-6 md:grid-cols-3 text-left">
              <Card className="p-6">
                <div className="flex items-center gap-3 mb-3">
                  <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                    <span className="text-primary font-bold">1</span>
                  </div>
                  <h3 className="font-semibold">Единое окно</h3>
                </div>
                <p className="text-sm text-muted-foreground">
                  Все сценарии, сегменты, игроки и статистика — в одном месте
                </p>
              </Card>

              <Card className="p-6">
                <div className="flex items-center gap-3 mb-3">
                  <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                    <span className="text-primary font-bold">2</span>
                  </div>
                  <h3 className="font-semibold">Быстрое создание</h3>
                </div>
                <p className="text-sm text-muted-foreground">
                  Быстрое создание контент-плана, офферов, текстов
                </p>
              </Card>

              <Card className="p-6">
                <div className="flex items-center gap-3 mb-3">
                  <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                    <span className="text-primary font-bold">3</span>
                  </div>
                  <h3 className="font-semibold">Контроль</h3>
                </div>
                <p className="text-sm text-muted-foreground">
                  Понятная панель и карточки позволяют видеть, что происходит и что работает
                </p>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Data Intelligence Section */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-4xl">
            <div className="text-center mb-12">
              <h2 className="mb-4 text-3xl font-bold md:text-4xl">
                Чем больше данных — тем умнее AI
              </h2>
              <p className="text-lg text-muted-foreground mb-8">
                AIgamingBOT использует поведенческое и транзакционное ядро данных для построения точных моделей.
              </p>
            </div>

            <Card className="p-8 bg-gradient-to-br from-primary/5 to-background border-2 border-primary/10">
              <h3 className="text-xl font-semibold mb-6 text-center">Почему это важно:</h3>
              <div className="grid gap-6 md:grid-cols-2">
                <div className="flex items-start gap-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 flex-shrink-0">
                    <BarChart3 className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Анализ максимального количества событий</h4>
                    <p className="text-sm text-muted-foreground">
                      Богатство паттернов и триггеров для более точной аналитики
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 flex-shrink-0">
                    <Target className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Глубокая интеграция</h4>
                    <p className="text-sm text-muted-foreground">
                      Чем глубже интеграция (до уровня действий игрока) — тем точнее персонализация
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 flex-shrink-0">
                    <Users className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Показываем как коммуницировать</h4>
                    <p className="text-sm text-muted-foreground">
                      Как, когда и почему стоит коммуницировать с игроком
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 flex-shrink-0">
                    <TrendingUp className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Потенциальная эффективность</h4>
                    <p className="text-sm text-muted-foreground">
                      Лучше потенциальная эффективность коммуникаций
                    </p>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* Pilot Benefits Section */}
      <section className="py-16 md:py-24 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-4xl">
            <div className="text-center mb-12">
              <h2 className="mb-4 text-3xl font-bold md:text-4xl">
                Почему стоит зайти в пилот?
              </h2>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-12">
              <Card className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <DollarSign className="h-5 w-5 text-primary" />
                  </div>
                  <h3 className="font-semibold">Условия пилота</h3>
                </div>
                <p className="text-sm text-muted-foreground">
                  Интеграция за себестоимость + поддержка от основателей
                </p>
              </Card>

              <Card className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <CheckCircle className="h-5 w-5 text-primary" />
                  </div>
                  <h3 className="font-semibold">MVP готов</h3>
                </div>
                <p className="text-sm text-muted-foreground">
                  MVP уже покрывает базовые сценарии + ключевую аналитику
                </p>
              </Card>

              <Card className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <Users className="h-5 w-5 text-primary" />
                  </div>
                  <h3 className="font-semibold">Влияние на roadmap</h3>
                </div>
                <p className="text-sm text-muted-foreground">
                  Вы влияете на roadmap и приоритезацию AI-фичей под ваш бизнес
                </p>
              </Card>

              <Card className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <Star className="h-5 w-5 text-primary" />
                  </div>
                  <h3 className="font-semibold">Статус раннего клиента</h3>
                </div>
                <p className="text-sm text-muted-foreground">
                  Эксклюзивные условия в будущем
                </p>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <Card className="relative overflow-hidden border-2 border-primary/20 bg-gradient-to-br from-primary/5 via-background to-primary/5">
            <CardContent className="p-12 text-center">
              <h2 className="mb-4 text-3xl font-bold md:text-4xl">
                Готовы к пилоту?
              </h2>
              <p className="mb-8 text-lg text-muted-foreground max-w-2xl mx-auto">
                Давайте сделаем первые шаги: интеграцию и настройку от команды, 
                CRM-инфраструктуру, которая масштабируется вместе с вашим бизнесом
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Button size="lg" className="h-12 px-8">
                  <PlayCircle className="mr-2 h-5 w-5" />
                  Запросить пилот
                </Button>
                <Button size="lg" variant="outline" className="h-12 px-8">
                  Посмотреть MVP демо
                </Button>
              </div>
              <p className="mt-6 text-sm text-muted-foreground">
                ✓ Интеграция за себестоимость ✓ Поддержка основателей ✓ Влияние на roadmap
              </p>
            </CardContent>
            
            {/* Decorative elements */}
            <div className="absolute -top-20 -right-20 h-40 w-40 rounded-full bg-primary/10 blur-3xl" />
            <div className="absolute -bottom-20 -left-20 h-40 w-40 rounded-full bg-primary/10 blur-3xl" />
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-muted/30 py-12">
        <div className="container mx-auto px-4">
          <div className="grid gap-8 md:grid-cols-4">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="flex h-8 w-8 items-center justify-center rounded bg-primary text-primary-foreground text-sm font-bold">
                  AI
                </div>
                <span className="font-semibold">AIGAMING.BOT</span>
              </div>
              <p className="text-sm text-muted-foreground">
                AI-powered CRM для максимизации retention и LTV игроков онлайн-казино
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Продукт</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="#" className="hover:text-foreground transition-colors">Функции</Link></li>
                <li><Link href="#" className="hover:text-foreground transition-colors">Интеграции</Link></li>
                <li><Link href="#" className="hover:text-foreground transition-colors">API</Link></li>
                <li><Link href="#" className="hover:text-foreground transition-colors">Безопасность</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Компания</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="#" className="hover:text-foreground transition-colors">О нас</Link></li>
                <li><Link href="#" className="hover:text-foreground transition-colors">Блог</Link></li>
                <li><Link href="#" className="hover:text-foreground transition-colors">Карьера</Link></li>
                <li><Link href="#" className="hover:text-foreground transition-colors">Контакты</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Поддержка</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="#" className="hover:text-foreground transition-colors">Документация</Link></li>
                <li><Link href="#" className="hover:text-foreground transition-colors">База знаний</Link></li>
                <li><Link href="#" className="hover:text-foreground transition-colors">Техподдержка</Link></li>
                <li><Link href="#" className="hover:text-foreground transition-colors">Статус сервиса</Link></li>
              </ul>
            </div>
          </div>
          
          <div className="mt-8 pt-8 border-t flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm text-muted-foreground">
              © 2024 AIGAMING.BOT. Все права защищены.
            </p>
            <div className="flex gap-6 mt-4 md:mt-0">
              <Link href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Политика конфиденциальности
              </Link>
              <Link href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Условия использования
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}