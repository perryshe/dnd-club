FROM node:20-alpine AS base
WORKDIR /app

FROM base AS deps
RUN apk add --no-cache libc6-compat
COPY package-lock.json* ./package-lock.json
COPY apps/club-main/package.json ./apps/club-main/package.json
RUN cd apps/club-main && npm install --ignore-scripts

FROM base AS builder
COPY --from=deps /app/apps/club-main/node_modules ./apps/club-main/node_modules
COPY apps/club-main/ ./apps/club-main/
COPY prisma/ ./prisma/
COPY public/ ./public/
COPY docker-entrypoint.sh ./
ENV NEXT_TELEMETRY_DISABLED=1
RUN cd apps/club-main && npx prisma generate --schema=../../prisma/schema.prisma && npm run build

FROM base AS runner
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
RUN addgroup --system --gid 1001 nodejs && adduser --system --uid 1001 nextjs

COPY --from=builder --chown=nextjs:nodejs /app/apps/club-main/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/apps/club-main/.next/static ./.next/static
COPY --from=builder /app/apps/club-main/node_modules ./node_modules
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/apps/club-main/package.json ./package.json
COPY --from=builder /app/docker-entrypoint.sh ./
COPY --from=builder /app/public ./public
RUN chmod +x docker-entrypoint.sh && mkdir -p public/uploads && chown nextjs:nodejs public/uploads

EXPOSE 3000
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"
ENTRYPOINT ["/bin/sh", "./docker-entrypoint.sh"]
