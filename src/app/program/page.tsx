import type { Metadata } from "next";
import { ProgramClient } from "./ProgramClient";

export const metadata: Metadata = {
  title: "Wedding Programme | Chioma & John",
  description:
    "Order of holy matrimony service and wedding programme for Chioma & John on 6 November 2026 at The Nest Gardens, Guzape Hills, Abuja.",
};

export default function ProgramPage() {
  return <ProgramClient />;
}
