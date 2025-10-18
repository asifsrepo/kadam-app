"use client";

import { UserPlus } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "./ui/button";

const FloatingMenu = () => {
	const router = useRouter();

	return (
		<Button
			size="lg"
			className="fixed right-6 bottom-20 z-50 rounded-full shadow-lg"
			onClick={() => {
				router.push("/customers/new");
			}}
		>
			<UserPlus className="h-8 w-8" />
			<span className="sr-only">Create Customer</span>
		</Button>
	);
};

export default FloatingMenu;
