"use client";

import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "../ui/button";

interface BackButtonProps {

	className?: string;
	onClick?: () => void;
}

const BackButton = ({ className = "", onClick }: BackButtonProps) => {
	const router = useRouter();

	return (
		<Button
			variant="ghost"
			size="icon"
			onClick={() => router.back()}
			className={cn("h-8 w-8 md:h-9 md:w-9", className)}
		>
			<ArrowLeft className="h-4 w-4 md:h-5 md:w-5" />
			<span className="sr-only">Go back</span>
		</Button>
	);
};

export default BackButton;