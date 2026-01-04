"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/store/useAuth";

const NotFound = () => {
	const { user } = useAuth();
	return (
		<div className="flex min-h-[calc(100svh-(--spacing(16)))] flex-col items-center justify-center gap-4 px-4 py-8 text-center md:px-6">
			<div className="space-y-2">
				<h1 className="font-bold text-4xl tracking-tighter sm:text-5xl">
					404 - Page Not Found
				</h1>			
				<p className="text-muted-foreground md:text-xl">
					{"The page you are looking for does not exist or has been moved."}
				</p>
			</div>
			{user ? (
				<Link href="/" passHref>
					<Button>Go to Dashboard</Button>
				</Link>
			) : (
				<Link href="/signin" passHref>
					<Button>signin </Button>
				</Link>
			)}
		</div>
	);
};

export default NotFound;
