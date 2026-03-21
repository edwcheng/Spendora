# Spendora - GitHub Repository Information

> ⚠️ **Important**: Keep this file for future sessions reference

## Repository Details

| Property | Value |
|----------|-------|
| **Repository Name** | Spendora |
| **Owner** | edwcheng |
| **GitHub URL** | https://github.com/edwcheng/Spendora |
| **Clone URL (HTTPS)** | https://github.com/edwcheng/Spendora.git |
| **Clone URL (SSH)** | git@github.com:edwcheng/Spendora.git |
| **Main Branch** | main |
| **Visibility** | Public |

## Local Paths

| Path | Description |
|------|-------------|
| **Project Root** | `/home/z/my-project/spendora` |
| **Frontend** | `/home/z/my-project/spendora/frontend` |
| **Backend** | `/home/z/my-project/spendora/backend` |
| **Prisma Schema** | `/home/z/my-project/spendora/backend/prisma/schema.prisma` |

## Authentication

> 🔐 **Note**: Ask user @edwcheng for GitHub token when needed for push operations

## Quick Commands

### Docker (Recommended)
```bash
# Navigate to project
cd /home/z/my-project/spendora

# Development environment (hot reload)
make dev

# Production environment
make prod

# Stop all containers
make stop

# View logs
make logs

# Clean up everything
make clean
```

### Local Development (without Docker)

### Git Operations
```bash
# Navigate to project
cd /home/z/my-project/spendora

# Check status
git status

# Pull latest changes
git pull origin main

# Push changes
git add .
git commit -m "your message"
git push origin main
```

### Development
```bash
# Install dependencies
bun install

# Run both frontend and backend
bun run dev

# Run frontend only (port 5173)
bun run dev:frontend

# Run backend only (port 3001)
bun run dev:backend

# Database operations
bun run db:generate   # Generate Prisma client
bun run db:push       # Push schema to database
bun run db:studio     # Open Prisma Studio
```

## Project Structure

```
spendora/
├── package.json          # Monorepo root
├── turbo.json           # Build orchestration
├── README.md            # Documentation
├── .gitignore
│
├── frontend/            # Vue 3 + Vite
│   ├── src/
│   │   ├── components/  # Vue components
│   │   ├── views/       # Page views
│   │   ├── stores/      # Pinia stores
│   │   ├── router/      # Vue Router
│   │   └── utils/       # Helpers
│   └── package.json
│
└── backend/             # NestJS + Prisma
    ├── src/
    │   ├── modules/     # auth, expenses, categories, etc.
    │   ├── common/      # Guards, decorators, filters
    │   └── prisma/      # Prisma service
    ├── prisma/
    │   └── schema.prisma
    └── package.json
```

## Environment Variables

### Backend (.env)
```env
DATABASE_URL="postgresql://user:password@host:5432/spendora"
JWT_SECRET="your-jwt-secret"
JWT_EXPIRES_IN="7d"
FRONTEND_URL="http://localhost:5173"
AI_AGENT_API_KEY="your-api-key"  # Optional
```

### Frontend (.env)
```env
VITE_API_URL=http://localhost:3001/api
```

## API Endpoints

| Endpoint | Description |
|----------|-------------|
| `POST /api/auth/register` | Register user |
| `POST /api/auth/login` | Login |
| `GET /api/auth/profile` | Get profile |
| `GET /api/expenses` | List expenses |
| `POST /api/expenses` | Create expense |
| `PATCH /api/expenses/:id` | Update expense |
| `DELETE /api/expenses/:id` | Delete expense |
| `GET /api/categories` | List categories |
| `POST /api/categories` | Create category |
| `GET /api/summary` | Spending summary |
| `GET /api/export/csv` | Export CSV |
| `POST /api/expenses/agent` | AI agent (API key) |
| `GET /api/docs` | Swagger documentation |

## Tech Stack

- **Frontend**: Vue 3, Vite, TypeScript, Tailwind CSS, daisyUI, Chart.js, Pinia, TanStack Query
- **Backend**: NestJS, Prisma, PostgreSQL, Passport.js, JWT, Swagger
- **Build**: Turbo (monorepo), Bun
- **Deployment**: Vercel (serverless ready)

---
*Last updated: 2024-03-22*
