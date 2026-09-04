import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Luxe Estate — Discover Premium Real Estate",
  description: "Find your sanctuary. Curated properties and luxury homes for the discerning eye.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="bg-background-light text-nordic-dark min-h-screen selection:bg-mosque selection:text-white flex flex-col">
        {children}
      </body>
    </html>
  );
}
