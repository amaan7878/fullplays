import { createFileRoute, Link } from "@tanstack/react-router";
import logo from "@/assets/fullplay-mark.png";
import { useState } from "react";
import { ChevronLeft, Mail, MessageSquare, Send, Clock, MessagesSquare } from "lucide-react";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact Us — FullPlay" },
      { name: "description", content: "Get in touch with FullPlay support — email, live chat, Discord, Telegram, and contact form." },
    ],
  }),
  component: ContactPage,
});

function ContactPage() {
  const [sent, setSent] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });

  const channels = [
    { icon: Mail, title: "Email", desc: "support@fullplay.app", action: "mailto:support@fullplay.app", color: "from-blue-500 to-indigo-500" },
    { icon: MessageSquare, title: "Live Chat", desc: "Open in-app, bottom right", action: "#", color: "from-emerald-500 to-teal-500" },
    { icon: MessagesSquare, title: "Discord", desc: "discord.gg/fullplay (coming soon)", action: "#", color: "from-violet-500 to-purple-500" },
    { icon: Send, title: "Telegram", desc: "t.me/fullplay (coming soon)", action: "#", color: "from-sky-500 to-cyan-500" },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="border-b border-border bg-surface/60 backdrop-blur sticky top-0 z-30">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 h-14 sm:h-16 flex items-center justify-between gap-3">
          <Link to="/" className="flex items-center gap-1">
            <img src={logo} alt="FullPlay" className="h-14 w-14 object-contain drop-shadow-[0_0_8px_rgba(168,85,247,0.22)]" />
            <div className="text-xl sm:text-2xl font-extrabold leading-none tracking-tight -ml-0.5 sm:-ml-1">FULL<span className="text-gradient-hero">PLAY</span></div>
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
          <span className="inline-block text-[10px] tracking-[0.25em] font-semibold border border-primary/40 text-primary px-2.5 py-1 rounded-md bg-surface/80 backdrop-blur">CONTACT</span>
          <h1 className="mt-4 text-3xl sm:text-5xl font-extrabold tracking-tight">
            <span className="text-gradient-hero">Get in touch</span>
          </h1>
          <p className="mt-3 max-w-xl text-sm sm:text-base text-muted-foreground">Pick a channel below or drop us a message — our team replies fast, 24/7.</p>
        </div>
      </section>

      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 py-10 grid lg:grid-cols-[1fr_380px] gap-6 lg:gap-10">
        <div>
          <div className="grid sm:grid-cols-2 gap-3 sm:gap-4">
            {channels.map(({ icon: I, title, desc, action, color }) => (
              <a key={title} href={action} className="group relative overflow-hidden rounded-2xl border border-border bg-surface p-5 hover:border-primary hover:-translate-y-1 transition-all">
                <div className={`absolute -top-10 -right-10 w-32 h-32 rounded-full bg-gradient-to-br ${color} opacity-20 blur-2xl group-hover:opacity-40 transition`} />
                <div className={`relative w-11 h-11 rounded-xl bg-gradient-to-br ${color} grid place-items-center shadow-glow`}>
                  <I className="w-5 h-5 text-white" />
                </div>
                <h3 className="relative mt-3 font-extrabold tracking-tight">{title}</h3>
                <p className="relative mt-1 text-xs sm:text-sm text-muted-foreground">{desc}</p>
              </a>
            ))}
          </div>

          <div className="mt-6 rounded-2xl border border-border bg-surface p-5 sm:p-6">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-9 h-9 rounded-lg bg-gradient-primary grid place-items-center shadow-glow">
                <Send className="w-4 h-4 text-white" />
              </div>
              <h3 className="font-extrabold tracking-tight">Send us a message</h3>
            </div>
            {sent ? (
              <div className="rounded-xl border border-emerald-500/40 bg-emerald-500/10 p-4 text-sm text-emerald-300">
                Thanks! Your message has been received. We'll reply within an hour.
              </div>
            ) : (
              <form
                onSubmit={(e) => { e.preventDefault(); setSent(true); }}
                className="space-y-3"
              >
                <div className="grid sm:grid-cols-2 gap-3">
                  <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder="Your name"
                    className="h-11 px-4 rounded-lg bg-surface-2 border border-border focus:border-primary outline-none text-sm" />
                  <input required type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })}
                    placeholder="Email address"
                    className="h-11 px-4 rounded-lg bg-surface-2 border border-border focus:border-primary outline-none text-sm" />
                </div>
                <input required value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })}
                  placeholder="Subject"
                  className="w-full h-11 px-4 rounded-lg bg-surface-2 border border-border focus:border-primary outline-none text-sm" />
                <textarea required value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })}
                  placeholder="How can we help?" rows={6}
                  className="w-full p-4 rounded-lg bg-surface-2 border border-border focus:border-primary outline-none text-sm resize-none" />
                <button type="submit" className="h-11 px-6 rounded-xl bg-gradient-primary text-primary-foreground font-bold text-sm shadow-glow flex items-center gap-2 hover:-translate-y-0.5 transition">
                  Send Message <Send className="w-4 h-4" />
                </button>
              </form>
            )}
          </div>
        </div>

        <aside className="space-y-4">
          <div className="rounded-2xl border border-border bg-surface p-5">
            <div className="flex items-center gap-2 mb-3">
              <Clock className="w-4 h-4 text-primary" />
              <h3 className="font-extrabold tracking-tight text-sm">Response Times</h3>
            </div>
            <ul className="space-y-2.5 text-sm">
              <li className="flex items-center justify-between"><span className="text-muted-foreground">Live Chat</span><span className="font-semibold text-emerald-400">&lt; 2 min</span></li>
              <li className="flex items-center justify-between"><span className="text-muted-foreground">Email</span><span className="font-semibold text-amber-300">&lt; 1 hour</span></li>
              <li className="flex items-center justify-between"><span className="text-muted-foreground">Social</span><span className="font-semibold text-blue-300">&lt; 3 hours</span></li>
              <li className="flex items-center justify-between"><span className="text-muted-foreground">KYC review</span><span className="font-semibold text-violet-300">&lt; 24 hours</span></li>
            </ul>
          </div>
          <div className="rounded-2xl bg-gradient-primary p-5 shadow-glow text-primary-foreground">
            <div className="text-[10px] tracking-[0.25em] font-semibold opacity-90">24 / 7 / 365</div>
            <h3 className="mt-1 text-xl font-extrabold">We never sleep.</h3>
            <p className="mt-1 text-sm opacity-90">Our support team is online every hour of every day — even Diwali, even 3 AM.</p>
          </div>
        </aside>
      </div>
    </div>
  );
}