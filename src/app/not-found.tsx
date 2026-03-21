import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-6 px-4 text-center">
      <div className="flex flex-col items-center gap-2">
        <span className="text-7xl font-black tabular-nums tracking-tighter text-primary">
          404
        </span>
        <h1 className="text-xl font-bold tracking-tight">
          페이지를 찾을 수 없습니다
        </h1>
        <p className="max-w-sm text-sm leading-relaxed text-muted-foreground">
          요청하신 페이지가 존재하지 않거나, 이동되었거나, 주소가 잘못되었을 수 있습니다.
        </p>
      </div>
      <div className="flex gap-2">
        <Button variant="outline" asChild>
          <Link href="/hot-deals">홈으로</Link>
        </Button>
        <Button asChild>
          <Link href="/dashboard">대시보드</Link>
        </Button>
      </div>
    </div>
  );
}
