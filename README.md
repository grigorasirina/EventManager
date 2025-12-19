Event Manager Platform

A full-stack Event Management & Booking Platform built with Next.js, Prisma, and PostgreSQL, supporting free & paid events, role-based access, Google authentication, Stripe payments, and Google Calendar integration.

This project is designed as a modern production-style showcase using a single Next.js full-stack application (no separate backend service).

Features
Public

Browse all upcoming events
View detailed event pages
Free & paid events support
Users (Google Auth)
Sign up for events
View registered events
Pay for paid events via Stripe
Add confirmed events to Google Calendar

Staff

Create events
Edit and delete events
View event attendees

Admin

Full staff access
Manage users
Promote users to staff/admin (auto-admin via env variable)

Tech Stack
Frontend & Backend

Next.js 16 (App Router, Server Components)
TypeScript
Tailwind CSS

Authentication

NextAuth / Auth.js
Google OAuth

Database

PostgreSQL
Prisma ORM
Hosted on Neon (serverless Postgres)

Payments

Stripe
Webhooks for payment confirmation

Calendar

Google Calendar API
Adds confirmed events to user calendars

Deployment

Vercel (single app deployment)
Neon for database hosting

Project Structure

apps/
 └─ web/                # Full-stack Next.js app
    ├─ src/
    │  ├─ app/          # App Router (pages + API routes)
    │  ├─ lib/          # Prisma, auth, helpers
    │  └─ components/  # UI components
    ├─ prisma/          # Prisma schema & migrations
    └─ package.json

Database (PostgreSQL)
Hosting

The database is hosted on Neon (https://neon.tech), a serverless PostgreSQL provider.

Connection String

Neon provides a PostgreSQL connection URL that looks like:
postgresql://USER:PASSWORD@HOST/DATABASE?sslmode=require

This string must be stored as an environment variable.

Environment Variables

Create a .env.local file inside apps/web for local development.

Required Variables
# Database (Neon PostgreSQL)
DATABASE_URL=postgresql://...

# Auth
NEXTAUTH_SECRET=your-random-secret
ADMIN_EMAIL=admin@example.com

# Google OAuth
GOOGLE_CLIENT_ID=xxxxxxxx.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=xxxxxxxx

# Stripe
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...


How to Obtain API Keys
1️⃣ Neon (PostgreSQL)

Create a project at https://neon.tech

Copy the connection string

Set it as DATABASE_URL

2️⃣ Google OAuth (Login + Calendar)

Go to https://console.cloud.google.com

Create a project

Enable:

Google Identity
Google Calendar API
Create OAuth credentials:

Authorized origin:

http://localhost:3000

Redirect URI:

http://localhost:3000/api/auth/callback/google

GOOGLE_CLIENT_ID

GOOGLE_CLIENT_SECRET

For production (Vercel), update URLs to your deployed domain.

3️⃣ Stripe (Payments)

Create an account at https://stripe.com

Use Test mode


Secret key → STRIPE_SECRET_KEY

Create a webhook endpoint:

https://your-domain.vercel.app/api/stripe/webhook


Copy webhook signing secret → STRIPE_WEBHOOK_SECRET

Local Development
cd apps/web
pnpm install
pnpm prisma generate
pnpm prisma migrate dev
pnpm dev


Visit:

http://localhost:3000

Deployment (Vercel)

Push repository to GitHub

Import project in Vercel

Set Root Directory to:

apps/web


Add all environment variables in Vercel dashboard

Deploy

Post-deploy checklist

Update Google OAuth redirect URI to production domain

Update Stripe webhook URL to production domain

Design Decisions

Single full-stack Next.js app (simpler deployment)

Server Components + Prisma (no internal HTTP calls)

Role-based access enforced server-side

External managed DB (Neon) for reliability

Notes

Payments run in Stripe test mode

Google Calendar requires consent on first sign-in

Admin role is auto-assigned based on ADMIN_EMAIL

License

This project is developed as a commercial / paid development project.
All rights reserved unless otherwise stated.
