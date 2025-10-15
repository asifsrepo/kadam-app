import { type NextRequest, NextResponse } from "next/server";
import { AUTH_ROUTES, PUBLIC_ROUTES } from "@/constants/routes";

/**
 * Checks if a given pathname is a public route.
 * Public routes are accessible to all users, authenticated or not.
 */
export const isPublicRoute = (pathname: string): boolean => {
	return PUBLIC_ROUTES.includes(pathname);
};

/**
 * Checks if a given pathname is an authentication route.
 * Authentication routes are used for signing in or signing up.
 */
export const isAuthRoute = (pathname: string): boolean => {
	return AUTH_ROUTES.includes(pathname);
};

/**
 * Returns a NextResponse that rewrites to a 404 page.
 * This effectively shows a 404 error to the user while keeping the original URL.
 *
 * @param request - The incoming Next.js request object
 * @returns NextResponse that rewrites to /404
 */
export const show404 = (request: NextRequest): NextResponse => {
	return NextResponse.rewrite(new URL("/404", request.url));
};

/**
 * Returns a NextResponse that continues to the next middleware or route handler.
 * This allows the request to proceed normally without any modifications.
 *
 * @param supabaseResponse - Optional supabase response to maintain cookie handling
 * @returns NextResponse that continues the request flow
 */
export const continueNext = (supabaseResponse?: NextResponse): NextResponse => {
	return supabaseResponse || NextResponse.next();
};

/**
 * Returns a NextResponse that redirects to a specified URL.
 * This is useful for redirecting users to different pages.
 *
 * @param request - The incoming Next.js request object
 * @param redirectPath - The path to redirect to (e.g., "/dashboard", "/auth")
 * @returns NextResponse that redirects to the specified path
 */
export const redirectTo = (request: NextRequest, redirectPath: string): NextResponse => {
	return NextResponse.redirect(new URL(redirectPath, request.url));
};
