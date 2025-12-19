"use client";

import { useState } from "react";

export default function SignupButton({ eventId }: { eventId: string }) {
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  async function signup() {
    setLoading(true);
    setMsg(null);

    try {
      const res = await fetch(`/api/events/${eventId}/signup`, { method: "POST" });
      const data = await res.json().catch(() => ({}));

      if (res.status === 401) {
        setMsg("Please sign in with Google first.");
        return;
      }

      if (!res.ok) throw new Error(data?.error || "Signup failed");

      setMsg(data.requiresPayment ? "Signed up (payment required next) 💳" : "Signed up ✅");
    } catch (e: any) {
      setMsg(e.message || "Error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-3">
      <button
        onClick={signup}
        disabled={loading}
        className="px-4 py-2 rounded bg-black text-white disabled:opacity-60"
      >
        {loading ? "Signing up..." : "Sign up"}
      </button>

      {msg ? <p className="text-sm">{msg}</p> : null}
    </div>
  );
}
