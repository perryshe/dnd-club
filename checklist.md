# Аудит и план работ — d21-club.ru

> Локальный чек-лист. `.audit/` добавлена в `.gitignore`.
> Обновлён: 27.06.2026

---

## Phase 0 — Подготовка

- [ ] `git pull origin develop` — актуальный код
- [ ] Создать `.audit/`, добавить `/.audit` в `.gitignore`

---

## Phase 1 — 🔴 Безопасность: секреты и entrypoint

| # | Задача | Зачем | Файлы |
|---|---|---|---|
| 1 | Вынести `POSTGRES_PASSWORD`, `NEXTAUTH_SECRET`, `ADMIN_PASSWORD` в `.env.prod` | Секреты не должны быть в git | `docker-compose.yml`, `docker-compose.prod.yml`, `.env.prod` |
| 2 | Сгенерировать новый `NEXTAUTH_SECRET` (openssl rand 64) | Текущий `change-me-to-a-random-secret` — не секрет | `.env.prod` |
| 3 | Сменить пароль БД и админа | `dndclub_pass` и `admin123` в открытом доступе | `.env.prod`, `docker-compose.prod.yml` |
| 4 | Убрать `npx tsx prisma/seed.ts` из `book-club/docker-entrypoint.sh` | Seed при каждом старте перезаписывает роли | `apps/book-club/docker-entrypoint.sh` |
| 5 | Добавить `npx prisma generate` в `book-club-2/docker-entrypoint.sh` | Без generate — stale Prisma Client после смены схемы | `apps/book-club-2/docker-entrypoint.sh` |

**Зависимости:** нет. Можно делать первым.

---

## Phase 2 — 🔴 Безопасность: CORS, CSP, headers, uploads

| # | Задача | Зачем | Файлы |
|---|---|---|---|
| 6 | CORS tic-tac: `AllowAnyOrigin()` → `WithOrigins("https://d21-club.ru")` | Любой сайт может делать запросы к API | `apps/tic-tac/tic_tac/Program.cs:99-102` |
| 7 | Security headers в nginx: HSTS, X-Frame-Options, X-Content-Type-Options | Clickjacking, MIME sniffing | `dnd-club-nginx.conf` |
| 8 | Уточнить CSP: `https:` → конкретные домены | Безопасность скриптов | `dnd-club-nginx.conf` |
| 9 | Лимит размера файлов (сейчас `client_max_body_size 100M` без проверки) | DoS через заполнение диска | `apps/dnd-club/src/lib/admin-actions.ts:35` |
| 10 | Rate limit: cleanup устаревших записей (memory leak) | Сейчас Map растёт бесконечно | `apps/dnd-club/src/lib/rate-limit.ts` |

**Зависимости:** нет

---

## Phase 3 — 📊 Аналитика (Яндекс.Метрика)

| # | Задача | Зачем | Файлы |
|---|---|---|---|
| 11 | Создать компонент `<Analytics />` | Единый код счётчика | `apps/dnd-club/src/components/Analytics.tsx` (или shared) |
| 12 | Внедрить в `dnd-club/layout.tsx` | Главный сайт | `apps/dnd-club/src/app/layout.tsx` |
| 13 | Внедрить в `book-club/layout.tsx` | Книжный клуб v1 | `apps/book-club/src/app/layout.tsx` |
| 14 | Внедрить в `book-club-2/layout.tsx` | Книжный клуб v2 | `apps/book-club-2/src/app/layout.tsx` |
| 15 | Внедрить в `english/index.html`, `tor.html` | Статические страницы английского | `apps/english/index.html`, `apps/english/tor.html` |
| 16 | Внедрить в `quest-app/public/index.html` | Страница квеста | `apps/Quest/quest-app/public/index.html` |
| 17 | Внедрить в `tic_tac/wwwroot/index.html` | Страница крестиков-ноликов | `apps/tic-tac/tic_tac/wwwroot/index.html` |
| 18 | Добавить `NEXT_PUBLIC_YM_COUNTER` в `docker-compose.prod.yml` | ID счётчика через env | `docker-compose.prod.yml` |
| 19 | Обновить CSP под `mc.yandex.ru`, `yastatic.net` | Чтобы Метрика работала | `dnd-club-nginx.conf` |

**Зависимости:** Phase 1 (нужен env для ID счётчика), 2 (CSP)

---

## Phase 4 — 🗄️ Разделение баз данных

