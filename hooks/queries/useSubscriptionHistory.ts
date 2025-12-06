import { useQuery } from "@tanstack/react-query";
import { BASE_URL } from "@/config";
import { QueryKeys } from "@/types";

export const useSubscriptionHistory = (enabled: boolean = true) => {
	const {
		data: subscriptionHistory = [],
		isLoading,
		error,
		refetch,
	} = useQuery({
		queryKey: [QueryKeys.SubscriptionHistory],
		queryFn: async () => {
			const url = `${BASE_URL}/api/subscriptions/history`;
			const response = await fetch(url);

			if (!response.ok) {
				return [];
			}

			const data = await response.json();
			return data || [];
		},
		retry: 1,
		enabled,
	});

	return {
		subscriptionHistory,
		isLoading,
		error,
		refetch,
	};
};
