# Commit History

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
