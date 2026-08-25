// Auth route group layout (login, forgot-password, etc.). No business logic here.
// Each auth page owns its own full-page composition (see modules/auth/components),
// so this layout just passes children through.
export default function AuthGroupLayout({ children }) {
  return children;
}
