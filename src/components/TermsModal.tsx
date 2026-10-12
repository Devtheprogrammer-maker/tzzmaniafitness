import React, { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "motion/react";
import { XMarkIcon } from "@heroicons/react/24/solid";

// Draft wording. Edit this to match your gym's real policies and have it reviewed before launch.
const TERMS = [
    {
        title: "Who can join",
        body: "You must be at least 15 years old to create an account. If you are under 18, make sure a parent or guardian knows you are joining and agrees to these terms.",
    },
    {
        title: "Your membership",
        body: "Your membership gives you 2 hours of floor access per visit, any time within our posted opening hours. It is personal to you and can't be shared or transferred. Your plan, price and next payment date are shown in your account.",
    },
    {
        title: "Payments",
        body: "Pay your membership fee by the due date shown in your account. If a payment is overdue, we may pause your access until it is settled.",
    },
    {
        title: "Health and safety",
        body: "You confirm you are healthy enough to exercise and will stop and tell staff if you feel unwell or hurt. Use equipment as intended, ask staff if you're unsure, and understand that you train at your own risk. Speak to a doctor before starting if you have any health concerns.",
    },
    {
        title: "Gym etiquette",
        body: "Clean your bench space, return all weights to their racks, and treat staff and other members with respect. We may remove or suspend members who put others at risk or break gym rules.",
    },
    {
        title: "Your information",
        body: "We store your profile and emergency contacts to run your membership and to reach someone if there is an emergency. By listing an emergency contact, you confirm they are happy to be contacted.",
    },
    {
        title: "Changes and ending your membership",
        body: "We may update these terms from time to time. You can stop your membership at any time by letting us know, and we may end a membership if these terms are broken.",
    },
];

interface TermsModalProps {
    open: boolean;
    onClose: () => void;
    onAccept: () => void;
}

export function TermsModal({ open, onClose, onAccept }: TermsModalProps) {
    const closeRef = useRef<HTMLButtonElement>(null);
    const onCloseRef = useRef(onClose);
    onCloseRef.current = onClose;

    useEffect(() => {
        if (!open) return;

        const previouslyFocused = document.activeElement as HTMLElement | null;
        const previousOverflow = document.body.style.overflow;
        document.body.style.overflow = "hidden";
        closeRef.current?.focus();

        const onKey = (e: KeyboardEvent) => {
            if (e.key === "Escape") onCloseRef.current();
        };
        window.addEventListener("keydown", onKey);

        return () => {
            document.body.style.overflow = previousOverflow;
            window.removeEventListener("keydown", onKey);
            previouslyFocused?.focus();
        };
    }, [open]);

    return createPortal(
        <AnimatePresence>
            {open && (
                <motion.div
                    className="fixed inset-0 z-50 flex items-end justify-center p-4 sm:items-center"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                >
                    <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} aria-hidden="true" />

                    <motion.div
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby="terms-title"
                        initial={{ opacity: 0, y: 24, scale: 0.98 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 16 }}
                        transition={{ duration: 0.25, ease: "easeOut" }}
                        className="relative flex max-h-[85vh] w-full max-w-lg flex-col overflow-hidden rounded-2xl border border-border bg-surface shadow-2xl"
                    >
                        <div className="flex items-center justify-between border-b border-border px-6 py-4">
                            <h2 id="terms-title" className="text-lg font-black uppercase tracking-tight text-white">
                                Terms &amp; Conditions
                            </h2>
                            <button
                                ref={closeRef}
                                type="button"
                                onClick={onClose}
                                aria-label="Close terms"
                                className="rounded-lg p-1.5 text-slate-400 transition-colors hover:text-white"
                            >
                                <XMarkIcon className="h-5 w-5" />
                            </button>
                        </div>

                        <div className="space-y-5 overflow-y-auto px-6 py-5">
                            {TERMS.map((section, i) => (
                                <div key={section.title}>
                                    <h3 className="text-sm font-bold text-white">
                                        {i + 1}. {section.title}
                                    </h3>
                                    <p className="mt-1.5 text-sm leading-relaxed text-slate-400">{section.body}</p>
                                </div>
                            ))}
                        </div>

                        <div className="flex gap-3 border-t border-border px-6 py-4">
                            <button
                                type="button"
                                onClick={onClose}
                                className="rounded-xl border border-border px-5 py-3 text-sm font-bold uppercase tracking-wider text-slate-300 transition-colors hover:border-slate-600 hover:text-white"
                            >
                                Close
                            </button>
                            <button
                                type="button"
                                onClick={onAccept}
                                className="flex-1 rounded-xl bg-gradient-to-r from-primary to-secondary px-4 py-3 text-sm font-bold uppercase tracking-wider text-white shadow-md shadow-primary/20"
                            >
                                I agree
                            </button>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>,
        document.body
    );
}