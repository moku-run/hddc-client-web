"use client";

import Link from "next/link";
import {
  Cube, Warning, Palette, Layout, Code,
} from "@phosphor-icons/react";

const DEV_PAGES = [
  {
    href: "/dev/components",
    icon: Cube,
    title: "Component Showcase",
    description: "모든 UI 컴포넌트 일람 — Button, ToggleGroup, ColorPicker 등",
  },
  {
    href: "/dev/notfound",
    icon: Warning,
    title: "Not Found (404)",
    description: "커스텀 404 페이지 프리뷰",
  },
];

export default function DevIndexPage() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-10">
      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight">Developer Tools</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          개발 환경에서만 접근 가능한 도구 모음입니다. Production 빌드에서는 404를 반환합니다.
        </p>
      </div>

      <div className="grid gap-3">
        {DEV_PAGES.map(({ href, icon: Icon, title, description }) => (
          <Link
            key={href}
            href={href}
            className="group flex items-center gap-4 rounded-xl border border-border bg-card p-5 transition-colors hover:border-primary/30 hover:bg-muted/50"
          >
            <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary transition-colors group-hover:bg-primary/20">
              <Icon className="size-5" weight="duotone" />
            </div>
            <div className="flex-1">
              <h2 className="text-sm font-semibold">{title}</h2>
              <p className="mt-0.5 text-xs text-muted-foreground">{description}</p>
            </div>
            <span className="text-xs text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100">
              →
            </span>
          </Link>
        ))}
      </div>

      <div className="mt-10 rounded-lg border border-dashed border-border bg-muted/20 p-4 text-center">
        <p className="text-xs text-muted-foreground">
          페이지를 추가하려면 <code className="rounded bg-muted px-1 py-0.5 text-[11px]">src/app/dev/</code> 하위에 폴더를 생성하고 위 목록에 추가하세요.
        </p>
      </div>
    </div>
  );
}
