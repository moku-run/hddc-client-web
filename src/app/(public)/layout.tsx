import { GlobalHeader } from "@/components/global-header";
import { Fab } from "@/components/fab";

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-svh flex-col">
      <GlobalHeader />
      <main className="flex flex-1 flex-col overflow-y-auto">
        {children}
      </main>
      <Fab />
    </div>
  );
}
