"use client";

import { useState } from "react";
import { Flag } from "@phosphor-icons/react";
import { toast } from "sonner";
import { reportDeal, reportComment } from "@/lib/hot-deal-api";
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
  targetType: "deal" | "comment";
  dealId: number;
  commentId?: number;
  children?: React.ReactNode;
}

export function ReportPopover({ targetType, dealId, commentId, children }: ReportPopoverProps) {
  const [open, setOpen] = useState(false);
  const [customMode, setCustomMode] = useState(false);
  const [customReason, setCustomReason] = useState("");

  async function handleReport(reason: string) {
    setOpen(false);
    setCustomMode(false);
    setCustomReason("");
    const isLoggedIn = typeof window !== "undefined" && !!localStorage.getItem("hddc-auth");
    if (!isLoggedIn) {
      toast.error("로그인이 필요합니다");
      return;
    }

    try {
      if (targetType === "comment" && commentId != null) {
        await reportComment(dealId, commentId, reason);
      } else {
        await reportDeal(dealId, reason);
      }
      const label = targetType === "deal" ? "게시글" : "댓글";
      toast.success("신고가 접수되었습니다", {
        description: `${label} 신고 사유: ${reason}`,
      });
    } catch {
      toast.error("신고 접수에 실패했습니다");
    }
  }

  function handleOpenChange(v: boolean) {
    setOpen(v);
    if (!v) { setCustomMode(false); setCustomReason(""); }
  }

  return (
    <Popover open={open} onOpenChange={handleOpenChange}>
      <PopoverTrigger asChild>
        {children ?? (
          <button className="flex cursor-pointer items-center gap-1 text-[10px] text-muted-foreground/60 transition-colors hover:text-red-500">
            <Flag className="size-3" />
            <span>신고</span>
          </button>
        )}
      </PopoverTrigger>
      <PopoverContent align="start" className={customMode ? "w-64 p-1.5" : "w-48 p-1.5"}>
        {!customMode ? (
          <>
            <p className="px-2 py-1.5 text-[11px] font-semibold text-foreground">
              신고 사유 선택
            </p>
            <div className="flex flex-col">
              {REPORT_REASONS.map((reason) => (
                <button
                  key={reason}
                  onClick={() => reason === "기타" ? setCustomMode(true) : handleReport(reason)}
                  className="cursor-pointer rounded-md px-2 py-1.5 text-left text-[11px] text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                >
                  {reason}
                </button>
              ))}
            </div>
          </>
        ) : (
          <div className="flex flex-col gap-2 p-1">
            <p className="text-[11px] font-semibold text-foreground">신고 사유 입력</p>
            <textarea
              value={customReason}
              onChange={(e) => setCustomReason(e.target.value)}
              placeholder="신고 사유를 입력해주세요"
              maxLength={100}
              rows={3}
              autoFocus
              className="resize-none rounded-md border border-input bg-transparent px-2 py-1.5 text-[11px] outline-none scrollbar-none placeholder:text-muted-foreground focus:border-primary focus:ring-1 focus:ring-primary/30"
            />
            <div className="flex items-center justify-between">
              <span className="text-[9px] text-muted-foreground">{customReason.length}/100</span>
              <div className="flex items-center gap-1.5">
                <button onClick={() => setCustomMode(false)} className="cursor-pointer rounded-md px-2 py-0.5 text-[10px] font-medium text-muted-foreground hover:text-foreground">취소</button>
                <button
                  onClick={() => { if (customReason.trim()) handleReport(customReason.trim()); }}
                  disabled={!customReason.trim()}
                  className="cursor-pointer rounded-md bg-destructive px-2 py-0.5 text-[10px] font-medium text-white hover:bg-destructive/80 disabled:opacity-40"
                >
                  신고
                </button>
              </div>
            </div>
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
}
