import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Sokey",
  description: "NFC Spotify Tag",
  themeColor: "#1e293b",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover", // 👈 ASTA ESTE CHEIA
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ro">
      <body
        style={{
          margin: 0,
          padding: 0,
          minHeight: "100vh",
          background:
            "radial-gradient(1200px 800px at 50% -10%, #1e293b 0%, #0f172a 40%, #000000 85%)",
        }}
      >
        {children}
      </body>
    </html>
  );
}