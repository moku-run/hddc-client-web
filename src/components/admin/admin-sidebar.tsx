"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ChartBar,
  Flag,
  Fire,
  Link as LinkIcon,
  GearSix,
  ArrowLeft,
  SignOut,
  List,
  CaretLeft,
} from "@phosphor-icons/react";
import type { Icon } from "@phosphor-icons/react";
import { cn } from "@/lib/utils";
import { ThemeToggle } from "@/components/theme-toggle";
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

interface NavItem {
  icon: Icon;
  label: string;
  href: string;
}

const NAV_ITEMS: NavItem[] = [
  { icon: ChartBar, label: "모니터링", href: "/admin/monitoring" },
  { icon: Flag, label: "신고관리", href: "/admin/reports" },
  { icon: Fire, label: "핫딜관리", href: "/admin/deals" },
  { icon: LinkIcon, label: "링크관리", href: "/admin/links" },
];

const BOTTOM_ITEMS: NavItem[] = [
  { icon: GearSix, label: "설정", href: "/admin/settings" },
];

function NavLink({
  item,
  collapsed,
  onClick,
}: {
  item: NavItem;
  collapsed: boolean;
  onClick?: () => void;
}) {
  const pathname = usePathname();
  const isActive = pathname === item.href;
  const Icon = item.icon;

  return (
    <Link
      href={item.href}
      onClick={onClick}
      className={cn(
        "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
        collapsed && "justify-center px-2",
        isActive
          ? "bg-primary text-primary-foreground"
          : "text-muted-foreground hover:bg-muted hover:text-foreground",
      )}
    >
      <Icon className="size-5 shrink-0" weight={isActive ? "fill" : "duotone"} />
      {!collapsed && <span>{item.label}</span>}
    </Link>
  );
}

function SidebarContent({
  collapsed,
  onCollapse,
  onNavigate,
}: {
  collapsed: boolean;
  onCollapse?: () => void;
  onNavigate?: () => void;
}) {
  return (
    <div className="flex h-full flex-col">
      {/* Logo */}
      <div className={cn("flex items-center border-b border-border px-4 py-4", collapsed && "justify-center px-2")}>
        {!collapsed ? (
          <div className="flex w-full items-center justify-between">
            <Link href="/admin" className="text-sm font-bold">
              핫딜닷쿨 <span className="text-primary">Admin</span>
            </Link>
            {onCollapse && (
              <button
                onClick={onCollapse}
                className="rounded-md p-1 text-muted-foreground hover:bg-muted hover:text-foreground"
              >
                <CaretLeft className="size-4" />
              </button>
            )}
          </div>
        ) : (
          <button
            onClick={onCollapse}
            className="rounded-md p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground"
          >
            <Fire className="size-5 text-primary" weight="fill" />
          </button>
        )}
      </div>

      {/* Main nav */}
      <nav className="flex flex-1 flex-col gap-1 px-3 py-3">
        {NAV_ITEMS.map((item) => (
          <NavLink key={item.href} item={item} collapsed={collapsed} onClick={onNavigate} />
        ))}
      </nav>

      {/* Bottom section */}
      <div className="px-3 pb-3">
        {BOTTOM_ITEMS.map((item) => (
          <NavLink key={item.href} item={item} collapsed={collapsed} onClick={onNavigate} />
        ))}

        <Separator className="my-2" />

        <div className={cn("flex items-center gap-2", collapsed ? "flex-col" : "justify-between")}>
          <ThemeToggle />
          <Link
            href="/hot-deals"
            className={cn(
              "flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground",
              collapsed && "px-2",
            )}
          >
            <ArrowLeft className="size-4" />
            {!collapsed && <span>사이트로</span>}
          </Link>
        </div>

        <button
          onClick={() => {
            localStorage.removeItem("hddc-admin-auth");
            window.location.href = "/auth/login";
          }}
          className={cn(
            "mt-1 flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive",
            collapsed && "justify-center px-2",
          )}
        >
          <SignOut className="size-4" />
          {!collapsed && <span>로그아웃</span>}
        </button>
      </div>
    </div>
  );
}

export function AdminSidebar() {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <>
      {/* Desktop sidebar */}
      <aside
        className={cn(
          "hidden lg:flex shrink-0 flex-col border-r border-border bg-background transition-[width] duration-200",
          collapsed ? "w-16" : "w-60",
        )}
      >
        <SidebarContent
          collapsed={collapsed}
          onCollapse={() => setCollapsed((prev) => !prev)}
        />
      </aside>

      {/* Mobile trigger + sheet */}
      <Sheet>
        <SheetTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="fixed left-3 top-3 z-40 lg:hidden"
          >
            <List className="size-5" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-60 p-0">
          <SheetTitle className="sr-only">관리자 메뉴</SheetTitle>
          <SidebarContent collapsed={false} />
        </SheetContent>
      </Sheet>
    </>
  );
}
