"use client";

import * as React from "react";
import Link from "next/link";
import {
  Bell,
  BotMessageSquare,
  PanelLeft,
  Moon,
  Sun,
  Settings,
  PiggyBank,
  Zap,
  Sparkles,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import SidebarNav from "./sidebar-nav";
import { cn } from "@/lib/utils";
import { useCurrency } from "@/contexts/currency-context";
import { CurrencyBadge } from "@/components/ui/currency-badge";
import { CurrencySettingsDialog } from "@/components/ui/currency-settings-dialog";
import { CurrencyErrorsList } from "@/components/ui/currency-error-handler";
import { useOnboarding } from "@/hooks/use-onboarding";


export function MainLayout({ children }: { children: React.ReactNode }) {
  const [isCollapsed, setIsCollapsed] = React.useState(false);
  const [brand, setBrand] = React.useState<string>("aigaming");
  const [theme, setTheme] = React.useState<"light" | "dark">("light");
  const [isCurrencySettingsOpen, setIsCurrencySettingsOpen] = React.useState(false);
  const [economyMode, setEconomyMode] = React.useState(false);

  const { state: currencyState } = useCurrency();
  const { startOnboarding } = useOnboarding();
  const BRAND_OPTIONS = React.useMemo(
    () => [
      {
        id: "aigaming",
        label: "AIGAMING.BOT",
        logo: "https://placehold.co/24x24/7C3AED/FFFFFF?text=AG",
      },
      {
        id: "luckywheel",
        label: "LuckyWheel",
        logo: "https://placehold.co/24x24/10B981/FFFFFF?text=LW",
      },
      {
        id: "goldenplay",
        label: "GoldenPlay",
        logo: "https://placehold.co/24x24/F59E0B/FFFFFF?text=GP",
      },
    ],
    []
  );

  React.useEffect(() => {
    try {
      const savedBrand = localStorage.getItem("brandSelection");
      if (savedBrand) setBrand(savedBrand);
      const savedTheme = localStorage.getItem("theme");
      if (savedTheme === "dark" || savedTheme === "light") {
        setTheme(savedTheme);
      } else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        setTheme("dark");
      }
      // Загружаем режим экономии
      const savedEconomyMode = localStorage.getItem("aiEconomyMode");
      setEconomyMode(savedEconomyMode === "true");
    } catch {}
  }, []);

  React.useEffect(() => {
    try {
      localStorage.setItem("brandSelection", brand);
    } catch {}
  }, [brand]);

  React.useEffect(() => {
    const root = document.documentElement;
    if (theme === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
    try { localStorage.setItem("theme", theme); } catch {}
  }, [theme]);

  return (
    <div className="flex min-h-screen w-full flex-col bg-muted/40">
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-10 hidden h-full flex-col border-r bg-background transition-all duration-300 sm:flex",
          isCollapsed ? "w-20" : "w-64"
        )}
      >
        <div className="flex h-16 shrink-0 items-center border-b px-4 lg:px-6">
          <Link
            href="/"
            className="flex items-center gap-2 font-semibold text-primary"
          >
            <BotMessageSquare className="h-6 w-6" />
            <span className={cn(isCollapsed && "hidden")}>AIGAMING.BOT</span>
            <span className="sr-only">AIGAMING.BOT</span>
          </Link>
        </div>
        <SidebarNav isCollapsed={isCollapsed} />
      </aside>
      <div
        className={cn(
          "flex flex-1 flex-col overflow-x-hidden transition-all duration-300",
          isCollapsed ? "sm:pl-20" : "sm:pl-64"
        )}
      >
        <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="sm:rounded-full"
          >
            <PanelLeft className="h-5 w-5" />
            <span className="sr-only">Toggle sidebar</span>
          </Button>

          <div className="relative ml-auto flex-1 md:grow-0" />

          {/* Переключатель темы */}
          <Button
            variant="ghost"
            size="icon"
            className="rounded-full hidden md:flex"
            onClick={() => setTheme((t) => (t === "dark" ? "light" : "dark"))}
            aria-label="Toggle theme"
            title="Переключить тему"
          >
            {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </Button>

          {/* Бренд: одна иконка с выбором по клику */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="rounded-full hidden md:flex">
                <Avatar className="h-7 w-7">
                  <AvatarImage
                    src={BRAND_OPTIONS.find((b) => b.id === brand)?.logo}
                    alt={BRAND_OPTIONS.find((b) => b.id === brand)?.label || "brand"}
                  />
                  <AvatarFallback>BR</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Выбрать бренд</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {BRAND_OPTIONS.map((b) => (
                <DropdownMenuItem
                  key={b.id}
                  onClick={() => setBrand(b.id)}
                  className="flex items-center gap-2 cursor-pointer"
                >
                  <Avatar className="h-5 w-5">
                    <AvatarImage src={b.logo} alt={b.label} />
                    <AvatarFallback>{b.label.slice(0, 2)}</AvatarFallback>
                  </Avatar>
                  <span>{b.label}</span>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
          
          {/* Индикатор режима экономии ИИ */}
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg border">
            {economyMode ? (
              <>
                <PiggyBank className="h-4 w-4 text-green-600" />
                <span className="text-xs font-medium text-green-600">Экономный режим</span>
              </>
            ) : (
              <>
                <Zap className="h-4 w-4 text-blue-600" />
                <span className="text-xs font-medium text-blue-600">Базовый режим</span>
              </>
            )}
          </div>

          {/* Базовая валюта */}
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => setIsCurrencySettingsOpen(true)}
            className="gap-2 px-3"
          >
            <span className="text-xs font-medium text-muted-foreground">BASE:</span>
            <CurrencyBadge currency={currencyState.base_currency} showFlag />
            <Settings className="h-3 w-3 opacity-50" />
          </Button>
          
          <Button variant="ghost" size="icon" className="rounded-full">
            <Bell className="h-5 w-5" />
            <span className="sr-only">Уведомления</span>
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="overflow-hidden rounded-full">
                <Avatar className="h-9 w-9">
                  <AvatarImage
                    src="https://placehold.co/36x36.png"
                    alt="@user"
                    data-ai-hint="person portrait"
                  />
                  <AvatarFallback>AG</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Мой аккаунт</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Настройки</DropdownMenuItem>
              <DropdownMenuItem>Поддержка</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={startOnboarding} className="gap-2">
                <Sparkles className="h-4 w-4 text-blue-600" />
                <span>AI Онбординг</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Выйти</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </header>
                            <main className="flex-1 items-start">
                        <CurrencyErrorsList />
                        {children}
                    </main>
      </div>
      
      {/* Диалог настроек валют */}
      <CurrencySettingsDialog 
        open={isCurrencySettingsOpen} 
        onOpenChange={setIsCurrencySettingsOpen} 
      />
    </div>
  );
}
