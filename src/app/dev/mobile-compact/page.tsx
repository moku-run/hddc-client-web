"use client";

import { useState } from "react";
import { Heart, ChatCircle, Fire, CursorClick, XCircle, DotsThreeVertical, Flag } from "@phosphor-icons/react";
import { cn } from "@/lib/utils";

/* ─── Sample data (8개) ─── */

const DEALS = [
  { title: "쿠팡 로켓와우 멤버십 첫 달 무료", op: 7890, dp: 0, dr: 100, nick: "HDDC", store: "쿠팡", likes: 634, views: 330, comments: 152, time: "3일 전", hot: true },
  { title: "[단독특가] Apple 에어팟 프로 2세대 (USB-C) 역대 최저가", op: 289000, dp: 199000, dr: 31, nick: "테크딜러", store: "쿠팡", likes: 124, views: 1200, comments: 18, time: "2시간 전", hot: true },
  { title: "안양축협 한돈 삼겹살 1kg", op: null, dp: 18900, dr: null, nick: "HDDC Bot", store: null, likes: 3, views: 45, comments: 0, time: "5시간 전", hot: false },
  { title: "나이키 에어맥스 97 올블랙 한정판", op: 199000, dp: 139000, dr: 30, nick: "패션헌터", store: "무신사", likes: 89, views: 560, comments: 7, time: "1시간 전", hot: true },
  { title: "LG 그램 17 2026 i7/16GB/512GB", op: 1890000, dp: 1490000, dr: 21, nick: "테크딜러", store: "11번가", likes: 201, views: 2300, comments: 42, time: "30분 전", hot: true },
  { title: "스타벅스 아메리카노 T 10잔 쿠폰", op: 45000, dp: 33000, dr: 27, nick: "HDDC", store: "카카오", likes: 56, views: 890, comments: 12, time: "4시간 전", hot: true },
  { title: "다이슨 V15 디텍트 무선청소기", op: 1090000, dp: 790000, dr: 28, nick: "가전마스터", store: "쿠팡", likes: 312, views: 4100, comments: 67, time: "1일 전", hot: true },
  { title: "곰곰 무항생제 신선 계란 30구", op: null, dp: 6980, dr: null, nick: "HDDC Bot", store: "쿠팡", likes: 15, views: 120, comments: 2, time: "6시간 전", hot: false },
];

type Deal = (typeof DEALS)[0];

function fp(n: number) { return n.toLocaleString("ko-KR"); }
function fc(n: number) { return n >= 1000 ? `${(n / 1000).toFixed(1)}k` : String(n); }

/* ─── Phone frame ─── */

function PhoneFrame({ children, label }: { children: React.ReactNode; label: string }) {
  return (
    <div className="flex flex-col items-center gap-2">
      <p className="text-xs font-medium text-muted-foreground">{label}</p>
      <div className="h-[680px] w-[345px] overflow-hidden rounded-[2rem] border-4 border-zinc-800 bg-background shadow-xl">
        <div className="flex h-full flex-col">
          <div className="flex h-6 items-center justify-center bg-background text-[9px] text-muted-foreground">9:41</div>
          <div className="flex-1 overflow-y-auto">{children}</div>
        </div>
      </div>
    </div>
  );
}

/* ─── 3dot popover (공용) ─── */

