import { createFileRoute, Link } from "@tanstack/react-router";
import { LegalLayout } from "@/components/LegalLayout";

export const Route = createFileRoute("/terms")({
  head: () => ({
    meta: [
      { title: "Terms & Conditions — FullPlay" },
      { name: "description", content: "FullPlay Terms & Conditions: eligibility, account rules, deposits, KYC, bonuses, responsible gaming and more." },
    ],
  }),
  component: TermsPage,
});

function P({ children }: { children: React.ReactNode }) {
  return <p>{children}</p>;
}
function UL({ items }: { items: string[] }) {
  return (
    <ul className="list-disc pl-5 space-y-1.5 marker:text-primary">
      {items.map((i) => <li key={i}>{i}</li>)}
    </ul>
  );
}

function TermsPage() {
  const sections = [
    { id: "eligibility", title: "User Eligibility (18+ only)", body: (
      <>
        <P>FullPlay is strictly for adults. You must be at least 18 years old (or the legal age of majority in your jurisdiction, whichever is higher) to register, deposit, or play on the platform.</P>
        <UL items={[
          "You confirm you are not located in a region where online gaming is restricted.",
          "Government-issued ID may be requested at any time to verify your age.",
          "Accounts found to belong to minors are closed and funds forfeited.",
        ]} />
      </>
    )},
    { id: "account", title: "Account Rules", body: (
      <>
        <P>Each player may hold only one (1) active FullPlay account. Sharing, selling, or transferring accounts is strictly prohibited.</P>
        <UL items={[
          "Provide accurate personal information at registration and keep it up to date.",
          "Keep your password and login credentials confidential.",
          "You are responsible for all activity that occurs under your account.",
          "Duplicate accounts will be merged or closed at our discretion.",
        ]} />
      </>
    )},
    { id: "deposits", title: "Deposits & Withdrawals", body: (
      <>
        <P>FullPlay supports UPI, net banking, and major card payments in INR. Minimum deposit is ₹100. Minimum withdrawal is ₹500.</P>
        <UL items={[
          "Withdrawals are processed to the same method used for deposit whenever possible.",
          "First withdrawal requires completed KYC verification.",
          "Processing time: instant to 24 hours for UPI, up to 3 business days for bank transfers.",
          "FullPlay does not charge withdrawal fees; your bank may.",
        ]} />
      </>
    )},
    { id: "kyc", title: "KYC Verification", body: (
      <>
        <P>To comply with anti-money-laundering regulations, FullPlay requires Know Your Customer (KYC) verification before significant withdrawals.</P>
        <UL items={[
          "Submit a clear photo of a government ID (Aadhaar, PAN, Passport, or Driving License).",
          "Provide a recent address proof if requested.",
          "Verification usually completes within 24 hours.",
          "Funds may be held until KYC is successfully completed.",
        ]} />
      </>
    )},
    { id: "referral", title: "Referral Program Rules", body: (
      <>
        <P>Invite friends and earn rewards when they join and play on FullPlay.</P>
        <UL items={[
          "Referrer earns up to 25% revenue share on the referred player's net gaming activity.",
          "Referred players must be new, unique users with a verified account.",
          "Self-referrals, fake accounts, and bonus abuse will void all rewards.",
          "Referral commissions are credited weekly to your wallet.",
        ]} />
      </>
    )},
    { id: "bonuses", title: "Bonuses and Rewards", body: (
      <>
        <P>All bonuses are subject to specific terms displayed at the time of claim. Unless stated otherwise:</P>
        <UL items={[
          "Welcome bonus has a 35x wagering requirement.",
          "Maximum bet while bonus is active: ₹200 per spin/round.",
          "Bonuses expire 30 days after activation if wagering is not completed.",
          "Only one active bonus per account at a time.",
          "FullPlay reserves the right to revoke bonuses obtained through abuse.",
        ]} />
      </>
    )},
    { id: "responsible", title: "Responsible Gaming", body: (
      <>
        <P>Gambling should remain entertainment. FullPlay is committed to safer play and provides tools to keep you in control.</P>
        <UL items={[
          "Set deposit, loss, and session limits from your account settings.",
          "Take a break with self-exclusion (24 hours to permanent).",
          "Reality checks remind you of time spent playing.",
          "If you need help, contact a local support service or our team.",
        ]} />
      </>
    )},
    { id: "prohibited", title: "Prohibited Activities", body: (
      <>
        <P>The following are strictly forbidden and may lead to immediate account closure and forfeiture of funds:</P>
        <UL items={[
          "Use of bots, scripts, or automated tools.",
          "Collusion with other players or chip-dumping.",
          "Exploiting software bugs or game errors.",
          "Use of VPNs to bypass regional restrictions.",
          "Money laundering or transactions with illegal source funds.",
          "Bonus abuse, multi-accounting, and identity fraud.",
        ]} />
      </>
    )},
    { id: "suspension", title: "Account Suspension / Ban Policy", body: (
      <>
        <P>FullPlay may suspend, restrict, or close any account that breaches these terms, presents fraud risk, or is requested by a regulator or payment provider.</P>
        <UL items={[
          "Minor breaches → warning and temporary suspension.",
          "Repeated or serious breaches → permanent ban and forfeiture of remaining bonus funds.",
          "Verified deposits not earned through play are returned where lawfully possible.",
          "You may appeal by writing to support within 30 days of action.",
        ]} />
      </>
    )},
    { id: "liability", title: "Limitation of Liability", body: (
      <>
        <P>The FullPlay platform is provided on an "as is" and "as available" basis. To the maximum extent permitted by law:</P>
        <UL items={[
          "FullPlay is not liable for indirect, incidental, or consequential losses.",
          "We are not responsible for downtime caused by third-party providers, ISPs, or force majeure events.",
          "Maximum aggregate liability is limited to the amount in your wallet at the time of the disputed event.",
          "Nothing in these terms excludes liability that cannot be excluded by law.",
        ]} />
      </>
    )},
    { id: "privacy", title: "Privacy Policy", body: (
      <>
        <P>We handle your personal data carefully. For full details on what we collect, how we use it, and your rights, please read our dedicated Privacy Policy.</P>
        <P>
          <Link to="/privacy" className="text-primary font-semibold hover:underline">
            Read the full Privacy Policy →
          </Link>
        </P>
      </>
    )},
    { id: "contact", title: "Contact / Support", body: (
      <>
        <P>Need help with your account, a payment, or a bonus? Our support team is available 24/7.</P>
        <UL items={[
          "Email: support@fullplay.app",
          "Live Chat: in-app, bottom-right corner",
          "Response time: under 2 minutes on average",
        ]} />
      </>
    )},
  ];

  return (
    <LegalLayout
      eyebrow="LEGAL"
      title="Terms & Conditions"
      intro="These terms govern your use of FullPlay. By creating an account or placing a wager, you agree to everything below. Please read carefully — they protect both you and the platform."
      updated="May 24, 2026"
      sections={sections}
    />
  );
}