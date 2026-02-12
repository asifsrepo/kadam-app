import { Check, Copy } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import type { TooltipWrapperProps } from "@/types";
import { Button, type ButtonVariants } from "../ui/button";
import TooltipWrapper from "./TooltipWrapper";

interface CopyButtonProps extends Omit<TooltipWrapperProps, "children"> {
	/**
	 * @property text - The text content to copy to clipboard
	 */
	text: string;
	/**
	 * @property successMessage - Custom success message to display (default: "Copied to clipboard!")
	 */
	successMessage?: string;
	/**
	 * @property variant - Button visual variant
	 */
	variant?: ButtonVariants;
	/**
	 * @property size - Button size variant
	 */
	size?: "default" | "sm" | "lg" | "icon";
	/**
	 * @property className - Additional CSS classes
	 */
	className?: string;
	/**
	 * @property disabled - Whether the button is disabled
	 */
	disabled?: boolean;
	/**
	 * @property copiedDuration - Duration in ms to show copied state (default: 2000ms)
	 */
	copiedDuration?: number;
	/**
	 * @property copiedContent - Custom tooltip content when copied (default: "Copied!")
	 */
	copiedContent?: string;
}

const CopyButton = ({
	text,
	successMessage = "Copied to clipboard!",
	variant = "outline",
	size = "sm",
	className,
	disabled,
	duration,
	content,
	copiedDuration = 2000,
	copiedContent = "Copied!",
	...props
}: CopyButtonProps) => {
	const [isCopied, setIsCopied] = useState(false);
	useEffect(() => {
		if (isCopied) {
			const timer = setTimeout(() => {
				setIsCopied(false);
			}, copiedDuration);

			return () => clearTimeout(timer);
		}
	}, [isCopied, copiedDuration]);

	const copyToClipboard = async () => {
		if (navigator.clipboard && window.isSecureContext) {
			await navigator.clipboard.writeText(text);
			toast.success(successMessage);
			setIsCopied(true);
			return true;
		}
	};

	return (
		<TooltipWrapper content={isCopied ? copiedContent : content} duration={duration}>
			<Button
				variant={variant}
				size={size}
				onClick={copyToClipboard}
				className={className}
				disabled={disabled}
				{...props}
			>
				{isCopied ? (
					<Check className="h-3 w-3 text-success" />
				) : (
					<Copy className="h-3 w-3" />
				)}
			</Button>
		</TooltipWrapper>
	);
};

export default CopyButton;
