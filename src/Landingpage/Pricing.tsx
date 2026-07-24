import { CheckIcon } from "@heroicons/react/24/solid"
import { easeInOut, motion, type Variants } from 'motion/react'
import { useState } from "react"

// 1. Static array extracted outside component scope and improved with keys casing
const PLANS_DATA = [
  {
    name: 'Day Pass',
    monthlyPrice: 10,
    billing: '/ Access',
    isPopular: false,
    perks: [
      'Single 2-Hour Training Session',
      'Full Access to Free Weights & Machines',
      'Valid for Any Scheduled Slot',
      'Restroom Amenities'
    ]
  },
  {
    name: 'Weekly Pass',
    monthlyPrice: 35,
    billing: '/ Week',
    isPopular: false,
    perks: [
      'Valid for 5 Days (Mon - Fri)',
      'Up to 2 Hours Per Daily Session',
      'Full Access to All Gym Facilities',
      'No Pre-Booking Required'
    ]
  },
  {
    name: 'Monthly Pass',
    monthlyPrice: 75,
    billing: '/ Month',
    isPopular: false,
    perks: [
      'Monday - Friday Floor Access',
      '2-Hour Standard Training Window',
      'Access to Modern Cable & Cardio Systems',
      'Restroom Amenities'
    ]
  },
  {
    name: 'Monthly Pass with Trainer',
    monthlyPrice: 95,
    billing: '/ Month',
    isPopular: true, 
    perks: [
      'All Standard Monthly Pass Perks',
      'Monday - Friday Floor Access',
      '1-on-1 Guided Coaching Sessions',
      'Custom Workout Program Architecture'
    ]
  },
  {
    name: 'Monthly Pass with Trainer and Saturdays',
    monthlyPrice: 115,
    billing: '/ Month',
    isPopular: false,
    perks: [
      'Full 6-Day Access (Mon - Sat)',
      'Includes All Public Holiday Slots',
      'Dedicated Professional Coaching',
      'Maximum Training Flexibility'
    ]
  }
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

const flexContainerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08 } 
  }
};

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 50, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { type: "spring", stiffness: 60, damping: 14 }
  }
};

const buttonVariants: Variants = {
  hover: { scale: 1.05, y: -2, transition: { duration: 0.2 } },
  tap: { scale: 0.98, y: 0 }
};

