/**
 * 사용자 프로필 slug(hotdeal.cool/username)로 사용할 수 없는 예약어 목록.
 * 프론트엔드 사전 검증 + 백엔드 최종 검증 모두에서 사용.
 */
export const RESERVED_SLUGS = new Set([
  // ─── auth / account ───
  "auth",
  "login",
  "signup",
  "register",
  "logout",
  "reset-password",
  "verify",
  "callback",

  // ─── system routes ───
  "admin",
  "dashboard",
  "settings",
  "profile",
  "api",
  "graphql",

  // ─── static / content ───
  "hot-deals",
  "about",
  "terms",
  "privacy",
  "contact",
  "pricing",
  "blog",
  "docs",
  "help",
  "support",
  "faq",

  // ─── technical / infra ───
  "static",
  "public",
  "assets",
  "_next",
  "favicon.ico",
  "robots.txt",
  "sitemap.xml",
  "health",
  "status",
  "cdn",
  "www",

  // ─── brand protection ───
  "hotdeal",
  "hotdealcool",
  "official",
  "team",
  "staff",
]);

export function isReservedSlug(slug: string): boolean {
  return RESERVED_SLUGS.has(slug.toLowerCase());
}
