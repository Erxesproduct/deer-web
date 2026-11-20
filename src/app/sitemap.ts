import type { MetadataRoute } from "next";
import { catalogInfo, products, types } from "@/lib/catalog";
import { absoluteUrl } from "@/lib/site-url";

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date(catalogInfo.updatedAt);
  const page = (path: string, priority: number) => ({ url: absoluteUrl(path), lastModified, priority });
  return [
    page("/", 1),
    page("/shop", 0.9),
    page("/shop?ny=1", 0.9),
    page("/info", 0.7),
    page("/shop?w=w", 0.8),
    page("/shop?w=m", 0.8),
    page("/shop?knit=1", 0.8),
    ...types.map((t) => page(`/shop?t=${t.id}`, 0.8)),
    ...products.map((p) => page(`/p/${p.slug}`, 0.8)),
  ];
}
