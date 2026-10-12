import React, { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";

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