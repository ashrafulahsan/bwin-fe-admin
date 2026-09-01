import { loginRequest } from "../api";

// Orchestration on top of api/ — components/hooks call this, never the raw
// api/ functions or apiClient directly.
//
// Calls the real FastAPI auth endpoint at POST /auth/login
export async function login({ role, identifier, password, remember }) {
  try {
    const response = await loginRequest({ role, identifier, password, remember });
    
    // Map backend response to expected format
    // Backend returns: { access_token, refresh_token, user, ... }
    // We map to: { accessToken, refreshToken, user }
    return {
      user: response.data?.user || response.user,
      accessToken: response.data?.access_token || response.access_token,
      refreshToken: response.data?.refresh_token || response.refresh_token,
    };
  } catch (error) {
    // Re-throw error for the hook to handle
    throw error;
  }
}
