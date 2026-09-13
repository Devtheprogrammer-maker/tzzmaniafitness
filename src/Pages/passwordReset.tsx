import React, { useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";

const API_URL = "http://localhost:4000";

const ResetPasswordPage: React.FC = () => {
    const { token } = useParams();
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            if (!password) {
                return setError("Please enter a new password");
            }

            if (password !== confirmPassword) {
                return setError("Passwords do not match");
            }

            const response = await fetch(`${API_URL}/api/auth/reset-password/${token}`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ password })
            });

            const data = await response.json();

            if (!response.ok) {
                setError(data.error || "Error changing your password");
                return;
            }

            setSuccess(true);
            setTimeout(() => navigate("/login", { replace: true }), 1800);
        } catch (error) {
            setError(`Could not reach the server. Please try again. ${error}`);
        } finally {
            setLoading(false);
        }
    }

    return (
        <section className="min-h-screen bg-background flex items-center justify-center px-4 py-16">
            <div className="w-full max-w-md">

                <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, ease: "easeOut" }}
                    className="p-[2px] rounded-2xl bg-gradient-to-b from-primary to-secondary shadow-[0_0_40px_rgba(194,92,255,0.15)]"
                >
                    <div className="bg-surface rounded-[14px] p-8 overflow-hidden">

                        <AnimatePresence mode="wait">
                            {success ? (
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
                                        Password Changed
                                    </h2>
                                    <p className="text-sm text-slate-400 leading-relaxed">
                                        Taking you to login...
                                    </p>
                                </motion.div>
                            ) : (
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
                                            Set A New <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">Password</span>
                                        </h2>
                                        <p className="text-slate-400 mt-3 text-sm">
                                            Choose something you haven't used before.
                                        </p>
                                    </div>

                                    <AnimatePresence>
                                        {error && (
                                            <motion.div
                                                initial={{ opacity: 0, height: 0, marginBottom: 0 }}
                                                animate={{ opacity: 1, height: "auto", marginBottom: 24 }}
                                                exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                                                transition={{ duration: 0.25, ease: "easeOut" }}
                                                className="overflow-hidden"
                                            >
                                                <div className="rounded-xl border border-danger/30 bg-danger/10 px-4 py-3">
                                                    <p className="text-sm text-danger">{error}</p>
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>

                                    <form onSubmit={handleSubmit} className="space-y-5">
                                        <div>
                                            <label htmlFor="password" className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                                                New Password
                                            </label>
                                            <input
                                                id="password"
                                                type="password"
                                                value={password}
                                                onChange={(e) => setPassword(e.target.value)}
                                                required
                                                placeholder="••••••••"
                                                className="w-full bg-background border border-border rounded-xl px-4 py-3 text-sm text-white placeholder:text-slate-600 outline-none transition-colors focus:border-primary focus:ring-1 focus:ring-primary"
                                            />
                                        </div>

                                        <div>
                                            <label htmlFor="confirmPassword" className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                                                Confirm Password
                                            </label>
                                            <input
                                                id="confirmPassword"
                                                type="password"
                                                value={confirmPassword}
                                                onChange={(e) => setConfirmPassword(e.target.value)}
                                                required
                                                placeholder="••••••••"
                                                className="w-full bg-background border border-border rounded-xl px-4 py-3 text-sm text-white placeholder:text-slate-600 outline-none transition-colors focus:border-primary focus:ring-1 focus:ring-primary"
                                            />
                                        </div>

                                        <motion.button
                                            type="submit"
                                            disabled={loading}
                                            whileHover={{ scale: 1.02, y: -1 }}
                                            whileTap={{ scale: 0.98, y: 0 }}
                                            transition={{ duration: 0.2 }}
                                            className="w-full bg-gradient-to-r from-primary to-secondary text-white font-bold py-3 px-4 rounded-xl text-sm uppercase tracking-wider shadow-md shadow-primary/20 disabled:opacity-60"
                                        >
                                            {loading ? "Changing Password..." : "Change Password"}
                                        </motion.button>
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
                </motion.div>
            </div>
        </section>
    );
};

export default ResetPasswordPage;