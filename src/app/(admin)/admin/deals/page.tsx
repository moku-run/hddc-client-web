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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { DotsThree, Plus, MagnifyingGlass } from "@phosphor-icons/react";
import { MOCK_ADMIN_DEALS } from "@/lib/admin-mock-data";
import type { AdminDeal, DealStatus } from "@/lib/admin-types";
import type { DealCategory } from "@/lib/hot-deal-types";

const STATUS_BADGE: Record<DealStatus, { label: string; variant: "default" | "secondary" | "destructive" | "outline" }> = {
  active: { label: "활성", variant: "default" },
  expired: { label: "만료", variant: "outline" },
  hidden: { label: "숨김", variant: "secondary" },
  reported: { label: "신고됨", variant: "destructive" },
};

const CATEGORY_LABELS: Record<DealCategory, string> = {
  electronics: "전자제품",
  fashion: "패션",
  food: "음식",
  living: "생활",
  beauty: "뷰티",
  travel: "여행",
  digital: "디지털",
  sports: "스포츠",
  etc: "기타",
};

const EMPTY_DEAL: Omit<AdminDeal, "id" | "createdAt" | "likes" | "comments" | "reports"> = {
  title: "",
  description: "",
  imageUrl: "",
  price: 0,
  originalPrice: null,
  url: "",
  source: "",
  category: "electronics",
  status: "active",
  expiresAt: null,
};

