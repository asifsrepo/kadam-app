import { useEffect } from "react";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { createClient } from "@/lib/supabase/client";
import { Tables } from "@/types";
import type { IBranch, IStore } from "@/types/store";
import { useAuth } from "./useAuth";

interface StoresState {
	store: IStore | null;
	isLoading: boolean;
	activeBranch: IBranch | null;
	debtLimit: number;
	branches: IBranch[];
	isInitialized: boolean;

	loadStores: (userId: string, force?: boolean) => Promise<IBranch | null>;
	setActiveBranch: (branch: IBranch | null) => void;
	setBranches: (branches: IBranch[]) => void;
}

const initialState: Omit<StoresState, "loadStores" | "setActiveBranch" | "setBranches"> = {
	store: null,
	branches: [],
	isLoading: false,
	activeBranch: null,
	debtLimit: 0,
	isInitialized: false,
};

const useStoresStore = create<StoresState>()(
	persist(
		(set, get) => ({
			...initialState,

			loadStores: async (userId, force = false) => {
				set({ isLoading: true });
				if (get().isInitialized && !force) {
					set({ isLoading: false });
					return null;
				}

				try {
					if (!userId) return null;

					const supabase = createClient();
					const { data: store, error: storeError } = await supabase
						.from(Tables.Stores)
						.select("*")
						.eq("ownerId", userId)
						.limit(1);

					if (storeError) throw storeError;
					const storeData: IStore | null = store?.[0] ?? null;

					const { data: branches, error: branchesError } = await supabase
						.from(Tables.Branches)
						.select("*")
						.eq("ownerId", userId)
						.eq("storeId", storeData?.id ?? "")
						.order("isMain", { ascending: false });

					if (branchesError) throw branchesError;

					set({
						store: storeData,
						isInitialized: true,
						branches: branches ?? [],
					});

					let newActiveBranch: IBranch | null = null;
					if (!get().activeBranch) {
						newActiveBranch =
							branches?.find((branch) => branch.isMain) || branches?.[0] || null;
					} else {
						const currentId = get().activeBranch?.id;
						newActiveBranch =
							branches?.find((el) => el.id === currentId) ||
							branches?.find((el) => el.isMain) ||
							branches?.[0] ||
							null;
					}

					set({
						activeBranch: newActiveBranch,
						debtLimit: newActiveBranch?.debtLimit ?? 0,
					});

					return newActiveBranch;
				} catch (_) {
					set({ store: null, isInitialized: false });
					return null;
				} finally {
					set({ isLoading: false });
				}
			},

			setActiveBranch: (branch) => {
				set({
					activeBranch: branch,
					debtLimit: branch?.debtLimit ?? 0,
				});
			},

			setBranches: (branches) => {
				set({ branches });
			},
		}),
		{
			name: "stores-storage",
			partialize: (state) => ({
				activeBranch: state.activeBranch,
			}),
		},
	),
);

// Only expose what you need...
const useStores = () => {
	const store = useStoresStore();
	const { user } = useAuth();

	// Derived loading state to prevent flash of content before initialization
	const isLoading = store.isLoading || (!store.isInitialized && !!user?.id);

	// biome-ignore lint/correctness/useExhaustiveDependencies: to avoid maximum call stack exceeding
	useEffect(() => {
		if (user?.id) store.loadStores(user.id);
	}, [user?.id]);

	return { ...store, isLoading };
};

export default useStores;
