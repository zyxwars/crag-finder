import NextAuth, { User } from "next-auth";
import CredentialProvider from "next-auth/providers/credentials";
import prisma from "$lib/prisma";

export default NextAuth({
  providers: [
    CredentialProvider({
      name: "credentials",
      credentials: {
        email: {
          label: "Email",
          type: "email",
        },
        password: { label: "Password", type: "password" },
      },
      authorize: async (credentials) => {
        // TODO: Add password
        const user = await prisma.user.findUnique({
          where: { email: credentials?.email },
        });

        return user;
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (!user) return token;

      const { id, name } = user;
      token = { ...token, id, name };

      return token;
    },
    async session({ session, token }) {
      const { id, name } = token;

      session.user = { id, name };

      return session;
    },
  },
});