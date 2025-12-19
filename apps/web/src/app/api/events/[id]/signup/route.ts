import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id: eventId } = await params;

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  });

  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 500 });
  }

  const event = await prisma.event.findUnique({ where: { id: eventId } });
  if (!event) return NextResponse.json({ error: "Event not found" }, { status: 404 });

  try {
    const signup = await prisma.signup.create({
      data: {
        userId: user.id,
        eventId,
        paymentStatus: event.priceCents > 0 ? "PENDING" : "NOT_REQUIRED",
      },
    });

    return NextResponse.json({
      signup,
      requiresPayment: event.priceCents > 0,
    });
  } catch {
    return NextResponse.json({ error: "Already signed up" }, { status: 409 });
  }
}
