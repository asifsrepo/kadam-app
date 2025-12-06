import { useQuery } from "@tanstack/react-query";
import { BASE_URL } from "@/config";
import { isSubscriptionActive } from "@/lib/utils/subscriptions";
import { QueryKeys } from "@/types";

export const useSubscription = () => {
	const {
		data: subscription,
		isLoading,
		error,
		refetch,
	} = useQuery({
		queryKey: [QueryKeys.UserSubscription],
		queryFn: async () => {
			const url = `${BASE_URL}/api/subscriptions`;
			const response = await fetch(url);

			if (!response.ok) {
				return null;
			}

			const data = await response.json();
			return data || null;
		},
	});

	return {
		subscription: subscription || null,
		isLoading,
		error,
		isActive: isSubscriptionActive(subscription || null),
		refetch,
	};
};
