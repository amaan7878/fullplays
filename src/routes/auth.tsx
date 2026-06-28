import { createFileRoute, Link, useNavigate, useSearch } from "@tanstack/react-router";
import { useState, useEffect, type FormEvent } from "react";
import { ArrowLeft, Eye, EyeOff, Check, X, Mail, KeyRound } from "lucide-react";
import { supabase } from "@/lib/supabase";
import fullplayMark from "@/assets/fullplay-mark.png";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [{ title: "FullPlay — Login or Register" }],
  }),
  validateSearch: (search: Record<string, unknown>) => ({
    type: (search.type as string) ?? "",
    access_token: (search.access_token as string) ?? "",
    mode: (search.mode as string) ?? "",
  }),
  component: AuthPage,
});

// ─── Types ─────────────────────────────────────────────────────────────────────
type Mode = "login" | "register" | "forgot" | "reset";

// ─── Password rules ────────────────────────────────────────────────────────────
const PASSWORD_RULES = [
  { id: "length",  label: "At least 8 characters",  test: (p: string) => p.length >= 8 },
  { id: "upper",   label: "One uppercase letter",    test: (p: string) => /[A-Z]/.test(p) },
  { id: "lower",   label: "One lowercase letter",    test: (p: string) => /[a-z]/.test(p) },
  { id: "number",  label: "One number",              test: (p: string) => /\d/.test(p) },
  { id: "special", label: "One special character",   test: (p: string) => /[!@#$%^&*(),.?":{}|<>\-_=+[\]\\;'`~/]/.test(p) },
] as const;

function getStrength(p: string) {
  const n = PASSWORD_RULES.filter((r) => r.test(p)).length;
  if (n <= 1) return { score: 1, label: "Weak",        color: "bg-red-500" };
  if (n === 2) return { score: 2, label: "Fair",        color: "bg-orange-400" };
  if (n === 3) return { score: 3, label: "Good",        color: "bg-yellow-400" };
  if (n === 4) return { score: 4, label: "Strong",      color: "bg-emerald-400" };
  return              { score: 5, label: "Very strong", color: "bg-emerald-500" };
}

const isPasswordValid = (p: string) => PASSWORD_RULES.every((r) => r.test(p));

// ─── Sub-components ────────────────────────────────────────────────────────────
function PasswordInput({
  value, onChange, placeholder = "••••••••", id,
}: {
  value: string; onChange: (v: string) => void; placeholder?: string; id: string;
}) {
  const [show, setShow] = useState(false);
  return (
    <div className="relative">
      <input
        id={id}
        type={show ? "text" : "password"}
        required
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full h-11 pl-4 pr-11 rounded-xl bg-surface-2 border border-border focus:border-primary outline-none text-sm"
      />
      <button
        type="button"
        onClick={() => setShow((s) => !s)}
        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
        aria-label={show ? "Hide password" : "Show password"}
      >
        {show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
      </button>
    </div>
  );
}

function StrengthMeter({ password }: { password: string }) {
  if (!password) return null;
  const { score, label, color } = getStrength(password);
  return (
    <div className="mt-2 space-y-2">
      <div className="flex gap-1">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className={`h-1 flex-1 rounded-full transition-all duration-300 ${i < score ? color : "bg-border"}`} />
        ))}
      </div>
      <p className="text-[11px] text-muted-foreground text-right">{label}</p>
      <ul className="grid grid-cols-1 gap-0.5">
        {PASSWORD_RULES.map((rule) => {
          const ok = rule.test(password);
          return (
            <li key={rule.id} className={`flex items-center gap-1.5 text-[11px] transition-colors ${ok ? "text-emerald-400" : "text-muted-foreground"}`}>
              {ok ? <Check className="w-3 h-3 shrink-0" /> : <X className="w-3 h-3 shrink-0 opacity-50" />}
              {rule.label}
            </li>
          );
        })}
      </ul>
    </div>
  );
}

function LegalCheckbox({
  id, checked, onChange, children,
}: {
  id: string; checked: boolean; onChange: (v: boolean) => void; children: React.ReactNode;
}) {
  return (
    <label htmlFor={id} className="flex items-start gap-2.5 cursor-pointer group">
      <div className={`mt-0.5 w-4 h-4 shrink-0 rounded border transition-all ${checked ? "bg-gradient-primary border-primary shadow-glow" : "border-border bg-surface-2 group-hover:border-primary/50"} grid place-items-center`}>
        {checked && <Check className="w-2.5 h-2.5 text-white" strokeWidth={3} />}
      </div>
      <input id={id} type="checkbox" className="sr-only" checked={checked} onChange={(e) => onChange(e.target.checked)} />
      <span className="text-xs text-muted-foreground leading-relaxed">{children}</span>
    </label>
  );
}

