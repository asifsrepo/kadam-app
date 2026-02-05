"use client";

import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import type * as React from "react";
import { cn } from "@/lib/utils";

export type ButtonVariants =
	| "outline"
	| "destructive"
	| "link"
	| "default"
	| "tonal"
	| "secondary"
	| "ghost"
	| "success"
	| "warning";

const buttonVariants = cva(
	"inline-flex shrink-0 cursor-pointer items-center justify-center gap-2 whitespace-nowrap rounded-xl font-medium text-sm outline-none transition-colors focus-visible:ring-2 focus-visible:ring-ring/60 disabled:pointer-events-none disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-destructive/40 [&_svg:not([class*='size-'])]:size-4 [&_svg]:pointer-events-none [&_svg]:shrink-0",
	{
		variants: {
			variant: {
				default: "bg-primary text-primary-foreground hover:bg-primary/90",
				tonal: "bg-primary/10 text-primary hover:bg-primary/20",
				destructive:
					"bg-destructive text-destructive-foreground hover:bg-destructive/90 focus-visible:ring-destructive/40",
				outline:
					"border border-border/60 bg-transparent text-foreground hover:bg-accent/60",
				secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
				ghost: "bg-transparent text-foreground hover:bg-accent/60",
				link: "text-primary underline-offset-4 hover:underline",
				success:
					"bg-success text-success-foreground hover:bg-success/90",
				warning:
					"bg-warning text-warning-foreground hover:bg-warning/90",
			},
			size: {
				default: "h-11 px-4 has-[>svg]:px-3",
				sm: "h-9 gap-1.5 px-3 has-[>svg]:px-2.5",
				lg: "h-12 px-5 text-base has-[>svg]:px-4",
				icon: "size-11",
			},
		},
		defaultVariants: {
			variant: "default",
			size: "default",
		},
	},
);

function Button({
	className,
	variant,
	size,
	asChild = false,
	preventDefault = false,
	...props
}: React.ComponentProps<"button"> &
	VariantProps<typeof buttonVariants> & {
		asChild?: boolean;
		preventDefault?: boolean;
	}) {
	const Comp = asChild ? Slot : "button";
	return (
		<Comp
			data-slot="button"
			className={cn(buttonVariants({ variant, size, className }))}
			onClick={(e) => {
				if (preventDefault) e.preventDefault();
				props.onClick?.(e);
			}}
			{...props}
		/>
	);
}

export { Button, buttonVariants };
