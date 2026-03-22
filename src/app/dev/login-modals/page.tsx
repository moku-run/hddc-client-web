"use client";

import { useState, useRef, useEffect, useCallback, type KeyboardEvent, type ClipboardEvent } from "react";
import { Fire, X, Heart, Eye, EyeSlash, ArrowRight, ArrowLeft, EnvelopeSimple, ArrowCounterClockwise, SpinnerGap, CheckCircle } from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";

/* ═══════════════════════════════════════════════════════════
   Shared components
   ═══════════════════════════════════════════════════════════ */

const CODE_LENGTH = 6;

function PasswordInput({ id, className, placeholder = "••••••••" }: { id: string; className?: string; placeholder?: string }) {
  const [show, setShow] = useState(false);
  return (
    <div className="relative">
      <Input id={id} type={show ? "text" : "password"} placeholder={placeholder} className={className} />
      <button type="button" onClick={() => setShow(!show)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
        {show ? <EyeSlash className="size-4" /> : <Eye className="size-4" />}
      </button>
    </div>
  );
}

function Backdrop({ children, onClose }: { children: React.ReactNode; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm" onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      {children}
    </div>
  );
}

function BackdropBottom({ children, onClose }: { children: React.ReactNode; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 backdrop-blur-sm" onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      {children}
    </div>
  );
}

function CloseBtn({ onClose }: { onClose: () => void }) {
  return (
    <button onClick={onClose} className="absolute right-4 top-4 z-10 text-muted-foreground hover:text-foreground">
      <X className="size-5" />
    </button>
  );
}

/* ─── OTP Input ─── */
function OtpInput({ code, setCode, setError }: { code: string[]; setCode: (c: string[]) => void; setError: (e: string | null) => void }) {
  const refs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    requestAnimationFrame(() => refs.current[0]?.focus());
  }, []);

  function handleChange(i: number, value: string) {
    const digit = value.replace(/\D/g, "").slice(-1);
    const next = [...code]; next[i] = digit; setCode(next);
    setError(null);
    if (digit && i < CODE_LENGTH - 1) refs.current[i + 1]?.focus();
  }

  function handleKeyDown(i: number, e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Backspace" && !code[i] && i > 0) refs.current[i - 1]?.focus();
    if (e.key === "ArrowLeft" && i > 0) refs.current[i - 1]?.focus();
    if (e.key === "ArrowRight" && i < CODE_LENGTH - 1) refs.current[i + 1]?.focus();
  }

  function handlePaste(e: ClipboardEvent<HTMLInputElement>) {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, CODE_LENGTH);
    const next = [...code]; pasted.split("").forEach((d, i) => { next[i] = d; }); setCode(next);
    setError(null);
    refs.current[Math.min(pasted.length, CODE_LENGTH - 1)]?.focus();
  }

  return (
    <div className="flex justify-center gap-2">
      {Array.from({ length: CODE_LENGTH }).map((_, i) => (
        <input
          key={i}
          ref={(el) => { refs.current[i] = el; }}
          type="text" inputMode="numeric" maxLength={1} value={code[i]}
          onChange={(e) => handleChange(i, e.target.value)}
          onKeyDown={(e) => handleKeyDown(i, e)}
          onPaste={handlePaste}
          onFocus={(e) => e.target.select()}
          className="size-10 rounded-lg border border-border bg-background text-center text-base font-bold outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/30 sm:size-11"
        />
      ))}
    </div>
  );
}

/* ─── Signup step types ─── */
type SignupStep = "email" | "verify" | "register";

function formatTime(s: number) {
  return `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, "0")}`;
}

