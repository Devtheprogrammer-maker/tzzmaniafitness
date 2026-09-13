import React, { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Link } from "react-router-dom";

const API_URL = "http://localhost:4000";

const ResetPasswordPageEmail: React.FC = () => {
    const [email, setEmail] = useState("");
    const [error, setError] = useState("");
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setError("");
        setMessage("");
        setLoading(true);

        try {
            if (!email) {
                return setError("Please enter your email");
            }

            const response = await fetch(`${API_URL}/api/auth/get-password-reset`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email })
            });

            const data = await response.json();

            if (!response.ok) {
                setError(data.error || "Error sending the password reset link");
                return;
            }

            setMessage("Check your inbox (or spam) for a reset link. You can safely close this tab.");
        } catch (error) {
            setError(`Could not reach the server. Please try again. ${error}`);
        } finally {
            setLoading(false);
        }
    }

    return (
        <section className="min-h-screen bg-background flex items-center justify-center px-4 py-16">
            <div className="w-full max-w-md">

                <div className="p-[2px] rounded-2xl bg-gradient-to-b from-primary to-secondary shadow-[0_0_40px_rgba(194,92,255,0.15)]">
                    <div className="bg-surface rounded-[14px] p-8 overflow-hidden">

                        <AnimatePresence mode="wait">
                            {message ? (
                                // Success state
                                <motion.div
                                    key="success"
                                    initial={{ opacity: 0, y: 8 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.35, ease: "easeOut" }}
                                    className="text-center"
                                >
                                    <div className="mx-auto mb-5 h-14 w-14 rounded-full bg-secondary/10 border border-secondary/30 flex items-center justify-center">
                                        <svg className="h-6 w-6 text-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                                        </svg>
                                    </div>

                                    <h2 className="text-2xl font-black uppercase tracking-tight text-white mb-3">
                                        Check Your Email
                                    </h2>
                                    <p className="text-sm text-slate-400 leading-relaxed mb-8">
                                        {message}
                                    </p>

                                    <Link
                                        to="/login"
                                        className="inline-block text-sm text-secondary font-semibold hover:underline"
                                    >
                                        Back to login
                                    </Link>
                                </motion.div>
                            ) : (
                                // Form state
                                <motion.div
                                    key="form"
                                    initial={{ opacity: 0, y: 8 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -8 }}
                                    transition={{ duration: 0.3, ease: "easeOut" }}
                                >
                                    <div className="text-center mb-8">
                                        <span className="text-xs font-bold uppercase tracking-widest text-secondary bg-secondary/10 px-4 py-1.5 rounded-full border border-secondary/20">
                                            Account Recovery
                                        </span>
                                        <h2 className="text-3xl font-black uppercase tracking-tight mt-4 leading-none text-white">
                                            Reset Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">Password</span>
                                        </h2>
                                        <p className="text-slate-400 mt-3 text-sm">
                                            Enter your email and we'll send you a link to get back in.
                                        </p>
                                    </div>

                                    {error && (
                                        <motion.div
                                            initial={{ opacity: 0, height: 0 }}
                                            animate={{ opacity: 1, height: "auto" }}
                                            className="mb-6 rounded-xl border border-danger/30 bg-danger/10 px-4 py-3 overflow-hidden"
                                        >
                                            <p className="text-sm text-danger">{error}</p>
                                        </motion.div>
                                    )}

                                    <form onSubmit={handleSubmit} className="space-y-5">
                                        <div>
                                            <label htmlFor="email" className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                                                Email
                                            </label>
                                            <input
                                                id="email"
                                                type="email"
                                                value={email}
                                                onChange={(e) => setEmail(e.target.value)}
                                                required
                                                placeholder="you@example.com"
                                                className="w-full bg-background border border-border rounded-xl px-4 py-3 text-sm text-white placeholder:text-slate-600 outline-none transition-colors focus:border-primary focus:ring-1 focus:ring-primary"
                                            />
                                        </div>

                                        <button
                                            type="submit"
                                            disabled={loading}
                                            className="w-full bg-gradient-to-r from-primary to-secondary text-white font-bold py-3 px-4 rounded-xl text-sm uppercase tracking-wider shadow-md shadow-primary/20 transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-60 disabled:hover:scale-100"
                                        >
                                            {loading ? "Sending Link..." : "Send Reset Link"}
                                        </button>
                                    </form>

                                    <p className="text-center text-sm text-slate-400 mt-8">
                                        Remembered it?{" "}
                                        <Link to="/login" className="text-secondary font-semibold hover:underline">
                                            Back to login
                                        </Link>
                                    </p>
                                </motion.div>
                            )}
                        </AnimatePresence>

                    </div>
                </div>
            </div>
        </section>
    );
};

export default ResetPasswordPageEmail;