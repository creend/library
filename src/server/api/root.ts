import { createTRPCRouter } from "~/server/api/trpc";
import { booksRouter } from "./routers/books";
import { readersRouter } from "./routers/readers";
import { reservationsRouter } from "./routers/reservations";
import { borrowmentsRouter } from "./routers/borrowment";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  books: booksRouter,
  readers: readersRouter,
  reservations: reservationsRouter,
  borrowments: borrowmentsRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
