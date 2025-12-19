import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import PayNowButton from "./pay-now-button";
import AddToCalendarButton from "./add-to-calendar-button";


export default async function MyEventsPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    return (
      <main className="p-6 max-w-3xl mx-auto">
        <h1 className="text-2xl font-bold">My Events</h1>
        <p className="mt-4">Please sign in to see your events.</p>
        <p className="mt-2">
          Go to{" "}
          <Link className="underline" href="/">
            Home
          </Link>{" "}
          and sign in with Google.
        </p>
      </main>
    );
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  });

  if (!user) {
    return (
      <main className="p-6 max-w-3xl mx-auto">
        <h1 className="text-2xl font-bold">My Events</h1>
        <p className="mt-4">User record not found.</p>
      </main>
    );
  }

  const signups = await prisma.signup.findMany({
    where: { userId: user.id },
    include: { event: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <main className="p-6 max-w-3xl mx-auto">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">My Events</h1>
        <Link className="underline" href="/">
          Back to Events
        </Link>
      </div>

      {signups.length === 0 ? (
        <p className="mt-6">No signups yet.</p>
      ) : (
        <ul className="mt-6 space-y-4">
          {signups.map((s) => {
            const e = s.event;
            const isPaidEvent = e.priceCents > 0;

            return (
              <li key={s.id} className="border rounded p-4">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <Link className="font-semibold underline" href={`/events/${e.id}`}>
                      {e.title}
                    </Link>
                    <div className="text-sm mt-1">
                      {e.priceCents === 0 ? "Free" : `£${(e.priceCents / 100).toFixed(2)}`} ·{" "}
                      {e.location ?? "Online/To be confirmed"}
                    </div>

                    <div className="text-sm mt-2">
                      <span className="font-medium">Status:</span> {s.paymentStatus}
                    </div>
                  </div>

                  <div className="min-w-[140px] text-right">
                    {isPaidEvent && s.paymentStatus === "PENDING" ? (
                      <PayNowButton eventId={e.id} />
                    ) : null}

                    {!isPaidEvent || s.paymentStatus === "PAID" ? (
                      <div className="mt-2">
                        <AddToCalendarButton eventId={e.id} />
                      </div>
                    ) : null}

                    {isPaidEvent && s.paymentStatus === "PAID" ? (
                      <div className="text-sm mt-2">✅ Paid</div>
                    ) : null}

                    {!isPaidEvent ? <div className="text-sm mt-2">✅ Confirmed</div> : null}
                  </div>
                </div> {/* <-- THIS was missing */}
              </li>
            );

          })}
        </ul>
      )}
    </main>
  );
}
