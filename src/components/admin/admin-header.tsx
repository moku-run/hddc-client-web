"use client";

import { usePathname } from "next/navigation";
import { CaretRight } from "@phosphor-icons/react";

const BREADCRUMB_MAP: Record<string, string> = {
  "/admin": "관리자",
  "/admin/monitoring": "모니터링",
  "/admin/reports": "신고관리",
  "/admin/deals": "핫딜관리",
  "/admin/links": "링크관리",
  "/admin/settings": "설정",
};

export function AdminHeader() {
  const pathname = usePathname();
  const segments = pathname.split("/").filter(Boolean);

  const crumbs = segments.reduce<{ href: string; label: string }[]>((acc, _, i) => {
    const href = "/" + segments.slice(0, i + 1).join("/");
    const label = BREADCRUMB_MAP[href];
    if (label) acc.push({ href, label });
    return acc;
  }, []);

  return (
    <header className="flex h-14 items-center border-b border-border bg-background px-4 lg:px-6">
      {/* Mobile spacer for hamburger */}
      <div className="w-10 lg:hidden" />

      <nav className="flex items-center gap-1 text-sm">
        {crumbs.map((crumb, i) => (
          <span key={crumb.href} className="flex items-center gap-1">
            {i > 0 && <CaretRight className="size-3 text-muted-foreground" />}
            <span
              className={
                i === crumbs.length - 1
                  ? "font-semibold text-foreground"
                  : "text-muted-foreground"
              }
            >
              {crumb.label}
            </span>
          </span>
        ))}
      </nav>
    </header>
  );
}
