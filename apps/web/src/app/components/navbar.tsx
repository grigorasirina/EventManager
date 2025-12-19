import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import AuthButtons from "./auth-buttons";

export default async function Navbar() {
  const session = await getServerSession(authOptions);

  const me =
    session?.user?.email
      ? await prisma.user.findUnique({ where: { email: session.user.email } })
      : null;

  return (
    <header className="sticky top-0 z-40 border-b bg-white/70 backdrop-blur">
      <div className="mx-auto max-w-5xl px-4 py-3 flex items-center justify-between">
        <Link href="/" className="font-semibold tracking-tight">
          EventManager
        </Link>

        <nav className="flex items-center gap-3">
          {me ? (
            <>
              <Link className="text-sm hover:underline" href="/my-events">
                My Events
              </Link>

              {(me.role === "STAFF" || me.role === "ADMIN") && (
                <Link className="text-sm hover:underline" href="/staff">
                  Staff
                </Link>
              )}

              {me.role === "ADMIN" && (
                <Link className="text-sm hover:underline" href="/admin">
                  Admin
                </Link>
              )}
            </>
          ) : (
            <Link className="text-sm hover:underline text-gray-700" href="/">
    Browse events
  </Link>
          )}

          <div className="ml-2">
            <AuthButtons />
          </div>
        </nav>
      </div>
    </header>
  );
}
