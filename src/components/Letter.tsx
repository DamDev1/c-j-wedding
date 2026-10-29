"use client";

import { useEffect, useRef, useState } from "react";
import { Button } from "./Button";
import { FloralFrame } from "./Decoration";
import { useRouter } from "next/navigation";

const TITLE = "A little note from us";

const BODY_LINES = [
    "As much as we adore your little ones, our wedding will be an adults-only celebration.",
    "We hope you\u2019ll enjoy some time off and join us for a day of love, laughter and dancing.",
    "To keep things intimate, each invitation admits only the guest named on it. If you\u2019d like to bring a plus-one, please reach out to us for confirmation before making any arrangements.",
    "Thank you for understanding, and for being part of our day. We can\u2019t wait to celebrate with you",
];

const CHAR_DELAY = 28;
const PARAGRAPH_PAUSE = 300;
const START_DELAY = 600;

const HOLES = ["12%", "35%", "66%", "89%"];

const STARTS = BODY_LINES.reduce<number[]>((acc, _line, i) => {
    acc.push(i === 0 ? 0 : acc[i - 1] + BODY_LINES[i - 1].length);
    return acc;
}, []);
const TOTAL = BODY_LINES.reduce((n, line) => n + line.length, 0);
const PARAGRAPH_BREAKS = new Set(STARTS.slice(1));

export function Letter() {
    const sectionRef = useRef<HTMLElement>(null);
    const [started, setStarted] = useState(false);
    const [typed, setTyped] = useState(0);
    const [showCursor, setShowCursor] = useState(true);
    const router = useRouter()

    // Start when the section scrolls into view
    useEffect(() => {
        const el = sectionRef.current;
        if (!el) return;

        const io = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setStarted(true);
                    io.disconnect();
                }
            },
            { threshold: 0.3 },
        );
        io.observe(el);
        return () => io.disconnect();
    }, []);

    // Typewriter effect
    useEffect(() => {
        if (!started) return;

        if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
            setTyped(TOTAL);
            setShowCursor(false);
            return;
        }

        let count = 0;
        let timer: ReturnType<typeof setTimeout>;

        const step = () => {
            count += 1;
            setTyped(count);

            if (count >= TOTAL) {
                timer = setTimeout(() => setShowCursor(false), 1200);
                return;
            }

            timer = setTimeout(
                step,
                PARAGRAPH_BREAKS.has(count) ? PARAGRAPH_PAUSE : CHAR_DELAY,
            );
        };

        timer = setTimeout(step, START_DELAY);
        return () => clearTimeout(timer);
    }, [started]);

    // The paragraph the cursor currently sits in
    const current =
        typed === 0 ? 0 : STARTS.filter((start) => start < typed).length - 1;

    return (
        <section
            ref={sectionRef}
            id="letter"
            className="relative flex min-h-screen flex-col items-center justify-start gap-[4vh] overflow-hidden px-4 pt-[13vh] pb-[6vh]"
        >
            <FloralFrame />

            {/* Paper stack: width drives everything, height follows the 4:5 sheet */}
            <div className="relative w-[86vw] max-w-[640px] sm:w-[48vw] lg:w-[36vw]">
                {/* Sheets underneath the top one */}
                <div
                    aria-hidden
                    className="absolute inset-0 translate-x-[7%] translate-y-[4.5%] rotate-[1.4deg] bg-[#d2d2d2] shadow-[0_28px_50px_-14px_rgba(0,0,0,0.35)]"
                />
                <div
                    aria-hidden
                    className="absolute inset-0 translate-x-[4.5%] translate-y-[2.5%] -rotate-[0.8deg] bg-[#dcdcdc]"
                />
                <div
                    aria-hidden
                    className="absolute inset-0 -translate-x-[2%] translate-y-[1%] -rotate-[0.7deg] bg-[#e3e3e3]"
                />

                {/* Top sheet */}
                <div className="relative aspect-[4/5] w-full bg-gradient-to-b from-[#ededed] to-[#d5d5d5] shadow-[0_1px_3px_rgba(0,0,0,0.15)] [container-type:inline-size]">
                    {/* Punched holes */}
                    {HOLES.map((top) => (
                        <span
                            key={top}
                            aria-hidden
                            style={{ top }}
                            className="absolute left-[7%] h-[3.6cqi] w-[3.6cqi] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle_at_35%_30%,#8d8d8d,#2e2e2e_75%)] shadow-[inset_0_2px_3px_rgba(0,0,0,0.6),0_1px_0_rgba(255,255,255,0.7)]"
                        />
                    ))}

                    {/* Content */}
                    <div className="absolute inset-x-[11%] top-[8%] flex flex-col items-center">
                        <h2 className="font-display text-[6.6cqi] leading-[1.2] font-bold text-[#2a1109]">
                            {TITLE}
                        </h2>

                        {/* Screen readers get the full text at once */}
                        <p className="sr-only">{BODY_LINES.join(" ")}</p>

                        {/* The untyped remainder stays invisible so words never jump between lines */}
                        <div
                            aria-hidden
                            className="mt-[4cqi] text-center text-[4.2cqi] leading-[1.7] text-[#2a1109]"
                        >
                            {BODY_LINES.map((line, i) => {
                                const n = Math.max(
                                    0,
                                    Math.min(line.length, typed - STARTS[i]),
                                );
                                return (
                                    <p key={i}>
                                        {line.slice(0, n)}
                                        {i === current && (
                                            <span
                                                className={`letter-cursor ml-[1px] inline-block h-[1em] w-[2px] translate-y-[2px] bg-[#2a1109] ${
                                                    showCursor ? "" : "invisible"
                                                }`}
                                            />
                                        )}
                                        <span className="invisible">
                                            {line.slice(n)}
                                        </span>
                                    </p>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </div>

            <div className="relative z-10">
                {/* <Button href="#rsvp" tone="olive" onClick={() => router.push("/rsvp")}>
                    RSVP
                </Button> */}
            </div>
        </section>
    );
}