import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";
import type { NextFetchEvent, NextRequest } from "next/server";

export async function middleware(request: NextRequest, _next: NextFetchEvent) {
  const { pathname } = request.nextUrl;
  const adminPaths = [
    "/ksiazki/dodaj",
    "/ksiazki/rezerwacje",
    "/ksiazki/wypozyczenia",
    "/czytelnicy",
    "/czytelnicy/dodaj",
  ];
  const onlyUserPaths = ["/ksiazki/zarezerwowane", "/ksiazki/wypozyczone"];
  const protectedPaths = ["/moje-dane"];
  const onlyUnloggedPaths = ["/zaloguj"];

  const matchesAdminPath = adminPaths.some((path) => pathname.startsWith(path));
  const matchesUserPath = onlyUserPaths.some((path) =>
    pathname.startsWith(path)
  );
  const matchesProtectedPath = protectedPaths.some((path) =>
    pathname.startsWith(path)
  );

  const matchesUnloggedPath = onlyUnloggedPaths.some((path) =>
    pathname.startsWith(path)
  );

  if (pathname === "/") {
    const url = new URL(`/ksiazki`, request.url);
    return NextResponse.redirect(url);
  }

  if (matchesAdminPath) {
    const token = await getToken({ req: request });
    if (!token) {
      const url = new URL(`/zaloguj`, request.url);
      return NextResponse.redirect(url);
    }
    if (token.user.role !== "admin") {
      const url = new URL(`/`, request.url);
      return NextResponse.redirect(url);
    }
  }

  if (matchesUserPath) {
    const token = await getToken({ req: request });
    if (!token) {
      const url = new URL(`/zaloguj`, request.url);
      return NextResponse.redirect(url);
    }
    if (token.user.role !== "normal") {
      const url = new URL(`/`, request.url);
      return NextResponse.redirect(url);
    }
  }

  if (matchesProtectedPath) {
    const token = await getToken({ req: request });
    if (!token) {
      const url = new URL(`/zaloguj`, request.url);
      return NextResponse.redirect(url);
    }
  }

  if (matchesUnloggedPath) {
    const token = await getToken({ req: request });
    if (token) {
      const url = new URL(`/`, request.url);
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}
