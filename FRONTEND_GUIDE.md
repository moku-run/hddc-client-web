# HDDC Frontend Design Guide

이 문서는 프론트엔드 전체에 **일관된 디자인**을 적용하기 위한 가이드입니다.
"글자 크기 줄여줘", "버튼 크게 해줘" 같은 요청 시 이 가이드에 정의된 값 중에서 선택합니다.

> **핵심 원칙**: 하드코딩 금지. 반드시 아래 정의된 토큰/컴포넌트를 사용할 것.

---

## 1. 브랜드 에셋 (Single Source of Truth)

| 에셋 | 파일 | 사용법 |
|------|------|--------|
| 로고 (불꽃) | `src/components/icons/fire-logo.tsx` → `<FireLogo>` | 테마 색상 자동 반영 |
| HOT 라벨 | `src/components/icons/fire-logo.tsx` → `<HotLabel>` | 틸 원 + 흰 불꽃 |
| 텍스트 로고 | `src/components/site-header.tsx` | `핫딜닷쿨` — 여기만 수정하면 전체 반영 |
| 파비콘 | `src/app/icon.svg` | SVG 파비콘 |
| 소셜 아이콘 | `src/components/icons/` | `FacebookIcon`, `KakaoIcon`, `NaverIcon` |

**로고 수정 시**: `fire-logo.tsx`만 수정 → 모든 곳에 자동 반영
**텍스트 로고 수정 시**: `site-header.tsx`의 `핫딜닷쿨` 텍스트만 수정

---

## 2. 글자 크기 (Typography Scale)

Tailwind CSS 기본 스케일을 사용합니다. **이 외의 임의 크기(`text-[13px]` 등) 사용 금지.**

| 요청 예시 | 클래스 | 크기 | 용도 |
|-----------|--------|------|------|
| "아주 작게" | `text-[0.625rem]` | 10px | 배지, 라벨, 캡션 |
| "작게" | `text-xs` | 12px | 버튼, 메뉴, 보조 텍스트 (프로젝트 기본) |
| "약간 작게" | `text-sm` | 14px | 본문, 카드 설명, 섹션 헤더 |
| "보통" | `text-base` | 16px | 강조 본문 |
| "크게" | `text-lg` | 18px | 닉네임, 소제목 |
| "아주 크게" | `text-xl` | 20px | 페이지 제목 |
| "매우 크게" | `text-2xl` | 24px | 히어로 제목 |
| "최대" | `text-3xl` | 30px | 랜딩 메인 타이틀 |

### 글자 굵기

| 요청 예시 | 클래스 | 용도 |
|-----------|--------|------|
| "얇게" | `font-normal` (400) | 본문 |
| "보통" | `font-medium` (500) | 버튼, 메뉴 항목 |
| "굵게" | `font-semibold` (600) | 섹션 헤더 |
| "아주 굵게" | `font-bold` (700) | 제목, 로고 |

### 폰트

| 이름 | 클래스/변수 | 용도 |
|------|------------|------|
| Pretendard | `font-sans` (기본) | 모든 UI 텍스트 |
| Geist Mono | `font-mono` | 코드, 숫자 |
| Noto Sans KR | 프로필 테마 전용 | `font-loader.ts`에서 동적 로드 |
| 나눔고딕 | 프로필 테마 전용 | 위와 동일 |
| 나눔명조 | 프로필 테마 전용 | 위와 동일 |
| Gmarket Sans | 프로필 테마 전용 | 위와 동일 |
| SUIT | 프로필 테마 전용 | 위와 동일 |

---

## 3. 색상 시스템

**절대 hex 값 직접 사용 금지.** 반드시 CSS 변수(시맨틱 컬러)를 사용합니다.

### 색상 온도 규칙 (중요!)

> **배경·카드·팝오버 등 면적이 큰 색상은 반드시 같은 온도(톤)로 통일할 것.**
>
> 따뜻한 배경(크림) 위에 차가운 카드(순백)를 올리면 이질감이 생긴다.
> 새 색상을 추가하거나 변경할 때, 기존 색상과의 온도(warm/cool) 일치를 반드시 확인한다.

### 현재 기본 색상 (Light Mode)

