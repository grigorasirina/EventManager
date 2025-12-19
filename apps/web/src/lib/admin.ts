import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function requireAdmin() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) return { ok: false as const, reason: "unauthenticated" as const };

  const user = await prisma.user.findUnique({ where: { email: session.user.email } });
  if (!user) return { ok: false as const, reason: "no_user" as const };

  if (user.role !== "ADMIN") return { ok: false as const, reason: "forbidden" as const };

  return { ok: true as const, user };
}
