"use client";

import { useState } from "react";
import { X } from "@phosphor-icons/react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
import { AuthShell } from "./auth-shell";
import { LoginForm } from "./login-form";
import { SignupForm } from "./signup-form";

interface AuthModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
  defaultMode?: "login" | "signup";
}

export function AuthModal({ open, onOpenChange, onSuccess, defaultMode = "login" }: AuthModalProps) {
  const [mode, setMode] = useState<"login" | "signup">(defaultMode);

  function handleSuccess() {
    onOpenChange(false);
    if (onSuccess) {
      onSuccess();
    } else {
      // fallback: onSuccess 미제공 시 이벤트 발행
      window.dispatchEvent(new Event("hddc:auth-changed"));
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto p-0 sm:max-w-4xl border-0 bg-transparent shadow-none [&>button]:hidden">
        <DialogTitle className="sr-only">{mode === "login" ? "로그인" : "회원가입"}</DialogTitle>

        {/* 모바일 닫기 버튼 */}
        <button
          onClick={() => onOpenChange(false)}
          className="absolute right-3 top-3 z-50 flex size-8 items-center justify-center rounded-full bg-black/40 text-white backdrop-blur-sm transition-colors hover:bg-black/60 sm:hidden"
        >
          <X className="size-4" />
        </button>

        <AuthShell contentKey={mode}>
          {mode === "login" ? (
            <LoginForm
              onSuccess={handleSuccess}
              onSignupClick={() => setMode("signup")}
            />
          ) : (
            <SignupForm
              onSuccess={handleSuccess}
              onLoginClick={() => setMode("login")}
            />
          )}
        </AuthShell>
      </DialogContent>
    </Dialog>
  );
}
