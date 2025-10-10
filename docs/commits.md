# Commit History

## da319b7 - feat: добавлена загрузка креативов в формы создания кампаний и триггеров
- **Кампании (шаг 5)**: динамическая загрузка креатива в зависимости от канала
  - SMS: только текст с лимитом 160 символов + счетчик
  - Email/Push: загрузка файла (JPG, PNG, PDF до 5MB) + текстовое поле
- **Триггеры (Scenario Builder)**: настройка нод Email/SMS/Push
  - Email: загрузка баннера + текст + выбор шаблона оформления
  - SMS: текст с лимитом 160 символов + счетчик
  - Push: загрузка иконки + заголовок + текст
- Drag & drop зоны с визуальной индикацией

## bde8e9e - feat: добавлена загрузка креативов для Email/Push в A/B калькуляторе
- **SMS канал**: только текстовое поле с лимитом 160 символов + счетчик
- **Email/Push каналы**: загрузка креатива (JPG, PNG, PDF до 5MB) + текстовое поле
- Динамическое переключение UI в зависимости от выбранных каналов на шаге 4
- Drag & drop зона с визуальной индикацией загруженного файла
- Работает для обоих вариантов A и B

## 20df3bc - refactor: заменены текстовые поля на селекты и чекбоксы в A/B калькуляторе
- **Вариант A и B**: Бонус и Оффер теперь выпадающие списки вместо текстовых полей
- Бонус: 9 готовых опций (10%/20% кэшбэк, 50%/100% на депозит, 50/100 фриспинов, €10/€25/€50)
- Оффер: 6 опций вейджера (x1/x3/x5/x10, без вейджера) и сроков (3/7/14/30 дней)
- **Шаг 4**: Добавлены чекбоксы для выбора каналов (Email, SMS, Push) с иконками
- Улучшена валидация и UX - теперь проще и быстрее заполнять

## 7d53360 - fix: экранирован символ > в JSX для корректного билда
- Заменен 'LTV > €500' на 'LTV &gt; €500' в SelectItem компонента ABTestCalculator
- Исправлена ошибка TypeScript при билде Next.js (Unexpected token)

## 7939bce - docs: обновлен commits.md с информацией об A/B тесте

## 5a144d2 - feat: добавлен A/B тест калькулятор с ИИ предсказанием аплифта
- Создан компонент ABTestCalculator с 4-шаговым визардом
- Конфигурация варианта A и B: название, креатив, бонус, оффер
- Дополнительные параметры: сегмент, гео, тайминг, длительность, confidence
- ИИ симуляция предсказания с задержкой 2 секунды (predicted uplift, confidence interval, estimated revenue, required sample size)
- ИИ рекомендация и insights с мотивацией запустить тест
- Интегрирован в кампании (/campaigns) - кнопка на шаге 5 "Сообщение"
- Интегрирован в триггеры (/triggers) - кнопка в header
- Интегрирован в аналитику коммуникаций (/comm_analyz) - кнопка в header
- Красивый UI с градиентами purple-to-blue, multi-select inputs, progress bar

## db64c7e - feat: добавлены интерактивные подсказки (оверлеи) во все разделы
- Создан компонент TooltipOverlay с затемнением и подсветкой элементов
- Подсказки показываются автоматически при первом входе в раздел
- Каждый раздел имеет 4 шага с подсказками на конкретных элементах
- Анимации: fade-in, пульсация подсветки синим кольцом
- Навигация: Назад/Далее, счетчик шагов, кнопка закрыть
- localStorage хранит состояние для каждого раздела отдельно
- Добавлены data-tooltip атрибуты к ключевым элементам UI

## [latest] - feat: добавлен онбординг во все разделы сервиса
- Создан универсальный компонент SectionOnboarding
- Созданы конфиги онбординга для 8 разделов (analytics, segments, triggers, campaigns, players, bonuses, templates, audit)
- Добавлена кнопка "Как работать с разделом" на каждой странице
- Каждый раздел получил 4 шага обучения с иконками и цветами
- Никаких сложностей - простая модалка с прогресс-баром
- Онбординги объясняют назначение раздела и как с ним работать

