import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export const readersRouter = createTRPCRouter({
  getReaders: publicProcedure.query(async ({ ctx }) => {
    const readers = await ctx.prisma.user.findMany({});
    return readers;
  }),
});