/* ─── Signup flow (shared by all styles) ─── */
function useSignupFlow() {
  const [step, setStep] = useState<SignupStep>("email");
  const [email, setEmail] = useState("");
  const [code, setCode] = useState<string[]>(Array(CODE_LENGTH).fill(""));
  const [codeError, setCodeError] = useState<string | null>(null);
  const [codeTimer, setCodeTimer] = useState(0);
  const [cooldown, setCooldown] = useState(0);

  useEffect(() => { if (cooldown > 0) { const t = setTimeout(() => setCooldown(c => c - 1), 1000); return () => clearTimeout(t); } }, [cooldown]);
  useEffect(() => { if (codeTimer > 0) { const t = setTimeout(() => setCodeTimer(c => c - 1), 1000); return () => clearTimeout(t); } }, [codeTimer]);

  function sendCode() {
    if (!email.includes("@")) return;
    setStep("verify");
    setCooldown(60);
    setCodeTimer(300);
    setCode(Array(CODE_LENGTH).fill(""));
    setCodeError(null);
  }

  function resendCode() {
    setCooldown(60);
    setCodeTimer(300);
    setCode(Array(CODE_LENGTH).fill(""));
    setCodeError(null);
  }

  function verifyCode() {
    if (code.join("").length < CODE_LENGTH) { setCodeError("인증코드 6자리를 모두 입력해주세요"); return; }
    if (codeTimer <= 0) { setCodeError("인증코드가 만료되었습니다. 재전송해주세요"); return; }
    setStep("register");
  }

  function backToEmail() {
    setStep("email");
    setCode(Array(CODE_LENGTH).fill(""));
    setCodeError(null);
  }

  function reset() {
    setStep("email");
    setEmail("");
    setCode(Array(CODE_LENGTH).fill(""));
    setCodeError(null);
    setCodeTimer(0);
    setCooldown(0);
  }

  return { step, setStep, email, setEmail, code, setCode, codeError, setCodeError, codeTimer, cooldown, sendCode, resendCode, verifyCode, backToEmail, reset };
}

/* ─── Login form fields ─── */
function LoginFields({ prefix }: { prefix: string }) {
  return (
    <>
      <div className="flex flex-col gap-1.5">
        <Label htmlFor={`${prefix}-email`}>이메일</Label>
        <Input id={`${prefix}-email`} type="email" placeholder="name@example.com" />
      </div>
      <div className="flex flex-col gap-1.5">
        <div className="flex items-center justify-between">
          <Label htmlFor={`${prefix}-pw`}>비밀번호</Label>
          <a href="/auth/forgot-password" className="text-[11px] text-muted-foreground hover:text-primary">비밀번호 찾기</a>
        </div>
        <PasswordInput id={`${prefix}-pw`} />
      </div>
    </>
  );
}

/* ─── Signup Step 1: Email ─── */
function SignupEmailStep({ prefix, email, setEmail, onSend }: { prefix: string; email: string; setEmail: (e: string) => void; onSend: () => void }) {
  return (
    <form onSubmit={(e) => { e.preventDefault(); onSend(); }} className="flex flex-col gap-4">
      <div className="flex flex-col gap-1.5">
        <Label htmlFor={`${prefix}-s-email`}>이메일</Label>
        <Input id={`${prefix}-s-email`} type="email" placeholder="name@example.com" value={email} onChange={(e) => setEmail(e.target.value)} autoFocus />
      </div>
      <Button className="h-10 font-semibold" disabled={!email.includes("@")}>인증코드 발송</Button>
    </form>
  );
}

