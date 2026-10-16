import { Button } from "./Button";
import { FloralBottom } from "./Decoration";
import { Reveal } from "./Reveal";

export function End() {
    return (
        <section
            id="rsvp"
            className="relative flex min-h-[700px] flex-col items-center justify-center overflow-hidden "
        >
            {/* Background photo */}
            <div
                className="absolute inset-0 bg-cover bg-top md:min-h-[800px]"
                style={{ backgroundImage: "url(/images/gallery-4.jpg)" }}
            />

            {/* Dark olive overlay */}
            <div className="absolute inset-0 bg-olive/70" />

            {/* Floral decoration at bottom */}
            <FloralBottom />

            {/* Content */}
            <div className="relative z-10 flex flex-col items-center gap-6 px-6 text-center">
                <Reveal>
                    <h2 className="font-display text-[clamp(40px,8vw,64px)] leading-[1.25] font-bold text-white italic">
                        Will you join us?
                    </h2>
                </Reveal>

                <Reveal delay={150}>
                    <p className="text-xl leading-normal text-white/90 md:text-2xl">
                        Kindly respond by [RSVP deadline].
                    </p>
                </Reveal>

                <Reveal delay={300}>
                    <Button href="#programme" tone="white">
                        View the programme
                    </Button>
                </Reveal>

                <Reveal delay={450}>
                    <p className="mt-8 font-script text-[clamp(120px,28vw,260px)] leading-none text-white/80 md:mt-12">
                        C &amp; J
                    </p>
                </Reveal>
            </div>
        </section>
    );
}
