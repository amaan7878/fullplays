import { createFileRoute } from "@tanstack/react-router";
import { LegalLayout } from "@/components/LegalLayout";
import { Rocket, Shield, Zap, Trophy, Users, Heart } from "lucide-react";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About Us — FullPlay" },
      { name: "description", content: "FullPlay's mission: fast withdrawals, provably fair games, and a modern gaming experience for everyone." },
    ],
  }),
  component: AboutPage,
});

function AboutPage() {
  const values = [
    { icon: Zap, title: "Fast Withdrawals", desc: "Cash out in seconds with UPI and instant bank transfers — no waiting, no hidden fees." },
    { icon: Shield, title: "Provably Fair", desc: "Every game outcome is verifiable on-chain. Trust isn't a slogan — it's math." },
    { icon: Rocket, title: "Modern Experience", desc: "Built for mobile-first players with buttery animations and zero lag." },
    { icon: Trophy, title: "Real Rewards", desc: "Massive jackpots, daily rakeback, and a VIP program that actually pays back." },
    { icon: Users, title: "Community First", desc: "Tournaments, leaderboards, and a referral program that turns friends into earnings." },
    { icon: Heart, title: "Player Safety", desc: "Bank-level encryption, KYC, and responsible-gaming tools baked into every screen." },
  ];

  const sections = [
    { id: "mission", title: "Our Mission", body: (
      <>
        <p>FullPlay was born from a simple frustration: every other casino felt slow, clunky, and stacked against the player. We set out to build the opposite — a platform where withdrawals are instant, games are provably fair, and the UI feels as polished as the best apps you use every day.</p>
        <p>Today, FullPlay powers thousands of plays per minute across India, paying out winnings in seconds and giving players the tools to stay in control of their game.</p>
      </>
    )},
    { id: "values", title: "What We Stand For", body: (
      <div className="grid sm:grid-cols-2 gap-3 not-prose">
        {values.map(({ icon: I, title, desc }) => (
          <div key={title} className="rounded-xl border border-border bg-surface-2 p-4">
            <div className="flex items-center gap-2 mb-2">
              <span className="w-9 h-9 rounded-lg bg-gradient-primary grid place-items-center shadow-glow">
                <I className="w-4 h-4 text-white" />
              </span>
              <h3 className="font-bold text-foreground text-sm">{title}</h3>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">{desc}</p>
          </div>
        ))}
      </div>
    )},
    { id: "team", title: "Built by Players, for Players", body: (
      <p>Our team has decades of combined experience in iGaming, fintech, and product design. We play the games we ship — which means we feel every laggy spin, every painful withdrawal, every confusing bonus term. That's why FullPlay is different.</p>
    )},
    { id: "future", title: "Where We're Going", body: (
      <p>New games every week, esports betting, live dealer rooms, and a global expansion roadmap. We're just getting started — and you're invited.</p>
    )},
  ];

  return (
    <LegalLayout
      eyebrow="ABOUT"
      title="About FullPlay"
      intro="Built on speed, fairness, and player respect. We're rewriting what an online casino can feel like."
      updated="May 24, 2026"
      sections={sections}
    />
  );
}