"use client";

import { useEffect, useRef } from "react";
import { Button } from "./Button";
import { useRouter } from "next/navigation";

const clamp01 = (n: number) => Math.min(1, Math.max(0, n));
const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);

export function Hero() {
  const wrapRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const router = useRouter()

  useEffect(() => {
    const wrap = wrapRef.current;
    const stage = stageRef.current;
    if (!wrap || !stage) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
    let raf = 0;

    const apply = (p: number) => {
      const e = easeOutCubic(clamp01(p / 0.8)); // fully open at 80% of the pin
      const t1 = clamp01((p - 0.35) / 0.25);
      const t2 = clamp01((p - 0.5) / 0.25);
      const t3 = clamp01((p - 0.62) / 0.25);

      stage.style.setProperty("--e", e.toFixed(4));
      stage.style.setProperty("--t1", t1.toFixed(4));
      stage.style.setProperty("--t2", t2.toFixed(4));
      stage.style.setProperty("--t3", t3.toFixed(4));
      stage.dataset.open = e > 0.6 ? "true" : "false";
      stage.dataset.cta = t3 > 0.02 ? "on" : "off";
    };

    const update = () => {
      raf = 0;
      if (reduce.matches) {
        apply(1);
        return;
      }
      const total = wrap.offsetHeight - window.innerHeight;
      const p = total > 0 ? clamp01(-wrap.getBoundingClientRect().top / total) : 0;
      apply(p);
    };

    const schedule = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    reduce.addEventListener("change", schedule);

    return () => {
      if (raf) cancelAnimationFrame(raf);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      reduce.removeEventListener("change", schedule);
    };
  }, []);

  return (
    <section
      ref={wrapRef}
      id="top"
      aria-label="Chioma and John"
      className="hero-wrap relative h-[240svh]"
    >
      <div
        ref={stageRef}
        data-open="false"
        data-cta="off"
        className="hero-stage sticky top-0 h-svh overflow-hidden bg-cream"
      >
        {/* Header */}
        <header className="absolute inset-x-0 top-0 z-30">
          <div className="mx-auto flex max-w-[1440px] items-center justify-between px-6 py-6 md:px-16">
            <a
              href="#top"
              className="hero-fg font-script text-[40px] leading-[72px] text-olive md:text-5xl"
              aria-label="C and J, back to top"
            >
              C&amp;J
            </a>
            <nav className="flex items-center gap-4 md:gap-6">
              <a
                href="#the-day"
                className="hero-fg text-lg leading-normal font-medium text-olive md:text-xl"
              >
                Programme
              </a>
              {/* <Button className="hero-btn" onClick={() => router.push("/rsvp")}>
                RSVP
              </Button> */}
            </nav>
          </div>
        </header>

        <div className="hero-photo absolute inset-0 z-10" aria-hidden>
          <div
            className="hero-photo-img absolute inset-0 bg-cover bg-no-repeat"
            style={{
              backgroundImage:
                "url(/images/hero.jpg), linear-gradient(160deg, #1c4a5a 0%, #5b4a2e 55%, #a1623a 100%)",
              backgroundPosition: "50% 34.8%",
            }}
          />
          <div className="hero-veil absolute inset-0 bg-black" />
        </div>

        <div className="absolute top-[calc(50%+18px)] left-1/2 z-20 flex w-[min(515px,90vw)] -translate-x-1/2 -translate-y-1/2 flex-col items-center gap-6 text-center text-white">
          <div className="flex flex-col items-center gap-3">
            <div className="hero-t1 text-base leading-[1.5] font-semibold sm:text-xl sm:whitespace-nowrap">
              <p>The families of Okorie &amp; Oladimeji joyfully invite you to</p>
              <p>the evening celebration of their children</p>
            </div>

            <h1 className="font-script text-[clamp(44px,14vw,96px)] leading-[1.3555] whitespace-nowrap">
              Chioma&amp;John
            </h1>

            <div className="hero-t2 flex flex-col gap-2 text-lg leading-normal font-semibold sm:text-2xl">
              <p>Friday 6 November 2026</p>
              <p>The Nest Gardens, Guzape Hills, Abuja</p>
            </div>
          </div>

          <div className="hero-t3">
            <Button href="#rsvp">RSVP</Button>
          </div>
        </div>

        <div
          aria-hidden
          className="hero-cue absolute bottom-6 left-1/2 z-20 flex -translate-x-1/2 flex-col items-center gap-3 text-[11px] tracking-[0.3em] text-olive uppercase"
        >
          Scroll
          <span className="hero-cue-line relative block h-8 w-px overflow-hidden bg-olive/25" />
        </div>
      </div>
    </section>
  );
}
