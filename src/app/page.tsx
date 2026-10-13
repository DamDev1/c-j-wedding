import { DressCode } from "@/components/DressCode";
import { Hero } from "@/components/Hero";
import { TheDay } from "@/components/TheDay";
import { Venue } from "@/components/Venue";
import { Welcome } from "@/components/Welcome";

export default function Home() {
  return (
    <main>
      <Hero />
      <Welcome />
      <TheDay />
      <Venue />
      <DressCode />
      {/* Still to build from Figma: Programme, RSVP form (ids #programme, #rsvp) */}
    </main>
  );
}
