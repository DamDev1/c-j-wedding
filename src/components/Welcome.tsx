import { FloralFrame } from "./Decoration";
import { Reveal } from "./Reveal";

// Photos live in /public/images (see README).
const photos = [
  { src: "/images/gallery-1.jpg", alt: "Chioma and John, laughing together" },
  { src: "/images/gallery-2.jpg", alt: "Chioma and John, side by side" },
  { src: "/images/gallery-3.jpg", alt: "Chioma and John, in a quiet moment" },
];

export function Welcome() {
  return (
    <section
      id="welcome"
      className="relative overflow-hidden bg-cream py-20 md:py-[125px]"
    >
      <FloralFrame />

      <div className="relative mx-auto flex max-w-[1091px] flex-col items-center gap-8 px-6 md:px-0">
        <Reveal className="flex max-w-[693px] flex-col items-center gap-2 text-center text-olive">
          <h2 className="font-display text-[clamp(34px,6vw,48px)] leading-[1.25] font-bold">
            We&apos;re getting married
          </h2>
          <p className="text-xl leading-normal font-medium md:text-2xl">
            and we would love you to be there. Everything you need for the day is
            below.
          </p>
        </Reveal>

        {/* Mobile: swipeable row. md+: three arches spread across the width. */}
        <div className="-mx-6 flex w-[calc(100%+3rem)] snap-x snap-mandatory gap-5 overflow-x-auto px-6 pb-2 md:mx-0 md:w-full md:snap-none md:justify-between md:overflow-visible md:px-0 md:pb-0 [&::-webkit-scrollbar]:hidden">
          {photos.map((photo, i) => (
            <Reveal
              key={photo.src}
              variant="arch"
              delay={i * 140}
              className="w-[min(78vw,313px)] shrink-0 snap-center md:w-[313px]"
            >
              <div
                role="img"
                aria-label={photo.alt}
                className="h-[479px] w-full rounded-t-[300px] border-6 border-gold bg-blush-bg bg-cover bg-center"
                style={{ backgroundImage: `url(${photo.src})` }}
              />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
