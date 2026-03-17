"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ToggleGroup } from "@/components/ui/toggle-group";
import { FeatureCard } from "@/components/feature-card";
import { SiteFooter } from "@/components/site-footer";
import { PhoneMockup, BrowserMockup } from "@/components/device-mockup";
import {
  LinkSimple,
  DeviceMobile,
  Desktop,
  ChartLineUp,
  Devices,
  ChartBar,
  Palette,
  Globe,
  CursorClick,
  ArrowRight,
} from "@phosphor-icons/react";

export default function Home() {
  const [activeView, setActiveView] = useState<"mobile" | "web">("mobile");

  return (
    <div className="relative flex min-h-svh flex-col">
      <main className="flex flex-1 flex-col">
        {/* ─── Section 1: Hero ─── */}
        <section className="relative overflow-hidden px-4 py-20 sm:py-28 lg:py-32">
          <div className="mx-auto grid max-w-5xl items-center gap-12 lg:grid-cols-2 lg:gap-16">
            {/* Left: Text */}
            <div className="flex flex-col items-center text-center lg:items-start lg:text-left">

              <h1 className="text-4xl font-bold leading-tight tracking-tight sm:text-5xl lg:text-[3.25rem]">
                하나의 링크,
                <br />
                <span className="text-primary">두 개의 완벽한 뷰</span>
              </h1>

              <p className="mt-6 max-w-md text-lg leading-relaxed text-muted-foreground">
                모바일에서도 웹에서도 <strong>완벽하게,</strong>{" "}
                나만의 링크를 두 가지 최적화된 화면으로 보여드립니다.
              </p>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Button asChild className="h-10 px-6 text-sm font-semibold">
                  <Link href="/auth/login">
                    무료로 시작하기
                    <ArrowRight className="ml-1 size-4" />
                  </Link>
                </Button>
                <Button
                  variant="outline"
                  className="h-10 px-6 text-sm font-semibold"
                  onClick={() =>
                    document
                      .getElementById("how-it-works")
                      ?.scrollIntoView({ behavior: "smooth" })
                  }
                >
                  미리보기
                </Button>
              </div>
            </div>

            {/* Right: Device Mockups + Toggle */}
            <div className="flex flex-col items-center gap-6">
              {/* Toggle */}
              <ToggleGroup
                value={activeView}
                onValueChange={setActiveView}
                options={[
                  { value: "mobile", label: "Mobile", icon: DeviceMobile },
                  { value: "web", label: "Web", icon: Desktop },
                ]}
              />

              {/* Devices */}
              <div className="relative flex items-end justify-center gap-4 sm:gap-6">
                <PhoneMockup
                  onClick={() => setActiveView("mobile")}
                  className={`cursor-pointer w-[140px] sm:w-[200px] transition-all duration-500 ${
                    activeView === "mobile"
                      ? "scale-105 opacity-100 z-10"
                      : "scale-95 opacity-40"
                  }`}
                />
                <BrowserMockup
                  onClick={() => setActiveView("web")}
                  className={`cursor-pointer w-[185px] sm:w-[280px] transition-all duration-500 ${
                    activeView === "web"
                      ? "scale-105 opacity-100 z-10"
                      : "scale-95 opacity-40"
                  }`}
                />
              </div>
            </div>
          </div>
        </section>

        {/* ─── Section 2: How It Works ─── */}
        <section id="how-it-works" className="border-t border-border bg-muted/30 px-4 py-20 sm:py-24">
          <div className="mx-auto max-w-5xl">
            <div className="mb-12 text-center">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                어떻게 작동하나요?
              </h2>
              <p className="mt-3 text-muted-foreground">
                3단계로 나만의 프로필 페이지를 완성하세요
              </p>
            </div>

            <div className="grid gap-8 sm:grid-cols-3">
              {[
                {
                  step: 1,
                  icon: LinkSimple,
                  title: "링크 입력",
                  desc: "URL을 입력하면 자동으로 프로필 페이지가 생성됩니다.",
                },
                {
                  step: 2,
                  icon: Devices,
                  title: "듀얼뷰 생성",
                  desc: "모바일과 웹 각각에 최적화된 레이아웃이 자동 적용됩니다.",
                },
                {
                  step: 3,
                  icon: ChartLineUp,
                  title: "공유 & 분석",
                  desc: "하나의 URL로 공유하고, 클릭과 유입을 분석하세요.",
                },
              ].map(({ step, icon, title, desc }, idx) => (
                <FeatureCard
                  key={step}
                  variant="step"
                  icon={icon}
                  title={title}
                  description={desc}
                  badge={`STEP ${step}`}
                >
                  {idx < 2 && (
                    <div className="absolute right-0 top-10 hidden h-px w-8 translate-x-full bg-border sm:block" />
                  )}
                </FeatureCard>
              ))}
            </div>
          </div>
        </section>

        {/* ─── Section 3: Features ─── */}
        <section className="px-4 py-20 sm:py-24">
          <div className="mx-auto max-w-5xl">
            <div className="mb-12 text-center">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                핵심 기능
              </h2>
              <p className="mt-3 text-muted-foreground">
                핫딜닷쿨만의 차별화된 기능을 확인하세요
              </p>
            </div>

            <div className="grid gap-6 sm:grid-cols-3">
              {[
                {
                  icon: Devices,
                  title: "듀얼뷰 프로필",
                  desc: "모바일과 데스크톱 각각에 최적화된 레이아웃을 자동으로 제공합니다.",
                },
                {
                  icon: ChartBar,
                  title: "실시간 분석",
                  desc: "클릭 수, 유입 경로, 디바이스 통계를 한눈에 확인할 수 있습니다.",
                },
                {
                  icon: Palette,
                  title: "테마 커스터마이징",
                  desc: "6개 빌트인 프리셋과 다크모드로 나만의 스타일을 만드세요.",
                },
              ].map(({ icon, title, desc }) => (
                <FeatureCard
                  key={title}
                  variant="feature"
                  icon={icon}
                  title={title}
                  description={desc}
                />
              ))}
            </div>
          </div>
        </section>

        {/* ─── Section 4: Analytics Preview ─── */}
        <section className="border-t border-border bg-muted/30 px-4 py-20 sm:py-24">
          <div className="mx-auto grid max-w-5xl items-center gap-12 lg:grid-cols-2">
            {/* Left: Text */}
            <div>
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                나만의 <span className="text-primary">링크</span>
                <br />
                숫자로 확인하세요
              </h2>
              <p className="mt-4 max-w-md leading-relaxed text-muted-foreground">
                누가 언제 어디서 클릭했는지, 유입 정보를
                <br />
                실시간 분석 대시보드에서 모든 데이터를 확인하세요.
              </p>
            </div>

            {/* Right: Dashboard Mockup */}
            <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
              {/* Stats Row */}
              <div className="mb-5 grid grid-cols-3 gap-2 sm:gap-3">
                {[
                  { label: "총 클릭", value: "12,847", icon: CursorClick },
                  { label: "모바일 비율", value: "64%", icon: DeviceMobile },
                  { label: "상위 유입", value: "Instagram", icon: Globe },
                ].map(({ label, value, icon: Icon }) => (
                  <div
                    key={label}
                    className="rounded-lg bg-muted/50 p-2 sm:p-3 text-center"
                  >
                    <Icon className="mx-auto mb-1 size-4 text-primary" />
                    <p className="text-base sm:text-lg font-bold">{value}</p>
                    <p className="text-xs text-muted-foreground">{label}</p>
                  </div>
                ))}
              </div>

              {/* Bar Chart Mockup */}
              <div className="rounded-lg bg-muted/30 p-4">
                <p className="mb-3 text-xs font-medium text-muted-foreground">
                  일별 클릭 추이
                </p>
                <div className="flex items-end gap-1.5">
                  {[35, 50, 40, 65, 80, 55, 70, 90, 60, 75, 85, 95].map(
                    (h, i) => (
                      <div
                        key={i}
                        className="flex-1 rounded-sm bg-primary/30 transition-all hover:bg-primary/50"
                        style={{ height: `${h * 0.7}px` }}
                      />
                    ),
                  )}
                </div>
                <div className="mt-2 flex justify-between text-[9px] text-muted-foreground">
                  <span>3월 1일</span>
                  <span>3월 12일</span>
                </div>
              </div>
            </div>
          </div>
        </section>


        {/* ─── Section 6: Final CTA ─── */}
        <section className="border-t border-border bg-primary/5 px-4 py-20 sm:py-24">
          <div className="mx-auto flex max-w-xl flex-col items-center text-center">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              지금 나만의 프로필을
              <br />
              만들어보세요
            </h2>
            <p className="mt-4 text-muted-foreground">
              30초면 충분합니다. 무료로 시작하세요.
            </p>
            <Button asChild className="mt-8 h-11 px-8 text-sm font-semibold">
              <Link href="/auth/login">
                무료로 시작하기
                <ArrowRight className="ml-1 size-4" />
              </Link>
            </Button>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
