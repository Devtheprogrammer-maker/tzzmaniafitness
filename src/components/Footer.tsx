
const Footer: React.FC = () => {
    return (

        <div className="bg-background border-t border-slate-900 py-8 text-sm text-slate-500">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">

                {/* Copyright Text */}
                <p className="tracking-tight text-center sm:text-left">
                    © {new Date().getFullYear()} Tzzmania Fitness Gym. All rights reserved.
                </p>

                {/* Developer Credits Line */}
                <div className="flex items-center gap-1.5 tracking-tight text-center sm:text-right">
                    <span>Designed and Developed by</span>
                    <a
                        href="https://devtheprogrammer-maker.github.io/set08801/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-semibold text-slate-400 hover:text-primary transition-colors underline underline-offset-4 decoration-slate-800 hover:decoration-primary"
                    >
                        Devin Vivas
                    </a>
                </div>

            </div>
        </div>
    )
}

export default Footer;