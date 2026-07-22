import { 
  CheckCircleIcon, 
  UsersIcon,  
  ClockIcon,  
  WrenchScrewdriverIcon, 
  ShieldCheckIcon,
  ChatBubbleLeftRightIcon
} from '@heroicons/react/24/solid';

export default function About() {
  const advantages = [
    { title: "Affordable Memberships", desc: "Premium training setups accessible on any budget tier." },
    { title: "Clean Facilities", desc: "Deep cleaned daily with medical-grade equipment sanitizers." },
    { title: "Modern Equipment", desc: "Biomechanically advanced cable systems and free-weight arrays." },
    { title: "Flexible Schedule", desc: "Open early and late to seamless fit your busy lifestyle workflow." },
    { title: "Friendly Staff", desc: "No intimidating toxic fitness culture—just direct support." },
    { title: "Personal Training", desc: "Structured workout programming tailored directly to your targets." },
  ];

  const statistics = [
    { value: "100+", label: "Active Members", icon: UsersIcon },
    { value: "5+", label: "Years Experience", icon: ShieldCheckIcon },
    { value: "20+", label: "Premium Machines", icon: WrenchScrewdriverIcon },
    { value: "6", label: "Days Open Weekly", icon: ClockIcon },
  ];

  return (
    <section id="about" className="py-24 bg-background text-text selection:bg-primary/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header Elements */}
        <div className="text-center max-w-3xl mx-auto mb-20">
          <span className="text-xs font-bold uppercase tracking-widest text-secondary bg-secondary/10 px-4 py-1.5 rounded-full border border-secondary/20">
            Why Choose Tzzmania
          </span>
          <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tight mt-4 leading-none">
            We Build The Environment,<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">You Build The Results</span>
          </h2>
          <p className="text-slate-400 mt-4 text-lg">
            People compare gyms before choosing their home turf. We don't hide our perks. Here is exactly why elite lifters and absolute beginners choose Tzzmania Fitness.
          </p>
        </div>

        {/* Core Layout Split Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-start">
          
          {/* Left Column: Detailed Feature Value Blocks */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {advantages.map((item, idx) => (
              <div 
                key={idx} 
                className="p-5 rounded-2xl border border-white/5 bg-surface/40 backdrop-blur-sm shadow-sm transition-all duration-300 hover:border-primary/30 hover:bg-surface/60 group"
              >
                <div className="flex items-center gap-3 mb-2">
                  <CheckCircleIcon className="h-6 w-6 text-secondary flex-shrink-0 group-hover:scale-110 transition-transform" />
                  <h3 className="font-bold text-lg text-white group-hover:text-primary transition-colors">
                    {item.title}
                  </h3>
                </div>
                <p className="text-sm text-slate-400 leading-relaxed pl-9">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>

          {/* Right Column: Quantitative Numbers Layout + Human Identity Quote */}
          <div className="flex flex-col gap-8">
            
            {/* Metric Analytics Grid */}
            <div className="grid grid-cols-2 gap-4">
              {statistics.map((stat, idx) => {
                const StatIcon = stat.icon;
                return (
                  <div 
                    key={idx} 
                    className="p-6 rounded-2xl bg-gradient-to-br from-surface to-background border border-white/10 text-center relative overflow-hidden group shadow-md"
                  >
                    <div className="absolute top-3 right-3 text-white/5 group-hover:text-secondary/10 transition-colors">
                      <StatIcon className="h-12 w-12" />
                    </div>
                    <span className="block text-4xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-400 group-hover:from-primary group-hover:to-secondary transition-all duration-500">
                      {stat.value}
                    </span>
                    <span className="block text-xs font-medium uppercase tracking-wider text-slate-400 mt-2">
                      {stat.label}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Personality Branding Quote Card */}
            <div className="relative p-8 rounded-2xl border border-secondary/30 bg-secondary/5 backdrop-blur-md mt-2 group overflow-hidden">
              <div className="absolute -top-6 -right-6 text-secondary/10 pointer-events-none">
                <ChatBubbleLeftRightIcon className="h-32 w-32" />
              </div>
              <blockquote className="relative z-10">
                <p className="text-xl md:text-2xl font-semibold italic text-slate-200 leading-snug">
                  "The hardest part is walking through the door. We'll help with everything after that."
                </p>
                <footer className="mt-4 flex items-center gap-3">
                  <div className="h-1 w-8 bg-primary rounded-full"></div>
                  <cite className="not-italic font-bold text-sm uppercase tracking-widest text-primary">
                    Tzzmania Fitness
                  </cite>
                </footer>
              </blockquote>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
