import ColorSchemeSettings from "@/components/appearance/ColorSchemeSettings";
import FontSettings from "@/components/appearance/FontSettings";
import ThemeModeSettings from "@/components/appearance/ThemeModeSettings";
import { getSelectedColorScheme, getSelectedFont } from "@/lib/server/settings-helpers";
import BackButton from "~/BackButton";

const ThemingPage = async () => {
	const selectedFont = await getSelectedFont();
	const selectedColorScheme = await getSelectedColorScheme();

	return (
		<div className="min-h-screen bg-background pb-24">
			<div className="sticky top-0 z-10 border-border border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
				<div className="px-3 py-3 md:px-6 md:py-4">
					<div className="flex items-center gap-3">
						<BackButton />
						<div>
							<h1 className="font-semibold text-lg md:text-2xl">Appearance</h1>
							<p className="text-muted-foreground text-xs md:text-sm">
								Customize your app's look and feel
							</p>
						</div>
					</div>
				</div>
			</div>

			<div className="flex flex-col gap-4 p-3 md:p-6">
				<ThemeModeSettings />
				<FontSettings initialFont={selectedFont} />
				<ColorSchemeSettings initialColorScheme={selectedColorScheme} />
			</div>
		</div>
	);
};

export default ThemingPage;