| 역할 | CSS 변수 | OKLch | 근사 Hex | 온도 |
|------|---------|-------|---------|------|
| 페이지 배경 | `--background` | `oklch(0.993 0.008 83)` | #FFFBF5 | Warm (크림) |
| 카드/패널 배경 | `--card` | `oklch(0.995 0.004 83)` | #FEFCF7 | Warm (아이보리) |
| 팝오버 배경 | `--popover` | `oklch(0.995 0.004 83)` | #FEFCF7 | Warm (아이보리) |
| Primary | `--primary` | `oklch(0.511 0.096 186)` | #0d9488 | Teal |
| 위험/삭제 | `--destructive` | `oklch(0.577 0.245 27)` | #e5484d | Red |
| 보조 텍스트 | `--muted-foreground` | `oklch(0.547 0.021 43)` | #8c7e73 | Warm gray |
| 테두리 | `--border` | `oklch(0.922 0.005 34)` | #ebe6e1 | Warm gray |

> 모든 기본 색상이 **Warm(따뜻한) 계열 Hue 34~83**으로 통일되어 있다.
> 새 색상 추가 시 이 범위를 벗어나지 않도록 주의.

정의 파일: `src/app/globals.css` (라이트/다크 모드 변수)

### 시맨틱 컬러 (Tailwind 클래스로 사용)

| 요청 예시 | 배경 클래스 | 텍스트 클래스 | 용도 |
|-----------|------------|-------------|------|
| "기본 배경" | `bg-background` | `text-foreground` | 페이지 배경, 기본 텍스트 |
| "카드" | `bg-card` | `text-card-foreground` | 카드, 패널 |
| "팝업" | `bg-popover` | `text-popover-foreground` | 모달, 드롭다운 |
| "강조/브랜드" | `bg-primary` | `text-primary` | CTA 버튼, 브랜드 액센트 |
| "보조" | `bg-secondary` | `text-secondary-foreground` | 보조 버튼, 태그 |
| "흐리게" | `bg-muted` | `text-muted-foreground` | 비활성 텍스트, 힌트 |
| "위험/삭제" | `bg-destructive` | `text-destructive` | 삭제 버튼, 에러 |
| "테두리" | `border-border` | — | 모든 테두리 |
| "입력란" | `bg-input` | — | 인풋 배경/테두리 |

### 투명도 (hover, 비활성 등)

| 패턴 | 예시 | 용도 |
|------|------|------|
| 10% 배경 | `bg-primary/10` | 아이콘 배경, 라이트 하이라이트 |
| 20% 배경 | `bg-destructive/20` | 위험 경고 배경 |
| 50% 투명 | `bg-background/50` | 글래스 효과 (헤더) |
| 60% 텍스트 | `opacity-60` | 보조 텍스트 (바이오 등) |

### 테마 프리셋 (프로필 페이지 전용)

9개 빌트인 테마 — `data-theme` 속성으로 전환:
`default` · `teal` · `orange` · `blue` · `violet` · `yellow` · `red` · `white` · `custom`

정의 파일: `src/styles/themes.css`
상수: `src/lib/theme-constants.ts`

---

## 4. 간격 (Spacing)

Tailwind 기본 스케일을 사용합니다. 자주 쓰는 값만 정리:

| 요청 예시 | 값 | px | 용도 |
|-----------|-----|-----|------|
| "아주 좁게" | `1` | 4px | 아이콘과 텍스트 사이 (`gap-1`) |
| "좁게" | `1.5` | 6px | 작은 요소 간격 |
| "보통" | `2` | 8px | 버튼 내부 패딩 (`px-2`), 요소 간격 (`gap-2`) |
| "넓게" | `3` | 12px | 카드 내부 패딩 |
| "아주 넓게" | `4` | 16px | 섹션 패딩 (`px-4`, `py-4`) |
| "섹션 간격" | `6` | 24px | 섹션 사이, 넓은 패딩 (`px-6`) |
| "페이지 간격" | `8` | 32px | 큰 섹션 분리 |

### 페이지 레이아웃

