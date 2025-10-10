import { useEffect } from "react";
import { toast } from "sonner";
import { create } from "zustand";
import { createClient } from "@/lib/supabase/client";

interface IUser {
	id: string;
	email: string;
	name: string;
	avatar: string;
}

interface AuthState {
	user: IUser | null;
	isLoading: boolean;
	isInitialized: boolean;
	initialize: () => Promise<void>;
	loadUser: () => Promise<void>;
	signOut: (redirect?: boolean) => Promise<void>;
}

const initialState = {
	user: null,
	isLoading: false,
	isInitialized: false,
};

const mapSupabaseUserToIUser = (sbUser: any): IUser => ({
	id: sbUser.id,
	email: sbUser.email,
	name: sbUser.user_metadata?.name || "",
	avatar: sbUser.user_metadata?.avatar_url || "",
});

export const useAuthStore = create<AuthState>()((set, get) => ({
	...initialState,

	initialize: async () => {
		const { isInitialized } = get();
		if (isInitialized) return;

		set({ isLoading: true });
		try {
			const supabase = createClient();
			const {
				data: { session },
				error,
			} = await supabase.auth.getSession();
			if (error) throw error;

			if (!session?.user) return;

			set({
				user: mapSupabaseUserToIUser(session.user),
				isInitialized: true,
			});
		} catch (error) {
			console.error("Error initializing auth:", error);
			set({ user: null, isInitialized: true });
		} finally {
			set({ isLoading: false });
		}
	},

	loadUser: async () => {
		set({ isLoading: true });
		try {
			const supabase = createClient();
			const {
				data: { user },
				error,
			} = await supabase.auth.getUser();
			if (error) throw error;

			set({ user: user ? mapSupabaseUserToIUser(user) : null });
		} catch (error) {
			console.error("Error loading user:", error);
			set({ user: null });
		} finally {
			set({ isLoading: false });
		}
	},

	signOut: async (redirect = true) => {
		try {
			const supabase = createClient();
			const { error } = await supabase.auth.signOut();
			if (error) throw error;

			set({ user: null, isInitialized: false });
			toast.success("Signed out successfully", {
				description: redirect ? "Redirecting..." : undefined,
			});

			if (redirect) {
				setTimeout(() => {
					window.location.href = "/signin";
				}, 100);
			}
		} catch (error) {
			console.error("Error signing out:", error);
			toast.error("Error signing out");
		}
	},
}));

/**
 * Hook that automatically initializes auth on mount
 * Use this in components that need auth
 */
export const useAuth = () => {
	const authStore = useAuthStore();

	useEffect(() => {
		authStore.initialize();
	}, [authStore.initialize]);

	return authStore;
};
