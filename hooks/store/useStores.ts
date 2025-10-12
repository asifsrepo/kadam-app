import { create } from "zustand";
import { persist } from "zustand/middleware";
import { createClient } from "@/lib/supabase/client";
import { Tables } from "@/types";
import type { IBranch, IStore } from "@/types/store";

interface StoresState {
    store: IStore | null;
    isLoading: boolean;
    activeBranch: IBranch | null;
    debtLimit: number;
    branches: IBranch[];

    loadStores: (userId: string, force?: boolean) => Promise<IBranch | null>;
    setActiveBranch: (branch: IBranch | null) => void;
    setBranches: (branches: IBranch[]) => void;
}

const initialState = {
    store: null,
    branches: [],
    isLoading: false,
    activeBranch: null,
    debtLimit: 0,
};

const useStores = create<StoresState>()(
    persist(
        (set, get) => ({
            ...initialState,

            loadStores: async (userId, force = false) => {
                set({ isLoading: true });
                if (!force && get().store) return get().store;

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

                    set({ store: store?.[0], branches: branches || [], debtLimit: branches?.[0]?.debtLimit || 0 });

                    // Auto-set main branch as active ONLY if no active branch exists
                    const currentActiveBranch = get().activeBranch;
                    if (!currentActiveBranch && branches && branches.length > 0) {
                        const mainBranch = branches.find(branch => branch.isMain) || branches[0];
                        set({ activeBranch: mainBranch, debtLimit: mainBranch?.debtLimit || 0 });
                    }

                    console.log(branches);
                    
                    return branches?.[0];

                } catch (error) {
                    console.error("Error loading stores:", error);
                    set({ store: null });
                    return null;
                } finally {
                    set({ isLoading: false });
                }
            },

            setActiveBranch: (branch) => {
                set({ activeBranch: branch, debtLimit: branch?.debtLimit || 0 });
            },

            setBranches: (branches) => {
                set({ branches });
            },
        }),
        {
            name: "stores-storage",
            partialize: (state) => ({ activeBranch: state.activeBranch }),
        }
    )
);

export default useStores;