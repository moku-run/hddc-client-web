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
  rectSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { cn } from "@/lib/utils";
import { useEditFocus, type EditSection } from "@/contexts/edit-focus-context";
import { type ProfileData, type ProfileLink, type LinkLayout, type LinkStyle, type LinkAnimation } from "@/lib/profile-types";
import { SponsorBanner } from "@/components/sponsor-banner";
import {
  InstagramLogo,
  YoutubeLogo,
  XLogo,
  TiktokLogo,
  ThreadsLogo,
  Envelope,
  Globe,
  UserCircle,
} from "@phosphor-icons/react";
import { FacebookIcon } from "@/components/icons/facebook-icon";
import { KakaoIcon } from "@/components/icons/kakao-icon";
import { NaverIcon } from "@/components/icons/naver-icon";

const SOCIAL_ICONS: Record<string, typeof InstagramLogo> = {
  instagram: InstagramLogo,
  youtube: YoutubeLogo,
  x: XLogo,
  tiktok: TiktokLogo,
  threads: ThreadsLogo,
  facebook: FacebookIcon as unknown as typeof InstagramLogo,
  kakaotalk: KakaoIcon as unknown as typeof InstagramLogo,
  "naver-blog": NaverIcon as unknown as typeof InstagramLogo,
  email: Envelope,
  website: Globe,
};

function HighlightWrapper({
  section,
  activeSection,
  className,
  inset,
  overlay,
  children,
}: {
  section: EditSection;
  activeSection: EditSection;
  className?: string;
  inset?: boolean;
  overlay?: boolean;
  children: React.ReactNode;
}) {
  const isActive = activeSection === section;
  const highlightClass = overlay
    ? "edit-highlight-overlay"
    : inset
      ? "edit-highlight-inset"
      : "edit-highlight";
  return (
    <div className={cn(
      "rounded-lg transition-all duration-300",
      isActive && highlightClass,
      className,
    )}>
      {children}
    </div>
  );
}

function Avatar({ src, isDefault }: { src: string | null; isDefault?: boolean }) {
  return (
    <div className="relative size-20 rounded-full ring-2 ring-background">
      <div className={cn(
        "flex size-20 items-center justify-center rounded-full text-base font-bold",
        isDefault
          ? "bg-foreground text-background"
          : "bg-primary text-primary-foreground",
      )}>
        핫딜닷쿨
      </div>
      {src && (
        <img
          src={src}
          alt=""
          className="absolute inset-0 size-20 rounded-full object-cover"
          onError={(e) => { e.currentTarget.style.display = "none"; }}
        />
      )}
    </div>
  );
}

/* ─── Link style utilities ─── */

function getLinkStyleClasses(style: LinkStyle, isDefault: boolean): string {
  switch (style) {
    case "outline":
      return isDefault
        ? "border-2 border-foreground bg-transparent text-foreground"
        : "border-2 border-primary bg-transparent hover:bg-primary/5";
    case "shadow":
      return cn("border-0 shadow-md hover:shadow-lg",
        isDefault ? "bg-background text-foreground" : "bg-primary/8");
    case "rounded":
      return cn("!rounded-2xl", isDefault
        ? "border-foreground bg-background text-foreground"
        : "border-primary/15 bg-primary/8 hover:bg-primary/12");
    case "pill":
      return cn("!rounded-full", isDefault
        ? "border-foreground bg-background text-foreground"
        : "border-primary/15 bg-primary/8 hover:bg-primary/12");
    case "fill":
    default:
      return isDefault
        ? "border-foreground bg-background text-foreground hover:bg-muted/50"
        : "border-primary/15 bg-primary/8 hover:bg-primary/12";
  }
}

/* ─── Link items by layout ─── */

function LinkImage({ src, size = "size-9", isDefault }: { src: string; size?: string; isDefault?: boolean }) {
  return (
    <div className={cn("relative shrink-0", size)}>
      <div className={cn(
        "flex shrink-0 items-center justify-center rounded-full",
        isDefault ? "bg-foreground" : "bg-primary",
        size,
      )}>
        <span className={cn("text-[6px] font-bold leading-none", isDefault ? "text-background" : "text-primary-foreground")}>핫딜닷쿨</span>
      </div>
      <img
        src={src}
        alt=""
        className={cn("absolute inset-0 shrink-0 rounded-full object-cover", size)}
        onError={(e) => { e.currentTarget.style.display = "none"; }}
      />
    </div>
  );
}

