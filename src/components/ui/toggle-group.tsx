import { cva, type VariantProps } from "class-variance-authority"
import type { Icon } from "@phosphor-icons/react"

import { cn } from "@/lib/utils"

const toggleGroupVariants = cva(
  "inline-flex items-center",
  {
    variants: {
      variant: {
        pill: "gap-1 rounded-full border border-border bg-muted/50 p-1",
        square: "gap-1",
      },
      size: {
        default: "",
        sm: "",
      },
    },
    defaultVariants: {
      variant: "pill",
      size: "default",
    },
  }
)

const toggleGroupItemVariants = cva(
  "cursor-pointer inline-flex items-center font-medium transition-all",
  {
    variants: {
      variant: {
        pill: "rounded-full",
        square: "rounded-md",
      },
      size: {
        default: "",
        sm: "",
      },
      active: {
        true: "",
        false: "",
      },
    },
    compoundVariants: [
      // pill + size
      { variant: "pill", size: "default", className: "gap-1.5 px-4 py-1.5 text-sm" },
      { variant: "pill", size: "sm", className: "gap-1 px-3 py-1 text-xs" },
      // square + size
      { variant: "square", size: "default", className: "gap-1 px-2 py-1 text-[11px]" },
      { variant: "square", size: "sm", className: "gap-0.5 px-1.5 py-0.5 text-[10px]" },
      // active states
      { variant: "pill", active: true, className: "bg-primary text-primary-foreground shadow-sm" },
      { variant: "pill", active: false, className: "text-muted-foreground hover:text-foreground" },
      { variant: "square", active: true, className: "bg-primary text-primary-foreground" },
      { variant: "square", active: false, className: "bg-muted/60 text-muted-foreground hover:bg-muted" },
    ],
    defaultVariants: {
      variant: "pill",
      size: "default",
      active: false,
    },
  }
)

interface ToggleGroupOption<T extends string> {
  value: T
  label: string
  icon?: Icon
}

interface ToggleGroupProps<T extends string>
  extends VariantProps<typeof toggleGroupVariants> {
  value: T
  onValueChange: (value: T) => void
  options: ToggleGroupOption<T>[]
  className?: string
  renderItem?: (option: ToggleGroupOption<T>, isActive: boolean) => React.ReactNode
}

function ToggleGroup<T extends string>({
  value,
  onValueChange,
  options,
  variant = "pill",
  size,
  className,
  renderItem,
}: ToggleGroupProps<T>) {
  return (
    <div
      data-slot="toggle-group"
      className={cn(toggleGroupVariants({ variant, size, className }))}
    >
      {options.map((option) => {
        const IconComp = option.icon
        const isActive = value === option.value
        return (
          <button
            key={option.value}
            type="button"
            data-state={isActive ? "on" : "off"}
            onClick={() => onValueChange(option.value)}
            className={cn(
              "cursor-pointer",
              renderItem
                ? ""
                : toggleGroupItemVariants({ variant, size, active: isActive }),
            )}
          >
            {renderItem ? (
              renderItem(option, isActive)
            ) : (
              <>
                {IconComp && <IconComp className="size-4" />}
                {option.label}
              </>
            )}
          </button>
        )
      })}
    </div>
  )
}

export { ToggleGroup, toggleGroupVariants, toggleGroupItemVariants }
export type { ToggleGroupProps, ToggleGroupOption }
