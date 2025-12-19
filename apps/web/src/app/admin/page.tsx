import Link from "next/link";
import { requireAdmin } from "@/lib/admin";
import { prisma } from "@/lib/prisma";
import RoleSelect from "./role-select";

export default async function AdminPage() {
  const gate = await requireAdmin();

  if (!gate.ok) {
    return (
      <main className="p-6 max-w-5xl mx-auto">
        <h1 className="text-2xl font-bold">Admin</h1>
        <p className="mt-4">
          {gate.reason === "unauthenticated"
            ? "Please sign in."
            : "You do not have admin access."}
        </p>
        <p className="mt-2">
          <Link className="underline" href="/">
            Back to Events
          </Link>
        </p>
      </main>
    );
  }

  const users = await prisma.user.findMany({
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
      createdAt: true,
    },
  });

  return (
    <main className="p-6 max-w-5xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Admin · Users</h1>
        <Link className="underline" href="/">
          Back to Events
        </Link>
      </div>

      <div className="overflow-x-auto border rounded">
        <table className="w-full text-sm">
          <thead className="border-b">
            <tr>
              <th className="text-left p-3">Name</th>
              <th className="text-left p-3">Email</th>
              <th className="text-left p-3">Role</th>
              <th className="text-left p-3">Created</th>
              <th className="text-left p-3">Action</th>
            </tr>
          </thead>

          <tbody>
            {users.map((u) => (
              <tr key={u.id} className="border-b last:border-b-0">
                <td className="p-3">{u.name ?? "—"}</td>
                <td className="p-3">{u.email}</td>
                <td className="p-3 font-medium">{u.role}</td>
                <td className="p-3">{new Date(u.createdAt).toLocaleString()}</td>
                <td className="p-3">
                  <RoleSelect userId={u.id} currentRole={u.role} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className="text-xs text-gray-500">
        Tip: Don’t remove ADMIN from your own account unless another admin exists.
      </p>
    </main>
  );
}
