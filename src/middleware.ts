import { NextRequest, NextResponse } from "next/server";
import { decrypt } from "@/utils/session";
import { cookies } from "next/headers";

// 1. Specify protected and public routes
const protectedRoutes = ["/"];
const publicRoutes = ["/login", "/signup"];

export default async function middleware(req: NextRequest) {
  // 2. Check if the current route is protected or public
  const path = req.nextUrl.pathname;
  const isProtectedRoute = protectedRoutes.includes(path);
  const isPublicRoute = publicRoutes.includes(path);

  // 3. Decrypt the session from the cookie
  const cookie = cookies().get("session")?.value;
  const session: any = await decrypt(cookie);

  // 4. Extract user information from the session
  const isAuthenticated = !!session?.users; // Assuming 'users' contains user data
  //   const userId = isAuthenticated ? session.users._id : null;
  // You can extract other user data such as role, name, etc., if needed

  // 5. Redirect to /login if the user is not authenticated for protected routes
  if (isProtectedRoute && !isAuthenticated) {
    return NextResponse.redirect(new URL("/login", req.nextUrl));
  }

  // 6. Redirect to /dashboard if the user is authenticated for public routes
  if (isPublicRoute && isAuthenticated) {
    return NextResponse.redirect(new URL("/", req.nextUrl));
  }

  return NextResponse.next();
}

// Routes Middleware should not run on
export const config = {
  matcher: ["/((?!api|_next/static|_next/image|.*\\.png$).*)"],
};
