import { CheckIcon } from "@heroicons/react/24/solid"

const plans = [
  {
    Name: 'Day Pass',
    Price: '$10',
    Billing: '/ Access',
    IsPopular: false,
    Perks: [
      'Single 2-Hour Training Session',
      'Full Access to Free Weights & Machines',
      'Valid for Any Scheduled Slot',
      'Restroom Amenities'
    ]
  },
  {
    Name: 'Weekly Pass',
    Price: '$35',
    Billing: '/ Week',
    IsPopular: false,
    Perks: [
      'Valid for 5 Days (Mon - Fri)',
      'Up to 2 Hours Per Daily Session',
      'Full Access to All Gym Facilities',
      'No Pre-Booking Required'
    ]
  },
  {
    Name: 'Monthly Pass',
    Price: '$75',
    Billing: '/ Month',
    IsPopular: false,
    Perks: [
      'Monday - Friday Floor Access',
      '2-Hour Standard Training Window',
      'Access to Modern Cable & Cardio Systems',
      'Restroom Amenities'
    ]
  },
  {
    Name: 'Monthly Pass with Trainer',
    Price: '$95',
    Billing: '/ Month',
    IsPopular: true, // Highlights this card visually
    Perks: [
      'All Standard Monthly Pass Perks',
      'Monday - Friday Floor Access',
      '1-on-1 Guided Coaching Sessions',
      'Custom Workout Program Architecture'
    ]
  },
  {
    Name: 'Monthly Pass with Trainer and Saturdays',
    Price: '$115',
    Billing: '/ Month',
    IsPopular: false,
    Perks: [
      'Full 6-Day Access (Mon - Sat)',
      'Includes All Public Holiday Slots',
      'Dedicated Professional Coaching',
      'Maximum Training Flexibility'
    ]
  }
];

const Pricing: React.FC = () => {
  return (
    <section id="membership" className="bg-background border-t border-slate-900 py-24 text-text">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header section */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs font-bold uppercase tracking-widest text-secondary bg-secondary/10 px-4 py-1.5 rounded-full border border-secondary/20">
            Plans
          </span>
          <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tight mt-4 leading-none">
            Gym <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">Memberships</span>
          </h2>
          <p className="text-slate-400 mt-4 text-base">
            Invest in yourself. Join a community built on strength, consistency, and results with membership options for every fitness level.
          </p>
        </div>

        {/* Dynamic Responsive Flex/Grid Layout */}
        <div className="flex flex-wrap justify-center gap-6">
          {plans.map((plan, index) => (
            <div
              key={index}
              className={`p-[2px] rounded-2xl transition-all duration-300 hover:-translate-y-2 flex flex-col w-full sm:w-[calc(50%-12px)] lg:w-[calc(33.333%-16px)] xl:w-[calc(20%-20px)] min-w-[250px] max-w-[340px] ${plan.IsPopular
                ? 'bg-gradient-to-r from-primary to-secondary shadow-lg shadow-primary/20 scale-105'
                : 'bg-white/5 hover:bg-gradient-to-r hover:from-primary/50 hover:to-secondary/50'
                }`}
            >
              {/* Inner Card Container */}
              <div className="bg-surface rounded-[14px] p-6 flex flex-col h-full justify-between relative overflow-hidden">

                {/* Popular Badge Accent */}
                {plan.IsPopular && (
                  <span className="absolute top-3 right-3 bg-secondary text-[8px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full text-black">
                    Popular
                  </span>
                )}

                <div>
                  {/* Card Title */}
                  <h3 className="text-lg font-black uppercase tracking-tight text-white line-clamp-3 min-h-[56px] border-b border-white/5 pb-3">
                    {plan.Name}
                  </h3>

                  {/* Pricing Frame */}
                  <div className="py-5 flex items-baseline gap-1">
                    <span className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">
                      {plan.Price}
                    </span>
                    <span className="text-xs text-slate-400 font-medium tracking-wide">
                      {plan.Billing}
                    </span>
                  </div>

                  {/* Perks List */}
                  <ul className="space-y-3 mb-8">
                    {plan.Perks.map((perk, perkIndex) => (
                      <li className="flex items-start gap-2.5 text-left" key={perkIndex}>
                        <CheckIcon className="h-4 w-4 text-secondary shrink-0 mt-0.5" />
                        <span className="text-sm text-slate-300 leading-snug">{perk}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Call To Action Anchor Element */}
                <a
                  href="#contact"
                  className={`w-full font-bold py-3 px-4 rounded-xl text-center text-sm uppercase tracking-wider transition-all duration-300 hover:scale-110 ${plan.IsPopular
                    ? 'bg-gradient-to-r from-primary to-secondary text-white hover:opacity-90 shadow-md shadow-primary/10'
                    : 'bg-slate-900 border border-slate-800 text-white hover:border-slate-700 hover:bg-slate-800'
                    }`}
                >
                  Select Plan
                </a>

              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}

export default Pricing;