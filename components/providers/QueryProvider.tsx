"use client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { type ReactNode, useState } from "react";

const QueryProvider = ({ children }: { children: ReactNode }) => {
	const [queryClient] = useState(
		() =>
			new QueryClient({
				defaultOptions: {
					queries: {
						staleTime: 60 * 1000 * 60, // 60 minutes
						refetchInterval: false, // false
						refetchOnWindowFocus: false,
						retry: 0,
						refetchOnMount: false,
						refetchOnReconnect: false,
						enabled: true,
						gcTime: 5 * 1000 * 60, // 5 minutes
					},
				},
			}),
	);

	return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
};

export default QueryProvider;
