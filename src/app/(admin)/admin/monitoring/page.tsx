"use client";

import { Users, Fire, Link as LinkIcon, Flag } from "@phosphor-icons/react";
import { AdminStatCard } from "@/components/admin/admin-stat-card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  Line,
  LineChart,
  Pie,
  PieChart,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  ADMIN_STATS,
  USER_GROWTH_DATA,
  DEAL_ACTIVITY_DATA,
  REPORT_TREND_DATA,
  CATEGORY_DIST_DATA,
  MOCK_REPORTS,
  MOCK_ADMIN_DEALS,
} from "@/lib/admin-mock-data";
import type { ReportStatus } from "@/lib/admin-types";

/* ─── Chart configs ─── */
const userGrowthConfig = {
  users: { label: "사용자", color: "var(--chart-1)" },
} satisfies ChartConfig;

const dealActivityConfig = {
  registered: { label: "등록", color: "var(--chart-2)" },
  expired: { label: "만료", color: "var(--chart-4)" },
} satisfies ChartConfig;

const reportConfig = {
  reports: { label: "신고", color: "var(--chart-5)" },
} satisfies ChartConfig;

const categoryConfig = {
  value: { label: "딜 수", color: "var(--chart-1)" },
} satisfies ChartConfig;

const PIE_COLORS = [
  "var(--chart-1)",
  "var(--chart-2)",
  "var(--chart-3)",
  "var(--chart-4)",
  "var(--chart-5)",
  "var(--primary)",
];

const STATUS_BADGE: Record<ReportStatus, { label: string; variant: "default" | "secondary" | "destructive" | "outline" }> = {
  pending: { label: "대기 중", variant: "default" },
  reviewed: { label: "검토 중", variant: "secondary" },
  resolved: { label: "처리 완료", variant: "outline" },
  dismissed: { label: "반려", variant: "outline" },
};

