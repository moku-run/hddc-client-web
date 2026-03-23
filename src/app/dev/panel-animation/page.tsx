"use client";

import { useState } from "react";
import { X, ChatCircle } from "@phosphor-icons/react";
import { cn } from "@/lib/utils";

function Panel({ open, onClose, className, label }: { open: boolean; onClose: () => void; className: string; label: string }) {
  return (
    <>
      {open && <div className="fixed inset-0 z-40 bg-black/20" onClick={onClose} />}
      <div className={cn(
        "fixed right-0 top-0 z-50 flex h-full w-full max-w-[420px] flex-col border-l border-border bg-card shadow-xl",
        className,
        open ? "" : "pointer-events-none",
      )}>
        <div className="flex items-center justify-between border-b border-border px-4 py-3">
          <h4 className="text-sm font-semibold">댓글 패널 — {label}</h4>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground"><X className="size-4" /></button>
        </div>
        <div className="flex flex-1 items-center justify-center text-sm text-muted-foreground">
          댓글 영역
        </div>
      </div>
    </>
  );
}

/* ═══════════════════════════════════════════
   A: translate-x slide (CSS transition)
   ═══════════════════════════════════════════ */
function StyleA() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button onClick={() => setOpen(true)} className="flex items-center gap-1 rounded-md bg-muted px-3 py-1.5 text-xs font-medium text-muted-foreground hover:text-foreground">
        <ChatCircle className="size-4" />댓글 열기
      </button>
      <Panel
        open={open}
        onClose={() => setOpen(false)}
        label="slide (300ms)"
        className={cn(
          "transition-transform duration-300 ease-out",
          open ? "translate-x-0" : "translate-x-full",
        )}
      />
    </>
  );
}

/* ═══════════════════════════════════════════
   B: slide + fade
   ═══════════════════════════════════════════ */
function StyleB() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button onClick={() => setOpen(true)} className="flex items-center gap-1 rounded-md bg-muted px-3 py-1.5 text-xs font-medium text-muted-foreground hover:text-foreground">
        <ChatCircle className="size-4" />댓글 열기
      </button>
      <Panel
        open={open}
        onClose={() => setOpen(false)}
        label="slide + fade (300ms)"
        className={cn(
          "transition-all duration-300 ease-out",
          open ? "translate-x-0 opacity-100" : "translate-x-full opacity-0",
        )}
      />
    </>
  );
}

/* ═══════════════════════════════════════════
   C: slide 빠르게 (200ms)
   ═══════════════════════════════════════════ */
function StyleC() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button onClick={() => setOpen(true)} className="flex items-center gap-1 rounded-md bg-muted px-3 py-1.5 text-xs font-medium text-muted-foreground hover:text-foreground">
        <ChatCircle className="size-4" />댓글 열기
      </button>
      <Panel
        open={open}
        onClose={() => setOpen(false)}
        label="slide fast (200ms)"
        className={cn(
          "transition-transform duration-200 ease-out",
          open ? "translate-x-0" : "translate-x-full",
        )}
      />
    </>
  );
}

/* ═══════════════════════════════════════════
   D: slide 느리게 (500ms ease-in-out)
   ═══════════════════════════════════════════ */
function StyleD() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button onClick={() => setOpen(true)} className="flex items-center gap-1 rounded-md bg-muted px-3 py-1.5 text-xs font-medium text-muted-foreground hover:text-foreground">
        <ChatCircle className="size-4" />댓글 열기
      </button>
      <Panel
        open={open}
        onClose={() => setOpen(false)}
        label="slide slow (500ms ease-in-out)"
        className={cn(
          "transition-transform duration-500 ease-in-out",
          open ? "translate-x-0" : "translate-x-full",
        )}
      />
    </>
  );
}

/* ═══════════════════════════════════════════
   E: slide + shadow grow
   ═══════════════════════════════════════════ */
function StyleE() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button onClick={() => setOpen(true)} className="flex items-center gap-1 rounded-md bg-muted px-3 py-1.5 text-xs font-medium text-muted-foreground hover:text-foreground">
        <ChatCircle className="size-4" />댓글 열기
      </button>
      <Panel
        open={open}
        onClose={() => setOpen(false)}
        label="slide + shadow (300ms)"
        className={cn(
          "transition-all duration-300 ease-out",
          open ? "translate-x-0 shadow-2xl" : "translate-x-full shadow-none",
        )}
      />
    </>
  );
}

/* ═══════════════════════════════════════════
   F: slide 살짝만 (translate-x-1/4 → 0)
   ═══════════════════════════════════════════ */
function StyleF() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button onClick={() => setOpen(true)} className="flex items-center gap-1 rounded-md bg-muted px-3 py-1.5 text-xs font-medium text-muted-foreground hover:text-foreground">
        <ChatCircle className="size-4" />댓글 열기
      </button>
      <Panel
        open={open}
        onClose={() => setOpen(false)}
        label="partial slide + fade (250ms)"
        className={cn(
          "transition-all duration-250 ease-out",
          open ? "translate-x-0 opacity-100" : "translate-x-1/4 opacity-0",
        )}
      />
    </>
  );
}

/* ═══════════════════════════════════════════ */

const STYLES = [
  { name: "A", label: "slide (300ms)", desc: "우측에서 좌측으로 슬라이드. 기본", Component: StyleA },
  { name: "B", label: "slide + fade (300ms)", desc: "슬라이드 + 페이드 인 동시", Component: StyleB },
  { name: "C", label: "slide fast (200ms)", desc: "빠른 슬라이드. 반응 즉각적", Component: StyleC },
  { name: "D", label: "slide slow (500ms)", desc: "느린 슬라이드. 부드러운 느낌", Component: StyleD },
  { name: "E", label: "slide + shadow (300ms)", desc: "슬라이드 + 그림자 커짐", Component: StyleE },
  { name: "F", label: "partial slide + fade (250ms)", desc: "살짝만 밀려오며 페이드 인", Component: StyleF },
];

export default function PanelAnimationPage() {
  return (
    <div className="mx-auto max-w-xl px-4 py-8">
      <h1 className="mb-2 text-2xl font-bold">댓글 패널 슬라이드 애니메이션</h1>
      <p className="mb-8 text-sm text-muted-foreground">각 버튼을 클릭하면 실제 패널이 열립니다. X 또는 바깥 클릭으로 닫기.</p>

      <div className="flex flex-col gap-6">
        {STYLES.map(({ name, label, desc, Component }) => (
          <div key={name} className="flex items-center gap-4">
            <div className="w-56 shrink-0">
              <div className="flex items-center gap-2">
                <span className="flex size-6 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">{name}</span>
                <p className="text-sm font-semibold">{label}</p>
              </div>
              <p className="mt-0.5 pl-8 text-[10px] text-muted-foreground">{desc}</p>
            </div>
            <Component />
          </div>
        ))}
      </div>
    </div>
  );
}
