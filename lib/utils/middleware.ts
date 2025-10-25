import { type NextRequest, NextResponse } from "next/server";

export const continueNext = (supabaseResponse?: NextResponse): NextResponse => {
	return supabaseResponse || NextResponse.next();
};

/**
 * Returns a NextResponse that redirects to a specified URL.
 * This is useful for redirecting users to different pages.
 *
 * @param request - The incoming Next.js request object
 * @param redirectPath - The path to redirect to (e.g., "/", "/auth")
 * @returns NextResponse that redirects to the specified path
 */
export const redirectTo = (request: NextRequest, redirectPath: string): NextResponse => {
	return NextResponse.redirect(new URL(redirectPath, request.url));
};
