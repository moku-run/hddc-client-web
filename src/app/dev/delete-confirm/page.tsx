"use client";

import { useState } from "react";
import { Heart, Trash } from "@phosphor-icons/react";
import { cn } from "@/lib/utils";
import { getAvatarColor } from "@/lib/avatar-color";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

function CommentRow({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-start gap-2 text-xs">
      <div className="flex size-5 shrink-0 items-center justify-center rounded-full text-[9px] font-bold text-white" style={{ backgroundColor: getAvatarColor("테크딜러") }}>
        테
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-baseline gap-1.5">
          <span className="font-semibold">테크딜러</span>
          <span className="text-[10px] text-muted-foreground/60">1시간 전</span>
        </div>
        <p className="mt-0.5 text-muted-foreground">이거 역대 최저가 맞나요?</p>
        <div className="mt-1 flex items-center gap-2">
          <button className="flex items-center gap-0.5 text-[10px] text-muted-foreground/60 hover:text-red-500">
            <Heart className="size-3" />3
          </button>
          <button className="text-[10px] text-muted-foreground/60">답글</button>
          {children}
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════
   A: 인라인 텍스트 (현재)
   ═══════════════════════════════════════════ */
function StyleA() {
  const [confirm, setConfirm] = useState(false);
  return (
    <CommentRow>
      {!confirm ? (
        <button onClick={() => setConfirm(true)} className="cursor-pointer text-[10px] text-muted-foreground/60 transition-colors hover:text-destructive">
          <Trash className="size-3" />
        </button>
      ) : (
        <span className="flex items-center gap-1 text-[10px]">
          <span className="text-destructive">삭제할까요?</span>
          <button onClick={() => setConfirm(false)} className="cursor-pointer font-semibold text-destructive hover:underline">확인</button>
          <button onClick={() => setConfirm(false)} className="cursor-pointer text-muted-foreground hover:text-foreground">취소</button>
        </span>
      )}
    </CommentRow>
  );
}

/* ═══════════════════════════════════════════
   B: 위쪽 수동 말풍선
   ═══════════════════════════════════════════ */
function StyleB() {
  const [confirm, setConfirm] = useState(false);
  return (
    <CommentRow>
      <div className="relative">
        <button onClick={() => setConfirm(!confirm)} className="cursor-pointer text-[10px] text-muted-foreground/60 transition-colors hover:text-destructive">
          <Trash className="size-3" />
        </button>
        {confirm && (
          <div className="absolute bottom-full left-1/2 z-10 mb-2 flex -translate-x-1/2 items-center gap-2 whitespace-nowrap rounded-lg border border-border bg-card px-3 py-1.5 shadow-lg">
            <div className="absolute -bottom-1.5 left-1/2 size-3 -translate-x-1/2 rotate-45 border-b border-r border-border bg-card" />
            <span className="text-[10px] font-medium">삭제할까요?</span>
            <button onClick={() => setConfirm(false)} className="cursor-pointer rounded-md bg-destructive px-2 py-0.5 text-[10px] font-medium text-white hover:bg-destructive/80">삭제</button>
            <button onClick={() => setConfirm(false)} className="cursor-pointer rounded-md bg-muted px-2 py-0.5 text-[10px] font-medium text-muted-foreground hover:text-foreground">취소</button>
          </div>
        )}
      </div>
    </CommentRow>
  );
}

/* ═══════════════════════════════════════════
   C: Popover 컴포넌트 — 위쪽
   ═══════════════════════════════════════════ */
function StyleC() {
  const [open, setOpen] = useState(false);
  return (
    <CommentRow>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <button className="cursor-pointer text-[10px] text-muted-foreground/60 transition-colors hover:text-destructive">
            <Trash className="size-3" />
          </button>
        </PopoverTrigger>
        <PopoverContent side="top" align="center" className="!w-auto flex-row items-center gap-2 whitespace-nowrap p-2">
          <span className="text-[10px] font-medium">삭제할까요?</span>
          <button onClick={() => setOpen(false)} className="cursor-pointer rounded-md bg-destructive px-2 py-0.5 text-[10px] font-medium text-white hover:bg-destructive/80">삭제</button>
          <button onClick={() => setOpen(false)} className="cursor-pointer rounded-md bg-muted px-2 py-0.5 text-[10px] font-medium text-muted-foreground hover:text-foreground">취소</button>
        </PopoverContent>
      </Popover>
    </CommentRow>
  );
}

/* ═══════════════════════════════════════════
   D: Popover 컴포넌트 — 아래쪽
   ═══════════════════════════════════════════ */
function StyleD() {
  const [open, setOpen] = useState(false);
  return (
    <CommentRow>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <button className="cursor-pointer text-[10px] text-muted-foreground/60 transition-colors hover:text-destructive">
            <Trash className="size-3" />
          </button>
        </PopoverTrigger>
        <PopoverContent side="bottom" align="center" className="!w-auto flex-row items-center gap-2 whitespace-nowrap p-2">
          <span className="text-[10px] font-medium">삭제할까요?</span>
          <button onClick={() => setOpen(false)} className="cursor-pointer rounded-md bg-destructive px-2 py-0.5 text-[10px] font-medium text-white hover:bg-destructive/80">삭제</button>
          <button onClick={() => setOpen(false)} className="cursor-pointer rounded-md bg-muted px-2 py-0.5 text-[10px] font-medium text-muted-foreground hover:text-foreground">취소</button>
        </PopoverContent>
      </Popover>
    </CommentRow>
  );
}

/* ═══════════════════════════════════════════
   E: Popover 컴포넌트 — 우측
   ═══════════════════════════════════════════ */
function StyleE() {
  const [open, setOpen] = useState(false);
  return (
    <CommentRow>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <button className="cursor-pointer text-[10px] text-muted-foreground/60 transition-colors hover:text-destructive">
            <Trash className="size-3" />
          </button>
        </PopoverTrigger>
        <PopoverContent side="right" align="center" className="!w-auto flex-row items-center gap-2 whitespace-nowrap p-2">
          <span className="text-[10px] font-medium">삭제할까요?</span>
          <button onClick={() => setOpen(false)} className="cursor-pointer rounded-md bg-destructive px-2 py-0.5 text-[10px] font-medium text-white hover:bg-destructive/80">삭제</button>
          <button onClick={() => setOpen(false)} className="cursor-pointer rounded-md bg-muted px-2 py-0.5 text-[10px] font-medium text-muted-foreground hover:text-foreground">취소</button>
        </PopoverContent>
      </Popover>
    </CommentRow>
  );
}

/* ═══════════════════════════════════════════
   F: Popover — 버튼만 (텍스트 없음)
   ═══════════════════════════════════════════ */
function StyleF() {
  const [open, setOpen] = useState(false);
  return (
    <CommentRow>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <button className="cursor-pointer text-[10px] text-muted-foreground/60 transition-colors hover:text-destructive">
            <Trash className="size-3" />
          </button>
        </PopoverTrigger>
        <PopoverContent side="top" align="center" className="!w-auto flex-row items-center gap-1.5 whitespace-nowrap p-1.5">
          <button onClick={() => setOpen(false)} className="cursor-pointer rounded bg-destructive px-2.5 py-0.5 text-[9px] font-medium text-white hover:bg-destructive/80">삭제</button>
          <button onClick={() => setOpen(false)} className="cursor-pointer rounded bg-muted px-2.5 py-0.5 text-[9px] font-medium text-muted-foreground hover:text-foreground">취소</button>
        </PopoverContent>
      </Popover>
    </CommentRow>
  );
}

/* ═══════════════════════════════════════════
   G: Popover 미니 — 아래쪽
   ═══════════════════════════════════════════ */
function StyleG() {
  const [open, setOpen] = useState(false);
  return (
    <CommentRow>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <button className="cursor-pointer text-[10px] text-muted-foreground/60 transition-colors hover:text-destructive">
            <Trash className="size-3" />
          </button>
        </PopoverTrigger>
        <PopoverContent side="bottom" align="center" className="!w-auto flex-row items-center gap-1.5 whitespace-nowrap p-1.5">
          <button onClick={() => setOpen(false)} className="cursor-pointer rounded bg-destructive px-2.5 py-0.5 text-[9px] font-medium text-white hover:bg-destructive/80">삭제</button>
          <button onClick={() => setOpen(false)} className="cursor-pointer rounded bg-muted px-2.5 py-0.5 text-[9px] font-medium text-muted-foreground hover:text-foreground">취소</button>
        </PopoverContent>
      </Popover>
    </CommentRow>
  );
}

/* ═══════════════════════════════════════════
   H: Popover 미니 — 우측
   ═══════════════════════════════════════════ */
function StyleH() {
  const [open, setOpen] = useState(false);
  return (
    <CommentRow>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <button className="cursor-pointer text-[10px] text-muted-foreground/60 transition-colors hover:text-destructive">
            <Trash className="size-3" />
          </button>
        </PopoverTrigger>
        <PopoverContent side="right" align="center" className="!w-auto flex-row items-center gap-1.5 whitespace-nowrap p-1.5">
          <button onClick={() => setOpen(false)} className="cursor-pointer rounded bg-destructive px-2.5 py-0.5 text-[9px] font-medium text-white hover:bg-destructive/80">삭제</button>
          <button onClick={() => setOpen(false)} className="cursor-pointer rounded bg-muted px-2.5 py-0.5 text-[9px] font-medium text-muted-foreground hover:text-foreground">취소</button>
        </PopoverContent>
      </Popover>
    </CommentRow>
  );
}

/* ═══════════════════════════════════════════ */

const STYLES = [
  { name: "A", label: "현재 — 인라인 텍스트", desc: "컴포넌트 미사용. 같은 줄에 텍스트", Component: StyleA },
  { name: "B", label: "수동 말풍선 (위쪽)", desc: "CSS 직접 구현. 화살표 포함", Component: StyleB },
  { name: "C", label: "Popover 위쪽", desc: "ui/popover 컴포넌트 사용. 바깥 클릭 닫기 + 애니메이션", Component: StyleC },
  { name: "D", label: "Popover 아래쪽", desc: "ui/popover side=bottom", Component: StyleD },
  { name: "E", label: "Popover 우측", desc: "ui/popover side=right", Component: StyleE },
  { name: "F", label: "Popover 미니 위쪽", desc: "ui/popover side=top — [삭제] [취소] 버튼만", Component: StyleF },
  { name: "G", label: "Popover 미니 아래쪽", desc: "ui/popover side=bottom — [삭제] [취소] 버튼만", Component: StyleG },
  { name: "H", label: "Popover 미니 우측", desc: "ui/popover side=right — [삭제] [취소] 가로", Component: StyleH },
];

export default function DeleteConfirmPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <h1 className="mb-2 text-2xl font-bold">댓글 삭제 확인 디자인</h1>
      <p className="mb-2 text-sm text-muted-foreground">🗑 버튼 클릭 시 나타나는 확인 UI. A~B는 수동 구현, C~F는 Popover 컴포넌트 사용.</p>
      <p className="mb-8 text-xs text-muted-foreground/60">Popover: 바깥 클릭 자동 닫기 + fade/zoom 애니메이션 + 위치 자동 계산</p>

      <div className="flex flex-col gap-8">
        {STYLES.map(({ name, label, desc, Component }) => (
          <div key={name}>
            <div className="mb-3 flex items-center gap-2">
              <span className="flex size-6 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">{name}</span>
              <div>
                <p className="text-sm font-semibold">{label}</p>
                <p className="text-[10px] text-muted-foreground">{desc}</p>
              </div>
            </div>
            <div className="rounded-lg border border-dashed border-border bg-card p-4">
              <Component />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
