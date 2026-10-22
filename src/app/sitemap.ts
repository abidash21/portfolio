import type { MetadataRoute } from "next";
import { profile } from "@/content/resume";
import { siteUrl } from "@/content/site";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: siteUrl.href, changeFrequency: "monthly", priority: 1 },
    {
      url: new URL(profile.resume, siteUrl).href,
      changeFrequency: "monthly",
      priority: 0.5,
    },
  ];
}
