import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useRef, useState, type TouchEvent as ReactTouchEvent } from "react";
import { supabase } from "@/lib/supabase";
import fullplayMark from "@/assets/fullplay-mark.png";
import {
  Gift, ChevronLeft, ChevronRight, ArrowRight, Search,
  LayoutGrid, Shield, Headphones, Rocket, Crown,
  Flame, DollarSign, Menu, X, Wallet,
  Landmark, Smartphone, ArrowDownToLine, ArrowUpFromLine,
  User, History, Settings, LifeBuoy, LogOut, Users, Star,
  Zap, Home, CircleDot, Sparkles, TrendingUp, BarChart2,
  Clock, CheckCircle2, ChevronDown, Play, Info,
  Megaphone, Link2, MousePointerClick, BadgeDollarSign,
  Tag, Youtube, Monitor, ShoppingBag, GraduationCap,
  Gamepad2, Banknote, Heart,
} from "lucide-react";

export const Route = createFileRoute("/promotions")({
  head: () => ({
    meta: [
      { title: "FullPlay — Promotions · Promote. Earn. Grow." },
      { name: "description", content: "Promote top brands, influencers and courses. Earn up to ₹200 per visit." },
    ],
  }),
  component: Promotions,
});

// ─── Static data ────────────────────────────────────────────────────────────

const NAV_ITEMS: { label: string; to?: "/" | "/community" | "/promotions" }[] = [
  { label: "CASINO",      to: "/"           },
  { label: "COMMUNITY",   to: "/community"  },
  { label: "PROMOTIONS",  to: "/promotions" },
];

const ACCOUNT_ACTIONS = [
  { label: "Deposit",          icon: ArrowDownToLine, accent: "text-emerald-400" },
  { label: "Withdraw",         icon: ArrowUpFromLine, accent: "text-amber-300"   },
  { label: "Add Bank",         icon: Landmark,        accent: "text-blue-300"    },
  { label: "Add UPI",          icon: Smartphone,      accent: "text-violet-300"  },
  { label: "Transactions",     icon: History,         accent: "text-cyan-300"    },
  { label: "Bonuses",          icon: Gift,            accent: "text-pink-300"    },
  { label: "Referral Program", icon: Users,           accent: "text-emerald-300" },
  { label: "VIP Rewards",      icon: Star,            accent: "text-amber-300"   },
  { label: "Profile",          icon: User,            accent: "text-violet-300"  },
  { label: "Settings",         icon: Settings,        accent: "text-muted-foreground" },
  { label: "Support",          icon: LifeBuoy,        accent: "text-orange-300"  },
];

type CategoryId = "all" | "brands" | "youtube" | "courses" | "tech" | "finance" | "lifestyle" | "gaming";

const CATEGORIES: { label: string; icon: React.ElementType; id: CategoryId }[] = [
  { label: "All",       icon: LayoutGrid,      id: "all"       },
  { label: "Brands",    icon: Tag,             id: "brands"    },
  { label: "YouTube",   icon: Youtube,         id: "youtube"   },
  { label: "Courses",   icon: GraduationCap,   id: "courses"   },
  { label: "Tech",      icon: Monitor,         id: "tech"      },
  { label: "Finance",   icon: Banknote,        id: "finance"   },
  { label: "Lifestyle", icon: Heart,           id: "lifestyle" },
  { label: "Gaming",    icon: Gamepad2,        id: "gaming"    },
];

type TagType = "COURSE" | "BRAND" | "YOUTUBE" | "TECH" | "FINANCE";

interface Promotion {
  id: string;
  name: string;
  by: string;
  tag: TagType;
  category: CategoryId;
  perVisit: number;
  color: string;       // bg accent for the card placeholder
  emoji: string;
}

const TAG_STYLES: Record<TagType, string> = {
  COURSE:  "bg-violet-600 text-white",
  BRAND:   "bg-blue-600 text-white",
  YOUTUBE: "bg-red-600 text-white",
  TECH:    "bg-cyan-600 text-white",
  FINANCE: "bg-emerald-600 text-white",
};

