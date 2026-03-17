export type DealCategory =
  | "electronics" | "fashion" | "food" | "living"
  | "beauty" | "travel" | "digital" | "sports"
  | "etc";

export interface HotDeal {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  price: number;
  url: string;
  source: string;
  category: DealCategory;
  postedAt: string;
  likes: number;
  comments: number;
}

export interface DealComment {
  id: string;
  parentId: string | null;
  author: string;
  text: string;
  createdAt: string;
}

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
