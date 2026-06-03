# Деплой на сервер (перезапуск)

## Первый запуск (setup)

```bash
ssh root@91.224.87.229
cd /root
git clone https://github.com/perryshe/dnd-club.git
cd dnd-club
docker compose build
docker compose up -d
```

После первой сборки — зайти как admin:
- Email: admin@dnd-club.ru
- Пароль: admin123

**Важно:** смени пароль админа после первого входа.

---

## После изменений в коде (обновление)

```bash
ssh root@91.224.87.229
cd /root/dnd-club
git pull
docker compose down
docker compose build
docker compose up -d
```

Nginx и SSL трогать не нужно — они не меняются.

---

## Если нужно пересобрать с нуля (стереть всё)

```bash
ssh root@91.224.87.229
cd /root/dnd-club
docker compose down -v   # -v удалит БД тоже
git pull
docker compose build
docker compose up -d
```

---

## Полезные команды

```bash
# Логи
docker compose logs -f club
docker compose logs -f db

# Зайти в базу
docker exec -it dnd-club-db psql -U dndclub -d dndclub

# Сбросить пароль админа (вручную)
docker exec -it dnd-club-db psql -U dndclub -d dndclub -c "UPDATE users SET password='...' WHERE email='admin@dnd-club.ru'"
```

---

## Где что лежит

```
/root/dnd-club/              - код проекта
/etc/nginx/sites-available/  - конфиг nginx
/var/log/nginx/              - логи nginx
```

Контейнеры: `dnd-club` (Next.js), `dnd-club-db` (PostgreSQL)
