import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { SiteNav } from "@/components/site/site-nav";
import { PrivateUnlock } from "@/components/site/private-unlock";
import { getSiteUrl } from "@/lib/site-url";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(getSiteUrl()),
  title: {
    default: "José Raúl Soriano — Legado digital",
    template: "%s — José Raúl Soriano",
  },
  description:
    "El legado digital de José Raúl Soriano: recuerdos, proyectos, eventos y viajes.",
  alternates: {
    types: {
      "application/rss+xml": [
        { url: `${getSiteUrl()}/feed.xml`, title: "Escritos y recuerdos" },
      ],
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="crt min-h-full flex flex-col bg-black text-white">
        <SiteNav />
        <PrivateUnlock />
        <main className="flex-1 pb-20 md:pb-24">{children}</main>
      </body>
    </html>
  );
}
