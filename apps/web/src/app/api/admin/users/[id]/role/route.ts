import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin";
import { prisma } from "@/lib/prisma";

type Role = "USER" | "STAFF" | "ADMIN";

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const gate = await requireAdmin();
  if (!gate.ok) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const { id: targetUserId } = await params;

  const body = await req.json().catch(() => ({}));
  const nextRole = body?.role as Role | undefined;

  if (!nextRole || !["USER", "STAFF", "ADMIN"].includes(nextRole)) {
    return NextResponse.json({ error: "Invalid role" }, { status: 400 });
  }

  const target = await prisma.user.findUnique({ where: { id: targetUserId } });
  if (!target) return NextResponse.json({ error: "User not found" }, { status: 404 });

  // Safety: don’t allow demoting the LAST admin
  if (target.role === "ADMIN" && nextRole !== "ADMIN") {
    const adminCount = await prisma.user.count({ where: { role: "ADMIN" } });
    if (adminCount <= 1) {
      return NextResponse.json(
        { error: "Cannot demote the last ADMIN" },
        { status: 400 }
      );
    }
  }

  const updated = await prisma.user.update({
    where: { id: targetUserId },
    data: { role: nextRole },
    select: { id: true, email: true, role: true },
  });

  return NextResponse.json({ ok: true, user: updated });
}
