import React, { useEffect, useState } from "react";
import { useNavigate, useLocation, useSearchParams, Link } from "react-router-dom";
import { motion, AnimatePresence, useAnimationControls, useReducedMotion } from "motion/react";
import { useAuth } from "../context/AuthContext";
import { Banner, PasswordInput, inputClasses, labelClass } from "../components/AuthUI";

type Notice = { tone: "success" | "error" | "warning"; text: string };

const Login: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { setUserObj } = useAuth();
    const [searchParams, setSearchParams] = useSearchParams();
    const reduceMotion = useReducedMotion();
    const shake = useAnimationControls();

    // Signup passes the email along so people don't have to retype it
    const prefilledEmail = (location.state as { email?: string } | null)?.email ?? "";

    const [email, setEmail] = useState(prefilledEmail);
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);

    // Banner from the activation redirect: /login?verified=true&message=...
    const [notice, setNotice] = useState<Notice | null>(() => {
        const message = searchParams.get("message");
        if (!message) return null;
        return {
            tone: searchParams.get("verified") === "true" ? "success" : "error",
            text: message,
        };
    });

    // Clean the URL so a refresh doesn't show the banner again
    useEffect(() => {
        if (searchParams.has("message") || searchParams.has("verified")) {
            setSearchParams({}, { replace: true });
        }
    }, [searchParams, setSearchParams]);

    function fail(text: string, tone: Notice["tone"] = "error") {
        setNotice({ tone, text });
        if (!reduceMotion) {
            shake.start({ x: [0, -10, 10, -6, 6, 0], transition: { duration: 0.4 } });
        }
    }

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setNotice(null);
        setLoading(true);

        try {
            const response = await fetch("/api/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify({ email: email.trim(), password }),
            });

            const data = await response.json();

            if (!response.ok) {
                // 403 = account exists but isn't activated yet
                if (response.status === 403) {
                    fail(
                        `${data.error}. Check your inbox (or spam) for the activation link we sent when you signed up.`,
                        "warning"
                    );
                } else {
                    fail(data.error || "Login failed");
                }
                return;
            }

            setUserObj(data.user);
            navigate("/dashboard", { replace: true });
        } catch {
            fail("Could not reach the server. Check your connection and try again.");
        } finally {
            setLoading(false);
        }
    }

    return (
        <section className="min-h-screen bg-background flex items-center justify-center px-4 py-16">
            <div className="w-full max-w-md">
                <motion.div animate={shake}>
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
                                    Log in to see your membership and next payment.
                                </p>
                            </div>

                            <AnimatePresence>
                                {notice && (
                                    <Banner key={notice.text} tone={notice.tone}>
                                        {notice.text}
                                    </Banner>
                                )}
                            </AnimatePresence>

                            <form onSubmit={handleSubmit} className="space-y-5">
                                <div>
                                    <label htmlFor="email" className={labelClass}>Email</label>
                                    <input
                                        id="email"
                                        type="email"
                                        inputMode="email"
                                        autoComplete="email"
                                        autoCapitalize="none"
                                        spellCheck={false}
                                        autoFocus={!prefilledEmail}
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                        placeholder="you@example.com"
                                        className={inputClasses()}
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
                                    <PasswordInput
                                        id="password"
                                        autoComplete="current-password"
                                        autoFocus={Boolean(prefilledEmail)}
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                        placeholder="••••••••"
                                        className={inputClasses()}
                                    />
                                </div>

                                <motion.button
                                    type="submit"
                                    disabled={loading}
                                    whileHover={loading ? undefined : { scale: 1.02, y: -1 }}
                                    whileTap={loading ? undefined : { scale: 0.98, y: 0 }}
                                    transition={{ duration: 0.2 }}
                                    className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-primary to-secondary text-white font-bold py-3 px-4 rounded-xl text-sm uppercase tracking-wider shadow-md shadow-primary/20 disabled:opacity-70"
                                >
                                    {loading && (
                                        <span className="h-4 w-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                                    )}
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
                </motion.div>
            </div>
        </section>
    );
};

export default Login;