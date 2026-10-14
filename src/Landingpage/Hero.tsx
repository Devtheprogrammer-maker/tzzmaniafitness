import { useEffect, useState } from 'react';
import {
  CalendarDaysIcon,
  CheckCircleIcon,
  ClockIcon,
  TicketIcon,
} from '@heroicons/react/24/solid';
import { motion, useReducedMotion, type Variants } from 'motion/react';
import dumbbell from '../assets/img/dumbbells.jpg';
import gymHero from '../assets/img/gymhero.jpg';

const IMAGES = [dumbbell, gymHero];
const ROTATE_MS = 8000;

const FACTS = [
  { value: '$10', label: 'Day pass', icon: TicketIcon },
  { value: '2 hrs', label: 'Floor access per visit', icon: ClockIcon },
  { value: '6 days', label: 'Open every week', icon: CalendarDaysIcon },
  { value: 'Walk-in', label: 'No booking needed', icon: CheckCircleIcon },
];

const container: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.12, delayChildren: 0.1 } },
};

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
};

export default function Hero() {
  const reduceMotion = useReducedMotion();
  const [active, setActive] = useState(0);

  // Rotate the background photo, unless the visitor prefers reduced motion
  useEffect(() => {
    if (reduceMotion) return;
    const id = setInterval(() => setActive((i) => (i + 1) % IMAGES.length), ROTATE_MS);
    return () => clearInterval(id);
  }, [reduceMotion]);

  return (
    <section className='relative isolate flex min-h-svh items-center overflow-hidden bg-background py-24 lg:py-0'>

      {/* Background: all photos stacked, only the active one is visible */}
      <div className='absolute inset-0 -z-10' aria-hidden='true'>
        {IMAGES.map((src, i) => (
          <img
            key={src}
            src={src}
            alt=''
            decoding='async'
            className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-1000 motion-reduce:transition-none ${i === active ? 'opacity-100' : 'opacity-0'
              }`}
          />
        ))}
        {/* Darken the left side for text, and blend the bottom into the next section */}
        <div className='absolute inset-0 bg-gradient-to-r from-background via-background/80 to-background/30' />
        <div className='absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-background to-transparent' />
      </div>

      <motion.div
        variants={container}
        initial='hidden'
        animate='visible'
        className='mx-auto grid w-full max-w-7xl grid-cols-1 items-center gap-12 px-4 sm:px-6 lg:grid-cols-2 lg:px-8'
      >
        {/* Left: message and calls to action */}
        <div>
          <motion.span
            variants={fadeUp}
            className='inline-block rounded-full border border-secondary/30 bg-secondary/10 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-secondary'
          >
            No Excuses. Just Results.
          </motion.span>

          <motion.h1
            variants={fadeUp}
            className='mt-5 text-5xl font-black uppercase leading-[1.05] tracking-tight text-white sm:text-6xl md:text-7xl'
          >
            Forge Your{' '}
            <span className='inline-block bg-gradient-to-r from-primary to-secondary bg-clip-text pb-1 text-transparent'>
              Strength
            </span>
          </motion.h1>

          <motion.p variants={fadeUp} className='mt-5 max-w-lg text-base leading-relaxed text-slate-300 sm:text-lg'>
            Train with dumbbells, cable machines, cardio equipment and more. Everything you need to build strength,
            improve endurance and reach your fitness goals, with friendly coaching whenever you want it.
          </motion.p>

          <motion.div variants={fadeUp} className='mt-8 flex flex-col gap-3 sm:flex-row'>
            <motion.a
              href='#membership'
              whileHover={{ y: -2, scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              transition={{ duration: 0.2 }}
              className='flex items-center justify-center rounded-xl bg-gradient-to-r from-primary to-secondary px-8 py-3.5 text-sm font-bold uppercase tracking-wider text-white shadow-lg shadow-primary/20'
            >
              Join now
            </motion.a>
            <motion.a
              href='#schedule'
              whileHover={{ y: -2, scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              transition={{ duration: 0.2 }}
              className='flex items-center justify-center rounded-xl border border-white/20 bg-background/40 px-8 py-3.5 text-sm font-bold uppercase tracking-wider text-white backdrop-blur-sm hover:border-white/40'
            >
              See opening hours
            </motion.a>
          </motion.div>

          <motion.p variants={fadeUp} className='mt-4 text-sm text-slate-400'>
            Not ready to commit? Try a day pass for $10.
          </motion.p>
        </div>

        {/* Right: the facts a first-time visitor wants */}
        <motion.dl
          variants={fadeUp}
          className='grid w-full max-w-md grid-cols-2 gap-px overflow-hidden rounded-2xl border border-white/10 bg-white/10 shadow-xl backdrop-blur-sm lg:ml-auto'
        >
          {FACTS.map(({ value, label, icon: Icon }) => (
            <div key={label} className='flex flex-col-reverse bg-surface/80 p-5 sm:p-6'>
              <dt className='mt-2 flex items-center gap-2 text-xs font-medium uppercase tracking-wider text-slate-400'>
                <Icon className='h-4 w-4 shrink-0 text-secondary' aria-hidden='true' />
                {label}
              </dt>
              <dd className='text-3xl font-black tracking-tight text-white'>{value}</dd>
            </div>
          ))}
        </motion.dl>
      </motion.div>
    </section>
  );
}