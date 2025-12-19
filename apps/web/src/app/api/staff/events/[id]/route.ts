import { NextResponse } from "next/server";
import { requireStaff } from "@/lib/staff";
import { prisma } from "@/lib/prisma";

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const gate = await requireStaff();
  if (!gate.ok) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const { id } = await params;
  const body = await req.json().catch(() => ({}));

  const {
    title,
    description,
    location,
    startsAt,
    endsAt,
    capacity,
    priceCents,
    currency,
  } = body ?? {};

  if (!title || !startsAt || !endsAt) {
    return NextResponse.json(
      { error: "title, startsAt, endsAt are required" },
      { status: 400 }
    );
  }

  const updated = await prisma.event.update({
    where: { id },
    data: {
      title,
      description: description ?? null,
      location: location ?? null,
      startsAt: new Date(startsAt),
      endsAt: new Date(endsAt),
      capacity: capacity ?? null,
      priceCents: Number(priceCents ?? 0),
      currency: currency ?? "GBP",
    },
  });

  return NextResponse.json(updated);
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const gate = await requireStaff();
  if (!gate.ok) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const { id } = await params;

  // deletes event; signups will cascade because of your schema onDelete: Cascade
  await prisma.event.delete({ where: { id } });

  return NextResponse.json({ ok: true });
}
