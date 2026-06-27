# Аудит и план работ — d21-club.ru

> Единый чек-лист. Готовность отмечается в колонке.
> Ветка: `audit` | Обновлён: 27.06.2026

---

## Шаг 1 — 🔴 Безопасность: секреты и entrypoint

| # | Задача | Зачем | Файлы | Готовность |
|---|---|---|---|---|
| 1 | Вынести `POSTGRES_PASSWORD`, `NEXTAUTH_SECRET`, `ADMIN_PASSWORD` в `.env.prod` | Секреты не должны быть в git | `docker-compose.yml`, `docker-compose.prod.yml`, `.env.prod` | ⬜ |
| 2 | Сгенерировать новый `NEXTAUTH_SECRET` (openssl rand 64) | Текущий `change-me-to-a-random-secret` — не секрет | `.env.prod` | ⬜ |
| 3 | Сменить пароль БД и админа | `dndclub_pass` и `admin123` в открытом доступе | `.env.prod`, `docker-compose.prod.yml` | ⬜ |
| 4 | Убрать `npx tsx prisma/seed.ts` из `book-club/docker-entrypoint.sh` | Seed при каждом старте перезаписывает роли | `apps/book-club/docker-entrypoint.sh` | ⬜ |
| 5 | Добавить `npx prisma generate` в `book-club-2/docker-entrypoint.sh` | Без generate — stale Prisma Client | `apps/book-club-2/docker-entrypoint.sh` | ⬜ |

**Зависимости:** нет

---

## Шаг 2 — 🔴 Безопасность: CORS, CSP, headers, uploads

| # | Задача | Зачем | Файлы | Готовность |
|---|---|---|---|---|
| 6 | CORS tic-tac: `AllowAnyOrigin()` → `WithOrigins("https://d21-club.ru")` | Любой сайт может делать запросы к API | `apps/tic-tac/tic_tac/Program.cs:99-102` | ⬜ |
| 7 | Security headers в nginx (HSTS, X-Frame-Options, X-Content-Type-Options) | Clickjacking, MIME sniffing | `dnd-club-nginx.conf` | ⬜ |
| 8 | Уточнить CSP: `https:` → конкретные домены | Безопасность скриптов | `dnd-club-nginx.conf` | ⬜ |
| 9 | Лимит размера файлов при загрузке | DoS через заполнение диска | `apps/dnd-club/src/lib/admin-actions.ts:35` | ⬜ |
| 10 | Rate limit: cleanup устаревших записей | Сейчас Map растёт бесконечно (memory leak) | `apps/dnd-club/src/lib/rate-limit.ts` | ⬜ |

**Зависимости:** нет

---

## Шаг 3 — 📊 Аналитика (Яндекс.Метрика)

| # | Задача | Зачем | Файлы | Готовность |
|---|---|---|---|---|
| 11 | Создать компонент `<Analytics />` | Единый код счётчика | `apps/dnd-club/src/components/Analytics.tsx` | ⬜ |
| 12 | Внедрить в `dnd-club/layout.tsx` | Главный сайт | `apps/dnd-club/src/app/layout.tsx` | ⬜ |
| 13 | Внедрить в `book-club/layout.tsx` | Книжный клуб v1 | `apps/book-club/src/app/layout.tsx` | ⬜ |
| 14 | Внедрить в `book-club-2/layout.tsx` | Книжный клуб v2 | `apps/book-club-2/src/app/layout.tsx` | ⬜ |
| 15 | Внедрить в `english/index.html`, `tor.html` | Статические страницы | `apps/english/index.html`, `apps/english/tor.html` | ⬜ |
| 16 | Внедрить в `quest-app/public/index.html` | Страница квеста | `apps/Quest/quest-app/public/index.html` | ⬜ |
| 17 | Внедрить в `tic_tac/wwwroot/index.html` | Страница крестиков-ноликов | `apps/tic-tac/tic_tac/wwwroot/index.html` | ⬜ |
| 18 | Добавить `NEXT_PUBLIC_YM_COUNTER` в docker-compose | ID счётчика через env | `docker-compose.prod.yml` | ⬜ |
| 19 | Обновить CSP под `mc.yandex.ru`, `yastatic.net` | Чтобы Метрика работала | `dnd-club-nginx.conf` | ⬜ |

**Зависимости:** Шаг 1 (env), Шаг 2 (CSP)

---

## Шаг 4 — 🗄️ Разделение баз данных + 🔄 Prisma миграции

