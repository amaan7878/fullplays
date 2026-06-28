import { createFileRoute, Link } from "@tanstack/react-router";
import {
  useRef, useState, useEffect, useCallback, useMemo,
  type TouchEvent as ReactTouchEvent,
} from "react";
import type { LucideProps } from "lucide-react"; // FIX(minor): tighter icon type
import {
  ChevronLeft, Heart, MessageCircle, Send, Bookmark,
  Plus, Search, MoreHorizontal, Home, Compass,
  User as UserIcon, X, ChevronRight, Smile, ArrowUp,
  Edit, Check, Users, Inbox, CheckCheck, Grid, Award,
  TrendingUp, Star,
} from "lucide-react";
import fullplayMark from "@/assets/fullplay-mark.png";

export const Route = createFileRoute("/community")({
  head: () => ({
    meta: [
      { title: "Community — FullPlay" },
      { name: "description", content: "FullPlay community feed." },
    ],
  }),
  component: CommunityPage,
});

// ─── Types ────────────────────────────────────────────────────────────────────

type Comment = {
  id: number; user: string; avatarColor: string;
  text: string; time: string; likes: number; liked?: boolean;
};

type Post = {
  id: number; user: string; avatarColor: string; verified?: boolean;
  time: string; location?: string; gradient: string;
  badge?: { label: string; tone: string };
  caption: string; likes: number; comments: number;
  liked?: boolean; saved?: boolean; commentList: Comment[];
};

type Story = {
  name: string; color: string; isYou?: boolean; seen?: boolean; isFollowing?: boolean;
  content: { type: "gradient"; gradient: string; label: string; sub: string };
};

type ChatMsg = { id: number; from: "me" | "them"; text: string; time: string; read?: boolean };

type Chat = {
  id: number; user: string; color: string; online?: boolean;
  lastMsg: string; lastTime: string; unread?: number; verified?: boolean;
  messages: ChatMsg[];
};

type ActiveView = "feed" | "saved" | "likes" | "profile" | "explore";

// FIX(minor): proper LucideIcon type instead of React.ComponentType<{className?:string}>
type LucideIcon = React.ComponentType<LucideProps>;

// ─── Mock Data ────────────────────────────────────────────────────────────────

const STORIES_DATA: Story[] = [
  {
    name: "Your Story", color: "from-violet-500 to-pink-500", isYou: true, seen: false, isFollowing: true,
    content: { type: "gradient", gradient: "from-violet-600 to-pink-600", label: "Your Story", sub: "Tap to add" },
  },
  {
    name: "rajat_07", color: "from-amber-400 to-rose-500", seen: false, isFollowing: true,
    content: { type: "gradient", gradient: "from-emerald-500 via-teal-500 to-cyan-500", label: "rajat_07", sub: "₹4.2L win on Plinko 🔥" },
  },
  {
    name: "minesqueen", color: "from-emerald-400 to-cyan-500", seen: false, isFollowing: true,
    content: { type: "gradient", gradient: "from-red-500 via-rose-500 to-pink-500", label: "minesqueen", sub: "14-day streak proof 📊" },
  },
  {
    name: "crashking", color: "from-violet-500 to-fuchsia-500", seen: true, isFollowing: true,
    content: { type: "gradient", gradient: "from-violet-600 via-fuchsia-500 to-pink-500", label: "crashking", sub: "120x moment, no regrets" },
  },
  {
    name: "dragonfan", color: "from-orange-500 to-red-500", seen: false, isFollowing: true,
    content: { type: "gradient", gradient: "from-rose-500 via-red-500 to-orange-500", label: "dragonfan", sub: "8 Dragon wins 🐉" },
  },
  {
    name: "plinkogod", color: "from-blue-500 to-indigo-500", seen: false, isFollowing: false,
    content: { type: "gradient", gradient: "from-blue-600 to-indigo-600", label: "plinkogod", sub: "New strategy drop" },
  },
  {
    name: "newbie_nina", color: "from-pink-500 to-rose-500", seen: false, isFollowing: false,
    content: { type: "gradient", gradient: "from-pink-500 to-rose-500", label: "newbie_nina", sub: "First week on FullPlay!" },
  },
  {
    name: "wheelwarrior", color: "from-amber-500 to-yellow-500", seen: false, isFollowing: false,
    content: { type: "gradient", gradient: "from-amber-500 to-yellow-400", label: "wheelwarrior", sub: "Spin compilation 🎡" },
  },
  {
    name: "hiloqueen", color: "from-teal-500 to-emerald-500", seen: false, isFollowing: false,
    content: { type: "gradient", gradient: "from-teal-600 to-emerald-500", label: "hiloqueen", sub: "Hi-Lo god mode 📈" },
  },
];

const INITIAL_POSTS: Post[] = [
  {
    id: 1, user: "rajat_07", avatarColor: "from-amber-400 to-rose-500", verified: true,
    time: "2h", location: "Plinko Floor",
    gradient: "from-emerald-500 via-teal-500 to-cyan-500",
    badge: { label: "₹4,20,000 WIN", tone: "bg-emerald-500" },
    caption: "₹500 → ₹4.2L on Plinko tonight. Withdrew to UPI in 28 seconds. Still shaking. 😭🔥",
    likes: 2847, comments: 3, liked: false, saved: false,
    commentList: [
      { id: 1, user: "minesqueen", avatarColor: "from-emerald-400 to-cyan-500", text: "BRO this is insane 😭 what multiplier??", time: "1h", likes: 142, liked: false },
      { id: 2, user: "crashking", avatarColor: "from-violet-500 to-fuchsia-500", text: "Plinko is so underrated fr", time: "45m", likes: 88, liked: true },
      { id: 3, user: "plinkogod", avatarColor: "from-blue-500 to-indigo-500", text: "My 3-hour tutorial series finally paying off 🙏", time: "30m", likes: 211, liked: false },
    ],
  },
  {
    id: 2, user: "minesqueen", avatarColor: "from-emerald-400 to-cyan-500",
    time: "5h", location: "Stake Mines",
    gradient: "from-red-500 via-rose-500 to-pink-500",
    badge: { label: "14-DAY STREAK", tone: "bg-violet-500" },
    caption: "The 3-gem cash-out rule is the only way. Two weeks of data — link in bio.",
    likes: 1532, comments: 2, liked: false, saved: true,
    commentList: [
      { id: 1, user: "dragonfan", avatarColor: "from-orange-500 to-red-500", text: "Actually testing this today. Will report back 🫡", time: "4h", likes: 67, liked: false },
      { id: 2, user: "wheelwarrior", avatarColor: "from-amber-500 to-yellow-500", text: "Two weeks of data is WILD dedication", time: "3h", likes: 44, liked: false },
    ],
  },
  {
    id: 3, user: "crashking", avatarColor: "from-violet-500 to-fuchsia-500", verified: true,
    time: "8h", gradient: "from-violet-600 via-fuchsia-500 to-pink-500",
    badge: { label: "120.45x", tone: "bg-amber-500" },
    caption: "Caught the moon on Crash. Auto cash-out at 1.5x is for cowards. 🚀",
    likes: 921, comments: 2, liked: true, saved: false,
    commentList: [
      { id: 1, user: "rajat_07", avatarColor: "from-amber-400 to-rose-500", text: "okay 120x is actually criminal 💀", time: "7h", likes: 312, liked: false },
      { id: 2, user: "newbie_nina", avatarColor: "from-pink-500 to-rose-500", text: "How do you hold your nerves past 10x?? 😰", time: "6h", likes: 29, liked: false },
    ],
  },
  {
    id: 4, user: "dragonfan", avatarColor: "from-orange-500 to-red-500",
    time: "1d", location: "Dragon & Tiger",
    gradient: "from-rose-500 via-red-500 to-orange-500",
    badge: { label: "8 STREAK", tone: "bg-red-500" },
    caption: "Eight Dragon wins in a row. Tell me that's not destiny.",
    likes: 488, comments: 2, liked: false, saved: false,
    commentList: [
      { id: 1, user: "minesqueen", avatarColor: "from-emerald-400 to-cyan-500", text: "That is literally just luck bro 😭", time: "22h", likes: 55, liked: false },
      { id: 2, user: "crashking", avatarColor: "from-violet-500 to-fuchsia-500", text: "The universe speaking fr 🐉", time: "20h", likes: 78, liked: false },
    ],
  },
];

