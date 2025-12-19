import Link from "next/link";
import { requireStaff } from "@/lib/staff";
import { prisma } from "@/lib/prisma";
import EditEventForm from "./edit-event-form";

export default async function ManageEventPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const gate = await requireStaff();
  if (!gate.ok) {
    return (
      <main className="p-6 max-w-3xl mx-auto">
        <h1 className="text-2xl font-bold">Manage Event</h1>
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
      <main className="p-6 max-w-3xl mx-auto">
        <h1 className="text-2xl font-bold">Manage Event</h1>
        <p className="mt-4">Event not found.</p>
        <Link className="underline" href="/staff">
          Back to Staff
        </Link>
      </main>
    );
  }

  return (
    <main className="p-6 max-w-3xl mx-auto space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Manage Event</h1>
        <Link className="underline" href="/staff">
          Back to Staff
        </Link>
      </div>

      <EditEventForm event={event} />

      <div className="pt-4 border-t">
        <Link className="underline" href={`/staff/events/${event.id}/attendees`}>
          View attendees →
        </Link>
      </div>
    </main>
  );
}
