/* ─── SSE Client — 서버 이벤트 수신 + CustomEvent 발행 ─── */

export interface SseNewDeal {
  id: number;
  title: string;
  dealPrice: number | null;
  originalPrice: number | null;
  discountRate: number | null;
  imageUrl: string | null;
  nickname: string;
  store: string | null;
  likeCount: number;
  commentCount: number;
  clickCount: number;
  createdAt: string;
}

export interface SseDealUpdated {
  id: number;
  likeCount?: number | null;
  clickCount?: number | null;
  expiredVoteCount?: number | null;
  commentCount?: number | null;
}

export interface SseDealExpired {
  id: number;
}

export interface SseDealDeleted {
  id: number;
}

export interface SseNewComment {
  dealId: number;
  id: number;
  nickname: string;
  content: string;
  parentId: number | null;
  createdAt: string;
}

export interface SseCommentDeleted {
  dealId: number;
  id: number;
}

/* ─── Custom Event Names ─── */

export const SSE_EVENTS = {
  NEW_DEAL: "sse:new-deal",
  DEAL_UPDATED: "sse:deal-updated",
  DEAL_EXPIRED: "sse:deal-expired",
  DEAL_DELETED: "sse:deal-deleted",
  NEW_COMMENT: "sse:new-comment",
  COMMENT_DELETED: "sse:comment-deleted",
} as const;

/* ─── SSE Connection Manager ─── */

let eventSource: EventSource | null = null;
let reconnectTimer: ReturnType<typeof setTimeout> | null = null;

export function connectSse() {
  if (typeof window === "undefined") return;
  if (eventSource) return;

  // Next.js rewrite 프록시는 SSE를 버퍼링하므로 백엔드에 직접 연결
  // 현재 브라우저 호스트 기반으로 백엔드 URL 결정 (모바일/PC 모두 대응)
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || `http://${window.location.hostname}:8080`;
  eventSource = new EventSource(`${apiUrl}/api/events/stream`);

  eventSource.addEventListener("new-deal", (e) => {
    const data: SseNewDeal = JSON.parse(e.data);
    window.dispatchEvent(new CustomEvent(SSE_EVENTS.NEW_DEAL, { detail: data }));
  });

  eventSource.addEventListener("deal-updated", (e) => {
    const data: SseDealUpdated = JSON.parse(e.data);
    window.dispatchEvent(new CustomEvent(SSE_EVENTS.DEAL_UPDATED, { detail: data }));
  });

  eventSource.addEventListener("deal-expired", (e) => {
    const data: SseDealExpired = JSON.parse(e.data);
    window.dispatchEvent(new CustomEvent(SSE_EVENTS.DEAL_EXPIRED, { detail: data }));
  });

  eventSource.addEventListener("deal-deleted", (e) => {
    const data: SseDealDeleted = JSON.parse(e.data);
    window.dispatchEvent(new CustomEvent(SSE_EVENTS.DEAL_DELETED, { detail: data }));
  });

  eventSource.addEventListener("new-comment", (e) => {
    const data: SseNewComment = JSON.parse(e.data);
    window.dispatchEvent(new CustomEvent(SSE_EVENTS.NEW_COMMENT, { detail: data }));
  });

  eventSource.addEventListener("comment-deleted", (e) => {
    const data: SseCommentDeleted = JSON.parse(e.data);
    window.dispatchEvent(new CustomEvent(SSE_EVENTS.COMMENT_DELETED, { detail: data }));
  });

  eventSource.onerror = () => {
    eventSource?.close();
    eventSource = null;
    // 3초 후 재연결
    if (!reconnectTimer) {
      reconnectTimer = setTimeout(() => {
        reconnectTimer = null;
        connectSse();
      }, 3000);
    }
  };
}

export function disconnectSse() {
  if (reconnectTimer) {
    clearTimeout(reconnectTimer);
    reconnectTimer = null;
  }
  eventSource?.close();
  eventSource = null;
}
