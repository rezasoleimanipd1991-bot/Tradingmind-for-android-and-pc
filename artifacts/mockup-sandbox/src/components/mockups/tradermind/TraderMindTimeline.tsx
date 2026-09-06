import { useMemo, useState } from "react";
import {
  ArrowDownLeft,
  ArrowUpLeft,
  Bell,
  Bookmark,
  CalendarDays,
  Check,
  ChevronDown,
  ChevronLeft,
  CircleHelp,
  Clock3,
  Command,
  Crosshair,
  FileText,
  Filter,
  Menu,
  MessageSquare,
  MoreHorizontal,
  PenLine,
  Plus,
  Search,
  ShieldCheck,
  Sparkles,
  Tag,
  TrendingDown,
  TrendingUp,
  X,
  type LucideIcon,
} from "lucide-react";

type TradeStatus = "برد" | "ضرر" | "باز";

interface TimelineTrade {
  id: string;
  time: string;
  symbol: string;
  market: string;
  side: "خرید" | "فروش";
  setup: string;
  status: TradeStatus;
  pnl: string;
  r: string;
  accent: string;
  note: string;
  context: string;
  tags: string[];
}

interface TimelineEvent {
  time: string;
  label: string;
  detail: string;
  icon: LucideIcon;
  tone: "teal" | "coral" | "gold" | "ink";
}

const trades: TimelineTrade[] = [
  {
    id: "nq-open",
    time: "۱۰:۴۲",
    symbol: "NQ",
    market: "NASDAQ · 5m",
    side: "خرید",
    setup: "Opening range reclaim",
    status: "برد",
    pnl: "+$184.20",
    r: "+۱٫۸۴R",
    accent: "#bd6d4d",
    note: "بعد از شکست سقف، برای تأیید دوم صبر کردم. ورود آرام بود؛ نه تعقیب قیمت.",
    context: "بازپس‌گیری محدوده‌ی بازگشایی با حجم رو به رشد",
    tags: ["تأیید دوم", "جلسه نیویورک"],
  },
  {
    id: "es-vwap",
    time: "۰۹:۵۸",
    symbol: "ES",
    market: "S&P 500 · 5m",
    side: "فروش",
    setup: "VWAP fade",
    status: "ضرر",
    pnl: "-$72.50",
    r: "-۰٫۷۲R",
    accent: "#4a8279",
    note: "زمینه‌ی بازار خنثی بود اما قبل از تثبیت، اندازه را بزرگ گرفتم.",
    context: "بازگشت به VWAP بدون شکست ساختار",
    tags: ["سایز بزرگ", "بازبینی ریسک"],
  },
  {
    id: "eur-sweep",
    time: "دیروز · ۱۶:۲۴",
    symbol: "EURUSD",
    market: "Forex · 15m",
    side: "خرید",
    setup: "London sweep",
    status: "برد",
    pnl: "+$246.00",
    r: "+۲٫۴۶R",
    accent: "#a17d3e",
    note: "نقطه‌ی ورود از قبل روی سناریو نوشته شده بود؛ اجرای تمیز و بی‌عجله.",
    context: "جمع‌کردن نقدینگی لندن و برگشت به محدوده",
    tags: ["سناریوی مکتوب", "جلسه لندن"],
  },
  {
    id: "btc-range",
    time: "دوشنبه · ۱۲:۰۸",
    symbol: "BTCUSD",
    market: "Crypto · 15m",
    side: "فروش",
    setup: "Range expansion",
    status: "برد",
    pnl: "+$91.80",
    r: "+۰٫۹۲R",
    accent: "#84655e",
    note: "خروج در تارگت اول. وسوسه‌ی نگه‌داشتن بیشتر را دنبال نکردم.",
    context: "گسترش دامنه بعد از فشردگی صبحگاهی",
    tags: ["خروج برنامه‌ریزی‌شده"],
  },
];

