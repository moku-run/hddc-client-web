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
import { Trash, Plus, ImageSquare } from "@phosphor-icons/react";
import { List, GridFour, SquaresFour } from "@phosphor-icons/react";
import { ToggleGroup, type ToggleGroupOption } from "@/components/ui/toggle-group";
import { SectionHeader } from "@/components/ui/section-header";
import { DragHandle } from "@/components/ui/drag-handle";
import { Switch } from "@/components/ui/switch";
import { ImageCropModal } from "./image-crop-modal";
import { R2Image } from "@/components/ui/r2-image";
import { useImageUrl } from "@/hooks/use-image-url";
import { useSectionFocus, useEditFocus } from "@/contexts/edit-focus-context";
import { cn, dataUrlToFile } from "@/lib/utils";
import { validateUrl, normalizeUrl } from "@/lib/validators";
import { uploadImage } from "@/lib/api";
import { toast } from "sonner";
import { ColorPickerPopover } from "@/components/ui/color-picker-popover";
import type { ProfileLink, LinkLayout, LinkStyle, LinkRound, LinkAnimation } from "@/lib/profile-types";

interface Props {
  links: ProfileLink[];
  linkLayout: LinkLayout;
  linkStyle: LinkStyle;
  linkRound: LinkRound;
  linkAnimation: LinkAnimation;
  linkGradientFrom: string | null;
  linkGradientTo: string | null;
  addLink: () => void;
  updateLink: (id: number, fields: Partial<Pick<ProfileLink, "title" | "url" | "imageUrl" | "description">>) => void;
  removeLink: (id: number) => void;
  toggleLink: (id: number) => void;
  reorderLinks: (activeId: number, overId: number) => void;
  setLinkLayout: (layout: LinkLayout) => void;
  setLinkStyle: (style: LinkStyle) => void;
  setLinkRound: (round: LinkRound) => void;
  setLinkAnimation: (anim: LinkAnimation) => void;
  setLinkGradient: (from: string | null, to: string | null) => void;
}

const LAYOUTS: ToggleGroupOption<LinkLayout>[] = [
  { value: "list", label: "리스트", icon: List },
  { value: "grid-2", label: "2열", icon: GridFour },
  { value: "grid-3", label: "3열", icon: SquaresFour },
];

function SortableEditorCard({
  link,
  children,
}: {
  link: ProfileLink;
  children: React.ReactNode;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: link.id });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 50 : undefined,
    opacity: isDragging ? 0.8 : undefined,
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} className="flex items-center gap-2 rounded-lg border border-border bg-card p-3">
      <DragHandle {...listeners} />
      {children}
    </div>
  );
}

const LINK_ANIMATIONS: ToggleGroupOption<LinkAnimation>[] = [
  { value: "none", label: "없음" },
  { value: "fade-in", label: "페이드" },
  { value: "slide-up", label: "슬라이드" },
  { value: "scale", label: "스케일" },
  { value: "stagger", label: "순차" },
];

const LINK_STYLES: ToggleGroupOption<LinkStyle>[] = [
  { value: "none", label: "없음" },
  { value: "fill", label: "채움" },
  { value: "shadow", label: "그림자" },
  { value: "glass", label: "글래스" },
  { value: "gradient", label: "그라데이션" },
];

const LINK_ROUNDS: ToggleGroupOption<LinkRound>[] = [
  { value: "none", label: "직각" },
  { value: "sm", label: "조금" },
  { value: "md", label: "중간" },
  { value: "lg", label: "많이" },
];

