import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact us - Air Training Command",
  description: "Air Training Command Kaduna (ATC)",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <section className="min-h-screen">{children}</section>;
}