const events: TimelineEvent[] = [
  { time: "۰۸:۴۵", label: "شروع چک‌این", detail: "ظرفیت امروز: ۱R · ذهن حاضر", icon: ShieldCheck, tone: "teal" },
  { time: "۰۹:۳۰", label: "بازار باز شد", detail: "تمرکز روی NQ و ES", icon: CalendarDays, tone: "ink" },
  { time: "۰۹:۵۸", label: "معامله‌ی ES", detail: "VWAP fade · -۰٫۷۲R", icon: TrendingDown, tone: "coral" },
  { time: "۱۰:۴۲", label: "معامله‌ی NQ", detail: "Opening range reclaim · +۱٫۸۴R", icon: TrendingUp, tone: "gold" },
  { time: "۱۱:۱۵", label: "یادداشت ثبت شد", detail: "صبر برای تأیید دوم", icon: PenLine, tone: "teal" },
];

const toneClasses = {
  teal: { dot: "bg-[#4a8279]", icon: "bg-[#dceee8] text-[#39766d]" },
  coral: { dot: "bg-[#bd6d4d]", icon: "bg-[#f5e4db] text-[#ad5d45]" },
  gold: { dot: "bg-[#b18842]", icon: "bg-[#f5ecd6] text-[#957436]" },
  ink: { dot: "bg-[#607b70]", icon: "bg-[#e4ebe5] text-[#46645a]" },
};

function TimelineEventRow({ event, isLast }: { event: TimelineEvent; isLast: boolean }) {
  const Icon = event.icon;
  const tone = toneClasses[event.tone];

  return (
    <div className="relative flex gap-3">
      {!isLast && <span className="absolute right-[13px] top-8 h-[calc(100%+4px)] w-px bg-[#dbe2da]" />}
      <span className={`relative z-10 grid h-7 w-7 shrink-0 place-items-center rounded-[10px] ${tone.icon}`}>
        <Icon className="h-3.5 w-3.5" strokeWidth={1.8} />
      </span>
      <div className="min-w-0 pb-5 pt-0.5">
        <div className="flex items-baseline gap-2">
          <span className="font-mono text-[10px] text-[#a0aaa3]">{event.time}</span>
          <p className="text-[11px] font-semibold text-[#2c4a41]">{event.label}</p>
        </div>
        <p className="mt-1 text-[10px] leading-5 text-[#829088]">{event.detail}</p>
      </div>
    </div>
  );
}

