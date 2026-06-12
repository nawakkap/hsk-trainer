import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "HSK Trainer",
    short_name: "HSK",
    description: "Daily 15-minute Chinese practice for HSK1 and HSK3",
    start_url: "/",
    display: "standalone",
    background_color: "#fff7ec",
    theme_color: "#e63946",
    orientation: "portrait",
    icons: [
      {
        src: "/icon.svg",
        sizes: "any",
        type: "image/svg+xml",
        purpose: "any",
      },
    ],
  };
}
