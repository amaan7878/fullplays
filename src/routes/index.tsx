import { createFileRoute, Link, useLocation } from "@tanstack/react-router";
import { useEffect, useRef, useState, type TouchEvent as ReactTouchEvent } from "react";
import { supabase } from "@/lib/supabase";
import heroImg from "@/assets/hero-heroes.jpg";
import gameMines from "@/assets/game-mines.jpg";
import gamePlinko from "@/assets/game-plinko.png";
import gameDragon from "@/assets/game-dragon.png";
import gameCrash from "@/assets/game-crash.png";
import heroSlide2 from "@/assets/hero-slide-2.png";
import heroSlide3 from "@/assets/hero-slide-3.png";
import gameWheel from "@/assets/game-wheel.png";
import gameDice from "@/assets/game-dice.png";
import gameHilo from "@/assets/game-hilo.png";
import fullplayMark from "@/assets/fullplay-mark.png";
import {
  Gift, ChevronLeft, ChevronRight, ArrowRight, Search,
  LayoutGrid, Shield, Headphones, Rocket, Crown,
  Flame, DollarSign, Menu, X, Wallet,
  Landmark, Smartphone, ArrowDownToLine, ArrowUpFromLine,
  User, History, Settings, LifeBuoy, LogOut, Users, Star,
  Zap, Home, CircleDot, Sparkles,
} from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "FullPlay — Play. Win. Repeat." },
      { name: "description", content: "FullPlay casino: 100$ + 100% deposit bonus, top slots, live casino, fast payouts." },
    ],
  }),
  component: Index,
});

const SLIDE_INTERVAL_MS = 6500;

// --- Static data moved outside component to avoid re-creation on every render ---

// ✅ FIXED: all three nav items now have a `to` prop
const NAV_ITEMS: { label: string; to: "/" | "/community" | "/promotions" }[] = [
  { label: "CASINO",      to: "/"           },
  { label: "COMMUNITY",   to: "/community"  },
  { label: "PROMOTIONS",  to: "/promotions" },
];

const CATEGORIES = [
  { label: "Originals", icon: LayoutGrid, id: "originals" },
  { label: "PvP", icon: Flame, id: "pvp" },
];

const TOP_GAMES = [
  { id: "mines",   name: "MINES",           tag: "HOT" as const, imgKey: "mines" },
  { id: "plinko",  name: "PLINKO",          tag: "NEW" as const, imgKey: "plinko" },
  { id: "dragon",  name: "DRAGON\n& TIGER", tag: "HOT" as const, imgKey: "dragon" },
  { id: "crash",   name: "CRASH",           tag: "NEW" as const, imgKey: "crash" },
  { id: "wheel",   name: "WHEEL",           tag: "HOT" as const, imgKey: "wheel" },
  { id: "dice",    name: "DICE",            tag: "NEW" as const, imgKey: "dice" },
  { id: "hilo",    name: "HILO",            tag: "HOT" as const, imgKey: "hilo" },
];

const TOP_POPULARITY = [
  { id: "p1",  initial: "S", gradient: "from-amber-400 to-orange-500",  name: "Sneha",   points: 184200 },
  { id: "p2",  initial: "A", gradient: "from-violet-500 to-purple-600", name: "Arjun",   points: 162450 },
  { id: "p3",  initial: "R", gradient: "from-pink-500 to-rose-600",     name: "Riya",    points: 141800 },
  { id: "p4",  initial: "K", gradient: "from-blue-500 to-cyan-500",     name: "Karan",   points: 128300 },
  { id: "p5",  initial: "D", gradient: "from-emerald-500 to-teal-500",  name: "Dani",    points: 115700 },
  { id: "p6",  initial: "V", gradient: "from-red-500 to-pink-500",      name: "Veer",    points:  98400 },
  { id: "p7",  initial: "P", gradient: "from-amber-500 to-yellow-500",  name: "Pavan",   points:  87650 },
  { id: "p8",  initial: "B", gradient: "from-indigo-500 to-violet-500", name: "Bharat",  points:  74200 },
  { id: "p9",  initial: "M", gradient: "from-teal-500 to-emerald-400",  name: "Meera",   points:  61900 },
  { id: "p10", initial: "Z", gradient: "from-orange-500 to-amber-400",  name: "Zaid",    points:  54300 },
];

