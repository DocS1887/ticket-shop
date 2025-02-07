import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(request) {
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  });
  if (!token || !token.user.isAdmin) {
    return NextResponse.redirect("/login", request.url);
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
