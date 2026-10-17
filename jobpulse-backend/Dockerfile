FROM node:20-alpine AS builder

WORKDIR /app

# Build shared package first
COPY jobpulse-shared/package*.json ./jobpulse-shared/
WORKDIR /app/jobpulse-shared
RUN npm install
COPY jobpulse-shared/ ./
RUN npm run build

# Build backend
WORKDIR /app/jobpulse-backend
COPY jobpulse-backend/package*.json ./
RUN npm install
COPY jobpulse-backend/ ./
RUN npx prisma generate
RUN npm run build

FROM node:20-alpine AS runner
WORKDIR /app/jobpulse-backend

ENV NODE_ENV=production
ENV PORT=5000

COPY --from=builder /app/jobpulse-shared /app/jobpulse-shared
COPY --from=builder /app/jobpulse-backend/package*.json ./
COPY --from=builder /app/jobpulse-backend/node_modules ./node_modules
COPY --from=builder /app/jobpulse-backend/dist ./dist
COPY --from=builder /app/jobpulse-backend/prisma ./prisma

EXPOSE 5000

CMD ["sh", "-c", "npx prisma migrate deploy && node dist/server.js"]
