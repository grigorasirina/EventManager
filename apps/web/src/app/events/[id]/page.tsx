import SignupButton from "./signup-button";
import { prisma } from "@/lib/prisma";

type Event = {
  id: string;
  title: string;
  description?: string | null;
  location?: string | null;
  startsAt: Date;
  endsAt: Date;
  priceCents: number;
  currency: string;
};

export default async function EventPage({
  params,
}: {
  params: { id: string };
}) {
  const event = await prisma.event.findUnique({
    where: { id: params.id },
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
    return <main className="p-6">Event not found</main>;
  }

  return (
    <main className="p-6 max-w-3xl mx-auto space-y-4">
      <h1 className="text-3xl font-semibold">{event.title}</h1>

      <p className="text-sm text-gray-600">
        {event.priceCents === 0
          ? "Free"
          : `£${(event.priceCents / 100).toFixed(2)}`}{" "}
        · {event.location ?? "Online / To be confirmed"}
      </p>

      {event.description && (
        <p className="text-gray-700">{event.description}</p>
      )}

      <div className="pt-6">
        <SignupButton eventId={event.id} />
      </div>
    </main>
  );
}
