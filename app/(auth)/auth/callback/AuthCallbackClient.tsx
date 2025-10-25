"use client";

import { useEffect } from "react";
import { toast } from "sonner";
import { useAuth } from "@/hooks/store/useAuth";
import { createClient } from "@/lib/supabase/client";

const AuthCallbackClient = () => {
	const supabase = createClient();
	const { initialize } = useAuth();

	useEffect(() => {
		const handleAuthCallback = async () => {
			toast.promise(async () => {
				const { data, error } = await supabase.auth.getSession();

				if (error) {
					throw new Error(error.message);
				}

				if (data.session) {
					await initialize();

					setTimeout(() => {
						window.location.href = "/";
					}, 1400);
				} else {
					throw new Error("No session found. Please try signing in again.");
				}
			}, {
				loading: "Verifying your authentication...",
				success: "Authentication verified successfully!",
				error: "Failed to verify authentication. Please try again.",
			});	

		};

		handleAuthCallback();
	}, [supabase, initialize]);

	return null;
};

export default AuthCallbackClient;
