# Chandra Mani Mishra — Portfolio

A full-stack portfolio platform built with Next.js 16, TypeScript, Tailwind CSS and SQLite.

## Stack

| Layer | Tech |
|---|---|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS v4 |
| Animation | Framer Motion |
| Database | SQLite via Prisma 5 |
| Auth | NextAuth.js v5 (credentials) |
| Icons | Lucide React |
| Fonts | Geist + Playfair Display |

## Project Structure

```
src/
├── app/
│   ├── page.tsx              # Home
│   ├── portfolio/            # Portfolio listing + detail
│   ├── about/                # About page
│   ├── services/             # Services page
│   ├── contact/              # Contact page
│   ├── admin/                # Protected admin dashboard
│   │   ├── page.tsx          # Dashboard overview
│   │   ├── projects/         # CRUD for projects
│   │   ├── media/            # Media library
│   │   ├── testimonials/     # Manage testimonials
│   │   ├── messages/         # Contact submissions
│   │   └── settings/         # Site settings
│   └── api/
│       ├── auth/             # NextAuth handlers
│       └── upload/           # File upload API
├── components/
│   ├── ui/                   # Button, Input, Modal, etc.
│   ├── layout/               # Navbar, Footer, PublicLayout
│   ├── home/                 # Hero, Ticker, FeaturedWork, etc.
│   ├── portfolio/            # PortfolioGrid with search+filter
│   ├── contact/              # ContactForm
│   └── admin/                # Admin-specific components
├── lib/
│   ├── auth.ts               # NextAuth config
│   ├── db.ts                 # Prisma client singleton
│   ├── utils.ts              # cn(), formatDate(), etc.
│   └── actions/              # Server Actions
│       ├── projects.ts
│       ├── settings.ts
│       ├── contact.ts
│       └── testimonials.ts
└── types/
    ├── index.ts              # Domain types
    └── next-auth.d.ts        # Session type extensions
```

## Getting Started

```bash
# Install dependencies
npm install

# Set up database
npx prisma db push

# Seed with admin user + default settings
node prisma/seed.js

# Start dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Admin Access

Go to [http://localhost:3000/admin/login](http://localhost:3000/admin/login)

Default credentials (change immediately in production):
- **Email:** `admin@portfolio.com`
- **Password:** `Admin@123`

## Admin Features

- **Projects** — Create, edit, delete, reorder, mark featured, publish/draft
- **Media Library** — Upload images/videos/PDFs, organized in folders
- **Testimonials** — Add, toggle published, delete
- **Messages** — View contact form submissions, mark read
- **Settings** — Edit all site content, stats, SEO, social links

## Environment Variables

```env
DATABASE_URL="file:./prisma/dev.db"
NEXTAUTH_SECRET="your-secret-min-32-chars"
NEXTAUTH_URL="http://localhost:3000"
```

## Production Deployment

1. Set environment variables on your host
2. Run `npx prisma db push` on the server
3. Run `node prisma/seed.js` (first time only)
4. Run `npm run build && npm start`

For Vercel, use a persistent database (PostgreSQL via Neon/Supabase) instead of SQLite — just change the `provider` in `prisma/schema.prisma` and update `DATABASE_URL`.

## Changing Password

Go to **Admin → Settings** — password change UI can be added, or update directly:

```bash
node -e "
const bcrypt = require('bcryptjs');
const {PrismaClient} = require('@prisma/client');
const db = new PrismaClient();
bcrypt.hash('NewPassword123', 12).then(h => 
  db.user.update({where:{email:'admin@portfolio.com'}, data:{password:h}})
).then(() => { console.log('Done'); db.\$disconnect(); });
"
```