function TradeCard({
  trade,
  expanded,
  onToggle,
  onAnnotate,
}: {
  trade: TimelineTrade;
  expanded: boolean;
  onToggle: () => void;
  onAnnotate: () => void;
}) {
  const positive = trade.status === "برد";
  const open = trade.status === "باز";

  return (
    <article className={`relative overflow-hidden rounded-[22px] border bg-[#fbfaf5] transition-shadow ${expanded ? "border-[#9cbbae] shadow-[0_15px_30px_rgba(49,93,86,.1)]" : "border-[#d9dfd7] hover:border-[#b5cbbf] hover:shadow-[0_9px_22px_rgba(49,93,86,.06)]"}`}>
      <span className="absolute inset-y-0 right-0 w-1" style={{ backgroundColor: trade.accent }} />
      <button type="button" onClick={onToggle} className="flex min-h-[82px] w-full items-center gap-3 px-4 py-3 text-right sm:gap-4 sm:px-5">
        <span className="grid h-11 w-11 shrink-0 place-items-center rounded-[14px] text-[11px] font-bold text-[#fff9ee]" style={{ backgroundColor: trade.accent }}>
          {trade.symbol.slice(0, 2)}
        </span>
        <span className="min-w-0 flex-1">
          <span className="flex flex-wrap items-center gap-2">
            <span className="truncate text-[13px] font-semibold text-[#29463e]">{trade.setup}</span>
            <span className={`rounded-full px-2 py-0.5 text-[9px] ${trade.side === "خرید" ? "bg-[#e1efe9] text-[#39766d]" : "bg-[#f2e5de] text-[#ad5d45]"}`}>{trade.side}</span>
          </span>
          <span className="mt-1 flex items-center gap-2 text-[10px] text-[#8a9790]">
            <span>{trade.symbol}</span><span className="text-[#c1c9c2]">·</span><span>{trade.market}</span><span className="text-[#c1c9c2]">·</span><span>{trade.time}</span>
          </span>
        </span>
        <span className="hidden text-left sm:block">
          <span className={`block text-[12px] font-semibold ${positive ? "text-[#3e8175]" : open ? "text-[#98783c]" : "text-[#b5674e]"}`}>{trade.pnl}</span>
          <span className="mt-1 block text-[9px] text-[#97a39c]">{trade.r}</span>
        </span>
        <span className={`grid h-8 w-8 shrink-0 place-items-center rounded-lg transition-transform ${expanded ? "rotate-180 bg-[#e8f0e9] text-[#315d56]" : "bg-[#f0f2ec] text-[#88968e]"}`}>
          <ChevronDown className="h-4 w-4" />
        </span>
      </button>

      <div className="flex items-center justify-between border-t border-[#edf0e9] px-4 py-2.5 sm:hidden">
        <span className={`text-[11px] font-semibold ${positive ? "text-[#3e8175]" : open ? "text-[#98783c]" : "text-[#b5674e]"}`}>{trade.pnl} <span className="mr-1 text-[9px] font-normal text-[#97a39c]">{trade.r}</span></span>
        <span className="text-[9px] text-[#9aa59e]">{trade.status}</span>
      </div>

      {expanded && (
        <div className="border-t border-[#e8ece5] bg-[#f4f5ef] px-4 pb-4 pt-3 sm:px-5">
          <div className="grid gap-3 sm:grid-cols-[1fr_180px]">
            <div>
              <p className="text-[9px] font-semibold tracking-[0.12em] text-[#a16d52]">یادداشت اجرای معامله</p>
              <p className="mt-1.5 max-w-[550px] text-[11px] leading-6 text-[#5e756b]">{trade.note}</p>
            </div>
            <div className="rounded-[14px] border border-[#dce5dc] bg-[#fbfaf5] p-3">
              <p className="text-[9px] text-[#9aa59e]">زمینه</p>
              <p className="mt-1 text-[10px] leading-5 text-[#49665c]">{trade.context}</p>
            </div>
          </div>
          <div className="mt-3 flex flex-wrap items-center gap-1.5">
            {trade.tags.map((tag) => <span key={tag} className="inline-flex items-center gap-1 rounded-full bg-[#e6eee7] px-2.5 py-1 text-[9px] text-[#5b786d]"><Tag className="h-2.5 w-2.5" />{tag}</span>)}
            <button type="button" onClick={onAnnotate} className="mr-auto inline-flex min-h-[30px] items-center gap-1.5 rounded-lg border border-[#cbdace] px-2.5 text-[9px] font-medium text-[#315d56] hover:bg-[#fbfaf5]"><MessageSquare className="h-3 w-3" />افزودن حاشیه</button>
          </div>
        </div>
      )}
    </article>
  );
}

