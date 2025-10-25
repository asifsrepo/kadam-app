"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useAuth } from "@/hooks/store/useAuth";
import { createClient } from "@/lib/supabase/client";

const AuthCallbackClient = () => {
	const supabase = createClient();
	const { initialize } = useAuth();
	const router = useRouter();

	useEffect(() => {
		const handleAuthCallback = async () => {
			const { data, error } = await supabase.auth.getSession();

			if (error) {
				return;
			}

			if (data.session) {
				await initialize();

				setTimeout(() => {
					router.push("/");
				}, 1400);
			}
		};

		handleAuthCallback();
	}, [supabase, initialize, router]);

	return null;
};

export default AuthCallbackClient;
