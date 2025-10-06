"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Send } from "lucide-react";

interface RequestFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function RequestFormDialog({ open, onOpenChange }: RequestFormDialogProps) {
  const [telegramNickname, setTelegramNickname] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!telegramNickname.trim()) return;

    setIsSubmitting(true);

    // Сохраняем данные в localStorage
    try {
      const existingRequests = localStorage.getItem("pilotRequests");
      const requests = existingRequests ? JSON.parse(existingRequests) : [];

      const newRequest = {
        telegramNickname: telegramNickname.trim(),
        timestamp: new Date().toISOString(),
      };

      requests.push(newRequest);
      localStorage.setItem("pilotRequests", JSON.stringify(requests));

      // Показываем успех
      setIsSuccess(true);

      // Закрываем диалог через 1.5 секунды
      setTimeout(() => {
        setIsSuccess(false);
        setTelegramNickname("");
        onOpenChange(false);
      }, 1500);
    } catch (error) {
      console.error("Error saving request:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Оставить заявку на пилот</DialogTitle>
          <DialogDescription>
            Введите ваш никнейм в Telegram для связи
          </DialogDescription>
        </DialogHeader>

        {isSuccess ? (
          <div className="py-8 text-center">
            <div className="mb-4 text-5xl">✅</div>
            <p className="text-lg font-semibold text-green-600">Заявка отправлена!</p>
            <p className="text-sm text-muted-foreground mt-2">Мы свяжемся с вами в ближайшее время</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="telegram">Ваш никнейм в Telegram</Label>
              <Input
                id="telegram"
                placeholder="@username"
                value={telegramNickname}
                onChange={(e) => setTelegramNickname(e.target.value)}
                required
                disabled={isSubmitting}
                className="w-full"
              />
            </div>

            <Button
              type="submit"
              className="w-full"
              disabled={isSubmitting || !telegramNickname.trim()}
            >
              <Send className="mr-2 h-4 w-4" />
              Оставить заявку
            </Button>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
