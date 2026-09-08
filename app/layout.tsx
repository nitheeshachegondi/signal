import type { Metadata } from "next";
import { Anton, Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";

// Anton — heavy, condensed, impact display font. Matches the bold
// agency-headline look (like the FORME reference).
const anton = Anton({ variable: "--font-anton", subsets: ["latin"], weight: "400" });

// Inter — clean, versatile body copy.
const inter = Inter({ variable: "--font-inter", subsets: ["latin"], weight: ["400", "500", "600"] });

// JetBrains Mono — for eyebrow labels, indices, mono-styled bits.
const jbMono = JetBrains_Mono({ variable: "--font-jbmono", subsets: ["latin"], weight: ["400", "500"] });

export const metadata: Metadata = {
  title: "Signal — AI Visibility & Content",
  description: "See where your brand stands with search and AI platforms, then create content sharp enough to earn the spot.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${anton.variable} ${inter.variable} ${jbMono.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}