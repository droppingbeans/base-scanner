import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Base Scanner - Real-time Contract Discovery",
  description: "Discover new tokens, NFTs, and smart contracts on Base network in real-time. Agent-friendly API for automated discovery.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
