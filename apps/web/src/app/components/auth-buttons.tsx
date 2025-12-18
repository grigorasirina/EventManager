"use client";

import { signIn, signOut, useSession } from "next-auth/react";

export default function AuthButtons() {
  const { data } = useSession();

  if (!data?.user) {
    return (
      <button className="px-3 py-2 rounded bg-black text-white" onClick={() => signIn("google")}>
        Sign in with Google
      </button>
    );
  }

  return (
    <button className="px-3 py-2 rounded border" onClick={() => signOut()}>
      Sign out ({data.user.email})
    </button>
  );
}
