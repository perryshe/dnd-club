#!/usr/bin/env bash
set -e

NGINX_CONF="/etc/nginx/sites-enabled/dnd-club"
NGINX_BAK="/etc/nginx/sites-enabled/dnd-club.bak"
MAINT_HTML="/usr/share/nginx/html/maintenance.html"
PROJECT_DIR="$(cd "$(dirname "$0")" && pwd)"

case "${1:-status}" in
  on)
    if [ -f "$NGINX_BAK" ]; then
      echo "Maintenance mode is already ON. Reloading..."
    else
      sudo cp "$NGINX_CONF" "$NGINX_BAK"
    fi

    sed "s/TIMESTAMP/$(date +%s)/" "$PROJECT_DIR/maintenance.html" | sudo tee "$MAINT_HTML" > /dev/null
    sudo cp "$PROJECT_DIR/favicon-maintenance.svg" "/usr/share/nginx/html/favicon.ico"

    sudo tee "$NGINX_CONF" > /dev/null << 'NGINX'
server {
    listen 80;
    server_name d21-club.ru www.d21-club.ru;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl;
    server_name d21-club.ru www.d21-club.ru;

    ssl_certificate /etc/letsencrypt/live/d21-club.ru/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/d21-club.ru/privkey.pem;
    include /etc/letsencrypt/options-ssl-nginx.conf;
    ssl_dhparam /etc/letsencrypt/ssl-dhparams.pem;

    root /usr/share/nginx/html;
    index maintenance.html;

    location = /favicon.ico {
        root /usr/share/nginx/html;
    }

    location / {
        try_files /maintenance.html =503;
        add_header Retry-After "600";
    }
}
NGINX

    sudo nginx -t && sudo systemctl reload nginx
    echo "Maintenance mode ON"
    ;;

  off)
    if [ ! -f "$NGINX_BAK" ]; then
      echo "No backup config found. Restoring from repo..."
      sudo cp "$PROJECT_DIR/dnd-club-nginx.conf" "$NGINX_CONF"
    else
      sudo mv "$NGINX_BAK" "$NGINX_CONF"
    fi

    sudo rm -f "$MAINT_HTML" "/usr/share/nginx/html/favicon.ico"

    sudo nginx -t && sudo systemctl reload nginx
    echo "Maintenance mode OFF"
    ;;

  status)
    if [ -f "$NGINX_BAK" ]; then
      echo "Status: ON"
    else
      echo "Status: OFF"
    fi
    ;;

  *)
    echo "Usage: $0 {on|off|status}"
    exit 1
    ;;
esac