/* ─── Signup Step 2: OTP Verify ─── */
function SignupVerifyStep({
  email, code, setCode, codeError, setCodeError, codeTimer, cooldown, onVerify, onResend, onBack,
}: {
  email: string; code: string[]; setCode: (c: string[]) => void; codeError: string | null; setCodeError: (e: string | null) => void;
  codeTimer: number; cooldown: number; onVerify: () => void; onResend: () => void; onBack: () => void;
}) {
  return (
    <form onSubmit={(e) => { e.preventDefault(); onVerify(); }} className="flex flex-col items-center gap-4">
      <div className="flex size-12 items-center justify-center rounded-full bg-primary/10">
        <EnvelopeSimple className="size-6 text-primary" weight="duotone" />
      </div>
      <div className="text-center">
        <p className="text-sm font-semibold">인증코드 입력</p>
        <p className="mt-1 text-xs text-muted-foreground">
          <span className="font-medium text-foreground">{email}</span>으로 전송됨
        </p>
      </div>

      <OtpInput code={code} setCode={setCode} setError={setCodeError} />

      {codeError ? (
        <p className="text-xs text-destructive">{codeError}</p>
      ) : codeTimer > 0 ? (
        <p className="text-xs text-muted-foreground">남은 시간 <span className="font-mono font-semibold text-foreground">{formatTime(codeTimer)}</span></p>
      ) : (
        <p className="text-xs text-destructive">인증코드가 만료되었습니다</p>
      )}

      <Button type="submit" className="h-10 w-full font-semibold" disabled={code.join("").length < CODE_LENGTH}>확인</Button>

      <div className="flex items-center gap-3 text-xs">
        <button type="button" onClick={onResend} disabled={cooldown > 0} className="flex items-center gap-1 text-muted-foreground hover:text-foreground disabled:opacity-40">
          <ArrowCounterClockwise className="size-3.5" />
          {cooldown > 0 ? `${cooldown}초 후 재전송` : "재전송"}
        </button>
        <span className="text-border">|</span>
        <button type="button" onClick={onBack} className="flex items-center gap-1 text-muted-foreground hover:text-foreground">
          <ArrowLeft className="size-3.5" />이메일 변경
        </button>
      </div>
    </form>
  );
}

/* ─── Signup Step 3: Register ─── */
function SignupRegisterStep({ prefix, email }: { prefix: string; email: string }) {
  return (
    <form onSubmit={(e) => e.preventDefault()} className="flex flex-col gap-3.5">
      <div className="flex items-center gap-2 rounded-lg bg-green-500/10 px-3 py-2 text-xs">
        <CheckCircle className="size-4 text-green-600" weight="fill" />
        <span className="text-green-700"><span className="font-semibold">{email}</span> 인증 완료</span>
      </div>
      <div className="flex flex-col gap-1.5">
        <Label htmlFor={`${prefix}-r-nick`}>닉네임</Label>
        <Input id={`${prefix}-r-nick`} placeholder="나만의 이름" maxLength={20} />
        <p className="text-[10px] text-muted-foreground">한글, 영문, 숫자 2~20자</p>
      </div>
      <div className="flex flex-col gap-1.5">
        <Label htmlFor={`${prefix}-r-pw`}>비밀번호</Label>
        <PasswordInput id={`${prefix}-r-pw`} />
        <p className="text-[10px] text-muted-foreground">8~20자, 영문·숫자·특수문자 포함</p>
      </div>
      <div className="flex flex-col gap-1.5">
        <Label htmlFor={`${prefix}-r-pw2`}>비밀번호 확인</Label>
        <PasswordInput id={`${prefix}-r-pw2`} />
      </div>
      <div className="flex items-start gap-2">
        <Checkbox id={`${prefix}-r-terms`} />
        <label htmlFor={`${prefix}-r-terms`} className="text-xs leading-relaxed text-muted-foreground">
          <span className="font-medium text-foreground underline">이용약관</span> 및 <span className="font-medium text-foreground underline">개인정보처리방침</span>에 동의합니다
        </label>
      </div>
      <Button className="h-10 font-semibold">가입하기</Button>
    </form>
  );
}

/* ═══════════════════════════════════════════════════════════
   A: 컴팩트 — 텍스트 링크 전환
   ═══════════════════════════════════════════════════════════ */

