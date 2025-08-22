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
  DollarSign
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
              🚀 AI-Powered Casino CRM
            </Badge>
            <h1 className="mb-6 text-4xl font-bold tracking-tight md:text-6xl lg:text-7xl">
              Увеличьте retention
              <br />
              <span className="text-primary">до 85%</span> с AI
            </h1>
            <p className="mx-auto mb-8 max-w-2xl text-lg text-muted-foreground md:text-xl">
              Автоматизированная CRM-система для онлайн-казино с AI-аналитикой, 
              персонализированными кампаниями и предиктивными моделями удержания игроков
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button size="lg" className="h-12 px-8">
                <PlayCircle className="mr-2 h-5 w-5" />
                Попробовать демо
              </Button>
              <Button size="lg" variant="outline" className="h-12 px-8">
                Связаться с нами
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

      {/* Benefits Section */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-2xl text-center mb-16">
            <h2 className="mb-4 text-3xl font-bold md:text-4xl">
              Почему операторы выбирают нашу CRM
            </h2>
            <p className="text-muted-foreground text-lg">
              Комплексное решение для максимизации LTV игроков и автоматизации маркетинга
            </p>
          </div>
          
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            <Card className="relative overflow-hidden border-2 hover:border-primary/20 transition-colors">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                    <TrendingUp className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <CardTitle className="text-xl">AI-Аналитика</CardTitle>
                    <CardDescription>Предиктивные модели</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-green-500" />
                    Прогноз churn до 95% точности
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-green-500" />
                    Автоматическая сегментация
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-green-500" />
                    Оптимизация LTV в реальном времени
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="relative overflow-hidden border-2 hover:border-primary/20 transition-colors">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                    <MessageSquare className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <CardTitle className="text-xl">Мульти-канальные кампании</CardTitle>
                    <CardDescription>Email, Push, SMS, InApp</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-green-500" />
                    Конструктор сценариев drag&drop
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-green-500" />
                    A/B тестирование
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-green-500" />
                    Персонализация контента
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="relative overflow-hidden border-2 hover:border-primary/20 transition-colors">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                    <BarChart3 className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <CardTitle className="text-xl">Real-time Analytics</CardTitle>
                    <CardDescription>Мгновенная аналитика</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-green-500" />
                    Дашборды в реальном времени
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-green-500" />
                    Автоматические алерты
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-green-500" />
                    Экспорт отчетов
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="relative overflow-hidden border-2 hover:border-primary/20 transition-colors">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                    <Users className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <CardTitle className="text-xl">Управление игроками</CardTitle>
                    <CardDescription>360° профиль пользователя</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-green-500" />
                    Детальные профили игроков
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-green-500" />
                    Сегментация по поведению
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-green-500" />
                    Автоматические теги
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="relative overflow-hidden border-2 hover:border-primary/20 transition-colors">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                    <Shield className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <CardTitle className="text-xl">Безопасность</CardTitle>
                    <CardDescription>Enterprise-уровень</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-green-500" />
                    GDPR compliance
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-green-500" />
                    Шифрование данных
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-green-500" />
                    Ролевая модель доступа
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="relative overflow-hidden border-2 hover:border-primary/20 transition-colors">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                    <Zap className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <CardTitle className="text-xl">Быстрое внедрение</CardTitle>
                    <CardDescription>Запуск за 24 часа</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-green-500" />
                    API-интеграция
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-green-500" />
                    Готовые шаблоны
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-green-500" />
                    Техническая поддержка 24/7
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* How it works Section */}
      <section className="py-16 md:py-24 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-2xl text-center mb-16">
            <h2 className="mb-4 text-3xl font-bold md:text-4xl">
              Как работает AIGAMING.BOT
            </h2>
            <p className="text-muted-foreground text-lg">
              4 простых шага для запуска AI-powered retention-машины
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            <div className="relative">
              <div className="flex flex-col items-center text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary text-primary-foreground text-xl font-bold mb-4">
                  1
                </div>
                <h3 className="mb-2 text-lg font-semibold">Подключение данных</h3>
                <p className="text-sm text-muted-foreground">
                  Интегрируем с вашей игровой платформой через API за 30 минут
                </p>
              </div>
              {/* Connection line */}
              <div className="hidden lg:block absolute top-8 -right-4 w-8 h-px bg-primary/20" />
            </div>

            <div className="relative">
              <div className="flex flex-col items-center text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary text-primary-foreground text-xl font-bold mb-4">
                  2
                </div>
                <h3 className="mb-2 text-lg font-semibold">AI-анализ</h3>
                <p className="text-sm text-muted-foreground">
                  Система анализирует поведение игроков и создает предиктивные модели
                </p>
              </div>
              <div className="hidden lg:block absolute top-8 -right-4 w-8 h-px bg-primary/20" />
            </div>

            <div className="relative">
              <div className="flex flex-col items-center text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary text-primary-foreground text-xl font-bold mb-4">
                  3
                </div>
                <h3 className="mb-2 text-lg font-semibold">Автоматизация</h3>
                <p className="text-sm text-muted-foreground">
                  Создаем персонализированные кампании и автоматические триггеры
                </p>
              </div>
              <div className="hidden lg:block absolute top-8 -right-4 w-8 h-px bg-primary/20" />
            </div>

            <div className="relative">
              <div className="flex flex-col items-center text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary text-primary-foreground text-xl font-bold mb-4">
                  4
                </div>
                <h3 className="mb-2 text-lg font-semibold">Результат</h3>
                <p className="text-sm text-muted-foreground">
                  Получаете рост retention до 85% и увеличение LTV на 40-60%
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Interface Showcase */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-2xl text-center mb-16">
            <h2 className="mb-4 text-3xl font-bold md:text-4xl">
              Интерфейс, созданный для операторов
            </h2>
            <p className="text-muted-foreground text-lg">
              Интуитивно понятная панель управления с мощной аналитикой
            </p>
          </div>

          <div className="relative mb-12">
            <Dialog>
              <DialogTrigger asChild>
                <Card className="p-8 bg-gradient-to-br from-background to-muted/20 cursor-pointer hover:shadow-lg transition-shadow">
                  <div className="aspect-video bg-muted/40 rounded-lg flex items-center justify-center relative group">
                    <div className="text-center">
                      <BarChart3 className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                      <p className="text-muted-foreground mb-2">
                        Основной дашборд AIGAMING.BOT
                      </p>
                      <div className="flex items-center justify-center gap-2 text-primary">
                        <Eye className="h-4 w-4" />
                        <span className="text-sm font-medium">Нажмите для просмотра</span>
                      </div>
                    </div>
                    <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg" />
                  </div>
                </Card>
              </DialogTrigger>
              <DialogContent className="max-w-4xl">
                <div className="aspect-video bg-muted rounded-lg flex items-center justify-center">
                  <div className="text-center">
                    <BarChart3 className="h-20 w-20 text-muted-foreground mx-auto mb-4" />
                    <p className="text-lg font-medium mb-2">Превью интерфейса</p>
                    <p className="text-muted-foreground">
                      Здесь будет полноразмерный скриншот дашборда
                    </p>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          {/* Feature highlights */}
          <div className="grid gap-6 md:grid-cols-3">
            <Card className="p-6">
              <Mail className="h-8 w-8 text-primary mb-3" />
              <h3 className="font-semibold mb-2">Конструктор сценариев</h3>
              <p className="text-sm text-muted-foreground">
                Создавайте сложные multi-step кампании с drag&drop интерфейсом
              </p>
            </Card>

            <Card className="p-6">
              <Users className="h-8 w-8 text-primary mb-3" />
              <h3 className="font-semibold mb-2">Профили игроков</h3>
              <p className="text-sm text-muted-foreground">
                360° view каждого пользователя с AI-инсайтами и рекомендациями
              </p>
            </Card>

            <Card className="p-6">
              <TrendingUp className="h-8 w-8 text-primary mb-3" />
              <h3 className="font-semibold mb-2">Realtime аналитика</h3>
              <p className="text-sm text-muted-foreground">
                Мгновенные insights по эффективности кампаний и поведению игроков
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 md:py-24 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-2xl text-center mb-16">
            <h2 className="mb-4 text-3xl font-bold md:text-4xl">
              Результаты наших клиентов
            </h2>
            <p className="text-muted-foreground text-lg">
              Более 200 операторов уже используют AIGAMING.BOT
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            <Card className="p-6 text-center">
              <div className="text-4xl font-bold text-primary mb-2">85%</div>
              <div className="text-sm font-medium mb-1">Рост retention</div>
              <div className="text-xs text-muted-foreground">В среднем по клиентам</div>
            </Card>

            <Card className="p-6 text-center">
              <div className="text-4xl font-bold text-primary mb-2">2.5x</div>
              <div className="text-sm font-medium mb-1">Увеличение ROI</div>
              <div className="text-xs text-muted-foreground">Кампаний маркетинга</div>
            </Card>

            <Card className="p-6 text-center">
              <div className="text-4xl font-bold text-primary mb-2">24h</div>
              <div className="text-sm font-medium mb-1">Время внедрения</div>
              <div className="text-xs text-muted-foreground">От настройки до запуска</div>
            </Card>

            <Card className="p-6 text-center">
              <div className="text-4xl font-bold text-primary mb-2">95%</div>
              <div className="text-sm font-medium mb-1">Точность прогнозов</div>
              <div className="text-xs text-muted-foreground">AI-модели churn</div>
            </Card>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-2xl text-center mb-16">
            <h2 className="mb-4 text-3xl font-bold md:text-4xl">
              Что говорят наши клиенты
            </h2>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            <Card className="p-6">
              <div className="flex mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              <p className="text-sm mb-4">
                "Увеличили retention на 78% за первые 3 месяца. AI-сегментация работает феноменально!"
              </p>
              <div className="flex items-center gap-3">
                <Avatar>
                  <AvatarFallback>АК</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-semibold text-sm">Алексей Кузнецов</p>
                  <p className="text-xs text-muted-foreground">CRM Manager, LuckyPlay</p>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              <p className="text-sm mb-4">
                "Автоматизировали 90% рутинных задач. Теам фокусируется на стратегии, а не на операционке."
              </p>
              <div className="flex items-center gap-3">
                <Avatar>
                  <AvatarFallback>МП</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-semibold text-sm">Мария Петрова</p>
                  <p className="text-xs text-muted-foreground">Head of Marketing, GoldenCasino</p>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              <p className="text-sm mb-4">
                "ROI кампаний вырос в 2.5 раза. Предиктивные модели churn'а просто спасают бизнес."
              </p>
              <div className="flex items-center gap-3">
                <Avatar>
                  <AvatarFallback>ДС</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-semibold text-sm">Дмитрий Смирнов</p>
                  <p className="text-xs text-muted-foreground">CEO, WinBet Casino</p>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <Card className="relative overflow-hidden border-2 border-primary/20 bg-gradient-to-br from-primary/5 via-background to-primary/5">
            <CardContent className="p-12 text-center">
              <h2 className="mb-4 text-3xl font-bold md:text-4xl">
                Готовы увеличить retention вашего казино?
              </h2>
              <p className="mb-8 text-lg text-muted-foreground max-w-2xl mx-auto">
                Присоединяйтесь к 200+ операторам, которые уже используют AI для роста своего бизнеса. 
                Начните с бесплатного демо и получите первые результаты за 24 часа.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Button size="lg" className="h-12 px-8">
                  <PlayCircle className="mr-2 h-5 w-5" />
                  Запросить демо
                </Button>
                <Button size="lg" variant="outline" className="h-12 px-8">
                  Скачать презентацию
                </Button>
              </div>
              <p className="mt-6 text-sm text-muted-foreground">
                ✓ Бесплатная консультация ✓ Персональная демонстрация ✓ ROI калькулятор
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