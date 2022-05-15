import NextAuth, { Defa } from "next-auth";

declare module "next-auth" {
  /**
   * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface Session {
    user: User;
  }
  interface User {
    id: number;
    name: string;
    sessionVersion: number;
  }
}
declare module "next-auth/jwt" {
  /** Returned by the `jwt` callback and `getToken`, when using JWT sessions */
  interface JWT {
    id: number;
    name: string;
    sessionVersion: number;
  }
}
