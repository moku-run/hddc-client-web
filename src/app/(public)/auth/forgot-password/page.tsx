"use client";

import { useState, useEffect, useRef, useCallback, type FormEvent, type KeyboardEvent, type ClipboardEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  EnvelopeSimple,
  ArrowCounterClockwise,
  ArrowLeft,
  SpinnerGap,
  CheckCircle,
} from "@phosphor-icons/react";
import {
  validateEmail,
  validatePassword,
  validatePasswordConfirm,
} from "@/lib/validators";
import { authApi, ApiError } from "@/lib/api";

const CODE_LENGTH = 6;
const COOLDOWN_SEC = 60;
const CODE_TTL_SEC = 300; // 5분

type Step = "email" | "verify" | "reset" | "done";

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [step, setStep] = useState<Step>("email");

  // ─── Step 1: Email ───
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState<string | null>(null);
  const [emailTouched, setEmailTouched] = useState(false);
  const [sending, setSending] = useState(false);

  // ─── Step 2: Verify ───
  const [code, setCode] = useState<string[]>(Array(CODE_LENGTH).fill(""));
  const [codeError, setCodeError] = useState<string | null>(null);
  const [verifying, setVerifying] = useState(false);
  const [cooldown, setCooldown] = useState(0);
  const [codeTimer, setCodeTimer] = useState(0);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // ─── Step 3: Reset ───
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [errors, setErrors] = useState<Record<string, string | null>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [resetting, setResetting] = useState(false);

  // ─── Timers ───
  useEffect(() => {
    if (cooldown <= 0) return;
    const timer = setTimeout(() => setCooldown(cooldown - 1), 1000);
    return () => clearTimeout(timer);
  }, [cooldown]);

  useEffect(() => {
    if (codeTimer <= 0) return;
    const timer = setTimeout(() => setCodeTimer(codeTimer - 1), 1000);
    return () => clearTimeout(timer);
  }, [codeTimer]);

  useEffect(() => {
    if (step === "verify") {
      requestAnimationFrame(() => inputRefs.current[0]?.focus());
    }
  }, [step]);

  // ─── Step 1 handlers ───
  async function handleEmailSubmit(e: FormEvent) {
    e.preventDefault();
    setEmailTouched(true);
    const err = validateEmail(email);
    setEmailError(err);
    if (err) return;

    setSending(true);
    try {
      await authApi.sendPasswordResetCode(email);
      setStep("verify");
      setCooldown(COOLDOWN_SEC);
      setCodeTimer(CODE_TTL_SEC);
    } catch (err) {
      if (err instanceof ApiError) {
        const msg: Record<string, string> = {
          U002: "가입되지 않은 이메일입니다",
          V007: "메일 발송에 실패했습니다. 잠시 후 다시 시도해주세요",
        };
        setEmailError(msg[err.code] ?? err.message);
      }
    } finally {
      setSending(false);
    }
  }

  // ─── Step 2 handlers ───
  const handleCodeChange = useCallback((index: number, value: string) => {
    const digit = value.replace(/\D/g, "").slice(-1);
    setCode((prev) => {
      const next = [...prev];
      next[index] = digit;
      return next;
    });
    setCodeError(null);
    if (digit && index < CODE_LENGTH - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  }, []);

  const handleCodeKeyDown = useCallback((index: number, e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
    if (e.key === "ArrowLeft" && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
    if (e.key === "ArrowRight" && index < CODE_LENGTH - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  }, [code]);

  const handleCodePaste = useCallback((e: ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, CODE_LENGTH);
    if (!pasted) return;
    const digits = pasted.split("");
    setCode((prev) => {
      const next = [...prev];
      digits.forEach((d, i) => { next[i] = d; });
      return next;
    });
    setCodeError(null);
    const focusIdx = Math.min(digits.length, CODE_LENGTH - 1);
    inputRefs.current[focusIdx]?.focus();
  }, []);

  async function handleVerifySubmit(e: FormEvent) {
    e.preventDefault();
    const joined = code.join("");
    if (joined.length < CODE_LENGTH) {
      setCodeError("인증코드 6자리를 모두 입력해주세요");
      return;
    }
    if (codeTimer <= 0) {
      setCodeError("인증코드가 만료되었습니다. 재전송해주세요");
      return;
    }

    setVerifying(true);
    try {
      await authApi.verifyPasswordResetCode(email, joined);
      setStep("reset");
    } catch (err) {
      if (err instanceof ApiError) {
        const msg: Record<string, string> = {
          V003: "인증코드가 만료되었습니다",
          V004: "인증코드가 일치하지 않습니다",
          V005: "인증 시도 횟수를 초과했습니다. 코드를 재전송해주세요",
        };
        setCodeError(msg[err.code] ?? err.message);
      }
    } finally {
      setVerifying(false);
    }
  }

  async function handleResend() {
    setCode(Array(CODE_LENGTH).fill(""));
    setCodeError(null);
    try {
      await authApi.sendPasswordResetCode(email);
      setCooldown(COOLDOWN_SEC);
      setCodeTimer(CODE_TTL_SEC);
    } catch {
      setCodeError("재전송에 실패했습니다. 잠시 후 다시 시도해주세요");
    }
    requestAnimationFrame(() => inputRefs.current[0]?.focus());
  }

  // ─── Step 3 handlers ───
  function validate(field: string): string | null {
    switch (field) {
      case "password":
        return validatePassword(password);
      case "passwordConfirm":
        return validatePasswordConfirm(password, passwordConfirm);
      default:
        return null;
    }
  }

  function handleBlur(field: string) {
    setTouched((prev) => ({ ...prev, [field]: true }));
    setErrors((prev) => ({ ...prev, [field]: validate(field) }));
  }

  async function handleResetSubmit(e: FormEvent) {
    e.preventDefault();

    const fields = ["password", "passwordConfirm"];
    const allTouched = Object.fromEntries(fields.map((f) => [f, true]));
    setTouched((prev) => ({ ...prev, ...allTouched }));

    const newErrors: Record<string, string | null> = {};
    for (const field of fields) {
      newErrors[field] = validate(field);
    }
    setErrors(newErrors);

    const hasErrors = Object.values(newErrors).some((e) => e !== null);
    if (hasErrors) return;

    setResetting(true);
    try {
      await authApi.resetPassword(email, password, passwordConfirm);
      setStep("done");
    } catch (err) {
      if (err instanceof ApiError) {
        if (err.code === "V006") {
          setStep("email");
          setEmailError("인증이 만료되었습니다. 다시 인증해주세요");
        } else {
          const msg: Record<string, string> = {
            U003: "비밀번호 형식이 올바르지 않습니다",
            U002: "사용자를 찾을 수 없습니다",
          };
          setErrors({ password: msg[err.code] ?? err.message });
        }
      }
    } finally {
      setResetting(false);
    }
  }

  function formatTime(seconds: number): string {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, "0")}`;
  }

  // ═══════════════════════════════════════════════════
  // Step 1: Email input
  // ═══════════════════════════════════════════════════
  if (step === "email") {
    return (
      <form onSubmit={handleEmailSubmit} className="flex flex-col gap-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">비밀번호 찾기</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            가입한 이메일을 입력하면 인증코드를 보내드립니다
          </p>
        </div>

        <div className="relative flex flex-col gap-1.5">
          <Label htmlFor="email">이메일</Label>
          <Input
            id="email"
            type="email"
            placeholder="name@example.com"
            value={email}
            onChange={(e) => { setEmail(e.target.value); setEmailError(null); }}
            onBlur={() => { setEmailTouched(true); setEmailError(validateEmail(email)); }}
            aria-invalid={emailTouched && !!emailError}
            maxLength={254}
            autoFocus
          />
          {emailTouched && emailError && (
            <p className="absolute -bottom-4 text-xs text-destructive">{emailError}</p>
          )}
        </div>

        <Button type="submit" className="h-11 text-sm font-semibold" disabled={sending}>
          {sending ? (
            <><SpinnerGap className="size-4 animate-spin" />발송 중...</>
          ) : (
            "인증코드 발송"
          )}
        </Button>

        <p className="text-center text-sm text-muted-foreground">
          <Link href="/auth/login" className="font-semibold underline text-foreground">
            로그인으로 돌아가기
          </Link>
        </p>
      </form>
    );
  }

  // ═══════════════════════════════════════════════════
  // Step 2: Verification code input
  // ═══════════════════════════════════════════════════
  if (step === "verify") {
    return (
      <form onSubmit={handleVerifySubmit} className="flex flex-col items-center gap-6">
        <div className="flex size-16 items-center justify-center rounded-full bg-primary/10">
          <EnvelopeSimple className="size-8 text-primary" weight="duotone" />
        </div>

        <div className="text-center">
          <h1 className="text-2xl font-bold tracking-tight">인증코드 입력</h1>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
            <span className="font-semibold text-foreground">{email}</span>
            으로
            <br />
            6자리 인증코드를 보냈습니다
          </p>
        </div>

        {/* OTP inputs */}
        <div className="flex gap-2">
          {Array.from({ length: CODE_LENGTH }).map((_, i) => (
            <input
              key={i}
              ref={(el) => { inputRefs.current[i] = el; }}
              type="text"
              inputMode="numeric"
              pattern="[0-9]"
              maxLength={1}
              value={code[i]}
              onChange={(e) => handleCodeChange(i, e.target.value)}
              onKeyDown={(e) => handleCodeKeyDown(i, e)}
              onPaste={handleCodePaste}
              onFocus={(e) => e.target.select()}
              aria-label={`인증코드 ${i + 1}번째 자리`}
              className="size-12 rounded-lg border border-border bg-background text-center text-lg font-bold outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/30 aria-[invalid=true]:border-destructive sm:size-14 sm:text-xl"
              aria-invalid={!!codeError}
            />
          ))}
        </div>

        {/* Timer + error */}
        <div className="flex flex-col items-center gap-1">
          {codeError ? (
            <p className="text-sm text-destructive">{codeError}</p>
          ) : codeTimer > 0 ? (
            <p className="text-sm text-muted-foreground">
              남은 시간 <span className="font-mono font-semibold text-foreground">{formatTime(codeTimer)}</span>
            </p>
          ) : (
            <p className="text-sm text-destructive">인증코드가 만료되었습니다</p>
          )}
        </div>

        <Button
          type="submit"
          className="h-11 w-full text-sm font-semibold"
          disabled={verifying || code.join("").length < CODE_LENGTH}
        >
          {verifying ? (
            <><SpinnerGap className="size-4 animate-spin" />확인 중...</>
          ) : (
            "확인"
          )}
        </Button>

        {/* Resend + back */}
        <div className="flex flex-col items-center gap-3">
          <Button
            type="button"
            variant="outline"
            className="h-9 gap-2 text-sm"
            onClick={handleResend}
            disabled={cooldown > 0}
          >
            <ArrowCounterClockwise className="size-4" />
            {cooldown > 0
              ? `${cooldown}초 후 재전송 가능`
              : "인증코드 재전송"}
          </Button>

          <button
            type="button"
            className="flex items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-foreground"
            onClick={() => { setStep("email"); setCode(Array(CODE_LENGTH).fill("")); setCodeError(null); }}
          >
            <ArrowLeft className="size-3.5" />
            이메일 변경
          </button>
        </div>
      </form>
    );
  }

  // ═══════════════════════════════════════════════════
  // Step 3: New password
  // ═══════════════════════════════════════════════════
  if (step === "reset") {
    return (
      <form onSubmit={handleResetSubmit} className="flex flex-col gap-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">새 비밀번호 설정</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            <span className="font-semibold text-foreground">{email}</span> 계정의 비밀번호를 재설정합니다
          </p>
        </div>

        {/* Password */}
        <div className="relative flex flex-col gap-1.5">
          <Label htmlFor="password">새 비밀번호</Label>
          <Input
            id="password"
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onBlur={() => handleBlur("password")}
            aria-invalid={touched.password && !!errors.password}
            maxLength={20}
            autoFocus
          />
          {touched.password && errors.password ? (
            <p className="absolute -bottom-4 text-xs text-destructive">{errors.password}</p>
          ) : (
            <p className="text-xs text-muted-foreground">8~20자, 영문·숫자·특수문자 포함</p>
          )}
        </div>

        {/* Password Confirm */}
        <div className="relative flex flex-col gap-1.5">
          <Label htmlFor="passwordConfirm">새 비밀번호 확인</Label>
          <Input
            id="passwordConfirm"
            type="password"
            placeholder="••••••••"
            value={passwordConfirm}
            onChange={(e) => setPasswordConfirm(e.target.value)}
            onBlur={() => handleBlur("passwordConfirm")}
            aria-invalid={touched.passwordConfirm && !!errors.passwordConfirm}
            maxLength={20}
          />
          {touched.passwordConfirm && errors.passwordConfirm && (
            <p className="absolute -bottom-4 text-xs text-destructive">
              {errors.passwordConfirm}
            </p>
          )}
        </div>

        <Button type="submit" className="h-11 text-sm font-semibold" disabled={resetting}>
          {resetting ? (
            <><SpinnerGap className="size-4 animate-spin" />변경 중...</>
          ) : (
            "비밀번호 변경"
          )}
        </Button>
      </form>
    );
  }

  // ═══════════════════════════════════════════════════
  // Step 4: Done
  // ═══════════════════════════════════════════════════
  return (
    <div className="flex flex-col items-center gap-6 text-center">
      <div className="flex size-16 items-center justify-center rounded-full bg-emerald-500/10">
        <CheckCircle className="size-8 text-emerald-500" weight="duotone" />
      </div>

      <div>
        <h1 className="text-2xl font-bold tracking-tight">비밀번호 변경 완료</h1>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
          새 비밀번호로 로그인해주세요
        </p>
      </div>

      <Button asChild className="h-11 w-full text-sm font-semibold">
        <Link href="/auth/login">로그인하기</Link>
      </Button>
    </div>
  );
}
