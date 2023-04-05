import { createTRPCRouter } from "~/server/api/trpc";
import { authRouter } from "./routers/auth";
import { booksRouter } from "./routers/books";
import { readersRouter } from "./routers/readers";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  auth: authRouter,
  books: booksRouter,
  readers: readersRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
