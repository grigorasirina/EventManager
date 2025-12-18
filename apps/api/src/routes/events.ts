import { Router } from "express";
import { z } from "zod";
import { prisma } from "../lib/prisma";
import { requireStaff, requireUser, type AuthedRequest } from "../middleware/auth";

export const eventsRouter = Router();

// ---- Validation ----
const eventCreateSchema = z.object({
  title: z.string().min(2),
  description: z.string().optional(),
  location: z.string().optional(),
  startsAt: z.string().datetime(), // ISO string from FE
  endsAt: z.string().datetime(),   // ISO string from FE
  capacity: z.number().int().positive().optional(),
  priceCents: z.number().int().min(0).optional().default(0),
  currency: z.string().min(3).max(3).optional().default("GBP"),
});

const eventUpdateSchema = eventCreateSchema.partial();

// ---- Public endpoints ----

// GET /events (public)
eventsRouter.get("/", async (_req, res) => {
  const events = await prisma.event.findMany({
    orderBy: { startsAt: "asc" },
  });
  res.json(events);
});

// GET /events/:id (public)
eventsRouter.get("/:id", async (req, res) => {
  const { id } = req.params;

  const event = await prisma.event.findUnique({ where: { id } });
  if (!event) return res.status(404).json({ error: "Event not found" });

  res.json(event);
});

// ---- Staff endpoints ----

// POST /events (staff-only)
eventsRouter.post("/", requireStaff, async (req: AuthedRequest, res) => {
  const parsed = eventCreateSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });

  const data = parsed.data;

  const created = await prisma.event.create({
    data: {
      title: data.title,
      description: data.description,
      location: data.location,
      startsAt: new Date(data.startsAt),
      endsAt: new Date(data.endsAt),
      capacity: data.capacity,
      priceCents: data.priceCents,
      currency: data.currency,
      createdById: req.user!.id,
    },
  });

  res.status(201).json(created);
});

// PUT /events/:id (staff-only)
eventsRouter.put("/:id", requireStaff, async (req: AuthedRequest, res) => {
  const { id } = req.params;

  const parsed = eventUpdateSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });

  const existing = await prisma.event.findUnique({ where: { id } });
  if (!existing) return res.status(404).json({ error: "Event not found" });

  // Optional ownership check (recommended):
  // if (existing.createdById !== req.user!.id && req.user!.role !== "ADMIN") return res.status(403).json({ error: "Not allowed" });

  const data = parsed.data;

  const updated = await prisma.event.update({
    where: { id },
    data: {
      ...(data.title !== undefined ? { title: data.title } : {}),
      ...(data.description !== undefined ? { description: data.description } : {}),
      ...(data.location !== undefined ? { location: data.location } : {}),
      ...(data.startsAt !== undefined ? { startsAt: new Date(data.startsAt) } : {}),
      ...(data.endsAt !== undefined ? { endsAt: new Date(data.endsAt) } : {}),
      ...(data.capacity !== undefined ? { capacity: data.capacity } : {}),
      ...(data.priceCents !== undefined ? { priceCents: data.priceCents } : {}),
      ...(data.currency !== undefined ? { currency: data.currency } : {}),
    },
  });

  res.json(updated);
});

// DELETE /events/:id (staff-only)
eventsRouter.delete("/:id", requireStaff, async (req: AuthedRequest, res) => {
  const { id } = req.params;

  const existing = await prisma.event.findUnique({ where: { id } });
  if (!existing) return res.status(404).json({ error: "Event not found" });

  // Optional ownership check:
  // if (existing.createdById !== req.user!.id && req.user!.role !== "ADMIN") return res.status(403).json({ error: "Not allowed" });

  await prisma.event.delete({ where: { id } });
  res.status(204).send();
});

// ---- User endpoint ----

// POST /events/:id/signup (user)
eventsRouter.post("/:id/signup", requireUser, async (req: AuthedRequest, res) => {
  const { id: eventId } = req.params;

  const event = await prisma.event.findUnique({ where: { id: eventId } });
  if (!event) return res.status(404).json({ error: "Event not found" });

  // Create signup. For paid events, you’ll later switch this to:
  // - create Signup as PENDING
  // - create Stripe Checkout Session
  // - return session URL
  const signup = await prisma.signup.create({
    data: {
      userId: req.user!.id,
      eventId,
      paymentStatus: event.priceCents > 0 ? "PENDING" : "NOT_REQUIRED",
    },
  }).catch((e: any) => {
    // Handles @@unique([userId, eventId]) nicely
    if (e?.code === "P2002") return null;
    throw e;
  });

  if (!signup) return res.status(409).json({ error: "Already signed up" });

  res.status(201).json({
    signup,
    requiresPayment: event.priceCents > 0,
  });
});
