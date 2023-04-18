/* eslint-disable @typescript-eslint/no-empty-interface */
import NextAuth from "next-auth";

interface User {
  id: number;
  username: string;
  firstName: string;
  lastName: string;
  idDocumentNumber: string;
  needPasswordChange: boolean;
  address: string;
  createdAt: Date;
  updatedAt: Date;
  roleId: number;
  role: string;
}

interface WithUser {
  user: User;
}

declare module "next-auth" {
  /**
   * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface Session {
    user: User;
  }
}

declare module "next-auth/jwt" {
  interface JWT extends WithUser {}
}
