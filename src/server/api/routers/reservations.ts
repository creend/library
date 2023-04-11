import { type Prisma, type PrismaClient } from "@prisma/client";
import { TRPCError } from "@trpc/server";
import { z } from "zod";

import { createTRPCRouter, privateProcedure } from "~/server/api/trpc";
import { findBookById } from "./books";
import { findUserByUsername } from "./readers";

export const reservationsRouter = createTRPCRouter({
  createReservation: privateProcedure
    .input(z.object({ username: z.string(), bookId: z.number() }))
    .mutation(async ({ ctx, input }) => {
      const { bookId, username } = input;
      const book = await findBookById(bookId, ctx.prisma);
      const reader = await findUserByUsername(username, ctx.prisma);

      if (ctx.session?.user.username !== reader?.username) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Nie możesz złożyć komuś rezerwacji",
        });
      }

      if (book.availableCopies < 1) {
        throw new TRPCError({
          code: "CONFLICT",
          message: "Książka nie jest dostępna !",
        });
      }
      const reservation = await ctx.prisma.reservation.create({
        data: { bookId: book.id, userId: reader.id },
        include: { book: true, user: true },
      });
      await ctx.prisma.book.update({
        where: { id: bookId },
        data: { availableCopies: book.availableCopies - 1 },
      });

      return {
        status: 201,
        message: "Reservation created successfully",
        reservation,
      };
    }),
  getReservationsByUsername: privateProcedure
    .input(z.object({ username: z.string() }))
    .query(async ({ ctx, input }) => {
      const { username } = input;
      const reader = await findUserByUsername(username, ctx.prisma);
      const reservations = await ctx.prisma.reservation.findMany({
        where: { userId: reader.id },
        include: { book: true, user: true },
        orderBy: { createdAt: "asc" },
      });
      return reservations;
    }),
  removeReservation: privateProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ ctx, input }) => {
      const { id } = input;
      const reservation = await ctx.prisma.reservation.findUnique({
        where: { id },
      });
      if (!reservation) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Nie istnieje taka rezerwacja",
        });
      }
      if (ctx.session?.user.id !== reservation.userId) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Nie możesz usunąć czyjejś hasła",
        });
      }
      const removedReservation = await ctx.prisma.reservation.delete({
        where: { id },
      });
      return {
        status: 201,
        message: "Reservation removed successfully",
        reservation: removedReservation,
      };
    }),
});