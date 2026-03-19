"use client";

import { useState, useEffect, useRef } from "react";
import { useProfileData } from "@/hooks/use-profile-data";
import { ProfileEditor } from "@/components/dashboard/profile-editor";
import { ProfilePreview } from "@/components/dashboard/profile-preview";
import { MobilePreviewButton } from "@/components/dashboard/mobile-preview-overlay";
import { EditFocusProvider } from "@/contexts/edit-focus-context";
import { Button } from "@/components/ui/button";
import {
  FloppyDisk, Check, CircleNotch, Link as LinkIcon,
  ArrowCounterClockwise, ArrowClockwise, Trash,
} from "@phosphor-icons/react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://hotdeal.cool";

export default function ProfileEditPage() {
  const profile = useProfileData();
  const [confirmResetOpen, setConfirmResetOpen] = useState(false);

  const undoRef = useRef(profile.undoProfile);
  const redoRef = useRef(profile.redoProfile);
  useEffect(() => { undoRef.current = profile.undoProfile; }, [profile.undoProfile]);
  useEffect(() => { redoRef.current = profile.redoProfile; }, [profile.redoProfile]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "z") {
        e.preventDefault();
        if (e.shiftKey) redoRef.current();
        else undoRef.current();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  if (!profile.isHydrated || profile.loadStatus === "loading") {
    return (
      <div className="mx-auto w-full max-w-6xl px-4 py-6 sm:px-6">
        <div className="flex gap-4">
          <div className="hidden lg:block"><div className="w-10" /></div>
          <div className="min-w-0 lg:w-2/5">
            <div className="mb-4 h-8" />
            <div className="h-[600px] animate-pulse rounded-xl border border-border bg-muted/30" />
          </div>
          <div className="hidden lg:block lg:flex-1">
            <div className="mb-4 h-8" />
            <div className="h-[600px] animate-pulse rounded-xl border border-border bg-muted/30" />
          </div>
        </div>
      </div>
    );
  }

  if (profile.loadStatus === "error") {
    return (
      <div className="mx-auto flex w-full max-w-6xl flex-col items-center justify-center gap-4 px-4 py-24 sm:px-6">
        <p className="text-sm text-muted-foreground">프로필을 불러오지 못했습니다.</p>
        <Button variant="outline" size="sm" onClick={() => window.location.reload()}>
          다시 시도
        </Button>
      </div>
    );
  }

  return (
    <EditFocusProvider>
      <div className="mx-auto w-full max-w-6xl px-4 py-6 sm:px-6">
        <div className="flex gap-4">
          {/* Sticky Sidebar — edit tools */}
          <div className="hidden lg:block">
            <div className="sticky top-[50vh] -translate-y-1/2 flex flex-col items-center gap-1 rounded-xl border border-border bg-card p-1.5 shadow-sm">
              <SidebarButton
                icon={<ArrowCounterClockwise className="size-4" />}
                label="되돌리기"
                onClick={profile.undoProfile}
                disabled={!profile.canUndo}
              />
              <SidebarButton
                icon={<ArrowClockwise className="size-4" />}
                label="다시 실행"
                onClick={profile.redoProfile}
                disabled={!profile.canRedo}
              />
              <div className="my-1 h-px w-full bg-border" />
              <SidebarButton
                icon={<Trash className="size-4" />}
                label="초기화"
                onClick={() => setConfirmResetOpen(true)}
                variant="destructive"
              />
            </div>
          </div>

          {/* Center: Editor Column */}
          <div className="min-w-0 lg:w-2/5">
            <div className="mb-4 flex h-8 items-center gap-3">
              <h1 className="text-lg font-semibold">프로필 편집</h1>
            </div>
            <div className="rounded-xl border border-border bg-card shadow-sm">
              <ProfileEditor {...profile} />
            </div>
          </div>

          {/* Right: Preview Column — sticky */}
          <div className="hidden lg:block lg:flex-1">
            <div className="sticky top-6">
              <div className="mb-4 flex h-8 items-center justify-end gap-2">
                <span className="text-xs text-muted-foreground">
                  {profile.saveStatus === "saving" && (
                    <span className="inline-flex items-center gap-1">
                      <CircleNotch className="size-3 animate-spin" />
                      저장 중...
                    </span>
                  )}
                  {profile.saveStatus === "saved" && (
                    <span className="inline-flex items-center gap-1 text-primary">
                      <Check className="size-3" />
                      저장됨
                    </span>
                  )}
                  {profile.saveStatus === "error" && (
                    <span className="inline-flex items-center gap-1 text-destructive">
                      저장 실패
                    </span>
                  )}
                </span>
                <MobilePreviewButton profileData={profile.profileData} />
                <Button
                  variant="outline"
                  size="sm"
                  className="h-8 text-xs"
                  onClick={() => {
                    const url = `${SITE_URL}/${profile.profileData.slug || "yourname"}`;
                    navigator.clipboard.writeText(url);
                    toast.success("링크가 복사되었습니다", { description: url });
                  }}
                  disabled={!profile.profileData.slug}
                >
                  <LinkIcon className="mr-1 size-3.5" />
                  공유
                </Button>
                <Button
                  size="sm"
                  onClick={profile.saveNow}
                  className="h-8 text-xs"
                >
                  <FloppyDisk className="mr-1 size-3.5" />
                  저장
                </Button>
              </div>
              <div className="h-[calc(100vh-11rem)] max-h-[720px] rounded-xl border border-border bg-card shadow-sm">
                <ProfilePreview
                  profileData={profile.profileData}
                  reorderLinks={profile.reorderLinks}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      <ConfirmDialog
        open={confirmResetOpen}
        onOpenChange={setConfirmResetOpen}
        title="프로필 초기화"
        description="모든 프로필 데이터가 삭제됩니다. 초기화하시겠습니까?"
        onConfirm={() => {
          profile.resetProfile();
          setConfirmResetOpen(false);
        }}
        confirmLabel="초기화"
        variant="destructive"
      />
    </EditFocusProvider>
  );
}

function SidebarButton({
  icon,
  label,
  onClick,
  disabled,
  variant,
}: {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
  disabled?: boolean;
  variant?: "destructive";
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      title={label}
      className={cn(
        "flex size-8 cursor-pointer items-center justify-center rounded-lg transition-colors disabled:cursor-not-allowed disabled:opacity-30",
        variant === "destructive"
          ? "text-destructive hover:bg-destructive/10"
          : "text-muted-foreground hover:bg-muted hover:text-foreground",
      )}
    >
      {icon}
    </button>
  );
}
