#!/bin/bash

# Spendora Docker Quick Start Script

set -e

echo "🚀 Spendora Docker Setup"
echo "========================"

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo -e "${RED}❌ Docker is not installed. Please install Docker first.${NC}"
    exit 1
fi

if ! command -v docker-compose &> /dev/null && ! docker compose version &> /dev/null; then
    echo -e "${RED}❌ Docker Compose is not installed. Please install Docker Compose first.${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Docker and Docker Compose found${NC}"

# Function to show help
show_help() {
    echo ""
    echo "Usage: ./docker-start.sh [command]"
    echo ""
    echo "Commands:"
    echo "  dev       Start development environment (with hot reload)"
    echo "  prod      Start production environment"
    echo "  stop      Stop all containers"
    echo "  clean     Stop and remove all containers, volumes, and images"
    echo "  logs      Show logs from all containers"
    echo "  db        Open Prisma Studio (development only)"
    echo "  seed      Seed the database with default categories"
    echo "  help      Show this help message"
    echo ""
}

# Parse command
COMMAND=${1:-help}

case $COMMAND in
    dev)
        echo -e "${YELLOW}📦 Starting development environment...${NC}"
        docker-compose -f docker-compose.yml -f docker-compose.dev.yml up --build -d postgres
        echo -e "${YELLOW}⏳ Waiting for database to be ready...${NC}"
        sleep 5
        docker-compose -f docker-compose.yml -f docker-compose.dev.yml up --build -d backend
        sleep 5
        docker-compose -f docker-compose.yml -f docker-compose.dev.yml run --rm backend bun run db:push
        docker-compose -f docker-compose.yml -f docker-compose.dev.yml run --rm backend bun run db:seed
        docker-compose -f docker-compose.yml -f docker-compose.dev.yml up --build -d frontend
        echo ""
        echo -e "${GREEN}✅ Development environment is running!${NC}"
        echo ""
        echo "🌐 Frontend:  http://localhost:5173"
        echo "🔌 Backend:   http://localhost:3001/api"
        echo "📚 API Docs:  http://localhost:3001/api/docs"
        echo "🗄️  Database:  localhost:5432"
        echo "🔧 Adminer:   http://localhost:8080"
        echo ""
        echo "Run './docker-start.sh logs' to see logs"
        echo "Run './docker-start.sh stop' to stop all containers"
        ;;

    prod)
        echo -e "${YELLOW}📦 Starting production environment...${NC}"
        docker-compose up --build -d
        echo ""
        echo -e "${GREEN}✅ Production environment is running!${NC}"
        echo ""
        echo "🌐 Frontend:  http://localhost:3000"
        echo "🔌 Backend:   http://localhost:3001/api"
        echo "📚 API Docs:  http://localhost:3001/api/docs"
        echo ""
        ;;

    stop)
        echo -e "${YELLOW}🛑 Stopping all containers...${NC}"
        docker-compose -f docker-compose.yml -f docker-compose.dev.yml down
        echo -e "${GREEN}✅ All containers stopped${NC}"
        ;;

    clean)
        echo -e "${YELLOW}🧹 Cleaning up...${NC}"
        docker-compose -f docker-compose.yml -f docker-compose.dev.yml down -v --rmi local
        echo -e "${GREEN}✅ Cleanup complete${NC}"
        ;;

    logs)
        echo -e "${YELLOW}📋 Showing logs...${NC}"
        docker-compose -f docker-compose.yml -f docker-compose.dev.yml logs -f
        ;;

    db)
        echo -e "${YELLOW}🗄️  Opening Prisma Studio...${NC}"
        docker-compose -f docker-compose.yml -f docker-compose.dev.yml run --rm backend bun run db:studio
        ;;

    seed)
        echo -e "${YELLOW}🌱 Seeding database...${NC}"
        docker-compose -f docker-compose.yml -f docker-compose.dev.yml run --rm backend bun run db:seed
        echo -e "${GREEN}✅ Database seeded${NC}"
        ;;

    help|*)
        show_help
        ;;
esac
