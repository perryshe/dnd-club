# Container Registry — миграция на готовые образы

> Перспективный план. Выполняется ПОСЛЕ основного чек-листа (`checklist.md`).
> Суть: билд в CI (GitHub Actions), образы в ghcr.io, на VPS только pull.
> Ветка: `audit` | Обновлён: 30.06.2026 (аудит) | Статус: ⏸ пауза (недостаточно профита с self-hosted runner)

---

## Аудит: текущее состояние

### 🐳 Dockerfiles (6 сервисов)

| Сервис | Базовый образ | Prisma generate | Тип сборки | Особенности |
|--------|-------------|----------------|------------|-------------|
| **dnd-club** | `node:20-alpine` | ✅ `prisma generate` | Next.js standalone + entrypoint.sh | `DATABASE_URL` нужен для `prisma generate` (можно фейк) |
| **book-club-2** | `node:20-alpine` | ✅ 2 схемы (auth + schema) | Next.js standalone + entrypoint.sh | Нужен `AUTH_DATABASE_URL` + `DATABASE_URL` |
| **game-club** | `node:20-alpine` | ✅ 2 схемы (auth + schema) | Next.js standalone + entrypoint.sh | То же |
| **english** | `node:20-alpine` | ❌ | Next.js standalone | Проще всех — нет prisma |
| **t21-game** | `mcr.microsoft.com/dotnet/sdk:10.0` → `aspnet:10.0` | N/A | .NET 10 publish | Тяжёлый SDK слой (~1.7GB), runtime ~200MB |
| **quest** | `node:22-alpine` | ❌ | `npm install --production` | Самый маленький, без build |

### 🔧 Build context (все — корень репозитория)

```yaml
context: .
dockerfile: apps/*/Dockerfile
```

Кроме `quest` (`context: ./apps/Quest/quest-app`).

### ⚙️ Prisma: env() зависимости при сборке

`prisma generate` **не коннектится к БД**, но требует чтобы `env("DATABASE_URL")` был определён (любое валидное postgres-значение).

| Схема | Переменная |
|-------|-----------|
| `dnd-club/prisma/schema.prisma` | `DATABASE_URL` |
| `book-club-2/prisma/auth.prisma` | `AUTH_DATABASE_URL` |
| `book-club-2/prisma/schema.prisma` | `DATABASE_URL` |
| `game-club/prisma/auth.prisma` | `AUTH_DATABASE_URL` |
| `game-club/prisma/schema.prisma` | `DATABASE_URL` |

**Решение:** передавать `--build-arg` с фейковой строкой `postgresql://fake:fake@localhost:5432/fake`

### 🌐 NEXT_PUBLIC — не проблема

`NEXT_PUBLIC_*` используются ТОЛЬКО в серверных компонентах (`layout.tsx` — server component по умолчанию). В Next.js это значит runtime-read, не build-time inline.

`ClubNav` — client component, но получает URL через props, не через `process.env`.

**Вывод:** `NEXT_PUBLIC_*` не нужны на этапе сборки CI.

### 📦 .dockerignore (корневой)

```gitignore
node_modules
.next
.git
*.md
.gitignore
.dockerignore
setup.sh
```

Не исключает:
- `apps/english/site/public/audio/*.mp3` (~40MB)
- `apps/english/site/src/data/days.json` (9k+ строк)

Для CI build context это нормально, но можно ускорить добавив в `.dockerignore`.

### 🏗 CI — self-hosted runner на VPS

```yaml
runs-on: self-hosted
```

CI работает **на том же VPS** где крутятся сервисы.  
`/home/club/Club` — директория на production-сервере.

**Проблема:** при миграции на registry:
1. CI на VPS билдит образы (всё те же 5-8 мин)
2. Пушит в ghcr.io
3. Тут же пуллит обратно на тот же VPS

