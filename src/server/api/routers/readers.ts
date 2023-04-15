import { type Prisma, type PrismaClient, type User } from "@prisma/client";
import { TRPCError } from "@trpc/server";
import { hash, verify } from "argon2";
import { z } from "zod";

import {
  adminProcedure,
  createTRPCRouter,
  privateProcedure,
  publicProcedure,
} from "~/server/api/trpc";

export const readersRouter = createTRPCRouter({
  getReaders: publicProcedure.query(async ({ ctx }) => {
    const readers = await ctx.prisma.user.findMany({
      where: { username: { not: "admin" } },
    });
    return readers.map(filterUser);
  }),
  getReaderByUsername: publicProcedure
    .input(z.object({ username: z.string() }))
    .query(async ({ ctx, input }) => {
      const { username } = input;
      const reader = await ctx.prisma.user.findUnique({ where: { username } });
      if (!reader) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Użytkownik o podanej nazwie nie istnieje",
        });
      }
      return filterUser(reader);
    }),
  addReader: adminProcedure
    .input(
      z.object({
        username: z.string().min(2).max(50),
        password: z.string().min(2).max(50),
        firstName: z.string().min(2).max(50),
        lastName: z.string().min(2).max(50),
        idDocumentNumber: z.string().min(2).max(50),
        address: z.string().min(4),
      })
    )
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
  removeReader: adminProcedure
    .input(z.object({ username: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const { username } = input;
      await findUserByUsername(username, ctx.prisma);
      try {
        const removedUser = await ctx.prisma.user.delete({
          where: { username },
        });
        return {
          status: 201,
          message: "Reader removed successfully",
          user: filterUser(removedUser),
        };
      } catch (e) {
        throw new TRPCError({
          code: "CONFLICT",
          message:
            "Użytkownik posiada rezerwacje lub wypożyczenia. Przed usunięciem użytkownika, usuń jego wszysykie rezerwacje i wypożyczenia",
        });
      }
    }),
  changePassword: privateProcedure
    .input(
      z.object({
        oldPassword: z.string().min(2).max(50),
        newPassword: z.string().min(2).max(50),
        retypedNewPassword: z.string().min(2).max(50),
        username: z.string().min(2).max(50),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { newPassword, oldPassword, retypedNewPassword, username } = input;
      const user = await findUserByUsername(username, ctx.prisma);

      if (ctx.session?.user.username !== user?.username) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Nie możesz zmienić czyjegoś hasła",
        });
      }

      await validatePasswords(user.passwordHash, oldPassword);

      if (newPassword !== retypedNewPassword) {
        throw new TRPCError({
          code: "CONFLICT",
          message: "Hasła się nie zgadzają",
        });
      }
      const passwordHash = await hash(newPassword);

      const updatedUser = await ctx.prisma.user.update({
        where: { username },
        data: { passwordHash },
      });

      return {
        status: 201,
        message: "Zmieniono hasło!",
        user: filterUser(updatedUser),
      };
    }),
  changeUserData: privateProcedure
    .input(
      z.object({
        username: z.string().min(2).max(50),
        newUsername: z.string().min(2).max(50).optional(),
        password: z.string().min(2).max(50),
        firstName: z.string().min(2).max(50).optional(),
        lastName: z.string().min(2).max(50).optional(),
        idDocumentNumber: z.string().min(2).max(50).optional(),
        address: z.string().min(4).optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { password, username, newUsername, ...userData } = input;

      const user = await findUserByUsername(username, ctx.prisma);

      if (ctx.session?.user.username !== user?.username) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Nie możesz zmienić czyjegoś hasła",
        });
      }
      await validatePasswords(user.passwordHash, password);

      const updatedUser = await ctx.prisma.user.update({
        where: { username },
        data: { ...userData, username: newUsername },
      });

      return {
        status: 201,
        message: "Zmieniono dane!",
        user: filterUser(updatedUser),
      };
    }),
});

function filterUser(reader: User) {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { passwordHash, ...user } = reader;
  return { ...user };
}

export async function findUserByUsername(
  username: string,
  prisma: PrismaClient<
    Prisma.PrismaClientOptions,
    never,
    Prisma.RejectOnNotFound | Prisma.RejectPerOperation | undefined
  >
) {
  const user = await prisma.user.findUnique({ where: { username } });

  if (!user) {
    throw new TRPCError({
      code: "NOT_FOUND",
      message: "Użytkownik o podanej nazwie nie istnieje",
    });
  }
  return user;
}

async function validatePasswords(passwordHash: string, password: string) {
  const isValidPassword = await verify(passwordHash, password);
  if (!isValidPassword) {
    throw new TRPCError({
      code: "UNAUTHORIZED",
      message: "Podano błędne hasło",
    });
  }
}
