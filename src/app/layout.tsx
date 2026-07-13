import type { Metadata } from "next";
import { Fraunces, IBM_Plex_Sans, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";
import { CookieConsent } from "@/components/CookieConsent";

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  style: ["normal"],
  display: "swap",
});

const ibmPlexSans = IBM_Plex_Sans({
  variable: "--font-ibm-plex-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: "swap",
});

const ibmPlexMono = IBM_Plex_Mono({
  variable: "--font-ibm-plex-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
  display: "swap",
});

const TITLE = "Sellium — Tu huella de carbono, lista en un día";
const DESCRIPTION =
  "Sube tus facturas de luz, gas o combustible y genera un informe de huella de carbono listo para tu cliente, con los factores oficiales del MITECO. Gratis durante la beta.";

export const metadata: Metadata = {
  metadataBase: new URL("https://sellium.eu"),
  title: {
    default: TITLE,
    template: "%s · Sellium",
  },
  description: DESCRIPTION,
  openGraph: {
    type: "website",
    locale: "es_ES",
    url: "/",
    siteName: "Sellium",
    title: TITLE,
    description: DESCRIPTION,
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
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
      className={`${fraunces.variable} ${ibmPlexSans.variable} ${ibmPlexMono.variable}`}
    >
      <body className="bg-ink text-ink-text antialiased">
        {children}
        <CookieConsent />
      </body>
    </html>
  );
}
