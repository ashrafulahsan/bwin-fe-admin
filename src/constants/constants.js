export const APP_NAME = "BWIN Consultants";

export const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "";

export const TOKEN_STORAGE_KEY = "bwin_access_token";
export const REFRESH_TOKEN_STORAGE_KEY = "bwin_refresh_token";

// A broken unwrap once stored the literal string "undefined" as a token —
// that's still truthy, so callers must check this instead of `!!token`.
export const isUsableToken = (value) => !!value && value !== "undefined" && value !== "null";
