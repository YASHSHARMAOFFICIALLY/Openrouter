import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import Cookies from "js-cookie";

// Minimal grid background SVG pattern
const GridPattern = () => (
  <svg
    className="absolute inset-0 w-full h-full opacity-[0.04] pointer-events-none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <defs>
      <pattern id="grid" width="48" height="48" patternUnits="userSpaceOnUse">
        <path d="M 48 0 L 0 0 0 48" fill="none" stroke="white" strokeWidth="0.5" />
      </pattern>
    </defs>
    <rect width="100%" height="100%" fill="url(#grid)" />
  </svg>
);

// Animated scan line
const ScanLine = () => (
  <div
    style={{
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      height: "1px",
      background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.15), transparent)",
      animation: "scanline 4s linear infinite",
      pointerEvents: "none",
    }}
  />
);

export  function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [emailError, setEmailError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [toast, setToast] = useState(null);
  const [mounted, setMounted] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setMounted(true);
    const verifyToken = async () => {
      const token = Cookies.get("token");
      if (token) {
        try {
          const response = await fetch(`${import.meta.env.VITE_API_URL}/verify`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ token }),
          });
          const data = await response.json();
          if (data.valid) {
            navigate("/chat");
          } else {
            Cookies.remove("token");
          }
        } catch {
          Cookies.remove("token");
        }
      }
    };
    verifyToken();
  }, [navigate]);

  type ToastType = {
  message: string;
  type: "error" | "success";
} | null;




  const showToast = (message:string, type : "error"| "success" = "error") => {
    const [toast, setToast] = useState<ToastType>(null);
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  const handleEmailLogin = async (e:React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    const form = e.currentTarget;
const email = (form.elements.namedItem("email") as HTMLInputElement).value;
const password = (form.elements.namedItem("password") as HTMLInputElement).value;

    let hasError = false;

    if (!email.includes("@") || !email.includes(".") || email.includes(" ") || email === "") {
      showToast("Invalid email address");
      setEmailError(true);
      hasError = true;
    } else {
      setEmailError(false);
    }

    if (password === "") {
      showToast("Password cannot be empty");
      setPasswordError(true);
      hasError = true;
    } else {
      setPasswordError(false);
    }

    if (hasError) return;

    setIsLoading(true);
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();

      if (response.ok) {
        Cookies.set("token", data.token, { expires: 365, sameSite: "None", secure: true, path: "/" });
        showToast("Access granted.", "success");
        setTimeout(() => navigate("/chat"), 800);
      } else {
        showToast(data.error || "Invalid credentials. Try again.");
      }
    } catch {
      showToast("Connection error. Try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDiscordLogin = () => {
    const CLIENT_ID = import.meta.env.VITE_DISCORD_CLIENT_ID;
    const REDIRECT_URI = `${import.meta.env.VITE_BASE_URL}/discord-callback`;
    const authUrl = `https://discord.com/api/oauth2/authorize?client_id=${CLIENT_ID}&redirect_uri=${encodeURIComponent(REDIRECT_URI)}&response_type=token&scope=identify%20email`;
    window.location.href = authUrl;
  };

  const handleGoogleLogin = () => {
    // Integrate with @react-oauth/google's useGoogleLogin or redirect flow
    console.log("Google login");
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Mono:ital,wght@0,300;0,400;0,500;1,300&family=Syne:wght@400;500;600;700;800&display=swap');

        * { box-sizing: border-box; margin: 0; padding: 0; }

        body { background: #000; }

        @keyframes scanline {
          0% { top: -2px; }
          100% { top: 100%; }
        }

        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        @keyframes toastIn {
          from { opacity: 0; transform: translateX(20px); }
          to   { opacity: 1; transform: translateX(0); }
        }

        @keyframes toastOut {
          from { opacity: 1; }
          to   { opacity: 0; }
        }

        .login-root {
          min-height: 100vh;
          background: #000;
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: 'DM Mono', monospace;
          position: relative;
          overflow: hidden;
        }

        .corner-accent {
          position: absolute;
          width: 120px;
          height: 120px;
          pointer-events: none;
        }
        .corner-accent.tl { top: 0; left: 0; border-top: 1px solid rgba(255,255,255,0.12); border-left: 1px solid rgba(255,255,255,0.12); }
        .corner-accent.tr { top: 0; right: 0; border-top: 1px solid rgba(255,255,255,0.12); border-right: 1px solid rgba(255,255,255,0.12); }
        .corner-accent.bl { bottom: 0; left: 0; border-bottom: 1px solid rgba(255,255,255,0.12); border-left: 1px solid rgba(255,255,255,0.12); }
        .corner-accent.br { bottom: 0; right: 0; border-bottom: 1px solid rgba(255,255,255,0.12); border-right: 1px solid rgba(255,255,255,0.12); }

        .card {
          position: relative;
          width: 100%;
          max-width: 420px;
          padding: 48px 40px;
          border: 1px solid rgba(255,255,255,0.08);
          background: rgba(255,255,255,0.015);
          backdrop-filter: blur(12px);
          animation: fadeUp 0.6s ease both;
        }

        @media (max-width: 480px) {
          .card {
            max-width: 100%;
            min-height: 100vh;
            border: none;
            padding: 40px 24px;
            display: flex;
            flex-direction: column;
            justify-content: center;
          }
        }

        .card::before {
          content: '';
          position: absolute;
          inset: -1px;
          background: linear-gradient(135deg, rgba(255,255,255,0.06) 0%, transparent 50%);
          pointer-events: none;
        }

        .back-link {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          font-size: 11px;
          color: rgba(255,255,255,0.4);
          text-decoration: none;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          margin-bottom: 40px;
          transition: color 0.2s;
        }
        .back-link:hover { color: rgba(255,255,255,0.75); }
        .back-link svg { transition: transform 0.2s; }
        .back-link:hover svg { transform: translateX(-3px); }

        .header-tag {
          font-size: 10px;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: rgba(255,255,255,0.3);
          margin-bottom: 12px;
          font-family: 'DM Mono', monospace;
        }

        .header-title {
          font-family: 'Syne', sans-serif;
          font-size: 32px;
          font-weight: 700;
          color: #fff;
          line-height: 1.1;
          margin-bottom: 8px;
          letter-spacing: -0.02em;
        }

        .header-sub {
          font-size: 12px;
          color: rgba(255,255,255,0.35);
          line-height: 1.6;
          margin-bottom: 32px;
          letter-spacing: 0.02em;
        }

        .oauth-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 10px;
          margin-bottom: 28px;
        }

        .oauth-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          padding: 10px 12px;
          background: transparent;
          border: 1px solid rgba(255,255,255,0.1);
          color: rgba(255,255,255,0.7);
          font-family: 'DM Mono', monospace;
          font-size: 12px;
          letter-spacing: 0.05em;
          cursor: pointer;
          transition: all 0.2s;
          position: relative;
          overflow: hidden;
        }
        .oauth-btn::after {
          content: '';
          position: absolute;
          inset: 0;
          background: rgba(255,255,255,0);
          transition: background 0.2s;
        }
        .oauth-btn:hover {
          border-color: rgba(255,255,255,0.3);
          color: #fff;
        }
        .oauth-btn:hover::after {
          background: rgba(255,255,255,0.03);
        }

        .divider {
          display: flex;
          align-items: center;
          gap: 16px;
          margin-bottom: 24px;
        }
        .divider-line { flex: 1; height: 1px; background: rgba(255,255,255,0.07); }
        .divider-text { font-size: 10px; color: rgba(255,255,255,0.25); letter-spacing: 0.15em; text-transform: uppercase; }

        .field {
          margin-bottom: 14px;
          position: relative;
        }

        .field-label {
          font-size: 10px;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          color: rgba(255,255,255,0.35);
          margin-bottom: 6px;
          display: block;
        }

        .field-input {
          width: 100%;
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.08);
          color: #fff;
          font-family: 'DM Mono', monospace;
          font-size: 13px;
          padding: 12px 44px 12px 14px;
          outline: none;
          transition: border-color 0.2s, background 0.2s;
          letter-spacing: 0.02em;
        }
        .field-input::placeholder { color: rgba(255,255,255,0.2); }
        .field-input:focus {
          border-color: rgba(255,255,255,0.3);
          background: rgba(255,255,255,0.05);
        }
        .field-input.error {
          border-color: rgba(255, 80, 80, 0.5);
          background: rgba(255, 60, 60, 0.04);
        }
        .field-input:focus.error {
          border-color: rgba(255, 100, 100, 0.6);
        }

        .eye-btn {
          position: absolute;
          right: 14px;
          top: 50%;
          transform: translateY(-50%);
          background: none;
          border: none;
          color: rgba(255,255,255,0.3);
          cursor: pointer;
          padding: 0;
          display: flex;
          align-items: center;
          transition: color 0.2s;
        }
        .eye-btn:hover { color: rgba(255,255,255,0.6); }

        .submit-btn {
          width: 100%;
          margin-top: 8px;
          padding: 14px;
          background: #fff;
          color: #000;
          border: none;
          font-family: 'Syne', sans-serif;
          font-size: 13px;
          font-weight: 600;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          cursor: pointer;
          transition: all 0.2s;
          position: relative;
          overflow: hidden;
        }
        .submit-btn:hover:not(:disabled) {
          background: rgba(255,255,255,0.88);
        }
        .submit-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }
        .submit-btn::before {
          content: '';
          position: absolute;
          left: -100%;
          top: 0;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(0,0,0,0.06), transparent);
          transition: left 0.4s;
        }
        .submit-btn:hover::before { left: 100%; }

        .footer-link {
          margin-top: 24px;
          font-size: 11px;
          color: rgba(255,255,255,0.3);
          text-align: center;
          letter-spacing: 0.05em;
        }
        .footer-link a {
          color: rgba(255,255,255,0.65);
          text-decoration: none;
          border-bottom: 1px solid rgba(255,255,255,0.2);
          padding-bottom: 1px;
          transition: color 0.2s, border-color 0.2s;
        }
        .footer-link a:hover {
          color: #fff;
          border-color: rgba(255,255,255,0.5);
        }

        .toast {
          position: fixed;
          top: 20px;
          right: 20px;
          z-index: 9999;
          padding: 12px 18px;
          background: rgba(10,10,10,0.95);
          border: 1px solid rgba(255,255,255,0.1);
          font-family: 'DM Mono', monospace;
          font-size: 12px;
          letter-spacing: 0.04em;
          animation: toastIn 0.25s ease both;
          max-width: 300px;
        }
        .toast.error { border-left: 2px solid rgba(255,80,80,0.6); color: rgba(255,180,180,0.9); }
        .toast.success { border-left: 2px solid rgba(100,255,150,0.5); color: rgba(150,255,180,0.9); }

        .status-dot {
          display: inline-block;
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: rgba(100,255,150,0.6);
          margin-right: 8px;
          animation: pulse 2s ease infinite;
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.3; }
        }

        .loading-dots span {
          display: inline-block;
          animation: blink 1.2s ease infinite;
        }
        .loading-dots span:nth-child(2) { animation-delay: 0.2s; }
        .loading-dots span:nth-child(3) { animation-delay: 0.4s; }
        @keyframes blink {
          0%, 80%, 100% { opacity: 0.2; }
          40% { opacity: 1; }
        }
      `}</style>

      <div className="login-root">
        <GridPattern />
        <ScanLine />
        <div className="corner-accent tl" />
        <div className="corner-accent tr" />
        <div className="corner-accent bl" />
        <div className="corner-accent br" />

        {/* system status indicator — top left */}
        <div style={{ position: "fixed", top: 20, left: 24, display: "flex", alignItems: "center", fontSize: 10, color: "rgba(255,255,255,0.25)", letterSpacing: "0.15em", fontFamily: "'DM Mono', monospace", textTransform: "uppercase" }}>
          <span className="status-dot" />
          Systems online
        </div>

        {/* {toast && (
          <div className={`toast ${toast.type}`}>
            {toast.message}
          </div>
        )} */}

        <div
          className="card"
          style={{
            opacity: mounted ? 1 : 0,
            transform: mounted ? "none" : "translateY(12px)",
            transition: "opacity 0.5s ease, transform 0.5s ease",
          }}
        >
          <Link to="/" className="back-link">
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M9 2L4 7L9 12" stroke="currentColor" strokeWidth="1.2" strokeLinecap="square" />
            </svg>
            Return
          </Link>

          <p className="header-tag">Auth / Login</p>
          <h1 className="header-title">Welcome<br />back.</h1>
          <p className="header-sub">Enter your credentials to continue.</p>

          {/* OAuth */}
          <div className="oauth-row">
            <button className="oauth-btn" onClick={handleGoogleLogin}>
              <svg width="14" height="14" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Google
            </button>
            <button className="oauth-btn" onClick={handleDiscordLogin}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="rgba(255,255,255,0.6)">
                <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03z"/>
              </svg>
              Discord
            </button>
          </div>

          <div className="divider">
            <div className="divider-line" />
            <span className="divider-text">or</span>
            <div className="divider-line" />
          </div>

          {/* Form */}
          <form onSubmit={handleEmailLogin} noValidate>
            <div className="field">
              <label className="field-label" htmlFor="email">Email</label>
              <input
                className={`field-input${emailError ? " error" : ""}`}
                type="email"
                id="email"
                name="email"
                placeholder="you@domain.com"
                autoComplete="email"
                onChange={() => setEmailError(false)}
              />
            </div>

            <div className="field">
              <label className="field-label" htmlFor="password">Password</label>
              <div style={{ position: "relative" }}>
                <input
                  className={`field-input${passwordError ? " error" : ""}`}
                  type={showPassword ? "text" : "password"}
                  id="password"
                  name="password"
                  placeholder="••••••••••"
                  autoComplete="current-password"
                  onChange={() => setPasswordError(false)}
                />
                <button
                  type="button"
                  className="eye-btn"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{ top: "50%", transform: "translateY(-50%)" }}
                >
                  {showPassword ? (
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/>
                      <line x1="1" y1="1" x2="23" y2="23"/>
                    </svg>
                  ) : (
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                      <circle cx="12" cy="12" r="3"/>
                    </svg>
                  )}
                </button>
              </div>
            </div>

            <button type="submit" className="submit-btn" disabled={isLoading}>
              {isLoading ? (
                <span className="loading-dots">
                  <span>.</span><span>.</span><span>.</span>
                </span>
              ) : (
                "Continue →"
              )}
            </button>
          </form>

          <p className="footer-link">
            No account? <Link to="/register">Create one</Link>
          </p>
        </div>
      </div>
    </>
  );
}
