import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

type Event = {
  id: string;
  title: string;
  description?: string | null;
  priceCents: number;
  currency: string;
};

export default async function HomePage() {
  // session + role
  const session = await getServerSession(authOptions);

  const me = session?.user?.email
    ? await prisma.user.findUnique({
        where: { email: session.user.email },
        select: { role: true },
      })
    : null;

  // fetch events directly (no API call)
  const events: Event[] = await prisma.event.findMany({
    orderBy: { startsAt: "asc" },
    select: {
      id: true,
      title: true,
      description: true,
      priceCents: true,
      currency: true,
    },
  });

  return (
    <main className="p-6 max-w-3xl mx-auto space-y-6">
      {/* Top links */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">Events</h1>
          <p className="text-sm text-gray-600 mt-1">
            Browse upcoming events and workshops.
          </p>
        </div>

        {me && (
          <div className="flex items-center gap-4">
            <Link href="/my-events" className="text-sm font-medium hover:underline">
              My Events
            </Link>

            {(me.role === "STAFF" || me.role === "ADMIN") && (
              <Link href="/staff" className="text-sm font-medium hover:underline">
                Staff
              </Link>
            )}

            {me.role === "ADMIN" && (
              <Link href="/admin" className="text-sm font-medium hover:underline">
                Admin
              </Link>
            )}
          </div>
        )}
      </div>

      {/* Events list */}
      {events.length === 0 ? (
        <div className="rounded-xl border bg-white/70 p-5 shadow-sm">
          No events found.
        </div>
      ) : (
        <ul className="space-y-4">
          {events.map((event) => (
            <li
              key={event.id}
              className="group rounded-xl border bg-white/70 p-5 shadow-sm hover:bg-white transition hover:shadow-md"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <Link
                    href={`/events/${event.id}`}
                    className="text-lg font-semibold group-hover:underline"
                  >
                    {event.title}
                  </Link>

                  {event.description && (
                    <p className="mt-2 text-sm text-gray-600">
                      {event.description}
                    </p>
                  )}
                </div>

                <span className="shrink-0 rounded-full bg-gray-100 px-2.5 py-1 text-xs font-medium">
                  {event.priceCents === 0
                    ? "Free"
                    : `£${(event.priceCents / 100).toFixed(2)}`}
                </span>
              </div>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
