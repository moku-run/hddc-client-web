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
import { useSectionFocus, useEditFocus } from "@/contexts/edit-focus-context";
import { cn } from "@/lib/utils";
import { validateUrl, normalizeUrl } from "@/lib/validators";
import type { ProfileLink, LinkLayout, LinkStyle, LinkAnimation } from "@/lib/profile-types";

interface Props {
  links: ProfileLink[];
  linkLayout: LinkLayout;
  linkStyle: LinkStyle;
  linkAnimation: LinkAnimation;
  addLink: () => void;
  updateLink: (id: string, fields: Partial<Pick<ProfileLink, "title" | "url" | "imageUrl" | "description">>) => void;
  removeLink: (id: string) => void;
  toggleLink: (id: string) => void;
  reorderLinks: (activeId: string, overId: string) => void;
  setLinkLayout: (layout: LinkLayout) => void;
  setLinkStyle: (style: LinkStyle) => void;
  setLinkAnimation: (anim: LinkAnimation) => void;
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
  { value: "fill", label: "채움" },
  { value: "outline", label: "아웃라인" },
  { value: "shadow", label: "그림자" },
  { value: "rounded", label: "라운드" },
  { value: "pill", label: "캡슐" },
];

export function LinkListEditor({ links, linkLayout, linkStyle, linkAnimation, addLink, updateLink, removeLink, toggleLink, reorderLinks, setLinkLayout, setLinkStyle, setLinkAnimation }: Props) {
  const [cropLinkId, setCropLinkId] = useState("");
  const cropLink = links.find((l) => l.id === cropLinkId);
  const sectionFocus = useSectionFocus("links");
  const { setActiveLinkId } = useEditFocus();

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
  );

  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      const { active, over } = event;
      if (!over || active.id === over.id) return;
      reorderLinks(active.id as string, over.id as string);
    },
    [reorderLinks],
  );

  function handleCropApply(dataUrl: string) {
    updateLink(cropLinkId, { imageUrl: dataUrl });
    setCropLinkId("");
  }

  function handleCropCancel() {
    setCropLinkId("");
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
                      <img
                        src={link.imageUrl}
                        alt=""
                        className="size-12 rounded-full border border-border object-cover"
                        onError={() => updateLink(link.id, { imageUrl: "" })}
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
                      value={link.description}
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
        open={!!cropLinkId}
        initialSrc={cropLink?.imageUrl || null}
        onApply={handleCropApply}
        onCancel={handleCropCancel}
        linkTitle={cropLink?.title}
      />
    </section>
  );
}
