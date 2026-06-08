#!/usr/bin/env bash
set -e

echo "=== Installing Docker ==="
apt update
apt install -y apt-transport-https ca-certificates curl software-properties-common

curl -fsSL https://download.docker.com/linux/ubuntu/gpg | gpg --dearmor -o /usr/share/keyrings/docker-archive-keyring.gpg
echo "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/docker-archive-keyring.gpg] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable" | tee /etc/apt/sources.list.d/docker.list > /dev/null

apt update
apt install -y docker-ce docker-ce-cli containerd.io docker-compose-plugin
systemctl enable docker
systemctl start docker

echo "=== Installing Nginx ==="
apt install -y nginx

# Generate a random secret if not provided
SECRET=${NEXTAUTH_SECRET:-$(openssl rand -hex 32)}

echo "=== Cloning project ==="
cd /root
git clone https://github.com/perryshe/dnd-club.git
cd dnd-club

echo "=== Generating NEXTAUTH_SECRET ==="
sed -i "s/change-me-to-a-random-secret/$SECRET/" docker-compose.yml

echo "=== Building and starting containers ==="
docker compose build
docker compose up -d

echo "=== Configuring Nginx ==="
cat > /etc/nginx/sites-available/dnd-club << 'EOF'
server {
    listen 80;
    server_name d21-club.ru www.d21-club.ru;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
EOF

if [ -f /etc/nginx/sites-enabled/default ]; then
    rm /etc/nginx/sites-enabled/default
fi

if [ ! -f /etc/nginx/sites-enabled/dnd-club ]; then
    ln -s /etc/nginx/sites-available/dnd-club /etc/nginx/sites-enabled/
fi

nginx -t && systemctl restart nginx

echo "=== Installing SSL ==="
snap install core
snap install --classic certbot
ln -sf /snap/bin/certbot /usr/bin/certbot
certbot --nginx -d d21-club.ru -d www.d21-club.ru

echo "=== Done ==="
