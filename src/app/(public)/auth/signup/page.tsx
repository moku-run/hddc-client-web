"use client";

import { useState, useEffect, useRef, useCallback, useMemo, type FormEvent, type KeyboardEvent, type ClipboardEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  EnvelopeSimple,
  ArrowCounterClockwise,
  ArrowLeft,
  SpinnerGap,
} from "@phosphor-icons/react";
import {
  validateEmail,
  validateNickname,
  validatePassword,
  validatePasswordConfirm,
} from "@/lib/validators";
import { useFormValidation } from "@/hooks/use-form-validation";
import { authApi, ApiError } from "@/lib/api";

const CODE_LENGTH = 6;
const COOLDOWN_SEC = 60;
const CODE_TTL_SEC = 300; // 5분

type Step = "email" | "verify" | "register";

export default function SignupPage() {
  const router = useRouter();
  const [step, setStep] = useState<Step>("email");

  // ─── Step 1: Email ───
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState<string | null>(null);
  const [emailSubmitted, setEmailSubmitted] = useState(false);
  const [sending, setSending] = useState(false);

  // ─── Step 2: Verify ───
  const [code, setCode] = useState<string[]>(Array(CODE_LENGTH).fill(""));
  const [codeError, setCodeError] = useState<string | null>(null);
  const [verifying, setVerifying] = useState(false);
  const [cooldown, setCooldown] = useState(0);
  const [codeTimer, setCodeTimer] = useState(0);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // ─── Step 3: Register ───
  const [nickname, setNickname] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [agreed, setAgreed] = useState(false);
  const [agreedError, setAgreedError] = useState<string | null>(null);
  const [registering, setRegistering] = useState(false);

  const [termsOpen, setTermsOpen] = useState(false);
  const [privacyOpen, setPrivacyOpen] = useState(false);

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

  // Auto-focus first code input
  useEffect(() => {
    if (step === "verify") {
      requestAnimationFrame(() => inputRefs.current[0]?.focus());
    }
  }, [step]);

  // ─── Step 1 handlers ───
  async function handleEmailSubmit(e: FormEvent) {
    e.preventDefault();
    setEmailSubmitted(true);
    const err = validateEmail(email);
    setEmailError(err);
    if (err) return;

    setSending(true);
    try {
      await authApi.sendVerificationCode(email);
      setStep("verify");
      setCooldown(COOLDOWN_SEC);
      setCodeTimer(CODE_TTL_SEC);
    } catch (err) {
      if (err instanceof ApiError) {
        const msg: Record<string, string> = {
          U001: "이미 가입된 이메일입니다",
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
      await authApi.verifyCode(email, joined);
      setStep("register");
    } catch (err) {
      if (err instanceof ApiError) {
        const msg: Record<string, string> = {
          V003: "인증코드가 만료되었습니다",
          V004: "인증코드가 일치하지 않습니다",
          V005: "인증 시도 횟수를 초과했습니다",
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
      await authApi.sendVerificationCode(email);
      setCooldown(COOLDOWN_SEC);
      setCodeTimer(CODE_TTL_SEC);
    } catch {
      setCodeError("재전송에 실패했습니다. 잠시 후 다시 시도해주세요");
    }
    requestAnimationFrame(() => inputRefs.current[0]?.focus());
  }

  // ─── Step 3 handlers ───
  const registerValidators = useMemo(() => ({
    nickname: () => validateNickname(nickname),
    password: () => validatePassword(password),
    passwordConfirm: () => validatePasswordConfirm(password, passwordConfirm),
  }), [nickname, password, passwordConfirm]);

  const { errors, touched, handleBlur, setFieldError, validateAll } = useFormValidation(registerValidators);

  async function handleRegisterSubmit(e: FormEvent) {
    e.preventDefault();

    const fieldsValid = validateAll(["nickname", "password", "passwordConfirm"]);
    if (!agreed) {
      setAgreedError("약관에 동의해주세요");
    }
    if (!fieldsValid || !agreed) return;
    setAgreedError(null);

    setRegistering(true);
    try {
      await authApi.signUp(email, password, nickname);
      await authApi.login(email, password);
      router.push("/dashboard");
    } catch (err) {
      if (err instanceof ApiError) {
        if (err.code === "V006") {
          setStep("email");
          setEmailError("인증이 만료되었습니다. 다시 인증해주세요");
        } else if (err.code === "U001") {
          setFieldError("nickname", "이미 가입된 이메일입니다");
        } else {
          setFieldError("nickname", err.message);
        }
      }
    } finally {
      setRegistering(false);
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
          <h1 className="text-2xl font-bold tracking-tight">회원가입</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            이메일을 입력하면 인증코드를 보내드립니다
          </p>
        </div>

        <div className="relative flex flex-col gap-1.5">
          <Label htmlFor="email">이메일</Label>
          <Input
            id="email"
            type="email"
            placeholder="name@example.com"
            value={email}
            onChange={(e) => { setEmail(e.target.value); if (emailSubmitted) setEmailError(null); }}
            aria-invalid={emailSubmitted && !!emailError}
            maxLength={254}
            autoFocus
          />
          {emailSubmitted && emailError && (
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
          이미 계정이 있으신가요?{" "}
          <Link href="/auth/login" className="font-semibold underline text-foreground">
            로그인
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
  // Step 3: Register (nickname, password, terms)
  // ═══════════════════════════════════════════════════
  return (
    <>
      <form onSubmit={handleRegisterSubmit} className="flex flex-col gap-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">계정 만들기</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            <span className="font-semibold text-foreground">{email}</span> 인증 완료
          </p>
        </div>

        {/* Nickname */}
        <div className="relative flex flex-col gap-1.5">
          <Label htmlFor="nickname">닉네임</Label>
          <Input
            id="nickname"
            type="text"
            placeholder="나만의 이름"
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
            onBlur={() => handleBlur("nickname")}
            aria-invalid={touched.nickname && !!errors.nickname}
            maxLength={20}
            autoFocus
          />
          {touched.nickname && errors.nickname && (
            <p className="absolute -bottom-4 text-xs text-destructive">{errors.nickname}</p>
          )}
        </div>

        {/* Password */}
        <div className="relative flex flex-col gap-1.5">
          <Label htmlFor="password">비밀번호</Label>
          <Input
            id="password"
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onBlur={() => handleBlur("password")}
            aria-invalid={touched.password && !!errors.password}
            maxLength={20}
          />
          {touched.password && errors.password ? (
            <p className="absolute -bottom-4 text-xs text-destructive">{errors.password}</p>
          ) : (
            <p className="text-xs text-muted-foreground">8~20자, 영문·숫자·특수문자(!@#$%^&*()_=+.) 포함</p>
          )}
        </div>

        {/* Password Confirm */}
        <div className="relative flex flex-col gap-1.5">
          <Label htmlFor="passwordConfirm">비밀번호 확인</Label>
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

        {/* Terms */}
        <div className="relative flex flex-col gap-1.5">
          <div className="flex items-start gap-2">
            <Checkbox
              id="terms"
              checked={agreed}
              onCheckedChange={(checked) => setAgreed(checked === true)}
              aria-invalid={!!agreedError}
            />
            <label
              htmlFor="terms"
              className="text-sm leading-relaxed text-muted-foreground"
            >
              <Button
                type="button"
                variant="link"
                className="h-auto p-0 text-sm text-foreground"
                onClick={() => setTermsOpen(true)}
              >
                이용약관
              </Button>{" "}
              및{" "}
              <Button
                type="button"
                variant="link"
                className="h-auto p-0 text-sm text-foreground"
                onClick={() => setPrivacyOpen(true)}
              >
                개인정보처리방침
              </Button>
              에 동의합니다
            </label>
          </div>
          {agreedError && (
            <p className="absolute -bottom-4 text-xs text-destructive">{agreedError}</p>
          )}
        </div>

        {/* Submit */}
        <Button type="submit" className="h-11 text-sm font-semibold" disabled={registering}>
          {registering ? (
            <><SpinnerGap className="size-4 animate-spin" />가입 중...</>
          ) : (
            "가입하기"
          )}
        </Button>

        {/* Login Link */}
        <p className="text-center text-sm text-muted-foreground">
          이미 계정이 있으신가요?{" "}
          <Link href="/auth/login" className="font-semibold underline text-foreground">
            로그인
          </Link>
        </p>
      </form>

      {/* ─── Terms Modal ─── */}
      <Dialog open={termsOpen} onOpenChange={setTermsOpen}>
        <DialogContent className="max-h-[80vh] overflow-y-auto sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>이용약관</DialogTitle>
          </DialogHeader>
          <div className="prose prose-sm text-sm leading-relaxed text-muted-foreground space-y-4">
            <h3 className="text-base font-semibold text-foreground">제1조 (목적)</h3>
            <p>본 약관은 핫딜닷쿨(이하 &quot;회사&quot;)이 제공하는 프로필 링크 서비스(이하 &quot;서비스&quot;)의 이용조건 및 절차, 회사와 이용자의 권리·의무 및 책임사항을 규정함을 목적으로 합니다.</p>

            <h3 className="text-base font-semibold text-foreground">제2조 (정의)</h3>
            <p>① &quot;서비스&quot;란 회사가 제공하는 프로필 페이지 생성, 링크 관리, 클릭 분석 등 관련 제반 서비스를 의미합니다.</p>
            <p>② &quot;이용자&quot;란 본 약관에 따라 회사가 제공하는 서비스를 이용하는 회원 및 비회원을 말합니다.</p>
            <p>③ &quot;회원&quot;이란 회사에 개인정보를 제공하여 회원등록을 한 자로서, 회사의 서비스를 계속적으로 이용할 수 있는 자를 말합니다.</p>

            <h3 className="text-base font-semibold text-foreground">제3조 (약관의 효력 및 변경)</h3>
            <p>① 본 약관은 서비스를 이용하고자 하는 모든 이용자에 대하여 그 효력을 발생합니다.</p>
            <p>② 회사는 합리적인 사유가 발생할 경우 관련 법령에 위배되지 않는 범위 내에서 본 약관을 변경할 수 있으며, 변경된 약관은 서비스 내 공지사항을 통해 공지합니다.</p>

            <h3 className="text-base font-semibold text-foreground">제4조 (회원가입)</h3>
            <p>① 이용자는 회사가 정한 가입 양식에 따라 회원정보를 기입한 후 본 약관에 동의한다는 의사표시를 함으로써 회원가입을 신청합니다.</p>
            <p>② 회사는 전항의 신청에 대하여 서비스 이용을 승낙함을 원칙으로 합니다. 다만, 다음 각 호에 해당하는 경우 승낙을 거부할 수 있습니다.</p>

            <h3 className="text-base font-semibold text-foreground">제5조 (서비스의 제공)</h3>
            <p>① 회사는 회원에게 프로필 페이지 생성 및 관리, 듀얼뷰(모바일/웹) 최적화, 클릭 분석 및 통계, 테마 커스터마이징 등의 서비스를 제공합니다.</p>
            <p>② 서비스는 연중무휴, 1일 24시간 제공함을 원칙으로 합니다. 다만, 시스템 정기점검 등의 필요에 의해 회사가 정한 날이나 시간에는 서비스를 일시 중단할 수 있습니다.</p>

            <h3 className="text-base font-semibold text-foreground">제6조 (회원 탈퇴 및 자격 상실)</h3>
            <p>① 회원은 회사에 언제든지 탈퇴를 요청할 수 있으며, 회사는 즉시 회원탈퇴를 처리합니다.</p>
            <p>② 회원이 다음 각 호의 사유에 해당하는 경우, 회사는 회원자격을 제한 또는 정지시킬 수 있습니다.</p>
          </div>
        </DialogContent>
      </Dialog>

      {/* ─── Privacy Modal ─── */}
      <Dialog open={privacyOpen} onOpenChange={setPrivacyOpen}>
        <DialogContent className="max-h-[80vh] overflow-y-auto sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>개인정보처리방침</DialogTitle>
          </DialogHeader>
          <div className="prose prose-sm text-sm leading-relaxed text-muted-foreground space-y-4">
            <h3 className="text-base font-semibold text-foreground">1. 개인정보의 수집 및 이용 목적</h3>
            <p>회사는 다음의 목적을 위하여 개인정보를 처리합니다. 처리하고 있는 개인정보는 다음의 목적 이외의 용도로는 이용되지 않으며, 이용 목적이 변경되는 경우에는 별도의 동의를 받는 등 필요한 조치를 이행합니다.</p>
            <p>① 회원가입 및 관리: 회원 가입의사 확인, 회원제 서비스 제공에 따른 본인 식별·인증, 회원자격 유지·관리, 서비스 부정이용 방지 등</p>
            <p>② 서비스 제공: 프로필 페이지 생성 및 관리, 콘텐츠 제공, 맞춤 서비스 제공 등</p>

            <h3 className="text-base font-semibold text-foreground">2. 수집하는 개인정보 항목</h3>
            <p>회사는 회원가입 시 서비스 이용을 위해 필요한 최소한의 개인정보를 수집합니다.</p>
            <p>① 필수항목: 이메일 주소, 닉네임, 비밀번호</p>
            <p>② 자동수집항목: 접속 IP 주소, 접속 로그, 브라우저 종류, 서비스 이용 기록</p>

            <h3 className="text-base font-semibold text-foreground">3. 개인정보의 보유 및 이용기간</h3>
            <p>회사는 법령에 따른 개인정보 보유·이용기간 또는 정보주체로부터 개인정보를 수집 시에 동의 받은 개인정보 보유·이용기간 내에서 개인정보를 처리·보유합니다.</p>
            <p>① 회원 정보: 회원 탈퇴 시까지 (단, 관계 법령에 따라 보존이 필요한 경우 해당 기간까지)</p>
            <p>② 서비스 이용 기록: 3년 (전자상거래 등에서의 소비자 보호에 관한 법률)</p>

            <h3 className="text-base font-semibold text-foreground">4. 개인정보의 제3자 제공</h3>
            <p>회사는 원칙적으로 이용자의 개인정보를 제3자에게 제공하지 않습니다. 다만, 이용자가 사전에 동의한 경우 또는 법령의 규정에 의한 경우에는 예외로 합니다.</p>

            <h3 className="text-base font-semibold text-foreground">5. 개인정보의 파기</h3>
            <p>회사는 개인정보 보유기간의 경과, 처리목적 달성 등 개인정보가 불필요하게 되었을 때에는 지체 없이 해당 개인정보를 파기합니다.</p>

            <h3 className="text-base font-semibold text-foreground">6. 이용자의 권리·의무</h3>
            <p>① 이용자는 회사에 대해 언제든지 개인정보 열람·정정·삭제·처리정지 요구 등의 권리를 행사할 수 있습니다.</p>
            <p>② 이용자는 개인정보 보호법 등 관계 법령을 준수하여야 하며, 타인의 개인정보를 침해하여서는 안됩니다.</p>

            <h3 className="text-base font-semibold text-foreground">7. 개인정보 보호책임자</h3>
            <p>회사는 개인정보 처리에 관한 업무를 총괄해서 책임지고, 개인정보 처리와 관련한 이용자의 불만처리 및 피해구제 등을 위하여 개인정보 보호책임자를 지정하고 있습니다.</p>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
