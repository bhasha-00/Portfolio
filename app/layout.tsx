import type { Metadata, Viewport } from "next";
import { Geist, Caveat } from "next/font/google";
import Nav from "./components/Nav";
import Backdrop from "./components/Backdrop";
import Intro from "./components/intro/Intro";
import dynamic from "next/dynamic";

// Dev-only grid overlay (press G). The import sits in a branch the production build removes,
// so none of its code ships.
const GridOverlay =
  process.env.NODE_ENV === "development" ? dynamic(() => import("./components/GridOverlay")) : () => null;
import "./tokens.css";
import "./globals.css";

// Exactly two families (tokens.css): Geist and one hand font.
const geist = Geist({
  subsets: ["latin"],
  display: "swap",
  preload: true,
  variable: "--nf-geist",
});

const hand = Caveat({
  subsets: ["latin"],
  display: "swap",
  preload: false, // chips and eyebrows only, never the hero headline
  variable: "--nf-hand",
});

export const metadata: Metadata = {
  title: "Bhasha Maheshwari, Product Designer",
  description: "Product and UX/UI designer for enterprise fintech.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#A82A1E",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${geist.variable} ${hand.variable}`} suppressHydrationWarning>
      <head>
        {/* Blocking on purpose (tiny, cached): decides before first paint whether the intro plays. */}
        {/* eslint-disable-next-line @next/next/no-sync-scripts */}
        <script src="/intro-gate.js" />
      </head>
      <body>
        <Backdrop />
        <Intro />
        <Nav />
        <main>{children}</main>
        {/* Press G: column grid + 4px baseline. Development only, never in the production bundle. */}
        <GridOverlay />
      </body>
    </html>
  );
}
