"use client";

import { useState, useCallback } from "react";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Trash, Plus, ImageSquare, CurrencyDollar } from "@phosphor-icons/react";
import { SectionHeader } from "@/components/ui/section-header";
import { DragHandle } from "@/components/ui/drag-handle";
import { Switch } from "@/components/ui/switch";
import { ImageCropModal } from "./image-crop-modal";
import { R2Image } from "@/components/ui/r2-image";
import { useImageUrl } from "@/hooks/use-image-url";
import { useEditFocus } from "@/contexts/edit-focus-context";
import { cn, dataUrlToFile } from "@/lib/utils";
import { validateUrl, normalizeUrl } from "@/lib/validators";
import { uploadImage } from "@/lib/api";
import { toast } from "sonner";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import type { ProfileLink } from "@/lib/profile-types";

interface Props {
  links: ProfileLink[];
  addLink: () => void;
  updateLink: (id: number, fields: Partial<Pick<ProfileLink, "title" | "url" | "imageUrl" | "description" | "price" | "originalPrice" | "discountRate" | "store" | "category">>) => void;
  removeLink: (id: number) => void;
  toggleLink: (id: number) => void;
  reorderLinks: (activeId: number, overId: number) => void;
}

function SortableEditorCard({ link, children }: { link: ProfileLink; children: React.ReactNode }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: link.id });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 50 : undefined,
    opacity: isDragging ? 0.8 : undefined,
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} className="flex items-start gap-2 rounded-lg border border-border bg-card p-3">
      <DragHandle {...listeners} />
      {children}
    </div>
  );
}

