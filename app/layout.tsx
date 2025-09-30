import "@/styles/globals.css";
import Navbar from "@/components/layout/Navbar";
import ThemeProvider from "@/components/providers/ThemeProvider";
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
				<ThemeProvider
					attribute="class"
					defaultTheme="dark"
					enableSystem
					disableTransitionOnChange
				>
					<Navbar />
					{children}
				</ThemeProvider>
			</body>
		</html>
	);
};

export default RootLayout;
