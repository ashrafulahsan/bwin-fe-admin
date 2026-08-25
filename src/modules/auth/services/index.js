import { loginRequest } from "../api";

// Orchestration on top of api/ — components/hooks call this, never the raw
// api/ functions or apiClient directly.
export async function login(payload) {
  const { data } = await loginRequest(payload);
  return data; // expected shape: { user, accessToken, refreshToken }
}
