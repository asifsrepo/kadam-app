import { type NextRequest } from "next/server";
import {
	handleAuthenticatedOnAuthRoutes,
	handleUnauthenticatedOnProtectedRoutes,
} from "./lib/middleware/auth";
import createSupabaseClient from "./lib/middleware/createSupabaseClient";
import handleOnboarding from "./lib/middleware/handleOnboarding";
import { IUser } from "./types";

export const middleware = async (request: NextRequest) => {
	const { supabase, supabaseResponse } = createSupabaseClient(request);
	const { data } = await supabase.auth.getUser();
	const user = data?.user;

	console.log("🟥 USER 🟥:",user);
	

	const authRouteResponse = handleAuthenticatedOnAuthRoutes(request, user as IUser);
	if (authRouteResponse) return authRouteResponse;

	console.log("🟨 AUTH ROUTE RESPONSE 🟨",authRouteResponse);

	// Handle unauthenticated users on protected routes (show 404)
	const protectedRouteResponse = handleUnauthenticatedOnProtectedRoutes(request, user as IUser);
	if (protectedRouteResponse) return protectedRouteResponse;	

	console.log("🟥 PROTECTED ROUTE RESPONSE 🟥", protectedRouteResponse);
	
	const onboardingResponse = handleOnboarding(request, user as IUser);
	if (onboardingResponse) return onboardingResponse;

	console.log("🟨 ONBOARDING RESPONSE 🟨", onboardingResponse);

	return supabaseResponse;
};

export const config = {
	matcher: ["/((?!_next/static|_next/image|favicon.ico|.*.(?:svg|png|jpg|jpeg|gif|webp)$).*)"],
};
