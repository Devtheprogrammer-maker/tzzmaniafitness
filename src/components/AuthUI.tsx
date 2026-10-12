import React, { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";
import { CheckIcon } from "@heroicons/react/24/solid";


export const labelClass =
    "block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2";

export const inputClasses = (hasError = false) =>
    `w-full bg-background border rounded-xl px-4 py-3 text-sm text-white placeholder:text-slate-600 outline-none transition-colors focus:ring-1 ${hasError
        ? "border-danger focus:border-danger focus:ring-danger"
        : "border-border focus:border-primary focus:ring-primary"
    }`;

type BannerTone = "success" | "error" | "warning";

const bannerTones: Record<BannerTone, string> = {
    success: "border-success/30 bg-success/10 text-success",
    error: "border-danger/30 bg-danger/10 text-danger",
    warning: "border-amber-400/30 bg-amber-400/10 text-amber-300",
};

// Render inside <AnimatePresence> with a key so it animates in and out.
export function Banner({ tone, children }: { tone: BannerTone; children: React.ReactNode }) {
    return (
        <motion.div
            role={tone === "error" ? "alert" : "status"}
            initial={{ opacity: 0, height: 0, marginBottom: 0 }}
            animate={{ opacity: 1, height: "auto", marginBottom: 24 }}
            exit={{ opacity: 0, height: 0, marginBottom: 0 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="overflow-hidden"
        >
            <div className={`rounded-xl border px-4 py-3 text-sm leading-snug ${bannerTones[tone]}`}>
                {children}
            </div>
        </motion.div>
    );
}

type PasswordInputProps = Omit<React.InputHTMLAttributes<HTMLInputElement>, "type">;

export function PasswordInput({ className = "", ...props }: PasswordInputProps) {
    const [visible, setVisible] = useState(false);
    const [capsOn, setCapsOn] = useState(false);

    const checkCaps = (e: React.KeyboardEvent<HTMLInputElement>) =>
        setCapsOn(e.getModifierState("CapsLock"));

    return (
        <div>
            <div className="relative">
                <input
                    {...props}
                    type={visible ? "text" : "password"}
                    className={`${className} pr-12`}
                    onKeyDown={checkCaps}
                    onKeyUp={checkCaps}
                    onBlur={() => setCapsOn(false)}
                />
                <button
                    type="button"
                    onClick={() => setVisible((v) => !v)}
                    aria-label={visible ? "Hide password" : "Show password"}
                    aria-pressed={visible}
                    className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md p-1 text-slate-500 hover:text-white transition-colors"
                >
                    {visible ? <EyeSlashIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}
                </button>
            </div>

            <AnimatePresence initial={false}>
                {capsOn && (
                    <motion.p
                        key="caps"
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="overflow-hidden text-xs text-amber-300"
                    >
                        <span className="block pt-2">Caps Lock is on</span>
                    </motion.p>
                )}
            </AnimatePresence>
        </div>
    );
}
// Set to false to make everything except the 8-character minimum an optional tip.
export const ENFORCE_STRICT_PASSWORDS = true;

export interface PasswordRule {
    id: string;
    label: string;
    short: string;
    valid: boolean;
    required: boolean;
}

export function passwordRules(pw: string): PasswordRule[] {
    return [
        { id: "length", label: "At least 8 characters", short: "8+ characters", valid: pw.length >= 8, required: true },
        { id: "case", label: "Upper and lowercase letters", short: "upper and lowercase letters", valid: /[a-z]/.test(pw) && /[A-Z]/.test(pw), required: ENFORCE_STRICT_PASSWORDS },
        { id: "number", label: "A number", short: "a number", valid: /\d/.test(pw), required: ENFORCE_STRICT_PASSWORDS },
        { id: "symbol", label: "A symbol (! ? # …)", short: "a symbol", valid: /[^A-Za-z0-9]/.test(pw), required: ENFORCE_STRICT_PASSWORDS },
    ];
}

function joinList(items: string[]) {
    if (items.length <= 1) return items.join("");
    return `${items.slice(0, -1).join(", ")} and ${items[items.length - 1]}`;
}

/** Returns a message if the password can't be submitted yet, otherwise null. */
export function passwordProblem(pw: string): string | null {
    if (pw.length > 72) return "Use 72 characters or fewer.";
    const missing = passwordRules(pw).filter((r) => r.required && !r.valid);
    return missing.length ? `Still needed: ${joinList(missing.map((r) => r.short))}.` : null;
}

const STRENGTH = [
    { label: "Weak", bar: "bg-danger", text: "text-danger" },
    { label: "Okay", bar: "bg-amber-400", text: "text-amber-300" },
    { label: "Good", bar: "bg-lime-400", text: "text-lime-300" },
    { label: "Strong", bar: "bg-secondary", text: "text-secondary" },
];

function GuideRow({ valid, label, optional }: { valid: boolean; label: string; optional?: boolean }) {
    return (
        <li className={`flex items-center gap-2.5 text-xs transition-colors ${valid ? "text-slate-200" : "text-slate-500"}`}>
            <span
                aria-hidden="true"
                className={`flex h-4 w-4 shrink-0 items-center justify-center rounded-full border transition-colors ${valid ? "border-secondary bg-secondary" : "border-border"
                    }`}
            >
                {valid && (
                    <motion.span
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", stiffness: 400, damping: 15 }}
                    >
                        <CheckIcon className="h-3 w-3 text-black" />
                    </motion.span>
                )}
            </span>
            <span>{label}</span>
            {optional && !valid && (
                <span className="ml-auto text-[10px] uppercase tracking-wider text-slate-600">Tip</span>
            )}
            <span className="sr-only">{valid ? "(done)" : "(not done)"}</span>
        </li>
    );
}

/** Live password guide: strength meter, "still needed" summary and checklist. */
export function PasswordGuide({ password, confirm }: { password: string; confirm?: string }) {
    const rules = passwordRules(password);
    const missingRequired = rules.filter((r) => r.required && !r.valid);
    const missingTips = rules.filter((r) => !r.required && !r.valid);

    const lengthOk = rules[0].valid;
    const met = rules.filter((r) => r.valid).length;
    const segments = !password ? 0 : !lengthOk ? 1 : met === 4 && password.length >= 12 ? 4 : Math.min(met, 3);
    const level = STRENGTH[Math.max(segments, 1) - 1];
    const levelLabel = !password ? "Not set" : !lengthOk ? "Too short" : level.label;

    const showMatch = confirm !== undefined && confirm.length > 0;
    const matches = password === confirm;

    const summary = missingRequired.length
        ? `Still needed: ${joinList(missingRequired.map((r) => r.short))}.`
        : missingTips.length
            ? `Optional: add ${joinList(missingTips.map((r) => r.short))} for a stronger password.`
            : "All set. Nice password.";

    return (
        <div className="rounded-xl border border-border bg-background/70 p-4">
            <div className="flex items-center justify-between gap-3">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    Password strength
                </span>
                <span className={`text-xs font-bold ${password ? level.text : "text-slate-500"}`}>
                    {levelLabel}
                </span>
            </div>

            <div className="mt-3 grid grid-cols-4 gap-1.5">
                {[1, 2, 3, 4].map((n) => (
                    <span
                        key={n}
                        className={`h-1.5 rounded-full transition-colors duration-300 ${n <= segments ? level.bar : "bg-white/10"}`}
                    />
                ))}
            </div>

            <p
                aria-live="polite"
                className={`mt-3 text-xs leading-snug ${missingRequired.length ? "text-slate-400" : "text-secondary"}`}
            >
                {summary}
            </p>

            <ul className="mt-3 space-y-2.5">
                {rules.map((r) => (
                    <GuideRow key={r.id} valid={r.valid} label={r.label} optional={!r.required} />
                ))}
                {showMatch && (
                    <GuideRow
                        valid={matches}
                        label={matches ? "Passwords match" : "Passwords don't match yet"}
                    />
                )}
            </ul>
        </div>
    );
}

export const MAIL_PROVIDERS: Record<string, { name: string; url: string }> = {
    "gmail.com": { name: "Gmail", url: "https://mail.google.com" },
    "outlook.com": { name: "Outlook", url: "https://outlook.live.com/mail" },
    "hotmail.com": { name: "Outlook", url: "https://outlook.live.com/mail" },
    "live.com": { name: "Outlook", url: "https://outlook.live.com/mail" },
    "yahoo.com": { name: "Yahoo Mail", url: "https://mail.yahoo.com" },
    "icloud.com": { name: "iCloud Mail", url: "https://www.icloud.com/mail" },
};

export const mailProviderFor = (email: string) =>
    MAIL_PROVIDERS[email.split("@")[1]?.toLowerCase() ?? ""];

/**
 * Runs `onDone` after `durationMs` once `active` is true, and returns the seconds left.
 * The timer is cleared if the component unmounts, so a redirect can't fire after the user leaves.
 */
export function useRedirectCountdown(active: boolean, durationMs: number, onDone: () => void) {
    const [left, setLeft] = useState(Math.ceil(durationMs / 1000));
    const doneRef = useRef(onDone);
    doneRef.current = onDone;

    useEffect(() => {
        if (!active) return;

        const end = Date.now() + durationMs;
        setLeft(Math.ceil(durationMs / 1000));

        const id = setInterval(() => {
            const remaining = Math.max(0, end - Date.now());
            setLeft(Math.ceil(remaining / 1000));
            if (remaining === 0) {
                clearInterval(id);
                doneRef.current();
            }
        }, 200);

        return () => clearInterval(id);
    }, [active, durationMs]);

    return left;
}

export function RedirectBar({ durationMs, secondsLeft }: { durationMs: number; secondsLeft: number }) {
    const reduceMotion = useReducedMotion();
    return (
        <div className="mt-6">
            {!reduceMotion && (
                <div className="h-1 overflow-hidden rounded-full bg-white/10" aria-hidden="true">
                    <motion.div
                        className="h-full rounded-full bg-gradient-to-r from-primary to-secondary"
                        initial={{ width: "0%" }}
                        animate={{ width: "100%" }}
                        transition={{ duration: durationMs / 1000, ease: "linear" }}
                    />
                </div>
            )}
            <p className="mt-2 text-xs text-slate-500">Taking you to login in {secondsLeft}s</p>
        </div>
    );
}