| 요소 | 값 | 설명 |
|------|-----|------|
| 헤더 높이 | `h-14` (56px) | `site-header.tsx` |
| 최대 너비 | `max-w-5xl` (1024px) | 기본 컨텐츠 영역 |
| 좌우 패딩 | `px-4 sm:px-6` | 모바일 16px, 데스크톱 24px |

---

## 5. 모서리 (Border Radius)

토큰 파일: `src/styles/tokens.css` (base: `--radius: 0.625rem`)

| 요청 예시 | 클래스 | 계산값 | 용도 |
|-----------|--------|--------|------|
| "살짝 둥글게" | `rounded-sm` | 3.75px | 작은 뱃지, xs 버튼 |
| "둥글게" | `rounded-md` | 5px | 인풋, 작은 카드 |
| "보통 둥글게" | `rounded-lg` | 10px | 버튼 (기본), 카드 |
| "많이 둥글게" | `rounded-xl` | 14px | 모달, 큰 카드 |
| "아주 둥글게" | `rounded-2xl` | 18px | 드롭다운 메뉴 |
| "완전 둥글게" | `rounded-full` | 9999px | 아바타, 뱃지, pill 버튼 |

---

## 6. 그림자 (Shadow)

토큰 파일: `src/styles/tokens.css` (다크모드 자동 전환)

| 요청 예시 | 클래스 | 용도 |
|-----------|--------|------|
| "약한 그림자" | `shadow-sm` | 카드 호버 |
| "보통 그림자" | `shadow-md` | 헤더, 떠 있는 요소 |
| "강한 그림자" | `shadow-lg` | 모달, 드롭다운 |

---

## 7. 컴포넌트 사용 규칙

### 버튼 — `<Button>`

파일: `src/components/ui/button.tsx`

**variant (스타일)**

| 요청 예시 | variant | 모습 |
|-----------|---------|------|
| "기본 버튼" | `default` | 틸 배경 + 흰 글씨 (CTA) |
| "테두리 버튼" | `outline` | 테두리만, 투명 배경 |
| "보조 버튼" | `secondary` | 회색 배경 |
| "투명 버튼" | `ghost` | 배경 없음, 호버 시 muted |
| "삭제 버튼" | `destructive` | 빨간 틴트 배경 |
| "링크처럼" | `link` | 밑줄, 텍스트만 |

**size (크기)**

| 요청 예시 | size | 높이 |
|-----------|------|------|
| "아주 작은 버튼" | `xs` | 20px |
| "작은 버튼" | `sm` | 24px |
| "보통 버튼" | `default` | 28px |
| "큰 버튼" | `lg` | 32px |
| "아이콘만 버튼" | `icon` | 28×28px |
| "작은 아이콘 버튼" | `icon-xs` | 20×20px |
| "아이콘 버튼" | `icon-sm` | 24×24px |
| "큰 아이콘 버튼" | `icon-lg` | 32×32px |

```tsx
// 올바른 사용
<Button variant="destructive" size="sm">삭제</Button>
<Button variant="ghost" size="icon-sm"><Trash /></Button>

// 금지 — 직접 스타일링
<button className="bg-red-500 text-white px-3 py-1">삭제</button>
```

### 배지 — `<Badge>`

파일: `src/components/ui/badge.tsx`

| 요청 | variant |
|------|---------|
| "기본 뱃지" | `default` — 틸 배경 |
| "보조 뱃지" | `secondary` — 회색 배경 |
| "위험 뱃지" | `destructive` — 빨간 틴트 |
| "테두리 뱃지" | `outline` — 테두리만 |
| "투명 뱃지" | `ghost` — 배경 없음 |

고정 크기: h-5 (20px), text-[0.625rem] (10px), `rounded-full`

### 확인 대화상자 — `<ConfirmDialog>`

파일: `src/components/ui/confirm-dialog.tsx`

삭제, 로그아웃 등 **되돌릴 수 없는 동작** 확인 시 사용:

```tsx
<ConfirmDialog
  open={open}
  onOpenChange={setOpen}
  title="삭제하시겠습니까?"
  description="이 작업은 되돌릴 수 없습니다."
  onConfirm={handleDelete}
  variant="destructive"     // 삭제 = destructive, 일반 = default
  confirmLabel="삭제"
  cancelLabel="취소"
/>
```

