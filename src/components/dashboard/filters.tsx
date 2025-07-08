"use client";

import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CalendarIcon } from "lucide-react";

export function Filters() {
  return (
    <div className="flex flex-wrap items-center gap-2 md:gap-4">
      <div className="flex flex-wrap items-center gap-2 md:gap-4 flex-1">
        <Select defaultValue="7">
          <SelectTrigger className="w-full sm:w-auto md:w-[160px]">
            <div className="flex items-center gap-2">
              <CalendarIcon className="h-4 w-4 text-muted-foreground" />
              <SelectValue placeholder="Период" />
            </div>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="7">7 дней</SelectItem>
            <SelectItem value="14">14 дней</SelectItem>
            <SelectItem value="30">30 дней</SelectItem>
          </SelectContent>
        </Select>
        <Select>
          <SelectTrigger className="w-full sm:w-auto md:w-[200px]">
            <SelectValue placeholder="Каналы" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="email">Email</SelectItem>
            <SelectItem value="push">Push</SelectItem>
            <SelectItem value="sms">SMS</SelectItem>
            <SelectItem value="inapp">InApp</SelectItem>
          </SelectContent>
        </Select>
        <Select>
          <SelectTrigger className="w-full sm:w-auto md:w-[200px]">
            <SelectValue placeholder="Сценарии" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="welcome">Welcome Chain</SelectItem>
            <SelectItem value="churn">Churn Reactivation</SelectItem>
            <SelectItem value="vip">VIP Weekly Bonus</SelectItem>
          </SelectContent>
        </Select>
        <Select>
          <SelectTrigger className="w-full sm:w-auto md:w-[200px]">
            <SelectValue placeholder="Сегменты" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="new">Новички</SelectItem>
            <SelectItem value="sleeping">Спящие</SelectItem>
            <SelectItem value="vip">VIP</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="flex items-center gap-2">
        <Button variant="outline">Сбросить</Button>
        <Button className="bg-success hover:bg-success/90 text-success-foreground">
          Применить фильтр
        </Button>
      </div>
    </div>
  );
}