## 589f496 - refactor: полностью переделан онбординг на простую модалку
- Удалены все сложные компоненты (HighlightMask, StepBubble, SidePanel, хуки, типы)
- Создан простой компонент SimpleOnboarding на базе shadcn/ui Dialog
- 5 шагов в модалке с прогресс-баром и цветовым кодированием
- Работает через простой state без localStorage
- Никаких гидратационных проблем - чистый client-side
- 164 новых строк вместо 1273 удаленных

## edcb468 - fix: удалены все вызовы localStorage из хука use-onboarding
- Убраны localStorage.setItem('onboarding-completed') из nextStep и skipStep
- Удален неиспользуемый импорт ONBOARDING_STORAGE_KEY
- Полностью устранена проблема гидратации React Error #418
- Онбординг теперь работает только в рамках сессии без персистентности

## 1e07cad - feat: добавлен интерактивный AI-онбординг с подсветкой элементов
- Реализован полнофункциональный AI-онбординг с 5 шагами (интеграция → настройка → аудит → цели → первое действие)
- Компоненты: HighlightMask (затемнение+подсветка), StepBubble (подсказки), SidePanel (прогресс)
- Цветовое кодирование: синий/фиолетовый/зелёный/оранжевый/золотой
- Умное позиционирование подсказок с адаптацией к границам экрана
- Отслеживание прогресса с круговым индикатором и сохранением в localStorage
- Хук useOnboarding для управления состоянием
- Автозапуск при первом визите + кнопка в меню пользователя
- Блокировка кликов вне подсвеченных элементов
- Анимации и пульсация подсветки
- Полная документация в src/components/onboarding/README.md

## 42eb59a - feat: добавлены модальные окна с детальной статистикой для кампаний, триггеров и шаблонов
- Добавлены модальные окна для просмотра детальной информации
- Реализована табличная навигация для каждого типа (кампании/триггеры/шаблоны) 
- Добавлен детальный просмотр истории сообщений на уровне пользователей
- Показ статуса доставки, устройства, геолокации для каждого сообщения
- Статистика по каналам, сегментам и временным периодам
- Воронка конверсии для триггеров
- История версий для шаблонов

## 92abb9d - fix: resolve TypeScript build error and improve onboarding navigation
- Fixed metric.value toString() type error by using String() conversion
- Added free navigation between onboarding steps
- Users can now click on any step to navigate without completing previous steps
- Added skip buttons and improved UX with hover states

## 0fbc4d7 - feat: add AI recommendations block to templates page
- Added AI recommendations with 3 priority levels and €793k/month potential
- Implement buttons create pre-filled scenarios in builder
- Added welcome-series, abandoned-cart, tournament-invite templates

## d6fe022 - feat: redesign gamification sections with retention audit
- Renamed 'Active Missions' to 'Improvement Checklist'
- Renamed 'Achievements' to 'Retention Improvements'
- Added retention audit functionality with €1,168,000/month lost revenue analysis
- Shows 5 critical areas for improvement with revenue potential

## 4f5ac89 - feat: implement AI-driven scenario prefilling from recommendations
- Created scenario templates for different recommendation types
- Added URL parameter processing in builder page
- Updated Dashboard recommendation buttons with detailed parameters
- Builder auto-loads and personalizes scenarios from AI recommendations

## 88b255a - fix: remove Retention Expert badge from Dashboard header
- Removed Level/XP card from top right corner  
- Simplified header layout

## 1bb2dde - feat: implement AI-powered features and gamification
- Completely redesigned Dashboard with AI recommendations and KPI tracking
- Added AI Recommendations section with filtering and prioritization
- Integrated gamification with progress bars, achievements, and missions
- Created communication assistant widget for message optimization
- Implemented chat assistant available across all pages
- Added multi-currency accounts in user profile with AI optimization tips

## d2f001d - feat: restore Templates section in navigation menu
- Restored Templates section in sidebar navigation
- Added LayoutGrid icon and menu item
- Links to /templates page
