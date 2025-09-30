"use client";

import { BookOpen, Check, Search } from "lucide-react";
import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import useSettings from "@/hooks/useSettings";

interface FontSettingsProps {
	initialFont?: string;
}

const FontSettings = ({ initialFont = "Inter" }: FontSettingsProps) => {
	const { selectedFont, handleFontChange, fontOptions, fontConfig } = useSettings({
		initialFont,
	});
	const [searchQuery, setSearchQuery] = useState("");

	const filteredFonts = useMemo(() => {
		return fontOptions.filter((font) => {
			const matchesSearch =
				font.toLowerCase().includes(searchQuery.toLowerCase()) ||
				fontConfig[font]?.description.toLowerCase().includes(searchQuery.toLowerCase());
			return matchesSearch;
		});
	}, [fontOptions, searchQuery, fontConfig]);

	return (
		<Card className="border-0 bg-gradient-to-br from-card to-card/50 shadow-sm">
			<CardHeader className="pb-4">
				<CardTitle className="flex items-center gap-3 font-semibold text-xl">
					<div>
						<div>Typography</div>
						<p className="mt-1 font-normal text-muted-foreground text-sm">
							Choose from {fontOptions.length} available fonts
						</p>
					</div>
				</CardTitle>
			</CardHeader>
			<CardContent className="space-y-6">
				<div className="relative">
					<Search className="-translate-y-1/2 absolute top-1/2 left-3 h-4 w-4 transform text-muted-foreground" />
					<Input
						placeholder="Search fonts..."
						value={searchQuery}
						onChange={(e) => setSearchQuery(e.target.value)}
						className="pl-10"
					/>
				</div>

				<div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
					{filteredFonts.map((font) => {
						const active = selectedFont === font;
						const config = fontConfig[font];

						return (
							<div
								key={font}
								className={`group relative cursor-pointer rounded-xl border-2 p-4 transition-all duration-200 hover:shadow-md ${
									active
										? "border-primary bg-gradient-to-br from-primary/10 to-primary/5 shadow-md shadow-primary/20"
										: "border-border hover:border-primary/50 hover:bg-accent/50"
								}
                				`}
								onClick={() => handleFontChange(font)}
								onKeyDown={(e) => {
									if (e.key === "Enter") {
										handleFontChange(font);
									}
								}}
							>
								<div className="space-y-3">
									<div className="flex items-center justify-between">
										<div className="flex items-center gap-3">
											<div
												className={`font-semibold text-lg ${config.fontClass} text-foreground`}
											>
												{font}
											</div>
										</div>
										{active && (
											<div className="flex items-center gap-1.5 rounded-full bg-primary/20 px-2 py-1">
												<Check className="h-3 w-3 text-primary" />
												<span className="font-medium text-primary text-xs">
													Active
												</span>
											</div>
										)}
									</div>

									<p className="text-muted-foreground text-xs">
										{config.description}
									</p>
								</div>
							</div>
						);
					})}
				</div>

				{filteredFonts.length === 0 && (
					<div className="py-8 text-center text-muted-foreground">
						<BookOpen className="mx-auto mb-3 h-12 w-12 opacity-50" />
						<p className="text-sm">No fonts found matching your search</p>
						<Button
							variant="outline"
							size="sm"
							onClick={() => setSearchQuery("")}
							className="mt-3"
						>
							Clear search
						</Button>
					</div>
				)}
			</CardContent>
		</Card>
	);
};

export default FontSettings;
