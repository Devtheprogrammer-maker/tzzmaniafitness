import {
    EnvelopeIcon,
    PhoneIcon,
    MapPinIcon,
    PaperAirplaneIcon,
    ChatBubbleLeftRightIcon
} from '@heroicons/react/24/solid';

export default function Contact() {
    // Prevent actual form submissions for now
    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
    };

    return (
        <section id="contact" className="py-24 bg-background border-t border-slate-900 text-text">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                {/* Section Header */}
                <div className="text-center max-w-3xl mx-auto mb-20">
                    <span className="text-xs font-bold uppercase tracking-widest text-secondary bg-secondary/10 px-4 py-1.5 rounded-full border border-secondary/20">
                        Get In Touch
                    </span>
                    <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tight mt-4 leading-none">
                        Ready To Start Your <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">Transformation?</span>
                    </h2>
                    <p className="text-slate-400 mt-4 text-lg">
                        Have questions about memberships, programming, or hours? Drop us a message or visit the floor. We are here to help you get moving.
                    </p>
                </div>

                {/* Contact Split Layout */}
                <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 items-stretch">

                    {/* Left Column: Direct Info Cards (Spans 2 columns) */}
                    <div className="lg:col-span-2 flex flex-col justify-between gap-6">

                        {/* Email Card */}
                        <div className="p-6 rounded-2xl border border-white/5 bg-surface/40 backdrop-blur-sm flex items-start gap-4 hover:border-primary/20 transition-all group">
                            <div className="p-3 rounded-xl bg-primary/10 text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                                <EnvelopeIcon className="h-6 w-6" />
                            </div>
                            <div>
                                <h3 className="font-bold text-white uppercase text-xs tracking-wider text-slate-400 mb-1">Email Us Directly</h3>
                                <a href="mailto:devviv2005@gmail.com" className="text-lg font-bold text-white hover:text-primary transition-colors break-all">
                                    devviv2005@gmail.com
                                </a>
                                <p className="text-xs text-slate-500 mt-1">We typically reply within 24 operational hours.</p>
                            </div>
                        </div>

                        {/* Phone Card */}
                        <div className="p-6 rounded-2xl border border-white/5 bg-surface/40 backdrop-blur-sm flex items-start gap-4 hover:border-primary/20 transition-all group">
                            <div className="p-3 rounded-xl bg-secondary/10 text-secondary group-hover:bg-secondary group-hover:text-white transition-colors">
                                <PhoneIcon className="h-6 w-6" />
                            </div>
                            <div>
                                <h3 className="font-bold text-white uppercase text-xs tracking-wider text-slate-400 mb-1">Call or Text</h3>
                                <a href="tel:+5016017134" className="text-lg font-bold text-white hover:text-secondary transition-colors font-mono">
                                    +501 601-7134
                                </a>
                                <p className="text-xs text-slate-500 mt-1">Available during regular session timetables.</p>
                            </div>
                        </div>

                        {/* Location Card */}
                        <div className="p-6 rounded-2xl border border-white/5 bg-surface/40 backdrop-blur-sm flex items-start gap-4 hover:border-primary/20 transition-all group">
                            <div className="p-3 rounded-xl bg-slate-800 text-slate-400 group-hover:bg-slate-700 group-hover:text-white transition-colors">
                                <MapPinIcon className="h-6 w-6" />
                            </div>
                            <div>
                                <h3 className="font-bold text-white uppercase text-xs tracking-wider text-slate-400 mb-1">Drop By The Gym</h3>
                                <p className="text-lg font-bold text-white leading-tight">
                                    Tzzmania Fitness Headquarters
                                </p>
                                <p className="text-xs text-slate-400 mt-1">Come tour our modern facilities and meet the coaches.</p>

                                <iframe
                                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3785.736076954701!2d-88.39070642504005!3d18.404859082666423!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8f5b970fb9b2d853%3A0xc4641d5c65497a9e!2sTzzmania%20Fitness!5e0!3m2!1sen!2sbz!4v1784704784463!5m2!1sen!2sbz"
                                    className="pt-3 w-full h-full border-0 grayscale invert opacity-80 hover:opacity-100 transition-all duration-300"
                                    loading="lazy"
                                    title="Tzzmania Fitness Location"
                                ></iframe>
                            </div>
                        </div>

                        {/* Motivation Banner */}
                        <div className="p-6 rounded-2xl border border-secondary/30 bg-secondary/5 relative overflow-hidden flex-grow hidden lg:flex flex-col justify-end">
                            <div className="absolute -top-6 -right-6 text-secondary/5">
                                <ChatBubbleLeftRightIcon className="h-36 w-36" />
                            </div>
                            <h4 className="text-xl font-black uppercase text-white tracking-tight relative z-10">No commitment.</h4>
                            <p className="text-xs text-slate-400 mt-1 relative z-10 max-w-[240px]">
                                Stop by for a single session pass to test our equipment setup before you decide on a full membership.
                            </p>
                        </div>

                    </div>

                    {/* Right Column: Interactive Email Form UI (Spans 3 columns) */}
                    <div className="lg:col-span-3 p-8 rounded-2xl border border-white/10 bg-gradient-to-br from-surface to-background shadow-xl relative">

                        {/* Future development tag */}
                        <div className="absolute top-4 right-4 bg-slate-900 border border-slate-800 text-[10px] font-bold text-slate-500 uppercase tracking-widest px-2.5 py-1 rounded-full">
                            Form Backend Coming Soon
                        </div>

                        <h3 className="text-xl font-bold text-white mb-6 uppercase tracking-tight">Send a Quick Message</h3>

                        <form onSubmit={handleSubmit} className="space-y-5">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                <div>
                                    <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Full Name</label>
                                    <input
                                        type="text"
                                        placeholder="Devin Vivas"
                                        disabled
                                        className="w-full bg-slate-950 border border-slate-900 rounded-xl px-4 py-3 text-sm text-slate-500 placeholder-slate-700 cursor-not-allowed focus:outline-none"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Email Address</label>
                                    <input
                                        type="email"
                                        placeholder="you@example.com"
                                        disabled
                                        className="w-full bg-slate-950 border border-slate-900 rounded-xl px-4 py-3 text-sm text-slate-500 placeholder-slate-700 cursor-not-allowed focus:outline-none"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Subject</label>
                                <input
                                    type="text"
                                    placeholder="Membership Inquiry / Personal Training"
                                    disabled
                                    className="w-full bg-slate-950 border border-slate-900 rounded-xl px-4 py-3 text-sm text-slate-500 placeholder-slate-700 cursor-not-allowed focus:outline-none"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Your Message</label>
                                <textarea
                                    rows={8}
                                    placeholder="Tell us about your fitness targets..."
                                    disabled
                                    className="w-full bg-slate-950 border border-slate-900 rounded-xl px-4 py-3 text-sm text-slate-500 placeholder-slate-700 resize-none cursor-not-allowed focus:outline-none"
                                ></textarea>
                            </div>

                            <button
                                type="submit"
                                disabled
                                className="w-full bg-slate-900 text-slate-600 border border-slate-800 font-bold py-3.5 px-6 rounded-xl text-center flex items-center justify-center gap-2 cursor-not-allowed transition-all"
                            >
                                <PaperAirplaneIcon className="h-4 w-4" />
                                SendMessage
                            </button>
                        </form>
                    </div>

                </div>

            </div>
        </section>
    );
}