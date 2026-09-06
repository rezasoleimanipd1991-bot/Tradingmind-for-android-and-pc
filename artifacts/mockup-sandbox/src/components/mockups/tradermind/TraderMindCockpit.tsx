import { useMemo, useState, type FormEvent } from "react";
import {
  Activity,
  ArrowDownLeft,
  ArrowUpRight,
  BarChart3,
  Bell,
  BookOpen,
  CalendarDays,
  Check,
  ChevronLeft,
  CircleHelp,
  CirclePause,
  CirclePlay,
  Command,
  Compass,
  Crosshair,
  FileText,
  Filter,
  Gauge,
  History,
  ListChecks,
  Menu,
  MessageSquarePlus,
  MoreHorizontal,
  PenLine,
  Plus,
  Search,
  ShieldCheck,
  SlidersHorizontal,
  Sparkles,
  Target,
  Timer,
  TrendingDown,
  TrendingUp,
  X,
  Zap,
  type LucideIcon,
} from "lucide-react";

type ViewKey = "now" | "review" | "improve";

interface TradeRow {
  symbol: string;
  side: "خرید" | "فروش";
  setup: string;
  time: string;
  pnl: string;
  result: "برد" | "ضرر";
  accent: string;
}

const navigation: { key: ViewKey; label: string; hint: string; icon: LucideIcon }[] = [
  { key: "now", label: "ایستگاه امروز", hint: "تمرکز فعلی", icon: Compass },
  { key: "review", label: "اتاق مرور", hint: "معاملات اخیر", icon: History },
  { key: "improve", label: "اتاق رشد", hint: "کشف الگوها", icon: Sparkles },
];

const trades: TradeRow[] = [
  { symbol: "NQ", side: "خرید", setup: "Opening range reclaim", time: "۱۰:۴۲", pnl: "+$184.20", result: "برد", accent: "#bf6b45" },
  { symbol: "ES", side: "فروش", setup: "VWAP fade", time: "۰۹:۵۸", pnl: "-$72.50", result: "ضرر", accent: "#437d76" },
  { symbol: "EURUSD", side: "خرید", setup: "London sweep", time: "دیروز · ۱۶:۲۴", pnl: "+$246.00", result: "برد", accent: "#9a7b3b" },
  { symbol: "BTCUSD", side: "فروش", setup: "Range expansion", time: "دیروز · ۱۲:۰۸", pnl: "+$91.80", result: "برد", accent: "#8b635d" },
];

const heatmap = [
  [0, 1, 0, 1, 1, 0, 1],
  [1, 1, 1, 0, 1, 1, 0],
  [0, 1, 1, 1, 0, 1, 1],
  [1, 0, 1, 1, 1, 0, 1],
  [1, 1, 0, 1, 1, 1, 0],
];

const chartPoints = "4,126 32,120 57,123 81,106 106,112 130,96 155,102 181,83 206,88 231,69 258,74 284,58 310,64 335,46 360,52 386,35 412,42";

function Metric({
  label,
  value,
  delta,
  tone,
  icon: Icon,
  onClick,
  active,
}: {
  label: string;
  value: string;
  delta: string;
  tone: "coral" | "teal" | "gold" | "ink";
  icon: LucideIcon;
  onClick: () => void;
  active: boolean;
}) {
  const toneClasses = {
    coral: "bg-[#f5e5dc] text-[#a44f39] border-[#e8c6b7]",
    teal: "bg-[#dceee9] text-[#2d7069] border-[#b9d9d2]",
    gold: "bg-[#f5edd7] text-[#967531] border-[#e6d6a8]",
    ink: "bg-[#e4e9e5] text-[#304d47] border-[#c8d4cd]",
  };

  return (
    <button
      type="button"
      onClick={onClick}
      className={`group min-h-[132px] rounded-[22px] border p-4 text-right transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_12px_24px_rgba(48,77,71,0.08)] ${
        active ? "border-[#315d56] bg-[#315d56] text-[#f7f3e9] shadow-[0_12px_28px_rgba(49,93,86,0.18)]" : "border-[#d9ddd4] bg-[#fbfaf6]"
      }`}
    >
      <div className="flex items-start justify-between gap-2">
        <span className={`grid h-9 w-9 place-items-center rounded-xl ${active ? "bg-white/15 text-[#f1bf71]" : toneClasses[tone]}`}>
          <Icon className="h-[17px] w-[17px]" strokeWidth={1.8} />
        </span>
        <span className={`text-[11px] ${active ? "text-[#bfd4c8]" : "text-[#82918a]"}`}>{delta}</span>
      </div>
      <p className={`mt-4 text-[12px] ${active ? "text-[#c9d8d1]" : "text-[#77827d]"}`}>{label}</p>
      <p className={`mt-0.5 text-[25px] font-semibold tracking-[-0.04em] ${active ? "text-[#fff9ed]" : "text-[#203b35]"}`}>{value}</p>
    </button>
  );
}

