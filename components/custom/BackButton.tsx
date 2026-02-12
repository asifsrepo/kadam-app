"use client";

import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "../ui/button";

interface BackButtonProps {
	className?: string;
}

const BackButton = ({ className = "" }: BackButtonProps) => {
	const router = useRouter();

	return (
		<Button
			variant="ghost"
			size="icon"
			onClick={() => router.back()}
			className={cn("h-10 w-10", className)}
		>
			<ArrowLeft className="h-4 w-4" />
			<span className="sr-only">Go back</span>
		</Button>
	);
};

export default BackButton;