export default function TraderMindTimeline() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeDay, setActiveDay] = useState("امروز");
  const [expandedTrade, setExpandedTrade] = useState("nq-open");
  const [filter, setFilter] = useState<"همه" | "بردها" | "ضررها">("همه");
  const [annotation, setAnnotation] = useState("");
  const [annotationFor, setAnnotationFor] = useState("nq-open");
  const [savedAnnotation, setSavedAnnotation] = useState("");
  const [showAnnotator, setShowAnnotator] = useState(false);

  const visibleTrades = useMemo(() => trades.filter((trade) => filter === "همه" || (filter === "بردها" ? trade.status === "برد" : trade.status === "ضرر")), [filter]);
  const selectedTrade = trades.find((trade) => trade.id === annotationFor) ?? trades[0];

  const openAnnotator = (id: string) => {
    setAnnotationFor(id);
    setAnnotation(savedAnnotation && id === annotationFor ? savedAnnotation : "");
    setShowAnnotator(true);
  };

  const saveAnnotation = () => {
    if (!annotation.trim()) return;
    setSavedAnnotation(annotation.trim());
    setShowAnnotator(false);
  };

  return (
    <div dir="rtl" className="min-h-[100dvh] overflow-x-hidden bg-[#f1eee6] text-[#29443d]" style={{ fontFamily: "'Vazirmatn', 'Noto Sans Arabic', sans-serif" }}>
      <style>{`
        .tm-timeline-grid { background-image: linear-gradient(rgba(49,93,86,.042) 1px, transparent 1px), linear-gradient(90deg, rgba(49,93,86,.042) 1px, transparent 1px); background-size: 30px 30px; }
        .tm-timeline-scroll::-webkit-scrollbar { width: 5px; height: 5px; }
        .tm-timeline-scroll::-webkit-scrollbar-thumb { background: #c8d4ca; border-radius: 999px; }
        @keyframes tm-timeline-rise { from { opacity: 0; transform: translateY(7px); } to { opacity: 1; transform: translateY(0); } }
        .tm-timeline-rise > * { animation: tm-timeline-rise .45s cubic-bezier(.22,1,.36,1) both; }
        .tm-timeline-rise > *:nth-child(2) { animation-delay: .05s; }
        .tm-timeline-rise > *:nth-child(3) { animation-delay: .1s; }
        .tm-timeline-rise > *:nth-child(4) { animation-delay: .15s; }
        @media (prefers-reduced-motion: reduce) { .tm-timeline-rise > * { animation: none; } }
      `}</style>

      <div className="mx-auto flex min-h-[100dvh] max-w-[1680px]">
        <aside className={`fixed inset-y-0 right-0 z-50 w-[274px] border-l border-[#d9dfd7] bg-[#e8ece5] px-5 py-6 transition-transform duration-300 lg:sticky lg:top-0 lg:h-[100dvh] lg:translate-x-0 ${sidebarOpen ? "translate-x-0 shadow-[-18px_0_45px_rgba(32,59,53,.14)]" : "translate-x-full"}`}>
          <div className="flex h-full flex-col">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <span className="grid h-10 w-10 place-items-center rounded-[14px] bg-[#315d56] text-[#f6d18b] shadow-[0_8px_16px_rgba(49,93,86,.17)]"><Crosshair className="h-5 w-5" strokeWidth={1.7} /></span>
                <div><p className="text-[15px] font-semibold tracking-[-0.03em]">TraderMind</p><p className="text-[10px] tracking-[0.18em] text-[#718079]">FIELD NOTES / 05</p></div>
              </div>
              <button type="button" onClick={() => setSidebarOpen(false)} className="grid h-9 w-9 place-items-center rounded-xl text-[#6b7a73] hover:bg-[#dce4dc] lg:hidden" aria-label="بستن منو"><X className="h-4 w-4" /></button>
            </div>

            <div className="mt-10 rounded-[20px] border border-[#ccd8cd] bg-[#f3f5ef] p-3.5">
              <div className="flex items-center justify-between"><span className="flex items-center gap-2 text-[11px] font-medium text-[#66766f]"><span className="h-2 w-2 rounded-full bg-[#4a8279] shadow-[0_0_0_4px_rgba(74,130,121,.12)]" />نمای امروز</span><span className="text-[10px] text-[#9aa49e]">۲۱ خرداد</span></div>
              <p className="mt-3 text-[15px] font-semibold">دیدن، قبل از تصمیم</p>
              <div className="mt-3 flex items-center gap-2 text-[11px] text-[#718079]"><span className="rounded-md bg-[#e3ebe4] px-2 py-1 text-[#315d56]">۴۲ روز</span><span>زنجیره‌ی ثبت</span></div>
            </div>

            <p className="mb-2 mt-9 px-2 text-[10px] font-semibold tracking-[0.16em] text-[#94a099]">فضاهای کاری</p>
            <nav className="space-y-1.5">
              {[
                { label: "تایم‌لاین امروز", hint: "حرکت‌ها به ترتیب زمان", icon: Clock3, active: true },
                { label: "اتاق مرور", hint: "درس‌های معامله", icon: FileText, active: false },
                { label: "کشف الگوها", hint: "آنچه تکرار می‌شود", icon: Sparkles, active: false },
              ].map(({ label, hint, icon: Icon, active }) => (
                <button type="button" key={label} onClick={() => setSidebarOpen(false)} className={`group flex min-h-[54px] w-full items-center gap-3 rounded-[16px] px-3 text-right transition-all ${active ? "bg-[#315d56] text-[#fbf8ee] shadow-[0_8px_18px_rgba(49,93,86,.16)]" : "text-[#61716a] hover:bg-[#dce5dd] hover:text-[#203b35]"}`}>
                  <span className={`grid h-8 w-8 place-items-center rounded-xl ${active ? "bg-white/10 text-[#f6d18b]" : "bg-[#f5f5ee] text-[#718079]"}`}><Icon className="h-[17px] w-[17px]" strokeWidth={1.7} /></span>
                  <span className="flex-1"><span className="block text-[13px] font-semibold">{label}</span><span className={`mt-0.5 block text-[10px] ${active ? "text-[#c8d9cf]" : "text-[#8b9790]"}`}>{hint}</span></span>
                  <ChevronLeft className={`h-4 w-4 ${active ? "text-[#f6d18b]" : "opacity-0 group-hover:opacity-60"}`} />
                </button>
              ))}
            </nav>

            <div className="mt-auto space-y-2">
              <button type="button" onClick={() => openAnnotator("nq-open")} className="flex min-h-[48px] w-full items-center justify-center gap-2 rounded-[15px] bg-[#bd6d4d] px-4 text-[12px] font-semibold text-[#fff8ec] shadow-[0_8px_16px_rgba(191,107,69,.17)] transition-all hover:-translate-y-0.5 hover:bg-[#aa5938]"><MessageSquare className="h-4 w-4" />حاشیه‌نویسی سریع</button>
              <div className="flex items-center justify-between px-2 pt-3 text-[10px] text-[#8a9890]"><span className="flex items-center gap-1.5"><ShieldCheck className="h-3.5 w-3.5 text-[#4d897c]" />داده‌ها محلی و امن</span><CircleHelp className="h-3.5 w-3.5" /></div>
            </div>
          </div>
        </aside>

        {sidebarOpen && <button type="button" onClick={() => setSidebarOpen(false)} className="fixed inset-0 z-40 bg-[#203b35]/20 backdrop-blur-[2px] lg:hidden" aria-label="بستن منو" />}

        <main className="tm-timeline-grid min-w-0 flex-1">
          <header className="sticky top-0 z-30 border-b border-[#dfe2d8]/90 bg-[#f1eee6]/90 px-4 py-3 backdrop-blur-xl sm:px-7 lg:px-10">
            <div className="mx-auto flex max-w-[1260px] items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <button type="button" onClick={() => setSidebarOpen(true)} className="grid h-10 w-10 place-items-center rounded-xl border border-[#d8ddd4] bg-[#faf9f4] text-[#52665d] lg:hidden" aria-label="باز کردن منو"><Menu className="h-5 w-5" /></button>
                <div className="hidden h-9 w-9 place-items-center rounded-xl bg-[#315d56] text-[#f6d18b] lg:grid"><Command className="h-4 w-4" /></div>
                <div><p className="text-[11px] text-[#82908a]">سه‌شنبه، ۲۱ خرداد ۱۴۰۳</p><h1 className="mt-0.5 text-[17px] font-semibold tracking-[-0.03em]">تایم‌لاین تصمیم‌ها</h1></div>
              </div>
              <div className="flex items-center gap-2">
                <button type="button" onClick={() => setFilter(filter === "همه" ? "بردها" : filter === "بردها" ? "ضررها" : "همه")} className="hidden h-10 items-center gap-2 rounded-xl border border-[#d8ddd4] bg-[#faf9f4] px-3 text-[11px] text-[#63736c] hover:border-[#b8c9be] sm:flex"><Search className="h-4 w-4" /><span>جستجوی تایم‌لاین</span><kbd className="rounded bg-[#edf0e9] px-1.5 py-0.5 text-[10px] text-[#9aa39d]">⌘ K</kbd></button>
                <button type="button" onClick={() => openAnnotator("nq-open")} className="grid h-10 w-10 place-items-center rounded-xl bg-[#315d56] text-[#f6d18b] hover:bg-[#274c46]" aria-label="ثبت حاشیه"><PenLine className="h-4 w-4" /></button>
                <button type="button" onClick={() => setFilter(filter === "همه" ? "بردها" : "همه")} className="relative grid h-10 w-10 place-items-center rounded-xl border border-[#d8ddd4] bg-[#faf9f4] text-[#6e7d76] hover:text-[#315d56]" aria-label="اعلان‌ها"><Bell className="h-4 w-4" /><span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-[#bd6d4d]" /></button>
              </div>
            </div>
          </header>

          <div className="tm-timeline-rise mx-auto grid max-w-[1260px] gap-6 px-4 py-6 sm:px-7 sm:py-8 lg:grid-cols-[minmax(0,1fr)_290px] lg:px-10">
            <section className="min-w-0">
              <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
                <div>
                  <p className="mb-3 flex items-center gap-2 text-[11px] font-semibold tracking-[0.1em] text-[#bd6d4d]"><span className="h-px w-6 bg-[#bd6d4d]" />روایت بازار</p>
                  <h2 className="text-[29px] font-semibold leading-[1.35] tracking-[-0.055em] text-[#203b35] sm:text-[38px]">روزت را از روی<br /><span className="text-[#6c8c82]">ترتیب تصمیم‌ها بخوان.</span></h2>
                  <p className="mt-3 max-w-[500px] text-[13px] leading-7 text-[#74817b]">هر معامله یک نقطه‌ی جدا نیست؛ بخشی از زنجیره‌ای است که از حال ذهن شروع می‌شود.</p>
                </div>
                <button type="button" onClick={() => openAnnotator("nq-open")} className="flex min-h-[48px] shrink-0 items-center justify-center gap-2 rounded-[15px] bg-[#bd6d4d] px-4 text-[12px] font-semibold text-[#fff8ec] shadow-[0_10px_20px_rgba(191,107,69,.15)] hover:bg-[#aa5938]"><Plus className="h-4 w-4" />ثبت رویداد</button>
              </div>

              <div className="mt-7 flex items-center justify-between gap-3 overflow-x-auto rounded-[18px] border border-[#d9dfd7] bg-[#faf9f4] p-1.5">
                {["امروز", "دوشنبه", "یکشنبه", "شنبه"].map((day) => <button key={day} type="button" onClick={() => setActiveDay(day)} className={`min-w-[86px] rounded-[13px] px-4 py-2.5 text-[11px] transition-colors ${activeDay === day ? "bg-[#315d56] font-semibold text-[#fbf8ee] shadow-[0_5px_12px_rgba(49,93,86,.14)]" : "text-[#849189] hover:bg-[#edf2ec] hover:text-[#315d56]"}`}>{day}<span className={`mt-0.5 block text-[9px] ${activeDay === day ? "text-[#bdd2c7]" : "text-[#a4ada7]"}`}>{day === "امروز" ? "۲۱ خرداد" : "۲۰ خرداد"}</span></button>)}
                <button type="button" onClick={() => setActiveDay("تقویم")} className="grid h-9 w-9 shrink-0 place-items-center rounded-xl text-[#8a9790] hover:bg-[#edf2ec] hover:text-[#315d56]" aria-label="تقویم"><CalendarDays className="h-4 w-4" /></button>
              </div>

              <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2 text-[12px] font-semibold text-[#38574d]"><Clock3 className="h-4 w-4 text-[#bd6d4d]" />خط زمانی {activeDay}<span className="text-[10px] font-normal text-[#9aa59e]"> · ۵ رویداد</span></div>
                <div className="flex items-center gap-2">
                  <span className="flex items-center gap-1.5 text-[10px] text-[#89968f]"><Filter className="h-3.5 w-3.5" />فیلتر</span>
                  {(["همه", "بردها", "ضررها"] as const).map((value) => <button type="button" key={value} onClick={() => setFilter(value)} className={`rounded-lg px-2.5 py-1.5 text-[10px] ${filter === value ? "bg-[#dcebe2] font-semibold text-[#39766d]" : "text-[#929e97] hover:bg-[#edf2ec]"}`}>{value}</button>)}
                </div>
              </div>

              <div className="mt-4 space-y-3">
                {visibleTrades.map((trade) => <TradeCard key={trade.id} trade={trade} expanded={expandedTrade === trade.id} onToggle={() => setExpandedTrade(expandedTrade === trade.id ? "" : trade.id)} onAnnotate={() => openAnnotator(trade.id)} />)}
                {visibleTrades.length === 0 && <div className="rounded-[22px] border border-dashed border-[#cbd7cc] bg-[#f7f7f0] px-5 py-12 text-center"><Bookmark className="mx-auto h-7 w-7 text-[#a7b7aa]" /><p className="mt-3 text-[13px] font-semibold text-[#557168]">هنوز رویدادی در این فیلتر نیست</p><p className="mt-1 text-[11px] text-[#97a49c]">فیلتر دیگری را امتحان کن.</p></div>}
              </div>

              <div className="mt-6 rounded-[20px] border border-[#d5e0d6] bg-[#e6efe7] px-4 py-3.5 sm:px-5">
                <div className="flex items-start gap-3"><span className="grid h-8 w-8 shrink-0 place-items-center rounded-xl bg-[#315d56] text-[#f6d18b]"><Sparkles className="h-4 w-4" /></span><div><p className="text-[11px] font-semibold text-[#315d56]">حاشیه‌ی امروز</p><p className="mt-1 text-[11px] leading-6 text-[#557268]">{savedAnnotation || "بین دو معامله فقط ۴۴ دقیقه فاصله بود؛ کیفیت مکث را هم مثل نتیجه ثبت کن."}</p></div></div>
              </div>
            </section>

            <aside className="space-y-5 lg:pt-[188px]">
              <div className="rounded-[24px] border border-[#cfdcd2] bg-[#e7eee7] p-5 text-[#29483f] shadow-[0_16px_38px_rgba(49,93,86,.07)]">
                <div className="flex items-center justify-between"><div><p className="text-[11px] font-semibold text-[#315d56]">وضعیت این روز</p><p className="mt-1 text-[10px] text-[#789087]">خلاصه‌ای که همراه تایم‌لاین می‌ماند</p></div><span className="grid h-9 w-9 place-items-center rounded-xl bg-[#315d56] text-[#f6d18b]"><ShieldCheck className="h-4 w-4" /></span></div>
                <div className="mt-5 grid grid-cols-2 gap-2"><div className="rounded-[15px] bg-[#f4f5ef] p-3"><p className="text-[9px] text-[#84928b]">نتیجه امروز</p><p className="mt-1 text-[17px] font-semibold text-[#3b7a6d]">+$۱۱۱٫۷۰</p></div><div className="rounded-[15px] bg-[#f4f5ef] p-3"><p className="text-[9px] text-[#84928b]">ریسک مصرف‌شده</p><p className="mt-1 text-[17px] font-semibold text-[#315d56]">۰٫۴R</p></div></div>
                <div className="mt-3 rounded-[15px] bg-[#f4f5ef] p-3"><div className="flex items-center justify-between text-[10px]"><span className="text-[#84928b]">قانون امروز</span><span className="font-medium text-[#315d56]">تأیید دوم</span></div><div className="mt-3 h-1.5 overflow-hidden rounded-full bg-[#dce5dc]"><div className="h-full w-[72%] rounded-full bg-[#4a8279]" /></div><p className="mt-2 text-[9px] text-[#8a9990]">۷۲٪ از ظرفیت تمرکز حفظ شده</p></div>
              </div>

              <div className="rounded-[24px] border border-[#d9dfd7] bg-[#faf9f4] p-5">
                <div className="flex items-center justify-between"><div><h3 className="flex items-center gap-2 text-[13px] font-semibold text-[#38574d]"><Clock3 className="h-4 w-4 text-[#bd6d4d]" />ردپای روز</h3><p className="mt-1 text-[10px] text-[#909b94]">رویدادها، نه فقط خروجی‌ها</p></div><button type="button" onClick={() => setActiveDay("تقویم")} className="text-[#89968f] hover:text-[#315d56]" aria-label="گزینه‌ها"><MoreHorizontal className="h-4 w-4" /></button></div>
                <div className="mt-5">{events.map((event, index) => <TimelineEventRow key={`${event.time}-${event.label}`} event={event} isLast={index === events.length - 1} />)}</div>
              </div>

              <div className="rounded-[22px] bg-[#315d56] p-5 text-[#f7f3e9]">
                <div className="flex items-center gap-2 text-[10px] text-[#bed1c6]"><Tag className="h-3.5 w-3.5 text-[#f6d18b]" />سرنخ تکرارشونده</div>
                <p className="mt-3 text-[17px] font-semibold leading-7">وقتی صبر می‌کنی،<br />ورودها واضح‌تر می‌شوند.</p>
                <button type="button" onClick={() => openAnnotator("nq-open")} className="mt-5 flex items-center gap-1.5 text-[10px] font-medium text-[#f6d18b] hover:text-[#fff1c9]">ثبت در دفتر الگوها <ArrowDownLeft className="h-3.5 w-3.5" /></button>
              </div>
            </aside>
          </div>
        </main>
      </div>

      {showAnnotator && (
        <div className="fixed inset-0 z-[60] flex items-end justify-center bg-[#203b35]/25 p-0 backdrop-blur-[3px] sm:items-center sm:p-5">
          <div className="w-full max-w-[510px] rounded-t-[28px] border border-[#d8ddd4] bg-[#faf9f4] p-6 shadow-[0_25px_70px_rgba(32,59,53,.2)] sm:rounded-[28px]">
            <div className="flex items-start justify-between"><div><p className="text-[10px] font-semibold tracking-[0.1em] text-[#bd6d4d]">حاشیه‌ی درون خط</p><h2 className="mt-2 text-[21px] font-semibold tracking-[-0.04em] text-[#29443d]">به {selectedTrade.symbol} چه چیزی اضافه می‌کنی؟</h2><p className="mt-1 text-[11px] text-[#87928c]">{selectedTrade.setup} · {selectedTrade.time}</p></div><button type="button" onClick={() => setShowAnnotator(false)} className="grid h-9 w-9 place-items-center rounded-xl bg-[#edf0e9] text-[#6e7c75] hover:bg-[#e3e8e0]" aria-label="بستن"><X className="h-4 w-4" /></button></div>
            <textarea autoFocus value={annotation} onChange={(event) => setAnnotation(event.target.value)} placeholder="مثلاً: قبل از ورود، چه چیزی را دیدی که قابل تکرار است؟" className="mt-6 min-h-[125px] w-full resize-none rounded-[18px] border border-[#d8ded6] bg-[#f2f3ed] p-4 text-[13px] leading-7 text-[#203b35] outline-none placeholder:text-[#a1aaa3] focus:border-[#6f9d92] focus:ring-4 focus:ring-[#6f9d92]/10" />
            <div className="mt-4 flex items-center justify-between gap-3"><span className="flex items-center gap-1.5 text-[10px] text-[#87928c]"><CircleHelp className="h-3.5 w-3.5" />این حاشیه به همین رویداد وصل می‌شود</span><button type="button" onClick={saveAnnotation} disabled={!annotation.trim()} className="flex min-h-[44px] items-center gap-2 rounded-xl bg-[#315d56] px-4 text-[11px] font-semibold text-[#faf7ed] disabled:cursor-not-allowed disabled:opacity-40"><Check className="h-4 w-4" />ذخیره حاشیه</button></div>
          </div>
        </div>
      )}
    </div>
  );
}