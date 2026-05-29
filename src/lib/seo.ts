import { site } from "~data/site";

export interface PageMeta {
  title?: string;
  description?: string;
  ogImage?: string;
  ogType?: "website" | "article";
  noindex?: boolean;
  canonical?: string;
}

export function buildPageTitle(title?: string): string {
  if (!title) {
    return `${site.siteName}｜美容室 - 原宿・名古屋・長岡`;
  }
  return `${title}｜${site.siteName}`;
}

export function buildCanonical(pathname: string): string {
  // strip trailing slash except root
  const cleaned = pathname.replace(/\/+$/, "") || "/";
  return `${site.url}${cleaned}`;
}

export function buildOgImageUrl(path?: string): string {
  const target = path ?? site.ogImage;
  if (target.startsWith("http")) return target;
  return `${site.url}${target}`;
}