function DefaultLinkIcon({ size = "size-9", isDefault }: { size?: string; isDefault?: boolean }) {
  return (
    <div className={cn(
      "flex shrink-0 items-center justify-center rounded-full",
      isDefault ? "bg-foreground" : "bg-primary",
      size,
    )}>
      <span className={cn("text-[6px] font-bold leading-none", isDefault ? "text-background" : "text-primary-foreground")}>핫딜닷쿨</span>
    </div>
  );
}

/* ─── Sortable link wrapper ─── */

function SortableLinkItem({
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
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      onMouseDown={(e) => e.stopPropagation()}
      className="cursor-grab touch-none active:cursor-grabbing"
    >
      {children}
    </div>
  );
}

/* ─── Link renderers per layout ─── */

function ListLinkItem({ link, isDefault, tint, linkStyle = "fill" }: { link: ProfileLink; isDefault?: boolean; tint?: string; linkStyle?: LinkStyle }) {
  return (
    <div
      className={cn(
        "flex h-12 items-center gap-3 rounded-xl border px-3 text-sm font-medium transition-colors",
        tint ? "border-primary/15" : getLinkStyleClasses(linkStyle, !!isDefault),
        !link.enabled && "opacity-40",
      )}
      style={tint ? { backgroundColor: tint } : undefined}
    >
      {link.imageUrl ? <LinkImage src={link.imageUrl} isDefault={isDefault} /> : <DefaultLinkIcon isDefault={isDefault} />}
      <div className="min-w-0 flex-1">
        <span className={cn("truncate block", !link.enabled && "line-through")}>{link.title || "제목 없음"}</span>
        {link.description && (
          <p className="truncate text-[10px] text-muted-foreground">{link.description}</p>
        )}
      </div>
    </div>
  );
}

function Grid2LinkItem({ link, isDefault, tint, linkStyle = "fill" }: { link: ProfileLink; isDefault?: boolean; tint?: string; linkStyle?: LinkStyle }) {
  return (
    <div
      className={cn(
        "flex flex-col items-center gap-2 rounded-xl border p-3 transition-colors",
        tint ? "border-primary/15" : getLinkStyleClasses(linkStyle, !!isDefault),
        !link.enabled && "opacity-40",
      )}
      style={tint ? { backgroundColor: tint } : undefined}
    >
      {link.imageUrl ? <LinkImage src={link.imageUrl} size="size-12" isDefault={isDefault} /> : <DefaultLinkIcon size="size-12" isDefault={isDefault} />}
      <span className={cn("w-full truncate text-center text-xs font-medium", !link.enabled && "line-through")}>{link.title || "제목 없음"}</span>
    </div>
  );
}

function Grid3LinkItem({ link, isDefault, tint, linkStyle = "fill" }: { link: ProfileLink; isDefault?: boolean; tint?: string; linkStyle?: LinkStyle }) {
  return (
    <div
      className={cn(
        "flex flex-col items-center gap-1.5 rounded-lg border p-2 transition-colors",
        tint ? "border-primary/15" : getLinkStyleClasses(linkStyle, !!isDefault),
        !link.enabled && "opacity-40",
      )}
      style={tint ? { backgroundColor: tint } : undefined}
    >
      {link.imageUrl ? <LinkImage src={link.imageUrl} size="size-10" isDefault={isDefault} /> : <DefaultLinkIcon size="size-10" isDefault={isDefault} />}
      <span className={cn("w-full truncate text-center text-[10px] font-medium", !link.enabled && "line-through")}>{link.title || "제목 없음"}</span>
    </div>
  );
}

/* ─── Links section with DnD ─── */

