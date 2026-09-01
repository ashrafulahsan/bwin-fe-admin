// Orchestration on top of api/ — components/hooks call this, never the raw
// api/ functions or apiClient directly.
//
// Mock implementation: backend auth isn't wired up yet (same mock-data pattern
// used across the other modules), so any identifier/password combination is
// accepted and the user is signed in with the role selected on the login form.
// Swap this for `const { data } = await loginRequest(payload); return data;`
// once the FastAPI auth endpoint is live.
export async function login({ role, identifier }) {
  return {
    user: {
      id: "mock-user-1",
      name: identifier.includes("@") ? identifier.split("@")[0] : "Admin User",
      email: identifier,
      role,
    },
    accessToken: "mock-access-token",
    refreshToken: "mock-refresh-token",
  };
}
