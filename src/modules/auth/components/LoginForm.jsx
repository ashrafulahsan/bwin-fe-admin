"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema } from "../validation";
import { useLogin } from "../hooks";
import { LOGIN_ROLE_TABS, LOGIN_SUBMIT_LABELS } from "../constants";
import { ROUTES } from "@/config/routes";
import { useToast } from "@/hooks/useToast";

// Ported 1:1 from the Claude Design source (BWIN Consultants admin
// panel/admin-panel-login.dc.html) — the split gradient/illustration panel,
// role tabs, and inline copy all match the design exactly. Interactivity
// (validation, submit) is wired to this app's real stack (React Hook Form +
// Zod, TanStack Query) instead of the design canvas's local component state.
function tabStyle(active) {
  return {
    padding: "9px 20px",
    border: "none",
    borderRadius: 6,
    fontFamily: "var(--font-body)",
    fontSize: 13,
    fontWeight: 600,
    cursor: "pointer",
    transition: "background 150ms ease-out",
    background: active ? "var(--white)" : "transparent",
    color: active ? "var(--navy-700)" : "rgba(255,255,255,0.72)",
  };
}

const labelCapStyle = {
  fontSize: 12,
  fontWeight: 600,
  letterSpacing: "0.04em",
  textTransform: "uppercase",
  color: "rgba(255,255,255,0.7)",
};

const fieldStyle = {
  width: "100%",
  boxSizing: "border-box",
  height: 46,
  padding: "0 14px",
  border: "1px solid var(--border-strong)",
  borderRadius: "var(--radius-md)",
  background: "var(--white)",
  color: "var(--gray-900)",
  fontFamily: "var(--font-body)",
  fontSize: 14,
  outline: "none",
};

