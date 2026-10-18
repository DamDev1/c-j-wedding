"use client";

import { Button } from "./Button";
import { Reveal } from "./Reveal";
import { useRouter } from "next/navigation";

export function HeroTwo() {
  const router = useRouter();

  return (
    <section
      id="top"
      aria-label="Chioma and John"
      className="relative h-svh min-h-[640px] overflow-hidden bg-cream"
    >
      {/* Header */}
      <header className="absolute inset-x-0 top-0 z-30">
        <div className="mx-auto flex max-w-[1440px] items-center justify-between px-6 py-6 md:px-16">
          <a
            href="#top"
            className="font-script text-[40px] leading-[72px] text-white md:text-5xl"
            aria-label="C and J, back to top"
          >
            C&amp;J
          </a>
          <nav className="flex items-center gap-4 md:gap-6">
            <a
              href="#the-day"
              className="text-lg leading-normal font-medium text-white md:text-xl"
            >
              Programme
            </a>
            <Button
              tone="white"
              className="!text-olive hover:bg-white/90"
              onClick={() => router.push("/rsvp")}
            >
              RSVP
            </Button>
          </nav>
        </div>
      </header>

      {/* Background Photo & Dark Veil */}
      <div className="absolute inset-0 z-10" aria-hidden>
        <div
          className="absolute inset-0 bg-cover bg-no-repeat"
          style={{
            backgroundImage:
              "url(/images/hero.jpg), linear-gradient(160deg, #1c4a5a 0%, #5b4a2e 55%, #a1623a 100%)",
            backgroundPosition: "50% 34.8%",
          }}
        />
        <div className="absolute inset-0 bg-black/50" />
      </div>

      {/* Invitation Copy & CTA with Staggered Text Transitions */}
      <div className="absolute top-[calc(50%+18px)] left-1/2 z-20 flex w-[min(515px,90vw)] -translate-x-1/2 -translate-y-1/2 flex-col items-center gap-6 text-center text-white">
        <div className="flex flex-col items-center gap-3">
          <Reveal delay={200}>
            <div className="text-base leading-[1.5] font-semibold sm:text-xl sm:whitespace-nowrap">
              <p>The families of Okorie &amp; Oladimeji joyfully invite you to</p>
              <p>the celebration of the joining of their children in marriage</p>
            </div>
          </Reveal>

          <Reveal delay={400}>
            <h1 className="font-script text-[clamp(44px,14vw,96px)] leading-[1.3555] whitespace-nowrap">
              Chioma&amp;John
            </h1>
          </Reveal>

          <Reveal delay={600}>
            <div className="flex flex-col gap-2 text-lg leading-normal font-semibold sm:text-2xl">
              <p>Friday 6 November 2026</p>
              <p>The Nest Gardens, Guzape Hills, Abuja</p>
            </div>
          </Reveal>
        </div>

        <Reveal delay={800}>
          <div>
            <Button
              href="#rsvp"
              onClick={() => router.push("/rsvp")}
            >
              RSVP
            </Button>
          </div>
        </Reveal>
      </div>

      {/* Scroll cue with enhanced visibility */}
      <div
        aria-hidden
        className="absolute bottom-6 left-1/2 z-20 flex -translate-x-1/2 flex-col items-center gap-2.5 text-[11px] font-medium tracking-[0.3em] text-white/90 uppercase"
      >
        <Reveal variant="fade" delay={1000} className="flex flex-col items-center gap-2.5">
          <span>Scroll</span>
          <span className="relative block h-9 w-[2px] rounded-full bg-white/85 shadow-[0_0_8px_rgba(255,255,255,0.4)]" />
        </Reveal>
      </div>
    </section>
  );
}

export default HeroTwo;
