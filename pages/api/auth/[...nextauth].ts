import NextAuth from "next-auth";
import CredentialProvider from "next-auth/providers/credentials";
import prisma from "../../../lib/prisma";

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
      authorize: (credentials) => {
        // TODO: Add password
        const user = prisma.user.findUnique({
          where: { email: credentials?.email },
        });

        return user;
      },
    }),
  ],
});
