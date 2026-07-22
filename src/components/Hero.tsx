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
      className="h-screen bg-cover bg-center bg-no-repeat transition-all duration-700 ease-in-out"
      style={{ backgroundImage: `url(${picture})` }}
    >
      <div className="flex flex-wrap h-full justify-evenly items-center">
        <div className="px-4 py-2 rounded-lg bg-surface/80 backdrop-blur-sm">
          <div className="inline-block text-secondary text-xs font-bold uppercase tracking-widest bg-secondary/10 py-2 px-4 rounded-full border border-secondary/50">No Excuses. Just Results.</div>
          <h1 className="text-5xl md:text-6xl font-black uppercase tracking-tight leading-none pt-4">Forge Your
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">Strength</span>
          </h1>
          <p className="text-text text-lg max-w-lg pt-3">
            Train with state-of-the-art equipment, including dumbbells, cable machines, cardio equipment, and more. Everything you need to build strength, improve endurance, and achieve your fitness goals.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start pt-5 pb-4">
            <a href="#membership" className="bg-primary hover:bg-secondary/50 text-white font-bold py-3.5 px-8 rounded-xl text-center transition-all shadow-lg shadow-primary/20">
              Join Now
            </a>
            <a href="#schedule" className="border border-slate-800 hover:border-slate-700 bg-slate-900/50 text-white font-semibold py-3.5 px-8 rounded-xl text-center transition-all">
              View Schedule
            </a>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-6 max-w-md">
          {stats.map((stat) => {
            const IconComponent = stat.icon;

            return (
              <div
                key={stat.title}
                className="rounded-2xl border border-white/50 bg-background/80 p-6 backdrop-blur-sm shadow-lg transition-all duration-300 hover:-translate-y-2 hover:scale-105 hover:shadow-primary/20"
              >
                {IconComponent && <IconComponent className="h-8 w-8 text-secondary mb-3" />}

                <h3 className="text-3xl font-extrabold text-primary">
                  {stat.title}
                </h3>
                <p className="mt-2 text-sm text-slate-400">
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
