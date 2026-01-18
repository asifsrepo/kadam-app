import { type NextRequest } from "next/server";
import {
	handleAuthenticatedOnAuthRoutes,
	handleUnauthenticatedOnProtectedRoutes,
} from "./lib/middleware/auth";
import createSupabaseClient from "./lib/middleware/createSupabaseClient";
import handleOnboarding from "./lib/middleware/handleOnboarding";
import { continueNext, isPublicRoute } from "./lib/middleware/utils";
import { IUser } from "./types";

export const middleware = async (request: NextRequest) => {
	if (isPublicRoute(request.nextUrl.pathname)) return continueNext();

	const { supabase, supabaseResponse } = createSupabaseClient(request);

	const { data } = await supabase.auth.getUser();

	const user = data?.user;

	const authRouteResponse = handleAuthenticatedOnAuthRoutes(request, user as IUser);
	if (authRouteResponse) return authRouteResponse;

	// Handle unauthenticated users on protected routes (show 404)
	const protectedRouteResponse = handleUnauthenticatedOnProtectedRoutes(request, user as IUser);
	if (protectedRouteResponse) return protectedRouteResponse;

	const onboardingResponse = handleOnboarding(request, user as IUser);
	if (onboardingResponse) return onboardingResponse;

	return supabaseResponse;
};

export const config = {
	matcher: [
		"/((?!_next/static|_next/image|favicon.ico|manifest.json|browserconfig.xml|robots.txt|sitemap.xml|sw.js|webhook/|.*.(?:svg|png|jpg|jpeg|gif|webp|json)$).*)",
	],
};
