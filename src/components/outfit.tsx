import { Reveal } from "./Reveal";

export function Outfit() {
    return (
        <section id="outfit" className="bg-cream">
            <div className="grid grid-cols-1 md:grid-cols-2">
                {/* Gentlemen */}
                <Reveal variant="slide">
                    <div className="relative flex min-h-[500px] flex-col justify-between overflow-hidden bg-blush-bg md:min-h-[580px]">
                        <div className="flex flex-col gap-2 p-8 md:p-12">
                            <h2 className="font-display text-[clamp(40px,6vw,56px)] leading-[1.25] font-bold text-olive">
                                Gentlemen
                            </h2>
                            <p className="text-lg leading-normal text-olive md:text-xl">
                                Black or dark grey suit
                            </p>
                        </div>
                        <div
                            className="mt-auto flex items-end justify-center"
                            aria-hidden
                        >
                            <img
                                src="/images/man.svg"
                                alt=""
                                className="h-auto w-[70%] max-w-[400px] object-contain"
                            />
                        </div>
                    </div>
                </Reveal>

                <Reveal variant="slide" delay={400}>
                    <div className="relative flex min-h-[500px] flex-col justify-between overflow-hidden bg-olive md:min-h-[590px]">
                        <div
                            className="flex items-start justify-end"
                            aria-hidden
                        >
                            <img
                                src="/images/woman.svg"
                                alt=""
                                className="h-auto w-[85%] max-w-[620px] object-cover"
                            />
                        </div>
                        <div className="flex absolute bottom-0 flex-col gap-2 p-8 md:p-12">
                            <h2 className="font-display text-[clamp(40px,6vw,56px)] leading-[1.25] font-bold text-cream">
                                Ladies
                            </h2>
                            <p className="text-lg leading-normal text-cream md:text-xl">
                                A gown in any of the colours of the day
                            </p>
                        </div>
                    </div>
                </Reveal>
            </div>
        </section>
    );
}
