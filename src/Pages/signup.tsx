import React, { useState } from "react";
import { Link } from "react-router-dom";
import { AnimatePresence, motion, useReducedMotion, type Variants } from "motion/react";
import { CheckIcon } from "@heroicons/react/24/solid";
import { Banner, PasswordInput, inputClasses, labelClass } from "../components/AuthUI";

interface FormState {
    name: string;
    username: string;
    email: string;
    password: string;
    phone: string;
    dob: string;
    emergencyName: string;
    relationship: string;
    emergencyPhone: string;
}

type Errors = Partial<Record<keyof FormState, string>>;

const INITIAL: FormState = {
    name: "", username: "", email: "", password: "",
    phone: "", dob: "",
    emergencyName: "", relationship: "", emergencyPhone: "",
};

const STEPS = [
    { key: "account", label: "Account" },
    { key: "about", label: "About you" },
    { key: "emergency", label: "Emergency contact" },
];

const RELATIONSHIPS = ["Parent", "Partner", "Sibling", "Friend"];

const MAIL_PROVIDERS: Record<string, { name: string; url: string }> = {
    "gmail.com": { name: "Gmail", url: "https://mail.google.com" },
    "outlook.com": { name: "Outlook", url: "https://outlook.live.com/mail" },
    "hotmail.com": { name: "Outlook", url: "https://outlook.live.com/mail" },
    "live.com": { name: "Outlook", url: "https://outlook.live.com/mail" },
    "yahoo.com": { name: "Yahoo Mail", url: "https://mail.yahoo.com" },
    "icloud.com": { name: "iCloud Mail", url: "https://www.icloud.com/mail" },
};

const digits = (s: string) => s.replace(/\D/g, "");

function validate(step: number, f: FormState): Errors {
    const e: Errors = {};
    if (step === 0) {
        if (!f.name.trim()) e.name = "Enter your full name.";
        if (!/^\S{3,30}$/.test(f.username.trim())) e.username = "Use 3 to 30 characters with no spaces.";
        if (!/^\S+@\S+\.\S+$/.test(f.email.trim())) e.email = "Enter a valid email address.";
        if (f.password.length < 8) e.password = "Use at least 8 characters.";
        else if (f.password.length > 72) e.password = "Use 72 characters or fewer.";
    }
    if (step === 1) {
        if (digits(f.phone).length < 7) e.phone = "Enter a valid phone number.";
        if (!f.dob) e.dob = "Select your date of birth.";
        else if (new Date(f.dob) > new Date()) e.dob = "Date of birth can't be in the future.";
    }
    if (step === 2) {
        if (!f.emergencyName.trim()) e.emergencyName = "Enter your contact's name.";
        if (!f.relationship.trim()) e.relationship = "Choose or enter their relationship to you.";
        if (digits(f.emergencyPhone).length < 7) e.emergencyPhone = "Enter a valid phone number.";
    }
    return e;
}

// Password strength: 0 = too short, 1 = okay, 2 = good, 3 = strong
function passwordLevel(pw: string) {
    if (pw.length < 8) return 0;
    const bonus = [
        pw.length >= 12,
        /[a-z]/.test(pw) && /[A-Z]/.test(pw),
        /\d/.test(pw) && /[^A-Za-z0-9]/.test(pw),
    ].filter(Boolean).length;
    return Math.min(3, 1 + bonus);
}

const LEVELS = [
    { label: "Too short", bar: "bg-danger", text: "text-danger", segments: 1 },
    { label: "Okay", bar: "bg-amber-400", text: "text-amber-300", segments: 2 },
    { label: "Good", bar: "bg-lime-400", text: "text-lime-300", segments: 3 },
    { label: "Strong", bar: "bg-secondary", text: "text-secondary", segments: 4 },
];

const panelVariants: Variants = {
    enter: (d: number) => ({ opacity: 0, x: d * 28 }),
    center: { opacity: 1, x: 0 },
    exit: (d: number) => ({ opacity: 0, x: d * -28 }),
};

const primaryBtn =
    "flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-primary to-secondary text-white font-bold py-3 px-4 rounded-xl text-sm uppercase tracking-wider shadow-md shadow-primary/20 disabled:opacity-70";
