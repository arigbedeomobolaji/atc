import type { Metadata } from "next";
import { Inter, Manrope, Oswald, Open_Sans } from "next/font/google";
import { Toaster } from "sonner";
import "./globals.css";

const oswald = Oswald({
  weight: ["400", "700"],
  subsets: ["latin"],
  variable: "--font-oswald",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const openSans = Open_Sans({
  weight: ["300", "400", "600", "700"],
  subsets: ["latin"],
  variable: "--font-opensans",
  display: "swap",
});

const manrope = Manrope({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-manrope",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Air Training Command Kaduna | Nigerian Air Force",
  description:
    "Official website of the Nigerian Air Force Air Training Command (ATC), Kaduna. Explore flying schools, training groups, engineering units, support services, and operational capabilities across ATC formations.",
  keywords: [
    "Air Training Command",
    "ATC Kaduna",
    "Nigerian Air Force",
    "NAF Training",
    "Flying Training School",
    "NAF Kaduna",
    "Nigerian Air Force Schools",
    "NAF Units",
    "Aviation Training Nigeria",
    "Military Aviation Nigeria",
  ],
  openGraph: {
    title: "Air Training Command Kaduna | Nigerian Air Force",
    description:
      "Learn about Air Training Command Kaduna, its flying schools, specialized training groups, engineering units, and operational support within the Nigerian Air Force.",
    url: "https://atc.mil.ng", // <-- I'll Update with my real domain later
    siteName: "Nigerian Air Force – Air Training Command",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Air Training Command Kaduna | Nigerian Air Force",
    description:
      "Discover the structure, roles, and units of Air Training Command (ATC) Kaduna, a key component of the Nigerian Air Force training framework.",
  },
  alternates: {
    canonical: "https://atc.mil.ng", // <-- I'll Update with my real domain later
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        suppressHydrationWarning
        className={` ${inter.variable}  ${manrope.variable} ${oswald.variable} ${openSans.variable} antialiased`}
      >
        {children}
        <Toaster richColors position="top-right" />
      </body>
    </html>
  );
}