function StyleA({ onClose }: { onClose: () => void }) {
  const [mode, setMode] = useState<"login" | "signup">("login");
  const signup = useSignupFlow();

  function switchToLogin() { setMode("login"); signup.reset(); }

  return (
    <Backdrop onClose={onClose}>
      <div className="relative w-full max-w-sm rounded-2xl border border-border bg-card p-6 shadow-xl">
        <CloseBtn onClose={onClose} />

        {mode === "login" ? (
          <>
            <div className="mb-6 text-center">
              <h2 className="text-lg font-bold">로그인</h2>
              <p className="mt-1 text-sm text-muted-foreground">이메일로 로그인하세요</p>
            </div>
            <form className="flex flex-col gap-4"><LoginFields prefix="a" /><Button className="h-10 font-semibold">로그인</Button></form>
            <p className="mt-4 text-center text-sm text-muted-foreground">
              계정이 없으신가요?{" "}
              <button onClick={() => setMode("signup")} className="font-semibold text-primary hover:underline">회원가입</button>
            </p>
          </>
        ) : signup.step === "email" ? (
          <>
            <div className="mb-6 text-center">
              <h2 className="text-lg font-bold">회원가입</h2>
              <p className="mt-1 text-sm text-muted-foreground">이메일 인증 후 가입할 수 있습니다</p>
            </div>
            <SignupEmailStep prefix="a" email={signup.email} setEmail={signup.setEmail} onSend={signup.sendCode} />
            <p className="mt-4 text-center text-sm text-muted-foreground">
              이미 계정이 있으신가요?{" "}
              <button onClick={switchToLogin} className="font-semibold text-primary hover:underline">로그인</button>
            </p>
          </>
        ) : signup.step === "verify" ? (
          <SignupVerifyStep email={signup.email} code={signup.code} setCode={signup.setCode} codeError={signup.codeError} setCodeError={signup.setCodeError} codeTimer={signup.codeTimer} cooldown={signup.cooldown} onVerify={signup.verifyCode} onResend={signup.resendCode} onBack={signup.backToEmail} />
        ) : (
          <>
            <div className="mb-4 text-center">
              <h2 className="text-lg font-bold">계정 만들기</h2>
            </div>
            <SignupRegisterStep prefix="a" email={signup.email} />
          </>
        )}
      </div>
    </Backdrop>
  );
}

/* ═══════════════════════════════════════════════════════════
   B: 컨텍스트 — 이유 표시 + 회원가입 버튼
   ═══════════════════════════════════════════════════════════ */

function StyleB({ onClose }: { onClose: () => void }) {
  const [mode, setMode] = useState<"login" | "signup">("login");
  const signup = useSignupFlow();

  function switchToLogin() { setMode("login"); signup.reset(); }

  return (
    <Backdrop onClose={onClose}>
      <div className="relative w-full max-w-sm rounded-2xl border border-border bg-card p-6 shadow-xl">
        <CloseBtn onClose={onClose} />

        {mode === "login" ? (
          <>
            <div className="mb-5 flex items-center gap-3 rounded-lg bg-primary/5 p-3">
              <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary/10">
                <Heart className="size-5 text-primary" />
              </div>
              <div>
                <p className="text-sm font-semibold">로그인이 필요합니다</p>
                <p className="text-xs text-muted-foreground">좋아요, 댓글, 투표 기능을 이용하려면 로그인해주세요</p>
              </div>
            </div>
            <form className="flex flex-col gap-4"><LoginFields prefix="b" /><Button className="h-10 font-semibold">로그인</Button></form>
            <div className="mt-4 flex items-center gap-3"><div className="h-px flex-1 bg-border" /><span className="text-[11px] text-muted-foreground">또는</span><div className="h-px flex-1 bg-border" /></div>
            <Button variant="outline" className="mt-4 h-10 w-full font-semibold" onClick={() => setMode("signup")}>회원가입 <ArrowRight className="ml-1 size-4" /></Button>
          </>
        ) : signup.step === "email" ? (
          <>
            <button onClick={switchToLogin} className="mb-4 flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"><ArrowLeft className="size-4" /> 로그인으로 돌아가기</button>
            <div className="mb-5 text-center"><h2 className="text-lg font-bold">회원가입</h2><p className="mt-1 text-sm text-muted-foreground">이메일 인증 후 가입할 수 있습니다</p></div>
            <SignupEmailStep prefix="b" email={signup.email} setEmail={signup.setEmail} onSend={signup.sendCode} />
          </>
        ) : signup.step === "verify" ? (
          <SignupVerifyStep email={signup.email} code={signup.code} setCode={signup.setCode} codeError={signup.codeError} setCodeError={signup.setCodeError} codeTimer={signup.codeTimer} cooldown={signup.cooldown} onVerify={signup.verifyCode} onResend={signup.resendCode} onBack={signup.backToEmail} />
        ) : (
          <>
            <div className="mb-4 text-center"><h2 className="text-lg font-bold">계정 만들기</h2></div>
            <SignupRegisterStep prefix="b" email={signup.email} />
          </>
        )}
      </div>
    </Backdrop>
  );
}

