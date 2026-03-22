import { request } from "./api";
import type { HotDealPage, DealComment, DealSortKey, CommentPage } from "./hot-deal-types";

/* ─── Query API ─── */

export async function fetchDeals(
  sort: DealSortKey = "latest",
  page = 0,
  limit = 20,
): Promise<HotDealPage> {
  const params = new URLSearchParams({ sort, page: String(page), limit: String(limit) });
  const res = await request<HotDealPage>(`/api/hot-deals?${params}`);
  return res.payload!;
}

export async function searchDeals(
  q: string,
  page = 0,
  limit = 20,
): Promise<HotDealPage> {
  const params = new URLSearchParams({ q, page: String(page), limit: String(limit) });
  const res = await request<HotDealPage>(`/api/hot-deals/search?${params}`);
  return res.payload!;
}

export async function fetchComments(
  dealId: number,
  size = 20,
  after?: number | null,
): Promise<CommentPage> {
  const params = new URLSearchParams({ size: String(size) });
  if (after != null) params.set("after", String(after));
  const res = await request<CommentPage>(`/api/hot-deals/${dealId}/comments?${params}`);
  const payload = res.payload!;
  // 서버가 아직 배열로 반환하는 경우 호환
  if (Array.isArray(payload)) {
    return { comments: payload as unknown as DealComment[], nextCursor: null, hasNext: false };
  }
  return payload;
}

/* ─── Like API ─── */

export async function likeDeal(dealId: number): Promise<void> {
  await request(`/api/hot-deals/${dealId}/likes`, { method: "POST" });
}

export async function unlikeDeal(dealId: number): Promise<void> {
  await request(`/api/hot-deals/${dealId}/likes`, { method: "DELETE" });
}

/* ─── Comment API ─── */

export async function addComment(
  dealId: number,
  content: string,
  parentId?: number | null,
): Promise<DealComment> {
  const res = await request<DealComment>(`/api/hot-deals/${dealId}/comments`, {
    method: "POST",
    body: JSON.stringify({ content, parentId: parentId ?? null }),
  });
  return res.payload!;
}

export async function deleteComment(dealId: number, commentId: number): Promise<void> {
  await request(`/api/hot-deals/${dealId}/comments/${commentId}`, { method: "DELETE" });
}

/* ─── Comment Like API ─── */

export async function likeComment(dealId: number, commentId: number): Promise<void> {
  await request(`/api/hot-deals/${dealId}/comments/${commentId}/likes`, { method: "POST" });
}

export async function unlikeComment(dealId: number, commentId: number): Promise<void> {
  await request(`/api/hot-deals/${dealId}/comments/${commentId}/likes`, { method: "DELETE" });
}

/* ─── Expired Vote API ─── */

export async function voteExpired(dealId: number): Promise<void> {
  await request(`/api/hot-deals/${dealId}/expired-votes`, { method: "POST" });
}

export async function unvoteExpired(dealId: number): Promise<void> {
  await request(`/api/hot-deals/${dealId}/expired-votes`, { method: "DELETE" });
}

/* ─── Report API ─── */

export async function reportDeal(dealId: number, reason: string): Promise<void> {
  await request(`/api/hot-deals/${dealId}/reports`, {
    method: "POST",
    body: JSON.stringify({ reason }),
  });
}

export async function reportComment(
  dealId: number,
  commentId: number,
  reason: string,
): Promise<void> {
  await request(`/api/hot-deals/${dealId}/comments/${commentId}/reports`, {
    method: "POST",
    body: JSON.stringify({ reason }),
  });
}
