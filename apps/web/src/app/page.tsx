import Link from "next/link";
import AuthButtons from "@/app/components/auth-buttons";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:4000";

type Event = {
  id: string;
  title: string;
  description?: string | null;
  priceCents: number;
  currency: string;
};

export default async function HomePage() {
  const res = await fetch(`${API_URL}/events`, { cache: "no-store" });

  if (!res.ok) {
    return <div className="p-6">Failed to load events</div>;
  }

  const events: Event[] = await res.json();

  return (
    <main className="p-6 max-w-3xl mx-auto">
      <div className="mb-4 flex justify-end">
      <AuthButtons />
      </div>
      <h1 className="text-2xl font-bold mb-4">Events</h1>
      

      {events.length === 0 ? (
        <p>No events found.</p>
      ) : (
        <ul className="space-y-4">
          {events.map((event) => (
            <li key={event.id} className="border rounded p-4">
              <div className="flex justify-between items-center gap-4">
                <Link href={`/events/${event.id}`} className="font-semibold underline">
                  {event.title}
                </Link>

                <span className="text-sm">
                  {event.priceCents === 0
                    ? "Free"
                    : `£${(event.priceCents / 100).toFixed(2)}`}
                </span>
              </div>

              {event.description ? <p className="text-sm mt-2">{event.description}</p> : null}
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