const Pricing: React.FC = () => {
  const [isAnnual, setIsAnnual] = useState(false);

  return (
    <motion.section 
      id="membership" 
      variants={sectionVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-100px" }}
      className="bg-background border-t border-slate-900 py-24 text-text overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header section */}
        <motion.div variants={headerVariants} className="text-center max-w-2xl mx-auto mb-10">
          <span className="text-xs font-bold uppercase tracking-widest text-secondary bg-secondary/10 px-4 py-1.5 rounded-full border border-secondary/20">
            Plans
          </span>
          <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tight mt-4 leading-none">
            Gym <span className="inline-block text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">Memberships</span>
          </h2>
          <p className="text-slate-400 mt-4 text-base">
            Invest in yourself. Join a community built on strength, consistency, and results with membership options for every fitness level.
          </p>
        </motion.div>

        {/* Interactive Catchy Billing Toggle Switch */}
        <motion.div 
          variants={headerVariants} 
          className="flex items-center justify-center gap-4 mb-16"
        >
          <span className={`text-sm font-bold uppercase tracking-wider transition-colors ${!isAnnual ? 'text-primary' : 'text-slate-400'}`}>
            Monthly
          </span>
          <button 
            onClick={() => setIsAnnual(!isAnnual)}
            className="w-14 h-8 bg-slate-800 rounded-full p-1 transition-colors relative border border-white/10 hover:border-primary/40"
            aria-label="Toggle annual billing discount"
          >
            <motion.div 
              layout
              className="w-6 h-6 rounded-full bg-gradient-to-r from-primary to-secondary"
              animate={{ x: isAnnual ? 22 : 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
            />
          </button>
          <span className={`text-sm font-bold uppercase tracking-wider transition-colors flex items-center gap-1.5 ${isAnnual ? 'text-secondary' : 'text-slate-400'}`}>
            Yearly 
            {/* <span className="text-[10px] font-black tracking-widest bg-secondary/20 text-secondary border border-secondary/30 px-2 py-0.5 rounded-md normal-case">
              SAVE 20%
            </span> */}
          </span>
        </motion.div>

        {/* Dynamic Responsive Flex Layout */}
        <motion.div variants={flexContainerVariants} className="flex flex-wrap justify-center gap-6 items-stretch">
          {PLANS_DATA.map((plan, index) => {
            // Calculate real-time value changes based on pricing toggle layout
            const calculatedPrice = isAnnual && plan.billing === '/ Month'
              ? Math.floor(plan.monthlyPrice * 12 ) // multiply by * 0.8 to get 20% Discount calculated annually
              : plan.monthlyPrice;

            const calculatedBillingLabel = isAnnual && plan.billing === '/ Month' 
              ? '/ Year' 
              : plan.billing;

            return (
              <motion.div
                key={index}
                variants={cardVariants}
                whileHover={{ y: -8, transition: { duration: 0.3, ease: "easeOut" } }}
                className={`p-[2px] rounded-2xl flex flex-col w-full sm:w-[calc(50%-12px)] lg:w-[calc(33.333%-16px)] xl:w-[calc(20%-20px)] min-w-[250px] max-w-[340px] transition-shadow duration-300 relative group ${
                  plan.isPopular
                    ? 'bg-gradient-to-b from-primary to-secondary shadow-[0_0_30px_rgba(242,17,79,0.15)] xl:scale-105 z-10'
                    : 'bg-white/5 hover:bg-gradient-to-b hover:from-primary/30 hover:to-secondary/30'
                }`}
              >
                {/* Popular Card Interactive Outer Glow Accent Layer */}
                {plan.isPopular && (
                  <div className="absolute inset-0 bg-gradient-to-b from-primary to-secondary opacity-20 blur-xl -z-10 group-hover:opacity-40 transition-opacity duration-300" />
                )}

                {/* Inner Card Container */}
                <div className="bg-surface rounded-[14px] p-6 flex flex-col h-full justify-between relative overflow-hidden flex-1">

                  {/* Popular Badge Accent */}
                  {plan.isPopular && (
                    <span className="absolute top-3 right-3 bg-gradient-to-r from-primary to-secondary text-[8px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full text-white shadow-sm shadow-black/50">
                      Popular
                    </span>
                  )}

                  <div>
                    {/* Card Title */}
                    <h3 className="text-lg font-black uppercase tracking-tight text-white border-b border-white/5 pb-3 pr-12 min-h-[52px] flex items-center">
                      {plan.name}
                    </h3>

                    {/* Pricing Frame */}
                    <div className="py-6 flex items-baseline gap-1 overflow-hidden">
                      <motion.span 
                        key={calculatedPrice}
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ type: "spring", stiffness: 100, damping: 12 }}
                        className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary inline-block"
                      >
                        ${calculatedPrice}
                      </motion.span>
                      <span className="text-xs text-slate-400 font-medium tracking-wide">
                        {calculatedBillingLabel}
                      </span>
                    </div>

                    {/* Perks List */}
                    <ul className="space-y-3 mb-8">
                      {plan.perks.map((perk, perkIndex) => (
                        <li className="flex items-start gap-2.5 text-left group/li" key={perkIndex}>
                          <CheckIcon className="h-4 w-4 text-secondary shrink-0 mt-0.5 group-hover/li:scale-125 transition-transform" />
                          <span className="text-sm text-slate-300 leading-snug group-hover/li:text-white transition-colors">{perk}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Call To Action Button Element */}
                  <motion.a
                    variants={buttonVariants}
                    whileHover="hover"
                    whileTap="tap"
                    href="/pay"
                    className={`w-full font-bold py-3 px-4 rounded-xl text-center text-sm uppercase tracking-wider shadow-md transition-all ${
                      plan.isPopular
                        ? 'bg-gradient-to-r from-primary to-secondary text-white shadow-primary/20'
                        : 'bg-slate-900 border border-slate-800 text-white hover:border-slate-700 hover:bg-slate-800 shadow-black/50'
                    }`}
                  >
                    Select Plan
                  </motion.a>

                </div>
              </motion.div>
            );
          })}
        </motion.div>

      </div>
    </motion.section>
  );
}

export default Pricing; 