#!/usr/bin/env bash
set -e

# Backup script for DnD Club
# Usage: BACKUP_HOST=user@backup.server BACKUP_PATH=/backups/club ./scripts/backup.sh
#
# 1. Dumps PostgreSQL to a temp file
# 2. Syncs ./uploads/ and the dump via rsync to a remote host
# 3. Keeps last 7 days of database dumps locally

BACKUP_HOST="${BACKUP_HOST:?BACKUP_HOST not set (e.g. root@backup.example.com)}"
BACKUP_PATH="${BACKUP_PATH:?BACKUP_PATH not set (e.g. /backups/club)}"
COMPOSE_PROJECT="${COMPOSE_PROJECT:-dnd-club}"
RETENTION_DAYS="${RETENTION_DAYS:-7}"

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
PROJECT_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"
DUMP_DIR="$PROJECT_DIR/.backup-dumps"

mkdir -p "$DUMP_DIR"
DUMP_FILE="$DUMP_DIR/pg-$(date +%Y%m%d-%H%M%S).sql"

echo "=== Dumping PostgreSQL ==="
docker compose -p "$COMPOSE_PROJECT" exec -T db pg_dump -U dndclub dndclub > "$DUMP_FILE"
gzip "$DUMP_FILE"
echo "Dump saved: ${DUMP_FILE}.gz"

echo "=== Syncing uploads and dumps to $BACKUP_HOST:$BACKUP_PATH ==="
rsync -az --delete "$PROJECT_DIR/uploads/" "$BACKUP_HOST:$BACKUP_PATH/uploads/"
rsync -az "$DUMP_DIR/" "$BACKUP_HOST:$BACKUP_PATH/dumps/"

echo "=== Cleaning old local dumps (>${RETENTION_DAYS} days) ==="
find "$DUMP_DIR" -name "pg-*.sql*" -mtime "+$RETENTION_DAYS" -delete

echo "=== Done ==="
