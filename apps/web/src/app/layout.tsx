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
    default: "UnivVibes — The Hub of Student Life",
    template: "%s | UnivVibes",
  },
  description:
    "Découvre, partage et rejoins tous les événements universitaires de ta ville. La plateforme de référence pour la vie étudiante au Bénin.",
  keywords: [
    "événements universitaires",
    "étudiants",
    "Bénin",
    "campus",
    "vie étudiante",
    "billetterie",
    "soirées étudiantes",
  ],
  authors: [{ name: "UnivVibes" }],
  creator: "UnivVibes",
  publisher: "UnivVibes",
  alternates: {
    canonical: "https://univibes.com",
    languages: {
      "fr-FR": "https://univibes.com/fr",
      "en-US": "https://univibes.com/en",
    },
  },
  openGraph: {
    type: "website",
    locale: "fr_FR",
    url: "https://univibes.com",
    siteName: "UnivVibes",
    title: "UnivVibes — Le Hub de la Vie Étudiante",
    description: "Découvre, partage et rejoins tous les événements universitaires de ta ville.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "UnivVibes — Plateforme événementielle étudiante",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@univibes",
    title: "UnivVibes — Le Hub de la Vie Étudiante",
    description: "Découvre, partage et rejoins les événements de ton campus.",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#7c3aed" },
    { media: "(prefers-color-scheme: dark)", color: "#c084fc" },
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr" suppressHydrationWarning className={`${inter.variable} ${calistoga.variable}`}>
      <head>
        {/* Preconnect to external origins for performance */}
        <link rel="preconnect" href="https://picsum.photos" />
        <link rel="dns-prefetch" href="https://picsum.photos" />
        {/* Preload the hero image for LCP optimization */}
      </head>
      <body className="min-h-dvh flex flex-col antialiased">
        {children}
      </body>
    </html>
  );
}
