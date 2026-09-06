import { useMemo, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  CheckCircle2,
  CircleHelp,
  Clock3,
  Compass,
  Crosshair,
  Gauge,
  Menu,
  Pause,
  ShieldCheck,
  Sparkles,
  Target,
  Timer,
  X,
  Zap,
} from "lucide-react";

type CheckInStep = 0 | 1 | 2 | 3 | 4;
type Tone = "teal" | "gold" | "coral";

const steps = [
  { label: "ورود", caption: "حالت امروز", icon: Compass },
  { label: "ریسک", caption: "ظرفیت تصمیم", icon: ShieldCheck },
  { label: "زمینه", caption: "آنچه می‌بینی", icon: Crosshair },
  { label: "برنامه", caption: "قانون ورود", icon: Target },
  { label: "تعهد", caption: "شروع آرام", icon: CheckCircle2 },
];

const energyOptions: { label: string; helper: string; icon: string; tone: Tone }[] = [
  { label: "آرام و حاضر", helper: "می‌توانم صبر کنم", icon: "○", tone: "teal" },
  { label: "کمی پراکنده", helper: "به مکث بیشتری نیاز دارم", icon: "◐", tone: "gold" },
  { label: "فشار بالا", helper: "امروز باید کوچک‌تر بازی کنم", icon: "△", tone: "coral" },
];

const contextOptions = [
  { label: "جهت روشن است", helper: "سناریوی غالب را می‌بینم", icon: "↗" },
  { label: "بازار خنثی است", helper: "فقط لبه‌های واضح را می‌گیرم", icon: "—" },
  { label: "هنوز زود است", helper: "صبر، تصمیم امروز من است", icon: "◌" },
];

const planOptions = [
  { label: "فقط با تأیید دوم", helper: "بدون تعقیب حرکت", icon: "01" },
  { label: "ریسک نیم R", helper: "یک تلاش، نه بیشتر", icon: "½" },
  { label: "امروز معامله نمی‌کنم", helper: "حفظ سرمایه هم یک برد است", icon: "×" },
];

function OptionCard({
  label,
  helper,
  icon,
  tone,
  selected,
  onClick,
}: {
  label: string;
  helper: string;
  icon: string;
  tone?: "teal" | "gold" | "coral";
  selected: boolean;
  onClick: () => void;
}) {
  const toneClass = {
    teal: "bg-[#e2f0ea] text-[#39766c]",
    gold: "bg-[#f5ecd6] text-[#9a7739]",
    coral: "bg-[#f5e4db] text-[#ad5d45]",
  };

  return (
    <button
      type="button"
      onClick={onClick}
      className={`group flex w-full items-center gap-3 rounded-[20px] border p-3.5 text-right transition-all duration-200 active:scale-[.99] ${
        selected
          ? "border-[#315d56] bg-[#315d56] shadow-[0_12px_25px_rgba(49,93,86,.15)]"
          : "border-[#dce2da] bg-[#fbfaf5] hover:-translate-y-0.5 hover:border-[#aec8bc] hover:shadow-[0_10px_24px_rgba(49,93,86,.07)]"
      }`}
    >
      <span
        className={`grid h-11 w-11 shrink-0 place-items-center rounded-[15px] text-[16px] font-semibold ${
          selected ? "bg-white/12 text-[#f6d18b]" : toneClass[tone ?? "teal"]
        }`}
      >
        {selected ? <Check className="h-5 w-5" strokeWidth={2.2} /> : icon}
      </span>
      <span className="min-w-0 flex-1">
        <span className={`block text-[13px] font-semibold ${selected ? "text-[#fffaf0]" : "text-[#29443d]"}`}>{label}</span>
        <span className={`mt-1 block text-[10px] leading-5 ${selected ? "text-[#c8ddd2]" : "text-[#87948d]"}`}>{helper}</span>
      </span>
      <span className={`h-4 w-4 rounded-full border ${selected ? "border-[#f6d18b] bg-[#f6d18b]" : "border-[#ccd7d0]"}`} />
    </button>
  );
}

