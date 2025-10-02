import { type NextRequest, NextResponse } from "next/server";
import {
	handleAuthenticatedOnAuthRoutes,
	handleUnauthenticatedOnProtectedRoutes,
} from "./lib/middleware/auth";
import createSupabaseClient from "./lib/middleware/createSupabaseClient";
import { isPublicRoute } from "./lib/middleware/utils";
import { IUser } from "./types";

export const middleware = async (request: NextRequest) => {
	const { pathname } = request.nextUrl;

	// Handle public routes first
	if (isPublicRoute(pathname)) {
		return NextResponse.next();
	}

	const { supabase, supabaseResponse } = createSupabaseClient(request);
	const { data } = await supabase.auth.getClaims();
	const user = data?.claims;

	const authRouteResponse = handleAuthenticatedOnAuthRoutes(request, user as IUser);
	if (authRouteResponse) return authRouteResponse;

	// Handle unauthenticated users on protected routes (show 404)
	const protectedRouteResponse = handleUnauthenticatedOnProtectedRoutes(request, user as IUser);
	if (protectedRouteResponse) return protectedRouteResponse;

	return supabaseResponse;
};

export const config = {
	matcher: ["/((?!_next/static|_next/image|favicon.ico|.*.(?:svg|png|jpg|jpeg|gif|webp)$).*)"],
};
