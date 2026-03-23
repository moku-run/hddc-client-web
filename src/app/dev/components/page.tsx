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
  CursorClick, Cursor, HandTap, MouseSimple, HandPointing, Hand, XCircle,
} from "@phosphor-icons/react";
import { cn } from "@/lib/utils";
import { IconText } from "@/components/ui/icon-text";
import { ActionPill } from "@/components/ui/action-pill";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

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

        {/* ─── ActionPill ─── */}
        <Section title="ActionPill">
          <Row label="기본">
            <ActionPill icon={Heart} label="좋아요" />
            <ActionPill icon={XCircle} label="끝났어요" />
            <ActionPill icon={Star} label="즐겨찾기" />
          </Row>
          <Row label="Active">
            <ActionPill icon={Heart} label="좋아요" active activeClassName="bg-red-500 text-white" />
            <ActionPill icon={XCircle} label="끝났어요" active activeClassName="bg-orange-500 text-white" />
            <ActionPill icon={Star} label="즐겨찾기" active activeClassName="bg-yellow-500 text-white" />
          </Row>
          <Row label="커스텀 색상">
            <ActionPill icon={Heart} label="좋아요" active activeClassName="bg-pink-500 text-white" />
            <ActionPill icon={Check} label="완료" active activeClassName="bg-green-500 text-white" />
            <ActionPill icon={Warning} label="주의" active activeClassName="bg-amber-500 text-white" />
          </Row>
        </Section>

        {/* ─── Popover ─── */}
        <Section title="Popover">
          <Row label="방향">
            <Popover>
              <PopoverTrigger asChild><Button variant="outline" size="sm">위쪽</Button></PopoverTrigger>
              <PopoverContent side="top" className="w-48 p-3"><p className="text-xs">위쪽 Popover 콘텐츠</p></PopoverContent>
            </Popover>
            <Popover>
              <PopoverTrigger asChild><Button variant="outline" size="sm">아래쪽</Button></PopoverTrigger>
              <PopoverContent side="bottom" className="w-48 p-3"><p className="text-xs">아래쪽 Popover 콘텐츠</p></PopoverContent>
            </Popover>
            <Popover>
              <PopoverTrigger asChild><Button variant="outline" size="sm">왼쪽</Button></PopoverTrigger>
              <PopoverContent side="left" className="w-48 p-3"><p className="text-xs">왼쪽 Popover 콘텐츠</p></PopoverContent>
            </Popover>
            <Popover>
              <PopoverTrigger asChild><Button variant="outline" size="sm">오른쪽</Button></PopoverTrigger>
              <PopoverContent side="right" className="w-48 p-3"><p className="text-xs">오른쪽 Popover 콘텐츠</p></PopoverContent>
            </Popover>
          </Row>
          <Row label="삭제 확인">
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="ghost" size="icon-sm" className="text-muted-foreground hover:text-destructive"><Trash className="size-4" /></Button>
              </PopoverTrigger>
              <PopoverContent side="bottom" align="center" className="!w-auto flex-row items-center gap-1.5 whitespace-nowrap p-1.5">
                <button className="rounded bg-destructive px-2.5 py-0.5 text-[9px] font-medium text-white">삭제</button>
                <button className="rounded bg-muted px-2.5 py-0.5 text-[9px] font-medium text-muted-foreground">취소</button>
              </PopoverContent>
            </Popover>
          </Row>
          <Row label="메뉴형">
            <Popover>
              <PopoverTrigger asChild><Button variant="outline" size="sm">메뉴 열기</Button></PopoverTrigger>
              <PopoverContent align="start" className="w-40 p-1.5">
                <div className="flex flex-col">
                  <button className="rounded-md px-2 py-1.5 text-left text-[11px] text-muted-foreground hover:bg-muted hover:text-foreground">수정</button>
                  <button className="rounded-md px-2 py-1.5 text-left text-[11px] text-muted-foreground hover:bg-muted hover:text-foreground">공유</button>
                  <button className="rounded-md px-2 py-1.5 text-left text-[11px] text-destructive hover:bg-destructive/10">삭제</button>
                </div>
              </PopoverContent>
            </Popover>
          </Row>
          <Row label="폼 입력">
            <Popover>
              <PopoverTrigger asChild><Button variant="outline" size="sm">신고하기</Button></PopoverTrigger>
              <PopoverContent align="start" className="w-56 p-3">
                <p className="mb-2 text-[11px] font-semibold">신고 사유 입력</p>
                <textarea placeholder="사유를 입력해주세요" maxLength={100} rows={3} className="w-full resize-none rounded-md border border-input bg-transparent px-2 py-1.5 text-[11px] outline-none placeholder:text-muted-foreground focus:border-primary" />
                <div className="mt-2 flex items-center justify-between">
                  <span className="text-[9px] text-muted-foreground">0/100</span>
                  <button className="rounded-md bg-destructive px-2 py-0.5 text-[10px] font-medium text-white">신고</button>
                </div>
              </PopoverContent>
            </Popover>
          </Row>
        </Section>

        {/* ─── Tooltip ─── */}
        <Section title="Tooltip">
          <TooltipProvider>
            <Row label="방향">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="outline" size="sm">위쪽 (기본)</Button>
                </TooltipTrigger>
                <TooltipContent side="top">위쪽 툴팁</TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="outline" size="sm">아래쪽</Button>
                </TooltipTrigger>
                <TooltipContent side="bottom">아래쪽 툴팁</TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="outline" size="sm">왼쪽</Button>
                </TooltipTrigger>
                <TooltipContent side="left">왼쪽 툴팁</TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="outline" size="sm">오른쪽</Button>
                </TooltipTrigger>
                <TooltipContent side="right">오른쪽 툴팁</TooltipContent>
              </Tooltip>
            </Row>
            <Row label="아이콘 버튼">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon-sm"><Heart className="size-4" /></Button>
                </TooltipTrigger>
                <TooltipContent>좋아요</TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon-sm"><Trash className="size-4" /></Button>
                </TooltipTrigger>
                <TooltipContent>삭제</TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon-sm"><PencilSimple className="size-4" /></Button>
                </TooltipTrigger>
                <TooltipContent>수정</TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon-sm"><FloppyDisk className="size-4" /></Button>
                </TooltipTrigger>
                <TooltipContent>저장</TooltipContent>
              </Tooltip>
            </Row>
            <Row label="긴 텍스트">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="outline" size="sm">Hover me</Button>
                </TooltipTrigger>
                <TooltipContent>이것은 긴 툴팁 텍스트입니다. 최대 너비가 적용됩니다.</TooltipContent>
              </Tooltip>
            </Row>
            <Row label="텍스트 요소">
              <Tooltip>
                <TooltipTrigger asChild>
                  <span className="cursor-help text-sm underline decoration-dotted underline-offset-4">클릭수란?</span>
                </TooltipTrigger>
                <TooltipContent>해당 딜 링크를 클릭한 횟수입니다</TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger asChild>
                  <span className="cursor-help text-sm underline decoration-dotted underline-offset-4">끝났어요</span>
                </TooltipTrigger>
                <TooltipContent>딜이 종료되었다고 투표합니다. 5표 이상이면 인기 뱃지가 제거됩니다.</TooltipContent>
              </Tooltip>
            </Row>
          </TooltipProvider>
        </Section>

        {/* ─── Icon + Text ─── */}
        <Section title="IconText (아이콘+텍스트 정렬)">
          <Row label="기본">
            <IconText icon={CursorClick}>330</IconText>
            <IconText icon={Heart}>634</IconText>
            <IconText icon={Star}>4.8</IconText>
          </Row>
          <Row label="메타 줄 예시">
            <span className="flex items-center gap-1 text-[10px] text-muted-foreground">
              <IconText icon={CursorClick}>330</IconText> ·
              <IconText icon={Heart}>634</IconText> ·
              HDDC · 쿠팡 · 1일 전
            </span>
          </Row>
          <Row label="크기 비교">
            <IconText icon={Heart} iconClassName="size-2">size-2</IconText>
            <IconText icon={Heart}>size-2.5 (기본)</IconText>
            <IconText icon={Heart} iconClassName="size-3">size-3</IconText>
            <IconText icon={Heart} iconClassName="size-4">size-4</IconText>
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
          <Row label="Click / Tap Icons">
            <div className="grid grid-cols-8 gap-3">
              {[
                { icon: CursorClick, name: "CursorClick" }, { icon: Cursor, name: "Cursor" },
                { icon: HandTap, name: "HandTap" }, { icon: MouseSimple, name: "Mouse" },
                { icon: HandPointing, name: "HandPoint" }, { icon: Hand, name: "Hand" },
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
