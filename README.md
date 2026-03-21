# 💸 Spendora

**Spendora** is a modern, elegant personal expense tracker built with Vue 3 + NestJS. Track your spending, visualize patterns, and take control of your finances with a beautiful, intuitive interface.

![Spendora](https://via.placeholder.com/1200x600/1a1a2e/ffffff?text=Spendora)

## ✨ Features

- 🔐 **Secure Authentication** - Email/password login with JWT tokens
- 💰 **Expense Tracking** - Add, edit, delete expenses with categories
- 📊 **Visual Dashboard** - Pie charts and trend lines powered by Chart.js
- 📅 **Date Filtering** - This month, last 3/6/12 months, or custom range
- 🔄 **Recurring Expenses** - Track monthly recurring payments
- 🏷️ **Custom Categories** - Predefined + user-defined expense categories
- 📤 **CSV Export** - Download your data for external analysis
- 🌙 **Dark Mode** - Beautiful light and dark themes
- 📱 **Mobile-First** - Responsive design optimized for all devices
- 🇭🇰 **HKD Currency** - Formatted for Hong Kong Dollar (HK$)
- 🐳 **Docker Ready** - Full Docker and Docker Compose support

## 🏗️ Architecture

```
spendora/
├── frontend/          # Vue 3 + Vite + TypeScript
│   ├── src/
│   │   ├── components/   # Reusable Vue components
│   │   ├── views/        # Page components
│   │   ├── stores/       # Pinia state management
│   │   ├── composables/  # Vue composition functions
│   │   ├── router/       # Vue Router configuration
│   │   └── utils/        # Utility functions
│   └── ...
├── backend/           # NestJS + Prisma + PostgreSQL
│   ├── src/
│   │   ├── modules/      # Feature modules
│   │   ├── common/       # Shared utilities
│   │   └── prisma/       # Prisma client
│   └── prisma/
│       └── schema.prisma # Database schema
└── package.json       # Monorepo root config
```

## 🚀 Quick Start

### Option 1: Docker (Recommended)

The fastest way to get started - everything runs in containers!

```bash
# Clone the repository
git clone https://github.com/edwcheng/Spendora.git
cd Spendora

# Start development environment
make dev

# Or using the shell script
bash docker-start.sh dev
```

**That's it!** 🎉

| Service | URL |
|---------|-----|
| Frontend | http://localhost:5173 |
| Backend API | http://localhost:3001/api |
| API Docs (Swagger) | http://localhost:3001/api/docs |
| Database Admin (Adminer) | http://localhost:8080 |

#### Docker Commands

```bash
make dev       # Start development environment (hot reload)
make prod      # Start production environment
make stop      # Stop all containers
make clean     # Remove all containers and volumes
make logs      # View container logs
make seed      # Seed database with default categories
make db        # Open Prisma Studio
make ps        # Show running containers
```

### Option 2: Local Development

#### Prerequisites

- Node.js 20+
- Bun (recommended) or npm
- PostgreSQL database

#### Installation

```bash
# Clone the repository
git clone https://github.com/edwcheng/Spendora.git
cd Spendora

# Install dependencies
bun install

# Set up environment variables
cp backend/.env.example backend/.env
# Edit backend/.env with your database URL and JWT secret

# Generate Prisma client and push schema
bun run db:generate
bun run db:push
bun run db:seed

# Start development servers
bun run dev
```

### Environment Variables

Create `backend/.env`:

```env
DATABASE_URL="postgresql://user:password@localhost:5432/spendora?schema=public"
JWT_SECRET="your-super-secret-jwt-key-here"
JWT_EXPIRES_IN="7d"
FRONTEND_URL="http://localhost:5173"
```

## 🐳 Docker Configuration

### Services

| Service | Port | Description |
|---------|------|-------------|
| `frontend` | 5173 (dev) / 3000 (prod) | Vue 3 application |
| `backend` | 3001 | NestJS API |
| `postgres` | 5432 | PostgreSQL database |
| `adminer` | 8080 | Database admin UI (dev only) |

### Development vs Production

```bash
# Development (hot reload, Adminer, debug tools)
make dev

# Production (optimized builds, nginx)
make prod
```

### Docker Files Structure

```
spendora/
├── docker-compose.yml          # Production config
├── docker-compose.dev.yml      # Development overrides
├── docker-start.sh             # Quick start script
├── Makefile                    # Convenient commands
├── backend/
│   ├── Dockerfile              # Production build
│   ├── Dockerfile.dev          # Development build
│   └── .dockerignore
└── frontend/
    ├── Dockerfile              # Production (nginx)
    ├── Dockerfile.dev          # Development build
    ├── nginx.conf              # Nginx configuration
    └── .dockerignore
```

## 📦 Tech Stack

### Frontend
- **Vue 3** - Progressive JavaScript framework
- **Vite** - Lightning-fast build tool
- **TypeScript** - Type-safe JavaScript
- **Tailwind CSS** - Utility-first CSS framework
- **daisyUI** - Beautiful component library
- **Pinia** - Vue state management
- **Vue Router** - Official Vue router
- **VueUse** - Vue composition utilities
- **TanStack Query** - Powerful data fetching
- **Chart.js** - Beautiful charts

### Backend
- **NestJS** - Progressive Node.js framework
- **Prisma** - Next-generation ORM
- **PostgreSQL** - Relational database
- **Passport.js** - Authentication middleware
- **JWT** - JSON Web Tokens
- **Swagger** - API documentation

### Infrastructure
- **Docker** - Containerization
- **Nginx** - Frontend server (production)
- **Adminer** - Database management UI

## 🌐 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | Login user |
| GET | `/api/auth/profile` | Get current user |
| GET | `/api/expenses` | List expenses (paginated) |
| POST | `/api/expenses` | Create expense |
| PATCH | `/api/expenses/:id` | Update expense |
| DELETE | `/api/expenses/:id` | Delete expense |
| GET | `/api/categories` | List categories |
| POST | `/api/categories` | Create custom category |
| GET | `/api/summary` | Get spending summary |
| GET | `/api/export/csv` | Export expenses as CSV |
| POST | `/api/expenses/agent` | AI agent endpoint (protected) |

API Documentation: `http://localhost:3001/api/docs` (Swagger)

## ☁️ Vercel Deployment

### Backend (Serverless)

1. Set environment variables in Vercel dashboard:
   - `DATABASE_URL`
   - `JWT_SECRET`
   - `FRONTEND_URL`

2. Deploy:
   ```bash
   vercel --prod
   ```

### Frontend (Static)

1. Update `frontend/.env.production` with backend URL
2. Deploy via Vercel's auto-detection

### Database Options

- **Neon** (Recommended): Serverless PostgreSQL, free tier available
- **Supabase**: PostgreSQL with real-time features
- **Railway**: Simple PostgreSQL hosting

## 🧪 Local Development

```bash
# Run both frontend and backend
bun run dev

# Run frontend only (port 5173)
bun run dev:frontend

# Run backend only (port 3001)
bun run dev:backend

# Database operations
bun run db:studio    # Open Prisma Studio
bun run db:push      # Push schema changes
bun run db:migrate   # Run migrations
```

## 🎨 Design System

Spendora uses a calm, premium fintech aesthetic:

- **Primary Color**: Emerald green (`#10B981`)
- **Glassmorphism**: Subtle blur effects and soft shadows
- **Rounded Corners**: `rounded-xl` throughout
- **Dark Mode**: Full dark theme support
- **Mobile-First**: Touch-friendly, responsive design

## 📄 License

MIT License - feel free to use for personal or commercial projects.

---

Built with ❤️ by the Spendora Team
