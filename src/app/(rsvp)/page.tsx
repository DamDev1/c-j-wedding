"use client";

import { FloralFrame } from "@/components/Decoration";
import { useState, useEffect, type FormEvent } from "react";

const COUPLE = "Chioma & John";
const PLUS_ONE_CONFIRM_DATE = "21ˢᵗ October";

type Reply = "accept" | "decline";

export type RsvpData = {
    name: string;
    reply: Reply;
    plusOneName?: string;
    message?: string;
    deviceId?: string;
};

async function postRsvp(data: RsvpData): Promise<{ success?: boolean; hasRsvped?: boolean; reply?: Reply }> {
    const res = await fetch("/api/rsvp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
    });
    const responseData = await res.json().catch(() => null);

    if (!res.ok) {
        if (responseData?.hasRsvped && responseData?.reply) {
            return responseData;
        }
        throw new Error(
            responseData?.error || "Failed to submit RSVP. Please try again."
        );
    }
    return responseData || {};
}

const labelClass = "mb-2 block p-0 text-[15px] font-bold text-[#1b1511]";

const fieldClass =
    "w-full rounded-xl border border-[#dcdcdc] bg-white px-4 text-[17px] text-[#1b1511] outline-none transition placeholder:text-[#9b9b9b] focus:border-olive focus:ring-2 focus:ring-olive/20";

export default function Rsvp({
    onSubmit = postRsvp,
}: {
    onSubmit?: (data: RsvpData) => Promise<{ success?: boolean; hasRsvped?: boolean; reply?: Reply }>;
}) {
    const [name, setName] = useState("");
    const [reply, setReply] = useState<Reply | null>(() => {
        if (typeof window !== "undefined") {
            const savedReply = localStorage.getItem("cj_wedding_rsvp_reply");
            if (savedReply === "accept" || savedReply === "decline") {
                return savedReply;
            }
        }
        return null;
    });
    const [plusOneOpen, setPlusOneOpen] = useState(false);
    const [plusOneName, setPlusOneName] = useState("");
    const [message, setMessage] = useState("");
    const [status, setStatus] = useState<"idle" | "sending" | "sent">(() => {
        if (typeof window !== "undefined") {
            const savedStatus = localStorage.getItem("cj_wedding_rsvp_status");
            if (savedStatus === "sent") {
                return "sent";
            }
        }
        return "idle";
    });
    const [isChecking, setIsChecking] = useState<boolean>(true);
    const [error, setError] = useState("");

    // Check on mount if this guest's phone number has already submitted an RSVP in MongoDB
    useEffect(() => {
        const deviceId =
            typeof window !== "undefined"
                ? localStorage.getItem("cj_wedding_device_id") || ""
                : "";

        async function verifyExistingRsvp() {
            try {
                const res = await fetch(`/api/rsvp?deviceId=${encodeURIComponent(deviceId)}`, {
                    method: "GET",
                    headers: { "Content-Type": "application/json" },
                });

                if (res.ok) {
                    const data = await res.json();
                    if (data.hasRsvped && (data.reply === "accept" || data.reply === "decline")) {
                        setStatus("sent");
                        setReply(data.reply);
                        if (typeof window !== "undefined") {
                            localStorage.setItem("cj_wedding_rsvp_status", "sent");
                            localStorage.setItem("cj_wedding_rsvp_reply", data.reply);
                        }
                    } else if (!data.hasRsvped) {
                        // If DB indicates no RSVP, reset local state
                        setStatus((prev) => (prev === "sending" ? prev : "idle"));
                        if (typeof window !== "undefined") {
                            localStorage.removeItem("cj_wedding_rsvp_status");
                            localStorage.removeItem("cj_wedding_rsvp_reply");
                        }
                    }
                }
            } catch (err) {
                console.error("Failed to check RSVP status:", err);
            } finally {
                setIsChecking(false);
            }
        }

        verifyExistingRsvp();
    }, []);

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
            const deviceId =
                typeof window !== "undefined"
                    ? localStorage.getItem("cj_wedding_device_id") || ""
                    : "";

            const result = await onSubmit({
                name: name.trim(),
                reply,
                plusOneName:
                    reply === "accept" && plusOneOpen
                        ? plusOneName.trim()
                        : undefined,
                message: message.trim() || undefined,
                deviceId,
            });

            const finalReply = (result?.reply as Reply) || reply;
            setReply(finalReply);
            setStatus("sent");

            if (typeof window !== "undefined") {
                localStorage.setItem("cj_wedding_rsvp_status", "sent");
                localStorage.setItem("cj_wedding_rsvp_reply", finalReply);
            }
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
                        </>
                    ) : isChecking ? (
                        <div className="flex flex-col items-center justify-center py-6 gap-2">
                            <div className="h-0.5 w-16 bg-[#b8955a]/40 animate-pulse" />
                            <p className="font-display text-lg text-olive/80 animate-pulse">
                                Checking invitation status…
                            </p>
                        </div>
                    ) : (
                        <>
                            <h2 className="font-display mb-4 text-4xl leading-tight font-bold text-olive sm:text-[40px]">
                                Will you join us?
                            </h2>
                            <p className="mb-6 text-xl text-olive">
                                Kindly respond by 21ˢᵗ October
                            </p>
                        </>
                    )}
                </header>

                {status !== "sent" && !isChecking && (
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