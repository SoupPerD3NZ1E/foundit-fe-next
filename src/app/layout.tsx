import type { Metadata } from "next";
import "./globals.css";
import AosInit from "@/components/providers/AosInit";

export const metadata: Metadata = {
  title: "FoundIT",
  description: "FoundIT — find freelancers and gigs.",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <AosInit />
        {children}
      </body>
    </html>
  );
}