export default function MonitoringPage() {
  const recentReports = MOCK_REPORTS.slice(0, 5);
  const topDeals = [...MOCK_ADMIN_DEALS]
    .filter((d) => d.status === "active")
    .sort((a, b) => b.likes - a.likes)
    .slice(0, 5);

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-bold">모니터링 대시보드</h1>

      {/* ─── Stat Cards ─── */}
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <AdminStatCard
          icon={Users}
          label="전체 사용자"
          value={ADMIN_STATS.totalUsers}
          change={ADMIN_STATS.totalUsersChange}
        />
        <AdminStatCard
          icon={Fire}
          label="활성 핫딜"
          value={ADMIN_STATS.activeDeals}
          change={ADMIN_STATS.activeDealsChange}
        />
        <AdminStatCard
          icon={LinkIcon}
          label="총 링크"
          value={ADMIN_STATS.totalLinks}
          change={ADMIN_STATS.totalLinksChange}
        />
        <AdminStatCard
          icon={Flag}
          label="대기 중 신고"
          value={ADMIN_STATS.pendingReports}
          variant="destructive"
          change="즉시 처리 필요"
        />
      </div>

      {/* ─── Charts 2x2 ─── */}
      <div className="grid gap-4 md:grid-cols-2">
        {/* User growth — Area */}
        <div className="rounded-xl border border-border bg-card p-5">
          <h3 className="mb-4 text-sm font-semibold">사용자 증가 추이</h3>
          <ChartContainer config={userGrowthConfig} className="h-[200px] w-full">
            <AreaChart data={USER_GROWTH_DATA} accessibilityLayer>
              <CartesianGrid vertical={false} strokeDasharray="3 3" />
              <XAxis dataKey="label" tickLine={false} axisLine={false} fontSize={11} />
              <YAxis tickLine={false} axisLine={false} fontSize={10} width={40} />
              <ChartTooltip content={<ChartTooltipContent />} />
              <defs>
                <linearGradient id="fillUsers" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="var(--color-users)" stopOpacity={0.3} />
                  <stop offset="100%" stopColor="var(--color-users)" stopOpacity={0.02} />
                </linearGradient>
              </defs>
              <Area
                dataKey="users"
                type="monotone"
                fill="url(#fillUsers)"
                stroke="var(--color-users)"
                strokeWidth={2}
              />
            </AreaChart>
          </ChartContainer>
        </div>

        {/* Deal activity — Bar */}
        <div className="rounded-xl border border-border bg-card p-5">
          <h3 className="mb-4 text-sm font-semibold">핫딜 등록/만료</h3>
          <ChartContainer config={dealActivityConfig} className="h-[200px] w-full">
            <BarChart data={DEAL_ACTIVITY_DATA} accessibilityLayer>
              <CartesianGrid vertical={false} strokeDasharray="3 3" />
              <XAxis dataKey="label" tickLine={false} axisLine={false} fontSize={11} />
              <YAxis tickLine={false} axisLine={false} fontSize={10} width={30} />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Bar dataKey="registered" fill="var(--color-registered)" radius={[4, 4, 0, 0]} />
              <Bar dataKey="expired" fill="var(--color-expired)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ChartContainer>
        </div>

        {/* Report trend — Line */}
        <div className="rounded-xl border border-border bg-card p-5">
          <h3 className="mb-4 text-sm font-semibold">신고 현황 (주별)</h3>
          <ChartContainer config={reportConfig} className="h-[200px] w-full">
            <LineChart data={REPORT_TREND_DATA} accessibilityLayer>
              <CartesianGrid vertical={false} strokeDasharray="3 3" />
              <XAxis dataKey="label" tickLine={false} axisLine={false} fontSize={11} />
              <YAxis tickLine={false} axisLine={false} fontSize={10} width={30} />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Line
                dataKey="reports"
                type="monotone"
                stroke="var(--color-reports)"
                strokeWidth={2}
                dot={{ r: 4 }}
              />
            </LineChart>
          </ChartContainer>
        </div>

        {/* Category dist — Pie */}
        <div className="rounded-xl border border-border bg-card p-5">
          <h3 className="mb-4 text-sm font-semibold">카테고리 분포</h3>
          <ChartContainer config={categoryConfig} className="h-[200px] w-full">
            <PieChart accessibilityLayer>
              <ChartTooltip content={<ChartTooltipContent />} />
              <Pie
                data={CATEGORY_DIST_DATA}
                dataKey="value"
                nameKey="label"
                cx="50%"
                cy="50%"
                innerRadius={50}
                outerRadius={80}
                paddingAngle={2}
              >
                {CATEGORY_DIST_DATA.map((_, i) => (
                  <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                ))}
              </Pie>
            </PieChart>
          </ChartContainer>
        </div>
      </div>

      {/* ─── Bottom tables ─── */}
      <div className="grid gap-4 lg:grid-cols-2">
        {/* Recent reports */}
        <div className="rounded-xl border border-border bg-card">
          <div className="border-b border-border p-4">
            <h3 className="text-sm font-semibold">최근 신고</h3>
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>대상</TableHead>
                <TableHead>사유</TableHead>
                <TableHead>상태</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {recentReports.map((r) => {
                const badge = STATUS_BADGE[r.status];
                return (
                  <TableRow key={r.id}>
                    <TableCell className="text-xs font-medium">{r.targetTitle}</TableCell>
                    <TableCell className="text-xs text-muted-foreground">{r.reason}</TableCell>
                    <TableCell>
                      <Badge variant={badge.variant} className="text-[10px]">
                        {badge.label}
                      </Badge>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>

        {/* Top deals */}
        <div className="rounded-xl border border-border bg-card">
          <div className="border-b border-border p-4">
            <h3 className="text-sm font-semibold">인기 핫딜 TOP 5</h3>
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>제목</TableHead>
                <TableHead className="text-right">좋아요</TableHead>
                <TableHead className="text-right">댓글</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {topDeals.map((d) => (
                <TableRow key={d.id}>
                  <TableCell className="max-w-[200px] truncate text-xs font-medium">{d.title}</TableCell>
                  <TableCell className="text-right text-xs tabular-nums">{d.likes}</TableCell>
                  <TableCell className="text-right text-xs tabular-nums">{d.comments}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
