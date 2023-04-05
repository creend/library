import { type User } from "@prisma/client";
import { TRPCError } from "@trpc/server";
import { hash } from "argon2";
import { z } from "zod";

import {
  adminProcedure,
  createTRPCRouter,
  publicProcedure,
} from "~/server/api/trpc";

export const addReaderSchema = z.object({
  username: z
    .string()
    .min(2, "Nazwa użytkownika musi posiadać minimum 2 znaki")
    .max(50, "Nazwa użytkownika może posiadać maksymalnie 50 znaków"),
  password: z
    .string()
    .min(2, "Hasło musi posiadać minimum 2 znaki")
    .max(50, "Hasło może posiadać maksymalnie 50 znaków"),
  firstName: z
    .string()
    .min(2, "Imie musi posiadać minimum 2 znaki")
    .max(50, "Imie może posiadać maksymalnie 50 znaków"),
  lastName: z
    .string()
    .min(2, "Nazwisko musi posiadać minimum 2 znaki")
    .max(50, "Nazwisko może posiadać maksymalnie 50 znaków"),
  idDocumentNumber: z
    .string()
    .min(2, "Numer dokumentu tożsamości musi posiadać minimum 2 znaki")
    .max(50, "Numer dokumentu tożsamości może posiadać maksymalnie 50 znaków"),
  address: z.string().min(4, "Adres musi posiadać minimum 2 znaki"),
});

function filterUser(reader: User) {
  const { passwordHash, ...user } = reader;
  return { ...user };
}

export const readersRouter = createTRPCRouter({
  getReaders: publicProcedure.query(async ({ ctx }) => {
    const readers = await ctx.prisma.user.findMany({
      where: { username: { not: "admin" } },
    });
    return readers.map(filterUser);
  }),
  addReader: adminProcedure
    .input(addReaderSchema)
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
          message: "Użytkownik z podaną nazwą już istnieje",
        });
      }

      const hashedPassword = await hash(password);

      const user = filterUser(
        await ctx.prisma.user.create({
          data: {
            username,
            passwordHash: hashedPassword,
            address,
            firstName,
            idDocumentNumber,
            lastName,
            role: { connect: { name: "normal" } },
          },
        })
      );

      return {
        status: 201,
        message: "Account created successfully",
        user,
      };
    }),
});
