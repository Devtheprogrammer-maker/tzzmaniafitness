import { ClockIcon, CalendarIcon, SunIcon } from '@heroicons/react/24/solid';
import { easeInOut, motion, type Variants} from 'motion/react';
// import type { Variants } from "framer-motion";

// 1. Static array extracted outside component to maximize layout rendering performance
const WEEKDAY_SESSIONS = [
  { session: "1st Session", time: "5:00 AM - 7:00 AM", tag: "Early Bird" },
  { session: "2nd Session", time: "7:00 AM - 9:00 AM", tag: "Morning Rush" },
  { session: "3rd Session", time: "9:00 AM - 11:00 AM", tag: "Mid-Day" },
  { session: "4th Session", time: "1:00 PM - 3:00 PM", tag: "Afternoon" },
  { session: "5th Session", time: "3:00 PM - 5:00 PM", tag: "Post-Work" },
  { session: "6th Session", time: "5:00 PM - 7:00 PM", tag: "Peak Strength" },
  { session: "7th Session", time: "7:00 PM - 9:00 PM", tag: "Night Owls" },
];

// 2. Framer Motion variant orchestrations
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

const mainGridVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.2 }
  }
};

const blockCardVariants: Variants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", stiffness: 70, damping: 15 } // Crisp spring bounce on container entry
  }
};

const listContainerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.06 } // Cascades the rows smoothly down the page
  }
};

const rowVariants: Variants = {
  hidden: { opacity: 0, x: -20 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.4, ease: "easeOut" }
  }
};

const weekendBoxVariants: Variants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { type: "spring", stiffness: 100, damping: 12, delay: 0.3 }
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
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header section */}
        <motion.div variants={headerVariants} className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs font-bold uppercase tracking-widest text-secondary bg-secondary/10 px-4 py-1.5 rounded-full border border-secondary/20">
            Timetable
          </span>
          <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tight mt-4 leading-none">
            Gym <span className="inline-block text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">Schedule</span>
          </h2>
          <p className="text-slate-400 mt-4 text-base">
            Find your block, pack your gear, and show up. We run structured time slots throughout the week to manage capacity and maintain an elite lifting environment.
          </p>
        </motion.div>

        {/* Schedule Split Layout */}
        <motion.div variants={mainGridVariants} className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">

          {/* Weekday Block Card (Spans 2 columns on desktop) */}
          <motion.div 
            variants={blockCardVariants}
            className="lg:col-span-2 rounded-2xl border border-white/5 bg-surface/40 p-6 backdrop-blur-sm shadow-md"
          >
            <div className="flex items-center gap-3 border-b border-white/10 pb-4 mb-6">
              <CalendarIcon className="h-6 w-6 text-primary" />
              <div>
                <h3 className="text-xl font-bold text-white uppercase tracking-tight">Weekdays</h3>
                <p className="text-sm text-slate-400 font-bold uppercase tracking-wider mt-0.5">Monday - Friday sessions</p>
              </div>
            </div>

            {/* Timetable row grid */}
            <motion.div variants={listContainerVariants} className="space-y-3">
              {WEEKDAY_SESSIONS.map((slot, index) => (
                <motion.div
                  key={index}
                  variants={rowVariants}
                  whileHover={{ x: 6, backgroundColor: "rgba(255, 255, 255, 0.03)", transition: { duration: 0.2 } }}
                  className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-xl bg-background/50 border border-white/5 hover:border-primary/20 transition-all group cursor-pointer"
                >
                  <div className="flex items-center gap-4">
                    <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-xs font-bold text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                      {index + 1}
                    </span>
                    <div>
                      <h4 className="font-bold text-white text-sm tracking-wide">{slot.session}</h4>
                      <span className="inline-block text-[10px] font-semibold uppercase tracking-wider text-secondary mt-0.5">
                        {slot.tag}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 mt-2 sm:mt-0 text-slate-300 font-mono text-sm bg-slate-950 px-3 py-1.5 rounded-lg border border-white/5 group-hover:border-primary/30 transition-colors">
                    <ClockIcon className="h-4 w-4 text-slate-500 group-hover:text-primary transition-colors" />
                    {slot.time}
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>

          {/* Weekend & Holiday Block Card (Spans 1 column) */}
          <motion.div 
            variants={blockCardVariants}
            className="rounded-2xl border border-secondary/30 bg-secondary/5 p-6 backdrop-blur-md shadow-lg lg:sticky lg:top-8"
          >
            <div className="flex items-center gap-3 border-b border-secondary/20 pb-4 mb-6">
              <SunIcon className="h-6 w-6 text-secondary" />
              <div>
                <h3 className="text-xl font-bold text-white uppercase tracking-tight">Weekends</h3>
                <p className="text-sm font-bold text-slate-300 uppercase tracking-wider mt-0.5">Saturdays & Holidays</p>
              </div>
            </div>

            {/* Single comprehensive weekend block window */}
            <motion.div 
              variants={weekendBoxVariants}
              whileHover={{ scale: 1.02 }}
              className="text-center py-8 px-4 rounded-xl bg-background/60 border border-secondary/20 transition-all duration-300 hover:border-secondary/40"
            >
              <span className="text-xs font-bold uppercase tracking-widest text-slate-400 block mb-1">
                Open Floor Window
              </span>
              <div className="inline-flex items-center gap-2 text-2xl font-black text-white font-mono my-3">
                7:00 AM - 1:00 PM
              </div>
              <p className="text-xs text-slate-400 max-w-[200px] mx-auto leading-relaxed mt-2">
                No formal session cuts. Show up anytime within this block to complete your weekend programming splits.
              </p>
            </motion.div>

            {/* Quick reminder callout block */}
            <div className="mt-6 rounded-xl bg-white/5 p-4 border border-white/5 text-xs text-slate-300 space-y-2">
              <p className="font-bold text-white">⚠️ Session Notice:</p>
              <p className="leading-relaxed">Please clean your bench space and return all plate weights to trees 10 minutes before your slot expires.</p>
            </div>
          </motion.div>

        </motion.div>

      </div>
    </motion.section>
  );
}

export default Schedule;
