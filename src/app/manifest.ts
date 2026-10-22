import type { MetadataRoute } from "next";
import { profile } from "@/content/resume";
import { site } from "@/content/site";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: site.title,
    short_name: profile.name,
    description: site.description,
    start_url: "/",
    display: "browser",
    background_color: "#121315",
    theme_color: "#121315",
    icons: [
      { src: "/icon.svg", sizes: "any", type: "image/svg+xml" },
      { src: "/apple-icon", sizes: "180x180", type: "image/png" },
    ],
  };
}
