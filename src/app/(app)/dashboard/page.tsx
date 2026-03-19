"use client";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://hotdeal.cool";

import { useProfileData } from "@/hooks/use-profile-data";
import { Button } from "@/components/ui/button";
import { SectionHeader } from "@/components/ui/section-header";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import { Bar, BarChart, Area, AreaChart, XAxis, YAxis, CartesianGrid } from "recharts";
import Link from "next/link";
import {
  PencilSimple, Copy, Eye, Link as LinkIcon,
  Users, CursorClick, TrendUp, ChartBar,
  ArrowUpRight,
} from "@phosphor-icons/react";
import { toast } from "sonner";
import { SiteFooter } from "@/components/site-footer";

/* ─── Mock analytics data ─── */
const MOCK_STATS = {
  totalViews: 1_247,
  totalClicks: 389,
  clickRate: 31.2,
};

const WEEKLY_DATA = [
  { day: "월", views: 142, clicks: 45 },
  { day: "화", views: 178, clicks: 62 },
  { day: "수", views: 156, clicks: 48 },
  { day: "목", views: 203, clicks: 71 },
  { day: "금", views: 189, clicks: 58 },
  { day: "토", views: 211, clicks: 67 },
  { day: "일", views: 168, clicks: 38 },
];

const MOCK_TOP_LINKS = [
  { title: "포트폴리오", clicks: 142, url: "https://portfolio.dev" },
  { title: "GitHub", clicks: 98, url: "https://github.com" },
  { title: "블로그", clicks: 76, url: "https://blog.dev" },
  { title: "LinkedIn", clicks: 53, url: "https://linkedin.com" },
  { title: "이력서 PDF", clicks: 20, url: "https://resume.dev" },
];

const viewsChartConfig = {
  views: { label: "방문자", color: "var(--primary)" },
  clicks: { label: "클릭", color: "var(--secondary)" },
} satisfies ChartConfig;

function StatCard({ icon: Icon, label, value, sub }: {
  icon: typeof Users;
  label: string;
  value: string | number;
  sub?: string;
}) {
  return (
    <div className="flex flex-col gap-1 rounded-xl border border-border bg-card p-4">
      <div className="flex items-center gap-2 text-muted-foreground">
        <Icon className="size-4" />
        <span className="text-xs">{label}</span>
      </div>
      <span className="text-2xl font-bold tabular-nums">{value}</span>
      {sub && <span className="text-[11px] text-muted-foreground">{sub}</span>}
    </div>
  );
}


