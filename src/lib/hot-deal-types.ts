/* ─── Server-aligned Hot Deal types ─── */

export type DealCategory =
  | "electronics" | "fashion" | "food" | "living"
  | "beauty" | "travel" | "digital" | "sports"
  | "etc";

/** Matches HotDealResponse from server */
export interface HotDeal {
  dealNumber: number;
  id: number;
  userId: number;
  nickname: string;
  title: string;
  description: string | null;
  url: string;
  imageUrl: string | null;
  originalPrice: number | null;
  dealPrice: number | null;
  discountRate: number | null;
  category: string | null;
  store: string | null;
  likeCount: number;
  commentCount: number;
  expiredVoteCount: number;
  isExpired: boolean;
  viewCount?: number;
  isLiked: boolean;
  isVotedExpired: boolean;
  createdAt: string;
}

/** Matches HotDealPageResponse from server */
export interface HotDealPage {
  content: HotDeal[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
}

/** Matches CommentResponse from server */
export interface DealComment {
  id: number;
  dealId: number;
  userId: number;
  nickname: string;
  parentId: number | null;
  content: string;
  likeCount: number;
  isLiked: boolean;
  createdAt: string;
}

/** Cursor-based comment page from server */
export interface CommentPage {
  comments: DealComment[];
  nextCursor: number | null;
  hasNext: boolean;
}

/** Sort options the server supports */
export type DealSortKey = "latest" | "popular" | "discount";

/* ─── Feed composition (client-only) ─── */

export interface FeedProfile {
  slug: string;
  nickname: string;
  bio: string;
  avatarUrl: string | null;
}

export type FeedItem =
  | { type: "deal"; data: HotDeal }
  | { type: "sponsor" }
  | { type: "profile"; data: FeedProfile };

export function buildFeed(deals: HotDeal[], profiles: FeedProfile[]): FeedItem[] {
  const feed: FeedItem[] = [];
  let profileIdx = 0;
  deals.forEach((deal, i) => {
    feed.push({ type: "deal", data: deal });
    if ((i + 1) % 4 === 0) feed.push({ type: "sponsor" });
    if ((i + 1) % 7 === 0 && profileIdx < profiles.length) {
      feed.push({ type: "profile", data: profiles[profileIdx++] });
    }
  });
  return feed;
}
