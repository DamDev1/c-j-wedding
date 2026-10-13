"use client";

import { useEffect, useRef, useState } from "react";
import { Button } from "./Button";
import { FloralFrame } from "./Decoration";

const TITLE = "A little note from us";

const BODY_LINES = [
    "As much as we adore your little ones, our wedding will be an adults-only celebration.",
    "We hope you\u2019ll enjoy some time off and join us for a day of love, laughter and dancing.",
    "To keep things intimate, each invitation admits only the guest named on it. If you\u2019d like to bring a plus-one, please reach out to us for confirmation before making any arrangements.",
    "Thank you for understanding, and for being part of our day. We can\u2019t wait to celebrate with you",
];

const CHAR_DELAY = 28; // ms per character
const LINE_PAUSE = 300; // pause between paragraphs

export function Letter() {
    const sectionRef = useRef<HTMLElement>(null);
    const [started, setStarted] = useState(false);
    const [displayedText, setDisplayedText] = useState("");
    const [showCursor, setShowCursor] = useState(true);

    const fullText = BODY_LINES.join("\n\n");

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

        let charIndex = 0;
        let timeout: ReturnType<typeof setTimeout>;

        function typeNext() {
            if (charIndex >= fullText.length) {
                // Done typing — hide cursor after a beat
                setTimeout(() => setShowCursor(false), 1200);
                return;
            }

            charIndex++;
            setDisplayedText(fullText.slice(0, charIndex));

            // Pause longer at paragraph breaks
            const justTyped = fullText[charIndex - 1];
            const nextChar = fullText[charIndex];
            const delay =
                justTyped === "\n" && nextChar === "\n" ? LINE_PAUSE : CHAR_DELAY;

            timeout = setTimeout(typeNext, delay);
        }

        timeout = setTimeout(typeNext, 600); // initial delay
        return () => clearTimeout(timeout);
    }, [started, fullText]);

    // Split displayed text into paragraphs for rendering
    const paragraphs = displayedText.split("\n\n");

    return (
        <section
            ref={sectionRef}
            id="letter"
            className="relative overflow-hidden"
        >
            <FloralFrame />

            <div className="relative mx-auto flex flex-col items-center gap-10">

                <div className="relative w-full max-w-[900px] [container-type:inline-size]">
                    <img
                        src="/images/book.png"
                        alt=""
                        aria-hidden
                        className="pointer-events-none w-full select-none"
                    />

                    <div className="absolute top-[13%] right-[8%] bottom-[14%] left-[14%] flex flex-col items-center justify-start px-[4%] pt-[4%]">
                        <h2 className="mb-[3%] font-display text-[4cqi] leading-[1.3] font-bold text-olive italic">
                            {TITLE}
                        </h2>

                        <div className="flex-1 overflow-hidden text-center text-[2.5cqi] leading-[1.7] text-olive w-[60%]">
                            {paragraphs.map((para, i) => (
                                <p key={i} className={i > 0 ? "mt-[2%]" : ""}>
                                    {para}
                                    {i === paragraphs.length - 1 && showCursor && (
                                        <span className="letter-cursor ml-[1px] inline-block h-[1em] w-[2px] translate-y-[2px] bg-olive" />
                                    )}
                                </p>
                            ))}
                        </div>
                    </div>
                </div>

                <Button href="#rsvp" tone="olive">
                    RSVP
                </Button>
            </div>
        </section>
    );
}