/* ═══════════════════════════════════════════════════════════
   C: 탭 전환
   ═══════════════════════════════════════════════════════════ */

function StyleC({ onClose }: { onClose: () => void }) {
  const [tab, setTab] = useState<"login" | "signup">("login");
  const signup = useSignupFlow();

  function switchTab(t: "login" | "signup") { setTab(t); if (t === "login") signup.reset(); }

  // 인증/등록 단계에서는 탭 숨김
  const showTabs = tab === "login" || signup.step === "email";

  return (
    <Backdrop onClose={onClose}>
      <div className="relative w-full max-w-sm rounded-2xl border border-border bg-card shadow-xl">
        <CloseBtn onClose={onClose} />

        {showTabs && (
          <div className="flex border-b border-border">
            <button onClick={() => switchTab("login")} className={cn("flex-1 py-3.5 text-sm font-semibold transition-colors", tab === "login" ? "border-b-2 border-primary text-foreground" : "text-muted-foreground hover:text-foreground")}>로그인</button>
            <button onClick={() => switchTab("signup")} className={cn("flex-1 py-3.5 text-sm font-semibold transition-colors", tab === "signup" ? "border-b-2 border-primary text-foreground" : "text-muted-foreground hover:text-foreground")}>회원가입</button>
          </div>
        )}

        <div className="p-6">
          {tab === "login" ? (
            <form className="flex flex-col gap-4"><LoginFields prefix="c" /><Button className="h-10 font-semibold">로그인</Button></form>
          ) : signup.step === "email" ? (
            <>
              <p className="mb-4 text-center text-sm text-muted-foreground">이메일 인증 후 가입할 수 있습니다</p>
              <SignupEmailStep prefix="c" email={signup.email} setEmail={signup.setEmail} onSend={signup.sendCode} />
            </>
          ) : signup.step === "verify" ? (
            <SignupVerifyStep email={signup.email} code={signup.code} setCode={signup.setCode} codeError={signup.codeError} setCodeError={signup.setCodeError} codeTimer={signup.codeTimer} cooldown={signup.cooldown} onVerify={signup.verifyCode} onResend={signup.resendCode} onBack={signup.backToEmail} />
          ) : (
            <>
              <div className="mb-4 text-center"><p className="text-sm font-semibold">계정 만들기</p></div>
              <SignupRegisterStep prefix="c" email={signup.email} />
            </>
          )}
        </div>
      </div>
    </Backdrop>
  );
}

/* ═══════════════════════════════════════════════════════════
   D: 브랜딩 — 왼쪽 패널 고정
   ═══════════════════════════════════════════════════════════ */

