import { Loader2 } from "lucide-react";
import { memo } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface SubmitButtonProps {
	/**
	 * @property isLoading - If true, a loading spinner will be displayed and the button will be disabled.
	 */
	isLoading?: boolean;
	/**
	 * @property disabled - If true, the button will be disabled.
	 */
	disabled?: boolean;
	/**
	 * @property children - The content to be rendered inside the button, typically text or an icon. Defaults to "Submit".
	 */
	children?: React.ReactNode;
	/**
	 * @property onClick - Callback function invoked when the button is clicked.
	 */
	onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
	/**
	 * @property type - The type of the button (e.g., "submit", "button", "reset"). Defaults to "submit".
	 */
	type?: "submit" | "button" | "reset";
	/**
	 * @property className - Additional CSS classes to apply to the button.
	 */
	className?: string;
	[key: string]: any;
}

const SubmitButton = ({
	isLoading = false,
	disabled = false,
	children = "Submit",
	onClick,
	type = "submit",
	className,
	...props
}: SubmitButtonProps) => {
	return (
		<Button
			type={type}
			disabled={disabled || isLoading}
			onClick={onClick}
			className={cn("cursor-pointer", className)}
			{...props}
		>
			{isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
			{children}
		</Button>
	);
};

export default memo(SubmitButton);
