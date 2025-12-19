import type { NextAuthOptions } from "next-auth";
import Google from "next-auth/providers/google";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/lib/prisma";

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      // (keep your calendar scope params here too if you added them)
    }),
  ],
  session: { strategy: "database" },

  callbacks: {
    async signIn({ user }) {
      const adminEmail = process.env.ADMIN_EMAIL?.toLowerCase();
      const email = user.email?.toLowerCase();

      if (adminEmail && email && email === adminEmail) {
        // Promote to ADMIN if not already
        await prisma.user.update({
          where: { email: user.email! },
          data: { role: "ADMIN" },
        });
      }

      return true;
    },
  },
};
