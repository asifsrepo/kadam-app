"use client";

import { Check, Palette } from "lucide-react";
import { useEffect, useState } from "react";
import useSettings from "@/hooks/useSettings";

interface ColorSchemeSettingsProps {
	initialColorScheme?: string;
}

const getThemeVariants = (parentTheme: string, colorSchemes: Record<string, any>) => {
	return Object.entries(colorSchemes)
		.filter(([, scheme]) => scheme.parentTheme === parentTheme)
		.map(([key, scheme]) => ({ key, ...scheme }));
};

const getMainThemes = (colorSchemes: Record<string, any>) => {
	return Object.entries(colorSchemes)
		.filter(([, scheme]) => !scheme.parentTheme)
		.map(([key]) => key);
};

const ColorSchemeSettings = ({ initialColorScheme = "default" }: ColorSchemeSettingsProps) => {
	const { selectedColorScheme, handleColorSchemeChange, colorSchemes } = useSettings({
		initialColorScheme,
	});

	const [mounted, setMounted] = useState(false);

	useEffect(() => {
		setMounted(true);
	}, []);

	const renderColorScheme = (colorSchemeName: string) => {
		const active = selectedColorScheme === colorSchemeName;
		const scheme = colorSchemes[colorSchemeName];
		const variants = getThemeVariants(colorSchemeName, colorSchemes);
		const hasVariants = variants.length > 0;

		return (
			<div key={colorSchemeName} className="flex flex-col gap-2">
				<button
					className={`relative flex flex-col gap-3 rounded-xl border-2 p-4 text-left transition-all ${
						active
							? "border-primary bg-primary/5 shadow-sm"
							: "border-border bg-card hover:border-primary/30 hover:bg-accent/50"
					}`}
					onClick={() => handleColorSchemeChange(colorSchemeName)}
				>
					{active && mounted && (
						<div className="absolute top-3 right-3 flex h-6 w-6 items-center justify-center rounded-full bg-primary">
							<Check className="h-4 w-4 text-primary-foreground" />
						</div>
					)}

					<div className="flex items-center gap-3">
						<div className="grid grid-cols-4 gap-1.5">
							<div
								className="h-10 w-10 rounded-lg shadow-sm ring-1 ring-black/5"
								style={{ backgroundColor: scheme.preview.background }}
							/>
							<div
								className="h-10 w-10 rounded-lg shadow-sm ring-1 ring-black/5"
								style={{ backgroundColor: scheme.preview.foreground }}
							/>
							<div
								className="h-10 w-10 rounded-lg shadow-sm ring-1 ring-black/5"
								style={{ backgroundColor: scheme.preview.primary }}
							/>
							<div
								className="h-10 w-10 rounded-lg shadow-sm ring-1 ring-black/5"
								style={{ backgroundColor: scheme.preview.secondary }}
							/>
						</div>
					</div>

					<div className="flex items-center justify-between">
						<div>
							<h3 className="font-semibold text-base text-foreground">
								{scheme.name}
							</h3>
							{active && mounted && (
								<p className="mt-0.5 text-primary text-xs">Currently active</p>
							)}
						</div>
					</div>
				</button>

				{hasVariants && mounted && (
					<div className="ml-4 flex flex-col gap-2 border-border/30 border-l pl-4">
						{variants.map((variant) => {
							const variantActive = selectedColorScheme === variant.key;

							return (
								<button
									key={variant.key}
									className={`flex items-center justify-between gap-3 rounded-lg border p-3 text-left transition-all ${
										variantActive
											? "border-primary bg-primary/5"
											: "border-border bg-card hover:border-primary/30 hover:bg-accent/50"
									}`}
									onClick={(e) => {
										e.stopPropagation();
										handleColorSchemeChange(variant.key);
									}}
								>
									<div className="flex min-w-0 flex-1 items-center gap-2.5">
										<div className="flex gap-1">
											<div
												className="h-6 w-6 rounded-md shadow-sm ring-1 ring-black/5"
												style={{ backgroundColor: variant.preview.primary }}
											/>
											<div
												className="h-6 w-6 rounded-md shadow-sm ring-1 ring-black/5"
												style={{
													backgroundColor: variant.preview.secondary,
												}}
											/>
										</div>
										<span className="truncate font-medium text-sm">
											{variant.name}
										</span>
									</div>
									{variantActive && (
										<div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary">
											<Check className="h-3 w-3 text-primary-foreground" />
										</div>
									)}
								</button>
							);
						})}
					</div>
				)}
			</div>
		);
	};

	const mainThemes = getMainThemes(colorSchemes);

	return (
		<div className="flex flex-col gap-3 rounded-lg border border-border bg-card p-4">
			<div className="flex items-center gap-2">
				<div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
					<Palette className="h-4 w-4 text-primary" />
				</div>
				<div className="flex-1">
					<h2 className="font-semibold text-base">Color Theme</h2>
					<p className="text-muted-foreground text-xs">Choose your preferred colors</p>
				</div>
			</div>

			<div className="flex flex-col gap-3">
				{mainThemes.map((schemeName) => renderColorScheme(schemeName))}
			</div>
		</div>
	);
};

export default ColorSchemeSettings;
