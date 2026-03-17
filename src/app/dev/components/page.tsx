"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";
import { ToggleGroup, type ToggleGroupOption } from "@/components/ui/toggle-group";
import { ColorPickerPopover } from "@/components/ui/color-picker-popover";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { RemoveButton } from "@/components/ui/remove-button";
import { ColorSwatch } from "@/components/ui/color-swatch";
import { SectionHeader } from "@/components/ui/section-header";
import { InputWithCounter } from "@/components/ui/input-with-counter";
import { DragHandle } from "@/components/ui/drag-handle";
import {
  Sun, Moon, List, GridFour, SquaresFour, Trash, Plus, Eye,
  ArrowLeft, ArrowRight, FloppyDisk, LinkSimple, Heart, Star,
  PencilSimple, Check, X, Warning, DeviceMobile, Desktop,
  Palette, EnvelopeSimple, SignOut,
} from "@phosphor-icons/react";
import { cn } from "@/lib/utils";

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="flex flex-col gap-4">
      <h2 className="border-b border-border pb-2 text-base font-bold tracking-tight">{title}</h2>
      {children}
    </section>
  );
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-2">
      <span className="text-[11px] font-medium uppercase tracking-widest text-muted-foreground">{label}</span>
      <div className="flex flex-wrap items-center gap-2">{children}</div>
    </div>
  );
}

