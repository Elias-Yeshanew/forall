# Forall Frontend

Ethiopia's Premium Broker Website — Cars & Houses

## Stack
- **Next.js 14** (App Router)
- **TypeScript**
- **Tailwind CSS** (custom gold/black luxury theme)
- **React Query** (server state)
- **React Hook Form + Zod** (forms & validation)
- **next-i18next** (EN + Amharic)

## Getting Started

```bash
npm install
cp .env.local.example .env.local   # fill in your API URL
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Project Structure

```
src/
├── app/
│   ├── (public)/          # No auth required
│   │   ├── page.tsx       # Home / Hero
│   │   ├── listings/      # Browse + Detail
│   │   └── post/          # Submit listing
│   ├── (auth)/            # Staff only
│   │   ├── login/         # Staff login
│   │   └── dashboard/     # Admin + Sales dashboard
│   ├── layout.tsx
│   └── providers.tsx
├── components/
│   ├── layout/            # Navbar, Footer, RoleGuard
│   ├── listings/          # ListingCard, ListingGrid, FilterBar
│   ├── forms/             # PostForm, ContactModal
│   ├── dashboard/         # KPICards, AdminTable, ContactsTable
│   └── ui/                # Button, Input, Modal, Badge
├── context/               # AuthContext (JWT + role)
├── hooks/                 # useListings, useContacts, useAuth
├── lib/                   # api.ts, auth.ts, utils.ts, validations.ts
├── types/                 # listing.ts, user.ts, contact.ts
└── i18n/                  # en.json, am.json
```

## Role-Based Access

| Feature                    | Public | Sales | Admin |
|---------------------------|--------|-------|-------|
| Browse listings            | ✅     | ✅    | ✅    |
| Post a listing             | ✅     | ✅    | ✅    |
| Contact sales team         | ✅     | ✅    | ✅    |
| See poster details         | ❌     | ✅    | ✅    |
| Manage listings (approve)  | ❌     | ✅    | ✅    |
| View contact requests      | ❌     | ✅    | ✅    |
| Manage staff users         | ❌     | ❌    | ✅    |

## Environment Variables

```
NEXT_PUBLIC_API_URL=http://localhost:5000/api
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name
```

## Backend

See `forall-backend/` for the Express + PostgreSQL + Prisma API.
