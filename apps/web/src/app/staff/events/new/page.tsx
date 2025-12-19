import Link from "next/link";
import { requireStaff } from "@/lib/staff";
import CreateEventForm from "./create-event-form";

export default async function NewEventPage() {
  const gate = await requireStaff();
  if (!gate.ok) {
    return (
      <main className="p-6 max-w-3xl mx-auto">
        <h1 className="text-2xl font-bold">Create Event</h1>
        <p className="mt-4">You do not have access.</p>
        <Link className="underline" href="/">
          Back
        </Link>
      </main>
    );
  }

  return (
    <main className="p-6 max-w-3xl mx-auto space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Create Event</h1>
        <Link className="underline" href="/staff">
          Back to Staff
        </Link>
      </div>

      <CreateEventForm />
    </main>
  );
}
