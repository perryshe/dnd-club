FROM node:22-alpine
WORKDIR /app
COPY package.json ./
RUN npm install --production --silent 2>/dev/null || true
COPY . .
EXPOSE 3004
CMD ["node", "server.js"]