export default function LoginForm() {
  const router = useRouter();
  const [role, setRole] = useState(LOGIN_ROLE_TABS[0].value);
  const [reveal, setReveal] = useState(false);
  const loginMutation = useLogin();
  const { showSuccess, showError } = useToast();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: { identifier: "", password: "", remember: true },
  });

  const onSubmit = async (values) => {
    try {
      const data = await loginMutation.mutateAsync({ role, ...values });
      showSuccess(`Welcome back, ${data.user?.name || data.user?.email || "there"}!`);
      router.push(ROUTES.DASHBOARD);
    } catch (error) {
      showError(error?.response?.data?.message || "Something went wrong. Please try again.");
    }
  };

  const bannerMessage =
    errors.identifier?.message ||
    errors.password?.message ||
    (loginMutation.isError
      ? loginMutation.error?.response?.data?.message || "Something went wrong. Please try again."
      : null);

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 32,
        background: "var(--surface-page)",
        boxSizing: "border-box",
      }}
    >
      <div
        className="grid grid-cols-1 md:grid-cols-2"
        style={{
          width: "100%",
          maxWidth: 1120,
          background: "var(--white)",
          border: "1px solid var(--border)",
          borderRadius: "var(--radius-lg)",
          boxShadow: "var(--shadow-lg)",
          overflow: "hidden",
          minHeight: 620,
        }}
      >
        <div
          style={{
            position: "relative",
            padding: "48px 52px",
            display: "flex",
            flexDirection: "column",
            background: "linear-gradient(150deg,#0E2440 0%,#14325A 42%,#7C5233 78%,#A66F35 100%)",
            overflow: "hidden",
          }}
        >
          <div style={{ position: "absolute", top: -120, right: -90, width: 320, height: 320, borderRadius: 999, background: "rgba(240,144,30,0.16)" }} />
          <div style={{ position: "absolute", bottom: -140, left: -80, width: 300, height: 300, borderRadius: 999, background: "rgba(255,255,255,0.06)" }} />

          <div style={{ position: "relative", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16 }}>
            <div style={{ background: "var(--white)", borderRadius: "var(--radius-md)", padding: "8px 12px", display: "inline-flex" }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/assets/logo/bwin-logo.png" alt="BWIN Consultants" style={{ height: 28, width: "auto", display: "block" }} />
            </div>
            <span
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: 11,
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                color: "rgba(255,255,255,0.72)",
                border: "1px solid rgba(255,255,255,0.28)",
                borderRadius: 999,
                padding: "5px 12px",
              }}
            >
              Staff access
            </span>
          </div>

          <div style={{ position: "relative", marginTop: "auto", paddingTop: 44 }}>
            <h1 style={{ fontFamily: "var(--font-display)", fontWeight: 600, fontSize: 34, lineHeight: 1.15, color: "var(--white)", margin: "0 0 8px" }}>
              Sign in
            </h1>
            <p style={{ fontSize: 15, lineHeight: 1.5, color: "rgba(255,255,255,0.74)", margin: "0 0 28px", maxWidth: "34ch" }}>
              Welcome back — use your work email or phone number to continue.
            </p>

            <div style={{ display: "flex", gap: 6, padding: 4, background: "rgba(255,255,255,0.10)", borderRadius: "var(--radius-md)", width: "fit-content", marginBottom: 24 }}>
              {LOGIN_ROLE_TABS.map((tab) => (
                <button key={tab.value} type="button" onClick={() => setRole(tab.value)} style={tabStyle(role === tab.value)}>
                  {tab.label}
                </button>
              ))}
            </div>

            <form onSubmit={handleSubmit(onSubmit)} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <label style={{ display: "flex", flexDirection: "column", gap: 7 }}>
                <span style={labelCapStyle}>Email or phone number</span>
                <input
                  type="text"
                  placeholder="you@bwin.com or +1 555 0134"
                  autoComplete="username"
                  style={fieldStyle}
                  {...register("identifier")}
                />
              </label>

              <label style={{ display: "flex", flexDirection: "column", gap: 7 }}>
                <span style={labelCapStyle}>Password</span>
                <span style={{ position: "relative", display: "block" }}>
                  <input
                    type={reveal ? "text" : "password"}
                    placeholder="Enter your password"
                    autoComplete="current-password"
                    style={{ ...fieldStyle, padding: "0 76px 0 14px" }}
                    {...register("password")}
                  />
                  <button
                    type="button"
                    onClick={() => setReveal((r) => !r)}
                    style={{
                      position: "absolute",
                      top: "50%",
                      right: 8,
                      transform: "translateY(-50%)",
                      height: 30,
                      padding: "0 10px",
                      border: "1px solid var(--border-strong)",
                      borderRadius: "var(--radius-sm)",
                      background: "var(--white)",
                      color: "var(--gray-600)",
                      fontFamily: "var(--font-body)",
                      fontSize: 12,
                      fontWeight: 600,
                      cursor: "pointer",
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = "var(--surface-sunken)")}
                    onMouseLeave={(e) => (e.currentTarget.style.background = "var(--white)")}
                  >
                    {reveal ? "Hide" : "Show"}
                  </button>
                </span>
              </label>

              {bannerMessage && (
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    padding: "10px 12px",
                    borderRadius: "var(--radius-sm)",
                    background: "rgba(255,255,255,0.12)",
                    border: "1px solid rgba(255,255,255,0.22)",
                    fontSize: 13,
                    color: "var(--white)",
                  }}
                >
                  {bannerMessage}
                </div>
              )}

              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
                <label style={{ display: "flex", alignItems: "center", gap: 9, fontSize: 13, color: "rgba(255,255,255,0.82)", cursor: "pointer" }}>
                  <input type="checkbox" style={{ width: 16, height: 16, accentColor: "var(--orange-500)", cursor: "pointer" }} {...register("remember")} />
                  Remember me
                </label>
                <a
                  href={ROUTES.FORGOT_PASSWORD}
                  style={{ fontSize: 13, fontWeight: 600, color: "var(--orange-400)", textDecoration: "none" }}
                  onMouseEnter={(e) => (e.currentTarget.style.textDecoration = "underline")}
                  onMouseLeave={(e) => (e.currentTarget.style.textDecoration = "none")}
                >
                  Forgot password?
                </a>
              </div>

              <button
                type="submit"
                disabled={loginMutation.isPending}
                style={{
                  marginTop: 4,
                  height: 48,
                  border: "none",
                  borderRadius: "var(--radius-md)",
                  background: "var(--orange-500)",
                  color: "#231303",
                  fontFamily: "var(--font-display)",
                  fontSize: 15,
                  fontWeight: 600,
                  cursor: loginMutation.isPending ? "not-allowed" : "pointer",
                  opacity: loginMutation.isPending ? 0.7 : 1,
                  transition: "background 150ms ease-out",
                }}
                onMouseEnter={(e) => {
                  if (!loginMutation.isPending) e.currentTarget.style.background = "var(--orange-600)";
                }}
                onMouseLeave={(e) => (e.currentTarget.style.background = "var(--orange-500)")}
              >
                {loginMutation.isPending ? "Signing in…" : LOGIN_SUBMIT_LABELS[role]}
              </button>
            </form>

            <p style={{ margin: "26px 0 0", fontSize: 12, lineHeight: 1.6, color: "rgba(255,255,255,0.55)" }}>
              Trouble signing in? Contact your BWIN administrator.
            </p>
          </div>
        </div>

        <div className="hidden md:flex" style={{ position: "relative", background: "var(--white)", alignItems: "center", justifyContent: "center", padding: 56 }}>
          <div style={{ width: "100%", maxWidth: 420, display: "flex", flexDirection: "column", gap: 24, alignItems: "center", textAlign: "center" }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/assets/illustrations/login-workspace.png" alt="BWIN admin workspace illustration" style={{ width: "100%", height: "auto", display: "block" }} />
            <div>
              <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 600, fontSize: 20, color: "var(--gray-900)", margin: "0 0 6px" }}>
                One panel for your whole practice
              </h2>
              <p style={{ fontSize: 14, lineHeight: 1.6, color: "var(--gray-600)", margin: 0 }}>
                Courses, consultancies, automations, and content — all managed from a single workspace.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
