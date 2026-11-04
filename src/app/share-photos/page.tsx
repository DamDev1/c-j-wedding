import type { Metadata } from "next";
import Link from "next/link";
import { FloralFrame } from "@/components/Decoration";
import { PhotoUploader } from "./PhotoUploader";


export const metadata: Metadata = {
  title: "Share Your Photos | Chioma & John",
  description:
    "Capture the day and share your photos with John and Chioma. Upload up to 10 photos at a time.",
};

/* Inline camera SVG — avoids the emoji "E" glyph issue across platforms */
function CameraIcon() {
  return (
    <svg
      width="36"
      height="36"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className="inline-block align-middle text-gold"
    >
      <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
      <circle cx="12" cy="13" r="4" />
    </svg>
  );
}

export default function SharePhotosPage() {
  return (
    <div className="relative min-h-screen bg-cream">
      {/* ---- Site header ---- */}
      <header className="relative z-30">
        <div className="mx-auto flex max-w-[1440px] items-center justify-between px-6 py-6 md:px-16">
          <Link
            href="/"
            className="font-script text-[40px] leading-[72px] text-olive md:text-5xl"
            aria-label="C and J, back to home"
          >
            C&amp;J
          </Link>
          <nav className="flex items-center gap-4 md:gap-6">
            <Link
              href="/program"
              className="text-lg leading-normal font-medium text-olive md:text-xl"
            >
              Programme
            </Link>
            <Link
              href="/#rsvp"
              className="inline-flex items-center justify-center whitespace-nowrap rounded-[30px] bg-olive px-8 py-3 text-base leading-6 font-semibold text-white transition duration-300 hover:-translate-y-0.5 hover:shadow-lg"
            >
              RSVP
            </Link>
          </nav>
        </div>
      </header>

      {/* ---- Floral side decorations ---- */}
      <FloralFrame />

      {/* ---- Centred card ---- */}
      <main className="relative z-10 flex min-h-[calc(100vh-80px)] items-center justify-center px-6 py-16">
        <div
          className="w-full max-w-[580px] border-[1.5px] border-gold px-8 py-14 text-center sm:px-14 sm:py-20"
          style={{
            background:
              "linear-gradient(to bottom, rgba(255,252,247,.92), rgba(255,252,247,.96))",
          }}
        >
          {/* Flower emblem */}
          <img
            src="/images/flower-emblem.png"
            alt=""
            aria-hidden="true"
            className="mx-auto mb-4 w-12 opacity-80"
          />

          {/* Divider line */}
          <div className="mx-auto mb-6 flex w-32 items-center gap-2">
            <span className="h-px flex-1 bg-gold/40" />
            <img
              src="/images/flower-divider.png"
              alt=""
              aria-hidden="true"
              className="w-8 opacity-70"
            />
            <span className="h-px flex-1 bg-gold/40" />
          </div>

          {/* Heading */}
          <h1 className="font-display text-[clamp(28px,5vw,40px)] leading-[1.3] font-medium text-olive italic">
            Take photos
            of us
          </h1>

          {/* Subtitle */}
          <p className="mx-auto mt-3 max-w-sm text-[clamp(14px,2vw,17px)] leading-relaxed text-olive/80 italic">
            Capture the day and share your photos with John and Chioma.
          </p>

          {/* Upload component */}
          <PhotoUploader />

          {/* Instruction */}
          <p className="mt-6 text-sm text-olive/60 italic">
            Select up to 10 photos at a time. JPEG, PNG, WebP, or HEIC.
          </p>
        </div>
      </main>
    </div>
  );
}
