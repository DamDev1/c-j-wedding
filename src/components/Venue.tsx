import { Button } from "./Button";
import { FloralBottom } from "./Decoration";
import { Reveal } from "./Reveal";

const DIRECTIONS_URL =
  "https://www.google.com/maps/search/?api=1&query=The+Nest+Gardens+Guzape+Hills+Abuja";

export function Venue() {
  return (
    <section
      id="venue"
      className="relative flex items-start justify-center overflow-hidden bg-blush-bg px-6 pt-20 pb-40 md:min-h-[800px] md:pt-[62px] md:pb-0"
    >
      <FloralBottom />

      <div className="relative flex w-full max-w-[863px] flex-col items-center gap-10 md:w-auto md:max-w-none md:flex-row md:gap-11">
        <Reveal className="flex w-full flex-col items-start justify-center gap-4 md:h-[284px] md:w-[289px]">
          <div className="flex flex-col gap-1 text-olive md:whitespace-nowrap">
            <h2 className="font-display text-[clamp(48px,8vw,72px)] leading-[1.5] font-bold">
              The venue
            </h2>
            <p className="text-[clamp(24px,3.4vw,32px)] leading-[1.5]">
              The Nest Gardens
              <br />
              Guzape Hills, Abuja
            </p>
          </div>
          <Button
            href={DIRECTIONS_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="h-12"
          >
            Get Directions
          </Button>
        </Reveal>

        <Reveal variant="fade" delay={150} className="w-full md:w-[530px]">
          <div
            role="img"
            aria-label="The glasshouse at The Nest Gardens"
            className="aspect-[530/585] w-full bg-white/50 bg-cover bg-center"
            style={{ backgroundImage: "url(/images/venue.jpg)" }}
          />
        </Reveal>
      </div>
    </section>
  );
}
