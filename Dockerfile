# Base image
FROM node:20-alpine

# Create app directory
WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm install

# Copy everything
COPY . .

# Add curl (required for health checks or debug)
RUN apk add --no-cache curl

# Make sure Prisma generates client
RUN npx prisma generate

# Optional: Run PostGIS extension manually with raw SQL if DB is already up — otherwise, do it in entry script
# RUN npx prisma db execute --file ./prisma/init.sql --preview-feature

# Build NestJS app
RUN npm run build

# Expose Nest port
EXPOSE 3000

# Copy and make startup script executable
COPY docker-start.sh ./
RUN chmod +x docker-start.sh

# Set entrypoint to custom shell script
CMD ["./docker-start.sh"]
