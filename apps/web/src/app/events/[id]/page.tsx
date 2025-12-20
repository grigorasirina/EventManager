import { prisma } from "@/lib/prisma";
import SignupButton from "./signup-button";

export default async function EventPage({
  params,
}: {
  params: { id: string } | Promise<{ id: string }>;
}) {
  // Works in both cases:
  // - params is an object (common)
  // - params is a Promise (what you're seeing)
  const { id } = await Promise.resolve(params);

  if (!id) {
    return <main className="p-6 max-w-3xl mx-auto">Missing event id</main>;
  }

  const event = await prisma.event.findUnique({
    where: { id },
    select: {
      id: true,
      title: true,
      description: true,
      location: true,
      startsAt: true,
      endsAt: true,
      priceCents: true,
      currency: true,
    },
  });

  if (!event) {
    return <main className="p-6 max-w-3xl mx-auto">Event not found</main>;
  }

  return (
    <main className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold">{event.title}</h1>

      <p className="mt-2 text-sm">
        {event.priceCents === 0 ? "Free" : `£${(event.priceCents / 100).toFixed(2)}`} ·{" "}
        {event.location ?? "Online/To be confirmed"}
      </p>

      <p className="mt-2 text-sm text-gray-600">
        {new Date(event.startsAt).toLocaleString()} – {new Date(event.endsAt).toLocaleString()}
      </p>

      {event.description ? <p className="mt-4">{event.description}</p> : null}

      <div className="mt-8">
        <SignupButton eventId={event.id} />
      </div>
    </main>
  );
}
