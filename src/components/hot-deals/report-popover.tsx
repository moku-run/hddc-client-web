"use client";

import { useState } from "react";
import { Flag } from "@phosphor-icons/react";
import { toast } from "sonner";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

const REPORT_REASONS = [
  "스팸/광고",
  "허위 정보",
  "비속어/욕설",
  "음란/선정적",
  "개인정보 노출",
  "기타",
] as const;

interface ReportPopoverProps {
  /** "deal" or "comment" — used in toast message */
  targetType: "deal" | "comment";
  children?: React.ReactNode;
}

export function ReportPopover({ targetType, children }: ReportPopoverProps) {
  const [open, setOpen] = useState(false);

  function handleReport(reason: string) {
    // TODO: call backend API
    setOpen(false);
    const label = targetType === "deal" ? "게시글" : "댓글";
    toast.success("신고가 접수되었습니다", {
      description: `${label} 신고 사유: ${reason}`,
    });
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        {children ?? (
          <button className="flex cursor-pointer items-center gap-1 text-[10px] text-muted-foreground/60 transition-colors hover:text-red-500">
            <Flag className="size-3" />
            <span>신고</span>
          </button>
        )}
      </PopoverTrigger>
      <PopoverContent align="start" className="w-48 p-1.5">
        <p className="px-2 py-1.5 text-[11px] font-semibold text-foreground">
          신고 사유 선택
        </p>
        <div className="flex flex-col">
          {REPORT_REASONS.map((reason) => (
            <button
              key={reason}
              onClick={() => handleReport(reason)}
              className="cursor-pointer rounded-md px-2 py-1.5 text-left text-[11px] text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            >
              {reason}
            </button>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
}
