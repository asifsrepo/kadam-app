"use client";

import { Check, ChevronDown, Type } from "lucide-react";
import { useState } from "react";
import useSettings from "@/hooks/useSettings";

interface FontSettingsProps {
	initialFont?: string;
}

const FontSettings = ({ initialFont = "Inter" }: FontSettingsProps) => {
	const { selectedFont, handleFontChange, fontOptions, fontConfig } = useSettings({
		initialFont,
	});
	const [isExpanded, setIsExpanded] = useState(false);

	const selectedFontConfig = fontConfig[selectedFont];

	return (
		<div className="flex flex-col gap-3 rounded-lg border border-border bg-card p-4">
			<div className="flex items-center gap-2">
				<div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
					<Type className="h-4 w-4 text-primary" />
				</div>
				<div className="flex-1">
					<h2 className="font-semibold text-base">Typography</h2>
					<p className="text-muted-foreground text-xs">
						Choose your preferred font
					</p>
				</div>
			</div>

			<button
				className="flex w-full items-center gap-3 rounded-lg border border-border bg-background p-3 text-left transition-colors hover:bg-accent"
				onClick={() => setIsExpanded(!isExpanded)}
			>
				<div className="min-w-0 flex-1">
					<div className={`font-medium text-base ${selectedFontConfig?.fontClass}`}>
						{selectedFont}
					</div>
					<p className="truncate text-muted-foreground text-xs">
						{selectedFontConfig?.description}
					</p>
				</div>
				<ChevronDown
					className={`h-5 w-5 shrink-0 text-muted-foreground transition-transform ${
						isExpanded ? "rotate-180" : ""
					}`}
				/>
			</button>

			{isExpanded && (
				<div className="flex flex-col gap-2">
					{fontOptions.map((font) => {
						const config = fontConfig[font];
						const active = selectedFont === font;

						return (
							<button
								key={font}
								className={`flex items-start gap-3 rounded-lg border p-3 text-left transition-all ${
									active
										? "border-primary bg-primary/5"
										: "border-border bg-card hover:bg-accent"
								}`}
								onClick={() => {
									handleFontChange(font);
									setIsExpanded(false);
								}}
							>
								<div className="min-w-0 flex-1">
									<div className={`font-medium text-base ${config.fontClass}`}>
										{font}
									</div>
									<p className="text-muted-foreground text-xs">
										{config.description}
									</p>
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
			)}
		</div>
	);
};

export default FontSettings;