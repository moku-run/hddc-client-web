/* ─── API Client ─── */

export interface ApiResponse<T = null> {
  success: boolean;
  code: string;
  message: string;
  payload: T | null;
}

export interface LoginResult {
  userId: number;
  email: string;
  nickname: string;
  role: "USER" | "ADMIN";
  token: string;
}

export class ApiError extends Error {
  constructor(
    public code: string,
    message: string,
    public status: number,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

const PUBLIC_PATHS = ["/api/auth/"];

let isRefreshing = false;
let refreshPromise: Promise<string | null> | null = null;

async function refreshToken(): Promise<string | null> {
  try {
    const res = await fetch("/api/auth/refresh", {
      method: "POST",
      credentials: "include",
    });
    const body: ApiResponse<{ token: string }> = await res.json();
    if (body.success && body.payload?.token) {
      localStorage.setItem("hddc-token", body.payload.token);
      return body.payload.token;
    }
  } catch { /* refresh 실패 */ }
  return null;
}

export async function request<T = null>(
  path: string,
  options: RequestInit = {},
  _retry = false,
): Promise<ApiResponse<T>> {
  const isPublic = PUBLIC_PATHS.some((p) => path.startsWith(p));
  const token = !isPublic && typeof window !== "undefined"
    ? localStorage.getItem("hddc-token")
    : null;

  const res = await fetch(path, {
    ...options,
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  });

  const body: ApiResponse<T> = await res.json();

  // 401 + 재시도 안 한 경우 → refresh 시도
  if (res.status === 401 && !_retry && !isPublic) {
    if (!isRefreshing) {
      isRefreshing = true;
      refreshPromise = refreshToken().finally(() => { isRefreshing = false; });
    }
    const newToken = await refreshPromise;
    if (newToken) {
      return request<T>(path, options, true);
    }
    // refresh도 실패 → 로그아웃
    localStorage.removeItem("hddc-auth");
    localStorage.removeItem("hddc-token");
    localStorage.removeItem("hddc-user");
    window.location.href = "/auth/login";
  }

  if (!body.success) {
    throw new ApiError(body.code, body.message, res.status);
  }

  return body;
}

/* ─── Auth API ─── */

export const authApi = {
  sendVerificationCode(email: string) {
    return request("/api/auth/email-verifications", {
      method: "POST",
      body: JSON.stringify({ email }),
    });
  },

  verifyCode(email: string, code: string) {
    return request("/api/auth/email-verifications/verify", {
      method: "POST",
      body: JSON.stringify({ email, code }),
    });
  },

  checkNickname(nickname: string) {
    return request<{ available: boolean; nickname: string }>(
      `/api/auth/check-nickname?nickname=${encodeURIComponent(nickname)}`,
    );
  },

  signUp(email: string, password: string, nickname: string) {
    return request<number>("/api/auth/sign-up", {
      method: "POST",
      body: JSON.stringify({ email, password, nickname }),
    });
  },

  async login(email: string, password: string) {
    const res = await request<LoginResult>("/api/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });

    if (res.payload) {
      localStorage.setItem("hddc-auth", "true");
      localStorage.setItem("hddc-token", res.payload.token);
      localStorage.setItem("hddc-user", JSON.stringify(res.payload));
    }

    return res;
  },

  sendPasswordResetCode(email: string) {
    return request("/api/auth/password-reset/email-verifications", {
      method: "POST",
      body: JSON.stringify({ email }),
    });
  },

  verifyPasswordResetCode(email: string, code: string) {
    return request("/api/auth/password-reset/email-verifications/verify", {
      method: "POST",
      body: JSON.stringify({ email, code }),
    });
  },

  resetPassword(email: string, password: string, passwordConfirm: string) {
    return request("/api/auth/password-reset", {
      method: "PUT",
      body: JSON.stringify({ email, password, passwordConfirm }),
    });
  },

  logout() {
    const token = typeof window !== "undefined" ? localStorage.getItem("hddc-token") : null;
    fetch("/api/auth/logout", {
      method: "POST",
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    }).catch(() => {});
    localStorage.removeItem("hddc-auth");
    localStorage.removeItem("hddc-token");
    localStorage.removeItem("hddc-user");
  },
};

/* ─── Image Upload (Pre-signed URL) ─── */

export type ImageDirectory = "link/avatars" | "link/backgrounds" | "link/profiles";

interface PresignedUrlResult {
  uploadUrl: string;
  imageUrl: string;
  key: string;
}

/**
 * Pre-signed URL 발급 → R2에 직접 업로드 → key 반환 (DB에 저장할 값)
 */
export async function uploadImage(
  file: File,
  directory: ImageDirectory,
): Promise<string> {
  const ext = file.name.split(".").pop()?.toLowerCase() || "png";

  // Step 1: pre-signed URL 발급
  const res = await request<PresignedUrlResult>("/api/upload/presigned-url", {
    method: "POST",
    body: JSON.stringify({
      directory,
      extension: ext,
      contentType: file.type,
    }),
  });

  const { uploadUrl, key } = res.payload!;

  // Step 2: R2에 직접 PUT
  const uploadRes = await fetch(uploadUrl, {
    method: "PUT",
    headers: { "Content-Type": file.type },
    body: file,
  });

  if (!uploadRes.ok) {
    throw new Error("이미지 업로드에 실패했습니다");
  }

  // Step 3: key 반환 (프로필 저장 시 DB에 저장할 값)
  return key;
}

/**
 * key → 조회용 pre-signed URL 발급
 */
export async function getImageUrl(key: string): Promise<string> {
  const res = await request<{ url: string }>(
    `/api/upload/presigned-url?key=${encodeURIComponent(key)}`,
  );
  return res.payload!.url;
}

/* ─── Profile Response Types ─── */

export interface ProfileLinkResponse {
  id: number;
  title: string;
  url: string;
  imageUrl: string | null;
  description: string | null;
  order: number;
  enabled: boolean;
}

export interface SocialLinkResponse {
  id: number;
  platform: string;
  url: string;
}

export interface ProfileResponse {
  slug: string;
  nickname: string;
  bio: string | null;
  avatarUrl: string | null;
  backgroundUrl: string | null;
  backgroundColor: string | null;
  fontColor: string | null;
  linkLayout: string;
  linkStyle: string;
  fontFamily: string;
  headerLayout: string;
  linkAnimation: string;
  colorTheme: string;
  customPrimaryColor: string | null;
  customSecondaryColor: string | null;
  backgroundTexture: string | null;
  decorator1Type: string | null;
  decorator1Text: string | null;
  decorator2Type: string | null;
  decorator2Text: string | null;
  linkGradientFrom: string | null;
  linkGradientTo: string | null;
  darkMode: boolean;
  links: ProfileLinkResponse[];
  socials: SocialLinkResponse[];
  createdAt: string;
  updatedAt: string;
}

/* ─── Profile API ─── */

export const profileApi = {
  // ─── 프로필 조회/수정 ───
  getMe() {
    return request<ProfileResponse>("/api/profiles/me");
  },

  updateMe(data: Partial<ProfileResponse>) {
    return request<ProfileResponse>("/api/profiles/me", {
      method: "PATCH",
      body: JSON.stringify(data),
    });
  },

  resetMe() {
    return request("/api/profiles/me/reset", { method: "POST" });
  },

  getBySlug(slug: string) {
    return request<ProfileResponse>(`/api/profiles/${encodeURIComponent(slug)}`);
  },

  checkSlug(slug: string) {
    return request<{ available: boolean; slug: string }>(
      `/api/profiles/check-slug?slug=${encodeURIComponent(slug)}`,
    );
  },

  // ─── 링크 CRUD ───
  addLink(data: { title: string; url: string; description?: string }) {
    return request<ProfileLinkResponse>("/api/profiles/me/links", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  updateLink(linkId: number, data: { title?: string; url?: string; description?: string }) {
    return request<ProfileLinkResponse>(`/api/profiles/me/links/${linkId}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    });
  },

  deleteLink(linkId: number) {
    return request(`/api/profiles/me/links/${linkId}`, { method: "DELETE" });
  },

  toggleLink(linkId: number) {
    return request<{ id: number; enabled: boolean }>(
      `/api/profiles/me/links/${linkId}/toggle`,
      { method: "PATCH" },
    );
  },

  reorderLinks(orderedIds: number[]) {
    return request<ProfileLinkResponse[]>("/api/profiles/me/links/order", {
      method: "PUT",
      body: JSON.stringify({ orderedIds }),
    });
  },

  // ─── 소셜 CRUD ───
  addSocial(data: { platform: string; url: string }) {
    return request<SocialLinkResponse>("/api/profiles/me/socials", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  updateSocial(socialId: number, data: { url: string }) {
    return request<SocialLinkResponse>(`/api/profiles/me/socials/${socialId}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    });
  },

  deleteSocial(socialId: number) {
    return request(`/api/profiles/me/socials/${socialId}`, { method: "DELETE" });
  },

  reorderSocials(orderedIds: number[]) {
    return request<SocialLinkResponse[]>("/api/profiles/me/socials/order", {
      method: "PUT",
      body: JSON.stringify({ orderedIds }),
    });
  },

};
