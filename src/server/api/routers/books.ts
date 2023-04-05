import { z } from "zod";

import {
  adminProcedure,
  createTRPCRouter,
  publicProcedure,
} from "~/server/api/trpc";

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
  addBook: adminProcedure
    .input(
      z.object({
        author: z.string().min(2).max(50),
        title: z.string().min(2).max(50),
        publisher: z.string().min(2).max(50),
        yearOfRelease: z.number().min(1900).max(2023),
        availableCopies: z.number().min(0),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const book = await ctx.prisma.book.create({ data: input });
      return book;
    }),
});
