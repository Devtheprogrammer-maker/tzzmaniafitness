import { ClockIcon, SunIcon, MoonIcon, CalendarDaysIcon } from '@heroicons/react/24/solid';
import { easeInOut, motion, type Variants } from 'motion/react';

const WEEKDAY_WINDOWS = [
  {
    label: "Morning Window",
    range: "5:00 AM – 11:00 AM",
    icon: SunIcon,
    note: "Arrive any time before 9:00 AM to get your full 2 hours in.",
  },
  {
    label: "Afternoon & Evening Window",
    range: "1:00 PM – 9:00 PM",
    icon: MoonIcon,
    note: "Arrive any time before 7:00 PM to get your full 2 hours in.",
  },
];

const sectionVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15, delayChildren: 0.1 }
  }
};

const headerVariants: Variants = {
  hidden: { opacity: 0, y: -20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: easeInOut }
  }
};

const gridVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15 }
  }
};

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", stiffness: 70, damping: 15 }
  }
};

const Schedule: React.FC = () => {
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

        {/* Header section */}
        <motion.div variants={headerVariants} className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs font-bold uppercase tracking-widest text-secondary bg-secondary/10 px-4 py-1.5 rounded-full border border-secondary/20">
            Gym Hours
          </span>
          <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tight mt-4 leading-none">
            Open <span className="inline-block text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">Access</span>
          </h2>
          <p className="text-slate-400 mt-4 text-base">
            No bookings, no fixed sessions. Every membership includes 2 hours of floor access, any time within the windows below. Walk in whenever works for you.
          </p>
        </motion.div>

        {/* Weekday windows */}
        <motion.div variants={headerVariants} className="mb-4">
          <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400">
            Monday – Friday
          </h3>
        </motion.div>

        <motion.div variants={gridVariants} className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-10">
          {WEEKDAY_WINDOWS.map((window, index) => (
            <motion.div
              key={index}
              variants={cardVariants}
              whileHover={{ y: -4, transition: { duration: 0.25, ease: "easeOut" } }}
              className="rounded-2xl border border-white/5 bg-surface/40 p-8 backdrop-blur-sm shadow-md"
            >
              <window.icon className="h-7 w-7 text-secondary mb-5" />
              <h4 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-3">
                {window.label}
              </h4>
              <div className="flex items-center gap-2 text-3xl font-black text-white font-mono mb-4">
                {window.range}
              </div>
              <p className="text-sm text-slate-400 leading-relaxed">
                {window.note}
              </p>
            </motion.div>
          ))}
        </motion.div>

        {/* Saturdays & Holidays */}
        <motion.div variants={headerVariants} className="mb-4">
          <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400">
            Saturdays &amp; Holidays
          </h3>
        </motion.div>

        <motion.div
          variants={cardVariants}
          whileHover={{ scale: 1.01, transition: { duration: 0.25, ease: "easeOut" } }}
          className="rounded-2xl border border-secondary/30 bg-secondary/5 p-8 backdrop-blur-md shadow-lg mb-10"
        >
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-secondary/10 border border-secondary/20">
                <CalendarDaysIcon className="h-6 w-6 text-secondary" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-2">
                  Open Window
                </h4>
                <div className="text-3xl font-black text-white font-mono">
                  7:00 AM – 1:00 PM
                </div>
              </div>
            </div>
            <p className="text-sm text-slate-300 leading-relaxed sm:max-w-xs sm:text-right">
              Come in any time within this window to get your 2 hours in. We're open through most holidays — check for any exceptions around major dates.
            </p>
          </div>
        </motion.div>

        {/* How it works strip */}
        <motion.div
          variants={cardVariants}
          className="rounded-2xl border border-primary/20 bg-primary/5 p-6 flex flex-col sm:flex-row sm:items-center gap-4"
        >
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10">
            <ClockIcon className="h-5 w-5 text-primary" />
          </div>
          <p className="text-sm text-slate-300 leading-relaxed">
            Your 2 hours start the moment you check in, and run anywhere inside the open windows above — no need to arrive at the top of the hour or match anyone else's schedule.
          </p>
        </motion.div>

      </div>
    </motion.section>
  );
}

export default Schedule;