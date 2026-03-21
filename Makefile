# Spendora Docker Makefile

.PHONY: help dev prod stop clean logs seed db

help:
	@echo "Spendora Docker Commands"
	@echo "========================"
	@echo ""
	@echo "  make dev      Start development environment (hot reload)"
	@echo "  make prod     Start production environment"
	@echo "  make stop     Stop all containers"
	@echo "  make clean    Remove all containers, volumes, and images"
	@echo "  make logs     Show logs from all containers"
	@echo "  make seed     Seed database with default categories"
	@echo "  make db       Open Prisma Studio"
	@echo "  make build    Build all containers"
	@echo "  make ps       Show running containers"
	@echo ""

dev:
	docker-compose -f docker-compose.yml -f docker-compose.dev.yml up --build -d postgres
	@sleep 5
	docker-compose -f docker-compose.yml -f docker-compose.dev.yml up --build -d backend
	@sleep 5
	docker-compose -f docker-compose.yml -f docker-compose.dev.yml run --rm backend bun run db:push
	docker-compose -f docker-compose.yml -f docker-compose.dev.yml run --rm backend bun run db:seed
	docker-compose -f docker-compose.yml -f docker-compose.dev.yml up --build -d frontend
	@echo ""
	@echo "✅ Development environment running!"
	@echo "   Frontend:  http://localhost:5173"
	@echo "   Backend:   http://localhost:3001/api"
	@echo "   API Docs:  http://localhost:3001/api/docs"
	@echo "   Adminer:   http://localhost:8080"

prod:
	docker-compose up --build -d
	@echo ""
	@echo "✅ Production environment running!"
	@echo "   Frontend:  http://localhost:3000"
	@echo "   Backend:   http://localhost:3001/api"

stop:
	docker-compose -f docker-compose.yml -f docker-compose.dev.yml down

clean:
	docker-compose -f docker-compose.yml -f docker-compose.dev.yml down -v --rmi local

logs:
	docker-compose -f docker-compose.yml -f docker-compose.dev.yml logs -f

seed:
	docker-compose -f docker-compose.yml -f docker-compose.dev.yml run --rm backend bun run db:seed

db:
	docker-compose -f docker-compose.yml -f docker-compose.dev.yml run --rm backend bun run db:studio

build:
	docker-compose -f docker-compose.yml -f docker-compose.dev.yml build

ps:
	docker-compose -f docker-compose.yml -f docker-compose.dev.yml ps
