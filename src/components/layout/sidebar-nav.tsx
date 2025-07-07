"use client";

import {
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar";
import { usePathname } from "next/navigation";
import Link from "next/link";
import {
    LayoutDashboard,
    Repeat,
    Users,
    Workflow,
    ClipboardCopy,
    UserCircle,
    Map,
    BarChart2,
    MessageSquare,
    Bot,
    Settings,
    HelpCircle,
    FileText,
    Calendar,
} from 'lucide-react';

const navItems = [
    { href: '/', label: 'Командный центр', icon: LayoutDashboard },
    { href: '/segments', label: 'Сегменты', icon: Users },
    { href: '/builder', label: 'Конструктор сценариев', icon: Workflow },
    { href: '/templates', label: 'Шаблоны сценариев', icon: ClipboardCopy },
    { href: '/analytics', label: 'Аналитика', icon: BarChart2 },
    { href: '/reports', label: 'Отчёты', icon: FileText },
    { href: '/calendar', label: 'Календарь кампаний', icon: Calendar },
    { href: '/settings', label: 'Настройки', icon: Settings },
];

export default function SidebarNav() {
  const pathname = usePathname();

  return (
    <SidebarMenu>
      {navItems.map((item) => (
        <SidebarMenuItem key={item.href}>
          <Link href={item.href} legacyBehavior passHref>
            <SidebarMenuButton
              isActive={pathname === item.href}
              className="w-full justify-start"
              tooltip={item.label}
            >
              <item.icon className="h-4 w-4 mr-2" />
              <span>{item.label}</span>
            </SidebarMenuButton>
          </Link>
        </SidebarMenuItem>
      ))}
    </SidebarMenu>
  );
}
