"use client";

import { Label } from "@radix-ui/react-label";
import { memo, useId } from "react";
import { cn } from "@/lib/utils";
import type { FormFieldWrapperProps } from "@/types";

const FormFieldWrapper = ({
	label,
	error,
	hint,
	required,
	showHint,
	description,
	disabled,
	wrapperClass,
	children,
	hintclass,
}: FormFieldWrapperProps) => {
	const id = useId();
	const hasError = !!error;

	const describedBy = error ? `${id}-error` : hint && showHint ? `${id}-hint` : undefined;

	return (
		<div
			className={cn(
				"space-y-2",
				wrapperClass,
			)}
		>
			{label && (
				<Label
					htmlFor={id}
					className={cn(
						"font-medium text-sm leading-none text-foreground",
						hasError && "text-destructive",
						required && "after:ml-1 after:text-destructive after:content-['*']",
					)}
				>
					{label}
				</Label>
			)}

			{description && (
				<p className={cn("text-muted-foreground text-[11px]", disabled && "opacity-50")}>
					{description}
				</p>
			)}

			{children(id, describedBy)}

			{error && (
				<p
					id={`${id}-error`}
					className="text-destructive text-[11px]"
					role="alert"
					aria-live="polite"
				>
					{error}
				</p>
			)}

			{hint && showHint && !error && (
				<p
					id={`${id}-hint`}
					className={cn("text-muted-foreground text-[11px]", hintclass)}
				>
					{hint}
				</p>
			)}
		</div>
	);
};

export default memo(FormFieldWrapper);
