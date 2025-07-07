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
            <span className={cn(isCollapsed && "hidden")}>Retentlytics AI</span>
            <span className="sr-only">Retentlytics AI</span>
          </Link>
        </div>
        <SidebarNav isCollapsed={isCollapsed} />
      </aside>
      <div
        className={cn(
          "flex flex-1 flex-col transition-all duration-300",
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

          <div className="relative ml-auto flex-1 md:grow-0">
            {/* Optional search bar can go here */}
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
                  <AvatarFallback>RA</AvatarFallback>
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
        <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
            {children}
        </main>
      </div>
    </div>
  );
}
