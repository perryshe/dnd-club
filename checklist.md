# Аудит и план работ — d21-club.ru

> Единый чек-лист. Каждая задача — законченный функционал для деплоя и теста.
> Ветка: `audit` | Обновлён: 27.06.2026

---

## Шаг 1 — 🔴 Безопасность: секреты и entrypoint

| # | Задача | Описание | Файлы | Готовность |
|---|---|---|---|---|
| 1 | **Вынести секреты в `.env`** | `POSTGRES_PASSWORD`, `NEXTAUTH_SECRET`, `ADMIN_PASSWORD` из docker-compose в `.env.prod` + сгенерировать новые значения | `docker-compose.yml`, `docker-compose.prod.yml`, `.env.prod` | ⬜ |
| 2 | **Исправить entrypoint скрипты** | Убрать seed из book-club (перезаписывает роли при рестарте), добавить `prisma generate` в book-club-2 (stale client) | `apps/book-club/docker-entrypoint.sh`, `apps/book-club-2/docker-entrypoint.sh` | ⬜ |

**Зависимости:** нет

---

## Шаг 2 — 🔴 Безопасность: CORS, CSP, headers, uploads

| # | Задача | Описание | Файлы | Готовность |
|---|---|---|---|---|
| 3 | **Настроить CORS, CSP и security headers** | CORS tic-tac: `AllowAnyOrigin` → `WithOrigins("https://d21-club.ru")`, CSP `https:` → конкретные домены, добавить HSTS, X-Frame-Options, X-Content-Type-Options | `apps/tic-tac/tic_tac/Program.cs:99-102`, `dnd-club-nginx.conf` | ⬜ |
| 4 | **Добавить лимиты: upload + rate-limit** | Проверка размера файлов при загрузке, cleanup устаревших записей в rate-limit (memory leak) | `apps/dnd-club/src/lib/admin-actions.ts:35`, `apps/dnd-club/src/lib/rate-limit.ts` | ⬜ |

**Зависимости:** нет

---

## Шаг 3 — 📊 Аналитика (Яндекс.Метрика)

| # | Задача | Описание | Файлы | Готовность |
|---|---|---|---|---|
| 5 | **Яндекс.Метрика в Next.js приложения** | Компонент Analytics + layout.tsx для dnd-club, book-club, book-club-2 + env `NEXT_PUBLIC_YM_COUNTER` + CSP под Метрику | `apps/*/src/components/Analytics.tsx`, `apps/*/src/app/layout.tsx`, `docker-compose.prod.yml`, `dnd-club-nginx.conf` | ⬜ |
| 6 | **Яндекс.Метрика на статических страницах** | Внедрить счётчик в index.html english, tor.html, quest-app, tic-tac | `apps/english/index.html`, `apps/english/tor.html`, `apps/Quest/quest-app/public/index.html`, `apps/tic-tac/tic_tac/wwwroot/index.html` | ⬜ |

**Зависимости:** Шаг 1 (env), Шаг 2 (CSP)

---

## Шаг 4 — 🗄️🔄 Разделение БД + Prisma миграции

| # | Задача | Описание | Файлы | Готовность |
|---|---|---|---|---|
| 7 | **Разделить базы данных сервисов** | Создать БД `bookclub_v1`, `bookclub_v2`, перенаправить book-club и book-club-2 на свои БД, добавить `sadmin` в enum book-club, синхронизировать dev/prod | `postgres/init.sql`, `docker-compose.prod.yml`, `docker-compose.yml`, `apps/book-club/prisma/schema.prisma` | ⬜ |
| 8 | **Перевести на Prisma миграции** | Сгенерировать `prisma migrate dev` для всех 3 Next.js app, CI: `db push` → `migrate deploy` | `apps/*/prisma/`, `.github/workflows/deploy-v2.yml:39-40` | ⬜ |

**Зависимости:** нет, но требует тестирования всех сервисов после деплоя

---

## Шаг 5 — 🛠 CI/CD

| # | Задача | Описание | Файлы | Готовность |
|---|---|---|---|---|
| 9 | **Улучшить CI/CD пайплайн** | Добавить lint + type-check в CI, заменить `git fetch --force` на `--ff-only`, добавить `pg_dump` перед деплоем | `.github/workflows/deploy-v2.yml` | ⬜ |

**Зависимости:** Шаг 4 (`db push` → `migrate deploy`)

---

## Шаг 6 — 🏗 Auth: централизация

| # | Задача | Описание | Файлы | Готовность |
|---|---|---|---|---|
| 10 | **Централизовать аутентификацию** | Выделить общий `auth.ts` в shared-пакет для 3 Next.js app — сейчас 3 копии с риском рассинхронизации | `apps/*/src/lib/auth.ts` | ⬜ |

**Зависимости:** Шаг 4 (чтобы не делать две реорганизации сразу)

---

## Шаг 7 — 🏗 Quest: отвязка от общей БД

| # | Задача | Описание | Файлы | Готовность |
|---|---|---|---|---|
| 11 | **Отвязать Quest от общей БД** | REST API в dnd-club: `GET /api/characters?campaign=dead-band`, Quest: заменить `pool.query()` на fetch к этому API | Новый route в dnd-club, `apps/Quest/quest-app/server.js:42-84` | ⬜ |

**Зависимости:** Шаг 4 (чтобы Quest получал данные через API, а не из чужой БД)

---

## Шаг 8 — 📈🚀 Observability + Deployment

| # | Задача | Описание | Файлы | Готовность |
|---|---|---|---|---|
| 12 | **Health checks и zero-downtime deploy** | endpoint `/api/health` в каждый сервис, health checks в docker-compose, убрать maintenance window | `docker-compose.prod.yml`, `maintenance.sh`, `deploy-v2.yml` | ⬜ |
| 13 | **Staging, мониторинг и алерты** | Staging-окружение, структурированные логи (JSON), uptime-мониторинг + алерты | — | ⬜ |

**Зависимости:** Шаг 7 (после архитектурной стабилизации)

---

## Итого: 13 задач, 8 шагов

| Шаг | Задачи | Тема |
|---|---|---|
| **1** | 2 | 🔴 Секреты + entrypoint |
| **2** | 2 | 🔴 CORS/CSP/headers + лимиты |
| **3** | 2 | 📊 Аналитика Next.js + статика |
| **4** | 2 | 🗄️🔄 Разделение БД + миграции |
| **5** | 1 | 🛠 CI/CD |
| **6** | 1 | 🏗 Auth централизация |
| **7** | 1 | 🏗 Quest отвязка |
| **8** | 2 | 📈🚀 Health/deploy + staging/monitoring |

**Статус:** ⬜ — не начато | ✅ — готово | 🔄 — в работе
