import { useState } from "react";
import {
    PhoneIcon,
    MapPinIcon,
    PaperAirplaneIcon,
    ChatBubbleLeftRightIcon,
} from "@heroicons/react/24/solid";
import { AnimatePresence, motion, type Variants } from "motion/react";
import { Banner, inputClasses, labelClass } from "../components/AuthUI"; // adjust the path to your folder

const PHONE_DISPLAY = "+501 601-7134";
const PHONE_LINK = "+5016017134";
const DIRECTIONS_URL =
    "https://www.google.com/maps/dir/?api=1&destination=18.4048591,-88.3907064";

// Pick one promise and keep it in one place (the old page said both "24 hours" and "3-4 working days")
const REPLY_TIME = "3-4 working days";
const MAX_MESSAGE = 1000;

const TOPICS = ["Membership", "Day pass", "Personal training", "Gym hours", "Something else"];

type FieldKey = "name" | "email" | "subject" | "message";
type Errors = Partial<Record<FieldKey, string>>;

const container: Variants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.12, delayChildren: 0.05 } },
};

const fadeUp: Variants = {
    hidden: { opacity: 0, y: 24 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
};

const infoCard =
    "p-6 rounded-2xl border border-white/5 bg-surface/40 backdrop-blur-sm flex items-start gap-4 hover:border-primary/20 transition-all group";

const pillLink =
    "rounded-full border border-border px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-slate-300 transition-colors hover:border-secondary hover:text-secondary";

function Field({
    id,
    label,
    error,
    children,
}: {
    id: string;
    label: string;
    error?: string;
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
                        className="mt-2 text-xs text-danger"
                    >
                        {error}
                    </motion.p>
                )}
            </AnimatePresence>
        </div>
    );
}

