import type { NextFontWithVariable } from "next/dist/compiled/@next/font";
import { DM_Sans, Inter, Manrope, Space_Grotesk } from "next/font/google";

const inter = Inter({
	subsets: ["latin"],
	display: "swap",
	variable: "--font-inter",
});

const dmSans = DM_Sans({
	subsets: ["latin"],
	display: "swap",
	variable: "--font-dm-sans",
});

const manrope = Manrope({
	subsets: ["latin"],
	display: "swap",
	variable: "--font-manrope",
});

const spaceGrotesk = Space_Grotesk({
	subsets: ["latin"],
	display: "swap",
	variable: "--font-space-grotesk",
});

export const fontMap: Record<string, NextFontWithVariable> = {
	Inter: inter,
	"DM Sans": dmSans,
	Manrope: manrope,
	"Space Grotesk": spaceGrotesk,
};

export const fontOptions = Object.keys(fontMap) as Array<keyof typeof fontMap>;

export const fontConfig: Record<
	string,
	{
		description: string;
		fontClass: string;
		category: string;
	}
> = {
	Inter: {
		description: "Modern sans-serif designed for UI",
		fontClass: inter.className,
		category: "Sans-serif",
	},
	"DM Sans": {
		description: "Friendly sans-serif with soft curves",
		fontClass: dmSans.className,
		category: "Sans-serif",
	},
	Manrope: {
		description: "Geometric sans-serif with clear rhythm",
		fontClass: manrope.className,
		category: "Sans-serif",
	},
	"Space Grotesk": {
		description: "Distinctive geometric sans-serif",
		fontClass: spaceGrotesk.className,
		category: "Sans-serif",
	},
};

// Helper to get all font variables as a string
export const getAllFontVariables = () =>
	Object.values(fontMap)
		.map((font) => font.variable)
		.join(" ");