| # | Задача | Зачем | Файлы |
|---|---|---|---|
| 20 | Создать БД `bookclub_v1`, `bookclub_v2` | Каждому сервису свою БД | `postgres/init.sql` |
| 21 | book-club: `DATABASE_URL` → `bookclub_v1` | Чтобы не сломать таблицы dnd-club | `docker-compose.prod.yml:55` |
| 22 | book-club-2: `DATABASE_URL` → `bookclub_v2` | Аналогично | `docker-compose.prod.yml:106` |
| 23 | Добавить `sadmin` в enum Role в book-club схеме | Иначе при `prisma db push` удалит роль | `apps/book-club/prisma/schema.prisma:10-14` |
| 24 | Сделать dev → prod консистентными | Dev использует `bookclub`, prod — `dndclub` | `docker-compose.yml` vs `docker-compose.prod.yml` |

**Зависимости:** нет, но затрагивает все сервисы. Лучше делать когда есть время на тестирование.

---

## Phase 5 — 🔄 Prisma миграции

| # | Задача | Зачем | Файлы |
|---|---|---|---|
| 25 | Сгенерировать `prisma migrate dev` для dnd-club | Вместо `db push` | `apps/dnd-club/prisma/` |
| 26 | Сгенерировать `prisma migrate dev` для book-club | Вместо `db push` | `apps/book-club/prisma/` |
| 27 | Сгенерировать `prisma migrate dev` для book-club-2 | Вместо `db push` | `apps/book-club-2/prisma/` |
| 28 | CI/CD: `db push` → `migrate deploy` | Безопасное обновление схемы | `.github/workflows/deploy-v2.yml:39-40` |

**Зависимости:** Phase 4 (раздельные БД)

---

## Phase 6 — 🛠 CI/CD

| # | Задача | Зачем | Файлы |
|---|---|---|---|
| 29 | Добавить `npm run lint` в CI | Проверка кода перед деплоем | `.github/workflows/deploy-v2.yml` |
| 30 | Добавить `npm run type-check` | TypeScript errors → fail build | `.github/workflows/deploy-v2.yml` |
| 31 | Заменить `git fetch --force` на `--ff-only` | Безопасный pull | `.github/workflows/deploy-v2.yml:15` |
| 32 | Добавить `pg_dump` перед деплоем | Авто-бэкап | `.github/workflows/deploy-v2.yml` |

**Зависимости:** нет

---

## Phase 7 — 🏗 Auth: централизация

| # | Задача | Зачем | Файлы |
|---|---|---|---|
| 33 | Выделить общий `auth.ts` в shared-пакет | 3 копии — риск рассинхронизации | `apps/*/src/lib/auth.ts` |
| 34 | Или единый auth gateway | SSO для всех сервисов | Новый сервис или в dnd-club |

**Зависимости:** Phase 4 (чтобы не плодить сложность одновременно с разделением БД)

---

## Phase 8 — 🏗 Quest: отвязка от общей БД

| # | Задача | Зачем | Файлы |
|---|---|---|---|
| 35 | REST API в dnd-club: `GET /api/characters?campaign=dead-band` | Вместо прямых pg-запросов | Новый route в dnd-club |
| 36 | Quest: заменить `pool.query(...)` на fetch к API | Слабая связность | `apps/Quest/quest-app/server.js:42-84` |

**Зависимости:** нет, но лучше после Phase 4 (чтобы не менять дважды)

---

## Phase 9 — 📈 Observability

| # | Задача | Зачем |
|---|---|---|
| 37 | Добавить endpoint `/api/health` в каждый сервис | Health checks |
| 38 | Health checks в docker-compose.prod.yml | Docker перезапустит упавший сервис |
| 39 | Структурированные логи (JSON) | Поиск ошибок |
| 40 | Uptime-мониторинг (UptimeRobot / Grafana) | Узнавать о падениях |

---

## Phase 10 — 🚀 Deployment

| # | Задача | Зачем |
|---|---|---|
| 41 | Zero-downtime deploy | Убрать maintenance window |
| 42 | Staging-окружение | Тестировать перед продом |
| 43 | Мониторинг и алерты | Не пропускать инциденты |

---

**Итого:** 43 пункта, 11 фаз.
- 🔴 Phase 1-2: безопасность (10 задач)
- 📊 Phase 3: аналитика (9 задач)
- 🗄️ Phase 4-5: БД и миграции (9 задач)
- 🛠 Phase 6: CI/CD (4 задачи)
- 🏗 Phase 7-8: архитектура (4 задачи)
- 📈📡 Phase 9-10: observability и деплой (7 задач)
