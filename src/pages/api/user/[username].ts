/* eslint-disable import/no-anonymous-default-export */
import { type User } from "@prisma/client";
import type { NextApiRequest, NextApiResponse } from "next";
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
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { passwordHash, ...userData } = user;
    res.status(200).json({ data: userData });
  } catch (cause) {
    res.status(500).json({
      error: { message: `Bład przy pobieraniu użytkownika` },
    });
  }
};
