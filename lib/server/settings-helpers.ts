import { cookies } from "next/headers";
import { COLOR_SCHEME_COOKIE_NAME, DEFAULT_COLOR_SCHEME, FONT_COOKIE_NAME } from "@/config";
import { colorSchemeOptions } from "../color-schemes";

export const getSelectedFont = async (): Promise<string> => {
	const cookieStore = await cookies();
	const fontCookie = cookieStore.get(FONT_COOKIE_NAME);
	return (fontCookie?.value as string) || "Inter";
};

export const getSelectedColorScheme = async (): Promise<string> => {
	const cookieStore = await cookies();
	const colorSchemeCookie = cookieStore.get(COLOR_SCHEME_COOKIE_NAME);
	const selectedColorScheme = colorSchemeCookie?.value as string;

	// Validate that the color scheme exists in our options
	if (selectedColorScheme && colorSchemeOptions.includes(selectedColorScheme as any)) {
		return selectedColorScheme;
	}

	return DEFAULT_COLOR_SCHEME ?? "ocean";
};
