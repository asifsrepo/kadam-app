import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { SUPABASE_SERVICE_ROLE_KEY, SUPABASE_URL } from "@/config";

/**
 * Creates a Supabase server client using the service role key.
 * This client is configured to use cookies from the Next.js server context.
 */
export const createClient = async () => {
	const cookieStore = await cookies();

	return createServerClient(SUPABASE_URL!, SUPABASE_SERVICE_ROLE_KEY!, {
		cookies: {
			getAll() {
				return cookieStore.getAll();
			},
			setAll(cookiesToSet) {
				cookiesToSet.forEach(({ name, value, options }) => {
					cookieStore.set(name, value, options);
				});
			},
		},
	});
};

export type SupabaseServerClient = Awaited<ReturnType<typeof createClient>>;
