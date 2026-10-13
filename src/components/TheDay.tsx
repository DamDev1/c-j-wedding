import { Button } from "./Button";
import { FloralBottom } from "./Decoration";
import { Reveal } from "./Reveal";

const events = [
  { time: "3:00 PM", title: "The Joining Ceremony", place: "The Nest Gardens" },
  { time: "5:30 PM", title: "The Evening Celebration", place: "The Nest Gardens" },
];

export function TheDay() {
  return (
    <section
      id="the-day"
      className="relative flex items-center justify-center overflow-hidden bg-olive px-6 pt-20 pb-40 md:min-h-[800px] md:pt-[86px] md:pb-[166px]"
    >
      <FloralBottom tone="gold" />

      <div className="relative flex w-full max-w-[1078px] flex-col items-center gap-10 md:gap-12">
        <Reveal>
          <h2 className="font-display text-[clamp(48px,8vw,72px)] leading-[1.5] font-bold text-white">
            The day
          </h2>
        </Reveal>

        <div className="grid w-full grid-cols-1 gap-5 md:grid-cols-2">
          {events.map((event, i) => (
            <Reveal key={event.time} delay={i * 150}>
              <div className="flex min-h-[296px] flex-col items-center justify-center gap-4 border-2 border-blush px-6 py-8 text-center text-blush">
                <p className="font-display text-[clamp(48px,8vw,72px)] leading-[1.5] font-bold">
                  {event.time}
                </p>
                <div className="flex flex-col items-center gap-2">
                  <p className="text-[clamp(24px,3.4vw,32px)] leading-[1.5]">
                    {event.title}
                  </p>
                  <p className="text-xl leading-normal md:text-2xl">
                    {event.place}
                  </p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal delay={300}>
          {/* Points at the programme section/page, which isn't built yet */}
          <Button href="#programme" tone="white">
            View the programme
          </Button>
        </Reveal>
      </div>
    </section>
  );
}
