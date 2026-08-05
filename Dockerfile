# syntax=docker/dockerfile:1

# ── Build stage ───────────────────────────────────────────────────────────────
# Vite inlines VITE_* variables at BUILD time, so the API base URL must be
# supplied as a build arg (not a runtime env var).
FROM node:22-alpine AS build
WORKDIR /app

# Install dependencies from the lockfile for reproducible builds.
COPY package.json package-lock.json ./
RUN npm ci

# Build the app.
COPY . .
ARG VITE_API_BASE_URL=""
ARG VITE_APP_NAME="GarantMobile"
ENV VITE_API_BASE_URL=$VITE_API_BASE_URL
ENV VITE_APP_NAME=$VITE_APP_NAME
RUN npm run build

# ── Runtime stage ─────────────────────────────────────────────────────────────
FROM nginx:1.27-alpine AS runtime

# SPA-aware nginx config (history fallback + asset caching + gzip).
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Static build output.
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80

# Lightweight health check hitting the nginx /healthz endpoint.
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget -qO- http://localhost/healthz || exit 1

CMD ["nginx", "-g", "daemon off;"]
