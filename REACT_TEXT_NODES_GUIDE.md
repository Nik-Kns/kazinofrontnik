# Руководство по предотвращению React ошибок #418/#185

## Проблема
React ошибки #418 и #185 возникают из-за неправильного рендеринга смешанных текстовых узлов и JSX элементов.

## Причины возникновения

### ❌ НЕПРАВИЛЬНО:
```jsx
// Смешанный текст и переменные
<div>Всего: {count} элементов</div>

// Условный рендер без обертки  
<div>{user.name} {user.isOnline && 'онлайн'}</div>

// Список с смешанным контентом
<li>• {item.name}: {item.value}</li>

// Tooltip с br тегом
<TooltipContent>
  Первая строка<br />
  Вторая строка
</TooltipContent>
```

### ✅ ПРАВИЛЬНО:
```jsx
// Обернуть в span
<div><span>Всего: {count} элементов</span></div>

// Обернуть каждый фрагмент
<div><span>{user.name}</span> <span>{user.isOnline && 'онлайн'}</span></div>

// Обернуть содержимое списка
<li><span>• {item.name}: {item.value}</span></li>

// Использовать отдельные элементы
<TooltipContent>
  <div>
    <p>Первая строка</p>
    <p>Вторая строка</p>
  </div>
</TooltipContent>
```

## Готовые компоненты-решения

Используйте безопасные компоненты из `/src/components/ui/safe-text.tsx`:

```jsx
import { SafeText, SafeDescription, SafeList, SafeTooltipContent } from '@/components/ui/safe-text';

// Вместо смешанного текста
<SafeText>Всего: {count} элементов</SafeText>

// Для описаний
<SafeDescription>Проект: {project} • Статус: {status}</SafeDescription>

// Для списков
<SafeList 
  items={segments}
  render={(segment, idx) => `• ${segment.name}: ${segment.count}`}
/>

// Для tooltip
<SafeTooltipContent 
  lines={[
    'Первая строка',
    'Вторая строка'
  ]}
/>
```

## Правила для разработки

### 1. ВСЕГДА оборачивайте смешанный контент
```jsx
// ❌ НЕ ДЕЛАЙТЕ ТАК
<CardDescription>
  {segment ? `Сегмент: ${segment}` : 'Все сегменты'} • {count} метрик
</CardDescription>

// ✅ ДЕЛАЙТЕ ТАК  
<CardDescription>
  <span>{segment ? `Сегмент: ${segment}` : 'Все сегменты'} • {count} метрик</span>
</CardDescription>
```

### 2. Избегайте br тегов в контенте
```jsx
// ❌ НЕ ДЕЛАЙТЕ ТАК
<p>Первая строка<br />Вторая строка</p>

// ✅ ДЕЛАЙТЕ ТАК
<div>
  <p>Первая строка</p>
  <p>Вторая строка</p>
</div>
```

### 3. Проверяйте map функции
```jsx
// ❌ НЕ ДЕЛАЙТЕ ТАК
{items.map(item => (
  <li key={item.id}>
    • {item.name}: {item.value}
  </li>
))}

// ✅ ДЕЛАЙТЕ ТАК
{items.map(item => (
  <li key={item.id}>
    <span>• {item.name}: {item.value}</span>
  </li>
))}
```

### 4. Безопасная работа с условным рендерингом
```jsx
// ❌ НЕ ДЕЛАЙТЕ ТАК
<div>
  {user.name} {user.isActive && 'активен'} {user.role}
</div>

// ✅ ДЕЛАЙТЕ ТАК
<div>
  <span>{user.name}</span>
  {user.isActive && <span> активен</span>}
  <span> {user.role}</span>
</div>
```

## Checklist для code review

- [ ] Все смешанные текст + переменные обернуты в span/div
- [ ] Нет br тегов в Tooltip/Alert/Card контенте
- [ ] Все map функции возвращают обернутый контент
- [ ] Условные рендеры обернуты в элементы
- [ ] Используются SafeText компоненты где возможно

## Автоматическая проверка

Добавьте в ESLint правило:
```js
// .eslintrc.js
rules: {
  'react/jsx-no-leaked-render': ['error', { 'validStrategies': ['ternary'] }],
  'react/no-unescaped-entities': 'error'
}
```

## Исправленные места в проекте

Всего исправлено **20 проблемных мест** в файлах:
- `/src/components/dashboard/scenarios-table.tsx`
- `/src/components/analytics/segment-metrics-table.tsx` 
- `/src/components/dashboard/full-metrics-dashboard.tsx`
- `/src/app/analytics/campaigns/page.tsx`
- `/src/app/onboarding/page.tsx`

Все проблемы устранены путем обертывания в `<span>` теги.