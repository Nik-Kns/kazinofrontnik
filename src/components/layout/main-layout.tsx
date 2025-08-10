"use client";

import * as React from "react";
import Link from "next/link";
import {
  Bell,
  BotMessageSquare,
  PanelLeft,
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
 

export function MainLayout({ children }: { children: React.ReactNode }) {
  const [isCollapsed, setIsCollapsed] = React.useState(false);
  const [brand, setBrand] = React.useState<string>("aigaming");
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
    } catch {}
  }, []);

  React.useEffect(() => {
    try {
      localStorage.setItem("brandSelection", brand);
    } catch {}
  }, [brand]);

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
              <DropdownMenuItem>Выйти</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </header>
        <main className="flex-1 items-start">
            {children}
        </main>
      </div>
    </div>
  );
}
