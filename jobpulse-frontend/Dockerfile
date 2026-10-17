FROM node:20-alpine AS builder
WORKDIR /app

# Build shared library first
COPY jobpulse-shared/package*.json ./jobpulse-shared/
WORKDIR /app/jobpulse-shared
RUN npm install
COPY jobpulse-shared/ ./
RUN npm run build

# Build frontend
WORKDIR /app/jobpulse-frontend
COPY jobpulse-frontend/package*.json ./
RUN npm install
COPY jobpulse-frontend/ ./
RUN npm run build

FROM nginx:alpine AS runner
COPY --from=builder /app/jobpulse-frontend/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
