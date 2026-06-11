import { createFileRoute, Link } from "@tanstack/react-router";
import { ChevronLeft, MapPin, Clock, ArrowRight, Zap, Shield, Heart, Globe } from "lucide-react";
import fullplayMark from "@/assets/fullplay-mark.png";

export const Route = createFileRoute("/careers")({
  head: () => ({
    meta: [
      { title: "Careers — FullPlay" },
      { name: "description", content: "Join the FullPlay team. We're hiring engineers, designers, and operators who want to build the future of gaming." },
    ],
  }),
  component: CareersPage,
});

type Job = {
  title: string;
  team: string;
  location: string;
  type: string;
};

const JOBS: Job[] = [
  { title: "Senior Frontend Engineer", team: "Engineering", location: "Remote", type: "Full-time" },
  { title: "Backend Engineer — Payments", team: "Engineering", location: "Remote", type: "Full-time" },
  { title: "Game Integration Engineer", team: "Engineering", location: "Remote / Mumbai", type: "Full-time" },
  { title: "Product Designer", team: "Design", location: "Remote", type: "Full-time" },
  { title: "Head of Growth", team: "Marketing", location: "Mumbai", type: "Full-time" },
  { title: "Customer Success Lead", team: "Operations", location: "Remote / Bangalore", type: "Full-time" },
  { title: "Compliance & Licensing Manager", team: "Legal", location: "Mumbai", type: "Full-time" },
  { title: "Data Analyst — Player Insights", team: "Data", location: "Remote", type: "Full-time" },
];

const PERKS = [
  { icon: Zap,    title: "Move fast",           desc: "Ship real features to real users every week. No layers of approval." },
  { icon: Globe,  title: "Fully remote-first",  desc: "Work from anywhere. Async by default, optional offsites." },
  { icon: Heart,  title: "Equity for everyone", desc: "Every full-time hire gets meaningful ownership from day one." },
  { icon: Shield, title: "Top-tier benefits",   desc: "Health, dental, learning budget, and home-office setup covered." },
];

const TEAMS = ["All", "Engineering", "Design", "Marketing", "Operations", "Legal", "Data"];

function CareersPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="border-b border-border bg-surface/60 backdrop-blur sticky top-0 z-30">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 h-14 sm:h-16 flex items-center justify-between gap-3">
          <Link to="/" className="flex items-center gap-2.5">
            <img
              src={fullplayMark}
              alt="FullPlay"
              width={36}
              height={36}
              style={{ mixBlendMode: "lighten" }}
              draggable={false}
            />
            <div className="leading-none">
              <div className="text-base font-extrabold tracking-tight">
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

      {/* Hero */}
      <section className="relative overflow-hidden border-b border-border">
        <div className="absolute inset-0 bg-gradient-primary opacity-[0.10]" />
        <div className="absolute -top-24 -left-24 w-96 h-96 rounded-full bg-primary/20 blur-3xl" />
        <div className="absolute -bottom-12 -right-12 w-64 h-64 rounded-full bg-fuchsia-500/20 blur-3xl" />
        <div className="relative max-w-[1200px] mx-auto px-4 sm:px-6 py-12 sm:py-20">
          <span className="inline-block text-[10px] tracking-[0.25em] font-semibold border border-primary/40 text-primary px-2.5 py-1 rounded-md bg-surface/80 backdrop-blur">
            CAREERS
          </span>
          <h1 className="mt-4 text-3xl sm:text-5xl font-extrabold tracking-tight leading-tight">
            Build the future of <span className="text-gradient-hero">gaming in India.</span>
          </h1>
          <p className="mt-4 max-w-xl text-sm sm:text-base text-muted-foreground leading-relaxed">
            We're a small, fast team making big bets. If you want ownership, impact, and the chance to shape a platform used by millions — you're in the right place.
          </p>
          <div className="mt-6 flex items-center gap-4 text-sm text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              {JOBS.length} open roles
            </span>
            <span>·</span>
            <span>Remote-first</span>
            <span>·</span>
            <span>Mumbai HQ</span>
          </div>
        </div>
      </section>

      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 py-10 sm:py-14 space-y-14">

        {/* Perks */}
        <section>
          <h2 className="text-xs font-bold tracking-[0.25em] text-muted-foreground mb-5">WHY FULLPLAY</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {PERKS.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="rounded-2xl bg-surface border border-border p-5 hover:border-primary transition">
                <div className="w-9 h-9 rounded-xl bg-gradient-primary grid place-items-center shadow-glow mb-3">
                  <Icon className="w-4 h-4 text-white" />
                </div>
                <div className="font-bold text-sm mb-1">{title}</div>
                <p className="text-xs text-muted-foreground leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Job listings */}
        <section>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
            <h2 className="text-xs font-bold tracking-[0.25em] text-muted-foreground">OPEN ROLES</h2>
            <div className="flex items-center gap-2 overflow-x-auto pb-1">
              {TEAMS.map((t, i) => (
                <button key={t} className={`shrink-0 h-8 px-3 rounded-full border text-xs font-bold transition ${
                  i === 0
                    ? "bg-gradient-primary text-primary-foreground border-transparent shadow-glow"
                    : "bg-surface border-border text-muted-foreground hover:border-primary hover:text-foreground"
                }`}>{t}</button>
              ))}
            </div>
          </div>

          <div className="divide-y divide-border rounded-2xl border border-border bg-surface overflow-hidden">
            {JOBS.map((job) => (
              <button
                key={job.title}
                type="button"
                className="group w-full flex items-center justify-between gap-4 px-5 py-4 hover:bg-surface-2 transition text-left"
              >
                <div className="min-w-0">
                  <div className="font-bold text-sm leading-snug">{job.title}</div>
                  <div className="flex items-center gap-3 mt-1 text-[11px] text-muted-foreground">
                    <span className="text-primary font-semibold">{job.team}</span>
                    <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{job.location}</span>
                    <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{job.type}</span>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-muted-foreground shrink-0 group-hover:text-primary group-hover:translate-x-1 transition" />
              </button>
            ))}
          </div>
        </section>

        {/* Wild card CTA */}
        <section className="rounded-2xl bg-gradient-primary p-6 sm:p-8 shadow-glow text-primary-foreground flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="text-[10px] tracking-[0.25em] font-semibold opacity-80">DON'T SEE YOUR ROLE?</div>
            <h3 className="mt-1 text-xl sm:text-2xl font-extrabold">Send us a wild card.</h3>
            <p className="mt-1 text-sm opacity-90">If you're exceptional at what you do, we'll make room for you.</p>
          </div>
          <a
            href="mailto:careers@fullplay.in"
            className="shrink-0 h-11 px-6 rounded-xl bg-white text-primary font-bold text-sm hover:bg-white/90 transition flex items-center gap-2"
          >
            careers@fullplay.in <ArrowRight className="w-4 h-4" />
          </a>
        </section>

      </div>
    </div>
  );
}