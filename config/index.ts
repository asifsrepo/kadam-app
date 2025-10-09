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
