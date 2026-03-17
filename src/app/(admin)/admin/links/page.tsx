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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { DotsThree, MagnifyingGlass } from "@phosphor-icons/react";
import { MOCK_ADMIN_LINKS } from "@/lib/admin-mock-data";
import type { AdminLink, LinkStatus } from "@/lib/admin-types";

const STATUS_BADGE: Record<LinkStatus, { label: string; variant: "default" | "secondary" | "destructive" | "outline" }> = {
  active: { label: "활성", variant: "default" },
  inactive: { label: "비활성", variant: "outline" },
  reported: { label: "신고됨", variant: "destructive" },
};

export default function LinksPage() {
  const [links, setLinks] = useState<AdminLink[]>(MOCK_ADMIN_LINKS);
  const [statusFilter, setStatusFilter] = useState("all");
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    return links.filter((l) => {
      if (statusFilter !== "all" && l.status !== statusFilter) return false;
      if (search) {
        const q = search.toLowerCase();
        return (
          l.title.toLowerCase().includes(q) ||
          l.userNickname.toLowerCase().includes(q) ||
          l.userSlug.toLowerCase().includes(q) ||
          l.url.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [links, statusFilter, search]);

  function updateStatus(id: string, status: LinkStatus) {
    setLinks((prev) => prev.map((l) => (l.id === id ? { ...l, status } : l)));
    toast.success(`상태가 "${STATUS_BADGE[status].label}"(으)로 변경되었습니다`);
  }

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-bold">링크 관리</h1>

      {/* Filters */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <Tabs value={statusFilter} onValueChange={setStatusFilter}>
          <TabsList>
            <TabsTrigger value="all">전체</TabsTrigger>
            <TabsTrigger value="active">활성</TabsTrigger>
            <TabsTrigger value="inactive">비활성</TabsTrigger>
            <TabsTrigger value="reported">신고됨</TabsTrigger>
          </TabsList>
        </Tabs>

        <div className="relative">
          <MagnifyingGlass className="absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="사용자, 제목, URL 검색..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-[260px] pl-8"
          />
        </div>
      </div>

      {/* Table */}
      <div className="rounded-xl border border-border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>사용자</TableHead>
              <TableHead>링크 제목</TableHead>
              <TableHead className="hidden md:table-cell">URL</TableHead>
              <TableHead className="hidden sm:table-cell text-right">클릭 수</TableHead>
              <TableHead>상태</TableHead>
              <TableHead className="hidden md:table-cell">생성일</TableHead>
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
              filtered.map((l) => {
                const badge = STATUS_BADGE[l.status];
                return (
                  <TableRow key={l.id}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Avatar className="size-7">
                          <AvatarImage src={l.userAvatarUrl ?? undefined} />
                          <AvatarFallback className="text-[10px]">
                            {l.userNickname.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="hidden min-w-0 flex-col sm:flex">
                          <span className="truncate text-xs font-medium">{l.userNickname}</span>
                          <span className="truncate text-[10px] text-muted-foreground">
                            @{l.userSlug}
                          </span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-sm font-medium">{l.title}</TableCell>
                    <TableCell className="hidden max-w-[200px] truncate text-xs text-muted-foreground md:table-cell">
                      {l.url}
                    </TableCell>
                    <TableCell className="hidden text-right text-xs tabular-nums sm:table-cell">
                      {l.clicks.toLocaleString()}
                    </TableCell>
                    <TableCell>
                      <Badge variant={badge.variant} className="text-[10px]">
                        {badge.label}
                      </Badge>
                    </TableCell>
                    <TableCell className="hidden text-xs text-muted-foreground md:table-cell">
                      {new Date(l.createdAt).toLocaleDateString("ko-KR")}
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="size-8">
                            <DotsThree className="size-4" weight="bold" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          {l.status === "inactive" ? (
                            <DropdownMenuItem onClick={() => updateStatus(l.id, "active")}>
                              활성화
                            </DropdownMenuItem>
                          ) : (
                            <DropdownMenuItem onClick={() => updateStatus(l.id, "inactive")}>
                              비활성화
                            </DropdownMenuItem>
                          )}
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            className="text-destructive"
                            onClick={() => updateStatus(l.id, "reported")}
                          >
                            신고 처리
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
