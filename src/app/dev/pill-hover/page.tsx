"use client";

import { useState } from "react";
import { Heart, XCircle } from "@phosphor-icons/react";
import { ActionPill } from "@/components/ui/action-pill";

function Row({ name, label, likeHover, expiredHover }: { name: string; label: string; likeHover: string; expiredHover: string }) {
  const [liked, setLiked] = useState(false);
  const [expired, setExpired] = useState(false);
  return (
    <div>
      <div className="mb-2 flex items-center gap-2">
        <span className="flex size-6 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">{name}</span>
        <p className="text-sm font-semibold">{label}</p>
      </div>
      <div className="flex items-center gap-3 rounded-lg border border-dashed border-border bg-card px-4 py-3">
        <ActionPill icon={Heart} label="좋아요" active={liked} activeClassName="bg-red-500 text-white" hoverClassName={likeHover} onClick={() => setLiked(!liked)} />
        <ActionPill icon={XCircle} label="끝났어요" active={expired} activeClassName="bg-orange-500 text-white" hoverClassName={expiredHover} onClick={() => setExpired(!expired)} />
        <span className="ml-4 text-[10px] text-muted-foreground">← hover 해보세요</span>
      </div>
    </div>
  );
}

const STYLES = [
  { name: "1", label: "현재 — hover:text-foreground (기본색)", likeHover: "hover:text-foreground", expiredHover: "hover:text-foreground" },
  { name: "2", label: "각각 컬러 — 빨강 / 주황", likeHover: "hover:text-red-500", expiredHover: "hover:text-orange-500" },
  { name: "3", label: "각각 컬러 (연하게) — 빨강 400 / 주황 400", likeHover: "hover:text-red-400", expiredHover: "hover:text-orange-400" },
  { name: "4", label: "각각 컬러 (진하게) — 빨강 600 / 주황 600", likeHover: "hover:text-red-600", expiredHover: "hover:text-orange-600" },
  { name: "5", label: "primary — 둘 다 primary 색상", likeHover: "hover:text-primary", expiredHover: "hover:text-primary" },
  { name: "6", label: "빨강 / 노랑", likeHover: "hover:text-red-500", expiredHover: "hover:text-yellow-500" },
  { name: "7", label: "핑크 / 주황", likeHover: "hover:text-pink-500", expiredHover: "hover:text-orange-500" },
];

export default function PillHoverPage() {
  return (
    <div className="mx-auto max-w-xl px-4 py-8">
      <h1 className="mb-2 text-2xl font-bold">ActionPill Hover 색상 비교</h1>
      <p className="mb-8 text-sm text-muted-foreground">비활성 상태에서 hover 시 텍스트+아이콘 색상. 클릭하면 active 상태 확인.</p>

      <div className="flex flex-col gap-6">
        {STYLES.map((s) => <Row key={s.name} {...s} />)}
      </div>
    </div>
  );
}
