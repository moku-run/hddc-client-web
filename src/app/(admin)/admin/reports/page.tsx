"use client";

import { useState, useMemo } from "react";
import { toast } from "sonner";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { DotsThree, MagnifyingGlass } from "@phosphor-icons/react";
import { MOCK_REPORTS } from "@/lib/admin-mock-data";
import type { Report, ReportStatus, ReportTargetType } from "@/lib/admin-types";

const STATUS_BADGE: Record<ReportStatus, { label: string; variant: "default" | "secondary" | "destructive" | "outline" }> = {
  pending: { label: "대기 중", variant: "default" },
  reviewed: { label: "검토 중", variant: "secondary" },
  resolved: { label: "처리 완료", variant: "outline" },
  dismissed: { label: "반려", variant: "outline" },
};

const TARGET_LABELS: Record<ReportTargetType, string> = {
  deal: "핫딜",
  comment: "댓글",
  user: "사용자",
  link: "링크",
};

export default function ReportsPage() {
  const [reports, setReports] = useState<Report[]>(MOCK_REPORTS);
  const [statusFilter, setStatusFilter] = useState("all");
  const [targetFilter, setTargetFilter] = useState("all");
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    return reports.filter((r) => {
      if (statusFilter !== "all" && r.status !== statusFilter) return false;
      if (targetFilter !== "all" && r.targetType !== targetFilter) return false;
      if (search) {
        const q = search.toLowerCase();
        return (
          r.targetTitle.toLowerCase().includes(q) ||
          r.reason.toLowerCase().includes(q) ||
          r.reporterName.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [reports, statusFilter, targetFilter, search]);

  function updateStatus(id: string, newStatus: ReportStatus) {
    setReports((prev) =>
      prev.map((r) =>
        r.id === id
          ? {
              ...r,
              status: newStatus,
              resolvedAt: newStatus === "resolved" || newStatus === "dismissed" ? new Date().toISOString() : r.resolvedAt,
            }
          : r,
      ),
    );
    const label = STATUS_BADGE[newStatus].label;
    toast.success(`신고 상태가 "${label}"(으)로 변경되었습니다`);
  }

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-bold">신고 관리</h1>

      {/* Filters */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <Tabs value={statusFilter} onValueChange={setStatusFilter}>
          <TabsList>
            <TabsTrigger value="all">전체</TabsTrigger>
            <TabsTrigger value="pending">대기</TabsTrigger>
            <TabsTrigger value="reviewed">검토</TabsTrigger>
            <TabsTrigger value="resolved">처리</TabsTrigger>
            <TabsTrigger value="dismissed">반려</TabsTrigger>
          </TabsList>
        </Tabs>

        <div className="flex gap-2">
          <Select value={targetFilter} onValueChange={setTargetFilter}>
            <SelectTrigger className="w-[120px]">
              <SelectValue placeholder="대상 타입" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">전체 타입</SelectItem>
              <SelectItem value="deal">핫딜</SelectItem>
              <SelectItem value="comment">댓글</SelectItem>
              <SelectItem value="user">사용자</SelectItem>
              <SelectItem value="link">링크</SelectItem>
            </SelectContent>
          </Select>

          <div className="relative">
            <MagnifyingGlass className="absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="검색..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-[200px] pl-8"
            />
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="rounded-xl border border-border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>신고 대상</TableHead>
              <TableHead className="hidden sm:table-cell">타입</TableHead>
              <TableHead>사유</TableHead>
              <TableHead className="hidden md:table-cell">신고자</TableHead>
              <TableHead>상태</TableHead>
              <TableHead className="hidden md:table-cell">신고일</TableHead>
              <TableHead className="w-[50px]">작업</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="py-8 text-center text-sm text-muted-foreground">
                  검색 결과가 없습니다
                </TableCell>
              </TableRow>
            ) : (
              filtered.map((r) => {
                const badge = STATUS_BADGE[r.status];
                return (
                  <TableRow key={r.id}>
                    <TableCell className="max-w-[180px] truncate text-sm font-medium">
                      {r.targetTitle}
                    </TableCell>
                    <TableCell className="hidden sm:table-cell">
                      <Badge variant="outline" className="text-[10px]">
                        {TARGET_LABELS[r.targetType]}
                      </Badge>
                    </TableCell>
                    <TableCell className="max-w-[150px] truncate text-xs text-muted-foreground">
                      {r.reason}
                    </TableCell>
                    <TableCell className="hidden text-xs md:table-cell">{r.reporterName}</TableCell>
                    <TableCell>
                      <Badge variant={badge.variant} className="text-[10px]">
                        {badge.label}
                      </Badge>
                    </TableCell>
                    <TableCell className="hidden text-xs text-muted-foreground md:table-cell">
                      {new Date(r.createdAt).toLocaleDateString("ko-KR")}
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="size-8">
                            <DotsThree className="size-4" weight="bold" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => updateStatus(r.id, "reviewed")}>
                            검토 시작
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => updateStatus(r.id, "resolved")}>
                            처리 완료
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem onClick={() => updateStatus(r.id, "dismissed")}>
                            반려
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
