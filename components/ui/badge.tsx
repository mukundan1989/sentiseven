import type * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default: "border-transparent bg-primary text-primary-foreground hover:bg-primary/80",
        secondary: "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
        destructive: "border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80",
        outline: "text-foreground",
        electric:
          "border-transparent bg-gradient-to-r from-electric-blue-500 to-electric-blue-600 text-white shadow-electric hover:shadow-electric-hover",
        purple:
          "border-transparent bg-gradient-to-r from-purple-500 to-purple-600 text-white shadow-purple hover:shadow-purple-hover",
        gold: "border-transparent bg-gradient-to-r from-gold-500 to-gold-600 text-white shadow-gold hover:shadow-gold-hover",
        glass: "border-white/20 bg-white/10 backdrop-blur-xl text-white hover:bg-white/20 hover:border-white/30",
        success:
          "border-transparent bg-gradient-to-r from-emerald-500 to-emerald-600 text-white shadow-emerald hover:shadow-emerald-hover",
        warning:
          "border-transparent bg-gradient-to-r from-amber-500 to-amber-600 text-white shadow-amber hover:shadow-amber-hover",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
)

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />
}

export { Badge, badgeVariants }
