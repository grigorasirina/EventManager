"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

type Event = {
  id: string;
  title: string;
  description: string | null;
  location: string | null;
  startsAt: Date;
  endsAt: Date;
  capacity: number | null;
  priceCents: number;
  currency: string;
};

function toLocalInputValue(d: Date) {
  // datetime-local expects "YYYY-MM-DDTHH:mm"
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(
    d.getHours()
  )}:${pad(d.getMinutes())}`;
}

export default function EditEventForm({ event }: { event: Event }) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  async function onSave(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSaving(true);
    setMsg(null);

    const fd = new FormData(e.currentTarget);
    const body = Object.fromEntries(fd.entries());

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
      const res = await fetch(`/api/staff/events/${event.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data?.error || "Failed to update");

      setMsg("Saved ✅");
      router.refresh();
    } catch (err: any) {
      setMsg(err.message || "Error");
    } finally {
      setSaving(false);
    }
  }

  async function onDelete() {
    if (!confirm("Delete this event? This will remove all signups too.")) return;

    setDeleting(true);
    setMsg(null);

    try {
      const res = await fetch(`/api/staff/events/${event.id}`, { method: "DELETE" });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data?.error || "Failed to delete");

      router.push("/staff");
      router.refresh();
    } catch (err: any) {
      setMsg(err.message || "Error");
    } finally {
      setDeleting(false);
    }
  }

  return (
    <form onSubmit={onSave} className="space-y-4">
      <div>
        <label className="text-sm font-medium">Title</label>
        <input
          name="title"
          className="w-full border rounded px-3 py-2"
          defaultValue={event.title}
          required
        />
      </div>

      <div>
        <label className="text-sm font-medium">Description</label>
        <textarea
          name="description"
          className="w-full border rounded px-3 py-2"
          rows={4}
          defaultValue={event.description ?? ""}
        />
      </div>

      <div>
        <label className="text-sm font-medium">Location</label>
        <input
          name="location"
          className="w-full border rounded px-3 py-2"
          defaultValue={event.location ?? ""}
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-medium">Starts at</label>
          <input
            name="startsAt"
            type="datetime-local"
            className="w-full border rounded px-3 py-2"
            defaultValue={toLocalInputValue(new Date(event.startsAt))}
            required
          />
        </div>
        <div>
          <label className="text-sm font-medium">Ends at</label>
          <input
            name="endsAt"
            type="datetime-local"
            className="w-full border rounded px-3 py-2"
            defaultValue={toLocalInputValue(new Date(event.endsAt))}
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <label className="text-sm font-medium">Capacity</label>
          <input
            name="capacity"
            type="number"
            min={0}
            className="w-full border rounded px-3 py-2"
            defaultValue={event.capacity ?? ""}
          />
        </div>

        <div>
          <label className="text-sm font-medium">Price (cents)</label>
          <input
            name="priceCents"
            type="number"
            min={0}
            className="w-full border rounded px-3 py-2"
            defaultValue={event.priceCents}
          />
        </div>

        <div>
          <label className="text-sm font-medium">Currency</label>
          <input
            name="currency"
            className="w-full border rounded px-3 py-2"
            defaultValue={event.currency}
          />
        </div>
      </div>

      <div className="flex items-center gap-3">
        <button disabled={saving} className="px-4 py-2 rounded bg-black text-white disabled:opacity-60">
          {saving ? "Saving..." : "Save changes"}
        </button>

        <button
          type="button"
          onClick={onDelete}
          disabled={deleting}
          className="px-4 py-2 rounded border disabled:opacity-60"
        >
          {deleting ? "Deleting..." : "Delete"}
        </button>

        {msg ? <span className="text-sm">{msg}</span> : null}
      </div>
    </form>
  );
}
