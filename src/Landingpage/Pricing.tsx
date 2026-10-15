import React, { useEffect, useState } from "react";
import { CheckIcon } from "@heroicons/react/24/solid";
import { easeInOut, motion, type Variants } from "motion/react";
import { Link } from "react-router-dom";

const API_URL = import.meta.env.VITE_API_URL;

type Membership = {
  _id?: string;
  name: string;
  price: number;
  type: "monthly" | "annual" | "day_pass" | string;
  amenities: string[];
  is_popular: boolean;
};

const sectionVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.05 },
  },
};

const headerVariants: Variants = {
  hidden: { opacity: 0, y: -15 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: easeInOut },
  },
};

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: easeInOut },
  },
};

const Pricing: React.FC = () => {
  const [isAnnual, setIsAnnual] = useState(false);
  const [memberships, setMemberships] = useState<Membership[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const controller = new AbortController();

    const getMembership = async () => {
      try {
        setLoading(true);
        const res = await fetch(`${API_URL}/api/membership/get-memberships`, {
          method: "GET",
          headers: { "Content-Type": "application/json" },
          signal: controller.signal,
        });

        if (!res.ok) {
          throw new Error(`Request failed with status ${res.status}`);
        }

        const data: Membership[] = await res.json();
        setMemberships(data);
      } catch (error) {
        if ((error as Error).name === "AbortError") return;
        console.error("Failed to load memberships:", error);
      } finally {
        setLoading(false);
      }
    };

    getMembership();

    return () => {
      controller.abort();
    };
  }, []);

  return (
    <motion.section
      id="membership"
      variants={sectionVariants}
      initial="hidden"
      animate="visible" // Changed from whileInView to animate for reliable direct-hash loading
      className="bg-background border-t border-white/10 py-20 text-text overflow-hidden relative"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

        {/* Header Section */}
        <motion.div variants={headerVariants} className="text-center max-w-xl mx-auto mb-10">
          <span className="text-[11px] font-extrabold uppercase tracking-widest text-secondary bg-secondary/10 px-3.5 py-1 rounded-full border border-secondary/30 mb-3 inline-block">
            Investment Plans
          </span>
          <h2 className="text-3xl sm:text-4xl font-black uppercase tracking-tight text-white">
            Choose Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">Tier</span>
          </h2>
          <p className="text-text/70 mt-3 text-sm font-normal leading-relaxed">
            Commit to your evolution. Select a membership package engineered for maximum results.
          </p>
        </motion.div>

        {/* Compact Billing Toggle */}
        <motion.div variants={headerVariants} className="flex items-center justify-center gap-3 mb-12">
          <span className={`text-xs font-bold uppercase tracking-wider transition-colors ${!isAnnual ? "text-white" : "text-text/50"}`}>
            Monthly
          </span>
          <button
            onClick={() => setIsAnnual(!isAnnual)}
            className="w-14 h-8 bg-surface rounded-full p-1 transition-colors relative border border-white/15 hover:border-primary/50 cursor-pointer shadow-inner"
            aria-label="Toggle billing duration"
          >
            <motion.div
              layout
              className="w-6 h-6 rounded-full bg-gradient-to-r from-primary to-secondary shadow-sm"
              animate={{ x: isAnnual ? 24 : 0 }}
              transition={{ type: "spring", stiffness: 350, damping: 22 }}
            />
          </button>
          <span className={`text-xs font-bold uppercase tracking-wider transition-colors ${isAnnual ? "text-white" : "text-text/50"}`}>
            Yearly
          </span>
        </motion.div>

        {/* Loading Skeleton State */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {[1, 2, 3].map((n) => (
              <div key={n} className="h-[380px] rounded-2xl bg-surface/40 border border-white/10 animate-pulse p-6 flex flex-col justify-between backdrop-blur-md">
                <div className="space-y-4">
                  <div className="h-5 bg-white/10 rounded w-1/3" />
                  <div className="h-8 bg-white/10 rounded w-1/2" />
                  <div className="space-y-2 pt-2">
                    <div className="h-3.5 bg-white/10 rounded w-full" />
                    <div className="h-3.5 bg-white/10 rounded w-5/6" />
                  </div>
                </div>
                <div className="h-10 bg-white/10 rounded-xl" />
              </div>
            ))}
          </div>
        ) : (
          /* Cards Grid */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto items-stretch">
            {memberships.map((plan, index) => {
              const calculatedPrice = isAnnual && plan.type === "monthly"
                ? plan.price * 12
                : plan.price;

              const calculatedBillingLabel = isAnnual && plan.type === "monthly"
                ? "/ year"
                : plan.type === "day_pass"
                  ? "/ day"
                  : "/ month";

              return (
                <motion.div
                  key={plan._id || index}
                  variants={cardVariants}
                  whileHover={{ y: -4, scale: 1.01 }}
                  className={`rounded-2xl flex flex-col transition-all duration-300 relative group border ${plan.is_popular
                    ? "bg-surface/80 border-primary/50 shadow-xl shadow-primary/20 lg:-translate-y-2 backdrop-blur-2xl"
                    : "bg-surface/40 border-white/10 hover:border-white/20 backdrop-blur-md"
                    }`}
                >
                  {/* Subtle Popular Spotlight Gradient Accent */}
                  {plan.is_popular && (
                    <div className="absolute inset-0 bg-gradient-to-b from-primary/15 via-transparent to-secondary/10 rounded-2xl pointer-events-none" />
                  )}

                  {/* Card Inner Container */}
                  <div className="p-6 flex flex-col justify-between h-full relative z-10">

                    <div>
                      {/* Top Header Row */}
                      <div className="flex items-center justify-between gap-3 mb-3">
                        <h3 className="text-base font-black uppercase tracking-tight text-white">
                          {plan.name}
                        </h3>
                        {plan.is_popular && (
                          <span className="bg-gradient-to-r from-primary to-secondary text-[9px] font-black uppercase tracking-widest px-2.5 py-0.5 rounded-full text-white shadow-md">
                            Popular
                          </span>
                        )}
                      </div>

                      {/* Pricing Display */}
                      <div className="py-4 border-y border-white/10 my-2 flex items-baseline gap-1.5">
                        <motion.span
                          key={calculatedPrice}
                          initial={{ scale: 0.95, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          transition={{ type: "spring", stiffness: 150, damping: 15 }}
                          className="text-3xl sm:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary"
                        >
                          ${calculatedPrice}
                        </motion.span>
                        <span className="text-[11px] font-bold uppercase tracking-wider text-text/50">
                          {calculatedBillingLabel}
                        </span>
                      </div>

                      {/* Amenities List */}
                      <ul className="space-y-3 my-4">
                        {plan.amenities?.map((perk, perkIndex) => (
                          <li key={perkIndex} className="flex items-start gap-2.5 group/item">
                            <div className="p-0.5 rounded-full bg-secondary/10 border border-secondary/20 mt-0.5 shrink-0">
                              <CheckIcon className="h-3 w-3 text-secondary" />
                            </div>
                            <span className="text-xs text-text/90 font-medium leading-normal group-hover/item:text-white transition-colors">
                              {perk}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Action Button */}
                    <Link
                      to="/login"
                      className={`w-full font-bold py-3 px-4 rounded-xl text-center text-xs uppercase tracking-wider transition-all duration-300 shadow-md ${plan.is_popular
                        ? "bg-gradient-to-r from-primary to-secondary text-white shadow-primary/25 hover:scale-[1.01]"
                        : "bg-white/5 hover:bg-white/10 border border-white/10 text-white hover:border-white/20"
                        }`}
                    >
                      Get Started
                    </Link>

                  </div>
                </motion.div>
              );
            })}
          </div>
        )}

      </div>
    </motion.section>
  );
};

export default Pricing;