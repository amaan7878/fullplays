import { createFileRoute, Link } from "@tanstack/react-router";
import logo from "@/assets/fullplay-mark.png";
import {
  ChevronLeft, CreditCard, ShieldCheck, Gift, Wrench,
  Heart, Lock, ArrowRight, Search,
} from "lucide-react";

export const Route = createFileRoute("/help")({
  head: () => ({
    meta: [
      { title: "Help Center — FullPlay" },
      { name: "description", content: "Browse FullPlay's help topics: payments, verification, bonuses, technical issues, responsible gaming, and account security." },
    ],
  }),
  component: HelpPage,
});

function HelpPage() {
  const cards = [
    { icon: CreditCard, title: "Payments", desc: "Deposits, withdrawals, UPI issues, refunds.", color: "from-emerald-500 to-teal-500" },
    { icon: ShieldCheck, title: "Verification", desc: "KYC documents, address proof, age verification.", color: "from-blue-500 to-indigo-500" },
    { icon: Gift, title: "Bonuses", desc: "Wagering rules, promo codes, cashback questions.", color: "from-pink-500 to-fuchsia-500" },
    { icon: Wrench, title: "Technical Issues", desc: "App crashes, slow loading, login problems.", color: "from-amber-500 to-orange-500" },
    { icon: Heart, title: "Responsible Gaming", desc: "Self-exclusion, deposit limits, support resources.", color: "from-rose-500 to-red-500" },
    { icon: Lock, title: "Account Security", desc: "Password resets, 2FA, suspicious activity.", color: "from-violet-500 to-purple-500" },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="border-b border-border bg-surface/60 backdrop-blur sticky top-0 z-30">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 h-14 sm:h-16 flex items-center justify-between gap-3">
          <Link to="/" className="flex items-center gap-2">
            <img src={logo} alt="FullPlay" className="w-9 h-9 object-contain" />
            <div className="text-base font-extrabold leading-none">
              FULL<span className="text-gradient-hero">PLAY</span>
            </div>
          </Link>
          <Link to="/" className="flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-muted-foreground hover:text-primary transition">
            <ChevronLeft className="w-4 h-4" /> Back to Casino
          </Link>
        </div>
      </header>

      <section className="relative overflow-hidden border-b border-border">
        <div className="absolute inset-0 bg-gradient-primary opacity-[0.12]" />
        <div className="absolute -top-24 -right-24 w-80 h-80 rounded-full bg-primary/30 blur-3xl" />
        <div className="relative max-w-[1200px] mx-auto px-4 sm:px-6 py-12 sm:py-16 text-center animate-fade-in">
          <span className="inline-block text-[10px] tracking-[0.25em] font-semibold border border-primary/40 text-primary px-2.5 py-1 rounded-md bg-surface/80 backdrop-blur">
            HELP CENTER
          </span>
          <h1 className="mt-4 text-3xl sm:text-5xl font-extrabold tracking-tight">
            <span className="text-gradient-hero">How can we help?</span>
          </h1>
          <p className="mt-3 max-w-xl mx-auto text-sm sm:text-base text-muted-foreground">
            Pick a topic below or search to find what you need in seconds.
          </p>
          <div className="relative mt-6 max-w-xl mx-auto">
            <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              placeholder="Search help articles..."
              className="w-full h-12 pl-11 pr-4 rounded-xl bg-surface border border-border focus:border-primary outline-none text-sm"
            />
          </div>
        </div>
      </section>

      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 py-10 sm:py-14">
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
          {cards.map(({ icon: I, title, desc, color }) => (
            <Link
              key={title}
              to="/faq"
              className="group relative rounded-2xl border border-border bg-surface p-5 hover:border-primary hover:-translate-y-1 transition-all overflow-hidden"
            >
              <div className={`absolute -top-10 -right-10 w-32 h-32 rounded-full bg-gradient-to-br ${color} opacity-20 blur-2xl group-hover:opacity-40 transition`} />
              <div className={`relative w-12 h-12 rounded-xl bg-gradient-to-br ${color} grid place-items-center shadow-glow`}>
                <I className="w-6 h-6 text-white" />
              </div>
              <h3 className="relative mt-4 font-extrabold tracking-tight">{title}</h3>
              <p className="relative mt-1 text-sm text-muted-foreground leading-relaxed">{desc}</p>
              <div className="relative mt-4 flex items-center gap-1 text-xs font-semibold text-primary">
                Explore <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          ))}
        </div>

        <div className="mt-10 rounded-2xl bg-gradient-primary p-6 sm:p-8 shadow-glow text-primary-foreground flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="text-[10px] tracking-[0.25em] font-semibold opacity-90">STILL STUCK?</div>
            <h3 className="mt-1 text-xl sm:text-2xl font-extrabold">Chat with a human</h3>
            <p className="mt-1 text-sm opacity-90">24/7 live chat — usually replies in under 2 minutes.</p>
          </div>
          <Link to="/contact" className="h-11 px-5 rounded-xl bg-white text-primary font-bold text-sm flex items-center gap-2 hover:bg-white/90 transition">
            Contact Support <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}