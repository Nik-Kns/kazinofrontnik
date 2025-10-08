'use client';

import { useEffect, useState } from 'react';
import { useOnboarding } from '@/hooks/use-onboarding';
import { HighlightMask } from './highlight-mask';
import { StepBubble } from './step-bubble';
import { SidePanel } from './side-panel';

/**
 * Главный компонент AI-онбординга
 * Объединяет затемнение, подсказки и боковую панель
 */
export function OnboardingOverlay() {
  const [isMounted, setIsMounted] = useState(false);
  const {
    isActive,
    currentStep,
    currentStepConfig,
    completedSteps,
    skippedSteps,
    progress,
    totalSteps,
    stopOnboarding,
    handlePrimaryAction,
    handleSecondaryAction
  } = useOnboarding();

  // Предотвращаем гидратацию
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Логирование для отладки
  useEffect(() => {
    console.log('OnboardingOverlay state:', { isMounted, isActive, currentStep });
  }, [isMounted, isActive, currentStep]);

  // Не показываем пока не смонтировалось или не активно
  if (!isActive) return null;
  if (!isMounted) return null;

  return (
    <>
      {/* Затемнение с подсветкой */}
      <HighlightMask
        targetSelector={currentStepConfig.targetSelector}
        isActive={isActive}
      />

      {/* Всплывающая подсказка */}
      <StepBubble
        step={currentStepConfig}
        isActive={isActive}
        onPrimaryAction={handlePrimaryAction}
        onSecondaryAction={handleSecondaryAction}
        onClose={stopOnboarding}
        stepNumber={currentStep + 1}
        totalSteps={totalSteps}
      />

      {/* Боковая панель с прогрессом */}
      <SidePanel
        isActive={isActive}
        currentStep={currentStep}
        completedSteps={completedSteps}
        skippedSteps={skippedSteps}
        progress={progress}
        onClose={stopOnboarding}
      />
    </>
  );
}
