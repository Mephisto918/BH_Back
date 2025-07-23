# Base image
FROM node:20-alpine

# Create app directory
WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm install

# Copy everything
COPY . .

# Generate Prisma client
RUN npx prisma generate

# Build the project
RUN npm run build

# Expose Nest port
EXPOSE 3000

# Start server + migrate + seed
RUN apk add --no-cache curl
COPY docker-scripts/docker-start.sh ./
COPY wait-for-db.sh ./
RUN chmod +x docker-start.sh
RUN chmod +x wait-for-db.sh
CMD ["./docker-start.sh"]
