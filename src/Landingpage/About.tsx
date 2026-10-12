import React from 'react';
import {
  UsersIcon,
  ClockIcon,
  WrenchScrewdriverIcon,
  ShieldCheckIcon,
  ChatBubbleLeftRightIcon,
  BanknotesIcon,
  SparklesIcon,
  CalendarDaysIcon,
  HeartIcon,
  UserGroupIcon,
  ArrowRightIcon
} from '@heroicons/react/24/solid';
import { easeOut, motion, type Variants } from 'motion/react';

// Feature advantages enriched with distinct icons
const ADVANTAGES_DATA = [
  {
    title: "Affordable Memberships",
    desc: "Premium training setups accessible on any budget tier with flexible plans.",
    icon: BanknotesIcon,
    featured: false
  },
  {
    title: "Clean Facilities",
    desc: "Deep cleaned daily with medical-grade equipment sanitizers.",
    icon: SparklesIcon,
    featured: false
  },
  {
    title: "Modern Equipment",
    desc: "Biomechanically advanced cable systems and free-weight arrays.",
    icon: WrenchScrewdriverIcon,
    featured: true
  },
  {
    title: "Flexible Schedule",
    desc: "Open early and late to seamlessly fit your busy lifestyle workflow.",
    icon: CalendarDaysIcon,
    featured: false
  },
  {
    title: "Friendly Staff",
    desc: "No intimidating toxic fitness culture—just direct supportive guidance.",
    icon: HeartIcon,
    featured: false
  },
  {
    title: "Personal Training",
    desc: "Structured workout programming tailored directly to your targets.",
    icon: UserGroupIcon,
    featured: true
  },
];

const STATISTICS_DATA = [
  { value: "100+", label: "Active Members", icon: UsersIcon },
  { value: "5+", label: "Years Experience", icon: ShieldCheckIcon },
  { value: "20+", label: "Premium Machines", icon: WrenchScrewdriverIcon },
  { value: "6 Days", label: "Open Weekly", icon: ClockIcon },
];

// Animation Variants
const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.1 }
  }
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: easeOut }
  }
};

const About: React.FC = () => {
  return (
    <motion.section
      id="about"
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-80px" }}
      className="py-24 bg-background text-text selection:bg-primary/30 relative overflow-hidden"
    >
      {/* Subtle Background Glow Elements */}
      <div className="absolute top-1/4 -left-32 w-96 h-96 bg-primary/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-secondary/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-16">

        {/* Section Header */}
        <motion.div variants={itemVariants} className="text-center max-w-3xl mx-auto space-y-4">
          <span className="inline-flex items-center gap-2 text-xs font-extrabold uppercase tracking-widest text-secondary bg-secondary/10 px-4 py-1.5 rounded-full border border-secondary/20">
            Why Choose Tzzmania
          </span>
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black uppercase tracking-tight leading-none">
            We Build The Environment,<br />
            <span className="inline-block text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">
              You Build The Results
            </span>
          </h2>
          <p className="text-slate-400 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
            People compare gyms before choosing their home turf. We don't hide our perks. Here is exactly why elite lifters and absolute beginners choose Tzzmania Fitness.
          </p>
        </motion.div>

        {/* Bento Grid Architecture */}
        <motion.div variants={containerVariants} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {ADVANTAGES_DATA.map((item, idx) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={idx}
                variants={itemVariants}
                whileHover={{ y: -5 }}
                className={`group relative p-8 rounded-3xl border transition-all duration-300 backdrop-blur-md flex flex-col justify-between overflow-hidden ${item.featured
                  ? 'border-primary/40 bg-gradient-to-br from-surface/80 via-surface/40 to-primary/5 shadow-lg shadow-primary/5'
                  : 'border-white/10 bg-surface/30 hover:border-secondary/40 hover:bg-surface/50'
                  }`}
              >
                {/* Decorative hover gradient border overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-secondary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

                <div>
                  <div className="flex items-center justify-between mb-6">
                    <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 text-primary group-hover:bg-primary group-hover:text-background transition-colors duration-300">
                      <Icon className="h-6 w-6" />
                    </div>
                    {item.featured && (
                      <span className="text-[10px] font-extrabold uppercase tracking-wider text-primary bg-primary/10 border border-primary/20 px-3 py-1 rounded-full">
                        Popular Feature
                      </span>
                    )}
                  </div>

                  <h3 className="text-xl font-bold text-white group-hover:text-primary transition-colors duration-300">
                    {item.title}
                  </h3>
                  <p className="text-slate-400 text-sm mt-3 leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Stats Strip */}
        <motion.div
          variants={itemVariants}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 rounded-3xl bg-surface/40 border border-white/10 backdrop-blur-md"
        >
          {STATISTICS_DATA.map((stat, idx) => {
            const StatIcon = stat.icon;
            return (
              <div
                key={idx}
                className="p-6 rounded-2xl bg-background/50 border border-white/5 text-center flex flex-col items-center justify-center group hover:border-secondary/30 transition-colors"
              >
                <StatIcon className="h-6 w-6 text-slate-500 group-hover:text-secondary transition-colors mb-2" />
                <span className="text-3xl sm:text-4xl font-black tracking-tight text-white group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-primary group-hover:to-secondary transition-all duration-300">
                  {stat.value}
                </span>
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 mt-1">
                  {stat.label}
                </span>
              </div>
            );
          })}
        </motion.div>

        {/* Quote & CTA Card */}
        <motion.div
          variants={itemVariants}
          className="relative rounded-3xl border border-secondary/30 bg-gradient-to-r from-secondary/10 via-surface/60 to-primary/10 p-8 md:p-12 backdrop-blur-md overflow-hidden flex flex-col md:flex-row items-center justify-between gap-8"
        >
          <div className="absolute -right-8 -bottom-8 text-white/5 pointer-events-none">
            <ChatBubbleLeftRightIcon className="h-64 w-64" />
          </div>

          <div className="relative z-10 max-w-2xl space-y-4">
            <blockquote className="text-xl sm:text-2xl font-bold italic text-slate-100 leading-snug">
              "The hardest part is walking through the door. We'll help with everything after that."
            </blockquote>
            <div className="flex items-center gap-3">
              <span className="h-1 w-8 bg-primary rounded-full inline-block" />
              <cite className="not-italic font-bold text-xs uppercase tracking-widest text-primary">
                Tzzmania Fitness
              </cite>
            </div>
          </div>

          <motion.a
            href="#membership"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
            className="relative z-10 shrink-0 inline-flex items-center gap-3 px-8 py-4 rounded-2xl bg-primary text-background font-black uppercase text-sm tracking-wider shadow-lg shadow-primary/25 hover:bg-primary/90 transition-colors"
          >
            YOUR NEXT CHAPTER STARTS HERE.
            <ArrowRightIcon className="h-4 w-4" />
          </motion.a>
        </motion.div>

      </div>
    </motion.section>
  );
};

export default About;