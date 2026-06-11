import { Link } from "@tanstack/react-router";
import { Play, ChevronLeft, ShieldCheck } from "lucide-react";
import type { ReactNode } from "react";
import fullplayMark from "@/assets/fullplay-mark.png";

type Section = { id: string; title: string; body: ReactNode };

export function LegalLayout({
  eyebrow,
  title,
  intro,
  updated,
  sections,
}: {
  eyebrow: string;
  title: string;
  intro: string;
  updated: string;
  sections: Section[];
}) {
  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Top bar */}
      <header className="border-b border-border bg-surface/60 backdrop-blur sticky top-0 z-30">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 h-14 sm:h-16 flex items-center justify-between gap-3">
          <Link to="/" className="flex items-center gap-2">
            <img src={fullplayMark} alt="Fullplay" className="h-10 w-10 object-contain drop-shadow-[0_0_12px_rgba(168,85,247,0.45)]" />
            <div className="text-xl font-extrabold leading-none tracking-tight">
              Full<span className="text-gradient-hero">play</span>
            </div>
          </Link>
          <Link
            to="/"
            className="flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-muted-foreground hover:text-primary transition"
          >
            <ChevronLeft className="w-4 h-4" /> Back to Casino
          </Link>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden border-b border-border">
        <div className="absolute inset-0 bg-gradient-primary opacity-[0.12]" />
        <div className="absolute -top-24 -right-24 w-80 h-80 rounded-full bg-primary/30 blur-3xl" />
        <div className="relative max-w-[1200px] mx-auto px-4 sm:px-6 py-10 sm:py-16 animate-fade-in">
          <span className="inline-flex items-center gap-1.5 text-[10px] tracking-[0.25em] font-semibold border border-primary/40 text-primary px-2.5 py-1 rounded-md bg-surface/80 backdrop-blur">
            <ShieldCheck className="w-3 h-3" /> {eyebrow}
          </span>
          <h1 className="mt-4 text-3xl sm:text-5xl font-extrabold tracking-tight">
            <span className="text-gradient-hero">{title}</span>
          </h1>
          <p className="mt-3 sm:mt-4 max-w-2xl text-sm sm:text-base text-muted-foreground leading-relaxed">
            {intro}
          </p>
          <p className="mt-3 text-[11px] tracking-wider text-muted-foreground/80 uppercase">
            Last updated: {updated}
          </p>
        </div>
      </section>

      {/* Content */}
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 py-8 sm:py-12 grid lg:grid-cols-[260px_1fr] gap-6 sm:gap-10">
        {/* TOC */}
        <aside className="lg:sticky lg:top-20 self-start rounded-2xl bg-surface border border-border p-4 sm:p-5 lg:max-h-[calc(100vh-6rem)] lg:overflow-y-auto">
          <div className="text-[10px] tracking-[0.25em] font-semibold text-muted-foreground mb-3">CONTENTS</div>
          <ul className="space-y-1">
            {sections.map((s, i) => (
              <li key={s.id}>
                <a
                  href={`#${s.id}`}
                  className="flex items-start gap-2 px-2 py-1.5 rounded-lg text-xs sm:text-sm text-muted-foreground hover:text-foreground hover:bg-surface-2 transition"
                >
                  <span className="text-primary font-bold tabular-nums w-5 shrink-0">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="font-medium">{s.title}</span>
                </a>
              </li>
            ))}
          </ul>
        </aside>

        {/* Sections */}
        <main className="space-y-6 sm:space-y-8">
          {sections.map((s, i) => (
            <article
              key={s.id}
              id={s.id}
              className="scroll-mt-20 rounded-2xl bg-surface border border-border p-5 sm:p-7 hover:border-primary/40 transition-colors"
            >
              <div className="flex items-center gap-3 mb-3">
                <span className="grid place-items-center w-8 h-8 rounded-lg bg-gradient-primary text-primary-foreground text-xs font-extrabold shadow-glow tabular-nums">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h2 className="text-lg sm:text-xl font-extrabold tracking-tight">{s.title}</h2>
              </div>
              <div className="text-sm sm:text-[15px] text-muted-foreground leading-relaxed space-y-3">
                {s.body}
              </div>
            </article>
          ))}

          <div className="rounded-2xl bg-gradient-primary p-5 sm:p-7 shadow-glow text-primary-foreground">
            <div className="text-[10px] tracking-[0.25em] font-semibold opacity-90">NEED HELP?</div>
            <h3 className="mt-1 text-xl sm:text-2xl font-extrabold">Our team is here 24/7</h3>
            <p className="mt-2 text-sm opacity-90 max-w-lg">
              Questions about this policy or your account? Reach out anytime — we usually reply in under 2 minutes.
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              <a href="mailto:support@fullplay.app" className="h-10 px-4 rounded-lg bg-white/20 hover:bg-white/30 transition font-semibold text-sm flex items-center">
                support@fullplay.app
              </a>
              <Link to="/" className="h-10 px-4 rounded-lg bg-black/30 hover:bg-black/40 transition font-semibold text-sm flex items-center">
                Back to Casino
              </Link>
            </div>
          </div>
        </main>
      </div>

      <footer className="border-t border-border bg-surface/40">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 py-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <p className="text-[11px] text-muted-foreground">
            © 2026 FullPlay. All rights reserved. 18+ Play Responsibly.
          </p>
          <div className="flex items-center gap-4 text-[11px] text-muted-foreground">
            <Link to="/terms" className="hover:text-primary transition">Terms</Link>
            <Link to="/privacy" className="hover:text-primary transition">Privacy</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}