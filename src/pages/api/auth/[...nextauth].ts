/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-return */
import { type NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { verify } from "argon2";

import { prisma } from "~/server/db";
import { z } from "zod";
import NextAuth from "next-auth/next";

const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },

      authorize: async (credentials) => {
        const loginSchema = z.object({
          username: z.string().min(2),
          password: z.string().min(4).max(100),
        });
        const creds = await loginSchema.parseAsync(credentials);

        const user = await prisma.user.findUnique({
          where: { username: creds.username },
        });
        if (!user) {
          return null;
        }
        const isValidPassword = await verify(user.passwordHash, creds.password);
        if (!isValidPassword) {
          return null;
        }
        const { passwordHash, idDocumentNumber, ...userData } = user;

        return {
          ...userData,
        } as any;
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    session({ session, token }) {
      session.user = token.user as any;
      return session;
    },
    jwt({ token, user }) {
      if (user) {
        token.user = user;
      }
      return token;
    },
  },
  pages: {
    signIn: "/zaloguj",
  },
};

export default NextAuth(authOptions);