function RiskSummary({
  step,
  energy,
  context,
  plan,
  onReset,
}: {
  step: CheckInStep;
  energy: string;
  context: string;
  plan: string;
  onReset: () => void;
}) {
  const risk = plan.includes("نمی‌کنم") ? "محافظت‌شده" : energy === "فشار بالا" ? "۰٫۵R" : "۱R";
  const readiness = step === 4 ? "آماده‌ی شروع" : step === 0 ? "در حال ورود" : "در حال ساخت";

  return (
    <aside className="w-full rounded-[24px] border border-[#cfdcd2] bg-[#e7eee7] p-4 text-[#29483f] shadow-[0_16px_38px_rgba(49,93,86,.08)] lg:sticky lg:top-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="grid h-8 w-8 place-items-center rounded-xl bg-[#315d56] text-[#f6d18b]"><ShieldCheck className="h-4 w-4" /></span>
          <div>
            <p className="text-[12px] font-semibold">خلاصه‌ی ریسک</p>
            <p className="text-[9px] text-[#789087]">همیشه جلوی چشم تو</p>
          </div>
        </div>
        <button type="button" onClick={onReset} className="rounded-lg p-1.5 text-[#789087] hover:bg-[#d9e5db] hover:text-[#315d56]" aria-label="شروع دوباره">
          <X className="h-3.5 w-3.5" />
        </button>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-2">
        <div className="rounded-[15px] bg-[#f4f5ef] p-3">
          <p className="text-[9px] text-[#84928b]">ظرفیت ریسک</p>
          <p className={`mt-1 text-[16px] font-semibold ${risk === "محافظت‌شده" ? "text-[#3b7a6d]" : "text-[#ad5d45]"}`}>{risk}</p>
        </div>
        <div className="rounded-[15px] bg-[#f4f5ef] p-3">
          <p className="text-[9px] text-[#84928b]">وضعیت</p>
          <p className="mt-1 text-[13px] font-semibold text-[#315d56]">{readiness}</p>
        </div>
      </div>

      <div className="mt-3 space-y-2 rounded-[15px] bg-[#f4f5ef] p-3">
        <div className="flex items-center justify-between text-[10px]">
          <span className="text-[#84928b]">انرژی امروز</span>
          <span className={`font-medium ${energy ? "text-[#315d56]" : "text-[#aab2ac]"}`}>{energy || "انتخاب نشده"}</span>
        </div>
        <div className="h-px bg-[#e1e7df]" />
        <div className="flex items-center justify-between text-[10px]">
          <span className="text-[#84928b]">زمینه‌ی بازار</span>
          <span className={`font-medium ${context ? "text-[#315d56]" : "text-[#aab2ac]"}`}>{context || "انتخاب نشده"}</span>
        </div>
        <div className="h-px bg-[#e1e7df]" />
        <div className="flex items-center justify-between text-[10px]">
          <span className="text-[#84928b]">قانون امروز</span>
          <span className={`max-w-[130px] truncate font-medium ${plan ? "text-[#315d56]" : "text-[#aab2ac]"}`}>{plan || "انتخاب نشده"}</span>
        </div>
      </div>

      <div className="mt-3 flex items-center gap-2 rounded-[13px] bg-[#d9e9df] px-3 py-2.5 text-[10px] text-[#477466]">
        <Zap className="h-3.5 w-3.5 shrink-0 text-[#bd7a45]" />
        <span>{step === 4 ? "امروز با قانونت شروع کن، نه با هیجان." : "هر پاسخ، یک لایه از فشار را کم می‌کند."}</span>
      </div>
    </aside>
  );
}

export default function TraderMindCheckIn() {
  const [step, setStep] = useState<CheckInStep>(0);
  const [energy, setEnergy] = useState("");
  const [context, setContext] = useState("");
  const [plan, setPlan] = useState("");
  const [started, setStarted] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const currentStep = steps[step];
  const StepIcon = currentStep.icon;
  const canContinue = step === 0 ? Boolean(energy) : step === 1 ? Boolean(context || energy) : step === 2 ? Boolean(context) : step === 3 ? Boolean(plan) : true;
  const progress = useMemo(() => `${((step + 1) / steps.length) * 100}%`, [step]);

  const reset = () => {
    setStep(0);
    setEnergy("");
    setContext("");
    setPlan("");
    setStarted(false);
  };

  const advance = () => {
    if (!canContinue) return;
    if (step < 4) setStep((value) => (value + 1) as CheckInStep);
    else setStarted(true);
  };

  return (
    <div dir="rtl" className="min-h-[100dvh] overflow-x-hidden bg-[#f1eee6] text-[#29443d]" style={{ fontFamily: "'Vazirmatn', 'Noto Sans Arabic', sans-serif" }}>
      <style>{`
        .tm-checkin-grid { background-image: linear-gradient(rgba(49,93,86,.04) 1px, transparent 1px), linear-gradient(90deg, rgba(49,93,86,.04) 1px, transparent 1px); background-size: 30px 30px; }
        @keyframes tm-checkin-in { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        .tm-checkin-in { animation: tm-checkin-in .42s cubic-bezier(.22,1,.36,1) both; }
        @media (prefers-reduced-motion: reduce) { .tm-checkin-in { animation: none; } }
      `}</style>

      <header className="sticky top-0 z-30 border-b border-[#dfe4db]/90 bg-[#f1eee6]/90 px-4 py-3 backdrop-blur-xl sm:px-6">
        <div className="mx-auto flex max-w-[1040px] items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <button type="button" onClick={() => setMenuOpen((value) => !value)} className="grid h-9 w-9 place-items-center rounded-xl border border-[#d7ded6] bg-[#faf9f4] text-[#526c62] lg:hidden" aria-label="باز کردن منو">
              <Menu className="h-4 w-4" />
            </button>
            <span className="grid h-9 w-9 place-items-center rounded-xl bg-[#315d56] text-[#f6d18b] shadow-[0_7px_15px_rgba(49,93,86,.17)]"><Crosshair className="h-4 w-4" /></span>
            <div>
              <p className="text-[13px] font-semibold tracking-[-0.03em] text-[#29443d]">TraderMind</p>
              <p className="text-[9px] tracking-[0.16em] text-[#86948c]">DAILY CHECK-IN</p>
            </div>
          </div>
          <div className="hidden items-center gap-2 text-[10px] text-[#84918b] sm:flex"><Clock3 className="h-3.5 w-3.5 text-[#bd7650]" />سه‌شنبه، ۲۱ خرداد · پیش از شروع بازار</div>
          <button type="button" onClick={reset} className="flex items-center gap-1.5 rounded-lg px-2 py-1.5 text-[10px] text-[#718179] hover:bg-[#e1e8e0] hover:text-[#315d56]"><Pause className="h-3.5 w-3.5" />مکث</button>
        </div>
        {menuOpen && <div className="mx-auto mt-3 max-w-[1040px] rounded-xl border border-[#d5dfd7] bg-[#f8f8f1] p-3 text-[11px] text-[#64786e] shadow-sm lg:hidden">این چک‌این برای کم‌کردن سرعت ساخته شده؛ هر بار فقط یک تصمیم.</div>}
      </header>

      <main className="tm-checkin-grid min-h-[calc(100dvh-65px)] px-4 pb-8 pt-5 sm:px-6 sm:pt-8">
        <div className="mx-auto grid max-w-[1040px] gap-7 lg:grid-cols-[minmax(0,1fr)_270px] lg:items-start">
          <section className="min-w-0">
            <div className="mb-6">
              <div className="flex items-center justify-between text-[10px] text-[#7e8e85]">
                <span>چک‌این آرام امروز</span>
                <span>{step + 1} از {steps.length}</span>
              </div>
              <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-[#dce4dc]"><div className="h-full rounded-full bg-[#bd7650] transition-all duration-300" style={{ width: progress }} /></div>
              <div className="mt-3 flex items-center justify-between">
                {steps.map((item, index) => {
                  const Icon = item.icon;
                  return <div key={item.label} className={`flex items-center gap-1.5 text-[9px] ${index <= step ? "text-[#315d56]" : "text-[#a5afa8]"}`}><span className={`grid h-6 w-6 place-items-center rounded-lg ${index === step ? "bg-[#315d56] text-[#f6d18b]" : index < step ? "bg-[#d6e8dc] text-[#39766c]" : "bg-[#e7ebe5] text-[#9aa59e]"}`}><Icon className="h-3 w-3" /></span><span className="hidden sm:inline">{item.label}</span></div>;
                })}
              </div>
            </div>

            <div className="tm-checkin-in rounded-[28px] border border-[#d9dfd6] bg-[#faf9f4] p-5 shadow-[0_18px_50px_rgba(49,93,86,.06)] sm:p-8" key={step}>
              {started ? (
                <div className="flex min-h-[360px] flex-col items-center justify-center text-center">
                  <span className="grid h-16 w-16 place-items-center rounded-[22px] bg-[#dceee4] text-[#39766c]"><CheckCircle2 className="h-8 w-8" /></span>
                  <p className="mt-6 text-[11px] font-semibold tracking-[0.1em] text-[#bd7650]">CHECK-IN COMPLETE</p>
                  <h1 className="mt-3 text-[27px] font-semibold tracking-[-0.05em] text-[#29443d]">فضا را برای تصمیم خوب باز کردی.</h1>
                  <p className="mt-3 max-w-[380px] text-[12px] leading-7 text-[#7c8c83]">قانون امروزت ثبت شد. لازم نیست چیزی را ثابت کنی؛ فقط به همان چیزی که دیدی وفادار بمان.</p>
                  <button type="button" onClick={() => setStarted(false)} className="mt-7 flex items-center gap-2 rounded-xl border border-[#cfdbd2] px-4 py-2.5 text-[11px] font-semibold text-[#315d56] hover:bg-[#edf3ed]"><ArrowRight className="h-3.5 w-3.5" />بازبینی پاسخ‌ها</button>
                </div>
              ) : (
                <>
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-[#edf2eb] px-2.5 py-1 text-[9px] font-medium text-[#648178]"><StepIcon className="h-3 w-3 text-[#bd7650]" />{currentStep.caption}</span>
                      <h1 className="mt-5 max-w-[510px] text-[27px] font-semibold leading-[1.4] tracking-[-0.05em] text-[#29443d] sm:text-[34px]">
                        {step === 0 && <>امروز با چه کیفیتی<br /><span className="text-[#6c8c82]">پای چارت می‌نشینی؟</span></>}
                        {step === 1 && <>چقدر ظرفیت داری که<br /><span className="text-[#6c8c82]">ریسک را تحمل کنی؟</span></>}
                        {step === 2 && <>الان بازار چه چیزی را<br /><span className="text-[#6c8c82]">به تو نشان می‌دهد؟</span></>}
                        {step === 3 && <>یک قانون کوچک برای<br /><span className="text-[#6c8c82]">امروز انتخاب کن.</span></>}
                        {step === 4 && <>حاضری به این تصمیم<br /><span className="text-[#6c8c82]">وفادار بمانی؟</span></>}
                      </h1>
                      <p className="mt-3 max-w-[430px] text-[12px] leading-7 text-[#7d8c84]">
                        {step === 0 && "این پاسخ پیش‌بینی بازار نیست؛ فقط نقطه‌ی شروع تو را روشن می‌کند."}
                        {step === 1 && "حال ذهن، سقف ریسک را تعیین می‌کند. امروز لازم نیست شجاع‌تر از ظرفیتت باشی."}
                        {step === 2 && "اگر زمینه مبهم است، کوچک‌کردن اندازه هم یک تصمیم حرفه‌ای است."}
                        {step === 3 && "یک جمله‌ی کوتاه که وقتی هیجان بالا رفت، دوباره به آن برمی‌گردی."}
                        {step === 4 && "آخرین مکث پیش از بازشدن بازار. تصمیم خوب، تصمیمی است که بتوانی توضیحش بدهی."}
                      </p>
                    </div>
                    <span className="hidden h-10 w-10 shrink-0 place-items-center rounded-xl bg-[#f2e5d8] text-[#bd7650] sm:grid"><Sparkles className="h-4 w-4" /></span>
                  </div>

                  <div className="mt-7 space-y-2.5">
                    {step === 0 && energyOptions.map((option) => <OptionCard key={option.label} {...option} selected={energy === option.label} onClick={() => setEnergy(option.label)} />)}
                    {step === 1 && (
                      <>
                        <div className="rounded-[17px] border border-[#e3e5da] bg-[#f5f3eb] px-4 py-3 text-[10px] leading-6 text-[#75857c]"><Gauge className="ml-1 inline h-3.5 w-3.5 text-[#bd7650]" /> پاسخ قبلی: <strong className="font-semibold text-[#315d56]">{energy || "ثبت نشده"}</strong> · بر اساس آن، مرزت را انتخاب کن.</div>
                        {planOptions.map((option) => <OptionCard key={option.label} {...option} tone="gold" selected={plan === option.label && step === 1} onClick={() => setPlan(option.label)} />)}
                      </>
                    )}
                    {step === 2 && contextOptions.map((option) => <OptionCard key={option.label} {...option} selected={context === option.label} onClick={() => setContext(option.label)} />)}
                    {step === 3 && planOptions.map((option) => <OptionCard key={option.label} {...option} tone="coral" selected={plan === option.label} onClick={() => setPlan(option.label)} />)}
                    {step === 4 && (
                      <div className="rounded-[20px] bg-[#315d56] p-5 text-[#f8f6ed]">
                        <div className="flex items-center gap-2 text-[11px] text-[#c3d9cf]"><Timer className="h-4 w-4 text-[#f6d18b]" />قرار امروز</div>
                        <p className="mt-4 text-[20px] font-semibold leading-8">«{plan || "ریسک را کوچک نگه می‌دارم"}»</p>
                        <p className="mt-3 text-[11px] leading-6 text-[#bfd3c8]">زمینه‌ی تو: {context || "هنوز زود است"} · ظرفیت: {energy || "آرام و حاضر"}</p>
                      </div>
                    )}
                  </div>

                  <div className="mt-7 flex items-center justify-between gap-3 border-t border-[#e4e6de] pt-5">
                    <button type="button" onClick={() => step > 0 && setStep((value) => (value - 1) as CheckInStep)} className={`flex items-center gap-1.5 rounded-xl px-3 py-2.5 text-[11px] text-[#7e8d85] hover:bg-[#edf1eb] hover:text-[#315d56] ${step === 0 ? "pointer-events-none opacity-0" : ""}`}><ArrowRight className="h-3.5 w-3.5" />قبلی</button>
                    <button type="button" onClick={advance} disabled={!canContinue} className="flex min-h-[43px] items-center gap-2 rounded-[13px] bg-[#315d56] px-4 text-[11px] font-semibold text-[#fbf7ed] shadow-[0_9px_18px_rgba(49,93,86,.14)] transition-all hover:-translate-y-0.5 hover:bg-[#274d47] disabled:cursor-not-allowed disabled:opacity-35">
                      {step === 4 ? "ثبت و شروع آرام" : "ادامه"}<ArrowLeft className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </>
              )}
            </div>
          </section>

          <div className="lg:pt-[112px]">
            <RiskSummary step={step} energy={energy} context={context} plan={plan} onReset={reset} />
            <div className="mt-3 hidden items-center gap-2 px-2 text-[10px] leading-6 text-[#8b9991] lg:flex"><CircleHelp className="h-3.5 w-3.5 shrink-0 text-[#bd7650]" />هر زمان خواستی می‌توانی برگردی و پاسخ را عوض کنی.</div>
          </div>
        </div>
      </main>
    </div>
  );
}