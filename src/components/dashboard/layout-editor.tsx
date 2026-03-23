"use client";

import { List, Newspaper, GridFour, GridNine, Storefront, ImageSquare } from "@phosphor-icons/react";
import { SectionHeader } from "@/components/ui/section-header";
import { ToggleGroup, type ToggleGroupOption } from "@/components/ui/toggle-group";
import { ColorPickerPopover } from "@/components/ui/color-picker-popover";
import { RemoveButton } from "@/components/ui/remove-button";
import { cn } from "@/lib/utils";
import type { PageLayout, LinkRound, LinkBorderThick } from "@/lib/profile-types";

const PAGE_LAYOUTS: { value: PageLayout; label: string; icon: typeof List; desc: string }[] = [
  { value: "list", label: "리스트", icon: List, desc: "심플한 상품 리스트" },
  { value: "card", label: "카드", icon: Newspaper, desc: "큰 이미지 카드" },
  { value: "grid", label: "2열 그리드", icon: GridFour, desc: "2열 상품 그리드" },
  { value: "grid-3", label: "3열 그리드", icon: GridNine, desc: "3열 상품 그리드" },
  { value: "shop", label: "쇼핑몰", icon: Storefront, desc: "카테고리 탭 + 리스트" },
  { value: "visual", label: "비주얼", icon: ImageSquare, desc: "핀터레스트 스타일" },
];

const LINK_ROUNDS: ToggleGroupOption<LinkRound>[] = [
  { value: "none", label: "직각" },
  { value: "sm", label: "조금" },
  { value: "md", label: "중간" },
  { value: "lg", label: "많이" },
];

const BORDER_THICKS: ToggleGroupOption<LinkBorderThick>[] = [
  { value: "none", label: "없음" },
  { value: "thin", label: "얇게" },
  { value: "medium", label: "보통" },
  { value: "thick", label: "두껍게" },
];

interface Props {
  pageLayout: PageLayout;
  linkRound: LinkRound;
  linkBorderColor: string | null;
  linkBorderThick: LinkBorderThick;
  setPageLayout: (layout: PageLayout) => void;
  setLinkRound: (round: LinkRound) => void;
  setLinkBorderColor: (color: string | null) => void;
  setLinkBorderThick: (thick: LinkBorderThick) => void;
}

export function LayoutEditor({
  pageLayout, linkRound, linkBorderColor, linkBorderThick,
  setPageLayout, setLinkRound, setLinkBorderColor, setLinkBorderThick,
}: Props) {
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

      {/* Card border customization */}
      <div className="mt-1">
        <p className="mb-2 text-xs text-muted-foreground">핫딜상품 카드 라운드</p>
        <ToggleGroup variant="square" value={linkRound} onValueChange={setLinkRound} options={LINK_ROUNDS} />
      </div>

      <div>
        <p className="mb-2 text-xs text-muted-foreground">핫딜상품 카드 테두리 두께</p>
        <ToggleGroup variant="square" value={linkBorderThick} onValueChange={setLinkBorderThick} options={BORDER_THICKS} />
      </div>

      <div>
        <div className="mb-2 flex items-center justify-between">
          <p className="text-xs text-muted-foreground">핫딜상품 카드 테두리 색상</p>
          {linkBorderColor && (
            <RemoveButton label="초기화" onClick={() => setLinkBorderColor(null)} />
          )}
        </div>
        <ColorPickerPopover
          color={linkBorderColor || "#e5e7eb"}
          onChange={(color) => setLinkBorderColor(color)}
          triggerLabel="테두리 색상 선택"
        />
      </div>
    </section>
  );
}
