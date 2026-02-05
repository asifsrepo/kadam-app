import { useCallback, useState } from "react";
import { toast } from "sonner";
import { COLOR_SCHEME_COOKIE_NAME, FONT_COOKIE_NAME } from "@/config";
import { colorSchemeOptions, colorSchemes } from "@/lib/color-schemes";
import { fontConfig, fontOptions } from "@/lib/fonts";
import { setCookie } from "@/lib/utils";

interface UseSettingsProps {
	initialFont?: string;
	initialColorScheme?: string;
}

const useSettings = ({
	initialFont = "Inter",
	initialColorScheme = "ocean",
}: UseSettingsProps = {}) => {
	const [selectedFont, setSelectedFont] = useState<string>(initialFont);
	const [selectedColorScheme, setSelectedColorScheme] = useState<string>(initialColorScheme);

	const applyFontToBody = useCallback((fontName: string) => {
		if (typeof document !== "undefined") {
			const config = fontConfig[fontName];
			if (config) {
				// Remove all existing font classes
				Object.values(fontConfig).forEach(({ fontClass }) => {
					document.body.classList.remove(...fontClass.split(" "));
				});

				// Apply new font class
				document.body.classList.add(...config.fontClass.split(" "));
			}
		}
	}, []);

	const handleFontChange = useCallback(
		(fontName: string) => {
			setSelectedFont(fontName);
			setCookie(FONT_COOKIE_NAME, fontName, 365);

			applyFontToBody(fontName);

			toast.success(`Font changed to "${fontName}" successfully!`);
		},
		[applyFontToBody],
	);

	const handleColorSchemeChange = useCallback(
		(colorSchemeName: string) => {
			setSelectedColorScheme(colorSchemeName);
			setCookie(COLOR_SCHEME_COOKIE_NAME, colorSchemeName, 365);

			if (typeof document !== "undefined") {
				const html = document.documentElement;

				Object.keys(colorSchemes).forEach((scheme) => {
					html.classList.remove(scheme);
				});

				html.classList.add(colorSchemeName);

				const colorScheme = colorSchemes[colorSchemeName];
				if (colorScheme?.defaultFont) {
					setSelectedFont(colorScheme.defaultFont);
					setCookie(FONT_COOKIE_NAME, colorScheme.defaultFont, 365);
					applyFontToBody(colorScheme.defaultFont);

					toast.success(
						`Color scheme changed to "${colorScheme.name}" with font "${colorScheme.defaultFont}"!`,
					);
				} else {
					toast.success(`Color scheme changed to "${colorScheme.name}"!`);
				}
			}
		},
		[applyFontToBody],
	);

	return {
		// Font
		selectedFont,
		setSelectedFont,
		handleFontChange,
		fontOptions,
		fontConfig,

		// Color scheme
		selectedColorScheme,
		setSelectedColorScheme,
		handleColorSchemeChange,
		colorSchemes,
		colorSchemeOptions,
	};
};

export default useSettings;
