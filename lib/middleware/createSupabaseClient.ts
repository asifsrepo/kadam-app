import { createServerClient } from "@supabase/ssr";
import { type NextRequest, NextResponse } from "next/server";
import { SUPABASE_ANON_KEY, SUPABASE_URL } from "@/config";

/**
 * Creates a Supabase client for server-side operations with cookie handling.
 * This function initializes a Supabase client that can be used in Next.js middleware
 * and server-side rendering (SSR) contexts. It ensures that authentication tokens
 * are correctly handled by reading from and writing to the request and response cookies.
 */
const createSupabaseClient = (request: NextRequest) => {
	let supabaseResponse = NextResponse.next({ request });

	const supabase = createServerClient(SUPABASE_URL!, SUPABASE_ANON_KEY!, {
		cookies: {
			getAll() {
				return request.cookies.getAll();
			},
			setAll(cookiesToSet) {
				cookiesToSet.forEach(({ name, value }) => {
					request.cookies.set(name, value);
				});
				supabaseResponse = NextResponse.next({ request });
				cookiesToSet.forEach(({ name, value, options }) => {
					supabaseResponse.cookies.set(name, value, options);
				});
			},
		},
	});

	return { supabase, supabaseResponse };
};

export default createSupabaseClient;
