import Link from "next/link";
import { Check, X } from "@phosphor-icons/react/dist/ssr";
import { Button } from "@/components/ui/button";
import { SiteFooter } from "@/components/site-footer";
import { cn } from "@/lib/utils";

const PLANS = [
  {
    name: "Free",
    price: "0",
    unit: "원",
    description: "시작하기에 충분한 기본 기능",
    cta: "무료로 시작하기",
    href: "/auth/signup",
    highlight: false,
    features: [
      { text: "기본 프로필 페이지", included: true },
      { text: "링크 최대 20개", included: true },
      { text: "테마 프리셋 10종", included: true },
      { text: "듀얼뷰 (모바일 + 웹)", included: true },
      { text: "하단 스폰서 배너 표시", included: true },
      { text: "분석 대시보드", included: false },
      { text: "커스텀 테마", included: false },
      { text: "폰트 확장팩", included: false },
      { text: "커스텀 도메인", included: false },
    ],
  },
  {
    name: "Pro",
    price: "5,000",
    unit: "원/월",
    description: "크리에이터를 위한 프리미엄 기능",
    cta: "Pro 시작하기",
    href: "/auth/signup",
    highlight: true,
    features: [
      { text: "Free의 모든 기능", included: true },
      { text: "광고 제거", included: true },
      { text: "분석 대시보드", included: true },
      { text: "커스텀 테마 색상", included: true },
      { text: "폰트 확장팩 (6종+)", included: true },
      { text: "링크 무제한", included: true },
      { text: "커스텀 도메인", included: false },
      { text: "우선 지원", included: false },
      { text: "API 접근", included: false },
    ],
  },
  {
    name: "Business",
    price: "15,000",
    unit: "원/월",
    description: "팀과 비즈니스를 위한 풀 패키지",
    cta: "Business 시작하기",
    href: "/auth/signup",
    highlight: false,
    features: [
      { text: "Pro의 모든 기능", included: true },
      { text: "커스텀 도메인 연결", included: true },
      { text: "우선 고객 지원", included: true },
      { text: "API 접근", included: true },
      { text: "팀 멤버 관리", included: true },
      { text: "고급 분석 리포트", included: true },
    ],
  },
] as const;

export default function PricingPage() {
  return (
    <div className="flex min-h-svh flex-col">
      <main className="flex-1 px-4 py-20 sm:py-24">
        <div className="mx-auto max-w-5xl">
          {/* Header */}
          <div className="mb-14 text-center">
            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
              심플한 요금제
            </h1>
            <p className="mt-3 text-muted-foreground">
              필요한 만큼만 선택하세요. 언제든 변경 가능합니다.
            </p>
          </div>

          {/* Plan cards */}
          <div className="grid gap-6 sm:grid-cols-3">
            {PLANS.map((plan) => (
              <div
                key={plan.name}
                className={cn(
                  "relative flex flex-col rounded-2xl border p-6",
                  plan.highlight
                    ? "border-primary bg-primary/[0.03] shadow-md"
                    : "border-border",
                )}
              >
                {plan.highlight && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-primary px-3 py-0.5 text-[11px] font-semibold text-primary-foreground">
                    인기
                  </span>
                )}

                <h2 className="text-lg font-bold">{plan.name}</h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  {plan.description}
                </p>

                <div className="mt-5 flex items-baseline gap-1">
                  <span className="text-3xl font-extrabold tracking-tight">
                    {plan.price}
                  </span>
                  <span className="text-sm text-muted-foreground">
                    {plan.unit}
                  </span>
                </div>

                <Button
                  asChild
                  variant={plan.highlight ? "default" : "outline"}
                  className="mt-6 h-10 w-full text-sm font-semibold"
                >
                  <Link href={plan.href}>{plan.cta}</Link>
                </Button>

                <ul className="mt-6 flex flex-col gap-2.5 border-t border-border pt-6">
                  {plan.features.map((f) => (
                    <li key={f.text} className="flex items-start gap-2 text-sm">
                      {f.included ? (
                        <Check
                          weight="bold"
                          className="mt-0.5 size-4 shrink-0 text-primary"
                        />
                      ) : (
                        <X className="mt-0.5 size-4 shrink-0 text-muted-foreground/40" />
                      )}
                      <span
                        className={cn(
                          !f.included && "text-muted-foreground/50",
                        )}
                      >
                        {f.text}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* FAQ teaser */}
          <div className="mt-16 text-center">
            <p className="text-sm text-muted-foreground">
              결제는 안전하게 처리되며, 언제든 해지할 수 있습니다.
            </p>
          </div>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
