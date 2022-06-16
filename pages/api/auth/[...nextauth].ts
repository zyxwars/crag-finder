import NextAuth, { User } from "next-auth";
import bcrypt from "bcrypt";
import CredentialProvider from "next-auth/providers/credentials";
import prisma from "$lib/db/prisma";

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
        const user = await prisma.user.findUnique({
          where: { email: credentials?.email },
          include: { avatar: true },
        });

        if (
          bcrypt.compareSync(credentials?.password || "", user?.password || "")
        )
          return user;

        return null;
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (!user) return token;

      const { id, name, avatar } = user;
      token = { ...token, id, name, avatar };

      return token;
    },
    async session({ session, token }) {
      const { id, name, avatar } = token;

      session.user = { id, name, image: avatar?.newFilename };

      return session;
    },
  },
});