function LinksSection({
  links,
  linkLayout,
  linkStyle,
  linkAnimation = "none",
  activeSection,
  activeLinkId,
  onReorderLinks,
  isDefault,
  tint,
}: {
  links: ProfileLink[];
  linkLayout: LinkLayout;
  linkStyle: LinkStyle;
  linkAnimation?: LinkAnimation;
  activeSection: EditSection;
  activeLinkId: number | null;
  onReorderLinks?: (activeId: number, overId: number) => void;
  isDefault?: boolean;
  tint?: string;
}) {
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
  );

  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      const { active, over } = event;
      if (!over || active.id === over.id || !onReorderLinks) return;
      onReorderLinks(active.id as number, over.id as number);
    },
    [onReorderLinks],
  );

  if (links.length === 0) return null;

  const strategy = linkLayout === "list" ? verticalListSortingStrategy : rectSortingStrategy;

  const gridClass =
    linkLayout === "grid-3"
      ? "grid grid-cols-3 gap-2"
      : linkLayout === "grid-2"
        ? "grid grid-cols-2 gap-2.5"
        : "flex flex-col gap-2.5";

  const showSectionHighlight = activeSection === "links" && !activeLinkId;

  return (
    <HighlightWrapper section="links" activeSection={showSectionHighlight ? "links" : null} className="w-full">
      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={links.map((l) => l.id)} strategy={strategy}>
          <div className={gridClass}>
            {links.map((link, index) => {
              const animClass =
                linkAnimation === "stagger"
                  ? "link-anim-slide-up"
                  : linkAnimation !== "none"
                    ? `link-anim-${linkAnimation}`
                    : "";
              const animDelay =
                linkAnimation === "stagger"
                  ? { animationDelay: `${index * 0.08}s` }
                  : undefined;

              return (
                <SortableLinkItem key={link.id} link={link}>
                  <div
                    className={cn(
                      "transition-all duration-300",
                      linkLayout === "grid-3" ? "rounded-lg" : "rounded-xl",
                      activeLinkId === link.id && "edit-highlight",
                      animClass,
                    )}
                    style={animDelay}
                  >
                    {linkLayout === "grid-3" ? (
                      <Grid3LinkItem link={link} isDefault={isDefault} tint={tint} linkStyle={linkStyle} />
                    ) : linkLayout === "grid-2" ? (
                      <Grid2LinkItem link={link} isDefault={isDefault} tint={tint} linkStyle={linkStyle} />
                    ) : (
                      <ListLinkItem link={link} isDefault={isDefault} tint={tint} linkStyle={linkStyle} />
                    )}
                  </div>
                </SortableLinkItem>
              );
            })}
          </div>
        </SortableContext>
      </DndContext>
    </HighlightWrapper>
  );
}

/* ─── Main component ─── */

interface Props {
  profileData: ProfileData;
  variant: "mobile" | "web";
  onReorderLinks?: (activeId: number, overId: number) => void;
}

const SAMPLE_LINKS: ProfileLink[] = [
  { id: -9001, title: "나의 링크 1", url: "", imageUrl: null, description: null, order: 0, enabled: true },
  { id: -9002, title: "나의 링크 2", url: "", imageUrl: null, description: null, order: 1, enabled: true },
  { id: -9003, title: "나의 링크 3", url: "", imageUrl: null, description: null, order: 2, enabled: true },
];

