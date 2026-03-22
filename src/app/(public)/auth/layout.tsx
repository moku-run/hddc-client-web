"use client";

import { usePathname } from "next/navigation";
import { AuthShell } from "@/components/auth/auth-shell";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="flex min-h-full items-center justify-center px-4 py-12">
      <AuthShell contentKey={pathname}>
        {children}
      </AuthShell>
    </div>
  );
}
