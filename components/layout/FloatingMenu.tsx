"use client";

import { UserPlus } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { Button } from "../ui/button";

const FloatingMenu = () => {
	const router = useRouter();
	const pathname = usePathname();

	if (!(pathname === "/" || pathname === "/customers")) {
		return null;
	}

	return (
		<Button
			size="lg"
			className="fixed right-5 bottom-[calc(80px+env(safe-area-inset-bottom))] z-50 h-12 w-12 rounded-full shadow-lg"
			onClick={() => {
				router.push("/customers/new");
			}}
		>
			<UserPlus className="h-6 w-6" />
			<span className="sr-only">Create Customer</span>
		</Button>
	);
};

export default FloatingMenu;
