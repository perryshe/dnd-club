# Access Matrix — d21 Club

## Services

| Service | Path | Port | Access | Auth | Notes |
|---|---|---|---|---|---|
| **dnd-club** | `/` | 3000 | Public | — | Главный сайт. Регистрация/логин — через NextAuth. Без сессии — гостевой просмотр |
| **b21 Club** | `/b21` | 3002 | Public | — | Книжный клуб (старая версия). Просмотр без авторизации. Admin может добавлять/редактировать |
| **b22 Club** | `/b22/` | 3006 | **Admin only** | `auth_request /_auth/check-admin` | Новый книжный клуб. Только для админов (как e21) |
| **t21-game** | `/t21/` | 3003 | Public | Basic Auth (своя) | Игра. Имеет собственную Basic Auth + SSO через dnd-club |
| **quest** | `/quest/` | 3004 | Public | — | Квест. Доступен всем |
| **e21 (english)** | `/e21/` | 3005 | **Admin only** | `auth_request /_auth/check-admin` | English 2.1. Только для админов |

## Auth Endpoints (Internal)

| Location | Proxy to | Returns | Purpose |
|---|---|---|---|
| `/_auth/check` | `localhost:3000/api/auth/check-session` | 200 if any session; 401 if not | Проверка наличия сессии |
| `/_auth/check-admin` | `localhost:3000/api/auth/check-admin` | 200 if role === "admin"; 401 if not | Проверка роли Admin |

## Auth Flow

1. Пользователь логинится на dnd-club через `/login` (NextAuth Credentials)
2. Сессия сохраняется в JWT-cookie `next-auth.session-token` (домен `.d21-club.ru`)
3. При запросе к `/e21/` или `/b22/`:
   - nginx отправляет subrequest на `/_auth/check-admin`
   - check-admin читает cookie, проверяет `session.user.role === "admin"`
   - 200 → прокси на english/b22
   - 401 → `error_page` → `/e21-denied.html` или `/b22-denied.html`

## Denied Pages

| Path | Static file | Service |
|---|---|---|
| `/e21-denied.html` | `apps/dnd-club/public/e21-denied.html` | dnd-club |
| `/b22-denied.html` | `apps/dnd-club/public/b22-denied.html` | dnd-club |

## Roles (Prisma enum `Role`)

| Value | Description |
|---|---|
| `pending` | Зарегался, но не подтверждён — нет доступа никуда |
| `user` | Обычный пользователь — может читать публичные разделы |
| `admin` | Администратор — полный доступ ко всему, включая `/e21/` и `/b22/` |

## Auth Config

- **Provider**: NextAuth v5 beta 25, Credentials (schoolNick/email + password)
- **Strategy**: JWT (no database sessions)
- **Cookie**: `next-auth.session-token`, domain `.d21-club.ru`, path `/`
- **Secret**: `AUTH_SECRET` env var (общий для всех Next.js сервисов)
- **Session**: `session.user` содержит `id`, `name`, `email`, `role`
