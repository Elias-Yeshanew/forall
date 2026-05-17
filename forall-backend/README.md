# Forall Backend

Express + PostgreSQL + Prisma API for the Forall Broker Platform

## Stack
- **Express.js** + TypeScript
- **PostgreSQL** + **Prisma ORM**
- **JWT** authentication (access + refresh tokens)
- **bcryptjs** password hashing
- **Zod** request validation
- **Cloudinary** image uploads
- **Nodemailer** email notifications
- **Jest + Supertest** tests

## Quick Start

```bash
npm install

# 1. Copy and fill in your environment variables
cp .env .env.local

# 2. Create database and run migrations
npx prisma migrate dev --name init

# 3. Seed with sample data
npm run db:seed

# 4. Start dev server
npm run dev
```

Server starts at: `http://localhost:5000`

## Seed Login Credentials
```
Admin:  admin@forall.et  / Admin@123
Sales:  sales1@forall.et / Sales@123
```

## API Endpoints

### Auth
| Method | Route              | Access  | Description          |
|--------|--------------------|---------|----------------------|
| POST   | /api/auth/login    | Public  | Staff login          |
| POST   | /api/auth/refresh  | Public  | Refresh access token |
| POST   | /api/auth/logout   | Public  | Clear refresh cookie |
| GET    | /api/auth/me       | Staff   | Get current user     |

### Listings
| Method | Route                        | Access  | Description                        |
|--------|------------------------------|---------|------------------------------------|
| GET    | /api/listings                | Public  | Browse listings (no poster info)   |
| GET    | /api/listings/stats          | Public  | Listing counts                     |
| GET    | /api/listings/:id            | Public  | Single listing (no poster info)    |
| POST   | /api/listings                | Public  | Submit new listing                 |
| POST   | /api/listings/upload         | Public  | Upload images                      |
| GET    | /api/listings/admin          | Staff   | All listings WITH poster info      |
| GET    | /api/listings/:id/poster     | Staff   | Poster contact details only        |
| PUT    | /api/listings/:id            | Staff   | Update listing                     |
| PATCH  | /api/listings/:id/status     | Staff   | Approve / reject listing           |
| DELETE | /api/listings/:id            | Admin   | Delete listing                     |

### Contacts
| Method | Route               | Access  | Description                    |
|--------|---------------------|---------|--------------------------------|
| POST   | /api/contacts       | Public  | Submit inquiry (→ sales team)  |
| GET    | /api/contacts       | Staff   | View all inquiries             |
| GET    | /api/contacts/stats | Staff   | Inquiry counts                 |
| PATCH  | /api/contacts/:id   | Staff   | Update inquiry status          |

### Users
| Method | Route          | Access | Description         |
|--------|----------------|--------|---------------------|
| GET    | /api/users     | Admin  | List all staff      |
| POST   | /api/users     | Admin  | Create staff member |
| PUT    | /api/users/:id | Admin  | Update staff member |
| DELETE | /api/users/:id | Admin  | Remove staff member |

## Privacy Architecture

The key security rule is enforced at the **service layer**:

- `getListingsService()` uses `SELECT` that **excludes** the `poster` relation → public never sees it
- `getListingsAdminService()` uses `SELECT` that **includes** `poster` → staff only
- `GET /api/listings/:id/poster` is guarded by `authenticate + staffOnly` middleware

Even if someone calls the API directly, they cannot access poster details without a valid staff JWT.

## Running Tests

```bash
npm test
```

Tests cover: auth login/refresh, listing CRUD, role guard (public/sales/admin), poster privacy.
