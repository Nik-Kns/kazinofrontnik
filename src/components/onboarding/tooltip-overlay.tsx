'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { X, ArrowRight, ArrowLeft } from 'lucide-react';

export interface TooltipStep {
  selector: string; // CSS селектор элемента
  title: string;
  description: string;
  position?: 'top' | 'bottom' | 'left' | 'right';
}

interface TooltipOverlayProps {
  steps: TooltipStep[];
  isActive: boolean; // Активен ли тур (управляется извне)
  onClose?: () => void;
}

export function TooltipOverlay({ steps, isActive, onClose }: TooltipOverlayProps) {
  const [isMounted, setIsMounted] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [tooltipPosition, setTooltipPosition] = useState({ top: 0, left: 0 });
  const [elementRect, setElementRect] = useState<DOMRect | null>(null);

  // Флаг монтирования для предотвращения гидратации
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Сбрасываем шаг при активации
  useEffect(() => {
    if (isActive) {
      setCurrentStep(0);
    }
  }, [isActive]);

  useEffect(() => {
    if (!isActive || !isMounted) return;

    const step = steps[currentStep];
    const element = document.querySelector(step.selector);

    if (element) {
      // Небольшая задержка чтобы элемент точно отрендерился
      setTimeout(() => {
        const rect = element.getBoundingClientRect();
        setElementRect(rect);

        // Константы для тултипа
        const tooltipWidth = 320;
        const tooltipHeight = 200; // примерная высота
        const gap = 20; // отступ от элемента

        // Определяем лучшую позицию автоматически
        let position = step.position || 'auto';

        // Автоопределение позиции если 'auto'
        if (position === 'auto') {
          const spaceTop = rect.top;
          const spaceBottom = window.innerHeight - rect.bottom;
          const spaceLeft = rect.left;
          const spaceRight = window.innerWidth - rect.right;

          // Приоритет: bottom > top > right > left
          if (spaceBottom > tooltipHeight + gap) {
            position = 'bottom';
          } else if (spaceTop > tooltipHeight + gap) {
            position = 'top';
          } else if (spaceRight > tooltipWidth + gap) {
            position = 'right';
          } else if (spaceLeft > tooltipWidth + gap) {
            position = 'left';
          } else {
            position = 'bottom'; // фоллбэк
          }
        }

        let top = 0;
        let left = 0;

        switch (position) {
          case 'top':
            top = rect.top - tooltipHeight - gap;
            left = rect.left + rect.width / 2 - tooltipWidth / 2;
            break;
          case 'bottom':
            top = rect.bottom + gap;
            left = rect.left + rect.width / 2 - tooltipWidth / 2;
            break;
          case 'left':
            top = rect.top + rect.height / 2 - tooltipHeight / 2;
            left = rect.left - tooltipWidth - gap;
            break;
          case 'right':
            top = rect.top + rect.height / 2 - tooltipHeight / 2;
            left = rect.right + gap;
            break;
        }

        // Проверяем границы экрана и корректируем
        const padding = 16;

        // Горизонтальные границы
        if (left < padding) {
          left = padding;
        }
        if (left + tooltipWidth > window.innerWidth - padding) {
          left = window.innerWidth - tooltipWidth - padding;
        }

        // Вертикальные границы
        if (top < padding) {
          top = padding;
        }
        if (top + tooltipHeight > window.innerHeight - padding) {
          top = window.innerHeight - tooltipHeight - padding;
        }

        setTooltipPosition({ top, left });

        // Скроллим к элементу с отступом
        element.scrollIntoView({
          behavior: 'smooth',
          block: 'center',
          inline: 'center'
        });
      }, 100);
    }
  }, [currentStep, isActive, steps, isMounted]);

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      handleComplete();
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleComplete = () => {
    console.log('🎯 TooltipOverlay: handleComplete called, closing...');
    onClose?.();
  };

  const handleSkip = () => {
    console.log('🎯 TooltipOverlay: handleSkip called, closing...');
    onClose?.();
  };

  // Не рендерим пока не смонтировались на клиенте или не активны
  if (!isMounted || !isActive) {
    console.log('🎯 TooltipOverlay: not rendering, isMounted:', isMounted, 'isActive:', isActive);
    return null;
  }

  console.log('🎯 TooltipOverlay: rendering, step:', currentStep);

  const step = steps[currentStep];
  const isFirstStep = currentStep === 0;
  const isLastStep = currentStep === steps.length - 1;

  return (
    <>
      {/* Оверлей с затемнением */}
      <div className="fixed inset-0 bg-black/60 z-[9998]" onClick={handleSkip} />

      {/* Подсветка элемента */}
      {elementRect && (
        <div
          className="fixed z-[9999] rounded-lg ring-4 ring-blue-500 ring-offset-4 pointer-events-none animate-pulse"
          style={{
            top: elementRect.top - 4,
            left: elementRect.left - 4,
            width: elementRect.width + 8,
            height: elementRect.height + 8,
          }}
        />
      )}

      {/* Тултип с подсказкой */}
      <div
        className="fixed z-[10001] w-[320px] bg-white rounded-lg shadow-2xl p-5 animate-in fade-in slide-in-from-bottom-4 duration-300"
        style={{
          top: tooltipPosition.top,
          left: tooltipPosition.left,
          maxHeight: 'calc(100vh - 32px)'
        }}
      >
        <button
          onClick={handleSkip}
          className="absolute right-2 top-2 rounded-sm opacity-70 hover:opacity-100 transition-opacity"
        >
          <X className="h-4 w-4" />
        </button>

        <div className="space-y-3">
          <div>
            <h3 className="font-semibold text-lg text-gray-900">{step.title}</h3>
            <p className="text-sm text-gray-600 mt-1">{step.description}</p>
          </div>

          <div className="flex items-center justify-between pt-2 border-t">
            <span className="text-xs text-gray-500">
              {currentStep + 1} / {steps.length}
            </span>
            <div className="flex gap-2">
              {!isFirstStep && (
                <Button
                  onClick={handleBack}
                  variant="outline"
                  size="sm"
                  className="h-8"
                >
                  <ArrowLeft className="h-3 w-3 mr-1" />
                  Назад
                </Button>
              )}
              <Button
                onClick={handleNext}
                size="sm"
                className="h-8 bg-blue-600 hover:bg-blue-700"
              >
                {isLastStep ? 'Готово' : 'Далее'}
                {!isLastStep && <ArrowRight className="h-3 w-3 ml-1" />}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
