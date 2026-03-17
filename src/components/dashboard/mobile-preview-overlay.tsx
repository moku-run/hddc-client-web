"use client";

import { useState } from "react";
import { X, Eye } from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";
import { ProfilePreviewContent } from "./profile-preview-content";
import type { ProfileData } from "@/lib/profile-types";

interface Props {
  profileData: ProfileData;
}

export function MobilePreviewButton({ profileData }: Props) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button
        variant="outline"
        size="sm"
        className="lg:hidden"
        onClick={() => setOpen(true)}
      >
        <Eye className="mr-1 size-4" />
        미리보기
      </Button>

      {open && (
        <div className="fixed inset-0 z-50 flex flex-col bg-background">
          <div className="flex items-center justify-between border-b border-border px-4 py-3">
            <span className="text-sm font-semibold">미리보기</span>
            <Button variant="ghost" size="icon-sm" onClick={() => setOpen(false)}>
              <X className="size-4" />
            </Button>
          </div>
          <div className="flex-1 overflow-auto p-5">
            <ProfilePreviewContent profileData={profileData} variant="mobile" />
          </div>
        </div>
      )}
    </>
  );
}
