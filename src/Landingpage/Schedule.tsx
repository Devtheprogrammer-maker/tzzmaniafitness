import { useEffect, useState } from "react";
import { CalendarDaysIcon, ClockIcon } from "@heroicons/react/24/solid";
import { easeInOut, motion, type Variants } from "motion/react";

/* ============================================================
   Edit your hours here. Everything on the page is calculated
   from this block, so there's nothing else to keep in sync.
   ============================================================ */

const TIME_ZONE = "America/Belize";
const SESSION_MINUTES = 120;

type TimeWindow = { open: number; close: number }; // minutes after midnight
const hr = (hours: number): number => hours * 60;

const WEEKDAY: TimeWindow[] = [
  { open: hr(5), close: hr(11) },
  { open: hr(13), close: hr(21) },
];
const SATURDAY: TimeWindow[] = [{ open: hr(7), close: hr(13) }];
const SUNDAY: TimeWindow[] = []; // Closed. You didn't mention Sundays, so change this if you open.
const HOLIDAY: TimeWindow[] = SATURDAY; // Holidays follow Saturday hours; give it its own list if that changes.

// Index = day of week, 0 = Sunday
const WEEK: TimeWindow[][] = [SUNDAY, WEEKDAY, WEEKDAY, WEEKDAY, WEEKDAY, WEEKDAY, SATURDAY];

// "MM-DD" repeats every year. "YYYY-MM-DD" is that one date only (use it for Good Friday, Easter Monday, etc.)
const HOLIDAYS: string[] = [
  "01-01", "03-09", "05-01", "09-10", "09-21", "10-12", "11-19", "12-25", "12-26",
];
// Same formats. Dates listed here override everything and show as closed.
const CLOSED_DATES: string[] = [];

/* ---------- Helpers ---------- */

const DAY_NAMES = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const WEEK_ORDER = [1, 2, 3, 4, 5, 6, 0]; // Monday first

const pad = (n: number): string => String(n).padStart(2, "0");

function fmt(mins: number): string {
  const h24 = Math.floor(mins / 60);
  const m = mins % 60;
  return `${h24 % 12 || 12}:${pad(m)} ${h24 >= 12 ? "PM" : "AM"}`;
}

function fmtDuration(mins: number): string {
  if (mins < 60) return `${mins} min`;
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  return m ? `${h}h ${m}m` : `${h}h`;
}

const startBy = (w: TimeWindow): number => Math.max(w.open, w.close - SESSION_MINUTES);
const startTimes = (windows: TimeWindow[]): string => windows.map((w) => fmt(startBy(w))).join(" · ");

type ZonedNow = { y: number; m: number; d: number; minutes: number };

// The current date and time in Belize, whatever the visitor's own timezone is
function zonedNow(): ZonedNow {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: TIME_ZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).formatToParts(new Date());
  const get = (type: string) => Number(parts.find((p) => p.type === type)?.value);
  return { y: get("year"), m: get("month"), d: get("day"), minutes: (get("hour") % 24) * 60 + get("minute") };
}

type DayInfo = { dow: number; md: string; iso: string };

function dayInfo(y: number, m: number, d: number, offset: number): DayInfo {
  const dt = new Date(Date.UTC(y, m - 1, d + offset));
  const month = dt.getUTCMonth() + 1;
  const day = dt.getUTCDate();
  return { dow: dt.getUTCDay(), md: `${pad(month)}-${pad(day)}`, iso: `${dt.getUTCFullYear()}-${pad(month)}-${pad(day)}` };
}

type DayKind = "regular" | "holiday" | "closed";

function windowsFor(info: DayInfo): { windows: TimeWindow[]; kind: DayKind } {
  const listed = (list: string[]) => list.includes(info.md) || list.includes(info.iso);
  if (listed(CLOSED_DATES)) return { windows: [], kind: "closed" };
  if (listed(HOLIDAYS)) return { windows: HOLIDAY, kind: "holiday" };
  return { windows: WEEK[info.dow], kind: "regular" };
}

type Status =
  | { open: true; closesAt: number; minutesLeft: number; startBy: number }
  | { open: false; next: { opensAt: number; dayOffset: number; dow: number } | null };

