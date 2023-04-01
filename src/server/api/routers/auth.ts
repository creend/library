import { TRPCError } from "@trpc/server";
import { hash } from "argon2";
import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export const authRouter = createTRPCRouter({
  signUp: publicProcedure
    .input(
      z.object({
        username: z.string().min(2).max(50),
        password: z.string().min(4).max(50),
        firstName: z.string().min(2),
        lastName: z.string().min(2),
        idDocumentNumber: z.string().min(2),
        address: z.string().min(4),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const {
        username,
        password,
        address,
        firstName,
        idDocumentNumber,
        lastName,
      } = input;

      const exists = await ctx.prisma.user.findUnique({
        where: { username },
      });

      if (exists) {
        throw new TRPCError({
          code: "CONFLICT",
          message: "User already exists.",
        });
      }

      const hashedPassword = await hash(password);

      const user = await ctx.prisma.user.create({
        data: {
          username,
          passwordHash: hashedPassword,
          address,
          firstName,
          idDocumentNumber,
          lastName,
        },
      });

      return {
        status: 201,
        message: "Account created successfully",
        user,
      };
    }),
});
