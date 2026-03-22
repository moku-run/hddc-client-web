import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center px-4 text-center">
      <span className="text-8xl font-black tabular-nums tracking-tighter text-primary/20">
        404
      </span>
      <h1 className="mt-2 text-xl font-bold tracking-tight">
        페이지를 찾을 수 없습니다
      </h1>
      <p className="mt-2 max-w-xs text-sm leading-relaxed text-muted-foreground">
        요청하신 페이지가 존재하지 않거나,
        <br />
        주소가 잘못되었을 수 있습니다.
      </p>

      <div className="mt-8 flex gap-2">
        <Button variant="outline" asChild>
          <Link href="/">핫딜 보러가기</Link>
        </Button>
        <Button asChild>
          <Link href="/auth/signup">회원가입</Link>
        </Button>
      </div>

      <p className="mt-6 text-xs text-muted-foreground">
        이미 계정이 있으신가요?{" "}
        <Link href="/auth/login" className="font-medium text-primary underline-offset-4 hover:underline">
          로그인
        </Link>
      </p>
    </div>
  );
}
