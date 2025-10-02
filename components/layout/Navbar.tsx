"use client";

import { LogOut, Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/store/useAuth";

const Navbar = () => {
	const { theme, setTheme } = useTheme();
	const { user, signOut, initialize } = useAuth();
	const [mounted, setMounted] = useState(false);

	useEffect(() => {
		initialize();
	}, [initialize]);

	useEffect(() => {
		setMounted(true);
	}, []);

	const toggleTheme = () => {
		setTheme(theme === "dark" ? "light" : "dark");
	};

	return (
		<nav className="sticky top-0 z-50 border-border/40 border-b bg-background/80 backdrop-blur-md">
			<div className="container mx-auto px-4 sm:px-6 lg:px-8">
				<div className="flex h-16 items-center justify-between">
					{/* Left side - App name */}
					<div className="flex items-center">
						<h1 className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text font-bold text-transparent text-xl sm:text-2xl">
							Your App Name
						</h1>
					</div>

					{/* Right side - Actions */}
					<div className="flex items-center gap-2">
						{/* Logout button - only show if user is logged in */}
						{user && (
							<Button
								variant="ghost"
								size="sm"
								onClick={() => signOut()}
								className="flex items-center gap-2 text-muted-foreground hover:text-foreground"
							>
								<LogOut className="h-4 w-4" />
								<span className="hidden sm:inline">Sign Out</span>
							</Button>
						)}

						{/* Theme toggle */}
						{mounted && (
							<Button
								variant="ghost"
								size="icon"
								onClick={toggleTheme}
								className="relative h-10 w-10 rounded-full transition-all duration-300 hover:scale-110 hover:bg-accent"
								aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
							>
								<Sun
									className={`h-5 w-5 transition-all duration-500 ${
										theme === "dark"
											? "rotate-90 scale-0 opacity-0"
											: "rotate-0 scale-100 opacity-100"
									}`}
								/>
								<Moon
									className={`absolute h-5 w-5 transition-all duration-500 ${
										theme === "dark"
											? "rotate-0 scale-100 opacity-100"
											: "-rotate-90 scale-0 opacity-0"
									}`}
								/>
							</Button>
						)}
					</div>
				</div>
			</div>
		</nav>
	);
};

export default Navbar;
