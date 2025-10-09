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
  storageKey: string; // Ключ для localStorage чтобы не показывать повторно
  onComplete?: () => void;
}

export function TooltipOverlay({ steps, storageKey, onComplete }: TooltipOverlayProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [tooltipPosition, setTooltipPosition] = useState({ top: 0, left: 0 });
  const [elementRect, setElementRect] = useState<DOMRect | null>(null);

  useEffect(() => {
    // Проверяем показывали ли уже этот тур
    const completed = localStorage.getItem(storageKey);
    if (!completed) {
      setIsVisible(true);
    }
  }, [storageKey]);

  useEffect(() => {
    if (!isVisible) return;

    const step = steps[currentStep];
    const element = document.querySelector(step.selector);

    if (element) {
      const rect = element.getBoundingClientRect();
      setElementRect(rect);

      // Позиционируем тултип в зависимости от position
      const position = step.position || 'top';
      let top = 0;
      let left = 0;

      switch (position) {
        case 'top':
          top = rect.top - 120; // Над элементом
          left = rect.left + rect.width / 2 - 150; // По центру
          break;
        case 'bottom':
          top = rect.bottom + 20; // Под элементом
          left = rect.left + rect.width / 2 - 150;
          break;
        case 'left':
          top = rect.top + rect.height / 2 - 60;
          left = rect.left - 320; // Слева
          break;
        case 'right':
          top = rect.top + rect.height / 2 - 60;
          left = rect.right + 20; // Справа
          break;
      }

      // Проверяем границы экрана
      if (left < 10) left = 10;
      if (left > window.innerWidth - 310) left = window.innerWidth - 310;
      if (top < 10) top = 10;

      setTooltipPosition({ top, left });

      // Скроллим к элементу
      element.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [currentStep, isVisible, steps]);

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
    localStorage.setItem(storageKey, 'true');
    setIsVisible(false);
    onComplete?.();
  };

  const handleSkip = () => {
    localStorage.setItem(storageKey, 'true');
    setIsVisible(false);
  };

  if (!isVisible) return null;

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
        className="fixed z-[10000] w-[300px] bg-white rounded-lg shadow-2xl p-4 animate-in fade-in slide-in-from-bottom-4 duration-300"
        style={{
          top: tooltipPosition.top,
          left: tooltipPosition.left,
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
