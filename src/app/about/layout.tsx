import type { Metadata } from "next";

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