const INITIAL_CHATS: Chat[] = [
  {
    id: 1, user: "rajat_07", color: "from-amber-400 to-rose-500", online: true, verified: true,
    lastMsg: "bhai ₹4.2L nikaal liya aaj 🔥", lastTime: "2m", unread: 3,
    messages: [
      { id: 1, from: "them", text: "bhai ₹4.2L nikaal liya aaj 🔥", time: "2m" },
      { id: 2, from: "them", text: "plinko pe ek hi round mein", time: "2m" },
      { id: 3, from: "them", text: "still shaking ngl", time: "1m" },
    ],
  },
  {
    id: 2, user: "minesqueen", color: "from-emerald-400 to-cyan-500", online: true,
    lastMsg: "3-gem rule is undefeated trust me", lastTime: "15m", unread: 1,
    messages: [
      { id: 1, from: "me", text: "bro your mines strategy actually works", time: "20m", read: true },
      { id: 2, from: "them", text: "3-gem rule is undefeated trust me", time: "15m" },
    ],
  },
  {
    id: 3, user: "crashking", color: "from-violet-500 to-fuchsia-500",
    lastMsg: "You: legend 🫡", lastTime: "1h",
    messages: [
      { id: 1, from: "them", text: "120x was not planned I won't lie", time: "2h" },
      { id: 2, from: "me", text: "legend 🫡", time: "1h", read: true },
    ],
  },
  {
    id: 4, user: "dragonfan", color: "from-orange-500 to-red-500",
    lastMsg: "8 streak bro believe it", lastTime: "1d",
    messages: [
      { id: 1, from: "them", text: "8 streak bro believe it", time: "1d" },
    ],
  },
  {
    id: 5, user: "plinkogod", color: "from-blue-500 to-indigo-500",
    lastMsg: "new strategy vid dropping tmrw", lastTime: "2d",
    messages: [
      { id: 1, from: "them", text: "new strategy vid dropping tmrw", time: "2d" },
    ],
  },
];

const REQUESTS: { user: string; color: string; mutual: string }[] = [
  { user: "dicelord99", color: "from-violet-500 to-purple-500", mutual: "Followed by crashking" },
  { user: "spinmaster", color: "from-rose-500 to-pink-500", mutual: "Followed by rajat_07" },
  { user: "hiloking", color: "from-cyan-500 to-blue-500", mutual: "New to FullPlay" },
];

const COMMUNITY_MSGS = [
  { user: "rajat_07", color: "from-amber-400 to-rose-500", text: "Anyone else on Plinko rn? Let's grind 🔥", time: "5m" },
  { user: "minesqueen", color: "from-emerald-400 to-cyan-500", text: "Mines strat thread — drop your best tips below 👇", time: "12m" },
  { user: "crashking", color: "from-violet-500 to-fuchsia-500", text: "Crash is wild tonight. Stay safe out there frfr", time: "28m" },
  { user: "newbie_nina", color: "from-pink-500 to-rose-500", text: "Just joined FullPlay today! Any tips for beginners? 🙏", time: "45m" },
  { user: "plinkogod", color: "from-blue-500 to-indigo-500", text: "My new tutorial is up. Link in bio, go watch it 💯", time: "1h" },
];

const TRENDING = [
  { tag: "#PlinkoNight", count: "12.4k posts" },
  { tag: "#CrashGodMode", count: "8.1k posts" },
  { tag: "#MinesStrategy", count: "5.7k posts" },
  { tag: "#BigWins2026", count: "3.2k posts" },
];

const EXPLORE_POSTS = [
  { id: 101, gradient: "from-violet-600 to-indigo-600", badge: "₹2.1L", user: "spinmaster" },
  { id: 102, gradient: "from-rose-500 to-pink-500", badge: "22x", user: "hiloking" },
  { id: 103, gradient: "from-amber-400 to-orange-500", badge: "🔥 HOT", user: "dicelord99" },
  { id: 104, gradient: "from-teal-500 to-cyan-500", badge: "10-STREAK", user: "wheelwarrior" },
  { id: 105, gradient: "from-fuchsia-500 to-purple-600", badge: "₹88k", user: "plinkogod" },
  { id: 106, gradient: "from-emerald-500 to-green-600", badge: "7-GEM", user: "minesqueen" },
  { id: 107, gradient: "from-red-500 to-rose-600", badge: "50x", user: "crashking" },
  { id: 108, gradient: "from-blue-500 to-indigo-600", badge: "₹3.7L", user: "rajat_07" },
  { id: 109, gradient: "from-yellow-400 to-amber-500", badge: "DRAGON", user: "dragonfan" },
];

const MY_POSTS: Post[] = [
  {
    id: 201, user: "you_player", avatarColor: "from-violet-500 to-pink-500",
    time: "3d", location: "Plinko Floor",
    gradient: "from-violet-500 via-fuchsia-500 to-pink-500",
    badge: { label: "₹12,000 WIN", tone: "bg-violet-500" },
    caption: "Finally cracked the Plinko pattern. ₹500 in, ₹12k out. Not stopping 🎯",
    likes: 312, comments: 1, liked: false, saved: false,
    commentList: [
      { id: 1, user: "rajat_07", avatarColor: "from-amber-400 to-rose-500", text: "Let's gooo bhai!! 🔥", time: "3d", likes: 44, liked: false },
    ],
  },
  {
    id: 202, user: "you_player", avatarColor: "from-violet-500 to-pink-500",
    time: "1w", location: "Mines",
    gradient: "from-indigo-500 via-blue-500 to-cyan-500",
    badge: { label: "5-GEM", tone: "bg-blue-500" },
    caption: "5 gem mines cash-out, stress levels through the roof 😅",
    likes: 189, comments: 0, liked: false, saved: false,
    commentList: [],
  },
];

