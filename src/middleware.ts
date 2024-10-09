import { NextRequest, NextResponse } from "next/server";
import { decrypt } from "@/utils/session";

// 1. Specify protected and public routes
const protectedRoutes = ["/"]; // Home or other protected routes
const publicRoutes = ["/login", "/signup"]; // Login, Signup routes

export default async function middleware(req: NextRequest) {
  // 2. Check if the current route is protected or public
  const path = req.nextUrl.pathname;
  const isProtectedRoute = protectedRoutes.includes(path);
  const isPublicRoute = publicRoutes.includes(path);

  // 3. Get the session cookie
  const cookie = req.cookies.get("session")?.value; // Accessing cookies from NextRequest
  let session: any = null;

  // 4. Decrypt the session from the cookie if it exists
  if (cookie) {
    try {
      session = await decrypt(cookie); // Ensure `decrypt` handles the case where the cookie is invalid
    } catch (error) {
      console.error("Failed to decrypt session:", error);
    }
  }

  // 5. Check if the user is authenticated
  const isAuthenticated = !!session?.data?.id; // Check if session contains user ID (adjust based on your structure)

  // 6. Debugging info for checking routes and authentication
  console.log("====================================");
  console.log(isPublicRoute, isAuthenticated, path);
  console.log("====================================");

  // 7. Redirect to /login if the user is not authenticated for protected routes
  if (isProtectedRoute && !isAuthenticated) {
    return NextResponse.redirect(new URL("/login", req.nextUrl));
  }

  // 8. Redirect to / if the user is authenticated and trying to access a public route like /login or /signup
  // if (isPublicRoute && isAuthenticated) {
  //   return NextResponse.redirect(new URL("/", req.nextUrl));
  // }

  // 9. Proceed to the next middleware or the requested route
  return NextResponse.next();
}

// Routes Middleware should not run on
export const config = {
  matcher: ["/((?!api|_next/static|_next/image|.*\\.png$).*)"], // Adjust this to exclude paths that shouldn't go through the middleware
};
