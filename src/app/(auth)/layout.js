// Auth route group layout (login, forgot-password, etc.). No business logic here.
export default function AuthGroupLayout({ children }) {
  return <div className="flex min-h-screen items-center justify-center">{children}</div>;
}
