import { useMemo, useState, type FormEvent } from "react";
import {
  Activity,
  ArrowDownLeft,
  Bell,
  CalendarDays,
  Check,
  ChevronDown,
  ChevronLeft,
  ChevronUp,
  CircleHelp,
  Clock3,
  Command,
  Crosshair,
  Filter,
  Flag,
  History,
  Menu,
  MessageSquarePlus,
  MoreHorizontal,
  PanelRight,
  PenLine,
  Plus,
  Settings2,
  ShieldCheck,
  Sparkles,
  Target,
  Timer,
  TrendingUp,
  X,
  type LucideIcon,
} from "lucide-react";

type FilterKey = "همه" | "بردها" | "ضررها" | "یادداشت‌دار";

type Trade = {
  id: string;
  symbol: string;
  side: "خرید" | "فروش";
  setup: string;
  time: string;
  duration: string;
  pnl: string;
  r: string;
  outcome: "برد" | "ضرر";
  accent: string;
  context: string;
  note: string;
  tags: string[];
};

type TimelineGroup = {
  label: string;
  date: string;
  trades: Trade[];
};

const timelineGroups: TimelineGroup[] = [
  {
    label: "امروز",
    date: "سه‌شنبه، ۲۱ خرداد",
    trades: [
      {
        id: "nq-1042",
        symbol: "NQ",
        side: "خرید",
        setup: "Opening range reclaim",
        time: "۱۰:۴۲",
        duration: "۳۶ دقیقه",
        pnl: "+$184.20",
        r: "+۲٫۰R",
        outcome: "برد",
        accent: "#b96649",
        context: "بازگشت به محدوده‌ی بازگشایی بعد از جمع‌کردن نقدینگی زیر کف.",
        note: "ورود دیرهنگام نبود؛ برای تأیید دوم صبر کردم.",
        tags: ["صبر", "A+ setup"],
      },
      {
        id: "es-0958",
        symbol: "ES",
        side: "فروش",
        setup: "VWAP fade",
        time: "۰۹:۵۸",
        duration: "۱۸ دقیقه",
        pnl: "-$72.50",
        r: "-۰٫۸R",
        outcome: "ضرر",
        accent: "#4d8178",
        context: "برگشت از VWAP در بازه‌ای کم‌دامنه؛ ادامه‌دار نشد.",
        note: "بعد از شکست اول، حجم کافی برای ادامه نبود.",
        tags: ["حجم کم"],
      },
    ],
  },
  {
    label: "دیروز",
    date: "دوشنبه، ۲۰ خرداد",
    trades: [
      {
        id: "eur-1624",
        symbol: "EURUSD",
        side: "خرید",
        setup: "London sweep",
        time: "۱۶:۲۴",
        duration: "۵۴ دقیقه",
        pnl: "+$246.00",
        r: "+۲٫۴R",
        outcome: "برد",
        accent: "#a07d3e",
        context: "شکار نقدینگی جلسه‌ی لندن و بازپس‌گیری سقف روز قبل.",
        note: "از برنامه خارج نشدم؛ خروج روی تارگت دوم انجام شد.",
        tags: ["جلسه لندن", "تارگت دوم"],
      },
      {
        id: "btc-1208",
        symbol: "BTCUSD",
        side: "فروش",
        setup: "Range expansion",
        time: "۱۲:۰۸",
        duration: "۲۲ دقیقه",
        pnl: "+$91.80",
        r: "+۱٫۱R",
        outcome: "برد",
        accent: "#826661",
        context: "فشردگی سه‌ساعته و گسترش محدوده با ورود حجم.",
        note: "ریسک کوچک بود، بنابراین اجازه دادم معامله نفس بکشد.",
        tags: ["نوسان", "ریسک کم"],
      },
    ],
  },
];

const railItems: { label: string; caption: string; icon: LucideIcon }[] = [
  { label: "خط زمانی", caption: "امروز", icon: History },
  { label: "گزارش‌ها", caption: "۱۲ هفته", icon: TrendingUp },
  { label: "قواعد من", caption: "۷ اصل", icon: ShieldCheck },
];

