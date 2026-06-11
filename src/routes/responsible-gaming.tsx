import { createFileRoute } from "@tanstack/react-router";
import { LegalLayout } from "@/components/LegalLayout";

export const Route = createFileRoute("/responsible-gaming")({
  head: () => ({
    meta: [
      { title: "Responsible Gaming — FullPlay" },
      { name: "description", content: "Tools and resources to play safely on FullPlay: self-exclusion, deposit limits, session reminders, and addiction support." },
    ],
  }),
  component: ResponsiblePage,
});

function UL({ items }: { items: string[] }) {
  return (
    <ul className="list-disc pl-5 space-y-1.5 marker:text-primary">
      {items.map((i) => <li key={i}>{i}</li>)}
    </ul>
  );
}

function ResponsiblePage() {
  const sections = [
    { id: "age", title: "18+ Warning", body: (
      <div className="rounded-xl border-2 border-red-500/60 bg-red-500/10 p-4 not-prose">
        <div className="text-red-300 font-extrabold text-base mb-1">⚠ STRICTLY 18+</div>
        <p className="text-sm text-muted-foreground">FullPlay is only for adults aged 18 or older. Gambling by minors is illegal and harmful. We verify age through KYC and immediately close any account found to belong to a minor.</p>
      </div>
    )},
    { id: "exclusion", title: "Self-Exclusion", body: (
      <>
        <p>Need a break? You can self-exclude from FullPlay at any time. Once active, you cannot deposit, place wagers, or claim bonuses until the exclusion period ends.</p>
        <UL items={[
          "24-hour cool-off — instant, automatic.",
          "7 / 30 / 90-day exclusion — chosen from Settings.",
          "6-month or permanent exclusion — contact support to enable.",
        ]} />
      </>
    )},
    { id: "deposit-limits", title: "Deposit Limits", body: (
      <>
        <p>Set daily, weekly, and monthly deposit caps. Lower limits take effect immediately; raising a limit requires a 24-hour cooling period.</p>
        <UL items={[
          "Daily limit (₹500 – ₹50,000)",
          "Weekly limit",
          "Monthly limit",
          "Single-deposit cap",
        ]} />
      </>
    )},
    { id: "session", title: "Session Reminders", body: (
      <>
        <p>Reality checks keep you aware of time spent on the platform. Enable from Settings → Responsible Gaming.</p>
        <UL items={[
          "Pop-up reminders every 15, 30, or 60 minutes.",
          "Session summary showing time + net result.",
          "Auto-logout after configurable inactivity.",
        ]} />
      </>
    )},
    { id: "awareness", title: "Gambling Addiction Awareness", body: (
      <>
        <p>Gambling becomes a problem when it stops being fun. Watch for these warning signs:</p>
        <UL items={[
          "Chasing losses with bigger bets.",
          "Borrowing money or selling things to play.",
          "Lying about how much you play or lose.",
          "Feeling anxious, irritable, or restless when not playing.",
          "Neglecting work, family, or sleep.",
        ]} />
      </>
    )},
    { id: "support", title: "Support Resources", body: (
      <UL items={[
        "AIIMS National Drug Dependence Treatment Centre — +91-11-26593236",
        "iCall psychosocial helpline — +91-9152987821",
        "Vandrevala Foundation — 1860-2662-345 (24/7, free)",
        "GamCare (international) — gamcare.org.uk",
        "Gamblers Anonymous India — gamblersanonymous.org/ga",
      ]} />
    )},
    { id: "pledge", title: "Play Responsibly", body: (
      <div className="rounded-xl bg-gradient-primary p-4 text-primary-foreground not-prose">
        <div className="font-extrabold text-lg mb-1">Gambling should be fun.</div>
        <p className="text-sm opacity-95">Set a budget. Set a time limit. Never chase losses. Treat any winnings as a bonus, not income. If it stops being fun, walk away — we'll be here when you come back.</p>
      </div>
    )},
  ];

  return (
    <LegalLayout
      eyebrow="SAFER PLAY"
      title="Responsible Gaming"
      intro="Your wellbeing comes before any wager. Here are the tools, limits, and helplines built into FullPlay to keep you in control."
      updated="May 24, 2026"
      sections={sections}
    />
  );
}