export default function TraderMindCockpit() {
  const [activeView, setActiveView] = useState<ViewKey>("now");
  const [range, setRange] = useState("۷ روز");
  const [activeMetric, setActiveMetric] = useState("نرخ برد");
  const [captureOpen, setCaptureOpen] = useState(false);
  const [note, setNote] = useState("");
  const [captureSaved, setCaptureSaved] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sessionRunning, setSessionRunning] = useState(false);
  const [selectedTrade, setSelectedTrade] = useState("NQ");

  const activeNav = useMemo(() => navigation.find((item) => item.key === activeView) ?? navigation[0], [activeView]);

  const handleCapture = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!note.trim()) return;
    setCaptureSaved(true);
    setNote("");
    window.setTimeout(() => setCaptureSaved(false), 2600);
  };

  return (
    <div
      dir="rtl"
      className="min-h-[100dvh] overflow-x-hidden bg-[#f1eee6] text-[#203b35]"
      style={{ fontFamily: "'Vazirmatn', 'Noto Sans Arabic', sans-serif" }}
    >
      <style>{`
        .tm-cockpit-scroll::-webkit-scrollbar { width: 5px; height: 5px; }
        .tm-cockpit-scroll::-webkit-scrollbar-thumb { background: #c8d0c8; border-radius: 999px; }
        .tm-grid-fade { background-image: linear-gradient(rgba(49,93,86,.045) 1px, transparent 1px), linear-gradient(90deg, rgba(49,93,86,.045) 1px, transparent 1px); background-size: 28px 28px; }
        .tm-stagger > * { animation: tm-rise .55s cubic-bezier(.22,1,.36,1) both; }
        .tm-stagger > *:nth-child(2) { animation-delay: .06s; }
        .tm-stagger > *:nth-child(3) { animation-delay: .12s; }
        .tm-stagger > *:nth-child(4) { animation-delay: .18s; }
        @keyframes tm-rise { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
        @media (prefers-reduced-motion: reduce) { .tm-stagger > * { animation: none; } }
      `}</style>

      <div className="mx-auto flex min-h-[100dvh] max-w-[1680px]">
        <aside
          className={`fixed inset-y-0 right-0 z-40 w-[280px] border-l border-[#d9ddd4] bg-[#e8ece5] px-5 py-6 transition-transform duration-300 lg:sticky lg:top-0 lg:h-[100dvh] lg:translate-x-0 ${
            sidebarOpen ? "translate-x-0 shadow-[-20px_0_50px_rgba(32,59,53,.12)]" : "translate-x-full"
          }`}
        >
          <div className="flex h-full flex-col">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="grid h-10 w-10 place-items-center rounded-[14px] bg-[#315d56] text-[#f6d18b] shadow-[0_8px_16px_rgba(49,93,86,.18)]">
                  <Crosshair className="h-5 w-5" strokeWidth={1.6} />
                </div>
                <div>
                  <p className="text-[15px] font-semibold tracking-[-0.03em] text-[#203b35]">TraderMind</p>
                  <p className="text-[10px] tracking-[0.18em] text-[#718079]">FIELD NOTES / 04</p>
                </div>
              </div>
              <button type="button" onClick={() => setSidebarOpen(false)} className="grid h-9 w-9 place-items-center rounded-xl text-[#6b7a73] hover:bg-[#dce4dc] lg:hidden" aria-label="بستن منو">
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="mt-10 rounded-[20px] border border-[#ccd8cd] bg-[#f3f5ef] p-3.5">
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-2 text-[11px] font-medium text-[#66766f]">
                  <span className="h-2 w-2 rounded-full bg-[#bb6e4e] shadow-[0_0_0_4px_rgba(187,110,78,.12)]" />
                  پروفایل تمرکز
                </span>
                <button type="button" onClick={() => setActiveView("improve")} className="text-[#315d56] hover:text-[#a44f39]" aria-label="ویرایش پروفایل">
                  <SlidersHorizontal className="h-4 w-4" strokeWidth={1.7} />
                </button>
              </div>
              <p className="mt-3 text-[15px] font-semibold">ساختن تصمیم‌های قابل تکرار</p>
              <div className="mt-3 flex items-center gap-2 text-[11px] text-[#718079]">
                <span className="rounded-md bg-[#e3ebe4] px-2 py-1 text-[#315d56]">۴۲ روز</span>
                <span>زنجیره ثبت روزانه</span>
              </div>
            </div>

            <p className="mb-2 mt-9 px-2 text-[10px] font-semibold tracking-[0.16em] text-[#94a099]">مسیر کاری</p>
            <nav className="space-y-1.5">
              {navigation.map(({ key, label, hint, icon: Icon }) => (
                <button
                  type="button"
                  key={key}
                  onClick={() => { setActiveView(key); setSidebarOpen(false); }}
                  className={`group flex min-h-[54px] w-full items-center gap-3 rounded-[16px] px-3 text-right transition-all ${
                    activeView === key ? "bg-[#315d56] text-[#fbf8ee] shadow-[0_8px_18px_rgba(49,93,86,.16)]" : "text-[#61716a] hover:bg-[#dce5dd] hover:text-[#203b35]"
                  }`}
                >
                  <span className={`grid h-8 w-8 place-items-center rounded-xl ${activeView === key ? "bg-white/12 text-[#f6d18b]" : "bg-[#f5f5ee] text-[#718079]"}`}>
                    <Icon className="h-[17px] w-[17px]" strokeWidth={1.7} />
                  </span>
                  <span className="flex-1">
                    <span className="block text-[13px] font-semibold">{label}</span>
                    <span className={`mt-0.5 block text-[10px] ${activeView === key ? "text-[#c8d9cf]" : "text-[#8b9790]"}`}>{hint}</span>
                  </span>
                  <ChevronLeft className={`h-4 w-4 transition-transform ${activeView === key ? "translate-x-0.5 text-[#f6d18b]" : "opacity-0 group-hover:opacity-60"}`} />
                </button>
              ))}
            </nav>

            <div className="mt-auto space-y-2">
              <button type="button" onClick={() => setCaptureOpen(true)} className="flex min-h-[48px] w-full items-center justify-center gap-2 rounded-[15px] bg-[#bf6b45] px-4 text-[12px] font-semibold text-[#fff8ec] shadow-[0_8px_16px_rgba(191,107,69,.18)] transition-all hover:-translate-y-0.5 hover:bg-[#aa5938]">
                <MessageSquarePlus className="h-4 w-4" />
                ثبت مشاهده سریع
              </button>
              <div className="flex items-center justify-between px-2 pt-3 text-[10px] text-[#8a9890]">
                <span className="flex items-center gap-1.5"><ShieldCheck className="h-3.5 w-3.5 text-[#4d897c]" />داده‌ها محلی و امن</span>
                <button type="button" onClick={() => setActiveView("improve")} className="hover:text-[#315d56]" aria-label="راهنما"><CircleHelp className="h-3.5 w-3.5" /></button>
              </div>
            </div>
          </div>
        </aside>

        {sidebarOpen && <button type="button" onClick={() => setSidebarOpen(false)} className="fixed inset-0 z-30 bg-[#203b35]/20 backdrop-blur-[2px] lg:hidden" aria-label="بستن منو" />}

        <main className="tm-grid-fade min-w-0 flex-1">
          <header className="sticky top-0 z-20 border-b border-[#dfe2d8]/90 bg-[#f1eee6]/90 px-5 py-4 backdrop-blur-xl sm:px-8 lg:px-10">
            <div className="mx-auto flex max-w-[1240px] items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <button type="button" onClick={() => setSidebarOpen(true)} className="grid h-10 w-10 place-items-center rounded-xl border border-[#d8ddd4] bg-[#faf9f4] text-[#52665d] lg:hidden" aria-label="باز کردن منو">
                  <Menu className="h-5 w-5" />
                </button>
                <div className="hidden h-9 w-9 place-items-center rounded-xl bg-[#315d56] text-[#f6d18b] lg:grid"><Command className="h-4 w-4" /></div>
                <div>
                  <p className="text-[11px] text-[#82908a]">سه‌شنبه، ۲۱ خرداد ۱۴۰۳</p>
                  <h1 className="mt-0.5 text-[17px] font-semibold tracking-[-0.03em] text-[#203b35]">{activeNav.label}</h1>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button type="button" onClick={() => setActiveView("review")} className="hidden h-10 items-center gap-2 rounded-xl border border-[#d8ddd4] bg-[#faf9f4] px-3 text-[11px] text-[#63736c] hover:border-[#b8c9be] hover:text-[#315d56] sm:flex">
                  <Search className="h-4 w-4" />
                  <span>جستجوی معامله</span>
                  <kbd className="rounded bg-[#edf0e9] px-1.5 py-0.5 text-[10px] text-[#9aa39d]">⌘ K</kbd>
                </button>
                <button type="button" onClick={() => setCaptureOpen(true)} className="grid h-10 w-10 place-items-center rounded-xl bg-[#315d56] text-[#f6d18b] hover:bg-[#274c46]" aria-label="ثبت مشاهده">
                  <PenLine className="h-4 w-4" />
                </button>
                <button type="button" onClick={() => setActiveView("now")} className="relative grid h-10 w-10 place-items-center rounded-xl border border-[#d8ddd4] bg-[#faf9f4] text-[#6e7d76] hover:text-[#315d56]" aria-label="اعلان‌ها">
                  <Bell className="h-4 w-4" />
                  <span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-[#bf6b45]" />
                </button>
              </div>
            </div>
          </header>

          <div className="mx-auto max-w-[1240px] space-y-6 px-5 py-7 sm:px-8 lg:px-10 lg:py-9">
            {activeView === "now" && (
              <div className="tm-stagger space-y-6">
                <section className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
                  <div>
                    <p className="mb-3 flex items-center gap-2 text-[11px] font-semibold tracking-[0.1em] text-[#bf6b45]">
                      <span className="h-px w-6 bg-[#bf6b45]" />
                      میدان تصمیم
                    </p>
                    <h2 className="max-w-[620px] text-[28px] font-semibold leading-[1.35] tracking-[-0.05em] text-[#203b35] sm:text-[36px]">امروز قرار نیست بیشتر معامله کنی؛<br /><span className="text-[#64817a]">قرار است بهتر ببینی.</span></h2>
                    <p className="mt-3 max-w-[540px] text-[13px] leading-7 text-[#74817b]">سه داده برای حفظ ریتم کافی است. قبل از باز کردن چارت، وضعیت ذهن و آخرین تصمیم را مرور کن.</p>
                  </div>
                  <button type="button" onClick={() => setSessionRunning((value) => !value)} className={`flex min-h-[50px] shrink-0 items-center justify-center gap-2 rounded-[15px] px-5 text-[12px] font-semibold transition-all sm:min-w-[164px] ${sessionRunning ? "border border-[#d9b5a4] bg-[#faeee8] text-[#a44f39]" : "bg-[#bf6b45] text-[#fff8ec] shadow-[0_10px_20px_rgba(191,107,69,.16)] hover:bg-[#aa5938]"}`}>
                    {sessionRunning ? <><CirclePause className="h-4 w-4" />توقف سشن</> : <><CirclePlay className="h-4 w-4" />شروع سشن امروز</>}
                  </button>
                </section>

                <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                  <Metric label="نرخ برد" value="۶۴٫۷٪" delta="+۸٫۲٪ این هفته" tone="teal" icon={Target} active={activeMetric === "نرخ برد"} onClick={() => setActiveMetric("نرخ برد")} />
                  <Metric label="میانگین R" value="+۱٫۸۴R" delta="+۰٫۳۱ نسبت به قبل" tone="gold" icon={Gauge} active={activeMetric === "میانگین R"} onClick={() => setActiveMetric("میانگین R")} />
                  <Metric label="پایبندی به پلن" value="۸۲٪" delta="۴ روز بدون تخلف" tone="coral" icon={ShieldCheck} active={activeMetric === "پایبندی"} onClick={() => setActiveMetric("پایبندی")} />
                  <Metric label="سرمایه در معرض" value="۰٫۶R" delta="کمتر از سقف ۱R" tone="ink" icon={Activity} active={activeMetric === "سرمایه"} onClick={() => setActiveMetric("سرمایه")} />
                </section>

                <section className="grid gap-4 xl:grid-cols-[1.45fr_0.95fr]">
                  <div className="overflow-hidden rounded-[24px] border border-[#d9ddd4] bg-[#faf9f4]">
                    <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#e2e4dc] px-5 py-4 sm:px-6">
                      <div>
                        <div className="flex items-center gap-2">
                          <BarChart3 className="h-4 w-4 text-[#315d56]" />
                          <h3 className="text-[14px] font-semibold">ریتم عملکرد</h3>
                        </div>
                        <p className="mt-1 text-[11px] text-[#87928c]">نتیجه تجمعی معاملات بسته‌شده</p>
                      </div>
                      <div className="flex items-center gap-1 rounded-xl bg-[#edf0e9] p-1">
                        {["۷ روز", "۳۰ روز", "فصل"].map((option) => (
                          <button key={option} type="button" onClick={() => setRange(option)} className={`rounded-lg px-3 py-1.5 text-[10px] transition-colors ${range === option ? "bg-[#faf9f4] font-semibold text-[#315d56] shadow-sm" : "text-[#89958e] hover:text-[#315d56]"}`}>{option}</button>
                        ))}
                      </div>
                    </div>
                    <div className="px-5 pb-5 pt-6 sm:px-6">
                      <div className="flex items-end justify-between">
                        <div><span className="text-[30px] font-semibold tracking-[-0.06em] text-[#203b35]">+$۴۲۸٫۷۰</span><span className="mr-2 text-[11px] text-[#4d897c]">+۱۲٫۴٪</span></div>
                        <span className="text-[10px] text-[#9ba49e]">بازه: {range}</span>
                      </div>
                      <div className="relative mt-5 h-[178px] overflow-hidden rounded-[16px] bg-[#f0f3ec]">
                        <div className="absolute inset-x-0 top-1/4 border-t border-dashed border-[#d8ded5]" />
                        <div className="absolute inset-x-0 top-1/2 border-t border-dashed border-[#d8ded5]" />
                        <div className="absolute inset-x-0 top-3/4 border-t border-dashed border-[#d8ded5]" />
                        <div className="absolute bottom-3 left-3 right-3 top-3">
                          <svg viewBox="0 0 416 140" className="h-full w-full" preserveAspectRatio="none" aria-label="نمودار رشد سرمایه">
                            <defs><linearGradient id="tm-area-fill" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stopColor="#4d897c" stopOpacity=".28" /><stop offset="1" stopColor="#4d897c" stopOpacity=".015" /></linearGradient></defs>
                            <polygon points={`4,140 ${chartPoints} 412,140`} fill="url(#tm-area-fill)" />
                            <polyline points={chartPoints} fill="none" stroke="#417f75" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
                            <circle cx="386" cy="35" r="4" fill="#f1eee6" stroke="#bf6b45" strokeWidth="2.5" />
                          </svg>
                        </div>
                        <div className="absolute bottom-2 left-4 right-4 flex justify-between text-[9px] text-[#9aa59e]"><span>شنبه</span><span>دوشنبه</span><span>چهارشنبه</span><span>امروز</span></div>
                      </div>
                      <div className="mt-4 flex items-center gap-5 text-[10px] text-[#87938c]"><span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-[#417f75]" />سود تجمعی</span><span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-[#bf6b45]" />نقطه تصمیم</span></div>
                    </div>
                  </div>

                  <div className="rounded-[24px] border border-[#d9ddd4] bg-[#315d56] p-5 text-[#f7f3e9] sm:p-6">
                    <div className="flex items-start justify-between">
                      <div><p className="text-[11px] text-[#b9d0c5]">سؤال قبل از ورود</p><h3 className="mt-2 text-[20px] font-semibold leading-8 tracking-[-0.04em]">آیا این تصمیم<br />قابل توضیح است؟</h3></div>
                      <span className="grid h-9 w-9 place-items-center rounded-xl bg-white/10 text-[#f6d18b]"><Zap className="h-4 w-4" /></span>
                    </div>
                    <div className="mt-7 rounded-[18px] border border-white/10 bg-[#244b45] p-4">
                      <div className="flex items-center gap-2 text-[11px] text-[#bed1c6]"><Timer className="h-3.5 w-3.5 text-[#f6d18b]" />چک‌لیست ۳ مرحله‌ای</div>
                      <div className="mt-4 space-y-3">
                        {["زمینه بازار مشخص است", "ریسک قبل از ورود محاسبه شد", "دلیل خروج از قبل نوشته شد"].map((item, index) => (
                          <button type="button" key={item} onClick={() => setActiveMetric(`چک‌لیست-${index}`)} className="flex w-full items-center gap-3 text-right text-[11px] text-[#edf1e9]">
                            <span className={`grid h-5 w-5 place-items-center rounded-full border ${activeMetric === `چک‌لیست-${index}` ? "border-[#f6d18b] bg-[#f6d18b] text-[#315d56]" : "border-[#76988d] text-transparent"}`}><Check className="h-3 w-3" /></span>
                            {item}
                          </button>
                        ))}
                      </div>
                    </div>
                    <button type="button" onClick={() => setActiveView("review")} className="mt-5 flex items-center gap-1 text-[11px] font-medium text-[#f6d18b] hover:text-[#fff1c9]">رفتن به مرور آخرین تصمیم <ArrowDownLeft className="h-3.5 w-3.5" /></button>
                  </div>
                </section>

                <section className="grid gap-4 lg:grid-cols-[0.9fr_1.1fr]">
                  <div className="rounded-[24px] border border-[#d9ddd4] bg-[#faf9f4] p-5 sm:p-6">
                    <div className="flex items-center justify-between"><div><h3 className="flex items-center gap-2 text-[14px] font-semibold"><CalendarDays className="h-4 w-4 text-[#bf6b45]" />ثبات روزانه</h3><p className="mt-1 text-[11px] text-[#87928c]">تعداد روزهای ثبت‌شده در ماه</p></div><span className="text-[22px] font-semibold text-[#315d56]">۱۸<span className="text-[12px] text-[#8b9891]"> / ۲۱</span></span></div>
                    <div className="mt-6 grid grid-cols-7 gap-2">
                      {heatmap.flatMap((row, rowIndex) => row.map((value, columnIndex) => <span key={`${rowIndex}-${columnIndex}`} className={`aspect-square rounded-[5px] ${value ? (rowIndex === 3 && columnIndex === 5 ? "bg-[#bf6b45]" : "bg-[#73a59a]") : "bg-[#e9ece5]"}`} />))}
                    </div>
                    <div className="mt-4 flex items-center justify-between text-[10px] text-[#929e97]"><span>قدیمی‌تر</span><span className="flex items-center gap-1.5"><i className="h-2 w-2 rounded-sm bg-[#e9ece5]" /><i className="h-2 w-2 rounded-sm bg-[#73a59a]" /><i className="h-2 w-2 rounded-sm bg-[#315d56]" />جدیدتر</span></div>
                  </div>
                  <div className="rounded-[24px] border border-[#d9ddd4] bg-[#faf9f4] p-5 sm:p-6">
                    <div className="flex items-center justify-between"><div><h3 className="flex items-center gap-2 text-[14px] font-semibold"><ListChecks className="h-4 w-4 text-[#315d56]" />صف تصمیم‌ها</h3><p className="mt-1 text-[11px] text-[#87928c]">آخرین حرکت‌ها، بدون رفتن به صفحه‌ی دیگر</p></div><button type="button" onClick={() => setActiveView("review")} className="flex items-center gap-1 text-[11px] text-[#315d56] hover:text-[#bf6b45]">همه <ChevronLeft className="h-3.5 w-3.5" /></button></div>
                    <div className="mt-5 space-y-2">
                      {trades.slice(0, 3).map((trade) => (
                        <button type="button" key={trade.symbol} onClick={() => setSelectedTrade(trade.symbol)} className={`flex w-full items-center gap-3 rounded-[15px] border px-3 py-2.5 text-right transition-colors ${selectedTrade === trade.symbol ? "border-[#b9d3c8] bg-[#edf3ed]" : "border-transparent hover:border-[#e1e5dd] hover:bg-[#f1f3ed]"}`}>
                          <span className="grid h-8 w-8 place-items-center rounded-lg text-[10px] font-bold text-[#faf9f4]" style={{ backgroundColor: trade.accent }}>{trade.symbol.slice(0, 2)}</span>
                          <span className="min-w-0 flex-1"><span className="block truncate text-[11px] font-semibold">{trade.setup}</span><span className="mt-0.5 block text-[10px] text-[#8a9690]">{trade.symbol} · {trade.time}</span></span>
                          <span className={`text-[11px] font-semibold ${trade.result === "برد" ? "text-[#3c8174]" : "text-[#b7644c]"}`}>{trade.pnl}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                </section>
              </div>
            )}

            {activeView === "review" && (
              <div className="tm-stagger space-y-6">
                <section className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
                  <div><p className="mb-3 flex items-center gap-2 text-[11px] font-semibold tracking-[0.1em] text-[#bf6b45]"><span className="h-px w-6 bg-[#bf6b45]" />اتاق مرور</p><h2 className="text-[32px] font-semibold tracking-[-0.05em]">معامله‌ها را به درس تبدیل کن.</h2><p className="mt-2 text-[13px] text-[#74817b]">مرور را با یک سؤال شروع کن، نه با عدد نهایی.</p></div>
                  <button type="button" onClick={() => setCaptureOpen(true)} className="flex min-h-[45px] items-center justify-center gap-2 rounded-[14px] bg-[#315d56] px-4 text-[12px] font-semibold text-[#faf7ed]"><Plus className="h-4 w-4" />ثبت مرور جدید</button>
                </section>
                <section className="rounded-[24px] border border-[#d9ddd4] bg-[#faf9f4]">
                  <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#e2e4dc] px-5 py-4"><div className="flex items-center gap-2 text-[14px] font-semibold"><History className="h-4 w-4 text-[#315d56]" />چهار تصمیم اخیر</div><button type="button" onClick={() => setActiveMetric("فیلتر")} className="flex items-center gap-2 rounded-lg border border-[#dce1d9] px-3 py-1.5 text-[10px] text-[#78857e]"><Filter className="h-3.5 w-3.5" />فیلتر: همه</button></div>
                  <div className="divide-y divide-[#e8e9e3]">
                    {trades.map((trade, index) => (
                      <button type="button" key={trade.symbol} onClick={() => setSelectedTrade(trade.symbol)} className={`flex w-full flex-wrap items-center gap-4 px-5 py-4 text-right transition-colors hover:bg-[#f1f3ed] ${selectedTrade === trade.symbol ? "bg-[#f3f6f0]" : ""}`}>
                        <span className="grid h-10 w-10 place-items-center rounded-[13px] text-[11px] font-bold text-[#faf9f4]" style={{ backgroundColor: trade.accent }}>{trade.symbol.slice(0, 2)}</span>
                        <span className="min-w-[150px] flex-1"><span className="block text-[13px] font-semibold">{trade.setup}</span><span className="mt-1 block text-[10px] text-[#8a9690]">{trade.symbol} · {trade.side} · {trade.time}</span></span>
                        <span className="hidden min-w-[120px] items-center gap-2 text-[11px] text-[#75837c] md:flex"><span className="h-1.5 w-1.5 rounded-full bg-[#73a59a]" />زمینه واضح</span>
                        <span className={`min-w-[76px] text-[12px] font-semibold ${trade.result === "برد" ? "text-[#3c8174]" : "text-[#b7644c]"}`}>{trade.pnl}</span>
                        <span className="grid h-8 w-8 place-items-center rounded-lg text-[#a3aca5] hover:bg-[#e5ebe3] hover:text-[#315d56]"><MoreHorizontal className="h-4 w-4" /></span>
                        {index === 0 && <span className="basis-full pr-14 text-right text-[10px] text-[#75837c]">یادداشت امروز: ورود دیرهنگام نبود؛ منتظر تأیید دوم ماندم.</span>}
                      </button>
                    ))}
                  </div>
                </section>
              </div>
            )}

            {activeView === "improve" && (
              <div className="tm-stagger space-y-6">
                <section><p className="mb-3 flex items-center gap-2 text-[11px] font-semibold tracking-[0.1em] text-[#bf6b45]"><span className="h-px w-6 bg-[#bf6b45]" />اتاق رشد</p><h2 className="text-[32px] font-semibold tracking-[-0.05em]">الگوهایی که ارزش تکرار دارند.</h2><p className="mt-2 text-[13px] text-[#74817b]">این صفحه جواب آماده نمی‌دهد؛ سرنخ بعدی را روشن می‌کند.</p></section>
                <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                  {[{ icon: TrendingUp, title: "صبح‌ها تصمیم‌های تمیزتری داری", body: "نرخ پایبندی بین ۹ تا ۱۱ صبح، ۱۴٪ بالاتر از میانگین هفته است.", tag: "زمان‌بندی", color: "teal" }, { icon: ArrowUpRight, title: "Opening range امضای توست", body: "۷ معامله از ۹ معامله این الگو با حداقل +۱R بسته شده‌اند.", tag: "الگو", color: "gold" }, { icon: TrendingDown, title: "بعد از ضرر، مکث کن", body: "دو ورود بعد از ضرر قبلی، میانگین -۰٫۴R داشته‌اند.", tag: "ریسک", color: "coral" }].map((insight) => {
                    const InsightIcon = insight.icon;
                    return <button type="button" key={insight.title} onClick={() => setActiveMetric(insight.title)} className={`rounded-[23px] border p-5 text-right transition-all hover:-translate-y-0.5 hover:shadow-[0_12px_22px_rgba(48,77,71,.08)] ${activeMetric === insight.title ? "border-[#315d56] bg-[#315d56] text-[#f9f6ed]" : "border-[#d9ddd4] bg-[#faf9f4]"}`}><div className="flex items-start justify-between"><span className={`grid h-10 w-10 place-items-center rounded-xl ${activeMetric === insight.title ? "bg-white/10 text-[#f6d18b]" : insight.color === "teal" ? "bg-[#dceee9] text-[#2d7069]" : insight.color === "gold" ? "bg-[#f5edd7] text-[#967531]" : "bg-[#f5e5dc] text-[#a44f39]"}`}><InsightIcon className="h-5 w-5" /></span><span className={`rounded-full px-2.5 py-1 text-[10px] ${activeMetric === insight.title ? "bg-white/10 text-[#d5e0d8]" : "bg-[#f0f1eb] text-[#7f8c85]"}`}>{insight.tag}</span></div><h3 className="mt-5 text-[15px] font-semibold leading-7">{insight.title}</h3><p className={`mt-2 text-[11px] leading-6 ${activeMetric === insight.title ? "text-[#c9d8d1]" : "text-[#7d8982]"}`}>{insight.body}</p><span className={`mt-5 flex items-center gap-1 text-[10px] ${activeMetric === insight.title ? "text-[#f6d18b]" : "text-[#315d56]"}`}>باز کردن جزئیات <ChevronLeft className="h-3.5 w-3.5" /></span></button>;
                  })}
                </section>
                <section className="rounded-[24px] border border-[#d9ddd4] bg-[#faf9f4] p-5 sm:p-6"><div className="flex items-center justify-between"><div><h3 className="flex items-center gap-2 text-[14px] font-semibold"><BookOpen className="h-4 w-4 text-[#315d56]" />پرونده رشد این هفته</h3><p className="mt-1 text-[11px] text-[#87928c]">یک آزمایش کوچک برای هفت روز آینده</p></div><span className="rounded-full bg-[#e5efe9] px-3 py-1 text-[10px] text-[#3d7e72]">در حال انجام</span></div><div className="mt-5 flex flex-col gap-4 rounded-[18px] bg-[#edf3ed] p-4 sm:flex-row sm:items-center"><span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-[#315d56] text-[#f6d18b]"><FileText className="h-5 w-5" /></span><p className="flex-1 text-[12px] leading-7 text-[#45625a]">قبل از هر ورود، یک جمله درباره‌ی چیزی که باید <strong className="font-semibold text-[#203b35]">ببینم</strong> بنویس؛ نه چیزی که امیدوارم اتفاق بیفتد.</p><button type="button" onClick={() => setCaptureOpen(true)} className="flex min-h-[40px] items-center justify-center gap-2 rounded-xl bg-[#faf9f4] px-3 text-[11px] font-semibold text-[#315d56] shadow-sm hover:bg-white"><PenLine className="h-3.5 w-3.5" />ثبت جمله</button></div></section>
              </div>
            )}
          </div>
        </main>
      </div>

      {captureOpen && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-[#203b35]/25 p-0 backdrop-blur-[3px] sm:items-center sm:p-5">
          <div className="w-full max-w-[500px] rounded-t-[28px] border border-[#d8ddd4] bg-[#faf9f4] p-6 shadow-[0_25px_70px_rgba(32,59,53,.2)] sm:rounded-[28px]">
            <div className="flex items-start justify-between"><div><p className="text-[11px] font-semibold tracking-[0.08em] text-[#bf6b45]">یادداشت میدان</p><h2 className="mt-2 text-[22px] font-semibold tracking-[-0.04em]">چه چیزی را دیدی؟</h2><p className="mt-1 text-[11px] text-[#87928c]">یک مشاهده‌ی خام بهتر از یک تحلیل فراموش‌شده است.</p></div><button type="button" onClick={() => setCaptureOpen(false)} className="grid h-9 w-9 place-items-center rounded-xl bg-[#edf0e9] text-[#6e7c75] hover:bg-[#e3e8e0]" aria-label="بستن"><X className="h-4 w-4" /></button></div>
            <form onSubmit={handleCapture} className="mt-6">
              <textarea autoFocus value={note} onChange={(event) => setNote(event.target.value)} placeholder="مثلاً: بعد از شکست سقف، منتظر پولبک ماندم..." className="min-h-[130px] w-full resize-none rounded-[18px] border border-[#d8ded6] bg-[#f2f3ed] p-4 text-[13px] leading-7 text-[#203b35] outline-none transition-colors placeholder:text-[#a1aaa3] focus:border-[#6f9d92] focus:ring-4 focus:ring-[#6f9d92]/10" />
              <div className="mt-4 flex items-center justify-between gap-3"><span className="flex items-center gap-1.5 text-[10px] text-[#87928c]"><CircleHelp className="h-3.5 w-3.5" />این یادداشت خصوصی می‌ماند</span><button type="submit" disabled={!note.trim()} className="flex min-h-[44px] items-center gap-2 rounded-xl bg-[#315d56] px-4 text-[11px] font-semibold text-[#faf7ed] disabled:cursor-not-allowed disabled:opacity-40"><Check className="h-4 w-4" />ذخیره مشاهده</button></div>
            </form>
            {captureSaved && <div className="mt-4 rounded-xl bg-[#e1eee6] px-3 py-2 text-center text-[11px] text-[#3d7e72]">مشاهده ذخیره شد؛ بعداً به آن برمی‌گردیم.</div>}
          </div>
        </div>
      )}
    </div>
  );
}