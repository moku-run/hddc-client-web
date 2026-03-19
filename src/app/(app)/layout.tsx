"use client";

import { GlobalHeader } from "@/components/global-header";
import { Fab } from "@/components/fab";
import { SiteFooter } from "@/components/site-footer";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-svh flex-col">
      <GlobalHeader />
      <main className="flex flex-1 flex-col overflow-y-auto">
        <div className="flex-1">
          {children}
        </div>
        <SiteFooter />
      </main>
      <Fab />
    </div>
  );
}