function DotMenu({ deal, open, onToggle }: { deal: Deal; open: boolean; onToggle: () => void }) {
  return (
    <div className="absolute right-1 top-1 z-10">
      <button onClick={(e) => { e.preventDefault(); onToggle(); }} className="rounded-full bg-black/40 p-0.5 text-white backdrop-blur-sm transition-colors hover:bg-black/60">
        <DotsThreeVertical className="size-4" weight="bold" />
      </button>
      {open && (
        <div className="absolute right-0 top-full mt-1 w-32 overflow-hidden rounded-lg border border-border bg-card shadow-lg">
          <button className="flex w-full items-center gap-2 px-3 py-2 text-xs text-foreground hover:bg-muted">
            <Heart className="size-3.5 text-muted-foreground" />좋아요
          </button>
          <button className="flex w-full items-center gap-2 px-3 py-2 text-xs text-foreground hover:bg-muted">
            <ChatCircle className="size-3.5 text-muted-foreground" />댓글 {deal.comments}
          </button>
          <button className="flex w-full items-center gap-2 px-3 py-2 text-xs text-foreground hover:bg-muted">
            <XCircle className="size-3.5 text-muted-foreground" />끝났어요
          </button>
          <div className="border-t border-border" />
          <button className="flex w-full items-center gap-2 px-3 py-2 text-xs text-muted-foreground hover:bg-muted">
            <Flag className="size-3.5" />신고
          </button>
        </div>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   A: 이미지 w-20(80px) + ⋮ 이미지 위 + 메타에 좋아요/댓글 수
   ═══════════════════════════════════════════════════════════ */

function CardA({ deal }: { deal: Deal }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const hasDisc = deal.op != null && deal.dp != null && deal.op > deal.dp;
  return (
    <div className="relative flex overflow-hidden rounded-lg border-t border-border/50 bg-card shadow-sm">
      <div className="relative w-20 shrink-0 self-stretch bg-foreground text-xs font-bold text-background flex items-center justify-center">
        핫딜닷쿨
        {deal.hot && <span className="absolute left-0.5 top-0.5 flex items-center gap-0.5 rounded-full bg-gradient-to-r from-red-600 to-orange-500 px-1 py-0 text-[7px] font-bold text-white"><Fire className="size-2" weight="fill" />HOT</span>}
        <DotMenu deal={deal} open={menuOpen} onToggle={() => setMenuOpen(!menuOpen)} />
      </div>
      <div className="flex min-w-0 flex-1 flex-col justify-center px-2 py-1.5">
        <p className="truncate text-sm font-semibold leading-snug">{deal.title}</p>
        <div className="mt-0.5 flex items-baseline gap-1">
          {hasDisc && deal.dr != null && <span className="text-xs font-bold text-red-500">{deal.dr}%</span>}
          <span className="text-sm font-bold">{fp(deal.dp!)}원</span>
          {hasDisc && <span className="text-[10px] text-muted-foreground line-through">{fp(deal.op!)}원</span>}
        </div>
        <span className="mt-0.5 flex items-center gap-1.5 text-[10px] text-muted-foreground">
          <Heart className="size-2.5" />{deal.likes} · <ChatCircle className="size-2.5" />{deal.comments} · {deal.store ?? deal.nick} · {deal.time}
        </span>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   B: 이미지 w-16(64px) + ⋮ 카드 우측 상단 + 더 콤팩트
   ═══════════════════════════════════════════════════════════ */

function CardB({ deal }: { deal: Deal }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const hasDisc = deal.op != null && deal.dp != null && deal.op > deal.dp;
  return (
    <div className="relative flex overflow-hidden rounded-lg bg-card shadow-sm">
      <div className="relative w-16 shrink-0 self-stretch bg-foreground text-[10px] font-bold text-background flex items-center justify-center">
        핫딜닷쿨
        {deal.hot && <span className="absolute left-0.5 top-0.5 rounded-full bg-red-500 p-0.5"><Fire className="size-2" weight="fill" /></span>}
      </div>
      <div className="flex min-w-0 flex-1 flex-col justify-center px-2 py-1.5 pr-7">
        <p className="truncate text-[13px] font-semibold leading-snug">{deal.title}</p>
        <div className="mt-0.5 flex items-baseline gap-1">
          {hasDisc && deal.dr != null && <span className="text-xs font-bold text-red-500">{deal.dr}%</span>}
          <span className="text-[13px] font-bold">{fp(deal.dp!)}원</span>
          {hasDisc && <span className="text-[10px] text-muted-foreground line-through">{fp(deal.op!)}원</span>}
        </div>
        <span className="mt-0.5 flex items-center gap-1.5 text-[10px] text-muted-foreground">
          <Heart className="size-2.5" />{deal.likes} · <ChatCircle className="size-2.5" />{deal.comments} · {deal.time}
        </span>
      </div>
      {/* ⋮ 카드 우측 상단 */}
      <div className="absolute right-1 top-1">
        <button onClick={() => setMenuOpen(!menuOpen)} className="rounded-full p-0.5 text-muted-foreground transition-colors hover:text-foreground">
          <DotsThreeVertical className="size-4" weight="bold" />
        </button>
        {menuOpen && (
          <div className="absolute right-0 top-full mt-1 w-32 overflow-hidden rounded-lg border border-border bg-card shadow-lg">
            <button className="flex w-full items-center gap-2 px-3 py-2 text-xs text-foreground hover:bg-muted"><Heart className="size-3.5 text-muted-foreground" />좋아요</button>
            <button className="flex w-full items-center gap-2 px-3 py-2 text-xs text-foreground hover:bg-muted"><ChatCircle className="size-3.5 text-muted-foreground" />댓글 {deal.comments}</button>
            <button className="flex w-full items-center gap-2 px-3 py-2 text-xs text-foreground hover:bg-muted"><XCircle className="size-3.5 text-muted-foreground" />끝났어요</button>
            <div className="border-t border-border" />
            <button className="flex w-full items-center gap-2 px-3 py-2 text-xs text-muted-foreground hover:bg-muted"><Flag className="size-3.5" />신고</button>
          </div>
        )}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   C: 이미지 w-20 + ⋮ 콘텐츠 우측 상단 + 가격/메타 한 줄
   ═══════════════════════════════════════════════════════════ */

function CardC({ deal }: { deal: Deal }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const hasDisc = deal.op != null && deal.dp != null && deal.op > deal.dp;
  return (
    <div className="relative flex overflow-hidden rounded-lg border-t border-border/50 bg-card shadow-sm">
      <div className="relative w-20 shrink-0 self-stretch bg-foreground text-xs font-bold text-background flex items-center justify-center">
        핫딜닷쿨
        {deal.hot && <span className="absolute left-0.5 top-0.5 flex items-center gap-0.5 rounded-full bg-gradient-to-r from-red-600 to-orange-500 px-1 py-0 text-[7px] font-bold text-white"><Fire className="size-2" weight="fill" />HOT</span>}
      </div>
      <div className="flex min-w-0 flex-1 flex-col justify-center px-2.5 py-2 pr-7">
        <p className="truncate text-sm font-semibold leading-snug">{deal.title}</p>
        <div className="mt-1 flex items-center justify-between">
          <span className="flex items-baseline gap-1">
            {hasDisc && deal.dr != null && <span className="text-xs font-bold text-red-500">{deal.dr}%</span>}
            <span className="text-sm font-bold">{fp(deal.dp!)}원</span>
            {hasDisc && <span className="text-[10px] text-muted-foreground line-through">{fp(deal.op!)}원</span>}
          </span>
          <span className="flex items-center gap-1.5 text-[10px] text-muted-foreground">
            <Heart className="size-2.5" />{deal.likes} · {deal.time}
          </span>
        </div>
      </div>
      {/* ⋮ 콘텐츠 우측 상단 */}
      <div className="absolute right-1 top-1">
        <button onClick={() => setMenuOpen(!menuOpen)} className="rounded-full p-0.5 text-muted-foreground transition-colors hover:text-foreground">
          <DotsThreeVertical className="size-4" weight="bold" />
        </button>
        {menuOpen && (
          <div className="absolute right-0 top-full mt-1 w-32 overflow-hidden rounded-lg border border-border bg-card shadow-lg">
            <button className="flex w-full items-center gap-2 px-3 py-2 text-xs text-foreground hover:bg-muted"><Heart className="size-3.5 text-muted-foreground" />좋아요</button>
            <button className="flex w-full items-center gap-2 px-3 py-2 text-xs text-foreground hover:bg-muted"><ChatCircle className="size-3.5 text-muted-foreground" />댓글 {deal.comments}</button>
            <button className="flex w-full items-center gap-2 px-3 py-2 text-xs text-foreground hover:bg-muted"><XCircle className="size-3.5 text-muted-foreground" />끝났어요</button>
            <div className="border-t border-border" />
            <button className="flex w-full items-center gap-2 px-3 py-2 text-xs text-muted-foreground hover:bg-muted"><Flag className="size-3.5" />신고</button>
          </div>
        )}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   D: 이미지 w-20 + ⋮ 이미지 위 오버레이 + 3줄 (제목/가격/메타)
   ═══════════════════════════════════════════════════════════ */

function CardD({ deal }: { deal: Deal }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const hasDisc = deal.op != null && deal.dp != null && deal.op > deal.dp;
  return (
    <div className="relative flex overflow-hidden rounded-lg bg-card shadow-sm">
      <div className="relative w-20 shrink-0 self-stretch bg-foreground text-xs font-bold text-background flex items-center justify-center">
        핫딜닷쿨
        {deal.hot && <span className="absolute left-0.5 top-0.5 flex items-center gap-0.5 rounded-full bg-gradient-to-r from-red-600 to-orange-500 px-1 py-0 text-[7px] font-bold text-white"><Fire className="size-2" weight="fill" />HOT</span>}
        {/* ⋮ 이미지 우측 하단 오버레이 */}
        <div className="absolute bottom-0.5 right-0.5">
          <button onClick={(e) => { e.preventDefault(); setMenuOpen(!menuOpen); }} className="rounded-full bg-black/50 p-0.5 text-white/80 backdrop-blur-sm">
            <DotsThreeVertical className="size-3.5" weight="bold" />
          </button>
          {menuOpen && (
            <div className="absolute bottom-full right-0 mb-1 w-32 overflow-hidden rounded-lg border border-border bg-card shadow-lg">
              <button className="flex w-full items-center gap-2 px-3 py-2 text-xs text-foreground hover:bg-muted"><Heart className="size-3.5 text-muted-foreground" />좋아요</button>
              <button className="flex w-full items-center gap-2 px-3 py-2 text-xs text-foreground hover:bg-muted"><ChatCircle className="size-3.5 text-muted-foreground" />댓글 {deal.comments}</button>
              <button className="flex w-full items-center gap-2 px-3 py-2 text-xs text-foreground hover:bg-muted"><XCircle className="size-3.5 text-muted-foreground" />끝났어요</button>
              <div className="border-t border-border" />
              <button className="flex w-full items-center gap-2 px-3 py-2 text-xs text-muted-foreground hover:bg-muted"><Flag className="size-3.5" />신고</button>
            </div>
          )}
        </div>
      </div>
      <div className="flex min-w-0 flex-1 flex-col justify-center px-2.5 py-1.5">
        <p className="truncate text-sm font-semibold leading-snug">{deal.title}</p>
        <div className="mt-0.5 flex items-baseline gap-1">
          {hasDisc && deal.dr != null && <span className="text-xs font-bold text-red-500">{deal.dr}%</span>}
          <span className="text-sm font-bold">{fp(deal.dp!)}원</span>
          {hasDisc && <span className="text-[10px] text-muted-foreground line-through">{fp(deal.op!)}원</span>}
        </div>
        <span className="mt-0.5 flex items-center justify-between text-[10px] text-muted-foreground">
          <span className="flex items-center gap-1.5"><Heart className="size-2.5" />{deal.likes} <ChatCircle className="size-2.5" />{deal.comments}</span>
          <span>{deal.store ?? deal.nick} · {deal.time}</span>
        </span>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   E: 이미지 w-16(64px) 정사각 + ⋮ 콘텐츠 우측 + 초콤팩트
   ═══════════════════════════════════════════════════════════ */

function CardE({ deal }: { deal: Deal }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const hasDisc = deal.op != null && deal.dp != null && deal.op > deal.dp;
  return (
    <div className="relative flex items-center gap-2 rounded-lg bg-card px-1.5 py-1.5 shadow-sm">
      <div className="relative size-14 shrink-0 overflow-hidden rounded-md bg-foreground text-[9px] font-bold text-background flex items-center justify-center">
        핫딜닷쿨
        {deal.hot && <span className="absolute left-0 top-0 rounded-br-md bg-red-500 px-0.5 text-[6px] font-bold text-white">HOT</span>}
      </div>
      <div className="min-w-0 flex-1 pr-5">
        <p className="truncate text-[13px] font-semibold">{deal.title}</p>
        <div className="flex items-center justify-between">
          <span className="flex items-baseline gap-1">
            {hasDisc && deal.dr != null && <span className="text-[11px] font-bold text-red-500">{deal.dr}%</span>}
            <span className="text-[13px] font-bold">{fp(deal.dp!)}원</span>
          </span>
          <span className="flex items-center gap-1 text-[9px] text-muted-foreground">
            <Heart className="size-2" />{deal.likes} · {deal.time}
          </span>
        </div>
      </div>
      <div className="absolute right-1.5 top-1.5">
        <button onClick={() => setMenuOpen(!menuOpen)} className="rounded-full p-0.5 text-muted-foreground hover:text-foreground">
          <DotsThreeVertical className="size-4" weight="bold" />
        </button>
        {menuOpen && (
          <div className="absolute right-0 top-full mt-1 w-32 overflow-hidden rounded-lg border border-border bg-card shadow-lg z-20">
            <button className="flex w-full items-center gap-2 px-3 py-2 text-xs text-foreground hover:bg-muted"><Heart className="size-3.5 text-muted-foreground" />좋아요</button>
            <button className="flex w-full items-center gap-2 px-3 py-2 text-xs text-foreground hover:bg-muted"><ChatCircle className="size-3.5 text-muted-foreground" />댓글 {deal.comments}</button>
            <button className="flex w-full items-center gap-2 px-3 py-2 text-xs text-foreground hover:bg-muted"><XCircle className="size-3.5 text-muted-foreground" />끝났어요</button>
            <div className="border-t border-border" />
            <button className="flex w-full items-center gap-2 px-3 py-2 text-xs text-muted-foreground hover:bg-muted"><Flag className="size-3.5" />신고</button>
          </div>
        )}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   Page
   ═══════════════════════════════════════════════════════════ */

const STYLES = [
  { name: "A", label: "이미지 80px + ⋮ 이미지 위", render: () => <div className="flex flex-col gap-2 px-3 py-3">{DEALS.map((d, i) => <CardA key={i} deal={d} />)}</div> },
  { name: "B", label: "이미지 64px + ⋮ 카드 우측 상단", render: () => <div className="flex flex-col gap-2 px-3 py-3">{DEALS.map((d, i) => <CardB key={i} deal={d} />)}</div> },
  { name: "C", label: "이미지 80px + ⋮ 우측 상단 + 가격/메타 한 줄", render: () => <div className="flex flex-col gap-2 px-3 py-3">{DEALS.map((d, i) => <CardC key={i} deal={d} />)}</div> },
  { name: "D", label: "이미지 80px + ⋮ 이미지 우하단 오버레이", render: () => <div className="flex flex-col gap-2 px-3 py-3">{DEALS.map((d, i) => <CardD key={i} deal={d} />)}</div> },
  { name: "E", label: "이미지 56px 정사각 + ⋮ 카드 우측 (초콤팩트)", render: () => <div className="flex flex-col gap-1.5 px-2 py-2">{DEALS.map((d, i) => <CardE key={i} deal={d} />)}</div> },
];

export default function MobileCompactPage() {
  return (
    <div className="min-h-screen bg-muted/30 py-8">
      <div className="mx-auto max-w-[1400px] px-6">
        <h1 className="mb-2 text-2xl font-bold">모바일 콤팩트 카드 — ⋮ 메뉴 비교</h1>
        <p className="mb-8 text-sm text-muted-foreground">
          액션바 제거 → ⋮ 버튼으로 좋아요/끝났어요/댓글 접근. 345px 폰 프레임에서 ⋮ 클릭해보세요.
        </p>

        <div className="flex flex-wrap justify-center gap-8">
          {STYLES.map(({ name, label, render }) => (
            <div key={name} className="flex flex-col items-center gap-2">
              <div className="flex items-center gap-2">
                <span className="flex size-7 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">{name}</span>
                <h2 className="max-w-[300px] text-sm font-semibold">{label}</h2>
              </div>
              <PhoneFrame label="">
                {render()}
              </PhoneFrame>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