function StyleD({ onClose }: { onClose: () => void }) {
  const [mode, setMode] = useState<"login" | "signup">("login");
  const signup = useSignupFlow();

  function switchToLogin() { setMode("login"); signup.reset(); }

  return (
    <Backdrop onClose={onClose}>
      <div className="relative w-full max-w-2xl overflow-hidden rounded-2xl border border-border bg-card shadow-xl">
        <CloseBtn onClose={onClose} />
        <div className="flex min-h-[480px]">
          <div className="hidden w-[220px] shrink-0 flex-col items-center justify-center gap-4 bg-primary p-8 text-primary-foreground sm:flex">
            <Fire className="size-12" weight="fill" />
            <div className="text-center"><p className="text-lg font-bold">핫딜닷쿨</p><p className="mt-1 text-xs opacity-80">최고의 핫딜을 한눈에</p></div>
            <div className="mt-4 space-y-2 text-center text-[11px] opacity-70"><p>실시간 핫딜 피드</p><p>좋아요 · 댓글 · 공유</p><p>나만의 프로필 꾸미기</p></div>
          </div>

          <div className="flex flex-1 flex-col justify-center p-8">
            {mode === "login" ? (
              <>
                <h2 className="text-lg font-bold">로그인</h2>
                <p className="mt-1 text-sm text-muted-foreground">이메일로 로그인하세요</p>
                <form className="mt-6 flex flex-col gap-4"><LoginFields prefix="d" /><Button className="h-10 font-semibold">로그인</Button></form>
                <p className="mt-4 text-center text-sm text-muted-foreground">계정이 없으신가요?{" "}<button onClick={() => setMode("signup")} className="font-semibold text-primary hover:underline">회원가입</button></p>
              </>
            ) : signup.step === "email" ? (
              <>
                <button onClick={switchToLogin} className="mb-3 flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"><ArrowLeft className="size-4" /> 로그인</button>
                <h2 className="text-lg font-bold">회원가입</h2>
                <p className="mt-1 text-sm text-muted-foreground">이메일 인증 후 가입할 수 있습니다</p>
                <div className="mt-5"><SignupEmailStep prefix="d" email={signup.email} setEmail={signup.setEmail} onSend={signup.sendCode} /></div>
              </>
            ) : signup.step === "verify" ? (
              <SignupVerifyStep email={signup.email} code={signup.code} setCode={signup.setCode} codeError={signup.codeError} setCodeError={signup.setCodeError} codeTimer={signup.codeTimer} cooldown={signup.cooldown} onVerify={signup.verifyCode} onResend={signup.resendCode} onBack={signup.backToEmail} />
            ) : (
              <>
                <h2 className="mb-4 text-lg font-bold">계정 만들기</h2>
                <SignupRegisterStep prefix="d" email={signup.email} />
              </>
            )}
          </div>
        </div>
      </div>
    </Backdrop>
  );
}

/* ═══════════════════════════════════════════════════════════
   E: 바텀 시트
   ═══════════════════════════════════════════════════════════ */

function StyleE({ onClose }: { onClose: () => void }) {
  const [mode, setMode] = useState<"login" | "signup">("login");
  const signup = useSignupFlow();

  function switchToLogin() { setMode("login"); signup.reset(); }

  return (
    <BackdropBottom onClose={onClose}>
      <div className="relative w-full max-w-sm rounded-t-2xl sm:rounded-2xl border border-border bg-card shadow-xl">
        <div className="flex justify-center pt-3 sm:hidden"><div className="h-1 w-10 rounded-full bg-muted-foreground/30" /></div>
        <CloseBtn onClose={onClose} />

        <div className="p-6 pt-4 sm:pt-6">
          {mode === "login" ? (
            <>
              <div className="mb-5 flex items-center gap-3">
                <Fire className="size-7 text-primary" weight="fill" />
                <div><h2 className="text-lg font-bold">핫딜닷쿨</h2><p className="text-xs text-muted-foreground">로그인하고 핫딜에 참여하세요</p></div>
              </div>
              <form className="flex flex-col gap-4">
                <div className="flex flex-col gap-1.5"><Label htmlFor="e-email">이메일</Label><Input id="e-email" type="email" placeholder="name@example.com" className="h-11" /></div>
                <div className="flex flex-col gap-1.5"><div className="flex items-center justify-between"><Label htmlFor="e-pw">비밀번호</Label><a href="/auth/forgot-password" className="text-[11px] text-muted-foreground hover:text-primary">비밀번호 찾기</a></div><PasswordInput id="e-pw" className="h-11" /></div>
                <Button className="h-11 font-semibold">로그인</Button>
              </form>
              <div className="mt-4 flex items-center gap-3"><div className="h-px flex-1 bg-border" /><span className="text-[11px] text-muted-foreground">처음이신가요?</span><div className="h-px flex-1 bg-border" /></div>
              <Button variant="outline" className="mt-4 h-11 w-full font-semibold" onClick={() => setMode("signup")}>회원가입</Button>
            </>
          ) : signup.step === "email" ? (
            <>
              <button onClick={switchToLogin} className="mb-4 flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"><ArrowLeft className="size-4" /> 로그인으로 돌아가기</button>
              <div className="mb-5"><h2 className="text-lg font-bold">회원가입</h2><p className="mt-1 text-sm text-muted-foreground">이메일 인증 후 가입할 수 있습니다</p></div>
              <SignupEmailStep prefix="e" email={signup.email} setEmail={signup.setEmail} onSend={signup.sendCode} />
            </>
          ) : signup.step === "verify" ? (
            <SignupVerifyStep email={signup.email} code={signup.code} setCode={signup.setCode} codeError={signup.codeError} setCodeError={signup.setCodeError} codeTimer={signup.codeTimer} cooldown={signup.cooldown} onVerify={signup.verifyCode} onResend={signup.resendCode} onBack={signup.backToEmail} />
          ) : (
            <>
              <div className="mb-4"><h2 className="text-lg font-bold">계정 만들기</h2></div>
              <SignupRegisterStep prefix="e" email={signup.email} />
            </>
          )}
        </div>
      </div>
    </BackdropBottom>
  );
}

