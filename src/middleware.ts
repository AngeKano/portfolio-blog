// middleware.ts
import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import { NextRequest } from "next/server";
import { UserRole } from "./domain/entities/User";

export async function middleware(request: NextRequest) {
  const token = await getToken({ req: request });
  const isAuthenticated = !!token;
  const isAdmin = token?.role === UserRole.ADMIN;

  // Récupérer le chemin demandé
  const { pathname } = request.nextUrl;

  // Protéger la zone admin

  if (pathname.startsWith("/admin")) {
    // Si l'utilisateur n'est pas authentifié ou n'est pas admin
    if (!isAuthenticated || !isAdmin) {
      const url = new URL("/login", request.url);
      url.searchParams.set("callbackUrl", encodeURI(pathname));
      return NextResponse.redirect(url);
    }
  }

  // Routes pour visiteurs connectés (ex: commentaires)
  if (pathname.startsWith("/comment") || pathname.includes("/like")) {
    if (!isAuthenticated) {
      const url = new URL("/login", request.url);
      url.searchParams.set("callbackUrl", encodeURI(pathname));
      return NextResponse.redirect(url);
    }
  }

  // Si l'utilisateur est déjà connecté et essaie d'accéder aux pages de login/register
  if (isAuthenticated && (pathname === "/login" || pathname === "/register")) {
    // Rediriger vers la page d'accueil ou le dashboard admin
    if (isAdmin) {
      return NextResponse.redirect(new URL("/admin", request.url));
    } else {
      return NextResponse.redirect(new URL("/", request.url));
    }
  }

  return NextResponse.next();
}
