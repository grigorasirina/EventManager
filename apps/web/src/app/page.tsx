import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:4000";

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
    ? await prisma.user.findUnique({ where: { email: session.user.email } })
    : null;

  // events
  const res = await fetch(`${API_URL}/events`, { cache: "no-store" });
  if (!res.ok) return <div className="p-6">Failed to load events</div>;

  const events: Event[] = await res.json();

  return (
    <main className="p-6 max-w-3xl mx-auto">
      <div className="mb-4 flex justify-end items-center gap-4">
        {me ? (
          <>
            <Link className="underline" href="/my-events">
              My Events
            </Link>

            {(me.role === "STAFF" || me.role === "ADMIN") && (
              <Link className="underline" href="/staff">
                Staff
              </Link>
            )}

            {me.role === "ADMIN" && (
              <Link className="underline" href="/admin">
                Admin
              </Link>
            )}
          </>
        ) : null}

      </div>

      <h1 className="text-2xl font-bold mb-4">Events</h1>

      {events.length === 0 ? (
        <p>No events found.</p>
      ) : (
        <ul className="space-y-4">
          {events.map((event) => (
            <li
  key={event.id}
  className="group border rounded-xl p-5 bg-white/70 hover:bg-white transition shadow-sm hover:shadow-md"
>
  <div className="flex justify-between items-start gap-4">
    <Link href={`/events/${event.id}`} className="font-semibold text-lg group-hover:underline">
      {event.title}
    </Link>

    <span className="text-sm px-2 py-1 rounded-full bg-gray-100">
      {event.priceCents === 0 ? "Free" : `£${(event.priceCents / 100).toFixed(2)}`}
    </span>
  </div>

  {event.description ? (
    <p className="text-sm text-gray-600 mt-2">{event.description}</p>
  ) : null}
</li>
          ))}
        </ul>
      )}
    </main>
  );
}
