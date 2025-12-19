import Stripe from "stripe";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-01-27.acacia",
});

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { eventId } = (await req.json().catch(() => ({}))) as { eventId?: string };
  if (!eventId) return NextResponse.json({ error: "eventId required" }, { status: 400 });

  const user = await prisma.user.findUnique({ where: { email: session.user.email } });
  if (!user) return NextResponse.json({ error: "User not found" }, { status: 500 });

  const event = await prisma.event.findUnique({ where: { id: eventId } });
  if (!event) return NextResponse.json({ error: "Event not found" }, { status: 404 });

  if (event.priceCents <= 0) {
    return NextResponse.json({ error: "Event is free" }, { status: 400 });
  }

  // Find the user's signup (should already exist and be PENDING from signup step)
  const signup = await prisma.signup.findUnique({
    where: { userId_eventId: { userId: user.id, eventId } },
  });

  if (!signup) {
    return NextResponse.json({ error: "Signup not found. Please click Sign up first." }, { status: 400 });
  }

  if (signup.paymentStatus === "PAID") {
    return NextResponse.json({ error: "Already paid" }, { status: 409 });
  }

  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

  const checkout = await stripe.checkout.sessions.create({
    mode: "payment",
    client_reference_id: signup.id,
    metadata: { signupId: signup.id, eventId: event.id },
    line_items: [
      {
        quantity: 1,
        price_data: {
          currency: (event.currency || "GBP").toLowerCase(),
          unit_amount: event.priceCents,
          product_data: {
            name: event.title,
            description: event.description ?? undefined,
          },
        },
      },
    ],
    success_url: `${appUrl}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${appUrl}/payment/cancel`,
  });

  await prisma.signup.update({
    where: { id: signup.id },
    data: { stripeSessionId: checkout.id },
  });

  return NextResponse.json({ url: checkout.url });
}
