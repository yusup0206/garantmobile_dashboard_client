# GarantMobile — панель продавца

Production-ready React-приложение панели продавца GarantMobile, собранное строго
по гайду **React + TypeScript + Tailwind CSS + Radix UI** (`REACT STARTER MINE.md`):
модульная структура, чистое разделение UI / логики / данных, переиспользуемые
компоненты.

## Стек

- **React 19 + TypeScript** (strict)
- **Vite** — сборка и dev-сервер
- **Tailwind CSS v4** (`@tailwindcss/vite`) + токены темы в `src/styles/theme.css`
- **Radix UI** — low-level primitives, обёрнутые в `components/ui`
- **React Router** — маршрутизация с защищёнными роутами
- **@tanstack/react-query** — server-state (заказы, аналитика)
- **Zustand** — client-state (авторизация, UI)
- **react-hook-form + zod** — формы и валидация
- **class-variance-authority / clsx / tailwind-merge** — варианты и классы
- **lucide-react** — иконки
- **Vitest + React Testing Library** — модульные и компонентные тесты

## Быстрый старт

```bash
npm install
cp .env.example .env    # при необходимости укажите VITE_API_BASE_URL
npm run dev
```

Данные подставляются из мок-слоя (`src/data/mock.ts`) — бэкенд не требуется.
Вход: любой логин/пароль (≥3 и ≥4 символов) + код с картинки. Кнопка «Заполнить»
подставляет демо-данные.

## Скрипты

```bash
npm run dev         # dev-сервер
npm run build       # tsc -b && vite build
npm run preview     # предпросмотр сборки
npm run typecheck   # tsc -b (проверка типов всего проекта)
npm run lint        # eslint
npm run format      # prettier --write
npm run test        # vitest run (одноразовый прогон)
npm run test:watch  # vitest в watch-режиме
```

Перед коммитом должны проходить `npm run typecheck`, `npm run lint`,
`npm run test` и `npm run build`.

## Структура

```txt
src/
  app/                 # входная сборка приложения
    App.tsx
    providers/         # AppProviders, QueryProvider
    router/            # routes.tsx, ProtectedRoute
  pages/               # страницы: index.tsx + ui/ + lib/ + types.ts
    Login/
    Dashboard/
    Orders/
    Catalog/
    Customers/
    Warranty/
    Marketing/
  components/
    ui/                # design system: Button, Input, Card, Badge, Dialog
    common/            # бизнес-компоненты: PageHeader, StatCard, StatusBadge,
                       # FilterTabs, EmptyState, LoadingState, ErrorState
  layouts/             # MainLayout (Sidebar + Topbar), AuthLayout
  services/            # API-слой по фичам: api, auth, orders, analytics,
                       # catalog, customers, warranty, marketing
  store/               # Zustand: auth.store, ui.store
  lib/                 # cn, format, storage
  config/              # env, navigation
  types/               # общие типы
  data/                # мок-данные (порт из словаря данных прототипа)
  styles/              # index.css, theme.css
  test/                # setup для Vitest
```

## Как это соответствует гайду

- **UI отдельно, логика отдельно, API отдельно.** Компоненты страниц лежат в
  `pages/<Page>/ui`, их логика/схемы — в `pages/<Page>/lib`; запросы никогда не
  вызываются напрямую из JSX — только через `services/*` и хуки React Query.
- **Radix через свои обёртки.** `components/ui/Dialog` оборачивает
  `@radix-ui/react-dialog`; страницы импортируют `@/components/ui/Dialog`.
- **cva для вариантов.** См. `components/ui/Button/button.variants.ts`.
- **Absolute imports** через alias `@` (`vite.config.ts` + `tsconfig.json`).
- **Server-state в React Query, client-state в Zustand** — не смешиваются.
- **loading / error / empty / success** есть на каждой странице с данными.
- **Формы** — `react-hook-form` + `zod` (`pages/Login`).
- **Повторяющийся UI вынесен в shared.** Табы-фильтры Orders / Catalog / Warranty /
  Marketing используют один `components/common/FilterTabs`.
- **Тесты** — helpers (`lib/format`), схема формы (`login.schema`), бизнес-логика
  страниц (`catalog`, `customers`) и компонент (`Button`).

## Подключение реального бэкенда

Мок-функции в `services/*/*.api.ts` используют `mockDelay(...)`. Замените их тело
на вызовы `apiClient<T>("/endpoint", { ... })` (`services/api/apiClient.ts`) и
задайте `VITE_API_BASE_URL` в `.env` — остальной код (хуки, страницы) менять не
нужно.

## Деплой на сервер

Приложение — статический SPA (Vite build), раздаётся любым веб-сервером. В репозитории
есть готовый `Dockerfile` (multi-stage: сборка на Node → раздача через nginx) и
`nginx.conf` c **history-fallback** (обязателен: без него прямые ссылки вроде
`/orders` и `/catalog?cat=phones` при обновлении страницы дают 404), gzip и кешированием
хешированных ассетов.

> ⚠️ Vite подставляет `VITE_*` переменные **на этапе сборки**, поэтому `VITE_API_BASE_URL`
> задаётся build-аргументом, а не runtime-переменной контейнера.

### Docker

```bash
docker build -t garantmobile-dashboard \
  --build-arg VITE_API_BASE_URL=https://api.garantmobile.tm .
docker run -d -p 8080:80 --name garantmobile garantmobile-dashboard
# http://localhost:8080  ·  health: http://localhost:8080/healthz
```

### docker compose

```bash
VITE_API_BASE_URL=https://api.garantmobile.tm docker compose up -d --build
```

### Без Docker (nginx на сервере)

```bash
npm ci
VITE_API_BASE_URL=https://api.garantmobile.tm npm run build
# скопировать содержимое dist/ в webroot и применить nginx.conf
# (ключевое правило — try_files $uri $uri/ /index.html;)
```

## CI

`.github/workflows/ci.yml` на каждый push в `main` и pull request прогоняет
`typecheck → lint → test → build`, затем собирает Docker-образ.

## Что реализовано

**25 экранов** — все пункты меню рабочие, с загрузкой данных через React Query и
полным набором состояний loading / error / empty / success. Сайдбар сгруппирован
по разделам (`config/navigation.ts`):

- **Обзор** — Дашборд (KPI, график выручки, топ товаров, последние заказы, период
  7/30/90 дней) · Аналитика (KPI, выручка по месяцам, разбивка по категориям).
- **Продажи** — Заказы · Предзаказы · Платежи · Доставка · Курьеры · Trade-in.
- **Каталог** — Каталог · Товары · Категории · Бренды · Филиалы.
- **Клиенты** — Клиенты (поиск) · Отзывы · Чат поддержки (двухпанельный).
- **Маркетинг** — Маркетинг · Промокоды · Баннеры · Блог.
- **Сервис** — Гарантии · FAQ (аккордеон).
- **Система** — Сотрудники и роли · Уведомления.
- **Вход** — форма `react-hook-form` + `zod` с капчей и защищёнными роутами.

Списочные экраны фильтруются через URL-состояние (`?status=` / `?cat=` / `?q=` /
`?type=`) и используют общий `components/common/FilterTabs`. Новые страницы
добавляются по тому же шаблону: `pages/<Page>/{index.tsx, ui/, lib/, types.ts}` +
сервис в `services/<feature>/` + мок в `data/`.