// ─── Inline view panels ────────────────────────────────────────────────────────

function ForgotView({ onBack }: { onBack: () => void }) {
  const [email, setEmail]     = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState<string | null>(null);
  const [sent, setSent]       = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth?type=recovery`,
      });
      if (error) throw error;
      setSent(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <button
        type="button"
        onClick={onBack}
        className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground mb-5 transition-colors"
      >
        <ArrowLeft className="w-3.5 h-3.5" /> Back to login
      </button>

      <div className="flex items-center gap-3 mb-5">
        <div className="w-10 h-10 rounded-xl bg-surface-2 border border-border grid place-items-center">
          <Mail className="w-5 h-5 text-primary" />
        </div>
        <div>
          <h2 className="font-bold text-sm">Forgot your password?</h2>
          <p className="text-[11px] text-muted-foreground">We'll email you a reset link.</p>
        </div>
      </div>

      {sent ? (
        <div className="text-xs text-emerald-300 bg-emerald-500/10 border border-emerald-500/30 rounded-xl px-4 py-3 leading-relaxed">
          ✓ Reset link sent to <span className="font-semibold">{email}</span>. Check your inbox (and spam folder).
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="reset-email" className="block text-xs font-semibold tracking-wide text-muted-foreground mb-1.5">EMAIL</label>
            <input
              id="reset-email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full h-11 px-4 rounded-xl bg-surface-2 border border-border focus:border-primary outline-none text-sm"
            />
          </div>
          {error && (
            <div className="text-xs text-red-400 bg-red-500/10 border border-red-500/30 rounded-lg px-3 py-2">{error}</div>
          )}
          <button
            type="submit"
            disabled={loading}
            className="w-full h-11 rounded-xl bg-gradient-primary text-primary-foreground font-semibold shadow-glow transition-all hover:-translate-y-0.5 disabled:opacity-60 disabled:hover:translate-y-0"
          >
            {loading ? "Sending…" : "Send reset link"}
          </button>
        </form>
      )}
    </div>
  );
}

function ResetView({ onDone }: { onDone: () => void }) {
  const [password, setPassword] = useState("");
  const [confirm, setConfirm]   = useState("");
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState<string | null>(null);
  const [success, setSuccess]   = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!isPasswordValid(password)) { setError("Password does not meet the requirements."); return; }
    if (password !== confirm)        { setError("Passwords do not match."); return; }
    setLoading(true);
    try {
      const { error } = await supabase.auth.updateUser({ password });
      if (error) throw error;
      setSuccess(true);
      setTimeout(onDone, 2500);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="flex items-center gap-3 mb-5">
        <div className="w-10 h-10 rounded-xl bg-surface-2 border border-border grid place-items-center">
          <KeyRound className="w-5 h-5 text-primary" />
        </div>
        <div>
          <h2 className="font-bold text-sm">Set a new password</h2>
          <p className="text-[11px] text-muted-foreground">Choose something strong you haven't used before.</p>
        </div>
      </div>

      {success ? (
        <div className="text-xs text-emerald-300 bg-emerald-500/10 border border-emerald-500/30 rounded-xl px-4 py-3 leading-relaxed">
          ✓ Password updated! Redirecting you to login…
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="new-password" className="block text-xs font-semibold tracking-wide text-muted-foreground mb-1.5">NEW PASSWORD</label>
            <PasswordInput id="new-password" value={password} onChange={setPassword} />
            <StrengthMeter password={password} />
          </div>
          <div>
            <label htmlFor="confirm-password" className="block text-xs font-semibold tracking-wide text-muted-foreground mb-1.5">CONFIRM NEW PASSWORD</label>
            <PasswordInput id="confirm-password" value={confirm} onChange={setConfirm} />
            {confirm && password !== confirm && (
              <p className="mt-1.5 text-[11px] text-red-400 flex items-center gap-1"><X className="w-3 h-3" /> Passwords do not match</p>
            )}
            {confirm && password === confirm && (
              <p className="mt-1.5 text-[11px] text-emerald-400 flex items-center gap-1"><Check className="w-3 h-3" /> Passwords match</p>
            )}
          </div>
          {error && (
            <div className="text-xs text-red-400 bg-red-500/10 border border-red-500/30 rounded-lg px-3 py-2">{error}</div>
          )}
          <button
            type="submit"
            disabled={loading}
            className="w-full h-11 rounded-xl bg-gradient-primary text-primary-foreground font-semibold shadow-glow transition-all hover:-translate-y-0.5 disabled:opacity-60 disabled:hover:translate-y-0"
          >
            {loading ? "Saving…" : "Save new password"}
          </button>
        </form>
      )}
    </div>
  );
}

// ─── Main page ─────────────────────────────────────────────────────────────────
function AuthPage() {
  const navigate = useNavigate();
  const search   = useSearch({ from: "/auth" });

  const [mode, setMode] = useState<Mode>(() => {
    if (search.type === "recovery") return "reset";
    if (search.mode === "register") return "register";
    return "login";
  });

  useEffect(() => {
    if (search.type === "recovery" && search.access_token) {
      supabase.auth.setSession({
        access_token: search.access_token,
        refresh_token: "",
      });
    }
  }, [search.type, search.access_token]);

  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm]   = useState("");

  const [ageConfirmed, setAgeConfirmed]           = useState(false);
  const [termsAccepted, setTermsAccepted]         = useState(false);
  const [responsibleGaming, setResponsibleGaming] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState<string | null>(null);
  const [info, setInfo]       = useState<string | null>(null);

  const resetForm = () => {
    setEmail(""); setPassword(""); setConfirm("");
    setAgeConfirmed(false); setTermsAccepted(false); setResponsibleGaming(false);
    setError(null); setInfo(null);
  };

  const switchMode = (m: Mode) => { resetForm(); setMode(m); };

  const validate = (): string | null => {
    if (mode === "register") {
      if (!isPasswordValid(password)) return "Password does not meet the requirements.";
      if (password !== confirm)        return "Passwords do not match.";
      if (!ageConfirmed)               return "You must confirm you are 18 or older.";
      if (!termsAccepted)              return "You must accept the Terms & Conditions.";
      if (!responsibleGaming)          return "You must acknowledge the Responsible Gaming policy.";
    }
    return null;
  };

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null); setInfo(null);
    const ve = validate();
    if (ve) { setError(ve); return; }
    setLoading(true);
    try {
      if (mode === "login") {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        navigate({ to: "/" });
      } else {
        const { error } = await supabase.auth.signUp({
          email, password,
          options: { emailRedirectTo: window.location.origin },
        });
        if (error) throw error;
        // switchMode resets the form (including info), so set info after
        switchMode("login");
        setInfo("Check your email to confirm your account, then log in.");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const isRegister = mode === "register";

  return (
    <div className="min-h-screen bg-background text-foreground flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-md">

        {(mode === "login" || mode === "register") && (
          <Link to="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6">
            <ArrowLeft className="w-4 h-4" /> Back to home
          </Link>
        )}

        <div className="rounded-2xl bg-surface border border-border p-6 sm:p-8 shadow-glow">

          {/* Logo */}
          <div className="flex items-center gap-1 mb-6">
            <img src={fullplayMark} alt="FullPlay" className="h-14 w-14 rounded-xl object-contain" />
            <div className="leading-none">
              <div className="text-xl sm:text-2xl font-extrabold tracking-tight -ml-0.5 sm:-ml-1">
                FULL<span className="text-gradient-hero">PLAY</span>
              </div>
              <div className="text-[9px] tracking-[0.25em] text-muted-foreground mt-1">PLAY. WIN. REPEAT.</div>
            </div>
          </div>

          {mode === "forgot" && (
            <ForgotView onBack={() => switchMode("login")} />
          )}

          {mode === "reset" && (
            <ResetView onDone={() => switchMode("login")} />
          )}

          {(mode === "login" || mode === "register") && (
            <>
              {/* Tab toggle */}
              <div className="grid grid-cols-2 p-1 rounded-xl bg-surface-2 border border-border mb-6">
                {(["login", "register"] as const).map((m) => (
                  <button
                    key={m}
                    type="button"
                    onClick={() => switchMode(m)}
                    className={`h-9 rounded-lg text-sm font-semibold capitalize transition-all ${
                      mode === m
                        ? "bg-gradient-primary text-primary-foreground shadow-glow"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {m}
                  </button>
                ))}
              </div>

              <form onSubmit={onSubmit} className="space-y-4">
                {/* Email */}
                <div>
                  <label htmlFor="email" className="block text-xs font-semibold tracking-wide text-muted-foreground mb-1.5">EMAIL</label>
                  <input
                    id="email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="w-full h-11 px-4 rounded-xl bg-surface-2 border border-border focus:border-primary outline-none text-sm"
                  />
                </div>

                {/* Password */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label htmlFor="password" className="block text-xs font-semibold tracking-wide text-muted-foreground">PASSWORD</label>
                    {mode === "login" && (
                      <button
                        type="button"
                        onClick={() => switchMode("forgot")}
                        className="text-[11px] text-primary hover:underline font-semibold"
                      >
                        Forgot password?
                      </button>
                    )}
                  </div>
                  <PasswordInput id="password" value={password} onChange={setPassword} />
                  {isRegister && <StrengthMeter password={password} />}
                </div>

                {/* Confirm password */}
                {isRegister && (
                  <div>
                    <label htmlFor="confirm" className="block text-xs font-semibold tracking-wide text-muted-foreground mb-1.5">CONFIRM PASSWORD</label>
                    <PasswordInput id="confirm" value={confirm} onChange={setConfirm} />
                    {confirm && password !== confirm && (
                      <p className="mt-1.5 text-[11px] text-red-400 flex items-center gap-1"><X className="w-3 h-3" /> Passwords do not match</p>
                    )}
                    {confirm && password === confirm && (
                      <p className="mt-1.5 text-[11px] text-emerald-400 flex items-center gap-1"><Check className="w-3 h-3" /> Passwords match</p>
                    )}
                  </div>
                )}

                {/* Legal checkboxes */}
                {isRegister && (
                  <div className="space-y-3 pt-1 border-t border-border">
                    <p className="text-[10px] font-semibold tracking-widest text-muted-foreground pt-1">REQUIRED CONFIRMATIONS</p>
                    <LegalCheckbox id="age" checked={ageConfirmed} onChange={setAgeConfirmed}>
                      I confirm that I am{" "}
                      <span className="text-foreground font-semibold">18 years of age or older</span>.{" "}
                      Underage gambling is illegal and prohibited.
                    </LegalCheckbox>
                    <LegalCheckbox id="terms" checked={termsAccepted} onChange={setTermsAccepted}>
                      I have read and agree to the{" "}
                      <Link to="/terms" className="text-primary hover:underline font-semibold">Terms &amp; Conditions</Link>
                      {" "}and{" "}
                      <Link to="/privacy" className="text-primary hover:underline font-semibold">Privacy Policy</Link>.
                    </LegalCheckbox>
                    <LegalCheckbox id="rg" checked={responsibleGaming} onChange={setResponsibleGaming}>
                      I acknowledge the{" "}
                      <Link to="/responsible-gaming" className="text-primary hover:underline font-semibold">Responsible Gaming policy</Link>.
                      {" "}I understand that gambling can be addictive and I may set limits on my account at any time.
                    </LegalCheckbox>
                  </div>
                )}

                {error && <div className="text-xs text-red-400 bg-red-500/10 border border-red-500/30 rounded-lg px-3 py-2">{error}</div>}
                {info  && <div className="text-xs text-emerald-300 bg-emerald-500/10 border border-emerald-500/30 rounded-lg px-3 py-2">{info}</div>}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full h-11 rounded-xl bg-gradient-primary text-primary-foreground font-semibold shadow-glow transition-all hover:-translate-y-0.5 disabled:opacity-60 disabled:hover:translate-y-0"
                >
                  {loading ? "Please wait…" : mode === "login" ? "Login" : "Create account"}
                </button>
              </form>

              <p className="mt-5 text-center text-xs text-muted-foreground">
                {mode === "login" ? "New here? " : "Already have an account? "}
                <button
                  type="button"
                  onClick={() => switchMode(mode === "login" ? "register" : "login")}
                  className="text-primary font-semibold hover:underline"
                >
                  {mode === "login" ? "Create an account" : "Log in"}
                </button>
              </p>
            </>
          )}
        </div>

        {/* Responsible gaming footer */}
        <p className="mt-4 text-center text-[10px] text-muted-foreground/60 leading-relaxed">
          FullPlay promotes responsible gaming. If gambling is affecting your life, visit{" "}
          <a href="https://www.begambleaware.org" target="_blank" rel="noopener noreferrer" className="underline hover:text-muted-foreground">
            BeGambleAware.org
          </a>.
        </p>
      </div>
    </div>
  );
}