→ Время деплоя НЕ уменьшится, а увеличится (build + push + pull вместо просто build).
→ Единственный профит — версионирование и rollback.

**Для реального ускорения нужен:** GitHub-hosted runner или отдельная CI-машина.

### 📁 Volumes (не зависят от registry)

- `./uploads:/app/public/uploads` (dnd-club)
- `./uploads/g21:/app/public/images` (game-club)

Проблем нет — volumes монтируются в docker-compose независимо от того, build или pull.

### 🔐 Секреты

| Сервис | Секрет | Сейчас | После registry |
|--------|--------|--------|----------------|
| dnd-club | `NEXTAUTH_SECRET` | в docker-compose env | то же самое (runtime) |
| dnd-club | `DATABASE_URL` | в docker-compose env | то же самое |
| book-club-2 | `AUTH_DATABASE_URL` | в docker-compose env | то же самое |
| t21-game | Connection strings | в docker-compose env | то же самое |
| Все | `NEXTAUTH_URL` | в docker-compose env | то же самое |

**Runtime-секреты** не вшиваются в образ — они передаются через `environment:` в docker-compose. При переходе на registry это не меняется.

---

## 🎯 Вывод

**Миграция на registry с self-hosted runner на VPS — не даёт ускорения деплоя.**  
Время не уменьшится: build (VPS) + push → pull (VPS) дольше чем просто build (VPS).

**Реальный профит будет когда:**
1. CI переедет на GitHub-hosted runner (или отдельную машину)
2. На VPS останется только `docker compose pull` (30 сек)
3. VPS не будет тратить CPU/RAM на сборку

**Пока registry даёт только:**
- Версионирование образов (`:sha-{commit}`, `:latest`)
- Возможность rollback (переключить тег)
- Независимость от репозитория (образы живут в ghcr.io)

**Рекомендация:** отложить миграцию до разделения CI-runner и production-VPS.  
Сейчас достаточно доработать `deploy-v2.yml`:
- Тегировать образы локально при build
- Не чистить `docker system prune -af` (уже убрали)
- Прикрутить `docker tag` + `docker save` для бэкапа

---

## Архитектура: до и после

```mermaid
graph TB
    subgraph "СЕЙЧАС — билд на VPS"
        DEV1[git push develop] --> VPS1[VPS: git pull]
        VPS1 --> BUILD1[VPS: docker compose build<br/>~5‑8 мин · Node 20 + .NET 10 SDK]
        BUILD1 --> UP1[VPS: docker compose up -d<br/>простой до 10 мин]
        UP1 --> NGINX1[nginx reload]
    end

    subgraph "ПОСЛЕ — билд в CI (GitHub-hosted), образы в ghcr.io"
        DEV2[git push develop] --> CI2[GitHub Actions<br/>GitHub-hosted runner]
        CI2 --> BUILD2[Build 6 образов<br/>теги :latest + :sha-commit]
        BUILD2 --> REG2[ghcr.io]
        REG2 --> PULL2[VPS: docker compose pull<br/>~30 сек]
        PULL2 --> UP2[VPS: docker compose up -d<br/>простой — секунды]
        UP2 --> NGINX2[nginx reload]

        subgraph "Образы"
            IMG1[dnd-club:latest<br/>book-club-2:latest<br/>t21-game:latest<br/>quest:latest<br/>english:latest<br/>game-club:latest]
        end
        REG2 --> IMG1

        subgraph "Роллбэк"
            RB[rollback.sh sha-abc<br/>→ docker pull :sha-abc<br/>→ docker tag :latest<br/>→ compose up -d]
        end
        REG2 --> RB
        RB --> PULL2
    end
```

**Ключевые изменения:**
| Аспект | Сейчас | После |
|--------|--------|-------|
| Где билд | VPS (self-hosted runner) | GitHub-hosted runner |
| Откуда берутся образы | `docker compose build` | `docker compose pull` из ghcr.io |
| Время деплоя | ~5-10 мин | ~30 сек (pull) + ~5-8 мин (build in CI, параллельно) |
| Версионирование | нет | `:latest`, `:sha-{commit}`, `:stable` |
| Роллбэк | пересборка коммита | `docker pull` предыдущего тега |

