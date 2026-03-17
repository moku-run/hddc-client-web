import { notFound } from "next/navigation";
import { SiteFooter } from "@/components/site-footer";

export default function DevLayout({ children }: { children: React.ReactNode }) {
  if (process.env.NODE_ENV !== "development") {
    notFound();
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-50 border-b border-border bg-card/80 px-6 py-3 backdrop-blur">
        <div className="mx-auto flex max-w-3xl items-center gap-2">
          <span className="rounded bg-yellow-500/15 px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-yellow-600 dark:text-yellow-400">
            DEV
          </span>
          <span className="text-sm font-semibold">Developer Tools</span>
        </div>
      </header>
      {children}
      <SiteFooter />
    </div>
  );
}
