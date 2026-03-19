"use client";

import { useCallback } from "react";
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
import {
  InstagramLogo,
  YoutubeLogo,
  XLogo,
  TiktokLogo,
  ThreadsLogo,
  Envelope,
  Globe,
  Trash,
  Plus,
  Check,
} from "@phosphor-icons/react";
import { FacebookIcon } from "@/components/icons/facebook-icon";
import { KakaoIcon } from "@/components/icons/kakao-icon";
import { NaverIcon } from "@/components/icons/naver-icon";
import { DragHandle } from "@/components/ui/drag-handle";
import { useSectionFocus } from "@/contexts/edit-focus-context";
import { SectionHeader } from "@/components/ui/section-header";
import { cn } from "@/lib/utils";
import {
  type SocialPlatform,
  type SocialLink,
  SOCIAL_PLATFORMS,
  SOCIAL_PLATFORM_LABELS,
  SOCIAL_PLATFORM_BASE_URLS,
  normalizeSocialHandle,
} from "@/lib/profile-types";

type IconComponent = React.ComponentType<{ className?: string }>;

const SOCIAL_ICONS: Record<SocialPlatform, IconComponent> = {
  instagram: InstagramLogo,
  youtube: YoutubeLogo,
  x: XLogo,
  tiktok: TiktokLogo,
  threads: ThreadsLogo,
  facebook: FacebookIcon,
  kakaotalk: KakaoIcon,
  "naver-blog": NaverIcon,
  email: Envelope,
  website: Globe,
};

interface Props {
  socials: SocialLink[];
  addSocial: (platform: SocialPlatform) => void;
  updateSocial: (id: number, url: string) => void;
  removeSocial: (id: number) => void;
  reorderSocials: (activeId: number, overId: number) => void;
}

function SortableSocialItem({ social, children }: { social: SocialLink; children: React.ReactNode }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: social.id });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 50 : undefined,
    opacity: isDragging ? 0.8 : undefined,
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} className="flex items-center gap-2">
      <DragHandle size="sm" {...listeners} />
      {children}
    </div>
  );
}

/** Placeholder text per platform */
const SOCIAL_PLACEHOLDERS: Partial<Record<SocialPlatform, string>> = {
  instagram: "username",
  youtube: "@channel",
  x: "username",
  tiktok: "username",
  threads: "username",
  facebook: "pagename",
  kakaotalk: "_abc123",
  "naver-blog": "blogid",
  email: "you@example.com",
  website: "https://example.com",
};

function SocialInput({
  social,
  updateSocial,
}: {
  social: SocialLink;
  updateSocial: (id: number, url: string) => void;
}) {
  const baseUrl = SOCIAL_PLATFORM_BASE_URLS[social.platform];
  const placeholder = SOCIAL_PLACEHOLDERS[social.platform] || "입력";

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateSocial(social.id, e.target.value);
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const normalized = normalizeSocialHandle(social.platform, e.target.value);
    if (normalized !== e.target.value) {
      updateSocial(social.id, normalized);
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    const pasted = e.clipboardData.getData("text");
    if (pasted && baseUrl) {
      e.preventDefault();
      const normalized = normalizeSocialHandle(social.platform, pasted);
      updateSocial(social.id, normalized);
    }
  };

  // email & website: free-form input (no prefix)
  if (!baseUrl) {
    return (
      <input
        placeholder={placeholder}
        value={social.url}
        onChange={handleChange}
        className="h-7 w-full min-w-0 flex-1 rounded-md border border-input bg-transparent px-2 text-sm outline-none focus:ring-1 focus:ring-ring placeholder:text-muted-foreground"
      />
    );
  }

  // Platform with base URL: show prefix + handle input
  return (
    <div className="flex h-7 min-w-0 flex-1 items-center overflow-hidden rounded-md border border-input text-sm">
      <span className="flex h-full shrink-0 items-center bg-muted px-2 text-[10px] text-muted-foreground">
        {baseUrl.replace("https://", "")}
      </span>
      <input
        placeholder={placeholder}
        value={social.url}
        onChange={handleChange}
        onBlur={handleBlur}
        onPaste={handlePaste}
        className="h-full min-w-0 flex-1 bg-transparent px-2 text-sm outline-none placeholder:text-muted-foreground"
      />
    </div>
  );
}

export function SocialEditor({ socials, addSocial, updateSocial, removeSocial, reorderSocials }: Props) {
  const usedPlatforms = new Set(socials.map((s) => s.platform));
  const sectionFocus = useSectionFocus("socials");
  const isFull = socials.length >= 8;

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
  );

  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      const { active, over } = event;
      if (!over || active.id === over.id) return;
      reorderSocials(active.id as number, over.id as number);
    },
    [reorderSocials],
  );

  return (
    <section className="flex flex-col gap-3" {...sectionFocus}>
      <SectionHeader title="소셜 아이콘" badge={`${socials.length}/8`} />

      {/* Platform icon grid */}
      <div className="grid grid-cols-5 gap-2">
        {SOCIAL_PLATFORMS.map((platform) => {
          const Icon = SOCIAL_ICONS[platform];
          const isAdded = usedPlatforms.has(platform);
          const disabled = !isAdded && isFull;

          return (
            <button
              key={platform}
              type="button"
              onClick={() => {
                if (isAdded) {
                  const social = socials.find((s) => s.platform === platform);
                  if (social) removeSocial(social.id);
                } else if (!disabled) {
                  addSocial(platform);
                }
              }}
              disabled={disabled}
              title={isAdded ? `${SOCIAL_PLATFORM_LABELS[platform]} 제거` : `${SOCIAL_PLATFORM_LABELS[platform]} 추가`}
              className={cn(
                "relative flex cursor-pointer flex-col items-center gap-1 rounded-lg p-2 transition-colors",
                isAdded
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground",
                disabled && "cursor-not-allowed opacity-30",
              )}
            >
              <div className="relative">
                <Icon className="size-5" />
                {isAdded ? (
                  <Check weight="bold" className="absolute -right-1.5 -top-1.5 size-3 rounded-full bg-primary text-primary-foreground" />
                ) : (
                  <Plus weight="bold" className="absolute -right-1.5 -top-1.5 size-3 text-muted-foreground/50" />
                )}
              </div>
              <span className="text-[9px] leading-tight">{SOCIAL_PLATFORM_LABELS[platform]}</span>
            </button>
          );
        })}
      </div>

      {/* Added socials — URL inputs with DnD */}
      {socials.length > 0 && (
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext items={socials.map((s) => s.id)} strategy={verticalListSortingStrategy}>
            <div className="flex flex-col gap-2">
              {socials.map((social) => {
                const Icon = SOCIAL_ICONS[social.platform];
                return (
                  <SortableSocialItem key={social.id} social={social}>
                    <div className="flex min-w-0 flex-1 items-center gap-2">
                      <Icon className="size-4 shrink-0 text-muted-foreground" />
                      <SocialInput social={social} updateSocial={updateSocial} />
                      <Button variant="ghost" size="icon-xs" onClick={() => removeSocial(social.id)} className="shrink-0 text-muted-foreground hover:text-destructive" aria-label="삭제">
                        <Trash className="size-3.5" />
                      </Button>
                    </div>
                  </SortableSocialItem>
                );
              })}
            </div>
          </SortableContext>
        </DndContext>
      )}
    </section>
  );
}
