import { type Prisma, type PrismaClient } from "@prisma/client";
import { TRPCError } from "@trpc/server";
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
  removeBook: adminProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ ctx, input }) => {
      const { id } = input;
      await findBookById(id, ctx.prisma);
      const removedBook = await ctx.prisma.book.delete({ where: { id } });
      return {
        status: 201,
        message: "Book removed successfully",
        book: removedBook,
      };
    }),
  editBook: adminProcedure
    .input(
      z.object({
        id: z.number(),
        author: z.string().min(2).max(50).optional(),
        title: z.string().min(2).max(50).optional(),
        publisher: z.string().min(2).max(50).optional(),
        yearOfRelease: z.number().min(1900).max(2023).optional(),
        availableCopies: z.number().min(0).optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { id, ...book } = input;
      await findBookById(id, ctx.prisma);
      const updatedBook = await ctx.prisma.book.update({
        where: { id },
        data: book,
      });
      return {
        status: 201,
        message: "Book updated successfully",
        book: updatedBook,
      };
    }),
});

export async function findBookById(
  id: number,
  prisma: PrismaClient<
    Prisma.PrismaClientOptions,
    never,
    Prisma.RejectOnNotFound | Prisma.RejectPerOperation | undefined
  >
) {
  const book = await prisma.book.findUnique({
    where: { id },
  });
  if (!book) {
    throw new TRPCError({
      code: "NOT_FOUND",
      message: "Nie znaleziono książki",
    });
  }
  return book;
}
