import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        // Session-gated app and API surface — nothing to index there.
        disallow: ["/panel", "/api/", "/auth/"],
      },
    ],
    sitemap: "https://www.sellium.eu/sitemap.xml",
  };
}
