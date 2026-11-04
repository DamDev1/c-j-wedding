import type { Metadata } from "next";
import { GalleryClient } from "./GalleryClient";


export const metadata: Metadata = {
  title: "Photo Gallery (Admin) | Chioma & John",
  description: "Admin gallery — view and manage guest photos.",
};

export default function GalleryPage() {
  return <GalleryClient />;
}
