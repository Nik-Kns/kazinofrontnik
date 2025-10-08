# AI Онбординг - Интерактивная система подсказок

Полнофункциональная система онбординга с AI-подсказками, подсветкой элементов и отслеживанием прогресса.

## 🎯 Возможности

- ✨ **Интерактивные подсказки** с умным позиционированием
- 🎨 **Подсветка элементов** с затемнением остального интерфейса
- 📊 **Отслеживание прогресса** с сохранением в localStorage
- 🎨 **Цветовое кодирование** по этапам
- 🔄 **Навигация по шагам** с возможностью пропуска
- 💾 **Автоматическое сохранение** состояния
- 🎯 **Боковая панель** с визуализацией прогресса

## 📦 Компоненты

### Основные файлы

```
src/
├── components/onboarding/
│   ├── onboarding-overlay.tsx    # Главный компонент
│   ├── highlight-mask.tsx        # Затемнение с подсветкой
│   ├── step-bubble.tsx           # Всплывающие подсказки
│   └── side-panel.tsx            # Боковая панель прогресса
├── hooks/
│   └── use-onboarding.ts         # Хук управления состоянием
└── lib/
    └── onboarding-types.ts       # Типы и конфигурация шагов
```

## 🚀 Использование

### 1. Добавьте data-атрибуты к элементам

Добавьте `data-onboarding` атрибуты к элементам, которые хотите подсветить:

```tsx
// Пример для кнопки интеграции
<Button data-onboarding="integration">
  Настроить интеграцию
</Button>

// Пример для раздела настроек
<Card data-onboarding="setup">
  <CardHeader>Базовые настройки</CardHeader>
  ...
</Card>

// Пример для кнопки аудита
<Button data-onboarding="audit">
  Провести аудит
</Button>

// Пример для раздела целей
<div data-onboarding="goals">
  Цели компании
</div>

// Пример для кнопки создания бонуса
<Button data-onboarding="create-bonus">
  Создать бонус
</Button>
```

### 2. Запуск онбординга

Онбординг запускается автоматически при первом визите. Для повторного запуска:

```tsx
import { useOnboarding } from '@/hooks/use-onboarding';

function MyComponent() {
  const { startOnboarding } = useOnboarding();

  return (
    <Button onClick={startOnboarding}>
      Показать онбординг
    </Button>
  );
}
```

### 3. Управление состоянием

```tsx
const {
  isActive,           // Активен ли онбординг
  currentStep,        // Текущий шаг (0-4)
  completedSteps,     // Завершённые шаги
  progress,           // Прогресс в процентах (0-100)

  startOnboarding,    // Запустить онбординг
  stopOnboarding,     // Остановить онбординг
  nextStep,           // Следующий шаг
  skipStep,           // Пропустить шаг
} = useOnboarding();
```

## 📝 Конфигурация шагов

Отредактируйте `src/lib/onboarding-types.ts` для настройки шагов:

```typescript
export const ONBOARDING_STEPS: OnboardingStepConfig[] = [
  {
    id: 'integration',
    title: 'Интеграция данных',
    description: 'Начнем с интеграции...',
    color: '#2962FF',                    // Цвет подсветки
    targetSelector: '[data-onboarding="integration"]',  // CSS селектор
    position: 'right',                   // Позиция подсказки
    buttons: {
      primary: {
        label: '🔗 Перейти к интеграции',
        action: 'navigate',
        href: '/settings/integrations'   // Куда переходить
      },
      secondary: {
        label: 'Пропустить',
        action: 'skip'
      }
    },
    completionMessage: 'Отлично, данные загружены!'
  },
  // ... другие шаги
];
```

## 🎨 Кастомизация

### Изменение цветов

Каждый шаг имеет свой цвет:

- **Интеграция**: `#2962FF` (синий)
- **Настройка**: `#9C27B0` (фиолетовый)
- **Аудит**: `#4CAF50` (зелёный)
- **Цели**: `#FF9800` (оранжевый)
- **Первое действие**: `#FFD700` (золотой)

### Позиционирование подсказок

Доступные позиции: `'top' | 'bottom' | 'left' | 'right' | 'center'`

## 🔧 API

### useOnboarding()

```typescript
interface UseOnboardingReturn {
  // Состояние
  isActive: boolean;
  currentStep: number;
  currentStepConfig: OnboardingStepConfig;
  completedSteps: OnboardingStep[];
  skippedSteps: OnboardingStep[];
  progress: number;
  totalSteps: number;

  // Действия
  startOnboarding: () => void;
  stopOnboarding: () => void;
  nextStep: () => void;
  prevStep: () => void;
  skipStep: () => void;
  completeStep: (stepId: OnboardingStep) => void;
  goToStep: (stepIndex: number) => void;
  handlePrimaryAction: () => void;
  handleSecondaryAction: () => void;
}
```

## 💾 Хранение данных

Онбординг сохраняет состояние в `localStorage`:

```javascript
// Ключ для состояния
'aigaming-onboarding-state'

// Флаг завершения
'onboarding-completed'
```

Для сброса онбординга:

```javascript
localStorage.removeItem('aigaming-onboarding-state');
localStorage.removeItem('onboarding-completed');
```

## 🎯 Примеры использования

### Простой запуск

```tsx
<Button onClick={() => useOnboarding().startOnboarding()}>
  Начать тур
</Button>
```

### Условный запуск

```tsx
useEffect(() => {
  const hasSeenOnboarding = localStorage.getItem('onboarding-completed');
  if (!hasSeenOnboarding) {
    startOnboarding();
  }
}, []);
```

### Отслеживание прогресса

```tsx
const { progress, currentStep, totalSteps } = useOnboarding();

return (
  <div>
    <p>Шаг {currentStep + 1} из {totalSteps}</p>
    <Progress value={progress} />
  </div>
);
```

## 🚨 Важные замечания

1. **data-атрибуты**: Убедитесь, что все `targetSelector` соответствуют существующим элементам
2. **Z-index**: Онбординг использует `z-index: 9998-9999`
3. **localStorage**: Требуется для сохранения прогресса
4. **Навигация**: При использовании `action: 'navigate'` убедитесь, что маршруты существуют

## 🎓 Workflow

1. Пользователь заходит впервые → онбординг запускается автоматически
2. Подсвечивается элемент → показывается подсказка
3. Пользователь нажимает кнопку → переход к следующему шагу
4. После всех шагов → сохраняется флаг завершения
5. Повторный вызов → через меню "AI Онбординг"

## 📱 Адаптивность

Компоненты адаптируются под размер экрана:
- Подсказки автоматически корректируют позицию при выходе за границы
- Боковая панель скрывается на маленьких экранах (опционально)
- Всплывающие окна масштабируются по ширине устройства