const FEATURES = [
  { icon: DollarSign, title: "FAST PAYOUTS",  desc: "Instant withdrawals within seconds.",                  color: "text-violet-300" },
  { icon: Headphones, title: "24/7 SUPPORT",  desc: "Our support team is always here for you.",             color: "text-blue-300"   },
  { icon: Shield,     title: "SECURE & SAFE", desc: "Bank-level security & 100% protected.",                color: "text-pink-300"   },
  { icon: Crown,      title: "VIP PROGRAM",   desc: "Exclusive benefits, cashback and higher rewards.",     color: "text-amber-300"  },
];

const SLIDES = [
  {
    badge: "WELCOME BONUS",
    title: "100$ + 100%",
    subtitle: "DEPOSIT BONUS",
    desc: "This is your time and your game.",
    imgKey: "hero",
  },
  {
    badge: "DAILY RAKEBACK",
    title: "1.5% RAKEBACK",
    subtitle: "EVERY SINGLE DAY",
    desc: "Lose less, play more — automatic rakeback credited daily.",
    imgKey: "slide2",
  },
  {
    badge: "VIP REWARDS",
    title: "LEVEL UP",
    subtitle: "EXCLUSIVE PERKS",
    desc: "Higher limits, faster payouts, personal host.",
    imgKey: "slide3",
  },
];

