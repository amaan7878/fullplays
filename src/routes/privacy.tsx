import { createFileRoute } from "@tanstack/react-router";
import { LegalLayout } from "@/components/LegalLayout";

export const Route = createFileRoute("/privacy")({
  head: () => ({
    meta: [
      { title: "Privacy Policy — FullPlay" },
      { name: "description", content: "How FullPlay collects, uses, stores, and protects your personal data." },
    ],
  }),
  component: PrivacyPage,
});

function UL({ items }: { items: string[] }) {
  return (
    <ul className="list-disc pl-5 space-y-1.5 marker:text-primary">
      {items.map((i) => <li key={i}>{i}</li>)}
    </ul>
  );
}

function PrivacyPage() {
  const sections = [
    { id: "intro", title: "Introduction", body: (
      <p>This Privacy Policy explains what personal information FullPlay collects, how it is used, and your rights over it. We follow industry-standard practices to keep your data safe and only use it for legitimate purposes.</p>
    )},
    { id: "collect", title: "Information We Collect", body: (
      <UL items={[
        "Identity data: name, date of birth, gender, government ID (for KYC).",
        "Contact data: email, phone number, billing address.",
        "Financial data: payment method details (tokenised), transaction history.",
        "Technical data: IP address, device, browser, language, time zone.",
        "Usage data: games played, bets placed, login times, bonuses claimed.",
      ]} />
    )},
    { id: "use", title: "How We Use Your Information", body: (
      <UL items={[
        "Create and manage your FullPlay account.",
        "Process deposits, withdrawals, and bonuses.",
        "Verify your identity and prevent fraud / money laundering.",
        "Comply with legal and regulatory obligations.",
        "Improve our games, recommendations, and platform performance.",
        "Send transactional emails; marketing only with your consent.",
      ]} />
    )},
    { id: "sharing", title: "Sharing of Data", body: (
      <>
        <p>We never sell your personal data. We share data only with:</p>
        <UL items={[
          "Payment processors and KYC providers (to complete transactions).",
          "Regulators and law enforcement when legally required.",
          "Service providers under strict confidentiality agreements.",
        ]} />
      </>
    )},
    { id: "cookies", title: "Cookies & Tracking", body: (
      <p>FullPlay uses cookies and similar technologies to keep you logged in, remember preferences, and measure platform performance. You can manage cookie preferences in your browser at any time.</p>
    )},
    { id: "security", title: "Data Security", body: (
      <UL items={[
        "All data in transit is encrypted with TLS 1.3.",
        "Sensitive data at rest is encrypted with AES-256.",
        "Access to personal data is restricted to authorised staff on a need-to-know basis.",
        "Regular security audits and penetration testing.",
      ]} />
    )},
    { id: "retention", title: "Data Retention", body: (
      <p>We keep your data while your account is active and for up to 7 years afterwards, as required by gaming, tax, and anti-money-laundering regulations. After this period, data is securely deleted or anonymised.</p>
    )},
    { id: "rights", title: "Your Rights", body: (
      <UL items={[
        "Access — request a copy of the personal data we hold.",
        "Correction — ask us to fix inaccurate data.",
        "Deletion — request erasure where legally possible.",
        "Restriction / objection — limit how we use your data.",
        "Portability — receive your data in a machine-readable format.",
        "Withdraw consent for marketing at any time.",
      ]} />
    )},
    { id: "minors", title: "Minors", body: (
      <p>FullPlay is strictly 18+. We do not knowingly collect data from anyone under 18. If we learn that a minor has registered, we will close the account immediately and delete the data.</p>
    )},
    { id: "changes", title: "Changes to This Policy", body: (
      <p>We may update this Privacy Policy as our services or the law evolve. The latest version is always available on this page; significant changes will be notified by email or in-app.</p>
    )},
    { id: "contact", title: "Contact Us", body: (
      <UL items={[
        "Privacy enquiries: privacy@fullplay.app",
        "General support: support@fullplay.app",
        "Live Chat available 24/7 inside the app.",
      ]} />
    )},
  ];

  return (
    <LegalLayout
      eyebrow="PRIVACY"
      title="Privacy Policy"
      intro="Your trust matters. Here is exactly what data we collect, why we collect it, and the control you have over it."
      updated="May 24, 2026"
      sections={sections}
    />
  );
}