import Stripe from "stripe";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendPaymentSuccessEmail } from "@/lib/email";

export const dynamic = "force-dynamic";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-01-27.acacia",
});

export async function POST(req: Request) {
  const sig = req.headers.get("stripe-signature");
  if (!sig) return NextResponse.json({ error: "Missing stripe-signature" }, { status: 400 });

  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!webhookSecret) return NextResponse.json({ error: "Missing STRIPE_WEBHOOK_SECRET" }, { status: 500 });

  const body = await req.text();

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, sig, webhookSecret);
  } catch (err: any) {
    return NextResponse.json({ error: `Webhook signature verification failed: ${err.message}` }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;

    const signupId =
      session.metadata?.signupId ||
      session.client_reference_id ||
      null;

    if (signupId) {
      await prisma.signup.update({
        where: { id: signupId },
        data: {
          paymentStatus: "PAID",
          stripePaymentIntentId:
            typeof session.payment_intent === "string" ? session.payment_intent : null,
        },
      });
      const updated = await prisma.signup.findUnique({
        where: { id: signupId },
        include: { user: true, event: true },
      });

      if (updated?.user?.email && updated?.event?.title) {
        await sendPaymentSuccessEmail({
          to: updated.user.email,
          eventTitle: updated.event.title,
          eventId: updated.event.id,
        });
}

    }
  }

  return NextResponse.json({ received: true });
}
