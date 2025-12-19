"use client";

import { useState } from "react";

export default function AddToCalendarButton({ eventId }: { eventId: string }) {
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  async function add() {
    setLoading(true);
    setMsg(null);

    try {
      const res = await fetch("/api/calendar/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ eventId }),
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data?.error || "Failed to add to calendar");

      setMsg("Added ✅");
      if (data.htmlLink) window.open(data.htmlLink, "_blank");
    } catch (e: any) {
      setMsg(e.message || "Error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-2">
      <button
        onClick={add}
        disabled={loading}
        className="px-3 py-2 rounded border disabled:opacity-60"
      >
        {loading ? "Adding…" : "Add to Google Calendar"}
      </button>
      {msg ? <p className="text-xs">{msg}</p> : null}
    </div>
  );
}
