import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { google } from "googleapis";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { eventId } = (await req.json().catch(() => ({}))) as { eventId?: string };
  if (!eventId) return NextResponse.json({ error: "eventId required" }, { status: 400 });

  const user = await prisma.user.findUnique({ where: { email: session.user.email } });
  if (!user) return NextResponse.json({ error: "User not found" }, { status: 500 });

  // Must be signed up
  const signup = await prisma.signup.findUnique({
    where: { userId_eventId: { userId: user.id, eventId } },
    include: { event: true },
  });
  if (!signup) return NextResponse.json({ error: "Not signed up" }, { status: 403 });

  // Paid events must be PAID
  if (signup.event.priceCents > 0 && signup.paymentStatus !== "PAID") {
    return NextResponse.json({ error: "Payment not completed" }, { status: 403 });
  }

  // Get user's Google refresh token from Account table
  const account = await prisma.account.findFirst({
    where: { userId: user.id, provider: "google" },
  });

  const refreshToken = account?.refresh_token;
  if (!refreshToken) {
    return NextResponse.json(
      { error: "No Google refresh token. Please sign out and sign in again (consent)." },
      { status: 400 }
    );
  }

  const oauth2 = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID!,
    process.env.GOOGLE_CLIENT_SECRET!
  );

  oauth2.setCredentials({ refresh_token: refreshToken });

  const calendar = google.calendar({ version: "v3", auth: oauth2 });

  const created = await calendar.events.insert({
    calendarId: "primary",
    requestBody: {
      summary: signup.event.title,
      description: signup.event.description ?? undefined,
      location: signup.event.location ?? undefined,
      start: { dateTime: signup.event.startsAt.toISOString() },
      end: { dateTime: signup.event.endsAt.toISOString() },
    },
  });

  return NextResponse.json({
    ok: true,
    googleEventId: created.data.id,
    htmlLink: created.data.htmlLink,
  });
}
