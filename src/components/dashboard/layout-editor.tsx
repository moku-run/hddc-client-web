"use client";

import { List, Newspaper, GridFour, Storefront, ImageSquare } from "@phosphor-icons/react";
import { SectionHeader } from "@/components/ui/section-header";
import { cn } from "@/lib/utils";
import type { PageLayout } from "@/lib/profile-types";

const PAGE_LAYOUTS: { value: PageLayout; label: string; icon: typeof List; desc: string }[] = [
  { value: "list", label: "리스트", icon: List, desc: "심플한 상품 리스트" },
  { value: "card", label: "카드", icon: Newspaper, desc: "큰 이미지 카드" },
  { value: "grid", label: "그리드", icon: GridFour, desc: "2열 상품 그리드" },
  { value: "magazine", label: "매거진", icon: Newspaper, desc: "히어로 헤더 + 순위" },
  { value: "shop", label: "쇼핑몰", icon: Storefront, desc: "카테고리 탭 + 리스트" },
  { value: "visual", label: "비주얼", icon: ImageSquare, desc: "핀터레스트 스타일" },
];

interface Props {
  pageLayout: PageLayout;
  setPageLayout: (layout: PageLayout) => void;
}

export function LayoutEditor({ pageLayout, setPageLayout }: Props) {
  return (
    <section className="flex flex-col gap-3">
      <SectionHeader title="배치 레이아웃" />
      <p className="text-[10px] text-muted-foreground">프로필 페이지에서 상품이 보여지는 방식을 선택하세요</p>

      <div className="grid grid-cols-3 gap-2">
        {PAGE_LAYOUTS.map(({ value, label, icon: Icon, desc }) => (
          <button
            key={value}
            onClick={() => setPageLayout(value)}
            className={cn(
              "flex cursor-pointer flex-col items-center gap-1.5 rounded-xl border p-3 transition-all",
              pageLayout === value
                ? "border-primary bg-primary/5 text-primary ring-1 ring-primary"
                : "border-border text-muted-foreground hover:border-foreground/20 hover:text-foreground",
            )}
          >
            <Icon className="size-6" weight={pageLayout === value ? "fill" : "regular"} />
            <span className="text-[11px] font-semibold">{label}</span>
            <span className="text-[8px] leading-tight opacity-60">{desc}</span>
          </button>
        ))}
      </div>
    </section>
  );
}
