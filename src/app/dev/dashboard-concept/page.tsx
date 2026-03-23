"use client";

import { useState } from "react";
import { Plus, Trash, DotsSixVertical, ImageSquare, Tag, ShoppingCart, ArrowSquareOut, Eye, EyeSlash, Fire, Storefront, CurrencyDollar, Link as LinkIcon, PencilSimple, ChartBar } from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { SectionHeader } from "@/components/ui/section-header";
import { cn } from "@/lib/utils";

/* ═══════════════════════════════════════════
   A: 상품 카드형 — 리틀리 링크를 상품 카드로 교체
   에디터에서 상품 정보(가격/판매처/이미지) 입력
   ═══════════════════════════════════════════ */

function ConceptA() {
  const [items] = useState([
    { id: 1, title: "Apple 에어팟 프로 2세대", price: 199000, originalPrice: 289000, store: "쿠팡", imageUrl: "", enabled: true, clicks: 1284 },
    { id: 2, title: "나이키 에어맥스 97", price: 129000, originalPrice: null, store: "무신사", imageUrl: "", enabled: true, clicks: 856 },
    { id: 3, title: "다이슨 에어랩 컴플리트", price: 549000, originalPrice: 699000, store: "네이버", imageUrl: "", enabled: false, clicks: 342 },
  ]);

  return (
    <div className="flex flex-col gap-4 rounded-xl border border-border bg-card p-5">
      <div className="flex items-center justify-between">
        <SectionHeader title="내 추천 상품" badge={`${items.length}/20`} />
        <Button size="sm" variant="outline" className="h-7 text-xs">
          <Plus className="mr-1 size-3" />상품 추가
        </Button>
      </div>

      <div className="flex flex-col gap-2.5">
        {items.map((item) => (
          <div key={item.id} className={cn("flex items-center gap-3 rounded-lg border border-border bg-card p-3", !item.enabled && "opacity-50")}>
            <DotsSixVertical className="size-4 shrink-0 cursor-grab text-muted-foreground" />
            <div className="flex size-14 shrink-0 items-center justify-center rounded-lg bg-muted">
              <ImageSquare className="size-6 text-muted-foreground/40" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold">{item.title}</p>
              <div className="mt-0.5 flex items-center gap-2 text-[10px] text-muted-foreground">
                <span className="font-medium text-foreground">{item.price.toLocaleString()}원</span>
                {item.originalPrice && <span className="line-through">{item.originalPrice.toLocaleString()}원</span>}
                <span>·</span>
                <span>{item.store}</span>
                <span>·</span>
                <span className="flex items-center gap-0.5"><ChartBar className="size-2.5" />{item.clicks}</span>
              </div>
            </div>
            <Switch checked={item.enabled} className="scale-75" />
            <Button variant="ghost" size="icon-xs" className="text-muted-foreground hover:text-destructive">
              <Trash className="size-3.5" />
            </Button>
          </div>
        ))}
      </div>

      <p className="text-center text-[10px] text-muted-foreground">드래그하여 순서를 변경할 수 있습니다</p>
    </div>
  );
}

/* ═══════════════════════════════════════════
   B: 탭 분리 — 상품 / 프로필 / 테마 탭
   ═══════════════════════════════════════════ */

