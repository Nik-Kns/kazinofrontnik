'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import type { OnboardingState, OnboardingStep } from '@/lib/onboarding-types';
import {
  INITIAL_ONBOARDING_STATE,
  ONBOARDING_STORAGE_KEY,
  ONBOARDING_STEPS
} from '@/lib/onboarding-types';

/**
 * Хук для управления состоянием AI-онбординга
 */
export function useOnboarding() {
  const router = useRouter();
  const [state, setState] = useState<OnboardingState>(INITIAL_ONBOARDING_STATE);
  const [isMounted, setIsMounted] = useState(false);

  // Просто устанавливаем флаг монтирования
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Запустить онбординг
  const startOnboarding = useCallback(() => {
    console.log('🚀 Starting onboarding...');
    setState({
      ...INITIAL_ONBOARDING_STATE,
      isActive: true
    });
    console.log('✅ State updated to active');
  }, []);

  // Остановить онбординг
  const stopOnboarding = useCallback(() => {
    setState(INITIAL_ONBOARDING_STATE); // Полный сброс
  }, []);

  // Следующий шаг
  const nextStep = useCallback(() => {
    setState(prev => {
      const nextStepIndex = prev.currentStep + 1;
      const isLastStep = nextStepIndex >= ONBOARDING_STEPS.length;

      // Отмечаем текущий шаг как завершённый
      const currentStepId = ONBOARDING_STEPS[prev.currentStep].id;
      const newCompletedSteps = [...prev.completedSteps];
      if (!newCompletedSteps.includes(currentStepId)) {
        newCompletedSteps.push(currentStepId);
      }

      const newProgress = (newCompletedSteps.length / ONBOARDING_STEPS.length) * 100;

      if (isLastStep) {
        // Завершаем онбординг
        localStorage.setItem('onboarding-completed', 'true');
        return {
          ...prev,
          isActive: false,
          completedSteps: newCompletedSteps,
          progress: 100
        };
      }

      return {
        ...prev,
        currentStep: nextStepIndex,
        completedSteps: newCompletedSteps,
        progress: newProgress
      };
    });
  }, []);

  // Предыдущий шаг
  const prevStep = useCallback(() => {
    setState(prev => {
      if (prev.currentStep === 0) return prev;

      return {
        ...prev,
        currentStep: prev.currentStep - 1
      };
    });
  }, []);

  // Пропустить шаг
  const skipStep = useCallback(() => {
    setState(prev => {
      const currentStepId = ONBOARDING_STEPS[prev.currentStep].id;
      const newSkippedSteps = [...prev.skippedSteps];

      if (!newSkippedSteps.includes(currentStepId)) {
        newSkippedSteps.push(currentStepId);
      }

      const nextStepIndex = prev.currentStep + 1;
      const isLastStep = nextStepIndex >= ONBOARDING_STEPS.length;

      if (isLastStep) {
        localStorage.setItem('onboarding-completed', 'true');
        return {
          ...prev,
          isActive: false,
          skippedSteps: newSkippedSteps
        };
      }

      return {
        ...prev,
        currentStep: nextStepIndex,
        skippedSteps: newSkippedSteps
      };
    });
  }, []);

  // Отметить шаг как завершённый
  const completeStep = useCallback((stepId: OnboardingStep) => {
    setState(prev => {
      const newCompletedSteps = [...prev.completedSteps];
      if (!newCompletedSteps.includes(stepId)) {
        newCompletedSteps.push(stepId);
      }

      const newProgress = (newCompletedSteps.length / ONBOARDING_STEPS.length) * 100;

      return {
        ...prev,
        completedSteps: newCompletedSteps,
        progress: newProgress
      };
    });
  }, []);

  // Перейти к определённому шагу
  const goToStep = useCallback((stepIndex: number) => {
    if (stepIndex < 0 || stepIndex >= ONBOARDING_STEPS.length) return;

    setState(prev => ({
      ...prev,
      currentStep: stepIndex
    }));
  }, []);

  // Обработка действия кнопки
  const handlePrimaryAction = useCallback(() => {
    const currentStepConfig = ONBOARDING_STEPS[state.currentStep];
    const action = currentStepConfig.buttons.primary?.action;
    const href = currentStepConfig.buttons.primary?.href;

    switch (action) {
      case 'navigate':
        if (href) {
          router.push(href);
          // Даём время на навигацию, затем переходим к следующему шагу
          setTimeout(() => nextStep(), 500);
        }
        break;

      case 'next':
        nextStep();
        break;

      case 'auto-configure':
        // TODO: Здесь можно добавить автоматическую настройку
        nextStep();
        break;

      case 'create':
        // TODO: Здесь можно добавить создание бонуса
        nextStep();
        break;

      default:
        nextStep();
    }
  }, [state.currentStep, nextStep, router]);

  const handleSecondaryAction = useCallback(() => {
    const currentStepConfig = ONBOARDING_STEPS[state.currentStep];
    const action = currentStepConfig.buttons.secondary?.action;

    switch (action) {
      case 'skip':
        skipStep();
        break;

      case 'back':
        prevStep();
        break;

      default:
        break;
    }
  }, [state.currentStep, skipStep, prevStep]);

  return {
    // Состояние
    isActive: state.isActive,
    currentStep: state.currentStep,
    currentStepConfig: ONBOARDING_STEPS[state.currentStep],
    completedSteps: state.completedSteps,
    skippedSteps: state.skippedSteps,
    progress: state.progress,
    totalSteps: ONBOARDING_STEPS.length,

    // Действия
    startOnboarding,
    stopOnboarding,
    nextStep,
    prevStep,
    skipStep,
    completeStep,
    goToStep,
    handlePrimaryAction,
    handleSecondaryAction
  };
}
