"use client";

import { useState, useMemo, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SpinnerGap } from "@phosphor-icons/react";
import { validateEmail } from "@/lib/validators";
import { useFormValidation } from "@/hooks/use-form-validation";
import { authApi, ApiError } from "@/lib/api";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const validators = useMemo(() => ({
    email: () => validateEmail(email),
    password: () => (!password ? "비밀번호를 입력해주세요" : null),
  }), [email, password]);

  const { errors, touched, handleBlur, setFieldError, validateAll } = useFormValidation(validators);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!validateAll(["email", "password"])) return;

    setSubmitting(true);
    try {
      await authApi.login(email, password);
      router.push("/dashboard");
    } catch (err) {
      if (err instanceof ApiError) {
        const msg: Record<string, string> = {
          SC001: "이메일 또는 비밀번호가 올바르지 않습니다",
          SC004: "계정이 잠겼습니다. 비밀번호를 재설정해주세요",
          U002: "가입되지 않은 이메일입니다",
          U005: "삭제된 계정입니다",
        };
        setFieldError("password", msg[err.code] ?? err.message);
      }
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">로그인</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          이메일로 로그인하기
        </p>
      </div>

      {/* Email */}
      <div className="relative flex flex-col gap-1.5">
        <Label htmlFor="email">이메일</Label>
        <Input
          id="email"
          type="email"
          placeholder="name@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          aria-invalid={touched.email && !!errors.email}
          maxLength={254}
        />
        {touched.email && errors.email && (
          <p className="absolute -bottom-4 text-xs text-destructive">{errors.email}</p>
        )}
      </div>

      {/* Password */}
      <div className="relative flex flex-col gap-1.5">
        <div className="flex items-center justify-between">
          <Label htmlFor="password">비밀번호</Label>
          <Link
            href="/auth/forgot-password"
            className="text-xs text-muted-foreground underline underline-offset-2 transition-colors hover:text-foreground"
          >
            비밀번호 찾기
          </Link>
        </div>
        <Input
          id="password"
          type="password"
          placeholder="••••••••"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          aria-invalid={touched.password && !!errors.password}
        />
        {touched.password && errors.password && (
          <p className="absolute -bottom-4 text-xs text-destructive">{errors.password}</p>
        )}
      </div>

      {/* Submit */}
      <Button type="submit" className="h-11 text-sm font-semibold" disabled={submitting}>
        {submitting ? (
          <><SpinnerGap className="size-4 animate-spin" />로그인 중...</>
        ) : (
          "로그인"
        )}
      </Button>

      {/* Signup Link */}
      <p className="text-center text-sm text-muted-foreground">
        계정이 없으신가요?{" "}
        <Link href="/auth/signup" className="font-semibold underline text-foreground">
          회원가입
        </Link>
      </p>
    </form>
  );
}
