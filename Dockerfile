# ---- deps ----
FROM node:22-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json* ./
RUN npm ci

# ---- build (standalone) ----
FROM node:22-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
# API_URL is baked into the /api + /files proxy rewrites at build time, and the
# NEXT_PUBLIC_* values are inlined into the client bundle — all of them have to
# be present here, not at `docker run`, or the built site ships the defaults.
ARG API_URL=http://backend:8080
ARG NEXT_PUBLIC_API_URL=https://api-msj.aztu.edu.az
ARG NEXT_PUBLIC_SITE_URL=https://msj.aztu.edu.az
ARG NEXT_PUBLIC_ADMIN_URL=https://admin-msj.aztu.edu.az
ARG NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION=
ENV API_URL=$API_URL \
    NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL \
    NEXT_PUBLIC_SITE_URL=$NEXT_PUBLIC_SITE_URL \
    NEXT_PUBLIC_ADMIN_URL=$NEXT_PUBLIC_ADMIN_URL \
    NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION=$NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION
ENV NEXT_TELEMETRY_DISABLED=1
RUN npm run build

# ---- run ----
FROM node:22-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production NEXT_TELEMETRY_DISABLED=1 HOSTNAME=0.0.0.0
RUN addgroup -g 1001 -S nodejs && adduser -S nextjs -u 1001
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
USER nextjs
ENV PORT=3000
EXPOSE 3000
CMD ["node","server.js"]