const PROMOTIONS: Promotion[] = [
  { id: "p1",  name: "Trading Mastery Course",    by: "Trading With Groww",  tag: "COURSE",  category: "courses",   perVisit: 150, color: "#1e3a5f", emoji: "📈" },
  { id: "p2",  name: "Apple iPhone 15",           by: "Apple",               tag: "BRAND",   category: "brands",    perVisit: 120, color: "#1c1c1e", emoji: "🍎" },
  { id: "p3",  name: "MrBeast Gaming",            by: "MrBeast",             tag: "YOUTUBE", category: "youtube",   perVisit: 130, color: "#c00",    emoji: "▶️" },
  { id: "p4",  name: "Nike Official Store",       by: "Nike",                tag: "BRAND",   category: "brands",    perVisit: 90,  color: "#111",    emoji: "👟" },
  { id: "p5",  name: "Complete Web Dev Bootcamp", by: "Angela Yu",           tag: "COURSE",  category: "courses",   perVisit: 140, color: "#0f1b2d", emoji: "💻" },
  { id: "p6",  name: "Stock Market Mastery",      by: "Ankur Upadhyay",      tag: "COURSE",  category: "courses",   perVisit: 120, color: "#1a2f1a", emoji: "📊" },
  { id: "p7",  name: "boAt Lifestyle Collection", by: "boAt",                tag: "BRAND",   category: "lifestyle", perVisit: 80,  color: "#1a0033", emoji: "🎧" },
  { id: "p8",  name: "Tech Burner",               by: "Tech Burner",         tag: "YOUTUBE", category: "youtube",   perVisit: 100, color: "#8b0000", emoji: "🔥" },
  { id: "p9",  name: "Binance Trading Platform",  by: "Binance",             tag: "FINANCE", category: "finance",   perVisit: 200, color: "#1a1200", emoji: "₿"  },
  { id: "p10", name: "Graphic Design Masterclass",by: "Design With Dhruv",   tag: "COURSE",  category: "courses",   perVisit: 110, color: "#1a0a2e", emoji: "🎨" },
  { id: "p11", name: "Samsung Galaxy S24",        by: "Samsung",             tag: "TECH",    category: "tech",      perVisit: 95,  color: "#001433", emoji: "📱" },
  { id: "p12", name: "Zerodha Kite",              by: "Zerodha",             tag: "FINANCE", category: "finance",   perVisit: 175, color: "#003318", emoji: "📉" },
];

const TOP_SIDEBAR: Promotion[] = PROMOTIONS.slice(0, 5);

const HOW_IT_WORKS = [
  { icon: Search,              step: 1, title: "Choose Promotion", desc: "Browse from 1000+ brands, influencers, courses & more." },
  { icon: Link2,               step: 2, title: "Share Your Link",   desc: "Get your unique link and share it anywhere."             },
  { icon: MousePointerClick,   step: 3, title: "Visitors Click & Visit", desc: "Users visit the promoted site through your link."   },
  { icon: BadgeDollarSign,     step: 4, title: "Earn Rewards",      desc: "You earn up to amazing rewards per valid visit."         },
];

const WHY_FEATURES = [
  { icon: TrendingUp, title: "High Payouts",        desc: "Earn up to the highest rewards per visit.",     color: "text-violet-400" },
  { icon: Shield,     title: "Trusted Partners",    desc: "Work with top brands & creators.",              color: "text-blue-400"   },
  { icon: BarChart2,  title: "Real-time Tracking",  desc: "Track clicks, visits & earnings in real-time.", color: "text-pink-400"   },
  { icon: Zap,        title: "Instant Withdrawals", desc: "Quick & secure withdrawals at any time.",        color: "text-amber-400"  },
];

// ─── Component ───────────────────────────────────────────────────────────────

