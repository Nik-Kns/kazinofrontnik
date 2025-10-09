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
import { ArrowRight, ArrowLeft, X } from 'lucide-react';

export interface OnboardingStep {
  title: string;
  description: string;
  icon: string;
  color: string;
}

interface SectionOnboardingProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  steps: OnboardingStep[];
  sectionName: string;
  onStartDetailedTour?: () => void; // Коллбек для запуска детального тура с тултипами
}

export function SectionOnboarding({
  open,
  onOpenChange,
  steps,
  sectionName,
  onStartDetailedTour
}: SectionOnboardingProps) {
  const [currentStep, setCurrentStep] = useState(0);

  const currentStepData = steps[currentStep];
  const progress = ((currentStep + 1) / steps.length) * 100;
  const isFirstStep = currentStep === 0;
  const isLastStep = currentStep === steps.length - 1;

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
            className="w-12 h-12 rounded-full flex items-center justify-center mb-4 text-2xl"
            style={{ backgroundColor: currentStepData.color + '20' }}
          >
            {currentStepData.icon}
          </div>
          <DialogTitle className="text-2xl">{currentStepData.title}</DialogTitle>
          <DialogDescription className="text-base pt-2">
            {currentStepData.description}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>Шаг {currentStep + 1} из {steps.length}</span>
              <span>{Math.round(progress)}%</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>

          <div className="flex gap-2">
            {steps.map((step, index) => (
              <button
                key={index}
                onClick={() => setCurrentStep(index)}
                className="flex-1 h-1 rounded-full transition-all"
                style={{
                  backgroundColor: index <= currentStep
                    ? step.color
                    : '#e5e7eb'
                }}
              />
            ))}
          </div>
        </div>

        <DialogFooter className="flex-col gap-2 sm:gap-2">
          <div className="flex gap-2 w-full">
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
              {isLastStep ? 'Закрыть' : 'Далее'}
              {!isLastStep && <ArrowRight className="h-4 w-4 ml-2" />}
            </Button>
          </div>
          {onStartDetailedTour && (
            <Button
              variant="outline"
              onClick={() => {
                onOpenChange(false);
                setTimeout(() => onStartDetailedTour(), 300);
              }}
              className="w-full"
            >
              🎯 Запустить детальный тур по интерфейсу
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