function getStatus(now: ZonedNow): Status {
  for (let offset = 0; offset <= 7; offset++) {
    const info = dayInfo(now.y, now.m, now.d, offset);
    for (const w of windowsFor(info).windows) {
      if (offset === 0 && now.minutes >= w.close) continue;
      if (offset === 0 && now.minutes >= w.open) {
        return { open: true, closesAt: w.close, minutesLeft: w.close - now.minutes, startBy: startBy(w) };
      }
      return { open: false, next: { opensAt: w.open, dayOffset: offset, dow: info.dow } };
    }
  }
  return { open: false, next: null };
}

function whenLabel(dayOffset: number, dow: number): string {
  if (dayOffset === 0) return "today";
  if (dayOffset === 1) return "tomorrow";
  return DAY_NAMES[dow];
}

function useZonedNow(): ZonedNow {
  const [now, setNow] = useState(zonedNow);
  useEffect(() => {
    const id = setInterval(() => setNow(zonedNow()), 30_000);
    return () => clearInterval(id);
  }, []);
  return now;
}

/* ---------- Motion ---------- */

const sectionVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.15, delayChildren: 0.1 } },
};

const headerVariants: Variants = {
  hidden: { opacity: 0, y: -20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: easeInOut } },
};

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 70, damping: 15 } },
};

/* ---------- Page ---------- */

