import { useEffect } from "react";
import { create } from "zustand";
import getUserSubscription from "@/app/(server)/actions/subscriptions/getUserSubscription";
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

export const useSubscriptionStore = create<SubscriptionState>()((set, get) => ({
	...initialState,

	initialize: async () => {
		const { isInitialized } = get();
		if (isInitialized) return;

		set({ isLoading: true });
		try {
			const { data, error } = await getUserSubscription();
			if (error) throw new Error(error);

			set({
				subscription: data || null,
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
			const { data, error } = await getUserSubscription();
			if (error) throw new Error(error);

			set({ subscription: data || null });
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

