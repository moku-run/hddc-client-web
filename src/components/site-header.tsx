"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

interface SiteHeaderProps {
  nav?: React.ReactNode;
  children?: React.ReactNode;
  userMenu?: React.ReactNode;
  maxWidth?: string;
}

export function SiteHeader({ nav, children, userMenu, maxWidth = "max-w-5xl" }: SiteHeaderProps) {
  const [logoHref, setLogoHref] = useState("/");
  useEffect(() => {
    if (localStorage.getItem("hddc-auth")) setLogoHref("/dashboard");
  }, []);

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-md">
      <nav className={cn("mx-auto flex h-14 items-center justify-between px-4 sm:px-6", maxWidth)}>
        <div className="flex items-center gap-6">
          <Link href={logoHref} className="text-lg font-bold tracking-tight">
            핫딜닷쿨
          </Link>
          {nav}
        </div>
        {(children || userMenu) && (
          <div className="flex items-center gap-1">
            {children}
            {userMenu}
          </div>
        )}
      </nav>
    </header>
  );
}
