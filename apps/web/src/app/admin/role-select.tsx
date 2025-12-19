"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type Role = "USER" | "STAFF" | "ADMIN";

export default function RoleSelect({
  userId,
  currentRole,
}: {
  userId: string;
  currentRole: Role;
}) {
  const router = useRouter();
  const [role, setRole] = useState<Role>(currentRole);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  async function save(nextRole: Role) {
    setLoading(true);
    setMsg(null);

    try {
      const res = await fetch(`/api/admin/users/${userId}/role`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role: nextRole }),
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data?.error || "Failed to update role");

      setRole(nextRole);
      setMsg("Saved ✅");
      router.refresh();
    } catch (e: any) {
      setMsg(e.message || "Error");
      setRole(currentRole); // revert UI on error
    } finally {
      setLoading(false);
      setTimeout(() => setMsg(null), 1500);
    }
  }

  return (
    <div className="flex items-center gap-3">
      <select
        className="border rounded px-2 py-1"
        value={role}
        disabled={loading}
        onChange={(e) => save(e.target.value as Role)}
      >
        <option value="USER">USER</option>
        <option value="STAFF">STAFF</option>
        <option value="ADMIN">ADMIN</option>
      </select>

      {loading ? <span className="text-xs">Saving…</span> : null}
      {msg ? <span className="text-xs">{msg}</span> : null}
    </div>
  );
}
