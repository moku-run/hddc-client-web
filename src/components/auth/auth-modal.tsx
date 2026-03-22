"use client";

import { useState } from "react";
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
  defaultMode?: "login" | "signup";
}

export function AuthModal({ open, onOpenChange, defaultMode = "login" }: AuthModalProps) {
  const [mode, setMode] = useState<"login" | "signup">(defaultMode);

  function handleSuccess() {
    onOpenChange(false);
    window.location.reload();
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto p-0 sm:max-w-4xl border-0 bg-transparent shadow-none [&>button]:hidden">
        <DialogTitle className="sr-only">{mode === "login" ? "로그인" : "회원가입"}</DialogTitle>
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
