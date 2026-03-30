import { useState, useEffect, useCallback } from "react";
import { useNavigate, Link } from "react-router-dom";
import Cookies from "js-cookie";

/* ─────────────────────────────────────────────
   Types
───────────────────────────────────────────── */
type ToastState = { message: string; type: "error" | "success" } | null;

/* ─────────────────────────────────────────────
   Sub-components
───────────────────────────────────────────── */

/** Subtle radial glow sitting behind the card */
const AmbientGlow = () => (
  <div
    aria-hidden
    className="pointer-events-none absolute inset-0 overflow-hidden"
  >
    {/* top-right warm glow */}
    <div className="absolute -top-40 -right-40 h-[500px] w-[500px] rounded-full bg-white/[0.025] blur-[120px]" />
    {/* bottom-left cool glow */}
    <div className="absolute -bottom-60 -left-20 h-[400px] w-[400px] rounded-full bg-white/[0.015] blur-[100px]" />
  </div>
);

/** Ultra-fine dot grid */
const DotGrid = () => (
  <div
    aria-hidden
    className="pointer-events-none absolute inset-0"
    style={{
      backgroundImage:
        "radial-gradient(circle, rgba(255,255,255,0.07) 1px, transparent 1px)",
      backgroundSize: "28px 28px",
    }}
  />
);

/** Top-edge gradient line — the "premium bar" */
const PremiumBar = () => (
  <div
    aria-hidden
    className="absolute left-0 right-0 top-0 h-px"
    style={{
      background:
        "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.25) 40%, rgba(255,255,255,0.5) 50%, rgba(255,255,255,0.25) 60%, transparent 100%)",
    }}
  />
);

const GoogleIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" aria-hidden>
    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
  </svg>
);

const DiscordIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
    <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03z" />
  </svg>
);

const EyeIcon = ({ open }: { open: boolean }) =>
  open ? (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
      <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
      <path d="M14.12 14.12a3 3 0 1 1-4.24-4.24" />
      <line x1="1" y1="1" x2="23" y2="23" />
    </svg>
  ) : (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );

const Spinner = () => (
  <svg className="animate-spin" width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden>
    <circle className="opacity-20" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" />
    <path className="opacity-80" fill="currentColor" d="M4 12a8 8 0 0 1 8-8V0C5.373 0 0 5.373 0 12h4z" />
  </svg>
);

