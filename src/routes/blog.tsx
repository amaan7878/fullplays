import { createFileRoute, Link } from "@tanstack/react-router";
import { ChevronLeft, ArrowRight, Clock } from "lucide-react";
import fullplayMark from "@/assets/fullplay-mark.png";

export const Route = createFileRoute("/blog")({
  head: () => ({
    meta: [
      { title: "Blog — FullPlay" },
      { name: "description", content: "FullPlay blog: game updates, promotions, big winner stories, strategy guides, and platform news." },
    ],
  }),
  component: BlogPage,
});

type Post = {
  title: string; excerpt: string; category: string; date: string; read: string;
  gradient: string; featured?: boolean;
};

function BlogPage() {
  const posts: Post[] = [
    { title: "Crash X is here — meet our biggest game launch yet", excerpt: "Space-themed multipliers, instant cash-outs, and a 100,000x max win. Crash X redefines what a crash game can be.", category: "Game Updates", date: "May 22, 2026", read: "4 min", gradient: "from-violet-600 via-fuchsia-500 to-pink-500", featured: true },
    { title: "₹50,00,000 weekend — our biggest promo of the year", excerpt: "A guaranteed prize pool, daily missions, and a leaderboard race. Here's how to claim your share.", category: "Promotions", date: "May 20, 2026", read: "3 min", gradient: "from-amber-500 via-orange-500 to-rose-500" },
    { title: "Meet Rajat — the player who turned ₹500 into ₹4.2 lakhs on Plinko", excerpt: "Rajat shares his strategy, his lowest moment, and what he's doing with the winnings.", category: "Winners", date: "May 18, 2026", read: "6 min", gradient: "from-emerald-500 via-teal-500 to-cyan-500" },
    { title: "How to play Mines like a pro — a beginner's guide", excerpt: "Expected value, gem counts, and when to cash out. Master Mines in under 10 minutes.", category: "Strategy", date: "May 15, 2026", read: "8 min", gradient: "from-blue-500 via-indigo-500 to-violet-500" },
    { title: "Instant UPI withdrawals now live — under 30 seconds", excerpt: "We've upgraded the entire withdrawal pipeline. Here's what's new and what's coming next.", category: "Platform News", date: "May 12, 2026", read: "3 min", gradient: "from-pink-500 via-rose-500 to-red-500" },
    { title: "Dragon & Tiger strategy — when to side-bet", excerpt: "The math behind tie bets, suited ties, and why most players get it wrong.", category: "Strategy", date: "May 10, 2026", read: "5 min", gradient: "from-fuchsia-600 via-purple-500 to-indigo-500" },
    { title: "VIP tier upgrades — bigger cashback, faster payouts", excerpt: "We've doubled the cashback for Gold and Diamond tiers. See what's new in your VIP dashboard.", category: "Platform News", date: "May 8, 2026", read: "2 min", gradient: "from-amber-400 via-yellow-500 to-orange-500" },
    { title: "Weekly winner roundup — May 1–7", excerpt: "Five lakh winners, three new millionaires, and the biggest single spin in FullPlay history.", category: "Winners", date: "May 7, 2026", read: "4 min", gradient: "from-cyan-500 via-sky-500 to-blue-500" },
  ];

  const featured = posts.find((p) => p.featured)!;
  const rest = posts.filter((p) => !p.featured);
  const categories = ["All", "Game Updates", "Promotions", "Winners", "Strategy", "Platform News"];

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="border-b border-border bg-surface/60 backdrop-blur sticky top-0 z-30">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 h-14 sm:h-16 flex items-center justify-between gap-3">
          <Link to="/" className="flex items-center gap-1">
            <img
              src={fullplayMark}
              alt="FullPlay"
              className="h-14 w-14 object-contain drop-shadow-[0_0_8px_rgba(168,85,247,0.22)]"
              draggable={false}
            />
            <div className="leading-none">
              <div className="text-xl sm:text-2xl font-extrabold tracking-tight -ml-0.5 sm:-ml-1">
                FULL<span className="text-gradient-hero">PLAY</span>
              </div>
              <div className="text-[9px] tracking-[0.25em] text-muted-foreground mt-0.5">PLAY. WIN. REPEAT.</div>
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
        <div className="relative max-w-[1200px] mx-auto px-4 sm:px-6 py-10 sm:py-14 animate-fade-in">
          <span className="inline-block text-[10px] tracking-[0.25em] font-semibold border border-primary/40 text-primary px-2.5 py-1 rounded-md bg-surface/80 backdrop-blur">
            BLOG
          </span>
          <h1 className="mt-4 text-3xl sm:text-5xl font-extrabold tracking-tight">
            <span className="text-gradient-hero">News, winners & strategy.</span>
          </h1>
          <p className="mt-3 max-w-xl text-sm sm:text-base text-muted-foreground">
            Game updates, promo announcements, big winner stories and tactical guides — fresh every week.
          </p>
        </div>
      </section>

      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 py-10 sm:py-12 space-y-10">
        {/* Category pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 -mx-4 px-4 sm:mx-0 sm:px-0">
          {categories.map((c, i) => (
            <button key={c} className={`shrink-0 h-9 px-4 rounded-full border text-xs font-bold transition ${
              i === 0 ? "bg-gradient-primary text-primary-foreground border-transparent shadow-glow" : "bg-surface border-border text-muted-foreground hover:border-primary hover:text-foreground"
            }`}>{c}</button>
          ))}
        </div>

        {/* Featured */}
        <article className="group relative overflow-hidden rounded-3xl border border-border bg-surface hover:border-primary transition">
          <div className="grid md:grid-cols-2 gap-0">
            <div className={`relative aspect-[16/10] md:aspect-auto md:min-h-[320px] bg-gradient-to-br ${featured.gradient} overflow-hidden`}>
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
              <span className="absolute top-4 left-4 text-[10px] font-bold tracking-wider bg-black/40 backdrop-blur px-2.5 py-1 rounded-md text-white">FEATURED</span>
            </div>
            <div className="p-6 sm:p-8 flex flex-col justify-center">
              <div className="text-[10px] tracking-[0.25em] font-bold text-primary">{featured.category.toUpperCase()}</div>
              <h2 className="mt-2 text-2xl sm:text-3xl font-extrabold tracking-tight leading-tight">{featured.title}</h2>
              <p className="mt-3 text-sm sm:text-base text-muted-foreground leading-relaxed">{featured.excerpt}</p>
              <div className="mt-5 flex items-center justify-between">
                <div className="flex items-center gap-3 text-xs text-muted-foreground">
                  <span>{featured.date}</span>
                  <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{featured.read}</span>
                </div>
                <span className="flex items-center gap-1 text-sm font-bold text-primary">
                  Read <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition" />
                </span>
              </div>
            </div>
          </div>
        </article>

        {/* Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
          {rest.map((p) => (
            <article key={p.title} className="group rounded-2xl border border-border bg-surface overflow-hidden hover:border-primary hover:-translate-y-1 transition-all">
              <div className={`relative aspect-[16/10] bg-gradient-to-br ${p.gradient} overflow-hidden`}>
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                <span className="absolute top-3 left-3 text-[9px] font-bold tracking-wider bg-black/40 backdrop-blur px-2 py-0.5 rounded text-white">{p.category.toUpperCase()}</span>
              </div>
              <div className="p-4">
                <h3 className="font-extrabold tracking-tight leading-snug line-clamp-2">{p.title}</h3>
                <p className="mt-2 text-xs text-muted-foreground line-clamp-2 leading-relaxed">{p.excerpt}</p>
                <div className="mt-4 flex items-center justify-between text-[11px] text-muted-foreground">
                  <span>{p.date}</span>
                  <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{p.read}</span>
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* Newsletter */}
        <div className="rounded-2xl bg-gradient-primary p-6 sm:p-8 shadow-glow text-primary-foreground flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="text-[10px] tracking-[0.25em] font-semibold opacity-90">NEWSLETTER</div>
            <h3 className="mt-1 text-xl sm:text-2xl font-extrabold">Get the next promo first.</h3>
            <p className="mt-1 text-sm opacity-90">One email a week. New games, big winners, zero spam.</p>
          </div>
          <form onSubmit={(e) => e.preventDefault()} className="flex w-full sm:w-auto gap-2">
            <input type="email" required placeholder="you@email.com" className="flex-1 sm:w-64 h-11 px-4 rounded-lg bg-black/30 text-white placeholder:text-white/60 border border-white/20 focus:border-white outline-none text-sm" />
            <button className="h-11 px-5 rounded-lg bg-white text-primary font-bold text-sm hover:bg-white/90 transition">Subscribe</button>
          </form>
        </div>
      </div>
    </div>
  );
}