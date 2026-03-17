"use client";

import { useState, useEffect } from "react";
import { HexColorPicker, HexColorInput } from "react-colorful";
import { Palette } from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

interface ColorPickerPopoverProps {
  color: string;
  onChange: (color: string) => void;
  triggerLabel?: string;
  triggerIcon?: React.ReactNode;
  width?: string;
  align?: "start" | "center" | "end";
  triggerClassName?: string;
}

export function ColorPickerPopover({
  color,
  onChange,
  triggerLabel = "직접 선택",
  triggerIcon,
  width = "240px",
  align = "start",
  triggerClassName,
}: ColorPickerPopoverProps) {
  const [open, setOpen] = useState(false);
  const [tempColor, setTempColor] = useState(color);

  useEffect(() => {
    if (open) setTempColor(color);
  }, [open, color]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            "mt-2 w-full justify-center gap-1.5 text-xs font-medium",
            triggerClassName,
          )}
        >
          {triggerIcon ?? <Palette className="size-4" />}
          {triggerLabel}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="p-3" align={align} style={{ width }}>
        <div className="flex flex-col items-center gap-3">
          <HexColorPicker
            color={tempColor}
            onChange={setTempColor}
            style={{ width: "100%", height: "160px" }}
          />
          <div className="flex w-full items-center gap-2">
            <div
              className="size-8 shrink-0 rounded-lg border border-border"
              style={{ backgroundColor: tempColor }}
            />
            <div className="flex items-center gap-1 rounded-md border border-input px-2 py-1 text-sm">
              <span className="text-muted-foreground">#</span>
              <HexColorInput
                color={tempColor}
                onChange={setTempColor}
                className="w-[5.5rem] bg-transparent uppercase outline-none"
                prefixed={false}
              />
            </div>
          </div>
          <Button
            size="sm"
            className="w-full"
            onClick={() => {
              onChange(tempColor);
              setOpen(false);
            }}
          >
            적용
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
