"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { SiteHeader } from "@/components/site-header";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import { SignOut } from "@phosphor-icons/react";

export function GlobalHeader() {
  const router = useRouter();
  const [authed, setAuthed] = useState(false);

  useEffect(() => {
    setAuthed(!!localStorage.getItem("hddc-auth"));
  }, []);

  function handleLogout() {
    localStorage.removeItem("hddc-auth");
    router.push("/auth/login");
  }

  return (
    <SiteHeader
      userMenu={
        authed ? (
          <Button variant="ghost" size="icon" onClick={handleLogout} aria-label="로그아웃">
            <SignOut className="size-4" />
          </Button>
        ) : (
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" asChild>
              <Link href="/auth/login">로그인</Link>
            </Button>
            <Button size="sm" asChild>
              <Link href="/auth/signup">회원가입</Link>
            </Button>
          </div>
        )
      }
    >
      <ThemeToggle />
    </SiteHeader>
  );
}
