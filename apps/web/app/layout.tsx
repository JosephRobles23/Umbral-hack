export const metadata = {
  title: "Umbral",
  description: "Framework de desarrollo con comprensión sostenible",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}
