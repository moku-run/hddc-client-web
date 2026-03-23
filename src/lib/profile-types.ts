export const SOCIAL_PLATFORMS = [
  "instagram",
  "youtube",
  "x",
  "tiktok",
  "threads",
  "facebook",
  "kakaotalk",
  "naver-blog",
  "email",
  "website",
] as const;

export type SocialPlatform = (typeof SOCIAL_PLATFORMS)[number];

export type PageLayout = "list" | "card" | "grid" | "magazine" | "shop" | "visual";

export type LinkLayout = "list" | "grid-2" | "grid-3";

export type LinkStyle = "none" | "fill" | "shadow" | "glass" | "gradient";

export type LinkRound = "none" | "sm" | "md" | "lg";

export type HeaderLayout = "center" | "left" | "avatar-only" | "banner-only";

export type LinkAnimation = "none" | "fade-in" | "slide-up" | "scale" | "stagger";

export type BackgroundTexture = "paper" | "linen" | "concrete" | "fabric" | "noise";

export type DecoratorType = "text" | "divider-line" | "divider-dots" | "divider-wave";

export type FontFamily = "pretendard" | "noto-sans" | "nanum-gothic" | "nanum-myeongjo" | "gmarket-sans" | "suit";

export const FONT_FAMILY_LABELS: Record<FontFamily, string> = {
  "pretendard": "Pretendard",
  "noto-sans": "Noto Sans KR",
  "nanum-gothic": "나눔고딕",
  "nanum-myeongjo": "나눔명조",
  "gmarket-sans": "GmarketSans",
  "suit": "SUIT",
};

export const FONT_FAMILY_CSS: Record<FontFamily, string> = {
  "pretendard": "'Pretendard Variable', Pretendard, sans-serif",
  "noto-sans": "'Noto Sans KR', sans-serif",
  "nanum-gothic": "'NanumGothic', sans-serif",
  "nanum-myeongjo": "'NanumMyeongjo', serif",
  "gmarket-sans": "'GmarketSansMedium', sans-serif",
  "suit": "'SUIT Variable', SUIT, sans-serif",
};

export interface ProfileLink {
  id: number;
  title: string;
  url: string;
  imageUrl: string | null;
  description: string | null;
  order: number;
  enabled: boolean;
  /** 상품 특화 필드 (optional — 서버 추가 전 mock) */
  price?: number | null;
  originalPrice?: number | null;
  discountRate?: number | null;
  store?: string | null;
  category?: string | null;
  clicks?: number;
}

export interface SocialLink {
  id: number;
  platform: SocialPlatform;
  url: string;
}

export type PlanType = "free" | "pro" | "business";

export interface ProfileData {
  avatarUrl: string | null;
  backgroundUrl: string | null;
  backgroundColor: string | null;
  slug: string;
  nickname: string;
  bio: string;
  links: ProfileLink[];
  socials: SocialLink[];
  pageLayout: PageLayout;
  linkLayout: LinkLayout;
  linkStyle: LinkStyle;
  linkRound: LinkRound;
  fontFamily: FontFamily;
  headerLayout: HeaderLayout;
  linkAnimation: LinkAnimation;
  colorTheme: "teal" | "orange" | "blue" | "violet" | "yellow" | "red" | "white" | "default" | "custom";
  customPrimaryColor: string | null;
  customSecondaryColor: string | null;
  fontColor: string | null;
  backgroundTexture: BackgroundTexture | null;
  decorator1Type: DecoratorType | null;
  decorator1Text: string | null;
  decorator2Type: DecoratorType | null;
  decorator2Text: string | null;
  linkGradientFrom: string | null;
  linkGradientTo: string | null;
  darkMode: boolean;
  plan: PlanType;
}

export const DEFAULT_PROFILE: ProfileData = {
  avatarUrl: null,
  backgroundUrl: null,
  backgroundColor: null,
  fontColor: null,
  slug: "",
  nickname: "",
  bio: "",
  links: [],
  socials: [],
  pageLayout: "list",
  linkLayout: "list",
  linkStyle: "fill",
  linkRound: "sm",
  fontFamily: "pretendard",
  headerLayout: "center",
  linkAnimation: "none",
  colorTheme: "default",
  customPrimaryColor: null,
  customSecondaryColor: null,
  backgroundTexture: null,
  decorator1Type: null,
  decorator1Text: null,
  decorator2Type: null,
  decorator2Text: null,
  linkGradientFrom: null,
  linkGradientTo: null,
  darkMode: false,
  plan: "free",
};

/**
 * Base URL for each social platform.
 * null = free-form URL (email, website).
 */
export const SOCIAL_PLATFORM_BASE_URLS: Record<SocialPlatform, string | null> = {
  instagram: "https://www.instagram.com/",
  youtube: "https://www.youtube.com/",
  x: "https://x.com/",
  tiktok: "https://www.tiktok.com/@",
  threads: "https://www.threads.net/@",
  facebook: "https://www.facebook.com/",
  kakaotalk: "https://pf.kakao.com/",
  "naver-blog": "https://blog.naver.com/",
  email: null,
  website: null,
};

/** Domains that belong to each platform (for stripping pasted full URLs) */
const SOCIAL_DOMAINS: Record<string, string[]> = {
  instagram: ["instagram.com", "www.instagram.com"],
  youtube: ["youtube.com", "www.youtube.com", "youtu.be"],
  x: ["x.com", "twitter.com", "www.twitter.com"],
  tiktok: ["tiktok.com", "www.tiktok.com"],
  threads: ["threads.net", "www.threads.net"],
  facebook: ["facebook.com", "www.facebook.com", "fb.com"],
  kakaotalk: ["pf.kakao.com"],
  "naver-blog": ["blog.naver.com"],
};

/**
 * Extract handle/path from a pasted value.
 * - Full URL → strips domain, returns path
 * - "/handle" → strips leading slash
 * - "@handle" → strips leading @
 * - "handle" → returns as-is
 */
export function normalizeSocialHandle(platform: SocialPlatform, value: string): string {
  const trimmed = value.trim();
  if (!trimmed) return "";

  // email / website: return as-is
  if (!SOCIAL_PLATFORM_BASE_URLS[platform]) return trimmed;

  // Try to parse as URL
  try {
    const url = new URL(
      trimmed.startsWith("http") ? trimmed : `https://${trimmed}`
    );
    const domains = SOCIAL_DOMAINS[platform] || [];
    if (domains.some((d) => url.hostname === d || url.hostname.endsWith(`.${d}`))) {
      // Strip pathname leading slash + @ prefix
      return url.pathname.replace(/^\/+/, "").replace(/^@/, "").replace(/\/+$/, "")
        + (url.search || "");
    }
  } catch {
    // Not a valid URL — treat as handle
  }

  // Strip leading / or @
  return trimmed.replace(/^[/@]+/, "");
}

/** Construct full URL from platform + handle */
export function buildSocialUrl(platform: SocialPlatform, handle: string): string {
  if (!handle) return "";
  const base = SOCIAL_PLATFORM_BASE_URLS[platform];
  if (!base) return handle; // email, website
  return `${base}${handle}`;
}

export const SOCIAL_PLATFORM_LABELS: Record<SocialPlatform, string> = {
  instagram: "Instagram",
  youtube: "YouTube",
  x: "X (Twitter)",
  tiktok: "TikTok",
  threads: "Threads",
  facebook: "Facebook",
  kakaotalk: "카카오톡 채널",
  "naver-blog": "네이버 블로그",
  email: "이메일",
  website: "웹사이트",
};
