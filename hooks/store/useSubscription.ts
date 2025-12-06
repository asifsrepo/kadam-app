import { useEffect } from "react";
import { create } from "zustand";
import { BASE_URL } from "@/config";
import { isSubscriptionActive } from "@/lib/utils/subscriptions";
import type { ISubscription } from "@/types/subscription";

interface SubscriptionState {
	subscription: ISubscription | null;
	isLoading: boolean;
	isInitialized: boolean;

	initialize: () => Promise<void>;
	loadSubscription: () => Promise<void>;
	refreshSubscription: () => Promise<void>;
}

const initialState = {
	subscription: null,
	isLoading: false,
	isInitialized: false,
};

const getUserSubscription = async () => {
	try {
		const url = `${BASE_URL}/api/subscriptions`;
		const response = await fetch(url);

		if (!response.ok) {
			if (response.status === 404) {
				return { data: null, error: null, success: true };
			}
			throw new Error(`HTTP error! status: ${response.status}`);
		}

		const data = await response.json();
		return { data, error: null, success: true };
	} catch (error) {
		console.error("Error getting user subscription:", error);
		return { data: null, error: error instanceof Error ? error.message : "Unknown error", success: false };
	}
};

export const useSubscriptionStore = create<SubscriptionState>()((set, get) => ({
	...initialState,

	initialize: async () => {
		const { isInitialized } = get();
		if (isInitialized) return;

		set({ isLoading: true });
		try {
			const result = await getUserSubscription();
			if (result.error) throw new Error(result.error);

			set({
				subscription: result.data || null,
				isInitialized: true,
			});
		} catch (error) {
			console.error("Error initializing subscription:", error);
			set({ subscription: null, isInitialized: true });
		} finally {
			set({ isLoading: false });
		}
	},

	loadSubscription: async () => {
		set({ isLoading: true });
		try {
			const result = await getUserSubscription();
			if (result.error) throw new Error(result.error);

			set({ subscription: result.data || null });
		} catch (error) {
			console.error("Error loading subscription:", error);
			set({ subscription: null });
		} finally {
			set({ isLoading: false });
		}
	},

	refreshSubscription: async () => {
		await get().loadSubscription();
	},
}));

/**
 * Hook that automatically initializes subscription on mount
 * Use this in components that need subscription data
 */
export const useSubscription = () => {
	const subscriptionStore = useSubscriptionStore();

	useEffect(() => {
		subscriptionStore.initialize();
	}, [subscriptionStore.initialize]);

	return {
		...subscriptionStore,
		isActive: isSubscriptionActive(subscriptionStore.subscription),
	};
};

