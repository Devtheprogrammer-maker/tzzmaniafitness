import React, { useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import {
    Banner,
    PasswordGuide,
    PasswordInput,
    RedirectBar,
    inputClasses,
    labelClass,
    passwordProblem,
    useRedirectCountdown,
} from "../components/AuthUI";

const REDIRECT_MS = 3000;

const ResetPasswordPage: React.FC = () => {
    const { token } = useParams();
    const navigate = useNavigate();

    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    // Redirects to login after REDIRECT_MS; the timer is cleaned up if the user leaves first
    const secondsLeft = useRedirectCountdown(success, REDIRECT_MS, () =>
        navigate("/login", { replace: true })
    );

    const linkExpired = /invalid or has expired/i.test(error);
    const mismatch = confirmPassword.length > 0 && password !== confirmPassword;

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        if (loading) return;
        setError("");

        const problem = passwordProblem(password);
        if (problem) return setError(problem);
        if (password !== confirmPassword) return setError("Passwords don't match.");

        setLoading(true);
        try {
            const response = await fetch(`/api/auth/reset-password/${token}`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ password }),
            });

            const data = await response.json();

            if (!response.ok) {
                setError(data.error || "We couldn't change your password. Please try again.");
                return;
            }

            setSuccess(true);
        } catch {
            setError("Could not reach the server. Check your connection and try again.");
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
                        <AnimatePresence mode="wait" initial={false}>
                            {success ? (
                                <motion.div
                                    key="success"
                                    initial={{ opacity: 0, y: 8 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.35, ease: "easeOut" }}
                                    className="text-center"
                                >
                                    <motion.div
                                        initial={{ scale: 0.6, opacity: 0 }}
                                        animate={{ scale: 1, opacity: 1 }}
                                        transition={{ type: "spring", stiffness: 200, damping: 14 }}
                                        className="mx-auto mb-5 h-14 w-14 rounded-full bg-secondary/10 border border-secondary/30 flex items-center justify-center"
                                    >
                                        <svg className="h-6 w-6 text-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                            <motion.path
                                                initial={{ pathLength: 0 }}
                                                animate={{ pathLength: 1 }}
                                                transition={{ delay: 0.2, duration: 0.4, ease: "easeOut" }}
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                d="M4.5 12.75l6 6 9-13.5"
                                            />
                                        </svg>
                                    </motion.div>

                                    <h2 className="text-2xl font-black uppercase tracking-tight text-white mb-3">
                                        Password changed
                                    </h2>
                                    <p className="text-sm text-slate-400 leading-relaxed">
                                        You can now log in with your new password.
                                    </p>

                                    <RedirectBar durationMs={REDIRECT_MS} secondsLeft={secondsLeft} />

                                    <Link
                                        to="/login"
                                        replace
                                        className="mt-4 inline-block text-sm font-semibold text-secondary hover:underline"
                                    >
                                        Log in now
                                    </Link>
                                </motion.div>
                            ) : (
                                <motion.div key="form" exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.25 }}>
                                    <div className="text-center mb-8">
                                        <span className="text-xs font-bold uppercase tracking-widest text-secondary bg-secondary/10 px-4 py-1.5 rounded-full border border-secondary/20">
                                            Account Recovery
                                        </span>
                                        <h2 className="text-3xl font-black uppercase tracking-tight mt-4 leading-none text-white">
                                            Set A New{" "}
                                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">
                                                Password
                                            </span>
                                        </h2>
                                        <p className="text-slate-400 mt-3 text-sm">
                                            Choose something you haven't used before.
                                        </p>
                                    </div>

                                    <AnimatePresence>
                                        {error && (
                                            <Banner key={error} tone="error">
                                                {error}
                                                {linkExpired && (
                                                    <>
                                                        {" "}
                                                        <Link to="/reset-password-email" className="font-semibold underline">
                                                            Request a new link
                                                        </Link>
                                                    </>
                                                )}
                                            </Banner>
                                        )}
                                    </AnimatePresence>

                                    <form onSubmit={handleSubmit} className="space-y-5" noValidate>
                                        <div>
                                            <label htmlFor="password" className={labelClass}>
                                                New password
                                            </label>
                                            <PasswordInput
                                                id="password"
                                                autoComplete="new-password"
                                                autoFocus
                                                maxLength={72}
                                                value={password}
                                                onChange={(e) => {
                                                    setPassword(e.target.value);
                                                    setError("");
                                                }}
                                                placeholder="Create a password"
                                                className={inputClasses()}
                                            />
                                        </div>

                                        <div>
                                            <label htmlFor="confirmPassword" className={labelClass}>
                                                Confirm password
                                            </label>
                                            <PasswordInput
                                                id="confirmPassword"
                                                autoComplete="new-password"
                                                maxLength={72}
                                                value={confirmPassword}
                                                onChange={(e) => {
                                                    setConfirmPassword(e.target.value);
                                                    setError("");
                                                }}
                                                aria-invalid={mismatch}
                                                placeholder="Type it again"
                                                className={inputClasses(mismatch)}
                                            />
                                        </div>

                                        <PasswordGuide password={password} confirm={confirmPassword} />

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