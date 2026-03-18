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

async function request<T = null>(
  path: string,
  options: RequestInit = {},
): Promise<ApiResponse<T>> {
  const isPublic = PUBLIC_PATHS.some((p) => path.startsWith(p));
  const token = !isPublic && typeof window !== "undefined"
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
    return request("/api/auth/logout", { method: "POST" }).finally(() => {
      localStorage.removeItem("hddc-auth");
      localStorage.removeItem("hddc-token");
      localStorage.removeItem("hddc-user");
    });
  },
};
