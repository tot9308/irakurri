import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Irakurri – Irakurketa euskaraz",
  description: "6-8 urteko haurrentzako irakurketa aplikazioa, euskaraz.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="eu">
      <body>{children}</body>
    </html>
  );
}
