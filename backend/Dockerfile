# Backend Dockerfile
FROM node:20-alpine AS builder

WORKDIR /app

# Install OpenSSL and other dependencies required by Prisma
RUN apk add --no-cache openssl libc6-compat

# Install bun
RUN npm install -g bun

# Copy package files
COPY package.json bun.lockb* ./
COPY prisma ./prisma/

# Install dependencies
RUN bun install --frozen-lockfile

# Copy source files
COPY . .

# Generate Prisma client
RUN bun run db:generate

# Build the application
RUN bun run build

# Production stage
FROM node:20-alpine AS runner

WORKDIR /app

# Install OpenSSL for Prisma runtime
RUN apk add --no-cache openssl libc6-compat

# Install bun
RUN npm install -g bun

# Copy built files and dependencies
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./
COPY --from=builder /app/prisma ./prisma

# Set environment
ENV NODE_ENV=production
ENV PORT=3001

EXPOSE 3001

# Start the application
CMD ["bun", "run", "start:prod"]
