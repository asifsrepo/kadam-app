"use client";

import { Check, Type } from "lucide-react";
import useSettings from "@/hooks/useSettings";

interface FontSettingsProps {
	initialFont?: string;
}

const FontSettings = ({ initialFont = "Inter" }: FontSettingsProps) => {
	const { selectedFont, handleFontChange, fontOptions, fontConfig } = useSettings({
		initialFont,
	});

	return (
		<div className="flex flex-col gap-3 rounded-2xl border border-border/60 bg-card p-4">
			<div className="flex items-center gap-3">
				<div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10">
					<Type className="h-4 w-4 text-primary" />
				</div>
				<div className="flex-1">
					<h2 className="font-semibold text-base">Typography</h2>
					<p className="text-muted-foreground text-xs">
						Choose from a curated set of mobile‑friendly fonts
					</p>
				</div>
			</div>

			<div className="flex flex-col gap-2">
				{fontOptions.map((font) => {
					const config = fontConfig[font];
					const active = selectedFont === font;

					return (
						<button
							key={font}
							className={`flex items-start gap-3 rounded-2xl border p-3 text-left transition-all ${
								active
									? "border-primary bg-primary/5"
									: "border-border/60 bg-card hover:bg-accent/60"
							}`}
							onClick={() => handleFontChange(font)}
						>
							<div className="min-w-0 flex-1">
								<div className={`font-medium text-base ${config.fontClass}`}>
									{font}
								</div>
								<p className="text-muted-foreground text-xs">{config.description}</p>
							</div>
							{active && (
								<div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary">
									<Check className="h-4 w-4 text-primary-foreground" />
								</div>
							)}
						</button>
					);
				})}
			</div>
		</div>
	);
};

export default FontSettings;
