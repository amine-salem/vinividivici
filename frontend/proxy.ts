import { NextRequest, NextResponse } from "next/server";

const SUPPORTED_LANGS = ["fr", "ar"];
const DEFAULT_LANG = "fr";

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // If the path is exactly "/", redirect to the default language
  if (pathname === "/") {
    const url = request.nextUrl.clone();
    url.pathname = `/${DEFAULT_LANG}`;
    return NextResponse.redirect(url);
  }

  // If the path already has a language prefix, let it through
  const firstSegment = pathname.split("/")[1];
  if (SUPPORTED_LANGS.includes(firstSegment)) {
    return NextResponse.next();
  }

  // Otherwise, let it through too (404 handled elsewhere)
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (Next.js internal files)
     * - _next/image (image optimization)
     * - favicon.ico
     * - public folder files (anything with a dot in the path)
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\..*).*)",
  ],
};