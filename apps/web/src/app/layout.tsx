import type { Metadata, Viewport } from "next";
import { Inter, Calistoga } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const calistoga = Calistoga({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-calistoga",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Univibes — The Hub of Student Life",
    template: "%s | Univibes",
  },
  description:
    "Découvre, partage et rejoins tous les événements universitaires de ta ville. La plateforme de référence pour la vie étudiante au Bénin.",
  keywords: [
    "événements",
    "étudiants",
    "université",
    "Bénin",
    "campus",
  ],
  authors: [{ name: "Univibes" }],
  openGraph: {
    type: "website",
    locale: "fr_FR",
    url: "https://univibes.com",
    siteName: "Univibes",
    title: "Univibes — The Hub of Student Life",
    description: "Découvre tous les événements universitaires de ta ville.",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#0F5132" },
    { media: "(prefers-color-scheme: dark)", color: "#0D3323" },
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr" suppressHydrationWarning className={`${inter.variable} ${calistoga.variable}`}>
      <body className="min-h-dvh flex flex-col antialiased">
        {children}
      </body>
    </html>
  );
}
