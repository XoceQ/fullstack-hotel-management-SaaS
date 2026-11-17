# 🏨 Fullstack Hotel Management SaaS

A full-stack hotel management and booking platform built with **Next.js**, **TypeScript**, **Prisma** and **Sanity**, featuring authentication, room booking, an admin panel and end-to-end tests with Cypress.

---

## Features

> Review this list and keep only what your app actually does.

**Guests**
- Browse available rooms and room details
- Select a room and create a booking
- Sign in / sign up with secure authentication (NextAuth)
- Confirmation feedback through pop-ups

**Admin**
- Admin dashboard with management functions
- Manage rooms, bookings and users
- Content managed through Sanity Studio

**Platform**
- Responsive UI with Tailwind CSS
- Type-safe database access with Prisma
- Unit tests (Jest) and end-to-end tests (Cypress)

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js (React) |
| Language | TypeScript |
| Styling | Tailwind CSS, PostCSS |
| Authentication | NextAuth.js |
| ORM / Database | Prisma + [PostgreSQL / MySQL / MongoDB: specify] |
| CMS | Sanity |
| Unit testing | Jest |
| E2E testing | Cypress |
| Linting | ESLint |
---

## Getting Started

### Prerequisites

- Node.js 18 or higher
- npm
- A running database supported by Prisma
- A Sanity project ([sanity.io](https://www.sanity.io/))

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/XoceQ/fullstack-hotel-management-SaaS.git
cd fullstack-hotel-management-SaaS

# 2. Install dependencies
npm install

# 3. Create your environment file
cp .env.example .env     # then fill in your values

# 4. Sync the database schema
npx prisma generate
npx prisma migrate dev   # or: npx prisma db push

# 5. Start the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## Environment Variables

Create a `.env` file in the project root. Variable names below are typical for this stack; **match them to the ones your code uses**.

```env
# Database
DATABASE_URL="your-database-connection-string"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="a-long-random-string"

# Sanity
NEXT_PUBLIC_SANITY_PROJECT_ID="your-project-id"
NEXT_PUBLIC_SANITY_DATASET="production"
SANITY_API_TOKEN="your-token"
```

> ⚠️ **Never commit real secrets.** Your repository currently tracks a `.env` file. Rotate any credentials it contains, make sure `.env` is ignored, remove it from tracking (`git rm --cached .env`) and commit a `.env.example` with placeholder values instead.

---

## Database (Prisma)

```bash
npx prisma generate     # Generate the client
npx prisma migrate dev  # Apply migrations in development
npx prisma studio       # Browse data in the browser
```

---

## Content Management (Sanity)

Content schemas live in `/schemas` and the studio is configured in `sanity.config.ts`.

```bash
npx sanity dev          # Start the studio locally (or open /studio if embedded)
```

---

## Testing

```bash
# Unit tests
npm test

# End-to-end tests (Cypress)
npx cypress open        # Interactive mode
npx cypress run         # Headless mode
```

---

## Available Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start the development server |
| `npm run build` | Create a production build |
| `npm start` | Run the production build |
| `npm run lint` | Lint the codebase |
| `npm test` | Run Jest tests |

> Check `package.json` and adjust this table to your real scripts.

---

## Roadmap

- [ ] Payment integration
- [ ] Email notifications for bookings
- [ ] Multi-hotel / multi-tenant support (SaaS)
- [ ] Analytics dashboard
- [ ] CI pipeline running Jest and Cypress

---

## Author

**XoceQ** — [GitHub](https://github.com/XoceQ)
