import { ApiError, type ApiResponse } from "./api";

/* ─── Admin request (uses admin token) ─── */

async function adminRequest<T = null>(
  path: string,
  options: RequestInit = {},
): Promise<ApiResponse<T>> {
  const token = typeof window !== "undefined"
    ? localStorage.getItem("hddc-admin-token")
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
    if (res.status === 401 || res.status === 403) {
      localStorage.removeItem("hddc-admin-token");
      localStorage.removeItem("hddc-admin-auth");
      localStorage.removeItem("hddc-admin-user");
      window.location.href = "/admin-login";
    }
    throw new ApiError(body.code, body.message, res.status);
  }
  return body;
}

/* ─── Auth ─── */

export interface AdminLoginResult {
  token: string;
  name: string;
  role: string;
}

export async function adminLogin(email: string, password: string): Promise<AdminLoginResult> {
  const res = await adminRequest<AdminLoginResult>("/api/admin/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
  const payload = res.payload!;
  localStorage.setItem("hddc-admin-token", payload.token);
  localStorage.setItem("hddc-admin-auth", "true");
  localStorage.setItem("hddc-admin-user", JSON.stringify(payload));
  return payload;
}

export function adminLogout() {
  localStorage.removeItem("hddc-admin-token");
  localStorage.removeItem("hddc-admin-auth");
  localStorage.removeItem("hddc-admin-user");
}

/* ─── Crawl Deals ─── */

export type CrawlDealStatus = "PENDING" | "APPROVED" | "REJECTED";

export interface CrawlDeal {
  id: number;
  sourceSite: string;
  sourceId: string;
  title: string;
  description: string | null;
  postUrl: string;
  dealLink: string | null;
  imageUrl: string | null;
  originalPrice: number | null;
  dealPrice: number | null;
  discountRate: number | null;
  store: string | null;
  category: string | null;
  status: CrawlDealStatus;
  crawledAt: string;
  transferredAt: string | null;
}

export interface CrawlDealPage {
  content: CrawlDeal[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
}

export async function fetchCrawlDeals(
  status: CrawlDealStatus = "PENDING",
  page = 0,
  size = 20,
): Promise<CrawlDealPage> {
  const params = new URLSearchParams({ status, page: String(page), size: String(size) });
  const res = await adminRequest<CrawlDealPage>(`/api/admin/crawl-deals?${params}`);
  return res.payload!;
}

export async function approveDeal(id: number): Promise<number> {
  const res = await adminRequest<{ hotDealId: number }>(`/api/admin/crawl-deals/${id}/approve`, {
    method: "POST",
  });
  return res.payload!.hotDealId;
}

export async function rejectDeal(id: number): Promise<void> {
  await adminRequest(`/api/admin/crawl-deals/${id}/reject`, { method: "POST" });
}

export async function bulkApprove(ids: number[]): Promise<number> {
  const res = await adminRequest<{ approvedCount: number }>("/api/admin/crawl-deals/bulk-approve", {
    method: "POST",
    body: JSON.stringify({ ids }),
  });
  return res.payload!.approvedCount;
}

/* ─── Hot Deals (mst_hot_deal) direct management ─── */

export interface AdminHotDeal {
  id: number;
  userId: number;
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
  isDeleted?: boolean;
  createdAt: string;
}

export interface AdminHotDealPage {
  content: AdminHotDeal[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
}

export interface CreateHotDealRequest {
  title: string;
  description?: string | null;
  url: string;
  imageUrl?: string | null;
  originalPrice?: number | null;
  dealPrice?: number | null;
  discountRate?: number | null;
  category?: string | null;
  store?: string | null;
}

export async function fetchAdminHotDeals(page = 0, size = 20): Promise<AdminHotDealPage> {
  const params = new URLSearchParams({ page: String(page), size: String(size) });
  const res = await adminRequest<AdminHotDealPage>(`/api/admin/hot-deals?${params}`);
  return res.payload!;
}

export async function createHotDeal(data: CreateHotDealRequest): Promise<AdminHotDeal> {
  const res = await adminRequest<AdminHotDeal>("/api/admin/hot-deals", {
    method: "POST",
    body: JSON.stringify(data),
  });
  return res.payload!;
}

export async function updateHotDeal(dealId: number, data: Partial<CreateHotDealRequest>): Promise<AdminHotDeal> {
  const res = await adminRequest<AdminHotDeal>(`/api/admin/hot-deals/${dealId}`, {
    method: "PATCH",
    body: JSON.stringify(data),
  });
  return res.payload!;
}

export async function deleteHotDeal(dealId: number): Promise<void> {
  await adminRequest(`/api/admin/hot-deals/${dealId}`, { method: "DELETE" });
}
