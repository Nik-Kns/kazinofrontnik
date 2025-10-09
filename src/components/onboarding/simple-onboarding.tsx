'use client';

import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Sparkles, ArrowRight, ArrowLeft, X } from 'lucide-react';

const STEPS = [
  {
    title: '👋 Добро пожаловать в AiGaming.Bot!',
    description: 'Привет! Я ваш AI-ассистент по удержанию игроков. Давайте быстро пройдемся по основным возможностям платформы.',
    color: '#2962FF'
  },
  {
    title: '🔌 Интеграция данных',
    description: 'Платформа автоматически собирает данные о поведении игроков из вашей системы. Мы анализируем транзакции, активность и риски оттока.',
    color: '#9C27B0'
  },
  {
    title: '📊 Аналитика и сегменты',
    description: 'AI создает умные сегменты игроков и предсказывает их поведение. Вы можете видеть метрики удержания в реальном времени.',
    color: '#00C853'
  },
  {
    title: '🎯 Создание сценариев',
    description: 'Используйте AI Copilot для создания персонализированных кампаний. Система сама подскажет оптимальную стратегию.',
    color: '#FF6D00'
  },
  {
    title: '🚀 Готово к запуску!',
    description: 'Теперь вы знаете основы! Начните с раздела "Командный центр" чтобы увидеть AI-рекомендации по улучшению retention.',
    color: '#FFD600'
  }
];

interface SimpleOnboardingProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function SimpleOnboarding({ open, onOpenChange }: SimpleOnboardingProps) {
  const [currentStep, setCurrentStep] = useState(0);

  const currentStepData = STEPS[currentStep];
  const progress = ((currentStep + 1) / STEPS.length) * 100;
  const isFirstStep = currentStep === 0;
  const isLastStep = currentStep === STEPS.length - 1;

  const handleNext = () => {
    if (isLastStep) {
      onOpenChange(false);
      setCurrentStep(0);
    } else {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handleBack = () => {
    if (!isFirstStep) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleClose = () => {
    onOpenChange(false);
    setCurrentStep(0);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <button
          onClick={handleClose}
          className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground"
        >
          <X className="h-4 w-4" />
          <span className="sr-only">Close</span>
        </button>

        <DialogHeader>
          <div
            className="w-12 h-12 rounded-full flex items-center justify-center mb-4"
            style={{ backgroundColor: currentStepData.color + '20' }}
          >
            <Sparkles
              className="h-6 w-6"
              style={{ color: currentStepData.color }}
            />
          </div>
          <DialogTitle className="text-2xl">{currentStepData.title}</DialogTitle>
          <DialogDescription className="text-base pt-2">
            {currentStepData.description}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>Шаг {currentStep + 1} из {STEPS.length}</span>
              <span>{Math.round(progress)}%</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>

          <div className="flex gap-2">
            {STEPS.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentStep(index)}
                className="flex-1 h-1 rounded-full transition-all"
                style={{
                  backgroundColor: index <= currentStep
                    ? STEPS[index].color
                    : '#e5e7eb'
                }}
              />
            ))}
          </div>
        </div>

        <DialogFooter className="flex-row gap-2 sm:gap-2">
          {!isFirstStep && (
            <Button
              variant="outline"
              onClick={handleBack}
              className="flex-1"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Назад
            </Button>
          )}
          <Button
            onClick={handleNext}
            className="flex-1"
            style={{ backgroundColor: currentStepData.color }}
          >
            {isLastStep ? 'Начать работу' : 'Далее'}
            {!isLastStep && <ArrowRight className="h-4 w-4 ml-2" />}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