export default function Contact() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [subject, setSubject] = useState("");
    const [message, setMessage] = useState("");
    const [website, setWebsite] = useState(""); // honeypot: real people never see or fill this
    const [errors, setErrors] = useState<Errors>({});
    const [formError, setFormError] = useState("");
    const [sending, setSending] = useState(false);
    const [sent, setSent] = useState<{ name: string; email: string } | null>(null);

    const clearError = (key: FieldKey) =>
        setErrors((prev) => (prev[key] ? { ...prev, [key]: undefined } : prev));

    // Props shared by every input and the textarea
    const bind = (key: FieldKey, value: string, set: (v: string) => void) => ({
        id: `contact-${key}`,
        value,
        onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
            set(e.target.value);
            clearError(key);
        },
        "aria-invalid": Boolean(errors[key]),
        "aria-describedby": errors[key] ? `contact-${key}-error` : undefined,
        className: inputClasses(Boolean(errors[key])),
    });

    function finish() {
        setSent({ name: name.trim(), email: email.trim() });
        setName("");
        setEmail("");
        setSubject("");
        setMessage("");
        setWebsite("");
    }

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        if (sending) return;
        setFormError("");

        const found: Errors = {};
        if (!name.trim()) found.name = "Enter your name.";
        if (!/^\S+@\S+\.\S+$/.test(email.trim())) found.email = "Enter a valid email so we can reply.";
        if (!subject.trim()) found.subject = "Pick a topic or type your own.";
        if (!message.trim()) found.message = "Write a short message.";

        setErrors(found);
        const first = (["name", "email", "subject", "message"] as FieldKey[]).find((k) => found[k]);
        if (first) {
            document.getElementById(`contact-${first}`)?.focus();
            return;
        }

        // A bot filled the hidden field: act like it worked, send nothing
        if (website.trim()) {
            finish();
            return;
        }

        setSending(true);
        try {
            const response = await fetch("/api/index/send-email", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    name: name.trim(),
                    email: email.trim(),
                    subject: subject.trim(),
                    message: message.trim(),
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                setFormError(
                    data.error ||
                    data.message ||
                    `We couldn't send your message. Please try again or call ${PHONE_DISPLAY}.`
                );
                return;
            }

            finish();
        } catch {
            setFormError(`Could not reach the server. Please try again or call ${PHONE_DISPLAY}.`);
        } finally {
            setSending(false);
        }
    }

    const firstName = sent?.name.split(" ")[0];

    return (
        <motion.section
            id="contact"
            variants={container}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className="py-24 bg-background border-t border-slate-900 text-text overflow-hidden"
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                {/* Section Header */}
                <motion.div variants={fadeUp} className="text-center max-w-3xl mx-auto mb-20">
                    <span className="text-xs font-bold uppercase tracking-widest text-secondary bg-secondary/10 px-4 py-1.5 rounded-full border border-secondary/20">
                        Get In Touch
                    </span>
                    <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tight mt-4 leading-none">
                        Ready To Start Your <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">
                            Transformation?
                        </span>
                    </h2>
                    <p className="text-slate-400 mt-4 text-lg">
                        Have questions about memberships, programming, or hours? Drop us a message or visit the
                        floor. We are here to help you get moving.
                    </p>
                </motion.div>

                <motion.div variants={container} className="grid grid-cols-1 lg:grid-cols-5 gap-12 items-stretch">

                    {/* Left column: ways to reach us */}
                    <motion.div variants={container} className="lg:col-span-2 flex flex-col justify-between gap-6">

                        {/* Phone */}
                        <motion.div variants={fadeUp} className={infoCard}>
                            <div className="p-3 rounded-xl bg-secondary/10 text-secondary group-hover:bg-secondary group-hover:text-black transition-colors">
                                <PhoneIcon className="h-6 w-6" />
                            </div>
                            <div className="min-w-0 flex-1">
                                <h3 className="font-bold uppercase text-xs tracking-wider text-slate-400 mb-1">
                                    Call or Text
                                </h3>
                                <a
                                    href={`tel:${PHONE_LINK}`}
                                    className="text-lg font-bold text-white hover:text-secondary transition-colors font-mono"
                                >
                                    {PHONE_DISPLAY}
                                </a>
                                <p className="text-xs text-slate-500 mt-1">Best for quick questions during gym hours.</p>
                                <div className="mt-3 flex gap-2">
                                    <a href={`tel:${PHONE_LINK}`} className={pillLink}>
                                        Call
                                    </a>
                                    <a href={`sms:${PHONE_LINK}`} className={pillLink}>
                                        Text
                                    </a>
                                </div>
                            </div>
                        </motion.div>

                        {/* Location */}
                        <motion.div variants={fadeUp} className={infoCard}>
                            <div className="p-3 rounded-xl bg-slate-800 text-slate-400 group-hover:bg-slate-700 group-hover:text-white transition-colors">
                                <MapPinIcon className="h-6 w-6" />
                            </div>
                            <div className="min-w-0 flex-1">
                                <h3 className="font-bold uppercase text-xs tracking-wider text-slate-400 mb-1">
                                    Drop By The Gym
                                </h3>
                                <p className="text-lg font-bold text-white leading-tight">Tzzmania Fitness</p>
                                <p className="text-xs text-slate-400 mt-1">
                                    Come tour the gym and meet the coaches.
                                </p>

                                <iframe
                                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3785.736076954701!2d-88.39070642504005!3d18.404859082666423!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8f5b970fb9b2d853%3A0xc4641d5c65497a9e!2sTzzmania%20Fitness!5e0!3m2!1sen!2sbz!4v1784704784463!5m2!1sen!2sbz"
                                    className="mt-4 h-44 w-full rounded-xl border-0 grayscale invert opacity-80 hover:opacity-100 transition-all duration-300"
                                    loading="lazy"
                                    title="Tzzmania Fitness location"
                                />

                                <a
                                    href={DIRECTIONS_URL}
                                    target="_blank"
                                    rel="noreferrer"
                                    className={`${pillLink} mt-3 inline-block`}
                                >
                                    Get directions
                                </a>
                            </div>
                        </motion.div>

                        {/* Day pass banner */}
                        <motion.div
                            variants={fadeUp}
                            className="p-6 rounded-2xl border border-secondary/30 bg-secondary/5 relative overflow-hidden flex flex-col justify-end lg:flex-grow"
                        >
                            <div className="absolute -top-6 -right-6 text-secondary/5">
                                <ChatBubbleLeftRightIcon className="h-36 w-36" />
                            </div>
                            <h4 className="text-xl font-black uppercase text-white tracking-tight relative z-10">
                                No commitment.
                            </h4>
                            <p className="text-xs text-slate-400 mt-1 relative z-10 max-w-[260px]">
                                Not sure yet? A day pass gives you a full 2 hours on the floor to try the gym before
                                you pick a membership.
                            </p>
                            <a
                                href="#membership"
                                className="relative z-10 mt-4 self-start text-xs font-bold uppercase tracking-wider text-secondary hover:underline"
                            >
                                See membership options
                            </a>
                        </motion.div>
                    </motion.div>

                    {/* Right column: message form */}
                    <motion.div
                        variants={fadeUp}
                        className="lg:col-span-3 p-8 rounded-2xl border border-white/10 bg-gradient-to-br from-surface to-background shadow-xl relative"
                    >
                        <AnimatePresence mode="wait" initial={false}>
                            {sent ? (
                                <motion.div
                                    key="success"
                                    initial={{ opacity: 0, y: 8 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.35, ease: "easeOut" }}
                                    className="flex min-h-[24rem] flex-col items-center justify-center text-center"
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

                                    <h3 className="text-2xl font-black uppercase tracking-tight text-white mb-3">
                                        Message sent
                                    </h3>
                                    <p className="max-w-sm text-sm text-slate-400 leading-relaxed">
                                        Thanks{firstName ? `, ${firstName}` : ""}. We'll reply to{" "}
                                        <span className="break-all font-semibold text-white">{sent.email}</span> within{" "}
                                        {REPLY_TIME}.
                                    </p>
                                    <p className="mt-3 text-sm text-slate-400">
                                        Need an answer sooner? Call{" "}
                                        <a href={`tel:${PHONE_LINK}`} className="font-semibold text-secondary hover:underline">
                                            {PHONE_DISPLAY}
                                        </a>
                                        .
                                    </p>

                                    <button
                                        type="button"
                                        onClick={() => setSent(null)}
                                        className="mt-8 rounded-xl border border-border px-5 py-3 text-sm font-bold uppercase tracking-wider text-slate-300 transition-colors hover:border-slate-600 hover:text-white"
                                    >
                                        Send another message
                                    </button>
                                </motion.div>
                            ) : (
                                <motion.div key="form" exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.25 }}>
                                    <h3 className="text-xl font-bold text-white mb-6 uppercase tracking-tight">
                                        Send a Quick Message
                                    </h3>

                                    <AnimatePresence>
                                        {formError && (
                                            <Banner key="form-error" tone="error">
                                                {formError}
                                            </Banner>
                                        )}
                                    </AnimatePresence>

                                    <form onSubmit={handleSubmit} noValidate className="relative space-y-5">
                                        {/* Honeypot, hidden from people and screen readers */}
                                        <div aria-hidden="true" className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
                                            <label htmlFor="contact-website">Website</label>
                                            <input
                                                id="contact-website"
                                                type="text"
                                                tabIndex={-1}
                                                autoComplete="off"
                                                value={website}
                                                onChange={(e) => setWebsite(e.target.value)}
                                            />
                                        </div>

                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                            <Field id="contact-name" label="Full name" error={errors.name}>
                                                <input
                                                    {...bind("name", name, setName)}
                                                    type="text"
                                                    autoComplete="name"
                                                    maxLength={100}
                                                    placeholder="Your name"
                                                />
                                            </Field>
                                            <Field id="contact-email" label="Email address" error={errors.email}>
                                                <input
                                                    {...bind("email", email, setEmail)}
                                                    type="email"
                                                    inputMode="email"
                                                    autoComplete="email"
                                                    autoCapitalize="none"
                                                    spellCheck={false}
                                                    maxLength={254}
                                                    placeholder="yourname@example.com"
                                                />
                                            </Field>
                                        </div>

                                        <Field id="contact-subject" label="What's it about?" error={errors.subject}>
                                            <div className="mb-3 flex flex-wrap gap-2" role="group" aria-label="Common topics">
                                                {TOPICS.map((t) => {
                                                    const selected = subject.trim().toLowerCase() === t.toLowerCase();
                                                    return (
                                                        <button
                                                            key={t}
                                                            type="button"
                                                            aria-pressed={selected}
                                                            onClick={() => {
                                                                setSubject(t);
                                                                clearError("subject");
                                                            }}
                                                            className={`rounded-full border px-3 py-1.5 text-xs font-semibold transition-colors ${selected
                                                                ? "border-primary bg-primary/15 text-white"
                                                                : "border-border text-slate-400 hover:border-slate-600 hover:text-white"
                                                                }`}
                                                        >
                                                            {t}
                                                        </button>
                                                    );
                                                })}
                                            </div>
                                            <input
                                                {...bind("subject", subject, setSubject)}
                                                type="text"
                                                maxLength={100}
                                                placeholder="Or type your own subject"
                                            />
                                        </Field>

                                        <Field id="contact-message" label="Your message" error={errors.message}>
                                            <textarea
                                                {...bind("message", message, setMessage)}
                                                rows={7}
                                                maxLength={MAX_MESSAGE}
                                                placeholder="Tell us about your fitness goals..."
                                                className={`${inputClasses(Boolean(errors.message))} resize-none`}
                                            />
                                            <p className="mt-2 text-right text-xs text-slate-500">
                                                {message.length}/{MAX_MESSAGE}
                                            </p>
                                        </Field>

                                        <motion.button
                                            type="submit"
                                            disabled={sending}
                                            whileHover={sending ? undefined : { scale: 1.02, y: -1 }}
                                            whileTap={sending ? undefined : { scale: 0.98, y: 0 }}
                                            transition={{ duration: 0.2 }}
                                            className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-primary to-secondary text-white font-bold py-3.5 px-6 rounded-xl text-sm uppercase tracking-wider border border-white/10 shadow-lg shadow-primary/20 disabled:opacity-70 disabled:cursor-not-allowed"
                                        >
                                            {sending ? (
                                                <span className="h-4 w-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                                            ) : (
                                                <PaperAirplaneIcon className="h-4 w-4" />
                                            )}
                                            {sending ? "Sending..." : "Send Message"}
                                        </motion.button>
                                    </form>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </motion.div>
                </motion.div>
            </div>
        </motion.section>
    );
}