/* ─────────────────────────────────────────────
   Main Page
───────────────────────────────────────────── */
export function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [emailError, setEmailError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [toast, setToast] = useState<ToastState>(null);
  const [mounted, setMounted] = useState(false);
  const navigate = useNavigate();

  /* mount fade-in */
  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 30);
    return () => clearTimeout(t);
  }, []);

  /* token guard */
  useEffect(() => {
    const verifyToken = async () => {
      const token = Cookies.get("token");
      if (!token) return;
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/verify`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token }),
        });
        const data = await res.json();
        if (data.valid) navigate("/chat");
        else Cookies.remove("token");
      } catch {
        Cookies.remove("token");
      }
    };
    verifyToken();
  }, [navigate]);

  const showToast = useCallback((message: string, type: "error" | "success" = "error") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3800);
  }, []);

  const handleEmailLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const email = (form.elements.namedItem("email") as HTMLInputElement).value.trim();
    const password = (form.elements.namedItem("password") as HTMLInputElement).value;

    let hasError = false;

    if (!email || !email.includes("@") || !email.includes(".") || email.includes(" ")) {
      showToast("Please enter a valid email address.");
      setEmailError(true);
      hasError = true;
    } else {
      setEmailError(false);
    }

    if (!password) {
      showToast("Password cannot be empty.");
      setPasswordError(true);
      hasError = true;
    } else {
      setPasswordError(false);
    }

    if (hasError) return;

    setIsLoading(true);
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (res.ok) {
        Cookies.set("token", data.token, { expires: 365, sameSite: "None", secure: true, path: "/" });
        showToast("Authenticated successfully.", "success");
        setTimeout(() => navigate("/chat"), 700);
      } else {
        showToast(data.error || "Invalid credentials. Please try again.");
      }
    } catch {
      showToast("Network error. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDiscordLogin = () => {
    const CLIENT_ID = import.meta.env.VITE_DISCORD_CLIENT_ID;
    const REDIRECT_URI = `${import.meta.env.VITE_BASE_URL}/discord-callback`;
    window.location.href = `https://discord.com/api/oauth2/authorize?client_id=${CLIENT_ID}&redirect_uri=${encodeURIComponent(REDIRECT_URI)}&response_type=token&scope=identify%20email`;
  };

  const handleGoogleLogin = () => {
    // wire up @react-oauth/google's useGoogleLogin here
    console.log("Google login");
  };

  return (
    <>
      {/* Google Fonts — Geist + Plus Jakarta Sans */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700&family=Geist+Mono:wght@300;400;500&display=swap');

        *, *::before, *::after { box-sizing: border-box; }

        html, body, #root {
          height: 100%;
          background: #000;
          font-family: 'Plus Jakarta Sans', sans-serif;
          -webkit-font-smoothing: antialiased;
        }

        /* ── Page entry animation ── */
        @keyframes pageIn {
          from { opacity: 0; transform: translateY(18px) scale(0.99); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }
        .card-enter {
          animation: pageIn 0.55s cubic-bezier(0.22, 1, 0.36, 1) both;
        }

        /* ── Toast ── */
        @keyframes toastSlide {
          from { opacity: 0; transform: translateY(-8px) scale(0.97); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }
        .toast-enter { animation: toastSlide 0.22s ease both; }

        /* ── Input autofill fix ── */
        input:-webkit-autofill,
        input:-webkit-autofill:focus {
          -webkit-box-shadow: 0 0 0 1000px #0d0d0d inset !important;
          -webkit-text-fill-color: #e8e8e8 !important;
          caret-color: #e8e8e8;
        }

        /* ── Custom scrollbar ── */
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 2px; }

        /* ── Focus ring ── */
        .focus-ring:focus-visible {
          outline: none;
          box-shadow: 0 0 0 2px rgba(255,255,255,0.15), 0 0 0 4px rgba(255,255,255,0.05);
        }

        /* ── Shimmer on OAuth hover ── */
        @keyframes shimmer {
          from { background-position: -200% center; }
          to   { background-position: 200% center; }
        }
        .oauth-shimmer:hover {
          background: linear-gradient(
            105deg,
            rgba(255,255,255,0.0) 40%,
            rgba(255,255,255,0.04) 50%,
            rgba(255,255,255,0.0) 60%
          );
          background-size: 200% auto;
          animation: shimmer 1.4s linear infinite;
        }
      `}</style>

      {/* ── Root ── */}
      <div className="relative flex min-h-screen w-full items-center justify-center overflow-hidden bg-black px-4 py-10">

        <DotGrid />
        <AmbientGlow />

        {/* ── Toast ── */}
        {toast && (
          <div
            role="alert"
            className={`toast-enter fixed top-5 right-5 z-50 flex items-center gap-2.5 rounded-lg border px-4 py-3 shadow-2xl backdrop-blur-xl ${
              toast.type === "success"
                ? "border-emerald-500/20 bg-emerald-950/80 text-emerald-300"
                : "border-red-500/20 bg-red-950/80 text-red-300"
            }`}
            style={{ fontFamily: "'Geist Mono', monospace", fontSize: 12, letterSpacing: "0.02em", maxWidth: 320 }}
          >
            <span className={`h-1.5 w-1.5 shrink-0 rounded-full ${toast.type === "success" ? "bg-emerald-400" : "bg-red-400"}`} />
            {toast.message}
          </div>
        )}

        {/* ── Card ── */}
        <div
          className={`card-enter relative w-full max-w-[400px] overflow-hidden rounded-2xl border border-white/[0.07] bg-white/[0.025] shadow-[0_0_0_1px_rgba(255,255,255,0.04),0_32px_80px_rgba(0,0,0,0.6)] backdrop-blur-2xl transition-opacity duration-500 ${mounted ? "opacity-100" : "opacity-0"}`}
        >
          <PremiumBar />

          {/* Card inner padding */}
          <div className="px-8 pb-8 pt-7 sm:px-9">

            {/* ── Back ── */}
            <Link
              to="/"
              className="focus-ring group mb-8 inline-flex items-center gap-1.5 rounded text-[11px] font-medium uppercase tracking-[0.1em] text-white/30 transition-colors duration-200 hover:text-white/60"
            >
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden className="transition-transform duration-200 group-hover:-translate-x-0.5">
                <path d="M7.5 2L3.5 6L7.5 10" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              Back
            </Link>

            {/* ── Header ── */}
            <div className="mb-7">
              {/* logo mark */}
              <div className="mb-5 flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 bg-white/[0.06]">
                  <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden>
                    <path d="M8 1L14.928 5V11L8 15L1.072 11V5L8 1Z" stroke="rgba(255,255,255,0.6)" strokeWidth="1" fill="rgba(255,255,255,0.04)" />
                    <path d="M8 4L11.464 6V10L8 12L4.536 10V6L8 4Z" fill="rgba(255,255,255,0.15)" stroke="none" />
                  </svg>
                </div>
                <span
                  className="text-[13px] font-semibold tracking-tight text-white/70"
                  style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                >
                  YourApp
                </span>
              </div>

              <h1
                className="text-[26px] font-bold leading-[1.15] tracking-tight text-white"
                style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
              >
                Sign in to your account
              </h1>
              <p className="mt-2 text-[13px] leading-relaxed text-white/40">
                Welcome back. Enter your credentials below.
              </p>
            </div>

            {/* ── OAuth Buttons ── */}
            <div className="mb-5 grid grid-cols-2 gap-2.5">
              {[
                { label: "Google", icon: <GoogleIcon />, onClick: handleGoogleLogin },
                { label: "Discord", icon: <DiscordIcon />, onClick: handleDiscordLogin },
              ].map(({ label, icon, onClick }) => (
                <button
                  key={label}
                  onClick={onClick}
                  className="focus-ring oauth-shimmer group relative flex items-center justify-center gap-2 rounded-lg border border-white/[0.08] bg-white/[0.03] px-4 py-2.5 text-[13px] font-medium text-white/60 transition-all duration-200 hover:border-white/[0.15] hover:text-white/90"
                >
                  <span className="shrink-0 text-white/50 transition-colors duration-200 group-hover:text-white/80">
                    {icon}
                  </span>
                  {label}
                </button>
              ))}
            </div>

            {/* ── Divider ── */}
            <div className="relative mb-5 flex items-center gap-3">
              <div className="h-px flex-1 bg-white/[0.06]" />
              <span
                className="text-[10px] uppercase tracking-[0.18em] text-white/20"
                style={{ fontFamily: "'Geist Mono', monospace" }}
              >
                or
              </span>
              <div className="h-px flex-1 bg-white/[0.06]" />
            </div>

            {/* ── Form ── */}
            <form onSubmit={handleEmailLogin} noValidate className="space-y-3.5">

              {/* Email */}
              <div className="space-y-1.5">
                <label
                  htmlFor="email"
                  className="block text-[11px] font-medium uppercase tracking-[0.12em] text-white/35"
                  style={{ fontFamily: "'Geist Mono', monospace" }}
                >
                  Email address
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  placeholder="you@company.com"
                  onChange={() => setEmailError(false)}
                  className={`focus-ring w-full rounded-lg border bg-white/[0.03] px-3.5 py-2.5 text-[13.5px] text-white/90 placeholder-white/20 outline-none transition-all duration-200 hover:border-white/[0.13] hover:bg-white/[0.04] focus:border-white/20 focus:bg-white/[0.05] ${
                    emailError
                      ? "border-red-500/40 bg-red-500/[0.04] hover:border-red-500/50 focus:border-red-500/50"
                      : "border-white/[0.07]"
                  }`}
                  style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                />
              </div>

              {/* Password */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label
                    htmlFor="password"
                    className="block text-[11px] font-medium uppercase tracking-[0.12em] text-white/35"
                    style={{ fontFamily: "'Geist Mono', monospace" }}
                  >
                    Password
                  </label>
                  <Link
                    to="/forgot-password"
                    className="text-[11px] text-white/30 transition-colors duration-150 hover:text-white/60"
                  >
                    Forgot?
                  </Link>
                </div>
                <div className="relative">
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="current-password"
                    placeholder="••••••••••••"
                    onChange={() => setPasswordError(false)}
                    className={`focus-ring w-full rounded-lg border bg-white/[0.03] py-2.5 pl-3.5 pr-10 text-[13.5px] text-white/90 placeholder-white/20 outline-none transition-all duration-200 hover:border-white/[0.13] hover:bg-white/[0.04] focus:border-white/20 focus:bg-white/[0.05] ${
                      passwordError
                        ? "border-red-500/40 bg-red-500/[0.04] hover:border-red-500/50 focus:border-red-500/50"
                        : "border-white/[0.07]"
                    }`}
                    style={{ fontFamily: "'Geist Mono', monospace", letterSpacing: showPassword ? "0.02em" : "0.08em" }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((p) => !p)}
                    className="focus-ring absolute right-3 top-1/2 -translate-y-1/2 rounded p-0.5 text-white/25 transition-colors duration-150 hover:text-white/55"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    <EyeIcon open={showPassword} />
                  </button>
                </div>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={isLoading}
                className="focus-ring group relative mt-1 flex w-full items-center justify-center gap-2 overflow-hidden rounded-lg bg-white py-2.5 text-[13px] font-semibold tracking-wide text-black shadow-[0_1px_0_rgba(255,255,255,0.15)_inset] transition-all duration-200 hover:bg-white/90 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-50"
                style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
              >
                {/* shimmer sweep */}
                {!isLoading && (
                  <span
                    aria-hidden
                    className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-black/[0.06] to-transparent transition-transform duration-700 group-hover:translate-x-full"
                  />
                )}
                {isLoading ? (
                  <>
                    <Spinner />
                    <span>Authenticating…</span>
                  </>
                ) : (
                  "Continue"
                )}
              </button>
            </form>

            {/* ── Footer ── */}
            <p
              className="mt-6 text-center text-[12px] text-white/30"
              style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
            >
              No account yet?{" "}
              <Link
                to="/register"
                className="font-medium text-white/60 underline-offset-2 transition-colors duration-150 hover:text-white/90 hover:underline"
              >
                Create one free
              </Link>
            </p>

          </div>

          {/* ── Card bottom edge — subtle gradient ── */}
          <div
            aria-hidden
            className="pointer-events-none absolute bottom-0 left-0 right-0 h-px"
            style={{ background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.04), transparent)" }}
          />
        </div>

        {/* ── Fine print ── */}
        <p
          className="absolute bottom-5 left-1/2 -translate-x-1/2 whitespace-nowrap text-[10px] text-white/15"
          style={{ fontFamily: "'Geist Mono', monospace", letterSpacing: "0.06em" }}
        >
          © 2025 YourApp · All rights reserved
        </p>

      </div>
    </>
  );
}