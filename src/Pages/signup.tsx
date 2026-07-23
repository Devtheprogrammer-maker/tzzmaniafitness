import React from "react";
import Navbar from "../components/Navbar";
import {
    RocketLaunchIcon,
    BellIcon,
    ChevronRightIcon
} from "@heroicons/react/24/solid";

const Signup: React.FC = () => {
    // Prevent actual form submissions for now
    const handleNotifySubmit = (e: React.FormEvent) => {
        e.preventDefault();
    };

    // Simulated countdown metrics
    const countdown = [
        { label: "Days", value: "14" },
        { label: "Hours", value: "08" },
        { label: "Mins", value: "42" },
        // { label: "Secs", value: "19" },
    ];

    return (
        <section className="bg-background min-h-screen text-text flex flex-col selection:bg-primary/30">
            {/* Mounted Navigation Element */}
            <Navbar />

            {/* Main Content Layout Container */}
            <div className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12 relative overflow-hidden">

                {/* Background Accent Ambient Glow */}
                <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-primary/10 rounded-full blur-[120px] pointer-events-none"></div>
                <div className="absolute bottom-1/4 left-1/3 w-64 h-64 bg-secondary/5 rounded-full blur-[100px] pointer-events-none"></div>

                {/* Main Visual Center Card */}
                <div className="max-w-xl w-full text-center relative z-10">

                    {/* Launch Icon Visual Anchor */}
                    <div className="inline-flex p-3.5 rounded-2xl bg-gradient-to-r from-primary/10 to-secondary/10 border border-primary/20 text-primary mb-6 animate-bounce duration-1000">
                        <RocketLaunchIcon className="h-8 w-8" />
                    </div>

                    {/* Typography Content Stack */}
                    <span className="block text-xs font-bold uppercase tracking-widest text-secondary mb-3">
                        Portal Update In Progress
                    </span>

                    <h1 className="text-4xl sm:text-5xl font-black uppercase tracking-tight leading-none mb-4">
                        Membership Registration<br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">
                            Opening Soon
                        </span>
                    </h1>

                    <p className="text-slate-400 text-base sm:text-lg max-w-md mx-auto mb-10 leading-relaxed">
                        We are currently fine-tuning our automated membership portal. Get ready to lock in your training sessions, track your programming, and manage your billing profiles straight from the web.
                    </p>

                    {/* Simulated Countdown Grid Interface */}
                    <div className="grid grid-cols-3 gap-3 sm:gap-4 max-w-md mx-auto mb-10">
                        {countdown.map((item, idx) => (
                            <div
                                key={idx}
                                className="p-3 sm:p-4 rounded-xl border border-white/5 bg-surface/40 backdrop-blur-sm shadow-md"
                            >
                                <span className="block text-2xl sm:text-3xl font-black text-white font-mono tracking-tight">
                                    {item.value}
                                </span>
                                <span className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mt-1">
                                    {item.label}
                                </span>
                            </div>
                        ))}
                    </div>

                    {/* Mock Notification Action Form Block */}
                    <div className="p-[2px] rounded-2xl bg-gradient-to-r from-primary/20 to-secondary/20 max-w-md mx-auto">
                        <div className="bg-surface p-5 sm:p-6 rounded-[14px] text-left">
                            <div className="flex items-center gap-2 text-white font-bold text-sm mb-3">
                                <BellIcon className="h-4 w-4 text-secondary" />
                                <h3>Get Early Access Notification</h3>
                            </div>

                            <form onSubmit={handleNotifySubmit} className="flex flex-col sm:flex-row gap-2.5">
                                <input
                                    type="email"
                                    placeholder="Enter your email address"
                                    disabled
                                    className="flex-1 bg-slate-950 border border-slate-900 rounded-xl px-4 py-3 text-sm text-slate-500 placeholder-slate-700 cursor-not-allowed focus:outline-none"
                                />
                                <button
                                    type="submit"
                                    disabled
                                    className="bg-slate-900 text-slate-600 border border-slate-800 font-bold py-3 px-5 rounded-xl text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 cursor-not-allowed whitespace-nowrap"
                                >
                                    Notify Me
                                    <ChevronRightIcon className="h-3 w-3" />
                                </button>
                            </form>
                            <p className="text-[10px] text-slate-500 mt-2.5 text-center sm:text-left">
                                💡 We will drop you a direct notification link the exact hour the member gate opens.
                            </p>
                        </div>
                    </div>

                </div>
            </div>
        </section>
    );
};

export default Signup;
