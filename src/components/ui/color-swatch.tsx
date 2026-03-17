import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const colorSwatchVariants = cva(
  "cursor-pointer rounded-full transition-transform hover:scale-110",
  {
    variants: {
      size: {
        default: "size-7",
        sm: "size-5",
      },
      selected: {
        true: "ring-2 ring-foreground ring-offset-2 ring-offset-background",
        false: "",
      },
      bordered: {
        true: "border border-border",
        false: "",
      },
    },
    defaultVariants: {
      size: "default",
      selected: false,
      bordered: false,
    },
  }
)

interface ColorSwatchProps
  extends Omit<VariantProps<typeof colorSwatchVariants>, "selected"> {
  color: string
  selected?: boolean
  onClick?: () => void
  label?: string
  className?: string
}

function ColorSwatch({
  color,
  selected = false,
  bordered = false,
  onClick,
  label,
  size,
  className,
}: ColorSwatchProps) {
  return (
    <button
      type="button"
      data-slot="color-swatch"
      onClick={onClick}
      className={cn(colorSwatchVariants({ size, selected, bordered, className }))}
      style={{ backgroundColor: color }}
      aria-label={label}
    />
  )
}

export { ColorSwatch, colorSwatchVariants }
export type { ColorSwatchProps }