function Promotions() {
  // ── Auth ──
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setUserEmail(data.session?.user.email ?? null);
      setAuthLoading(false);
    });
    const { data: sub } = supabase.auth.onAuthStateChange((_e, s) => {
      setUserEmail(s?.user.email ?? null);
      setAuthLoading(false);
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  const balance = 1250.75;
  const formattedBalance = `₹${balance.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

  // ── Menu ──
  const [menuOpen, setMenuOpen] = useState(false);

  // ── Category filter ──
  const [activeCategory, setActiveCategory] = useState<CategoryId>("all");

  const filteredPromos = activeCategory === "all"
    ? PROMOTIONS
    : PROMOTIONS.filter((p) => p.category === activeCategory);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="max-w-[1440px] mx-auto px-3 sm:px-6 py-4 sm:py-5 pb-24 md:pb-6">

        {/* ── Nav ── (identical to index.tsx) */}
        <header className="flex items-center justify-between gap-2 sm:gap-4">
          <div className="flex items-center gap-1">
            <img
              src={fullplayMark}
              alt="Fullplay"
              className="h-14 w-14 object-contain shrink-0 drop-shadow-[0_0_8px_rgba(168,85,247,0.22)]"
            />
            <div className="leading-none">
              <div className="text-xl sm:text-2xl font-extrabold tracking-tight -ml-0.5 sm:-ml-1">
                Full<span className="text-gradient-hero">play</span>
              </div>
              <div className="text-[8px] sm:text-[9px] tracking-[0.25em] text-muted-foreground mt-1">PLAY. WIN. REPEAT.</div>
            </div>
          </div>

          <nav className="hidden lg:flex items-center gap-8 text-sm font-semibold tracking-wide">
            {NAV_ITEMS.map((n, i) => {
              const isActive = n.label === "PROMOTIONS";
              const cls = `relative py-2 ${isActive ? "text-foreground" : "text-muted-foreground hover:text-foreground"}`;
              return (
                <Link key={n.label} to={n.to ?? "/"} className={cls}>
                  {n.label}
                  {n.label === "PROMOTIONS" && (
                    <span className="ml-2 align-middle text-[9px] bg-gradient-primary text-white px-1.5 py-0.5 rounded">NEW</span>
                  )}
                  {isActive && <span className="absolute -bottom-0.5 left-0 right-8 h-0.5 bg-gradient-primary rounded-full" />}
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-2 sm:gap-3">
            <button className="hidden sm:grid w-11 h-11 rounded-xl border border-border bg-surface place-items-center hover:border-primary transition">
              <Gift className="w-5 h-5 text-primary" />
            </button>

            {authLoading ? (
              <div className="h-8 sm:h-11 w-28 rounded-full sm:rounded-xl bg-surface animate-pulse" />
            ) : userEmail ? (
              <button
                onClick={() => setMenuOpen(true)}
                className="flex items-center gap-2 h-8 sm:h-11 px-3 sm:px-4 rounded-full sm:rounded-xl border border-primary/40 bg-primary/10 font-semibold transition-all duration-200 hover:-translate-y-0.5 hover:border-primary hover:shadow-lg"
              >
                <Wallet className="w-4 h-4 text-primary" />
                <span className="text-xs sm:text-sm text-white font-bold tabular-nums">{formattedBalance}</span>
              </button>
            ) : (
              <>
                <a
                  href="/auth"
                  className="h-8 sm:h-11 px-3 sm:px-6 text-xs sm:text-base rounded-full sm:rounded-xl bg-gradient-primary text-primary-foreground font-semibold shadow-glow transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_10px_30px_-5px_hsl(var(--primary)/0.5)] grid place-items-center"
                >
                  Register
                </a>
                <a
                  href="/auth"
                  className="h-8 sm:h-11 px-3 sm:px-6 text-xs sm:text-base rounded-full sm:rounded-xl border border-border bg-surface font-semibold transition-all duration-200 hover:-translate-y-0.5 hover:border-primary hover:shadow-lg grid place-items-center"
                >
                  Login
                </a>
              </>
            )}

            <button
              onClick={() => setMenuOpen(true)}
              className={`${userEmail ? "" : "lg:hidden"} w-8 h-8 sm:w-11 sm:h-11 grid place-items-center rounded-md sm:rounded-xl text-foreground sm:border sm:border-border sm:bg-surface sm:hover:border-primary transition`}
              aria-label="Open menu"
            >
              <Menu className="w-5 h-5" />
            </button>
          </div>
        </header>

        {/* ── Account Drawer ── (identical to index.tsx) */}
        {menuOpen && (
          <div className="fixed inset-0 z-50 flex">
            <div
              className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-fade-in"
              style={{ animationDuration: "200ms" }}
              onClick={() => setMenuOpen(false)}
            />
            <aside
              className="relative ml-auto h-full w-[88%] max-w-sm bg-surface border-l border-border flex flex-col animate-fade-in"
              style={{ animationDuration: "250ms" }}
            >
              <div className="flex items-center justify-between px-5 py-4 border-b border-border">
                <div className="min-w-0">
                  <div className="text-[10px] tracking-[0.2em] text-muted-foreground font-semibold">ACCOUNT</div>
                  {userEmail && <div className="text-sm font-semibold truncate mt-0.5">{userEmail}</div>}
                </div>
                <button
                  onClick={() => setMenuOpen(false)}
                  className="w-9 h-9 grid place-items-center rounded-lg border border-border hover:border-primary transition"
                  aria-label="Close menu"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {userEmail && (
                <div className="mx-5 mt-5 rounded-2xl bg-gradient-primary p-4 shadow-glow text-primary-foreground">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-xs font-semibold tracking-wide opacity-90">
                      <Wallet className="w-4 h-4" /> WALLET BALANCE
                    </div>
                    <span className="text-[10px] font-bold bg-white/20 px-2 py-0.5 rounded">INR</span>
                  </div>
                  <div className="mt-3 text-3xl font-extrabold tabular-nums">{formattedBalance}</div>
                  <div className="mt-4 grid grid-cols-2 gap-2">
                    <button className="h-10 rounded-lg bg-white/20 hover:bg-white/30 transition font-semibold text-sm flex items-center justify-center gap-1.5">
                      <ArrowDownToLine className="w-4 h-4" /> Deposit
                    </button>
                    <button className="h-10 rounded-lg bg-black/30 hover:bg-black/40 transition font-semibold text-sm flex items-center justify-center gap-1.5">
                      <ArrowUpFromLine className="w-4 h-4" /> Withdraw
                    </button>
                  </div>
                </div>
              )}

              <nav className="flex-1 overflow-y-auto px-3 py-4">
                <div className="px-2 text-[10px] tracking-[0.2em] text-muted-foreground font-semibold mb-2">MANAGE</div>
                <ul className="space-y-1">
                  {ACCOUNT_ACTIONS.map(({ label, icon: I, accent }) => (
                    <li key={label}>
                      <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-surface-2 transition text-left">
                        <span className="w-9 h-9 rounded-lg bg-surface-2 border border-border grid place-items-center shrink-0">
                          <I className={`w-4 h-4 ${accent}`} />
                        </span>
                        <span className="text-sm font-semibold flex-1">{label}</span>
                        <ChevronRight className="w-4 h-4 text-muted-foreground" />
                      </button>
                    </li>
                  ))}
                </ul>

                <div className="lg:hidden mt-5 px-2 text-[10px] tracking-[0.2em] text-muted-foreground font-semibold mb-2">EXPLORE</div>
                <ul className="lg:hidden space-y-1">
                  {NAV_ITEMS.map((n) => (
                    <li key={n.label}>
                      <Link
                        to={n.to ?? "/"}
                        onClick={() => setMenuOpen(false)}
                        className="block px-3 py-2.5 rounded-lg hover:bg-surface-2 transition text-sm font-semibold"
                      >
                        {n.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>

              <div className="p-4 border-t border-border">
                {userEmail ? (
                  <button
                    onClick={async () => { await supabase.auth.signOut(); setMenuOpen(false); }}
                    className="w-full h-11 rounded-xl border border-border bg-surface-2 font-semibold text-sm flex items-center justify-center gap-2 hover:border-red-500/50 hover:text-red-300 transition"
                  >
                    <LogOut className="w-4 h-4" /> Logout
                  </button>
                ) : (
                  <a
                    href="/auth"
                    onClick={() => setMenuOpen(false)}
                    className="w-full h-11 rounded-xl bg-gradient-primary text-primary-foreground font-semibold text-sm flex items-center justify-center gap-2 shadow-glow"
                  >
                    Login / Register
                  </a>
                )}
              </div>
            </aside>
          </div>
        )}

        {/* ══════════════════════════════════════════════════════════════
            PROMOTIONS HERO
        ══════════════════════════════════════════════════════════════ */}
        <section className="mt-4 sm:mt-6 relative rounded-2xl sm:rounded-3xl overflow-hidden border border-border bg-surface min-h-[200px] sm:min-h-[260px] flex items-center">
          {/* Decorative mesh background */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: "radial-gradient(ellipse 80% 80% at 70% 50%, rgba(139,92,246,0.18) 0%, transparent 70%), radial-gradient(ellipse 40% 60% at 90% 20%, rgba(251,191,36,0.10) 0%, transparent 60%), linear-gradient(135deg, #0f0a1e 0%, #1a1035 50%, #120820 100%)",
            }}
          />
          {/* Floating orbs */}
          <div className="absolute right-0 top-0 bottom-0 w-1/2 pointer-events-none overflow-hidden">
            <div className="absolute right-16 top-4 w-32 h-32 rounded-full" style={{ background: "radial-gradient(circle, rgba(168,85,247,0.25) 0%, transparent 70%)" }} />
            <div className="absolute right-4 bottom-4 w-24 h-24 rounded-full" style={{ background: "radial-gradient(circle, rgba(251,191,36,0.18) 0%, transparent 70%)" }} />
            {/* Coin icons decorative */}
            <div className="absolute right-20 top-1/2 -translate-y-1/2 text-4xl sm:text-6xl opacity-30 select-none">💰</div>
            <div className="absolute right-40 top-6 text-2xl opacity-20 select-none">🪙</div>
            <div className="absolute right-8 top-8 text-3xl opacity-20 select-none">📣</div>
          </div>

          <div className="relative z-10 px-5 sm:px-10 py-8 sm:py-12 max-w-2xl">
            <h1 className="text-2xl sm:text-4xl font-extrabold leading-tight">
              PROMOTE.{" "}
              <span className="text-gradient-hero">EARN.</span>{" "}
              <span style={{ color: "#a855f7" }}>GROW.</span>
            </h1>
            <p className="mt-2 sm:mt-3 text-sm sm:text-base text-muted-foreground leading-relaxed max-w-sm">
              Collaborate with brands &amp; influencers. Promote anything you love and earn up to amazing rewards!
            </p>
            <div className="mt-5 sm:mt-7 flex flex-wrap items-center gap-3">
              <button className="flex items-center gap-2 bg-gradient-primary text-primary-foreground font-semibold pl-5 pr-2 h-10 sm:h-12 rounded-full shadow-glow text-sm sm:text-base transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_15px_40px_-10px_hsl(var(--primary)/0.6)]">
                Start Promoting
                <span className="w-7 h-7 sm:w-9 sm:h-9 rounded-full bg-white/20 grid place-items-center">
                  <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                </span>
              </button>
              <button className="flex items-center gap-2 h-10 sm:h-12 px-4 sm:px-5 rounded-full border border-border bg-surface/60 backdrop-blur font-semibold text-sm sm:text-base transition hover:border-primary hover:-translate-y-0.5">
                <div className="w-5 h-5 rounded-full border-2 border-current grid place-items-center">
                  <Play className="w-2.5 h-2.5 fill-current ml-0.5" />
                </div>
                How It Works
              </button>
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════════════════════════════
            MAIN CONTENT GRID
        ══════════════════════════════════════════════════════════════ */}
        <div className="mt-5 grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-5">

          {/* ── Left column ── */}
          <div className="space-y-5">

            {/* Featured Promotions */}
            <div className="rounded-2xl bg-surface border border-border p-4 sm:p-5">
              <div className="flex items-center justify-between mb-4">
                <h2 className="flex items-center gap-2 font-bold tracking-wide text-sm sm:text-base">
                  <Flame className="w-5 h-5 text-orange-400" />
                  FEATURED PROMOTIONS
                </h2>
                <a href="#" className="flex items-center gap-1 text-xs sm:text-sm text-primary font-semibold hover:text-primary/80 transition-colors">
                  View All <ChevronRight className="w-3.5 h-3.5" />
                </a>
              </div>

              {/* Scrollable row */}
              <div className="flex gap-3 overflow-x-auto pb-2 -mx-1 px-1 snap-x snap-mandatory">
                {PROMOTIONS.slice(0, 5).map((promo) => (
                  <PromotionCard key={promo.id} promo={promo} />
                ))}
              </div>
            </div>

            {/* How It Works */}
            <div className="rounded-2xl bg-surface border border-border p-4 sm:p-6">
              <h2 className="font-bold tracking-wide text-sm sm:text-base mb-5">HOW IT WORKS</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {HOW_IT_WORKS.map((step, i) => {
                  const I = step.icon;
                  return (
                    <div key={step.step} className="relative flex flex-col items-center text-center">
                      {/* Connector line */}
                      {i < HOW_IT_WORKS.length - 1 && (
                        <div className="hidden md:block absolute left-1/2 top-6 w-full h-px border-t border-dashed border-border z-0" style={{ left: "calc(50% + 28px)", width: "calc(100% - 56px)" }} />
                      )}
                      <div className="relative z-10 w-12 h-12 rounded-2xl bg-surface-2 border border-primary/30 grid place-items-center mb-3 shadow-[0_0_16px_-4px_hsl(var(--primary)/0.3)]">
                        <I className="w-5 h-5 text-primary" />
                      </div>
                      <div className="text-[10px] font-bold tracking-widest text-primary mb-1">STEP {step.step}</div>
                      <div className="text-xs font-bold text-foreground mb-1">{step.title}</div>
                      <div className="text-[11px] text-muted-foreground leading-snug">{step.desc}</div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* All Promotions with category filter */}
            <div className="rounded-2xl bg-surface border border-border p-4 sm:p-5">
              <div className="flex items-center justify-between mb-4">
                <h2 className="flex items-center gap-2 font-bold tracking-wide text-sm sm:text-base">
                  <Sparkles className="w-4 h-4 text-amber-400" />
                  TOP CATEGORIES
                </h2>
                <a href="#" className="flex items-center gap-1 text-xs text-primary font-semibold">
                  View All <ChevronRight className="w-3.5 h-3.5" />
                </a>
              </div>

              {/* Category pills */}
              <div className="flex gap-2 overflow-x-auto pb-2 -mx-1 px-1 mb-4">
                {CATEGORIES.map(({ label, icon: I, id }) => (
                  <button
                    key={id}
                    onClick={() => setActiveCategory(id)}
                    className={`shrink-0 flex items-center gap-1.5 h-9 px-3.5 rounded-xl border font-semibold text-xs transition-all duration-200 hover:-translate-y-0.5 ${
                      activeCategory === id
                        ? "bg-gradient-primary text-primary-foreground border-transparent shadow-glow"
                        : "bg-surface-2 border-border hover:border-primary"
                    }`}
                  >
                    <I className="w-3.5 h-3.5" />
                    {label}
                  </button>
                ))}
              </div>

              {/* Grid of promo cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3">
                {filteredPromos.map((promo) => (
                  <PromotionListCard key={promo.id} promo={promo} />
                ))}
              </div>
            </div>
          </div>

          {/* ── Right sidebar ── */}
          <aside className="space-y-4">

            {/* Top Promotions */}
            <div className="rounded-2xl bg-surface border border-border overflow-hidden">
              <div className="h-px w-full" style={{ background: "linear-gradient(90deg,transparent,rgba(168,85,247,0.5),rgba(251,191,36,0.3),transparent)" }} />
              <div className="p-4 sm:p-5">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="flex items-center gap-2 font-bold tracking-wide text-sm">
                    <Flame className="w-4 h-4 text-orange-400" />
                    TOP PROMOTIONS
                  </h3>
                  <a href="#" className="text-xs text-primary font-semibold flex items-center gap-1 hover:text-primary/80 transition-colors">
                    View All <ChevronRight className="w-3 h-3" />
                  </a>
                </div>

                <ul className="space-y-2">
                  {TOP_SIDEBAR.map((promo) => (
                    <li key={promo.id}>
                      <button className="w-full flex items-center gap-3 p-2.5 rounded-xl hover:bg-surface-2 transition-all duration-150 group">
                        {/* Icon block */}
                        <div
                          className="w-12 h-12 rounded-xl grid place-items-center text-2xl shrink-0 border border-white/10"
                          style={{ background: promo.color }}
                        >
                          {promo.emoji}
                        </div>
                        <div className="flex-1 min-w-0 text-left">
                          <div className="text-xs font-bold truncate group-hover:text-primary transition-colors">{promo.name}</div>
                          <div className="text-[11px] text-muted-foreground truncate">by {promo.by}</div>
                        </div>
                        <div className="shrink-0 text-right">
                          <div className="text-xs font-extrabold text-emerald-400">₹{promo.perVisit}</div>
                          <div className="text-[10px] text-muted-foreground">Per Visit</div>
                        </div>
                      </button>
                    </li>
                  ))}
                </ul>

                <button className="mt-3 w-full h-10 rounded-xl border border-border bg-surface-2 text-xs font-semibold flex items-center justify-center gap-2 hover:border-primary hover:text-primary transition-all duration-200">
                  Explore More Promotions <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
              <div className="h-px w-full" style={{ background: "linear-gradient(90deg,transparent,rgba(168,85,247,0.3),transparent)" }} />
            </div>

            {/* Why Promote */}
            <div className="rounded-2xl bg-surface border border-border p-4 sm:p-5">
              <h3 className="font-bold tracking-wide text-sm mb-4">WHY PROMOTE WITH FULLPLAY?</h3>
              <ul className="space-y-3.5">
                {WHY_FEATURES.map(({ icon: I, title, desc, color }) => (
                  <li key={title} className="flex items-start gap-3">
                    <div className="w-9 h-9 rounded-xl bg-surface-2 border border-border grid place-items-center shrink-0">
                      <I className={`w-4 h-4 ${color}`} />
                    </div>
                    <div>
                      <div className="text-xs font-bold">{title}</div>
                      <div className="text-[11px] text-muted-foreground mt-0.5 leading-snug">{desc}</div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            {/* Earnings teaser */}
            <div
              className="rounded-2xl p-4 sm:p-5 border border-violet-500/30"
              style={{ background: "linear-gradient(135deg,rgba(139,92,246,0.15),rgba(251,191,36,0.07))" }}
            >
              <div className="flex items-center gap-2 mb-2">
                <Crown className="w-5 h-5 text-amber-400" />
                <span className="text-xs font-bold text-amber-300 tracking-wide">TOP EARNER THIS WEEK</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 grid place-items-center font-extrabold text-white text-lg shrink-0">S</div>
                <div>
                  <div className="text-sm font-bold">Sneha***</div>
                  <div className="text-[11px] text-muted-foreground">earned via promotions</div>
                </div>
                <div className="ml-auto text-right">
                  <div className="text-base font-extrabold text-emerald-400">₹42,800</div>
                  <div className="text-[10px] text-muted-foreground">this week</div>
                </div>
              </div>
              <div className="mt-3 h-1 rounded-full bg-surface-2 overflow-hidden">
                <div className="h-full w-[78%] bg-gradient-primary rounded-full" />
              </div>
              <div className="mt-1.5 flex justify-between text-[10px] text-muted-foreground">
                <span>₹0</span><span>Goal: ₹55,000</span>
              </div>
            </div>
          </aside>
        </div>
      </div>

      {/* ── Footer ── */}
      <footer className="mt-8 border-t border-border bg-surface/50">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 py-8 sm:py-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8">
            <div className="col-span-2 md:col-span-1">
              <div className="flex items-center gap-2">
                <img src={fullplayMark} alt="Fullplay" className="h-10 w-10 object-contain" />
                <div className="text-lg font-extrabold tracking-tight">
                  Full<span className="text-gradient-hero">play</span>
                </div>
              </div>
              <p className="mt-3 text-xs text-muted-foreground leading-relaxed max-w-xs">
                Premium casino experience with instant payouts, 24/7 support, and the biggest game library online.
              </p>
            </div>
            {([
              { title: "Company", links: [{ label: "About Us", href: "/about" }, { label: "Careers", href: "/careers" }, { label: "Blog", href: "/blog" }] },
              { title: "Legal",   links: [{ label: "Terms & Conditions", href: "/terms" }, { label: "Privacy Policy", href: "/privacy" }, { label: "Responsible Gaming", href: "/responsible-gaming" }] },
              { title: "Support", links: [{ label: "Help Center", href: "/help" }, { label: "Contact Us", href: "/contact" }, { label: "FAQ", href: "/faq" }] },
            ] as const).map((col) => (
              <div key={col.title}>
                <div className="text-xs font-bold tracking-[0.2em] text-foreground uppercase mb-3">{col.title}</div>
                <ul className="space-y-2">
                  {col.links.map((l) => (
                    <li key={l.label}>
                      <a href={l.href} className="text-xs sm:text-sm text-muted-foreground hover:text-primary transition-colors">{l.label}</a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className="mt-8 pt-6 border-t border-border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <p className="text-[11px] text-muted-foreground">© 2026 FullPlay. All rights reserved. 18+ Play Responsibly.</p>
            <div className="flex items-center gap-4 text-[11px] text-muted-foreground">
              <a href="/terms" className="hover:text-primary transition-colors">Terms</a>
              <a href="/privacy" className="hover:text-primary transition-colors">Privacy</a>
              <a href="#" className="hover:text-primary transition-colors">Cookies</a>
            </div>
          </div>
        </div>
      </footer>

      {/* ── Mobile Bottom Nav ── */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 border-t border-border bg-surface/95 backdrop-blur-md safe-area-inset-bottom">
        <div className="flex items-stretch h-16">
          {[
            { label: "Casino",      icon: Home,         to: "/"           },
            { label: "Search",      icon: Search,       to: null          },
            { label: "Bonuses",     icon: Gift,         to: null          },
            { label: "Account",     icon: CircleDot,    to: null          },
          ].map(({ label, icon: I, to }) => (
            <button
              key={label}
              onClick={() => {
                if (label === "Account") setMenuOpen(true);
              }}
              className="relative flex-1 flex flex-col items-center justify-center gap-1 transition-colors text-muted-foreground hover:text-foreground"
            >
              <I className="w-5 h-5" />
              <span className="text-[9px] font-semibold tracking-wide">{label}</span>
            </button>
          ))}
        </div>
      </nav>
    </div>
  );
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function PromotionCard({ promo }: { promo: Promotion }) {
  return (
    <div className="snap-start shrink-0 w-[175px] sm:w-[200px] rounded-2xl overflow-hidden bg-surface-2 border border-border flex flex-col group cursor-pointer transition-all duration-300 hover:-translate-y-1.5 hover:border-primary hover:shadow-[0_20px_40px_-15px_hsl(var(--primary)/0.4)]">
      {/* Thumbnail */}
      <div
        className="h-28 sm:h-32 flex items-center justify-center text-5xl relative overflow-hidden"
        style={{ background: promo.color }}
      >
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" style={{ background: "radial-gradient(circle at 50% 50%, rgba(168,85,247,0.2), transparent 70%)" }} />
        <span className="relative z-10 drop-shadow-lg">{promo.emoji}</span>
        {/* Tag badge */}
        <span className={`absolute top-2 left-2 text-[9px] font-bold px-1.5 py-0.5 rounded ${TAG_STYLES[promo.tag]}`}>{promo.tag}</span>
      </div>
      {/* Info */}
      <div className="p-3 flex flex-col gap-1.5 flex-1">
        <div className="text-xs font-bold leading-tight line-clamp-2">{promo.name}</div>
        <div className="text-[11px] text-muted-foreground truncate">by {promo.by}</div>
        <div className="mt-auto pt-2 flex items-center justify-between">
          <div>
            <div className="text-sm font-extrabold text-emerald-400">₹{promo.perVisit}</div>
            <div className="text-[9px] text-muted-foreground">Per Visit</div>
          </div>
          <button className="h-7 px-3 rounded-lg bg-gradient-primary text-primary-foreground text-[10px] font-bold shadow-glow transition-all duration-200 hover:-translate-y-0.5">
            Promote
          </button>
        </div>
      </div>
    </div>
  );
}

function PromotionListCard({ promo }: { promo: Promotion }) {
  return (
    <div className="rounded-xl border border-border bg-surface-2 overflow-hidden group cursor-pointer transition-all duration-200 hover:-translate-y-0.5 hover:border-primary hover:shadow-[0_8px_20px_-8px_hsl(var(--primary)/0.4)]">
      <div className="flex items-center gap-3 p-3">
        <div
          className="w-12 h-12 rounded-xl grid place-items-center text-2xl shrink-0 border border-white/10"
          style={{ background: promo.color }}
        >
          {promo.emoji}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5 mb-0.5">
            <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${TAG_STYLES[promo.tag]}`}>{promo.tag}</span>
          </div>
          <div className="text-xs font-bold truncate group-hover:text-primary transition-colors">{promo.name}</div>
          <div className="text-[11px] text-muted-foreground truncate">by {promo.by}</div>
        </div>
        <div className="shrink-0 text-right">
          <div className="text-sm font-extrabold text-emerald-400">₹{promo.perVisit}</div>
          <div className="text-[10px] text-muted-foreground mb-1">Per Visit</div>
        </div>
      </div>
      <div className="px-3 pb-3">
        <button className="w-full h-8 rounded-lg bg-gradient-primary text-primary-foreground text-xs font-bold shadow-glow transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_8px_20px_-5px_hsl(var(--primary)/0.5)]">
          Promote Now
        </button>
      </div>
    </div>
  );
}