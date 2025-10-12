import { create } from "zustand";
import { persist } from "zustand/middleware";
import { createClient } from "@/lib/supabase/client";
import { Tables } from "@/types";
import type { IBranch, IStoreWithBranches } from "@/types/store";

interface StoresState {
    stores: IStoreWithBranches | null;
    isLoading: boolean;
    activeBranch: IBranch | null;

    loadStores: (userId: string, force?: boolean) => Promise<IStoreWithBranches | null>;
    setActiveBranch: (branch: IBranch | null) => void;
}

const initialState = {
    stores: null,
    isLoading: false,
    activeBranch: null,
};

const useStore = create<StoresState>()(
    persist(
        (set, get) => ({
            ...initialState,

            loadStores: async (userId, force = false) => {
                set({ isLoading: true });
                if (!force && get().stores) return get().stores;

                try {
                    if (!userId) return null;

                    const supabase = createClient();
                    const { data: store, error: storeError } = await supabase
                        .from(Tables.Stores)
                        .select("*")
                        .eq("ownerId", userId)
                        .limit(1);

                    if (storeError) throw storeError;

                    const { data: branches, error: branchesError } = await supabase
                        .from(Tables.Branches)
                        .select("*")
                        .eq("ownerId", userId)
                        .eq("storeId", store?.[0]?.id)
                        .order("isMain", { ascending: false });

                    if (branchesError) throw branchesError;

                    const storeWithBranches = { ...(store?.[0] || {}), branches: branches || [] };
                    set({ stores: storeWithBranches });

                    // Auto-set main branch as active ONLY if no active branch exists
                    const currentActiveBranch = get().activeBranch;
                    if (!currentActiveBranch && branches && branches.length > 0) {
                        const mainBranch = branches.find(branch => branch.isMain) || branches[0];
                        set({ activeBranch: mainBranch });
                    }

                    return storeWithBranches;
                } catch (error) {
                    console.error("Error loading stores:", error);
                    set({ stores: null });
                    return null;
                } finally {
                    set({ isLoading: false });
                }
            },

            setActiveBranch: (branch) => {
                set({ activeBranch: branch });
            },
        }),
        {
            name: "stores-storage",
            partialize: (state) => ({ activeBranch: state.activeBranch }),
        }
    )
);

export default useStore;