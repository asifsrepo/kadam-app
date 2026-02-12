export interface ColorScheme {
	name: string;
	preview: {
		background: string;
		foreground: string;
		primary: string;
		secondary: string;
		accent: string;
	};
	defaultFont?: string;
	parentTheme?: string;
}

export const colorSchemes: Record<string, ColorScheme> = {
	ocean: {
		name: "Hysabee Ocean",
		preview: {
			background: "oklch(0.98 0.01 210)",
			foreground: "oklch(0.17 0.02 235)",
			primary: "oklch(0.62 0.12 200)",
			secondary: "oklch(0.94 0.02 210)",
			accent: "oklch(0.93 0.03 200)",
		},
		defaultFont: "Inter",
	},
	slate: {
		name: "Hysabee Slate",
		preview: {
			background: "oklch(0.99 0 0)",
			foreground: "oklch(0.18 0.01 250)",
			primary: "oklch(0.55 0.05 230)",
			secondary: "oklch(0.95 0.01 240)",
			accent: "oklch(0.93 0.02 240)",
		},
		defaultFont: "Inter",
	},
};

export const colorSchemeOptions = Object.keys(colorSchemes) as Array<keyof typeof colorSchemes>;

// Helper function to group themes
export const getGroupedColorSchemes = () => {
	const mainThemes = Object.entries(colorSchemes);
	return {
		mainThemes,
	};
};
