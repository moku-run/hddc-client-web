"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  House,
  PencilSimple,
  ChartBar,
  GearSix,
} from "@phosphor-icons/react";
import type { Icon } from "@phosphor-icons/react";
import { cn } from "@/lib/utils";

interface SidebarItem {
  icon: Icon;
  label: string;
  href: string;
}

const SIDEBAR_ITEMS: SidebarItem[] = [
  { icon: House, label: "대시보드", href: "/dashboard" },
  { icon: PencilSimple, label: "프로필 편집", href: "/dashboard/edit" },
  { icon: ChartBar, label: "분석", href: "/dashboard/analytics" },
];

const BOTTOM_ITEMS: SidebarItem[] = [
  { icon: GearSix, label: "설정", href: "/dashboard/settings" },
];

function SidebarIcon({ item }: { item: SidebarItem }) {
  const pathname = usePathname();
  const isActive = pathname === item.href;
  const [showTooltip, setShowTooltip] = useState(false);
  const Icon = item.icon;

  return (
    <div className="relative">
      <Link
        href={item.href}
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        className={cn(
          "flex size-9 items-center justify-center rounded-lg transition-colors",
          isActive
            ? "bg-primary text-primary-foreground"
            : "text-muted-foreground hover:bg-muted hover:text-foreground",
        )}
        aria-label={item.label}
      >
        <Icon className="size-5" weight={isActive ? "fill" : "duotone"} />
      </Link>

      {/* Tooltip */}
      {showTooltip && (
        <div
          role="tooltip"
          className="absolute left-full top-1/2 z-50 ml-3 -translate-y-1/2 whitespace-nowrap rounded-md border border-border bg-popover px-2.5 py-1 text-xs font-medium text-popover-foreground shadow-md"
        >
          {item.label}
        </div>
      )}
    </div>
  );
}

export function IconSidebar() {
  return (
    <aside className="hidden lg:flex w-14 shrink-0 flex-col items-center border-r border-border bg-background py-4 gap-1.5">
      <div className="flex flex-1 flex-col items-center gap-1.5">
        {SIDEBAR_ITEMS.map((item) => (
          <SidebarIcon key={item.href} item={item} />
        ))}
      </div>
      <div className="flex flex-col items-center gap-1.5">
        {BOTTOM_ITEMS.map((item) => (
          <SidebarIcon key={item.href} item={item} />
        ))}
      </div>
    </aside>
  );
}