/* ═══════════════════════════════════════════════════════════
   Page
   ═══════════════════════════════════════════════════════════ */

const STYLES = [
  { name: "A", label: "컴팩트", desc: "최소 정보. 텍스트 링크로 로그인↔회원가입 전환. 3단계 스텝 전부 모달 안에서 진행", Component: StyleA },
  { name: "B", label: "컨텍스트", desc: "왜 로그인이 필요한지 표시. 회원가입 별도 버튼 → ← 뒤로가기. 인증 전체 사이클 포함", Component: StyleB },
  { name: "C", label: "탭 전환", desc: "상단 탭 전환. 인증 단계 진입 시 탭 숨김 → 인증/등록 진행 후 완료", Component: StyleC },
  { name: "D", label: "브랜딩", desc: "왼쪽 브랜드 패널 고정 + 오른쪽에서 로그인/회원가입 3단계 전부 진행", Component: StyleD },
  { name: "E", label: "바텀 시트", desc: "모바일 바텀 시트. 로그인 → 회원가입 전환 시 이메일 인증 → OTP → 등록 전체 사이클", Component: StyleE },
];

export default function LoginModalsPage() {
  const [activeModal, setActiveModal] = useState<string | null>(null);
  const ActiveComponent = STYLES.find((s) => s.name === activeModal)?.Component;

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <h1 className="mb-2 text-2xl font-bold">로그인 모달 비교</h1>
      <p className="mb-2 text-sm text-muted-foreground">
        모든 스타일에 회원가입 전체 사이클(이메일 입력 → OTP 인증 → 닉네임/비번/약관)이 포함됩니다.
      </p>
      <p className="mb-8 text-xs text-muted-foreground/60">
        회원가입 플로우: ① 이메일 입력 → 인증코드 발송 → ② 6자리 OTP (타이머·재전송·이메일변경) → ③ 닉네임(중복체크) + 비밀번호 + 약관동의
      </p>

      <div className="grid gap-4 sm:grid-cols-2">
        {STYLES.map(({ name, label, desc }) => (
          <button
            key={name}
            onClick={() => setActiveModal(name)}
            className="flex items-start gap-4 rounded-xl border border-border bg-card p-5 text-left transition-all hover:border-primary/40 hover:shadow-md"
          >
            <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">{name}</span>
            <div>
              <p className="text-sm font-semibold">{label}</p>
              <p className="mt-0.5 text-xs text-muted-foreground">{desc}</p>
            </div>
          </button>
        ))}
      </div>

      <div className="mt-8 rounded-lg border border-dashed border-border bg-muted/30 p-4 text-center text-xs text-muted-foreground">
        카드 클릭 → 모달 열림. <strong>회원가입 버튼을 눌러 전체 3단계 플로우를 테스트</strong>해보세요.
      </div>

      {ActiveComponent && <ActiveComponent onClose={() => setActiveModal(null)} />}
    </div>
  );
}
