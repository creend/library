import { User } from "@prisma/client";
import { TRPCError } from "@trpc/server";
import { getHTTPStatusCodeFromError } from "@trpc/server/http";
import type { NextApiRequest, NextApiResponse } from "next";
import { appRouter } from "~/server/api/root";
import { prisma } from "~/server/db";

type ResponseData = {
  data?: Omit<User, "passwordHash">;
  error?: {
    message: string;
  };
};

export default async (
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) => {
  const username = req.query.username as string;

  try {
    // the server-side call
    const user = await prisma.user.findUnique({ where: { username } });

    if (!user) {
      return res.status(400).json({ error: { message: "User not found" } });
    }
    const { passwordHash, ...userData } = user;
    res.status(200).json({ data: userData });
  } catch (cause) {
    res.status(500).json({
      error: { message: `Bład przy pobieraniu użytkownika` },
    });
  }
};
