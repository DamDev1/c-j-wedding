import type { Metadata, Viewport } from "next";

// Fonts are self-hosted from npm (no Google Fonts request at build time).
import "@fontsource/pinyon-script/400.css";
import "@fontsource/eb-garamond/400.css";
import "@fontsource/eb-garamond/500.css";
import "@fontsource/eb-garamond/600.css";
import "@fontsource/cormorant-garamond/700.css";

import "./globals.css";

export const metadata: Metadata = {
  title: "Chioma & John | 6 November 2026",
  description:
    "The families of Okorie & Oladimeji joyfully invite you to the evening celebration of their children. The Nest Gardens, Guzape Hills, Abuja.",
};

export const viewport: Viewport = {
  themeColor: "#fffcf7",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
