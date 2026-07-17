import type { MetadataRoute } from "next";

const BASE = "https://www.sellium.eu";

/**
 * Public, indexable pages only. Auth screens and the panel are deliberately
 * excluded (login/registro carry no search value; /panel is session-gated).
 */
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: `${BASE}/`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${BASE}/legal/aviso-legal`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.2,
    },
    {
      url: `${BASE}/legal/privacidad`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.2,
    },
    {
      url: `${BASE}/legal/cookies`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.2,
    },
  ];
}
