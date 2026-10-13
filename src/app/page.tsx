import { DressCode } from "@/components/DressCode";
import { End } from "@/components/End";
import { Hero } from "@/components/Hero";
import { Letter } from "@/components/Letter";
import { Outfit } from "@/components/outfit";
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
      <Outfit />
      <Letter />
      <End />
    </main>
  );
}
