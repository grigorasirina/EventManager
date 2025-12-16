# Event Manager

A full‑stack **Event Management Platform** where staff can create events and users can sign up for them. Events can be **free or paid**, with payments handled securely via Stripe. The project is built with a modern JavaScript/TypeScript stack and hosted entirely on free tiers.

---

##  Features

- Staff can create and manage events
- Users can browse events and sign up
- Supports **free and paid events**
- Secure payment flow using **Stripe Checkout** (no card data stored)
- Google Calendar integration (add events to calendar)
- Responsive and accessible UI
- Role‑based access (staff vs users)

---

##  Tech Stack

### Frontend
- **Next.js (App Router)**
- **TypeScript**
- **Tailwind CSS**
- **shadcn/ui + Radix UI** (accessible components)
- **TanStack Query (React Query)**
- **React Hook Form + Zod**

### Backend
- **Node.js + Express.js**
- **TypeScript**
- **Prisma ORM**

### Database
- **PostgreSQL (Neon – free tier)**

### Payments & Integrations
- **Stripe Checkout** (payments)
- **Google Calendar API**

### Hosting (Free Tiers)
- **Vercel** – Frontend
- **Render** – Backend API
- **Neon** – PostgreSQL database

---

##  Project Structure

```
event-platform/
  apps/
    web/    # Next.js frontend
    api/    # Express backend
```

---

##  Security Considerations

- No payment or card data is stored in the application
- All payments are handled by Stripe Checkout
- Database credentials are stored in backend environment variables only
- HTTPS is enforced by hosting providers
- Prisma ORM prevents SQL injection

---

##  Environment Variables

### Backend (`apps/api/.env`)
```
DATABASE_URL=postgresql://...
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
PORT=4000
```

### Frontend (`apps/web/.env.local`)
```
NEXT_PUBLIC_API_URL=http://localhost:4000
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
```

---

##  Running the Project Locally

### 1️⃣ Clone the repository
```
git clone https://github.com/grigorasirina/EventManager.git
cd EventManager
```

### 2️⃣ Install dependencies

Frontend:
```
cd apps/web
pnpm install
pnpm dev
```

Backend:
```
cd apps/api
pnpm install
pnpm dev
```

### 3️⃣ Database setup

- Create a free PostgreSQL database on **Neon**
- Add the connection string to `apps/api/.env`
- Run migrations:
```
pnpm prisma migrate dev
```

### 4️⃣ Open the app
- Frontend: http://localhost:3000
- Backend API: http://localhost:4000

---

##  Database Management

- Run Prisma Studio:
```
pnpm prisma studio
```
- Migrations are stored in `apps/api/prisma/migrations`

---

##  Notes

- Free events are represented by `priceCents = 0`
- Paid events have `priceCents > 0`
- Payment state is tracked per signup (`NOT_REQUIRED`, `PENDING`, `PAID`)

---

##  Future Improvements

- User authentication via OAuth
- Event capacity enforcement
- Refund handling
- Admin analytics dashboard

---

##  UNLICENSED

This software is proprietary and confidential.
Unauthorized copying, modification, distribution, or use of this software,
via any medium, is strictly prohibited.

All rights reserved.