export default function DealsPage() {
  const [deals, setDeals] = useState<AdminDeal[]>(MOCK_ADMIN_DEALS);
  const [statusFilter, setStatusFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState<"newest" | "likes" | "reports">("newest");

  // Dialog state
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingDeal, setEditingDeal] = useState<AdminDeal | null>(null);
  const [form, setForm] = useState(EMPTY_DEAL);

  // Delete confirm
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const filtered = useMemo(() => {
    let result = deals.filter((d) => {
      if (statusFilter !== "all" && d.status !== statusFilter) return false;
      if (categoryFilter !== "all" && d.category !== categoryFilter) return false;
      if (search) {
        const q = search.toLowerCase();
        return d.title.toLowerCase().includes(q) || d.source.toLowerCase().includes(q);
      }
      return true;
    });

    result.sort((a, b) => {
      if (sortBy === "likes") return b.likes - a.likes;
      if (sortBy === "reports") return b.reports - a.reports;
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });

    return result;
  }, [deals, statusFilter, categoryFilter, search, sortBy]);

  function openCreate() {
    setEditingDeal(null);
    setForm(EMPTY_DEAL);
    setDialogOpen(true);
  }

  function openEdit(deal: AdminDeal) {
    setEditingDeal(deal);
    setForm({
      title: deal.title,
      description: deal.description,
      imageUrl: deal.imageUrl,
      price: deal.price,
      originalPrice: deal.originalPrice,
      url: deal.url,
      source: deal.source,
      category: deal.category,
      status: deal.status,
      expiresAt: deal.expiresAt,
    });
    setDialogOpen(true);
  }

  function handleSave() {
    if (!form.title.trim()) {
      toast.error("제목을 입력해주세요");
      return;
    }

    if (editingDeal) {
      setDeals((prev) =>
        prev.map((d) => (d.id === editingDeal.id ? { ...d, ...form } : d)),
      );
      toast.success("핫딜이 수정되었습니다");
    } else {
      const newDeal: AdminDeal = {
        ...form,
        id: `deal-${Date.now()}`,
        createdAt: new Date().toISOString(),
        likes: 0,
        comments: 0,
        reports: 0,
      };
      setDeals((prev) => [newDeal, ...prev]);
      toast.success("핫딜이 추가되었습니다");
    }
    setDialogOpen(false);
  }

  function handleDelete() {
    if (!deleteId) return;
    setDeals((prev) => prev.filter((d) => d.id !== deleteId));
    setDeleteId(null);
    toast.success("핫딜이 삭제되었습니다");
  }

  function updateStatus(id: string, status: DealStatus) {
    setDeals((prev) => prev.map((d) => (d.id === id ? { ...d, status } : d)));
    toast.success(`상태가 "${STATUS_BADGE[status].label}"(으)로 변경되었습니다`);
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold">핫딜 관리</h1>
        <Button size="sm" onClick={openCreate}>
          <Plus className="mr-1 size-4" />
          핫딜 추가
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <Tabs value={statusFilter} onValueChange={setStatusFilter}>
          <TabsList>
            <TabsTrigger value="all">전체</TabsTrigger>
            <TabsTrigger value="active">활성</TabsTrigger>
            <TabsTrigger value="expired">만료</TabsTrigger>
            <TabsTrigger value="hidden">숨김</TabsTrigger>
            <TabsTrigger value="reported">신고됨</TabsTrigger>
          </TabsList>
        </Tabs>

        <div className="flex gap-2">
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="w-[120px]">
              <SelectValue placeholder="카테고리" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">전체 카테고리</SelectItem>
              {Object.entries(CATEGORY_LABELS).map(([key, label]) => (
                <SelectItem key={key} value={key}>
                  {label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={sortBy} onValueChange={(v) => setSortBy(v as typeof sortBy)}>
            <SelectTrigger className="w-[110px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">최신순</SelectItem>
              <SelectItem value="likes">좋아요순</SelectItem>
              <SelectItem value="reports">신고순</SelectItem>
            </SelectContent>
          </Select>

          <div className="relative">
            <MagnifyingGlass className="absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="검색..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-[180px] pl-8"
            />
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="rounded-xl border border-border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>제목</TableHead>
              <TableHead className="hidden sm:table-cell">가격</TableHead>
              <TableHead className="hidden md:table-cell">출처</TableHead>
              <TableHead className="hidden lg:table-cell">카테고리</TableHead>
              <TableHead>상태</TableHead>
              <TableHead className="hidden md:table-cell text-right">좋아요</TableHead>
              <TableHead className="hidden lg:table-cell text-right">신고</TableHead>
              <TableHead className="hidden md:table-cell">등록일</TableHead>
              <TableHead className="w-[50px]">작업</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.length === 0 ? (
              <TableRow>
                <TableCell colSpan={9} className="py-8 text-center text-sm text-muted-foreground">
                  검색 결과가 없습니다
                </TableCell>
              </TableRow>
            ) : (
              filtered.map((d) => {
                const badge = STATUS_BADGE[d.status];
                return (
                  <TableRow key={d.id}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <img
                          src={d.imageUrl}
                          alt=""
                          className="hidden size-8 rounded object-cover sm:block"
                        />
                        <span className="max-w-[200px] truncate text-sm font-medium">
                          {d.title}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="hidden text-sm tabular-nums sm:table-cell">
                      {d.price.toLocaleString()}원
                    </TableCell>
                    <TableCell className="hidden text-xs text-muted-foreground md:table-cell">
                      {d.source}
                    </TableCell>
                    <TableCell className="hidden lg:table-cell">
                      <Badge variant="outline" className="text-[10px]">
                        {CATEGORY_LABELS[d.category]}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={badge.variant} className="text-[10px]">
                        {badge.label}
                      </Badge>
                    </TableCell>
                    <TableCell className="hidden text-right text-xs tabular-nums md:table-cell">
                      {d.likes}
                    </TableCell>
                    <TableCell className="hidden text-right text-xs tabular-nums lg:table-cell">
                      {d.reports > 0 ? (
                        <span className="text-destructive">{d.reports}</span>
                      ) : (
                        d.reports
                      )}
                    </TableCell>
                    <TableCell className="hidden text-xs text-muted-foreground md:table-cell">
                      {new Date(d.createdAt).toLocaleDateString("ko-KR")}
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="size-8">
                            <DotsThree className="size-4" weight="bold" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => openEdit(d)}>수정</DropdownMenuItem>
                          {d.status === "hidden" ? (
                            <DropdownMenuItem onClick={() => updateStatus(d.id, "active")}>
                              공개
                            </DropdownMenuItem>
                          ) : (
                            <DropdownMenuItem onClick={() => updateStatus(d.id, "hidden")}>
                              숨김
                            </DropdownMenuItem>
                          )}
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            className="text-destructive"
                            onClick={() => setDeleteId(d.id)}
                          >
                            삭제
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

      {/* Create/Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>{editingDeal ? "핫딜 수정" : "핫딜 추가"}</DialogTitle>
          </DialogHeader>

          <div className="grid gap-4 py-2">
            <div className="grid gap-2">
              <Label htmlFor="title">제목</Label>
              <Input
                id="title"
                value={form.title}
                onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                placeholder="핫딜 제목"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="description">설명</Label>
              <Textarea
                id="description"
                value={form.description}
                onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                placeholder="핫딜 설명"
                rows={3}
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="grid gap-2">
                <Label htmlFor="price">할인가</Label>
                <Input
                  id="price"
                  type="number"
                  value={form.price}
                  onChange={(e) => setForm((f) => ({ ...f, price: Number(e.target.value) }))}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="originalPrice">원가</Label>
                <Input
                  id="originalPrice"
                  type="number"
                  value={form.originalPrice ?? ""}
                  onChange={(e) =>
                    setForm((f) => ({
                      ...f,
                      originalPrice: e.target.value ? Number(e.target.value) : null,
                    }))
                  }
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="grid gap-2">
                <Label htmlFor="source">출처</Label>
                <Input
                  id="source"
                  value={form.source}
                  onChange={(e) => setForm((f) => ({ ...f, source: e.target.value }))}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="category">카테고리</Label>
                <Select
                  value={form.category}
                  onValueChange={(v) => setForm((f) => ({ ...f, category: v as DealCategory }))}
                >
                  <SelectTrigger id="category">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(CATEGORY_LABELS).map(([key, label]) => (
                      <SelectItem key={key} value={key}>
                        {label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="url">URL</Label>
              <Input
                id="url"
                value={form.url}
                onChange={(e) => setForm((f) => ({ ...f, url: e.target.value }))}
                placeholder="https://..."
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="imageUrl">이미지 URL</Label>
              <Input
                id="imageUrl"
                value={form.imageUrl}
                onChange={(e) => setForm((f) => ({ ...f, imageUrl: e.target.value }))}
                placeholder="https://..."
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              취소
            </Button>
            <Button onClick={handleSave}>
              {editingDeal ? "저장" : "추가"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete confirm */}
      <ConfirmDialog
        open={!!deleteId}
        onOpenChange={(open) => !open && setDeleteId(null)}
        title="핫딜을 삭제하시겠습니까?"
        description="삭제된 핫딜은 복구할 수 없습니다."
        onConfirm={handleDelete}
        confirmLabel="삭제"
        variant="destructive"
      />
    </div>
  );
}
