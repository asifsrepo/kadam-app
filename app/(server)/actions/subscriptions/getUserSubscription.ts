"use server";

import { createClient } from "@/lib/supabase/server";
import { tryCatch } from "@/lib/utils";
import { Tables } from "@/types";
import type { ISubscription } from "@/types/subscription";

const getUserSubscription = async () => {
	return await tryCatch<ISubscription | null>(async () => {
		const supabase = await createClient();
		const {
			data: { user },
		} = await supabase.auth.getUser();
		if (!user) throw new Error("User not found");

		const { data, error } = await supabase
			.from(Tables.Subscriptions)
			.select("*")
			.eq("userId", user.id)
			.order("createdAt", { ascending: false })
			.limit(1)
			.single();

		if (error) {
			// If no subscription found, return null instead of error
			if (error.code === "PGRST116") {
				return null;
			}
			throw error;
		}

		return data as ISubscription;
	});
};

export default getUserSubscription;

