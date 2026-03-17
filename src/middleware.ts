import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const host = request.headers.get("host") ?? "";
  const subdomain = host.split(".")[0];

  // admin.hotdeal.cool → rewrite to /admin/*
  if (subdomain === "admin" && !request.nextUrl.pathname.startsWith("/admin")) {
    const url = request.nextUrl.clone();
    url.pathname = `/admin${request.nextUrl.pathname}`;
    return NextResponse.rewrite(url);
  }

  // Admin auth check via cookie (middleware can't access localStorage)
  if (request.nextUrl.pathname.startsWith("/admin")) {
    const authCookie = request.cookies.get("hddc-admin-auth");
    if (!authCookie) {
      // In development, skip cookie check — layout handles localStorage auth
      // In production, uncomment below:
      // const loginUrl = request.nextUrl.clone();
      // loginUrl.pathname = "/auth/login";
      // return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)"],
};