function ConceptB() {
  const [tab, setTab] = useState<"products" | "profile" | "theme">("products");

  return (
    <div className="rounded-xl border border-border bg-card">
      <div className="flex border-b border-border">
        {(["products", "profile", "theme"] as const).map((t) => (
          <button key={t} onClick={() => setTab(t)} className={cn("flex-1 py-3 text-xs font-semibold transition-colors", tab === t ? "border-b-2 border-primary text-foreground" : "text-muted-foreground hover:text-foreground")}>
            {t === "products" ? "🛒 추천 상품" : t === "profile" ? "👤 프로필" : "🎨 테마"}
          </button>
        ))}
      </div>

      <div className="p-5">
        {tab === "products" && (
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold">추천 상품 목록</p>
              <Button size="sm" className="h-7 text-xs"><Plus className="mr-1 size-3" />추가</Button>
            </div>
            {["Apple 에어팟 프로 2세대", "나이키 에어맥스 97"].map((title, i) => (
              <div key={i} className="flex items-center gap-3 rounded-lg border border-border p-3">
                <div className="flex size-12 items-center justify-center rounded-lg bg-foreground text-[8px] font-bold text-background">핫딜닷쿨</div>
                <div className="flex-1">
                  <p className="text-sm font-medium">{title}</p>
                  <p className="text-[10px] text-muted-foreground">199,000원 · 쿠팡</p>
                </div>
                <PencilSimple className="size-4 text-muted-foreground" />
              </div>
            ))}
          </div>
        )}
        {tab === "profile" && (
          <div className="flex flex-col items-center gap-3 py-4">
            <div className="size-16 rounded-full bg-muted" />
            <Input placeholder="닉네임" className="max-w-xs text-center" />
            <Input placeholder="한 줄 소개" className="max-w-xs text-center" />
          </div>
        )}
        {tab === "theme" && (
          <div className="flex flex-col gap-3 py-4">
            <p className="text-sm font-semibold">컬러 프리셋</p>
            <div className="flex gap-2">
              {["#ef4444", "#3b82f6", "#22c55e", "#f59e0b", "#8b5cf6"].map((c) => (
                <div key={c} className="size-8 rounded-full border border-border" style={{ backgroundColor: c }} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════
   C: 상품 입력 폼 — URL 붙여넣기 → 자동 파싱
   ═══════════════════════════════════════════ */

function ConceptC() {
  const [url, setUrl] = useState("");
  const [parsed, setParsed] = useState(false);

  return (
    <div className="flex flex-col gap-4 rounded-xl border border-border bg-card p-5">
      <SectionHeader title="상품 추가" />

      <div className="flex flex-col gap-3">
        <div className="flex gap-2">
          <Input
            placeholder="상품 URL을 붙여넣으세요 (쿠팡, 네이버, 무신사...)"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            className="flex-1"
          />
          <Button size="sm" onClick={() => setParsed(true)} disabled={!url}>파싱</Button>
        </div>

        {parsed && (
          <div className="animate-in fade-in slide-in-from-bottom-2 duration-300 rounded-lg border border-primary/20 bg-primary/5 p-4">
            <div className="mb-3 flex items-center gap-2">
              <Badge variant="outline" className="text-[9px] text-primary">자동 파싱됨</Badge>
            </div>
            <div className="flex gap-3">
              <div className="flex size-20 items-center justify-center rounded-lg bg-foreground text-xs font-bold text-background">핫딜닷쿨</div>
              <div className="flex flex-1 flex-col gap-2">
                <Input defaultValue="Apple 에어팟 프로 2세대 (USB-C)" className="text-sm font-semibold" />
                <div className="grid grid-cols-2 gap-2">
                  <div className="flex flex-col gap-1">
                    <Label className="text-[10px]">할인가</Label>
                    <Input defaultValue="199000" type="number" className="h-8 text-xs" />
                  </div>
                  <div className="flex flex-col gap-1">
                    <Label className="text-[10px]">원가</Label>
                    <Input defaultValue="289000" type="number" className="h-8 text-xs" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div className="flex flex-col gap-1">
                    <Label className="text-[10px]">판매처</Label>
                    <Input defaultValue="쿠팡" className="h-8 text-xs" />
                  </div>
                  <div className="flex flex-col gap-1">
                    <Label className="text-[10px]">카테고리</Label>
                    <Input defaultValue="전자제품" className="h-8 text-xs" />
                  </div>
                </div>
                <Button size="sm" className="mt-1 self-end">추가하기</Button>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="text-[10px] text-muted-foreground">
        지원: 쿠팡, 네이버쇼핑, 무신사, 11번가, G마켓, SSG 등
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════
   D: 대시보드 + 상품 통합 — 통계 상단, 상품 하단
   ═══════════════════════════════════════════ */

function ConceptD() {
  return (
    <div className="flex flex-col gap-4">
      {/* Stats */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: "총 클릭", value: "12,847", icon: ChartBar },
          { label: "추천 상품", value: "8개", icon: ShoppingCart },
          { label: "이번 주 유입", value: "+23%", icon: Fire },
        ].map(({ label, value, icon: Icon }) => (
          <div key={label} className="flex flex-col items-center gap-1 rounded-xl border border-border bg-card p-3">
            <Icon className="size-4 text-primary" />
            <p className="text-lg font-bold">{value}</p>
            <p className="text-[10px] text-muted-foreground">{label}</p>
          </div>
        ))}
      </div>

      {/* Product list */}
      <div className="rounded-xl border border-border bg-card p-4">
        <div className="mb-3 flex items-center justify-between">
          <p className="text-sm font-semibold">내 추천 상품</p>
          <Button size="sm" variant="outline" className="h-7 text-xs"><Plus className="mr-1 size-3" />추가</Button>
        </div>
        {[
          { title: "에어팟 프로 2", price: "199,000원", store: "쿠팡", clicks: 1284, rank: 1 },
          { title: "에어맥스 97", price: "129,000원", store: "무신사", clicks: 856, rank: 2 },
          { title: "다이슨 에어랩", price: "549,000원", store: "네이버", clicks: 342, rank: 3 },
        ].map((item) => (
          <div key={item.rank} className="flex items-center gap-3 border-b border-border py-2.5 last:border-0">
            <span className="flex size-6 shrink-0 items-center justify-center rounded-md bg-muted text-[10px] font-bold text-muted-foreground">{item.rank}</span>
            <div className="flex size-10 items-center justify-center rounded-lg bg-foreground text-[7px] font-bold text-background">핫딜닷쿨</div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-xs font-medium">{item.title}</p>
              <p className="text-[10px] text-muted-foreground">{item.price} · {item.store}</p>
            </div>
            <div className="text-right">
              <p className="text-xs font-semibold">{item.clicks.toLocaleString()}</p>
              <p className="text-[9px] text-muted-foreground">클릭</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════
   E: 핫딜 피드 연동 — 내 상품이 피드에서 어떻게 보이는지
   ═══════════════════════════════════════════ */

function ConceptE() {
  return (
    <div className="flex flex-col gap-4">
      <div className="rounded-xl border border-border bg-card p-5">
        <SectionHeader title="내 추천 상품" />
        <p className="mt-1 text-[10px] text-muted-foreground">등록한 상품은 핫딜 피드에 스폰서로 노출됩니다</p>

        <div className="mt-4 flex flex-col gap-2.5">
          {[
            { title: "Apple 에어팟 프로 2세대", price: "199,000원", status: "노출 중", statusColor: "text-green-600 bg-green-50" },
            { title: "나이키 에어맥스 97", price: "129,000원", status: "노출 중", statusColor: "text-green-600 bg-green-50" },
            { title: "다이슨 에어랩", price: "549,000원", status: "비활성", statusColor: "text-muted-foreground bg-muted" },
          ].map((item, i) => (
            <div key={i} className="flex items-center gap-3 rounded-lg border border-border p-3">
              <div className="flex size-12 items-center justify-center rounded-lg bg-foreground text-[8px] font-bold text-background">핫딜닷쿨</div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium">{item.title}</p>
                <p className="text-[10px] text-muted-foreground">{item.price}</p>
              </div>
              <Badge className={cn("text-[9px]", item.statusColor)}>{item.status}</Badge>
            </div>
          ))}
        </div>
      </div>

      {/* Feed preview */}
      <div className="rounded-xl border border-dashed border-primary/30 bg-primary/5 p-4">
        <p className="mb-2 text-xs font-semibold text-primary">핫딜 피드 미리보기</p>
        <div className="flex gap-3 rounded-lg border border-border bg-card p-3">
          <div className="flex size-16 items-center justify-center rounded-lg bg-foreground text-[8px] font-bold text-background">핫딜닷쿨</div>
          <div className="flex-1">
            <div className="mb-0.5 flex items-center gap-1">
              <Badge className="bg-primary/10 text-[8px] text-primary">스폰서</Badge>
            </div>
            <p className="text-sm font-semibold">Apple 에어팟 프로 2세대</p>
            <p className="text-[10px] text-muted-foreground">199,000원 · 쿠팡 · @테크딜러</p>
          </div>
        </div>
        <p className="mt-2 text-center text-[9px] text-muted-foreground">이렇게 핫딜 피드에 노출됩니다</p>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════ */

const CONCEPTS = [
  { name: "A", label: "상품 카드형 에디터", desc: "기존 링크 리스트를 상품 카드로 교체. 가격/판매처/이미지/클릭수 표시. 드래그 정렬.", Component: ConceptA },
  { name: "B", label: "탭 분리 (상품/프로필/테마)", desc: "상품 관리를 메인 탭으로 올리고, 프로필/테마는 보조 탭으로 분리", Component: ConceptB },
  { name: "C", label: "URL 자동 파싱", desc: "상품 URL 붙여넣기 → 자동으로 제목/가격/판매처 파싱 → 수정 후 추가", Component: ConceptC },
  { name: "D", label: "대시보드 통합", desc: "상단에 클릭 통계 + 하단에 상품 리스트 (순위별). 한눈에 성과 확인", Component: ConceptD },
  { name: "E", label: "피드 연동 미리보기", desc: "상품이 핫딜 피드에서 어떻게 보이는지 미리보기 + 노출 상태 관리", Component: ConceptE },
];

export default function DashboardConceptPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-8">
      <h1 className="mb-2 text-2xl font-bold">대시보드 컨셉 비교</h1>
      <p className="mb-2 text-sm text-muted-foreground">
        리틀리(일반 링크) → 핫딜닷쿨(상품 특화 링크)로 전환. 대시보드 에디터 방향성 비교.
      </p>
      <p className="mb-8 text-xs text-muted-foreground/60">
        핵심: 링크 → 상품 카드 (가격/판매처/이미지) + 핫딜 피드 스폰서 노출
      </p>

      {CONCEPTS.map(({ name, label, desc, Component }) => (
        <section key={name} className="mb-12">
          <div className="mb-4 flex items-center gap-3">
            <span className="flex size-8 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">{name}</span>
            <div>
              <p className="text-sm font-semibold">{label}</p>
              <p className="text-[10px] text-muted-foreground">{desc}</p>
            </div>
          </div>
          <Component />
        </section>
      ))}
    </div>
  );
}
