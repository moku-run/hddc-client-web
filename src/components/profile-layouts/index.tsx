"use client";

import type { ProfileData, ProfileLink, PageLayout } from "@/lib/profile-types";
import { LayoutList } from "./layout-list";
import { LayoutCard } from "./layout-card";
import { LayoutGrid } from "./layout-grid";
import { LayoutMagazine } from "./layout-magazine";
import { LayoutShop } from "./layout-shop";
import { LayoutVisual } from "./layout-visual";

interface ProductProfileProps {
  profileData: ProfileData;
  links?: ProfileLink[];
}

const LAYOUT_MAP: Record<PageLayout, React.ComponentType<{ profileData: ProfileData; links: ProfileLink[] }>> = {
  list: LayoutList,
  card: LayoutCard,
  grid: LayoutGrid,
  magazine: LayoutMagazine,
  shop: LayoutShop,
  visual: LayoutVisual,
};

export function ProductProfile({ profileData, links }: ProductProfileProps) {
  const displayLinks = links ?? profileData.links.filter((l) => l.enabled);
  const Layout = LAYOUT_MAP[profileData.pageLayout] ?? LayoutList;
  return <Layout profileData={profileData} links={displayLinks} />;
}
