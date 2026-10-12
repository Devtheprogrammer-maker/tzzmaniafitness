import React, { useState } from "react";
import { Link } from "react-router-dom";
import { AnimatePresence, motion, useReducedMotion, type Variants } from "motion/react";
import { CheckIcon, PlusIcon, XMarkIcon } from "@heroicons/react/24/solid";
import {
    Banner,
    PasswordGuide,
    PasswordInput,
    inputClasses,
    labelClass,
    passwordProblem,
} from "../components/AuthUI";
import {
    PhoneInput,
    emptyPhone,
    formatPhone,
    isPhoneValid,
    toE164,
    type Phone,
} from "../components/PhoneInput";
import { TermsModal } from "../components/TermsModal";

const MIN_AGE = 15;
const MAX_CONTACTS = 2;
const MIN_BIRTH_YEAR = 1900;

interface Contact {
    name: string;
    relationship: string;
    phone: Phone;
}

interface FormState {
    name: string;
    username: string;
    email: string;
    password: string;
    phone: Phone;
    dob: string;
    contacts: Contact[];
    acceptedTerms: boolean;
}

type ContactErrors = Partial<Record<keyof Contact, string>>;
type Errors = Partial<Record<"name" | "username" | "email" | "password" | "phone" | "dob" | "terms", string>> & {
    contacts?: ContactErrors[];
};
type TextKey = "name" | "username" | "email" | "password" | "dob";

const emptyContact = (country?: string): Contact => ({ name: "", relationship: "", phone: emptyPhone(country) });

const INITIAL: FormState = {
    name: "",
    username: "",
    email: "",
    password: "",
    phone: emptyPhone(),
    dob: "",
    contacts: [emptyContact()],
    acceptedTerms: false,
};

const STEPS = [
    { key: "account", label: "Account" },
    { key: "about", label: "About you" },
    { key: "emergency", label: "Emergency" },
    { key: "review", label: "Review" },
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

/* ---------- Dates ---------- */

const pad = (n: number) => String(n).padStart(2, "0");
const toISO = (d: Date) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;

function isoYearsAgo(years: number) {
    const d = new Date();
    d.setFullYear(d.getFullYear() - years);
    return toISO(d);
}

// Age today for a "YYYY-MM-DD" string, using local time so there are no timezone surprises
function ageOn(iso: string) {
    const [y, m, d] = iso.split("-").map(Number);
    const now = new Date();
    let age = now.getFullYear() - y;
    if (now.getMonth() + 1 < m || (now.getMonth() + 1 === m && now.getDate() < d)) age--;
    return age;
}

function formatDob(iso: string) {
    const [y, m, d] = iso.split("-").map(Number);
    return new Intl.DateTimeFormat("en-US", { year: "numeric", month: "long", day: "numeric" }).format(
        new Date(y, m - 1, d)
    );
}

/* ---------- Validation ---------- */

function hasErrors(e: Errors) {
    const { contacts, ...rest } = e;
    return Object.values(rest).some(Boolean) || Boolean(contacts?.some((c) => Object.keys(c).length > 0));
}

function validate(step: number, f: FormState): Errors {
    const e: Errors = {};

    if (step === 0) {
        if (!f.name.trim()) e.name = "Enter your full name.";
        if (!/^\S{3,30}$/.test(f.username.trim())) e.username = "Use 3 to 30 characters with no spaces.";
        if (!/^\S+@\S+\.\S+$/.test(f.email.trim())) e.email = "Enter a valid email address.";
        const pwProblem = passwordProblem(f.password);
        if (pwProblem) e.password = pwProblem;
    }

    if (step === 1) {
        if (!isPhoneValid(f.phone)) e.phone = "Enter your full phone number.";

        if (!f.dob) {
            e.dob = "Select your date of birth.";
        } else {
            const age = ageOn(f.dob);
            if (Number.isNaN(age) || Number(f.dob.slice(0, 4)) < MIN_BIRTH_YEAR) e.dob = "Enter a valid date of birth.";
            else if (age < 0) e.dob = "Date of birth can't be in the future.";
            else if (age < MIN_AGE) e.dob = `You must be at least ${MIN_AGE} years old to sign up.`;
        }
    }

    if (step === 2) {
        const own = isPhoneValid(f.phone) ? toE164(f.phone) : null;
        const seen = new Set<string>();

        const contacts = f.contacts.map((c) => {
            const ce: ContactErrors = {};
            if (!c.name.trim()) ce.name = "Enter this contact's name.";
            if (!c.relationship.trim()) ce.relationship = "Choose or enter how they're related to you.";
            if (!isPhoneValid(c.phone)) {
                ce.phone = "Enter their full phone number.";
            } else {
                const p = toE164(c.phone);
                if (p === own) ce.phone = "Use a different number than your own.";
                else if (seen.has(p)) ce.phone = "This number is already listed for another contact.";
                seen.add(p);
            }
            return ce;
        });

        if (contacts.some((c) => Object.keys(c).length > 0)) e.contacts = contacts;
    }

    if (step === 3) {
        if (!f.acceptedTerms) e.terms = "You need to accept the Terms & Conditions to create your account.";
    }

    return e;
}

/* ---------- Styles ---------- */

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
    id,
    label,
    error,
    hint,
    children,
}: {
    id: string;
    label: string;
    error?: string;
    hint?: string;
    children: React.ReactNode;
}) {
    return (
        <div>
            <label htmlFor={id} className={labelClass}>
                {label}
            </label>
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
            {!error && hint && <p className="text-xs text-slate-500 mt-2">{hint}</p>}
        </div>
    );
}

