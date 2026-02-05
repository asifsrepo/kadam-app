"use client";

import { Check, Palette } from "lucide-react";
import { useEffect, useState } from "react";
import useSettings from "@/hooks/useSettings";

interface ColorSchemeSettingsProps {
	initialColorScheme?: string;
}

const ColorSchemeSettings = ({ initialColorScheme = "ocean" }: ColorSchemeSettingsProps) => {
	const { selectedColorScheme, handleColorSchemeChange, colorSchemes } = useSettings({
		initialColorScheme,
	});

	const [mounted, setMounted] = useState(false);

	useEffect(() => {
		setMounted(true);
	}, []);

	const themeEntries = Object.entries(colorSchemes);

	return (
		<div className="flex flex-col gap-3 rounded-2xl border border-border/60 bg-card p-4">
			<div className="flex items-center gap-3">
				<div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10">
					<Palette className="h-4 w-4 text-primary" />
				</div>
				<div className="flex-1">
					<h2 className="font-semibold text-base">Color Theme</h2>
					<p className="text-muted-foreground text-xs">
						Choose a curated theme for a calm, mobile‑native look
					</p>
				</div>
			</div>

			<div className="grid gap-3 sm:grid-cols-2">
				{themeEntries.map(([schemeKey, scheme]) => {
					const active = selectedColorScheme === schemeKey;

					return (
						<button
							key={schemeKey}
							className={`relative flex flex-col gap-3 rounded-2xl border p-4 text-left transition-all ${
								active
									? "border-primary bg-primary/5 shadow-sm"
									: "border-border/60 bg-card hover:border-primary/30 hover:bg-accent/50"
							}`}
							onClick={() => handleColorSchemeChange(schemeKey)}
						>
							{active && mounted && (
								<div className="absolute top-3 right-3 flex h-6 w-6 items-center justify-center rounded-full bg-primary">
									<Check className="h-4 w-4 text-primary-foreground" />
								</div>
							)}

							<div className="flex items-center gap-2">
								<div className="grid grid-cols-4 gap-1.5">
									<div
										className="h-8 w-8 rounded-xl shadow-sm ring-1 ring-border/60"
										style={{ backgroundColor: scheme.preview.background }}
									/>
									<div
										className="h-8 w-8 rounded-xl shadow-sm ring-1 ring-border/60"
										style={{ backgroundColor: scheme.preview.foreground }}
									/>
									<div
										className="h-8 w-8 rounded-xl shadow-sm ring-1 ring-border/60"
										style={{ backgroundColor: scheme.preview.primary }}
									/>
									<div
										className="h-8 w-8 rounded-xl shadow-sm ring-1 ring-border/60"
										style={{ backgroundColor: scheme.preview.secondary }}
									/>
								</div>
							</div>

							<div>
								<h3 className="font-semibold text-base text-foreground">
									{scheme.name}
								</h3>
								{active && mounted && (
									<p className="mt-0.5 text-primary text-xs">Active theme</p>
								)}
							</div>
						</button>
					);
				})}
			</div>
		</div>
	);
};

export default ColorSchemeSettings;
