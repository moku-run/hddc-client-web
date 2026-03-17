import { cva, type VariantProps } from "class-variance-authority"
import type { Icon } from "@phosphor-icons/react"

import { cn } from "@/lib/utils"

const featureCardVariants = cva("relative flex flex-col", {
  variants: {
    variant: {
      step: "items-center text-center",
      feature:
        "rounded-xl border border-border bg-card p-6 transition-shadow hover:shadow-md",
    },
  },
  defaultVariants: {
    variant: "feature",
  },
})

const featureCardIconVariants = cva(
  "flex items-center justify-center rounded-2xl bg-primary/10 text-primary",
  {
    variants: {
      variant: {
        step: "mb-4 size-14",
        feature: "mb-4 size-10 rounded-lg",
      },
    },
    defaultVariants: {
      variant: "feature",
    },
  }
)

interface FeatureCardProps extends VariantProps<typeof featureCardVariants> {
  icon: Icon
  title: string
  description: string
  badge?: string
  className?: string
  children?: React.ReactNode
}

function FeatureCard({
  icon: IconComp,
  title,
  description,
  badge,
  variant = "feature",
  className,
  children,
}: FeatureCardProps) {
  return (
    <div
      data-slot="feature-card"
      className={cn(featureCardVariants({ variant, className }))}
    >
      <div className={cn(featureCardIconVariants({ variant }))}>
        <IconComp
          className={variant === "step" ? "size-6" : "size-5"}
          weight="duotone"
        />
      </div>
      {badge && (
        <span className="mb-1 text-xs font-bold text-primary">{badge}</span>
      )}
      <h3
        className={cn(
          "font-semibold",
          variant === "step" ? "mb-2 text-lg" : "mb-2"
        )}
      >
        {title}
      </h3>
      <p
        className={cn(
          "text-sm leading-relaxed text-muted-foreground",
          variant === "step" && "max-w-xs"
        )}
      >
        {description}
      </p>
      {children}
    </div>
  )
}

export { FeatureCard, featureCardVariants }
export type { FeatureCardProps }