---

## 🗺 Что нужно будет сделать (когда решим)

### Шаг 0 — Перевести CI на GitHub-hosted runner
| # | Задача | Описание | Файлы |
|---|--------|----------|-------|
| 0 | **Сменить runner** | `runs-on: ubuntu-latest` вместо `self-hosted`. Деплой через SSH deploy key | `.github/workflows/deploy-v2.yml` |
| 0 | **SSH deploy key** | Добавить `secrets.DEPLOY_KEY` в GitHub Secrets, настроить доступ к VPS | GitHub → Settings → Secrets |

### Шаг 1 — 🔑 Настройка доступа к registry
| # | Задача | Описание | Файлы |
|---|--------|----------|-------|
| 1 | **Создать GitHub‑токен** | PAT с `write:packages`, `read:packages`, добавить как `GHCR_TOKEN` в Secrets | GitHub → Settings → Secrets |
| 2 | **Залогинить VPS в ghcr.io** | `docker login ghcr.io -u perryshe` на VPS (токен обновлять раз в 90 дней) | VPS |

### Шаг 2 — 📦 Сборка образов в CI
| # | Задача | Описание | Файлы |
|---|--------|----------|-------|
| 3 | **CI: login + build + push** | `docker/login-action@v3` с `GHCR_TOKEN`. Build аргументы для Prisma: фейковые `DATABASE_URL`, `AUTH_DATABASE_URL`. Теги `:sha-{sha}` и `:latest` | `.github/workflows/deploy-v2.yml` |
| 4 | **Первый push всех образов** | `workflow_dispatch` чтобы наполнить registry | Вручную |

### Шаг 3 — 🚀 Переключение деплоя
| # | Задача | Описание | Файлы |
|---|--------|----------|-------|
| 5 | **docker-compose: build → image** | `image: ghcr.io/perryshe/dnd-club/<service>:latest` вместо `build:`. `pull_policy: always` | `docker-compose.prod.yml` |
| 6 | **CI: pull вместо build** | `docker compose pull` + `up -d`. Убрать `docker compose build` | `.github/workflows/deploy-v2.yml` |

### Шаг 4 — 📐 Версионирование
| # | Задача | Описание | Файлы |
|---|--------|----------|-------|
| 7 | **rollback.sh** | Скрипт: `docker pull :sha-abc`, `docker tag`, `compose up -d` | `rollback.sh` |
| 8 | **Документация** | Процесс деплоя, теги, роллбэк | `README.md` |

### Технические детали для build-аргументов

```yaml
- name: Build and push
  uses: docker/build-push-action@v6
  with:
    build-args: |
      DATABASE_URL=postgresql://fake:fake@localhost:5432/fake
      AUTH_DATABASE_URL=postgresql://fake:fake@localhost:5432/fake
```

И в каждом Dockerfile добавить `ARG`:
```dockerfile
ARG DATABASE_URL
ARG AUTH_DATABASE_URL
```

Для `prisma generate` env vars можно также передать через `ENV` в builder-стадии.

---

## Итого

| Шаг | Задачи | Тема | Статус |
|-----|--------|------|--------|
| **0** | 2 | 🏗 GitHub-hosted runner + SSH deploy key | ⬜ |
| **1** | 2 | 🔑 Доступ к registry | ⬜ |
| **2** | 2 | 📦 CI сборка + первый push | ⬜ |
| **3** | 2 | 🚀 Переход на pull-деплой | ⬜ |
| **4** | 2 | 📐 Версионирование + документация | ⬜ |

**Статус:** ⏸ отложено — сначала разделить CI-runner и VPS, иначе профита нет.