export function LinkListEditor({ links, linkLayout, linkStyle, linkRound, linkAnimation, linkGradientFrom, linkGradientTo, addLink, updateLink, removeLink, toggleLink, reorderLinks, setLinkLayout, setLinkStyle, setLinkRound, setLinkAnimation, setLinkGradient }: Props) {
  const [cropLinkId, setCropLinkId] = useState<number | null>(null);
  const cropLink = links.find((l) => l.id === cropLinkId);
  const cropLinkImageSrc = useImageUrl(cropLink?.imageUrl ?? null);
  const sectionFocus = useSectionFocus("links");
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
    } catch { toast.error("링크 이미지 업로드에 실패했습니다"); }
  }

  function handleCropCancel() {
    setCropLinkId(null);
  }

  return (
    <section className="flex flex-col gap-3" {...sectionFocus}>
      <SectionHeader title="링크" badge={`${links.length}/20`} />

      {/* Layout selector */}
      <div className="flex items-center gap-1">
        <span className="mr-1 text-[11px] text-muted-foreground">배치</span>
        <ToggleGroup variant="square" value={linkLayout} onValueChange={setLinkLayout} options={LAYOUTS} />
      </div>

      {/* Style selector */}
      <div className="flex items-center gap-1">
        <span className="mr-1 text-[11px] text-muted-foreground">스타일</span>
        <ToggleGroup variant="square" value={linkStyle} onValueChange={setLinkStyle} options={LINK_STYLES} />
      </div>

      {/* Gradient color pickers — visible only when gradient style is selected */}
      {linkStyle === "gradient" && (
        <div className="flex flex-col gap-2 rounded-lg border border-border bg-muted/30 p-3">
          <div className="flex items-center gap-2">
            <div
              className="h-6 flex-1 rounded-md border border-border"
              style={{
                background: `linear-gradient(135deg, ${linkGradientFrom || "#6366f1"}, ${linkGradientTo || "#ec4899"})`,
              }}
            />
          </div>
          <div className="grid grid-cols-2 gap-2">
            <ColorPickerPopover
              color={linkGradientFrom || "#6366f1"}
              onChange={(c) => setLinkGradient(c, linkGradientTo || "#ec4899")}
              triggerLabel="시작 색"
              width="220px"
              triggerClassName="mt-0 h-8 text-[11px]"
            />
            <ColorPickerPopover
              color={linkGradientTo || "#ec4899"}
              onChange={(c) => setLinkGradient(linkGradientFrom || "#6366f1", c)}
              triggerLabel="끝 색"
              width="220px"
              triggerClassName="mt-0 h-8 text-[11px]"
            />
          </div>
        </div>
      )}

      {/* Round selector */}
      <div className="flex items-center gap-1">
        <span className="mr-1 text-[11px] text-muted-foreground">라운드</span>
        <ToggleGroup variant="square" value={linkRound} onValueChange={setLinkRound} options={LINK_ROUNDS} />
      </div>

      {/* Animation selector */}
      <div className="flex items-center gap-1">
        <span className="mr-1 text-[11px] text-muted-foreground">애니메이션</span>
        <ToggleGroup variant="square" value={linkAnimation} onValueChange={setLinkAnimation} options={LINK_ANIMATIONS} />
      </div>

      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={links.map((l) => l.id)} strategy={verticalListSortingStrategy}>
          {links.map((link) => (
            <div
              key={link.id}
              onMouseEnter={() => setActiveLinkId(link.id)}
              onMouseLeave={() => setActiveLinkId(null)}
            >
              <SortableEditorCard link={link}>
                <div className={cn("flex flex-1 items-center gap-2", !link.enabled && "opacity-50")}>
                  {/* Image upload trigger */}
                  <div className="shrink-0 cursor-pointer" onClick={() => setCropLinkId(link.id)}>
                    {link.imageUrl ? (
                      <R2Image
                        imageKey={link.imageUrl}
                        className="size-12 rounded-full border border-border object-cover"
                        onError={() => updateLink(link.id, { imageUrl: null })}
                      />
                    ) : (
                      <div className="flex size-12 items-center justify-center rounded-full border border-dashed border-border bg-muted/50">
                        <ImageSquare className="size-5 text-muted-foreground" />
                      </div>
                    )}
                  </div>

                  <div className="flex flex-1 flex-col gap-1.5">
                    <div className="relative">
                      <Input
                        placeholder="링크 제목"
                        value={link.title}
                        onChange={(e) => updateLink(link.id, { title: e.target.value.slice(0, 20) })}
                        className="h-7 pr-10 text-sm"
                        maxLength={20}
                      />
                      <span className="absolute right-2 top-1/2 -translate-y-1/2 text-[9px] text-muted-foreground">
                        {link.title.length}/20
                      </span>
                    </div>
                    <Input
                      placeholder="https://..."
                      type="url"
                      value={link.url}
                      onChange={(e) => updateLink(link.id, { url: e.target.value })}
                      onBlur={(e) => {
                        const normalized = normalizeUrl(e.target.value);
                        if (normalized !== e.target.value) updateLink(link.id, { url: normalized });
                      }}
                      className={cn("h-7 text-sm", link.url && validateUrl(link.url) && "border-destructive")}
                    />
                    {link.url && validateUrl(link.url) && (
                      <p className="mt-0.5 text-[9px] text-destructive">{validateUrl(link.url)}</p>
                    )}
                    <Input
                      placeholder="설명 (선택)"
                      value={link.description ?? ""}
                      onChange={(e) => updateLink(link.id, { description: e.target.value.slice(0, 40) })}
                      className="h-6 text-[11px] text-muted-foreground"
                      maxLength={40}
                    />
                  </div>
                </div>

                <div className="flex shrink-0 items-center gap-1">
                  <Switch
                    checked={link.enabled}
                    onCheckedChange={() => toggleLink(link.id)}
                    className="scale-75"
                  />
                  <Button variant="ghost" size="icon-xs" onClick={() => removeLink(link.id)} className="text-muted-foreground hover:text-destructive" aria-label="링크 삭제">
                    <Trash className="size-3.5" />
                  </Button>
                </div>
              </SortableEditorCard>
            </div>
          ))}
        </SortableContext>
      </DndContext>

      <Button variant="outline" className="h-9 w-full text-sm" onClick={addLink} disabled={links.length >= 20}>
        <Plus className="mr-1 size-4" />
        링크 추가
      </Button>

      <ImageCropModal
        open={cropLinkId != null}
        variant="circle"
        initialSrc={cropLinkImageSrc}
        onApply={handleCropApply}
        onCancel={handleCropCancel}
        onRemove={cropLink?.imageUrl ? () => {
          if (cropLinkId != null) updateLink(cropLinkId, { imageUrl: null });
          setCropLinkId(null);
        } : undefined}
        modalTitle="링크 이미지 편집"
      />
    </section>
  );
}
