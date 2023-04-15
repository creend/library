import { type Prisma, type PrismaClient } from "@prisma/client";
import { TRPCError } from "@trpc/server";
import { z } from "zod";

import {
  adminProcedure,
  createTRPCRouter,
  privateProcedure,
} from "~/server/api/trpc";
import { findBookById } from "./books";
import { findUserByUsername } from "./readers";

export const reservationsRouter = createTRPCRouter({
  createReservation: privateProcedure
    .input(z.object({ username: z.string(), bookId: z.number() }))
    .mutation(async ({ ctx, input }) => {
      const { bookId, username } = input;
      const book = await findBookById(bookId, ctx.prisma);
      const reader = await ctx.prisma.user.findUnique({
        where: { username },
        include: { Reservations: { where: { bookId } } },
      });

      if (!reader) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Czytelnik nie ustnieje",
        });
      }

      if (reader?.Reservations.length) {
        throw new TRPCError({
          code: "CONFLICT",
          message: "Nie możesz zarezerwować 2 razy jednej książki",
        });
      }

      if (ctx.session?.user.username !== reader?.username) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Nie możesz złożyć komuś rezerwacji",
        });
      }

      const reservation = await ctx.prisma.reservation.create({
        data: { bookId: book.id, userId: reader.id },
        include: { book: true, user: true },
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
  getAllReservations: adminProcedure.query(async ({ ctx }) => {
    const reservations = await ctx.prisma.reservation.findMany({
      include: { book: true, user: true },
      orderBy: [{ bookId: "asc" }, { createdAt: "asc" }],
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
      if (
        ctx.session?.user.id !== reservation.userId &&
        ctx.session?.user.role !== "admin"
      ) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Nie możesz usunąć czyjejś rezerwacji",
        });
      }
      const removedReservation = await ctx.prisma.reservation.delete({
        where: { id },
      });
      await ctx.prisma.book.update({
        where: { id: reservation.bookId },
        data: { availableCopies: { increment: 1 } },
      });
      return {
        status: 201,
        message: "Reservation removed successfully",
        reservation: removedReservation,
      };
    }),
});
