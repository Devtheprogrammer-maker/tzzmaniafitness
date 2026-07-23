import React from "react";
import Navbar from "../components/Navbar.tsx";
import Footer from '../components/Footer.tsx'
import {
    ExclamationTriangleIcon,
    ArrowLeftIcon,
    HomeIcon
} from "@heroicons/react/24/solid";

const NotFound: React.FC = () => {
    return (
        <section className="bg-background min-h-screen text-text flex flex-col selection:bg-primary/30">
            {/* Mounted Navigation Element */}
            <Navbar />

            {/* Main Content Layout Container */}
            <div className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12 relative overflow-hidden">

                {/* Background Ambient Glow Accents */}
                <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-primary/10 rounded-full blur-[120px] pointer-events-none"></div>
                <div className="absolute bottom-1/3 left-1/4 w-64 h-64 bg-secondary/5 rounded-full blur-[100px] pointer-events-none"></div>

                {/* Main Visual Center Card */}
                <div className="max-w-md w-full text-center relative z-10">

                    {/* Big Error Numeric Graphic */}
                    <div className="relative mb-2">
                        <span className="block text-[120px] sm:text-[150px] font-black tracking-tighter leading-none text-transparent bg-clip-text bg-gradient-to-b from-white/20 to-transparent select-none font-mono">
                            404
                        </span>
                        {/* Overlay Warning Icon Visual Anchor */}
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 p-4 rounded-2xl bg-gradient-to-r from-primary/10 to-secondary/10 border border-primary/20 text-primary shadow-xl backdrop-blur-md">
                            <ExclamationTriangleIcon className="h-8 w-8 text-secondary animate-pulse" />
                        </div>
                    </div>

                    {/* Typography Content Stack */}
                    <span className="block text-xs font-bold uppercase tracking-widest text-secondary mb-3">
                        Session Route Dropped
                    </span>

                    <h1 className="text-3xl sm:text-4xl font-black uppercase tracking-tight leading-none mb-4">
                        You've Stepped Out of the<br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">
                            Training Zone
                        </span>
                    </h1>

                    <p className="text-slate-400 text-sm sm:text-base max-w-sm mx-auto mb-10 leading-relaxed">
                        The page you are looking for doesn't exist, has been moved, or your connection split hit a timeout window. Let's get you back on your program tracker.
                    </p>

                    {/* Action Navigation Anchor Blocks */}
                    <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-sm mx-auto">
                        <a
                            href="/"
                            className="flex items-center justify-center gap-2 bg-gradient-to-r from-primary to-secondary text-white font-bold py-3.5 px-6 rounded-xl text-center text-sm uppercase tracking-wider transition-all shadow-lg shadow-primary/20 hover:opacity-90 hover:scale-[1.02]"
                        >
                            <HomeIcon className="h-4 w-4" />
                            Back to Home
                        </a>

                        <button
                            onClick={() => window.history.back()}
                            className="flex items-center justify-center gap-2 border border-slate-800 hover:border-slate-700 bg-slate-900/50 text-white font-semibold py-3.5 px-6 rounded-xl text-center text-sm uppercase tracking-wider transition-all hover:bg-slate-800"
                        >
                            <ArrowLeftIcon className="h-4 w-4 text-slate-400" />
                            Previous Page
                        </button>
                    </div>

                </div>
            </div>
            <Footer />
        </section>
    );
};

export default NotFound;
