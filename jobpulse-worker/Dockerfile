FROM node:20-alpine AS builder
WORKDIR /app

# Build shared library first
COPY jobpulse-shared/package*.json ./jobpulse-shared/
WORKDIR /app/jobpulse-shared
RUN npm install
COPY jobpulse-shared/ ./
RUN npm run build

# Build worker
WORKDIR /app/jobpulse-worker
COPY jobpulse-worker/package*.json ./
RUN npm install
COPY jobpulse-worker/ ./
RUN npx prisma generate
RUN npm run build

FROM node:20-alpine AS runner
WORKDIR /app/jobpulse-worker

ENV NODE_ENV=production

COPY --from=builder /app/jobpulse-shared /app/jobpulse-shared
COPY --from=builder /app/jobpulse-worker/package*.json ./
COPY --from=builder /app/jobpulse-worker/node_modules ./node_modules
COPY --from=builder /app/jobpulse-worker/dist ./dist
COPY --from=builder /app/jobpulse-worker/prisma ./prisma

CMD ["node", "dist/worker.js"]