export default function DashboardPage() {
  const { profileData, hasProfile, isHydrated, loadStatus } = useProfileData();
  const profileUrl = `${SITE_URL}/${profileData.slug}`;

  function copyLink() {
    navigator.clipboard.writeText(profileUrl);
    toast.success("링크가 복사되었습니다", { description: profileUrl });
  }

  if (!isHydrated || loadStatus === "loading") {
    return (
      <div className="mx-auto w-full max-w-4xl px-4 py-8 sm:px-6">
        <div className="h-[200px] animate-pulse rounded-xl border border-border bg-muted/30" />
      </div>
    );
  }

  if (!hasProfile) {
    return (
      <div className="mx-auto w-full max-w-4xl px-4 py-8 sm:px-6">
        <div className="flex flex-col items-center gap-6 rounded-xl border border-dashed border-border bg-card p-12 text-center">
          <div className="flex size-20 items-center justify-center rounded-full bg-primary/10">
            <LinkIcon className="size-10 text-primary" weight="duotone" />
          </div>
          <div>
            <h1 className="text-xl font-bold">나만의 프로필 링크를 만들어보세요</h1>
            <p className="mt-2 text-sm text-muted-foreground">
              SNS, 포트폴리오, 블로그를 하나의 링크로 연결하세요
            </p>
          </div>
          <Button size="lg" asChild>
            <Link href="/dashboard/edit">
              <PencilSimple className="mr-2 size-4" />
              프로필 만들기
            </Link>
          </Button>
        </div>
        <SiteFooter />
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-4xl px-4 py-8 sm:px-6">
      {/* ─── Profile Summary ─── */}
      <div className="mb-8 flex flex-col gap-4 rounded-xl border border-border bg-card p-6 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          {profileData.avatarUrl ? (
            <img
              src={profileData.avatarUrl}
              alt=""
              className="size-16 rounded-full border border-border object-cover"
            />
          ) : (
            <div className="flex size-16 items-center justify-center rounded-full bg-muted text-2xl font-bold text-muted-foreground">
              {(profileData.nickname || "U").charAt(0).toUpperCase()}
            </div>
          )}
          <div>
            <h1 className="text-lg font-bold">{profileData.nickname || "닉네임을 설정하세요"}</h1>
            <p className="mt-0.5 text-sm text-muted-foreground">{profileData.bio || "한 줄 소개를 작성해보세요"}</p>
            <div className="mt-1 flex items-center gap-1 text-xs text-primary">
              <LinkIcon className="size-3" />
              <span>{profileUrl}</span>
            </div>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={copyLink}>
            <Copy className="mr-1 size-3.5" />
            복사
          </Button>
          <Button variant="outline" size="sm" asChild>
            <Link href={`/${profileData.slug}`} target="_blank">
              <Eye className="mr-1 size-3.5" />
              미리보기
            </Link>
          </Button>
          <Button size="sm" asChild>
            <Link href="/dashboard/edit">
              <PencilSimple className="mr-1 size-3.5" />
              편집
            </Link>
          </Button>
        </div>
      </div>

      {/* ─── Quick Stats ─── */}
      <div className="mb-8">
        <SectionHeader title="통계 요약" badge="최근 7일" />
        <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-4">
          <StatCard icon={Eye} label="총 방문" value={MOCK_STATS.totalViews.toLocaleString()} sub="+12% vs 지난주" />
          <StatCard icon={CursorClick} label="총 클릭" value={MOCK_STATS.totalClicks.toLocaleString()} sub="+8% vs 지난주" />
          <StatCard icon={TrendUp} label="클릭률" value={`${MOCK_STATS.clickRate}%`} sub="업계 평균 22%" />
          <StatCard icon={LinkIcon} label="활성 링크" value={profileData.links.filter((l) => l.enabled).length} sub={`전체 ${profileData.links.length}개`} />
        </div>
      </div>

      {/* ─── Weekly Charts ─── */}
      <div className="mb-8 grid gap-4 sm:grid-cols-2">
        {/* Bar Chart — 방문자 */}
        <div className="rounded-xl border border-border bg-card p-5">
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ChartBar className="size-4 text-muted-foreground" />
              <span className="text-sm font-semibold">주간 방문자</span>
            </div>
            <span className="text-xs text-muted-foreground">목데이터</span>
          </div>
          <ChartContainer config={viewsChartConfig} className="h-[180px] w-full">
            <BarChart data={WEEKLY_DATA} accessibilityLayer>
              <CartesianGrid vertical={false} strokeDasharray="3 3" />
              <XAxis dataKey="day" tickLine={false} axisLine={false} fontSize={11} />
              <YAxis tickLine={false} axisLine={false} fontSize={10} width={30} />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Bar dataKey="views" fill="var(--color-views)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ChartContainer>
        </div>

        {/* Area Chart — 클릭 추이 */}
        <div className="rounded-xl border border-border bg-card p-5">
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CursorClick className="size-4 text-muted-foreground" />
              <span className="text-sm font-semibold">클릭 추이</span>
            </div>
            <span className="text-xs text-muted-foreground">목데이터</span>
          </div>
          <ChartContainer config={viewsChartConfig} className="h-[180px] w-full">
            <AreaChart data={WEEKLY_DATA} accessibilityLayer>
              <CartesianGrid vertical={false} strokeDasharray="3 3" />
              <XAxis dataKey="day" tickLine={false} axisLine={false} fontSize={11} />
              <YAxis tickLine={false} axisLine={false} fontSize={10} width={30} />
              <ChartTooltip content={<ChartTooltipContent />} />
              <defs>
                <linearGradient id="fillClicks" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="var(--color-clicks)" stopOpacity={0.3} />
                  <stop offset="100%" stopColor="var(--color-clicks)" stopOpacity={0.02} />
                </linearGradient>
              </defs>
              <Area
                dataKey="clicks"
                type="monotone"
                fill="url(#fillClicks)"
                stroke="var(--color-clicks)"
                strokeWidth={2}
              />
            </AreaChart>
          </ChartContainer>
        </div>
      </div>

      {/* ─── Top Links ─── */}
      <div className="mb-8">
        <SectionHeader title="인기 링크" badge="클릭 수 기준" />
        <div className="mt-3 flex flex-col gap-2">
          {MOCK_TOP_LINKS.map((link, i) => (
            <div
              key={link.title}
              className="flex items-center gap-3 rounded-lg border border-border bg-card px-4 py-3"
            >
              <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-muted text-xs font-bold text-muted-foreground">
                {i + 1}
              </span>
              <div className="flex flex-1 flex-col">
                <span className="text-sm font-medium">{link.title}</span>
                <span className="text-[11px] text-muted-foreground">{link.url}</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="text-right">
                  <span className="text-sm font-semibold tabular-nums">{link.clicks}</span>
                  <span className="ml-1 text-[11px] text-muted-foreground">clicks</span>
                </div>
                <ArrowUpRight className="size-3.5 text-muted-foreground" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ─── Quick Actions ─── */}
      <div className="flex items-center gap-3 rounded-xl border border-dashed border-border bg-muted/30 p-5">
        <div className="flex-1">
          <p className="text-sm font-medium">프로필을 더 매력적으로 꾸며보세요</p>
          <p className="mt-0.5 text-xs text-muted-foreground">테마, 링크 스타일, 배경을 커스터마이징 할 수 있습니다</p>
        </div>
        <Button asChild>
          <Link href="/dashboard/edit">
            편집하기
            <ArrowUpRight className="ml-1 size-3.5" />
          </Link>
        </Button>
      </div>

      <SiteFooter />
    </div>
  );
}
