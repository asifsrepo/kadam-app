import type { NextRequest, NextResponse } from "next/server";
import type { IUser } from "@/types";
import { continueNext, isAuthRoute, isPublicRoute, redirectTo } from "./utils";

/**
 * Handles authenticated users trying to access authentication routes.
 * If a user is already logged in (and not in recovery), they should not be able to access pages like
 * sign-in or sign-up. This function checks if the current route is an authentication
 * route and if the user is fully authenticated. If both are true, it redirects the user
 * to the dashboard.
 */
export const handleAuthenticatedOnAuthRoutes = (
	request: NextRequest,
	user: IUser,
): NextResponse | null => {
	const { pathname } = request.nextUrl;

	if (user && isAuthRoute(pathname)) {
		return redirectTo(request, "/dashboard");
	}

	if (!user && isAuthRoute(pathname)) return continueNext();

	return null;
};

/**
 * Handles unauthenticated users trying to access protected routes.
 * If a user is not fully authenticated, they should not be able to access protected pages.
 * This function checks if the user is unauthenticated and if the current route is
 * not a public, authentication, invitation, or reset password route.
 */
export const handleUnauthenticatedOnProtectedRoutes = (
	request: NextRequest,
	user: IUser,
): NextResponse | null => {
	const { pathname } = request.nextUrl;

	// If user is fully authenticated, allow access
	if (user) return null;

	// Don't block public routes
	if (isPublicRoute(pathname)) return null;

	// Don't block auth routes (sign-in, sign-up, etc.)
	if (isAuthRoute(pathname)) return null;

	// Block all other routes for unauthenticated users
	return redirectTo(request, "/signin");
};
