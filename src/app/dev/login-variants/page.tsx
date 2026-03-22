"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

/* ═══════════════════════════════════════════════════════════
   A: 현재 — 비밀번호 라벨 옆 (오른쪽 정렬)
   ═══════════════════════════════════════════════════════════ */

function StyleA() {
  return (
    <form className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">로그인</h1>
        <p className="mt-1 text-sm text-muted-foreground">이메일로 로그인하기</p>
      </div>
      <div className="flex flex-col gap-1.5">
        <Label>이메일</Label>
        <Input type="email" placeholder="name@example.com" />
      </div>
      <div className="flex flex-col gap-1.5">
        <div className="flex items-center justify-between">
          <Label>비밀번호</Label>
          <a href="#" className="text-xs text-muted-foreground underline underline-offset-2 hover:text-foreground">비밀번호 찾기</a>
        </div>
        <Input type="password" placeholder="••••••••" />
      </div>
      <Button className="h-11 text-sm font-semibold">로그인</Button>
      <p className="text-center text-sm text-muted-foreground">계정이 없으신가요? <span className="font-semibold underline text-foreground">회원가입</span></p>
    </form>
  );
}

/* ═══════════════════════════════════════════════════════════
   B: 로그인 버튼 아래
   ═══════════════════════════════════════════════════════════ */

function StyleB() {
  return (
    <form className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">로그인</h1>
        <p className="mt-1 text-sm text-muted-foreground">이메일로 로그인하기</p>
      </div>
      <div className="flex flex-col gap-1.5">
        <Label>이메일</Label>
        <Input type="email" placeholder="name@example.com" />
      </div>
      <div className="flex flex-col gap-1.5">
        <Label>비밀번호</Label>
        <Input type="password" placeholder="••••••••" />
      </div>
      <Button className="h-11 text-sm font-semibold">로그인</Button>
      <div className="text-center text-sm text-muted-foreground">
        <a href="#" className="underline underline-offset-2 hover:text-foreground">비밀번호를 잊으셨나요?</a>
      </div>
      <p className="text-center text-sm text-muted-foreground">계정이 없으신가요? <span className="font-semibold underline text-foreground">회원가입</span></p>
    </form>
  );
}

/* ═══════════════════════════════════════════════════════════
   C: 비밀번호 입력란 아래 (인라인)
   ═══════════════════════════════════════════════════════════ */

function StyleC() {
  return (
    <form className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">로그인</h1>
        <p className="mt-1 text-sm text-muted-foreground">이메일로 로그인하기</p>
      </div>
      <div className="flex flex-col gap-1.5">
        <Label>이메일</Label>
        <Input type="email" placeholder="name@example.com" />
      </div>
      <div className="flex flex-col gap-1.5">
        <Label>비밀번호</Label>
        <Input type="password" placeholder="••••••••" />
        <a href="#" className="self-end text-xs text-muted-foreground underline underline-offset-2 hover:text-foreground">비밀번호 찾기</a>
      </div>
      <Button className="h-11 text-sm font-semibold">로그인</Button>
      <p className="text-center text-sm text-muted-foreground">계정이 없으신가요? <span className="font-semibold underline text-foreground">회원가입</span></p>
    </form>
  );
}

/* ═══════════════════════════════════════════════════════════
   D: 최하단 (회원가입 링크 아래)
   ═══════════════════════════════════════════════════════════ */

function StyleD() {
  return (
    <form className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">로그인</h1>
        <p className="mt-1 text-sm text-muted-foreground">이메일로 로그인하기</p>
      </div>
      <div className="flex flex-col gap-1.5">
        <Label>이메일</Label>
        <Input type="email" placeholder="name@example.com" />
      </div>
      <div className="flex flex-col gap-1.5">
        <Label>비밀번호</Label>
        <Input type="password" placeholder="••••••••" />
      </div>
      <Button className="h-11 text-sm font-semibold">로그인</Button>
      <p className="text-center text-sm text-muted-foreground">계정이 없으신가요? <span className="font-semibold underline text-foreground">회원가입</span></p>
      <a href="#" className="text-center text-xs text-muted-foreground underline underline-offset-2 hover:text-foreground">비밀번호를 잊으셨나요?</a>
    </form>
  );
}

/* ═══════════════════════════════════════════════════════════
   E: 로그인 버튼과 회원가입 사이 (구분선 포함)
   ═══════════════════════════════════════════════════════════ */

function StyleE() {
  return (
    <form className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">로그인</h1>
        <p className="mt-1 text-sm text-muted-foreground">이메일로 로그인하기</p>
      </div>
      <div className="flex flex-col gap-1.5">
        <Label>이메일</Label>
        <Input type="email" placeholder="name@example.com" />
      </div>
      <div className="flex flex-col gap-1.5">
        <Label>비밀번호</Label>
        <Input type="password" placeholder="••••••••" />
      </div>
      <div className="flex flex-col gap-3">
        <Button className="h-11 text-sm font-semibold">로그인</Button>
        <a href="#" className="text-center text-xs text-muted-foreground underline underline-offset-2 hover:text-foreground">비밀번호를 잊으셨나요?</a>
      </div>
      <div className="flex items-center gap-3">
        <div className="h-px flex-1 bg-border" />
        <span className="text-[11px] text-muted-foreground">또는</span>
        <div className="h-px flex-1 bg-border" />
      </div>
      <p className="text-center text-sm text-muted-foreground">계정이 없으신가요? <span className="font-semibold underline text-foreground">회원가입</span></p>
    </form>
  );
}

/* ═══════════════════════════════════════════════════════════
   Page
   ═══════════════════════════════════════════════════════════ */

const STYLES = [
  { name: "A", label: "현재 — 라벨 옆", desc: "비밀번호 라벨 오른쪽에 인라인 배치", Component: StyleA },
  { name: "B", label: "로그인 버튼 아래", desc: "로그인 버튼과 회원가입 사이에 독립 배치", Component: StyleB },
  { name: "C", label: "입력란 아래", desc: "비밀번호 입력란 바로 아래 오른쪽 정렬", Component: StyleC },
  { name: "D", label: "최하단", desc: "회원가입 링크 아래 맨 마지막 배치", Component: StyleD },
  { name: "E", label: "버튼 아래 + 구분선", desc: "로그인 버튼 바로 아래 + 구분선으로 회원가입과 분리", Component: StyleE },
];

export default function LoginVariantsPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <h1 className="mb-2 text-2xl font-bold">로그인 — 비밀번호 찾기 위치 비교</h1>
      <p className="mb-8 text-sm text-muted-foreground">동일한 로그인 폼에서 &quot;비밀번호 찾기&quot; 위치만 다릅니다.</p>

      <div className="grid gap-8 lg:grid-cols-2">
        {STYLES.map(({ name, label, desc, Component }) => (
          <div key={name} className="rounded-xl border border-border bg-card p-6">
            <div className="mb-4 flex items-center gap-2">
              <span className="flex size-7 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">{name}</span>
              <div>
                <p className="text-sm font-semibold">{label}</p>
                <p className="text-[10px] text-muted-foreground">{desc}</p>
              </div>
            </div>
            <div className="rounded-lg border border-dashed border-border p-6">
              <Component />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
