import "@/styles/globals.css";
import Providers from "@/components/layout/Providers";
import { fontMap, getAllFontVariables } from "@/lib/fonts";
import { getSelectedColorScheme, getSelectedFont } from "@/lib/server/settings-helpers";
import { WrapperProps } from "@/types";

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
					{children}
				</Providers>
			</body>
		</html>
	);
};

export default RootLayout;
