import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Paper Street Corps",
  description:
    "Evidence-first typology, voting, debate, and moderation platform.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