const TICKER_ITEMS = [
  "🎰 Dani*** won ₹21,456 on Mines",
  "💥 Bharat*** hit 22.6× on Crash",
  "🎯 Rajat*** won ₹16,986 on Plinko",
  "🐉 Veer*** won ₹12,456 on Dragon & Tiger",
  "🎡 Pavan*** hit 11.5× on Wheel",
  "🃏 Zaid*** won ₹6,240 on Hilo",
  "⚡ Arjun*** hit 31× on Crash",
  "💎 Sneha*** won ₹44,800 on Mines",
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

// --- Plinko multiplier footer (kept outside JSX for readability) ---
const PLINKO_MULTIPLIERS: [string, string][] = [
  ["0.2x", "bg-red-500"],
  ["0.5x", "bg-amber-500"],
  ["1x",   "bg-amber-400 text-black"],
  ["2x",   "bg-blue-500"],
  ["10x",  "bg-violet-500"],
];

const PlinkoFooter = () => (
  <div className="flex gap-1 text-[10px] font-bold flex-wrap">
    {PLINKO_MULTIPLIERS.map(([t, c]) => (
      <span key={t} className={`${c} text-white px-1.5 py-0.5 rounded`}>{t}</span>
    ))}
  </div>
);

function Index() {
  const navigate = Route.useNavigate();

  // ---- Image map (avoids repeating imports in JSX) ----
  const imgMap: Record<string, string> = {
    hero: heroImg, slide2: heroSlide2, slide3: heroSlide3,
    mines: gameMines, plinko: gamePlinko, dragon: gameDragon,
    crash: gameCrash, wheel: gameWheel, dice: gameDice, hilo: gameHilo,
  };

  // ---- Auth ----
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

  // ---- Slide ----
  const [slide, setSlide] = useState(0);
  useEffect(() => {
    const id = setTimeout(() => setSlide((s) => (s + 1) % SLIDES.length), SLIDE_INTERVAL_MS);
    return () => clearTimeout(id);
  }, [slide]);
  const prev = () => setSlide((s) => (s - 1 + SLIDES.length) % SLIDES.length);
  const next = () => setSlide((s) => (s + 1) % SLIDES.length);
  const current = SLIDES[slide];

  // ---- Category filter ----
  const [activeCategory, setActiveCategory] = useState("originals");

  // ---- Menu ----
  const [menuOpen, setMenuOpen] = useState(false);

  // ---- Fake balance ----
  const balance = 1250.75;
  const formattedBalance = `₹${balance.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

  // ---- Swipe — scoped to hero only ----
  const heroTouchStartX = useRef(0);
  const onHeroTouchStart = (e: ReactTouchEvent) => { heroTouchStartX.current = e.changedTouches[0].clientX; };
  const onHeroTouchEnd = (e: ReactTouchEvent) => {
    const dx = e.changedTouches[0].clientX - heroTouchStartX.current;
    if (dx < -60) next();
    else if (dx > 60) prev();
  };

  // ---- Ticker animation ----
  const tickerText = TICKER_ITEMS.join("   ·   ");

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="max-w-[1440px] mx-auto px-3 sm:px-6 py-4 sm:py-5 pb-24 md:pb-6">

        {/* ── Nav ── */}
        <header className="flex items-center justify-between gap-2 sm:gap-4">
          <div className="flex items-center gap-0">
            <img
              src={fullplayMark}
              alt="Fullplay"
              className="h-11 w-11 sm:h-14 sm:w-14 object-contain shrink-0 -mr-1 drop-shadow-[0_0_14px_rgba(168,85,247,0.5)]"
            />
            <div className="leading-none">
              <div className="text-lg sm:text-2xl font-extrabold tracking-tight">
                Full<span className="text-gradient-hero">play</span>
              </div>
              <div className="text-[8px] sm:text-[9px] tracking-[0.25em] text-muted-foreground mt-1">PLAY. WIN. REPEAT.</div>
            </div>
          </div>

          {/* ✅ FIXED: all items use <Link>, CASINO gets the active underline */}
          <nav className="hidden lg:flex items-center gap-8 text-sm font-semibold tracking-wide">
            {NAV_ITEMS.map((n) => (
              <Link
                key={n.label}
                to={n.to}
                className={`relative py-2 ${n.label === "CASINO" ? "text-foreground" : "text-muted-foreground hover:text-foreground"}`}
              >
                {n.label}
                {n.label === "PROMOTIONS" && (
                  <span className="ml-2 align-middle text-[9px] bg-gradient-primary text-white px-1.5 py-0.5 rounded">NEW</span>
                )}
                {n.label === "CASINO" && (
                  <span className="absolute -bottom-0.5 left-0 right-8 h-0.5 bg-gradient-primary rounded-full" />
                )}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-2 sm:gap-3">
            <button className="hidden sm:grid w-11 h-11 rounded-xl border border-border bg-surface place-items-center hover:border-primary transition">
              <Gift className="w-5 h-5 text-primary" />
            </button>

            {/* Auth area — skeleton while loading to prevent flash */}
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

        {/* ── Account drawer ── */}
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

                {/* ✅ FIXED: mobile drawer nav — all items use <Link> */}
                <div className="lg:hidden mt-5 px-2 text-[10px] tracking-[0.2em] text-muted-foreground font-semibold mb-2">EXPLORE</div>
                <ul className="lg:hidden space-y-1">
                  {NAV_ITEMS.map((n) => (
                    <li key={n.label}>
                      <Link
                        to={n.to}
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

        {/* ── Hero — Mobile ── */}
        <section
          className="md:hidden relative mt-4 rounded-2xl overflow-hidden bg-surface border border-border"
          onTouchStart={onHeroTouchStart}
          onTouchEnd={onHeroTouchEnd}
        >
          <div className="relative h-36 w-full overflow-hidden">
            {SLIDES.map((s, i) => (
              <img
                key={s.imgKey}
                src={imgMap[s.imgKey]}
                alt=""
                className={`absolute inset-0 h-full w-full object-cover object-right transition-opacity duration-1000 ease-in-out ${i === slide ? "opacity-100" : "opacity-0"}`}
                width={1408}
                height={768}
              />
            ))}
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-surface/40 to-surface" />
          </div>

          <div key={`mt-${slide}`} className="relative px-4 pb-4 -mt-6 animate-fade-in" style={{ animationDuration: "600ms" }}>
            <span className="inline-block text-[9px] tracking-[0.2em] font-semibold border border-primary/40 text-primary px-2 py-0.5 rounded-md bg-surface/80 backdrop-blur">
              {current.badge}
            </span>
            <h1 className="mt-2 text-2xl font-extrabold leading-none">
              <span className="text-gradient-hero">{current.title}</span>
            </h1>
            <h2 className="mt-1 text-lg font-extrabold tracking-tight">{current.subtitle}</h2>
            <p className="mt-1.5 text-xs text-muted-foreground">{current.desc}</p>

            <div className="mt-3 flex items-center gap-3">
              <button className="flex items-center gap-2 bg-gradient-primary text-primary-foreground font-semibold pl-4 pr-1.5 h-9 rounded-full shadow-glow text-sm transition-all duration-200 active:scale-95">
                Play Now
                <span className="w-7 h-7 rounded-full bg-white/20 grid place-items-center">
                  <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </button>
              <a href="#" className="flex items-center gap-1 font-semibold text-xs text-muted-foreground">
                Learn More <ChevronRight className="w-3.5 h-3.5" />
              </a>
            </div>

            <div className="mt-4 rounded-xl border border-border bg-surface-2/70 backdrop-blur p-2 grid grid-cols-3 gap-1">
              {[
                { icon: Rocket,     t: "Fast",   c: "text-violet-300" },
                { icon: Shield,     t: "Secure", c: "text-pink-300"   },
                { icon: Headphones, t: "24/7",   c: "text-blue-300"   },
              ].map(({ icon: I, t, c }) => (
                <div key={t} className="flex flex-col items-center gap-1 py-1.5">
                  <I className={`w-4 h-4 ${c}`} />
                  <span className="text-[10px] font-semibold leading-none">{t}</span>
                </div>
              ))}
            </div>

            <div className="mt-3 flex items-center justify-center gap-3">
              <button onClick={prev} type="button" aria-label="Previous slide" className="grid h-8 w-8 place-items-center rounded-full border border-border bg-surface-2/90 transition-all duration-200 active:scale-95">
                <ChevronLeft className="h-4 w-4" />
              </button>
              {SLIDES.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setSlide(i)}
                  type="button"
                  aria-label={`Slide ${i + 1}`}
                  className={`h-1 rounded-full transition-all ${i === slide ? "w-6 bg-gradient-primary" : "w-2 bg-muted"}`}
                />
              ))}
              <button onClick={next} type="button" aria-label="Next slide" className="grid h-8 w-8 place-items-center rounded-full border border-border bg-surface-2/90 transition-all duration-200 active:scale-95">
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </section>

        {/* ── Hero — Tablet / Desktop ── */}
        <section
          className="hidden md:block relative mt-6 rounded-3xl overflow-hidden bg-surface border border-border"
          onTouchStart={onHeroTouchStart}
          onTouchEnd={onHeroTouchEnd}
        >
          <div className="absolute inset-0 pointer-events-none">
            {SLIDES.map((s, i) => (
              <img
                key={s.imgKey}
                src={imgMap[s.imgKey]}
                alt=""
                className={`absolute inset-0 h-full w-full object-cover object-right transition-opacity duration-1000 ease-in-out ${i === slide ? "opacity-100" : "opacity-0"}`}
                width={1408}
                height={768}
              />
            ))}
            <div className="absolute inset-0 bg-gradient-to-r from-surface via-surface/30 to-transparent" />
          </div>

          <div className="relative px-10 py-14 min-h-[520px] flex flex-col justify-between pointer-events-none">
            <div key={`dt-${slide}`} className="max-w-xl animate-fade-in pointer-events-auto" style={{ animationDuration: "700ms" }}>
              <span className="inline-block text-[11px] tracking-[0.2em] font-semibold border border-primary/40 text-primary px-3 py-1.5 rounded-md">
                {current.badge}
              </span>
              <h1 className="mt-5 text-5xl font-extrabold leading-none">
                <span className="text-gradient-hero">{current.title}</span>
              </h1>
              <h2 className="mt-3 text-4xl font-extrabold tracking-tight">{current.subtitle}</h2>
              <p className="mt-4 text-base text-muted-foreground">{current.desc}</p>

              <div className="mt-8 flex items-center gap-5">
                <button className="flex items-center gap-3 bg-gradient-primary text-primary-foreground font-semibold pl-6 pr-2 h-12 rounded-full shadow-glow text-base transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_15px_40px_-10px_hsl(var(--primary)/0.6)]">
                  Play Now
                  <span className="w-9 h-9 rounded-full bg-white/20 grid place-items-center">
                    <ArrowRight className="w-4 h-4" />
                  </span>
                </button>
                <a href="#" className="flex items-center gap-1.5 font-semibold text-sm">
                  Learn More <ChevronRight className="w-4 h-4" />
                </a>
              </div>
            </div>

            <div className="mt-10 max-w-2xl rounded-2xl border border-border bg-surface-2/70 backdrop-blur p-4 flex items-center gap-6 flex-wrap pointer-events-auto">
              {[
                { icon: Rocket,     t: "Fast Payouts", s: "Instant Withdrawals", c: "text-violet-300" },
                { icon: Shield,     t: "Secure & Safe", s: "100% Protected",     c: "text-pink-300"   },
                { icon: Headphones, t: "24/7 Support",  s: "Live Chat Anytime",  c: "text-blue-300"   },
              ].map(({ icon: I, t, s, c }) => (
                <div key={t} className="flex items-center gap-3 min-w-[170px]">
                  <div className="w-10 h-10 rounded-lg bg-surface grid place-items-center border border-border shrink-0">
                    <I className={`w-5 h-5 ${c}`} />
                  </div>
                  <div className="leading-tight">
                    <div className="text-sm font-semibold">{t}</div>
                    <div className="text-xs text-muted-foreground">{s}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <button onClick={prev} type="button" aria-label="Previous slide" className="grid absolute left-4 top-1/2 z-30 h-11 w-11 -translate-y-1/2 place-items-center rounded-full border border-border bg-surface-2/90 backdrop-blur transition-all duration-200 hover:-translate-y-[calc(50%+2px)] hover:border-primary hover:shadow-lg active:scale-95 pointer-events-auto">
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button onClick={next} type="button" aria-label="Next slide" className="grid absolute right-4 top-1/2 z-30 h-11 w-11 -translate-y-1/2 place-items-center rounded-full border border-border bg-surface-2/90 backdrop-blur transition-all duration-200 hover:-translate-y-[calc(50%+2px)] hover:border-primary hover:shadow-lg active:scale-95 pointer-events-auto">
            <ChevronRight className="w-5 h-5" />
          </button>

          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5 z-20">
            {SLIDES.map((_, i) => (
              <button
                key={i}
                onClick={() => setSlide(i)}
                type="button"
                aria-label={`Slide ${i + 1}`}
                className={`h-1 rounded-full transition-all ${i === slide ? "w-8 bg-gradient-primary" : "w-3 bg-muted hover:bg-muted-foreground"}`}
              />
            ))}
          </div>
        </section>

        {/* ── Categories ── */}
        <section className="mt-5 sm:mt-6 flex items-center gap-2 sm:gap-3 overflow-x-auto sm:flex-wrap pb-2 sm:pb-0 -mx-3 px-3 sm:mx-0 sm:px-0">
          {CATEGORIES.map(({ label, icon: I, id }) => (
            <button
              key={id}
              onClick={() => setActiveCategory(id)}
              className={`shrink-0 flex items-center gap-2 sm:gap-2.5 h-10 sm:h-12 px-4 sm:px-5 rounded-xl border font-semibold text-xs sm:text-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg ${
                activeCategory === id
                  ? "bg-gradient-primary text-primary-foreground border-transparent shadow-glow"
                  : "bg-surface border-border hover:border-primary"
              }`}
            >
              <I className="w-4 h-4" />
              {label}
            </button>
          ))}
          <div className="sm:ml-auto relative flex-1 min-w-[200px] sm:min-w-[260px] max-w-md">
            <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              placeholder="Search games..."
              className="w-full h-10 sm:h-12 pl-11 pr-4 rounded-xl bg-surface border border-border focus:border-primary outline-none text-sm"
            />
          </div>
        </section>

        {/* ── Live Activity Ticker ── */}
        <div className="mt-3 sm:mt-4 rounded-xl border border-border bg-surface overflow-hidden flex items-center gap-0">
          <div className="shrink-0 flex items-center gap-1.5 px-3 sm:px-4 h-9 sm:h-10 border-r border-border bg-surface-2">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-[10px] sm:text-xs font-bold tracking-widest text-emerald-400 uppercase">Live</span>
          </div>
          <div className="flex-1 overflow-hidden relative h-9 sm:h-10 flex items-center">
            <div className="whitespace-nowrap text-xs sm:text-[13px] text-muted-foreground font-medium animate-[ticker_28s_linear_infinite]">
              {tickerText}&nbsp;&nbsp;&nbsp;·&nbsp;&nbsp;&nbsp;{tickerText}
            </div>
          </div>
          <div className="shrink-0 w-10 sm:w-16 h-9 sm:h-10 bg-gradient-to-l from-surface to-transparent pointer-events-none" />
        </div>

        <style>{`
          @keyframes ticker {
            0%   { transform: translateX(0); }
            100% { transform: translateX(-50%); }
          }
        `}</style>

        {/* ── Main grid ── */}
        <section className="mt-4 sm:mt-5 grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-4 sm:gap-5">

          {/* Top games */}
          <div className="rounded-2xl bg-surface border border-border p-4 sm:p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="flex items-center gap-2 font-bold tracking-wide">
                <Flame className="w-5 h-5 text-orange-400" />
                TOP GAMES
              </h3>
              <a href="#" className="flex items-center gap-1 text-sm text-primary font-semibold">
                View all <ChevronRight className="w-4 h-4" />
              </a>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-2.5 sm:gap-3">
              {TOP_GAMES.map((g) => (
                <div
                  key={g.id}
                  className="group relative rounded-xl overflow-hidden bg-surface-2 border border-border aspect-square cursor-pointer transition-all duration-300 hover:-translate-y-1.5 hover:border-primary hover:shadow-[0_20px_40px_-15px_hsl(var(--primary)/0.5)]"
                >
                  <img
                    src={imgMap[g.imgKey]}
                    alt={g.name}
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    loading="lazy"
                    width={512}
                    height={512}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />
                  <span className={`absolute top-2 left-2 text-[9px] font-bold px-1.5 py-0.5 rounded ${
                    g.tag === "HOT" ? "bg-red-500 text-white" : "bg-gradient-primary text-white"
                  }`}>{g.tag}</span>
                  <div className="absolute bottom-0 left-0 right-0 p-2">
                    <div className="font-extrabold text-amber-300 text-xs sm:text-sm leading-tight whitespace-pre-line drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
                      {g.name}
                    </div>
                    {g.id === "plinko" && (
                      <div className="mt-1.5 bg-black/60 border border-white/10 rounded-md px-1.5 py-1">
                        <PlinkoFooter />
                      </div>
                    )}
                  </div>
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
                    <div className="w-12 h-12 rounded-full bg-gradient-primary shadow-glow flex items-center justify-center">
                      <Zap className="w-5 h-5 text-white" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ── Popularity Top 10 ── */}
          <aside className="rounded-2xl overflow-hidden border border-border flex flex-col" style={{background:"linear-gradient(160deg,#1a1035 0%,#0f0a20 60%,#1a0f2e 100%)"}}>
            <div className="h-px w-full" style={{background:"linear-gradient(90deg,transparent,rgba(168,85,247,0.6),rgba(251,191,36,0.4),transparent)"}} />
            <div className="p-4 sm:p-5 flex flex-col flex-1">
              <div className="flex items-center justify-between mb-1">
                <h3 className="flex items-center gap-2 font-bold tracking-wide text-white">
                  <Sparkles className="w-5 h-5 text-amber-400" />
                  POPULARITY KINGS
                </h3>
                <a href="#" className="flex items-center gap-1 text-xs text-primary font-semibold hover:text-amber-400 transition-colors">
                  Full board <ChevronRight className="w-3.5 h-3.5" />
                </a>
              </div>
              <p className="text-[11px] text-white/40 mb-5 tracking-wide">Weekly · resets every Monday</p>

              <div className="grid grid-cols-3 gap-2.5 mb-5">
                {TOP_POPULARITY.slice(0, 3).map((p, i) => {
                  const podiumH    = ["h-[128px]", "h-[108px]", "h-[96px]"][i];
                  const avatarSize = ["w-14 h-14 text-xl", "w-12 h-12 text-base", "w-10 h-10 text-sm"][i];
                  const glowColor  = [
                    "shadow-[0_0_24px_-4px_rgba(251,191,36,0.7)] ring-2 ring-amber-400/70",
                    "shadow-[0_0_16px_-4px_rgba(148,163,184,0.5)] ring-2 ring-slate-400/40",
                    "shadow-[0_0_16px_-4px_rgba(180,83,9,0.5)] ring-2 ring-orange-700/40",
                  ][i];
                  const ptColor = ["text-amber-400", "text-slate-300", "text-orange-400"][i];

                  const RankIcon = () => {
                    if (i === 0) return (
                      <svg width="18" height="16" viewBox="0 0 18 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M1 6L4.5 2L9 5L13.5 2L17 6L14 13H4L1 6Z" fill="#FBBF24" stroke="#F59E0B" strokeWidth="1" strokeLinejoin="round"/>
                        <circle cx="1"  cy="6"  r="1.5" fill="#FCD34D"/>
                        <circle cx="17" cy="6"  r="1.5" fill="#FCD34D"/>
                        <circle cx="9"  cy="4.5" r="1.5" fill="#FCD34D"/>
                        <rect x="4" y="13" width="10" height="2" rx="1" fill="#F59E0B"/>
                      </svg>
                    );
                    if (i === 1) return (
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <circle cx="8" cy="8" r="7" fill="#94A3B8" stroke="#CBD5E1" strokeWidth="1"/>
                        <circle cx="8" cy="8" r="5" fill="#64748B"/>
                        <text x="8" y="12" textAnchor="middle" fontSize="7" fontWeight="bold" fill="#E2E8F0">2</text>
                      </svg>
                    );
                    return (
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <circle cx="8" cy="8" r="7" fill="#C2773A" stroke="#D97706" strokeWidth="1"/>
                        <circle cx="8" cy="8" r="5" fill="#92400E"/>
                        <text x="8" y="12" textAnchor="middle" fontSize="7" fontWeight="bold" fill="#FDE68A">3</text>
                      </svg>
                    );
                  };

                  return (
                    <button
                      key={p.id}
                      className={`group relative flex flex-col items-center justify-end gap-1.5 rounded-2xl border border-white/10 bg-white/5 backdrop-blur px-1.5 pb-3 pt-7 cursor-pointer transition-all duration-300 hover:-translate-y-1 hover:border-white/20 hover:bg-white/10 ${podiumH}`}
                    >
                      <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" style={{background:"radial-gradient(ellipse at 50% 0%,rgba(168,85,247,0.15),transparent 70%)"}} />
                      <span className="absolute top-2 left-1/2 -translate-x-1/2"><RankIcon /></span>
                      <div className={`rounded-full bg-gradient-to-br ${p.gradient} grid place-items-center font-extrabold text-white ${avatarSize} ${glowColor} mt-auto shrink-0`}>
                        {p.initial}
                      </div>
                      <span className="text-[10px] font-bold text-white/90 w-full text-center leading-tight break-all">{p.name}</span>
                      <div className={`flex items-center gap-0.5 ${ptColor}`}>
                        <Star className="w-2.5 h-2.5 fill-current shrink-0" />
                        <span className="text-[10px] font-extrabold tabular-nums">{(p.points/1000).toFixed(1)}k</span>
                      </div>
                    </button>
                  );
                })}
              </div>

              <div className="h-px w-full mb-3" style={{background:"linear-gradient(90deg,transparent,rgba(255,255,255,0.08),transparent)"}} />

              <ul className="space-y-1 flex-1">
                {TOP_POPULARITY.slice(3).map((p, i) => (
                  <li key={p.id}>
                    <button className="group w-full flex items-center gap-2.5 px-2.5 py-2 rounded-xl hover:bg-white/6 transition-all duration-150 cursor-pointer">
                      <span className="w-5 shrink-0 text-[11px] font-bold text-white/30 text-center tabular-nums">#{i + 4}</span>
                      <div className={`w-7 h-7 rounded-full bg-gradient-to-br ${p.gradient} grid place-items-center font-bold text-white text-xs shrink-0 ring-1 ring-white/10 group-hover:ring-white/30 transition-all`}>
                        {p.initial}
                      </div>
                      <span className="flex-1 text-xs font-semibold text-white/80 truncate group-hover:text-white transition-colors">{p.name}</span>
                      <div className="flex items-center gap-1 shrink-0">
                        <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                        <span className="text-[11px] font-bold text-amber-400 tabular-nums">{(p.points/1000).toFixed(1)}k</span>
                      </div>
                      <ChevronRight className="w-3.5 h-3.5 text-white/20 group-hover:text-white/50 group-hover:translate-x-0.5 transition-all shrink-0" />
                    </button>
                  </li>
                ))}
              </ul>

              <div className="mt-4 rounded-xl p-3 flex items-center gap-3" style={{background:"linear-gradient(120deg,rgba(168,85,247,0.15),rgba(251,191,36,0.08)))",border:"1px solid rgba(168,85,247,0.25)"}}>
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-amber-500 grid place-items-center shrink-0">
                  <Crown className="w-4 h-4 text-white" />
                </div>
                <div className="min-w-0">
                  <div className="text-[11px] font-bold text-white">Popularity system — coming soon</div>
                  <div className="text-[10px] text-white/40 mt-0.5 truncate">Send points · Boost your profile · Rise the ranks</div>
                </div>
              </div>
            </div>
            <div className="h-px w-full" style={{background:"linear-gradient(90deg,transparent,rgba(168,85,247,0.3),transparent)"}} />
          </aside>
        </section>

        {/* ── Features bar ── */}
        <section className="mt-4 sm:mt-5 rounded-2xl bg-surface border border-border p-4 sm:p-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-5 sm:gap-6">
          {FEATURES.map(({ icon: I, title, desc, color }) => (
            <div key={title} className="flex items-center gap-4">
              <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-surface-2 border border-border grid place-items-center shrink-0">
                <I className={`w-5 h-5 sm:w-6 sm:h-6 ${color}`} />
              </div>
              <div>
                <div className="font-bold tracking-wide text-sm">{title}</div>
                <div className="text-xs text-muted-foreground mt-1 leading-snug">{desc}</div>
              </div>
            </div>
          ))}
        </section>

        {/* ── Refer & Earn stripe ── */}
        <section className="mt-4 sm:mt-5 rounded-2xl bg-surface border border-border overflow-hidden">
          <div className="h-px w-full" style={{background:"linear-gradient(90deg,transparent,rgba(168,85,247,0.5),rgba(251,191,36,0.4),transparent)"}} />
          <div className="px-4 sm:px-6 py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3 shrink-0">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-600 to-fuchsia-600 grid place-items-center shadow-glow shrink-0">
                <Gift className="w-5 h-5 text-white" />
              </div>
              <div>
                <div className="text-xs font-bold tracking-[0.2em] text-primary uppercase">Refer &amp; Earn</div>
                <div className="text-sm font-extrabold text-foreground leading-tight">Invite friends · Earn up to <span className="text-amber-400">₹10,000</span></div>
              </div>
            </div>
            <div className="hidden sm:block h-10 w-px bg-border" />
            <div className="flex flex-wrap gap-x-6 gap-y-2 flex-1">
              {[
                { icon: Users, label: "Per referral",   value: "upto ₹100 bonus" },
                { icon: Zap,   label: "Instant credit", value: "No delay"         },
                { icon: Star,  label: "No cap",         value: "Unlimited"        },
              ].map(({ icon: I, label, value }) => (
                <div key={label} className="flex items-center gap-2">
                  <I className="w-4 h-4 text-primary shrink-0" />
                  <div className="leading-tight">
                    <div className="text-[10px] text-muted-foreground">{label}</div>
                    <div className="text-xs font-bold">{value}</div>
                  </div>
                </div>
              ))}
            </div>
            <button className="shrink-0 h-10 px-5 rounded-xl bg-gradient-primary text-primary-foreground font-bold text-sm shadow-glow transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_10px_30px_-5px_hsl(var(--primary)/0.5)] whitespace-nowrap">
              Invite Now
            </button>
          </div>
        </section>
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
            { label: "Casino",   icon: Home,      active: true  },
            { label: "Search",   icon: Search,    active: false },
            { label: "Bonuses",  icon: Gift,      active: false },
            { label: "Account",  icon: CircleDot, active: false },
          ].map(({ label, icon: I, active }) => (
            <button
              key={label}
              onClick={() => { if (label === "Account") setMenuOpen(true); }}
              className={`flex-1 flex flex-col items-center justify-center gap-1 transition-colors ${
                active ? "text-primary" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <I className={`w-5 h-5 ${active ? "drop-shadow-[0_0_6px_hsl(var(--primary)/0.7)]" : ""}`} />
              <span className="text-[9px] font-semibold tracking-wide">{label}</span>
              {active && <span className="absolute bottom-0 w-10 h-0.5 bg-gradient-primary rounded-full" />}
            </button>
          ))}
        </div>
      </nav>
    </div>
  );
}