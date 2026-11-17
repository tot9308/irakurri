export const metadata = {
  title: "Irakurri – Irakurri egunerokoa euskaraz",
  description: "Aplikazioa 6-8 urteko haurrentzat egina, irakurri eskaintza nuestra, euskaraz.",
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
