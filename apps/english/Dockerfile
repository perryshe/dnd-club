FROM node:20-alpine AS builder
WORKDIR /app
COPY site/package.json site/package-lock.json ./
RUN npm ci
COPY site/ .
RUN npm run build

FROM nginx:alpine
COPY --from=builder /app/out /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
