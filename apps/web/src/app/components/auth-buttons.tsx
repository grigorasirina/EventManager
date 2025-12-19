"use client";

import { signIn, signOut, useSession } from "next-auth/react";

export default function AuthButtons() {
  const { data, status } = useSession();

  if (status === "loading") return <div>Loading...</div>;

  if (!data?.user) {
    return (
      <button
        className="px-3 py-2 rounded bg-black text-white"
        onClick={() => signIn("google")}
      >
        Sign in with Google
      </button>
    );
  }

  return (
    <div className="flex items-center gap-3">
      <span className="text-sm">{data.user.email}</span>
      <button className="px-3 py-2 rounded border" onClick={() => signOut()}>
        Sign out
      </button>
    </div>
  );
}
