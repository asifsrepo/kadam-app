import { useEffect } from "react";
import { create } from "zustand";
import { BASE_URL } from "@/config";
import { isCancellingAtPeriodEnd, isSubscriptionActive } from "@/lib/utils/subscriptions";
import type { ISubscription } from "@/types/subscription";

interface SubscriptionState {
	subscription: ISubscription | null;
	isLoading: boolean;
	error: Error | null;
	isInitialized: boolean;

	fetchSubscription: (force?: boolean) => Promise<void>;
	refetch: () => Promise<void>;
}

const initialState: Omit<SubscriptionState, "fetchSubscription" | "refetch"> = {
	subscription: null,
	isLoading: false,
	error: null,
	isInitialized: false,
};

const useSubscriptionStore = create<SubscriptionState>()((set, get) => ({
	...initialState,

	fetchSubscription: async (force = false) => {
		if (get().isInitialized && !force) {
			return;
		}

		set({ isLoading: true, error: null });

		try {
			const url = `${BASE_URL}/api/subscriptions`;
			const response = await fetch(url);

			if (!response.ok) {
				set({
					subscription: null,
					isInitialized: true,
					error: new Error(`Failed to fetch subscription: ${response.statusText}`),
				});
				return;
			}

			const data = await response.json();
			set({
				subscription: data || null,
				isInitialized: true,
				error: null,
			});
		} catch (error) {
			set({
				subscription: null,
				isInitialized: true,
				error: error instanceof Error ? error : new Error("Failed to fetch subscription"),
			});
		} finally {
			set({ isLoading: false });
		}
	},

	refetch: async () => {
		await get().fetchSubscription(true);
	},
}));

export const useSubscription = () => {
	const store = useSubscriptionStore();

	useEffect(() => {
		store.fetchSubscription();
	}, [store.fetchSubscription]);

	const subscriptionData = store.subscription || null;

	return {
		subscription: subscriptionData,
		isLoading: store.isLoading,
		error: store.error,
		isActive: isSubscriptionActive(subscriptionData),
		isCancellingAtPeriodEnd: isCancellingAtPeriodEnd(subscriptionData),
		refetch: store.refetch,
	};
};