function sortedStories(stories: Story[]): Story[] {
  const you = stories.filter((s) => s.isYou);
  const followedUnseen = stories.filter((s) => !s.isYou && s.isFollowing && !s.seen);
  const followedSeen = stories.filter((s) => !s.isYou && s.isFollowing && s.seen);
  const suggested = stories.filter((s) => !s.isYou && !s.isFollowing);
  return [...you, ...followedUnseen, ...followedSeen, ...suggested];
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

const fmt = (n: number) => (n >= 1000 ? `${(n / 1000).toFixed(1)}k` : `${n}`);

function AvatarCircle({
  name, color, size = "md", ring = false, online = false,
}: {
  name: string; color: string; size?: "xs" | "sm" | "md" | "lg" | "xl";
  ring?: boolean; online?: boolean;
}) {
  const sz = { xs: "w-6 h-6 text-[9px]", sm: "w-7 h-7 text-[10px]", md: "w-9 h-9 text-xs", lg: "w-11 h-11 text-sm", xl: "w-16 h-16 text-lg" };
  return (
    <div className={`relative ${sz[size]} rounded-full p-[2px] shrink-0 ${ring ? `bg-gradient-to-tr ${color}` : "bg-transparent"}`}>
      <div className={`w-full h-full rounded-full ${ring ? "bg-background p-[2px]" : ""}`}>
        <div className={`w-full h-full rounded-full bg-gradient-to-br ${color} grid place-items-center text-white font-extrabold`}>
          {name[0].toUpperCase()}
        </div>
      </div>
      {online && <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 border-2 border-surface" />}
    </div>
  );
}

// ─── Story Viewer ─────────────────────────────────────────────────────────────

function StoryViewer({
  stories, startIndex, onClose, onMarkSeen,
}: {
  stories: Story[]; startIndex: number;
  onClose: () => void; onMarkSeen: (index: number) => void;
}) {
  const [current, setCurrent] = useState(startIndex);
  const [progress, setProgress] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const markedRef = useRef<Set<number>>(new Set());
  const DURATION = 5000;

  useEffect(() => {
    if (!markedRef.current.has(current)) {
      markedRef.current.add(current);
      onMarkSeen(current);
    }
  }, [current, onMarkSeen]);

  // FIX(major): goNext no longer depends on `stories` from parent's sorted memo —
  // capture length once via ref so the callback stays stable and doesn't cause
  // the progress interval to restart on every story-state change.
  const storiesLengthRef = useRef(stories.length);
  useEffect(() => { storiesLengthRef.current = stories.length; }, [stories.length]);

  const goNext = useCallback(() => {
    setCurrent((c) => {
      if (c < storiesLengthRef.current - 1) { setProgress(0); return c + 1; }
      onClose(); return c;
    });
  }, [onClose]);

  const goPrev = () => { if (current > 0) { setCurrent((c) => c - 1); setProgress(0); } };

  useEffect(() => {
    setProgress(0);
    intervalRef.current = setInterval(() => {
      setProgress((p) => { if (p >= 100) { goNext(); return 0; } return p + 100 / (DURATION / 100); });
    }, 100);
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [current, goNext]);

  useEffect(() => {
    const h = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [onClose]);

  const story = stories[current];
  return (
    <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center">
      <div className="relative w-full max-w-sm h-full sm:h-[680px] sm:rounded-2xl overflow-hidden">
        <div className={`absolute inset-0 bg-gradient-to-br ${story.content.gradient}`} />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.15),transparent_60%)]" />
        <div className="absolute top-3 inset-x-3 flex gap-1 z-10">
          {stories.map((_, i) => (
            <div key={i} className="flex-1 h-0.5 rounded-full bg-white/30 overflow-hidden">
              <div className="h-full bg-white rounded-full" style={{ width: i < current ? "100%" : i === current ? `${progress}%` : "0%" }} />
            </div>
          ))}
        </div>
        <div className="absolute top-7 inset-x-3 z-10 flex items-center gap-2.5">
          <AvatarCircle name={story.name} color={story.color} size="sm" />
          <div className="flex-1 min-w-0">
            <div className="text-sm font-bold text-white truncate">{story.name}</div>
            <div className="text-[11px] text-white/60">just now</div>
          </div>
          {!story.isFollowing && !story.isYou && (
            <button className="text-xs font-bold text-white border border-white/40 px-3 py-1 rounded-full hover:bg-white/10 transition">Follow</button>
          )}
          <button onClick={onClose} className="w-7 h-7 grid place-items-center rounded-full hover:bg-white/10 transition">
            <X className="w-4 h-4 text-white" />
          </button>
        </div>
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 pointer-events-none">
          <div className="text-white font-extrabold text-2xl drop-shadow-lg">{story.content.label}</div>
          <div className="text-white/80 text-sm">{story.content.sub}</div>
          {!story.isFollowing && !story.isYou && (
            <div className="mt-1 text-[11px] text-white/50 bg-white/10 px-3 py-1 rounded-full">Suggested</div>
          )}
        </div>
        <div className="absolute inset-0 flex">
          <button className="flex-1 h-full" onClick={goPrev} />
          <button className="flex-1 h-full" onClick={goNext} />
        </div>
        {current > 0 && (
          <button onClick={goPrev} className="hidden sm:grid absolute left-3 top-1/2 -translate-y-1/2 w-7 h-7 place-items-center rounded-full bg-black/40 hover:bg-black/60 transition z-20">
            <ChevronLeft className="w-4 h-4 text-white" />
          </button>
        )}
        {current < stories.length - 1 && (
          <button onClick={goNext} className="hidden sm:grid absolute right-3 top-1/2 -translate-y-1/2 w-7 h-7 place-items-center rounded-full bg-black/40 hover:bg-black/60 transition z-20">
            <ChevronRight className="w-4 h-4 text-white" />
          </button>
        )}
        <div className="absolute bottom-6 inset-x-4 z-10">
          <div className="flex items-center gap-2 bg-white/10 backdrop-blur border border-white/20 rounded-full px-4 h-10">
            <input className="flex-1 bg-transparent text-white placeholder-white/50 text-sm outline-none" placeholder={`Reply to ${story.name}…`} />
          </div>
        </div>
      </div>
      <button className="absolute inset-0 -z-10" onClick={onClose} />
    </div>
  );
}

// ─── Comment Sheet ────────────────────────────────────────────────────────────

function CommentSheet({ post, onClose, onUpdate }: {
  post: Post; onClose: () => void;
  onUpdate: (id: number, c: Comment[]) => void;
}) {
  const [text, setText] = useState("");
  const [comments, setComments] = useState<Comment[]>(post.commentList);
  const inputRef = useRef<HTMLInputElement>(null);
  useEffect(() => { setTimeout(() => inputRef.current?.focus(), 300); }, []);
  useEffect(() => {
    const h = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [onClose]);

  const submit = () => {
    if (!text.trim()) return;
    const c: Comment = { id: Date.now(), user: "you_player", avatarColor: "from-violet-500 to-pink-500", text: text.trim(), time: "now", likes: 0 };
    const updated = [...comments, c];
    setComments(updated); onUpdate(post.id, updated); setText("");
  };

  const toggleLike = (id: number) => {
    setComments((cs) => cs.map((c) => c.id === id ? { ...c, liked: !c.liked, likes: c.likes + (c.liked ? -1 : 1) } : c));
  };

  return (
    <>
      <button className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="fixed bottom-0 inset-x-0 z-50 sm:left-1/2 sm:-translate-x-1/2 sm:max-w-md sm:bottom-6 sm:rounded-2xl rounded-t-2xl bg-surface border border-border shadow-2xl flex flex-col" style={{ maxHeight: "75vh" }}>
        <div className="flex justify-center pt-3 pb-1 shrink-0"><div className="w-10 h-1 rounded-full bg-border" /></div>
        <div className="flex items-center justify-between px-5 py-3 border-b border-border shrink-0">
          {/* FIX(minor): derive count from commentList.length, not the stale post.comments number */}
          <span className="font-bold text-sm">{comments.length} comments</span>
          <button onClick={onClose} className="w-7 h-7 grid place-items-center rounded-full hover:bg-surface-2 transition"><X className="w-4 h-4 text-muted-foreground" /></button>
        </div>
        <div className="overflow-y-auto flex-1 px-5 py-3 space-y-5">
          {comments.map((c) => (
            <div key={c.id} className="flex gap-3">
              <AvatarCircle name={c.user} color={c.avatarColor} size="sm" />
              <div className="flex-1 min-w-0">
                <div className="text-sm"><span className="font-bold mr-2">{c.user}</span>{c.text}</div>
                <div className="flex items-center gap-3 mt-1.5">
                  <span className="text-[11px] text-muted-foreground">{c.time}</span>
                  <button className="text-[11px] text-muted-foreground font-semibold hover:text-foreground">Reply</button>
                  <button onClick={() => toggleLike(c.id)} className="flex items-center gap-1 ml-auto">
                    <Heart className={`w-3.5 h-3.5 ${c.liked ? "fill-red-500 text-red-500" : "text-muted-foreground"}`} />
                    {c.likes > 0 && <span className="text-[11px] text-muted-foreground">{c.likes}</span>}
                  </button>
                </div>
              </div>
            </div>
          ))}
          {comments.length === 0 && <div className="py-8 text-center text-sm text-muted-foreground">No comments yet. Be first!</div>}
        </div>
        <div className="border-t border-border px-4 py-3 flex items-center gap-3 shrink-0 bg-surface">
          <AvatarCircle name="you_player" color="from-violet-500 to-pink-500" size="sm" />
          <div className="flex-1 flex items-center gap-2 bg-surface-2 rounded-full px-4 h-9 border border-border">
            <input ref={inputRef} value={text} onChange={(e) => setText(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter") submit(); }} placeholder="Add a comment…" className="flex-1 bg-transparent text-sm outline-none placeholder-muted-foreground" />
            <Smile className="w-4 h-4 text-muted-foreground" />
          </div>
          <button onClick={submit} disabled={!text.trim()} className="w-8 h-8 rounded-full bg-gradient-primary grid place-items-center disabled:opacity-30 transition shadow-glow">
            <ArrowUp className="w-4 h-4 text-white" />
          </button>
        </div>
      </div>
    </>
  );
}

// ─── Chat Drawer ──────────────────────────────────────────────────────────────

// FIX(major): ChatDrawer now accepts chats + setChats as props so the parent's
// chat state is the single source of truth. totalUnread in the header/nav badge
// always reflects real-time unread counts rather than the frozen INITIAL_CHATS constant.
function ChatDrawer({
  chats, setChats, onClose,
}: {
  chats: Chat[];
  setChats: React.Dispatch<React.SetStateAction<Chat[]>>;
  onClose: () => void;
}) {
  const [tab, setTab] = useState<"chats" | "community" | "requests">("chats");
  const [openChat, setOpenChat] = useState<Chat | null>(null);
  const [msgText, setMsgText] = useState("");
  const [search, setSearch] = useState("");
  const msgEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => { msgEndRef.current?.scrollIntoView({ behavior: "smooth" }); }, [openChat?.messages]);
  useEffect(() => {
    const h = (e: KeyboardEvent) => { if (e.key === "Escape") { if (openChat) setOpenChat(null); else onClose(); } };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [openChat, onClose]);

  const sendMsg = () => {
    if (!msgText.trim() || !openChat) return;
    const newMsg: ChatMsg = { id: Date.now(), from: "me", text: msgText.trim(), time: "now", read: false };
    // FIX(minor): update state once, then derive openChat from the result to
    // avoid the stale-closure pattern of calling find() on a local variable.
    setChats((prev) => {
      const next = prev.map((c) =>
        c.id === openChat.id
          ? { ...c, messages: [...c.messages, newMsg], lastMsg: `You: ${msgText.trim()}`, lastTime: "now", unread: 0 }
          : c
      );
      const updated = next.find((c) => c.id === openChat.id) ?? null;
      setOpenChat(updated);
      return next;
    });
    setMsgText("");
  };

  const openChatHandler = (chat: Chat) => {
    setOpenChat(chat);
    setChats((cs) => cs.map((c) => c.id === chat.id ? { ...c, unread: 0 } : c));
  };

  const filtered = chats.filter((c) => c.user.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="fixed inset-0 z-50 flex items-stretch justify-end">
      <button className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative z-10 w-full max-w-[420px] h-full bg-surface border-l border-border flex flex-col shadow-2xl animate-in slide-in-from-right duration-200">
        {openChat ? (
          <>
            <div className="flex items-center gap-3 px-4 h-14 border-b border-border shrink-0">
              <button onClick={() => setOpenChat(null)} className="w-8 h-8 grid place-items-center rounded-lg hover:bg-surface-2 transition">
                <ChevronLeft className="w-5 h-5" />
              </button>
              <AvatarCircle name={openChat.user} color={openChat.color} size="sm" online={openChat.online} />
              <div className="flex-1 min-w-0">
                <div className="text-sm font-bold truncate">{openChat.user}</div>
                <div className="text-[11px] text-muted-foreground">{openChat.online ? "Online now" : "Last seen recently"}</div>
              </div>
              <button onClick={onClose} className="w-8 h-8 grid place-items-center rounded-lg hover:bg-surface-2 transition">
                <X className="w-4 h-4 text-muted-foreground" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto px-4 py-4 space-y-2">
              {openChat.messages.map((m) => (
                <div key={m.id} className={`flex ${m.from === "me" ? "justify-end" : "justify-start"}`}>
                  <div className={`max-w-[75%] px-3.5 py-2 rounded-2xl text-sm leading-relaxed ${m.from === "me" ? "bg-gradient-primary text-white rounded-br-sm" : "bg-surface-2 text-foreground rounded-bl-sm"}`}>
                    {m.text}
                    <div className={`text-[10px] mt-1 flex items-center gap-1 ${m.from === "me" ? "text-white/60 justify-end" : "text-muted-foreground"}`}>
                      {m.time}
                      {m.from === "me" && (m.read ? <CheckCheck className="w-3 h-3" /> : <Check className="w-3 h-3" />)}
                    </div>
                  </div>
                </div>
              ))}
              <div ref={msgEndRef} />
            </div>
            <div className="border-t border-border px-4 py-3 flex items-center gap-2 shrink-0 bg-surface">
              <div className="flex-1 flex items-center gap-2 bg-surface-2 rounded-full px-4 h-10 border border-border">
                <input value={msgText} onChange={(e) => setMsgText(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter") sendMsg(); }} placeholder={`Message ${openChat.user}…`} className="flex-1 bg-transparent text-sm outline-none placeholder-muted-foreground" autoFocus />
                <Smile className="w-4 h-4 text-muted-foreground shrink-0" />
              </div>
              <button onClick={sendMsg} disabled={!msgText.trim()} className="w-9 h-9 rounded-full bg-gradient-primary grid place-items-center disabled:opacity-30 transition shadow-glow shrink-0">
                <Send className="w-4 h-4 text-white" />
              </button>
            </div>
          </>
        ) : (
          <>
            <div className="px-4 pt-4 pb-3 border-b border-border shrink-0 space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-extrabold text-lg">Messages</span>
                <div className="flex items-center gap-1">
                  <button className="w-8 h-8 grid place-items-center rounded-lg hover:bg-surface-2 transition"><Edit className="w-4 h-4" /></button>
                  <button onClick={onClose} className="w-8 h-8 grid place-items-center rounded-lg hover:bg-surface-2 transition"><X className="w-4 h-4 text-muted-foreground" /></button>
                </div>
              </div>
              <div className="relative">
                <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
                <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search messages…" className="w-full h-8 pl-9 pr-3 rounded-lg bg-surface-2 border border-border text-sm outline-none focus:border-primary transition" />
              </div>
              <div className="flex gap-1 bg-surface-2 rounded-xl p-1">
                {(["chats", "community", "requests"] as const).map((t) => (
                  <button key={t} onClick={() => setTab(t)} className={`flex-1 h-7 rounded-lg text-xs font-bold capitalize transition ${tab === t ? "bg-surface text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"}`}>
                    {t === "requests" && REQUESTS.length > 0
                      ? <span className="flex items-center justify-center gap-1">{t}<span className="w-4 h-4 rounded-full bg-primary text-primary-foreground text-[9px] grid place-items-center">{REQUESTS.length}</span></span>
                      : t}
                  </button>
                ))}
              </div>
            </div>
            {tab === "chats" && (
              <div className="flex-1 overflow-y-auto">
                {filtered.length === 0 && <div className="py-12 text-center text-sm text-muted-foreground">No chats found</div>}
                {filtered.map((chat) => (
                  <button key={chat.id} onClick={() => openChatHandler(chat)} className="w-full flex items-center gap-3 px-4 py-3 hover:bg-surface-2 transition text-left">
                    <AvatarCircle name={chat.user} color={chat.color} size="md" online={chat.online} />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-bold truncate">{chat.user}</span>
                        <span className="text-[11px] text-muted-foreground shrink-0 ml-2">{chat.lastTime}</span>
                      </div>
                      <div className="flex items-center justify-between mt-0.5">
                        <span className={`text-xs truncate ${chat.unread ? "text-foreground font-semibold" : "text-muted-foreground"}`}>{chat.lastMsg}</span>
                        {chat.unread ? <span className="ml-2 w-5 h-5 rounded-full bg-primary text-primary-foreground text-[10px] font-bold grid place-items-center shrink-0">{chat.unread}</span> : null}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            )}
            {tab === "community" && (
              <div className="flex-1 overflow-y-auto">
                <div className="px-4 py-3 border-b border-border">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-violet-500 to-pink-500 grid place-items-center shrink-0"><Users className="w-4 h-4 text-white" /></div>
                    <div><div className="text-sm font-bold">FullPlay Community</div><div className="text-[11px] text-muted-foreground">8.4k members</div></div>
                  </div>
                </div>
                <div className="divide-y divide-border">
                  {COMMUNITY_MSGS.map((m, i) => (
                    <div key={i} className="flex gap-3 px-4 py-3 hover:bg-surface-2 transition">
                      <AvatarCircle name={m.user} color={m.color} size="sm" />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold">{m.user}</span>
                          <span className="text-[10px] text-muted-foreground">{m.time}</span>
                        </div>
                        <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">{m.text}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {tab === "requests" && (
              <div className="flex-1 overflow-y-auto">
                <div className="px-4 py-3 border-b border-border"><p className="text-xs text-muted-foreground">{REQUESTS.length} message requests</p></div>
                {REQUESTS.map((r) => (
                  <div key={r.user} className="flex items-center gap-3 px-4 py-3 hover:bg-surface-2 transition">
                    <AvatarCircle name={r.user} color={r.color} size="md" />
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-bold truncate">{r.user}</div>
                      <div className="text-[11px] text-muted-foreground">{r.mutual}</div>
                    </div>
                    <div className="flex gap-1.5 shrink-0">
                      <button className="text-[11px] font-bold text-primary border border-primary/30 px-3 py-1 rounded-full hover:bg-primary/10 transition">Accept</button>
                      <button className="text-[11px] font-bold text-muted-foreground border border-border px-3 py-1 rounded-full hover:border-red-500/40 hover:text-red-400 transition">Decline</button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

// ─── Post Card ────────────────────────────────────────────────────────────────

function PostCard({ post, onLike, onSave, onOpenComments }: {
  post: Post; onLike: (id: number) => void;
  onSave: (id: number) => void; onOpenComments: (p: Post) => void;
}) {
  return (
    <li className="bg-surface sm:rounded-2xl sm:border sm:border-border overflow-hidden">
      <div className="flex items-center gap-3 px-4 py-3">
        <AvatarCircle name={post.user} color={post.avatarColor} size="md" ring />
        <div className="flex-1 min-w-0 leading-tight">
          <div className="flex items-center gap-1.5 text-sm font-bold">
            <span className="truncate">{post.user}</span>
            {post.verified && <span className="text-[10px] w-4 h-4 grid place-items-center rounded-full bg-primary text-primary-foreground font-extrabold shrink-0">✓</span>}
          </div>
          {post.location && <div className="text-[11px] text-muted-foreground truncate">{post.location}</div>}
        </div>
        <span className="text-[11px] text-muted-foreground shrink-0">{post.time} ago</span>
        <button className="w-8 h-8 grid place-items-center rounded-lg hover:bg-surface-2 transition"><MoreHorizontal className="w-5 h-5 text-muted-foreground" /></button>
      </div>
      <div className={`relative aspect-[5/4] bg-gradient-to-br ${post.gradient} overflow-hidden`}>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.18),transparent_60%)]" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
        {post.badge && <span className={`absolute top-3 left-3 ${post.badge.tone} text-white text-[10px] font-extrabold tracking-wider px-2.5 py-1 rounded-full shadow-lg`}>{post.badge.label}</span>}
        <div className="absolute bottom-3 right-3 text-[10px] font-bold text-white/70 tracking-wider">@{post.user}</div>
      </div>
      <div className="px-3 pt-3 flex items-center gap-0.5">
        <button onClick={() => onLike(post.id)} className="w-10 h-10 grid place-items-center rounded-lg hover:bg-surface-2 transition">
          <Heart className={`w-6 h-6 transition-all ${post.liked ? "fill-red-500 text-red-500 scale-110" : "text-foreground"}`} />
        </button>
        <button onClick={() => onOpenComments(post)} className="w-10 h-10 grid place-items-center rounded-lg hover:bg-surface-2 transition">
          <MessageCircle className="w-6 h-6" />
        </button>
        <button className="w-10 h-10 grid place-items-center rounded-lg hover:bg-surface-2 transition"><Send className="w-6 h-6" /></button>
        <button onClick={() => onSave(post.id)} className="ml-auto w-10 h-10 grid place-items-center rounded-lg hover:bg-surface-2 transition">
          <Bookmark className={`w-6 h-6 transition-all ${post.saved ? "fill-foreground text-foreground" : "text-foreground"}`} />
        </button>
      </div>
      <div className="px-4 pb-4 pt-1">
        <div className="text-sm font-bold">{fmt(post.likes)} likes</div>
        <p className="mt-1 text-sm leading-relaxed"><span className="font-bold mr-1.5">{post.user}</span>{post.caption}</p>
        {/* FIX(minor): use commentList.length — post.comments is set at init and goes stale */}
        <button onClick={() => onOpenComments(post)} className="mt-1.5 text-xs text-muted-foreground hover:text-foreground transition">
          View all {post.commentList.length} comments
        </button>
      </div>
    </li>
  );
}

// ─── Profile View ─────────────────────────────────────────────────────────────

function ProfileView({ posts, onLike, onSave, onOpenComments }: {
  posts: Post[]; onLike: (id: number) => void;
  onSave: (id: number) => void; onOpenComments: (p: Post) => void;
}) {
  const [tab, setTab] = useState<"posts" | "wins">("posts");

  const rankBadge = { label: "Gold", color: "from-amber-400 to-yellow-500", icon: "🥇" };
  const statsRow = [
    { label: "Posts", value: "24" },
    { label: "Followers", value: "1.2k" },
    { label: "Following", value: "318" },
  ];

  return (
    <div className="space-y-4">
      <div className="bg-surface sm:rounded-2xl sm:border sm:border-border overflow-hidden">
        <div className="h-24 bg-gradient-to-br from-violet-600 via-fuchsia-500 to-pink-500 relative">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(255,255,255,0.15),transparent_60%)]" />
        </div>

        <div className="px-5 pb-5">
          <div className="flex items-end justify-between -mt-8 mb-3">
            <div className="relative">
              <div className="w-16 h-16 rounded-full p-[3px] bg-gradient-to-tr from-violet-500 to-pink-500 bg-surface">
                <div className="w-full h-full rounded-full bg-gradient-to-br from-violet-500 to-pink-500 grid place-items-center text-white font-extrabold text-xl border-2 border-surface">
                  Y
                </div>
              </div>
            </div>
            <div className="flex gap-2 mb-1">
              <button className="h-8 px-4 rounded-lg bg-surface-2 border border-border text-xs font-bold hover:border-primary hover:text-primary transition">
                Edit profile
              </button>
              <button className="w-8 h-8 grid place-items-center rounded-lg bg-surface-2 border border-border hover:border-primary hover:text-primary transition">
                <MoreHorizontal className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="flex items-center gap-2 mb-0.5">
            <span className="font-extrabold text-base">you_player</span>
            <span className={`flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-gradient-to-r ${rankBadge.color} text-white`}>
              {rankBadge.icon} {rankBadge.label}
            </span>
            <span className="text-[10px] w-4 h-4 grid place-items-center rounded-full bg-primary text-primary-foreground font-extrabold">✓</span>
          </div>
          <div className="text-xs text-muted-foreground mb-3">Level 12 · Community Member · FullPlay since Jan 2025</div>

          <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
            Plinko enjoyer. Mines specialist. 📊 Data-driven plays only. Total wagered: ₹38,500
          </p>

          <div className="grid grid-cols-3 gap-3 mb-4">
            {statsRow.map((s) => (
              <div key={s.label} className="text-center py-2.5 rounded-xl bg-surface-2 border border-border">
                <div className="font-extrabold text-sm">{s.value}</div>
                <div className="text-[11px] text-muted-foreground mt-0.5">{s.label}</div>
              </div>
            ))}
          </div>

          <div className="rounded-xl bg-surface-2 border border-border p-3 space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Award className="w-4 h-4 text-amber-400" />
                <span className="text-xs font-bold">Gold Rank</span>
              </div>
              <span className="text-[11px] text-muted-foreground">Next: Platinum at ₹1L total wager</span>
            </div>
            <div className="h-2 rounded-full bg-background border border-border overflow-hidden">
              <div className="h-full rounded-full bg-gradient-to-r from-amber-400 to-yellow-500 transition-all" style={{ width: "38.5%" }} />
            </div>
            <div className="flex items-center justify-between text-[11px] text-muted-foreground">
              <span>₹38,500 wagered</span>
              <span>₹61,500 to Platinum</span>
            </div>
          </div>
        </div>

        <div className="flex border-t border-border">
          {(["posts", "wins"] as const).map((t) => (
            <button key={t} onClick={() => setTab(t)} className={`flex-1 h-10 text-xs font-bold capitalize border-b-2 transition ${tab === t ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground"}`}>
              {t === "posts" ? `Posts (${MY_POSTS.length})` : "Win History"}
            </button>
          ))}
        </div>
      </div>

      {tab === "posts" && (
        <ul className="space-y-4 sm:space-y-6">
          {posts.length === 0
            ? <li className="py-16 text-center text-sm text-muted-foreground bg-surface sm:rounded-2xl sm:border sm:border-border">No posts yet</li>
            : posts.map((p) => <PostCard key={p.id} post={p} onLike={onLike} onSave={onSave} onOpenComments={onOpenComments} />)}
        </ul>
      )}

      {tab === "wins" && (
        <div className="bg-surface sm:rounded-2xl sm:border sm:border-border overflow-hidden">
          <div className="px-4 py-3 border-b border-border">
            <span className="text-sm font-bold">Recent wins</span>
          </div>
          <ul className="divide-y divide-border">
            {[
              { game: "Plinko", amount: "₹12,000", date: "3 days ago", mult: "24x", color: "text-emerald-400" },
              { game: "Mines", amount: "₹4,200", date: "1 week ago", mult: "5-gem", color: "text-emerald-400" },
              { game: "Crash", amount: "₹1,800", date: "2 weeks ago", mult: "9x", color: "text-emerald-400" },
              { game: "Dragon & Tiger", amount: "-₹500", date: "2 weeks ago", mult: "Loss", color: "text-red-400" },
              { game: "Hi-Lo", amount: "₹2,100", date: "3 weeks ago", mult: "7 cards", color: "text-emerald-400" },
            ].map((w, i) => (
              <li key={i} className="flex items-center gap-3 px-4 py-3 hover:bg-surface-2 transition">
                <div className="w-9 h-9 rounded-xl bg-surface-2 border border-border grid place-items-center shrink-0">
                  <TrendingUp className="w-4 h-4 text-muted-foreground" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-bold">{w.game}</div>
                  <div className="text-[11px] text-muted-foreground">{w.date} · {w.mult}</div>
                </div>
                <span className={`text-sm font-extrabold ${w.color}`}>{w.amount}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

// ─── Saved View ───────────────────────────────────────────────────────────────

function SavedView({ posts, onLike, onSave, onOpenComments }: {
  posts: Post[]; onLike: (id: number) => void;
  onSave: (id: number) => void; onOpenComments: (p: Post) => void;
}) {
  const saved = posts.filter((p) => p.saved);
  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex items-center gap-3 px-1">
        <Bookmark className="w-5 h-5" />
        <span className="font-extrabold text-base">Saved Posts</span>
        <span className="ml-auto text-xs text-muted-foreground">{saved.length} saved</span>
      </div>
      {saved.length === 0 ? (
        <div className="py-16 text-center bg-surface sm:rounded-2xl sm:border sm:border-border">
          <Bookmark className="w-10 h-10 mx-auto text-muted-foreground mb-3" />
          <div className="font-bold text-sm">Nothing saved yet</div>
          <div className="text-xs text-muted-foreground mt-1">Tap the bookmark on any post to save it here</div>
        </div>
      ) : (
        <ul className="space-y-4 sm:space-y-6">
          {saved.map((p) => <PostCard key={p.id} post={p} onLike={onLike} onSave={onSave} onOpenComments={onOpenComments} />)}
        </ul>
      )}
    </div>
  );
}

// ─── Likes View ───────────────────────────────────────────────────────────────

function LikesView({ posts, onLike, onSave, onOpenComments }: {
  posts: Post[]; onLike: (id: number) => void;
  onSave: (id: number) => void; onOpenComments: (p: Post) => void;
}) {
  const liked = posts.filter((p) => p.liked);
  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex items-center gap-3 px-1">
        <Heart className="w-5 h-5" />
        <span className="font-extrabold text-base">My Likes</span>
        <span className="ml-auto text-xs text-muted-foreground">{liked.length} liked</span>
      </div>
      {liked.length === 0 ? (
        <div className="py-16 text-center bg-surface sm:rounded-2xl sm:border sm:border-border">
          <Heart className="w-10 h-10 mx-auto text-muted-foreground mb-3" />
          <div className="font-bold text-sm">No liked posts yet</div>
          <div className="text-xs text-muted-foreground mt-1">Tap the heart on any post to like it</div>
        </div>
      ) : (
        <ul className="space-y-4 sm:space-y-6">
          {liked.map((p) => <PostCard key={p.id} post={p} onLike={onLike} onSave={onSave} onOpenComments={onOpenComments} />)}
        </ul>
      )}
    </div>
  );
}

// ─── Explore View ─────────────────────────────────────────────────────────────

function ExploreView() {
  const [query, setQuery] = useState("");

  return (
    <div className="space-y-5">
      <div className="relative">
        <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
        <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search posts, tags, players…"
          className="w-full h-10 pl-10 pr-4 rounded-xl bg-surface border border-border focus:border-primary outline-none text-sm transition" />
        {query && <button onClick={() => setQuery("")} className="absolute right-3 top-1/2 -translate-y-1/2"><X className="w-3.5 h-3.5 text-muted-foreground" /></button>}
      </div>

      {!query && (
        <div className="bg-surface sm:rounded-2xl sm:border sm:border-border p-4 space-y-3">
          <div className="text-xs font-bold text-muted-foreground uppercase tracking-wide">Trending now</div>
          <div className="flex flex-wrap gap-2">
            {TRENDING.map((t) => (
              <button key={t.tag} onClick={() => setQuery(t.tag)} className="px-3 py-1.5 rounded-full bg-surface-2 border border-border text-xs font-bold hover:border-primary hover:text-primary transition">
                {t.tag} <span className="text-muted-foreground font-normal ml-1">{t.count}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      <div>
        <div className="text-xs font-bold text-muted-foreground uppercase tracking-wide mb-3 px-1">
          {query ? `Results for "${query}"` : "Top posts this week"}
        </div>
        <div className="grid grid-cols-3 gap-1.5 sm:gap-2">
          {EXPLORE_POSTS.map((p) => (
            <div key={p.id} className={`relative aspect-square rounded-xl bg-gradient-to-br ${p.gradient} overflow-hidden cursor-pointer group`}>
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.18),transparent_60%)]" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
              <span className="absolute top-1.5 left-1.5 bg-black/40 text-white text-[9px] font-extrabold px-1.5 py-0.5 rounded-full backdrop-blur-sm">{p.badge}</span>
              <span className="absolute bottom-1.5 left-1.5 text-[9px] font-bold text-white/70">@{p.user}</span>
              <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition flex items-center justify-center">
                <Heart className="w-6 h-6 text-white" />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-surface sm:rounded-2xl sm:border sm:border-border overflow-hidden">
        <div className="px-4 py-3 border-b border-border">
          <span className="text-sm font-bold">Top players this week</span>
        </div>
        <ul className="divide-y divide-border">
          {[
            { rank: 1, user: "rajat_07", color: "from-amber-400 to-rose-500", amount: "₹4.2L", game: "Plinko" },
            { rank: 2, user: "crashking", color: "from-violet-500 to-fuchsia-500", amount: "₹1.8L", game: "Crash" },
            { rank: 3, user: "minesqueen", color: "from-emerald-400 to-cyan-500", amount: "₹92k", game: "Mines" },
            { rank: 4, user: "plinkogod", color: "from-blue-500 to-indigo-500", amount: "₹41k", game: "Plinko" },
            { rank: 5, user: "dragonfan", color: "from-orange-500 to-red-500", amount: "₹18k", game: "Dragon Tiger" },
          ].map((e) => (
            <li key={e.user} className="flex items-center gap-3 px-4 py-3 hover:bg-surface-2 transition cursor-pointer">
              <span className={`text-sm font-extrabold w-5 shrink-0 ${e.rank === 1 ? "text-amber-400" : e.rank === 2 ? "text-slate-400" : e.rank === 3 ? "text-orange-400" : "text-muted-foreground"}`}>{e.rank}</span>
              <AvatarCircle name={e.user} color={e.color} size="sm" />
              <div className="flex-1 min-w-0">
                <div className="text-sm font-bold truncate">{e.user}</div>
                <div className="text-[11px] text-muted-foreground">{e.game}</div>
              </div>
              <span className="text-sm font-extrabold text-emerald-400 shrink-0">{e.amount}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

function CommunityPage() {
  const navigate = Route.useNavigate();
  const touchStartX = useRef(0);
  const onTouchStart = (e: ReactTouchEvent) => { touchStartX.current = e.changedTouches[0].clientX; };
  const onTouchEnd = (e: ReactTouchEvent) => { if (e.changedTouches[0].clientX - touchStartX.current > 80) navigate({ to: "/" }); };

  const MY_TOTAL_WAGERED = 38500;
  const WAGER_THRESHOLD = 50000;
  const canPost = MY_TOTAL_WAGERED >= WAGER_THRESHOLD;
  const wagerProgress = Math.min((MY_TOTAL_WAGERED / WAGER_THRESHOLD) * 100, 100);
  const [wagerGateOpen, setWagerGateOpen] = useState(false);

  const [posts, setPosts] = useState<Post[]>([...INITIAL_POSTS, ...MY_POSTS]);
  const [stories, setStories] = useState<Story[]>(STORIES_DATA);
  const [storyViewerIndex, setStoryViewerIndex] = useState<number | null>(null);
  const [commentPost, setCommentPost] = useState<Post | null>(null);
  const [chatOpen, setChatOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeView, setActiveView] = useState<ActiveView>("feed");

  // FIX(major): chats now live in state here so ChatDrawer mutations (read,
  // send) are reflected everywhere — the sidebar preview and the unread badge
  // both derive from this single source instead of the frozen constant.
  const [chats, setChats] = useState<Chat[]>(INITIAL_CHATS);

  // FIX(major): totalUnread derived from live chats state, not INITIAL_CHATS
  const totalUnread = useMemo(
    () => chats.reduce((sum, c) => sum + (c.unread ?? 0), 0),
    [chats]
  );

  // FIX(major): memoize sorted so markSeen's useCallback doesn't need `sorted`
  // in its dep array (which caused a new callback on every story-state change,
  // restarting the progress interval mid-story).
  const sorted = useMemo(() => sortedStories(stories), [stories]);

  // FIX(major): markSeen no longer depends on `sorted` — it looks up by index
  // directly from the stable `sorted` ref produced by the memo above.
  const markSeen = useCallback((i: number) => {
    setStories((ss) => {
      const name = sortedStories(ss)[i]?.name;
      if (!name) return ss;
      return ss.map((s) => s.name === name ? { ...s, seen: true } : s);
    });
  }, []); // stable — no deps needed

  const allPosts = posts;
  const feedPosts = searchQuery.trim()
    ? allPosts.filter((p) =>
        p.user.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.caption.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.location?.toLowerCase().includes(searchQuery.toLowerCase()))
    : allPosts.filter((p) => p.user !== "you_player");

  const myPosts = allPosts.filter((p) => p.user === "you_player");

  const toggleLike = (id: number) => setPosts((ps) => ps.map((p) => p.id === id ? { ...p, liked: !p.liked, likes: p.likes + (p.liked ? -1 : 1) } : p));
  const toggleSave = (id: number) => setPosts((ps) => ps.map((p) => p.id === id ? { ...p, saved: !p.saved } : p));

  // FIX(major): keep commentPost in sync with posts state so it never shows
  // stale comment counts after updateComments fires.
  const updateComments = useCallback((postId: number, comments: Comment[]) => {
    setPosts((ps) => ps.map((p) =>
      p.id === postId ? { ...p, commentList: comments, comments: comments.length } : p
    ));
    setCommentPost((cp) =>
      cp?.id === postId ? { ...cp, commentList: comments, comments: comments.length } : cp
    );
  }, []);

  // Sync commentPost when underlying post changes (e.g. a like toggle while
  // the sheet is open keeps the passed-in post object current).
  useEffect(() => {
    if (!commentPost) return;
    const latest = posts.find((p) => p.id === commentPost.id);
    if (latest && latest !== commentPost) setCommentPost(latest);
  }, [posts, commentPost]);

  useEffect(() => {
    document.body.style.overflow = (storyViewerIndex !== null || commentPost !== null || chatOpen || wagerGateOpen) ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [storyViewerIndex, commentPost, chatOpen, wagerGateOpen]);

  // FIX(minor): tighter LucideIcon type on nav items
  const navItems: { icon: LucideIcon; label: string; view: ActiveView }[] = [
    { icon: Home, label: "Feed", view: "feed" },
    { icon: Bookmark, label: "Saved posts", view: "saved" },
    { icon: Heart, label: "My likes", view: "likes" },
    { icon: UserIcon, label: "My profile", view: "profile" },
    { icon: Compass, label: "Explore", view: "explore" },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground pb-20 sm:pb-0" onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}>

      {/* ── Header ── */}
      <header className="border-b border-border bg-surface/80 backdrop-blur sticky top-0 z-30">
        <div className="max-w-[1180px] mx-auto px-4 sm:px-6 h-14 flex items-center gap-3">
          <Link to="/" className="flex items-center gap-1 shrink-0">
            <img src={fullplayMark} alt="Fullplay" className="h-14 w-14 object-contain drop-shadow-[0_0_8px_rgba(168,85,247,0.22)]" />
            <div className="text-xl sm:text-2xl font-extrabold leading-none tracking-tight hidden sm:block -ml-0.5 sm:-ml-1">Full<span className="text-gradient-hero">play</span></div>
          </Link>
          <div className="relative flex-1 max-w-xs mx-auto sm:mx-4 hidden sm:flex">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
            <input value={searchQuery} onChange={(e) => { setSearchQuery(e.target.value); if (activeView !== "feed") setActiveView("feed"); }} placeholder="Search players, posts…"
              className="w-full h-9 pl-10 pr-4 rounded-lg bg-surface-2 border border-border focus:border-primary outline-none text-sm transition" />
            {searchQuery && <button onClick={() => setSearchQuery("")} className="absolute right-3 top-1/2 -translate-y-1/2"><X className="w-3.5 h-3.5 text-muted-foreground" /></button>}
          </div>
          <div className="flex items-center gap-1 ml-auto">
            <Link to="/" className="w-9 h-9 sm:hidden grid place-items-center rounded-lg hover:bg-surface-2 text-muted-foreground hover:text-primary transition"><ChevronLeft className="w-5 h-5" /></Link>
            <button
              onClick={() => canPost ? undefined : setWagerGateOpen(true)}
              className="relative w-9 h-9 grid place-items-center rounded-lg hover:bg-surface-2 transition"
              aria-label="New post"
            >
              <Plus className="w-5 h-5" />
              {!canPost && <span className="absolute -top-0.5 -right-0.5 text-[9px]">🔒</span>}
            </button>
            <button onClick={() => setChatOpen(true)} className="relative w-9 h-9 grid place-items-center rounded-lg hover:bg-surface-2 transition" aria-label="Messages">
              <Send className="w-5 h-5" />
              {totalUnread > 0 && <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-primary" />}
            </button>
          </div>
        </div>
      </header>

      {/* ── 3-col layout ── */}
      <div className="max-w-[1180px] mx-auto px-4 sm:px-6 py-4 sm:py-6 grid grid-cols-1 lg:grid-cols-[240px_minmax(0,500px)_260px] xl:grid-cols-[260px_minmax(0,520px)_280px] gap-6 xl:gap-8 justify-center">

        {/* ── LEFT PANEL ── */}
        <aside className="hidden lg:flex flex-col gap-4 sticky top-20 self-start">
          <div className="rounded-2xl border border-border bg-surface p-4 space-y-3">
            <div className="flex items-center gap-3 pb-2 border-b border-border">
              <div className="w-10 h-10 rounded-full p-[2px] bg-gradient-to-tr from-violet-500 to-pink-500 shrink-0">
                <div className="w-full h-full rounded-full bg-gradient-primary grid place-items-center font-extrabold text-white text-xs">Y</div>
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-1.5">
                  <div className="font-bold text-sm">you_player</div>
                  <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-gradient-to-r from-amber-400 to-yellow-500 text-white">🥇 Gold</span>
                </div>
                <div className="text-[11px] text-muted-foreground">Level 12 · #42 overall</div>
              </div>
            </div>
            {[{ label: "Posts", value: "24" }, { label: "Followers", value: "1.2k" }, { label: "Following", value: "318" }, { label: "Total wins", value: "₹82,400" }].map((s) => (
              <div key={s.label} className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">{s.label}</span>
                <span className="text-sm font-bold">{s.value}</span>
              </div>
            ))}
            <button onClick={() => setActiveView("profile")} className="w-full h-8 rounded-lg bg-surface-2 border border-border text-xs font-bold hover:border-primary hover:text-primary transition">View profile</button>
          </div>

          <nav className="rounded-2xl border border-border bg-surface p-3 space-y-1">
            {navItems.map(({ icon: Icon, label, view }) => (
              <button key={view} onClick={() => setActiveView(view)} className={`w-full flex items-center gap-3 px-3 h-9 rounded-lg text-sm font-semibold transition ${activeView === view ? "bg-surface-2 text-foreground" : "text-muted-foreground hover:bg-surface-2 hover:text-foreground"}`}>
                <Icon className="w-4 h-4 shrink-0" />{label}
              </button>
            ))}
          </nav>

          <div className="rounded-2xl border border-border bg-surface p-4">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-muted-foreground uppercase tracking-wide">Online now</span>
              <span className="text-[10px] bg-emerald-500/20 text-emerald-400 font-bold px-2 py-0.5 rounded-full">Live</span>
            </div>
            <ul className="space-y-2.5">
              {[
                { user: "rajat_07", color: "from-amber-400 to-rose-500", game: "Plinko" },
                { user: "crashking", color: "from-violet-500 to-fuchsia-500", game: "Crash" },
                { user: "plinkogod", color: "from-blue-500 to-indigo-500", game: "Mines" },
                { user: "hiloqueen", color: "from-teal-500 to-emerald-500", game: "Hi-Lo" },
              ].map((p) => (
                <li key={p.user} className="flex items-center gap-2.5">
                  <div className="relative shrink-0">
                    <div className={`w-7 h-7 rounded-full bg-gradient-to-br ${p.color} grid place-items-center text-white font-extrabold text-[10px]`}>{p.user[0].toUpperCase()}</div>
                    <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-500 border-2 border-surface" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-bold truncate">{p.user}</div>
                    <div className="text-[10px] text-muted-foreground">{p.game}</div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </aside>

        {/* ── MAIN CONTENT ── */}
        <div className="min-w-0">

          {activeView === "feed" && (
            <>
              {!searchQuery && (
                <div className="px-4 sm:px-0 mb-4 sm:mb-6">
                  <div className="rounded-2xl sm:border sm:border-border sm:bg-surface sm:p-4">
                    <div className="flex gap-4 overflow-x-auto -mx-1 px-1 [&::-webkit-scrollbar]:hidden" style={{ scrollbarWidth: "none" }}>
                      {sorted.map((s, i) => {
                        const ringClass = s.isYou
                          ? "border-2 border-border"
                          : s.seen
                            ? "border-2 border-border/40"
                            : s.isFollowing
                              ? `p-[2.5px] bg-gradient-to-tr ${s.color}`
                              : "border-2 border-dashed border-muted-foreground/40";
                        return (
                          <button key={s.name} onClick={() => setStoryViewerIndex(i)} className="flex flex-col items-center gap-1.5 shrink-0 w-16">
                            <div className={`relative w-16 h-16 rounded-full transition-all duration-300 ${ringClass}`}>
                              <div className={`w-full h-full rounded-full ${(!s.isYou && !s.seen && s.isFollowing) ? "bg-background p-[2px]" : ""}`}>
                                <div className={`w-full h-full rounded-full bg-gradient-to-br ${s.color} grid place-items-center text-white font-extrabold text-lg`}>
                                  {s.name[0].toUpperCase()}
                                </div>
                              </div>
                              {s.isYou && (
                                <div className="absolute bottom-0 right-0 w-5 h-5 rounded-full bg-gradient-primary border-2 border-background grid place-items-center">
                                  <Plus className="w-3 h-3 text-white" />
                                </div>
                              )}
                              {!s.isFollowing && !s.isYou && !s.seen && (
                                <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 text-[8px] font-bold bg-surface-2 text-muted-foreground px-1.5 rounded-full border border-border whitespace-nowrap">
                                  +Follow
                                </div>
                              )}
                            </div>
                            <span className="text-[11px] text-muted-foreground truncate w-full text-center">
                              {s.isYou ? "Your story" : s.name}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}

              {searchQuery && feedPosts.length === 0 && (
                <div className="py-16 text-center">
                  <Search className="w-10 h-10 mx-auto text-muted-foreground mb-3" />
                  <div className="font-bold text-sm">No results for "{searchQuery}"</div>
                  <div className="text-xs text-muted-foreground mt-1">Try a username, caption, or game name</div>
                </div>
              )}

              <ul className="space-y-4 sm:space-y-6">
                {feedPosts.map((p) => (
                  <PostCard key={p.id} post={p} onLike={toggleLike} onSave={toggleSave} onOpenComments={setCommentPost} />
                ))}
              </ul>
            </>
          )}

          {activeView === "saved" && (
            <SavedView posts={allPosts} onLike={toggleLike} onSave={toggleSave} onOpenComments={setCommentPost} />
          )}

          {activeView === "likes" && (
            <LikesView posts={allPosts} onLike={toggleLike} onSave={toggleSave} onOpenComments={setCommentPost} />
          )}

          {activeView === "profile" && (
            <ProfileView posts={myPosts} onLike={toggleLike} onSave={toggleSave} onOpenComments={setCommentPost} />
          )}

          {activeView === "explore" && <ExploreView />}
        </div>

        {/* ── RIGHT SIDEBAR ── */}
        <aside className="hidden lg:flex flex-col gap-4 sticky top-20 self-start">
          <div className="rounded-2xl border border-border bg-surface overflow-hidden">
            <div className="flex items-center justify-between px-4 pt-4 pb-2">
              <span className="text-sm font-extrabold">Chats</span>
              <div className="flex items-center gap-1">
                {totalUnread > 0 && (
                  // FIX(minor): badge now reflects live state via totalUnread memo
                  <span className="text-[10px] font-bold bg-primary text-primary-foreground px-2 py-0.5 rounded-full">{totalUnread} new</span>
                )}
                <button onClick={() => setChatOpen(true)} className="text-[11px] font-bold text-primary hover:opacity-80 ml-1">See all</button>
              </div>
            </div>
            <div className="divide-y divide-border">
              {/* FIX(minor): preview pulls from live chats state, not INITIAL_CHATS */}
              {chats.slice(0, 4).map((chat) => (
                <button key={chat.id} onClick={() => setChatOpen(true)} className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-surface-2 transition text-left">
                  <AvatarCircle name={chat.user} color={chat.color} size="sm" online={chat.online} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold truncate">{chat.user}</span>
                      <span className="text-[10px] text-muted-foreground ml-1 shrink-0">{chat.lastTime}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className={`text-[11px] truncate ${chat.unread ? "text-foreground font-semibold" : "text-muted-foreground"}`}>{chat.lastMsg}</span>
                      {chat.unread ? <span className="ml-1 w-4 h-4 rounded-full bg-primary text-primary-foreground text-[9px] font-bold grid place-items-center shrink-0">{chat.unread}</span> : null}
                    </div>
                  </div>
                </button>
              ))}
            </div>
            <button onClick={() => setChatOpen(true)} className="w-full py-3 text-xs font-bold text-primary hover:bg-surface-2 transition border-t border-border">
              Open all messages →
            </button>
          </div>

          <div className="rounded-2xl border border-border bg-surface p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-muted-foreground uppercase tracking-wide">Trending</span>
              <button className="text-[11px] font-bold hover:text-muted-foreground" onClick={() => setActiveView("explore")}>More</button>
            </div>
            <ul className="space-y-2.5">
              {TRENDING.map((t) => (
                <li key={t.tag} className="flex items-center justify-between">
                  <span className="text-sm font-bold text-gradient-hero">{t.tag}</span>
                  <span className="text-[11px] text-muted-foreground">{t.count}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-2xl border border-border bg-surface p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-muted-foreground uppercase tracking-wide">Top winners today</span>
              <span className="text-[10px] text-amber-400 font-bold">🏆 Live</span>
            </div>
            <ul className="space-y-2.5">
              {[
                { rank: 1, user: "rajat_07", color: "from-amber-400 to-rose-500", amount: "₹4.2L" },
                { rank: 2, user: "crashking", color: "from-violet-500 to-fuchsia-500", amount: "₹1.8L" },
                { rank: 3, user: "minesqueen", color: "from-emerald-400 to-cyan-500", amount: "₹92k" },
                { rank: 4, user: "plinkogod", color: "from-blue-500 to-indigo-500", amount: "₹41k" },
              ].map((e) => (
                <li key={e.user} className="flex items-center gap-2.5">
                  <span className={`text-xs font-extrabold w-4 shrink-0 ${e.rank === 1 ? "text-amber-400" : e.rank === 2 ? "text-slate-400" : e.rank === 3 ? "text-orange-400" : "text-muted-foreground"}`}>{e.rank}</span>
                  <div className={`w-7 h-7 rounded-full bg-gradient-to-br ${e.color} grid place-items-center text-white font-extrabold text-[10px] shrink-0`}>{e.user[0].toUpperCase()}</div>
                  <span className="text-xs font-bold flex-1 truncate">{e.user}</span>
                  <span className="text-xs font-bold text-emerald-400 shrink-0">{e.amount}</span>
                </li>
              ))}
            </ul>
          </div>

          <p className="text-[11px] text-muted-foreground px-1">FullPlay Community · 2026</p>
        </aside>
      </div>

      {/* ── Mobile bottom nav ── */}
      <nav className="sm:hidden fixed bottom-0 inset-x-0 z-30 border-t border-border bg-surface/95 backdrop-blur">
        <div className="grid grid-cols-5 h-14">
          <button onClick={() => setActiveView("feed")} className={`grid place-items-center ${activeView === "feed" ? "text-foreground" : "text-muted-foreground"}`}><Home className="w-6 h-6" /></button>
          <button onClick={() => setActiveView("explore")} className={`grid place-items-center ${activeView === "explore" ? "text-foreground" : "text-muted-foreground"}`}><Compass className="w-6 h-6" /></button>
          <button onClick={() => canPost ? undefined : setWagerGateOpen(true)} className="grid place-items-center">
            <span className="relative w-9 h-9 rounded-xl bg-gradient-primary grid place-items-center shadow-glow">
              <Plus className="w-5 h-5 text-white" />
              {!canPost && <span className="absolute -top-1 -right-1 text-[10px] bg-surface rounded-full px-0.5">🔒</span>}
            </span>
          </button>
          <button onClick={() => setChatOpen(true)} className="relative grid place-items-center text-muted-foreground">
            <MessageCircle className="w-6 h-6" />
            {totalUnread > 0 && <span className="absolute top-2 right-3 w-2 h-2 rounded-full bg-primary" />}
          </button>
          <button onClick={() => setActiveView("profile")} className={`grid place-items-center ${activeView === "profile" ? "text-foreground" : "text-muted-foreground"}`}><UserIcon className="w-6 h-6" /></button>
        </div>
      </nav>

      {/* ── Overlays ── */}
      {storyViewerIndex !== null && (
        <StoryViewer stories={sorted} startIndex={storyViewerIndex} onClose={() => setStoryViewerIndex(null)} onMarkSeen={markSeen} />
      )}
      {commentPost && (
        <CommentSheet post={commentPost} onClose={() => setCommentPost(null)} onUpdate={updateComments} />
      )}
      {/* FIX(major): pass live chats state + setter so ChatDrawer is no longer isolated */}
      {chatOpen && <ChatDrawer chats={chats} setChats={setChats} onClose={() => setChatOpen(false)} />}

      {/* ── Wagering Gate Modal ── */}
      {wagerGateOpen && (
        <>
          <button className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm" onClick={() => setWagerGateOpen(false)} />
          <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
            <div className="relative w-full max-w-sm bg-surface rounded-2xl border border-border shadow-2xl p-6 space-y-5">
              <button onClick={() => setWagerGateOpen(false)} className="absolute top-4 right-4 w-7 h-7 grid place-items-center rounded-full hover:bg-surface-2 transition">
                <X className="w-4 h-4 text-muted-foreground" />
              </button>
              <div className="w-14 h-14 rounded-2xl bg-surface-2 border border-border grid place-items-center mx-auto">
                <span className="text-2xl">🔒</span>
              </div>
              <div className="text-center space-y-1">
                <div className="font-extrabold text-base">Community Posting Locked</div>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  You need to wager a total of <span className="font-bold text-foreground">₹50,000</span> on FullPlay to unlock community posting.
                </p>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">Your progress</span>
                  <span className="font-bold">₹{MY_TOTAL_WAGERED.toLocaleString("en-IN")}<span className="text-muted-foreground font-normal"> / ₹50,000</span></span>
                </div>
                <div className="h-2.5 rounded-full bg-surface-2 border border-border overflow-hidden">
                  <div className="h-full rounded-full bg-gradient-to-r from-violet-500 to-pink-500 transition-all duration-700" style={{ width: `${wagerProgress}%` }} />
                </div>
                <div className="text-[11px] text-muted-foreground text-right">₹{(WAGER_THRESHOLD - MY_TOTAL_WAGERED).toLocaleString("en-IN")} more to go</div>
              </div>
              <div className="rounded-xl bg-surface-2 border border-border p-3 space-y-2">
                <div className="text-[11px] font-bold text-muted-foreground uppercase tracking-wide">Unlock includes</div>
                {["Post wins, clips & moments to the feed", "Start community discussions", "Verified community badge on your profile", "Priority placement in the stories bar"].map((item) => (
                  <div key={item} className="flex items-start gap-2 text-xs">
                    <span className="text-emerald-400 mt-0.5 shrink-0">✓</span>
                    <span className="text-muted-foreground">{item}</span>
                  </div>
                ))}
              </div>
              <Link to="/" onClick={() => setWagerGateOpen(false)} className="w-full h-10 rounded-xl bg-gradient-primary text-white text-sm font-bold grid place-items-center shadow-glow hover:opacity-90 transition">
                Play now to unlock →
              </Link>
            </div>
          </div>
        </>
      )}
    </div>
  );
}