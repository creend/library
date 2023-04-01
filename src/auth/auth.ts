/* eslint-disable @typescript-eslint/no-unsafe-return */
import { type NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { verify } from "argon2";

import { prisma } from "~/server/db";
import { z } from "zod";

export const nextAuthOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },

      authorize: async (credentials) => {
        const loginSchema = z.object({
          username: z.string().email(),
          password: z.string().min(4).max(12),
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
          user: userData,
        } as any;
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
};