function Stepper({
    step,
    maxStep,
    onJump,
}: {
    step: number;
    maxStep: number;
    onJump: (i: number) => void;
}) {
    return (
        <ol className="flex items-start mb-8" aria-label="Sign up progress">
            {STEPS.map((s, i) => {
                const active = i === step;
                const done = !active && i < maxStep;
                const reachable = i <= maxStep;
                return (
                    <li key={s.key} className="relative flex-1 flex flex-col items-center">
                        {i > 0 && (
                            <span className="absolute top-4 right-1/2 h-0.5 w-full overflow-hidden bg-border">
                                <motion.span
                                    className="block h-full bg-gradient-to-r from-primary to-secondary"
                                    initial={false}
                                    animate={{ width: i <= maxStep ? "100%" : "0%" }}
                                    transition={{ duration: 0.35, ease: "easeOut" }}
                                />
                            </span>
                        )}
                        <button
                            type="button"
                            disabled={!reachable}
                            onClick={() => onJump(i)}
                            aria-current={active ? "step" : undefined}
                            aria-label={`${s.label}${done ? " (completed)" : ""}`}
                            className={`relative z-10 flex h-8 w-8 items-center justify-center rounded-full border-2 text-xs font-bold transition-colors ${active
                                    ? "bg-surface border-primary text-white ring-4 ring-primary/15"
                                    : done
                                        ? "bg-secondary border-secondary text-black cursor-pointer"
                                        : reachable
                                            ? "bg-surface border-slate-500 text-slate-300 cursor-pointer"
                                            : "bg-surface border-border text-slate-500"
                                }`}
                        >
                            {done ? <CheckIcon className="h-4 w-4" /> : i + 1}
                        </button>
                        <span
                            className={`mt-2 px-1 text-center text-[11px] font-semibold leading-tight ${active ? "text-white" : reachable ? "text-slate-300" : "text-slate-500"
                                }`}
                        >
                            {s.label}
                        </span>
                    </li>
                );
            })}
        </ol>
    );
}