| # | Задача | Зачем | Файлы | Готовность |
|---|---|---|---|---|
| 20 | Создать БД `bookclub_v1`, `bookclub_v2` в init.sql | Каждому сервису свою БД | `postgres/init.sql` | ⬜ |
| 21 | book-club: `DATABASE_URL` → `bookclub_v1` | Не сломать таблицы dnd-club | `docker-compose.prod.yml:55` | ⬜ |
| 22 | book-club-2: `DATABASE_URL` → `bookclub_v2` | Аналогично | `docker-compose.prod.yml:106` | ⬜ |
| 23 | Добавить `sadmin` в enum Role в book-club схеме | Иначе `db push` удалит роль | `apps/book-club/prisma/schema.prisma:10-14` | ⬜ |
| 24 | Сделать dev → prod консистентными | Dev `bookclub` vs prod `dndclub` | `docker-compose.yml`, `docker-compose.prod.yml` | ⬜ |
| 25 | `prisma migrate dev` для dnd-club | Замена `db push` | `apps/dnd-club/prisma/` | ⬜ |
| 26 | `prisma migrate dev` для book-club | Замена `db push` | `apps/book-club/prisma/` | ⬜ |
| 27 | `prisma migrate dev` для book-club-2 | Замена `db push` | `apps/book-club-2/prisma/` | ⬜ |
| 28 | CI/CD: `db push` → `migrate deploy` | Безопасное обновление схемы | `.github/workflows/deploy-v2.yml:39-40` | ⬜ |

**Зависимости:** нет, но требует тестирования (затрагивает все сервисы)

---

## Шаг 5 — 🛠 CI/CD

| # | Задача | Зачем | Файлы | Готовность |
|---|---|---|---|---|
| 29 | Добавить `npm run lint` в CI | Проверка кода перед деплоем | `.github/workflows/deploy-v2.yml` | ⬜ |
| 30 | Добавить `npm run type-check` | TypeScript errors → fail build | `.github/workflows/deploy-v2.yml` | ⬜ |
| 31 | Заменить `git fetch --force` на `--ff-only` | Безопасный pull | `.github/workflows/deploy-v2.yml:15` | ⬜ |
| 32 | Добавить `pg_dump` перед деплоем | Авто-бэкап | `.github/workflows/deploy-v2.yml` | ⬜ |

**Зависимости:** Шаг 4 (CI ссылается на `migrate deploy` вместо `db push`)

---

## Шаг 6 — 🏗 Auth: централизация

| # | Задача | Зачем | Файлы | Готовность |
|---|---|---|---|---|
| 33 | Выделить общий `auth.ts` в shared-пакет | 3 копии — риск рассинхронизации | `apps/*/src/lib/auth.ts` | ⬜ |
| 34 | Или единый auth gateway | SSO для всех сервисов | Новый сервис или dnd-club | ⬜ |

**Зависимости:** Шаг 4 (чтобы не делать две реорганизации сразу)

---

## Шаг 7 — 🏗 Quest: отвязка от общей БД

| # | Задача | Зачем | Файлы | Готовность |
|---|---|---|---|---|
| 35 | REST API в dnd-club: `GET /api/characters?campaign=dead-band` | Вместо прямых pg-запросов | Новый route в dnd-club | ⬜ |
| 36 | Quest: `pool.query(...)` → fetch к API | Слабая связность | `apps/Quest/quest-app/server.js:42-84` | ⬜ |

**Зависимости:** Шаг 4 (чтобы Quest получал данные из своего API, а не из чужой БД)

---

## Шаг 8 — 📈 Observability + 🚀 Deployment

| # | Задача | Зачем | Файлы | Готовность |
|---|---|---|---|---|
| 37 | endpoint `/api/health` в каждый сервис | Health checks | Каждый app | ⬜ |
| 38 | Health checks в docker-compose.prod.yml | Docker перезапустит упавший сервис | `docker-compose.prod.yml` | ⬜ |
| 39 | Структурированные логи (JSON) | Поиск ошибок | Все сервисы | ⬜ |
| 40 | Zero-downtime deploy | Убрать maintenance window | `maintenance.sh`, `deploy-v2.yml` | ⬜ |
| 41 | Staging-окружение | Тестировать перед продом | Новый compose-файл или VPS | ⬜ |
| 42 | Мониторинг и алерты | Не пропускать инциденты | — | ⬜ |
| 43 | Uptime-мониторинг (UptimeRobot / Grafana) | Узнавать о падениях | — | ⬜ |

**Зависимости:** Шаг 7 (после архитектурной стабилизации)

---

**Итого:** 43 пункта, 8 шагов.
- 🔴 Шаг 1-2: безопасность (10 задач)
- 📊 Шаг 3: аналитика (9 задач)
- 🗄️🔄 Шаг 4: БД и миграции (9 задач)
- 🛠 Шаг 5: CI/CD (4 задачи)
- 🏗 Шаг 6-7: архитектура (4 задачи)
- 📈🚀 Шаг 8: observability + деплой (7 задач)

**Статус:** ⬜ — не начато | ✅ — готово | 🔄 — в работе