export default function ComponentShowcasePage() {
  const [toggleVal, setToggleVal] = useState<"list" | "grid-2" | "grid-3">("list");
  const [viewToggle, setViewToggle] = useState<"mobile" | "web">("mobile");
  const [darkToggle, setDarkToggle] = useState<"light" | "dark">("light");
  const [fontToggle, setFontToggle] = useState("pretendard");
  const [switchOn, setSwitchOn] = useState(true);
  const [checkOn, setCheckOn] = useState(true);
  const [color, setColor] = useState("#3b82f6");
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [swatchSel, setSwatchSel] = useState(0);

  const layoutOptions: ToggleGroupOption<"list" | "grid-2" | "grid-3">[] = [
    { value: "list", label: "리스트", icon: List },
    { value: "grid-2", label: "2열", icon: GridFour },
    { value: "grid-3", label: "3열", icon: SquaresFour },
  ];

  const styleOptions: ToggleGroupOption<string>[] = [
    { value: "fill", label: "채움" },
    { value: "outline", label: "아웃라인" },
    { value: "shadow", label: "그림자" },
    { value: "rounded", label: "라운드" },
    { value: "pill", label: "캡슐" },
  ];

  const swatchColors = [
    "oklch(0.205 0 0)", "oklch(0.6 0.118 184.704)", "oklch(0.553 0.195 38.402)",
    "oklch(0.5 0.134 242.749)", "oklch(0.491 0.27 292.581)", "oklch(0.852 0.199 91.936)",
    "oklch(0.505 0.213 27.518)", "oklch(0.985 0 0)",
  ];

  return (
    <div className="mx-auto max-w-3xl px-6 py-10">
      <div className="mb-10">
        <h1 className="text-2xl font-bold tracking-tight">Component Showcase</h1>
        <p className="mt-1 text-sm text-muted-foreground">Phase A 표준화 결과 — 모든 UI 컴포넌트 일람</p>
      </div>

      <div className="flex flex-col gap-10">

        {/* ─── Buttons ─── */}
        <Section title="Button">
          <Row label="Variant">
            <Button variant="default">Default</Button>
            <Button variant="outline">Outline</Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="ghost">Ghost</Button>
            <Button variant="destructive">Destructive</Button>
            <Button variant="link">Link</Button>
          </Row>
          <Row label="Size">
            <Button size="xs">XS</Button>
            <Button size="sm">SM</Button>
            <Button size="default">Default</Button>
            <Button size="lg">LG</Button>
          </Row>
          <Row label="Icon">
            <Button size="icon-xs"><Heart className="size-3" /></Button>
            <Button size="icon-sm"><Star className="size-3.5" /></Button>
            <Button size="icon"><PencilSimple /></Button>
            <Button size="icon-lg"><Trash /></Button>
          </Row>
          <Row label="With Icon + Text">
            <Button><FloppyDisk className="mr-1" />저장</Button>
            <Button variant="outline"><LinkSimple className="mr-1" />공유</Button>
            <Button variant="ghost"><SignOut className="mr-1" />로그아웃</Button>
            <Button variant="destructive"><Trash className="mr-1" />삭제</Button>
          </Row>
          <Row label="Active (selected state)">
            <Button variant="ghost" aria-expanded>Active Ghost</Button>
            <Button variant="ghost">Inactive Ghost</Button>
            <Button variant="outline" aria-expanded>Active Outline</Button>
            <Button variant="outline">Inactive Outline</Button>
          </Row>
          <Row label="Disabled">
            <Button disabled>Disabled</Button>
            <Button variant="outline" disabled>Disabled</Button>
          </Row>
        </Section>

        {/* ─── ToggleGroup ─── */}
        <Section title="ToggleGroup">
          <Row label="Pill (default)">
            <ToggleGroup
              variant="pill"
              value={viewToggle}
              onValueChange={setViewToggle}
              options={[
                { value: "mobile" as const, label: "Mobile", icon: DeviceMobile },
                { value: "web" as const, label: "Web", icon: Desktop },
              ]}
            />
          </Row>
          <Row label="Pill SM">
            <ToggleGroup
              variant="pill"
              size="sm"
              value={viewToggle}
              onValueChange={setViewToggle}
              options={[
                { value: "mobile" as const, label: "Mobile", icon: DeviceMobile },
                { value: "web" as const, label: "Web", icon: Desktop },
              ]}
            />
          </Row>
          <Row label="Square (editor)">
            <ToggleGroup variant="square" value={toggleVal} onValueChange={setToggleVal} options={layoutOptions} />
          </Row>
          <Row label="Square — text only">
            <ToggleGroup variant="square" value="fill" onValueChange={() => {}} options={styleOptions} />
          </Row>
          <Row label="renderItem (light/dark)">
            <ToggleGroup
              variant="pill"
              value={darkToggle}
              onValueChange={setDarkToggle}
              options={[
                { value: "light" as const, label: "Light", icon: Sun },
                { value: "dark" as const, label: "Dark", icon: Moon },
              ]}
              renderItem={(option, isActive) => {
                const IconComp = option.icon!;
                return (
                  <div className={cn(
                    "inline-flex items-center gap-1.5 rounded-full px-4 py-1.5 text-sm font-medium transition-all",
                    isActive ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground",
                  )}>
                    <IconComp className="size-4" />
                    {option.label}
                  </div>
                );
              }}
            />
          </Row>
          <Row label="renderItem (font grid)">
            <ToggleGroup
              variant="square"
              value={fontToggle}
              onValueChange={setFontToggle}
              options={[
                { value: "pretendard", label: "Pretendard" },
                { value: "noto-sans", label: "Noto Sans KR" },
                { value: "nanum-gothic", label: "나눔고딕" },
                { value: "nanum-myeongjo", label: "나눔명조" },
              ]}
              className="grid grid-cols-2 gap-1.5"
              renderItem={(option, isActive) => (
                <div className={cn(
                  "flex w-full flex-col rounded-lg px-3 py-2 text-left transition-all",
                  isActive ? "bg-muted ring-2 ring-foreground ring-offset-2 ring-offset-background" : "hover:bg-muted/50",
                )}>
                  <span className="text-xs font-medium">{option.label}</span>
                  <span className="mt-0.5 block text-[10px] text-muted-foreground">가나다 ABC 123</span>
                </div>
              )}
            />
          </Row>
        </Section>

        {/* ─── ColorSwatch ─── */}
        <Section title="ColorSwatch">
          <Row label="Theme Presets">
            <div className="flex gap-2">
              {swatchColors.map((c, i) => (
                <ColorSwatch
                  key={c}
                  color={c}
                  selected={swatchSel === i}
                  bordered={i === 0 || i === 7}
                  onClick={() => setSwatchSel(i)}
                />
              ))}
            </div>
          </Row>
          <Row label="Small">
            <div className="flex gap-1.5">
              {swatchColors.slice(0, 4).map((c, i) => (
                <ColorSwatch key={c} color={c} size="sm" selected={i === 0} onClick={() => {}} />
              ))}
            </div>
          </Row>
        </Section>

        {/* ─── ColorPickerPopover ─── */}
        <Section title="ColorPickerPopover">
          <Row label="Default">
            <div className="w-60">
              <div className="mb-1 flex items-center gap-2">
                <div className="size-6 rounded-md border border-border" style={{ backgroundColor: color }} />
                <span className="text-xs text-muted-foreground">{color}</span>
              </div>
              <ColorPickerPopover color={color} onChange={setColor} />
            </div>
          </Row>
          <Row label="Custom Label">
            <div className="w-60">
              <ColorPickerPopover color="#10b981" onChange={() => {}} triggerLabel="배경색 선택" />
            </div>
          </Row>
        </Section>

        {/* ─── RemoveButton ─── */}
        <Section title="RemoveButton">
          <Row label="Variants">
            <RemoveButton label="사진 제거" onClick={() => {}} />
            <RemoveButton label="배경 제거" onClick={() => {}} />
            <RemoveButton label="초기화" onClick={() => {}} />
          </Row>
        </Section>

        {/* ─── ConfirmDialog ─── */}
        <Section title="ConfirmDialog">
          <Row label="Destructive">
            <Button variant="destructive" onClick={() => setConfirmOpen(true)}>
              <Warning className="mr-1" />
              프로필 초기화
            </Button>
            <ConfirmDialog
              open={confirmOpen}
              onOpenChange={setConfirmOpen}
              title="프로필 초기화"
              description="모든 프로필 데이터가 삭제됩니다. 초기화하시겠습니까?"
              onConfirm={() => setConfirmOpen(false)}
              confirmLabel="초기화"
              variant="destructive"
            />
          </Row>
        </Section>

        {/* ─── Phase B: SectionHeader ─── */}
        <Section title="SectionHeader (Phase B)">
          <Row label="Title only">
            <SectionHeader title="프로필" />
          </Row>
          <Row label="With badge">
            <SectionHeader title="링크" badge="3/20" />
          </Row>
          <Row label="With badge">
            <SectionHeader title="소셜 아이콘" badge="5/8" />
          </Row>
        </Section>

        {/* ─── Phase B: InputWithCounter ─── */}
        <Section title="InputWithCounter (Phase B)">
          <Row label="Default">
            <div className="w-60">
              <InputWithCounter
                placeholder="닉네임을 입력해주세요."
                value=""
                onChange={() => {}}
                maxLength={20}
              />
            </div>
          </Row>
          <Row label="With value">
            <div className="w-60">
              <InputWithCounter
                placeholder="닉네임"
                value="핫딜닷쿨"
                onChange={() => {}}
                maxLength={20}
              />
            </div>
          </Row>
        </Section>

        {/* ─── Phase B: DragHandle ─── */}
        <Section title="DragHandle (Phase B)">
          <Row label="Default (size-5)">
            <div className="flex items-center gap-2 rounded-lg border border-border bg-card p-3">
              <DragHandle />
              <span className="text-sm">드래그 가능한 항목</span>
            </div>
          </Row>
          <Row label="Small (size-4)">
            <div className="flex items-center gap-2 p-2">
              <DragHandle size="sm" />
              <span className="text-sm">소셜 항목</span>
            </div>
          </Row>
        </Section>

        {/* ─── Form Controls ─── */}
        <Section title="Form Controls">
          <Row label="Input">
            <Input placeholder="이메일 입력" className="w-60" />
            <Input placeholder="비활성" disabled className="w-40" />
          </Row>
          <Row label="Label + Input">
            <div className="flex flex-col gap-1">
              <Label className="text-xs">닉네임</Label>
              <Input placeholder="나만의 이름" className="w-60" />
            </div>
          </Row>
          <Row label="Switch">
            <div className="flex items-center gap-2">
              <Switch checked={switchOn} onCheckedChange={setSwitchOn} />
              <span className="text-xs text-muted-foreground">{switchOn ? "ON" : "OFF"}</span>
            </div>
            <div className="flex items-center gap-2">
              <Switch size="sm" checked={switchOn} onCheckedChange={setSwitchOn} />
              <span className="text-xs text-muted-foreground">SM</span>
            </div>
          </Row>
          <Row label="Checkbox">
            <div className="flex items-center gap-2">
              <Checkbox checked={checkOn} onCheckedChange={(v) => setCheckOn(v === true)} />
              <span className="text-sm">이용약관에 동의합니다</span>
            </div>
          </Row>
        </Section>

        {/* ─── Icon Reference ─── */}
        <Section title="Icon Reference (Phosphor)">
          <Row label="Common Icons">
            <div className="grid grid-cols-8 gap-3">
              {[
                { icon: Sun, name: "Sun" }, { icon: Moon, name: "Moon" },
                { icon: Trash, name: "Trash" }, { icon: Plus, name: "Plus" },
                { icon: Eye, name: "Eye" }, { icon: Check, name: "Check" },
                { icon: X, name: "X" }, { icon: ArrowLeft, name: "ArrowL" },
                { icon: ArrowRight, name: "ArrowR" }, { icon: FloppyDisk, name: "Save" },
                { icon: LinkSimple, name: "Link" }, { icon: Heart, name: "Heart" },
                { icon: Star, name: "Star" }, { icon: PencilSimple, name: "Edit" },
                { icon: Palette, name: "Palette" }, { icon: EnvelopeSimple, name: "Mail" },
              ].map(({ icon: Icon, name }) => (
                <div key={name} className="flex flex-col items-center gap-1">
                  <div className="flex size-8 items-center justify-center rounded-md border border-border">
                    <Icon className="size-4" />
                  </div>
                  <span className="text-[9px] text-muted-foreground">{name}</span>
                </div>
              ))}
            </div>
          </Row>
        </Section>

      </div>

      <footer className="mt-16 border-t border-border pt-4 text-center text-[10px] text-muted-foreground">
        HDDC Component Showcase — Phase A + B Standardization
      </footer>
    </div>
  );
}
