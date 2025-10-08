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
    title: '👋 Добро пожаловать в AiGaming.Bot!',
    description: 'Привет! Я ваш AI-ассистент. Давайте быстро пройдёмся по основным возможностям платформы. Готовы начать?',
    color: '#2962FF', // синий
    position: 'center',
    buttons: {
      primary: {
        label: '🚀 Начать тур',
        action: 'next'
      },
      secondary: {
        label: 'Пропустить',
        action: 'skip'
      }
    },
    completionMessage: 'Отлично! Давайте посмотрим что здесь есть.'
  },
  {
    id: 'setup',
    title: '📊 Командный центр',
    description: 'Здесь вы видите главные метрики вашего казино: Retention Rate, GGR, ARPU и другие. AI анализирует данные в реальном времени и даёт рекомендации.',
    color: '#9C27B0', // фиолетовый
    position: 'center',
    buttons: {
      primary: {
        label: 'Далее →',
        action: 'next'
      },
      secondary: {
        label: '← Назад',
        action: 'back'
      }
    },
    completionMessage: 'Отлично! Идём дальше.'
  },
  {
    id: 'audit',
    title: '🎯 Сегментация игроков',
    description: 'AI автоматически разбивает вашу базу на сегменты: VIP, активные, спящие, риск оттока. Вы можете создавать таргетированные кампании для каждого сегмента.',
    color: '#4CAF50', // зелёный
    position: 'center',
    buttons: {
      primary: {
        label: 'Далее →',
        action: 'next'
      },
      secondary: {
        label: '← Назад',
        action: 'back'
      }
    },
    completionMessage: 'Супер! Продолжаем.'
  },
  {
    id: 'goals',
    title: '🎁 Умные бонусы',
    description: 'AI помогает создавать бонусы которые реально работают: анализирует completion rate, ROI, риск абьюза. Показывает какой бонус даст максимальную отдачу.',
    color: '#FF9800', // оранжевый
    position: 'center',
    buttons: {
      primary: {
        label: 'Далее →',
        action: 'next'
      },
      secondary: {
        label: '← Назад',
        action: 'back'
      }
    },
    completionMessage: 'Отлично! Последний шаг.'
  },
  {
    id: 'first-action',
    title: '🤖 AI-помощник',
    description: 'В любой момент можете спросить AI что-то через чат внизу справа. Он поможет разобраться с метриками, создать кампанию или найти проблемных игроков. Удачи!',
    color: '#FFD700', // золотой
    position: 'center',
    buttons: {
      primary: {
        label: '✅ Завершить',
        action: 'next'
      },
      secondary: {
        label: '← Назад',
        action: 'back'
      }
    },
    completionMessage: 'Отлично! Теперь вы знаете основы. Приятной работы! 🚀'
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
