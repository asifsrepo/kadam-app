import * as React from "react";
import { cn } from "@/lib/utils";

function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
	return (
		<textarea
			data-slot="textarea"
			className={cn(
				"field-sizing-content flex min-h-24 w-full rounded-xl border border-border/60 bg-muted/30 px-3.5 py-2 text-base text-foreground outline-none transition-colors placeholder:text-muted-foreground/80 focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/40 disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-destructive/40",
				className,
			)}
			{...props}
		/>
	);
}

export { Textarea };
