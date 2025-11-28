// Environment variables
export const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";
export const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
export const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY ?? "";

export const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL ?? "";

// App constants
export const NODE_ENV = (process.env.NODE_ENV as "development" | "production") ?? "development";

export const SIDEBAR_COOKIE = "sidebar_state";
export const FONT_COOKIE_NAME = "preferred-font";

export const COLOR_SCHEME_COOKIE_NAME = "COLOR_SCHEME_COOKIE_NAME";
export const DEFAULT_COLOR_SCHEME = "default";
export const COLOR_SCHEME_COOKIE_EXPIRY_DAYS = 365;

export const DODO_PAYMENTS_API_KEY = process.env.DODO_PAYMENTS_API_KEY ?? "";
export const DODO_PAYMENTS_RETURN_URL = process.env.DODO_PAYMENTS_RETURN_URL ?? "";
export const DODO_PAYMENTS_WEBHOOK_SECRET = process.env.DODO_WEBHOOK_SECRET ?? "";
export const DODO_PAYMENTS_ENVIRONMENT = (process.env.DODO_PAYMENTS_ENVIRONMENT ?? "test_mode") as
	| "live_mode"
	| "test_mode";
