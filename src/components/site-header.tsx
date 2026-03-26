"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";
import { FireLogo } from "@/components/icons/fire-logo";

interface SiteHeaderProps {
  nav?: React.ReactNode;
  children?: React.ReactNode;
  userMenu?: React.ReactNode;
  maxWidth?: string;
}

export function SiteHeader({ nav, children, userMenu, maxWidth = "max-w-5xl" }: SiteHeaderProps) {
  const logoHref = "/";

  return (
    <header className="sticky top-0 z-50 bg-background/50 shadow-md backdrop-blur-xl">
      <nav className={cn("mx-auto flex h-14 items-center justify-between px-4 sm:px-6", maxWidth)}>
        <div className="flex items-center gap-6">
          <Link href={logoHref} className="flex items-center gap-1.5 text-lg font-bold tracking-tight">
            <FireLogo className="size-6 text-red-500" />
            핫딜닷쿨
          </Link>
          {nav}
        </div>
        {(children || userMenu) && (
          <div className="flex items-center gap-2">
            {children}
            {userMenu}
          </div>
        )}
      </nav>
    </header>
  );
}
