import "@/styles/globals.css";
import { Metadata } from "next";
import DashboardLayout from "@/components/DashboardLayout";
import Providers from "@/components/layout/Providers";
import { fontMap, getAllFontVariables } from "@/lib/fonts";
import { getSelectedColorScheme, getSelectedFont } from "@/lib/server/settings-helpers";
import { WrapperProps } from "@/types";

export const metadata: Metadata = {
	title: "Theme Kit",
	description: "Theme Kit is a tool for creating and managing themes for your website.",
};

const RootLayout = async ({ children }: WrapperProps) => {
	const selectedFont = await getSelectedFont();
	const selectedColorScheme = await getSelectedColorScheme();
	const selectedFontConfig = fontMap[selectedFont];
	const allFontVariables = getAllFontVariables();

	return (
		<html
			lang="en"
			suppressHydrationWarning
			className={`${allFontVariables} ${selectedColorScheme}`}
		>
			<body className={`antialiased ${selectedFontConfig.className}`}>
				<Providers>
					<DashboardLayout>{children}</DashboardLayout>
				</Providers>
			</body>
		</html>
	);
};

export default RootLayout;
