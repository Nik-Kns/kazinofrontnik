'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Sparkles, ArrowRight, X } from 'lucide-react';
import type { OnboardingStepConfig } from '@/lib/onboarding-types';

interface StepBubbleProps {
  step: OnboardingStepConfig;
  isActive: boolean;
  onPrimaryAction: () => void;
  onSecondaryAction?: () => void;
  onClose: () => void;
  stepNumber: number;
  totalSteps: number;
}

/**
 * Всплывающая подсказка для шага онбординга
 */
export function StepBubble({
  step,
  isActive,
  onPrimaryAction,
  onSecondaryAction,
  onClose,
  stepNumber,
  totalSteps
}: StepBubbleProps) {
  const [position, setPosition] = useState<{ top: number; left: number } | null>(null);
  const [arrowPosition, setArrowPosition] = useState<'top' | 'bottom' | 'left' | 'right'>('top');

  useEffect(() => {
    if (!isActive || !step.targetSelector) {
      setPosition(null);
      return;
    }

    const updatePosition = () => {
      const targetElement = document.querySelector(step.targetSelector!);
      const bubbleWidth = 400;
      const bubbleHeight = 250;
      const gap = 24;

      let top = 0;
      let left = 0;
      let arrow: typeof arrowPosition = 'top';

      // Если элемент не найден - показываем по центру
      if (!targetElement) {
        console.warn(`⚠️ Target element not found: ${step.targetSelector}`);
        left = window.innerWidth / 2 - bubbleWidth / 2;
        top = window.innerHeight / 2 - bubbleHeight / 2;
        arrow = 'top';
        setPosition({ top, left });
        setArrowPosition(arrow);
        return;
      }

      const targetRect = targetElement.getBoundingClientRect();

      // Вычисляем позицию в зависимости от конфига
      switch (step.position) {
        case 'right':
          left = targetRect.right + gap;
          top = targetRect.top + targetRect.height / 2 - bubbleHeight / 2;
          arrow = 'left';
          break;
        case 'left':
          left = targetRect.left - bubbleWidth - gap;
          top = targetRect.top + targetRect.height / 2 - bubbleHeight / 2;
          arrow = 'right';
          break;
        case 'bottom':
          left = targetRect.left + targetRect.width / 2 - bubbleWidth / 2;
          top = targetRect.bottom + gap;
          arrow = 'top';
          break;
        case 'top':
          left = targetRect.left + targetRect.width / 2 - bubbleWidth / 2;
          top = targetRect.top - bubbleHeight - gap;
          arrow = 'bottom';
          break;
        case 'center':
        default:
          left = window.innerWidth / 2 - bubbleWidth / 2;
          top = window.innerHeight / 2 - bubbleHeight / 2;
          arrow = 'top';
          break;
      }

      // Проверяем, не выходит ли за пределы экрана
      if (left < 16) left = 16;
      if (left + bubbleWidth > window.innerWidth - 16) {
        left = window.innerWidth - bubbleWidth - 16;
      }
      if (top < 16) top = 16;
      if (top + bubbleHeight > window.innerHeight - 16) {
        top = window.innerHeight - bubbleHeight - 16;
      }

      setPosition({ top, left });
      setArrowPosition(arrow);
    };

    updatePosition();
    window.addEventListener('resize', updatePosition);
    window.addEventListener('scroll', updatePosition);

    return () => {
      window.removeEventListener('resize', updatePosition);
      window.removeEventListener('scroll', updatePosition);
    };
  }, [step.targetSelector, step.position, isActive]);

  if (!isActive || !position) return null;

  // Стили для стрелочки
  const arrowStyles = {
    top: 'top-0 left-1/2 -translate-x-1/2 -translate-y-full',
    bottom: 'bottom-0 left-1/2 -translate-x-1/2 translate-y-full rotate-180',
    left: 'left-0 top-1/2 -translate-x-full -translate-y-1/2 -rotate-90',
    right: 'right-0 top-1/2 translate-x-full -translate-y-1/2 rotate-90'
  };

  return (
    <div
      className="fixed z-[9999] animate-in fade-in zoom-in duration-300"
      style={{
        top: `${position.top}px`,
        left: `${position.left}px`,
        width: '400px'
      }}
    >
      <Card
        className="relative shadow-2xl border-2"
        style={{
          borderColor: step.color,
          boxShadow: `0 0 40px ${step.color}40`
        }}
      >
        {/* Стрелочка */}
        <div className={`absolute ${arrowStyles[arrowPosition]}`}>
          <div
            className="w-0 h-0 border-l-8 border-r-8 border-b-[16px] border-l-transparent border-r-transparent"
            style={{ borderBottomColor: step.color }}
          />
        </div>

        {/* Кнопка закрытия */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 p-1 rounded-full hover:bg-gray-100 transition-colors z-10"
          aria-label="Закрыть"
        >
          <X className="h-4 w-4 text-gray-500" />
        </button>

        <CardHeader className="pb-3">
          <div className="flex items-start gap-3">
            <div
              className="p-2 rounded-lg shrink-0"
              style={{ backgroundColor: `${step.color}20` }}
            >
              <Sparkles className="h-5 w-5" style={{ color: step.color }} />
            </div>
            <div className="flex-1 min-w-0">
              <CardTitle className="text-lg mb-1">{step.title}</CardTitle>
              <div className="text-xs text-gray-500 font-medium">
                Шаг {stepNumber} из {totalSteps}
              </div>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          <p className="text-sm text-gray-600 leading-relaxed">
            {step.description}
          </p>

          <div className="flex flex-col gap-2 pt-2">
            {step.buttons.primary && (
              <Button
                onClick={onPrimaryAction}
                className="w-full justify-between group"
                style={{
                  backgroundColor: step.color,
                  color: 'white'
                }}
              >
                <span>{step.buttons.primary.label}</span>
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>
            )}

            {step.buttons.secondary && (
              <Button
                onClick={onSecondaryAction}
                variant="ghost"
                className="w-full text-gray-600 hover:text-gray-800"
                size="sm"
              >
                {step.buttons.secondary.label}
              </Button>
            )}
          </div>

          {/* Индикатор прогресса */}
          <div className="pt-2">
            <div className="flex gap-1">
              {Array.from({ length: totalSteps }).map((_, idx) => (
                <div
                  key={idx}
                  className="h-1 flex-1 rounded-full transition-all duration-300"
                  style={{
                    backgroundColor: idx < stepNumber ? step.color : '#E5E7EB'
                  }}
                />
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
