"use client";

import { ArrowRightIcon, CircleXIcon, SearchIcon } from "lucide-react";
import { memo, useEffect, useRef, useState } from "react";
import { useDebounce } from "use-debounce";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface CustomSearchInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "type"> {
	/**
	 * @property variant - The type of search input: 'debounced' (with clear button) or 'submit' (with arrow button)
	 */
	variant?: "debounced" | "submit";
	/**
	 * @property onSearch - Callback function called when search is triggered (for submit variant) or after debounce (for debounced variant)
	 */
	onSearch?: (value: string) => void;
	/**
	 * @property onClear - Callback function called when input is cleared (for debounced variant)
	 */
	onClear?: () => void;
	/**
	 * @property debounceMs - Debounce delay in milliseconds (default: 300ms)
	 */
	debounceMs?: number;
}

const CustomSearchInput = ({
	variant = "debounced",
	onSearch,
	onClear,
	debounceMs = 300,
	value,
	onChange,
	className,
	...props
}: CustomSearchInputProps) => {
	const [internalValue, setInternalValue] = useState((value as string) || "");
	const inputRef = useRef<HTMLInputElement>(null);

	// Use the use-debounce library for proper debouncing
	const [debouncedValue] = useDebounce(internalValue, debounceMs);

	const isDebounced = variant === "debounced";
	const isSubmit = variant === "submit";

	// biome-ignore lint/correctness/useExhaustiveDependencies: to avoid maximum call stack exceeding
	useEffect(() => {
		if (isDebounced && onSearch && debouncedValue !== (value as string)) {
			onSearch(debouncedValue);
		}
	}, [debouncedValue, isDebounced, onSearch]);

	// biome-ignore lint/correctness/useExhaustiveDependencies: to avoid maximum call stack exceeding
	useEffect(() => {
		if (value !== undefined && value !== internalValue) {
			setInternalValue(value as string);
		}
	}, [value]);

	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const newValue = e.target.value;
		setInternalValue(newValue);

		// Call external onChange if provided
		if (onChange) {
			onChange(e);
		}
	};

	const handleClear = () => {
		setInternalValue("");
		if (onClear) {
			onClear();
		}
		if (inputRef.current) {
			inputRef.current.focus();
		}

		// Create synthetic event for external onChange
		if (onChange) {
			const syntheticEvent = {
				target: { value: "" },
				currentTarget: { value: "" },
			} as React.ChangeEvent<HTMLInputElement>;
			onChange(syntheticEvent);
		}
	};

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		if (onSearch && isSubmit) {
			onSearch(internalValue);
		}
	};

	// Show right button based on variant and value
	const showRightButton = (isDebounced && internalValue) || isSubmit;

	return (
		<div className={cn("relative", className)}>
			<Input
				ref={inputRef}
				type="search"
				value={internalValue}
				onChange={handleInputChange}
				className={cn(
					"rounded-full pl-10", // Always space for search icon
					showRightButton && "pr-10", // Space for right button when needed
					// Hide browser's default search styling
					"[&::-webkit-search-cancel-button]:hidden [&::-webkit-search-decoration]:hidden [&::-webkit-search-results-button]:hidden [&::-webkit-search-results-decoration]:hidden",
				)}
				placeholder={props.placeholder || "Search..."}
				{...props}
			/>

			{/* Search Icon - Left side */}
			<SearchIcon
				size={18}
				className="-translate-y-1/2 pointer-events-none absolute top-1/2 left-3 transform text-muted-foreground"
				aria-hidden="true"
			/>

			{/* Clear Button (Debounced variant) - Right side */}
			{isDebounced && internalValue && (
				<button
					type="button"
					onClick={handleClear}
					className="-translate-y-1/2 absolute top-1/2 right-3 transform cursor-pointer rounded-full p-1 text-muted-foreground transition-colors hover:bg-muted/60 hover:text-foreground focus:outline-none focus:ring-2 focus:ring-ring/40"
					aria-label="Clear search"
					tabIndex={-1}
				>
					<CircleXIcon size={18} aria-hidden="true" />
				</button>
			)}

			{/* Submit Button (Submit variant) - Right side */}
			{isSubmit && (
				<button
					type="submit"
					onClick={handleSubmit}
					className="-translate-y-1/2 absolute top-1/2 right-3 transform cursor-pointer rounded-full p-1 text-muted-foreground transition-colors hover:bg-muted/60 hover:text-foreground focus:outline-none focus:ring-2 focus:ring-ring/40"
					aria-label="Submit search"
					tabIndex={-1}
				>
					<ArrowRightIcon size={18} aria-hidden="true" />
				</button>
			)}
		</div>
	);
};

export default memo(CustomSearchInput);
