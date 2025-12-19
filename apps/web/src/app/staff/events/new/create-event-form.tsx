"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function CreateEventForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setMsg(null);

    const fd = new FormData(e.currentTarget);
    const body = Object.fromEntries(fd.entries());

    // basic normalization
    const payload = {
      title: String(body.title || ""),
      description: String(body.description || "") || null,
      location: String(body.location || "") || null,
      startsAt: String(body.startsAt),
      endsAt: String(body.endsAt),
      capacity: body.capacity ? Number(body.capacity) : null,
      priceCents: body.priceCents ? Number(body.priceCents) : 0,
      currency: String(body.currency || "GBP"),
    };

    try {
      const res = await fetch("/api/staff/events", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data?.error || "Failed to create event");

      router.push("/staff");
      router.refresh();
    } catch (err: any) {
      setMsg(err.message || "Error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div>
        <label className="text-sm font-medium">Title</label>
        <input name="title" className="w-full border rounded px-3 py-2" required />
      </div>

      <div>
        <label className="text-sm font-medium">Description</label>
        <textarea name="description" className="w-full border rounded px-3 py-2" rows={4} />
      </div>

      <div>
        <label className="text-sm font-medium">Location</label>
        <input name="location" className="w-full border rounded px-3 py-2" />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-medium">Starts at</label>
          <input name="startsAt" type="datetime-local" className="w-full border rounded px-3 py-2" required />
        </div>
        <div>
          <label className="text-sm font-medium">Ends at</label>
          <input name="endsAt" type="datetime-local" className="w-full border rounded px-3 py-2" required />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <label className="text-sm font-medium">Capacity</label>
          <input name="capacity" type="number" min={0} className="w-full border rounded px-3 py-2" />
        </div>

        <div>
          <label className="text-sm font-medium">Price (cents)</label>
          <input name="priceCents" type="number" min={0} className="w-full border rounded px-3 py-2" defaultValue={0} />
          <p className="text-xs mt-1">0 = free. Example: £75.00 → 7500</p>
        </div>

        <div>
          <label className="text-sm font-medium">Currency</label>
          <input name="currency" className="w-full border rounded px-3 py-2" defaultValue="GBP" />
        </div>
      </div>

      <button disabled={loading} className="px-4 py-2 rounded bg-black text-white disabled:opacity-60">
        {loading ? "Creating..." : "Create event"}
      </button>

      {msg ? <p className="text-sm">{msg}</p> : null}
    </form>
  );
}
