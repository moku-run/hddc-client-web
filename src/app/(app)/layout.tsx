"use client";

import { usePathname } from "next/navigation";
import { GlobalHeader } from "@/components/global-header";
import { Fab } from "@/components/fab";
import { SiteFooter } from "@/components/site-footer";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isEdit = pathname === "/dashboard/edit";

  return (
    <div className="flex h-svh flex-col">
      <GlobalHeader />
      <main className="flex flex-1 flex-col overflow-y-auto">
        <div className="flex-1">
          {children}
        </div>
        {!isEdit && <SiteFooter />}
      </main>
      <Fab />
    </div>
  );
}
