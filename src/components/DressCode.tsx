import { Reveal } from "./Reveal";

// bottom offsets are from the Figma label positions
const swatches = [
  { name: "White", bg: "bg-white", ink: "text-ink", bottom: 12, left: 13 },
  { name: "Blush Pink", bg: "bg-blush", ink: "text-rose-ink", bottom: 14, left: 21 },
  { name: "Olive Green", bg: "bg-olive", ink: "text-lime", bottom: 5, left: 14 },
  { name: "Champagne Gold", bg: "bg-gold", ink: "text-champagne", bottom: 5, left: 14 },
];

export function DressCode() {
  return (
    <section id="dress-code" className="bg-cream py-20 md:py-[134px]">
      <div className="mx-auto flex max-w-[1440px] flex-col gap-8 px-6 md:px-16">
        <Reveal className="flex flex-col gap-1 text-olive">
          <h2 className="font-display text-[clamp(48px,8vw,72px)] leading-[1.5] font-bold">
            Dress code
          </h2>
          <p className="text-2xl leading-normal md:text-[32px] md:leading-[1.5]">
            Colours of the day
          </p>
        </Reveal>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {swatches.map((swatch, i) => (
            <Reveal key={swatch.name} delay={i * 110}>
              <div
                className={`relative h-[267px] overflow-hidden border-6 border-olive ${swatch.bg}`}
              >
                <p
                  className={`absolute text-[clamp(30px,4vw,40px)] leading-[1.5] font-medium whitespace-nowrap ${swatch.ink}`}
                  style={{ bottom: swatch.bottom, left: swatch.left }}
                >
                  {swatch.name}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
