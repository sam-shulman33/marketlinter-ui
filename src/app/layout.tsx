import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import { MotionConfig } from "motion/react";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "MarketLinter - Stop building products nobody wants",
  description:
    "Validate your startup idea in minutes. Scan real conversations to see if people actually have the problem you're solving.",
  openGraph: {
    title: "MarketLinter - Stop building products nobody wants",
    description:
      "Market research that runs like a linter. Validate your idea before you build.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body
        className={`${inter.variable} ${jetbrainsMono.variable} antialiased`}
      >
        <MotionConfig reducedMotion="user">{children}</MotionConfig>
      </body>
    </html>
  );
}
