import "./globals.css";

export const metadata = {
  title: "Vayusole — Foot reflexology, honestly graded",
  description:
    "Guided foot reflexology protocols for everyday complaints, with every claim labelled by evidence level. Educational only, not medical advice.",
  manifest: "/manifest.json",
};

export const viewport = {
  themeColor: "#10262B",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
      </head>
      <body>{children}</body>
    </html>
  );
}
