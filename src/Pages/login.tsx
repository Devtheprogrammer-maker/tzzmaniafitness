import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import { useAuth } from "../context/AuthContext";

const API_URL = "http://localhost:4000";

const Login: React.FC = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const { setUserObj } = useAuth();

    const params = new URLSearchParams(window.location.search);
    const message = params.get('message');
    const verified = params.get('verified');


    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            if (!email || !password) {
                return setError("Please enter a password and username");
            }

            const response = await fetch(`${API_URL}/api/auth/login`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify({ email, password })
            });

            const data = await response.json();

            if (!response.ok) {
                setError(data.error || "Login Failed");
                return;
            }

            setUserObj(data.user);
            navigate("/dashboard", { replace: true });
        } catch (error) {
            setError(`Could not reach the server. Please try again. ${error}`);
        } finally {
            setLoading(false);
        }
    }

    return (
        <section className="min-h-screen bg-background flex items-center justify-center px-4 py-16">
            <div className="w-full max-w-md">

                {/* Gradient border wrapper, same treatment as the popular pricing card */}
                <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, ease: "easeOut" }}
                    className="p-[2px] rounded-2xl bg-gradient-to-b from-primary to-secondary shadow-[0_0_40px_rgba(194,92,255,0.15)]"
                >
                    <div className="bg-surface rounded-[14px] p-8">

                        <div className="text-center mb-8">
                            <span className="text-xs font-bold uppercase tracking-widest text-secondary bg-secondary/10 px-4 py-1.5 rounded-full border border-secondary/20">
                                Members Portal
                            </span>
                            <h2 className="text-3xl font-black uppercase tracking-tight mt-4 leading-none text-white">
                                Welcome <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">Back</span>
                            </h2>
                            <p className="text-slate-400 mt-3 text-sm">
                                Log in to book sessions and track your progress.
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

                            {message && (
                                <motion.div
                                    initial={{ opacity: 0, height: 0, marginBottom: 0 }}
                                    animate={{ opacity: 1, height: "auto", marginBottom: 24 }}
                                    exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                                    transition={{ duration: 0.25, ease: "easeOut" }}
                                    className="overflow-hidden"
                                >
                                    <div
                                        className={`rounded-xl border px-4 py-3 ${verified === 'true'
                                            ? "border-success/30 bg-success/10"
                                            : "border-danger/30 bg-danger/10"
                                            }`}
                                    >
                                        <p className={`text-sm ${verified === 'true' ? 'text-success' : 'text-danger'}`}>{message}</p>
                                    </div>
                                </motion.div>
                            )}

                        </AnimatePresence>

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

                            <div>
                                <div className="flex items-center justify-between mb-2">
                                    <label htmlFor="password" className="block text-xs font-bold uppercase tracking-wider text-slate-400">
                                        Password
                                    </label>
                                    <Link to="/reset-password-email" className="text-xs text-slate-400 hover:text-secondary transition-colors">
                                        Forgot password?
                                    </Link>
                                </div>
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

                            <motion.button
                                type="submit"
                                disabled={loading}
                                whileHover={{ scale: 1.02, y: -1 }}
                                whileTap={{ scale: 0.98, y: 0 }}
                                transition={{ duration: 0.2 }}
                                className="w-full bg-gradient-to-r from-primary to-secondary text-white font-bold py-3 px-4 rounded-xl text-sm uppercase tracking-wider shadow-md shadow-primary/20 disabled:opacity-60"
                            >
                                {loading ? "Logging In..." : "Log In"}
                            </motion.button>
                        </form>

                        <p className="text-center text-sm text-slate-400 mt-8">
                            New here?{" "}
                            <Link to="/signup" className="text-secondary font-semibold hover:underline">
                                Create an account
                            </Link>
                        </p>

                    </div>
                </motion.div>
            </div>
        </section>
    );
};

export default Login;