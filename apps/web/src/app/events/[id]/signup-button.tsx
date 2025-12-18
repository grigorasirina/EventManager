"use client";

import { useState } from "react";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

export default function SignupButton({ eventId }: { eventId: string }) {
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  async function signup() {
    setLoading(true);
    setMsg(null);

    try {
      const res = await fetch(`${API_URL}/events/${eventId}/signup`, {
        method: "POST",
        headers: {
          // TEMP until Google login:
          "x-user-id": "user_1",
          "x-user-role": "USER",
        },
      });

      const data = await res.json().catch(() => ({}));
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