export function LinkListEditor({ links, addLink, updateLink, removeLink, toggleLink, reorderLinks }: Props) {
  const [cropLinkId, setCropLinkId] = useState<number | null>(null);
  const cropLink = links.find((l) => l.id === cropLinkId);
  const cropLinkImageSrc = useImageUrl(cropLink?.imageUrl ?? null);
  const { setActiveLinkId } = useEditFocus();

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
  );

  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      const { active, over } = event;
      if (!over || active.id === over.id) return;
      reorderLinks(active.id as number, over.id as number);
    },
    [reorderLinks],
  );

  async function handleCropApply(dataUrl: string) {
    if (cropLinkId == null) return;
    setCropLinkId(null);
    try {
      const file = dataUrlToFile(dataUrl, "link.jpg");
      const key = await uploadImage(file, "link/profiles");
      updateLink(cropLinkId, { imageUrl: key });
    } catch { toast.error("이미지 업로드에 실패했습니다"); }
  }

  function handleDealPriceChange(id: number, priceStr: string, currentOriginal: number | null | undefined) {
    const price = priceStr ? Number(priceStr) : null;
    let discountRate: number | null = null;
    if (price != null && currentOriginal != null && currentOriginal > price) {
      discountRate = Math.round(((currentOriginal - price) / currentOriginal) * 100);
    }
    updateLink(id, { price, discountRate });
  }

  function handleOriginalPriceChange(id: number, originalStr: string, currentPrice: number | null | undefined) {
    const originalPrice = originalStr ? Number(originalStr) : null;
    // 원가가 핫딜가보다 낮으면 핫딜가와 같게
    if (originalPrice != null && currentPrice != null && originalPrice < currentPrice) {
      updateLink(id, { originalPrice: currentPrice, discountRate: 0 });
      return;
    }
    let discountRate: number | null = null;
    if (currentPrice != null && originalPrice != null && originalPrice > currentPrice) {
      discountRate = Math.round(((originalPrice - currentPrice) / originalPrice) * 100);
    }
    updateLink(id, { originalPrice, discountRate });
  }

  function handleDiscountRateChange(id: number, rateStr: string, currentPrice: number | null | undefined) {
    const rate = rateStr ? Number(rateStr) : null;
    let originalPrice: number | null = null;
    if (rate != null && rate > 0 && rate < 100 && currentPrice != null) {
      originalPrice = Math.round(currentPrice / (1 - rate / 100));
    }
    updateLink(id, { discountRate: rate, originalPrice });
  }

  return (
    <section className="flex flex-col gap-3">
      <SectionHeader title="핫딜상품" badge={`${links.length}/20`} />

      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={links.map((l) => l.id)} strategy={verticalListSortingStrategy}>
          {links.map((link) => (
            <div
              key={link.id}
              onMouseEnter={() => setActiveLinkId(link.id)}
              onMouseLeave={() => setActiveLinkId(null)}
            >
              <SortableEditorCard link={link}>
                <div className={cn("flex flex-1 flex-col gap-2", !link.enabled && "opacity-50")}>
                  {/* Row 1: Image + Title + URL */}
                  <div className="flex items-start gap-2">
                    <div className="shrink-0 cursor-pointer" onClick={() => setCropLinkId(link.id)}>
                      {link.imageUrl ? (
                        <R2Image
                          imageKey={link.imageUrl}
                          className="size-14 rounded-lg border border-border object-cover"
                          onError={() => updateLink(link.id, { imageUrl: null })}
                        />
                      ) : (
                        <div className="flex size-14 items-center justify-center rounded-lg border border-dashed border-border bg-muted/50">
                          <ImageSquare className="size-5 text-muted-foreground" />
                        </div>
                      )}
                    </div>
                    <div className="flex flex-1 flex-col gap-1.5">
                      <Input
                        placeholder="상품명"
                        value={link.title}
                        onChange={(e) => updateLink(link.id, { title: e.target.value.slice(0, 40) })}
                        className="h-7 text-sm font-medium"
                        maxLength={40}
                      />
                      <Input
                        placeholder="https://..."
                        type="url"
                        value={link.url}
                        onChange={(e) => updateLink(link.id, { url: e.target.value })}
                        onBlur={(e) => {
                          const normalized = normalizeUrl(e.target.value);
                          if (normalized !== e.target.value) updateLink(link.id, { url: normalized });
                        }}
                        className={cn("h-7 text-xs", link.url && validateUrl(link.url) && "border-destructive")}
                      />
                      {link.url && validateUrl(link.url) && (
                        <p className="text-[9px] text-destructive">{validateUrl(link.url)}</p>
                      )}
                    </div>
                  </div>

                  {/* Row 2: Price + Store + Category */}
                  <div className="grid grid-cols-3 gap-1.5">
                    <div className="flex flex-col gap-0.5">
                      <span className="text-[9px] text-muted-foreground">핫딜가 <span className="text-destructive">*</span></span>
                      <Input
                        placeholder="199000"
                        type="number"
                        value={link.price ?? ""}
                        onChange={(e) => handleDealPriceChange(link.id, e.target.value, link.originalPrice)}
                        className={cn("h-6 text-[11px]", link.price == null && link.title && "border-destructive")}
                      />
                    </div>
                    <div className="flex flex-col gap-0.5">
                      <span className="text-[9px] text-muted-foreground">원가</span>
                      <Input
                        placeholder="289000"
                        type="number"
                        value={link.originalPrice ?? ""}
                        onChange={(e) => handleOriginalPriceChange(link.id, e.target.value, link.price)}
                        className="h-6 text-[11px]"
                      />
                    </div>
                    <div className="flex flex-col gap-0.5">
                      <span className="text-[9px] text-muted-foreground">
                        할인율 {link.discountRate != null && <span className="text-red-500">{link.discountRate}%</span>}
                      </span>
                      <Input
                        placeholder="%"
                        type="number"
                        value={link.discountRate ?? ""}
                        onChange={(e) => handleDiscountRateChange(link.id, e.target.value, link.price)}
                        className="h-6 text-[11px]"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-1.5">
                    <div className="flex flex-col gap-0.5">
                      <span className="text-[9px] text-muted-foreground">판매처</span>
                      <Input
                        placeholder="쿠팡, 네이버 등"
                        value={link.store ?? ""}
                        onChange={(e) => updateLink(link.id, { store: e.target.value || null })}
                        className="h-6 text-[11px]"
                      />
                    </div>
                    <div className="flex flex-col gap-0.5">
                      <span className="text-[9px] text-muted-foreground">카테고리</span>
                      <Input
                        placeholder="전자제품, 패션 등"
                        value={link.category ?? ""}
                        onChange={(e) => updateLink(link.id, { category: e.target.value || null })}
                        className="h-6 text-[11px]"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex shrink-0 flex-col items-center gap-1 pt-1">
                  <Switch
                    checked={link.enabled}
                    onCheckedChange={() => toggleLink(link.id)}
                    className="scale-75"
                  />
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="ghost" size="icon-xs" className="text-muted-foreground hover:text-destructive" aria-label="상품 삭제">
                        <Trash className="size-3.5" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent side="bottom" align="end" className="!w-auto flex-row items-center gap-1.5 whitespace-nowrap p-1.5">
                      <button onClick={() => removeLink(link.id)} className="cursor-pointer rounded bg-destructive px-2.5 py-0.5 text-[9px] font-medium text-white hover:bg-destructive/80">삭제</button>
                      <button className="cursor-pointer rounded bg-muted px-2.5 py-0.5 text-[9px] font-medium text-muted-foreground hover:text-foreground">취소</button>
                    </PopoverContent>
                  </Popover>
                </div>
              </SortableEditorCard>
            </div>
          ))}
        </SortableContext>
      </DndContext>

      <Button variant="outline" className="h-9 w-full text-sm" onClick={addLink} disabled={links.length >= 20}>
        <Plus className="mr-1 size-4" />
        상품 추가
      </Button>

      <ImageCropModal
        open={cropLinkId != null}
        variant="circle"
        initialSrc={cropLinkImageSrc}
        onApply={handleCropApply}
        onCancel={() => setCropLinkId(null)}
        onRemove={cropLink?.imageUrl ? () => {
          if (cropLinkId != null) updateLink(cropLinkId, { imageUrl: null });
          setCropLinkId(null);
        } : undefined}
        modalTitle="상품 이미지 편집"
      />
    </section>
  );
}
