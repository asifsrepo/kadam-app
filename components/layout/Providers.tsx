import { Analytics } from "@vercel/analytics/next";
import { ThemeProvider } from "next-themes";
import { NuqsAdapter } from "nuqs/adapters/next/app";
import { WrapperProps } from "@/types";
import QueryProvider from "../providers/QueryProvider";
import { Toaster } from "../ui/sonner";

const Providers = ({ children }: WrapperProps) => {
	return (
		<ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
			<QueryProvider>
				<Toaster richColors position="top-right" closeButton />
				<NuqsAdapter>{children}</NuqsAdapter>
				<Analytics
					debug={false}
				/>
			</QueryProvider>
		</ThemeProvider>
	);
};

export default Providers;
