"use client";

import { FloralFrame } from "@/components/Decoration";
import { useState, type FormEvent } from "react";

// Placeholders from the design — replace with the real details
const COUPLE = "Chioma & John";
const RSVP_DEADLINE = "21ˢᵗ October";
const PLUS_ONE_CONFIRM_DATE = "21ˢᵗ October";

type Reply = "accept" | "decline";

export type RsvpData = {
    name: string;
    email: string;
    reply: Reply;
    plusOneName?: string;
    message?: string;
};

// Default submit handler. Sends RSVP data to the Resend-powered /api/rsvp endpoint.
async function postRsvp(data: RsvpData) {
    const res = await fetch("/api/rsvp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
    });
    if (!res.ok) {
        const errorData = await res.json().catch(() => null);
        throw new Error(
            errorData?.error || "Failed to submit RSVP. Please try again."
        );
    }
}

const labelClass = "mb-2 block p-0 text-[15px] font-bold text-[#1b1511]";

const fieldClass =
    "w-full rounded-xl border border-[#dcdcdc] bg-white px-4 text-[17px] text-[#1b1511] outline-none transition placeholder:text-[#9b9b9b] focus:border-olive focus:ring-2 focus:ring-olive/20";

export default function Rsvp({
    onSubmit = postRsvp,
}: {
    onSubmit?: (data: RsvpData) => Promise<void>;
}) {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [reply, setReply] = useState<Reply | null>(null);
    const [plusOneOpen, setPlusOneOpen] = useState(false);
    const [plusOneName, setPlusOneName] = useState("");
    const [message, setMessage] = useState("");
    const [status, setStatus] = useState<"idle" | "sending" | "sent">("idle");
    const [error, setError] = useState("");

    function choose(next: Reply) {
        setReply(next);
        if (next === "decline") {
            setPlusOneOpen(false);
            setPlusOneName("");
        }
    }

    async function handleSubmit(e: FormEvent<HTMLFormElement>) {
        e.preventDefault();
        if (!reply) return;

        setError("");
        setStatus("sending");

        try {
            await onSubmit({
                name: name.trim(),
                email: email.trim(),
                reply,
                plusOneName:
                    reply === "accept" && plusOneOpen
                        ? plusOneName.trim()
                        : undefined,
                message: message.trim() || undefined,
            });
            setStatus("sent");
        } catch (err: unknown) {
            setStatus("idle");
            const errorMessage =
                err instanceof Error
                    ? err.message
                    : "Something went wrong. Please try again.";
            setError(errorMessage);
        }
    }

    return (
        <section
            id="rsvp"
            className="relative flex min-h-screen items-center justify-center overflow-hidden px-4 py-16"
        >
            <FloralFrame />

            {/* Transparent card: the florals show through, as in the design */}
            <div className="relative z-10 w-full max-w-[648px] border-2 border-[#c09b5e] px-8 pt-10 pb-9">
                <header className="text-center">
                    <p className="font-script mb-5 text-[44px] leading-none text-olive sm:text-[56px]">
                        {COUPLE}
                    </p>

                    {status === "sent" ? (
                        <>
                            <h2 className="font-display mb-4 text-4xl leading-tight font-bold text-olive sm:text-[40px]">
                                Thank you!
                            </h2>
                            <p className="text-xl text-olive" role="status">
                                {reply === "accept"
                                    ? "We can\u2019t wait to celebrate with you."
                                    : "We\u2019ll miss you, and thank you for letting us know."}
                            </p>
                            <p className="mt-3 text-[15px] text-[#5c5449]">
                                A confirmation has been sent to{" "}
                                <span className="font-semibold text-olive">{email}</span>.
                            </p>
                        </>
                    ) : (
                        <>
                            <h2 className="font-display mb-4 text-4xl leading-tight font-bold text-olive sm:text-[40px]">
                                Will you join us?
                            </h2>
                            <p className="mb-6 text-xl text-olive">
                                Kindly respond by  21ˢᵗ October
                            </p>
                        </>
                    )}
                </header>

                {status !== "sent" && (
                    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                        <div>
                            <label htmlFor="rsvp-name" className={labelClass}>
                                Full name, as on your invitation
                            </label>
                            <input
                                id="rsvp-name"
                                name="name"
                                type="text"
                                autoComplete="name"
                                required
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="Your full name"
                                className={`${fieldClass} h-[55px]`}
                            />
                        </div>

                        <div>
                            <label htmlFor="rsvp-email" className={labelClass}>
                                Email address
                            </label>
                            <input
                                id="rsvp-email"
                                name="email"
                                type="email"
                                autoComplete="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="you@example.com"
                                className={`${fieldClass} h-[55px]`}
                            />
                        </div>

                        <fieldset>
                            <legend className={labelClass}>Your reply</legend>
                            <div className="grid grid-cols-2 gap-5">
                                {(["accept", "decline"] as const).map((value) => (
                                    <label key={value} className="cursor-pointer">
                                        <input
                                            type="radio"
                                            name="reply"
                                            value={value}
                                            checked={reply === value}
                                            onChange={() => choose(value)}
                                            required
                                            className="peer sr-only"
                                        />
                                        <span className="flex h-[55px] items-center justify-center rounded-[10px] border border-[#dcdcdc] bg-white px-3 text-center text-[15px] text-[#1b1511] transition hover:border-olive/60 peer-checked:border-olive peer-checked:bg-olive peer-checked:font-semibold peer-checked:text-white peer-focus-visible:ring-2 peer-focus-visible:ring-olive/40 sm:text-base">
                                            {value === "accept"
                                                ? "Joyfully accepts"
                                                : "Regretfully declines"}
                                        </span>
                                    </label>
                                ))}
                            </div>
                        </fieldset>

                        {reply === "accept" && (
                            <div className="-mt-1">
                                <div className="mx-1.5 h-px bg-[#d9cfb8]" />

                                <button
                                    type="button"
                                    aria-expanded={plusOneOpen}
                                    aria-controls="rsvp-plus-one"
                                    onClick={() => setPlusOneOpen((open) => !open)}
                                    className="mt-[18px] text-left text-lg font-medium text-[#2f6f0f] underline underline-offset-2"
                                >
                                    Would you like to bring a plus-one?
                                </button>

                                {plusOneOpen && (
                                    <div id="rsvp-plus-one">
                                        <p className="mt-2 text-[15px] leading-[1.5] font-semibold text-[#1b1511]">
                                            Add their name and we&apos;ll confirm by{" "}
                                            {PLUS_ONE_CONFIRM_DATE}. Your plus-one is
                                            only confirmed once you hear from us.
                                        </p>

                                        <div className="mt-4">
                                            <label
                                                htmlFor="rsvp-plus-one-name"
                                                className={labelClass}
                                            >
                                                Plus-one&apos;s full name
                                            </label>
                                            <input
                                                id="rsvp-plus-one-name"
                                                name="plusOneName"
                                                type="text"
                                                required
                                                value={plusOneName}
                                                onChange={(e) =>
                                                    setPlusOneName(e.target.value)
                                                }
                                                placeholder="Their full name"
                                                className={`${fieldClass} h-[55px]`}
                                            />
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}

                        <div>
                            <label htmlFor="rsvp-message" className={labelClass}>
                                A message for the couple{" "}
                                <span className="font-semibold text-[#6b6b6b]">
                                    (optional)
                                </span>
                            </label>
                            <textarea
                                id="rsvp-message"
                                name="message"
                                rows={2}
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                placeholder="Type message"
                                className={`${fieldClass} min-h-[60px] resize-none py-3`}
                            />
                            <p className="mt-2 text-[15px] font-semibold text-[#1b1511]">
                                Adults only. Each invitation admits the guest named on
                                it.
                            </p>
                        </div>

                        {error && (
                            <p role="alert" className="text-center text-sm text-red-700">
                                {error}
                            </p>
                        )}

                        <div className="mt-1 flex justify-center">
                            <button
                                type="submit"
                                disabled={status === "sending"}
                                className="h-12 rounded-full bg-olive px-8 text-lg font-semibold text-white transition hover:brightness-110 focus-visible:ring-2 focus-visible:ring-olive/40 focus-visible:ring-offset-2 focus-visible:outline-none disabled:opacity-60"
                            >
                                {status === "sending" ? "Sending…" : "Send RSVP"}
                            </button>
                        </div>
                    </form>
                )}
            </div>
        </section>
    );
}

export { Rsvp };