export function ProfilePreviewContent({ profileData, variant, onReorderLinks }: Props) {
  const { avatarUrl, backgroundUrl, backgroundColor, fontColor, nickname, bio, links, socials, linkLayout, linkStyle, linkAnimation, headerLayout, colorTheme, customSecondaryColor } = profileData;
  const isDefault = colorTheme === "default" || colorTheme === "white";
  const tint = colorTheme === "custom" && customSecondaryColor ? customSecondaryColor : undefined;
  const { activeSection, activeLinkId } = useEditFocus();
  const containerStyle: React.CSSProperties = {
    ...(backgroundColor ? { backgroundColor } : {}),
    ...(fontColor ? { color: fontColor } : {}),
  };
  const hasContainerStyle = backgroundColor || fontColor;

  // 섹션별 플레이스홀더 여부
  const isPlaceholderNickname = !nickname;
  const isPlaceholderBio = !bio;
  const isPlaceholderLinks = links.length === 0;
  const displayNickname = nickname || "닉네임";
  const displayBio = bio || "프로필을 편집해서 꾸며보세요";
  const displayLinks = links.length > 0 ? links : SAMPLE_LINKS;

  if (variant === "mobile") {
    return (
      <div className="flex min-h-full w-full flex-col items-center gap-4 px-4" style={hasContainerStyle ? containerStyle : undefined}>
        {/* Background — shown for center, left, banner-only */}
        {headerLayout !== "avatar-only" && (
          <HighlightWrapper
            section="background"
            activeSection={activeSection}
            overlay
            className={cn(
              "rounded-none -mx-4 w-[calc(100%+2rem)]",
              headerLayout === "banner-only" ? "mb-[-0.7rem]" : "mb-[calc(-2.5rem-1rem)]",
            )}
          >
            {backgroundUrl ? (
              <img src={backgroundUrl} alt="" className="h-32 w-full object-cover" onError={(e) => { e.currentTarget.style.display = "none"; }} />
            ) : (
              <div className="flex h-32 w-full items-center justify-center bg-muted/70">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" className="size-10 text-muted-foreground/20" fill="currentColor">
                  <path d="M216,40H40A16,16,0,0,0,24,56V200a16,16,0,0,0,16,16H216a16,16,0,0,0,16-16V56A16,16,0,0,0,216,40Zm0,16V158.75l-26.07-26.06a16,16,0,0,0-22.63,0l-20,20-44-44a16,16,0,0,0-22.62,0L40,149.37V56ZM40,172l52-52,80,80H40Zm176,28H194.63l-36-36,20-20L216,181.38V200ZM144,100a12,12,0,1,1,12,12A12,12,0,0,1,144,100Z" />
                </svg>
              </div>
            )}
          </HighlightWrapper>
        )}

        {/* Profile header — layout variants */}
        {headerLayout === "left" ? (
          <div className="flex w-full items-start gap-3 pb-2">
            <HighlightWrapper section="avatar" activeSection={activeSection} className={cn("shrink-0 rounded-full", !avatarUrl && "opacity-50")}>
              <Avatar src={avatarUrl} isDefault={isDefault} />
            </HighlightWrapper>
            <div className="min-w-0 flex-1 pt-[45px]">
              <HighlightWrapper section="nickname" activeSection={activeSection}>
                <p className={cn("text-base font-semibold", isPlaceholderNickname && "text-muted-foreground/50")}>{displayNickname}</p>
              </HighlightWrapper>
              <HighlightWrapper section="bio" activeSection={activeSection}>
                <p className={cn("whitespace-pre-line text-sm text-muted-foreground", isPlaceholderBio && "text-muted-foreground/40")}>{displayBio}</p>
              </HighlightWrapper>
            </div>
          </div>
        ) : headerLayout === "avatar-only" ? (
          <div className="flex flex-col items-center gap-2 pb-2 pt-4">
            <HighlightWrapper section="avatar" activeSection={activeSection} className={cn("rounded-full", !avatarUrl && "opacity-50")}>
              <Avatar src={avatarUrl} isDefault={isDefault} />
            </HighlightWrapper>
            <HighlightWrapper section="nickname" activeSection={activeSection} className="px-3">
              <p className={cn("text-base font-semibold", isPlaceholderNickname && "text-muted-foreground/50")}>{displayNickname}</p>
            </HighlightWrapper>
            <HighlightWrapper section="bio" activeSection={activeSection} className="px-3">
              <p className={cn("whitespace-pre-line text-center text-sm text-muted-foreground", isPlaceholderBio && "text-muted-foreground/40")}>{displayBio}</p>
            </HighlightWrapper>
          </div>
        ) : headerLayout === "banner-only" ? (
          <div className="flex flex-col items-center gap-2 pb-2">
            <HighlightWrapper section="nickname" activeSection={activeSection} className="px-3">
              <p className={cn("text-base font-semibold", isPlaceholderNickname && "text-muted-foreground/50")}>{displayNickname}</p>
            </HighlightWrapper>
            <HighlightWrapper section="bio" activeSection={activeSection} className="px-3">
              <p className={cn("whitespace-pre-line text-center text-sm text-muted-foreground", isPlaceholderBio && "text-muted-foreground/40")}>{displayBio}</p>
            </HighlightWrapper>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-2 pb-2">
            <HighlightWrapper section="avatar" activeSection={activeSection} className={cn("rounded-full", !avatarUrl && "opacity-50")}>
              <Avatar src={avatarUrl} isDefault={isDefault} />
            </HighlightWrapper>
            <HighlightWrapper section="nickname" activeSection={activeSection} className="px-3">
              <p className={cn("text-base font-semibold", isPlaceholderNickname && "text-muted-foreground/50")}>{displayNickname}</p>
            </HighlightWrapper>
            <HighlightWrapper section="bio" activeSection={activeSection} className="px-3">
              <p className={cn("whitespace-pre-line text-center text-sm text-muted-foreground", isPlaceholderBio && "text-muted-foreground/40")}>{displayBio}</p>
            </HighlightWrapper>
          </div>
        )}

        {/* Links with DnD */}
        <div className={cn("w-full", isPlaceholderLinks && "opacity-50")}>
          <LinksSection
            links={displayLinks}
            linkLayout={linkLayout}
            linkStyle={linkStyle}
            linkAnimation={linkAnimation}
            activeSection={activeSection}
            activeLinkId={activeLinkId}
            onReorderLinks={isPlaceholderLinks ? undefined : onReorderLinks}
            isDefault={isDefault}
            tint={tint}
          />
        </div>

        {/* Social icons */}
        {socials.length > 0 && (
          <HighlightWrapper section="socials" activeSection={activeSection}>
            <div className="flex flex-wrap justify-center gap-3 pt-2">
              {socials.map((social) => {
                const Icon = SOCIAL_ICONS[social.platform] ?? Globe;
                return (
                  <div key={social.id} className="flex size-9 items-center justify-center rounded-full bg-primary/10" style={tint ? { backgroundColor: tint } : undefined}>
                    <Icon className="size-4.5 text-primary" />
                  </div>
                );
              })}
            </div>
          </HighlightWrapper>
        )}

        {/* Sponsor banner for free plan */}
        <SponsorBanner plan={profileData.plan} className="mt-auto -mx-4 -mb-4 border-t-0 rounded-b-lg" />
      </div>
    );
  }

  // Web variant — sidebar + content grid
  return (
    <div className="flex min-h-full flex-col gap-4" style={hasContainerStyle ? containerStyle : undefined}>
      {/* Background — always rendered */}
      <HighlightWrapper section="background" activeSection={activeSection} overlay className="rounded-none -mx-6 -mt-6">
        {backgroundUrl ? (
          <img src={backgroundUrl} alt="" className="h-36 w-full object-cover" onError={(e) => { e.currentTarget.style.display = "none"; }} />
        ) : (
          <div className="flex h-36 w-full items-center justify-center bg-muted/70">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" className="size-10 text-muted-foreground/20" fill="currentColor">
              <path d="M216,40H40A16,16,0,0,0,24,56V200a16,16,0,0,0,16,16H216a16,16,0,0,0,16-16V56A16,16,0,0,0,216,40Zm0,16V158.75l-26.07-26.06a16,16,0,0,0-22.63,0l-20,20-44-44a16,16,0,0,0-22.62,0L40,149.37V56ZM40,172l52-52,80,80H40Zm176,28H194.63l-36-36,20-20L216,181.38V200ZM144,100a12,12,0,1,1,12,12A12,12,0,0,1,144,100Z" />
            </svg>
          </div>
        )}
      </HighlightWrapper>

      <div className="grid grid-cols-[180px_1fr] gap-6">
        {/* Sidebar */}
        <div className="flex flex-col items-center gap-3 border-r border-border pr-6">
          <HighlightWrapper section="avatar" activeSection={activeSection} className={cn("rounded-full", !avatarUrl && "opacity-50")}>
            <Avatar src={avatarUrl} isDefault={isDefault} />
          </HighlightWrapper>
          <HighlightWrapper section="nickname" activeSection={activeSection} className="px-3">
            <p className={cn("text-sm font-semibold", isPlaceholderNickname && "text-muted-foreground/50")}>{displayNickname}</p>
          </HighlightWrapper>
          <HighlightWrapper section="bio" activeSection={activeSection} className="px-3">
            <p className={cn("whitespace-pre-line text-center text-xs text-muted-foreground", isPlaceholderBio && "text-muted-foreground/40")}>{displayBio}</p>
          </HighlightWrapper>
          {socials.length > 0 && (
            <HighlightWrapper section="socials" activeSection={activeSection}>
              <div className="flex flex-wrap justify-center gap-2 pt-2">
                {socials.map((social) => {
                  const Icon = SOCIAL_ICONS[social.platform] ?? Globe;
                  return (
                    <div key={social.id} className="flex size-8 items-center justify-center rounded-full bg-primary/10" style={tint ? { backgroundColor: tint } : undefined}>
                      <Icon className="size-4 text-primary" />
                    </div>
                  );
                })}
              </div>
            </HighlightWrapper>
          )}
        </div>

        {/* Links area */}
        <div className={cn("w-full", isPlaceholderLinks && "opacity-50")}>
          <LinksSection
            links={displayLinks}
            linkLayout={linkLayout}
            linkStyle={linkStyle}
            linkAnimation={linkAnimation}
            activeSection={activeSection}
            activeLinkId={activeLinkId}
            onReorderLinks={isPlaceholderLinks ? undefined : onReorderLinks}
          />
        </div>
      </div>
    </div>
  );
}
