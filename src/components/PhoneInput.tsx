import React from "react";
import { CheckCircleIcon, ChevronDownIcon } from "@heroicons/react/24/solid";
import { inputClasses } from "./AuthUI";

export interface Country {
    code: string;
    name: string;
    dial: string;
    mask: string;    // "#" = one digit
    example: string; // placeholder
}

// Add or remove countries here. The first +1 entry is what a pasted "+1" resolves to.
export const COUNTRIES: Country[] = [
    { code: "BZ", name: "Belize", dial: "501", mask: "###-####", example: "622-1234" },
    { code: "GT", name: "Guatemala", dial: "502", mask: "####-####", example: "5123-4567" },
    { code: "HN", name: "Honduras", dial: "504", mask: "####-####", example: "9123-4567" },
    { code: "SV", name: "El Salvador", dial: "503", mask: "####-####", example: "7123-4567" },
    { code: "MX", name: "Mexico", dial: "52", mask: "## #### ####", example: "55 1234 5678" },
    { code: "US", name: "United States", dial: "1", mask: "(###) ###-####", example: "(555) 123-4567" },
    { code: "CA", name: "Canada", dial: "1", mask: "(###) ###-####", example: "(555) 123-4567" },
    { code: "JM", name: "Jamaica", dial: "1", mask: "(###) ###-####", example: "(876) 123-4567" },
    { code: "GB", name: "United Kingdom", dial: "44", mask: "#### ######", example: "7912 345678" },
];

// The country pre-selected on a fresh form. Change this to wherever most of your members live.
export const DEFAULT_COUNTRY = "BZ";

export interface Phone {
    country: string; // Country.code
    number: string;  // national digits only, no formatting
}

const findCountry = (code: string) => COUNTRIES.find((c) => c.code === code) ?? COUNTRIES[0];
const digitCount = (c: Country) => (c.mask.match(/#/g) ?? []).length;

function applyMask(digits: string, mask: string) {
    let out = "";
    let i = 0;
    for (const ch of mask) {
        if (i >= digits.length) break;
        out += ch === "#" ? digits[i++] : ch;
    }
    return out;
}

export const emptyPhone = (country: string = DEFAULT_COUNTRY): Phone => ({ country, number: "" });

export const isPhoneValid = (p: Phone) => p.number.length === digitCount(findCountry(p.country));

/** "+5016221234", the format the backend stores. */
export const toE164 = (p: Phone) => `+${findCountry(p.country).dial}${p.number}`;

/** "+501 622-1234", for showing back to the user. */
export const formatPhone = (p: Phone) => {
    const c = findCountry(p.country);
    return `+${c.dial} ${applyMask(p.number, c.mask)}`;
};

interface PhoneInputProps {
    id: string;
    value: Phone;
    onChange: (next: Phone) => void;
    hasError?: boolean;
    autoFocus?: boolean;
    describedBy?: string;
}

export function PhoneInput({ id, value, onChange, hasError = false, autoFocus, describedBy }: PhoneInputProps) {
    const country = findCountry(value.country);
    const remaining = digitCount(country) - value.number.length;

    function handleCountry(code: string) {
        const next = findCountry(code);
        onChange({ country: next.code, number: value.number.slice(0, digitCount(next)) });
    }

    function handleNumber(raw: string) {
        let next = country;
        let digits = raw.replace(/\D/g, "");

        if (raw.trim().startsWith("+")) {
            // Pasted or autofilled international number, e.g. "+501 622-1234"
            const match = [...COUNTRIES]
                .sort((a, b) => b.dial.length - a.dial.length)
                .find((c) => digits.startsWith(c.dial));
            if (match) {
                if (match.dial !== country.dial) next = match;
                digits = digits.slice(match.dial.length);
            }
        } else if (digits.length > digitCount(country) && digits.startsWith(country.dial)) {
            // Country code typed without the "+"
            digits = digits.slice(country.dial.length);
        }

        onChange({ country: next.code, number: digits.slice(0, digitCount(next)) });
    }

    return (
        <div>
            <div className="flex gap-2">
                {/* Looks like a compact "BZ +501" pill; a transparent native <select> sits on top for the picker */}
                <div
                    className={`relative flex w-[7.5rem] shrink-0 items-center gap-1.5 rounded-xl border bg-background px-3 text-sm text-foreground transition-all hover:border-primary/60 focus-within:ring-2 focus-within:ring-primary/40 ${hasError
                            ? "border-danger focus-within:border-danger focus-within:ring-danger"
                            : "border-border focus-within:border-primary"
                        }`}
                >
                    <span className="font-semibold">{country.code}</span>
                    <span className="text-slate-400">+{country.dial}</span>
                    <ChevronDownIcon className="ml-auto h-4 w-4 text-slate-500" aria-hidden="true" />
                    <select
                        aria-label="Country code"
                        value={country.code}
                        onChange={(e) => handleCountry(e.target.value)}
                        className="absolute inset-0 h-full w-full cursor-pointer opacity-0 [color-scheme:dark]"
                    >
                        {COUNTRIES.map((c) => (
                            <option
                                key={c.code}
                                value={c.code}
                                className="bg-slate-900 text-white"
                            >
                                {c.name} (+{c.dial})
                            </option>
                        ))}
                    </select>
                </div>

                <input
                    id={id}
                    type="tel"
                    inputMode="tel"
                    autoComplete="tel-national"
                    autoFocus={autoFocus}
                    value={applyMask(value.number, country.mask)}
                    onChange={(e) => handleNumber(e.target.value)}
                    placeholder={country.example}
                    aria-invalid={hasError}
                    aria-describedby={describedBy}
                    className={`${inputClasses(hasError)} min-w-0 flex-1`}
                />
            </div>

            {!hasError && value.number.length > 0 && (
                <p
                    aria-live="polite"
                    className={`mt-2 flex items-center gap-1.5 text-xs ${remaining === 0 ? "text-secondary" : "text-slate-500"}`}
                >
                    {remaining === 0 ? (
                        <>
                            <CheckCircleIcon className="h-4 w-4" aria-hidden="true" />
                            Number looks complete
                        </>
                    ) : (
                        `${remaining} more digit${remaining === 1 ? "" : "s"} to go`
                    )}
                </p>
            )}
        </div>
    );
}