export default function Schedule() {
  const now = useZonedNow();
  const status = getStatus(now);
  const today = dayInfo(now.y, now.m, now.d, 0);
  const todayRule = windowsFor(today);

  let headline: string;
  let hint: string;
  if (status.open) {
    headline = `Closes at ${fmt(status.closesAt)}`;
    hint =
      now.minutes <= status.startBy
        ? `Start by ${fmt(status.startBy)} to get your full 2 hours.`
        : `Only ${fmtDuration(status.minutesLeft)} left in this window, so that's all you'd get if you start now.`;
  } else if (status.next) {
    headline = `Opens ${whenLabel(status.next.dayOffset, status.next.dow)} at ${fmt(status.next.opensAt)}`;
    hint = "Just walk in when we open.";
  } else {
    headline = "Check back soon";
    hint = "We couldn't work out our next opening time. Message us and we'll let you know.";
  }

  const satStart = startTimes(SATURDAY);
  const holStart = startTimes(HOLIDAY);
  const startRows: [string, string][] = [
    ["Mon – Fri", startTimes(WEEKDAY)],
    ...(satStart === holStart
      ? ([["Sat & holidays", satStart]] as [string, string][])
      : ([["Saturday", satStart], ["Holidays", holStart]] as [string, string][])),
  ];

  return (
    <motion.section
      id="schedule"
      variants={sectionVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-100px" }}
      className="bg-background border-t border-slate-900 py-24 text-text overflow-hidden"
    >
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <motion.div variants={headerVariants} className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs font-bold uppercase tracking-widest text-secondary bg-secondary/10 px-4 py-1.5 rounded-full border border-secondary/20">
            Gym Hours
          </span>
          <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tight mt-4 leading-none">
            Open{" "}
            <span className="inline-block text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">
              Access
            </span>
          </h2>
          <p className="text-slate-400 mt-4 text-base">
            No bookings, no fixed sessions. Every membership includes 2 hours of floor access, any time within our
            opening hours. Walk in whenever works for you.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 items-start">

          {/* Live status + how it works */}
          <motion.div
            variants={cardVariants}
            className="lg:col-span-2 rounded-2xl border border-secondary/30 bg-secondary/5 p-8 backdrop-blur-md shadow-lg"
          >
            <div role="status" aria-live="polite">
              <div className="flex items-center gap-3">
                <span className="relative flex h-3 w-3">
                  {status.open && (
                    <span className="absolute inline-flex h-full w-full rounded-full bg-secondary opacity-60 motion-safe:animate-ping" />
                  )}
                  <span
                    className={`relative inline-flex h-3 w-3 rounded-full ${status.open ? "bg-secondary" : "bg-slate-500"}`}
                  />
                </span>
                <p className="text-4xl font-black uppercase tracking-tight text-white leading-none">
                  {status.open ? "Open now" : "Closed"}
                </p>
              </div>

              <p className="mt-3 text-lg font-bold text-white">{headline}</p>
              {todayRule.kind === "holiday" && (
                <span className="mt-3 inline-block rounded-full border border-secondary/30 bg-secondary/10 px-3 py-1 text-xs font-bold uppercase tracking-wider text-secondary">
                  Open today on holiday hours: {HOLIDAY.map((w) => `${fmt(w.open)} – ${fmt(w.close)}`).join(", ")}
                </span>
              )}
              <p className="mt-3 text-sm leading-relaxed text-slate-400">{hint}</p>
            </div>

            <div className="mt-8 border-t border-secondary/20 pt-6">
              <div className="flex items-center gap-2">
                <ClockIcon className="h-5 w-5 text-primary" />
                <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400">How your 2 hours work</h3>
              </div>
              <p className="mt-3 text-sm leading-relaxed text-slate-300">
                Your 2 hours start when you begin your first exercise. Sessions end when we close, so these are the
                latest start times for a full 2 hours.
              </p>
              <dl className="mt-4 space-y-2 text-sm">
                {startRows.map(([label, times]) => (
                  <div key={label} className="flex items-baseline justify-between gap-4">
                    <dt className="text-slate-400">{label}</dt>
                    <dd className="font-mono font-bold text-white">{times}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </motion.div>

          {/* Weekly hours */}
          <motion.div
            variants={cardVariants}
            className="lg:col-span-3 rounded-2xl border border-white/5 bg-surface/40 p-6 sm:p-8 backdrop-blur-sm shadow-md"
          >
            <div className="mb-5 flex items-center gap-2">
              <CalendarDaysIcon className="h-5 w-5 text-secondary" />
              <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400">Opening hours</h3>
            </div>

            <ul className="space-y-1">
              {WEEK_ORDER.map((dow) => {
                const isToday = dow === today.dow;
                const rule = isToday ? todayRule : { windows: WEEK[dow], kind: "regular" as DayKind };
                return (
                  <li
                    key={dow}
                    aria-current={isToday ? "date" : undefined}
                    className={`flex items-start justify-between gap-4 rounded-xl border px-4 py-3 ${isToday ? "border-secondary/40 bg-secondary/5" : "border-transparent"
                      }`}
                  >
                    <div>
                      <span className="text-sm font-bold text-white">{DAY_NAMES[dow]}</span>
                      {isToday && (
                        <span className="ml-2 rounded-full bg-secondary/15 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-secondary">
                          Today
                        </span>
                      )}
                      {isToday && rule.kind === "holiday" && (
                        <p className="mt-1 text-xs text-slate-400">Open on holiday hours</p>
                      )}
                      {isToday && rule.kind === "closed" && (
                        <p className="mt-1 text-xs text-slate-400">Closed for the day</p>
                      )}
                    </div>
                    <div className="text-right font-mono text-sm">
                      {rule.windows.length === 0 ? (
                        <span className="text-slate-500">Closed</span>
                      ) : (
                        rule.windows.map((w) => (
                          <span key={w.open} className="block text-slate-200">
                            {fmt(w.open)} – {fmt(w.close)}
                          </span>
                        ))
                      )}
                    </div>
                  </li>
                );
              })}

              {/* Holiday rule */}
              <li className="mt-3 flex items-start justify-between gap-4 rounded-xl border border-dashed border-border px-4 py-3">
                <div>
                  <span className="text-sm font-bold text-white">Public holidays</span>
                  <p className="mt-1 text-xs text-slate-400">Open on most public holidays.</p>
                </div>
                <div className="text-right font-mono text-sm">
                  {HOLIDAY.map((w) => (
                    <span key={w.open} className="block text-slate-200">
                      {fmt(w.open)} – {fmt(w.close)}
                    </span>
                  ))}
                </div>
              </li>
            </ul>

            <p className="mt-5 text-xs leading-relaxed text-slate-500">
              If we ever close for a holiday, it will show here as closed. Not sure?{" "}
              <a href="#contact" className="font-semibold text-secondary hover:underline">
                message or call us
              </a>{" "}
              to confirm before you head over.
            </p>
          </motion.div>
        </div>
      </div>
    </motion.section>
  );
}