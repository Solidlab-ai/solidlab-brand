"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";

type Theme = "light" | "dark";

function getInitialTheme(): Theme {
  if (typeof window === "undefined") return "light";
  const saved = localStorage.getItem("solidlab-theme") as Theme | null;
  if (saved === "light" || saved === "dark") return saved;
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const from = searchParams.get("from") || "/";

  const [theme, setTheme] = useState<Theme>("light");
  
  useEffect(() => {
    const t = getInitialTheme();
    setTheme(t);
    document.documentElement.dataset.theme = t;
  }, []);
  
  function toggleTheme() {
    const next: Theme = theme === "dark" ? "light" : "dark";
    setTheme(next);
    document.documentElement.dataset.theme = next;
    localStorage.setItem("solidlab-theme", next);
  }

  const [step, setStep] = useState<"email" | "code">("email");
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [hint, setHint] = useState("");

  async function handleSend(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/otp?action=send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setHint(data.hint);
      setStep("code");
    } catch (err: any) {
      setError(err.message || "Feil");
    } finally {
      setLoading(false);
    }
  }

  async function handleVerify(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/otp?action=verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, code }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      router.push(from);
    } catch (err: any) {
      setError(err.message || "Feil kode");
    } finally {
      setLoading(false);
    }
  }

  // Web OTP API - automatisk henting av SMS-kode på Android/Chrome
  useEffect(() => {
    if (step !== "code") return;
    if (!("OTPCredential" in window)) return;

    const ac = new AbortController();
    const timeout = setTimeout(() => ac.abort(), 5 * 60_000);

    navigator.credentials
      .get({
        // @ts-expect-error - otp er ikke i TS-typene ennå
        otp: { transport: ["sms"] },
        signal: ac.signal,
      })
      .then((otp: any) => {
        if (otp?.code) {
          setCode(otp.code);
          setTimeout(() => {
            document.querySelector<HTMLFormElement>("form")?.requestSubmit();
          }, 300);
        }
      })
      .catch(() => {})
      .finally(() => clearTimeout(timeout));

    return () => {
      ac.abort();
      clearTimeout(timeout);
    };
  }, [step]);

  const monoLabel: React.CSSProperties = {
    fontFamily: "var(--font-mono)",
    fontSize: "11px",
    letterSpacing: "0.08em",
    textTransform: "uppercase",
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 24,
        background: "var(--bg)",
        position: "relative",
      }}
    >
      {/* Theme-toggle øverst i hjørnet */}
      <button
        onClick={toggleTheme}
        style={{
          position: "absolute",
          top: 24,
          right: 24,
          padding: "8px 14px",
          background: "transparent",
          color: "var(--fg-secondary)",
          border: "1px solid var(--divider)",
          fontFamily: "var(--font-mono)",
          fontSize: "11px",
          letterSpacing: "0.08em",
          textTransform: "uppercase",
          cursor: "pointer",
          transition: "all 150ms",
        }}
        onMouseOver={(e) => {
          e.currentTarget.style.color = "var(--fg)";
          e.currentTarget.style.borderColor = "var(--fg-secondary)";
        }}
        onMouseOut={(e) => {
          e.currentTarget.style.color = "var(--fg-secondary)";
          e.currentTarget.style.borderColor = "var(--divider)";
        }}
        aria-label="Toggle theme"
      >
        {theme === "dark" ? "Light" : "Dark"}
      </button>
      
      <div style={{ width: "100%", maxWidth: 440 }}>
        {/* Solidlab wordmark */}
        <div style={{ textAlign: "center", marginBottom: 48 }}>
          <a
            href="https://solidlab.ai"
            style={{
              fontFamily: "var(--font-sans)",
              fontSize: "28px",
              lineHeight: 1,
              letterSpacing: "-0.02em",
              color: "var(--fg)",
              textDecoration: "none",
              display: "inline-flex",
              alignItems: "baseline",
            }}
          >
            <span style={{ fontWeight: 700, letterSpacing: "-0.02em" }}>solid</span>
            <span style={{ fontWeight: 400 }}>lab</span>
            <span style={{ fontWeight: 400, color: "var(--accent)" }}>.ai</span>
          </a>
          <div
            style={{
              ...monoLabel,
              color: "var(--fg-tertiary)",
              marginTop: "12px",
            }}
          >
            / Brand
          </div>
        </div>

        {/* Login card - sharp corners (brand) */}
        <div
          style={{
            background: "var(--card)",
            border: "1px solid var(--divider)",
            padding: "40px 32px",
          }}
        >
          {step === "email" && (
            <form onSubmit={handleSend}>
              <div
                style={{
                  ...monoLabel,
                  color: "var(--accent)",
                  marginBottom: "16px",
                }}
              >
                / Logg inn
              </div>
              <h1
                style={{
                  fontFamily: "var(--font-sans)",
                  fontSize: "32px",
                  fontWeight: 700,
                  letterSpacing: "-0.02em",
                  lineHeight: 1.1,
                  color: "var(--fg)",
                  marginBottom: "12px",
                  textWrap: "balance",
                }}
              >
                Vi sender en kode
                <br />
                på <em style={{ color: "var(--accent)", fontStyle: "italic", fontWeight: 500 }}>SMS</em>.
              </h1>
              <p
                style={{
                  fontSize: "14px",
                  color: "var(--fg-secondary)",
                  marginBottom: "24px",
                  lineHeight: 1.5,
                }}
              >
                Skriv inn eposten din. Du får en engangskode som er gyldig i 10 minutter.
              </p>

              <label style={{ ...monoLabel, color: "var(--fg-tertiary)", display: "block", marginBottom: "8px" }}>
                / Epost
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="yourname@solidlab.ai"
                required
                autoFocus
                style={{
                  width: "100%",
                  padding: "14px 16px",
                  fontSize: "16px",
                  fontFamily: "var(--font-sans)",
                  background: "var(--bg)",
                  border: "1px solid var(--divider)",
                  color: "var(--fg)",
                  outline: "none",
                  marginBottom: "16px",
                  boxSizing: "border-box",
                }}
              />

              {error && (
                <div
                  style={{
                    padding: "12px 14px",
                    background: "rgba(196, 68, 68, 0.08)",
                    borderLeft: "3px solid #c44",
                    color: "#c44",
                    fontSize: "13px",
                    marginBottom: "16px",
                  }}
                >
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                style={{
                  width: "100%",
                  padding: "16px",
                  background: "var(--fg)",
                  color: "var(--bg)",
                  border: "0",
                  fontFamily: "var(--font-sans)",
                  fontSize: "15px",
                  fontWeight: 500,
                  cursor: loading ? "not-allowed" : "pointer",
                  opacity: loading ? 0.6 : 1,
                  letterSpacing: "0.02em",
                  transition: "background 150ms",
                }}
                onMouseOver={(e) => !loading && (e.currentTarget.style.background = "var(--accent)")}
                onMouseOut={(e) => (e.currentTarget.style.background = "var(--fg)")}
              >
                {loading ? "Sender..." : "Send engangskode →"}
              </button>
            </form>
          )}

          {step === "code" && (
            <form onSubmit={handleVerify}>
              <div
                style={{
                  ...monoLabel,
                  color: "var(--accent)",
                  marginBottom: "16px",
                }}
              >
                / Verifiser
              </div>
              <h1
                style={{
                  fontFamily: "var(--font-sans)",
                  fontSize: "28px",
                  fontWeight: 700,
                  letterSpacing: "-0.02em",
                  lineHeight: 1.1,
                  color: "var(--fg)",
                  marginBottom: "12px",
                }}
              >
                Skriv inn koden.
              </h1>
              <p
                style={{
                  fontSize: "14px",
                  color: "var(--fg-secondary)",
                  marginBottom: "8px",
                  lineHeight: 1.5,
                }}
              >
                {hint}
              </p>
              <p
                style={{
                  ...monoLabel,
                  color: "var(--fg-tertiary)",
                  marginBottom: "24px",
                }}
              >
                / Gyldig i 10 minutter
              </p>

              <label style={{ ...monoLabel, color: "var(--fg-tertiary)", display: "block", marginBottom: "8px" }}>
                / 6-sifret kode
              </label>
              <input
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                autoComplete="one-time-code"
                name="otp"
                value={code}
                onChange={(e) => setCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
                placeholder="••••••"
                required
                autoFocus
                maxLength={6}
                style={{
                  width: "100%",
                  padding: "18px 16px",
                  fontSize: "28px",
                  textAlign: "center",
                  letterSpacing: "0.5em",
                  fontFamily: "var(--font-mono)",
                  background: "var(--bg)",
                  border: "1px solid var(--divider)",
                  color: "var(--fg)",
                  outline: "none",
                  marginBottom: "16px",
                  boxSizing: "border-box",
                }}
              />

              {error && (
                <div
                  style={{
                    padding: "12px 14px",
                    background: "rgba(196, 68, 68, 0.08)",
                    borderLeft: "3px solid #c44",
                    color: "#c44",
                    fontSize: "13px",
                    marginBottom: "16px",
                  }}
                >
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading || code.length < 6}
                style={{
                  width: "100%",
                  padding: "16px",
                  background: "var(--fg)",
                  color: "var(--bg)",
                  border: "0",
                  fontFamily: "var(--font-sans)",
                  fontSize: "15px",
                  fontWeight: 500,
                  cursor: loading ? "not-allowed" : "pointer",
                  opacity: loading || code.length < 6 ? 0.6 : 1,
                  letterSpacing: "0.02em",
                  marginBottom: "12px",
                  transition: "background 150ms",
                }}
                onMouseOver={(e) => !loading && (e.currentTarget.style.background = "var(--accent)")}
                onMouseOut={(e) => (e.currentTarget.style.background = "var(--fg)")}
              >
                {loading ? "Verifiserer..." : "Logg inn →"}
              </button>

              <button
                type="button"
                onClick={() => {
                  setStep("email");
                  setCode("");
                  setError("");
                }}
                style={{
                  width: "100%",
                  padding: "10px",
                  background: "transparent",
                  color: "var(--fg-tertiary)",
                  border: "0",
                  fontFamily: "var(--font-mono)",
                  fontSize: "12px",
                  letterSpacing: "0.05em",
                  cursor: "pointer",
                }}
              >
                ← Bytt epost
              </button>
            </form>
          )}
        </div>

        {/* Support-info */}
        <div
          style={{
            marginTop: "32px",
            textAlign: "center",
            fontSize: "13px",
            color: "var(--fg-secondary)",
            lineHeight: 1.6,
          }}
        >
          Mangler du tilgang eller opplever du tekniske problemer?
          <br />
          Send mail til{" "}
          <a
            href="mailto:support@solidlab.ai"
            style={{
              color: "var(--accent)",
              textDecoration: "none",
              borderBottom: "1px solid transparent",
              transition: "border-color 150ms",
            }}
            onMouseOver={(e) => (e.currentTarget.style.borderBottomColor = "currentColor")}
            onMouseOut={(e) => (e.currentTarget.style.borderBottomColor = "transparent")}
          >
            support@solidlab.ai
          </a>
        </div>
        
        {/* Internal access label nederst */}
        <div
          style={{
            marginTop: "20px",
            textAlign: "center",
            ...monoLabel,
            color: "var(--fg-tertiary)",
          }}
        >
          / Internal access only
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginForm />
    </Suspense>
  );
}
