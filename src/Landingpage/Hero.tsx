import dumbbell from "../assets/img/dumbbells.jpg";
import gymHero from "../assets/img/gymhero.jpg";
import { useState, useEffect} from "react";
import {
  CalendarDaysIcon,
  TrophyIcon,
  FireIcon,
  BoltIcon
} from "@heroicons/react/24/solid";
import { easeInOut, motion, type Variants} from 'motion/react'
// import type { Variants } from "framer-motion";

// Move static configurations outside the component to prevent re-creation on every render
const STATS_DATA = [
  { title: "6 Days", subtitle: "Open Weekly", icon: CalendarDaysIcon },
  { title: "100%", subtitle: "Maintained Equipment", icon: TrophyIcon },
  { title: "Pro", subtitle: "Coach", icon: FireIcon },
  { title: "Premium", subtitle: "Strength & Cardio", icon: BoltIcon },
];

const mainWrapperVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { 
      duration: 0.5, 
      ease: easeInOut,
      staggerChildren: 0.2 // Orchestrates clean entry flow across whole page
    }
  }
};

const leftColumnVariants: Variants = {
  hidden: { opacity: 0, x: -40 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.8, ease: easeInOut, staggerChildren: 0.15 }
  }
};

const spanVariants: Variants = {
  hidden: { opacity: 0, x: 50 }, // Comes from the right
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.8, ease: easeInOut }
  },
};

const rightGridVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.12, // Slightly tighter rhythm for multi-card grid
    },
  },
};

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 30 }, // Fixed from negative to slide gracefully upward
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: easeInOut }
  },
};

const buttonHoverVariants: Variants = {
  hover: { y: -4, scale: 1.02, transition: { duration: 0.2, ease: "easeOut" } },
  tap: { scale: 0.98 }
};

const Hero: React.FC = () => {
  const [picture, setPicture] = useState(dumbbell);

  useEffect(() => {
    const interval = setInterval(() => {
      setPicture((current) => (current === dumbbell ? gymHero : dumbbell));
    }, 8000);

    return () => clearInterval(interval);
  }, []);

  return (
    <section
      className="min-h-screen bg-cover bg-center bg-no-repeat transition-all duration-700 ease-in-out py-20 lg:py-0 flex items-center"
      style={{ backgroundImage: `url(${picture})` }}
    >
      <motion.div
        variants={mainWrapperVariants}
        initial="hidden"
        animate="visible"
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center w-full"
      >
        {/* Left Column: Heading Content Card */}
        <motion.div 
          variants={leftColumnVariants}
          className="p-6 md:p-8 rounded-2xl bg-surface/80 backdrop-blur-sm max-w-xl mx-auto lg:mx-0"
        >
          <div className="inline-block text-secondary text-[10px] sm:text-xs font-bold uppercase tracking-widest bg-secondary/10 py-1.5 px-3 sm:py-2 sm:px-4 rounded-full border border-secondary/50">
            No Excuses. Just Results.
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-black uppercase tracking-tight leading-none pt-4 overflow-hidden">
            Forge Your{" "}
            <motion.span 
              variants={spanVariants}
              className="inline-block text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary"
            >
              Strength
            </motion.span>
          </h1>

          <p className="text-text text-base sm:text-lg max-w-lg pt-3 leading-relaxed">
            Train with state-of-the-art equipment, including dumbbells, cable machines, cardio equipment, and more. Everything you need to build strength, improve endurance, and achieve your fitness goals.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-stretch sm:justify-start pt-6">
            <motion.a 
              variants={buttonHoverVariants}
              whileHover="hover"
              whileTap="tap"
              href="#membership" 
              className="bg-primary hover:bg-secondary/50 text-white font-bold py-3.5 px-8 rounded-xl text-center shadow-lg shadow-primary/20"
            >
              Join Now
            </motion.a>
            <motion.a 
              variants={buttonHoverVariants}
              whileHover="hover"
              whileTap="tap"
              href="#schedule" 
              className="border border-slate-800 hover:border-slate-700 bg-slate-900/50 text-white font-semibold py-3.5 px-8 rounded-xl text-center"
            >
              View Schedule
            </motion.a>
          </div>
        </motion.div>

        {/* Right Column: Statistics Grid */}
        <motion.div
          variants={rightGridVariants}
          className="grid grid-cols-2 gap-4 sm:gap-6 max-w-md mx-auto lg:mx-0 w-full"
        >
          {STATS_DATA.map((stat) => {
            const IconComponent = stat.icon;

            return (
              <motion.div
                variants={cardVariants}
                whileTap={{ scale: 0.95, y: 0 }}
                key={stat.title}
                className="rounded-2xl border border-white/20 bg-background/80 p-4 sm:p-6 backdrop-blur-sm shadow-lg transition-all duration-300 hover:-translate-y-2 hover:scale-105 hover:shadow-primary/20"
              >
                {IconComponent && <IconComponent className="h-6 w-6 sm:h-8 sm:w-8 text-secondary mb-2 sm:mb-3" />}
                <h3 className="text-2xl sm:text-3xl font-extrabold text-primary tracking-tight">
                  {stat.title}
                </h3>
                <p className="mt-1 sm:mt-2 text-xs sm:text-sm text-slate-400 leading-tight">
                  {stat.subtitle}
                </p>
              </motion.div>
            );
          })}
        </motion.div>
      </motion.div>
    </section>
  );
};

export default Hero;
