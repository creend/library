import NextAuth from "next-auth";

declare module "next-auth" {
  /**
   * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface Session {
    user: {
      /** The user's name. */
      id: number;
      username: string;
      firstName: string;
      lastName: string;
      address: string;
      createdAt: Date;
      updatedAt: Date;
      roleId: number;
      role: string;
    };
  }
}
