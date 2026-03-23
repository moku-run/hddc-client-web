"use client";

import type { ProfileData, ProfileLink, PageLayout } from "@/lib/profile-types";
import { LayoutList } from "./layout-list";
import { LayoutCard } from "./layout-card";
import { LayoutGrid } from "./layout-grid";
import { LayoutGrid3 } from "./layout-grid3";
import { LayoutShop } from "./layout-shop";
import { LayoutVisual } from "./layout-visual";

interface ProductProfileProps {
  profileData: ProfileData;
  links?: ProfileLink[];
  /** 에디터 프리뷰용 — 클릭수/좋아요 목 데이터 주입 */
  preview?: boolean;
}

const LAYOUT_MAP: Record<PageLayout, React.ComponentType<{ profileData: ProfileData; links: ProfileLink[] }>> = {
  list: LayoutList,
  card: LayoutCard,
  grid: LayoutGrid,
  "grid-3": LayoutGrid3,
  shop: LayoutShop,
  visual: LayoutVisual,
};

const SAMPLE_LINKS: ProfileLink[] = [
  { id: -1, title: "샘플 상품 1", url: "#", imageUrl: null, description: null, order: 0, enabled: true, price: 199000, originalPrice: 289000, discountRate: 31, store: "쿠팡", category: "전자제품", clicks: 1284, likes: 47 },
  { id: -2, title: "샘플 상품 2", url: "#", imageUrl: null, description: null, order: 1, enabled: true, price: 129000, originalPrice: 179000, discountRate: 28, store: "무신사", category: "패션", clicks: 856, likes: 23 },
  { id: -3, title: "샘플 상품 3", url: "#", imageUrl: null, description: null, order: 2, enabled: true, price: 549000, originalPrice: null, discountRate: null, store: "네이버", category: "생활", clicks: 342, likes: 8 },
];

const MOCK_STATS = [
  { clicks: 1284, likes: 47 },
  { clicks: 856, likes: 23 },
  { clicks: 342, likes: 8 },
  { clicks: 127, likes: 5 },
  { clicks: 2041, likes: 91 },
];

export function ProductProfile({ profileData, links, preview }: ProductProfileProps) {
  const enabledLinks = links ?? profileData.links.filter((l) => l.enabled);
  const baseLinks = enabledLinks.length > 0 ? enabledLinks : SAMPLE_LINKS;
  const displayLinks = preview
    ? baseLinks.map((l, i) => ({
        ...l,
        clicks: l.clicks ?? MOCK_STATS[i % MOCK_STATS.length].clicks,
        likes: l.likes ?? MOCK_STATS[i % MOCK_STATS.length].likes,
      }))
    : baseLinks;
  const isPlaceholder = enabledLinks.length === 0;
  const Layout = LAYOUT_MAP[profileData.pageLayout] ?? LayoutList;

  const containerStyle: React.CSSProperties = {
    ...(profileData.backgroundColor ? { backgroundColor: profileData.backgroundColor } : {}),
    ...(profileData.fontColor ? { color: profileData.fontColor } : {}),
    ...(profileData.backgroundTexture ? {
      backgroundImage: `url(/textures/${profileData.backgroundTexture}.svg)`,
      backgroundRepeat: 'repeat',
      backgroundSize: '200px',
      backgroundBlendMode: 'multiply',
    } as React.CSSProperties : {}),
  };

  const hasContainerStyle = profileData.backgroundColor || profileData.fontColor || profileData.backgroundTexture;

  return (
    <div
      className="min-h-full"
      style={hasContainerStyle ? containerStyle : undefined}
    >
      <div className={isPlaceholder ? "opacity-50" : ""}>
        <Layout profileData={profileData} links={displayLinks} />
      </div>
    </div>
  );
}
