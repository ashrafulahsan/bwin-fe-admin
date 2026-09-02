import { loginRequest } from "../api";

// Orchestration on top of api/ — components/hooks call this, never the raw
// api/ functions or apiClient directly.
//
// Calls the real FastAPI auth endpoint at POST /auth/login. The backend wraps
// every response in `{success, message, data}`, and for login `data` is
// `{user, tokens: {access_token, refresh_token, ...}, roles, permissions}` —
// unwrap both levels rather than reading tokens off the envelope directly.
export async function login({ role, identifier, password, remember }) {
  const response = await loginRequest({ role, identifier, password, remember });
  const payload = response.data?.data;

  return {
    user: payload?.user,
    accessToken: payload?.tokens?.access_token,
    refreshToken: payload?.tokens?.refresh_token,
  };
}
