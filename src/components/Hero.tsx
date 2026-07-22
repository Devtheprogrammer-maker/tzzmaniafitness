import dumbbell from "../assets/img/dumbbells.jpg";
import gymHero from "../assets/img/gymhero.jpg";
import { useState, useEffect } from "react";
import {
  CalendarDaysIcon,
  TrophyIcon,
  FireIcon,
  BoltIcon
} from "@heroicons/react/24/solid";


export default function Hero() {
  const [picture, setPicture] = useState(dumbbell);

  useEffect(() => {
    const interval = setInterval(() => {
      setPicture((current) => (current === dumbbell ? gymHero : dumbbell));
    }, 8000);

    // 3. Always clean up the interval when the component unmounts
    return () => clearInterval(interval);
  }, []); // Empty array ensures this only runs once on mount

  const stats = [
    { title: "6 Days", subtitle: "Open Weekly", icon: CalendarDaysIcon },
    { title: "100%", subtitle: "Maintained Equipment", icon: TrophyIcon },
    { title: "Pro", subtitle: "Coach", icon: FireIcon },
    { title: "Premium", subtitle: "Strength & Cardio", icon: BoltIcon },
  ];


  return (
    <section
  // Changed h-screen to min-h-screen and added vertical padding for mobile breathing room
  className="min-h-screen bg-cover bg-center bg-no-repeat transition-all duration-700 ease-in-out py-20 lg:py-0 flex items-center"
  style={{ backgroundImage: `url(${picture})` }}
>
  {/* Replaced flex-wrap with a responsive grid layout */}
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center w-full">
    
    {/* Left Column: Heading Content Card */}
    <div className="p-6 md:p-8 rounded-2xl bg-surface/80 backdrop-blur-sm max-w-xl mx-auto lg:mx-0">
      <div className="inline-block text-secondary text-[10px] sm:text-xs font-bold uppercase tracking-widest bg-secondary/10 py-1.5 px-3 sm:py-2 sm:px-4 rounded-full border border-secondary/50">
        No Excuses. Just Results.
      </div>
      
      {/* Scaled typography fluidly: text-4xl on mobile, scaling up to text-6xl on desktops */}
      <h1 className="text-4xl sm:text-5xl md:text-6xl font-black uppercase tracking-tight leading-none pt-4">
        Forge Your
        <br />
        <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">Strength</span>
      </h1>
      
      <p className="text-text text-base sm:text-lg max-w-lg pt-3 leading-relaxed">
        Train with state-of-the-art equipment, including dumbbells, cable machines, cardio equipment, and more. Everything you need to build strength, improve endurance, and achieve your fitness goals.
      </p>

      <div className="flex flex-col sm:flex-row gap-4 justify-stretch sm:justify-start pt-6">
        <a href="#membership" className="bg-primary hover:bg-secondary/50 text-white font-bold py-3.5 px-8 rounded-xl text-center transition-all shadow-lg shadow-primary/20">
          Join Now
        </a>
        <a href="#schedule" className="border border-slate-800 hover:border-slate-700 bg-slate-900/50 text-white font-semibold py-3.5 px-8 rounded-xl text-center transition-all">
          View Schedule
        </a>
      </div>
    </div>

    {/* Right Column: Statistics Grid */}
    {/* Centered the grid on mobile and limited its scaling width */}
    <div className="grid grid-cols-2 gap-4 sm:gap-6 max-w-md mx-auto lg:mx-0 w-full">
      {stats.map((stat) => {
        const IconComponent = stat.icon;

        return (
          <div
            key={stat.title}
            // Tailored padding down to p-4 on small screens to conserve layout spaces
            className="rounded-2xl border border-white/20 bg-background/80 p-4 sm:p-6 backdrop-blur-sm shadow-lg transition-all duration-300 hover:-translate-y-2 hover:scale-105 hover:shadow-primary/20"
          >
            {IconComponent && <IconComponent className="h-6 w-6 sm:h-8 sm:w-8 text-secondary mb-2 sm:mb-3" />}

            {/* Shifted text scaling from text-3xl down to text-2xl on phone sizes */}
            <h3 className="text-2xl sm:text-3xl font-extrabold text-primary tracking-tight">
              {stat.title}
            </h3>
            <p className="mt-1 sm:mt-2 text-xs sm:text-sm text-slate-400 leading-tight">
              {stat.subtitle}
            </p>
          </div>
        );
      })}
    </div>

  </div>
</section>

  );
}