const secondaryBtn =
    "flex items-center justify-center rounded-xl border border-border px-5 py-3 text-sm font-bold uppercase tracking-wider text-slate-300 hover:text-white hover:border-slate-600 transition-colors";

/* ---------- Small pieces ---------- */

function Field({
    id, label, error, children,
}: { id: string; label: string; error?: string; children: React.ReactNode }) {
    return (
        <div>
            <label htmlFor={id} className={labelClass}>{label}</label>
            {children}
            <AnimatePresence initial={false}>
                {error && (
                    <motion.p
                        key="error"
                        id={`${id}-error`}
                        role="alert"
                        initial={{ opacity: 0, y: -4 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        className="text-xs text-danger mt-2"
                    >
                        {error}
                    </motion.p>
                )}
            </AnimatePresence>
        </div>
    );
}

function StrengthMeter({ password }: { password: string }) {
    if (!password) return null;
    const { label, bar, text, segments } = LEVELS[passwordLevel(password)];
    return (
        <div className="mt-3 flex items-center gap-3" aria-live="polite">
            <div className="flex flex-1 gap-1.5">
                {[0, 1, 2, 3].map((i) => (
                    <span
                        key={i}
                        className={`h-1 flex-1 rounded-full transition-colors duration-300 ${i < segments ? bar : "bg-white/10"}`}
                    />
                ))}
            </div>
            <span className={`text-xs font-semibold ${text}`}>{label}</span>
        </div>
    );
}

function Stepper({ step, onJump }: { step: number; onJump: (i: number) => void }) {
    return (
        <ol className="flex items-start mb-8" aria-label="Sign up progress">
            {STEPS.map((s, i) => {
                const done = i < step;
                const active = i === step;
                return (
                    <li key={s.key} className="relative flex-1 flex flex-col items-center">
                        {i > 0 && (
                            <span className="absolute top-4 right-1/2 h-0.5 w-full overflow-hidden bg-border">
                                <motion.span
                                    className="block h-full bg-gradient-to-r from-primary to-secondary"
                                    initial={false}
                                    animate={{ width: i <= step ? "100%" : "0%" }}
                                    transition={{ duration: 0.35, ease: "easeOut" }}
                                />
                            </span>
                        )}
                        <button
                            type="button"
                            disabled={i > step}
                            onClick={() => onJump(i)}
                            aria-current={active ? "step" : undefined}
                            aria-label={`${s.label}${done ? " (completed)" : ""}`}
                            className={`relative z-10 flex h-8 w-8 items-center justify-center rounded-full border-2 text-xs font-bold transition-colors ${done
                                    ? "bg-secondary border-secondary text-black cursor-pointer"
                                    : active
                                        ? "bg-surface border-primary text-white ring-4 ring-primary/15"
                                        : "bg-surface border-border text-slate-500"
                                }`}
                        >
                            {done ? <CheckIcon className="h-4 w-4" /> : i + 1}
                        </button>
                        <span className={`mt-2 px-1 text-center text-[11px] font-semibold leading-tight ${active ? "text-white" : done ? "text-slate-300" : "text-slate-500"
                            }`}>
                            {s.label}
                        </span>
                    </li>
                );
            })}
        </ol>
    );
}

function SuccessPanel({ email }: { email: string }) {
    const provider = MAIL_PROVIDERS[email.split("@")[1]?.toLowerCase() ?? ""];
    return (
        <motion.div
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
                Check your inbox
            </h2>
            <p className="text-sm text-slate-400 leading-relaxed mb-1">
                We sent an activation link to
            </p>
            <p className="text-sm font-semibold text-white break-all mb-4">{email}</p>
            <p className="text-sm text-slate-400 leading-relaxed mb-8">
                The link expires in 15 minutes. If you don't see it, check your spam folder.
                You'll need to activate your account before you can log in.
            </p>

            <div className="flex flex-col gap-3">
                {provider && (
                    <a
                        href={provider.url}
                        target="_blank"
                        rel="noreferrer"
                        className={`${primaryBtn} flex-none`}
                    >
                        Open {provider.name}
                    </a>
                )}
                <Link
                    to="/login"
                    state={{ email }}
                    className={provider ? secondaryBtn : `${primaryBtn} flex-none`}
                >
                    Go to login
                </Link>
            </div>
        </motion.div>
    );
}

/* ---------- Page ---------- */

const Signup: React.FC = () => {
    const reduceMotion = useReducedMotion();
    const [form, setForm] = useState<FormState>(INITIAL);
    const [errors, setErrors] = useState<Errors>({});
    const [formError, setFormError] = useState("");
    const [step, setStep] = useState(0);
    const [direction, setDirection] = useState(1);
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    const dir = reduceMotion ? 0 : direction;
    const today = new Date().toISOString().split("T")[0];
    const lastStep = STEPS.length - 1;

    function update(key: keyof FormState, value: string) {
        setForm((f) => ({ ...f, [key]: value }));
        setErrors((er) => (er[key] ? { ...er, [key]: undefined } : er));
    }

    // Props shared by every text input: id, value, handler, error styling, aria
    const bind = (key: keyof FormState) => ({
        id: key,
        value: form[key],
        onChange: (e: React.ChangeEvent<HTMLInputElement>) => update(key, e.target.value),
        "aria-invalid": Boolean(errors[key]),
        "aria-describedby": errors[key] ? `${key}-error` : undefined,
        className: inputClasses(Boolean(errors[key])),
    });

    function goTo(next: number) {
        setDirection(next > step ? 1 : -1);
        setStep(next);
        setFormError("");
    }

    function handleServerError(status: number, message?: string) {
        const text = message ?? "Sign up failed";

        // Send people back to the step that actually has the problem
        if (/password/i.test(text)) {
            setErrors({ password: text });
            goTo(0);
            return;
        }
        if (/date of birth/i.test(text)) {
            setErrors({ dob: text });
            goTo(1);
            return;
        }
        if (status === 500) {
            goTo(0);
            setFormError(
                "We couldn't create your account. That email or username may already be in use. Try different details."
            );
            return;
        }
        setFormError(text);
    }

    async function createAccount() {
        setLoading(true);
        setFormError("");

        try {
            const response = await fetch("/api/auth/signup", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify({
                    name: form.name.trim(),
                    username: form.username.trim(),
                    email: form.email.trim(),
                    password: form.password,
                    phone: form.phone.trim(),
                    date_of_brith: form.dob, // sic: this is the field name the backend reads
                    emergencyname: form.emergencyName.trim(),
                    relationship: form.relationship.trim(),
                    emgphone: form.emergencyPhone.trim(),
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                handleServerError(response.status, data.error);
                return;
            }

            setSuccess(true);
        } catch {
            setFormError("Could not reach the server. Check your connection and try again.");
        } finally {
            setLoading(false);
        }
    }

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        if (loading) return;

        const stepErrors = validate(step, form);
        setErrors(stepErrors);
        if (Object.keys(stepErrors).length > 0) return;

        if (step < lastStep) {
            goTo(step + 1);
            return;
        }
        await createAccount();
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
                                <SuccessPanel key="success" email={form.email.trim()} />
                            ) : (
                                <motion.div key="form" exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.25 }}>

                                    <div className="text-center mb-8">
                                        <span className="text-xs font-bold uppercase tracking-widest text-secondary bg-secondary/10 px-4 py-1.5 rounded-full border border-secondary/20">
                                            Join Us
                                        </span>
                                        <h2 className="text-3xl font-black uppercase tracking-tight mt-4 leading-none text-white">
                                            Create Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">Account</span>
                                        </h2>
                                    </div>

                                    <Stepper step={step} onJump={goTo} />

                                    <AnimatePresence>
                                        {formError && (
                                            <Banner key="form-error" tone="error">{formError}</Banner>
                                        )}
                                    </AnimatePresence>

                                    <form onSubmit={handleSubmit} noValidate>
                                        <AnimatePresence mode="wait" initial={false} custom={dir}>
                                            <motion.div
                                                key={step}
                                                custom={dir}
                                                variants={panelVariants}
                                                initial="enter"
                                                animate="center"
                                                exit="exit"
                                                transition={{ duration: 0.2, ease: "easeOut" }}
                                                className="space-y-5"
                                            >
                                                {step === 0 && (
                                                    <>
                                                        <Field id="name" label="Name" error={errors.name}>
                                                            <input {...bind("name")} type="text" autoComplete="name" placeholder="John Doe" autoFocus required />
                                                        </Field>
                                                        <Field id="username" label="Username" error={errors.username}>
                                                            <input {...bind("username")} type="text" autoComplete="username" autoCapitalize="none" spellCheck={false} placeholder="jdoe" required />
                                                        </Field>
                                                        <Field id="email" label="Email" error={errors.email}>
                                                            <input {...bind("email")} type="email" inputMode="email" autoComplete="email" autoCapitalize="none" spellCheck={false} placeholder="you@example.com" required />
                                                        </Field>
                                                        <Field id="password" label="Password" error={errors.password}>
                                                            <PasswordInput {...bind("password")} autoComplete="new-password" maxLength={72} placeholder="At least 8 characters" required />
                                                            <StrengthMeter password={form.password} />
                                                        </Field>
                                                    </>
                                                )}

                                                {step === 1 && (
                                                    <>
                                                        <Field id="phone" label="Phone" error={errors.phone}>
                                                            <input {...bind("phone")} type="tel" inputMode="tel" autoComplete="tel" placeholder="(555) 123-4567" autoFocus required />
                                                        </Field>
                                                        <Field id="dob" label="Date of birth" error={errors.dob}>
                                                            <input
                                                                {...bind("dob")}
                                                                className={`${inputClasses(Boolean(errors.dob))} [color-scheme:dark]`}
                                                                type="date"
                                                                autoComplete="bday"
                                                                max={today}
                                                                required
                                                            />
                                                        </Field>
                                                    </>
                                                )}

                                                {step === 2 && (
                                                    <>
                                                        <p className="text-sm text-slate-400 -mt-1">
                                                            Someone we can call if something happens while you're training.
                                                        </p>
                                                        <Field id="emergencyName" label="Contact name" error={errors.emergencyName}>
                                                            <input {...bind("emergencyName")} type="text" autoComplete="off" placeholder="Jane Doe" autoFocus required />
                                                        </Field>

                                                        <Field id="relationship" label="Relationship" error={errors.relationship}>
                                                            <div className="flex flex-wrap gap-2 mb-3" role="group" aria-label="Common relationships">
                                                                {RELATIONSHIPS.map((r) => {
                                                                    const selected = form.relationship.trim().toLowerCase() === r.toLowerCase();
                                                                    return (
                                                                        <button
                                                                            key={r}
                                                                            type="button"
                                                                            aria-pressed={selected}
                                                                            onClick={() => update("relationship", r)}
                                                                            className={`rounded-full border px-3 py-1.5 text-xs font-semibold transition-colors ${selected
                                                                                    ? "border-primary bg-primary/15 text-white"
                                                                                    : "border-border text-slate-400 hover:border-slate-600 hover:text-white"
                                                                                }`}
                                                                        >
                                                                            {r}
                                                                        </button>
                                                                    );
                                                                })}
                                                            </div>
                                                            <input {...bind("relationship")} type="text" autoComplete="off" placeholder="Or type your own" required />
                                                        </Field>

                                                        <Field id="emergencyPhone" label="Contact phone" error={errors.emergencyPhone}>
                                                            <input {...bind("emergencyPhone")} type="tel" inputMode="tel" autoComplete="off" placeholder="(555) 987-6543" required />
                                                        </Field>
                                                    </>
                                                )}
                                            </motion.div>
                                        </AnimatePresence>

                                        <div className="flex gap-3 mt-8">
                                            {step > 0 && (
                                                <button type="button" onClick={() => goTo(step - 1)} className={secondaryBtn}>
                                                    Back
                                                </button>
                                            )}
                                            <motion.button
                                                type="submit"
                                                disabled={loading}
                                                whileHover={loading ? undefined : { scale: 1.02, y: -1 }}
                                                whileTap={loading ? undefined : { scale: 0.98, y: 0 }}
                                                transition={{ duration: 0.2 }}
                                                className={primaryBtn}
                                            >
                                                {loading && (
                                                    <span className="h-4 w-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                                                )}
                                                {step < lastStep ? "Continue" : loading ? "Creating Account..." : "Create Account"}
                                            </motion.button>
                                        </div>
                                    </form>

                                    <p className="text-center text-sm text-slate-400 mt-8">
                                        Already have an account?{" "}
                                        <Link to="/login" className="text-secondary font-semibold hover:underline">
                                            Log in
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

export default Signup;