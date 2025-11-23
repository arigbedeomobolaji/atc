import type { Metadata } from "next";
// import {
//   Geist,
//   Geist_Mono,
//   Inter,
//   Poppins,
//   Manrope,
//   Oswald,
// } from "next/font/google";
// import "./globals.css";
// import "flowbite";

// const oswald = Oswald({
//   weight: ["400", "700"],
//   subsets: ["latin"],
//   variable: "--font-oswald",
//   display: "swap",
// });

// const inter = Inter({
//   subsets: ["latin"],
//   variable: "--font-inter",
//   display: "swap",
// });

// const poppins = Poppins({
//   subsets: ["latin"],
//   weight: ["400", "600", "700"],
//   variable: "--font-poppins",
//   display: "swap",
// });

// const manrope = Manrope({
//   subsets: ["latin"],
//   weight: ["400", "500", "600", "700"],
//   variable: "--font-manrope",
//   display: "swap",
// });

// const geistSans = Geist({
//   variable: "--font-geist-sans",
//   subsets: ["latin"],
// });

// const geistMono = Geist_Mono({
//   variable: "--font-geist-mono",
//   subsets: ["latin"],
// });

export const metadata: Metadata = {
  title: "ABOUT - Air Training Command",
  description: "Air Training Command Kaduna (ATC)",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`antialiased`}>{children}</body>
    </html>
  );
}
