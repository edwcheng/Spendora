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

### Prerequisites

- Node.js 20+
- Bun (recommended) or npm
- PostgreSQL database (Neon, Supabase, Railway, or local)

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd spendora

# Install dependencies
bun install

# Set up environment variables
cp backend/.env.example backend/.env
# Edit backend/.env with your database URL and JWT secret

# Generate Prisma client and push schema
bun run db:generate
bun run db:push

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

## 🌐 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/auth/register` | Register new user |
| POST | `/auth/login` | Login user |
| GET | `/auth/profile` | Get current user |
| GET | `/expenses` | List expenses (paginated) |
| POST | `/expenses` | Create expense |
| PATCH | `/expenses/:id` | Update expense |
| DELETE | `/expenses/:id` | Delete expense |
| GET | `/categories` | List categories |
| POST | `/categories` | Create custom category |
| GET | `/summary` | Get spending summary |
| GET | `/export/csv` | Export expenses as CSV |
| POST | `/expenses/agent` | AI agent endpoint (protected) |

API Documentation: `http://localhost:3001/api/docs` (Swagger)

## ☁️ Vercel Deployment

### Backend (Serverless)

1. **Configure `vercel.json`** for serverless deployment:

```json
{
  "version": 2,
  "builds": [
    {
      "src": "backend/src/main.ts",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/api/(.*)",
      "dest": "backend/src/main.ts"
    }
  ]
}
```

2. **Set environment variables** in Vercel dashboard:
   - `DATABASE_URL`
   - `JWT_SECRET`
   - `FRONTEND_URL`

3. **Deploy**:
   ```bash
   vercel --prod
   ```

### Frontend (Static)

1. Update `frontend/.env.production` with backend URL
2. Deploy via Vercel's auto-detection or:
   ```bash
   cd frontend && vercel --prod
   ```

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
