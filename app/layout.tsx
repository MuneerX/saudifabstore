import type { Metadata, Viewport } from "next";
import { Archivo, Archivo_Narrow, Geist_Mono, Sacramento, Great_Vibes, Herr_Von_Muellerhoff } from "next/font/google";
import "./globals.css";
import { Providers } from "./Providers";
import { SmoothScroll } from "@/components/SmoothScroll";

const archivo = Archivo({
  variable: "--font-archivo",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
  display: "swap",
});

const archivoNarrow = Archivo_Narrow({
  variable: "--font-archivo-narrow",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const sacramento = Sacramento({
  variable: "--font-sacramento",
  subsets: ["latin"],
  weight: ["400"],
  display: "swap",
});

const greatVibes = Great_Vibes({
  variable: "--font-great-vibes",
  subsets: ["latin"],
  weight: ["400"],
  display: "swap",
});

const herrVonMuellerhoff = Herr_Von_Muellerhoff({
  variable: "--font-herr-von-muellerhoff",
  subsets: ["latin"],
  weight: ["400"],
  display: "swap",
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
  themeColor: "#EB5521",
};

export const metadata: Metadata = {
  title: {
    default: "Saudi Fab Store Co. LLC | Steel Fabrication & Industrial Equipment KSA",
    template: "%s | Saudi Fab Store Co. LLC",
  },
  description: "Leading structural steel fabrication, industrial equipment, surface sandblasting, and SASO & ISO certified engineering solutions in Dammam and Eastern Province, Saudi Arabia.",
  keywords: [
    "Saudi Fab Store",
    "Saudi Fab",
    "Steel Fabrication Saudi Arabia",
    "Industrial Equipment Dammam",
    "SASO Certified Steel",
    "ISO 9001 Quality Control",
    "Abrasive Sandblasting KSA",
    "Material Handling Skips",
  ],
  authors: [{ name: "Saudi Fab Store Co. LLC" }],
  icons: {
    icon: [
      { url: "/favicon/favicon.ico" },
      { url: "/favicon/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon/favicon-32x32.png", sizes: "32x32", type: "image/png" },
    ],
    shortcut: "/favicon/favicon.ico",
    apple: [
      { url: "/favicon/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
    other: [
      {
        rel: "android-chrome-192x192",
        url: "/favicon/android-chrome-192x192.png",
      },
      {
        rel: "android-chrome-512x512",
        url: "/favicon/android-chrome-512x512.png",
      },
    ],
  },
  manifest: "/favicon/site.webmanifest",
  openGraph: {
    title: "Saudi Fab Store Co. LLC | Steel Fabrication & Industrial Solutions",
    description: "Leading structural steel fabrication, industrial equipment, and SASO & ISO certified solutions in KSA.",
    url: "https://saudifabstore.com",
    siteName: "Saudi Fab Store",
    images: [
      {
        url: "/images/logo.png",
        width: 800,
        height: 600,
        alt: "Saudi Fab Store Co. LLC",
      },
    ],
    locale: "en_US",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${archivo.variable} ${archivoNarrow.variable} ${geistMono.variable} ${sacramento.variable} ${greatVibes.variable} ${herrVonMuellerhoff.variable} antialiased`}
        style={{
          fontFamily: 'var(--font-archivo), "Archivo", sans-serif',
        }}
      >
        <SmoothScroll>
          <Providers>{children}</Providers>
        </SmoothScroll>
      </body>
    </html>
  );
}
