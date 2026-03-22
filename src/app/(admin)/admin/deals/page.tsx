"use client";

import { useState, useEffect, useCallback } from "react";
import { toast } from "sonner";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from "@/components/ui/dialog";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Check, X, CheckCircle, CaretLeft, CaretRight, ArrowSquareOut, Plus, DotsThree, PencilSimple, Trash,
} from "@phosphor-icons/react";
import {
  fetchCrawlDeals, approveDeal, rejectDeal, bulkApprove,
  fetchAdminHotDeals, createHotDeal, updateHotDeal, deleteHotDeal,
  type CrawlDeal, type CrawlDealStatus,
  type AdminHotDeal, type CreateHotDealRequest,
} from "@/lib/admin-api";

/* ─── Shared utils ─── */

function formatPrice(n: number | null): string {
  if (n == null) return "-";
  return n.toLocaleString("ko-KR") + "원";
}

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60_000);
  if (mins < 1) return "방금";
  if (mins < 60) return `${mins}분 전`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}시간 전`;
  return `${Math.floor(hours / 24)}일 전`;
}

const CRAWL_STATUS_BADGE: Record<CrawlDealStatus, { label: string; variant: "default" | "secondary" | "destructive" | "outline" }> = {
  PENDING: { label: "대기", variant: "outline" },
  APPROVED: { label: "승인", variant: "default" },
  REJECTED: { label: "거부", variant: "destructive" },
};

/* ─── Crawl Deals Tab ─── */

function CrawlDealsTab() {
  const [statusFilter, setStatusFilter] = useState<CrawlDealStatus>("PENDING");
  const [deals, setDeals] = useState<CrawlDeal[]>([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [totalElements, setTotalElements] = useState(0);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<Set<number>>(new Set());
  const [approveId, setApproveId] = useState<number | null>(null);
  const [rejectId, setRejectId] = useState<number | null>(null);
  const [bulkConfirmOpen, setBulkConfirmOpen] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const result = await fetchCrawlDeals(statusFilter, page, 20);
      setDeals(result.content);
      setTotalPages(result.totalPages);
      setTotalElements(result.totalElements);
    } catch { toast.error("딜 목록을 불러올 수 없습니다"); }
    finally { setLoading(false); }
  }, [statusFilter, page]);

  useEffect(() => { setSelected(new Set()); load(); }, [load]);

  const allSelected = deals.length > 0 && deals.every((d) => selected.has(d.id));
  function toggleAll() { setSelected(allSelected ? new Set() : new Set(deals.map((d) => d.id))); }
  function toggleOne(id: number) {
    setSelected((prev) => { const n = new Set(prev); n.has(id) ? n.delete(id) : n.add(id); return n; });
  }

  async function handleApprove() {
    if (approveId == null) return;
    try { await approveDeal(approveId); toast.success("승인 완료"); setApproveId(null); load(); }
    catch { toast.error("승인 실패"); }
  }
  async function handleReject() {
    if (rejectId == null) return;
    try { await rejectDeal(rejectId); toast.success("거부 완료"); setRejectId(null); load(); }
    catch { toast.error("거부 실패"); }
  }
  async function handleBulkApprove() {
    try { const c = await bulkApprove(Array.from(selected)); toast.success(`${c}건 일괄 승인`); setSelected(new Set()); setBulkConfirmOpen(false); load(); }
    catch { toast.error("일괄 승인 실패"); }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Tabs value={statusFilter} onValueChange={(v) => { setStatusFilter(v as CrawlDealStatus); setPage(0); }}>
            <TabsList>
              <TabsTrigger value="PENDING">대기</TabsTrigger>
              <TabsTrigger value="APPROVED">승인됨</TabsTrigger>
              <TabsTrigger value="REJECTED">거부됨</TabsTrigger>
            </TabsList>
          </Tabs>
          <span className="text-xs text-muted-foreground">총 {totalElements}건</span>
        </div>
        {selected.size > 0 && statusFilter === "PENDING" && (
          <Button size="sm" onClick={() => setBulkConfirmOpen(true)}>
            <CheckCircle className="mr-1 size-4" />{selected.size}건 일괄 승인
          </Button>
        )}
      </div>

      <div className="rounded-xl border border-border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              {statusFilter === "PENDING" && <TableHead className="w-10"><Checkbox checked={allSelected} onCheckedChange={toggleAll} /></TableHead>}
              <TableHead>제목</TableHead>
              <TableHead className="hidden sm:table-cell">가격</TableHead>
              <TableHead className="hidden sm:table-cell">판매처</TableHead>
              <TableHead className="hidden md:table-cell">출처</TableHead>
              <TableHead className="hidden lg:table-cell">카테고리</TableHead>
              <TableHead>상태</TableHead>
              <TableHead className="hidden md:table-cell">크롤링</TableHead>
              {statusFilter === "PENDING" && <TableHead className="w-[100px] text-right">작업</TableHead>}
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow><TableCell colSpan={9} className="py-12 text-center"><div className="mx-auto size-5 animate-spin rounded-full border-2 border-primary border-t-transparent" /></TableCell></TableRow>
            ) : deals.length === 0 ? (
              <TableRow><TableCell colSpan={9} className="py-12 text-center text-sm text-muted-foreground">{statusFilter === "PENDING" ? "대기 중인 딜이 없습니다" : "항목이 없습니다"}</TableCell></TableRow>
            ) : deals.map((d) => (
              <TableRow key={d.id}>
                {statusFilter === "PENDING" && <TableCell><Checkbox checked={selected.has(d.id)} onCheckedChange={() => toggleOne(d.id)} /></TableCell>}
                <TableCell>
                  <div className="flex items-center gap-2">
                    {d.imageUrl && <img src={d.imageUrl} alt="" className="hidden size-9 rounded object-cover sm:block" />}
                    <div className="min-w-0">
                      <span className="block max-w-[280px] truncate text-sm font-medium">{d.title}</span>
                      {d.postUrl && (
                        <a href={d.postUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-0.5 text-[10px] text-muted-foreground hover:text-primary">
                          원본<ArrowSquareOut className="size-2.5" />
                        </a>
                      )}
                    </div>
                  </div>
                </TableCell>
                <TableCell className="hidden text-sm tabular-nums sm:table-cell">{formatPrice(d.dealPrice)}</TableCell>
                <TableCell className="hidden text-xs sm:table-cell">{d.store || <span className="text-muted-foreground">-</span>}</TableCell>
                <TableCell className="hidden text-xs text-muted-foreground md:table-cell">{d.sourceSite}</TableCell>
                <TableCell className="hidden lg:table-cell">{d.category && <Badge variant="outline" className="text-[10px]">{d.category}</Badge>}</TableCell>
                <TableCell><Badge variant={CRAWL_STATUS_BADGE[d.status].variant} className="text-[10px]">{CRAWL_STATUS_BADGE[d.status].label}</Badge></TableCell>
                <TableCell className="hidden text-xs text-muted-foreground md:table-cell" suppressHydrationWarning>{timeAgo(d.crawledAt)}</TableCell>
                {statusFilter === "PENDING" && (
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1">
                      <Button variant="ghost" size="icon-sm" className="text-green-600 hover:bg-green-50 hover:text-green-700" onClick={() => setApproveId(d.id)}><Check className="size-4" weight="bold" /></Button>
                      <Button variant="ghost" size="icon-sm" className="text-destructive hover:bg-destructive/10" onClick={() => setRejectId(d.id)}><X className="size-4" weight="bold" /></Button>
                    </div>
                  </TableCell>
                )}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-1">
          <Button variant="ghost" size="icon-sm" onClick={() => setPage((p) => p - 1)} disabled={page <= 0}><CaretLeft className="size-4" /></Button>
          <span className="px-3 text-xs text-muted-foreground">{page + 1} / {totalPages}</span>
          <Button variant="ghost" size="icon-sm" onClick={() => setPage((p) => p + 1)} disabled={page >= totalPages - 1}><CaretRight className="size-4" /></Button>
        </div>
      )}

      <ConfirmDialog open={approveId != null} onOpenChange={(o) => !o && setApproveId(null)} title="딜을 승인하시겠습니까?" description="승인하면 핫딜 피드에 게시됩니다." onConfirm={handleApprove} confirmLabel="승인" />
      <ConfirmDialog open={rejectId != null} onOpenChange={(o) => !o && setRejectId(null)} title="딜을 거부하시겠습니까?" description="거부된 딜은 피드에 표시되지 않습니다." onConfirm={handleReject} confirmLabel="거부" variant="destructive" />
      <ConfirmDialog open={bulkConfirmOpen} onOpenChange={setBulkConfirmOpen} title={`${selected.size}건을 일괄 승인하시겠습니까?`} description="선택한 모든 딜이 핫딜 피드에 게시됩니다." onConfirm={handleBulkApprove} confirmLabel="일괄 승인" />
    </div>
  );
}

/* ─── Hot Deals Management Tab ─── */

const EMPTY_FORM: CreateHotDealRequest = {
  title: "", description: "", url: "", imageUrl: "",
  originalPrice: null, dealPrice: null, discountRate: null,
  category: "", store: "",
};

function HotDealsTab() {
  const [deals, setDeals] = useState<AdminHotDeal[]>([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [totalElements, setTotalElements] = useState(0);
  const [loading, setLoading] = useState(true);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingDeal, setEditingDeal] = useState<AdminHotDeal | null>(null);
  const [form, setForm] = useState<CreateHotDealRequest>(EMPTY_FORM);
  const [deleteId, setDeleteId] = useState<number | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const result = await fetchAdminHotDeals(page, 20);
      setDeals(result.content);
      setTotalPages(result.totalPages);
      setTotalElements(result.totalElements);
    } catch { toast.error("핫딜 목록을 불러올 수 없습니다"); }
    finally { setLoading(false); }
  }, [page]);

  useEffect(() => { load(); }, [load]);

  function openCreate() {
    setEditingDeal(null);
    setForm(EMPTY_FORM);
    setDialogOpen(true);
  }

  function openEdit(deal: AdminHotDeal) {
    setEditingDeal(deal);
    setForm({
      title: deal.title,
      description: deal.description,
      url: deal.url,
      imageUrl: deal.imageUrl,
      originalPrice: deal.originalPrice,
      dealPrice: deal.dealPrice,
      discountRate: deal.discountRate,
      category: deal.category,
      store: deal.store,
    });
    setDialogOpen(true);
  }

  async function handleSave() {
    if (!form.title.trim()) { toast.error("제목을 입력해주세요"); return; }
    if (!form.url.trim()) { toast.error("URL을 입력해주세요"); return; }
    try {
      if (editingDeal) {
        await updateHotDeal(editingDeal.id, form);
        toast.success("핫딜이 수정되었습니다");
      } else {
        await createHotDeal(form);
        toast.success("핫딜이 등록되었습니다");
      }
      setDialogOpen(false);
      load();
    } catch { toast.error("저장에 실패했습니다"); }
  }

  async function handleDelete() {
    if (deleteId == null) return;
    try {
      await deleteHotDeal(deleteId);
      toast.success("핫딜이 삭제되었습니다");
      setDeleteId(null);
      load();
    } catch { toast.error("삭제에 실패했습니다"); }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <span className="text-xs text-muted-foreground">총 {totalElements}건</span>
        <Button size="sm" onClick={openCreate}>
          <Plus className="mr-1 size-4" />핫딜 직접 등록
        </Button>
      </div>

      <div className="rounded-xl border border-border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>제목</TableHead>
              <TableHead className="hidden sm:table-cell">가격</TableHead>
              <TableHead className="hidden sm:table-cell">판매처</TableHead>
              <TableHead className="hidden lg:table-cell">카테고리</TableHead>
              <TableHead className="hidden md:table-cell text-right">좋아요</TableHead>
              <TableHead className="hidden md:table-cell text-right">댓글</TableHead>
              <TableHead className="hidden md:table-cell">등록일</TableHead>
              <TableHead className="w-[50px]">작업</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow><TableCell colSpan={8} className="py-12 text-center"><div className="mx-auto size-5 animate-spin rounded-full border-2 border-primary border-t-transparent" /></TableCell></TableRow>
            ) : deals.length === 0 ? (
              <TableRow><TableCell colSpan={8} className="py-12 text-center text-sm text-muted-foreground">등록된 핫딜이 없습니다</TableCell></TableRow>
            ) : deals.map((d) => (
              <TableRow key={d.id} className={d.isExpired ? "opacity-50" : ""}>
                <TableCell>
                  <div className="flex items-center gap-2">
                    {d.imageUrl && <img src={d.imageUrl} alt="" className="hidden size-9 rounded object-cover sm:block" />}
                    <div className="min-w-0">
                      <span className="block max-w-[280px] truncate text-sm font-medium">{d.title}</span>
                      {d.isExpired && <Badge variant="secondary" className="text-[9px]">종료</Badge>}
                    </div>
                  </div>
                </TableCell>
                <TableCell className="hidden text-sm tabular-nums sm:table-cell">{formatPrice(d.dealPrice)}</TableCell>
                <TableCell className="hidden text-xs sm:table-cell">{d.store || <span className="text-muted-foreground">-</span>}</TableCell>
                <TableCell className="hidden lg:table-cell">{d.category && <Badge variant="outline" className="text-[10px]">{d.category}</Badge>}</TableCell>
                <TableCell className="hidden text-right text-xs tabular-nums md:table-cell">{d.likeCount}</TableCell>
                <TableCell className="hidden text-right text-xs tabular-nums md:table-cell">{d.commentCount}</TableCell>
                <TableCell className="hidden text-xs text-muted-foreground md:table-cell" suppressHydrationWarning>{timeAgo(d.createdAt)}</TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="size-8"><DotsThree className="size-4" weight="bold" /></Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => openEdit(d)}>
                        <PencilSimple className="mr-2 size-3.5" />수정
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem className="text-destructive" onClick={() => setDeleteId(d.id)}>
                        <Trash className="mr-2 size-3.5" />삭제
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-1">
          <Button variant="ghost" size="icon-sm" onClick={() => setPage((p) => p - 1)} disabled={page <= 0}><CaretLeft className="size-4" /></Button>
          <span className="px-3 text-xs text-muted-foreground">{page + 1} / {totalPages}</span>
          <Button variant="ghost" size="icon-sm" onClick={() => setPage((p) => p + 1)} disabled={page >= totalPages - 1}><CaretRight className="size-4" /></Button>
        </div>
      )}

      {/* Create/Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>{editingDeal ? "핫딜 수정" : "핫딜 직접 등록"}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-2">
            <div className="grid gap-2">
              <Label htmlFor="title">제목 *</Label>
              <Input id="title" value={form.title} onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))} placeholder="핫딜 제목" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="desc">설명</Label>
              <Textarea id="desc" value={form.description ?? ""} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))} placeholder="핫딜 설명" rows={3} />
            </div>
            <div className="grid grid-cols-3 gap-3">
              <div className="grid gap-2">
                <Label htmlFor="dealPrice">할인가</Label>
                <Input id="dealPrice" type="number" value={form.dealPrice ?? ""} onChange={(e) => setForm((f) => ({ ...f, dealPrice: e.target.value ? Number(e.target.value) : null }))} />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="origPrice">원가</Label>
                <Input id="origPrice" type="number" value={form.originalPrice ?? ""} onChange={(e) => setForm((f) => ({ ...f, originalPrice: e.target.value ? Number(e.target.value) : null }))} />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="discount">할인율 %</Label>
                <Input id="discount" type="number" value={form.discountRate ?? ""} onChange={(e) => setForm((f) => ({ ...f, discountRate: e.target.value ? Number(e.target.value) : null }))} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="grid gap-2">
                <Label htmlFor="store">판매처</Label>
                <Input id="store" value={form.store ?? ""} onChange={(e) => setForm((f) => ({ ...f, store: e.target.value }))} placeholder="쿠팡, 네이버 등" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="category">카테고리</Label>
                <Input id="category" value={form.category ?? ""} onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))} placeholder="전자제품, 식품 등" />
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="url">URL *</Label>
              <Input id="url" value={form.url} onChange={(e) => setForm((f) => ({ ...f, url: e.target.value }))} placeholder="https://..." />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="imgUrl">이미지 URL</Label>
              <Input id="imgUrl" value={form.imageUrl ?? ""} onChange={(e) => setForm((f) => ({ ...f, imageUrl: e.target.value }))} placeholder="https://..." />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>취소</Button>
            <Button onClick={handleSave}>{editingDeal ? "저장" : "등록"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <ConfirmDialog open={deleteId != null} onOpenChange={(o) => !o && setDeleteId(null)} title="핫딜을 삭제하시겠습니까?" description="삭제된 핫딜은 피드에서 제거됩니다." onConfirm={handleDelete} confirmLabel="삭제" variant="destructive" />
    </div>
  );
}

/* ─── Main Page ─── */

export default function DealsPage() {
  const [tab, setTab] = useState<"crawl" | "hotdeals">("crawl");

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold">핫딜 관리</h1>
      </div>

      <Tabs value={tab} onValueChange={(v) => setTab(v as "crawl" | "hotdeals")}>
        <TabsList>
          <TabsTrigger value="crawl">크롤링 딜</TabsTrigger>
          <TabsTrigger value="hotdeals">핫딜 직접관리</TabsTrigger>
        </TabsList>
      </Tabs>

      {tab === "crawl" ? <CrawlDealsTab /> : <HotDealsTab />}
    </div>
  );
}
