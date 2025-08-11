# Base image
FROM node:20-alpine AS builder

# Create app directory
WORKDIR /app

# Install dependencies for NestJS
COPY package*.json ./
RUN npm install

# Copy backend source
COPY . .

# Build React frontend
WORKDIR /app/frontend
RUN npm install
RUN npm run build

# Back to backend
WORKDIR /app

# Prisma generate
RUN npx prisma generate

# Build NestJS (now /public has React build already)
RUN npm run build

# --- Production image ---
FROM node:20-alpine

WORKDIR /app

# Copy only built files and node_modules
COPY --from=builder /app /app

RUN apk add --no-cache curl postgresql-client

EXPOSE 3000

CMD ["./docker-start.sh"]
