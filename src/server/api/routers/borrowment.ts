import { z } from "zod";
import { adminProcedure, createTRPCRouter, publicProcedure } from "../trpc";
import { TRPCError } from "@trpc/server";

export const borrowmentsRouter = createTRPCRouter({
  getAllBorrowments: adminProcedure.query(async ({ ctx }) => {
    const borrowments = await ctx.prisma.borrowment.findMany({
      include: { book: true, user: true },
    });
    return borrowments;
  }),
  getBorrowmentsByUsername: adminProcedure
    .input(z.object({ username: z.string() }))
    .query(async ({ ctx, input }) => {
      const { username } = input;
      const borrowments = await ctx.prisma.borrowment.findMany({
        where: { user: { username } },
        include: { book: true, user: true },
      });
      return borrowments;
    }),
  createBorrowment: adminProcedure
    .input(z.object({ reservationId: z.number() }))
    .mutation(async ({ ctx, input }) => {
      const { reservationId } = input;
      const reservation = await ctx.prisma.reservation.findUnique({
        where: { id: reservationId },
        include: { book: true, user: true },
      });
      if (!reservation) {
        throw new TRPCError({ code: "NOT_FOUND" });
      }
      await ctx.prisma.reservation.delete({ where: { id: reservationId } });
      const borrowment = await ctx.prisma.borrowment.create({
        data: { bookId: reservation.bookId, userId: reservation.userId },
      });
      return {
        status: 201,
        message: "Borrowment created successfully",
        borrowment,
      };
    }),
});
