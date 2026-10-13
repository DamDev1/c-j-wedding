"use client";

import { useEffect, useRef, type CSSProperties, type ReactNode } from "react";

type RevealProps = {
  children: ReactNode;
  className?: string;
  /** Stagger delay in ms. */
  delay?: number;
  /** up = rise 28px, arch = rise 72px + scale in, slide = rise 150px, fade = opacity only */
  variant?: "up" | "arch" | "slide" | "fade";
};

/**
 * Fades its children in the first time they scroll into view.
 * The hidden state lives in globals.css and only applies when JS is on and
 * the visitor hasn't asked for reduced motion, so content is never lost.
 */
export function Reveal({
  children,
  className,
  delay = 0,
  variant = "up",
}: RevealProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add("is-in");
          io.disconnect();
        }
      },
      { threshold: 0.15, rootMargin: "0px 0px -6% 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      data-reveal={variant}
      style={{ "--d": `${delay}ms` } as CSSProperties}
      className={className}
    >
      {children}
    </div>
  );
}
