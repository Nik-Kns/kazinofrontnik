'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Sparkles, Check, Circle, X } from 'lucide-react';
import type { OnboardingStep } from '@/lib/onboarding-types';
import { ONBOARDING_STEPS } from '@/lib/onboarding-types';

interface SidePanelProps {
  isActive: boolean;
  currentStep: number;
  completedSteps: OnboardingStep[];
  skippedSteps: OnboardingStep[];
  progress: number;
  onClose: () => void;
}

/**
 * Боковая панель AI-ассистента с прогрессом онбординга
 */
export function SidePanel({
  isActive,
  currentStep,
  completedSteps,
  skippedSteps,
  progress,
  onClose
}: SidePanelProps) {
  if (!isActive) return null;

  return (
    <div className="fixed top-0 right-0 h-screen w-80 z-[9997] animate-in slide-in-from-right duration-300">
      <Card className="h-full rounded-none border-l shadow-2xl flex flex-col">
        <CardHeader className="border-b bg-gradient-to-br from-blue-50 to-purple-50 relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1 rounded-full hover:bg-white/50 transition-colors"
            aria-label="Закрыть"
          >
            <X className="h-4 w-4 text-gray-600" />
          </button>

          <div className="flex items-center gap-2 mb-3">
            <div className="p-2 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600">
              <Sparkles className="h-5 w-5 text-white" />
            </div>
            <CardTitle className="text-lg">AI Onboarding</CardTitle>
          </div>

          {/* Круговой прогресс */}
          <div className="flex items-center justify-between mt-4">
            <div className="relative">
              <svg className="w-20 h-20 -rotate-90">
                <circle
                  cx="40"
                  cy="40"
                  r="36"
                  stroke="#E5E7EB"
                  strokeWidth="6"
                  fill="none"
                />
                <circle
                  cx="40"
                  cy="40"
                  r="36"
                  stroke="url(#gradient)"
                  strokeWidth="6"
                  fill="none"
                  strokeDasharray={`${2 * Math.PI * 36}`}
                  strokeDashoffset={`${2 * Math.PI * 36 * (1 - progress / 100)}`}
                  strokeLinecap="round"
                  className="transition-all duration-500"
                />
                <defs>
                  <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#2962FF" />
                    <stop offset="100%" stopColor="#9C27B0" />
                  </linearGradient>
                </defs>
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-2xl font-bold bg-gradient-to-br from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  {Math.round(progress)}%
                </span>
              </div>
            </div>

            <div className="text-right">
              <div className="text-sm text-gray-500 mb-1">Ваш прогресс</div>
              <div className="text-2xl font-bold text-gray-900">
                {completedSteps.length} / {ONBOARDING_STEPS.length}
              </div>
              <div className="text-xs text-gray-500">шагов завершено</div>
            </div>
          </div>
        </CardHeader>

        <CardContent className="flex-1 overflow-y-auto p-4">
          <div className="space-y-3">
            {ONBOARDING_STEPS.map((step, index) => {
              const isCompleted = completedSteps.includes(step.id);
              const isSkipped = skippedSteps.includes(step.id);
              const isCurrent = index === currentStep;

              return (
                <div
                  key={step.id}
                  className={`
                    p-3 rounded-lg border-2 transition-all duration-300
                    ${isCurrent ? 'border-current shadow-lg scale-105' : 'border-gray-200'}
                    ${isCompleted ? 'bg-green-50' : ''}
                    ${isSkipped ? 'opacity-50' : ''}
                  `}
                  style={{
                    borderColor: isCurrent ? step.color : undefined
                  }}
                >
                  <div className="flex items-start gap-3">
                    {/* Иконка статуса */}
                    <div className="shrink-0 mt-0.5">
                      {isCompleted ? (
                        <div className="p-1 rounded-full bg-green-500">
                          <Check className="h-4 w-4 text-white" />
                        </div>
                      ) : isCurrent ? (
                        <div
                          className="p-1 rounded-full animate-pulse"
                          style={{ backgroundColor: step.color }}
                        >
                          <Circle className="h-4 w-4 text-white fill-current" />
                        </div>
                      ) : (
                        <div className="p-1 rounded-full bg-gray-300">
                          <Circle className="h-4 w-4 text-white" />
                        </div>
                      )}
                    </div>

                    {/* Информация о шаге */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <h4 className="font-semibold text-sm text-gray-900 leading-tight">
                          {step.title}
                        </h4>
                        <span className="text-xs text-gray-500 shrink-0">
                          {index + 1}/{ONBOARDING_STEPS.length}
                        </span>
                      </div>

                      {isCurrent && (
                        <p className="text-xs text-gray-600 leading-relaxed mt-1">
                          {step.description}
                        </p>
                      )}

                      {isSkipped && (
                        <span className="text-xs text-gray-500 italic">
                          Пропущено
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Цветная полоска внизу для текущего шага */}
                  {isCurrent && (
                    <div
                      className="h-1 rounded-full mt-2 animate-pulse"
                      style={{ backgroundColor: step.color }}
                    />
                  )}
                </div>
              );
            })}
          </div>

          {/* Мотивационное сообщение */}
          {progress === 100 ? (
            <div className="mt-6 p-4 rounded-lg bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-200">
              <div className="flex items-center gap-2 mb-2">
                <Sparkles className="h-5 w-5 text-green-600" />
                <h4 className="font-semibold text-green-900">Поздравляем! 🎉</h4>
              </div>
              <p className="text-sm text-green-700">
                Вы успешно завершили онбординг! Теперь AI готов помогать вам в работе.
              </p>
            </div>
          ) : (
            <div className="mt-6 p-4 rounded-lg bg-gradient-to-br from-blue-50 to-purple-50 border-2 border-blue-200">
              <div className="flex items-center gap-2 mb-2">
                <Sparkles className="h-5 w-5 text-blue-600" />
                <h4 className="font-semibold text-blue-900">Продолжайте!</h4>
              </div>
              <p className="text-sm text-blue-700">
                Осталось {ONBOARDING_STEPS.length - completedSteps.length} {' '}
                {ONBOARDING_STEPS.length - completedSteps.length === 1 ? 'шаг' : 'шага'} до завершения настройки.
              </p>
            </div>
          )}
        </CardContent>

        {/* Футер с кнопкой выхода */}
        <div className="p-4 border-t bg-gray-50">
          <Button
            onClick={onClose}
            variant="outline"
            className="w-full"
            size="sm"
          >
            Завершить онбординг
          </Button>
        </div>
      </Card>
    </div>
  );
}
