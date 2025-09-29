import { createBrowserClient } from "@supabase/ssr";
import { SUPABASE_ANON_KEY, SUPABASE_URL } from "@/config";

/**
 * Creates a Supabase client for use in the browser.
 */
export const createClient = () => {
	return createBrowserClient(SUPABASE_URL!, SUPABASE_ANON_KEY!);
};
