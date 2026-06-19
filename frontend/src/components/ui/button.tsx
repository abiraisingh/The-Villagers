import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-2xl text-sm font-semibold ring-offset-background transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-[color:var(--village-terracotta)] text-[color:var(--village-cream)] hover:brightness-95 shadow-lg border border-[color:var(--sidebar-border)]",
        destructive: "bg-[color:var(--destructive)] text-[color:var(--destructive-foreground)] hover:brightness-95 shadow-lg",
        outline: "border border-[color:var(--border)] bg-[color:var(--card)] text-[color:var(--card-foreground)] hover:bg-[color:var(--muted)] shadow-sm",
        secondary: "bg-[color:var(--village-sage)] text-[color:var(--village-cream)] hover:brightness-95 shadow-sm",
        ghost: "text-[color:var(--village-earth)] hover:bg-[color:var(--muted)]",
        link: "text-[color:var(--village-earth)] underline-offset-4 hover:underline",
        hero: "bg-gradient-to-r from-[color:var(--village-terracotta)] to-[color:var(--village-wheat)] text-[color:var(--village-cream)] shadow-2xl hover:shadow-[0_20px_60px_-20px_rgba(0,0,0,0.45)] hover:scale-[1.02] active:scale-[0.98]",
        nature: "bg-gradient-to-br from-[color:var(--village-sage)] to-[color:var(--village-accent)] text-[color:var(--village-cream)] shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98]",
        accent: "bg-[color:var(--village-wheat)] text-[color:var(--village-earth)] hover:brightness-95 shadow-lg",
      },
      size: {
        default: "h-11 px-6",
        sm: "h-9 rounded-xl px-4 text-xs font-semibold",
        lg: "h-12 rounded-2xl px-8 text-base",
        xl: "h-14 rounded-2xl px-10 text-lg",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />;
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };
