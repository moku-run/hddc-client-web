import type { ApiResponse } from "./api";
import { ApiError } from "./api";
import type { HotDealPage, DealComment, DealSortKey } from "./hot-deal-types";

/* ─── Shared request (reuse token logic from api.ts) ─── */

async function request<T = null>(
  path: string,
  options: RequestInit = {},
): Promise<ApiResponse<T>> {
  const token = typeof window !== "undefined"
    ? localStorage.getItem("hddc-token")
    : null;

  const res = await fetch(path, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  });

  const body: ApiResponse<T> = await res.json();
  if (!body.success) {
    throw new ApiError(body.code, body.message, res.status);
  }
  return body;
}

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

export async function fetchComments(dealId: number): Promise<DealComment[]> {
  const res = await request<DealComment[]>(`/api/hot-deals/${dealId}/comments`);
  return res.payload ?? [];
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
