import { NextResponse } from "next/server";

export const dynamic = "force-static";

export function GET() {
  return NextResponse.json(
    {
      name: "Vicente Bortolini — Portfólio",
      short_name: "Vicente",
      description: "Portfólio de Vicente Bortolini, Product Designer com foco em UX/UI.",
      start_url: "/",
      scope: "/",
      display: "standalone",
      background_color: "#080914",
      theme_color: "#080914",
      icons: [
        {
          src: "/apple-touch-icon.png",
          sizes: "180x180",
          type: "image/png",
          purpose: "any",
        },
      ],
    },
    {
      headers: {
        "Content-Type": "application/manifest+json; charset=utf-8",
        "Cache-Control": "public, max-age=3600",
      },
    },
  );
}
