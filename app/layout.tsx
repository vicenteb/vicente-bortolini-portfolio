import type { Metadata } from "next";
import "./globals.css";
import "./mobile-overrides.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://vicentebortolini.com"),
  title: "Vicente Bortolini — UX/UI & Product Designer",
  description:
    "Portfólio de Vicente Bortolini, UX/UI e Product Designer especializado em produtos digitais, experiências omnichannel, varejo e inteligência artificial.",
  keywords: [
    "Vicente Bortolini",
    "UX Designer",
    "UI Designer",
    "Product Designer",
    "Design de Produto",
    "Portfólio UX",
  ],
  openGraph: {
    title: "Vicente Bortolini — UX/UI & Product Designer",
    description:
      "Estratégia, pesquisa e design para produtos digitais que conectam pessoas, tecnologia e resultados de negócio.",
    locale: "pt_BR",
    type: "website",
  },
  appleWebApp: {
    capable: true,
    title: "Vicente Bortolini",
    statusBarStyle: "black-translucent",
  },
  other: {
    "codex-preview": "development",
  },
  icons: {
    icon: "/favicon-vb.svg",
    shortcut: "/favicon-vb.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <head>
        <link
          rel="preload"
          href="/fonts/montserrat-latin-400-normal.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
        <link
          rel="preload"
          href="/fonts/montserrat-latin-500-normal.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
        <link
          rel="preload"
          href="/fonts/montserrat-latin-600-normal.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
