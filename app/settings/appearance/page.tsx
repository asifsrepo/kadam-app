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
			<div className="sticky top-0 z-10 border-border/60 border-b bg-background/90 backdrop-blur">
				<div className="px-4 py-4 md:px-6">
					<div className="flex items-center gap-3">
						<BackButton />
						<div>
							<p className="text-muted-foreground text-xs">Customize</p>
							<h1 className="font-semibold text-lg md:text-2xl">Appearance</h1>
						</div>
					</div>
				</div>
			</div>

			<div className="flex flex-col gap-4 px-4 py-5 md:px-6">
				<ThemeModeSettings />
				<FontSettings initialFont={selectedFont} />
				<ColorSchemeSettings initialColorScheme={selectedColorScheme} />
			</div>
		</div>
	);
};

export default ThemingPage;
