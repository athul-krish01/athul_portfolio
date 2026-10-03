import type { Metadata } from "next";
import { Geist, Geist_Mono, Inter } from "next/font/google";
import { site } from "@/data/site";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// Inter is loaded only for the temporary footer wordmark (SiteFooter),
// matching the one place in the source file where the typeface changes
// from Geist. Remove this once SiteFooter is replaced by the React Bits
// component.
const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

// TODO: confirm final copy — see data/site.ts for the source values.
export const metadata: Metadata = {
  title: site.title,
  description: site.description,
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${inter.variable} h-full antialiased`}
    >
      {/* `font-sans` resolves to the Geist variable via the --font-sans
          token in globals.css — previously this fell back to a hardcoded
          Arial stack and never applied the loaded Geist font. */}
      <body className="min-h-full flex flex-col font-sans">{children}</body>
    </html>
  );
}
