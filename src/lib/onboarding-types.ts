// Типы и константы для AI-онбординга

export type OnboardingStep =
  | 'integration'
  | 'setup'
  | 'audit'
  | 'goals'
  | 'first-action';

export interface OnboardingStepConfig {
  id: OnboardingStep;
  title: string;
  description: string;
  color: string;
  targetSelector?: string; // CSS селектор элемента для подсветки
  position?: 'top' | 'bottom' | 'left' | 'right' | 'center';
  buttons: {
    primary?: {
      label: string;
      action: 'next' | 'navigate' | 'auto-configure' | 'create';
      href?: string;
    };
    secondary?: {
      label: string;
      action: 'skip' | 'back';
    };
  };
  completionMessage?: string;
  checkCompletion?: () => boolean;
}

export interface OnboardingState {
  isActive: boolean;
  currentStep: number;
  completedSteps: OnboardingStep[];
  skippedSteps: OnboardingStep[];
  progress: number;
}

// Конфигурация всех шагов онбординга
export const ONBOARDING_STEPS: OnboardingStepConfig[] = [
  {
    id: 'integration',
    title: 'Интеграция данных',
    description: 'Начнем с интеграции. Подключите вашу CRM или админку казино, чтобы AiGamingBot мог анализировать игроков, кампании и бонусы.',
    color: '#2962FF', // синий
    targetSelector: '[data-onboarding="integration"]',
    position: 'right',
    buttons: {
      primary: {
        label: '🔗 Перейти к интеграции',
        action: 'navigate',
        href: '/settings/integrations'
      },
      secondary: {
        label: 'Пропустить',
        action: 'skip'
      }
    },
    completionMessage: 'Отлично, данные загружены. Теперь посмотрим, как выглядит ваш проект изнутри.'
  },
  {
    id: 'setup',
    title: 'Настройка проекта',
    description: 'Укажите базовые настройки проекта: валюту, регионы, и структуру базы игроков — это поможет AI корректно считать метрики.',
    color: '#9C27B0', // фиолетовый
    targetSelector: '[data-onboarding="setup"]',
    position: 'bottom',
    buttons: {
      primary: {
        label: '⚙️ Настроить',
        action: 'navigate',
        href: '/settings/project'
      },
      secondary: {
        label: 'Назад',
        action: 'back'
      }
    },
    completionMessage: 'Теперь AI может анализировать вашу базу и прогнозировать ключевые показатели.'
  },
  {
    id: 'audit',
    title: 'AI-аудит данных',
    description: 'AI сейчас выполнит аудит ваших метрик и покажет, где есть зоны роста — в удержании, бонусах или коммуникациях.',
    color: '#4CAF50', // зелёный
    targetSelector: '[data-onboarding="audit"]',
    position: 'bottom',
    buttons: {
      primary: {
        label: '🔍 Провести аудит',
        action: 'next'
      },
      secondary: {
        label: 'Пропустить',
        action: 'skip'
      }
    },
    completionMessage: 'Аудит готов! У вас высокий потенциал в бонусных кампаниях. Хотите, я помогу создать первый бонус?'
  },
  {
    id: 'goals',
    title: 'Цели компании',
    description: 'Чтобы AI подбирал рекомендации под ваш бизнес, задайте цели: например, Retention Rate, ROMI, Deposit Uplift.',
    color: '#FF9800', // оранжевый
    targetSelector: '[data-onboarding="goals"]',
    position: 'top',
    buttons: {
      primary: {
        label: '🎯 Задать цели',
        action: 'navigate',
        href: '/settings/goals'
      },
      secondary: {
        label: 'Пропустить',
        action: 'skip'
      }
    },
    completionMessage: 'Теперь система будет сравнивать все ваши кампании и бонусы с этими целями.'
  },
  {
    id: 'first-action',
    title: 'Создание первого бонуса',
    description: 'AI подготовил первую рекомендацию. Создадим бонус, который улучшит Retention Rate на +18%.',
    color: '#FFD700', // золотой
    targetSelector: '[data-onboarding="create-bonus"]',
    position: 'left',
    buttons: {
      primary: {
        label: '✨ Создать бонус',
        action: 'create'
      },
      secondary: {
        label: 'Завершить позже',
        action: 'skip'
      }
    },
    completionMessage: 'Отлично! Вы создали первый бонус. Теперь AI начнет собирать аналитику и подскажет, как улучшить результаты.'
  }
];

// Ключ для localStorage
export const ONBOARDING_STORAGE_KEY = 'aigaming-onboarding-state';

// Начальное состояние
export const INITIAL_ONBOARDING_STATE: OnboardingState = {
  isActive: false,
  currentStep: 0,
  completedSteps: [],
  skippedSteps: [],
  progress: 0
};