function RelationshipField({
    id,
    value,
    error,
    onChange,
}: {
    id: string;
    value: string;
    error?: string;
    onChange: (v: string) => void;
}) {
    return (
        <Field id={id} label="Relationship" error={error}>
            <div className="flex flex-wrap gap-2 mb-3" role="group" aria-label="Common relationships">
                {RELATIONSHIPS.map((r) => {
                    const selected = value.trim().toLowerCase() === r.toLowerCase();
                    return (
                        <button
                            key={r}
                            type="button"
                            aria-pressed={selected}
                            onClick={() => onChange(r)}
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
            <input
                id={id}
                type="text"
                autoComplete="off"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder="Or type your own"
                aria-invalid={Boolean(error)}
                aria-describedby={error ? `${id}-error` : undefined}
                className={inputClasses(Boolean(error))}
            />
        </Field>
    );
}

function ReviewCard({
    title,
    onEdit,
    children,
}: {
    title: string;
    onEdit: () => void;
    children: React.ReactNode;
}) {
    return (
        <div className="rounded-xl border border-border bg-background/50 px-4 py-3">
            <div className="flex items-center justify-between mb-1">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">{title}</h3>
                <button type="button" onClick={onEdit} className="text-xs font-semibold text-secondary hover:underline">
                    Edit
                </button>
            </div>
            <dl className="divide-y divide-border">{children}</dl>
        </div>
    );
}

function ReviewRow({ label, children }: { label: string; children: React.ReactNode }) {
    return (
        <div className="flex items-start justify-between gap-4 py-2 text-sm">
            <dt className="shrink-0 text-slate-500">{label}</dt>
            <dd className="min-w-0 break-words text-right text-slate-200">{children}</dd>
        </div>
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

            <h2 className="text-2xl font-black uppercase tracking-tight text-white mb-3">Check your inbox</h2>
            <p className="text-sm text-slate-400 leading-relaxed mb-1">We sent an activation link to</p>
            <p className="text-sm font-semibold text-white break-all mb-4">{email}</p>
            <p className="text-sm text-slate-400 leading-relaxed mb-8">
                The link expires in 15 minutes. If you don't see it, check your spam folder. You'll need to activate your
                account before you can log in.
            </p>

            <div className="flex flex-col gap-3">
                {provider && (
                    <a href={provider.url} target="_blank" rel="noreferrer" className={`${primaryBtn} flex-none`}>
                        Open {provider.name}
                    </a>
                )}
                <Link to="/login" state={{ email }} className={provider ? secondaryBtn : `${primaryBtn} flex-none`}>
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
    const [maxStep, setMaxStep] = useState(0);
    const [fromReview, setFromReview] = useState(false);
    const [direction, setDirection] = useState(1);
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [termsOpen, setTermsOpen] = useState(false);

    const dir = reduceMotion ? 0 : direction;
    const lastStep = STEPS.length - 1;

    // Date of birth limits and live feedback
    const maxDob = isoYearsAgo(MIN_AGE);
    const minDob = isoYearsAgo(110);
    const dobAge = form.dob ? ageOn(form.dob) : null;
    const dobYearOk = Number(form.dob.slice(0, 4)) >= MIN_BIRTH_YEAR;
    const liveDobError =
        dobAge !== null && dobYearOk && dobAge < MIN_AGE
            ? dobAge < 0
                ? "Date of birth can't be in the future."
                : `You must be at least ${MIN_AGE} years old to sign up.`
            : undefined;
    const dobError = errors.dob ?? liveDobError;

    /* ----- form updates ----- */

    function setText(key: TextKey, value: string) {
        setForm((f) => ({ ...f, [key]: value }));
        setErrors((er) => (er[key] ? { ...er, [key]: undefined } : er));
    }

    function setOwnPhone(phone: Phone) {
        setForm((f) => ({ ...f, phone }));
        setErrors((er) => (er.phone ? { ...er, phone: undefined } : er));
    }

    function setContact(index: number, patch: Partial<Contact>) {
        setForm((f) => ({
            ...f,
            contacts: f.contacts.map((c, i) => (i === index ? { ...c, ...patch } : c)),
        }));
        setErrors((er) => {
            if (!er.contacts?.[index]) return er;
            const contacts = er.contacts.map((ce, i) => {
                if (i !== index) return ce;
                const next = { ...ce };
                (Object.keys(patch) as (keyof Contact)[]).forEach((k) => delete next[k]);
                return next;
            });
            return { ...er, contacts };
        });
    }

    function addContact() {
        if (form.contacts.length >= MAX_CONTACTS) return;
        const newIndex = form.contacts.length;
        setForm((f) => ({ ...f, contacts: [...f.contacts, emptyContact(f.phone.country)] }));
        requestAnimationFrame(() => document.getElementById(`contact-${newIndex}-name`)?.focus());
    }

    function removeContact(index: number) {
        setForm((f) => ({ ...f, contacts: f.contacts.filter((_, i) => i !== index) }));
        setErrors((er) => ({ ...er, contacts: undefined }));
    }

    // Props shared by the plain text inputs
    const bind = (key: TextKey, error: string | undefined = errors[key]) => ({
        id: key,
        value: form[key],
        onChange: (e: React.ChangeEvent<HTMLInputElement>) => setText(key, e.target.value),
        "aria-invalid": Boolean(error),
        "aria-describedby": error ? `${key}-error` : undefined,
        className: inputClasses(Boolean(error)),
    });

    /* ----- navigation ----- */

    function goTo(next: number) {
        setDirection(next > step ? 1 : -1);
        setStep(next);
        setMaxStep((m) => Math.max(m, next));
        setFromReview(false);
        setFormError("");

        // Untouched contact numbers follow the country the member picked for their own phone
        if (next === 2) {
            setForm((f) => ({
                ...f,
                contacts: f.contacts.map((c) =>
                    c.phone.number ? c : { ...c, phone: { ...c.phone, country: f.phone.country } }
                ),
            }));
        }
    }

    function editFromReview(index: number) {
        goTo(index);
        setFromReview(true);
    }

    function handleServerError(status: number, message?: string) {
        const text = message ?? "Sign up failed";

        if (/password/i.test(text)) {
            goTo(0);
            setErrors({ password: text });
        } else if (/(date of birth|years old)/i.test(text)) {
            goTo(1);
            setErrors({ dob: text });
        } else if (/emergency/i.test(text)) {
            goTo(2);
            setFormError(text);
        } else if (/phone/i.test(text)) {
            goTo(1);
            setErrors({ phone: text });
        } else if (/terms/i.test(text)) {
            goTo(3);
            setErrors({ terms: text });
        } else if (status === 500) {
            goTo(0);
            setFormError(
                "We couldn't create your account. That email or username may already be in use. Try different details."
            );
        } else {
            setFormError(text);
        }
    }

    async function createAccount() {
        // Re-check every step so a skipped or edited step can't slip through
        for (let s = 0; s < lastStep; s++) {
            const stepErrors = validate(s, form);
            if (hasErrors(stepErrors)) {
                goTo(s);
                setErrors(stepErrors);
                return;
            }
        }

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
                    phone: toE164(form.phone),
                    date_of_birth: form.dob,
                    emergencyContacts: form.contacts.map((c) => ({
                        name: c.name.trim(),
                        relationship: c.relationship.trim(),
                        phone: toE164(c.phone),
                    })),
                    acceptedTerms: form.acceptedTerms,
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
        if (hasErrors(stepErrors)) return;

        if (step < lastStep) {
            goTo(fromReview ? lastStep : step + 1);
            return;
        }
        await createAccount();
    }

    function acceptTerms() {
        setForm((f) => ({ ...f, acceptedTerms: true }));
        setErrors((er) => ({ ...er, terms: undefined }));
        setTermsOpen(false);
    }

    const submitLabel =
        step < lastStep
            ? fromReview
                ? "Save and review"
                : "Continue"
            : loading
                ? "Creating Account..."
                : "Create Account";

    return (
        <section className="min-h-screen bg-background flex items-center justify-center px-4 py-16">
            <div className="w-full max-w-lg">
                <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, ease: "easeOut" }}
                    className="p-[2px] rounded-2xl bg-gradient-to-b from-primary to-secondary shadow-[0_0_40px_rgba(194,92,255,0.15)]"
                >
                    <div className="bg-surface rounded-[14px] p-6 sm:p-8 overflow-hidden">
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
                                            Create Your{" "}
                                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">
                                                Account
                                            </span>
                                        </h2>
                                    </div>

                                    <Stepper step={step} maxStep={maxStep} onJump={goTo} />

                                    <AnimatePresence>
                                        {formError && (
                                            <Banner key="form-error" tone="error">
                                                {formError}
                                            </Banner>
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
                                                {/* ---------- Step 1: Account ---------- */}
                                                {step === 0 && (
                                                    <>
                                                        <Field id="name" label="Name" error={errors.name}>
                                                            <input
                                                                {...bind("name")}
                                                                type="text"
                                                                autoComplete="name"
                                                                placeholder="John Doe"
                                                                autoFocus
                                                                required
                                                            />
                                                        </Field>
                                                        <Field id="username" label="Username" error={errors.username}>
                                                            <input
                                                                {...bind("username")}
                                                                type="text"
                                                                autoComplete="username"
                                                                autoCapitalize="none"
                                                                spellCheck={false}
                                                                placeholder="jdoe"
                                                                required
                                                            />
                                                        </Field>
                                                        <Field id="email" label="Email" error={errors.email}>
                                                            <input
                                                                {...bind("email")}
                                                                type="email"
                                                                inputMode="email"
                                                                autoComplete="email"
                                                                autoCapitalize="none"
                                                                spellCheck={false}
                                                                placeholder="you@example.com"
                                                                required
                                                            />
                                                        </Field>
                                                        <Field id="password" label="Password" error={errors.password}>
                                                            <PasswordInput
                                                                {...bind("password")}
                                                                autoComplete="new-password"
                                                                maxLength={72}
                                                                placeholder="Create a password"
                                                                required
                                                            />
                                                            <div className="mt-3">
                                                                <PasswordGuide password={form.password} />
                                                            </div>
                                                        </Field>
                                                    </>
                                                )}

                                                {/* ---------- Step 2: About you ---------- */}
                                                {step === 1 && (
                                                    <>
                                                        <Field id="phone" label="Phone" error={errors.phone}>
                                                            <PhoneInput
                                                                id="phone"
                                                                value={form.phone}
                                                                onChange={setOwnPhone}
                                                                hasError={Boolean(errors.phone)}
                                                                describedBy={errors.phone ? "phone-error" : undefined}
                                                                autoFocus
                                                            />
                                                        </Field>

                                                        <Field
                                                            id="dob"
                                                            label="Date of birth"
                                                            error={dobError}
                                                            hint={`You must be at least ${MIN_AGE} years old to join.`}
                                                        >
                                                            <input
                                                                {...bind("dob", dobError)}
                                                                className={`${inputClasses(Boolean(dobError))} [color-scheme:dark]`}
                                                                type="date"
                                                                autoComplete="bday"
                                                                min={minDob}
                                                                max={maxDob}
                                                                required
                                                            />
                                                        </Field>
                                                    </>
                                                )}

                                                {/* ---------- Step 3: Emergency contacts ---------- */}
                                                {step === 2 && (
                                                    <>
                                                        <div className="-mt-1 flex items-start justify-between gap-4">
                                                            <p className="text-sm text-slate-400">
                                                                People we can call if something happens while you're training. Add up to{" "}
                                                                {MAX_CONTACTS}.
                                                            </p>
                                                            <span className="shrink-0 rounded-full border border-border px-2.5 py-1 text-xs font-semibold text-slate-400">
                                                                {form.contacts.length} of {MAX_CONTACTS}
                                                            </span>
                                                        </div>

                                                        <AnimatePresence initial={false}>
                                                            {form.contacts.map((c, i) => {
                                                                const ce = errors.contacts?.[i] ?? {};
                                                                return (
                                                                    <motion.div
                                                                        key={i}
                                                                        initial={{ opacity: 0, height: 0 }}
                                                                        animate={{ opacity: 1, height: "auto" }}
                                                                        exit={{ opacity: 0, height: 0 }}
                                                                        transition={{ duration: 0.25, ease: "easeOut" }}
                                                                        className="overflow-hidden"
                                                                    >
                                                                        <div className="space-y-4 rounded-xl border border-border bg-background/50 p-4">
                                                                            <div className="flex items-center justify-between">
                                                                                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300">
                                                                                    Contact {i + 1}
                                                                                </h3>
                                                                                {i > 0 && (
                                                                                    <button
                                                                                        type="button"
                                                                                        onClick={() => removeContact(i)}
                                                                                        className="flex items-center gap-1 text-xs font-semibold text-slate-400 transition-colors hover:text-danger"
                                                                                    >
                                                                                        <XMarkIcon className="h-3.5 w-3.5" />
                                                                                        Remove
                                                                                    </button>
                                                                                )}
                                                                            </div>

                                                                            <Field id={`contact-${i}-name`} label="Name" error={ce.name}>
                                                                                <input
                                                                                    id={`contact-${i}-name`}
                                                                                    type="text"
                                                                                    autoComplete="off"
                                                                                    autoFocus={i === 0}
                                                                                    value={c.name}
                                                                                    onChange={(e) => setContact(i, { name: e.target.value })}
                                                                                    placeholder="Jane Doe"
                                                                                    aria-invalid={Boolean(ce.name)}
                                                                                    aria-describedby={ce.name ? `contact-${i}-name-error` : undefined}
                                                                                    className={inputClasses(Boolean(ce.name))}
                                                                                />
                                                                            </Field>

                                                                            <RelationshipField
                                                                                id={`contact-${i}-relationship`}
                                                                                value={c.relationship}
                                                                                error={ce.relationship}
                                                                                onChange={(v) => setContact(i, { relationship: v })}
                                                                            />

                                                                            <Field id={`contact-${i}-phone`} label="Phone" error={ce.phone}>
                                                                                <PhoneInput
                                                                                    id={`contact-${i}-phone`}
                                                                                    value={c.phone}
                                                                                    onChange={(phone) => setContact(i, { phone })}
                                                                                    hasError={Boolean(ce.phone)}
                                                                                    describedBy={ce.phone ? `contact-${i}-phone-error` : undefined}
                                                                                />
                                                                            </Field>
                                                                        </div>
                                                                    </motion.div>
                                                                );
                                                            })}
                                                        </AnimatePresence>

                                                        {form.contacts.length < MAX_CONTACTS ? (
                                                            <button
                                                                type="button"
                                                                onClick={addContact}
                                                                className="flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-border py-3 text-sm font-semibold text-slate-400 transition-colors hover:border-slate-500 hover:text-white"
                                                            >
                                                                <PlusIcon className="h-4 w-4" />
                                                                Add a second contact
                                                            </button>
                                                        ) : (
                                                            <p className="text-center text-xs text-slate-500">
                                                                You've added the maximum of {MAX_CONTACTS} contacts.
                                                            </p>
                                                        )}
                                                    </>
                                                )}

                                                {/* ---------- Step 4: Review ---------- */}
                                                {step === 3 && (
                                                    <>
                                                        <p className="-mt-1 text-sm text-slate-400">
                                                            Check your details, then create your account.
                                                        </p>

                                                        <ReviewCard title="Account" onEdit={() => editFromReview(0)}>
                                                            <ReviewRow label="Name">{form.name.trim()}</ReviewRow>
                                                            <ReviewRow label="Username">{form.username.trim()}</ReviewRow>
                                                            <ReviewRow label="Email">{form.email.trim()}</ReviewRow>
                                                        </ReviewCard>

                                                        <ReviewCard title="About you" onEdit={() => editFromReview(1)}>
                                                            <ReviewRow label="Phone">{formatPhone(form.phone)}</ReviewRow>
                                                            <ReviewRow label="Date of birth">
                                                                {form.dob ? `${formatDob(form.dob)} (age ${ageOn(form.dob)})` : "—"}
                                                            </ReviewRow>
                                                        </ReviewCard>

                                                        <ReviewCard
                                                            title={form.contacts.length > 1 ? "Emergency contacts" : "Emergency contact"}
                                                            onEdit={() => editFromReview(2)}
                                                        >
                                                            {form.contacts.map((c, i) => (
                                                                <ReviewRow key={i} label={`Contact ${i + 1}`}>
                                                                    {c.name.trim()} ({c.relationship.trim()})
                                                                    <br />
                                                                    <span className="text-slate-400">{formatPhone(c.phone)}</span>
                                                                </ReviewRow>
                                                            ))}
                                                        </ReviewCard>

                                                        <div>
                                                            <label
                                                                className={`flex cursor-pointer items-start gap-3 rounded-xl border p-4 transition-colors ${errors.terms
                                                                        ? "border-danger/60 bg-danger/5"
                                                                        : form.acceptedTerms
                                                                            ? "border-secondary/40 bg-secondary/5"
                                                                            : "border-border hover:border-slate-600"
                                                                    }`}
                                                            >
                                                                <input
                                                                    type="checkbox"
                                                                    className="peer sr-only"
                                                                    checked={form.acceptedTerms}
                                                                    onChange={(e) => {
                                                                        setForm((f) => ({ ...f, acceptedTerms: e.target.checked }));
                                                                        setErrors((er) => ({ ...er, terms: undefined }));
                                                                    }}
                                                                    aria-describedby={errors.terms ? "terms-error" : undefined}
                                                                />
                                                                <span
                                                                    aria-hidden="true"
                                                                    className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-md border transition-colors peer-focus-visible:ring-2 peer-focus-visible:ring-primary ${form.acceptedTerms ? "border-secondary bg-secondary" : "border-slate-600"
                                                                        }`}
                                                                >
                                                                    {form.acceptedTerms && <CheckIcon className="h-3.5 w-3.5 text-black" />}
                                                                </span>
                                                                <span className="text-sm leading-snug text-slate-300">
                                                                    I have read and agree to the{" "}
                                                                    <button
                                                                        type="button"
                                                                        onClick={(e) => {
                                                                            e.preventDefault();
                                                                            setTermsOpen(true);
                                                                        }}
                                                                        className="font-semibold text-secondary underline underline-offset-2"
                                                                    >
                                                                        Terms &amp; Conditions
                                                                    </button>
                                                                    .
                                                                </span>
                                                            </label>
                                                            <AnimatePresence initial={false}>
                                                                {errors.terms && (
                                                                    <motion.p
                                                                        key="terms-error"
                                                                        id="terms-error"
                                                                        role="alert"
                                                                        initial={{ opacity: 0, y: -4 }}
                                                                        animate={{ opacity: 1, y: 0 }}
                                                                        exit={{ opacity: 0 }}
                                                                        className="mt-2 text-xs text-danger"
                                                                    >
                                                                        {errors.terms}
                                                                    </motion.p>
                                                                )}
                                                            </AnimatePresence>
                                                        </div>
                                                    </>
                                                )}
                                            </motion.div>
                                        </AnimatePresence>

                                        <div className="mt-8 flex gap-3">
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
                                                {submitLabel}
                                            </motion.button>
                                        </div>
                                    </form>

                                    <p className="mt-8 text-center text-sm text-slate-400">
                                        Already have an account?{" "}
                                        <Link to="/login" className="font-semibold text-secondary hover:underline">
                                            Log in
                                        </Link>
                                    </p>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </motion.div>
            </div>

            <TermsModal open={termsOpen} onClose={() => setTermsOpen(false)} onAccept={acceptTerms} />
        </section>
    );
};

export default Signup;