import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Nav from "./components/Nav";
import "./globals.css";

const geist = Geist({
  subsets: ["latin"],
  display: "swap",
  preload: true,
  variable: "--font-geist",
});

const geistMono = Geist_Mono({
  subsets: ["latin"],
  display: "swap",
  preload: true, // nav is above the fold
  variable: "--font-geist-mono",
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
    <html lang="en" className={`${geist.variable} ${geistMono.variable}`}>
      <body>
        <Nav />
        <main>{children}</main>
      </body>
    </html>
  );
}