function StatPill({
  label,
  value,
  tone,
  icon: Icon,
}: {
  label: string;
  value: string;
  tone: "teal" | "coral" | "gold";
  icon: LucideIcon;
}) {
  const tones = {
    teal: "bg-[#e2efe9] text-[#39776e]",
    coral: "bg-[#f6e6de] text-[#a6533d]",
    gold: "bg-[#f4ecd6] text-[#947331]",
  };
  return (
    <div className="flex items-center gap-2.5 rounded-[14px] border border-[#dde2d9] bg-[#fbfaf6] px-3 py-2.5">
      <span className={`grid h-7 w-7 place-items-center rounded-lg ${tones[tone]}`}>
        <Icon className="h-3.5 w-3.5" strokeWidth={1.8} />
      </span>
      <span className="min-w-0">
        <span className="block text-[10px] text-[#8a968e]">{label}</span>
        <span className="mt-0.5 block text-[13px] font-semibold tracking-[-0.02em] text-[#24453d]">{value}</span>
      </span>
    </div>
  );
}

function TradeCard({
  trade,
  expanded,
  onToggle,
  onAnnotate,
  isAnnotating,
  draft,
  setDraft,
  onSaveAnnotation,
}: {
  trade: Trade;
  expanded: boolean;
  onToggle: () => void;
  onAnnotate: () => void;
  isAnnotating: boolean;
  draft: string;
  setDraft: (value: string) => void;
  onSaveAnnotation: (event: FormEvent<HTMLFormElement>) => void;
}) {
  const isWin = trade.outcome === "برد";
  return (
    <article className={`relative rounded-[20px] border bg-[#fbfaf6] transition-all duration-200 ${expanded ? "border-[#a9cabc] shadow-[0_14px_32px_rgba(48,77,71,.08)]" : "border-[#dfe3db] hover:border-[#c1d5ca]"}`}>
      <div className="absolute -right-[39px] top-6 hidden h-3.5 w-3.5 rounded-full border-[3px] border-[#f1eee6] bg-[#477f73] shadow-[0_0_0_1px_#9fc0b5] sm:block" />
      <button type="button" onClick={onToggle} className="flex w-full items-start gap-3.5 p-4 text-right sm:p-5">
        <span className="grid h-11 w-11 shrink-0 place-items-center rounded-[14px] text-[11px] font-bold text-[#fff8ed]" style={{ backgroundColor: trade.accent }}>
          {trade.symbol.slice(0, 3)}
        </span>
        <span className="min-w-0 flex-1">
          <span className="flex flex-wrap items-center gap-2">
            <span className="text-[13px] font-semibold tracking-[-0.02em] text-[#25453d]">{trade.setup}</span>
            <span className={`rounded-full px-2 py-0.5 text-[9px] ${isWin ? "bg-[#e3f0e9] text-[#3d7f72]" : "bg-[#f8e8e0] text-[#a95a43]"}`}>{trade.outcome}</span>
          </span>
          <span className="mt-1.5 flex flex-wrap items-center gap-x-2 gap-y-1 text-[10px] text-[#89958d]">
            <span>{trade.symbol}</span><span className="text-[#c2c9c2]">·</span><span>{trade.side}</span><span className="text-[#c2c9c2]">·</span><span className="inline-flex items-center gap-1"><Clock3 className="h-3 w-3" />{trade.time}</span>
          </span>
        </span>
        <span className="flex shrink-0 items-center gap-2">
          <span className={`text-[13px] font-semibold ${isWin ? "text-[#3d7f72]" : "text-[#af5d46]"}`}>{trade.pnl}</span>
          <span className="grid h-7 w-7 place-items-center rounded-lg text-[#93a099]">{expanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}</span>
        </span>
      </button>
      {expanded && (
        <div className="border-t border-[#e6e9e2] px-4 pb-4 pt-3.5 sm:px-5 sm:pb-5">
          <div className="grid gap-3 sm:grid-cols-[1fr_auto]">
            <div>
              <p className="text-[11px] leading-6 text-[#62756c]">{trade.context}</p>
              <div className="mt-3 flex flex-wrap gap-1.5">
                {trade.tags.map((tag) => <span key={tag} className="rounded-md bg-[#edf1eb] px-2 py-1 text-[9px] text-[#64796f]">#{tag}</span>)}
              </div>
            </div>
            <div className="flex gap-2 sm:flex-col sm:items-end">
              <span className="rounded-lg bg-[#f0f2eb] px-2.5 py-1.5 text-[10px] text-[#718079]">{trade.r}</span>
              <span className="rounded-lg bg-[#f0f2eb] px-2.5 py-1.5 text-[10px] text-[#718079]">{trade.duration}</span>
            </div>
          </div>
          <div className="mt-4 rounded-[13px] bg-[#f1f3ed] px-3 py-2.5">
            <div className="flex items-start gap-2">
              <PenLine className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#ba6a4c]" />
              <p className="text-[10px] leading-6 text-[#6f7f77]">{trade.note}</p>
            </div>
          </div>
          {isAnnotating ? (
            <form onSubmit={onSaveAnnotation} className="mt-3 flex gap-2">
              <input autoFocus value={draft} onChange={(event) => setDraft(event.target.value)} placeholder="یک مشاهده‌ی تازه اضافه کن..." className="min-w-0 flex-1 rounded-xl border border-[#c9dad0] bg-[#fffdf8] px-3 py-2 text-[11px] text-[#294a41] outline-none focus:ring-4 focus:ring-[#6d9d91]/10" />
              <button type="submit" disabled={!draft.trim()} className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-[#315d56] text-[#f9f3e7] disabled:opacity-40"><Check className="h-4 w-4" /></button>
            </form>
          ) : (
            <button type="button" onClick={onAnnotate} className="mt-3 flex items-center gap-1.5 text-[10px] font-medium text-[#3e7a70] hover:text-[#ad5b43]"><MessageSquarePlus className="h-3.5 w-3.5" />افزودن حاشیه‌ی درون‌خطی</button>
          )}
        </div>
      )}
    </article>
  );
}

export default function TraderMindChronicle() {
  const [activeRail, setActiveRail] = useState("خط زمانی");
  const [filter, setFilter] = useState<FilterKey>("همه");
  const [expanded, setExpanded] = useState<string | null>("nq-1042");
  const [annotating, setAnnotating] = useState<string | null>(null);
  const [draft, setDraft] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [contextOpen, setContextOpen] = useState(true);
  const [captureOpen, setCaptureOpen] = useState(false);
  const [captureNote, setCaptureNote] = useState("");
  const [toast, setToast] = useState("");

  const visibleGroups = useMemo(() => timelineGroups.map((group) => ({
    ...group,
    trades: group.trades.filter((trade) => filter === "همه" || (filter === "بردها" && trade.outcome === "برد") || (filter === "ضررها" && trade.outcome === "ضرر") || (filter === "یادداشت‌دار" && trade.note)),
  })).filter((group) => group.trades.length > 0), [filter]);

  const saveAnnotation = (event: FormEvent<HTMLFormElement>, tradeId: string) => {
    event.preventDefault();
    if (!draft.trim()) return;
    setToast("حاشیه به خط زمانی اضافه شد");
    setDraft("");
    setAnnotating(null);
    window.setTimeout(() => setToast(""), 2400);
    setExpanded(tradeId);
  };

  const saveCapture = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!captureNote.trim()) return;
    setCaptureNote("");
    setCaptureOpen(false);
    setToast("مشاهده‌ی سریع ذخیره شد");
    window.setTimeout(() => setToast(""), 2400);
  };

  return (
    <div dir="rtl" className="min-h-[100dvh] overflow-x-hidden bg-[#f1eee6] text-[#24453d]" style={{ fontFamily: "'Vazirmatn', 'Noto Sans Arabic', sans-serif" }}>
      <style>{`
        .tm-chronicle-grid { background-image: linear-gradient(rgba(49,93,86,.035) 1px, transparent 1px), linear-gradient(90deg, rgba(49,93,86,.035) 1px, transparent 1px); background-size: 30px 30px; }
        .tm-chronicle-scroll::-webkit-scrollbar { width: 5px; height: 5px; }
        .tm-chronicle-scroll::-webkit-scrollbar-thumb { background: #c8d0c8; border-radius: 999px; }
        @keyframes tm-chronicle-rise { from { opacity: 0; transform: translateY(7px); } to { opacity: 1; transform: translateY(0); } }
        .tm-chronicle-rise > * { animation: tm-chronicle-rise .5s cubic-bezier(.22,1,.36,1) both; }
        .tm-chronicle-rise > *:nth-child(2) { animation-delay: .07s; } .tm-chronicle-rise > *:nth-child(3) { animation-delay: .14s; } .tm-chronicle-rise > *:nth-child(4) { animation-delay: .21s; }
        @media (prefers-reduced-motion: reduce) { .tm-chronicle-rise > * { animation: none; } }
      `}</style>
      <div className="mx-auto flex min-h-[100dvh] max-w-[1680px]">
        <aside className={`fixed inset-y-0 right-0 z-40 w-[250px] border-l border-[#d9ddd4] bg-[#e8ece5] px-4 py-5 transition-transform duration-300 lg:sticky lg:top-0 lg:h-[100dvh] lg:translate-x-0 ${sidebarOpen ? "translate-x-0 shadow-[-20px_0_50px_rgba(32,59,53,.12)]" : "translate-x-full"}`}>
          <div className="flex h-full flex-col">
            <div className="flex items-center justify-between px-1">
              <div className="flex items-center gap-2.5">
                <div className="grid h-10 w-10 place-items-center rounded-[14px] bg-[#315d56] text-[#f6d18b] shadow-[0_8px_16px_rgba(49,93,86,.18)]"><Crosshair className="h-5 w-5" strokeWidth={1.6} /></div>
                <div><p className="text-[15px] font-semibold tracking-[-0.04em]">TraderMind</p><p className="text-[9px] tracking-[0.17em] text-[#718079]">CHRONICLE / 05</p></div>
              </div>
              <button type="button" onClick={() => setSidebarOpen(false)} className="grid h-8 w-8 place-items-center rounded-lg text-[#718079] hover:bg-[#dce4dc] lg:hidden" aria-label="بستن منو"><X className="h-4 w-4" /></button>
            </div>
            <div className="mt-8 rounded-[18px] border border-[#ccd8cd] bg-[#f3f5ef] p-3.5">
              <div className="flex items-center justify-between"><span className="flex items-center gap-2 text-[10px] text-[#68786f]"><span className="h-2 w-2 rounded-full bg-[#bf6b45] shadow-[0_0_0_4px_rgba(191,107,69,.12)]" />دفتر زنده</span><Settings2 className="h-3.5 w-3.5 text-[#829089]" /></div>
              <p className="mt-3 text-[14px] font-semibold">هفته‌ی سوم خرداد</p>
              <p className="mt-1 text-[10px] leading-5 text-[#849189]">۱۲ معامله · ۳ حاشیه‌ی تازه</p>
            </div>
            <p className="mb-2 mt-8 px-2 text-[10px] font-semibold tracking-[0.14em] text-[#94a099]">فضای کار</p>
            <nav className="space-y-1.5">
              {railItems.map(({ label, caption, icon: Icon }) => (
                <button type="button" key={label} onClick={() => { setActiveRail(label); setSidebarOpen(false); }} className={`flex min-h-[54px] w-full items-center gap-3 rounded-[15px] px-3 text-right transition-all ${activeRail === label ? "bg-[#315d56] text-[#fbf8ee] shadow-[0_8px_18px_rgba(49,93,86,.16)]" : "text-[#63736c] hover:bg-[#dce5dd] hover:text-[#203b35]"}`}>
                  <span className={`grid h-8 w-8 place-items-center rounded-xl ${activeRail === label ? "bg-white/10 text-[#f6d18b]" : "bg-[#f5f5ee] text-[#718079]"}`}><Icon className="h-[16px] w-[16px]" strokeWidth={1.7} /></span>
                  <span className="flex-1"><span className="block text-[12px] font-semibold">{label}</span><span className={`mt-0.5 block text-[10px] ${activeRail === label ? "text-[#c8d9cf]" : "text-[#8b9790]"}`}>{caption}</span></span>
                  <ChevronLeft className={`h-4 w-4 ${activeRail === label ? "text-[#f6d18b]" : "opacity-0"}`} />
                </button>
              ))}
            </nav>
            <div className="mt-auto">
              <button type="button" onClick={() => setCaptureOpen(true)} className="flex min-h-[46px] w-full items-center justify-center gap-2 rounded-[14px] bg-[#bf6b45] text-[11px] font-semibold text-[#fff8ec] shadow-[0_8px_16px_rgba(191,107,69,.18)] hover:bg-[#aa5938]"><MessageSquarePlus className="h-4 w-4" />ثبت مشاهده‌ی سریع</button>
              <div className="mt-4 flex items-center justify-between px-1 text-[10px] text-[#8a9890]"><span className="flex items-center gap-1.5"><ShieldCheck className="h-3.5 w-3.5 text-[#4d897c]" />ذخیره‌سازی محلی</span><CircleHelp className="h-3.5 w-3.5" /></div>
            </div>
          </div>
        </aside>
        {sidebarOpen && <button type="button" onClick={() => setSidebarOpen(false)} className="fixed inset-0 z-30 bg-[#203b35]/20 backdrop-blur-[2px] lg:hidden" aria-label="بستن منو" />}

        <main className="tm-chronicle-grid min-w-0 flex-1">
          <header className="sticky top-0 z-20 border-b border-[#dfe2d8]/90 bg-[#f1eee6]/90 px-4 py-3.5 backdrop-blur-xl sm:px-7 lg:px-9">
            <div className="mx-auto flex max-w-[1320px] items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <button type="button" onClick={() => setSidebarOpen(true)} className="grid h-9 w-9 place-items-center rounded-xl border border-[#d8ddd4] bg-[#faf9f4] text-[#52665d] lg:hidden" aria-label="باز کردن منو"><Menu className="h-5 w-5" /></button>
                <div className="hidden h-9 w-9 place-items-center rounded-xl bg-[#315d56] text-[#f6d18b] lg:grid"><Command className="h-4 w-4" /></div>
                <div><p className="text-[10px] text-[#82908a]">سه‌شنبه، ۲۱ خرداد ۱۴۰۳</p><h1 className="mt-0.5 text-[16px] font-semibold tracking-[-0.03em]">خط زمانی تصمیم‌ها</h1></div>
              </div>
              <div className="flex items-center gap-2">
                <button type="button" onClick={() => setContextOpen((value) => !value)} className="hidden h-9 items-center gap-2 rounded-xl border border-[#d8ddd4] bg-[#faf9f4] px-3 text-[10px] text-[#66776f] hover:text-[#315d56] md:flex"><PanelRight className="h-3.5 w-3.5" />پنل زمینه</button>
                <button type="button" onClick={() => setCaptureOpen(true)} className="grid h-9 w-9 place-items-center rounded-xl bg-[#315d56] text-[#f6d18b] hover:bg-[#274c46]" aria-label="ثبت مشاهده"><PenLine className="h-4 w-4" /></button>
                <button type="button" onClick={() => setToast("همه‌چیز تا همین لحظه ثبت شده است")} className="relative grid h-9 w-9 place-items-center rounded-xl border border-[#d8ddd4] bg-[#faf9f4] text-[#6e7d76] hover:text-[#315d56]" aria-label="اعلان‌ها"><Bell className="h-4 w-4" /><span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-[#bf6b45]" /></button>
              </div>
            </div>
          </header>

          <div className="mx-auto max-w-[1320px] px-4 py-6 sm:px-7 lg:px-9 lg:py-8">
            <div className="tm-chronicle-rise grid gap-6 xl:grid-cols-[minmax(0,1fr)_284px]">
              <section className="min-w-0">
                <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
                  <div>
                    <p className="mb-2.5 flex items-center gap-2 text-[10px] font-semibold tracking-[0.1em] text-[#bf6b45]"><span className="h-px w-6 bg-[#bf6b45]" />ردپای تصمیم‌ها</p>
                    <h2 className="text-[29px] font-semibold leading-[1.35] tracking-[-0.055em] text-[#203b35] sm:text-[36px]">هر معامله، یک جمله<br /><span className="text-[#64817a]">بعد از آن چه دیدی؟</span></h2>
                    <p className="mt-2 max-w-[500px] text-[12px] leading-6 text-[#7b8981]">به‌جای ورق‌زدن جدول‌ها، مسیر تصمیم را از اولین مشاهده تا خروج دنبال کن.</p>
                  </div>
                  <button type="button" onClick={() => setCaptureOpen(true)} className="flex min-h-[43px] shrink-0 items-center justify-center gap-2 rounded-[13px] bg-[#bf6b45] px-4 text-[11px] font-semibold text-[#fff8ec] shadow-[0_8px_17px_rgba(191,107,69,.16)] hover:bg-[#aa5938]"><Plus className="h-4 w-4" />افزودن به خط زمانی</button>
                </div>
                <div className="mt-6 grid grid-cols-3 gap-2.5 sm:max-w-[570px]">
                  <StatPill label="نرخ برد" value="۶۴٫۷٪" tone="teal" icon={Target} />
                  <StatPill label="ریتم امروز" value="+۱٫۲R" tone="gold" icon={Activity} />
                  <StatPill label="حاشیه‌های تازه" value="۳" tone="coral" icon={PenLine} />
                </div>

                <div className="mt-7 flex flex-wrap items-center justify-between gap-3 border-b border-[#dce1d9] pb-3">
                  <div className="flex items-center gap-1 rounded-xl bg-[#e9ede6] p-1">
                    {(["همه", "بردها", "ضررها", "یادداشت‌دار"] as FilterKey[]).map((item) => <button type="button" key={item} onClick={() => setFilter(item)} className={`rounded-lg px-2.5 py-1.5 text-[10px] transition-colors sm:px-3 ${filter === item ? "bg-[#fbfaf6] font-semibold text-[#315d56] shadow-sm" : "text-[#89958e] hover:text-[#315d56]"}`}>{item}</button>)}
                  </div>
                  <button type="button" onClick={() => setToast("مرتب‌سازی بر اساس زمان فعال است")} className="flex items-center gap-1.5 text-[10px] text-[#78867e] hover:text-[#315d56]"><Filter className="h-3.5 w-3.5" />قدیمی‌تر ← جدیدتر</button>
                </div>

                <div className="tm-chronicle-scroll mt-6 space-y-8 overflow-x-visible">
                  {visibleGroups.length > 0 ? visibleGroups.map((group) => (
                    <section key={group.label} className="relative pr-0 sm:pr-9">
                      <div className="mb-3 flex items-center gap-3">
                        <span className="text-[11px] font-semibold text-[#48665d]">{group.label}</span><span className="h-px flex-1 bg-[#dce1d9]" /><span className="text-[10px] text-[#9ba69f]">{group.date}</span>
                      </div>
                      <div className="relative space-y-3 sm:border-r sm:border-dashed sm:border-[#bfcfc5] sm:pr-7">
                        {group.trades.map((trade) => <TradeCard key={trade.id} trade={trade} expanded={expanded === trade.id} onToggle={() => setExpanded(expanded === trade.id ? null : trade.id)} onAnnotate={() => { setAnnotating(trade.id); setExpanded(trade.id); }} isAnnotating={annotating === trade.id} draft={draft} setDraft={setDraft} onSaveAnnotation={(event) => saveAnnotation(event, trade.id)} />)}
                      </div>
                    </section>
                  )) : (
                    <div className="rounded-[20px] border border-dashed border-[#cbd6cd] bg-[#f8f8f2] px-5 py-12 text-center"><Sparkles className="mx-auto h-6 w-6 text-[#ba795d]" /><p className="mt-3 text-[13px] font-semibold">این بازه هنوز خلوت است</p><p className="mt-1 text-[11px] text-[#89958e]">فیلتر دیگری را امتحان کن یا اولین مشاهده را ثبت کن.</p></div>
                  )}
                </div>
              </section>

              {contextOpen && <aside className="space-y-4 xl:pt-[145px]">
                <section className="rounded-[22px] border border-[#d9ddd4] bg-[#315d56] p-5 text-[#f7f3e9] shadow-[0_12px_25px_rgba(49,93,86,.12)]">
                  <div className="flex items-start justify-between"><div><p className="text-[10px] text-[#b9d0c5]">زمینه‌ی امروز</p><h3 className="mt-2 text-[19px] font-semibold leading-8 tracking-[-0.04em]">قبل از عددها،<br />ریتم را ببین.</h3></div><span className="grid h-9 w-9 place-items-center rounded-xl bg-white/10 text-[#f6d18b]"><Crosshair className="h-4 w-4" /></span></div>
                  <div className="mt-5 rounded-[16px] border border-white/10 bg-[#244b45] p-3.5"><div className="flex items-center gap-2 text-[10px] text-[#bed1c6]"><Timer className="h-3.5 w-3.5 text-[#f6d18b]" />تمرکز فعال</div><p className="mt-2 text-[12px] leading-6 text-[#edf1e9]">بعد از شکست، برای تأیید دوم عجله نکن.</p></div>
                  <button type="button" onClick={() => setActiveRail("قواعد من")} className="mt-4 flex items-center gap-1 text-[10px] font-medium text-[#f6d18b] hover:text-[#fff1c9]">باز کردن قواعد من <ArrowDownLeft className="h-3.5 w-3.5" /></button>
                </section>
                <section className="rounded-[22px] border border-[#d9ddd4] bg-[#fbfaf6] p-5">
                  <div className="flex items-center justify-between"><div><h3 className="flex items-center gap-2 text-[13px] font-semibold"><Flag className="h-4 w-4 text-[#ba6a4c]" />نقطه‌ی توجه</h3><p className="mt-1 text-[10px] text-[#89958e]">بر اساس سه جلسه‌ی اخیر</p></div><MoreHorizontal className="h-4 w-4 text-[#a1aaa4]" /></div>
                  <p className="mt-4 text-[11px] leading-6 text-[#6e7d75]">بهترین تصمیم‌هایت زمانی اتفاق افتاده‌اند که بعد از ورود، کمتر دخالت کرده‌ای.</p>
                  <div className="mt-4 flex items-center gap-2 text-[10px] text-[#8a968f]"><span className="h-2 w-2 rounded-full bg-[#4d897c]" />۴ مورد مشابه در این هفته</div>
                </section>
                <section className="rounded-[22px] border border-[#d9ddd4] bg-[#f7f4e9] p-5">
                  <div className="flex items-center gap-2 text-[12px] font-semibold"><CalendarDays className="h-4 w-4 text-[#a67642]" />جلسه‌ی بعدی</div>
                  <p className="mt-3 text-[12px] font-semibold text-[#365a50]">مرور پایان روز</p><p className="mt-1 text-[10px] text-[#89958e]">امروز · ۱۷:۳۰</p>
                  <button type="button" onClick={() => setToast("یادآوری مرور پایان روز تنظیم شد")} className="mt-4 flex w-full items-center justify-center gap-1.5 rounded-xl border border-[#d9d5c3] bg-[#fbfaf6] py-2 text-[10px] text-[#6b7b72] hover:border-[#b8c9bc] hover:text-[#315d56]"><Bell className="h-3.5 w-3.5" />یادآوری را فعال کن</button>
                </section>
              </aside>}
            </div>
          </div>
        </main>
      </div>

      {toast && <div className="fixed bottom-5 left-1/2 z-[60] -translate-x-1/2 rounded-xl bg-[#315d56] px-4 py-2.5 text-[11px] font-medium text-[#f7f3e9] shadow-[0_12px_28px_rgba(32,59,53,.2)]">{toast}</div>}
      {captureOpen && <div className="fixed inset-0 z-50 flex items-end justify-center bg-[#203b35]/25 p-0 backdrop-blur-[3px] sm:items-center sm:p-5">
        <div className="w-full max-w-[480px] rounded-t-[26px] border border-[#d8ddd4] bg-[#faf9f4] p-5 shadow-[0_25px_70px_rgba(32,59,53,.2)] sm:rounded-[26px] sm:p-6">
          <div className="flex items-start justify-between"><div><p className="text-[10px] font-semibold tracking-[0.08em] text-[#bf6b45]">حاشیه‌ی آزاد</p><h2 className="mt-2 text-[21px] font-semibold tracking-[-0.04em]">چه چیزی را دیدی؟</h2><p className="mt-1 text-[10px] text-[#87928c]">این مشاهده را به انتهای خط زمانی اضافه می‌کنیم.</p></div><button type="button" onClick={() => setCaptureOpen(false)} className="grid h-8 w-8 place-items-center rounded-xl bg-[#edf0e9] text-[#6e7c75]" aria-label="بستن"><X className="h-4 w-4" /></button></div>
          <form onSubmit={saveCapture} className="mt-5"><textarea autoFocus value={captureNote} onChange={(event) => setCaptureNote(event.target.value)} placeholder="مثلاً: امروز بعد از شکست سقف، منتظر پولبک ماندم..." className="min-h-[125px] w-full resize-none rounded-[16px] border border-[#d8ded6] bg-[#f2f3ed] p-3.5 text-[12px] leading-7 text-[#203b35] outline-none focus:border-[#6f9d92] focus:ring-4 focus:ring-[#6f9d92]/10" /><div className="mt-3 flex items-center justify-between gap-3"><span className="flex items-center gap-1 text-[10px] text-[#87928c]"><CircleHelp className="h-3.5 w-3.5" />خصوصی می‌ماند</span><button type="submit" disabled={!captureNote.trim()} className="flex min-h-[42px] items-center gap-2 rounded-xl bg-[#315d56] px-4 text-[11px] font-semibold text-[#faf7ed] disabled:opacity-40"><Check className="h-4 w-4" />ثبت در خط زمانی</button></div></form>
        </div>
      </div>}
    </div>
  );
}