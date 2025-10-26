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
	default: {
		name: "Default",
		preview: {
			background: "oklch(1 0 0)",
			foreground: "oklch(0.141 0.005 285.823)",
			primary: "oklch(0.21 0.006 285.885)",
			secondary: "oklch(0.967 0.001 286.375)",
			accent: "oklch(0.967 0.001 286.375)",
		},
		defaultFont: "Fira Code",
	},
	"default-red": {
		name: "Red",
		preview: {
			background: "oklch(1 0 0)",
			foreground: "oklch(0.141 0.005 285.823)",
			primary: "oklch(0.637 0.237 25.331)",
			secondary: "oklch(0.967 0.001 286.375)",
			accent: "oklch(0.945 0.020 17.38)",
		},
		defaultFont: "Fira Code",
		parentTheme: "default",
	},
	"default-pink": {
		name: "Pink",
		preview: {
			background: "oklch(1 0 0)",
			foreground: "oklch(0.141 0.005 285.823)",
			primary: "oklch(0.65 0.25 328)",
			secondary: "oklch(0.967 0.001 286.375)",
			accent: "oklch(0.92 0.045 328)",
		},
		defaultFont: "Fira Code",
		parentTheme: "default",
	},
	"default-rose": {
		name: "Rose",
		preview: {
			background: "oklch(1 0 0)",
			foreground: "oklch(0.141 0.005 285.823)",
			primary: "oklch(0.63 0.22 350)",
			secondary: "oklch(0.967 0.001 286.375)",
			accent: "oklch(0.93 0.04 350)",
		},
		defaultFont: "Fira Code",
		parentTheme: "default",
	},
	"default-orange": {
		name: "Orange",
		preview: {
			background: "oklch(1 0 0)",
			foreground: "oklch(0.141 0.005 285.823)",
			primary: "oklch(0.68 0.23 60)",
			secondary: "oklch(0.967 0.001 286.375)",
			accent: "oklch(0.94 0.05 60)",
		},
		defaultFont: "Fira Code",
		parentTheme: "default",
	},
	"default-green": {
		name: "Green",
		preview: {
			background: "oklch(1 0 0)",
			foreground: "oklch(0.141 0.005 285.823)",
			primary: "oklch(0.55 0.18 140)",
			secondary: "oklch(0.967 0.001 286.375)",
			accent: "oklch(0.92 0.04 140)",
		},
		defaultFont: "Fira Code",
		parentTheme: "default",
	},
	"default-blue": {
		name: "Blue",
		preview: {
			background: "oklch(1 0 0)",
			foreground: "oklch(0.141 0.005 285.823)",
			primary: "oklch(0.55 0.20 240)",
			secondary: "oklch(0.967 0.001 286.375)",
			accent: "oklch(0.92 0.04 240)",
		},
		defaultFont: "Fira Code",
		parentTheme: "default",
	},
	"default-yellow": {
		name: "Yellow",
		preview: {
			background: "oklch(1 0 0)",
			foreground: "oklch(0.141 0.005 285.823)",
			primary: "oklch(0.75 0.15 90)",
			secondary: "oklch(0.967 0.001 286.375)",
			accent: "oklch(0.95 0.03 90)",
		},
		defaultFont: "Fira Code",
		parentTheme: "default",
	},
	"default-violet": {
		name: "Violet",
		preview: {
			background: "oklch(1 0 0)",
			foreground: "oklch(0.141 0.005 285.823)",
			primary: "oklch(0.58 0.22 280)",
			secondary: "oklch(0.967 0.001 286.375)",
			accent: "oklch(0.92 0.05 280)",
		},
		defaultFont: "Fira Code",
		parentTheme: "default",
	},
	honeybee: {
		name: "Honeybee",
		preview: {
			background: "oklch(0.9884 0.0156 91.5418)",
			foreground: "oklch(0.2775 0.0221 66.7042)",
			primary: "oklch(0.8281 0.1689 84.9225)",
			secondary: "oklch(0.8326 0.1125 74.5039)",
			accent: "oklch(0.9336 0.0407 84.5781)",
		},
		defaultFont: "Nunito Sans",
	},
	"mocha-mouse": {
		name: "Mocha Mouse",
		preview: {
			background: "oklch(0.9529 0.0146 102.4597)",
			foreground: "oklch(0.4063 0.0255 40.3627)",
			primary: "oklch(0.6083 0.0623 44.3588)",
			secondary: "oklch(0.7473 0.0387 80.5476)",
			accent: "oklch(0.8502 0.0389 49.0874)",
		},
		defaultFont: "DM Sans",
	},
	"vintage-paper": {
		name: "Vintage Paper",
		preview: {
			background: "oklch(0.9582 0.0152 90.2357)",
			foreground: "oklch(0.3760 0.0225 64.3434)",
			primary: "oklch(0.6180 0.0778 65.5444)",
			secondary: "oklch(0.8846 0.0302 85.5655)",
			accent: "oklch(0.8348 0.0426 88.8064)",
		},
		defaultFont: "Libre Baskerville",
	},
	notepad: {
		name: "NotePad",
		preview: {
			background: "oklch(0.9821 0 0)",
			foreground: "oklch(0.3485 0 0)",
			primary: "oklch(0.4891 0 0)",
			secondary: "oklch(0.9006 0 0)",
			accent: "oklch(0.9354 0.0456 94.8549)",
		},
		defaultFont: "Architects Daughter",
	},
	supabase: {
		name: "Supabase",
		preview: {
			background: "oklch(0.9911 0 0)",
			foreground: "oklch(0.2046 0 0)",
			primary: "oklch(0.8348 0.1302 160.9080)",
			secondary: "oklch(0.9940 0 0)",
			accent: "oklch(0.9461 0 0)",
		},
		defaultFont: "Outfit",
	},
};

export const colorSchemeOptions = Object.keys(colorSchemes) as Array<keyof typeof colorSchemes>;

// Helper function to group themes
export const getGroupedColorSchemes = () => {
	const defaultVariants = Object.entries(colorSchemes).filter(([key]) =>
		key.startsWith("default"),
	);
	const otherThemes = Object.entries(colorSchemes).filter(([key]) => !key.startsWith("default"));

	return {
		defaultVariants,
		otherThemes,
	};
};
