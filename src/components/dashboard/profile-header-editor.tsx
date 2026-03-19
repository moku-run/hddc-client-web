"use client";

import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { UserCircle, Camera, Image as ImageIcon } from "@phosphor-icons/react";
import { RemoveButton } from "@/components/ui/remove-button";
import { SectionHeader } from "@/components/ui/section-header";
import { InputWithCounter } from "@/components/ui/input-with-counter";
import { ImageCropModal } from "./image-crop-modal";
import { validateSlug } from "@/lib/validators";
import { useSectionFocus } from "@/contexts/edit-focus-context";
import type { ProfileData, HeaderLayout } from "@/lib/profile-types";
import { cn, dataUrlToFile } from "@/lib/utils";
import { uploadImage } from "@/lib/api";
import { toast } from "sonner";

interface Props {
  profileData: ProfileData;
  updateProfile: (fields: Partial<Pick<ProfileData, "avatarUrl" | "backgroundUrl" | "slug" | "nickname" | "bio">>) => void;
  headerLayout: HeaderLayout;
  setHeaderLayout: (layout: HeaderLayout) => void;
}

export function ProfileHeaderEditor({ profileData, updateProfile, headerLayout, setHeaderLayout }: Props) {
  const [cropOpen, setCropOpen] = useState<"avatar" | "background" | null>(null);
  const slugFocus = useSectionFocus("slug");
  const bgFocus = useSectionFocus("background");
  const avatarFocus = useSectionFocus("avatar");
  const nicknameFocus = useSectionFocus("nickname");
  const bioFocus = useSectionFocus("bio");

  return (
    <section className="flex flex-col gap-4">
      <SectionHeader title="프로필" />

      {/* Header layout selector — visual mini previews */}
      <div>
        <span className="mb-2 block text-[11px] text-muted-foreground">배치</span>
        <div className="grid grid-cols-4 gap-2">
          {/* 1. Center — 배경 + 아바타 중앙 */}
          <button
            onClick={() => setHeaderLayout("center")}
            className={cn(
              "group cursor-pointer overflow-hidden rounded-lg border-2 transition-all",
              headerLayout === "center"
                ? "border-foreground"
                : "border-border hover:border-muted-foreground/50",
            )}
          >
            <div className="-mx-[2px] -mt-[2px] flex h-8 w-[calc(100%+4px)] items-center justify-center rounded-t-md bg-muted-foreground/10">
              <ImageIcon className="size-3 text-muted-foreground/25" />
            </div>
            <div className="flex flex-col items-center bg-background pb-2">
              <div className="relative z-10 -mt-3 size-6 rounded-full border-2 border-background bg-muted" />
              <div className="mt-1 h-1 w-8 rounded-full bg-muted-foreground/15" />
              <div className="mt-0.5 h-1 w-5 rounded-full bg-muted-foreground/10" />
            </div>
          </button>

          {/* 2. Left — 배경 + 아바타 좌측 */}
          <button
            onClick={() => setHeaderLayout("left")}
            className={cn(
              "group cursor-pointer overflow-hidden rounded-lg border-2 transition-all",
              headerLayout === "left"
                ? "border-foreground"
                : "border-border hover:border-muted-foreground/50",
            )}
          >
            <div className="-mx-[2px] -mt-[2px] flex h-8 w-[calc(100%+4px)] items-center justify-center rounded-t-md bg-muted-foreground/10">
              <ImageIcon className="size-3 text-muted-foreground/25" />
            </div>
            <div className="flex items-start gap-1.5 bg-background px-2 pb-2">
              <div className="relative z-10 -mt-3 size-6 shrink-0 rounded-full border-2 border-background bg-muted" />
              <div className="flex flex-col gap-1 pt-1.5">
                <div className="h-1 w-7 rounded-full bg-muted-foreground/15" />
                <div className="h-1 w-5 rounded-full bg-muted-foreground/10" />
              </div>
            </div>
          </button>

          {/* 3. Avatar-only — 배경 없이 아바타 + 텍스트만 */}
          <button
            onClick={() => setHeaderLayout("avatar-only")}
            className={cn(
              "group cursor-pointer overflow-hidden rounded-lg border-2 transition-all",
              headerLayout === "avatar-only"
                ? "border-foreground"
                : "border-border hover:border-muted-foreground/50",
            )}
          >
            <div className="flex flex-col items-center gap-1 bg-background px-2 pb-2 pt-3">
              <div className="size-7 rounded-full bg-muted-foreground/20" />
              <div className="h-1 w-8 rounded-full bg-muted-foreground/15" />
              <div className="h-1 w-5 rounded-full bg-muted-foreground/10" />
            </div>
          </button>

          {/* 4. Banner-only — 배경만 크게, 아바타 없음 */}
          <button
            onClick={() => setHeaderLayout("banner-only")}
            className={cn(
              "group cursor-pointer overflow-hidden rounded-lg border-2 transition-all",
              headerLayout === "banner-only"
                ? "border-foreground"
                : "border-border hover:border-muted-foreground/50",
            )}
          >
            <div className="-mx-[2px] -mt-[2px] flex h-10 w-[calc(100%+4px)] items-center justify-center rounded-t-md bg-muted-foreground/10">
              <ImageIcon className="size-4 text-muted-foreground/25" />
            </div>
            <div className="flex flex-col items-center gap-1 bg-background px-2 pb-2 pt-1.5">
              <div className="h-1 w-8 rounded-full bg-muted-foreground/15" />
              <div className="h-1 w-5 rounded-full bg-muted-foreground/10" />
            </div>
          </button>
        </div>
      </div>

      {/* Slug — top (matches mobile visual order: URL bar first) */}
      <div {...slugFocus}>
        <Label className="text-xs text-muted-foreground">프로필 링크</Label>
        <div className="mt-1 flex h-8 items-center overflow-hidden rounded-md border border-input text-sm">
          <span className="flex h-full shrink-0 items-center bg-muted px-3 text-xs text-muted-foreground">
            hotdeal.cool/
          </span>
          <input
            value={profileData.slug}
            onChange={(e) =>
              updateProfile({
                slug: e.target.value
                  .replace(/[^a-zA-Z0-9-_]/g, "")
                  .slice(0, 30),
              })
            }
            placeholder="yourname"
            className="h-full flex-1 bg-transparent px-2 text-sm outline-none placeholder:text-muted-foreground"
            maxLength={30}
          />
        </div>
        <div className="mt-1 flex items-center justify-between">
          {profileData.slug && validateSlug(profileData.slug) ? (
            <p className="text-[10px] text-destructive">
              {validateSlug(profileData.slug)}
            </p>
          ) : (
            <p className="text-[10px] text-muted-foreground">
              영문 대소문자, 숫자, 하이픈(-), 언더바(_) 조합 · 슬래시(/) 사용 불가
            </p>
          )}
          <p className="text-[10px] text-muted-foreground">
            {profileData.slug.length}/30
          </p>
        </div>
      </div>

      {/* Background upload */}
      <div {...bgFocus}>
        <div className="flex items-center justify-between">
          <Label className="text-xs text-muted-foreground">배경 사진</Label>
          {profileData.backgroundUrl && (
            <RemoveButton
              label="배경 제거"
              onClick={(e) => { e.stopPropagation(); updateProfile({ backgroundUrl: null }); }}
            />
          )}
        </div>
        <div
          className="group relative mt-1 cursor-pointer overflow-hidden rounded-lg border border-dashed border-border"
          onClick={() => setCropOpen("background")}
        >
          {profileData.backgroundUrl ? (
            <img
              src={profileData.backgroundUrl}
              alt=""
              className="h-28 w-full object-cover"
              onError={() => updateProfile({ backgroundUrl: null })}
            />
          ) : (
            <div className="flex h-28 w-full flex-col items-center justify-center gap-1.5 bg-muted/30">
              <ImageIcon className="size-8 text-muted-foreground/50" weight="duotone" />
              <span className="text-[11px] text-muted-foreground">클릭하여 배경 사진 업로드</span>
            </div>
          )}
          <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition-opacity group-hover:opacity-100">
            <Camera className="size-6 text-white" weight="fill" />
          </div>
        </div>
      </div>

      {/* Avatar upload — consistent style with background */}
      <div {...avatarFocus}>
        <div className="flex items-center justify-between">
          <Label className="text-xs text-muted-foreground">프로필 사진</Label>
          {profileData.avatarUrl && (
            <RemoveButton
              label="사진 제거"
              onClick={(e) => { e.stopPropagation(); updateProfile({ avatarUrl: null }); }}
            />
          )}
        </div>
        <div
          className="group relative mt-1 flex h-20 cursor-pointer items-center justify-center overflow-hidden rounded-lg border border-dashed border-border bg-muted/30"
          onClick={() => setCropOpen("avatar")}
        >
          {profileData.avatarUrl ? (
            <img
              src={profileData.avatarUrl}
              alt=""
              className="size-14 rounded-full border border-border object-cover"
              onError={() => updateProfile({ avatarUrl: null })}
            />
          ) : (
            <div className="flex flex-col items-center gap-1.5">
              <UserCircle className="size-8 text-muted-foreground/50" weight="duotone" />
              <span className="text-[11px] text-muted-foreground">클릭하여 프로필 사진 업로드</span>
            </div>
          )}
          <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition-opacity group-hover:opacity-100">
            <Camera className="size-6 text-white" weight="fill" />
          </div>
        </div>
      </div>

      {/* Crop modals */}
      <ImageCropModal
        open={cropOpen === "avatar"}
        variant="circle"
        initialSrc={profileData.avatarUrl}
        onApply={async (dataUrl) => {
          setCropOpen(null);
          try {
            const file = dataUrlToFile(dataUrl, "avatar.jpg");
            const url = await uploadImage(file, "avatars");
            updateProfile({ avatarUrl: url });
          } catch { toast.error("아바타 업로드에 실패했습니다"); }
        }}
        onCancel={() => setCropOpen(null)}
        onRemove={() => { updateProfile({ avatarUrl: null }); setCropOpen(null); }}
      />
      <ImageCropModal
        open={cropOpen === "background"}
        variant="banner"
        initialSrc={profileData.backgroundUrl}
        onApply={async (dataUrl) => {
          setCropOpen(null);
          try {
            const file = dataUrlToFile(dataUrl, "background.jpg");
            const url = await uploadImage(file, "backgrounds");
            updateProfile({ backgroundUrl: url });
          } catch { toast.error("배경 이미지 업로드에 실패했습니다"); }
        }}
        onCancel={() => setCropOpen(null)}
        onRemove={() => { updateProfile({ backgroundUrl: null }); setCropOpen(null); }}
      />

      {/* Nickname */}
      <div {...nicknameFocus}>
        <Label htmlFor="nickname" className="text-xs text-muted-foreground">닉네임</Label>
        <InputWithCounter
          id="nickname"
          placeholder="닉네임을 입력해주세요."
          value={profileData.nickname}
          onChange={(val) => updateProfile({ nickname: val })}
          maxLength={20}
          className="mt-1 h-8"
        />
      </div>

      {/* Bio — textarea, max 80 chars, max 3 lines */}
      <div {...bioFocus}>
        <Label htmlFor="bio" className="text-xs text-muted-foreground">한 줄 소개</Label>
        <textarea
          id="bio"
          placeholder="한 줄 소개를 입력하세요"
          value={profileData.bio}
          onChange={(e) => {
            let val = e.target.value;
            const lines = val.split("\n");
            if (lines.length > 3) val = lines.slice(0, 3).join("\n");
            val = val.slice(0, 80);
            updateProfile({ bio: val });
          }}
          rows={3}
          className="mt-1 w-full resize-none rounded-md border border-input bg-transparent px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-ring placeholder:text-muted-foreground"
          maxLength={80}
        />
        <p className="mt-1 text-right text-[10px] text-muted-foreground">
          {profileData.bio.length}/80
        </p>
      </div>
    </section>
  );
}
