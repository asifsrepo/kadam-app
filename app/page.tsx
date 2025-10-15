"use client";

import Link from "next/link";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/store/useAuth";

const page = () => {
	const { user } = useAuth();
	const { theme, setTheme } = useTheme();
	return (
		<div className="flex min-h-screen items-center justify-center">
			<div className="space-y-4 text-center">
				<h1 className="font-bold text-2xl">Welcome</h1>
				<div className="flex items-center gap-2">
					{user ? (
						<Link href={"/dashboard"}>
							<Button>Dashboard</Button>
						</Link>
					) : (
						<Link href={"/auth"}>
							<Button>Sign In</Button>
						</Link>
					)}
					<Button onClick={() => setTheme(theme === "dark" ? "light" : "dark")}>
						Theme Button
					</Button>
				</div>
			</div>
		</div>
	);
};

export default page;
