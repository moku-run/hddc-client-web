"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { SiteHeader } from "@/components/site-header";
import { ThemeToggle } from "@/components/theme-toggle";
import { AuthModal } from "@/components/auth/auth-modal";
import { SignOut, Palette, LinkSimple, GearSix } from "@phosphor-icons/react";
import { authApi } from "@/lib/api";

export function GlobalHeader() {
  const [authed, setAuthed] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // 초기 auth 상태 + auth 변경 이벤트 수신
  useEffect(() => {
    setAuthed(!!localStorage.getItem("hddc-auth"));

    function onAuthChange() {
      setAuthed(!!localStorage.getItem("hddc-auth"));
    }
    window.addEventListener("hddc:auth-changed", onAuthChange);
    return () => window.removeEventListener("hddc:auth-changed", onAuthChange);
  }, []);

  // 외부 클릭 시 메뉴 닫기
  useEffect(() => {
    if (!menuOpen) return;
    function handleClick(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setMenuOpen(false);
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [menuOpen]);

  function handleLogout() {
    authApi.logout();
    setAuthed(false);
    setMenuOpen(false);
    // 다른 컴포넌트에 auth 변경 알림
    window.dispatchEvent(new Event("hddc:auth-changed"));
  }

  function handleLoginSuccess() {
    setAuthModalOpen(false);
    setAuthed(true);
    window.dispatchEvent(new Event("hddc:auth-changed"));
  }

  let nickname = "";
  if (authed) {
    try {
      const raw = localStorage.getItem("hddc-user");
      if (raw) nickname = JSON.parse(raw).nickname ?? "";
    } catch { /* ignore */ }
  }
  const initial = nickname ? nickname.charAt(0).toUpperCase() : "U";

  return (
    <>
      <SiteHeader
        userMenu={
          authed ? (
            <div className="flex items-center gap-2">
              <Link
                href="/dashboard/edit"
                className="hidden items-center gap-1.5 rounded-full border border-primary/30 px-3 py-1.5 text-xs font-medium text-primary transition-colors hover:bg-primary/10 sm:flex"
              >
                <Palette className="size-3.5" />프로필 꾸미기
              </Link>
              <div ref={menuRef} className="relative">
                <button
                  onClick={() => setMenuOpen(!menuOpen)}
                  className="flex size-8 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground"
                >
                  {initial}
                </button>
                {menuOpen && (
                  <div className="absolute right-0 top-full mt-2 w-40 overflow-hidden rounded-xl border border-border bg-card shadow-lg">
                    <div className="py-1">
                      <Link
                        href="/dashboard/edit"
                        onClick={() => setMenuOpen(false)}
                        className="flex w-full items-center gap-2.5 px-3 py-2 text-xs text-foreground transition-colors hover:bg-muted sm:hidden"
                      >
                        <Palette className="size-3.5 text-muted-foreground" />프로필 꾸미기
                      </Link>
                      <Link
                        href={`/${nickname || "me"}`}
                        onClick={() => setMenuOpen(false)}
                        className="flex w-full items-center gap-2.5 px-3 py-2 text-xs text-foreground transition-colors hover:bg-muted"
                      >
                        <LinkSimple className="size-3.5 text-muted-foreground" />내 프로필 보기
                      </Link>
                      <Link
                        href="/dashboard"
                        onClick={() => setMenuOpen(false)}
                        className="flex w-full items-center gap-2.5 px-3 py-2 text-xs text-foreground transition-colors hover:bg-muted"
                      >
                        <GearSix className="size-3.5 text-muted-foreground" />설정
                      </Link>
                    </div>
                    <div className="border-t border-border py-1">
                      <button
                        onClick={handleLogout}
                        className="flex w-full items-center gap-2.5 px-3 py-2 text-xs text-red-500 transition-colors hover:bg-muted"
                      >
                        <SignOut className="size-3.5" />로그아웃
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <button
              onClick={() => setAuthModalOpen(true)}
              className="rounded-full bg-primary px-4 py-1.5 text-xs font-medium text-primary-foreground"
            >
              시작하기
            </button>
          )
        }
      >
        <ThemeToggle />
      </SiteHeader>

      <AuthModal open={authModalOpen} onOpenChange={setAuthModalOpen} onSuccess={handleLoginSuccess} />
    </>
  );
}