**규칙**: 삭제/위험 동작에는 반드시 `ConfirmDialog`를 사용. 인라인 Popover로 자체 구현 금지.

### 모달 (Dialog) — `<Dialog>`

파일: `src/components/ui/dialog.tsx`

| 용도 | 컴포넌트 |
|------|---------|
| 일반 모달 (폼, 정보) | `<Dialog>` + `<DialogContent>` |
| 위험 확인 모달 | `<ConfirmDialog>` (위 참조) |
| 사이드 패널 | `<Sheet>` (`src/components/ui/sheet.tsx`) |

### 토스트 (알림) — `toast()`

파일: `src/components/ui/sonner.tsx` (설정) / `sonner` 라이브러리

```tsx
import { toast } from "sonner";

toast.success("저장되었습니다");
toast.error("저장에 실패했습니다");
toast.info("링크가 복사되었습니다");
toast.warning("최대 20자까지 입력 가능합니다");
```

**규칙**: `alert()` 사용 금지. 모든 피드백은 `toast()`로.

### 툴팁 — `<Tooltip>`

파일: `src/components/ui/tooltip.tsx`

```tsx
<Tooltip>
  <TooltipTrigger asChild>
    <Button variant="ghost" size="icon-sm"><Info /></Button>
  </TooltipTrigger>
  <TooltipContent>설명 텍스트</TooltipContent>
</Tooltip>
```

### 입력 — `<Input>`, `<InputWithCounter>`

| 용도 | 컴포넌트 |
|------|---------|
| 일반 텍스트 | `<Input>` |
| 글자수 제한 | `<InputWithCounter maxLength={20}>` |
| 여러 줄 | `<Textarea>` |
| 셀렉트 | `<Select>` |
| 체크박스 | `<Checkbox>` |
| 토글 | `<Switch>` |

### 섹션 제목 — `<SectionHeader>`

파일: `src/components/ui/section-header.tsx`

```tsx
<SectionHeader title="링크 관리" badge="3/10" />
```

**규칙**: 에디터 내 섹션 구분에는 반드시 `SectionHeader` 사용. 직접 `<h3>` 금지.

### 드래그 핸들 — `<DragHandle>`

파일: `src/components/ui/drag-handle.tsx`

정렬 가능 목록에서 드래그 아이콘 표시용.

### 이미지 — `<R2Image>`

파일: `src/components/ui/r2-image.tsx`

```tsx
<R2Image src={imageKey} alt="설명" className="size-12 rounded-lg" />
```

**규칙**: Cloudflare R2 이미지는 반드시 `R2Image` 사용. 직접 `<img>` 금지.

---

## 8. 아이콘 — Phosphor Icons

라이브러리: `@phosphor-icons/react`

### 크기 규칙

| 컨텍스트 | 클래스 | px |
|---------|--------|-----|
| 배지 안 | `size-2.5` | 10px |
| xs 버튼 안 | `size-2.5` | 10px |
| sm 버튼 안 | `size-3` | 12px |
| 기본 버튼/메뉴 안 | `size-3.5` | 14px |
| lg 버튼 안 | `size-4` | 16px |
| 독립 아이콘 | `size-5` | 20px |

> 버튼 안에서는 `[&_svg]:size-*` 자동 적용되므로 별도 크기 지정 불필요.

```tsx
// 올바른 사용
import { Trash, Plus, Heart } from "@phosphor-icons/react";
<Button variant="ghost" size="icon-sm"><Trash /></Button>

// 금지 — lucide-react, heroicons 등 다른 아이콘 라이브러리 혼용 금지
```

---

## 9. 트랜지션/애니메이션

토큰 파일: `src/styles/tokens.css`

| 요청 예시 | CSS 변수 | 시간 |
|-----------|---------|------|
| "빠른 전환" | `var(--transition-fast)` | 150ms |
| "보통 전환" | `var(--transition-normal)` | 250ms |
| "느린 전환" | `var(--transition-slow)` | 350ms |

Tailwind에서는 `transition-all` + `duration-150/250/350` 사용.

### 미리 정의된 애니메이션

