import type { DealCategory } from "./hot-deal-types";

/* ─── Report ─── */
export type ReportStatus = "pending" | "reviewed" | "resolved" | "dismissed";
export type ReportTargetType = "deal" | "comment" | "user" | "link";

export interface Report {
  id: string;
  targetType: ReportTargetType;
  targetId: string;
  targetTitle: string;
  reason: string;
  reporterName: string;
  status: ReportStatus;
  createdAt: string;
  resolvedAt: string | null;
  adminNote: string | null;
}

/* ─── AdminDeal ─── */
export type DealStatus = "active" | "expired" | "hidden" | "reported";

export interface AdminDeal {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  price: number;
  originalPrice: number | null;
  url: string;
  source: string;
  category: DealCategory;
  status: DealStatus;
  likes: number;
  comments: number;
  reports: number;
  createdAt: string;
  expiresAt: string | null;
}

/* ─── AdminLink ─── */
export type LinkStatus = "active" | "inactive" | "reported";

export interface AdminLink {
  id: string;
  userId: string;
  userSlug: string;
  userNickname: string;
  userAvatarUrl: string | null;
  title: string;
  url: string;
  clicks: number;
  status: LinkStatus;
  createdAt: string;
}

/* ─── AdminStats ─── */
export interface AdminStats {
  totalUsers: number;
  totalUsersChange: string;
  activeDeals: number;
  activeDealsChange: string;
  totalLinks: number;
  totalLinksChange: string;
  pendingReports: number;
}

export interface ChartDataPoint {
  label: string;
  [key: string]: string | number;
}
