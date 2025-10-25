"use client";

import { Check, Laptop, Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

const ThemeModeSettings = () => {
	const { theme, setTheme } = useTheme();
	const [mounted, setMounted] = useState(false);

	useEffect(() => {
		setMounted(true);
	}, []);

	const themes = [
		{
			value: "light",
			label: "Light",
			description: "Light mode",
			icon: Sun,
		},
		{
			value: "dark",
			label: "Dark",
			description: "Dark mode",
			icon: Moon,
		},
		{
			value: "system",
			label: "System",
			description: "Follow system",
			icon: Laptop,
		},
	];

	if (!mounted) {
		return (
			<div className="flex flex-col gap-3 rounded-lg border border-border bg-card p-4">
				<div className="flex items-center gap-2">
					<div className="h-8 w-8 animate-pulse rounded-lg bg-muted" />
					<div className="flex-1">
						<div className="mb-1 h-4 w-24 animate-pulse rounded bg-muted" />
						<div className="h-3 w-32 animate-pulse rounded bg-muted" />
					</div>
				</div>
				<div className="grid grid-cols-3 gap-2">
					<div className="h-20 animate-pulse rounded-lg bg-muted" />
					<div className="h-20 animate-pulse rounded-lg bg-muted" />
					<div className="h-20 animate-pulse rounded-lg bg-muted" />
				</div>
			</div>
		);
	}

	return (
		<div className="flex flex-col gap-3 rounded-lg border border-border bg-card p-4">
			<div className="flex items-center gap-2">
				<div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
					<Moon className="h-4 w-4 text-primary" />
				</div>
				<div className="flex-1">
					<h2 className="font-semibold text-base">Theme Mode</h2>
					<p className="text-muted-foreground text-xs">Choose light, dark, or system</p>
				</div>
			</div>

			<div className="grid grid-cols-3 gap-2">
				{themes.map((themeOption) => {
					const Icon = themeOption.icon;
					const isActive = theme === themeOption.value;

					return (
						<button
							key={themeOption.value}
							onClick={() => setTheme(themeOption.value)}
							className={`relative flex flex-col items-center gap-2 rounded-lg border-2 p-3 transition-all ${
								isActive
									? "border-primary bg-primary/5 shadow-sm"
									: "border-border bg-card hover:border-primary/30 hover:bg-accent/50"
							}`}
						>
							{isActive && (
								<div className="absolute top-1.5 right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-primary">
									<Check className="h-2.5 w-2.5 text-primary-foreground" />
								</div>
							)}

							<div
								className={`flex h-10 w-10 items-center justify-center rounded-full transition-colors ${
									isActive
										? "bg-primary text-primary-foreground"
										: "bg-muted text-muted-foreground"
								}`}
							>
								<Icon className="h-5 w-5" />
							</div>

							<div className="text-center">
								<p
									className={`font-medium text-xs ${
										isActive ? "text-foreground" : "text-muted-foreground"
									}`}
								>
									{themeOption.label}
								</p>
							</div>
						</button>
					);
				})}
			</div>
		</div>
	);
};

export default ThemeModeSettings;
