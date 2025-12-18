import SignupButton from "./signup-button";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:4000";

type Event = {
  id: string;
  title: string;
  description?: string | null;
  location?: string | null;
  startsAt: string;
  endsAt: string;
  priceCents: number;
  currency: string;
};

export default async function EventPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const res = await fetch(`${API_URL}/events/${id}`, { cache: "no-store" });

  if (!res.ok) {
    return <main className="p-6">Event not found</main>;
  }

  const event: Event = await res.json();

  return (
    <main className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold">{event.title}</h1>

      <p className="mt-2 text-sm">
        {event.priceCents === 0 ? "Free" : `£${(event.priceCents / 100).toFixed(2)}`} ·{" "}
        {event.location ?? "Online/To be confirmed"}
      </p>

      {event.description ? <p className="mt-4">{event.description}</p> : null}

      <div className="mt-8">
        <SignupButton eventId={event.id} />
      </div>
    </main>
  );
}
