"use client";

import { useState } from "react";

export default function PayNowButton({ eventId }: { eventId: string }) {
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  async function pay() {
    setLoading(true);
    setMsg(null);

    try {
      const res = await fetch("/api/payments/create-checkout-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ eventId }),
      });

      const data = await res.json().catch(() => ({}));

      if (res.status === 401) {
        setMsg("Please sign in again.");
        return;
      }

      if (!res.ok) throw new Error(data?.error || "Failed to start checkout");

      window.location.href = data.url;
    } catch (e: any) {
      setMsg(e.message || "Error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-2">
      <button
        onClick={pay}
        disabled={loading}
        className="px-3 py-2 rounded bg-black text-white disabled:opacity-60"
      >
        {loading ? "Opening…" : "Pay now"}
      </button>
      {msg ? <p className="text-xs">{msg}</p> : null}
    </div>
  );
}
