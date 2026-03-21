"use client";

import { Input } from "@/components/ui/input";
import { ToggleGroup, type ToggleGroupOption } from "@/components/ui/toggle-group";
import { SectionHeader } from "@/components/ui/section-header";
import type { DecoratorType } from "@/lib/profile-types";

const DECORATOR_OPTIONS: ToggleGroupOption<DecoratorType | "none">[] = [
  { value: "none", label: "없음" },
  { value: "text", label: "텍스트" },
  { value: "divider-line", label: "실선" },
  { value: "divider-dots", label: "점선" },
  { value: "divider-wave", label: "웨이브" },
];

interface Props {
  decorator1Type: DecoratorType | null;
  decorator1Text: string | null;
  decorator2Type: DecoratorType | null;
  decorator2Text: string | null;
  setDecorator1: (type: DecoratorType | null, text?: string | null) => void;
  setDecorator1Text: (text: string) => void;
  setDecorator2: (type: DecoratorType | null, text?: string | null) => void;
  setDecorator2Text: (text: string) => void;
}

function DecoratorSlot({
  label,
  type,
  text,
  onTypeChange,
  onTextChange,
}: {
  label: string;
  type: DecoratorType | null;
  text: string | null;
  onTypeChange: (type: DecoratorType | null, text?: string | null) => void;
  onTextChange: (text: string) => void;
}) {
  return (
    <div className="flex flex-col gap-2">
      <p className="text-[11px] text-muted-foreground">{label}</p>
      <ToggleGroup
        variant="square"
        value={type ?? "none"}
        onValueChange={(v: DecoratorType | "none") => onTypeChange(v === "none" ? null : v)}
        options={DECORATOR_OPTIONS}
      />
      {type === "text" && (
        <Input
          placeholder="구분 텍스트 입력 (최대 80자)"
          value={text ?? ""}
          onChange={(e) => onTextChange(e.target.value.slice(0, 80))}
          maxLength={80}
          className="h-8 text-xs"
        />
      )}
    </div>
  );
}

export function DecoratorEditor({
  decorator1Type, decorator1Text, decorator2Type, decorator2Text,
  setDecorator1, setDecorator1Text, setDecorator2, setDecorator2Text,
}: Props) {
  return (
    <section className="flex flex-col gap-4">
      <SectionHeader title="구분선" />
      <DecoratorSlot
        label="헤더 ↔ 링크 사이"
        type={decorator1Type}
        text={decorator1Text}
        onTypeChange={setDecorator1}
        onTextChange={setDecorator1Text}
      />
      <DecoratorSlot
        label="링크 ↔ 소셜 사이"
        type={decorator2Type}
        text={decorator2Text}
        onTypeChange={setDecorator2}
        onTextChange={setDecorator2Text}
      />
    </section>
  );
}
