import { TRPCError } from "@trpc/server";
import { hash } from "argon2";
import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export const booksRouter = createTRPCRouter({
  getBooks: publicProcedure.query(async ({ input, ctx }) => {
    const books = await ctx.prisma.book.findMany({});
    return books;
  }),
  getBook: publicProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ input, ctx }) => {
      const book = await ctx.prisma.book.findUnique({
        where: { id: input.id },
        include: { borrowedBy: true, reservedBy: true },
      });
      return book;
    }),
});
