### Developer Handbook — frontkaz

Краткое руководство по архитектуре и разработке приложения.

---

#### Стек

- Next.js 15 (app router)
- TypeScript
- TailwindCSS (+ shadcn/ui)
- Recharts
- date-fns
- Genkit (AI flows), Firebase SDK

Скрипты:

```json
{ "dev": "node scripts/dev.js", "build": "next build", "start": "next start", "lint": "next lint", "typecheck": "tsc --noEmit" }
```

---

#### Структура каталогов (основное)

- `src/app/` — страницы и layout'ы (Next.js App Router)
  - `app/page.tsx` — главный «Центр аналитики казино"
  - `app/analytics/page.tsx` — страница расширенной аналитики
  - вложенные разделы: `players`, `reports`, `segments`, `settings`, `templates`

- `src/components/` — UI и бизнес-компоненты
  - `components/dashboard/*` — карточки метрик, дашборды, KPI Summary
  - `components/analytics/*` — аналитические таблицы и графики
  - `components/ui/*` — переиспользуемые элементы (шаблоны shadcn/ui)

- `src/lib/` — данные и утилиты
  - `retention-metrics-data.ts` — «источник правды» для 25+ ключевых метрик
  - `mock-data.ts` — демо-данные для карточек/графиков
  - `types.ts` — типы проекта
  - `utils.ts` — общие утилиты

- `src/ai/` — Genkit и AI-потоки

---

#### Ключевые компоненты метрик

- `FullMetricsDashboard` (`src/components/dashboard/full-metrics-dashboard.tsx`)
  - содержит фильтр периода, список критических метрик, ТОП‑метрики и табы по категориям
  - ТОП-метрики формируются из `retentionMetrics`: см. массив `topMetrics`

- `retentionMetrics` (`src/lib/retention-metrics-data.ts`)
  - массив объектов `RetentionMetric`
  - каждая метрика: `id`, `name`, `description`, `value`, `unit`, `category`, `frequency`, `targetValue?`, `trend?`, `trendValue?`
  - здесь добавлены GGR, NGR и переименован `Average Deposit Amount` -> `AVG DEP`

- `KPISummary` (`src/components/dashboard/kpi-summary.tsx`)
  - настраиваемая таблица KPI с выбором метрик, статусами и целями

---

#### Хедер: бренд и профиль

Файл: `src/components/layout/main-layout.tsx`

- В правом верхнем углу добавлены:
  - Чекбокс "Бренд" (`Checkbox`) — включает/выключает выбор бренда
  - Селектор бренда (`Select`) — значения: `AIGAMING.BOT`, `LuckyWheel`, `GoldenPlay` с логотипами
  - Выбор сохраняется в `localStorage` ключами `brandSelection`, `brandEnabled`
  - Рядом — иконка уведомлений и аватар профиля с меню аккаунта

Как изменить список брендов:
В `main-layout.tsx` обновить массив `BRAND_OPTIONS` (id, label, logo). Логотип выбранного бренда отображается в триггере селектора.

---

#### Как добавить/изменить метрику

1) Добавьте/измените объект в `src/lib/retention-metrics-data.ts`
2) При необходимости включите её в `topMetrics` (в `full-metrics-dashboard.tsx`)
3) Если метрика участвует в других местах (таблицы, графики), обновите соответствующие компоненты

Шаблон метрики:

```ts
{
  id: 'metric_id',
  name: 'Display Name',
  description: 'Описание',
  value: 0,
  unit: '€' | '%' | 'times' | 'min' | 'hours' | '',
  category: 'revenue' | 'retention' | 'conversion' | 'engagement' | 'satisfaction',
  frequency: 'daily' | 'weekly' | 'monthly',
  targetValue?: number | string,
  trend?: 'up' | 'down' | 'stable',
  trendValue?: string,
}
```

---

#### Код-стайл (кратко)

- Читаемые имена, явные типы в публичных API, ранние возвраты
- Не рефакторить несвязанный код в одном PR
- После любой правки: `npm run typecheck` и `npm run lint`

---

#### Локальная разработка

```bash
npm install
npm run dev
```

Запуск AI дев-сервера (по необходимости):

```bash
npm run genkit:dev
```

---

#### Деплой (набросок)

Сборка:

```bash
npm run build
```

Затем запуск через выбранную среду (Vercel/Node). Детали дополним при подключении CI/CD.

---

#### Вопросы к владельцу

1) Финальное определение формул GGR/NGR и источников данных для прод-окружения?
2) Какие метрики должны быть в «ТОП-4» по умолчанию на главной?
3) Предпочитаемая локализация значений валюты (символ, разделители)?
4) Нужны ли экспорт и API для внешних BI (JSON/CSV/Parquet)?
5) Хранение конфигов целевых значений (targetValue): в коде или в БД?


