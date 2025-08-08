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
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export function MainLayout({ children }: { children: React.ReactNode }) {
  const [isCollapsed, setIsCollapsed] = React.useState(false);
  const [brandEnabled, setBrandEnabled] = React.useState<boolean>(true);
  const [brand, setBrand] = React.useState<string>("aigaming");

  React.useEffect(() => {
    try {
      const savedBrand = localStorage.getItem("brandSelection");
      const savedEnabled = localStorage.getItem("brandEnabled");
      if (savedBrand) setBrand(savedBrand);
      if (savedEnabled) setBrandEnabled(savedEnabled === "true");
    } catch {}
  }, []);

  React.useEffect(() => {
    try {
      localStorage.setItem("brandSelection", brand);
      localStorage.setItem("brandEnabled", String(brandEnabled));
    } catch {}
  }, [brand, brandEnabled]);

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

          {/* Бренд-выбор (чекбокс + селектор) */}
          <div className="hidden items-center gap-2 md:flex">
            <Checkbox
              id="brand-enabled"
              checked={brandEnabled}
              onCheckedChange={(v) => setBrandEnabled(Boolean(v))}
            />
            <label htmlFor="brand-enabled" className="text-sm text-muted-foreground">
              Бренд
            </label>
            <Select value={brand} onValueChange={setBrand} disabled={!brandEnabled}>
              <SelectTrigger className="w-[170px]">
                <SelectValue placeholder="Выбрать бренд" />
              </SelectTrigger>
              <SelectContent align="end">
                <SelectItem value="aigaming">AIGAMING.BOT</SelectItem>
                <SelectItem value="luckywheel">LuckyWheel</SelectItem>
                <SelectItem value="goldenplay">GoldenPlay</SelectItem>
              </SelectContent>
            </Select>
          </div>
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
