"use client";

import { useState } from "react";
import { PaperPlaneTilt } from "@phosphor-icons/react";
import { cn } from "@/lib/utils";

function MockInput({ className, style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <div className={cn("flex items-end gap-2 border-t border-border px-4 py-3", className)} style={style}>
      <textarea
        placeholder="댓글을 입력하세요..."
        rows={4}
        className="max-h-32 flex-1 resize-none rounded-md border border-input bg-transparent px-3 py-2 text-xs outline-none scrollbar-none placeholder:text-muted-foreground focus:border-primary focus:ring-1 focus:ring-primary/30"
      />
      <button className="flex size-8 items-center justify-center rounded-md bg-primary text-primary-foreground">
        <PaperPlaneTilt className="size-3.5" />
      </button>
    </div>
  );
}

/* ═══════════════════════════════════════════
   A: fade-in
   ═══════════════════════════════════════════ */
function StyleA() {
  const [show, setShow] = useState(false);
  return (
    <div className="flex flex-col">
      <button onClick={() => setShow(!show)} className="self-center rounded-md bg-muted px-3 py-1 text-[10px] font-medium text-muted-foreground">
        {show ? "대댓글 입력 닫기" : "대댓글 입력 열기 (답글 클릭 시뮬)"}
      </button>
      <div className="mt-4 rounded-lg border border-border bg-card">
        <div className="p-4 text-xs text-muted-foreground">댓글 영역...</div>
        {!show && (
          <MockInput className="animate-in fade-in duration-300" />
        )}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════
   B: slide-up + fade-in
   ═══════════════════════════════════════════ */
function StyleB() {
  const [show, setShow] = useState(false);
  return (
    <div className="flex flex-col">
      <button onClick={() => setShow(!show)} className="self-center rounded-md bg-muted px-3 py-1 text-[10px] font-medium text-muted-foreground">
        {show ? "대댓글 입력 닫기" : "대댓글 입력 열기"}
      </button>
      <div className="mt-4 rounded-lg border border-border bg-card">
        <div className="p-4 text-xs text-muted-foreground">댓글 영역...</div>
        {!show && (
          <MockInput className="animate-in fade-in slide-in-from-bottom-3 duration-300" />
        )}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════
   C: slide-up + fade-in (느리게)
   ═══════════════════════════════════════════ */
function StyleC() {
  const [show, setShow] = useState(false);
  return (
    <div className="flex flex-col">
      <button onClick={() => setShow(!show)} className="self-center rounded-md bg-muted px-3 py-1 text-[10px] font-medium text-muted-foreground">
        {show ? "대댓글 입력 닫기" : "대댓글 입력 열기"}
      </button>
      <div className="mt-4 rounded-lg border border-border bg-card">
        <div className="p-4 text-xs text-muted-foreground">댓글 영역...</div>
        {!show && (
          <MockInput className="animate-in fade-in slide-in-from-bottom-4 duration-500 ease-out" />
        )}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════
   D: scale + fade-in
   ═══════════════════════════════════════════ */
function StyleD() {
  const [show, setShow] = useState(false);
  return (
    <div className="flex flex-col">
      <button onClick={() => setShow(!show)} className="self-center rounded-md bg-muted px-3 py-1 text-[10px] font-medium text-muted-foreground">
        {show ? "대댓글 입력 닫기" : "대댓글 입력 열기"}
      </button>
      <div className="mt-4 rounded-lg border border-border bg-card">
        <div className="p-4 text-xs text-muted-foreground">댓글 영역...</div>
        {!show && (
          <MockInput className="origin-bottom animate-in fade-in zoom-in-95 duration-200" />
        )}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════
   E: slide-up only (fade 없음)
   ═══════════════════════════════════════════ */
function StyleE() {
  const [show, setShow] = useState(false);
  return (
    <div className="flex flex-col">
      <button onClick={() => setShow(!show)} className="self-center rounded-md bg-muted px-3 py-1 text-[10px] font-medium text-muted-foreground">
        {show ? "대댓글 입력 닫기" : "대댓글 입력 열기"}
      </button>
      <div className="mt-4 overflow-hidden rounded-lg border border-border bg-card">
        <div className="p-4 text-xs text-muted-foreground">댓글 영역...</div>
        {!show && (
          <MockInput className="animate-in slide-in-from-bottom-full duration-300 ease-out" />
        )}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════ */

const STYLES = [
  { name: "A", label: "fade-in", desc: "단순 페이드. 300ms", Component: StyleA },
  { name: "B", label: "slide-up + fade-in", desc: "아래에서 올라오며 페이드. 300ms", Component: StyleB },
  { name: "C", label: "slide-up + fade-in (느리게)", desc: "아래에서 올라오며 페이드. 500ms ease-out", Component: StyleC },
  { name: "D", label: "scale + fade-in", desc: "아래 기준 살짝 확대되며 등장. 200ms", Component: StyleD },
  { name: "E", label: "slide-up only", desc: "아래에서 슬라이드만. 페이드 없음. 300ms", Component: StyleE },
];

export default function InputAnimationPage() {
  return (
    <div className="mx-auto max-w-xl px-4 py-8">
      <h1 className="mb-2 text-2xl font-bold">댓글 입력창 등장 애니메이션</h1>
      <p className="mb-2 text-sm text-muted-foreground">대댓글 입력이 닫히면서 하단 댓글 입력창이 등장할 때의 애니메이션.</p>
      <p className="mb-8 text-xs text-muted-foreground/60">&quot;대댓글 입력 열기&quot; 클릭 → 하단 입력 사라짐 / &quot;대댓글 입력 닫기&quot; 클릭 → 하단 입력 등장 + 애니메이션</p>

      <div className="flex flex-col gap-10">
        {STYLES.map(({ name, label, desc, Component }) => (
          <div key={name}>
            <div className="mb-3 flex items-center gap-2">
              <span className="flex size-6 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">{name}</span>
              <div>
                <p className="text-sm font-semibold">{label}</p>
                <p className="text-[10px] text-muted-foreground">{desc}</p>
              </div>
            </div>
            <Component />
          </div>
        ))}
      </div>
    </div>
  );
}
