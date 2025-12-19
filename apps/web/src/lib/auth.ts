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

      authorization: {
        params: {
          scope:
            "openid email profile https://www.googleapis.com/auth/calendar.events",
          access_type: "offline",
          prompt: "consent",
          response_type: "code",
        },
      },
    }),
  ],
  session: { strategy: "database" },

  callbacks: {
    async signIn({ user }) {
      const adminEmail = process.env.ADMIN_EMAIL?.toLowerCase();
      const email = user.email?.toLowerCase();

      if (adminEmail && email && email === adminEmail) {
        await prisma.user.update({
          where: { email: user.email! },
          data: { role: "ADMIN" },
        });
      }

      return true;
    },
  },
};
