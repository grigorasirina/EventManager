import Link from "next/link";
import { requireStaff } from "@/lib/staff";
import { prisma } from "@/lib/prisma";

export default async function AttendeesPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const gate = await requireStaff();
  if (!gate.ok) {
    return (
      <main className="p-6 max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold">Attendees</h1>
        <p className="mt-4">You do not have access.</p>
        <Link className="underline" href="/staff">
          Back
        </Link>
      </main>
    );
  }

  const { id } = await params;

  const event = await prisma.event.findUnique({ where: { id } });
  if (!event) {
    return (
      <main className="p-6 max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold">Attendees</h1>
        <p className="mt-4">Event not found.</p>
        <Link className="underline" href="/staff">
          Back to Staff
        </Link>
      </main>
    );
  }

  const signups = await prisma.signup.findMany({
    where: { eventId: id },
    include: { user: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <main className="p-6 max-w-4xl mx-auto space-y-4">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Attendees</h1>
          <div className="text-sm mt-1">
            <span className="font-medium">{event.title}</span> ·{" "}
            {event.priceCents === 0 ? "Free" : `£${(event.priceCents / 100).toFixed(2)}`}
          </div>
        </div>

        <div className="text-right space-y-1">
          <Link className="underline text-sm" href={`/staff/events/${event.id}`}>
            Manage event
          </Link>
          <div>
            <Link className="underline text-sm" href="/staff">
              Back to Staff
            </Link>
          </div>
        </div>
      </div>

      <div className="text-sm">
        Total signups: <span className="font-medium">{signups.length}</span>
        {event.capacity ? (
          <>
            {" "}
            / Capacity: <span className="font-medium">{event.capacity}</span>
          </>
        ) : null}
      </div>

      {signups.length === 0 ? (
        <p>No attendees yet.</p>
      ) : (
        <div className="overflow-x-auto border rounded">
          <table className="w-full text-sm">
            <thead className="border-b">
              <tr>
                <th className="text-left p-3">Name</th>
                <th className="text-left p-3">Email</th>
                <th className="text-left p-3">Payment</th>
                <th className="text-left p-3">Signed up</th>
              </tr>
            </thead>
            <tbody>
              {signups.map((s) => (
                <tr key={s.id} className="border-b last:border-b-0">
                  <td className="p-3">{s.user.name ?? "—"}</td>
                  <td className="p-3">{s.user.email}</td>
                  <td className="p-3">{s.paymentStatus}</td>
                  <td className="p-3">{new Date(s.createdAt).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </main>
  );
}