| 이름 | 클래스 | 용도 |
|------|--------|------|
| 페이드인 | `link-anim-fade-in` | 링크 등장 |
| 슬라이드업 | `link-anim-slide-up` | 링크 등장 |
| 스케일 | `link-anim-scale` | 링크 등장 |
| 바운스 | `animate-bounce-y` | SSE 알림 |
| 글래스 효과 | `liquid-glass` | 프리미엄 카드 |

---

## 10. 반응형 (Breakpoints)

Tailwind 기본 breakpoint:

| 접두사 | 최소 너비 | 대상 |
|--------|----------|------|
| (없음) | 0px | 모바일 (기본) |
| `sm:` | 640px | 작은 태블릿 |
| `md:` | 768px | 태블릿 |
| `lg:` | 1024px | 데스크톱 |

**모바일 퍼스트**: 기본 스타일은 모바일, `sm:`/`md:`로 확장.

```tsx
// 올바른 예: 모바일에서 숨기고 sm부터 표시
<div className="hidden sm:flex">데스크톱 전용</div>
```

---

## 11. 금지 사항 (Anti-patterns)

| 금지 | 대신 |
|------|------|
| `className="bg-red-500 text-white px-3 py-1 rounded"` | `<Button variant="destructive">` |
| `className="text-[13px]"` | `text-xs` 또는 `text-sm` 중 선택 |
| `color: #0d9488` | `text-primary` |
| `alert("삭제 완료")` | `toast.success("삭제 완료")` |
| `<img src={...}>` (R2 이미지) | `<R2Image src={...}>` |
| `<h3 className="font-bold text-sm">제목</h3>` | `<SectionHeader title="제목">` |
| `localStorage.getItem("hddc-auth")` 직접 호출 | (향후) `useAuth()` 훅으로 통합 예정 |
| lucide-react / heroicons 등 | `@phosphor-icons/react` 만 사용 |
| `style={{ color: "red" }}` 인라인 스타일 | Tailwind 클래스 사용 |
| 임의 그림자 `shadow-[0_2px_8px_...]` | `shadow-sm` / `shadow-md` / `shadow-lg` |

---

## 12. 파일 구조 요약

```
src/
├── styles/
│   ├── tokens.css          ← 디자인 토큰 (radius, shadow, transition, animation)
│   └── themes.css          ← 9개 컬러 테마 프리셋
├── app/globals.css         ← 시맨틱 컬러 변수 + 글로벌 스타일
├── components/
│   ├── ui/                 ← shadcn/ui 기본 컴포넌트 (수정 시 주의)
│   │   ├── button.tsx      ← 버튼 (variant + size)
│   │   ├── badge.tsx       ← 배지
│   │   ├── dialog.tsx      ← 모달
│   │   ├── confirm-dialog.tsx ← 확인 대화상자
│   │   ├── sheet.tsx       ← 사이드 패널
│   │   ├── popover.tsx     ← 팝오버
│   │   ├── tooltip.tsx     ← 툴팁
│   │   ├── sonner.tsx      ← 토스트 설정
│   │   ├── input.tsx       ← 텍스트 입력
│   │   ├── input-with-counter.tsx ← 글자수 제한 입력
│   │   ├── select.tsx      ← 셀렉트
│   │   ├── section-header.tsx ← 섹션 제목
│   │   ├── r2-image.tsx    ← R2 이미지
│   │   ├── action-pill.tsx ← 토글 필 버튼
│   │   ├── drag-handle.tsx ← 드래그 핸들
│   │   └── ...             ← 기타 shadcn 컴포넌트
│   └── icons/
│       ├── fire-logo.tsx   ← 로고 (FireLogo, HotLabel)
│       ├── facebook-icon.tsx
│       ├── kakao-icon.tsx
│       └── naver-icon.tsx
├── lib/
│   ├── theme-constants.ts  ← 테마 프리셋 값 (hex, bg, font color)
│   ├── color-utils.ts      ← 색상 변환 유틸리티
│   ├── font-loader.ts      ← 프로필 외부 폰트 로더
│   └── utils.ts            ← cn() 유틸리티
└── hooks/
    └── use-color-theme.ts  ← 컬러 테마 훅
```
