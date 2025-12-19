import Link from "next/link";
import { requireStaff } from "@/lib/staff";
import { prisma } from "@/lib/prisma";

export default async function StaffPage() {
  const gate = await requireStaff();

  if (!gate.ok) {
    return (
      <main className="p-6 max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold">Staff</h1>
        <p className="mt-4">
          {gate.reason === "unauthenticated"
            ? "Please sign in."
            : "You do not have staff access."}
        </p>
        <p className="mt-2">
          <Link className="underline" href="/">
            Back to Events
          </Link>
        </p>
      </main>
    );
  }

  const events = await prisma.event.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <main className="p-6 max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Staff Dashboard</h1>
        <Link className="underline" href="/">
          Back to Events
        </Link>
      </div>

      <div className="flex gap-4">
        <Link className="px-3 py-2 rounded bg-black text-white" href="/staff/events/new">
          Create event
        </Link>
      </div>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold">All Events</h2>

        {events.length === 0 ? (
          <p>No events yet.</p>
        ) : (
          <ul className="space-y-3">
            {events.map((e) => (
              <li key={e.id} className="border rounded p-4">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="font-semibold">{e.title}</div>
                    <div className="text-sm mt-1">
                      {e.priceCents === 0 ? "Free" : `£${(e.priceCents / 100).toFixed(2)}`} ·{" "}
                      {e.location ?? "Online/To be confirmed"}
                    </div>
                  </div>

                  <div className="text-right space-y-2">
                    <Link className="underline text-sm" href={`/staff/events/${e.id}`}>
                      Manage
                    </Link>
                    <div>
                      <Link className="underline text-sm" href={`/staff/events/${e.id}/attendees`}>
                        Attendees
                      </Link>
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </main>
  );
}
